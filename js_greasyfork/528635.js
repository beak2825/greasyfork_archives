// ==UserScript==
// @name         VPS.Town养眼
// @namespace    http://tampermonkey.net/
// @version      2025-03-03
// @description  把 vps.town 的控制面板颜色改的正常一点
// @author       Pysio
// @match        https://vps.town/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=vps.town
// @license      AGPL-v3
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528635/VPSTown%E5%85%BB%E7%9C%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/528635/VPSTown%E5%85%BB%E7%9C%BC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function changeTextColor() {
        const elements = document.getElementsByTagName('*');


        for (let element of elements) {
            const style = window.getComputedStyle(element);
            const color = style.color;


            if (
                color === 'rgb(156, 209, 186)' ||
                color === '#9CD1BA' ||
                color === 'rgb(24, 168, 107)' ||
                color === '#18a86b' ||
                color === 'rgb(24, 168, 107)' ||
                color === 'rgb(24, 168, 107, 1)' ||
                color === 'rgba(24, 168, 107, 1)'
            ) {
                element.style.color = '#000000';
                element.style.setProperty('color', '#000000', 'important');
            }
        }
    }

    window.addEventListener('load', changeTextColor);

    setInterval(changeTextColor, 1000);

    const observer = new MutationObserver(changeTextColor);
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();