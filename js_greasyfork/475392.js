// ==UserScript==
// @name         有谱么脚本
// @version      0.94
// @description  有谱么跳过试听六线谱时间
// @author       xxing9199
// @match        https://yopu.co/view/*
// @grant        none
// @license MIT
// @namespace https://greasyfork.org/users/1060843
// @downloadURL https://update.greasyfork.org/scripts/475392/%E6%9C%89%E8%B0%B1%E4%B9%88%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/475392/%E6%9C%89%E8%B0%B1%E4%B9%88%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    "use strict";

    function waitForElement(selector, callback) {
        const element = document.querySelector(selector);
        if (element) {
            callback(element);
        } else {
            const observer = new MutationObserver((mutations, obs) => {
                const targetElement = document.querySelector(selector);
                if (targetElement) {
                    obs.disconnect();
                    callback(targetElement);
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    }

    waitForElement("#c > div", function(baseElement) {
        waitForElement("#c > div > :nth-child(2) > :nth-child(2)", function(targetContainer) {
            let PB_FLAG = false;
            let PB_ELEM;

            function addGUI() {
                let gui_section = document.createElement("section");
                gui_section.setAttribute("class", "control");

                let gui_note = document.createElement("p");
                gui_note.style.cssText = `text-align: center;`;
                gui_note.innerHTML = `🎉 如失效欢迎请反馈哈!`;

                /** 前去反馈 链接 */
                let gui_feedback = document.createElement("a");
                gui_feedback.style.cssText = `text-decoration: none; color: #d63031; display:block; text-align: center;`;
                gui_feedback.target = "_blank";
                gui_feedback.href = "https://www.cnblogs.com/xxing/p/17327427.html";
                gui_feedback.innerText = "🔗 前去反馈 🔗";

                /** 播放、暂停按钮 */
                let gui_playBtn = document.createElement("button");
                gui_playBtn.style.cssText = "margin-top: 10px";
                gui_playBtn.id = "xxing_pym_pb";
                gui_playBtn.setAttribute("size", "big");
                gui_playBtn.setAttribute("theme", "primary");
                gui_playBtn.setAttribute("type", "button");
                gui_playBtn.setAttribute("class", "svelte-14csrjh block");
                gui_playBtn.addEventListener("click", replay);
                gui_playBtn.innerText = "播放";

                gui_section.appendChild(gui_note);
                gui_section.appendChild(gui_feedback);
                gui_section.appendChild(gui_playBtn);

                targetContainer.appendChild(gui_section);
            }

            addGUI();

            const sixline = document.querySelector("#c > div > div.layout.no-print.svelte-6ag0p0.nier > div.main.svelte-6ag0p0 > div.panel.svelte-uqhx9v > div.player-panel.svelte-uqhx9v > div.right-buttons.svelte-uqhx9v > button > span");
            const simpline = document.querySelector("#c > div > div.layout.no-print.svelte-6ag0p0 > div.main.svelte-6ag0p0 > div.player-panel.svelte-d7ea7e > div.right-buttons.svelte-d7ea7e > button > span");

            function replay() {
                let _t;
                if (sixline != null) { PB_ELEM = sixline; }
                else if (simpline != null) { PB_ELEM = simpline; }
                else { alert("脚本已失效,有谱么版本更新,请点击链接联系作者."); }

                PB_ELEM.click();

                if (!PB_FLAG) {
                    _t = setInterval(() => {
                        PB_ELEM.click();
                        PB_ELEM.click();
                    }, 14000);
                    document.querySelector("#xxing_pym_pb").innerHTML = "暂停";
                } else {
                    clearInterval(_t);

                    // 修复暂停后避免网页刷新
                    _t = setInterval(() => {
                        PB_ELEM.click();
                        setTimeout(() => {
                            PB_ELEM.click();
                        }, 1);
                    }, 5000);
                    document.querySelector("#xxing_pym_pb").innerHTML = "播放";
                }

                PB_FLAG = !PB_FLAG;
            }
        });
    });
})();