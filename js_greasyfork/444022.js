// ==UserScript==
// @name         【JIRA SoftWare脚本】新消息提醒
// @namespace    http://tampermonkey.net/
// @version      1.0.4
// @description  获取是否有新BUG，有浏览器闪动标题提醒。因为大家的jira SoftWare地址都不同，所以请使用用户匹配。如果你的jira是https，那么可以以谷歌浏览器为例在设置->隐私设置和安全性->通知 下方添加jira地址为例外以便有弹出式通知
// @author       皮燕子
// @match        https://atlassian.com/**
// @icon         https://developer.atlassian.com/favicon.ico
// @grant        GM_getValue
// @grant        GM_setValue
// @license      bonelf.com
// @downloadURL https://update.greasyfork.org/scripts/444022/%E3%80%90JIRA%20SoftWare%E8%84%9A%E6%9C%AC%E3%80%91%E6%96%B0%E6%B6%88%E6%81%AF%E6%8F%90%E9%86%92.user.js
// @updateURL https://update.greasyfork.org/scripts/444022/%E3%80%90JIRA%20SoftWare%E8%84%9A%E6%9C%AC%E3%80%91%E6%96%B0%E6%B6%88%E6%81%AF%E6%8F%90%E9%86%92.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...

    let message = {
        timeout: null,
        oldTitle: document.title,
        time: 0,
        showMessage(msg) {
            message.timeout = setInterval(function () {
                message.time++;
                let title = '';
                if (message.time % 2 === 0) {
                    title = '【】';
                } else {
                    title = '【 ' + msg + ' 】';
                }
                document.title = title;
            }, 600);

        },
        stopMessage() {
            document.title = message.oldTitle;
            clearTimeout(message.timeout);
        }
    };

    function showMsg(bugNum) {
        message.showMessage('新BUG');
        if (window.Notification) {
            Notification.requestPermission().then(permission => {
                if (permission == 'granted') {
                    // 发起一条新通知
                    var myNotification = new Notification('新消息通知', {
                        body: '您有' + bugNum + '个新的BUG'
                    });
                    myNotification.onclick = function () {
                        window.focus(); //点击消息通知后回到相应窗口
                        myNotification.close(); //关闭清除通知
                    }
                }
            });
        }
    }

    function stopMsg() {
        message.stopMessage();
    }

    function findMyProblem(callback, createdMinutesAgo, jql) {
        let createdJql = createdMinutesAgo ? "AND updated >= -" + createdMinutesAgo + "m" : "";
        $.ajax({
            headers: {
                "X-Atlassian-Token": "no-check"
            },
            url: window.location.origin + "/rest/issueNav/1/issueTable",
            data: {
                "startIndex": 0,
                "filterId": -1,
                "jql": jql ? jql : "resolution = Unresolved " + createdJql + " AND assignee in (currentUser()) order by created DESC, updated DESC",
                "layoutKey": "split-view"
            },
            type: "POST",
            dataType: "json",
            error: function (data) {
                console.error(data)
            },
            success: function (data) {
                let res = {
                    issueKeys: data.issueTable.issueKeys,
                    total: data.issueTable.total,
                    table: data.issueTable.table
                }
                console.info("查询出你的新问题", res.issueKeys.join())
                callback(res)
            }
        });
    }

    var hiddenProperty = 'hidden' in document ? 'hidden' : 'webkitHidden' in document ? 'webkitHidden' : 'mozHidden' in document ? 'mozHidden' : null;
    var visibilityChangeEvent = hiddenProperty.replace(/hidden/i, 'visibilitychange');
    // 第一次进入
    findMyProblem((res) => {
        GM_setValue("last_total", res.total)
        GM_setValue("last_top", res.issueKeys[0])
    })
    var inter = false;
    var onVisibilityChange = function () {
        if (document[hiddenProperty]) {
            console.log('页面隐藏');
            if (inter) {
                clearInterval(inter);
                inter = false;
            }
            GM_setValue("last_time_minutes", new Date() / (60 * 1000))
            inter = setInterval(function () {
                //  每分钟查一次数据
                let lastMinutes = Number(GM_getValue("last_time_minutes") || 0)
                let curMinutes = new Date() / (60 * 1000)
                findMyProblem((res) => {
                    if (res.total > 0) {
                        showMsg(res.total);
                        clearInterval(inter);
                        inter = false;
                    }
                }, parseInt(curMinutes - lastMinutes))
            }, 1000 * 60);
        } else {
            console.log('页面激活');
            stopMsg();
            if (inter) {
                clearInterval(inter);
                inter = false;
            }
        }
    };
    document.addEventListener(visibilityChangeEvent, onVisibilityChange);
})();
