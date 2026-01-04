// ==UserScript==
// @name         小能客户端拖动靠边站
// @namespace    remove ad
// @version      1.5
// @description  kaobianzhan
// @author       lcc
// @match        http://192.168.90.199:8080/*
// @match        http://127.0.0.1:8080/*
// @match        https://xngwtest.jd.com/client/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427279/%E5%B0%8F%E8%83%BD%E5%AE%A2%E6%88%B7%E7%AB%AF%E6%8B%96%E5%8A%A8%E9%9D%A0%E8%BE%B9%E7%AB%99.user.js
// @updateURL https://update.greasyfork.org/scripts/427279/%E5%B0%8F%E8%83%BD%E5%AE%A2%E6%88%B7%E7%AB%AF%E6%8B%96%E5%8A%A8%E9%9D%A0%E8%BE%B9%E7%AB%99.meta.js
// ==/UserScript==
(function() {
    'use strict';

    setTimeout(()=>{
        document.getElementsByClassName('horizontal')[0].style.minWidth = 'calc(100vw - 20px)'
        "calc(100vw - 20px)"
    }
    , 5000)
})();