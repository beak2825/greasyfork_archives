// ==UserScript==
// @name         自动评教
// @namespace    http://tampermonkey.net/
// @version      2.6
// @description  一键自动完成评教任务，自动填写评分，自动提交并关闭页面，提升效率
// @author       ianwusb
// @match        http://zhjw.qfnu.edu.cn/jsxsd/framework/xsMain.jsp
// @match        http://zhjw.qfnu.edu.cn/jsxsd/xspj/xspj_list.do*
// @match        http://zhjw.qfnu.edu.cn/jsxsd/xspj/xspj_edit.do?*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539902/%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99.user.js
// @updateURL https://update.greasyfork.org/scripts/539902/%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // === 配置 ===
    const evalURL = "http://zhjw.qfnu.edu.cn/jsxsd/xspj/xspj_list.do?pj0502id=90FC36409E9645E7973F752FCD15D88A&xnxq01id=2024-2025-2&pj01id=0C6E4478243641DEB09512383F76A80C";

    // 是否跳过已处理的评教列表页面重复打开链接（0不跳过，1跳过）
    const skipListReload = 1;

    // 需要自动点击的评分选项
    const targetElementIds = [
        'pj0601id_2_2', 'pj0601id_3_1', 'pj0601id_4_2',
        'pj0601id_5_2', 'pj0601id_6_2', 'pj0601id_7_2',
        'pj0601id_8_2', 'pj0601id_9_2', 'pj0601id_10_2',
        'pj0601id_11_2'
    ];

    const url = window.location.href;

    // === Step 1: 首页按钮启动 ===
    if (url === "http://zhjw.qfnu.edu.cn/jsxsd/framework/xsMain.jsp") {
        const button = document.createElement('button');
        button.innerText = "开始自动评教 ▶";
        button.style.position = 'fixed';
        button.style.bottom = '30px';
        button.style.right = '30px';
        button.style.zIndex = '9999';
        button.style.padding = '12px 18px';
        button.style.backgroundColor = '#28a745';
        button.style.color = '#fff';
        button.style.border = 'none';
        button.style.borderRadius = '8px';
        button.style.fontSize = '16px';
        button.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
        button.style.cursor = 'pointer';
        button.style.transition = 'background 0.3s';

        button.onmouseover = () => {button.style.backgroundColor = '#218838'};
        button.onmouseout = () => {button.style.backgroundColor = '#28a745'};

        button.onclick = () => {
            sessionStorage.setItem("xspj_list_loaded", "no"); // 重置状态
            sessionStorage.setItem("filled_textarea", "no"); // 重置文本填充状态
            localStorage.removeItem('pending_eval_count');// 重置待提交计数
            location.href = evalURL;
        };

        document.body.appendChild(button);
    }

    // === Step 2: 评教列表页 ===
    if (url.startsWith("http://zhjw.qfnu.edu.cn/jsxsd/xspj/xspj_list.do")) {

        // 首次打开指定页面填充 textarea#jynr 为 "01"
        if (url === evalURL && sessionStorage.getItem("filled_textarea") !== "yes") {
            window.addEventListener('load', () => {
                console.log("首次打开评教列表页面，填充 textarea#jynr 文本为 '01' ...");
                const textarea = document.querySelector('textarea#jynr');
                if (textarea) {
                    textarea.value = "01";
                    console.log("已填充 textarea#jynr 内容为 01");
                    setTimeout(() => {
                        sessionStorage.setItem("filled_textarea", "yes");
                        console.log("填充完成，刷新页面以继续执行");
                        location.reload();
                    }, 1000);
                } else {
                    console.warn("未找到 textarea#jynr，无法填充文本");
                }
            });
            return; // 阻止后续代码运行，等待下一次加载
        }

        if (skipListReload === 1 && sessionStorage.getItem("xspj_list_loaded") === "yes") {
            console.log("评教列表页面已处理，跳过重复打开操作");
        } else {
            console.log("首次加载评教列表页面，准备打开所有评教链接...");
            sessionStorage.setItem("xspj_list_loaded", "yes");

            window.addEventListener('load', () => {
                const links = Array.from(document.querySelectorAll('tbody td a'));
                console.log(`共找到 ${links.length} 个评教链接`);
                localStorage.setItem('pending_eval_count', links.length.toString()); // 记录待提交数量

                links.forEach((a, i) => {
                    console.log(`打开第 ${i + 1} 个评教页面: ${a.href}`);
                    window.open(a.href, '_blank');
                });
            });
        }
    }

    // === Step 3: 自动评教页面 ===
    if (url.startsWith("http://zhjw.qfnu.edu.cn/jsxsd/xspj/xspj_edit.do")) {
        // 覆盖弹窗，自动确认或忽略
        window.confirm = function (msg) {
            console.log("自动确认弹窗：", msg);
            return true;
        };
        window.alert = function (msg) {
            console.log("自动忽略 alert 弹窗：", msg);
        };

        window.addEventListener('load', () => {
            console.log("开始自动填写并提交评教");

            const selector = '#' + targetElementIds.join(', #');
            const targetElements = document.querySelectorAll(selector);

            if (targetElements.length > 0) {
                targetElements.forEach(element => {
                    simulateClick(element);
                    console.log(`点击了：${element.id}`);
                });
            } else {
                console.error("未找到要点击的选项！");
                return;
            }

            const submitBtn = document.querySelector('input[type="button"]#tj');
            if (submitBtn) {
                console.log("准备点击提交按钮...");
                setTimeout(() => {
                    simulateClick(submitBtn);
                    console.log("已点击提交按钮");

                    setTimeout(() => {
                        // 更新待提交计数
                        const pendingCountStr = localStorage.getItem('pending_eval_count');
                        let pendingCount = pendingCountStr ? parseInt(pendingCountStr) : 0;
                        pendingCount = Math.max(0, pendingCount - 1);
                        localStorage.setItem('pending_eval_count', pendingCount.toString());
                        console.log(`剩余待提交页面数: ${pendingCount}`);

                        if (pendingCount === 0) {
                            console.log("所有评教页面已提交，打开评教列表页...");
                            window.open(evalURL, '_blank');
                        }

                        console.log("关闭当前标签页");
                        window.close();
                    }, 2000);
                }, 1000);
            } else {
                console.error("未找到提交按钮！");
            }
        });

        function simulateClick(element) {
            const clickEvent = document.createEvent('MouseEvents');
            clickEvent.initEvent('click', true, true);
            element.dispatchEvent(clickEvent);
        }
    }

})();
