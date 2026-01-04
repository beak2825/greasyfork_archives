// ==UserScript==
// @name         bilibili 推广检测
// @namespace    http://tampermonkey.net/
// @version      0.1.4
// @description  检测视频推广
// @author       share121
// @match        *://www.bilibili.com/video/*
// @icon         https://www.bilibili.com/favicon.ico
// @connect      *
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/457467/bilibili%20%E6%8E%A8%E5%B9%BF%E6%A3%80%E6%B5%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/457467/bilibili%20%E6%8E%A8%E5%B9%BF%E6%A3%80%E6%B5%8B.meta.js
// ==/UserScript==

(function () {
    "use strict";

    function showTips() {
        let tishi = document
            .createRange()
            .createContextualFragment(
                `<div style="border: 1px solid var(--line_light);border-radius: 6px;background-color:rgb(255, 255, 255);position: fixed;bottom: 50px;right: 50px;z-index: 10000;padding: 20px;box-shadow: 0px 5px 60px rgba(0,0,0,0.2);" data-darkreader-inline-bgcolor=""> <div style=" padding: 8px; display: grid; place-content: center;"> <p style=" font-size: 24px;">此视频暗藏玄机</p> </div> <div style=" display: grid; grid-template-columns: 1fr 1fr; gap: 5px; padding: 8px;"> <button type="button" style=" border: none; padding: 8px; border-radius: 6px; outline: none; cursor: pointer; font-size: 14px; background-color: rgba(0,0,0,0.03); border: 1px solid var(--line_light);">关闭此视频</button> <button type="button" style=" border: none; padding: 8px; border-radius: 6px; outline: none; cursor: pointer; font-size: 14px; background-color: rgba(0,0,0,0.03); border: 1px solid var(--line_light);">取消</button> </div></div>`
            );
        tishi.querySelectorAll("button")[0].addEventListener("click", () => {
            if (navigator.userAgent.indexOf("MSIE") > 0) {
                if (navigator.userAgent.indexOf("MSIE 6.0") > 0) {
                    window.opener = null;
                    window.close();
                } else {
                    window.open("", "_top");
                    window.top.close();
                }
            } else {
                window.opener = null;
                window.open("", "_self");
                window.close();
            }
        });
        tishi
            .querySelectorAll("button")[1]
            .addEventListener("click", function () {
                this.parentNode.parentNode.remove();
            });
        document.body.appendChild(tishi);
    }

    function testUrl(url, failCallBack) {
        function test(url) {
            return [
                /taobao\.com/,
                /tmall\.com/,
                /jd\.com/,
                /maigoo\.com/,
                /1688\.com/,
                /xiaohongshu\.com/,
                /meituan\.com/,
                /amazon\.cn/,
                /dianping\.com/,
                /gome\.com\.cn/,
                /pinduoduo\.com/,
                /dangdang\.com/,
                /vmall\.com/,
                /suning\.com/,
                /vip\.com/,
                /you\.163\.com/,
                /xiaomiyoupin\.com/,
            ].every((e) => !e.test(url));
        }
        if (test(url)) {
            GM_xmlhttpRequest({
                url,
                onload({ finalUrl }) {
                    test(finalUrl) || failCallBack(finalUrl);
                },
            });
        } else {
            failCallBack(url);
        }
    }

    new MutationObserver((mutationsList) => {
        mutationsList.forEach((e) => {
            e.addedNodes.forEach((e) => {
                try {
                    if (e instanceof HTMLAnchorElement && e.dataset.url) {
                        testUrl(e.dataset.url, showTips);
                    }
                } catch { }
            });
            if (e.attributeName === "data-url") {
                try {
                    if (
                        e.target instanceof HTMLAnchorElement &&
                        e.target.dataset.url
                    ) {
                        testUrl(e.target.dataset.url, showTips);
                    }
                } catch { }
            }
        });
    }).observe(document.body, {
        subtree: true,
        childList: true,
        attributeFilter: ["data-url"],
    });
})();
