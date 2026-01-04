// ==UserScript==
// @name         glados auto checkin
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  实现Glados机场Chrome浏览器每天自动签到!
// @author       423
// @match        https://glados.rocks/console/checkin
// @icon         https://lh3.googleusercontent.com/jGbUSukJHtIKK4vzJdHq0xJiRp0ZP0bLqKzOfaITpfXdHg6rDpbPjXEmCIiZJKY0L2tCLRvHLtM_0NymB_4h1Fv-_g=w128-h128-e365-rj-sc0x00ffffff
// @grant        unsafeWindow
// @license      AGPL License
// @downloadURL https://update.greasyfork.org/scripts/462905/glados%20auto%20checkin.user.js
// @updateURL https://update.greasyfork.org/scripts/462905/glados%20auto%20checkin.meta.js
// ==/UserScript==

(function () {
    function sendNotification(title, content,iconUrl) {
        if (window.Notification && Notification.permission !== "denied") {
            Notification.requestPermission(function () {
                var n = new Notification(title, { body: content,icon:iconUrl });
            });
        } else {
            alert("浏览器发送通知消息失败!");
        }
    }

    //生成从minNum到maxNum的随机数
    function randomNum(minNum, maxNum) {
        switch (arguments.length) {
            case 1:
                return parseInt(Math.random() * minNum + 1, 10);
                break;
            case 2:
                return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
                break;
            default:
                return 0;
                break;
        }
    }

    //获取上次签到的日期
    var varLastDay = "lastCheckinDay"
    var checkinDay = localStorage.getItem(varLastDay)
    if (!checkinDay) {
        sendNotification("glados", "签到脚本初始化成功!\请保持网页保持后台运行状态" + timeStr,"https://lh3.googleusercontent.com/jGbUSukJHtIKK4vzJdHq0xJiRp0ZP0bLqKzOfaITpfXdHg6rDpbPjXEmCIiZJKY0L2tCLRvHLtM_0NymB_4h1Fv-_g=w128-h128-e365-rj-sc0x00ffffff");
    }
    // 网页检测间隔(秒)
    var timeGap = 60 * 60
    // var inv = 0
    function checkin() {
        var myDate = new Date();
        // 获取当前日期;
        var date = myDate.toLocaleDateString();
        // 获取当前时间
        var time = myDate.toLocaleTimeString();
        //拼接时间日期
        var timeStr = date + " " + time

        // console.log('当前日期:' + webDay + "号,上次签到时间:" + checkinDay + "号");
        if (date != checkinDay) {
            var checkinbtn = document.getElementsByClassName('ui positive button');
            checkinbtn[0].click();
            console.log("上次签到日期:" + date + "号,当前日期:" + date);
            sendNotification("glados", "签到成功,时间" + timeStr,"https://lh3.googleusercontent.com/jGbUSukJHtIKK4vzJdHq0xJiRp0ZP0bLqKzOfaITpfXdHg6rDpbPjXEmCIiZJKY0L2tCLRvHLtM_0NymB_4h1Fv-_g=w128-h128-e365-rj-sc0x00ffffff");
            localStorage.setItem(varLastDay, date);
        } else {
            console.log('---今天已经签到---,当前时间:' + timeStr);
        }

        // console.log('当前日期:' + thisDay + '号,下次刷新时间:' + nexTime / 1000 + "秒后");
        setTimeout(function () { checkin() }, timeGap * 1000);
    }

    var myDate = new Date();
    var now = myDate.toLocaleTimeString();
    var nexTime = randomNum(60 * 60 * 1000 * 15, 16 * 60 * 60 * 1000);
    console.log('执行刷新网页,刷新时间' + now + '下次刷新时间:' + Math.floor(nexTime / 1000 / 60) + "分钟后");

    setInterval(function () { document.location.reload() }, nexTime);
    checkin();

})();