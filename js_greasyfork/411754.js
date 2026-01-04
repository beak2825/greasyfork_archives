// ==UserScript==
// @name         Youtube停止顯示轉圈圈、暫停、撥放的動畫
// @namespace    Youtube停止顯示轉圈圈、暫停、撥放的動畫
// @version      3.6
// @description  Youtube快轉或網路不穩時顯示的轉圈圈動畫移除。
// @author       fmnijk
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/411754/Youtube%E5%81%9C%E6%AD%A2%E9%A1%AF%E7%A4%BA%E8%BD%89%E5%9C%88%E5%9C%88%E3%80%81%E6%9A%AB%E5%81%9C%E3%80%81%E6%92%A5%E6%94%BE%E7%9A%84%E5%8B%95%E7%95%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/411754/Youtube%E5%81%9C%E6%AD%A2%E9%A1%AF%E7%A4%BA%E8%BD%89%E5%9C%88%E5%9C%88%E3%80%81%E6%9A%AB%E5%81%9C%E3%80%81%E6%92%A5%E6%94%BE%E7%9A%84%E5%8B%95%E7%95%AB.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const styles = `
		.ytp-spinner, .ytp-bezel {
			display: none !important;
		}
        `;

    GM_addStyle(styles);
})();