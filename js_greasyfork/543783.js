// ==UserScript==
// @name        bilibili首页黑名单屏蔽
// @namespace   蒋晓楠
// @version     20250617
// @description 我都把你加黑名单了还能在首页看到你的视频，那我这黑名单不白加了吗？
// @author      蒋晓楠
// @license      MIT
// @match       https://www.bilibili.com/
// @match       https://www.bilibili.com/?*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant       GM_registerMenuCommand
// @grant       GM_xmlhttpRequest
// @grant       GM_getValue
// @grant       GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/543783/bilibili%E9%A6%96%E9%A1%B5%E9%BB%91%E5%90%8D%E5%8D%95%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/543783/bilibili%E9%A6%96%E9%A1%B5%E9%BB%91%E5%90%8D%E5%8D%95%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==
function 获取黑名单() {
    return GM_getValue("黑名单", []);
}

function 执行屏蔽() {
    let 黑名单 = 获取黑名单();
    setInterval(() => {
        document.querySelectorAll(".feed-card:not(.JXNProcessed)").forEach((视频) => {
            let 信息块 = 视频.querySelector(".bili-video-card__info--owner"), 移除 = false;
            if (信息块 !== null) {
                let 编号 = 信息块.href.substring(信息块.href.lastIndexOf("/") + 1);
                if (黑名单.indexOf(编号) > -1) {
                    移除 = true;
                }
            }
            if (移除) {
                let 名字 = 信息块.querySelector(".bili-video-card__info--author").title;
                alert("【" + 名字 + "】的视频在黑名单内所以被移除");
                视频.remove();
            } else {
                视频.classList.add("JXNProcessed");
            }
        });
    }, 1000);
}

function 执行() {
    执行屏蔽();
    setTimeout(() => {
        //按钮菜单
        GM_registerMenuCommand("更新黑名单", () => {
            GM_setValue("黑名单", []);
            let 页码 = 1;
            let 更新 = () => {
                GM_xmlhttpRequest({
                    url: "https://api.bilibili.com/x/relation/blacks?pn=" + 页码, onload: (结果) => {
                        let 数据 = JSON.parse(结果.responseText).data.list;
                        if (数据.length > 0) {
                            let 原数据 = 获取黑名单();
                            数据.forEach((用户) => {
                                原数据.push(用户.mid);
                            });
                            GM_setValue("黑名单", 原数据);
                            页码++;
                            更新();
                        } else {
                            alert("更新完成");
                        }
                    }
                });
            };
            更新();
        });
        //显示黑名单信息
        console.log("当前黑名单", 获取黑名单());
    }, 3000);
}

执行();