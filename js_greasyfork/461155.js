 // ==UserScript==
 // @name         湖南信息职业技术学院 校园网自动退出
 // @namespace    http://tampermonkey.net/
 // @version      1.0
 // @description  实现校园网的自动退出
 // @author       eqs
 // @match        *://*.baidu.com/*
 // @match        *://*.google.com/*
 // @match        *://*.bing.com/*
 // @match        *://*.so.com/*
 // @match        *://*.zhihu.com/*
 // @match        *://*.douban.com/*
 // @match        *://*.weibo.com/*
 // @match        *://twitter.com/*
 // @match        *://*.youtube.com/*
 // @match        *://*.bilibili.com/*
 // @match        https://www.hniu.com/
 // @match        http://10.253.0.1
 // @match        http://10.253.0.1/a79.htm
 // @require      https://code.jquery.com/jquery-3.3.1.min.js
 // @require      https://code.jquery.com/ui/1.12.1/jquery-ui.js
 // @grant        none
// @downloadURL https://update.greasyfork.org/scripts/461155/%E6%B9%96%E5%8D%97%E4%BF%A1%E6%81%AF%E8%81%8C%E4%B8%9A%E6%8A%80%E6%9C%AF%E5%AD%A6%E9%99%A2%20%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E9%80%80%E5%87%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/461155/%E6%B9%96%E5%8D%97%E4%BF%A1%E6%81%AF%E8%81%8C%E4%B8%9A%E6%8A%80%E6%9C%AF%E5%AD%A6%E9%99%A2%20%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E9%80%80%E5%87%BA.meta.js
 // ==/UserScript==


setTimeout(function(){
    window.location.href = 'http://10.253.0.1/a79.htm';
    document.querySelector("#edit_body > div:nth-child(1) > div.edit_loginBox.ui-resizable-autohide > form > input").click();;
    document.querySelector("#layui-layer1 > div.layui-layer-btn.layui-layer-btn- > a.layui-layer-btn0").click();;
;},4000);

