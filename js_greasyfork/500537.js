// ==UserScript==
// @name         objection.lol气泡字体修复
// @namespace    http://tampermonkey.net/
// @version      9999999999999999999
// @description  objection lol气泡字体修复
// @author       You
// @match        https://objection.lol/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=objection.lol
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/500537/objectionlol%E6%B0%94%E6%B3%A1%E5%AD%97%E4%BD%93%E4%BF%AE%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/500537/objectionlol%E6%B0%94%E6%B3%A1%E5%AD%97%E4%BD%93%E4%BF%AE%E5%A4%8D.meta.js
// ==/UserScript==

(function() {

    // Your custom CSS
    const customCSS = `
        .chat-box-text[data-v-bb1dfb19] {
        font-family: 方正兰亭黑简体;
    font-weight: lighter;
        margin-top: 8px;
    letter-spacing: 2px;
    line-height: 46px;
        }
        .name-plate-text[data-v-bb1dfb19] {
        font-family: 方正宋黑简体 !important;
        top: 63.9% !important;
        font-size: 23px !important;
        }
    `;

    // Function to add the CSS
    function addCustomCSS(css) {
        const style = document.createElement('style');
        style.type = 'text/css';
        style.appendChild(document.createTextNode(css));
        document.head.appendChild(style);
    }

    // Add the CSS after the page has loaded
    window.addEventListener('load', () => {
        addCustomCSS(customCSS);
    });
})();