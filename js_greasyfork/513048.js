// ==UserScript==
// @name:zh-tw      內嵌OMG遊戲環境識別
// @name            Embeded OMG Game Environment Identifier
// @namespace       com.sherryyue.lulagitlabciloginfo
// @version         0.5
// @description:zh-tw OMG遊戲識別平台內嵌環境
// @description       Identify the embeded OMG game environment
// @author          SherryYue
// @copyright       SherryYue
// @license         MIT
// @match           *://*.ssgaka.com/*
// @include         *://7sz*.com/*
// @include         *://*.7sz*.com/*
// @exclude         *://*/history/*
// @exclude         *://*/history2/*
// @exclude         *://*/review/*
// @supportURL      sherryyue.c@protonmail.com
// @icon            https://sherryyuechiu.github.io/card/images/logo/maskable_icon_x96.png
// @supportURL      "https://github.com/sherryyuechiu/GreasyMonkeyScripts/issues"
// @homepage        "https://github.com/sherryyuechiu/GreasyMonkeyScripts"
// @require         https://cdnjs.cloudflare.com/ajax/libs/toastify-js/1.12.0/toastify.min.js
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/513048/Embeded%20OMG%20Game%20Environment%20Identifier.user.js
// @updateURL https://update.greasyfork.org/scripts/513048/Embeded%20OMG%20Game%20Environment%20Identifier.meta.js
// ==/UserScript==
(function () {
    // 動態載入 CSS 的函式
    function loadCSS(url) {
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = url;
        document.head.appendChild(link);
    }
    loadCSS('https://cdnjs.cloudflare.com/ajax/libs/toastify-js/1.12.0/toastify.min.css');
    // 顯示 toast 的函式
    function showToast(message) {
        // @ts-ignore
        Toastify({
            text: message,
            duration: -1,
            position: "left",
            gravity: "bottom",
            close: true,
        }).showToast();
    }
    function getEnvNameByUrlHost(urlHost) {
        switch (urlHost) {
            case 'sm-dev.ssgaka.com':
                return 'DEV';
            case 'sm-devm.ssgaka.com':
                return 'DEVM';
            case 'acp-linux-qa.ssgaka.com':
                return 'QA';
            case 'sm-uat.ssgaka.com':
                return 'UAT';
            case 'sm-pit.ssgaka.com':
                return 'PIT';
            case 'sm-stg.7sz1.com':
                return 'STG';
            case '7sz1.com':
                return 'PROD';
            case '7sz2.com':
                return 'PROD';
            case 'rt2.7sz6681.com':
                return 'PROD';
            default:
                return `未知(${urlHost})`;
        }
    }
    if (window.self === window.top)
        return;
    showToast(`OMG遊戲環境：${getEnvNameByUrlHost(location.host)}`);
})();
