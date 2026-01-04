// ==UserScript==
// @name         为TypingClub重新开始打字添加快捷键
// @namespace    https://github.com/Crazyokd/quickRefresh
// @version      1.0
// @description  按Ctrl+I重新开始打字
// @author       Rekord
// @match        *://*.edclub.com/sportal/*
// @match        *://*.typingclub.com/sportal/*
// @icon         https://static.typingclub.com/m/favicon.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/523810/%E4%B8%BATypingClub%E9%87%8D%E6%96%B0%E5%BC%80%E5%A7%8B%E6%89%93%E5%AD%97%E6%B7%BB%E5%8A%A0%E5%BF%AB%E6%8D%B7%E9%94%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/523810/%E4%B8%BATypingClub%E9%87%8D%E6%96%B0%E5%BC%80%E5%A7%8B%E6%89%93%E5%AD%97%E6%B7%BB%E5%8A%A0%E5%BF%AB%E6%8D%B7%E9%94%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const setShortCut = ()=>{
        // console.log('add shortcut');
        document.addEventListener('keydown', function(event) {
            if (event.ctrlKey && event.key === "i") {
                // console.log('press ctrl+i');
                event.preventDefault();

                let refresh = document.querySelector('span.edicon-refresh');
                if (refresh) refresh.click();
                let retry = document.querySelector('.btn.navbar-goback');
                if (retry) retry.click();
            }
        });
    };
    window.onload = function() {
        // try to set shortcut
        setShortCut();
    }
})();