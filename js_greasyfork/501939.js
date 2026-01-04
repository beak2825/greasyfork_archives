// ==UserScript==
// @name         炎黄盈动-流程中心PIF列表优化
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  检查PIF的计划执行时间和协作人
// @author       haifennj
// @match        https://my.awspaas.com/*
// @grant        none
// @run-at       document-start

// @downloadURL https://update.greasyfork.org/scripts/501939/%E7%82%8E%E9%BB%84%E7%9B%88%E5%8A%A8-%E6%B5%81%E7%A8%8B%E4%B8%AD%E5%BF%83PIF%E5%88%97%E8%A1%A8%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/501939/%E7%82%8E%E9%BB%84%E7%9B%88%E5%8A%A8-%E6%B5%81%E7%A8%8B%E4%B8%AD%E5%BF%83PIF%E5%88%97%E8%A1%A8%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function () {
    'use strict';

    if (document.getElementsByTagName('h1').length > 0) {
        var error = document.getElementsByTagName('h1')[0].innerText;
        if (error == 'Whitelabel Error Page') {
            window.location.href = "../";
            return;
        }
    }

    if (document.title.indexOf('内部错误') > -1) {
        window.location.href = "../";
        return;
    }

    if (!(window.settingParam && window.settingParam.hasOwnProperty("boxName"))) {
        //return;
    }
    window.extendOpenNewPage = true;

    let css = `
        .title-cell-div .title-cell-iconfont.task-state-1 {
            color:red !important;
            font-weight:bold !important;
        }
        .row-unread-class .title-cell-div .title-cell-span {
            color:red !important;
            font-weight:bold !important;
        }
        .query-dots {
            margin-left: 92px;
            font-size: 10px;
            line-height: 10px;
        }
        .query-dot {
            display: inline-block;
            width: 8px;
            height: 8px;
            margin: 0 4px;
            border-radius: 50%;
            background-color: #ccc;
            animation: query 0.6s infinite ease-in-out;
        }
        .query-dot:nth-child(1) {
            animation-delay: 0.1s;
        }
        .query-dot:nth-child(2) {
            animation-delay: 0.2s;
        }
        .query-dot:nth-child(3) {
            animation-delay: 0.3s;
        }
        @keyframes query {
            0% {
            transform: scale(0);
            }
            50% {
            transform: scale(1);
            }
            100% {
            transform: scale(0);
            }
        }
    `
    let el = document.createElement('style')
    el.type = 'text/css'
    el.innerHTML = css
    document.head.appendChild(el);

    function formatDate(date) {
        var format = 'yyyy-MM-dd HH:mm:ss'
        const options = {
            yyyy: date.getFullYear(),
            MM: String(date.getMonth() + 1).padStart(2, '0'),
            dd: String(date.getDate()).padStart(2, '0'),
            HH: String(date.getHours()).padStart(2, '0'),
            mm: String(date.getMinutes()).padStart(2, '0'),
            ss: String(date.getSeconds()).padStart(2, '0'),
        };

        return format.replace(/yyyy|MM|dd|HH|mm|ss/g, match => options[match]);
    }

    function addSelectWithDates() {
        // 获取表单元素
        const form = document.querySelector('.workbench-body .el-form');
        if (!form) {
            return;
        }

        // 检查并移除已经存在的 select 元素
        const existingSelect = document.getElementById('dateSelect');
        if (existingSelect) {
            existingSelect.remove();
        }

        // 创建 select 元素
        const select = document.createElement('select');
        select.id = 'dateSelect';
        select.className = '';

        // 获取当前日期
        const today = new Date();
        const todayValue = formatDate(today).slice(5, 10); // 获取 MM-DD 格式

        // 获取昨天的日期
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);
        const yesterdayValue = formatDate(yesterday).slice(5, 10); // 获取 MM-DD 格式

        // 生成前后两周的日期
        for (let i = -14; i <= 14; i++) {
            const date = new Date();
            date.setDate(today.getDate() + i);
            const value = formatDate(date).slice(5, 10); // 获取 MM-DD 格式
            const day = date.toLocaleDateString('zh-CN', { weekday: 'short' }); // 获取星期
            const option = document.createElement('option');
            option.value = value;

            // 设置显示内容
            if (value === todayValue) {
                option.textContent = `${value}(${day})[今天]`;
            } else {
                option.textContent = `${value}(${day})`;
            }

            // 设置默认选中项为昨天
            if (value === yesterdayValue) {
                option.selected = true;
            }
            select.appendChild(option);
        }

        // 插入到表单中
        form.insertBefore(select, form.firstChild);

        // 绑定 change 事件，给 input 赋值并触发回车事件
        select.addEventListener('change', function () {
            const input = document.getElementById('searchTitle');
            // 给 input 赋值 select 的内容
            input.value = select.value;
            // 触发 input 的回车事件
            const event = new Event('input', {
                bubbles: true,
                cancelable: true
            });
            input.dispatchEvent(event);

            // 触发第一个 i 标签的 click 事件
            const firstIcon = document.querySelector('.el-input__prefix-inner i');
            if (firstIcon) {
                firstIcon.click();
            }
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        addSelectWithDates();
    });

    function showLoadingAnimation(titleCellDiv) {
        const loadingAnimation = document.createElement('div');
        loadingAnimation.id = 'loading-animation';
        loadingAnimation.className = 'query-dots';
        loadingAnimation.innerHTML = '<div class="query-dot"></div><div class="query-dot"></div><div class="query-dot"></div>';

        titleCellDiv.parentElement.appendChild(loadingAnimation);
    }
    function hideLoadingAnimation() {
        const loadingAnimation = document.getElementById('loading-animation');
        if (loadingAnimation) {
            loadingAnimation.remove();
        }
    }

    function objtostr(json) {
        var arr = new Array()
        for (var k in json) {
            var v = json[k]
            var val = k + '=' + v
            arr.push(val)
        }
        var str = arr.join('&')
        return str
    }

    function getDWData(pifNo, callback) {
        fetch('./jd', { // Replace with your API endpoint
            "method": 'POST',
            "headers": {
                "accept": "application/json, text/plain, */*",
                "cache-control": "no-cache",
                "content-type": "application/x-www-form-urlencoded",
            },
            "body": "pageId=6271&editRelease=true",
            "mode": "cors",
            "credentials": "include",
            body: objtostr({
                cmd: "CLIENT_DW_DATA_GRIDJSON",
                msaAppId: "com.crmpaas.apps.service",
                sid: window.settingParam.sessionId,
                isDesign: false,
                appId: "com.crmpaas.apps.service",
                pageNow: 1,
                dwViewId: "obj_a0b3d16a0f754c80951318503b4e990f",
                processGroupId: "obj_40522b2a44c44d55bf264b968d1da3af",
                processGroupName: "产品改善",
                limit: 1,
                condition: JSON.stringify({ "cond": { "likeC": [{ "Type": "TEXT", "Compare": "like", "Field": "PIFNOOBJ_936301EB43D341D0A3421927FE05E80D", "FieldName": "PIF编号", "ConditionValue": pifNo }] }, "tcond": { "qk": "" } })
            })
        })
            .then(response => response.json())
            .then(data => {
                //console.log(data);
                callback(data);
            })
            .catch(error => console.error('Error:', error));
    }

    function getUsertaskHistoryData(processInstId, callback) {
        var params = {};
        params.processInstId = processInstId;
        params.sid = window.settingParam.sessionId;
        fetch('./jd?authentication=' + window.settingParam.sessionId + '&cmd=API_CALL_ASLP&sourceAppId=com.actionsoft.apps.workbench&aslp=aslp://com.actionsoft.apps.workbench/FormHistoryOpinionASLP&params=' + encodeURIComponent(JSON.stringify(params)))
            .then(response => response.json())
            .then(data => {
                callback(data);
            })
            .catch(error => console.error('Error:', error));
    }

    function debounce(func, delay) {
        let timeoutId;
        return function(...args) {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            timeoutId = setTimeout(() => {
                func.apply(this, args);
            }, delay);
        };
    }

    function handleClick(event, tr, row, pifNo) {
        const titleCellDiv = tr.querySelector('.title-cell-div');
        showLoadingAnimation(titleCellDiv);
        getDWData(pifNo, function (r) {
            let newText = "";
            // PLANTIME 计划完成时间
            var boData = r.data.maindata.items.length > 0 ? r.data.maindata.items[0] : {};
            console.log(boData);
            var PLANTIME = boData.PLANTIME;
            var PLANTIME_SHOW_RULE_SUFFIX = boData.PLANTIME_SHOW_RULE_SUFFIX;
            var DELAYWARNSTA = boData.DELAYWARNSTA;
            newText += "<span style='margin-right:5px'>";
            newText += "计划完成时间：<b style='color:red;'>"+PLANTIME_SHOW_RULE_SUFFIX+"</b>";
            newText += "</span>";
            newText += "<span style='margin-right:5px'>";
            newText += "状态：<b style='color:"+(DELAYWARNSTA=="1"?"#ffa726":DELAYWARNSTA=="2"?"red":"")+";'>"+boData.DELAYWARNSTA_SHOW_RULE_SUFFIX+"</b>";
            newText += "</span>";
            console.log(PLANTIME)
            getUsertaskHistoryData(row.processInstId, function (r) {
                let list = r.data;
                for (let i = list.length - 1; i > 0; i--) {
                    const element = list[i];
                    if (element.ActionName == "协同") {
                        console.log(element)
                        let msg = element.Msg;
                        const match = msg.match(/\(([^)]+)\)/);
                        const content = match ? match[1] : '';
                        newText += "协同："+content;
                        break;
                    }
                }
                const titleCellDiv = tr.querySelector('.title-cell-div');
                if (titleCellDiv) {
                    const newDiv = document.createElement('div');
                    newDiv.style.marginLeft = '92px';
                    newDiv.style.fontSize = '10px';
                    newDiv.style.lineHeight = '10px';
                    newDiv.innerHTML = newText;
                    titleCellDiv.parentElement.appendChild(newDiv);
                }
                hideLoadingAnimation();
                return false;
            })
        });
    }

    const debouncedHandleClick = debounce(handleClick, 300);

    function addRowEvent(taskDataList) {
        taskDataList.forEach((row, i) => {
            var tr = document.querySelector(`tr[rowid="${row.id}"]`);
            if (row.processDefId != "obj_24996ee732df448fac828927be204952") {
                return;
            }
            var title = row.title;
            var pattern = /PIF(\d+)/;
            var match = pattern.exec(title);
            var pifNo = "";
            if (match) {
                pifNo = match[0];
            }
            const icons = tr.querySelectorAll('.title-cell-div i');
            if (icons.length > 1) {
                if (!icons[1].dataset.eventRegistered) {
                    icons[1].addEventListener('click', function (event) {
                        // Send AJAX request on click
                        debouncedHandleClick(event, tr, row, pifNo);
                        event.stopPropagation();
                        return false;
                    });
                    icons[1].dataset.eventRegistered = 'true';
                }
            }
        });
    }

    function getDates(n) {
        // 创建一个空数组 dates，用来存放日期字符串
        var dates = [];
        // 创建一个 Date 对象 today，表示今天的日期
        var today = new Date();
        // 使用一个 for 循环，从 0 到 n-1，遍历每一天
        for (var i = 0; i < n; i++) {
            const year = today.getFullYear(); // 获取年份
            const month = (today.getMonth() + 1).toString().padStart(2, '0'); // 获取月份，并转换为两位数的字符串
            const dayd = today.getDate().toString().padStart(2, '0'); // 获取日期，并转换为两位数的字符串
            const dateString = `${year}-${month}-${dayd}`; // 使用模板字符串拼接成所需的格式

            dates.push(dateString);
            // 使用 getDate() 方法获取 today 的日期，并加上 1，得到明天的日期
            var day = today.getDate() + 1;
            // 使用 setDate() 方法设置 today 的日期为 day，得到明天的日期对象
            // 这里不需要担心月份和年份的变化，因为 setDate() 方法会自动调整
            today.setDate(day);
        }
        // 返回 dates 数组
        return dates;
    }

    const setColorDate = () => {
        // 调用 getDates 函数，传入 5，表示要返回今天及后 4 天的日期字符串
        var result = getDates(5);
        const colors = ["#e57373", "#64b5f6", "#ffeb3b", "#ffa726", "#66bb6a"];

        const setDayColor = (dateDom) => {
            const dateStr = dateDom.innerText.trim();
            const minDate = result[0];
            const maxDate = result[result.length - 1];
            const index = result.findIndex(item => item == dateStr);
            if (index > -1) {
                dateDom.style.background = colors[index]
            } else if (dateStr <= minDate) {
                dateDom.style.background = colors[0]
            } else if (dateStr >= maxDate) {
                dateDom.style.background = colors[colors.length - 1]
            }

        }
        const trs = document.querySelectorAll(".vxe-body--row");
        if (trs && trs.length > 0) {

            for (const dom of document.querySelectorAll(".vxe-body--row")) {
                if (!dom.classList.contains("row-agent-class")) {
                    const dateDom = dom.querySelector(".cell-title-child-type-default");
                    if (dateDom) {
                        setDayColor(dateDom);
                    }
                }
            }
        }
    }

    (function() {
        const origOpen = XMLHttpRequest.prototype.open;
        const origSend = XMLHttpRequest.prototype.send;

        XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
            this._url = url; // 保存请求地址，后面方便判断
            return origOpen.apply(this, arguments);
        };

        XMLHttpRequest.prototype.send = function(body) {
            this.addEventListener("load", function() {
                //console.log("拦截到请求:", this._url);
                //console.log("响应内容:", this.responseText);
                const r = JSON.parse(this.responseText);
                if (r.data && r.data.taskDataList) {
                    setTimeout(function () {
                        addRowEvent(r.data.taskDataList);
                        setColorDate();
                    }, 50);
                }
            });
            return origSend.apply(this, arguments);
        };
    })();

    // 调用函数，设置每天在凌晨 3 点执行任务
    scheduleDailyTask("03", 0, 0, addSelectWithDates);

    function scheduleDailyTask(hour, minute, second, task) {
        // 设置 setInterval 来每天执行任务
        setInterval(()=>{
            // 获取当前时间
            const now = new Date();
            const currentHour = String(now.getHours()).padStart(2, '0');
            console.log("currentHour",currentHour)
            if (currentHour == hour) {
                console.log("执行")
                task()
            } else {
                console.log("继续比较")
            }
        }, 0.5 * 60 * 60 * 1000); // 每24小时执行一次 24 * 60 * 60 * 1000
    }

})();