// ==UserScript==
// @name         AcfunAvatarFix
// @namespace    zhihaofans
// @version      0.1.4
// @description  修复顶端右侧小头像
// @author       zhihaofans
// @match        http://www.acfun.tv/*
// @match        http://www.acfun.cn/*
// @match        http://www.aixifan.com/*
// @grant        none
// @note         本脚本已停止更新
// @note         Github开源地址:https://github.com/zhihaofans/Acfun/blob/master/acfun.tv/AcfunAvatarFix/acfunavatarFix.js
// @note         Greasyfork地址:https://greasyfork.org/zh-CN/scripts/22931
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/22931/AcfunAvatarFix.user.js
// @updateURL https://update.greasyfork.org/scripts/22931/AcfunAvatarFix.meta.js
// ==/UserScript==
function setCookie(name, value) {
    var expdate = new Date();
    expdate.setTime(expdate.getTime() + 30 * 60 * 1000);
    document.cookie = name + "=" + value + ";expires=" + expdate.toGMTString() + ";path=/";
}
function getCookie(c_name) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + '=');
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1;
            c_end = document.cookie.indexOf(';', c_start);
            if (c_end == -1) {
                c_end = document.cookie.length;
            }
            return decodeURI(document.cookie.substring(c_start, c_end));
        }
    }
    return '';
}
function acNotice(_mode, _text) {
    var patt1 = new RegExp('(/v/ac|/a/ac|/v/ab|/member/|/a/aa)');
    if (patt1.test(location.pathname, 'i')) {
        $.info(_mode, "AcfunAvatarFix:" + _text);
    } else {
        alert("AcfunAvatarFix\n" + _text);
    }
}
$(document).ready(function() {
    console.log("AcfunAvatarFix:开始载入");
	if (getCookie('auth_key') !== "") {
        if (getCookie('ac_userimg') === "") {
            $.get("/usercard.aspx?username=" + getCookie('ac_username'),
            function(data, status) {
                console.log("AcfunAvatarFix(status：" + status + ")");
                if (status == "success") {
                    if (data.success === true) {
                        setCookie("ac_userimg", data.userjson.avatar);
                        if (getCookie('ac_userimg') == data.userjson.avatar) {
                            console.log("AcfunAvatarFix:头像修复成功，刷新后生效");
                            acNotice("success", "头像修复成功，刷新生效");
                        } else {
                            console.log("AcfunAvatarFix:获取个人信息失败(cookies)");
                            acNotice("error", "保存cookies失败");
                        }
                    } else {
                        console.log("AcfunAvatarFix:获取个人信息失败(api)");
                        acNotice("error", "获取个人信息失败");
                    }
                } else {
                    console.log("AcfunAvatarFix:获取个人信息失败(网络)");
                    acNotice("error", "获取个人信息失败，请检查网络");
                }
            });
        }
    }
});
