// ==UserScript==
// @name         “如需浏览，请长按网址复制后使用浏览器访问”——FuckWechatAntiOuterUrl
// @namespace    http://xiandai.ren/
// @version      1.1
// @description  微信PC内置浏览器复制链接或使用其他浏览器打开也提示“如需浏览，请长按网址复制后使用浏览器访问”，本脚本应用后可以直接跳转目标网址。
// @author       Max39
// @match        https://weixin110.qq.com/cgi-bin/mmspamsupport-bin/newredirectconfirmcgi?*
// @grant         GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/406675/%E2%80%9C%E5%A6%82%E9%9C%80%E6%B5%8F%E8%A7%88%EF%BC%8C%E8%AF%B7%E9%95%BF%E6%8C%89%E7%BD%91%E5%9D%80%E5%A4%8D%E5%88%B6%E5%90%8E%E4%BD%BF%E7%94%A8%E6%B5%8F%E8%A7%88%E5%99%A8%E8%AE%BF%E9%97%AE%E2%80%9D%E2%80%94%E2%80%94FuckWechatAntiOuterUrl.user.js
// @updateURL https://update.greasyfork.org/scripts/406675/%E2%80%9C%E5%A6%82%E9%9C%80%E6%B5%8F%E8%A7%88%EF%BC%8C%E8%AF%B7%E9%95%BF%E6%8C%89%E7%BD%91%E5%9D%80%E5%A4%8D%E5%88%B6%E5%90%8E%E4%BD%BF%E7%94%A8%E6%B5%8F%E8%A7%88%E5%99%A8%E8%AE%BF%E9%97%AE%E2%80%9D%E2%80%94%E2%80%94FuckWechatAntiOuterUrl.meta.js
// ==/UserScript==

GM_addStyle(`
body { display: none !important; }
`)

document.addEventListener('DOMContentLoaded', function() {
    const targetUrl = document.querySelector(".weui-msg__desc").innerText;
    window.location.href = targetUrl;
})