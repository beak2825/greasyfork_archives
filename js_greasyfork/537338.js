// ==UserScript==
// @name         WordEngine Auto Click Sound Icon
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  自動で音声再生ボタンをクリック
// @match        https://www.wordengine.jp/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/537338/WordEngine%20Auto%20Click%20Sound%20Icon.user.js
// @updateURL https://update.greasyfork.org/scripts/537338/WordEngine%20Auto%20Click%20Sound%20Icon.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const VERSION = '1.1';
    console.log(`🚀 WordEngine Auto Click Sound Icon v${VERSION} 起動`);

    let lastQuestionNumber = '';
    let initialized = false;

    function getCurrentQuestionNumber() {
        const pagination = document.querySelector('.flashword-header-pagination');
        if (pagination) {
            console.log(`📘 現在の問題番号: ${pagination.textContent.trim()}`);
        }
        return pagination ? pagination.textContent.trim() : '';
    }

    function trulyClick(elem) {
        if (!elem) {
            console.warn('⚠️ trulyClick: 要素が null です');
            return;
        }

        const down = new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window });
        const up = new MouseEvent('mouseup', { bubbles: true, cancelable: true, view: window });
        const click = new MouseEvent('click', { bubbles: true, cancelable: true, view: window });

        console.log('🖱️ trulyClick: クリックイベントを送信中...');
        requestAnimationFrame(() => {
            elem.dispatchEvent(down);
            elem.dispatchEvent(up);
            elem.dispatchEvent(click);
            console.log('✅ trulyClick: クリックイベントを送信しました');
        });
    }

    function clickSoundButton() {
        const button = document.querySelector('.question-sound-image.sound-icon');
        console.log('🔍 音声ボタンの取得結果:', button);

        if (!button) {
            console.warn('❌ 音声ボタンが見つかりません');
            return;
        }

        const computed = window.getComputedStyle(button);
        console.log(`🎛️ 音声ボタン状態: opacity=${button.style.opacity}, pointerEvents=${button.style.pointerEvents}, computed.pointerEvents=${computed.pointerEvents}`);

        if (
            button.style.opacity === '1' &&
            button.style.pointerEvents !== 'none' &&
            computed.pointerEvents !== 'none'
        ) {
            console.log('🎵 音声ボタンをクリックします');
            trulyClick(button);
        } else {
            console.warn('⏳ 音声ボタンがまだ使用できません（表示済みでも無効）');
        }
    }

    function checkForQuestionChange() {
        const current = getCurrentQuestionNumber();
        if (!current) return;

        if (current !== lastQuestionNumber) {
            console.log(`🆕 問題切り替え検出: ${lastQuestionNumber} → ${current}`);
            lastQuestionNumber = current;

            setTimeout(() => {
                console.log('⏰ 音声ボタンのクリックを試みます');
                clickSoundButton();
            }, 800);
        }
    }

    function enableAnswers() {
        const disabledAnswers = document.querySelectorAll('.answer-list.disable');
        if (disabledAnswers.length > 0) {
            console.log(`🔓 回答ボタンを有効化: ${disabledAnswers.length} 件`);
            disabledAnswers.forEach(el => {
                el.classList.remove('disable');
                el.style.pointerEvents = 'auto';
                el.style.opacity = '1';
            });
        }
    }

    function initIfReady() {
        const questionArea = document.querySelector('.flashword-header-pagination');
        if (questionArea && !initialized) {
            console.log('✅ 問題画面を検出し、初期化を開始します');
            initialized = true;
            lastQuestionNumber = getCurrentQuestionNumber();

            setInterval(checkForQuestionChange, 1000);
            setInterval(enableAnswers, 500);
        } else if (!questionArea && initialized) {
            console.log('🔁 問題画面が終了したため、状態をリセットします');
            initialized = false;
        }
    }

    // ページ内変化を検知し、SPAに対応
    setInterval(initIfReady, 1000);
})();
