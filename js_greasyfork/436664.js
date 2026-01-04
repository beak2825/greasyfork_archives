// ==UserScript==
// @name         Balantflow 优化
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  changlog点击id可打开tapd页面, 作业页面可复制制品所在路径, 去除部分页面的会干扰开发的定时器
// @author       https://greasyfork.org/zh-CN/users/306433-baster
// @match        http://*/balantflow/*
// @require     https://unpkg.com/ajax-hook@2.0.3/dist/ajaxhook.min.js
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/436664/Balantflow%20%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/436664/Balantflow%20%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function () {
    'use strict';
    if (location.href.includes("/module/deploy/job/jobDetail.do?jobId")) {
        console.log(window.TIMMER);
        $(document).on('click', '.tableMain h6.dt-title', function () {
            let hidSysId = $('#hidSysId').val();
            let hidSubSysId = $('#hidSubSysId').val();
            let hidVersion = $('#hidVersion').val();
            let hidEnvId = $('#hidEnvId').val();
            let data = `/app/systems/ezdeploy/data/version/${hidSysId}/${hidSubSysId}/${hidVersion}/ENV/${hidEnvId}`;
            let $temp = $('<input>');
            $("body").append($temp);
            $temp.val(data).select();
            document.execCommand("copy");
            $temp.remove();
            console.log(data);
        });
    } else if (location.href.includes("/dashboard/index.do")) {
        let t = window.setInterval(function () {
            if (window.TIMMER) {
                window.clearTimeout(window.TIMMER);
                window.TIMMER = null;
                window.clearInterval(t);
            }
            if (window.INTERVAL) {
                window.clearInterval(window.INTERVAL);
                window.INTERVAL = null;
                window.clearInterval(t);
            }
        }, 10 * 1000);
    } else if (location.href.includes("/balantflow/module/getModuleListAjax.do")) {
        ah.proxy({
            onResponse: (response, handler) => {
                handler.next(response)
                if (response.config.url.includes("/changelog/getLogs/")) {
                    let changeLog = window.setInterval(function () {
                        if ($("#changeLog:visible").length > 0) {
                            $("#changeLog:visible").find("h6").each(function () {
                                let h6 = $(this);
                                if (h6.text().includes("新增")) {
                                    h6.next().find("li").each(function () {
                                        let li = $(this);
                                        li.html(li.text().trim().replace(/^(?:ID)?(\d{7})/g, `<a href="https://www.tapd.cn/54247054/prong/stories/view/115424705400$1" target="_blank">$1</a>`));
                                    });
                                } else if (h6.text().includes("改进")) {
                                    h6.next().find("li").each(function () {
                                        let li = $(this);
                                        li.html(li.text().trim().replace(/^(?:ID)?(\d{7})/g, `<a href="https://www.tapd.cn/54247054/prong/stories/view/115424705400$1" target="_blank">$1</a>`));
                                    });
                                } else if (h6.text().includes("修复")) {
                                    h6.next().find("li").each(function () {
                                        let li = $(this);
                                        li.html(li.text().trim().replace(/^(?:ID)?(\d{7})/g, `<a href="https://www.tapd.cn/54247054/bugtrace/bugs/view?bug_id=115424705400$1" target="_blank">$1</a>`));
                                    });
                                }
                            });

                            window.clearInterval(changeLog);
                        }

                    }, 2 * 1000);
                }

            }
        })
    }

})();