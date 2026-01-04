// ==UserScript==
// @name         V2EX - Safari 背景修复
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  修复 Safari 下不支持固定背景的问题。
// @author       MossHawk
// @icon         https://app.mxowl.com/favicon.ico
// @grant        none
// @run-at       document-idle
// @match        https://*.v2ex.com/*
// @match        https://v2ex.com/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/449344/V2EX%20-%20Safari%20%E8%83%8C%E6%99%AF%E4%BF%AE%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/449344/V2EX%20-%20Safari%20%E8%83%8C%E6%99%AF%E4%BF%AE%E5%A4%8D.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let wrapper = document.querySelector("#Wrapper");
    if (!wrapper) {
        return;
    }
    let imgUrl = getComputedStyle(wrapper).backgroundImage;
    let bgColor = getComputedStyle(wrapper).backgroundColor;
    if (!getComputedStyle(wrapper).backgroundAttachment || !getComputedStyle(wrapper).backgroundAttachment.includes("fixed")) {
        return;
    }

    let styleElement = document.createElement("style");
    styleElement.setAttribute("data-name", "v2ex-background-fix");
    document.head.appendChild(styleElement);
    styleElement.sheet.insertRule(`
#Wrapper {
    background-image: none !important;
    background-color: transparent !important;
}`, 0);
    styleElement.sheet.insertRule(`
#addition {
    z-index: -114514;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: ${bgColor};
}`, 1);
    styleElement.sheet.insertRule(`
#addition::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-image: ${imgUrl};
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
}`, 2);

    let elem = document.createElement("div");
    elem.id = "addition";
    document.body.appendChild(elem);

})();

