// ==UserScript==
// @name         去除B站搜索框中的文字
// @namespace    http://tampermonkey.net/
// @version      0.3.0
// @description  删除B站（哔哩哔哩）搜索框中的文字。
// @author       grch12
// @match        *.bilibili.com/*
// @icon         none
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/458020/%E5%8E%BB%E9%99%A4B%E7%AB%99%E6%90%9C%E7%B4%A2%E6%A1%86%E4%B8%AD%E7%9A%84%E6%96%87%E5%AD%97.user.js
// @updateURL https://update.greasyfork.org/scripts/458020/%E5%8E%BB%E9%99%A4B%E7%AB%99%E6%90%9C%E7%B4%A2%E6%A1%86%E4%B8%AD%E7%9A%84%E6%96%87%E5%AD%97.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function doSearch(text) {
        var link = document.createElement("a");
        link.href = "https://search.bilibili.com/all?keyword=" + encodeURIComponent(text);
        link.target = "_blank";
        link.click();
    }

    var observer = new MutationObserver(() => {
        var normalInput = document.querySelector(".nav-search-input") || document.querySelector(".nav-search-keyword");
        if (normalInput) {
            var isNewHp = normalInput.classList.contains("nav-search-input");
            observer.disconnect();
            normalInput.remove();
            var input = document.createElement("input");
            var form = document.querySelector("form#nav-searchform") || document.querySelector("form#nav_searchform");
            input.autocomplete = "off";
            input.placeholder = "搜索...";
            if (isNewHp) {
                input.classList.add("nav-search-input");
                input.style.height = "100%";
                input.style.borderRadius = "6px";
                input.style.margin = "0";
                input.style.paddingLeft = "8px";
                input.name = "keyword";
                document.querySelector(".nav-search-content").insertAdjacentElement("afterbegin", input);
            } else {
                input.classList.add("nav-search-keyword");
                form.insertAdjacentElement("afterbegin", input);
            }
            document.querySelector(".nav-search-btn").addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                doSearch(input.value);
            }, true);
            form.addEventListener("submit", (e) => {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                doSearch(input.value);
            }, true);
        }
    });
    observer.observe(document.body, { childList: true });
})()