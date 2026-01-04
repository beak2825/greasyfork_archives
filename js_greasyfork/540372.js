// ==UserScript==
// @name         Twitter自動返信200回（親ポスト限定・ホーム遷移防止・ボタン制御・多バリエーション）韓国構文
// @namespace    @sitenorengo
// @version      1.5
// @description  Xの親ツイートに200回自動返信し、ホーム遷移を防止。ボタンで開始/停止を制御。200回完了後スクリプト停止。
// @author       ガルシア
// @match        *://x.com/*
// @grant        none
// @compatible   vivaldi
// @compatible   chrome
// @compatible   firefox
// @compatible   edge
// @icon         https://abs.twimg.com/responsive-web/client-web/icon-ios.b1fc727a.png
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540372/Twitter%E8%87%AA%E5%8B%95%E8%BF%94%E4%BF%A1200%E5%9B%9E%EF%BC%88%E8%A6%AA%E3%83%9D%E3%82%B9%E3%83%88%E9%99%90%E5%AE%9A%E3%83%BB%E3%83%9B%E3%83%BC%E3%83%A0%E9%81%B7%E7%A7%BB%E9%98%B2%E6%AD%A2%E3%83%BB%E3%83%9C%E3%82%BF%E3%83%B3%E5%88%B6%E5%BE%A1%E3%83%BB%E5%A4%9A%E3%83%90%E3%83%AA%E3%82%A8%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3%EF%BC%89%E9%9F%93%E5%9B%BD%E6%A7%8B%E6%96%87.user.js
// @updateURL https://update.greasyfork.org/scripts/540372/Twitter%E8%87%AA%E5%8B%95%E8%BF%94%E4%BF%A1200%E5%9B%9E%EF%BC%88%E8%A6%AA%E3%83%9D%E3%82%B9%E3%83%88%E9%99%90%E5%AE%9A%E3%83%BB%E3%83%9B%E3%83%BC%E3%83%A0%E9%81%B7%E7%A7%BB%E9%98%B2%E6%AD%A2%E3%83%BB%E3%83%9C%E3%82%BF%E3%83%B3%E5%88%B6%E5%BE%A1%E3%83%BB%E5%A4%9A%E3%83%90%E3%83%AA%E3%82%A8%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3%EF%BC%89%E9%9F%93%E5%9B%BD%E6%A7%8B%E6%96%87.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 処理中のフラグ
    let isProcessing = false;
    // スクリプトの実行を管理するフラグ
    let isScriptActive = false; // 初期状態は停止
    // インターバルのIDを保持
    let intervalId = null;

    // 返信文章のバリエーション（10種類）
    const replyVariations = [
        '일본은 한국의 아빠입니다. 딸은 아빠에게 반항해서는 안 됩니다😊',
        '한국은 일본의 식민지입니다. 일본은 한국의 아버지입니다😊',
        '식민지 한국은 주국에 거역해서는 안 됩니다. 일본은 영원히 한국의 아버지다ㅋㅋㅋ',
        '식민지 한국은 종주국 일본을 따라',
        '아빠가 다시 인체 실험을 할까?',
        ];

    // ボタンを作成してページに追加
    function createControlButtons() {
        const buttonContainer = document.createElement('div');
        buttonContainer.style.position = 'fixed';
        buttonContainer.style.top = '10px';
        buttonContainer.style.right = '10px';
        buttonContainer.style.zIndex = '9999';
        buttonContainer.style.display = 'flex';
        buttonContainer.style.gap = '10px';

        // 開始ボタン
        const startButton = document.createElement('button');
        startButton.textContent = '自動返信開始';
        startButton.style.padding = '10px';
        startButton.style.backgroundColor = '#1DA1F2';
        startButton.style.color = 'white';
        startButton.style.border = 'none';
        startButton.style.borderRadius = '5px';
        startButton.style.cursor = 'pointer';

        // 停止ボタン
        const stopButton = document.createElement('button');
        stopButton.textContent = '自動返信停止';
        stopButton.style.padding = '10px';
        stopButton.style.backgroundColor = '#FF0000';
        stopButton.style.color = 'white';
        stopButton.style.border = 'none';
        stopButton.style.borderRadius = '5px';
        stopButton.style.cursor = 'pointer';

        // ボタンクリックイベント
        startButton.addEventListener('click', () => {
            if (!isScriptActive) {
                isScriptActive = true;
                startScript();
                console.log('スクリプトを開始しました');
            }
        });

        stopButton.addEventListener('click', () => {
            if (isScriptActive) {
                isScriptActive = false;
                stopScript();
                console.log('スクリプトを停止しました');
            }
        });

        buttonContainer.appendChild(startButton);
        buttonContainer.appendChild(stopButton);
        document.body.appendChild(buttonContainer);
    }

    // ホーム遷移を防止するイベントリスナー（タイムラインへのアクセスもブロック）
    function blockHomeNavigation(event) {
        if (isProcessing && event.target.href && event.target.href.includes('x.com/home')) {
            event.preventDefault();
            event.stopPropagation();
            console.log('タイムライン(x.com/home)へのアクセスをブロックしました');
        }
    }

    // ナビゲーションイベントを監視
    document.addEventListener('click', blockHomeNavigation, true);

    // === 追加: タイムライン(x.com/home)へのページ読み込みを防止 ===
    if (window.location.href.includes('x.com/home') && isScriptActive) {
        console.log('タイムライン(x.com/home)の読み込みをブロックしました');
        window.history.back(); // 直前のページに戻す
    }

    // === 追加: popstateイベントでタイムラインへの遷移を防止 ===
    window.addEventListener('popstate', function(event) {
        if (isScriptActive && window.location.href.includes('x.com/home')) {
            console.log('popstate経由でのタイムライン(x.com/home)への遷移をブロックしました');
            window.history.back();
        }
    });

    // 1～200のランダムな数字の配列を生成（重複なし）
    function getRandomNumbers() {
        let numbers = Array.from({ length: 200 }, (_, i) => i + 1);
        for (let i = numbers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [numbers[i], numbers[j]] = [numbers[j], numbers[i]]; // シャッフル
        }
        return numbers;
    }

    // ランダムな返信文章を選択
    function getRandomReply() {
        const randomIndex = Math.floor(Math.random() * replyVariations.length);
        return replyVariations[randomIndex];
    }

    // 送信ボタンがクリック可能かチェック
    function isSendButtonClickable(button) {
        return button && !button.disabled && button.offsetParent !== null;
    }

    // クリックイベントを強制発火
    function forceClick(element) {
        const clickEvent = new Event('click', { bubbles: true, cancelable: true });
        element.dispatchEvent(clickEvent);
    }

    // スクリプトを開始する関数
    function startScript() {
        if (intervalId) return; // すでに実行中の場合はスキップ
        intervalId = window.setInterval(function() {
            // スクリプトが停止済み、または処理中の場合はスキップ
            if (!isScriptActive || isProcessing) return;

            // タイムライン(x.com/home)にいる場合は処理をスキップ
            if (window.location.href.includes('x.com/home')) {
                console.log('タイムライン(x.com/home)での処理をスキップ');
                return;
            }

            // タイムライン上のツイートの返信ボタンを取得
            let replyButtons = document.querySelectorAll('[data-testid="reply"]');

            // 親ツイート（返信でないツイート）のみを対象にする
            for (let button of replyButtons) {
                // ツイート要素を取得
                let tweetElement = button.closest('article');
                if (!tweetElement) {
                    console.log('記事要素が見つかりません');
                    continue;
                }

                // 返信ツイートかどうかをチェック（親ツイートは返信マークがない）
                let isReplyTweet = tweetElement.querySelector('[data-testid="icon-caret-down"]');
                if (isReplyTweet) continue; // 返信ツイートならスキップ

                // 処理済みでないか確認
                if (!button.dataset.replied) {
                    isProcessing = true;

                    // 現在のページのURLを保存
                    const currentUrl = window.location.href;

                    // ツイートまでスクロール
                    window.scrollTo({
                        top: button.getBoundingClientRect().top + window.pageYOffset - 100,
                        left: 0,
                        behavior: 'instant'
                    });

                    // ランダムな数字のリストを生成
                    let randomNumbers = getRandomNumbers();
                    let replyCount = 0;

                    function sendReply() {
                        if (replyCount >= 200 || !isScriptActive) {
                            // 200回完了またはスクリプト停止
                            button.dataset.replied = 'true';
                            isProcessing = false;
                            isScriptActive = false; // スクリプト停止
                            clearInterval(intervalId); // インターバル停止
                            intervalId = null;
                            document.removeEventListener('click', blockHomeNavigation, true); // リスナー解除
                            console.log('200回返信完了、スクリプト停止');
                            return;
                        }

                        // 返信ボタンをクリック
                        forceClick(button);

                        // 返信入力欄が表示されるのを待つ
                        setTimeout(function() {
                            let replyInput = document.querySelector('[data-testid="tweetTextarea_0"]');
                            let sendButton = document.querySelector('[data-testid="tweetButton"], [data-testid="tweetButtonInline"]');

                            if (replyInput && sendButton) {
                                // ランダムな文章と数字を付加して返信
                                let replyText = `${getRandomReply()} ${randomNumbers[replyCount]}`;
                                replyInput.focus();
                                document.execCommand('insertText', false, replyText);

                                // 送信ボタンがクリック可能になるまで待つ
                                let clickAttempts = 0;
                                const maxClickAttempts = 5;

                                function attemptClick() {
                                    if (isSendButtonClickable(sendButton)) {
                                        forceClick(sendButton);
                                        console.log(`返信${replyCount + 1}: ${replyText} を送信`);

                                        // ページ遷移をチェックし、必要なら元のページに戻す
                                        setTimeout(function() {
                                            if (window.location.href !== currentUrl) {
                                                window.history.pushState({}, '', currentUrl);
                                                console.log('ページ遷移を防止、元のURLに戻しました');
                                            }
                                            replyCount++;
                                            sendReply(); // 次の返信へ
                                        }, 500);
                                    } else {
                                        clickAttempts++;
                                        if (clickAttempts < maxClickAttempts) {
                                            console.log(`送信ボタン非活性、試行${clickAttempts}/${maxClickAttempts}`);
                                            setTimeout(attemptClick, 500);
                                        } else {
                                            console.error('送信ボタンがクリック不可、処理を中断');
                                            isProcessing = false;
                                        }
                                    }
                                }

                                attemptClick();
                            } else {
                                console.error('入力欄または送信ボタンが見つかりません');
                                // 入力欄が見つからない場合、リトライ
                                setTimeout(sendReply, 500);
                            }
                        }, 500);
                    }

                    // 初回の返信を開始
                    sendReply();
                    return; // 1つのポストを処理したらループを抜ける
                }
            }

            // 処理中フラグをリセット
            isProcessing = false;
        }, 7000); // 7秒ごとにチェック
    }

    // スクリプトを停止する関数
    function stopScript() {
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
        }
        isProcessing = false;
        isScriptActive = false;
        document.removeEventListener('click', blockHomeNavigation, true); // リスナー解除
    }

    // ページ読み込み時にボタンを追加
    window.addEventListener('load', createControlButtons);
})();