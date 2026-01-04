// ==UserScript==
// @name         fuck ruoyi
// @namespace    http://tampermonkey.net/
// @version      2024-08-21 3
// @description  aha
// @author       You
// @match        https://doc.iocoder.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=iocoder.cn
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/504479/fuck%20ruoyi.user.js
// @updateURL https://update.greasyfork.org/scripts/504479/fuck%20ruoyi.meta.js
// ==/UserScript==



(function() {
    'use strict';
    function setCookie(name, value, days) {
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    }
 
    // 保存原始的 jQuery get 方法
    Cookies.remove = () => {
        throw new Error('xixi')
    }
    let src = ''
    const scripts = document.querySelectorAll("script[src]")
    for (let i = 0; i < scripts.length; ++i) {
        if(scripts[i].src.indexOf('/assets/js/app') > -1) {
            src = scripts[i].src
        }
    }
    if(src) {
        $.get(src,{host: document.location.host},(function(text){
            const key = text.match(/"([0-9a-z]{8}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{12})"/)
            if(key.length === 2) {
                if(document.cookie.indexOf(key[1]) === -1) {
                      setCookie(key[1], "456", 365);
                }
            }
        }))
    }
})();