// ==UserScript==
// @name         显示米哈云游排队详情
// @namespace    https://rebuild.moe/
// @homepage     https://gist.github.com/Shimogawa/c9451df3e32cc4df77dfe1f080c7a327
// @version      2024.2.7
// @description  显示米哈云游排队人数和更精确的时间
// @author       Rebuild
// @license      MIT
// @match        https://ys.mihoyo.com/cloud/*
// @match        https://sr.mihoyo.com/cloud/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mihoyo.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/486755/%E6%98%BE%E7%A4%BA%E7%B1%B3%E5%93%88%E4%BA%91%E6%B8%B8%E6%8E%92%E9%98%9F%E8%AF%A6%E6%83%85.user.js
// @updateURL https://update.greasyfork.org/scripts/486755/%E6%98%BE%E7%A4%BA%E7%B1%B3%E5%93%88%E4%BA%91%E6%B8%B8%E6%8E%92%E9%98%9F%E8%AF%A6%E6%83%85.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const queryApiPath = '/api/getDispatchTicketInfo';

    const getWaitingWindow = () => {
        return document.querySelector(".waiting-wrapper");
    };

    const originalSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function () {
        const self = this;
        this.onreadystatechange = function () {
            if (self.readyState === 4 && self.responseURL.endsWith(queryApiPath)) {
                const waitingWindow = getWaitingWindow();
                if (!waitingWindow) {
                    return;
                }
                const minuteShow = waitingWindow.querySelector(".single-row__val");
                if (!minuteShow) {
                    return;
                }
                const resp = JSON.parse(self.response);
                if (!resp || resp.retcode !== 0) {
                    return;
                }
                const data = resp.data;
                if (data.ticket_status !== 'QUEUEING') {
                    return;
                }
                minuteShow.innerHTML = `<span>${data.queue_info.waiting_time_min}</span> <span class="slash-deep-color">分钟，当前在</span> `
                    + `<span>${data.queue_info.queue_rank}/${data.queue_info.branch_queue_len}</span> <span class="slash-deep-color">位</span>`;
            }
        }
        originalSend.apply(this, arguments);
    }
})();
