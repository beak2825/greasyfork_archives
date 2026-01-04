// ==UserScript==
// @name         North-Plus Notification Plus
// @namespace    https://github.com/sssssssl/NP-scripts
// @version      0.1.1
// @description  发帖时自动勾选新回复通知按钮，增强通知显示效果
// @author       sl
// @match        https://*.summer-plus.net
// @match        https://*.summer-plus.net/index.php
// @match        https://*.level-plus.net/*
// @match        https://*.white-plus.net/*
// @match        https://*.south-plus.net/*
// @match        https://*.imoutolove.me/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369680/North-Plus%20Notification%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/369680/North-Plus%20Notification%20Plus.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const url = window.location.href;
    const THREAD_PAT = /read\.php\?tid/;
    const POST_PAT = /post\.php\?fid-*/;
    const REPLY_PAT = /post\.php\?action-reply/;

    const ID_NEW_RP = 'newrp';
    const CLS_BLINK = 'blink';
    const NEW_RP_STYLE = `
        .${CLS_BLINK} {
            display: inline-block; font-weight:bold;
            color:#FF0000;
            animation:blink 1s;
            animation-iteration-count:infinite;
            -webkit-animation: blink 1s;
            -webkit-animation-iteration-count: infinite;
        }
        @keyframes blink {
            0% { transform: rotate(0deg) scale(1, 1); }
            25% { transform: rotate(15deg) scale(1.2, 1.2); }
            50% { transform: rotate(-15deg) scale(1.2, 1.2); }
            100% { transform: rotate(0deg) scale(1, 1); }
        }
        @-webkit-keyframes blink {
            0% { transform: rotate(0deg) scale(1, 1); }
            25% { transform: rotate(15deg) scale(1.2, 1.2); }
            50% { transform: rotate(-15deg) scale(1.2, 1.2); }
            100% { transform: rotate(0deg) scale(1, 1); }
        }
    `;

    let tagNewRP = document.getElementById(ID_NEW_RP);
    if(tagNewRP) {
        let styleTag = document.createElement('style');
        styleTag.textContent = NEW_RP_STYLE;
        document.head.appendChild(styleTag);
        tagNewRP.classList.add(CLS_BLINK);
        tagNewRP.addEventListener('click', (e) => {
            tagNewRP.classList.remove(CLS_BLINK);
        });
    }

    if(POST_PAT.test(url) || REPLY_PAT.test(url)) {
        const postOptions = document.getElementById('post-option');
        if(postOptions) {
            const box = document.querySelector('input[name=atc_newrp]');
            box.setAttribute('checked', 'checked');
        }
    }
})();