// ==UserScript==
// @name         Rakuten Eat my Dong
// @namespace    http://tampermonkey.net/
// @version      2024-11-12
// @description  who is responsible for this - makes a shoddy attempt at fixing the NijiFes 2025 website to actually be readable on a PC
// @author       Shampooh
// @match        https://fes.nijisanji.jp/2025*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nijisanji.jp
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/516973/Rakuten%20Eat%20my%20Dong.user.js
// @updateURL https://update.greasyfork.org/scripts/516973/Rakuten%20Eat%20my%20Dong.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener('load', function() {
        const wholeContainers = document.getElementsByClassName('c-wholeContainer');
        for (let i = 0; i < wholeContainers.length; i++) {
            wholeContainers[i].style.maxWidth = '75%';
        }

        const logoElements = document.getElementsByClassName('c-wholeMenu__logo');
        for (let i = 0; i < logoElements.length; i++) {
            logoElements[i].style.position = 'fixed';
            logoElements[i].style.left = '0';
            logoElements[i].style.top = '0';
        }

        const containerElements = document.getElementsByClassName('c-wholeMenu__container');
        for (let i = 0; i < containerElements.length; i++) {
            containerElements[i].style.position = 'fixed';
            containerElements[i].style.right = '0';
            containerElements[i].style.top = '0';
        }

        const figures = document.getElementsByTagName('figure');
        for (let i = 0; i < figures.length; i++) {
            const img = figures[i].getElementsByTagName('img')[0];
            if (img) {
                img.style.width = '50%';
                img.style.marginLeft = 'auto';
                img.style.marginRight = 'auto';
                img.style.display = 'block';
                img.style.setProperty('width', '50%', 'important');
                img.style.setProperty('margin-left', 'auto', 'important');
                img.style.setProperty('margin-right', 'auto', 'important');
                img.style.setProperty('display', 'block', 'important');
            }
        }

        const topMvSections = document.getElementsByClassName('l-topMv');
        for (let i = 0; i < topMvSections.length; i++) {
            const img = topMvSections[i].getElementsByTagName('img')[0];
            if (img) {
                img.style.setProperty('width', '50%', 'important');
                img.style.setProperty('margin-left', 'auto', 'important');
                img.style.setProperty('margin-right', 'auto', 'important');
                img.style.setProperty('display', 'block', 'important');
            }
        }
    });
})();