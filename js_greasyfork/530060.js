// ==UserScript==
// @name         arxiv html beautify
// @namespace    http://tampermonkey.net/
// @version      0.161
// @description  Beautify arxiv. 美化arxiv html版，修改字体等，沉浸式阅读，学术必备好帮手
// @author       dlutor
// @match        https://arxiv.org/html/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=arxiv.org
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/530060/arxiv%20html%20beautify.user.js
// @updateURL https://update.greasyfork.org/scripts/530060/arxiv%20html%20beautify.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.onload=function(){
        const header = document.querySelector("body > header.desktop_header");
        if (header) header.remove();
        const alertBtn = document.querySelector("#main > div > div.package-alerts.ltx_document > button > span");
        if (alertBtn) alertBtn.click();
        const style = document.createElement('style');
        style.innerHTML = `.ltx_p, .ltx_abstract  .ltx_p{ font-family: 'STIX Two Math';}
        .ltx_transformed_inner>.ltx_p{ font-family: auto;}
        .ltx_text.ltx_ref_title {display: flex;}
        .ltx_tocentry_section>.ltx_ref>.ltx_ref_title>.ltx_tag {margin-right: 0rem;}
        body:after {content: ""; position: inherit;}
        nav.ltx_TOC {padding-top: 15px;}
        .ltx_page_main > .ltx_page_content {margin: 10px 1em 3.5em 1em;}`;
        document.head.appendChild(style);
        document.querySelector("#openForm").remove();
    }

    // Your code here...
})();