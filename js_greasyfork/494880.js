// ==UserScript==
// @name        一键ck获取替换
// @namespace   Violentmonkey Scripts
// @description 获取当前页面的cookie的字符串或者使用cookie字符串替换当前页面cookie（注意HttpOnly需要手动取消）
// @match       *://*/*
// @grant       GM_registerMenuCommand
// @grant       GM_notification
// @grant       GM_setClipboard
// @version     1.1
// @author      superHao
// @description 2024/5/13 10:31:52
// @downloadURL https://update.greasyfork.org/scripts/494880/%E4%B8%80%E9%94%AEck%E8%8E%B7%E5%8F%96%E6%9B%BF%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/494880/%E4%B8%80%E9%94%AEck%E8%8E%B7%E5%8F%96%E6%9B%BF%E6%8D%A2.meta.js
// ==/UserScript==

/**
 * 获取当前页面cookie
 */
function getCookie() {
    return document.cookie
}
/**
 * 获取当前页面主域名
 */
function getHost() {
    let host = window.location.host;
    let host1 = host.slice(0,host.indexOf('.'));
    let host2 = host.slice(host.indexOf('.')+1);
    return host2
}
/**
 * 将字符串cookie替换为数组cookie
 * @cookieString cookie字符串
 */
function parseCookieString(cookieString) {
    // cookiesString.split(/\s*;\s*/).map(it => it.split('='))[0]
    return cookieString.split(";").map(e => e.trim());
}

GM_registerMenuCommand(
    "获取cookie",
    function () {
        let cookie = getCookie();
        GM_setClipboard(cookie,"text");
        GM_notification("cookie复制成功");
    });
GM_registerMenuCommand(
    "替换cookie",
    function () {
        let cookies = prompt("请输入cookie：");
        cookies = parseCookieString(cookies);
        let domain=getHost();
        cookies.forEach(element => {
            document.cookie = element + ";domain=."+domain+";path=/;"
        });
        location.reload();
    }
)