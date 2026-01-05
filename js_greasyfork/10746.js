// ==UserScript==
// @name        5u5u课时助手
// @author      fengchang
// @description 驾校理论课挂课时，在需要验证的时候弹出桌面通知
// @namespace   5u5u5u5u-assistant
// @license     GPL version 3
// @encoding    utf-8
// @date        2015/07/02
// @modified    2015/07/02
// @include     http://www.5u5u5u5u.com/studyOnLine.action*
// @grant       none
// @run-at      document-end
// @version     0.1.0
// @downloadURL https://update.greasyfork.org/scripts/10746/5u5u%E8%AF%BE%E6%97%B6%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/10746/5u5u%E8%AF%BE%E6%97%B6%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

/*
 * Dedicated to my dear sister Huanying
 */

Notification.requestPermission();
var notification = new Notification("验证通知已打开");

function embed(){
    function sendNotification()
    {
        if (!("Notification" in window)) {
            alert("请更新浏览器至最新版本");
        }

        else if (Notification.permission === "granted") {
            var notification = new Notification("请完成挂课时验证！");
        }

        else if (Notification.permission !== 'denied') {
            Notification.requestPermission(function (permission) {
                if (permission === "granted") {
                    var notification = new Notification("请完成挂课时验证！");
                }
            });
        }
    }

    var oldInspect = window.inspect;
    window.inspect = function(){
        oldInspect();
        sendNotification();
    };

    var oldOperation = window.operation;
    window.operation = function(num){
        oldOperation(num);
        if(flag===false)
            sendNotification();
    };
}

var inject = document.createElement("script");

inject.setAttribute("type", "text/javascript");
inject.appendChild(document.createTextNode("(" + embed + ")()"));

document.body.appendChild(inject);