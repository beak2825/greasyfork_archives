// ==UserScript==
// @name         QQBrowser 显示允许访问按钮
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  QQ浏览器会隐藏风险网站(它认为)的访问按钮,然而什么叫风险网站呢?大家都懂的。
// @license      MIT
// @author       艾尔蓝德
// @match        https://browser.qq.com/safe/safeurl.html?*
// @downloadURL https://update.greasyfork.org/scripts/425403/QQBrowser%20%E6%98%BE%E7%A4%BA%E5%85%81%E8%AE%B8%E8%AE%BF%E9%97%AE%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/425403/QQBrowser%20%E6%98%BE%E7%A4%BA%E5%85%81%E8%AE%B8%E8%AE%BF%E9%97%AE%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    window.onload=function(){
        document.querySelector('#continue').style.display=''
        document.querySelector('#split').style.display=''
    }
})();