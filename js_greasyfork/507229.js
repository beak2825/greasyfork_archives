// ==UserScript==
// @name        Link Open Mode Tooltip Enhancer
// @name:zh-CN  链接打开方式提示增强器
// @name:zh-TW  連結開啟方式提示增強器
// @name:ja リンクオープンモードツールチップエンハンサー
// @namespace   https://github.com/systemannounce/LinkTips
// @version     0.1.0
// @description Displays tooltips showing link open modes with color coding: blue for new tab, red for current page, supports Chinese and English.Adjust the display of the lower left and lower right corners at the same time
// @description:ja リンクの開き方に応じてツールチップを表示します。新しいタブは青色、同じタブは赤色で表示され、言語は中英に対応します，左下隅と右下隅を同時にサポートするようにディスプレイを調整します。
// @description:zh-CN 根据链接打开方式显示提示，新标签页蓝色提示，当前页面红色提示，支持中英文切换同时调整支持左下角和右下角的显示。
// @description:zh-TW 根據鏈接打開方式顯示提示，新標籤頁藍色提示，當前頁面紅色提示，支援中英文切換，同时调整支持左下角和右下角的显示。
// @author       Felix_SANA
// @license     MIT
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/507229/Link%20Open%20Mode%20Tooltip%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/507229/Link%20Open%20Mode%20Tooltip%20Enhancer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const userLang = navigator.language || navigator.userLanguage;
    const isChinese = userLang.includes('zh');

    const messages = {
        newTab: isChinese ? "新标签页打开" : "New tab",
        currentTab: isChinese ? "当前页面覆盖" : "Current page"
    };

    const tooltipLeft = document.createElement("div");
    tooltipLeft.className = "link-tooltip-left";
    document.body.appendChild(tooltipLeft);

    const tooltipRight = document.createElement("div");
    tooltipRight.className = "link-tooltip-right";
    document.body.appendChild(tooltipRight);

    const style = document.createElement('style');
    style.textContent = `
        .link-tooltip-left, .link-tooltip-right {
            position: fixed;
            bottom: 30px;
            padding: 5px 10px;
            color: white;
            border-radius: 5px;
            font-size: 12px;
            display: none;
            pointer-events: none;
            z-index: 1000;
        }
        .link-tooltip-left {
            left: 10px;
        }
        .link-tooltip-right {
            right: 10px;
        }
        .link-tooltip-left.new-tab, .link-tooltip-right.new-tab {
            background-color: blue;
        }
        .link-tooltip-left.current-tab, .link-tooltip-right.current-tab {
            background-color: red;
        }
    `;
    document.head.appendChild(style);

    const positions = {
        left: 'left',
        right: 'right',
        both: 'both'
    };

    let userPosition = GM_getValue('tooltipPosition', 'left');
    updateTooltipVisibility(userPosition);

    GM_registerMenuCommand(isChinese ? "左下角显示" : "Show on bottom left", () => {
        GM_setValue('tooltipPosition', 'left');
        userPosition = 'left';
        updateTooltipVisibility(userPosition);
    });
    GM_registerMenuCommand(isChinese ? "右下角显示" : "Show on bottom right", () => {
        GM_setValue('tooltipPosition', 'right');
        userPosition = 'right';
        updateTooltipVisibility(userPosition);
    });
    GM_registerMenuCommand(isChinese ? "两边同时显示" : "Show on both sides", () => {
        GM_setValue('tooltipPosition', 'both');
        userPosition = 'both';
        updateTooltipVisibility(userPosition);
    });

    function updateTooltipVisibility(position) {
        if (position === 'left') {
            tooltipLeft.style.display = "block";
            tooltipRight.style.display = "none";
        } else if (position === 'right') {
            tooltipLeft.style.display = "none";
            tooltipRight.style.display = "block";
        } else if (position === 'both') {
            tooltipLeft.style.display = "block";
            tooltipRight.style.display = "block";
        }
    }

    document.addEventListener("mouseover", function(event) {
        const link = event.target.closest("a");
        if (link) {
            const isNewTab = link.target === "_blank";
            const message = isNewTab ? messages.newTab : messages.currentTab;

            if (userPosition === 'left' || userPosition === 'both') {
                tooltipLeft.textContent = message;
                tooltipLeft.className = `link-tooltip-left ${isNewTab ? 'new-tab' : 'current-tab'}`;
                tooltipLeft.style.display = "block";
            }

            if (userPosition === 'right' || userPosition === 'both') {
                tooltipRight.textContent = message;
                tooltipRight.className = `link-tooltip-right ${isNewTab ? 'new-tab' : 'current-tab'}`;
                tooltipRight.style.display = "block";
            }
        } else {
            tooltipLeft.style.display = "none";
            tooltipRight.style.display = "none";
        }
    });

    document.addEventListener("mouseout", function(event) {
        if (event.target.tagName === "A") {
            tooltipLeft.style.display = "none";
            tooltipRight.style.display = "none";
        }
    });
})();
