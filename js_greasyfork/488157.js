// ==UserScript==
// @name         nodeseek屏蔽特定分类的帖子
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  屏蔽nodeseek论坛特定分类的帖子
// @author       我和GPT
// @match        https://www.nodeseek.com
// @match        https://www.nodeseek.com/page-*
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/488157/nodeseek%E5%B1%8F%E8%94%BD%E7%89%B9%E5%AE%9A%E5%88%86%E7%B1%BB%E7%9A%84%E5%B8%96%E5%AD%90.user.js
// @updateURL https://update.greasyfork.org/scripts/488157/nodeseek%E5%B1%8F%E8%94%BD%E7%89%B9%E5%AE%9A%E5%88%86%E7%B1%BB%E7%9A%84%E5%B8%96%E5%AD%90.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 检查GM_setValue和GM_getValue是否可用
    function isGMAvailable() {
        return (typeof GM_setValue !== 'undefined') && (typeof GM_getValue !== 'undefined');
    }

    // 存储数据
    function saveData(key, value) {
        if (isGMAvailable()) {
            try {
                GM_setValue(key, value);
            } catch (error) {
                console.error("保存数据到GM失败", error);
                // 回退到localStorage
                localStorage.setItem(key, value);
            }
        } else {
            localStorage.setItem(key, value);
        }
    }

    // 检索数据
    function loadData(key) {
        if (isGMAvailable()) {
            try {
                return GM_getValue(key);
            } catch (error) {
                console.error("从GM加载数据失败", error);
                // 回退到localStorage
                return localStorage.getItem(key);
            }
        } else {
            return localStorage.getItem(key);
        }
    }

    // 添加屏蔽设置按钮
    var headerDiv = document.querySelector("#nsk-head");
    var btn = document.createElement("button");
    btn.innerHTML = "屏蔽设置";
    btn.classList.add("btn");
    btn.style = "margin-left: 10px;";
    headerDiv.appendChild(btn);

    // 创建设置面板
    var panel = document.createElement("div");
    panel.innerHTML = `
    <div id="ns-block-categories-setting">
      <h2>屏蔽分类设置</h2>
      <p>屏蔽分类列表（分类名称用英文逗号分隔）</p>
      <textarea id='ns-block-categories' style='width: 98%; height: 20vh;'></textarea>
      <br/>
      <div style="display: flex;justify-content: end;margin:10px">
        <button id='ns-block-categories-btn-save' class='btn' style="margin:0 10px">保存</button>
        <button id='ns-block-categories-btn-cancel' class='btn'>取消</button>
      </div>
    </div>
    `;
    panel.style = `
    position: fixed;
    top: 10vh;
    left: 10vw;
    z-index: 9999;
    display: none;
    width: 80vw;
    background-color: rgba(255, 255, 255, 0.8);
    border-radius: 10px;
    backdrop-filter: blur(10px);
    padding:20px;
    `;
    document.body.appendChild(panel);

    // 显示和隐藏设置面板
    btn.onclick = function() {
        panel.style.display = "block";
        document.getElementById("ns-block-categories").value = loadData("ns-block-categories") || "";
    };
    document.getElementById("ns-block-categories-btn-save").onclick = function() {
        saveData("ns-block-categories", document.getElementById("ns-block-categories").value);
        panel.style.display = "none";
        location.reload(); // 保存后刷新页面以应用屏蔽设置
    };
    document.getElementById("ns-block-categories-btn-cancel").onclick = function() {
        panel.style.display = "none";
    };

    // 屏蔽特定分类的帖子
    var blockedCategories = loadData("ns-block-categories");
    if (blockedCategories) {
        blockedCategories = blockedCategories.split(",");
        var posts = document.querySelectorAll("#nsk-body-left > ul > li");
        posts.forEach(function(post) {
            var category = post.querySelector("div > div.post-info > a.info-item.post-category");
            if (category && blockedCategories.includes(category.textContent.trim())) {
                post.style.display = "none";
            }
        });
    }
})();