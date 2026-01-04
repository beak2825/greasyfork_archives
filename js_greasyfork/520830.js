// ==UserScript==
// @license MIT
// @name         Новогоднее настроение
// @namespace    QIYANA_NewYear_Scripts
// @version      0.1
// @description  Заменяем лайки, сообщения и хайды на новогодний аналог
// @author       QIYANA
// @match        *://*.zelenka.guru/*
// @match        *://*.lolz.live/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/520830/%D0%9D%D0%BE%D0%B2%D0%BE%D0%B3%D0%BE%D0%B4%D0%BD%D0%B5%D0%B5%20%D0%BD%D0%B0%D1%81%D1%82%D1%80%D0%BE%D0%B5%D0%BD%D0%B8%D0%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/520830/%D0%9D%D0%BE%D0%B2%D0%BE%D0%B3%D0%BE%D0%B4%D0%BD%D0%B5%D0%B5%20%D0%BD%D0%B0%D1%81%D1%82%D1%80%D0%BE%D0%B5%D0%BD%D0%B8%D0%B5.meta.js
// ==/UserScript==


(function() {
    'use strict';

    const style = document.createElement('style');
    style.textContent = `
        .like2Icon {
            font-family: initial !important;
            background-image: none !important;
            display: inline-block !important;
        }
        .like2Icon::before {
            content: "⛄" !important;
            font-size: 16px !important;
            background: none !important;
        }
        .postCounterIcon {
            font-family: initial !important;
            background-image: none !important;
            display: inline-block !important;
        }
        .postCounterIcon::before {
            content: "📝" !important;
            font-size: 16px !important;
            background: none !important;
        }
        .hiddenReplyIcon {
            font-family: initial !important;
            background-image: none !important;
            display: inline-block !important;
        }
        .hiddenReplyIcon::before {
            content: "😌" !important;
            font-size: 16px !important;
            background: none !important;
        }
    `;
    document.documentElement.appendChild(style);
})();
