// ==UserScript==
// @name         issue-tools
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  get the ticket title
// @author       simpleyzh
// @match        https://wonder.atlassian.net/browse/**
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/443614/issue-tools.user.js
// @updateURL https://update.greasyfork.org/scripts/443614/issue-tools.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const text = "{issue_numbers} {title}";
    function insertButton() {
        const header = document.querySelector("._1reoewfl._18m9ewfl._1e0c1txw._4cvr1h6o._16jlkb7n._1looidpf._6myxv47k");
        if (!header) return;

        // 如果已经插过，就不重复插
        if (header.querySelector("#my-copy-btn")) return;

        const btn = document.createElement("button");
        btn.id = "my-copy-btn";
        btn.style.cssText = "padding-left:10px;font-size:17px;color:white;cursor:pointer;background-color:#0065ff;border-radius:4px;border:0px;";
        btn.innerText = "Copy";
        btn.addEventListener("click", () => {
            // 点击时动态获取数据
            const data = getCurrentPageData();
            if (data) {
                copyText(data);
            } else {
                console.log("未能获取到数据");
            }
        });

        header.appendChild(btn);
        console.log("按钮已插入");
    }

    // 新增函数：动态获取当前页面数据
    function getCurrentPageData() {
        try {
            const els = document.getElementsByClassName("css-1gd7hga");
            if (!els || els.length < 3) {
                console.log("未找到必要的页面元素");
                return null;
            }

            let numberStr = "";
            for (let i = 2; i < els.length && i < 4; i++) {
                if (i > 2) {
                    numberStr += '/';
                }
                let issue_number;
                if (i == els.length - 1) {
                    issue_number = els[i].innerText;
                } else {
                    let number = els[i].innerText;
                    if (isNaN(Number(number.substring(number.lastIndexOf('-') + 1)))) continue;
                    issue_number = number;
                }
                numberStr += issue_number;
            }

            const titleEl = document.querySelector("._1mouidpf._1dyz4jg8._1p1dglyw._11c8nf1z._syaz1fxt");
            if (!titleEl) {
                console.log("未找到标题元素");
                return null;
            }
            let title = titleEl.innerText;

            // 获取当前时间戳
            const timestamp = new Date().toLocaleString();

            // 构建返回的数据对象
            const pageData = {
                issue_numbers: numberStr,
                title: title,
                timestamp: timestamp,
                url: window.location.href
            };

            console.log("获取到的数据:", pageData);
            return text.replace("{issue_numbers}", numberStr).replace("{title}", title);
        } catch (error) {
            console.error("获取数据时出错:", error);
            return null;
        }
    }

    function copyText(value) {
        if (!value) {
            console.log("没有数据可复制");
            return;
        }

        // 使用现代 Clipboard API
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(value).then(() => {
                console.log("复制成功:", value);
                showCopySuccess();
            }).catch(err => {
                console.error("复制失败:", err);
                showCopyFailure();
            });
        } else {
            console.error("不支持 Clipboard API 或不在安全上下文中");
            showCopyFailure();
        }
    }

    // 显示复制失败提示
    function showCopyFailure() {
        const btn = document.getElementById("my-copy-btn");
        if (btn) {
            const originalText = btn.innerText;
            const originalBgColor = btn.style.backgroundColor;

            btn.innerText = "复制失败";
            btn.style.backgroundColor = "#dc3545"; // 红色表示失败

            setTimeout(() => {
                btn.innerText = originalText;
                btn.style.backgroundColor = originalBgColor || "#008cba8a"; // 恢复原始背景色
            }, 2000);
        }
    }

    // 新增函数：显示复制成功提示
    function showCopySuccess() {
        const btn = document.getElementById("my-copy-btn");
        if (btn) {
            const originalText = btn.innerText;
            const originalBgColor = btn.style.backgroundColor;

            btn.innerText = "Copied";
            btn.style.backgroundColor = "#28a745"; // 绿色表示成功

            setTimeout(() => {
                btn.innerText = originalText;
                btn.style.backgroundColor = originalBgColor || "#008cba8a"; // 恢复原始背景色
            }, 1500);
        }
    }

    // 用 MutationObserver 监听页面变化
    const observer = new MutationObserver(() => {
        insertButton();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // 初次运行
    insertButton();

})();
