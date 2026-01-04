// ==UserScript==
// @name         Javbus在线播放
// @namespace    Violentmonkey Scripts
// @version      3.1
// @description  在磁力链接下方增加【在线播放】地址
// @match        https://www.javbus.com/*
// @grant        GM_xmlhttpRequest
// @license      All Rights Reserved
// @downloadURL https://update.greasyfork.org/scripts/520095/Javbus%E5%9C%A8%E7%BA%BF%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/520095/Javbus%E5%9C%A8%E7%BA%BF%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 如果当前页面包含 "forum"，则不执行脚本
    if (window.location.href.includes("forum")) {
        return;
    }

    // 提取视频的识别码
    var codeElement = document.querySelector('.col-md-3.info span[style="color:#CC0000;"]');
    if (codeElement) {
        var code = codeElement.innerText.trim().toLowerCase(); // 确保识别码为小写
        console.log('识别码: ' + code);

        // 创建在线播放区域
        var playArea = createPlayArea(code);

        // 将播放区域插入到磁力链接容器下方
        var magnetTable = document.getElementById("magnet-table");
        if (magnetTable) {
            var row = document.createElement("tr");
            var cell = document.createElement("td");
            cell.colSpan = 3;
            cell.appendChild(playArea);
            row.appendChild(cell);
            magnetTable.parentNode.insertBefore(row, magnetTable.nextSibling);
        }
    }

    /**
     * 创建在线播放区域
     * @param {string} code 识别码
     * @returns {HTMLElement} 播放区域元素
     */
    function createPlayArea(code) {
        var playArea = document.createElement("div");
        playArea.className = "play-area";
        playArea.style.border = "1px solid #ccc";
        playArea.style.padding = "15px";
        playArea.style.marginTop = "15px";
        playArea.style.borderRadius = "8px";
        playArea.style.backgroundColor = "#ffffff";
        playArea.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";

        var title = document.createElement("h3");
        title.textContent = "在线播放";
        title.style.marginBottom = "15px";
        title.style.color = "#333";
        title.style.fontFamily = "Arial, sans-serif";

        var linkList = document.createElement("ul");
        linkList.className = "link-list";
        linkList.style.listStyle = "none";
        linkList.style.padding = "0";

        var links = [
            { name: "Javgg", url: `https://javgg.net/jav/sdam-074/${code}` },
            { name: "Javmost", url: `https://www5.javmost.com/${code}` },
            { name: "Njav", url: `https://njav.tv/zh/v/${code}` },
            { name: "Jable", url: `https://jable.tv/videos/${code}/` }
        ];

        links.forEach(link => {
            var listItem = createLink(link.name, link.url);
            linkList.appendChild(listItem);
            checkLinkStatus(listItem); // 检查超链接状态
        });

        playArea.appendChild(title);
        playArea.appendChild(linkList);
        return playArea;
    }

    /**
     * 创建超链接元素
     * @param {string} title 链接标题
     * @param {string} url 链接地址
     * @returns {HTMLElement} 超链接列表项
     */
    function createLink(title, url) {
        var link = document.createElement("li");
        link.style.marginBottom = "10px";

        var linkText = document.createElement("a");
        linkText.textContent = title;
        linkText.href = url;
        linkText.target = "_blank";
        linkText.style.textDecoration = "none";
        linkText.style.color = "#007BFF";
        linkText.style.fontWeight = "bold";
        linkText.style.fontFamily = "Arial, sans-serif";
        linkText.style.transition = "color 0.3s";

        linkText.addEventListener("mouseover", function() {
            linkText.style.color = "#0056b3";
        });

        linkText.addEventListener("mouseout", function() {
            linkText.style.color = "#007BFF";
        });

        var linkTitle = document.createElement("span");
        linkTitle.style.marginLeft = "10px";
        linkTitle.style.fontSize = "0.9em";
        linkTitle.style.color = "#666";

        link.appendChild(linkText);
        link.appendChild(linkTitle);
        return link;
    }

    /**
     * 检查超链接状态并获取标题
     * @param {HTMLElement} link 链接列表项
     */
    function checkLinkStatus(link) {
        GM_xmlhttpRequest({
            method: "HEAD",
            url: link.firstChild.href,
            onload: function(response) {
                if (response.status === 200) {
                    link.firstChild.style.color = "green";
                    link.lastChild.textContent = " ✅";
                    getLinkTitle(link.firstChild.href, link.lastChild);
                } else {
                    link.firstChild.style.color = "red";
                    link.lastChild.textContent = " ❌";
                }
            }
        });
    }

    /**
     * 获取链接页面标题
     * @param {string} url 链接地址
     * @param {HTMLElement} titleElement 用于显示标题的元素
     */
    function getLinkTitle(url, titleElement) {
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: function(response) {
                var html = response.responseText;
                var titleMatch = html.match(/<title>(.*?)<\/title>/i);
                if (titleMatch && titleMatch.length > 1) {
                    titleElement.textContent += " - " + titleMatch[1];
                }
            }
        });
    }
})();
