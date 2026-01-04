// ==UserScript==
// @name         BOSS直聘自动刷新
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Auto refresher.
// @author       hldh214
// @match        https://www.zhipin.com/web/boss/job/list
// @match        https://www.zhipin.com/web/boss/job/edit*
// @icon         https://www.google.com/s2/favicons?domain=zhipin.com
// @grant        GM_notification
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/429201/BOSS%E7%9B%B4%E8%81%98%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/429201/BOSS%E7%9B%B4%E8%81%98%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var interval = 8; // 操作间隔 (秒)

    if (/list/.test(window.location.href)) {
        GM_notification({text: `检测到职位管理页面, ${interval}秒后进入编辑`, timeout: 4000});
    } else {
        GM_notification({text: `检测到职位详情页面, ${interval}秒后直接提交保存`, timeout: 4000});
    }

    var refresh_interval = setInterval(() => {
        if (/list/.test(window.location.href)) {
            let target_item = $($($('.frame-box')).find('iframe')).contents().find('.job-jobInfo-warp').get().pop();

            location.replace('https://www.zhipin.com/web/boss/job/edit?encryptId=' + $(target_item).data("id"));
        } else {
            $($($('.frame-box')).find('iframe')).contents().find('button[type="submit"]').click();

            // 等三秒返回列表页
            setInterval(() => {location.replace('https://www.zhipin.com/web/boss/job/list');}, 3000);
        }
    }, interval * 1000);
})();