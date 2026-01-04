// ==UserScript==
// @name         Set ERP_CODE_VERSION Current Time
// @namespace    http://172.31.0.64:8080/*
// @version      4.3
// @description  Set ERP_CODE_VERSION Current Time; like: 202101281552
// @author       You
// @match        http://172.31.0.64:8080/*
// @grant        none
// @Download_url https://greasyfork.org/zh-CN/scripts/420801-set-erp-code-version-current-time
// @downloadURL https://update.greasyfork.org/scripts/420801/Set%20ERP_CODE_VERSION%20Current%20Time.user.js
// @updateURL https://update.greasyfork.org/scripts/420801/Set%20ERP_CODE_VERSION%20Current%20Time.meta.js
// ==/UserScript==

(function() {
    'use strict';

    Date.prototype.Format = function (fmt) {
        var o = {
            "M+": this.getMonth() + 1, //月份
            "d+": this.getDate(), //日
            "h+": this.getHours(), //小时
            "m+": this.getMinutes(), //分
            "s+": this.getSeconds(), //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            "S": this.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o) if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }

    var now = new Date().Format("yyyyMMddhhmm");

    //console.log(now);

    var white_list = ['ERP_CODE_VERSION', 'ERP_FILE_VERSION', 'ODOO_CODE_VERSION', 'ODOO_DB_VERSION'];

    var S = "#main-panel > form > table > tbody:nth-child(1) > tr:nth-child(1) > td.setting-main > div > input.setting-input";
    var col = "#main-panel > form > table > tbody:nth-child(1) > tr:nth-child(1) > td.setting-name";

    //console.log(document.querySelector(col).innerHTML);
    //console.log(white_list.indexOf(document.querySelector(col).innerHTML));

    if(white_list.indexOf(document.querySelector(col).innerHTML) >= 0){
        document.querySelector(S).setAttribute('value', now);
    };

    // Your code here...
})();