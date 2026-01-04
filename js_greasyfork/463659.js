// ==UserScript==
// @name         Amazon亚马逊业务报告批量下载
// @version      0.1
// @description  Amazon亚马逊业务报告批量下载与导出脚本
// @author       Lan123
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @require      https://cdn.jsdelivr.net/npm/notice-tampermonkey@0.4.0/index.js
// @include      https://sellercentral*.amazon.tld/business-report*
// @license      LGPL
// @namespace https://greasyfork.org/users/1034494
// @downloadURL https://update.greasyfork.org/scripts/463659/Amazon%E4%BA%9A%E9%A9%AC%E9%80%8A%E4%B8%9A%E5%8A%A1%E6%8A%A5%E5%91%8A%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/463659/Amazon%E4%BA%9A%E9%A9%AC%E9%80%8A%E4%B8%9A%E5%8A%A1%E6%8A%A5%E5%91%8A%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==


(function () {
    'use strict';
    //后端接口
    const SERVER = 'https://xxxxx.org/report';
    function request(url, method, data = {}) {
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                url: url,
                method: method,
                data: data,
                onload: function (xhr) {
                    resolve(xhr.responseText);
                }
            });
        });
    }
    //利用api请求列
    async function getColumns(url, legacyReportId) {

        let data = JSON.stringify({
            "operationName": "reportDataQuery",
            "variables": {
                "input": {
                    "legacyReportId": legacyReportId
                }
            },
            "query": "query reportDataQuery($input: GetReportDataInput) {\n  getReportData(input: $input) {\n    granularity\n    hadPrevious\n    hasNext\n    size\n    startDate\n    endDate\n    page\n    columns {\n      label\n      valueFormat\n      isGraphable\n      translationKey\n      isDefaultSortAscending\n      isDefaultGraphed\n      isDefaultSelected\n      isDefaultSortColumn\n      __typename\n    }\n    rows\n    __typename\n  }\n}\n"
        });
        let response = await request(url, "post", data);
        let columns = JSON.parse(response).data.getReportData.columns;
        let translationKey = [];
        for (let col of columns) {
            translationKey.push(col.translationKey);
        }
        return (translationKey);

    }

    //获取两日期之间日期列表函数
    function getdiffdate(stime, etime) {
        //初始化日期列表，数组
        let diffdate = new Array();
        let i = 0;
        //开始日期小于等于结束日期,并循环
        while (stime <= etime) {
            diffdate[i] = stime;

            //获取开始日期时间戳
            let stime_ts = new Date(stime).getTime();
            //console.log('当前日期：'+stime   +'当前时间戳：'+stime_ts);

            //增加一天时间戳后的日期
            let next_date = stime_ts + (24 * 60 * 60 * 1000);

            //拼接年月日，这里的月份会返回（0-11），所以要+1
            let next_dates_y = new Date(next_date).getFullYear() + '-';
            let next_dates_m = (new Date(next_date).getMonth() + 1 < 10) ? '0' + (new Date(next_date).getMonth() + 1) + '-' : (new Date(next_date).getMonth() + 1) + '-';
            let next_dates_d = (new Date(next_date).getDate() < 10) ? '0' + new Date(next_date).getDate() : new Date(next_date).getDate();

            stime = next_dates_y + next_dates_m + next_dates_d;

            //增加数组key
            i++;
        }
        return diffdate;
    }

    //获取月份下载列表
    function getMonthList(startDay, endDay) {
        let taskList = [];
        let startYear = startDay.split('-')[0];
        let startMonth = startDay.split('-')[1];
        let endYear = endDay.split('-')[0];
        let endMonth = endDay.split('-')[1];
        while (startYear <= endYear) {

            let monthEnd = getLastDayOfMonth(startYear, startMonth);
            if (endYear == startYear && endMonth == startMonth) {
                monthEnd = endDay;
            }
            if (startMonth < 10) { startMonth = '0' + Number(startMonth); }
            taskList.push({
                name: startYear + '-' + startMonth,
                start: startYear + '-' + startMonth + '-01',
                end: monthEnd
            });
            startMonth++;
            if (startMonth > 12) {
                startYear++;
                startMonth = 1;
            }
            if (startYear == endYear && startMonth > endMonth) {
                break;
            }
        }

        return (taskList);
    }

    // 获取某年某月的最后一天
    function getLastDayOfMonth(year, month) {
        //定义当月的第一天
        let date = new Date(year, month - 1, '01');
        //设置日期
        date.setDate(1);
        //设置月份
        date.setMonth(date.getMonth() + 1);
        //获取本月的最后一天
        let cdate = new Date(date.getTime() - 1000 * 60 * 60 * 24);
        //返回结果
        month = month < 10 ? '0' + Number(month) : month;
        return (year + '-' + month + '-' + cdate.getDate());
    }
    //延迟函数
    function sleep(time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }

    function addObserver(target, callback) {
        let nodeList = new Set();
        const observer = new MutationObserver(() => {
            const node = document.querySelector(target);
            if (node && !nodeList.has(node)) {

                nodeList.add(node);
                callback(node);

            }
        });
        observer.observe(document, { childList: true, subtree: true });

    }

    //下载
    async function download(taskList, method = "down") {
        const url = "/business-reports/api";
        //获取当前账号
        const account = document.querySelector(".partner-dropdown-button").textContent.replaceAll(" ", "").replaceAll("|", "_");
        //业务报告类型参数
        const legacyReportId = decodeURIComponent(location.href).split("&")[0].split("?")[1].split("=")[1];
        const columns = await getColumns(url, legacyReportId);
        //遍历下载任务
        for (let task of taskList) {
            let reportDataDownloadQuery = JSON.stringify({
                "operationName": "reportDataDownloadQuery",
                "variables": {
                    "input": {
                        "legacyReportId": legacyReportId,
                        "startDate": task.start,
                        "endDate": task.end,
                        "userSelectedRows": [],
                        "selectedColumns": columns
                    }
                },
                "query": "query reportDataDownloadQuery($input: GetReportDataInput) {\n  getReportDataDownload(input: $input) {\n    url\n    __typename\n  }\n}\n"
            });
            //请求获取下载链接
            let response = await request(url, "post", reportDataDownloadQuery);
            let downloadUrl = JSON.parse(response).data.getReportDataDownload.url;
            if (method == 'down') {
                //下载文件

                GM_download(downloadUrl, account + "_" + task.name + ".csv");
            } else {

                //发送到服务器
                let reportData = await request(downloadUrl, 'GET');
                const pushdata = JSON.stringify({
                    "account": account,
                    "startDate": task.start,
                    "endDate": task.end,
                    "reportData": reportData
                });
                request(SERVER, "post", pushdata);

            }
            //消息框可以显示在9个位置：topLeft, topCenter, middleLeft, middleRight, middleCenter, bottomLeft, bottomRight, bottomCenter
            new NoticeJs({
                text: "已处理:" + account + task.name,
                position: 'topRight',
            }).show();
            //延迟一秒，防止请求过快
            await sleep(1000);

        }

    }
    function dayReport(method = 'down') {
        //获取开始和结束日期
        const dateElement = document.querySelectorAll(".css-jfggi0");
        const startDate = dateElement[0].value.replaceAll("/", "-");
        const endDate = dateElement[1].value.replaceAll("/", "-");
        //获取日期，封装成下载任务
        let daylist = getdiffdate(startDate, endDate);
        let taskList = [];
        for (let day of daylist) {
            taskList.push({
                name: day,
                start: day,
                end: day
            });
        }
        //导入任务
        download(taskList, method);
    }

    addObserver(".css-1lafdix", node => {
        const space = `<div class="css-ix5zus"><kat-link label="" class="css-4g6ai3"></kat-link></div>`;
        node.insertAdjacentHTML("beforeEnd", space);
        //插入批量下载按钮  设置按钮属性和点击事件
        let dayButton = document.createElement("kat-button");
        dayButton.label = "下载每日 (.csv)";
        dayButton.variant = "primary";
        dayButton.size = "base";
        dayButton.type = "button";
        dayButton.onclick = () => { dayReport(); };
        node.appendChild(dayButton);
        node.insertAdjacentHTML("beforeEnd", space);
        //----------------------------------------------------
        let monthButton = document.createElement("kat-button");
        monthButton.label = "下载每月 (.csv)";
        monthButton.variant = "primary";
        monthButton.size = "base";
        monthButton.type = "button";
        monthButton.onclick = () => {
            //获取开始和结束日期
            const dateElement = document.querySelectorAll(".css-jfggi0");
            const startDate = dateElement[0].value.replaceAll("/", "-");
            const endDate = dateElement[1].value.replaceAll("/", "-");
            //导入月份列表，进行下载
            download(getMonthList(startDate, endDate));
        };
        node.appendChild(monthButton);
        
        //只在 详情页面销售和流量 显示导入数据库的按钮
        if (location.href.includes('DetailSalesTrafficBySKU')) {
            node.insertAdjacentHTML("beforeEnd", space);
            let postButton = document.createElement("kat-button");
            postButton.label = "每日(导入数据库)";
            postButton.variant = "primary";
            postButton.size = "base";
            postButton.type = "button";
            postButton.onclick = () => { dayReport("post"); };
            node.appendChild(postButton);
        }
    });


})();



