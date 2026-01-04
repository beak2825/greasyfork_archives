// ==UserScript==
// @name         Steam用户注册加载 recaptcha
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  解决 recaptcha 加载问题
// @author       AtMilo
// @match        https://store.steampowered.com/join/*
// @grant        none
// @license      MIT
// @run-at document-idle
// @downloadURL https://update.greasyfork.org/scripts/494615/Steam%E7%94%A8%E6%88%B7%E6%B3%A8%E5%86%8C%E5%8A%A0%E8%BD%BD%20recaptcha.user.js
// @updateURL https://update.greasyfork.org/scripts/494615/Steam%E7%94%A8%E6%88%B7%E6%B3%A8%E5%86%8C%E5%8A%A0%E8%BD%BD%20recaptcha.meta.js
// ==/UserScript==

(function() {
    'use strict';
    replaceRecaptchaTag();
    function replaceRecaptchaTag() {
        // get tag list
        const ele = Array.from(document.getElementsByTagName("script")).filter(item => item.src != ''&& item.src.includes("recaptcha"));
        if(ele.length == 0) {
            console.log("can not found recaptcha script tag!");
            return;
        }
        if(ele.length != 1) {
            console.log("found multiple tags",ele.length);
            return;
        }
        const recaptchaTag = ele[0];
        // recaptcha.net
        const recaptchaSrc = recaptchaTag.src.replace("google.com","recaptcha.net");
        const preEle = recaptchaTag.previousElementSibling;
        const newRecaptchaTag = document.createElement("script");
        newRecaptchaTag.src = recaptchaSrc;
        newRecaptchaTag.async = recaptchaTag.async;
        newRecaptchaTag.defer = recaptchaTag.defer;
        // remove old tag
        recaptchaTag.remove();
        // add new tag
        preEle.append(newRecaptchaTag);
        console.log("recaptcha script tag replace completed!");
    }
})();