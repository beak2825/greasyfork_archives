// ==UserScript==
// @name         学习系统
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  你懂的
// @author       You
// @match        https://zxxx.zjwater.com/zxxx/learner/mobileLearningPlan.action*
// @match        https://zxxx.zjwater.com/zxxx/learner/mobileBeginLearning.action*
// @match        http://zxxx.zjwater.com/zxxx/class/beginLearning.action*
// @match        https://zxxx.zjwater.com/zxxx/class/beginLearning.action*
// @match        https://zxxx.zjwater.com/zxxx/learner/beginLearning.action*
// @grant        none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/482815/%E5%AD%A6%E4%B9%A0%E7%B3%BB%E7%BB%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/482815/%E5%AD%A6%E4%B9%A0%E7%B3%BB%E7%BB%9F.meta.js
// ==/UserScript==

/* globals $ */

function zx_learn() {
    'use strict';

    if (!window._old_alert) {
        window._old_alert = alert;
        window.alert = function (msg) {
            if (msg.search(/继续学习/)) return undefined;
            if (msg.search(/学习时间已完成/)) {
                window.location.href="https://zxxx.zjwater.com/zxxx/learner/mobileLearningPlan.action"
                return undefined;
            }
            window._old_alert(msg);
        };
    }

    const video = $('video');
    video.style.border='solid 1px grey';
    const promise = video.play();
    if (promise) {
        promise.catch(error => {
            video.muted = true;
            video.play();
        });
    }
}

function zx_select_lesson() {
    const row = $('#example tr.odd')[0];
    if (!row) return;
    const a=$(row).find('td .btn a');
    if (!a) return;
    window.location.href=$(a).prop('href');
}

(function() {
    if (location.pathname.startsWith('/zxxx/learner/mobileLearningPlan.action')) {
        zx_select_lesson();
    } else {
        zx_learn();
    }
})();