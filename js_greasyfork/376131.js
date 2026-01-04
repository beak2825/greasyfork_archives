// ==UserScript==
// @name         KAO#1:ruanyifeng
// @namespace    https://www.bennythink.com/
// @version      0.4
// @description  浏览阮一峰博客时，不必关闭广告屏蔽器。
// @author       BennyThink
// @supportURL   https://github.com/BennyThink/KeepABPOn
// @license      MIT
// @match        *://*.ruanyifeng.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376131/KAO1%3Aruanyifeng.user.js
// @updateURL https://update.greasyfork.org/scripts/376131/KAO1%3Aruanyifeng.meta.js
// ==/UserScript==

var content = document.querySelector('#main-content').cloneNode(true);

function loadjscssfile(filename) {
    var fileref = document.createElement("link");
    fileref.setAttribute("rel", "stylesheet");
    fileref.setAttribute("type", "text/css");
    fileref.setAttribute("href", filename);
    if (typeof fileref != "undefined")
        document.getElementsByTagName("head")[0].appendChild(fileref)
}

// credits goes for https://github.com/BennyThink/KeepABPOn/issues/5
function ruanyifeng() {
    document.getElementsByClassName('asset-meta')[0].nextElementSibling.style = 'display:none';
    document.querySelector('article.hentry').insertBefore(content, document.querySelector('.asset-footer'));
}

setTimeout(ruanyifeng, 1001);

loadjscssfile('/static/themes/theme_scrapbook/theme_scrapbook.css');



