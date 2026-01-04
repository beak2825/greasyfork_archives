// ==UserScript==
// @name         peiwo script
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  陪我记录公屏脚本。
// @copyright    随便
// @author       You
// @include      https://h5.raybo.com/h5/live/index.html?*
// @match        http://www.peiwo.cn/live.html
// @license      LGPLv3
// @downloadURL https://update.greasyfork.org/scripts/31285/peiwo%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/31285/peiwo%20script.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var name = $(".fr h2").text() + " " + $(".livenumber.fr").text();
    var name = name == "null null" ? $(".live_left_top").text() : name + " ";
    var name = name + Date();

    //显示当前时间
    function showtime() {
        var now = new Date();
        return " " + now.getDate() + "日 " + now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
    };
    document.getElementsByClassName("cloudmsg")[0].addEventListener('DOMNodeInserted', function(e) {
        var cloudmsg = e.target.innerHTML + showtime();
        localStorage.setItem("cloudmsg_" + name, localStorage.getItem("cloudmsg_" + name) + cloudmsg + "\n");
        console.log('cloudmsg: ' + cloudmsg);
    });
    try {
        document.getElementsByClassName("publicMsg")[0].addEventListener('DOMNodeInserted', function(e) {
            var publicMsg = e.target.textContent + showtime();
            localStorage.setItem("publicMsg_" + name, localStorage.getItem("publicMsg_" + name) + publicMsg + "\n");
            console.log('publicMsg: ' + publicMsg);
        });
    } catch (err) {
        console.error(err);
    }
    document.getElementsByClassName("gifts")[0].addEventListener('DOMNodeInserted', function(e) {
        var gifts = e.target.textContent + showtime();
        localStorage.setItem("gifts_" + name, localStorage.getItem("gifts_" + name) + gifts + "\n");
        console.log('gifts: ' + gifts);
    });
    document.getElementsByClassName("giftblock")[0].addEventListener('DOMSubtreeModified', function(e) {
        var giftblock0 = e.target.innerHTML + showtime();
        localStorage.setItem("giftblock0" + name, localStorage.getItem("giftblock0" + name) + giftblock0 + "\n");
        console.log('giftblock0-: ' + giftblock0);
    });
    document.getElementsByClassName("giftblock")[1].addEventListener('DOMSubtreeModified', function(e) {
        var giftblock1 = e.target.innerHTML + showtime();
        localStorage.setItem("giftblock1" + name, localStorage.getItem("giftblock1" + name) + giftblock1 + "\n");
        console.log('giftblock1-: ' + giftblock1);
    });
})();