// ==UserScript==
// @name         Ticket Cleaner
// @namespace    http://tampermonkey.net/
// @version      0.2
// @license      GPL3.0
// @description  当你重新打开浏览器时，上一次保存的页面可能会由于ticket加载失败，该脚本尝试去清除url中存在的ticket
// @author       阿杆
// @match        *://*/*?*ticket=*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/475737/Ticket%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/475737/Ticket%20Cleaner.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('ticket cleaner inject');

    window.addEventListener('load', clear);

})();

function clear() {

    // 先检查当前url中是否存在ticket参数
    if (!location.search.includes('ticket=')) return

    fetch(window.location.href, { method: 'HEAD' })
        .then(function(response) {
        const statusCode = response.status;
        // 检查当前页面状态码
        if (statusCode >= 400) {
            // 删除ticket参数
            const urlWithoutTicket = location.href.replace(/([\?&])ticket=[^&]+/, '');
            // 刷新页面
            location.replace(urlWithoutTicket);
            console.log('Ticket Clear')
        }
    })
        .catch(function(error) {
        console.error('Error:', error);
    });
}