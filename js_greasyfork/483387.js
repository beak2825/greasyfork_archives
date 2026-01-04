// ==UserScript==
// @name         作文网作文下载器（作文，论文，计划书，文章下载）【python学霸公众号】
// @namespace    Pyhton学霸
// @version      0.1
// @description  网页作文下载器
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/483387/%E4%BD%9C%E6%96%87%E7%BD%91%E4%BD%9C%E6%96%87%E4%B8%8B%E8%BD%BD%E5%99%A8%EF%BC%88%E4%BD%9C%E6%96%87%EF%BC%8C%E8%AE%BA%E6%96%87%EF%BC%8C%E8%AE%A1%E5%88%92%E4%B9%A6%EF%BC%8C%E6%96%87%E7%AB%A0%E4%B8%8B%E8%BD%BD%EF%BC%89%E3%80%90python%E5%AD%A6%E9%9C%B8%E5%85%AC%E4%BC%97%E5%8F%B7%E3%80%91.user.js
// @updateURL https://update.greasyfork.org/scripts/483387/%E4%BD%9C%E6%96%87%E7%BD%91%E4%BD%9C%E6%96%87%E4%B8%8B%E8%BD%BD%E5%99%A8%EF%BC%88%E4%BD%9C%E6%96%87%EF%BC%8C%E8%AE%BA%E6%96%87%EF%BC%8C%E8%AE%A1%E5%88%92%E4%B9%A6%EF%BC%8C%E6%96%87%E7%AB%A0%E4%B8%8B%E8%BD%BD%EF%BC%89%E3%80%90python%E5%AD%A6%E9%9C%B8%E5%85%AC%E4%BC%97%E5%8F%B7%E3%80%91.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function downloadText(url) {
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: function(response) {
                var parser = new DOMParser();
                var htmlDoc = parser.parseFromString(response.responseText, "text/html");
                var title = htmlDoc.querySelector("div.tit").textContent.trim();
                var content = htmlDoc.querySelector("div.content").textContent.trim();

                var fileContent = title + "\n" + content;
                var fileName = title + ".txt";

                GM_download({
                    url: "data:text/plain;charset=utf-8," + encodeURIComponent(fileContent),
                    name: fileName
                });
            }
        });
    }

    function createDownloadButton() {
        var currentUrl = window.location.href;
        if (currentUrl.includes('chazidian.com')) {
            var button = document.createElement("button");
            button.innerText = "下载作文（学霸免VIP）";
            button.style.backgroundColor = "#ffdf00";
            button.style.border = "none";
            button.style.borderRadius = "10%";
            button.style.color = "#fff";
            button.style.fontSize = "16px";
            button.style.padding = "10px 20px";
            button.style.position = "fixed";
            button.style.right = "50px";
            button.style.top = "50%";
            button.style.transform = "translateY(-50%)";
            button.addEventListener("click", function() {
                downloadText(currentUrl);
            });

            document.body.appendChild(button);
        }
    }

    createDownloadButton();
})();