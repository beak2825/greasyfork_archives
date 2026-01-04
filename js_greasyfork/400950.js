// ==UserScript==
// @name         stackoverflow的加载速度优化 js和css资源CDN替换
// @namespace    endday
// @version      0.0.2
// @description  将stackoverflow使用的Google相关的js和css资源替换成国内的 CDN 地址
// @author       endday
// @license      GPL-2.0
// @update       2020/10/21
// @match        https://*.stackoverflow.com
// @match        https://*.stackoverflow.com/*
// @homepageURL  https://github.com/endday/tm-script

// @run-at       document-start

// @downloadURL https://update.greasyfork.org/scripts/400950/stackoverflow%E7%9A%84%E5%8A%A0%E8%BD%BD%E9%80%9F%E5%BA%A6%E4%BC%98%E5%8C%96%20js%E5%92%8Ccss%E8%B5%84%E6%BA%90CDN%E6%9B%BF%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/400950/stackoverflow%E7%9A%84%E5%8A%A0%E8%BD%BD%E9%80%9F%E5%BA%A6%E4%BC%98%E5%8C%96%20js%E5%92%8Ccss%E8%B5%84%E6%BA%90CDN%E6%9B%BF%E6%8D%A2.meta.js
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
