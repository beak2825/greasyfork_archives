// ==UserScript==
// @name         全自动TTS朗读小说
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  全自动调用TTS朗读小说，解放双手!
// @author       Zero.
// @match        http://www.108shu.com/*
// @grant        none
// @run-at document-end
// @license AGPL-3.0 license
// @downloadURL https://update.greasyfork.org/scripts/465610/%E5%85%A8%E8%87%AA%E5%8A%A8TTS%E6%9C%97%E8%AF%BB%E5%B0%8F%E8%AF%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/465610/%E5%85%A8%E8%87%AA%E5%8A%A8TTS%E6%9C%97%E8%AF%BB%E5%B0%8F%E8%AF%B4.meta.js
// ==/UserScript==

(function () {
    'use strict';
    window.addEventListener('load', function () {
        window.speechSynthesis.cancel();
        console.log('页面加载完成，开始朗读');
        const pageText = document.querySelector("#container > div.row.row-detail.row-reader > div > div.reader-main > h1").textContent + document.querySelector("#content").textContent;
        window.speechSynthesis.onvoiceschanged = function () {
            var voices = window.speechSynthesis.getVoices();
            console.log(pageText);
            const msg = new SpeechSynthesisUtterance(pageText);
            msg.voice = voices[61];
            msg.onend = function (event) {
                console.log('朗读已完成');
                document.querySelector('#next_url').click();
            };
            window.speechSynthesis.speak(msg);
        };
    });

})();