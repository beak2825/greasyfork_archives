// ==UserScript==
// @name         MineBBS签到
// @namespace    Moear
// @version      1.0.5
// @description  MineBBS登录领取50金粒
// @author       Moear
// @license      Apache License 2.0
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_openInTab
// @grant        GM_deleteValue
// @run-at       document-idle
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/495924/MineBBS%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/495924/MineBBS%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==

(function () {
    ("use strict");

    const MineBBS = "https://www.minebbs.com";
    // 获取浏览器地址进行判断
    var host = window.location.host;
    var href = window.location.href;

    // 进入浏览器自动执行签到
    window.onload = auto;

    function auto() {
        // 获取当前日期
        var today = new Date().toISOString().split('T')[0];
        // 获取上次签到的日期
        var lastSignin = GM_getValue("lastSignin");

        if (host === "www.minebbs.com") {
            // 如果已经在MineBBS网站上，尝试签到
            autoBtn();
        } else if (today !== lastSignin) {
            // 如果在空白页，并且今天还没有签到过，打开MineBBS网站
            GM_openInTab(MineBBS);
        }
    }

    function autoBtn() {
        // 检查是否已经登录
        var loggedIn = document.querySelector(".p-navgroup-linkText");
        if (!loggedIn) {
            // 如果没有登录，弹出提示框并返回
            alert("请先登录!");
            return;
        }
        // 如果在签到页面，点击签到按钮
        var MineBBSTextBtn = document.querySelector(".button--cta.button.rippleButton");
        if (MineBBSTextBtn) {
            if (MineBBSTextBtn.textContent.trim() === "今日已签到") {
                // 如果已经签到，更新今天的日期
                GM_setValue("lastSignin", new Date().toISOString().split('T')[0]);
                alert("今日已签到!");
            } else {
                MineBBSTextBtn.click();
                // 签到完成后，保存今天的日期
                alert("MineBBS签到成功!");
                GM_setValue("lastSignin", new Date().toISOString().split('T')[0]);
            }
        }
    }
})();