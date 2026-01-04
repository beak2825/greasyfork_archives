// ==UserScript==
// @name         QQ邮箱支持桌面级通知-Safari浏览器
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  QQ邮箱网页版，支持Safari浏览器桌面通知能力，有疑问可以联系 zaingg@qq.com
// @author       PsychoPass
// @match        https://mail.qq.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=qq.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/467956/QQ%E9%82%AE%E7%AE%B1%E6%94%AF%E6%8C%81%E6%A1%8C%E9%9D%A2%E7%BA%A7%E9%80%9A%E7%9F%A5-Safari%E6%B5%8F%E8%A7%88%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/467956/QQ%E9%82%AE%E7%AE%B1%E6%94%AF%E6%8C%81%E6%A1%8C%E9%9D%A2%E7%BA%A7%E9%80%9A%E7%9F%A5-Safari%E6%B5%8F%E8%A7%88%E5%99%A8.meta.js
// ==/UserScript==

function notifyMail(title, body) {
    var tag = "sds" + Math.random();
    console.log("permission", Notification.permission);
    if (Notification.permission === 'default') {
        Notification.requestPermission(function () {
            // ...callback this function once a permission level has been set.
            var notify = new Notification(title.replace(/&nbsp;/g, ''), {
                tag: tag,
                body: body.replace(/&nbsp;/g, '')
            });
            notify.onerror = function () {
                console.log("桌面消息出错！！！");
            };
            notify.onshow = function () {
                console.log("桌面消息成功");
            };
            notify.onclose = function () {
                console.log("桌面消息关闭！！！");
            };
        });
    }
    console.log("permission", Notification.permission);
    if (Notification.permission === "granted") {
        var notify = new Notification(title.replace(/&nbsp;/g, ''), {
            tag: tag,
            icon: "https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://qq.com&size=64",
            body: body.replace(/&nbsp;/g, '')
        });
        notify.onclick = function () {
            //如果通知消息被点击,通知窗口将被激活，且点击收件箱。
            console.log("桌面消息点击了！！！");
            if (document.getElementById('folder_1')) {
                eval(document.getElementById('folder_1').getAttribute('onclick'));
            }
            if (document.getElementById('readmailbtn_link')) {
                eval(document.getElementById('readmailbtn_link').getAttribute('onclick'));
            }
            window.focus();
            notify.close();
        };
        notify.onerror = function () {
            console.log("桌面消息出错！！！");
        };
        notify.onshow = function () {
            console.log("桌面消息成功");
        };
        notify.onclose = function () {
            console.log("桌面消息关闭！！！");
        };
    }

}

function setCheckout(check, fuc, time) {
    if (check()) {
        fuc();
    }
    else {
        setTimeout(function () {
            setCheckout(check, fuc, time);
        }, time);
    }
}

var text = document.createTextNode(" - ");
document.getElementsByClassName('addrtitle')[5].appendChild(text);
var btn = document.createElement("a");
btn.innerText = '开启通知';
btn.class = 'addrtitle';
btn.onclick = function () { notifyMail("桌面通知授权", "授权成功"); }
document.getElementsByClassName('addrtitle')[5].appendChild(btn);

if (document.getElementById("useraddr") && document.getElementById("useraddrcontainer")) {
    setCheckout(function () {
        return (window.QMWebpushTip && window.QMWebpushTip._addData)
    }, function () {
        var oldUpdateTip = window.QMWebpushTip._addData;
        window.QMWebpushTip._addData = function (g, h) {
            console.log('_addData', g, h);
            if (h && h[0] && h[0].subject && h[0].summary) {
                notifyMail(h[0].subject, h[0].summary);
            }
            return oldUpdateTip(g, h);
        }
        console.log('window.QMWebpushTip hooked');
    }, 1000);
}
