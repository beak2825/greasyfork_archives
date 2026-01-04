// ==UserScript==
// @name                                    百度必应搜索结果极简
// @namespace    http://tampermonkey.net/
// @version      0.1
// @author       You
// @description                          百度必应搜索结果极简,不需要其他花里胡哨的推荐的
// @match                                *https://www.baidu.com/*
// @match                                *https://www4.bing.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/456527/%E7%99%BE%E5%BA%A6%E5%BF%85%E5%BA%94%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E6%9E%81%E7%AE%80.user.js
// @updateURL https://update.greasyfork.org/scripts/456527/%E7%99%BE%E5%BA%A6%E5%BF%85%E5%BA%94%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E6%9E%81%E7%AE%80.meta.js
// ==/UserScript==

(function() {
    var css = '{display:none !important;height:0 !important}';
    //全局
    css += '#id_h,#u,#result_logo,.soutu-btn,.quickdelete-line,#form.has-soutu .quickdelete{display:none !important}' //全局隐藏
    css += '.wrapper_new #s_tab{padding:0 !important}'//内边距清零
    css += 'strong{color:#9070dd !important}'
    css += 'a{color:#00809d !important}'
    //百度
    css += '.wrapper_new .s_btn_wr .s_btn{background-color: #00809d !important}'
    css += '#result_logo{display:none !important,left:100px !important}'//logo
    css += '.s_form{display: flex !important;justify-content: center !important;padding:0 !important}' // 搜索栏
    css += '.wrapper_new #s_tab{padding-left:0 !important}'//搜索分类
    css += '.new_wrapper_1YQab{display:none !important}'
    css += '.result-molecule{display: flex !important;justify-content: center !important;}'
    //css += '.wrapper_new #s_tab a, .wrapper_new #s_tab b{margin-right:0 !important}'

    loadStyle(css)
    function loadStyle(css) {
        var style = document.createElement('style');
        style.type = 'text/css';
        style.rel = 'stylesheet';
        style.appendChild(document.createTextNode(css));
        var head = document.getElementsByTagName('head')[0];
        head.appendChild(style);
    }

})();