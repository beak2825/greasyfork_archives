// ==UserScript==
// @name         【JIRA】辅助功能
// @namespace    http://tampermonkey.net/
// @version      1.0.41
// @description  复制标题与链接；创建子任务自动填充；新标签页打开需求、任务；计算总工时 自动填写Tempo 日期填写错误提示
// @author       chenqy、tzp、zyd
// @match        http://192.168.0.151:8080/*
// @match        https://jira.ihotel.cn/*
// @match        https://cdn.bootcdn.net/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/toastify-js/1.12.0/toastify.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.30.1/moment.min.js
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/452143/%E3%80%90JIRA%E3%80%91%E8%BE%85%E5%8A%A9%E5%8A%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/452143/%E3%80%90JIRA%E3%80%91%E8%BE%85%E5%8A%A9%E5%8A%9F%E8%83%BD.meta.js
// ==/UserScript==
(function () {
    'use strict';
    function loadCSS(path) {
        if (!path || path.length === 0) {
            throw new Error('argument "path" is required !');
        }
        var head = document.getElementsByTagName('head')[0];
        var link = document.createElement('link');
        link.href = path;
        link.rel = 'stylesheet';
        link.type = 'text/css';
        head.appendChild(link);
    }

    // 获取特殊内容
    function getSpecialContent(title) {
        let text = '';
        let now = new Date();
        let hours = now.getHours();
        let month = now.getMonth();
        let date = now.getDate();
        if (month == 0 && date == 1) {
            // 元旦
            text = '[烟花] ';
        } else if (month == 1 && date == 14) {
            // 2月14号
            text = '[送花花] ';
        } else if (month == 3 && date == 1) {
            // 4月1号
            text = '[调皮] ';
        } else if (month == 10 && date == 11) {
            // 11月11号
            text = '[火箭] ';
        } else if (title.indexOf("非计划内") > 0){
            text = '[鞠躬] ';
        }
        return text;
    }

    // 获取特殊提示文案
    function getSpecialText() {
        let text = '';
        let now = new Date();
        let hours = now.getHours();
        let month = now.getMonth();
        let date = now.getDate();
        if (month == 0 && date == 1) {
            // 元旦
            text = '，元旦快乐！';
        } else if (month == 1 && date == 14) {
            // 2月14号
            let randNum = Math.floor(Math.random() * 2);
            let specialTextArr = ['无论如何都要幸福呀！', '情人节快乐！'];
            console.log(randNum);
            text = '，' + specialTextArr[randNum];
        } else if (month == 3 && date == 1) {
            // 4月1号
            let randNum = Math.floor(Math.random() * 5);
            let specialTextArr = ['再工作，系统将崩溃！', '愚人节快乐！', '略略略^v^', '你被骗啦！', '哈哈哈哈！'];
            console.log(randNum);
            text = '，' + specialTextArr[randNum];
        } else if (month == 4 && date == 1) {
            // 5月1号
            let randNum = Math.floor(Math.random() * 5);
            let specialTextArr = ['打工是不可能打工的！', '打工仔也太拼了！', '劳动节快乐^v^', '劳动节就该劳动起来！', '劳动最光荣！'];
            console.log(randNum);
            text = '，' + specialTextArr[randNum];
        } else if (month == 4 && date == 4) {
            // 5月4号
            text = '，青年人，靠你了！';
        } else if (month == 9 && date >= 1 && date <= 7) {
            // 10月1号至7号
            text = '，国庆快乐！';
        } else if (month == 10 && date == 11) {
            // 11月11号
            text = '，即使一个人也要好好生活！';
        } else if (month == 11 && date == 25) {
            // 12月25号
            text = '，圣诞快乐！';
        } else if (hours >= 18 && hours <= 20) {
            // 18点到20点
            text = '，今天辛苦了！';
        } else if (hours >= 21 && hours <= 23) {
            // 21点到23点
            text = '，还在工作，你太卷了！';
        } else if (hours >= 0 && hours <= 6) {
            // 0点到6点
            text = '，太拼了，注意休息！';
        } else if (hours >= 7 && hours <= 8) {
            // 7点到8点
            text = '，早上好！';
        } else {
            let randNum = Math.floor(Math.random() * 9);
            let specialTextArr = ['加油呀！', '奥利给^v^', '又是美好的一天！', '太棒了！', '努力呀！', '任重而道远！', '完美！', 'nice！', '你最棒了！'];
            console.log(randNum);
            text = '，' + specialTextArr[randNum];
        }

        //text = '，还在工作，您太卷了！';
        return text;
    }

    // 复制源码关键字
    function copySourceCodeKey() {
        $('#create-menu').after('<button class="aui-button aui-button-primary aui-style" style="background-color: green;" id="copySourceCodeKey">复制源码关键字</button>')
        $(document).on('click', '#copySourceCodeKey', function () {
            var link = window.location.href.split('?')[0]; // 去除查询参数
            var title = $('#summary-val').text();
            var displayname = $('#header-details-user-fullname').data('displayname');
            var keyval = $('#key-val').text();
            var input = document.createElement('input');
            //console.log(input)
            input.value = '--key=' + keyval + ' --user=' + displayname + ' ' + title + ' ' + link;
            document.body.appendChild(input);
            input.select();
            input.setSelectionRange(0, input.value.length),
                document.execCommand('Copy');
            document.body.removeChild(input);
            Toastify({
                text: "复制成功" + getSpecialText(),
                position: "center",
            }).showToast();
        })
    }
    // 复制标题与链接
    function createCopyTitleAndLink() {
        $('#create-menu').after('<button class="aui-button aui-button-primary aui-style" style="background-color: purple;" id="copyTitleAndLink">复制标题&链接</button>')
        $(document).on('click', '#copyTitleAndLink', function () {
            var link = window.location.href.split('?')[0]; // 去除查询参数
            var title = $('#summary-val').text();
            var input = document.createElement('input');
            //console.log(input)
            input.value = title + ' ' + link + ' ' + getSpecialContent(title);
            document.body.appendChild(input);
            input.select();
            input.setSelectionRange(0, input.value.length),
                document.execCommand('Copy');
            document.body.removeChild(input);
            Toastify({
                text: "复制成功" + getSpecialText(),
                position: "center",
            }).showToast();
        })
    }
    // 复制标题
    function createCopyTitle() {
        $('#create-menu').after('<button class="aui-button aui-button-primary aui-style" style="background-color: red;" id="copyTitle">复制标题</button>')
        $(document).on('click', '#copyTitle', function () {
            var title = $('#summary-val').text();
            var input = document.createElement('input');
            //console.log(input)
            input.value = title;
            document.body.appendChild(input);
            input.select();
            input.setSelectionRange(0, input.value.length),
                document.execCommand('Copy');
            document.body.removeChild(input);
            Toastify({
                text: "复制成功" + getSpecialText(),
                position: "center",
            }).showToast();
        })
    }
    //创建子任务自动填充摘要、描述、修复的版本
    function autoCopySubTask() {
        let versions = $("#fixfor-val").find('a');
        let version = "";
        let versionArray = []
        if (versions.length > 0) {
            $.each(versions, function (index, e) {
                //if(!e.classList.contains('ellipsis')){
                versionArray.push(e.text.trim())

                //}
            });
            version = versionArray.join(",")
        }
        console.log("version:" + version);

        let summary = $("#summary-val").text();
        let description = $("#description-val").text();
        let customfield_10209 = $("#customfield_10209-val").text().trim();
        let components = $("#components-val").find('a');
        let component = "";
        let componentArray = []
        if (components.length > 0) {
            $.each(components, function (index, e) {
                if (!e.classList.contains('ellipsis')) {
                    componentArray.push(e.title)

                }
            });
            component = componentArray.join(",")
        }
        console.log("component:" + component);
        let mianLink = window.location.href.split('?')[0];
        console.log("mianLink:" + mianLink);

        setTimeout(() => {

            // 版本
            if (null != $("#fixVersions-textarea").val() && !$("#fixVersions-textarea").val().trim()) {
                $("#fixVersions-textarea").val(version);
                for (let item of versionArray) {
                    console.log('set versions begin[' + item + ']');
                    $("#fixVersions option").each(function () {
                        let fixVersionsText = $(this).text().trim()
                        if (fixVersionsText == item) {
                            console.log("fixVersionsText:[" + fixVersionsText + "] selected");
                            $(this).attr("selected", true);
                        }
                    })
                    console.log('set versions end[' + item + ']');
                }
            }

            if (null != $("#summary").val() && !$("#summary").val().trim()) {
                $("#summary").val(summary);
            }

            description = "详情见于需求，请[点击查看|" + mianLink + "]";
            if (null != $("#description").val() && !$("#description").val().trim() && "点击添加描述信息" != description.trim()) {
                $("#description").val(description);
            }

            if (null != $("#customfield_10209").val() && !$("#customfield_10209").val().trim()) {
                $("#customfield_10209").val(customfield_10209);
            }

            // 模块components
            if (null != $("#components-textarea").val() && !$("#components-textarea").val().trim()) {
                $("#components-textarea").val(component);
                for (let item of componentArray) {
                    console.log('set components begin[' + item + ']');
                    $("#components").find("option[title='" + item + "']").attr("selected", true);
                    console.log('set components end[' + item + ']');
                }
            }

        }, 1000)

    }
    //格式化时间
    function parseTime(arr) {
        let hours = 0;
        let arrs = [];
        let timeToHour = {
            hour: 1,
            hours: 1,
            day: 8,
            days: 8,
            week: 40,
            weeks: 40,
            minute: 0.01667,
            minutes: 0.01667,
        };

        arr.forEach((n) => {
            if (n.indexOf(",") > 0) {
                let time = n.split(",");
                arrs.push(time[0]);
                arrs.push(time[1].trim());
            } else {
                arrs.push(n);
            }
        })

        arrs.forEach((m) => {
            let dataCount = m.split(" ")[0];
            let dateType = m.split(" ")[1];
            hours += dataCount * timeToHour[dateType]
        })
        return hours;
    }
    //计算工作时间
    function calcWorkTime(className) {
        let timeoriginalestimate = document.querySelectorAll(className);
        let timesDescArray = []
        timeoriginalestimate.forEach((n) => {
            if (n.textContent) {
                timesDescArray.push(n.textContent);
            }
        })

        let hours = parseTime(timesDescArray);
        let days = Number(hours/8).toFixed(2)
        Toastify({
            text: "总工时：" + days + "人天",
            position: "center",
        }).showToast();
    }


    $(document).on('click', "#stqc_show,#create-subtask", function () {
        autoCopySubTask();
    })
    $(document).on('click', "#create-issue-submit", function () {
        if ($("#qf-create-another").attr("checked") == "checked") {
            setTimeout(() => {
                autoCopySubTask();
            }, 1000);
        }
    })

    var locationhref = window.location.href;
    let currentDomain = 'http://192.168.0.151:8080';
    if (locationhref.indexOf('https://jira.ihotel.cn') == 0) {
        currentDomain = 'https://jira.ihotel.cn';
    }
    let numCount = 0;
    let mutationCount = 0;
    const checkForLinks = function (mutationsList, observer) {
        mutationCount++;

        const descriptionLinks = [...document.getElementsByClassName('aui-theme-default')].flatMap(e => [...e.getElementsByTagName('a')]);
        for (const link of descriptionLinks) {
            let replace = false;
            if (locationhref.indexOf(currentDomain + '/issues/?filter') == 0 && link.target !== '_blank' && link.href.indexOf(currentDomain + '/browse/') == 0 && link.href.indexOf('?') == -1 && link.href.indexOf('#') == -1) {
                replace = true;
            } else if (link.target !== '_blank' && link.href.indexOf(currentDomain + '/browse/') == 0 && link.href.indexOf('?') == -1 && link.href.indexOf('#') == -1 && link.dataset && link.dataset.issueKey && link.dataset.issueKey != '') {
                replace = true;
            }
            if (replace) {
                numCount++;
                console.log(`[${mutationCount}] [${numCount}] Updating target for link ${link.href}`);
                link.target = '_blank';
                link.addEventListener('click', e => {
                    e.stopPropagation();
                    return false;
                });
            }
        }
    };
    const observer = new MutationObserver(checkForLinks);
    observer.observe(document.body, { attributes: false, childList: true, subtree: true });
    //创建计划
    function initPlan() {

        $(document).on('click', '#edit-issue-submit', function () {
            var startTime = $("#customfield_10300").val();
            var endTime = $("#customfield_10301").val();
            var planItemId = $("#key-val").attr("rel");
            let timetracking_originalestimate = $("#timetracking_originalestimate").val();
            function parseTimeString(timeString) {
                const timeUnits = {
                    w: 7 * 8 * 60 * 60, // 1 week = 7 days
                    d: 8 * 60 * 60,     // 1 day = 8 hours
                    h: 60 * 60,          // 1 hour = 60 minutes
                    m: 60,               // 1 minute = 60 seconds
                    s: 1                 // 1 second = 1 second
                };

                const regex = /(\d+)([wdhms])/g;
                let match;
                let totalSeconds = 0;

                while ((match = regex.exec(timeString)) !== null) {
                    const value = parseInt(match[1], 10);
                    const unit = match[2];
                    totalSeconds += value * timeUnits[unit];
                }

                return totalSeconds;
            }
            var url = $('#assignee-val .aui-avatar-inner img').attr("src");
            function getUrlParameter(url, name) {
                name = name.replace(/[]/, "\[").replace(/[]/, "\[").replace(/[]/, "\\\]");
                var regexS = "[\\?&]" + name + "=([^&#]*)";
                var regex = new RegExp(regexS);
                var results = regex.exec(url);
                if (results == null)
                    return "";
                else {
                    return results[1];
                }
            };
            function convertChineseDateToEnglish(dateStr) {
                // 分割字符串
                const parts = dateStr.split('/');
                const day = parts[0];
                const monthCN = parts[1];
                const year = parts[2];
                // 中文月份到英文月份的映射
                const monthMap = {
                    '一月': 'Jan',
                    '二月': 'Feb',
                    '三月': 'Mar',
                    '四月': 'Apr',
                    '五月': 'May',
                    '六月': 'Jun',
                    '七月': 'Jul',
                    '八月': 'Aug',
                    '九月': 'Sep',
                    '十月': 'Oct',
                    '十一月': 'Nov',
                    '十二月': 'Dec'
                };
                // 转换月份
                const monthEN = monthMap[monthCN];
                if (!monthEN) {
                    throw new Error('Invalid month');
                }
                // 重新组合
                return `${day}/${monthEN}/${year}`;
            }
            let assigneeKey = getUrlParameter(url, "ownerId")
            if (startTime && endTime && timetracking_originalestimate) {
                let tempoTableCellContent = $('[name="tempoTableCellContent"]');
                let deleteId = "";
                let newStartTime = moment(convertChineseDateToEnglish(startTime));
                let newEndTime = moment(convertChineseDateToEnglish(endTime));
                if (newEndTime.isBefore(newStartTime)){
                    Toastify({
                        text: "计划完成时间不能早于计划开始时间",
                        position: "center",
                        style: {
                            background: "linear-gradient(to right, red, red)",
                        },
                    }).showToast();
                   return false;
                }
                function traverseAndExtractId(element) {
                    $(element).children().each(function () {
                        // 检查当前元素是否有name属性
                        var nameAttr = $(this).attr('name');
                        if (nameAttr) {
                            // 使用正则表达式匹配并提取数字部分
                            var match = nameAttr.match(/value_plan_(\d+)$/);
                            if (match) {
                                deleteId = match[1];
                            }
                        }
                        // 递归遍历子元素
                        traverseAndExtractId(this);
                    });
                }
                traverseAndExtractId(tempoTableCellContent);
                function deletePlan(id, cb) {
                    fetch(`https://jira.ihotel.cn/rest/tempo-planning/1/allocation/${id}`, {
                        method: "DELETE", // *GET, POST, PUT, DELETE, etc.
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }).then((res) => {
                        cb && cb();
                    })
                        .catch((error) => {
                            console.error("Error:", error);
                        });
                }
                function addPlan() {
                    function getCountWeekends(startDateStr, endDateStr) {
                        const startDate = startDateStr;
                        const endDate = endDateStr;
                        let countWeekends = 0;
                        let currentDate = startDate.clone();
                        while (currentDate.isBefore(endDate) || currentDate.isSame(endDate)) {
                            const dayOfWeek = currentDate.day();
                            if (dayOfWeek === 0) {
                                countWeekends++;
                            } else if (dayOfWeek === 6) {
                                countWeekends++;
                            }
                            currentDate.add(1, 'days');
                        }
                        return countWeekends;
                    }
                    let countWeekends = getCountWeekends(newStartTime, newEndTime)
                    let data = {
                        "planItemType": "ISSUE",
                        "planItemId": planItemId,
                        "planApproval": null,
                        "start": newStartTime.format('YYYY-MM-DD'),
                        "end": newEndTime.format('YYYY-MM-DD'),
                        "day": moment().format('YYYY-MM-DD'),
                        "assigneeKey": assigneeKey,
                        "includeNonWorkingDays": false,
                        "secondsPerDay": parseTimeString(timetracking_originalestimate) / (newEndTime.diff(newStartTime, 'days') - countWeekends + 1)
                    }
                    fetch("https://jira.ihotel.cn/rest/tempo-planning/1/plan", {
                        method: "POST", // *GET, POST, PUT, DELETE, etc.
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(data),
                    })
                }
                if (deleteId) {
                    deletePlan(deleteId, () => {
                        addPlan()
                    });
                } else {
                    addPlan()
                }
            }
        });
    }
    function betterTimeDisplay(str){
        if(str){
            return str.split("/").reverse().join("/")
        }
    }
    function initPlanTime() {
        let theList = $("#issuetable tr");
        let issueList = [];
        theList.each((i,n)=>{
            if ($(n).attr('data-issuekey')){
                issueList.push(n)
            }
        })
        if (issueList.length>0){
            issueList.forEach((n)=>{
                let issuekey = $(n).attr('data-issuekey');
                fetch(`https://jira.ihotel.cn/browse/${issuekey}`, {
                    method: "GET",
                }).then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.text();
                }).then(html => {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(html, "text/html");
                    let fromDate = $(doc).find("#customfield_10300-val time").text();
                    let toDate = $(doc).find("#customfield_10301-val time").text();
                    var $planTimeTd = $(`<td class="planTime" style="min-width:70px">${fromDate ? fromDate : "开始时间未排"}<br>${toDate ? toDate :"结束时间未排"}</td>`);
                    $(n).find('.issue_actions').before($planTimeTd);
                    let orig = $(doc).find("#tt_single_values_orig").text().trim();
                    let remain = $(doc).find("#tt_single_values_remain").text().trim();
                    var $timeCount = $(`<td class="timeCount" style="min-width:20px">${orig}<br>${remain}</td>`);
                    $(n).find('.progress').after($timeCount);
                })
            })
        }
    }
    if (locationhref.indexOf(currentDomain + '/browse/') == 0 || (locationhref.indexOf(currentDomain + '/projects/') == 0 && locationhref.indexOf('issues') != -1)) {
        loadCSS("https://cdnjs.cloudflare.com/ajax/libs/toastify-js/1.12.0/toastify.min.css")
        copySourceCodeKey();
        createCopyTitleAndLink();
        createCopyTitle();
        autoCopySubTask();
        initPlan();
        initPlanTime();
    }

    if (locationhref.indexOf(currentDomain + '/issues/?filter') == 0) {
        $('#create-menu').after('<button class="aui-button aui-button-primary aui-style" style="background-color: red;" id="calcTime">预估工时</button>');
        $('#create-menu').after('<button class="aui-button aui-button-primary aui-style" style="background-color: green;" id="reallyCalcTime">实际工时</button>');
        loadCSS("https://cdnjs.cloudflare.com/ajax/libs/toastify-js/1.12.0/toastify.min.css")
        $("#calcTime").on("click", function () {
            calcWorkTime(".timeoriginalestimate");
        })
        $("#reallyCalcTime").on("click", function () {
            calcWorkTime(".aggregatetimespent");
        })
    }
})();