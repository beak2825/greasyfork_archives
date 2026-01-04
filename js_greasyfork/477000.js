// ==UserScript==
// @name         ClockIn22
// @description  tr
// @version      1.1
// @run-at       document-end
// @match        https://dptcgzt.szdgri.com:7707/*
// @grant        none
// @namespace https://greasyfork.org/users/222337
// @downloadURL https://update.greasyfork.org/scripts/477000/ClockIn22.user.js
// @updateURL https://update.greasyfork.org/scripts/477000/ClockIn22.meta.js
// ==/UserScript==

(function (send) {
    XMLHttpRequest.prototype.send = function (data) {
        send.call(this, data);
        var _this = this;
        setTimeout(function () {
            if (~_this.responseURL.indexOf('/attends/api/attend/detail')) {
                var data = JSON.parse(_this.response);
                document.querySelector('.startWork .startWork-time').innerText = '上班打卡时间 ' + data.data.shangBan.rawClockInTime;
                document.querySelector('.endWork .startWork-time').innerText = '下班打卡时间 ' + data.data.xiaBan.rawClockInTime;
            }
        }, 1000);
    };
})(XMLHttpRequest.prototype.send);

// 修改useragent，让其判断为elink浏览器环境
Object.defineProperty(navigator, 'userAgent', {
    value: 'Mozilla/5.0 (Linux; Android 13; 2210132C Build/TKQ1.220905.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/110.0.5481.29 Mobile Safari/537.36 wxworklocal/2.6.760000 wwlocal/2.6.760000 wxwork/3.0.0 appname/wxworklocal MicroMessenger/7.0.1 appScheme/wxworklocaluniform',
    writable: false
});

setTimeout(() => {
    document.querySelector('.information-msg-department').innerText = '（点击头像打卡）';
    document.querySelector('.information-main').addEventListener('click', () => {
        fetch("https://dptcgzt.szdgri.com:7707/attends/api/clockIn/submit", {
            "headers": {
                "accept": "application/json, text/plain, */*",
                "accept-language": "zh-CN,zh;q=0.9",
                "x-requested-with": "XMLHttpRequest",
                "content-Type": 'application/json'
            },
            "referrer": "https://dptcgzt.szdgri.com:7707/attends/mobile/index.html",
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": JSON.stringify({
                "location": "智慧广场-6楼考勤左",
                "workday": true,
                "source": "Door",
            }),
            "method": "POST",
            "mode": "cors",
            "credentials": "include"
        }).then(() => {
            window.location.reload();
        });
    })
}, 1000);