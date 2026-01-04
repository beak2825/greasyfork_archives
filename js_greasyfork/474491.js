// ==UserScript==
// @name         RUC Campus Access Enhancer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @license      MIT
// @description  Streamline and optimize Renmin University of China campus access with this userscript.
// @author       andylizf
// @homepage     https://github.com/andylizf/RUC-Campus-Access-Enhancer
// @match        http://appointment.ruc.edu.cn/index/apply/apply/RULEID/364
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ruc.edu.cn
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/474491/RUC%20Campus%20Access%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/474491/RUC%20Campus%20Access%20Enhancer.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let $ = window.jQuery;

    var tasks = [
        {
            selector: '.re',
            operation: e => e.hide()
        },
        {
            selector: '#INFOTYPE3',
            operation: e => { e.val(5); e.change() }
        },
        {
            selector: 'input[name="RESON"]',
            operation: e => e.val('入校参观')
        },
        {
            selector: '#info0',
            operation: e => e.prop('checked', true)
        },
        {
            selector: '#info1',
            operation: e => e.prop('checked', true)
        },
        {
            selector: '#info2',
            operation: e => e.prop('checked', true)
        },
        {
            selector: '.re[style*="display: block;"]',
            operation: e => { $(".his_bg1").css('display', 'block'); e.hide(); }
        },
        {
            selector: 'input[type="checkbox"]',
            operation: e => e.prop('checked', true)
        },
        {
            selector: 'button[onclick="formsub(2)"]',
            operation: e => e.click()
        },
    ];

    function executeTasks(index) {
        if (index < tasks.length) {
            var task = tasks[index];
            var operation = task.operation;

            var interval = setInterval(function () {
                var element = $(task.selector);
                if (element.length > 0) {
                    console.log("Executing task " + index + " on " + element);
                    operation(element);
                    clearInterval(interval);
                    executeTasks(index + 1);
                }
            }, 50);
        }
    }

    executeTasks(0);
})();