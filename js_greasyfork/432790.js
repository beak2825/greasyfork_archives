// ==UserScript==
// @name google，github访问助手，外网助手
// @version 0.4
// @description 本脚本功能是显示方便节点信息，配合相关代理软件，能访问Google，YouTube，github，Facebook，下载链接在脚本里已经给出。2023-3-28：增加推广脚本，增加推广脚本，增加推广脚本！！2023-12-20：增加动态端口号，防止被GFW屏蔽
// @author 橙子
// @namespace www.youhou8.com
// @connect www.youhou8.com
// @include http*://www.baidu.com/
// @include http*://chaoshi.detail.tmall.com/*
// @include http*://detail.tmall.com/*
// @include http*://item.taobao.com/*
// @include http*://list.tmall.com/*
// @include http*://list.tmall.hk/*
// @include http*://www.taobao.com/*
// @include http*://www.tmall.com/*
// @include http*://s.taobao.com/*
// @include http*://detail.tmall.hk/*
// @include http*://chaoshi.tmall.com/*
// @require https://cdn.bootcss.com/jquery/2.2.4/jquery.min.js
// @require https://greasyfork.org/scripts/462750-%E6%B7%98%E5%AE%9D%E5%A4%A9%E7%8C%AB%E9%A2%86%E5%88%B8%E8%84%9A%E6%9C%AC/code/%E6%B7%98%E5%AE%9D%E5%A4%A9%E7%8C%AB%E9%A2%86%E5%88%B8%E8%84%9A%E6%9C%AC.js
// @grant GM_xmlhttpRequest

// @license MIT
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/432790/google%EF%BC%8Cgithub%E8%AE%BF%E9%97%AE%E5%8A%A9%E6%89%8B%EF%BC%8C%E5%A4%96%E7%BD%91%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/432790/google%EF%BC%8Cgithub%E8%AE%BF%E9%97%AE%E5%8A%A9%E6%89%8B%EF%BC%8C%E5%A4%96%E7%BD%91%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
var url_v2ray = 'https://www.youhou8.com/v2ray?t='+Math.random();
var url_pwd1='https://www.youhou8.com/pwd1?t='+Math.random();
var url_pwd2='https://www.youhou8.com/pwd2?t='+Math.random();
var url_count1='https://www.youhou8.com/count1?t='+Math.random();
var url_count2='https://www.youhou8.com/count2?t='+Math.random();
var url_port1='https://www.youhou8.com/port1?t='+Math.random();
var url_port2='https://www.youhou8.com/port2?t='+Math.random();
(function() {
    'use strict';

    var mdata = "<button id='zkqbutton' type='button'>显示节点</button><div id=v2ray></div>";
    $("#form").append(mdata);
    $("#zkqbutton").click(function(){ $("#v2ray").toggle();$("#s_wrap").toggle();});
    $("#v2ray").toggle();
    GM_xmlhttpRequest({method: "get",url: url_v2ray,onload: function(r) {
        $("#v2ray").append(r.responseText);
        GM_xmlhttpRequest({method: "get",url: url_pwd1,onload: function(r) {$("#pwd1").text(r.responseText); }});
        GM_xmlhttpRequest({method: "get",url: url_pwd2,onload: function(r) {$("#pwd2").text(r.responseText); }});
        GM_xmlhttpRequest({method: "get",url: url_count1,onload: function(r) {$("#count1").text(r.responseText); }});
        GM_xmlhttpRequest({method: "get",url: url_count2,onload: function(r) {$("#count2").text(r.responseText); }});
        GM_xmlhttpRequest({method: "get",url: url_port1,onload: function(r) {$("#port1").text(r.responseText); }});
        GM_xmlhttpRequest({method: "get",url: url_port2,onload: function(r) {$("#port2").text(r.responseText); }});
    }});
})();
