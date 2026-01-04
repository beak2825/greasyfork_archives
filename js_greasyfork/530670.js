// ==UserScript==
// @name         TVer プレイヤー機能拡張
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  TVerビデオプレイヤーにクリックで再生/一時停止、マウスホイールで音量調整機能を追加し、URL変更を処理。ライブページはスキップ。セレクタを外部化し、イベントリスナー管理を改善。コメントを強化しメンテナンス性を向上。
// @author       You, Previous Author, AI Assistant
// @match        https://tver.jp/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530670/TVer%20%E3%83%97%E3%83%AC%E3%82%A4%E3%83%A4%E3%83%BC%E6%A9%9F%E8%83%BD%E6%8B%A1%E5%BC%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/530670/TVer%20%E3%83%97%E3%83%AC%E3%82%A4%E3%83%A4%E3%83%BC%E6%A9%9F%E8%83%BD%E6%8B%A1%E5%BC%B5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 定数定義 ---
    const DEBUG = false; // trueにすると、コンソールにデバッグメッセージが出力されます。
    const DEBUG_PREFIX = '[TVerPlayerExtV1.1]'; // デバッグメッセージの接頭辞
    const VOLUME_STEP = 0.01; // マウスホイール1スクロールあたりの音量変更量
    const OPACITY_TIMEOUT_DURATION = 2000; // 音量調整後にコントローラーが自動で非表示になるまでの時間 (ミリ秒)

    // --- セレクタ定義 ---
    // このオブジェクトに、スクリプトがDOM要素を取得するために使用するCSSセレクタをまとめて定義します。
    // TVerのウェブサイト側のHTML構造やクラス名は変更される可能性があるため、
    // スクリプトが期待通りに動作しなくなった場合は、まずこの部分のセレクタが
    // 現在のTVerのHTMLに対応しているかを確認・修正する必要があります。
    // クラス名に含まれる "__" 以降のランダムな文字列に対応するため、
    // [class^="..."] (前方一致) や [class*="..."] (部分一致) を使用しています。
    const SELECTORS = {
        // MutationObserverがDOM全体の変更を監視するためのルート要素のID
        appRoot: '#__next',
        // ビデオコントローラー全体を囲むコンテナ要素。イベントリスナーの主なターゲット。
        controlsContainer: '[class^="controller_container__"]',
        // 再生/一時停止を実行するためのボタン要素
        playPauseButton: 'button[class*="toggle-playing-button_controlButton__"]',
        // 音量調整UI（スライダーなどを含む）の親要素。
        // マウスホイールイベントがこの要素（またはその子孫要素）上で発生したかを判定するために使用します。
        volumeHost: '[class^="volume_host__"]',
        // 音量調整用スライダーの <input type="range"> 要素
        volumeSliderInput: 'input[type="range"][class^="volume-slider_input__"]',
        // コントローラーコンテナ内でクリックされても、再生/一時停止機能を発火させたくないUI要素群。
        // (例: 設定ボタン、シークバー、音量スライダー自体など、各要素の固有の機能を優先させるため)
        clickableUiElements: '[class^="button_button"], [class^="menu_menu"], [class^="volume-slider_container__"], [class^="SeekBar_container__"]',
    };

    // --- グローバル変数 ---
    // 音量調整後など、コントローラーを一時的に表示した際に、
    // 一定時間後に非表示にするためのタイマーのIDを保持します。
    let opacityTimeoutId = null;

    // ビデオプレイヤー要素（具体的にはコントローラーコンテナ）がDOMに動的に追加されるのを
    // 監視するためのMutationObserverのインスタンスを保持します。
    let playerObserver = null;

    /**
     * デバッグメッセージをコンソールに出力します。
     * DEBUG定数がtrueの場合のみ出力されます。
     * @param {string} message 出力するメッセージ文字列
     */
    function log(message) {
        if (DEBUG) {
            console.log(`${DEBUG_PREFIX} ${message}`);
        }
    }

    /**
     * ビデオコントローラーの不透明度を設定し、表示・非表示を制御します。
     * @param {string} opacity 設定するopacityの値。'1'で表示、''でインラインスタイルを削除しTVerのデフォルトCSSに戻す（通常は非表示になる）。
     */
    function setControllerOpacity(opacity) {
        const controllerContainer = document.querySelector(SELECTORS.controlsContainer);
        if (controllerContainer) {
            controllerContainer.style.opacity = opacity;
            log(`Controller opacity set to: ${opacity === '' ? '(cleared/default)' : opacity}`);
        } else {
            // コントローラーが見つからない場合（表示しようとした時以外はログを抑制することも検討）
            if (opacity === '1') { // 表示しようとしたのにコンテナがない場合のみエラーログ
                 log('Error: Controller container not found when trying to set opacity to 1.');
            }
        }
    }

    /**
     * マウスホイールイベントを処理し、ビデオの音量を調整します。
     * イベントが音量調整UI (volumeHost) の上で発生した場合にのみ動作します。
     * 音量調整後、ビデオコントローラーを一時的に表示します。
     * @param {WheelEvent} event マウスホイールイベントオブジェクト
     */
    function handleWheel(event) {
        // マウスホイールイベントの発生源が音量調整UI (volumeHost) またはその子孫要素であるかを確認
        const volumeHost = event.target.closest(SELECTORS.volumeHost);

        if (volumeHost) {
            // ブラウザのデフォルトのホイール動作（ページのスクロールなど）をキャンセル
            event.preventDefault();
            // 親要素へのイベント伝播を停止（特に必要なければコメントアウトも可）
            event.stopPropagation();

            // 音量スライダーのinput要素を取得
            const volumeSliderInput = volumeHost.querySelector(SELECTORS.volumeSliderInput);
            if (volumeSliderInput) {
                let currentValue = parseFloat(volumeSliderInput.value);
                // ホイールの回転方向に応じて音量を増減
                if (event.deltaY < 0) { // ホイールを上に回転（奥にスクロール）
                    currentValue = Math.min(1, currentValue + VOLUME_STEP); // 音量を増加 (最大値は1)
                } else { // ホイールを下に回転（手前にスクロール）
                    currentValue = Math.max(0, currentValue - VOLUME_STEP); // 音量を減少 (最小値は0)
                }
                volumeSliderInput.value = currentValue.toFixed(2); // 値を小数点以下2桁に丸めて設定
                // 'change'イベントを手動で発火させ、TVerプレーヤー本体に音量の変更を通知し、
                // 関連するUI（例：音量アイコンの表示変化など）を更新させる。
                volumeSliderInput.dispatchEvent(new Event('change', { 'bubbles': true }));
                log(`Volume changed to: ${volumeSliderInput.value}`);

                // 音量調整が行われたので、ビデオコントローラーを一時的に表示する
                setControllerOpacity('1');
                // 既存の非表示タイマーがあればクリア（連続してホイール操作された場合に対応）
                if (opacityTimeoutId) {
                    clearTimeout(opacityTimeoutId);
                }
                // 一定時間後にコントローラーのopacityスタイルをリセットするタイマーを設定
                opacityTimeoutId = setTimeout(() => {
                    setControllerOpacity(''); // スタイルをリセットし、TVerのデフォルトCSS制御に戻す
                    log('Controller opacity style cleared by timeout after volume adjustment.');
                }, OPACITY_TIMEOUT_DURATION);
            } else {
                log('Error: Volume slider input element not found within the volume host.');
            }
        }
    }

    /**
     * マウスカーソルがビデオコントローラーのコンテナ領域から外に出た際のイベントを処理します。
     * コントローラーを非表示（TVerのデフォルト状態に戻す）にし、表示用のタイマーも解除します。
     * @param {MouseEvent} event マウスイベントオブジェクト
     */
    function handleMouseOutOfControls(event) {
        const controlsContainer = event.target.closest(SELECTORS.controlsContainer);
        // マウスが実際にcontrolsContainerの外に移動したかを event.relatedTarget を使って確認
        // (子要素への移動では発火させないため)
        if (controlsContainer && !controlsContainer.contains(event.relatedTarget)) {
            log('Mouse moved out of the controls container area.');
            // コントローラーのopacityスタイルをリセット
            setControllerOpacity('');
            // 表示タイマーが作動中であればキャンセル
            if (opacityTimeoutId) {
                clearTimeout(opacityTimeoutId);
                opacityTimeoutId = null; // タイマーIDをクリア
                log('Opacity timeout (if any) was cleared due to mouse out.');
            }
        }
    }

    /**
     * ビデオコントローラーのコンテナ領域がクリックされた際のイベントを処理します。
     * コントローラー内の特定のUI要素（ボタン、スライダー等）以外の部分がクリックされた場合、
     * 再生/一時停止ボタンのクリックイベントを発火させます。
     * @param {MouseEvent} event マウスイベントオブジェクト
     */
    function handleClickOnControls(event) {
        const target = event.target; // クリックされた実際の要素
        const playPauseButton = document.querySelector(SELECTORS.playPauseButton); // 再生/一時停止ボタンを取得

        // クリックされた要素、またはその祖先に、再生/一時停止を発火させたくないUI要素が含まれるか確認
        const isUiElement = target.closest(SELECTORS.clickableUiElements);
        // クリックされた要素、またはその祖先が、再生/一時停止ボタンそのものか確認
        const isPlayPauseItself = target.closest(SELECTORS.playPauseButton);

        if (isUiElement && !isPlayPauseItself) {
            // クリックされたのが再生/一時停止ボタン以外のUI要素（例：設定ボタン、シークバーなど）の場合、
            // その要素のネイティブなクリック動作を優先し、ここでは何もしない。
            log('Clicked on a specific UI element within controls (e.g., settings, seekbar). Action passed to element.');
            return;
        }

        // 上記以外（コントローラーの背景部分など）、または再生/一時停止ボタン自体がクリックされたと見なせる場合
        if (playPauseButton) {
            log('Controls area (background or play/pause button itself) clicked. Triggering play/pause action.');
            event.preventDefault(); // 念のため、クリックによる予期せぬデフォルト動作を抑制
            playPauseButton.click(); // 再生/一時停止ボタンのクリックイベントを発火させる
        } else {
            log('Error: Play/pause button not found, cannot trigger play/pause on click.');
        }
    }

    /**
     * ビデオコントローラーに機能拡張（クリックによる再生/一時停止、ホイールによる音量調整など）の
     * イベントリスナーを設定します。
     * 重複してリスナーが登録されるのを防ぐため、設定前に既存のリスナーを一度解除します。
     * @returns {boolean} 機能拡張のイベントリスナー設定に成功した場合はtrue、失敗した場合はfalseを返します。
     */
    function addPlayerEnhancements() {
        // 機能拡張の対象となるコントローラーコンテナと、トリガー対象の再生/一時停止ボタンを取得
        const controlsContainer = document.querySelector(SELECTORS.controlsContainer);
        const playPauseButton = document.querySelector(SELECTORS.playPauseButton); // 主に存在確認用

        if (controlsContainer && playPauseButton) {
            log('Player controls container and play/pause button found. Proceeding to add/update enhancements.');

            // 既存のイベントリスナーを削除（重複登録を避けるため、または要素が再生成された場合に備えるため）
            controlsContainer.removeEventListener('click', handleClickOnControls);
            controlsContainer.removeEventListener('wheel', handleWheel);
            controlsContainer.removeEventListener('mouseout', handleMouseOutOfControls);

            // 新しいイベントリスナーを登録
            controlsContainer.addEventListener('click', handleClickOnControls);
            // wheelイベントでpreventDefaultを呼ぶため、passiveオプションをfalseに設定
            controlsContainer.addEventListener('wheel', handleWheel, { passive: false });
            controlsContainer.addEventListener('mouseout', handleMouseOutOfControls);

            log('Player enhancements (click to play/pause, wheel for volume) have been added/updated.');
            return true; // 設定成功
        }
        log('Player controls container or play/pause button not found. Enhancements not added.');
        return false; // 設定失敗
    }

    /**
     * ビデオプレイヤーの機能拡張をセットアップするメイン関数です。
     * まずDOM内にプレイヤー要素（コントローラー）が存在するか確認し、あれば即座に機能拡張を適用します。
     * 存在しない場合は、MutationObserverを使用してDOMの変更を監視し、要素が出現次第、機能拡張を適用します。
     * @returns {boolean} 機能拡張が即座にセットアップできた場合はtrue、監視を開始した場合はfalseを返します。
     */
    function setupVideoPlayer() {
        log('Attempting to set up video player enhancements...');
        // まず、現在のDOM構造で直接機能拡張を試みる
        if (addPlayerEnhancements()) {
            log('Player enhancements were successfully set up on initial DOM check.');
            // 既にプレイヤーが存在し、セットアップが完了した場合、
            // 以前のMutationObserverが動いていれば停止する。
            if (playerObserver) {
                playerObserver.disconnect();
                playerObserver = null;
                log('Mutation observer (if any) was disconnected after successful direct setup.');
            }
            return true; // セットアップ完了
        }

        // プレイヤー要素がまだDOMにない場合、MutationObserverで監視を開始する
        const targetNode = document.querySelector(SELECTORS.appRoot); // 監視対象のルート要素
        if (!targetNode) {
            log(`Error: Target node ("${SELECTORS.appRoot}") for MutationObserver not found. Cannot observe DOM changes.`);
            return false; // 監視対象が見つからないので失敗
        }

        // 既に他の監視プロセスが動いている場合（通常はURL変更時などにクリアされるはずだが念のため）
        if (playerObserver) {
             playerObserver.disconnect();
             playerObserver = null;
             log('A previous mutation observer was found and disconnected before creating a new one.');
        }

        // MutationObserverのコールバック関数：DOMに変更があった場合に実行される
        playerObserver = new MutationObserver((mutationsList, observer) => {
            // コントローラーコンテナがDOMに追加されたか（または変更されたか）を確認
            if (document.querySelector(SELECTORS.controlsContainer)) {
                log('Player controls container detected by MutationObserver.');
                if (addPlayerEnhancements()) {
                    log('Player enhancements successfully set up via MutationObserver.');
                    observer.disconnect(); // 目的の要素を見つけて処理が完了したので、監視を停止
                    playerObserver = null; // オブザーバーのインスタンスをクリア
                    log('Mutation observer disconnected after detecting controls and completing setup.');
                } else {
                    log('Error: Failed to set up enhancements even after controls were detected by observer. Observer continues for now.');
                    // 本来はここで監視を続けるか、エラーカウンタ等で諦めるかなどの判断が必要になる場合もある
                }
            }
        });

        log(`Starting MutationObserver to watch for player controls appearance on element "${SELECTORS.appRoot}".`);
        // 監視を開始: targetNodeの子要素の追加・削除 (childList) と、その子孫要素全て (subtree) を監視
        playerObserver.observe(targetNode, {
            childList: true,
            subtree: true
        });
        return false; // この時点では監視を開始しただけで、機能拡張のセットアップは完了していない
    }

    /**
     * URLが変更されたことを検知した際に呼び出される処理です。
     * SPA(Single Page Application)でのページ遷移に対応するため、
     * 既存の監視処理（MutationObserver）やタイマーをクリアし、
     * 新しいページのURLに応じて機能拡張の再セットアップを行います。
     */
    function handleURLChange() {
        const currentURL = window.location.href;
        log(`URL changed. New URL: ${currentURL}`);

        // 既存のMutationObserverが動作中であれば停止
        if (playerObserver) {
            playerObserver.disconnect();
            playerObserver = null;
            log('Mutation observer disconnected due to URL change.');
        }
        // コントローラー表示用のタイマーが動作中であればクリア
        if (opacityTimeoutId) {
            clearTimeout(opacityTimeoutId);
            opacityTimeoutId = null;
            log('Opacity timeout cleared due to URL change.');
        }
        
        // ページ遷移時に、前のページのコントローラー要素に適用された可能性のあるスタイルをクリア
        // (要素が即座に破棄されない場合に備える)
        const oldControls = document.querySelector(SELECTORS.controlsContainer);
        if(oldControls) { // もし古いコントローラー要素がまだ存在すれば
            oldControls.style.opacity = ''; // 透明度スタイルをクリア
            // フェード機能が有効だった場合、transitionスタイルもクリアすることを検討したが、
            // このバージョンではフェード機能は複雑化するため一旦見送った経緯あり。
            // 透明度だけクリアすれば、TVerのデフォルトスタイルに戻るはず。
            log('Cleared opacity style from any lingering old controls on URL change.');
        }


        // ライブ配信ページの場合 (/live/)
        if (currentURL.startsWith('https://tver.jp/live/')) {
            log('Live page detected. Skipping player enhancements setup for this page.');
            return; // ライブページでは機能拡張を適用しない
        }

        // 通常のエピソードページの場合 (/episodes/)
        if (currentURL.startsWith('https://tver.jp/episodes/')) {
            log('Episode page detected. Re-initializing player enhancements setup.');
            // SPA遷移の場合、DOMの更新が非同期で行われるため、
            // 少し遅延させてからセットアップ関数を呼び出すことで、新しいプレイヤー要素の準備を待つ。
            // 遅延時間は環境やタイミングによって調整が必要な場合がある。
            setTimeout(setupVideoPlayer, 500);
        } else {
            // 上記以外のページ（例：トップページ、検索結果ページなど）
            log('Non-episode/live page detected. Player enhancements may not be applicable here.');
        }
    }

    // --- スクリプト初期化処理 ---
    log('UserScript initializing...');

    // history.pushState をフックして、SPAでの画面遷移（URL変更）を検知する
    // 元のpushState関数を保持
    const originalPushState = window.history.pushState;
    // pushState関数を上書き
    window.history.pushState = function() {
        // 元のpushStateの処理を実行
        const result = originalPushState.apply(this, arguments);
        log('history.pushState was called. Assuming URL has changed.');
        // URLが変更されたものとして処理を実行
        handleURLChange();
        return result;
    };

    // ブラウザの「戻る」「進む」ボタンによるURL変更を検知 (popstateイベント)
    window.addEventListener('popstate', () => {
        log('history.popstate event was detected (browser back/forward button).');
        handleURLChange();
    });

    // スクリプト実行時の初期ページ読み込みに対する処理
    const initialURL = window.location.href;
    if (initialURL.startsWith('https://tver.jp/live/')) {
        log('Initial page load is a live page. Skipping player enhancements setup.');
    } else if (initialURL.startsWith('https://tver.jp/episodes/')) {
        log('Initial page load is an episode page. Setting up player enhancements.');
        // DOMの準備状態を確認
        if (document.readyState === 'loading') {
            // DOMがまだロード中の場合は、DOMContentLoadedイベントを待ってからセットアップを実行
            document.addEventListener('DOMContentLoaded', setupVideoPlayer);
        } else {
            // DOMが既にロード済みの場合は、少し遅延させてセットアップを実行（安全策）
            setTimeout(setupVideoPlayer, 500);
        }
    } else {
         log('Initial page load is not an episode or live page. No initial setup for player enhancements.');
    }

    log('UserScript initialized and is now monitoring for player and URL changes.');

})();