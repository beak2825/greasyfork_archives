// ==UserScript==
// @name         TapdHelper
// @namespace    http://tampermonkey.net/
// @description  help better to use Tapd
// @author       Febare
// @match        https://www.tapd.cn/*/prong/tasks?conf_id=*
// @match        https://www.tapd.cn/*/prong/*/view/*
// @grant        none
// @run-at       document-end
// @date         2020/06/04-v0.2.0 调整脚本运行的区域
// @note         2020/06/26-v0.3.0 新增复制任务ID到粘贴板
// @note         2020/07/09-v0.3.1 调整复制内容为：标题-taskId
// @date         2020/08/04-v0.4.0 新增预计结束敏感事件
// @date         2020/08/04-v0.4.1 预计结束优化体验
// @date         2020/08/04-v0.4.2 处理已完成任务存在剩余工时的情况
// @date         2020/08/05-v0.4.3 新增业务模块、业务使用方未填写提醒
// @date         2020/08/05-v0.4.4 剔除标题无用内容
// @date         2021/07/16-v0.4.5 新增复制任务ID功能
// @version      0.4.5
// @downloadURL https://update.greasyfork.org/scripts/404661/TapdHelper.user.js
// @updateURL https://update.greasyfork.org/scripts/404661/TapdHelper.meta.js
// ==/UserScript==

(function () {
    //任务即将结束提示
    taskWillEnd();

    //业务模块、业务使用方未填写提醒
    tasbRequiredAttrs();

    //标题-任务ID 拷贝
    copyTaskId();

    //helper();
})();

//任务即将结束提示
function taskWillEnd() {
    var today = new Date().toISOString().substr(0, 10);

    var endDateIndex = tableIndexOf("预计结束");

    var statusIndex = tableIndexOf("状态");

    var leftIndex = tableIndexOf("剩余");

    var maxIndex = Math.max(endDateIndex, statusIndex, leftIndex);

    if (endDateIndex != -1 && statusIndex != -1 && leftIndex != -1) {
        var taskItems = document.querySelectorAll("#task_table > tbody > tr");

        for (var i = 1; i < taskItems.length; i++) {
            var taskItem = taskItems[i];

            var attrs = taskItem.querySelectorAll("td");

            if (attrs.length <= maxIndex) {
                continue;
            }

            var endDateAttr = attrs[endDateIndex];

            var endDate = endDateAttr.innerText;

            var status = attrs[statusIndex].innerText;

            var left = attrs[leftIndex].innerText;

            switch (status) {
                case '未开始':
                case '进行中':
                    if (endDate == today) {
                        // 当天预警
                        taskItem.style.background = '#fce4d6';
                        endDateAttr.style.background = '#f4b084';
                        endDateAttr.style.fontWeight = 600;
                        continue;
                    }

                    if (endDate.substr(0, 8) == today.substr(0, 8)) {
                        if (endDate.substr(8, 2) < today.substr(8, 2)) {
                            // 超过预计结束预警
                            taskItem.style.background = '#fff2cc';
                            endDateAttr.style.background = '#ffd966';
                            endDateAttr.style.fontWeight = 600;
                            continue;
                        }
                    }
                    break;
                case '已完成':
                    if (left > 0) {
                        // 延期任务提醒
                        endDateAttr.style.background = '#ffd966';
                        endDateAttr.style.fontWeight = 600;
                    }
                    break;
            }
        }
    }
}

//业务模块、业务使用方未填写提醒
function tasbRequiredAttrs() {
    var moduleIndex = tableIndexOf("业务模块");

    var useIndex = tableIndexOf("业务使用方");

    var workTypeIndex = tableIndexOf("处理工种");

    var maxIndex = Math.max(moduleIndex, useIndex);

    maxIndex = Math.max(maxIndex, workTypeIndex);

    if (moduleIndex != -1 || useIndex != -1 || workTypeIndex != -1) {
        var taskItems = document.querySelectorAll("#task_table > tbody > tr");

        for (var i = 1; i < taskItems.length; i++) {
            var taskItem = taskItems[i];

            var attrs = taskItem.querySelectorAll("td");

            if (attrs.length <= maxIndex) {
                continue;
            }

            if (moduleIndex != -1) {
                var module = attrs[moduleIndex].innerText;

                if ('--' == module) {
                    // 业务模块未填提醒
                    attrs[moduleIndex].style.background = '#e2efda';
                    attrs[moduleIndex].style.fontWeight = 600;
                }
            }

            if (useIndex != -1) {
                var use = attrs[useIndex].innerText;

                if ('--' == use) {
                    // 业务使用方未填提醒
                    attrs[useIndex].style.background = '#e2efda';
                    attrs[useIndex].style.fontWeight = 600;
                }
            }

            if (workTypeIndex != -1) {
                var workType = attrs[workTypeIndex].innerText;

                if ('--' == workType) {
                    // 业务使用方未填提醒
                    attrs[workTypeIndex].style.background = '#e2efda';
                    attrs[workTypeIndex].style.fontWeight = 600;
                }
            }
        }
    }
}

function tableIndexOf(title) {
    var arrTh = document.querySelectorAll("#task_table > thead > tr > th");
    for (var i in arrTh) {
        if (arrTh[i].innerText.startsWith(title)) {
            return i;
        }
    }
    return -1;
}

// TapdHelper
function helper() {
    var tapd_hepler_css = '<style class="tapd_hepler_css" type="text/css">.tapd_hepler_btn{background:white;box-shadow:0 10px 10px rgba(128,128,128,.5);width:88px;height:36px;right:30px;position:fixed;text-align:center;line-height:36px;bottom:0;}.tapd_hepler_frame{background:white;box-shadow:0 6px 10px rgba(128,128,128,.5);border-radius:2px;position:absolute;width:440px;height:512px;right:30px;bottom:36px;font-size:14px;overflow:auto;display:none;}.t_status_title{height:32px;vertical-align:middle;display:table-cell;padding:10px 16px;}.t_ul_helper{background:#f5f5f5;}.t_hr_helper{border-top:0;border-bottom:0;margin-top:0;margin-bottom:0;height:1px !important;background:#eaeaea !important;}.t_li_helper{padding:10px 16px;}.t_li_helper:hover{background:#eaeaea;}.progress_helper{height:18px;width:100%;overflow:hidden;display:inline-block;background-color:#cccccc;border-radius:4px;}.progress_helper-bar{width:0;height:100%;background-color:#5abf5e;}.progress_helper-text{text-align:center;margin-top:-18px;color:white;}.div_row_1{display:flex;height:20px;padding-bottom:8px;}.div_row_2{display:flex;}.div_task_title_text{height:100%;width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;display:flex;}.div_wrap_content{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.div_demand_text{white-space:nowrap;margin-left:32px;}.div_remaining_time{text-align:right;white-space:nowrap;width:31%;}.warn_label{background:#ffd6aa;padding:2px 4px;color:#b75709;display:inline;white-space:nowrap;margin-left:10px;}</style>';
    var base_html = '<div id=tapd_hepler class="tapd_hepler_frame webkit-scrollbar"><div class=taskNotDone><div class=t_status_title>未开始 (0)</div><ul class=t_ul_helper></ul></div><hr class=t_hr_helper><div class=taskDoing><div class=t_status_title>进行中 (0)</div><ul class=t_ul_helper></ul></div><hr class=t_hr_helper></div>';
    var tapd_hepler_btn = '<div class="tapd_hepler_btn"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAFAUlEQVR4Xu1ai3EUMQyVKyAlkAoIFQAVECoIVEBoIKdNAyQVECogqYCkAkIFhAo4GoiZdyPfaH3a83rt3c1wtzMMMzl/pGfp6WM72vHP7bj+tAdgbwEzIcDMR0T0jYgOiOgDM1/PIcpsLsDMt0T0SpR+YObDXQaAmHmWw5hlU5x0ZAF7AHbaArz3f5umARlO/s3pAkxEC9H4KzO/n1x7onkTIWY+Rhhk5qs5lMeeWRYgsfu7CPtpTsE1YJFcWTlFLgA6dkMGbDbb6Uk0QUKFQwkckpVT5AKAbO1tZK6zgaBOXhPoHTO/7utSuQBgI1jBi2iDNxLXt+7LzM+dcwDwwHvfEtI5h3WX3nsocJ9SAGsR0Q918oRo4px73Wd+WD8LADE5C4SGmcHqGx8zHzjnTrz3YHmYa5/vwTl35b2/ZOZlx7pY70v4bYjy2SQYNoNSkSW8tFBvmgaKX+hT6qO9GrN0zl1YQMACvPf3zrlnQ5UfDICyBJwoSOchYmUABGLqe+IpXOAS4JqWa4gbwBXuuywltXC2C6QW7CCmMO2OiECktx3KgBeQG8REi/lwhXd9uCYlo/69KgBblIfip33JSU4WnHJiKNOLcPuCUA0A4QWwMkxy9YlvQvFBuQLCmff+Gn6ueYGIAEIyUvQBoSYAUH7t8yXEFPEJAIXb6NAL5QGCGSH6KB7GVAFACpl1SJLFzciQI5yKOkfe+9vIEjpDb84etQD4pU1/jBRZsrtQhwRSPCy1gmIAjNPPSkVzTku4RBNjsRXUACCuD6qytMEHsLbwZRU+FtgbAEgIQqNizeaYiFx9sVg0kUBIeP6ov/2W+TkHmzVW2uc6T4AbtBIxyUDjBgsIExbTih4WAFbFF4REDwCp7eqThgZ6++FD7n6apVHmYMPlYpmQTGmu0DtsWIwFABCKq72wSMvnpAAKbS2MGc38dUSQKrBLplaRpLW3eo8WAFbygXWQzR1r1p0DALE8rxTbIN245Y6xXUlZEQnG/jhVa5uZtwKQ41V7AHLQisc+VRfI0anUAnRvH/uiXB31llcqTtQdJgnmKI+xpQCgdp86DCLMflaKtsLgpAAYjFycmaUUYOZW1UlEG4lQag39e5EFCABx4jSaGxjm/1P+lqNza2wNAOLEYzQrYGZkeLqdXmT+xRygsrM4eywWzIg4Vhv8+ezlsLiBlX9Xc4WOXmOVG6liF1BWgL6frtVRfWVdVFqO3KF8se+HvWoCYF6bOedOF4vF5RCWaprmo1ysrKdLTl9s+tUBEFdY39ZECqNeBy/0SpKk/YUqs3V/WKvRWjUMGmRldXHDMACBNjcanMuzszNUmHR+fr56Lvf4+IjECv9azRiZ/Fuq0Srt8FEsQPEB3AGcYN3wDPGGjVJ8yCLWnGoc0EFgMGF0kLoaLCk9cOqouQZdrKQWr5YHpDaSNlbXnZ81/QauMqbio7rANkCkjxhukML/wa/xPy5Oi298UocyGwB9BZtq3KgcoEhx/TSmr2Lee7wdbLW7+87NGTc6ANZbngwBR+8yTwFA3DTJ0H91kWG+PcpZZNvYKQDAizA8etJ3/En5Jes7GtsNRgcAmsrjidz3Qhtvj5KoDRgwCQAD5JpsyuQAiDXgMUX8PB6xHwXT6Myv0Z0DAKTGHzuO+EYSpf/aAnYegFWliLfCUWRA/o+oV7XcTZnS5C6QEmjq3/cATI34U9tv5y3gHzO+Z18zJYQGAAAAAElFTkSuQmCC" style="height: 28px;vertical-align: middle;"></div>';

    $("body").append(tapd_hepler_css);
    $("body").append(base_html);
    $("body").append(tapd_hepler_btn);

    // 任务链接
    const taskUrl = 'https://www.tapd.cn/22079351/prong/tasks/view/';

    const list = [];

    const arr = document.getElementsByClassName('rowNOTdone');

    for (var j = 0; j < arr.length; j++) {
        // 任务ID
        const taskId = arr[j].getAttribute('task_id');
        // 任务名称
        const title = arr[j].querySelector('a.namecol.editable-value').innerText;
        // 需求链接
        const demandUrl = arr[j].querySelector('a.editable-value[target]').href;

        const taskModel = {};
        taskModel.title = title;
        taskModel.taskId = taskId;
        taskModel.url = taskUrl + taskId;
        taskModel.demandUrl = demandUrl;

        list[j] = taskModel;
    }

    // 遍历加载所有任务详情页Html
    for (var i = 0; i < list.length; i++) {
        (function (arg) {
            loadXMLDoc(list[arg].url, 'task_' + list[arg].taskId, arg);
        })(i);
    }

    function getTaskItemData(pos) {
        var temp = document.querySelector('#task_' + list[pos].taskId + '_status');
        if (temp == null) {
            return;
        }

        // 任务状态
        const taskStatus = document.querySelector('#task_' + list[pos].taskId + '_status').innerText.trim();
        // 进度
        const contentProgress = document.querySelector('#ContentProgress').innerText.trim();
        // 预估工时
        const contentEffort = document.querySelector('#ContentEffort').innerText.trim();
        // 预计结束
        const contentDue = document.querySelector('#ContentDue').innerText.trim();
        // 剩余工时
        const contentRemain = document.querySelector('#ContentRemain').innerText.trim();
        // 难易评级
        const contentCustomFieldEight = document.querySelector('#ContentCustomFieldEight').innerText.trim();
        // 业务使用方
        const contentCustomFieldSix = document.querySelector('#ContentCustomFieldSix').innerText.trim();
        // 业务模块
        const contentCustomFieldFive = document.querySelector('#ContentCustomFieldFive').innerText.trim();

        var taskModel = list[pos];
        taskModel.status = getTaskStatus(taskStatus);
        taskModel.progress = contentProgress.replace('~', '');
        taskModel.contentEffort = contentEffort;
        taskModel.contentDue = contentDue;
        taskModel.remain = contentRemain.replace('人时', 'h');
        taskModel.contentCustomFieldEight = contentCustomFieldEight;
        taskModel.contentCustomFieldSix = contentCustomFieldSix;
        taskModel.contentCustomFieldFive = contentCustomFieldFive;

        if (taskModel.status === 0) {
            document.querySelector('.taskNotDone .t_ul_helper')
                .innerHTML += createTaskItem(taskModel);
        } else {
            document.querySelector('.taskDoing .t_ul_helper')
                .innerHTML += createTaskItem(taskModel);
        }
    }

    // 加载指定网页
    function loadXMLDoc(link, className, position) {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET", link, true);
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
                var objE = document.createElement("div");
                objE.innerHtml = xmlhttp.responseText;
                var temp = '<div class=' + className + ' style="display:none">' + objE.innerHtml + '</div>';

                try { $('body').append(temp); } catch (e) { }
                getTaskItemData(position);
                try { $('.' + className).remove(); } catch (e) { }
            }
        };
        xmlhttp.send();
    }

    // 事件处理
    function initListener(page) {
        // 移出内容区域时隐藏
        page.querySelector('#tapd_hepler').onmouseleave = function () {
            page.querySelector('#tapd_hepler').style.display = 'none';
        };

        // 移入按内容域时显示
        page.querySelector('#tapd_hepler').onmouseenter = function () {
            page.querySelector('#tapd_hepler').style.display = 'unset';
        };

        // 移出按钮区域时隐藏
        page.querySelector('.tapd_hepler_btn').onmouseleave = function () {
            page.querySelector('#tapd_hepler').style.display = 'none';
        };

        // 移入按钮区域时显示
        page.querySelector('.tapd_hepler_btn').onmouseenter = function () {
            page.querySelector('#tapd_hepler').style.display = 'unset';
        };
    }

    // 事件处理
    initListener(document);
}

// 新建任务项
function createTaskItem(taskModel) {
    return '' +
        "<hr class='t_hr_helper'>" +
        "<li class='t_li_helper'>" +
        "    <div class='div_row_1'>" +
        "      <div class='div_task_title_text'>" +
        "       <div class='div_wrap_content'>" +
        "        <a href='" + taskModel.url + "' style='color:#333333;text-decoration:none;'>" + taskModel.title + "</a>" +
        "       </div>" +
        "      </div>" +
        "      <div class='warn_label'>警告</div>" +
        "      <div class='div_demand_text'>" +
        "        [<a href='" + taskModel.demandUrl + "'>关联需求</a>]" +
        "      </div>" +
        "      </div>" +
        "    <div class='div_row_2'>" +
        "      <div class='progress_helper'>" +
        "          <div class='progress_helper-bar' style='width:" + taskModel.progress + "'></div>" +
        "          <div class='progress_helper-text'>" + taskModel.progress + "</div>" +
        "      </div>" +
        "      <div class='div_remaining_time'>剩余：" + taskModel.remain + "</div>" +
        "    </div>" +
        "</li>";
}

// 设置任务状态
function getTaskStatus(taskStatus) {
    if (taskStatus === '未开始') {
        return 0;
    } else if (taskStatus === '进行中') {
        return 1;
    } else {
        return 2;
    }
}

// 复制任务ID
function copyTaskId() {
    var icon = '<svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1149" width="20" height="100%" style="vertical-align: middle;"><path d="M458.8 690.6c-8.1 0-16.2-3.1-22.4-9.4-12.4-12.5-12.4-32.8 0-45.3l303.7-306.7c18.4-18.5 28.5-43.2 28.5-69.4s-10.1-50.8-28.5-69.4c-37.9-38.3-99.5-38.3-137.4 0L299 497.2a31.448 31.448 0 0 1-44.8 0c-12.4-12.5-12.4-32.8 0-45.3l303.7-306.7c62.6-63.2 164.5-63.2 227 0 30.3 30.6 47 71.3 47 114.6s-16.7 84-47 114.6L481.3 681.2c-6.2 6.2-14.3 9.4-22.5 9.4z" p-id="1150" fill="#515151"></path><path d="M352.5 927.9c-41.1 0-82.2-15.8-113.5-47.4-30.3-30.6-47-71.3-47-114.6s16.7-84 47-114.6l303.7-306.7c12.4-12.5 32.4-12.5 44.8 0 12.4 12.5 12.4 32.8 0 45.3L283.8 696.5c-18.4 18.5-28.5 43.2-28.5 69.4 0 26.2 10.1 50.8 28.5 69.4 18.9 19.1 43.8 28.7 68.7 28.7 24.9 0 49.8-9.6 68.7-28.7L725 528.6c12.4-12.5 32.4-12.5 44.8 0 12.4 12.5 12.4 32.8 0 45.3L466.1 880.5c-31.3 31.6-72.4 47.4-113.6 47.4z" p-id="1151" fill="#515151"></path></svg>';

    var taskIds = document.querySelectorAll('td a.j-task-title-link-proxy');
    taskIds.forEach(function (element) {
        element.removeAttribute("href");
        element.onclick = function () {
            copyToClip(element.textContent);
            toast(element.textContent);
        };
    });


    var taskTitle = '<a class="copy_task_title">' + icon + '</a>';
    var taskTitles = document.querySelectorAll('div.growing-title-inner');
    taskTitles.forEach(function (element) {
        element.innerHTML += taskTitle;
        var taskLink = element.children[1].href;
        var temp = taskLink.split('/')
        var taskId = temp[temp.length - 1].split('?')[0].replace('112207935100', '');
        var branchName = element.innerText.replace('【安卓】', '').replace('【APP】', '').trim() + '-' + taskId

        element.querySelector('.copy_task_title').setAttribute('branchName', branchName);
        element.querySelector('.copy_task_title').onclick = function () {
            var taskId = this.getAttribute("branchName");
            copyToClip(taskId);
            toast(taskId);
        };
    });

    // for (var i = 0; i < node.length; i++) {
    //     node[i].innerHTML += taskTitle;

    //     var taskLink = node[i].children[1].href;
    //     var temp = taskLink.split('/')
    //     var taskId = temp[temp.length - 1].split('?')[0].replace('112207935100', '');

    //     var branchName = node[i].innerText.replace('【安卓】', '').trim() + '-' + taskId

    //     node[i].querySelector('.copy_task_title').setAttribute('branchName', branchName);

    //     node[i].querySelector('.copy_task_title').onclick = function () {
    //         var taskId = this.getAttribute("branchName");
    //         copyToClip(taskId, "已复制到粘贴板");
    //     };
    // }
}

// 复制内容到粘贴板
function copyToClip(content, message) {
    var aux = document.createElement("input");
    aux.setAttribute("value", content);
    document.body.appendChild(aux);
    aux.select();
    document.execCommand("copy");
    document.body.removeChild(aux);
    if (message != null) {
        toast(message);
    }
}

function toast(msg, duration) {
    duration = isNaN(duration) ? 3000 : duration;
    var m = document.createElement('div');
    m.innerHTML = msg;
    m.style.cssText = "max-width:60%;min-width: 150px;padding:0 14px;height: 40px;color: rgb(255, 255, 255);line-height: 40px;text-align: center;border-radius: 4px;position: fixed;top: 50%;left: 50%;transform: translate(-50%, -50%);z-index: 999999;background: rgba(0, 0, 0,.7);font-size: 16px;";
    document.body.appendChild(m);
    setTimeout(function () {
        var d = 0.5;
        m.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';
        m.style.opacity = '0';
        setTimeout(function () { document.body.removeChild(m) }, d * 1000);
    }, duration);
}