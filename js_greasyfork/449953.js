// ==UserScript==
// @name         Bilibili 消息清理助手
// @namespace    https://github.com/hzhilong/bilibili-helper/
// @version      0.1
// @description  快速清空哔哩哔哩个人消息通知（“回复我的”、“@ 我的”，“收到的赞”）。使用方法：点击消息页面右下角按钮即可。
// @author       hzhilong
// @match        https://message.bilibili.com/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/449953/Bilibili%20%E6%B6%88%E6%81%AF%E6%B8%85%E7%90%86%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/449953/Bilibili%20%E6%B6%88%E6%81%AF%E6%B8%85%E7%90%86%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // 参考脚本：https://www.tore.moe/post/bilibili-massage-cleaner
    //   目前（2022年8月22日）好像使用不了。

    const urlPattern =
        /^https?:\/\/message\.bilibili\.com\/.*#\/(reply|love|at|whisper).*$/;
    const urlPatternReply = /^https?:\/\/message\.bilibili\.com\/.*#\/reply$/;
    const urlPatternAt = /^https?:\/\/message\.bilibili\.com\/.*#\/at$/;
    const urlPatternLove = /^https?:\/\/message\.bilibili\.com\/.*#\/love$/;
    const urlPatternWhisper =
        /^https?:\/\/message\.bilibili\.com\/.*#\/whisper.*$/;

    const sleep = (fn, ms) => {
        if (fn === undefined || fn === null) {
            fn = () => {};
        }
        return new Promise((resolve) => {
            setTimeout(() => resolve(fn()), ms);
        });
    };

    let replyList;
    let loveList;
    let clearBtn = null;
    let isCleaning = false;

    const clear = async (
        scrollPaneSelector,
        routerPanelSelector,
        delBtnSelector
    ) => {
        let delBtn;
        let failedCount = 0;
        let delCount = 0;

        let scrollPane = document.querySelector(scrollPaneSelector);
        let routerPanel = scrollPane.querySelector(routerPanelSelector);

        while (isCleaning && failedCount < 4) {
            scrollPane.scrollTop = routerPanel.offsetHeight;
            scrollPane.scrollTop = 0;
            delBtn = document.querySelector(
                delBtnSelector
            );
            if (delBtn) {
                delBtn.click();
                delCount++;
                failedCount = 0;
            } else {
                failedCount++;
            }
            await sleep(() => {}, 500);
        }

        isCleaning = false;
        refreshDisplayText();
        if (delCount > 0) {
            alert("共清理了" + delCount + "条消息");
        } else {
            alert("当前消息为空");
        }
    };

    const refreshDisplay = () => {
        if (clearBtn === null) {
            return;
        }
        if (urlPattern.test(document.URL)) {
            clearBtn.style.display = "block";
        } else {
            clearBtn.style.display = "none";
        }
    };

    const refreshDisplayText = () => {
        if (isCleaning) {
            clearBtn.innerText = "停止清空消息";
        } else {
            if (urlPatternReply.test(document.URL)) {
                clearBtn.innerText = "清空消息";
            } else if (urlPatternAt.test(document.URL)) {
                clearBtn.innerText = "清空消息";
            } else if (urlPatternLove.test(document.URL)) {
                clearBtn.innerText = "清空通知";
            } else if (urlPatternWhisper.test(document.URL)) {
                clearBtn.innerText = "清空私信";
            } else {
                clearBtn.style.display = "none";
            }
        }
    };

    const createClearBtn = () => {
        clearBtn = document.createElement("div");
        refreshDisplayText();
        clearBtn.classList.add("bilibili-message-clear-btn");
        clearBtn.style =
            "color: #FFF;position: absolute;bottom: 10vh;right: 5vw;background: #fb7299;padding: 10px;border-radius: 4px;font-size: 14px;cursor: pointer;user-select: none;";
        refreshDisplay();
        document.body.appendChild(clearBtn);
        clearBtn.addEventListener("click", () => {
            if (isCleaning) {
                isCleaning = !isCleaning;
                refreshDisplayText();
            } else {
                let url = document.URL;
                if (urlPatternWhisper.test(url)){
                    if(!document.querySelector(".bili-im .list-container .list .list-item")){
                        alert("当前私信为空");
                        return;
                    }
                }else if(document.querySelector(".nothing")){
                    alert("当前消息为空");
                    return;
                }
                if (confirm("确定清空？")) {
                    isCleaning = !isCleaning;
                    refreshDisplayText();
                    if (urlPatternWhisper.test(url)) {
                        clear(".bili-im .list-container", ".list", ".bili-im .list-container .list .list-item .close")
                    }else{
                        clear(".space-right-bottom", ".router-view", ".confirm-popup .bl-button--primary")
                    }
                }
            }
        });
    };

    const loadScript = async () => {
        isCleaning = false;
        if (clearBtn !== null) {
            refreshDisplay();
            refreshDisplayText();
        } else {
            createClearBtn();
        }
    };

    window.onload = () => {
        sleep(() => {
            let list = document.querySelectorAll(".space-left .list .item");
            list.forEach((item) => {
                if (!item.classList.contains("added-event")) {
                    item.classList.add("added-event");
                    item.addEventListener("click", loadScript);
                }
            });
            if (urlPattern.test(document.URL)) {
                loadScript();
            }
        }, 500);
    };
})();
