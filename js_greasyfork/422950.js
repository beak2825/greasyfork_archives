// ==UserScript==
// @name         提醒打包完成
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  请点击url地址栏左侧图标网站设置，打开aura.jd.com的开启弹出式窗口和重定向权限，用户强提醒弹出桌面通知；打开git.jd.com的页面通知和弹出式窗口和重定向的权限
// @author       You
// @match        https://git.jd.com/?aura=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422950/%E6%8F%90%E9%86%92%E6%89%93%E5%8C%85%E5%AE%8C%E6%88%90.user.js
// @updateURL https://update.greasyfork.org/scripts/422950/%E6%8F%90%E9%86%92%E6%89%93%E5%8C%85%E5%AE%8C%E6%88%90.meta.js
// ==/UserScript==

(function() {
    var message = GetUrlParam('aura') == "success"?"aura打包成功":"aura打包失败";
    notifyMe(message)
    //window.opener=null;window.top.open('','_self','');window.close(this);
    function notifyMe(message) {
        // 检查浏览器是否支持 Notification
        if (!("Notification" in window)) {
            alert("你的不支持 Notification!  TAT");
        }

        // 检查用户是否已经允许使用通知
        else if (Notification.permission === "granted") {
            // 创建 Notification
            var notification = new Notification(message);
            notification.iconurl = 'http://img.hacpai.com/avatar/1450241301546-260.jpg?1451971807339';
            autoClose(notification);

        }

        // 重新发起请求，让用户同意使用通知
        else if (Notification.permission !== 'denied') {
            Notification.requestPermission(function (permission) {

                // 用户同意使用通知
                if (!('permission' in Notification)) {
                    Notification.permission = permission;
                }

                if (permission === "granted") {
                    // 创建 Notification
                    var notification = new Notification(message);
                }
            });
        }

        // 注意：如果浏览器禁止弹出任何通知，将无法使用
    }

    function autoClose(notification) {
        if (typeof notification.time === 'undefined' || notification.time <= 0) {
            window.opener=null;window.top.open('','_self','');window.close(this);
            notification.close();
        } else {
            setTimeout(function () {
            window.opener=null;window.top.open('','_self','');window.close(this);
                notification.close();
            }, notification.time);
        }

        notification.addEventListener('click', function () {
            notification.close();
            window.opener=null;window.top.open('','_self','');window.close(this);
        }, false)

        notification.addEventListener('close', function () {
            notification.close();
            window.opener=null;window.top.open('','_self','');window.close(this);
        }, false)

        notification.addEventListener('error', function () {
            notification.close();
            window.opener=null;window.top.open('','_self','');window.close(this);
        }, false)
    }

    function GetUrlParam(paraName) {
        var url = document.location.toString();
        var arrObj = url.split("?");

        if (arrObj.length > 1) {
            var arrPara = arrObj[1].split("&");
            var arr;

            for (var i = 0; i < arrPara.length; i++) {
                arr = arrPara[i].split("=");
                if (arr != null && arr[0] == paraName) {
                    return arr[1];
                }
            }
            return "";
        }
        else {
            return "";
        }
    }
})();