// ==UserScript==
// @name         自动生成亚马逊账单报告
// @namespace    liu12
// @version      0.6
// @description  每月自动操作一次，替代用户点击生成亚马逊账单报告
// @author       刘一二
// @match        *://sellercentral.amazon.com/*
// @match        *://sellercentral.amazon.ca/*
// @match        *://sellercentral.amazon.com.mx/*
// @match        *://sellercentral.amazon.co.uk/*
// @match        *://sellercentral.amazon.de/*
// @match        *://sellercentral.amazon.fr/*
// @match        *://sellercentral.amazon.it/*
// @match        *://sellercentral.amazon.es/*
// @match        *://sellercentral.amazon.jp/*
// @grant        GM_xmlhttpRequest
// @require      https://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/401885/%E8%87%AA%E5%8A%A8%E7%94%9F%E6%88%90%E4%BA%9A%E9%A9%AC%E9%80%8A%E8%B4%A6%E5%8D%95%E6%8A%A5%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/401885/%E8%87%AA%E5%8A%A8%E7%94%9F%E6%88%90%E4%BA%9A%E9%A9%AC%E9%80%8A%E8%B4%A6%E5%8D%95%E6%8A%A5%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var AmazonReport = {

        // 当前年月日
        year: 0,
        month: 0,
        day: 0,

        // 报告年月
        reportYear: 0,
        reportMonth: 0,

        /**
         * 获取账号
         */
        getAccount: function() {
            return $("#sc-mkt-switcher-form .sc-mkt-picker-switcher-txt").html()
        },

        requestReportTransactionExists: function() {
            return localStorage.getItem('requestReportTransaction:breakpoint:monthly') == this.year + '-' + this.month
        },

        /**
         * 申请生成报告
         */
        requestReportTransaction: function() {
            // 如果本月已成功执行一次，不再执行
            if (this.requestReportTransactionExists()) {
                return;
            }

            // 当月未有执行成功记录时，每天执行且至多执行一次
            var sKeyDaily = 'requestReportTransaction:breakpoint:daily';
            if (localStorage.getItem(sKeyDaily) != this.year + '-' + this.month + '-' + this.day) {

                var postData = {
                    reportType: "Transaction",
                    timeRangeType: "Monthly",
                    year: this.reportYear,
                    month: this.reportMonth
                };

                var _this = this;
                $.ajax({
                    type: "POST",
                    url: "/payments/reports/custom/submit/generateReports",
                    data: JSON.stringify(postData),
                    dataType: "json",
                    contentType: "application/json;charset=utf-8",
                    success: function(response) {
                        // {"status":"SUCCESS","message":"请求交易月份：3年份：2020"}
                        console.log(response);

                        if (response.status == "SUCCESS") {
                            localStorage.setItem('requestReportTransaction:breakpoint:monthly', _this.year + '-' + _this.month);
                        }
                    }
                });

                localStorage.setItem(sKeyDaily, this.year + '-' + this.month + '-' + this.day);
            }
        },

        requestReportSummaryExists: function() {
            return localStorage.getItem('requestReportSummary:breakpoint:monthly') == this.year + '-' + this.month
        },

        /**
         * 申请生成报告
         */
        requestReportSummary: function() {
            // 如果本月已成功执行一次，不再执行
            if (this.requestReportSummaryExists()) {
                return;
            }

            // 当月未有执行成功记录时，每天执行且至多执行一次
            var sKeyDaily = 'requestReportSummary:breakpoint:daily';
            if (localStorage.getItem(sKeyDaily) != this.year + '-' + this.month + '-' + this.day) {

                var postData = {
                    reportType: "Summary",
                    timeRangeType: "Monthly",
                    year: this.reportYear,
                    month: this.reportMonth
                };

                var _this = this;
                $.ajax({
                    type: "POST",
                    url: "/payments/reports/custom/submit/generateReports",
                    data: JSON.stringify(postData),
                    dataType: "json",
                    contentType: "application/json;charset=utf-8",
                    success: function(response) {
                        console.log(response);
                        // {"status":"SUCCESS","message":"请求汇总月份：3年份：2020"}
                        if (response.status == "SUCCESS") {
                            localStorage.setItem('requestReportSummary:breakpoint:monthly', _this.year + '-' + _this.month);
                        }
                    }
                });

                localStorage.setItem(sKeyDaily, this.year + '-' + this.month + '-' + this.day);
            }
        },


        requestReportTransactionDownloadExists: function() {
            return localStorage.getItem('requestReportTransactionDownload:breakpoint:monthly') == this.year + '-' + this.month
        },

        /**
         * 下载账单报告，并推送到指定系统
         */
        requestReportTransactionDownload: function() {
            // 如果本月已成功执行一次，不再执行
            if (this.requestReportTransactionDownloadExists()) {
                return;
            }

            // 当月未有执行成功记录时，每天执行且至多执行一次
            var sKeyDaily = 'requestReportTransactionDownload:breakpoint:daily';
            if (localStorage.getItem(sKeyDaily) != this.year + '-' + this.month + '-' + this.day) {

                var _this = this;
                $.ajax({
                    url: '/payments/reports/custom/request?tbla_daterangereportstable=sort:{"sortOrder":"DESCENDING"};search:undefined;pagination:1;',
                    //url: "/payments/reports/custom/request?tbla_daterangereportstable=sort:%7B%22sortOrder%22%3A%22DESCENDING%22%7D;search:undefined;pagination:1;",
                    success: function(response) {
                        //console.log(response);
                        var reg = /<a([\s]+|[\s]+[^<>]+[\s]+)href=(\"([^<>"\']*)\"|\'([^<>"\']*)\')[^<>]*>/gi;
                        var url = null;
                        while(reg.exec(response)!=null) {
                            // /payments/reports/download?_encoding=UTF8&amp;contentType=text%2Fcsv&amp;fileName=20203%E6%9C%88MonthlyTransaction.csv&amp;referenceId=227990018377
                            url = RegExp.$3;
                            //url = decodeURI(url);
                            url = decodeURIComponent(url);
                            url = url.replace(/&amp;/g, "&");
                            //console.log(url);
                            if (url.indexOf("MonthlyTransaction.csv") != -1 && url.indexOf("" + _this.reportYear + _this.reportMonth + "") != -1) {

                                // 下载交易报表 csv 文件
                                $.ajax({
                                    url: url,
                                    success: function(response) {
                                        //console.log(response);

                                        var reg = new RegExp("(^|&)fileName=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
                                        var result = url.match(reg); //匹配目标参数
                                        var fileName = result[2];

                                        var postData = "account=" + _this.getAccount();
                                        postData += "&year_month=" + _this.reportYear + (_this.reportMonth < 10 ? '-0' : '-') + _this.reportMonth;
                                        postData += "&file_type=ReportTransaction";
                                        postData += "&file_name=" + fileName;
                                        postData += "&file_data=" + _this.base64encode(response);

                                        // 上传文件到账单系统
                                        GM_xmlhttpRequest({
                                            method: "POST",
                                            url: "账单系统网址",
                                            data: postData,
                                            headers: {
                                                "Content-Type": "application/x-www-form-urlencoded"
                                            },
                                            onload: function(response) {
                                                if(response.status === 200){
                                                    if (response.responseText == 'ok') {
                                                        localStorage.setItem(sKeyDaily, _this.year + '-' + _this.month + '-' + _this.day);
                                                        localStorage.setItem('requestReportTransactionDownload:breakpoint:monthly', _this.year + '-' + _this.month);
                                                    } else {
                                                        alert("推送账单报告到账单系统报错：" + response.responseText);
                                                    }
                                                }
                                            }
                                        });

                                    }
                                });

                                break;

                            }
                        }
                    }
                });
            }
        },


        requestReportSummaryDownloadExists: function() {
            return localStorage.getItem('requestReportSummaryDownload:breakpoint:monthly') == this.year + '-' + this.month
        },

        /**'
         * 下载账单报告，并推送到指定系统
         */
        requestReportSummaryDownload: function() {
            // 如果本月已成功执行一次，不再执行
            if (this.requestReportSummaryDownloadExists()) {
                return;
            }

            // 当月未有执行成功记录时，每天执行且至多执行一次
            var sKeyDaily = 'requestReportSummaryDownload:breakpoint:daily';
            if (localStorage.getItem(sKeyDaily) != this.year + '-' + this.month + '-' + this.day) {

                var _this = this;
                $.ajax({
                    url: '/payments/reports/custom/request?tbla_daterangereportstable=sort:{"sortOrder":"DESCENDING"};search:undefined;pagination:1;',
                    //url: "/payments/reports/custom/request?tbla_daterangereportstable=sort:%7B%22sortOrder%22%3A%22DESCENDING%22%7D;search:undefined;pagination:1;",
                    success: function(response) {
                        //console.log(response);
                        var reg = /<a([\s]+|[\s]+[^<>]+[\s]+)href=(\"([^<>"\']*)\"|\'([^<>"\']*)\')[^<>]*>/gi;
                        var url = null;
                        while(reg.exec(response)!=null) {
                            // /payments/reports/download?_encoding=UTF8&amp;contentType=application%2Fpdf&amp;fileName=20203%E6%9C%88MonthlySummary.pdf&amp;referenceId=227991018377
                            url = RegExp.$3;
                            //url = decodeURI(url);
                            url = decodeURIComponent(url);
                            url = url.replace(/&amp;/g, "&");
                            //console.log(url);
                            if (url.indexOf("MonthlySummary.pdf") != -1 && url.indexOf("" + _this.reportYear + _this.reportMonth + "") != -1) {

                                // 下载汇总报表 pdf 文件
                                $.ajax({
                                    url: url,
                                    success: function(response) {
                                        //console.log(response);

                                        var reg = new RegExp("(^|&)fileName=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
                                        var result = url.match(reg); //匹配目标参数
                                        var fileName = result[2];


                                        var postData = "account=" + _this.getAccount();
                                        postData += "&year_month=" + _this.reportYear + (_this.reportMonth < 10 ? '-0' : '-') + _this.reportMonth;
                                        postData += "&file_type=ReportSummary";
                                        postData += "&file_name=" + fileName;
                                        postData += "&file_data=" + _this.base64encode(response);

                                        // 上传文件到账单系统
                                        GM_xmlhttpRequest({
                                            method: "POST",
                                            url: "账单系统网址",
                                            data: postData,
                                            headers: {
                                                "Content-Type": "application/x-www-form-urlencoded"
                                            },
                                            onload: function(response) {
                                                if(response.status === 200){
                                                    if (response.responseText == 'ok') {
                                                        localStorage.setItem(sKeyDaily, _this.year + '-' + _this.month + '-' + _this.day);
                                                        localStorage.setItem('requestReportSummaryDownload:breakpoint:monthly', _this.year + '-' + _this.month);
                                                    } else {
                                                        alert("推送汇总报告到账单系统报错：" + response.responseText);
                                                    }
                                                }
                                            }
                                        });

                                    }
                                });

                                break;

                            }
                        }
                    }
                });
            }
        },

        init: function() {
            var account = this.getAccount();
            if (!account) {
                return; // 未检测到登录不处理
            }

            var date = new Date();
            this.year = parseInt(date.getFullYear());
            this.month = parseInt(date.getMonth());
            this.day = parseInt(date.getDate());

            // 如果所有操作都已成功执行过，不再处理
            if (this.requestReportTransactionExists() &&
                this.requestReportSummaryExists() &&
                this.requestReportTransactionDownloadExists() &&
                this.requestReportSummaryDownloadExists()) {
                return;
            }

            if (this.month === 0) {
                this.reportYear = this.year-1;
                this.reportMonth = 12;
            } else {
                this.reportYear = this.year;
                this.reportMonth = this.month;
            }

            var iTimeout = 0;

            // 生成交易报报，安排 3 秒时间
            var iTimeoutItem = this.requestReportTransactionExists() ? 0 : 3000;
            this.requestReportTransaction();
            iTimeout += iTimeoutItem;

            // 生成汇总报报，安排 3 秒时间
            iTimeoutItem = this.requestReportSummaryExists() ? 0 : 3000;
            setTimeout(function(){AmazonReport.requestReportSummary();}, iTimeout);
            iTimeout += iTimeoutItem;

            // 如果是刚刚生成的报告，多等待 30 秒再执行下载操作
            if (iTimeout > 0) {
                iTimeout += 30000;
            }

            // 下载交易报告，并上传到账单系统，安排 10 秒时间
            iTimeoutItem = this.requestReportTransactionDownloadExists() ? 0 : 10000;
            setTimeout(function(){AmazonReport.requestReportTransactionDownload();}, iTimeout);
            iTimeout += iTimeoutItem;

            // 下载汇总报告，并上传到账单系统，安排 10 秒时间
            iTimeoutItem = this.requestReportSummaryDownloadExists() ? 0 : 10000;
            setTimeout(function(){AmazonReport.requestReportSummaryDownload();}, iTimeout);
            iTimeout += iTimeoutItem;

        },

        base64encode: function(input) {
            var output = "";
            var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
            var i = 0;
            var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

            input = input.replace(/\r\n/g,"\n");
            var utftext = "";
            for (var n = 0; n < input.length; n++) {
                var c = input.charCodeAt(n);
                if (c < 128) {
                    utftext += String.fromCharCode(c);
                } else if((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128);
                } else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128);
                }
            }
            input = utftext;
            while (i < input.length) {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);
                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;
                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }
                output = output +
                    _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
                    _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
            }
            return output;
        }
    };

    $(function() {
        // 页面加载成功 5 秒后，开始执行脚本
        setTimeout(function(){AmazonReport.init();}, 5000);
    });

})();