// ==UserScript==
// @name         v2ex_signin
// @namespace    zhihaofans
// @version      3
// @description  V2EX自动签到
// @author       zhihaofans
// @match        https://v2ex.com/*
// @match        https://www.v2ex.com/*
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @require      https://cdn.bootcss.com/sweetalert/1.1.3/sweetalert.min.js
// @resource     sweetalertcss https://cdn.bootcss.com/sweetalert/1.1.3/sweetalert.min.css
// @note         Greasyfork地址:https://greasyfork.org/zh-CN/scripts/28508
// @note         Github地址:https://github.com/zhihaofans/JavaScript/v2ex/v2ex_signin.js
// @license      Apache License 2.0
// @downloadURL https://update.greasyfork.org/scripts/28508/v2ex_signin.user.js
// @updateURL https://update.greasyfork.org/scripts/28508/v2ex_signin.meta.js
// ==/UserScript==
var once_key = null;
GM_addStyle (GM_getResourceText ("sweetalertcss"));
function getOnce() {
    var once_key_temp = null;
    for (var a = 0; a < $('a.top').length; a++) {
        var b = $('a.top:eq(' + a + ')').attr('onclick');
        if (b !== undefined) {
            var c = b.indexOf('?once=');
            var d = b.indexOf('\';', c);
            if (c != -1) {
                once_key_temp = b.substring(c + 6, d);

            }
        }
    }
    return once_key_temp;
}
$(document).ready(function () {
    once_key = getOnce();
    console.log('once:', once_key);
    if (once_key !== null) {
        var signinUrl = 'https://' + location.hostname + '/mission/daily/redeem?once=' + once_key;
        $.get(signinUrl, function (data) {
            console.log('连接成功');
            if (data.indexOf('<div class=\"message\" onclick=\"$(this).slideUp(\'fast\');\">每日登录奖励已领取</div>') != -1) {
                newAlert('签到成功', '恭喜你，今天签到成功了哟');
            } else if (data.indexOf('<div class=\"message\" onclick=\"$(this).slideUp(\'fast\');\">今天的登录奖励已经领取过了哦</div>') != -1) {
                console.log('很遗憾，今天已经签到过了哟');
            } else {
                newAlert('签到失败', '签到发生未知错误', 'error');
            }
        })
            .fail(function () {
                newAlert('签到失败', '发送签到请求失败', 'error');
            });
    }
});
function newAlert(alertTitle, alertText, alertType = 'success', alertTimeout = 1500) {
    swal({ title: alertTitle, text: alertText, timer: alertTimeout, showConfirmButton: false, type: alertType });
}