// ==UserScript==
// @name         Mobile Jira Tools
// @namespace    http://www.akuvox.com/
// @version      2.0
// @description  Jira看板，自动统计工作量
// @author       bink
// @match        http://192.168.10.2:82/secure/RapidBoard.jspa?rapidView=13*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=10.2
// @grant        none
// @license      bink
// @downloadURL https://update.greasyfork.org/scripts/475791/Mobile%20Jira%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/475791/Mobile%20Jira%20Tools.meta.js
// ==/UserScript==

(function () {

    /*库方法*/
    HTMLElement.prototype.appendHTML = function (html) {
        var divTemp = document.createElement("div"), nodes = null
            , fragment = document.createDocumentFragment();
        divTemp.innerHTML = html;
        nodes = divTemp.childNodes;
        for (var i = 0, length = nodes.length; i < length; i += 1) {
            fragment.appendChild(nodes[i].cloneNode(true));
        }
        this.appendChild(fragment);
        nodes = null;
        fragment = null;
    };

    setInterval(doGetDataAndShowWorkload, 1000);

    function doGetDataAndShowWorkload() {
        // 页面及所有资源加载完成后执行的代码
        $.get('http://192.168.10.2:82/rest/greenhopper/1.0/xboard/work/allData.json?rapidViewId=13&selectedProjectKey=MOBILE2023', function (data) {
            // 请求成功，打印响应数据
            showWorkload(data);

        }).fail(function () {
            // 请求失败，打印错误信息
            showWorkload("");

        });
    }

    function getProjectNameFromSummary(summary) {
        if (summary == null) {
            return "";
        }
        const parts = String(summary).split('#');
        const mainText = parts[0].trim();
        return mainText || "";
    }

    function exportHomeTaskStats() {
        $.get('http://192.168.10.2:82/rest/greenhopper/1.0/xboard/work/allData.json?rapidViewId=13&selectedProjectKey=MOBILE2023', function (data) {
            if (data && data.issuesData && data.issuesData.issues) {
                var allData = data.issuesData.issues;
                var stats = [];

                for (var i = 0; i < allData.length; i++) {
                    console.log(`debug data is ${allData[i]}`);
                    if (allData[i].statusId == "10008") continue; // 跳过取消的任务

                    if(allData[i].summary)

                    var dueDate = "";
                    var workload = "";
                    var progress = "";
                    var summary = allData[i].summary;
                    var projectInfo = getProjectNameFromSummary(allData[i].summary);
                    if (summary.includes('占位')) {
                        continue;
                    }
                    allData[i].extraFields.forEach(field => {
                        if (field.id == "customfield_10303") {
                            dueDate = getDateFromHtml(field.html);
                        } else if (field.id == "aggregatetimeestimate") {
                            workload = convertHoursToDays(parseTimeToHours(field.html));
                        } else if (field.id == "customfield_10205") {
                            progress = field.html;
                        }
                    });

                    if (isDateInLastMonth(new Date(dueDate))) {
                        var displayName = transUserNameToDisplayName(allData[i].assignee);
                        stats.push([summary, projectInfo, displayName, workload, dueDate, progress]);
                    }
                }

                var csvContent = "任务摘要,所属项目,经办人,工作量,完成时间,总进度\n" +
                    stats.map(row => row.map(field => (typeof field === 'string' && field.includes(',')) ? `"${field.replace(/"/g, '""')}"` : field).join(',')).join('\n');

                var blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
                var link = document.createElement("a");
                var lastMonth = new Date();
                lastMonth.setMonth(lastMonth.getMonth() - 1);
                link.href = URL.createObjectURL(blob);
                link.download = `家居任务统计_${lastMonth.getFullYear()}_${lastMonth.getMonth() + 1}.csv`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }).fail(function () {
            console.error("获取任务数据失败");
            alert("获取任务数据失败，请刷新页面重试");
        });
    }
    window.exportHomeTaskStats = exportHomeTaskStats;


    var loadButton = true;
    var isFirst = true;
    function showWorkload(data) {
        //var element = document.getElementsByClassName("subnav-container")[0].parentNode;
        var element = document.getElementById("ghx-operations");
        if (loadButton) {
            loadButton = false;
            document.getElementById('ghx-header').setAttribute('isshow', 0);
            element.appendHTML("<a  class=\"aui-button aui-button-primary aui-style\" onclick=\"document.getElementById('LastMonthPBX').style.display = '';document.getElementById('ghx-header').setAttribute('isshow',1);\" >上月PBC</a><a  class=\"aui-button aui-button-primary aui-style \" onclick=\"document.getElementById('CurMonthPBX').style.display = '';document.getElementById('ghx-header').setAttribute('isshow',1);\">本月PBC</a><a  class=\"aui-button aui-button-primary aui-style \" onclick=\"document.getElementById('NextMonthPBX').style.display = '';document.getElementById('ghx-header').setAttribute('isshow',1);\" >下月PBC</a><a  class=\"aui-button aui-button-primary aui-style \" onclick=\"exportHomeTaskStats()\" >上月任务统计表</a></br>");
        }
        if (document.getElementById("AkuvoxWorkload") !== null) {
            document.getElementById("AkuvoxWorkload").innerHTML = "";
            element = document.getElementById("AkuvoxWorkload");
        }
        if (data == "") {
            element.appendHTML("<span id=\"AkuvoxWorkload\" style=\"color: red;font-size: 14px;\">工作量统计错误，请刷新界面</span>");
            return;
        }
        var allData = data.issuesData.issues;
        var displayName = getDisplayName();
        var projectWork = isProject(displayName);
        var timeData = getMyWorkLoad(allData, projectWork);
        console.log(timeData);

        if (projectWork) {
            element.appendHTML("<span id=\"AkuvoxWorkload\" style=\"font-size: 14px;\">" + displayName + ":总工作量：<span style=\"color:red;\">" + hoursToDaysAndHours(timeData.totalWorkload) + "</span>;  开发工作量：<span style=\"color:red;\">" + hoursToDaysAndHours(timeData.totalWorkload - timeData.fixBugWorkload) + "</span>; 修BUG工作量：<span style=\"color:red;\">" + hoursToDaysAndHours(timeData.fixBugWorkload) + "</span>; </span>");
        } else {
            element.appendHTML("<span id=\"AkuvoxWorkload\" style=\"font-size: 14px;\">" + displayName + ":本周工作量：<span style=\"color:red;\">" + hoursToDaysAndHours(timeData.thisWeekWorkload) + "</span>;  下周工作量：<span style=\"color:red;\">" + hoursToDaysAndHours(timeData.netWeekWorkload) + "</span>; 本月工作量：<span style=\"color:red;\">" + hoursToDaysAndHours(timeData.thisMonthWorkload) + "</span>;  下月工作量：<span style=\"color:red;\">" + hoursToDaysAndHours(timeData.nextMonthWorkload) + "</span></span>");
        }



        var body = document.getElementById("jira");
        var lastPbc = "";
        for (var i = 0; i < timeData.lastMonthResult.length; i++) {
            var dueDate = ""
            var worktime = ""
            var progress = ""
            for (var j = 0; j < timeData.lastMonthResult[i].extraFields.length; j++) {
                if (timeData.lastMonthResult[i].extraFields[j].id == "customfield_10303") {
                    dueDate = getDateFromHtml(timeData.lastMonthResult[i].extraFields[j].html);
                }
                if (timeData.lastMonthResult[i].extraFields[j].id == "aggregatetimeestimate") {
                    worktime = timeData.lastMonthResult[i].extraFields[j].html;
                }
                if (timeData.lastMonthResult[i].extraFields[j].id == "customfield_10205") {
                    progress = timeData.lastMonthResult[i].extraFields[j].html;
                }
            }
            lastPbc = lastPbc + ("<tr><td>" + timeData.lastMonthResult[i].summary + "</td><td>" + dueDate + "</td><td>" + dueDate + "</td><td>" + worktime + "</td><td>" + 0 + "</td><td>" + 0 + "</td><td>" + progress + "</td>");
        }

        var curPbc = "";
        for (var i = 0; i < timeData.thisMonthResult.length; i++) {
            var dueDate = ""
            var worktime = ""
            var progress = ""
            for (var j = 0; j < timeData.thisMonthResult[i].extraFields.length; j++) {
                if (timeData.thisMonthResult[i].extraFields[j].id == "customfield_10303") {
                    dueDate = getDateFromHtml(timeData.thisMonthResult[i].extraFields[j].html);
                }
                if (timeData.thisMonthResult[i].extraFields[j].id == "aggregatetimeestimate") {
                    worktime = timeData.thisMonthResult[i].extraFields[j].html;
                }
                if (timeData.thisMonthResult[i].extraFields[j].id == "customfield_10205") {
                    progress = timeData.thisMonthResult[i].extraFields[j].html;
                }
            }
            curPbc = curPbc + ("<tr><td>" + timeData.thisMonthResult[i].summary + "</td><td>" + dueDate + "</td><td>" + dueDate + "</td><td>" + worktime + "</td><td>" + 0 + "</td><td>" + 0 + "</td><td>" + progress + "</td>");
        }

        var nextPbc = "";
        for (var i = 0; i < timeData.nextMonthResult.length; i++) {
            var dueDate = ""
            var worktime = ""
            var progress = ""
            for (var j = 0; j < timeData.nextMonthResult[i].extraFields.length; j++) {
                if (timeData.nextMonthResult[i].extraFields[j].id == "customfield_10303") {
                    dueDate = getDateFromHtml(timeData.nextMonthResult[i].extraFields[j].html);
                }
                if (timeData.nextMonthResult[i].extraFields[j].id == "aggregatetimeestimate") {
                    worktime = timeData.nextMonthResult[i].extraFields[j].html;
                }
                if (timeData.nextMonthResult[i].extraFields[j].id == "customfield_10205") {
                    progress = timeData.nextMonthResult[i].extraFields[j].html;
                }
            }
            nextPbc = nextPbc + ("<tr><td>" + timeData.nextMonthResult[i].summary + "</td><td>" + dueDate + "</td><td>" + dueDate + "</td><td>" + worktime + "</td><td>" + 0 + "</td><td>" + 0 + "</td><td>" + progress + "</td>");
        }

        var last = body;
        var cur = body;
        var next = body;
        var isShow = document.getElementById('ghx-header').getAttribute('isShow');
        console.log("isShow:", isShow);
        if (isShow == 0) {
            if (document.getElementById("LastMonthPBX") !== null) {
                console.log("dlaksjdlasjkl!!!!!!!!!!!!!!!!!!!!");
                document.getElementById("LastMonthPBX").innerHTML = "";
                document.getElementById("CurMonthPBX").innerHTML = "";
                document.getElementById("NextMonthPBX").innerHTML = "";
                //body.removeChild(document.getElementById("LastMonthPBX"));
                //body.removeChild(document.getElementById("CurMonthPBX"));
                //body.removeChild(document.getElementById("NextMonthPBX"));
                last = document.getElementById("LastMonthPBX");
                cur = document.getElementById("CurMonthPBX");
                next = document.getElementById("NextMonthPBX");

            }
            var lastMonthPBXHtml = "<div id=\"LastMonthPBX\" class=\"jira-dialog box-shadow jira-dialog-open popup-width-custom jira-dialog-content-ready\" style=\"width: 810px; margin-left: -406px; top: 0%;" + (isFirst ? "display:none" : "") + "\">" +
                "<span class=\"ghx-iconfont aui-icon aui-icon-small aui-iconfont-close-dialog\" onclick=\"document.getElementById('LastMonthPBX').style.display = 'none';document.getElementById('ghx-header').setAttribute('isshow',0);\" style=\"float: right;\"></span>" +
                "<table border=\"1\">" +
                "<tr><th style=\"font-size: 12px;\">任务名称</th>" +
                "<th style=\"font-size: 12px;\">计划完成时间</th>" +
                "<th style=\"font-size: 12px;\">实际完成时间</th>" +
                "<th style=\"font-size: 12px;\">工作量</th>" +
                "<th style=\"font-size: 12px;\">已超期</th>" +
                "<th style=\"font-size: 12px;\">未完成</th>" +
                "<th style=\"font-size: 12px;\">总进度</th></tr>" + lastPbc + "</table></div>";

            var curMonthPBXHtml = "<div id=\"CurMonthPBX\" class=\"jira-dialog box-shadow jira-dialog-open popup-width-custom jira-dialog-content-ready\" style=\"width: 810px; margin-left: -406px; top: 0%;" + (isFirst ? "display:none" : "") + "\">" +
                "<span class=\"ghx-iconfont aui-icon aui-icon-small aui-iconfont-close-dialog\" onclick=\"document.getElementById('CurMonthPBX').style.display = 'none';document.getElementById('ghx-header').setAttribute('isshow',0);\" style=\"float: right;\"></span>" +
                "<table border=\"1\">" +
                "<tr><th style=\"font-size: 12px;\">任务名称</th>" +
                "<th style=\"font-size: 12px;\">计划完成时间</th>" +
                "<th style=\"font-size: 12px;\">实际完成时间</th>" +
                "<th style=\"font-size: 12px;\">工作量</th>" +
                "<th style=\"font-size: 12px;\">已超期</th>" +
                "<th style=\"font-size: 12px;\">未完成</th>" +
                "<th style=\"font-size: 12px;\">总进度</th></tr>" + curPbc + "</table></div>";

            var nextMonthPBXHtml = "<div id=\"NextMonthPBX\" class=\"jira-dialog box-shadow jira-dialog-open popup-width-custom jira-dialog-content-ready\" style=\"width: 810px; margin-left: -406px; top: 0%;" + (isFirst ? "display:none" : "") + "\">" +
                "<span class=\"ghx-iconfont aui-icon aui-icon-small aui-iconfont-close-dialog\" onclick=\"document.getElementById('NextMonthPBX').style.display = 'none';document.getElementById('ghx-header').setAttribute('isshow',0);\" style=\"float: right;\"></span>" +
                "<table border=\"1\">" +
                "<tr><th style=\"font-size: 12px;\">任务名称</th>" +
                "<th style=\"font-size: 12px;\">计划完成时间</th>" +
                "<th style=\"font-size: 12px;\">实际完成时间</th>" +
                "<th style=\"font-size: 12px;\">工作量</th>" +
                "<th style=\"font-size: 12px;\">已超期</th>" +
                "<th style=\"font-size: 12px;\">未完成</th>" +
                "<th style=\"font-size: 12px;\">总进度</th></tr>" + nextPbc + "</table></div>";

            cur.appendHTML(curMonthPBXHtml);
            last.appendHTML(lastMonthPBXHtml);
            next.appendHTML(nextMonthPBXHtml);
        }
        isFirst = false;
    }

    function isProject(str) {
        return (str == "V4.0.0" || str == "V3.4.1" || str == "BelaHome新UI"||str == "V7.3.0" || str == "BYA-NAG" || str == "Hager" || str == "蓝牙新方案");
    }

    function getDateFromHtml(str) {
        var match = /<time datetime="([^"]+)">/.exec(str);
        // 如果找到匹配项，则提取日期
        if (match) {
            var datetimeValue = match[1];
            //console.log(datetimeValue); // 输出 "2023-09-20"
            return datetimeValue;
        } else {
            console.log("未找到匹配项");
            return "";
        }
    }

    // 获取当前日期
    function getCurrentDate() {
        return new Date();
    }

    // 判断日期是否属于本周
    function isDateInThisWeek(date) {
        const currentDate = getCurrentDate();
        const currentWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay());
        const inputWeek = new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay());
        return currentWeek.getTime() === inputWeek.getTime();
    }

    // 判断日期是否属于下周
    function isDateInNextWeek(date) {
        const currentDate = getCurrentDate();
        const nextWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay() + 7);
        const inputWeek = new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay());
        return nextWeek.getTime() === inputWeek.getTime();
    }

    // 判断日期是否属于本月
    function isDateInThisMonth(date) {
        const currentDate = getCurrentDate();
        return currentDate.getMonth() === date.getMonth() && currentDate.getFullYear() === date.getFullYear();
    }

    // 判断日期是否属于下月
    function isDateInNextMonth(date) {
        const currentDate = getCurrentDate();
        const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
        return nextMonth.getMonth() === date.getMonth() && nextMonth.getFullYear() === date.getFullYear();
    }

    // 判断日期是否属于上月
    function isDateInLastMonth(date) {
        const currentDate = getCurrentDate();
        const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
        return lastMonth.getMonth() === date.getMonth() && lastMonth.getFullYear() === date.getFullYear();
    }

    function parseTimeToHours(inputString) {
        // 使用正则表达式匹配 "数字 单位" 格式的字符串
        const regex = /(\d+)\s*(h|hour|day|week)s?/g;
        let matches = [];
        let match;
        let numberOfHours = 0;
        while ((match = regex.exec(inputString)) !== null) {
            matches.push({
                value: parseInt(match[1], 10),
                unit: match[2]
            });
        }
        matches.forEach(match => {
            if (match.unit === "day" || match.unit === "days") {
                 numberOfHours += match.value * 8;
             } else if (match.unit === "week" || match.unit === "weeks") {
                 numberOfHours += match.value * 8 * 5;
             } else if (match.unit == "h" || match.unit == "hour" || match.unit == "hours") {
                 numberOfHours += match.value;
             }
        });
        return numberOfHours;
    }

    function getUserName() {
        var currentURL = window.location.href;
        if (currentURL.includes('quickFilter=')) {
            // 提取quickFilter参数的值
            const urlParams = new URLSearchParams(currentURL.split('?')[1]);
            const quickFilterValue = urlParams.get('quickFilter');
            if (quickFilterValue == 82) {
                return "Bink"
            } else if (quickFilterValue == 85) {
                return "zhiming.xu"
            } else if (quickFilterValue == 83) {
                return "jiawei.dai"
            } else if (quickFilterValue == 87) {
                return "huayang.zeng"
            } else if (quickFilterValue == 86) {
                return "zhongbin.wen"
            } else if (quickFilterValue == 84) {
                return "yisha.yang"
            } else if (quickFilterValue == 133) {
              return "han.lin"
            } else {
                return document.getElementById("header-details-user-fullname").getAttribute('data-username');
            }
        } else {
            return document.getElementById("header-details-user-fullname").getAttribute('data-username');
        }
    }
    function getDisplayName() {
        var currentURL = window.location.href;
        if (currentURL.includes('quickFilter=')) {
            // 提取quickFilter参数的值
            const urlParams = new URLSearchParams(currentURL.split('?')[1]);
            const quickFilterValue = urlParams.get('quickFilter');

            const displayNameMap = new Map([
                ['82', "游炳坤"],
                ['85', "许志明"],
                ['83', "戴佳伟"],
                ['87', "曾华央"],
                ['86', "温仲斌"],
                ['84', "杨伊莎"],
                ['133', "林函"],
                ['141', "SL60"],
                ['215', "V4.0.0"],
                ['187', "V3.4.1"],
                ['191', "BelaHome新UI"],
                ['216', "V7.3.0"],
                ['217', "蓝牙新方案"],
                ['218', "BYA-NAG"],
                ['219', "Hager"],
            ]);

            if (displayNameMap.has(quickFilterValue)) {
                return displayNameMap.get(quickFilterValue);
            } else {
                return document.getElementById("header-details-user-fullname").getAttribute('data-displayname');
            }
        } else {
            return document.getElementById("header-details-user-fullname").getAttribute('data-displayname');
        }
    }

    function hoursToDaysAndHours(hours) {
        // 计算天数和剩余小时数
        var days = Math.floor(hours / 8);
        var remainingHours = hours % 8;

        // 构造结果字符串
        var result = "";
        if (days > 0) {
            result += days + "天 ";
        }
        result += remainingHours + "小时";

        return result;
    }

    const userNameToDisplayName = {
        "huayang.zeng": "曾华央",
        "zhiming.xu": "许志明",
        "yisha.yang": "杨伊莎",
        "Bink": "游炳坤",
        "zhongbin.wen": "温仲斌",
        "jiawei.dai": "戴佳伟",
        "han.lin": "林函"
    };

    function transUserNameToDisplayName(userName) {
        return userNameToDisplayName[userName] || userName;
    }

    function convertHoursToDays(hours) {
        const hoursPerDay = 8;
        const days = hours / hoursPerDay;
        return days.toFixed(2); // 保留两位小数
    }

    function getMyWorkLoad(allData, projectWork) {
        // 获得用户名
        var userName = getUserName();
        var displayName = getDisplayName();

        var thisWeekWorkload = 0;
        var netWeekWorkload = 0;
        var thisMonthWorkload = 0;
        var nextMonthWorkload = 0;
        var totalWorkload = 0;
        var fixBugWorkload = 0;
        var todoWorkload = 0;

        var thisMonthResult = [];
        var nextMonthResult = [];
        var lastMonthResult = [];
        for (var i = 0; i < allData.length; i++) {
            var cancelIssue = allData[i].statusId == "10008";
            var todoIssue = allData[i].statusId == "10002";
            if (cancelIssue || todoIssue) {
                continue;
            }
            if (projectWork) {
               if (allData[i].summary.includes(displayName)) {
                    var fixBugIssue = allData[i].summary.includes("bug#");
                    for (var j = 0; j < allData[i].extraFields.length; j++) {
                        if (allData[i].extraFields[j].id == "aggregatetimeestimate") {
                            time = parseTimeToHours(allData[i].extraFields[j].html);
                            totalWorkload += time;
                            if (fixBugIssue) {
                                fixBugWorkload += time;
                            }
                            continue;
                        }
                    }

                }
            } else {
                if (allData[i].assignee == userName) {

                    var thisWeek = 0;
                    var nextWeek = 0;
                    var thisMonth = 0;
                    var nextMonth = 0;
                    var time = 0;

                    for (var j = 0; j < allData[i].extraFields.length; j++) {
                        if (allData[i].extraFields[j].id == "aggregatetimeestimate") {
                            time = parseTimeToHours(allData[i].extraFields[j].html);
                            //console.log(`time ${time}`);
                        } else if (allData[i].extraFields[j].id == "customfield_10303") {
                            var datetimeValue = getDateFromHtml(allData[i].extraFields[j].html);
                            var date = new Date(datetimeValue);
                            //console.log(datetimeValue);
                            //console.log(`isDateInThisWeek ${isDateInThisWeek(date)}`);
                            //console.log(`isDateInNextWeek ${isDateInNextWeek(date)}`);
                            //console.log(`isDateInThisMonth ${isDateInThisMonth(date)}`);
                            //console.log(`isDateInNextMonth ${isDateInNextMonth(date)}`);
                            //console.log(`isDateInLastMonth ${isDateInLastMonth(date)}`);
                            if (isDateInThisWeek(date)) {
                                thisWeek = time;
                            }
                            if (isDateInNextWeek(date)) {
                                nextWeek = time;
                            }
                            if (isDateInThisMonth(date)) {
                                thisMonth = time;
                                thisMonthResult.push(allData[i]);
                            }
                            if (isDateInNextMonth(date)) {
                                nextMonth = time;
                                nextMonthResult.push(allData[i]);
                            }
                            if (isDateInLastMonth(date)) {
                                lastMonthResult.push(allData[i]);
                            }
                        }
                    }
                    thisWeekWorkload += thisWeek;
                    netWeekWorkload += nextWeek;
                    thisMonthWorkload += thisMonth;
                    nextMonthWorkload += nextMonth;
                }

            }
        }
        return {
            "thisWeekWorkload": thisWeekWorkload,
            "netWeekWorkload": netWeekWorkload,
            "thisMonthWorkload": thisMonthWorkload,
            "nextMonthWorkload": nextMonthWorkload,
            "totalWorkload": totalWorkload,
            "fixBugWorkload": fixBugWorkload,
            "thisMonthResult": thisMonthResult,
            "nextMonthResult": nextMonthResult,
            "lastMonthResult": lastMonthResult
        };
    }


})();