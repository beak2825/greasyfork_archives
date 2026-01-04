// ==UserScript==
// @name         AutoUnlock
// @namespace    https://greasyfork.org/scripts/31324-autounlock
// @version      0.5.0
// @description  自动跳转并解锁百度网盘、Mega分享
// @author       MaiJZ
// @homepageURL  https://github.com/maijz128/AutoUnlock
// @supportURL   https://github.com/maijz128/AutoUnlock
// @match        *://pan.baidu.com/share/init?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/31324/AutoUnlock.user.js
// @updateURL https://update.greasyfork.org/scripts/31324/AutoUnlock.meta.js
// ==/UserScript==

/*
    百度网盘
        链接的格式：pan.baidu.com/share/init?surl=1miHVd8k&password=hg9j
        没有password不起效
*/

const Util = {
    hrefContains: function (str) {
        return location.href.indexOf(str) > 1;
    },
    GetQueryString: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r !== null)
            return (r[2]);
        else
            return null;
    }
};


(function () {
    'use strict';
    run();
})();

function run() {
    var isBaiduShareInitSite = Util.hrefContains("pan.baidu.com/share/init");

    if (isBaiduShareInitSite) {
        BaiduPan();
    }
}




function BaiduPan() {
    if (Util.hrefContains("password=")) {
        unlockBaidu();
    }

    function unlockBaidu() {
        const value = Util.GetQueryString("password");
        if (value !== null || value !== "null") {
            var password = decodeURIComponent(value);
            console.log("password=" + password);
            _unlockBaidu(password);
        }
    }


    function _unlockBaidu(password, count) {
        const MAX_TIME = 10 * 1000;
        const INTERVAL = 50;
        const MAX_COUNT = MAX_TIME / INTERVAL;
        count = count || 1;

        console.log("password: " + password + " count: " + count);
        if (count < MAX_COUNT && password) {

            var inputs = document.querySelectorAll("input");
            var input = inputs[0];
            var submitBtn = document.querySelector("a[title='提取文件']");
            if (input && submitBtn) {
                input.value = password;
                submitBtn.click();
            }

            setTimeout(function () {
                _unlockBaidu(password, count + 1);
            }, INTERVAL);
        }
    }

}
