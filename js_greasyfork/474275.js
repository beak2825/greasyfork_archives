// ==UserScript==
// @name         MIB_去除部分告警
// @namespace    http://tampermonkey.net/
// @version      2.4
// @author       feiazifeiazi@163.com
// @description  去除部分告警。增加个人告警
// @match        https://cmdbtest.xcreditech.com/monitor/show/alertinfos/*
// @match        https://cmdb.xcreditech.com/monitor/show/alertinfos/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xcreditech.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/474275/MIB_%E5%8E%BB%E9%99%A4%E9%83%A8%E5%88%86%E5%91%8A%E8%AD%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/474275/MIB_%E5%8E%BB%E9%99%A4%E9%83%A8%E5%88%86%E5%91%8A%E8%AD%A6.meta.js
// ==/UserScript==

class alert {

    //加载其他页的数据
    static async fetchAndAppendTableRows() {
        await alert.appendTableRows();
        await alert.appendTableRowsPersonal();

    }

    //个人面板的数据
    static async appendTableRowsPersonal() {

        // 在指定 class 的 div 内，查找内容为 "Personal" 的 span，并获取其 data-flag 值
        let spanPersonal = $('.btn-group.p-btn-group.jp-btn-group')
            .find('span')
            .filter(function () {
                return $(this).text().trim() === "Personal";
            }).first();
        let flagValue = spanPersonal.attr('data-flag');

        let currentUrl = window.location;

        let urlPersonal = `${currentUrl.origin}/monitor/show/alertinfos/?flag=${flagValue}`;
        // 获取当前页面的 URL 查询参数
        let urlParams = new URLSearchParams(currentUrl.search);
        let pageParam = urlParams.get("page");

        // 如果 page 参数有值且不等于 "1"，直接返回
        if (pageParam !== null && pageParam !== "1") {
            console.log("Current page parameter is not '1', skipping fetch.");
            return;
        }
        // 比较前缀部分是否相同
        if (currentUrl.href.startsWith(urlPersonal)) {
            console.log("URL前缀相同，跳过执行");
            return;
        }
        let targetTableId = "mainTable"
        $.get(urlPersonal, function (data) {
            // 将获取的 HTML 数据转为 DOM 对象
            let remoteDocument = $(data);

            // 从远程页面中找到 id="mainTable" 的表格并获取其中的行
            let mainTable = remoteDocument.find("#mainTable");
            let remoteRows = remoteDocument.find("#mainTable tbody tr");

            // 将这些行追加到当前页面的 targetTableId 表格的 tbody 中
            $(`#${targetTableId} tbody`).append(remoteRows);

            remoteRows.find('a[data-type="confirm"]').filter(function () {
                return $(this).text().trim() === '确认';
            }).each(function () {
                let $parentTd = $(this).closest('td'); // 查找最近的父级 td
                if ($parentTd.length) {
                    // 给这个 td 内所有 a 标签绑定 click 事件
                    $parentTd.find('a').on('click', function (e) {
                        e.preventDefault(); // 阻止默认跳转行为
                        $(this).text('不支持');
                    });
                }
            });

        }).fail(function () {
            console.error("Failed to fetch data from the provided URL.");
        });
    }



    //当前面板 其他分页的数据
    static async appendTableRows() {

        var urls = await alert.getPageUrls();

        let currentUrl = window.location;

        // 获取当前页面的 URL 查询参数
        let urlParams = new URLSearchParams(currentUrl.search);
        let pageParam = urlParams.get("page");

        // 如果 page 参数有值且不等于 "1"，直接返回
        if (pageParam !== null && pageParam !== "1") {
            console.log("Current page parameter is not '1', skipping fetch.");
            return;
        }

        let targetTableId = "mainTable"

        const requests = urls.map((url) => {
            var post= $.post(url, function (data) {
                // 将获取的 HTML 数据转为 DOM 对象
                let remoteDocument = $(data);

                // 从远程页面中找到 id="mainTable" 的表格并获取其中的行
                let mainTable = remoteDocument.find("#mainTable");
                alert.alert_remove(mainTable);
                let remoteRows = mainTable.find("tbody tr");
               
                // 将这些行追加到当前页面的 targetTableId 表格的 tbody 中
                $(`#${targetTableId} tbody`).append(remoteRows);
                 

                remoteRows.find('a[data-type="confirm"]').filter(function () {
                    return $(this).text().trim() === '确认';
                }).each(function () {
                    let $parentTd = $(this).closest('td'); // 查找最近的父级 td
                    if ($parentTd.length) {
                        // 给这个 td 内所有 a 标签绑定 click 事件
                        $parentTd.find('a').on('click', function (e) {
                            e.preventDefault(); // 阻止默认跳转行为
                            $(this).text('不支持');
                        });
                    }
                });


            }).fail(function () {
                console.error("Failed to fetch data from the provided URL.");
            });
            return post;

        });

        // 等待所有的 $.post 请求完成
        await Promise.all(requests);

    }

    //总页数
    static extractPageNumber() {
        var totalPage = 1;
        var totalPageElement = $('a.total-page');

        if (totalPageElement.length > 0) {
            var text = totalPageElement.text();
            var pagePattern = /共 (\d+) 页/;
            var matches = text.match(pagePattern);
            if (matches) {
                totalPage = parseInt(matches[1]);
            }
        }
        return totalPage;
    }


    static async getPageUrls() {
        // 获取表单的action属性
        var formAction = $('#queryForm').attr('action');

        var totalPage = alert.extractPageNumber();
        var urls = [];
        for (var i = 0; i < totalPage; i++) {

            if (i == 0) {
                continue;
            }
            // 构建GET参数
            var getParams = {
                page: (i+1)
            };

            // 将GET参数序列化为URL参数字符串
            var serializedGetParams = $.param(getParams);

            // 构建完整的URL
            var urlWithParams = formAction + (formAction.includes('?') ? '&' : '?') + serializedGetParams;

            urls.push(urlWithParams);
        }
        return urls;
    }


    static async alert_remove(rangeSelector) {

        // 找到所有带有文本为"小时报错误"的a标签
        $(rangeSelector).find('a:contains("小时报错误")').parent().parent().remove();
        $(rangeSelector).find('a:contains("choice-account-monitor")').parent().parent().remove();

        $(rangeSelector).find('td:contains("redshift工作负载异常,请及时跟进处理!!")').parent().remove();
        $(rangeSelector).find('td:contains("ds_alarm_call")').parent().remove();

        $(rangeSelector).find('td:contains("ds_alarm_sms")').parent().remove();

        $(rangeSelector).find('td:contains("ds任务报错")').parent().remove();


        $(rangeSelector).find('td:contains("华为云obs无法匹配到所属业务线")').parent().remove();

        $(rangeSelector).find('td:contains("choice-log-monitor")').parent().remove();


        $(rangeSelector).find("tr:has(td:contains('业务系统监控')):has(td:contains('信审通过'))").remove();



        $.getScript("https://momentjs.com/downloads/moment.min.js");
        // 格式化日期为年月日
        var days = [];
        for (var i = 0; i <= 4; i++) {
            var day_1 = moment().subtract(i, 'days').format('YYYY-MM-DD');
            var s = $(rangeSelector).find('a:contains("业务预警监控")').parent().parent().find('td:contains("' + day_1 + '")').parent().remove();
        }


        $(rangeSelector).find('a:contains("!!!alert!!! account balance is low")').parent().parent().remove();

    }



}
(async function () {

    //将其他页告警加载。
    await alert.fetchAndAppendTableRows();

    let mainTable = $("#mainTable");
    alert.alert_remove(mainTable);

})();