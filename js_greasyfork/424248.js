// ==UserScript==
// @name         抢仪器
// @namespace    a23187.cn
// @version      0.2.0
// @description  抢仪器 - 中山大学仪器使用管理平台
// @author       A23187
// @match        http://202.116.65.252/*
// @match        http://202.116.65.252/console/appointment/AppointmentBoxContainer/*
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/424248/%E6%8A%A2%E4%BB%AA%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/424248/%E6%8A%A2%E4%BB%AA%E5%99%A8.meta.js
// ==/UserScript==

/* global bnSubmit:writable, doSubmitAppointment:readonly,
    form:readonly, layer:readonly, root:readonly */

(function() {
    'use strict';

    // execute `func` only once
    function once(func) {
        let memo;
        let executed = false;
        return function(...args) {
            if (!executed) {
                memo = func.apply(this, args);
                executed = true;
            }
            return memo;
        };
    }

    function main() {
        // enable the original uncheckable buttons
        document.querySelectorAll('.mCSB_container .cantbook').forEach((e) => {
            e.classList.remove('cantbook');
            e.classList.add('canselect');
        });

        document.getElementsByTagName('form')[0].setAttribute('lay-filter', 'mainform');

        // override the next/submit button's onclick handler
        const originalBnSubmit = bnSubmit; // backup `bnSubmit`
        bnSubmit = (btn) => {
            if (btn.id === 'submitBooking') { // for submit
                // backup `layer.msg` and `root.common.modDialog`
                const originalLayerMsg = layer.msg;
                layer.msg = () => {};
                const originalModDialog = root.common.modDialog;
                root.common.modDialog = () => {};

                let showOnce = () => {};
                let targetTime = 720; // 12:00 default
                layer.prompt({ title: '请输入开始时间，如 12:00' }, (value, i) => {
                    if (/^(1?[0-9]|2[0-3]):([0-5][0-9])$/.test(value)) {
                        const t = value.split(':');
                        targetTime = +t[1] + t[0] * 60;
                        showOnce = once(originalLayerMsg);
                    }
                    layer.close(i);
                });

                const id = setInterval(() => { // start the timed task
                    const now = new Date();
                    const h = now.getHours();
                    const m = now.getMinutes();
                    const t = h * 60 + m;
                    if (t > targetTime + 1) {
                        console.log('cancel');
                        clearInterval(id); // cancel the timed task after `targetTime+1`
                        // restore `layer.msg` and `root.common.modDialog`
                        layer.msg = originalLayerMsg;
                        root.common.modDialog = originalModDialog;
                    } else if (t > targetTime - 4) { // submit only after `targetTime-4`
                        console.log('submit');
                        doSubmitAppointment(form.val('mainform'), false);
                    } else {
                        showOnce('稍后开始自动抢仪器', { time: 5000 });
                    }
                }, 1000);
            } else { // for next
                originalBnSubmit(btn);
            }
        };
    }

    GM_registerMenuCommand('抢', main, 'q');
})();
