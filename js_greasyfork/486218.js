// ==UserScript==
// @name         谷歌学术bib参考文献快速复制
// @namespace    https://scholar.google.com/
// @version      0.2
// @description  谷歌学术bib参考文献快速复制到剪切板
// @author       xixiha
// @license      GPL-3.0 License
// @match        *://*.scholar.google.com/*
// @match        *://*.scholar.google.com.hk/*
// @require      https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/486218/%E8%B0%B7%E6%AD%8C%E5%AD%A6%E6%9C%AFbib%E5%8F%82%E8%80%83%E6%96%87%E7%8C%AE%E5%BF%AB%E9%80%9F%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/486218/%E8%B0%B7%E6%AD%8C%E5%AD%A6%E6%9C%AFbib%E5%8F%82%E8%80%83%E6%96%87%E7%8C%AE%E5%BF%AB%E9%80%9F%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==
window.addEventListener('load', function () {
    var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            mutation.addedNodes.forEach(function (node) {
                if (node.id === "gs_citi") {
                    var bib = node.firstChild;
                    bib.innerHTML = bib.innerHTML + " (点击复制)";
                    var link = bib.href;
                    bib.href = "#";
                    bib.onclick = function () {
                        GM_xmlhttpRequest({
                            method: "GET",
                            url: link,
                            onload: function (response) {
                                GM_setClipboard(response.responseText);
                                bib.innerHTML = "复制成功！";
                            }
                        });
                    }
                }
            });
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
});
