// ==UserScript==
// @name         dark mode
// @namespace    http://tampermonkey.net/
// @version      2025-05-09
// @description  auto dark mode
// @author       Anc
// @match        *://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @run-at		 document.start
// @grant        GM.addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/535442/dark%20mode.user.js
// @updateURL https://update.greasyfork.org/scripts/535442/dark%20mode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add meta tag
    let meta = document.createElement('meta');
    meta.name = "theme-color";
    meta.content = "#000";
    meta.media = "(prefers-color-scheme: dark)";
    document.head.append(meta);

    function isDarkColor(rgbString) {
        const match = rgbString.match(/\d+/g);
        if (!match || match.length < 3) return false; // 非 RGB 格式视为浅色或无法判断
        const [r, g, b] = match.map(Number);
        const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
        return brightness < 128;
    }

    function getEffectiveBackgroundColor(element) {
        while (element) {
            const style = window.getComputedStyle(element);
            const bgColor = style.backgroundColor;
            const bgImage = style.backgroundImage;

            if (bgImage && bgImage !== 'none') {
                console.log('背景图：', bgImage);
                return 'image'; // 有背景图，视为特殊处理
            }

            if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
                return bgColor;
            }

            element = element.parentElement;
        }
        return 'rgb(255, 255, 255)'; // 默认白色
    }

    function checkIfBackgroundIsDark() {
        const targets = [document.body, document.documentElement];
        for (const el of targets) {
            const result = getEffectiveBackgroundColor(el);
            if (result === 'image') {
                console.log('无法判断背景图颜色，请人工确认');
                return false;
            }
            if (isDarkColor(result)) {
                console.log('背景是深色');
                return true;
            }
        }
        console.log('背景是浅色');
        return false;
    }

    let isDark = checkIfBackgroundIsDark();

    if(!isDark) {
        // Add style
        GM.addStyle(`
                @media (prefers-color-scheme: dark) {
                :root {
                        filter: invert(1) hue-rotate(180deg);
                    }
	            figure,img,video,iframe,div[style*=image]{
                        filter: invert(1) hue-rotate(180deg);
                        opacity:1;
                    }

                figure img {
                        filter: unset;
                    }
                }
            `)
    }
})();