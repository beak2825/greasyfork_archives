// ==UserScript==
// @name         豆瓣小组 - 日期分组显示
// @namespace    https://anl.gg/
// @version      1.0
// @description  Group discussion list by last reply date.
// @icon         https://www.google.com/s2/favicons?sz=64&domain=douban.com
// @author       greatghoul
// @license      MIT
// @match        https://www.douban.com/group/*/
// @match        https://www.douban.com/group/*/?*
// @match        https://www.douban.com/group/*/discussion
// @match        https://www.douban.com/group/*/discussion?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537432/%E8%B1%86%E7%93%A3%E5%B0%8F%E7%BB%84%20-%20%E6%97%A5%E6%9C%9F%E5%88%86%E7%BB%84%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/537432/%E8%B1%86%E7%93%A3%E5%B0%8F%E7%BB%84%20-%20%E6%97%A5%E6%9C%9F%E5%88%86%E7%BB%84%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const discussionItems = document.querySelectorAll('#group-topics table.olt tbody tr, #content .article table.olt tbody tr');

    if (discussionItems.length === 0) {
        return;
    }

    let currentDate;
    discussionItems.forEach((item) => {
        const pinned = item.querySelector('span.pl');
        if (pinned) {
            return;
        }
        const lastReplyTimeElement = item.querySelector('.time');
        if (!lastReplyTimeElement) {
            return;
        }
        const lastReplyTime = new Date(lastReplyTimeElement.textContent.trim());
        const dateString = lastReplyTime.toISOString().split('T')[0];

        if (dateString !== currentDate) {
            item.style.borderTop = "1px solid #6ba3ff";
            currentDate = dateString;
        }
    });
})();