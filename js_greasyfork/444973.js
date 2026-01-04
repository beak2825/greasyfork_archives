// ==UserScript==
// @name         ScriptsForMsDocToc
// @namespace    mailto:fish404hsif@gmail.com
// @version      0.7.2
// @license      MIT
// @description  MSDN TOC Enhance
// @description:zh 微软文档目录功能新增
// @author       fish-404
// @run-at       document-idle
// @match        *://learn.microsoft.com/*
// @exclude      *://learn.microsoft.com/*/training/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/444973/ScriptsForMsDocToc.user.js
// @updateURL https://update.greasyfork.org/scripts/444973/ScriptsForMsDocToc.meta.js
// ==/UserScript==

(function () {
    'use strict';
    setTocContainerSticky();
    clickShowMoreBtn();
    mvSave2CollectionBtn();
})();

function logError(exception, customMsg) {
    console.error(`${customMsg} \n ${exception.name}: ${exception.message}`);
}

function setTocContainerSticky() {
    try {
        document.getElementById("affixed-right-container").setAttribute("style", "position: sticky; top: 3vh");
    }
    catch (e) {
        logError(e, "Error: set to ccontainer sticky failed!");
    }
}

function clickShowMoreBtn() {
    try {
        document.querySelector("#affixed-right-container .show-more-text").parentElement.click();
    }
    catch (e) {
        logError(e, "Error: click show more button failed!");
    }

    try {
        document.querySelector('#right-rail-in-this-article-list .is-expanded a').setAttribute("style", "outline: 0");
    }
    catch (e) {
        logError(e, "Error: hide dash outline failed!");
    }
}

function mvSave2CollectionBtn() {
    try {
        document.querySelector('div[data-bi-name="right-column"] article div').insertAdjacentElement('beforeend', document.querySelector('button[data-bi-name="collection"]'));
    }
    catch (e) {
        logError(e, "Error: move save to collection button failed!");
    }
}
