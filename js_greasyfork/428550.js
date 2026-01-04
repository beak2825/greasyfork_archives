// ==UserScript==
// @name         智联招聘自动刷新
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Auto refresher.
// @author       hldh214
// @match        https://rd6.zhaopin.com/job/manage*
// @match        https://rd6.zhaopin.com/job/publish*
// @icon         https://www.google.com/s2/favicons?domain=zhaopin.com
// @grant        GM_notification
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/428550/%E6%99%BA%E8%81%94%E6%8B%9B%E8%81%98%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/428550/%E6%99%BA%E8%81%94%E6%8B%9B%E8%81%98%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var interval = 6; // 操作间隔 (秒)

    if (/manage/.test(window.location.href)) {
        GM_notification({text: `检测到职位管理页面, ${interval}秒后进入最后一个职位的编辑`, timeout: 6000});
    } else {
        GM_notification({text: `检测到职位详情页面, ${interval}秒后直接提交保存`, timeout: 6000});
    }

    function triggerMouseEvent (node, eventType) {
        var clickEvent = document.createEvent ('MouseEvents');
        clickEvent.initEvent (eventType, true, true);
        node.dispatchEvent (clickEvent);
    }

    var refresh_interval = setInterval(() => {
        if (/manage/.test(window.location.href)) {
            // 列表页页面, 点击最后一个职位的编辑
            window.scrollTo(0,document.body.scrollHeight);
            var targetNode = $('.job-item:last > div.job-item--right > div.job-item__footer > div.job-item__sub-actions > a:nth-child(2)')[0];
            if (targetNode) {
                triggerMouseEvent (targetNode, "mouseover");
                triggerMouseEvent (targetNode, "mousedown");
                triggerMouseEvent (targetNode, "mouseup");
                triggerMouseEvent (targetNode, "click");
            }
            else {
                console.log ("*** Target node not found!");
            }
        } else {
            // 详情页面, 直接提交保存
            window.scrollTo(0,document.body.scrollHeight);
            $("button[zp-stat-id='job-publish-submit']").click()
        }

    }, interval * 1000);
})();