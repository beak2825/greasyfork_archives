// ==UserScript==
// @name         North-Plus Auto Task
// @namespace    https://github.com/starliiit
// @version      0.5.2
// @description  自动领取和完成北+日常和周常任务
// @author       sl
// @match        https://*.summer-plus.net
// @match        https://*.summer-plus.net/index.php
// @match        https://*.level-plus.net
// @match        https://*.level-plus.net/index.php
// @match        https://*.white-plus.net
// @match        https://*.white-plus.net/index.php
// @match        https://*.south-plus.net
// @match        https://*.white-plus.net/index.php
// @match        https://*.imoutolove.me
// @match        https://*.imoutolove.me/index.php
// @grant GM_setValue
// @grant GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/369548/North-Plus%20Auto%20Task.user.js
// @updateURL https://update.greasyfork.org/scripts/369548/North-Plus%20Auto%20Task.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...

    const LOGIN_SPAN_ID = 'login_0';

    const TASK_BASEURL = 'plugin.php?H_name=tasks&action=ajax&actions=job&cid=';
    const REWARD_BASEURL = 'plugin.php?H_name=tasks&action=ajax&actions=job2&cid=';

    const DAILY_ID = '15';
    const WEEKLY_ID = '14';

    const TASK_DAILY_KEY = 'lastTaskDaily';
    const TASK_WEEKLY_KEY = 'lastTaskWeekly';

    const HOUR = 1000 * 60 * 60;
    const DAILY_INTERVAL = HOUR * 18;

    // const WEEKLY_INTERVAL = HOUR * 158;
    const WEEKLY_INTERVAL = DAILY_INTERVAL;

    const TIME_BEING_GRACEFUL = 1500;


    function checkTask(now, taskID, taskKey, taskInterval) {
        let lastSignIn = GM_getValue(taskKey);
        if (lastSignIn === undefined || (now - lastSignIn) > taskInterval) {
            // 领取任务
            ajax.send(TASK_BASEURL + taskID, '', function () {
                console.log(ajax.request.responseText);

                setTimeout(function () {
                    // 等 1.5s，领取奖励
                    ajax.send(REWARD_BASEURL + taskID, '', function () {
                        console.log(ajax.request.responseText);
                        GM_setValue(taskKey, now);
                    });
                }, TIME_BEING_GRACEFUL);

            });
        }
        else {
            // do nothing.
            let interval = (now - lastSignIn) / (HOUR);
            console.log('距离上次任务过了 ' + interval.toFixed(2) + ' 小时');
        }
    }

    // 检查是否已经登录
    if(document.getElementById(LOGIN_SPAN_ID) === null) {

        let now = Date.now();
        checkTask(now, DAILY_ID, TASK_DAILY_KEY, DAILY_INTERVAL);
        setTimeout(function () {
            checkTask(now, WEEKLY_ID, TASK_WEEKLY_KEY, WEEKLY_INTERVAL);
        }, TIME_BEING_GRACEFUL);

    }


})();