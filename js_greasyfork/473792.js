// ==UserScript==
// @name         Bilibili回到旧版
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  每0.5秒检测一次buvid3和buvid4，当这两个cookies被生成时立即删除，以希望实现回到旧版
// @author       csy_x
// @match        https://www.bilibili.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/473792/Bilibili%E5%9B%9E%E5%88%B0%E6%97%A7%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/473792/Bilibili%E5%9B%9E%E5%88%B0%E6%97%A7%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //Init
    var d = new Date();
    d.setTime(d.getTime()+(365*24*60*60*1000));
    var expiresdate = d.toGMTString();
    document.cookie = "go_old_video=1; expires="+expiresdate+"; path=/; domain=.bilibili.com";
    document.cookie = "go-back-dyn=1; expires="+expiresdate+"; path=/; domain=.bilibili.com";
    document.cookie = "nostalgia_conf=1; expires="+expiresdate+"; path=/; domain=.bilibili.com";
    document.cookie = "i-wanna-go-channel-back=1; expires="+expiresdate+"; path=/; domain=.bilibili.com";
    document.cookie = "go-old-ogv-video=1; expires="+expiresdate+"; path=/; domain=.bilibili.com";
    document.cookie = "ogv_channel_version=v1; expires="+expiresdate+"; path=/; domain=.bilibili.com";
    document.cookie = "hit-new-style-dyn=1; expires="+expiresdate+"; path=/; domain=.bilibili.com";
    document.cookie = "i-wanna-go-back=1; expires="+expiresdate+"; path=/; domain=.bilibili.com";

    // Define a function to delete a cookie by name
    function deleteCookie(name) {
        document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.bilibili.com";
    }

    // Define a function to run every second
    function run() {
        console.log("1")
        // Check if the cookie exists
        if (document.cookie.indexOf("buvid4") != -1) {
            // Delete the cookie
            deleteCookie("buvid4");
            // Log the action to the console
            console.log("Deleted cookie: " + "buvid4");
        }
        if (document.cookie.indexOf("buvid3") != -1) {
            // Delete the cookie
            deleteCookie("buvid3");
            // Log the action to the console
            console.log("Deleted cookie: " + "buvid3");
        }
    }

    // Set an interval to run the function every second
    setInterval(run, 1500);
})();