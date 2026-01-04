// ==UserScript==
// @name         gtloli每日任务自动完成脚本
// @namespace    gtloli
// @version      1.33
// @change-log   1.0 第一个版本，完成了需要的功能
// @change-log   1.1 美化了按钮的样式，现在按钮看起来和导航栏的其他自带的按钮更加和谐了
// @change-log   1.12 更改生成按钮的时间为页面加载完成1.5s后
// @change-log   1.20 现在完成所有能完成的任务后会自动跳转到查看奖励页
// @change-log   1.21 修正了跳转奖励页的规则
// @change-log   1.22 bug修复
// @change-log   1.23 任务接取和完成等等所有操作现在都有醒目的弹窗提示了，应用油猴自带的run-at取代自己生成按钮
// @change-log   1.30 由于提示可视化，删除完成任务后自动跳转，以免影响正常的浏览，取而代之的是自动在后台静默消除未读信息
// @change-log   1.31 bug修复，简化部分代码，项目暂时停止维护
// @change-log   1.32 修复清理消息失败的Bug
// @change-log   1.33 任务ID变更修正
// @icon         https://www.gtloli.one/favicon.ico
// @description  gtloli每日任务自动完成脚本，适用于王者loli和弑神loli用户组的用户快捷完成每日任务
// @author       shouxh
// @match        https://www.gtloli.one/*
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/1.7.1/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/toastr.js/2.0.0/js/toastr.min.js
// @resource     toast  https://cdn.bootcdn.net/ajax/libs/toastr.js/latest/toastr.min.css
// @run-at       document-end
// @license      MIT
// @grant        GM_getResourceText
// @grant        GM_getResourceURL
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/420857/gtloli%E6%AF%8F%E6%97%A5%E4%BB%BB%E5%8A%A1%E8%87%AA%E5%8A%A8%E5%AE%8C%E6%88%90%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/420857/gtloli%E6%AF%8F%E6%97%A5%E4%BB%BB%E5%8A%A1%E8%87%AA%E5%8A%A8%E5%AE%8C%E6%88%90%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle(GM_getResourceText('toast'));
    toastr.options.fadeOut=5000;
    const gtloli = "https://www.gtloli.one/home.php?mod=task";
    const notice = "https://www.gtloli.one/home.php?mod=space&do=notice&view=system";
    //想要自己添加任务请将taskIds和tasks数组项顺序一一对应
    //例如：23对应王者萝莉每日胖次，30对应VIP用户每日GT币
    let taskIds = new Array(23, 32, 33);
    let tasks = new Array("王者萝莉每日胖次", "VIP用户每日胖次", "VIP用户每日GT币");
    var drawCompleted = new Event('drawCompleted');
    function _init() {
        let taskSh = document.createElement('div');
        taskSh.classList.add("c_cp_icon");
        taskSh.classList.add("y");
        let taskBtn = document.createElement("a");
        taskBtn.type = "button";
        taskBtn.id = "taskBtn";
        taskBtn.innerHTML = '<i class="fa fa-list-alt" title="任务接取脚本"></i>';
        taskSh.appendChild(taskBtn);
        setTimeout(() => {
            document.querySelector(".c_cp").append(taskSh);
        }, 1500);
        taskBtn.onclick = function () {
            let cf = confirm("今天是否已经完成任务");
            if (cf) {
                toastr.warning("用户主动取消,接取任务脚本停止运行..");
                return;
            } else {
                applyTask();
                //每次draw完成一次后就清理一次未读消息
                document.addEventListener('drawCompleted',function(){
                  clearMessage();
                });
            }
        }
        toastr.info("任务接取脚本成功运行...");
    }

    function applyTask() {
        for (let i = 0; i < taskIds.length; i++) {
            jQuery.ajax({
                type: "GET",
                url: gtloli,
                data: {
                    do: 'apply',
                    id: taskIds[i]
                },
                dataType: "text",
                beforeSend: function () {},
                success: function (response) {
                    if (response.search("抱歉") != -1) {
                        toastr.error(tasks[i] + "任务今天已经接取过了或不允许接取");
                    } else {
                        toastr.success(tasks[i] + "任务接取成功...");
                        drawTask(taskIds[i]);
                    }
                },
                error: function (e) {
                    if (e.statusText == "timeout") {
                        toastr.warning("请求超时");
                    }
                },
                complete: function () {}
            });
        }
    }

    function drawTask(tid) {
        jQuery.ajax({
            type: "GET",
            url: gtloli,
            data: {
                do: 'draw',
                id: tid
            },
            dataType: "text",
            beforeSend: function () {},
            success: function (response) {
                if (response.search("抱歉") != -1) {
                    toastr.error(tasks[taskIds.indexOf(tid)] + "任务今日完成过了，请不要重复提交");
                } else {
                    toastr.success(tasks[taskIds.indexOf(tid)] + "任务完成，请检查胖次等道具是否到账OvO");
                    document.dispatchEvent(drawCompleted);
                }
            },
            error: function (e) {
                if (e.statusText == "timeout") {
                    toastr.warning("请求超时");
                }
            },
            complete: function () {}
        });
    }
    function clearMessage(){
        jQuery.ajax({
            type: "GET",
            url: notice,
            beforeSend: function () {},
            success: function (response) {
                toastr.success("未读信息已清理");
            },
            error: function (e) {
                if (e.statusText == "timeout") {
                    toastr.warning("请求超时");
                }
            },
            complete: function () {
            }
        });
    }
    _init();
})();