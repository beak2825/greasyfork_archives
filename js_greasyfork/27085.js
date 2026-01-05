// ==UserScript==
// @name         subhd.com 直接下载
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  直接下载subhd.com的字幕
// @author       sarices
// @match        http://subhd.com/a/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27085/subhdcom%20%E7%9B%B4%E6%8E%A5%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/27085/subhdcom%20%E7%9B%B4%E6%8E%A5%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $.post('/ajax/down_ajax',{sub_id:$("#down").attr("sid")},function(data){
        console.log(data.url);
        var html = '<a href="'+data.url+'" style="color:red;">直接下载</a> ';
        $('#down').before(html);
        $('#down').remove();
    },'json');
})();