// ==UserScript==
// @name         Lolz.live - Remove uniqUsernameIcon
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Удаляет все элементы с классом uniqUsernameIcon
// @author       eretly
// @match        https://lolz.live/*
// @match        https://lzt.market/*
// @grant        none
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/532112/Lolzlive%20-%20Remove%20uniqUsernameIcon.user.js
// @updateURL https://update.greasyfork.org/scripts/532112/Lolzlive%20-%20Remove%20uniqUsernameIcon.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const deleteIcons = () => {
        document.querySelectorAll('.uniqUsernameIcon, .uniqUsernameIcon--custom').forEach(el => {
            el.remove();
        });
        
        document.querySelectorAll('span, div').forEach(el => {
            if (el.childElementCount === 1 && 
                (el.firstElementChild.classList.contains('uniqUsernameIcon') || 
                 el.firstElementChild.classList.contains('uniqUsernameIcon--custom'))) {
                el.remove();
            }
        });
    };

    deleteIcons();
    
    const interval = setInterval(deleteIcons, 100);

    const observer = new MutationObserver((mutations) => {
        deleteIcons();
    });

    observer.observe(document, {
        childList: true,
        subtree: true
    });

    window.addEventListener('load', () => {
        clearInterval(interval);
        deleteIcons();
    });
})();