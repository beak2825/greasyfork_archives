// ==UserScript==
// @name         巴哈姆特移除小圖示紅點
// @version      0.1.0
// @description  移除小圖示紅點
// @author       pana
// @namespace    https://greasyfork.org/zh-CN/users/193133-pana
// @license      GNU General Public License v3.0 or later
// @match        *://*.gamer.com.tw/*
// @grant        none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/460069/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E7%A7%BB%E9%99%A4%E5%B0%8F%E5%9C%96%E7%A4%BA%E7%B4%85%E9%BB%9E.user.js
// @updateURL https://update.greasyfork.org/scripts/460069/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E7%A7%BB%E9%99%A4%E5%B0%8F%E5%9C%96%E7%A4%BA%E7%B4%85%E9%BB%9E.meta.js
// ==/UserScript==
(function () {
    'use strict';
    const favicon = '/favicon.ico';
    function createIconLink() {
        const link = document.createElement('link');
        link.id = 'notificationNotice';
        link.type = 'image/x-icon';
        link.rel = 'icon';
        link.href = favicon;
        return link;
    }
    window.onload = () => {
        console.info('window onload.');
        let notificationNotice = document.getElementById('notificationNotice');
        if (notificationNotice) {
            console.info('reset favicon.');
            notificationNotice.href = favicon;
        }
        else {
            console.info('Cannot find notificationNotice.');
            notificationNotice = createIconLink();
            document.head.appendChild(notificationNotice);
        }
        const observer = new MutationObserver(() => {
            console.info('notificationNotice observer.');
            observer.disconnect();
            console.info('reset favicon.');
            if (notificationNotice) {
                notificationNotice.href = favicon;
                observer.observe(notificationNotice, {
                    attributes: true,
                    attributeFilter: ['href'],
                });
            }
        });
        observer.observe(notificationNotice, {
            attributes: true,
            attributeFilter: ['href'],
        });
    };
})();
