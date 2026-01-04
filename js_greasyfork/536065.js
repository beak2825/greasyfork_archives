// ==UserScript==
// @name         提取提交记录
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  --提取提交记录
// @author       szt
// @match        http://192.168.101.53/*/commits/*
// @match        https://192.168.101.53/*/commits/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/536065/%E6%8F%90%E5%8F%96%E6%8F%90%E4%BA%A4%E8%AE%B0%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/536065/%E6%8F%90%E5%8F%96%E6%8F%90%E4%BA%A4%E8%AE%B0%E5%BD%95.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // 保存所有加载的提交记录
    let allCommits = [];
    // 标记是否正在加载更多
    let isLoading = false;

    const floatButton = document.createElement("button");
    floatButton.textContent = "提取记录";
    floatButton.style.position = "fixed";
    floatButton.style.bottom = "20px";
    floatButton.style.right = "20px";
    floatButton.style.zIndex = "9999";
    floatButton.style.padding = "10px 15px";
    floatButton.style.backgroundColor = "#4CAF50";
    floatButton.style.color = "white";
    floatButton.style.border = "none";
    floatButton.style.borderRadius = "5px";
    floatButton.style.cursor = "pointer";
    floatButton.style.fontWeight = "bold";
    floatButton.style.boxShadow = "0 2px 5px rgba(0,0,0,0.3)";

    floatButton.addEventListener("mouseover", function () {
        this.style.backgroundColor = "#45a049";
    });

    floatButton.addEventListener("mouseout", function () {
        this.style.backgroundColor = "#4CAF50";
    });

    floatButton.addEventListener("click", extractCommitInfo);

    document.body.appendChild(floatButton);

    window.addEventListener("scroll", function () {
        if (isLoading) return;

        const scrollHeight = document.documentElement.scrollHeight;
        const scrollTop =
            document.documentElement.scrollTop || document.body.scrollTop;
        const clientHeight = document.documentElement.clientHeight;

        // 当滚动到距离底部100px时，触发加载更多
        if (scrollHeight - scrollTop - clientHeight < 100) {
            isLoading = true;
            // 等待内容加载完成后更新提取的记录
            setTimeout(() => {
                if (document.getElementById("commit-extract-panel")) {
                    extractCommitInfo();
                }
                isLoading = false;
            }, 1000);
        }
    });

    function extractCommitInfo() {
        const msgDomList = document.querySelectorAll(
            "div.commit-detail.flex-list > div.commit-content > a"
        );
        const msgList = Array.from(msgDomList).map((ele) => ele.innerText);

        // 更新全局提交记录
        allCommits = msgList;

        const mergeIndexes = [];
        for (let i = 0; i < msgList.length; i++) {
            if (msgList[i] === "Merge branch 'development' into 'main'") {
                mergeIndexes.push(i);
            }
        }

        const result = [];
        for (let i = 0; i < mergeIndexes.length; i++) {
            const startIndex = mergeIndexes[i];
            const endIndex =
                i < mergeIndexes.length - 1
                    ? mergeIndexes[i + 1]
                    : msgList.length;

            if (startIndex < endIndex) {
                const section = msgList.slice(startIndex, endIndex);
                result.push("--- 合并 #" + (i + 1) + " ---");
                result.push(...section);
                result.push("");
            }
        }

        console.log("已加载提交记录总数: " + allCommits.length);
        console.log(result.join("\n"));

        const existingPanel = document.getElementById("commit-extract-panel");
        if (existingPanel) {
            existingPanel.remove();
        }

        const displayDiv = document.createElement("div");
        displayDiv.id = "commit-extract-panel";
        displayDiv.style.position = "fixed";
        displayDiv.style.top = "20px";
        displayDiv.style.right = "20px";
        displayDiv.style.width = "700px";
        displayDiv.style.maxHeight = "80vh";
        displayDiv.style.overflow = "auto";
        displayDiv.style.backgroundColor = "white";
        displayDiv.style.border = "1px solid #ccc";
        displayDiv.style.padding = "10px";
        displayDiv.style.zIndex = "9999";
        displayDiv.style.fontFamily = "monospace";
        displayDiv.style.fontSize = "14px";
        displayDiv.style.fontWeight = "bold";
        displayDiv.style.color = "#000";
        displayDiv.style.whiteSpace = "pre-wrap";
        displayDiv.style.boxShadow = "0 0 10px rgba(0,0,0,0.2)";

        const titleBar = document.createElement("div");
        titleBar.style.display = "flex";
        titleBar.style.justifyContent = "space-between";
        titleBar.style.marginBottom = "10px";
        titleBar.style.borderBottom = "1px solid #ccc";

        const title = document.createElement("div");
        title.textContent = "提交信息列表 (共" + allCommits.length + "条)";
        title.style.fontWeight = "bold";
        title.style.color = "#000";

        const closeButton = document.createElement("button");
        closeButton.textContent = "关闭";
        closeButton.style.background = "none";
        closeButton.style.border = "none";
        closeButton.style.cursor = "pointer";
        closeButton.style.fontWeight = "bold";
        closeButton.style.color = "#000";
        closeButton.onclick = () => displayDiv.remove();

        titleBar.appendChild(title);
        titleBar.appendChild(closeButton);
        displayDiv.appendChild(titleBar);

        const content = document.createElement("div");
        content.textContent = result.join("\n");
        content.style.fontWeight = "bold";
        content.style.color = "#000";
        displayDiv.appendChild(content);

        document.body.appendChild(displayDiv);
    }
})();
