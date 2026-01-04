// ==UserScript==
// @name         Google Scholar Bibtex Fetcher
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Fetch and display bibtex references on Google Scholar search results
// @author       ChatGPT & Kenny
// @match        https://scholar.google.com/scholar*
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/473851/Google%20Scholar%20Bibtex%20Fetcher.user.js
// @updateURL https://update.greasyfork.org/scripts/473851/Google%20Scholar%20Bibtex%20Fetcher.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function showTemporaryMessage(buttonElement, message) {
        // 创建一个临时消息元素
        var msgElement = document.createElement('span');
        msgElement.innerText = message;
        msgElement.style.marginLeft = '10px';
        msgElement.style.color = 'green';
        buttonElement.parentNode.insertBefore(msgElement, buttonElement.nextSibling);


        // 几秒钟后移除消息
        setTimeout(function() {
            msgElement.remove();
        }, 3000); // 3秒后消失
    }
    function fetchBibtex(url, callback) {
        var res = GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: function(response) {
                let parser = new DOMParser();
                let doc = parser.parseFromString(response.responseText, "text/html");
                console.log(response.responseText)
                let bibtexLinkElement = Array.from(doc.querySelectorAll('a')).find(link => link.textContent.trim() === "BibTeX");
                if (bibtexLinkElement) {
                    let bibtexLink = bibtexLinkElement.href;
                    // 使用GM_xmlhttpRequest再次打开这个链接
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: bibtexLink,
                        onload: function(innerResponse) {
                            let bibtex = innerResponse.responseText
                            callback(bibtex);
                        }
                    });
                } else {
                    console.log("BibTeX link not found");
                }
            }
        });
    }
    document.querySelectorAll('.gs_ri').forEach(function(item) {
        // 创建一个新的按钮
        var btn = document.createElement('button');
        btn.innerText = '显示并复制BibTex';
        // 当按钮被点击时
        btn.onclick = function() {
            // 查找“相关文章”链接
            var relatedLink = item.querySelector('a[href^="/scholar?q=related:"]');
            if (relatedLink) {
                var match = relatedLink.getAttribute('href').match(/related:(.*?):scholar.google.com/);
                if (match && match[1]) {
                    // 构建新的链接
                    var newLink = "https://scholar.google.com/scholar?q=info:" + match[1] + ":scholar.google.com/&output=cite&scirp=0&hl=zh-CN";
                    // 复制链接到剪贴板
                    fetchBibtex(newLink, function(bibtex) {
                        var bibtexElement = document.createElement('pre');
                        bibtexElement.innerText = bibtex;
                        bibtexElement.style.padding = '10px';
                        bibtexElement.style.marginTop = '10px';
                        item.appendChild(bibtexElement);
                        // 创建一个临时的input元素，将BibTeX文本设置为其值
                        var tempTextarea = document.createElement('textarea');
                        tempTextarea.style.opacity = '0'; // 使其不可见
                        tempTextarea.value = bibtex;
                        document.body.appendChild(tempTextarea);
                        tempTextarea.select();
                        // 复制BibTeX文本到剪贴板
                        document.execCommand('copy');
                        document.body.removeChild(tempTextarea);
                        showTemporaryMessage(btn, '已复制');
                    });
                }
            } else {
                alert('未找到BibTex！');
            }
        };

        // 将按钮添加到条目中
        var targetLocation = item.querySelector('div.gs_fl.gs_flb');
        if (targetLocation) {
            targetLocation.appendChild(btn);
        } else {
            console.log("指定的位置未找到，按钮未添加");
        }
    });

})();
