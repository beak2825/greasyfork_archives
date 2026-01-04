// ==UserScript==
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @name         TaobaoChatRecordAnalysis
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  解析淘宝的聊天数据
// @author       FrankEvil
// @match        https://zizhanghao.taobao.com/subaccount/monitor/chat_record_query.htm*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/388026/TaobaoChatRecordAnalysis.user.js
// @updateURL https://update.greasyfork.org/scripts/388026/TaobaoChatRecordAnalysis.meta.js
// ==/UserScript==
(function () {
    'use strict';
    console.log("自动拉去聊天记录脚本开始运行");

    /**
     *对Date的扩展，将 Date 转化为指定格式的String
     *月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
     *年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
     *例子：
     *(new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
     *(new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
     */
    Date.prototype.format = function (fmt) {
        let o = {
            "M+": this.getMonth() + 1, //月份
            "d+": this.getDate(), //日
            "h+": this.getHours(), //小时
            "m+": this.getMinutes(), //分
            "s+": this.getSeconds(), //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            "S": this.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (let k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    };
    const datas = [];
    let isPull = false;
    let refresh = false;
    const prefix = "cntaobao";
    const importUrl = "http://127.0.0.1:9080/chatRecord/taoBaoImport";
    //昨天的时间
    const date = new Date();
    date.setDate(date.getDate() - 1);
    const yesterday = date.format("yyyy-MM-dd");
    const chatRelationQuery = {
        "customerNick": "",
        "start": yesterday,
        "end": yesterday,
        "beginKey": null,
        "endKey": null,
        "employeeAll": false,
        "customerAll": true
    };
    const chatContentQuery = {
        "employeeUserNick": [],
        "customerUserNick": [],
        "employeeAll": false,
        "customerAll": false,
        "start": yesterday,
        "end": yesterday,
        "beginKey": null,
        "endKey": null
    };
    const chatUrl = $("#J_SearchBtn").attr("data-url");
    console.log("会话url：" + chatUrl);

    const messageUrl = $("#J_MiniPager").attr("data-url");
    console.log("内容url: " + messageUrl);

    const accountDivs = $(".list-wrapper").find("span.title");
    accountDivs.each(function (i, item) {
        let account = $(item).text();
        if (account) {
            datas.push({
                account: account
            });
        }
    });

    setInterval(function () {
        const refreshHours = new Date().getHours();
        const refreshMin = new Date().getMinutes();
        const refreshSec = new Date().getSeconds();
        //每天00:31 执行数据拉取
        if (refreshHours === 11 && refreshMin === 7 && refreshSec === 0) {
            isPull = true;
            dataAnalysis();
        } else if (refresh && !isPull) {
            location.reload();
            return;
        }
        //每5分钟刷新下页面
        if (refreshMin % 5 === 0 && refreshSec === 0) {
            if (isPull) {
                refresh = true;
            } else {
                location.reload();
            }
        }
    }, 1000);


    function dataAnalysis() {
        let allDefer = $.Deferred();
        //这一步必须要写，要不然下面的then无法使用
        allDefer.resolve(console.log("开始获取聊天信息"));
        datas.forEach((data) => {
            data.talks = [];
            chatRelationQuery.employeeNick = data.account;
            let url = chatUrl + "&chatRelationQuery=" + JSON.stringify(chatRelationQuery) + "&site=0" + "&_=" + new Date().getTime();
            url = encodeURI(url);
            $.ajax({
                url: url,
                async: false,
                dataType: "json",
                success: function (chatJson) {
                    if (chatJson && chatJson.status && chatJson.customerUserNicks && chatJson.customerUserNicks.length > 0) {
                        let reg = new RegExp("^" + prefix);
                        let defer = $.Deferred();
                        //这一步必须要写，要不然下面的then无法使用
                        defer.resolve(console.log("开始获取：" + data.account + " 的聊天信息"));
                        for (let customerUserNick of chatJson.customerUserNicks) {
                            let talk = {
                                customerNick: customerUserNick.replace(reg, ""),
                                contents: []
                            };
                            defer = defer.then(function () {
                                //获取聊天内容
                                chatContentQuery.employeeUserNick = [prefix + data.account];
                                chatContentQuery.customerUserNick = [customerUserNick];
                                let url = messageUrl + "&chatContentQuery=" + JSON.stringify(chatContentQuery) + "&site=0" + "&_=" + new Date().getTime();
                                url = encodeURI(url);
                                return $.ajax({
                                    url: url,
                                    success: function (content) {
                                        $(content).find("p").each((i, item) => {
                                            let html = $(item).html().trim();
                                            talk.contents.push(html);
                                        });
                                        //提交到服务器
                                        data.talks.push(talk);
                                    }
                                })
                            });
                        }
                        allDefer = allDefer.then(function () {
                            return defer;
                        });
                        defer.done(function () {
                            console.log(data.account + " 的聊天信息获取完成。");
                            data.recordDate = yesterday;
                             importChatRecord(data);
                        });
                    }
                }
            });
        });
        allDefer.done(function () {
            console.log("所有账号导入完成!");
            isPull = false;
        });
    }

    function importChatRecord(data) {
         $.ajax({
            url: importUrl,
            method: "post",
            data: JSON.stringify(data),
            contentType: "application/json; charset=UTF-8",
            dataType: "json",
            success: function (repose) {
                console.log(repose)
            },
            error: function (error) {
                console.log(error);
            }
        });
    }
})();
