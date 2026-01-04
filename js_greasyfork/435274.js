// ==UserScript==
// @name         水木保持登录
// @namespace    https://github.com/doggeddog
// @homepage     https://github.com/doggeddog/smth_scripts
// @version      2.3.0
// @description  水木社区经常掉线, 这个脚本通过自动刷新保持登陆状态.
// @author       doggeddog
// @match        *://*.newsmth.net/*
// @match        *://*.mysmth.net/*
// @run-at       document-end
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/435274/%E6%B0%B4%E6%9C%A8%E4%BF%9D%E6%8C%81%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/435274/%E6%B0%B4%E6%9C%A8%E4%BF%9D%E6%8C%81%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

function refresh() {
    var refreshTime = GM_getValue('refreshTime');
    var now = Date.now();
    // 5分钟刷新状态一次
    if (now > refreshTime + 300000) {
        GM_setValue('refreshTime', now);
        GM_xmlhttpRequest({
            method: "GET",
            url: location.href,
            onload: function (r) {
                console.log("refresh");
            }
        });
    }
}

function left() {
    var x = document.querySelector("ol.page-main > li:first-child > a");
    if (x) {
        x.click();
    } else {
        redirect(-1);
    }
}

function right() {
    var x = document.querySelector("ol.page-main > li:last-child > a");
    if (x) {
        x.click();
    } else {
        redirect(1);
    }
}

function redirect(offset) {
    // Get the current URL
    const url = new URL(window.location.href);

    // Get the current 'p' parameter, default to 1 if not present
    let pageNum = parseInt(url.searchParams.get("p") || "1", 10);

    // Increment the page number
    url.searchParams.set("p", pageNum + offset);

    // Redirect to the new URL
    window.location.href = url.toString();
}
function keyMapping() {
    document.addEventListener("keydown", (event) => {
        // 如果当前聚焦在textarea或可编辑的元素中，阻止操作
        if (document.activeElement && (
            document.activeElement.tagName === "TEXTAREA" ||
            document.activeElement.isContentEditable ||
            document.activeElement.tagName === "INPUT"
        )) {
            return;
        }

        const url = window.location.href;
        if (url.includes("post")) {
            return;
        }
        switch (event.key) {
            case "ArrowLeft":
                left();
                break;
            case "ArrowRight":
                right();
                break;
        }
    });
}

GM_setValue('refreshTime', Date.now());
setInterval(refresh, 30000);
keyMapping();
