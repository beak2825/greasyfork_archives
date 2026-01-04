// ==UserScript==
// @name         GEE_OneKey_run
// @namespace    https://www.micblo.com/
// @version      0.1.1
// @description  Easy to run tasks in GEE
// @author       Payne
// @match        https://code.earthengine.google.com/
// @grant        none
// @require      http://code.jquery.com/jquery-1.12.4.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/434146/GEE_OneKey_run.user.js
// @updateURL https://update.greasyfork.org/scripts/434146/GEE_OneKey_run.meta.js
// ==/UserScript==
(function() {
    'use strict';

    $(document).ready(function() {
        var html = [
            '<div style="z-index:3000;flex: 1 0 auto;display: flex;justify-content: flex-end;">',
            '<a id="btn-run-all" style="cursor:pointer;text-decoration:none;padding:5px 5px;border:1px solid green;margin-right: 5px;color: green;background: white;">运行全部</a>',
            '<a id="btn-run-n" style="cursor:pointer;text-decoration:none;padding:5px 5px;border:1px solid;margin-right: 5px;background: white;">运行指定数量</a>',
            '<a id="btn-close-popup" style="cursor:pointer;text-decoration:none;padding:5px 5px;border:1px solid red;color: red;background: white;">批量关闭弹窗</a>',
            '</div>'
        ];
        var $Run_all = $(html.join(''));

        $("user-box").before($Run_all);

        $('#btn-run-all').click(function() {
            if (document.querySelectorAll('ee-image-config-dialog,ee-table-config-dialog').length) {
                return alert('目前存在任务弹窗。\n为避免异常，请手动cancel或批量关闭弹窗后再运行任务');
            }

            var taskPanes = document.getElementById('task-pane').shadowRoot.querySelectorAll('.type-EXPORT_IMAGE,.type-EXPORT_FEATURES');
            if (!taskPanes.length) {
                return alert('暂无可以运行的任务');
            }

            if (taskPanes.length > 80) {
                return alert('任务多于80！\n请使用指定数量的运行方法，否则会导致被谷歌屏蔽');
            }

            if (!confirm('是否运行' + taskPanes.length + '个待运行的任务?\n按取消则放弃')) {
                return;
            }

            alert('按确定后将开始运行任务！\n浏览器会自动弹出任务浮窗，脚本会自动帮忙点击\n如果存在浮窗的任务出错，请手动cancel，谢谢');

            taskPanes.forEach(function (v) {
                v.getElementsByClassName('run-button')[0].click();
            });

            var timer = setInterval(function () {
                var dialogs = document.querySelectorAll('ee-image-config-dialog,ee-table-config-dialog');
                if (dialogs.length !== taskPanes.length) {
                    return;
                }

                clearInterval(timer);

                dialogs.forEach(function (v) {
                    v.shadowRoot.children[0].shadowRoot.children[0].querySelectorAll('.buttons > .ok-button')[0].click();
                });
            }, 500);

        });

        $('#btn-run-n').click(function() {
            if (document.querySelectorAll('ee-image-config-dialog').length) {
                return alert('目前存在任务弹窗。\n为避免异常，请手动cancel或批量关闭弹窗后再运行任务');
            }

            var taskPanes = document.getElementById('task-pane').shadowRoot.querySelectorAll('.type-EXPORT_IMAGE,.type-EXPORT_FEATURES');
            if (!taskPanes.length) {
                return alert('暂无可以运行的任务');
            }

            var taskNum = parseInt(prompt('请输入需要运行的任务数：\nTIPS1: 不得大于80；超过当前最多的任务数时则全部运行）\nTIPS2: 会选取前N个任务执行'));
            if (isNaN(taskNum)) {
                return alert('需要运行的任务数必须是正整数！');
            }

            if (taskNum > 80) {
                return alert('需要运行的任务不得多于80！');
            }

            if (taskNum > taskPanes.length) {
                taskNum = taskPanes.length;
            }

            taskPanes = Array.from(taskPanes).slice(0, taskNum);

            if (!confirm('是否运行' + taskPanes.length + '个待运行的任务?\n按取消则放弃')) {
                return;
            }

            alert('按确定后将开始运行任务！\n浏览器会自动弹出任务浮窗，脚本会自动帮忙点击\n如果存在浮窗的任务出错，请手动cancel，谢谢');

            taskPanes.forEach(function (v) {
                v.getElementsByClassName('run-button')[0].click();
            });

            var timer = setInterval(function () {
                var dialogs = document.querySelectorAll('ee-image-config-dialog,ee-table-config-dialog');
                if (dialogs.length !== taskPanes.length) {
                    return;
                }

                clearInterval(timer);

                dialogs.forEach(function (v) {
                    v.shadowRoot.children[0].shadowRoot.children[0].querySelectorAll('.buttons > .ok-button')[0].click();
                });
            }, 500);
        });

        $('#btn-close-popup').click(function() {
            var dialogs = document.querySelectorAll('ee-image-config-dialog,ee-table-config-dialog');
            if (dialogs.length) {
                dialogs.forEach(function (v) {
                    v.shadowRoot.children[0].shadowRoot.children[0].querySelectorAll('.buttons > .cancel-button')[0].click();
                });
            }
        });
    });
})();