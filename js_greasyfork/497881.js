// ==UserScript==
// @name         替换Teracloud分享页面Google资源为国内CDN地址
// @namespace    https://axutongxue.com/
// @version      0.0.1
// @description  解决InfiniCLOUD（原Teracloud）因使用Google相关的js资源导致无法正常访问的问题
// @author       阿虚同学
// @license      GPL-2.0
// @update       2024/6/14
// @match        https://*.teracloud.jp/*
// @homepageURL  https://axutongxue.com/
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/497881/%E6%9B%BF%E6%8D%A2Teracloud%E5%88%86%E4%BA%AB%E9%A1%B5%E9%9D%A2Google%E8%B5%84%E6%BA%90%E4%B8%BA%E5%9B%BD%E5%86%85CDN%E5%9C%B0%E5%9D%80.user.js
// @updateURL https://update.greasyfork.org/scripts/497881/%E6%9B%BF%E6%8D%A2Teracloud%E5%88%86%E4%BA%AB%E9%A1%B5%E9%9D%A2Google%E8%B5%84%E6%BA%90%E4%B8%BA%E5%9B%BD%E5%86%85CDN%E5%9C%B0%E5%9D%80.meta.js
// ==/UserScript==
/* eslint-disable */

!function() {
    "use strict";
    document.querySelectorAll("script").forEach((function(e) {
        if (e.src.indexOf("googleapis.com") >= 0 || e.src.indexOf("themes.googleusercontent.com") >= 0 || e.src.indexOf("www.google.com/recaptcha/") >= 0) {
            let c = e.src.replace("http://", "https://").replace("googleapis.com", "proxy.ustclug.org").replace("themes.googleusercontent.com", "google-themes.lug.ustc.edu.cn").replace("www.google.com/recaptcha/", "www.recaptcha.net/recaptcha/");
            e.parentNode.replaceChild(function(e) {
                let c = document.createElement("script");
                return c.src = e, c;
            }(c), e);
        }
    }));
}();
