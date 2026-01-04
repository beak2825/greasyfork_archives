// ==UserScript==
// @name         谷歌翻译快捷键 Google translate hot key
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  按下Alt+s 焦点跳转至输入框，按下Alt+w播放音频。Press Alt+s to focus input, Press Alt+w to play audio
// @author       wirtey
// @match        *://translate.google.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/471781/%E8%B0%B7%E6%AD%8C%E7%BF%BB%E8%AF%91%E5%BF%AB%E6%8D%B7%E9%94%AE%20Google%20translate%20hot%20key.user.js
// @updateURL https://update.greasyfork.org/scripts/471781/%E8%B0%B7%E6%AD%8C%E7%BF%BB%E8%AF%91%E5%BF%AB%E6%8D%B7%E9%94%AE%20Google%20translate%20hot%20key.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const audioDom = document.querySelector('.m0Qfkd .VfPpkd-Bz112c-RLmnJb')
    const inputDom = document.querySelector('[aria-label][aria-autocomplete]')
    const playAudio = () => {
        audioDom.click()
    }
    const getInputFocus = () => {
        inputDom.focus()
    }
    const keyMap = {
        'w': () => {
            playAudio()
            setTimeout(() => getInputFocus(), 300)
        },
        's': playAudio
    }
    const onPressKey = (key, handle) => {
    }
    const listen = () => {
        document.addEventListener('keydown', ({ altKey, key }) => {
            if (altKey) keyMap[key]?.()
        })
    }
    listen()

    // Your code here...
})();