// ==UserScript==
// @name         一键候选投票
// @version      3.2
// @description  一键候选投票，支持多个域名，自动关闭弹出窗口，适配大部分NP架构且带有 offers.php 的可投票候选页面。
// @author       StarRaven
// @match        *://*/*offers.php*
// @namespace https://greasyfork.org/users/1171837
// @downloadURL https://update.greasyfork.org/scripts/534134/%E4%B8%80%E9%94%AE%E5%80%99%E9%80%89%E6%8A%95%E7%A5%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/534134/%E4%B8%80%E9%94%AE%E5%80%99%E9%80%89%E6%8A%95%E7%A5%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 用户设置：是否在遇到第一个已投票候选时继续尝试
    var continueOnVoted = false;

    // 获取当前域名
    var currentDomain = window.location.hostname;

    // 创建按钮和结果显示区域
    var zNode = document.createElement('div');
    zNode.innerHTML = `
        <div style="margin-bottom: 20px;">
            <button id="myButton" type="button" style="width:200px;height:30px;">自 动 投 票</button>
            <button id="toggleContinue" type="button" style="width:200px;height:30px;margin-top:10px;">
                继续投票: ${continueOnVoted ? "开启" : "关闭"}
            </button>
            <div id="voteResults" style="margin-top: 20px; padding: 10px; border: 1px solid #ccc; background-color: #f9f9f9; width: 80%; max-width: 800px; margin-left: auto; margin-right: auto;">
                <strong>投票结果：</strong>
                <ul id="voteResultsList" style="list-style-type: none; padding-left: 0; text-align: left;"></ul>
            </div>
        </div>
    `;
    zNode.setAttribute('id', 'myContainer');
    var parNode = document.getElementById("outer") || document.querySelector("h1");
    if (parNode) {
        parNode.insertBefore(zNode, parNode.childNodes[0]);
    }

    // 添加事件监听器
    document.getElementById("myButton").addEventListener("click", ButtonClickAction, false);
    document.getElementById("toggleContinue").addEventListener("click", toggleContinueAction, false);

    var allURL = [];
    var allTitles = [];
    var allSubtitles = [];

    // 切换是否继续投票的设置
    function toggleContinueAction() {
        continueOnVoted = !continueOnVoted;
        document.getElementById("toggleContinue").innerText = `继续投票: ${continueOnVoted ? "开启" : "关闭"}`;
        console.log(`继续投票设置已${continueOnVoted ? "开启" : "关闭"}`);
    }

    // 显示投票结果到页面
    function displayVoteResult(result) {
        var resultList = document.getElementById("voteResultsList");
        var listItem = document.createElement("li");
        listItem.innerHTML = result; // 使用 innerHTML 支持换行符
        listItem.style.textAlign = "left"; // 左对齐每一行文字
        resultList.appendChild(listItem);
    }

    // 打开投票页面并检查状态
    async function openVotePage(url, index) {
        return new Promise((resolve) => {
            if (currentDomain === "totheglory.im") {
                // 适配 TTG 架构的投票逻辑
                var xhr = new XMLHttpRequest();
                xhr.open("GET", url, true);
                xhr.onreadystatechange = function() {
                    if (xhr.readyState === 4 && xhr.status === 200) {
                        var data = xhr.responseText;
                        if (data == "ok") {
                            var prefix = "投票成功: ";
                            var spaces = "&nbsp;".repeat(16); // 16 个空格
                            displayVoteResult(`${prefix}${allTitles[index]}${allSubtitles[index] ? "<br>" + spaces + allSubtitles[index] : ""}`);
                            resolve(false); // 未遇到已投票候选
                        } else if (data == "already") {
                            var prefix = "已经投过票: ";
                            var spaces = "&nbsp;".repeat(20); // 20 个空格
                            displayVoteResult(`${prefix}${allTitles[index]}${allSubtitles[index] ? "<br>" + spaces + allSubtitles[index] : ""}`);
                            resolve(true); // 遇到已投票候选
                        } else {
                            var prefix = "投票失败: ";
                            var spaces = "&nbsp;".repeat(16); // 16 个空格
                            displayVoteResult(`${prefix}${allTitles[index]}${allSubtitles[index] ? "<br>" + spaces + allSubtitles[index] : ""}`);
                            resolve(false); // 未遇到已投票候选
                        }
                    }
                };
                xhr.send();
            } else {
                // 适配其他架构的投票逻辑：使用 fetch 发送请求
                fetch(url)
                    .then(response => response.text())
                    .then(data => {
                        var prefix, spaces;
                        if (data.includes("你已经投过票，每个候选只能投一次。")) {
                            prefix = "已经投过票: ";
                            spaces = currentDomain === "ptchdbits.co" ? "&nbsp;".repeat(19) : "&nbsp;".repeat(20); // ptchdbits.co 使用 19 个空格，其他域名使用 20 个空格
                        } else {
                            prefix = "投票成功: ";
                            spaces = currentDomain === "ptchdbits.co" ? "&nbsp;".repeat(19) : "&nbsp;".repeat(16); // ptchdbits.co 使用 19 个空格，其他域名使用 16 个空格
                        }
                        displayVoteResult(`${prefix}${allTitles[index]}${allSubtitles[index] ? "<br>" + spaces + allSubtitles[index] : ""}`);
                        resolve(data.includes("你已经投过票，每个候选只能投一次。")); // 返回是否遇到已投票候选
                    })
                    .catch(error => {
                        var prefix = "投票失败: ";
                        var spaces = currentDomain === "ptchdbits.co" ? "&nbsp;".repeat(19) : "&nbsp;".repeat(16); // ptchdbits.co 使用 19 个空格，其他域名使用 16 个空格
                        displayVoteResult(`${prefix}${allTitles[index]}${allSubtitles[index] ? "<br>" + spaces + allSubtitles[index] : ""}`);
                        resolve(false); // 未遇到已投票候选
                    });
            }
        });
    }

    // 依次处理所有投票链接
    async function processVoteLinks() {
        for (let i = 0; i < allURL.length; i++) {
            const hasVoted = await openVotePage(allURL[i], i);
            if (hasVoted && !continueOnVoted) {
                displayVoteResult("遇到已投票候选，停止投票。");
                break;
            }
        }
    }

    // 按钮点击事件
    function ButtonClickAction(zEvent) {
        allURL = []; // 清空之前的投票链接
        allTitles = []; // 清空之前的标题
        allSubtitles = []; // 清空之前的副标题
        document.getElementById("voteResultsList").innerHTML = ""; // 清空之前的投票结果

        if (currentDomain === "totheglory.im") {
            // 适配 TTG 架构的投票链接
            var aDom = document.querySelectorAll("a[onclick^='return voteup']");
            for (var i = 0, len = aDom.length; i < len; i++) {
                allURL.push(aDom[i].href);
                // 获取主标题和副标题
                var titleElement = aDom[i].closest("tr").querySelector("td:nth-child(2)");
                var titleText = titleElement ? titleElement.textContent.trim() : "";
                // 提取主标题和副标题
                var title = titleText.replace(/\[.*\]/, "").trim(); // 主标题
                var subtitleMatch = titleText.match(/\[(.*)\]/); // 副标题
                var subtitle = subtitleMatch ? subtitleMatch[1] : "";
                allTitles.push(title);
                allSubtitles.push(subtitle);
            }
        } else if (currentDomain === "pterclub.com") {
            // 适配 pterclub.com 的投票链接
            var aDom = document.getElementsByTagName("a");
            for (var i = 0, len = aDom.length; i < len; i++) {
                if ((aDom[i].href).indexOf("vote=yeah") > 0) {
                    allURL.push(aDom[i].href);
                    // 获取主标题和副标题
                    var titleText = aDom[i].closest("tr").querySelector("td:nth-child(2) a").getAttribute("title");
                    if (titleText) {
                        var titleParts = titleText.split("<br>");
                        var title = titleParts[0].trim(); // 主标题
                        var subtitle = titleParts[1] ? titleParts[1].trim() : ""; // 副标题
                        allTitles.push(title);
                        allSubtitles.push(subtitle);
                    }
                }
            }
        } else if (currentDomain === "ptchdbits.co") {
            // 适配 ptchdbits.co 的投票链接
            var aDom = document.getElementsByTagName("a");
            for (var i = 0, len = aDom.length; i < len; i++) {
                if ((aDom[i].href).indexOf("vote=yeah") > 0) {
                    allURL.push(aDom[i].href);
                    // 获取主标题和副标题
                    var row = aDom[i].closest("tr");
                    var titleElement = row.querySelector("td:nth-child(2) b");
                    var subtitleElement = row.querySelector("td:nth-child(2) font.subtitle");
                    var title = titleElement ? titleElement.textContent.trim() : "未知标题";
                    var subtitle = subtitleElement ? subtitleElement.textContent.trim() : "";
                    allTitles.push(title);
                    allSubtitles.push(subtitle);
                }
            }
        } else {
            // 适配其他架构的投票链接
            var aDom = document.getElementsByTagName("a");
            for (var i = 0, len = aDom.length; i < len; i++) {
                if ((aDom[i].href).indexOf("vote=yeah") > 0) {
                    allURL.push(aDom[i].href);
                    // 获取主标题和副标题
                    var row = aDom[i].closest("tr");
                    var titleElement = row.querySelector("td:nth-child(2) b");
                    var subtitleElement = row.querySelector("td:nth-child(2) font.subtitle");
                    var title = titleElement ? titleElement.textContent.trim() : "未知标题";
                    var subtitle = subtitleElement ? subtitleElement.textContent.trim() : "";
                    allTitles.push(title);
                    allSubtitles.push(subtitle);
                }
            }
        }

        if (allURL.length > 0) {
            processVoteLinks();
        } else {
            displayVoteResult("没有找到可投票的链接。");
        }
    }
})();
