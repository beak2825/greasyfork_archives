// ==UserScript==
// @name:zh-tw      OMG遊戲GA視覺驗證工具
// @name            OMG Game GA Visual Verifier
// @namespace       com.sherryyue.omggamespeedcontroller
// @version         0.7
// @description:zh-tw       在畫面上toast出剛被記錄的 dataLayer 事件，方便驗證 GA 的事件追蹤
// @description             Toast the latest dataLayer event on the screen for verifying GA event tracking
// @author          SherryYue
// @copyright       SherryYue
// @license         MIT
// @match           *://*.ssgaka.com/*
// @include         *://7sz*.com/*
// @include         *://*.7sz*.com/*
// @exclude         *://*/history/*
// @exclude         *://*/history2/*
// @exclude         *://*/review/*
// @contributionURL https://sherryyuechiu.github.io/card
// @supportURL      sherryyue.c@protonmail.com
// @icon            https://sherryyuechiu.github.io/card/images/logo/maskable_icon_x96.png
// @supportURL      "https://github.com/sherryyuechiu/GreasyMonkeyScripts/issues"
// @homepage        "https://github.com/sherryyuechiu/GreasyMonkeyScripts"
// @require         https://cdnjs.cloudflare.com/ajax/libs/toastify-js/1.12.0/toastify.min.js
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/509007/OMG%20Game%20GA%20Visual%20Verifier.user.js
// @updateURL https://update.greasyfork.org/scripts/509007/OMG%20Game%20GA%20Visual%20Verifier.meta.js
// ==/UserScript==
(function () {
    'use strict';
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
            duration: 6000,
            style: {
                textAlign: 'left',
                width: '20em',
                height: 'auto',
                wordWrap: 'break-word',
            }
        }).showToast();
    }
    // 初始的 dataLayer 長度
    // @ts-ignore
    let previousLength = window.dataLayer ? window.dataLayer.length : 0;
    // 將 JSON 物件格式化，每個屬性顯示在新的一行
    function formatJsonObject(jsonObject) {
        let formattedString = '';
        // 優先顯示 event 屬性
        if (jsonObject.hasOwnProperty('event')) {
            formattedString += `event: ${JSON.stringify(jsonObject['event'])}\n`;
        }
        // 優先顯示 page 屬性
        if (jsonObject.hasOwnProperty('page')) {
            formattedString += `page: ${JSON.stringify(jsonObject['page'])}\n`;
        }
        for (const key in jsonObject) {
            if (jsonObject.hasOwnProperty(key) && key !== 'event' && key !== 'page') {
                let value = jsonObject[key];
                if ((key === 'after' || key === 'before') && typeof value === 'boolean') {
                    value = value ? '⭕' : '❌';
                }
                formattedString += `${key}: ${JSON.stringify(value)}\n`;
            }
        }
        return formattedString;
    }
    function checkDataLayer() {
        // @ts-ignore
        if (window.dataLayer) {
            // @ts-ignore
            let currentLength = window.dataLayer.length;
            if (currentLength > previousLength) {
                // 處理所有新增的事件
                // @ts-ignore
                for (let i = previousLength; i < currentLength; i++) {
                    // @ts-ignore
                    let newEvent = window.dataLayer[i];
                    if (newEvent && newEvent.event) {
                        const filteredEvent = {};
                        for (const key in newEvent) {
                            if (!key.startsWith('gtm.') && key !== 'gameId') {
                                filteredEvent[key] = newEvent[key];
                            }
                        }
                        showToast(formatJsonObject(filteredEvent));
                    }
                }
            }
            else if (currentLength < previousLength) {
                showToast('dataLayer被重置了');
            }
            previousLength = currentLength;
        }
    }
    // 每秒檢查一次 dataLayer
    setInterval(checkDataLayer, 100);
})();
