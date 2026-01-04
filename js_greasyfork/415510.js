// ==UserScript==
// @name         BaiDuCloud分享链接自动填写
// @namespace    https://greasyfork.org/zh-CN/scripts/415510-baiducloud%E5%88%86%E4%BA%AB%E9%93%BE%E6%8E%A5%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99
// @version      0.2
// @description  配合解析脚本自动填写链接与提取码
// @author       neysummer
// @match        https://pan.kdbaidu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/415510/BaiDuCloud%E5%88%86%E4%BA%AB%E9%93%BE%E6%8E%A5%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99.user.js
// @updateURL https://update.greasyfork.org/scripts/415510/BaiDuCloud%E5%88%86%E4%BA%AB%E9%93%BE%E6%8E%A5%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var params = getGETArray();
    if(params['url'] != undefined){
       document.getElementsByName('surl')[0].value = atob(params['url']);
        if(params['pwd'] != undefined){
            document.getElementsByName('pwd')[0].value = params['pwd'];
        }
        document.querySelector('button[type=submit]').click();
    }

    function getGETArray() {
        var a_result = [], a_exp;
        var a_params = window.location.search.slice(1).split('&');
        for (var k in a_params) {
            a_exp = a_params[k].split('=');
            if (a_exp.length > 1) {
                a_result[a_exp[0]] = decodeURIComponent(a_exp[1]);
            }
        }
        return a_result;
    }
})();