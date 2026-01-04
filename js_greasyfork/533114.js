// ==UserScript==
// @name         B站直播屏蔽外显送礼按钮
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  送礼需要点开礼物面板，防止一不小心送出去
// @author       TGSAN
// @match        *://live.bilibili.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/533114/B%E7%AB%99%E7%9B%B4%E6%92%AD%E5%B1%8F%E8%94%BD%E5%A4%96%E6%98%BE%E9%80%81%E7%A4%BC%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/533114/B%E7%AB%99%E7%9B%B4%E6%92%AD%E5%B1%8F%E8%94%BD%E5%A4%96%E6%98%BE%E9%80%81%E7%A4%BC%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let applyFeatureStyle = document.createElement("style");
    let featureStyle = `
    .gift-control-panel .right-part .gift-presets .gift-panel.base-panel {
        transform: scale(0);
    }
    `;

    function updateStyle() {
        if (document.head == applyFeatureStyle.parentNode) {
            document.head.removeChild(applyFeatureStyle)
        }
        applyFeatureStyle.innerHTML = featureStyle;
        document.head.appendChild(applyFeatureStyle);
    }

    updateStyle();
})();