// ==UserScript==
// @name         防沉迷终结者 (万能规则)
// @description  使用万能规则通杀大部分游戏平台的防沉迷, 它无与伦比的误杀率将为您带来终身难忘的使用体验
// @namespace    https://fcmsb250.github.io/
// @version      0.1.1
// @icon         https://dsy4567.github.io/logo.svg
// @author       dsy4567 https://greasyfork.org/zh-CN/users/822325 / dsy4567 https://github.com/dsy4567
// @license      GPL-3.0

// @match        *://*/*

// @grant        GM_addStyle
// @grant        GM_addValueChangeListener
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @homepageURL  https://fcmsb250.github.io/
// @supportURL   https://github.com/dsy4567/Fucking-Anti-Indulgence/
// @downloadURL https://update.greasyfork.org/scripts/444199/%E9%98%B2%E6%B2%89%E8%BF%B7%E7%BB%88%E7%BB%93%E8%80%85%20%28%E4%B8%87%E8%83%BD%E8%A7%84%E5%88%99%29.user.js
// @updateURL https://update.greasyfork.org/scripts/444199/%E9%98%B2%E6%B2%89%E8%BF%B7%E7%BB%88%E7%BB%93%E8%80%85%20%28%E4%B8%87%E8%83%BD%E8%A7%84%E5%88%99%29.meta.js
// ==/UserScript==

function 首字母大写(str) {
    str = str[0].toUpperCase() + str.substring(1, str.length);
    return str;
}

function 万能规则() {
    let 游戏元素id或class = ["flash", "game", "play", "youxi", "swf", "flash"];
    let 防沉迷元素id或class = [
        "anti",
        "fcm",
        "verify",
        "mask",
        "certify",
        "dialog",
        "popup",
        "login",
        "cover",
    ];
    let 临时数组 = [];
    let 样式表 = "";

    游戏元素id或class.forEach(str => {
        临时数组.push(
            "iframe[id*='" + str + "'],",
            "iframe[class*='" + str + "'],",
            "iframe[id*='" + str.toUpperCase() + "'],",
            "iframe[class*='" + str.toUpperCase() + "'],",
            "iframe[id*='" + 首字母大写(str) + "'],",
            "iframe[class*='" + 首字母大写(str) + "'],"
        );
    });
    临时数组.forEach(str => {
        样式表 += str;
    });
    样式表 += `#ctmdfcm
            {
                display: block !important;
                left: 0 !important;
                top: 0 !important;
                position: absolute !important;
                z-index: 999999 !important;
            }`;
    临时数组 = [];

    防沉迷元素id或class.forEach(str => {
        临时数组.push(
            "[id*='" + str + "'],",
            "[class*='" + str + "'],",
            "[id*='" + str.toUpperCase() + "'],",
            "[class*='" + str.toUpperCase() + "'],",
            "[id*='" + 首字母大写(str) + "'],",
            "[class*='" + 首字母大写(str) + "'],"
        );
    });
    临时数组.forEach(str => {
        样式表 += str;
    });
    样式表 += `#ctmdfcm
            {
                display: none !important;
                min-width: 0 !important;
                width: 0 !important;
                max-width: 0 !important;
                min-height: 0 !important;
                height: 0 !important;
                max-height: 0 !important;
                z-index: -999 !important;
                font-size: 0 !important;
                overflow: hidden !important;
            }`;
    临时数组 = [];

    GM_addStyle(样式表);
}

GM_addValueChangeListener("使用万能规则", () => {
    万能规则();
});

GM_registerMenuCommand("👉使用万能规则(不保证实用性)", () => {
    GM_setValue("使用万能规则", Math.random());
});
