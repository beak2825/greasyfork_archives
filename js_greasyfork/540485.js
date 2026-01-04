// ==UserScript==
// @name         陕西师范大学自动评教
// @namespace    SNNU-pinjiao
// @version      1.0
// @description  适用于使用KINGOSOFT高校教学综合管理服务平台的教务系统的自动评教脚本
// @author       丛雨丸
// @license      MIT
// @match        http://jwgl.snnu.edu.cn/frame/homes.action*
// @icon         https://bkimg.cdn.bcebos.com/pic/b64543a98226cffc1e17142ff04b5d90f603738dbc5e?
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/540485/%E9%99%95%E8%A5%BF%E5%B8%88%E8%8C%83%E5%A4%A7%E5%AD%A6%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99.user.js
// @updateURL https://update.greasyfork.org/scripts/540485/%E9%99%95%E8%A5%BF%E5%B8%88%E8%8C%83%E5%A4%A7%E5%AD%A6%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let finished = false; // 终止标志

    // 开始按钮
    let menu1 = GM_registerMenuCommand('开始', function () {
        
        // 等待评价按钮加载
        function waitForButton(callback, timeout = 6000) {
            const start = Date.now();
            const timer = setInterval(() => {
                try {
                    const desk = document.querySelector("#frmDesk");
                    const deskDoc = desk?.contentDocument;

                    const frame1 = deskDoc?.querySelector("#frame_1");
                    const frame1Doc = frame1?.contentDocument;

                    const report = frame1Doc?.querySelector("#frmReport");
                    const reportDoc = report?.contentDocument;

                    const evalBtn = reportDoc?.querySelector("td[id^='tr'][id$='_wjdc'] a");
                    if (evalBtn) {
                        clearInterval(timer);
                        console.log("发现了一个评教表！");
                        callback(evalBtn, reportDoc);
                        return;
                    }
                } catch (e) {}

                if (Date.now() - start > timeout) {
                    clearInterval(timer);
                    console.warn("所有评教已完成喵");
                    callback(null); // 表示没有评教按钮了
                }
            }, 500);
        }
        
        // 主评教流程
        function clickbutton() {
            if (finished) return; // 防止多次调用

            waitForButton((evalBtn, reportDoc) => {
                if (!evalBtn) {
                    finished = true; // 设置终止标志
                    return;
                }

                evalBtn.click();

                const timer = setInterval(() => {
                    try {
                        const dialogFrame = document.querySelector("#dialog-frame");
                        const dialogWin = dialogFrame?.contentWindow;
                        const dialogDoc = dialogFrame?.contentDocument;

                        // 确保覆盖confirm
                        if (dialogWin && typeof dialogWin.confirm === 'function') {
                            dialogWin.confirm = () => true;
                            //console.log("覆盖成功，弹窗已点击确认");
                        }
                        const firstOption = dialogDoc?.querySelector("#wdt_0_0_1");

                        if (firstOption) {
                            clearInterval(timer);

                            [
                                "#wdt_0_0_1", "#wdt_0_1_1", "#wdt_0_2_1", "#wdt_0_3_1",
                                "#wdt_0_4_1", "#wdt_0_5_1", "#wdt_0_6_1", "#wdt_0_7_2",
                                "#wdt_0_8_1", "#wdt_0_9_2"
                            ].forEach(sel => {
                                dialogDoc.querySelector(sel)?.click();
                            });
                            dialogDoc.querySelector("#area0").value = "很好";
                            setTimeout(() => {
                                dialogDoc.querySelector("#butSave").click();
                            }, 300);

                            waitForButton((evalBtn, reportDoc) => {
                                if (!evalBtn) {
                                    finished = true;
                                    return;
                                }
                                setTimeout(clickbutton, 1000);
                            }, 3000);
                        }
                    } catch (e) {}
                }, 500);
            });
        }

        // '主控'
        document.querySelector('#header-apps').click();
        // '评教'
        setTimeout(() => {
            const desk = document.querySelector("#frmDesk");
            const deskDoc = desk?.contentDocument;
            deskDoc?.querySelector("#S9")?.click();
        // 进入主评教流程
            clickbutton();
        }, 1000);
    });

    // 停止菜单
    let menu2 = GM_registerMenuCommand('停止', function () {
        finished = true;
    });
})();