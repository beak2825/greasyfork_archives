// ==UserScript==
// @name              Qingting.fm timezone fix
// @name:zh-CN        蜻蜓FM电台时区修复
// @version           1.0
// @description       Fix an issue affecting qingting.fm player on timezones other than UTC+8
// @description:zh-CN 修复蜻蜓FM电台播放器无法在东八区以外的时区正常工作的问题
// @author            StarBrilliant
// @license           Public Domain
// @match             *://*.qingting.fm/*
// @grant             none
// @namespace https://greasyfork.org/users/727840
// @downloadURL https://update.greasyfork.org/scripts/420263/Qingtingfm%20timezone%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/420263/Qingtingfm%20timezone%20fix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    Object.defineProperty(Date.prototype, "getFullYear", {"value": function getFullYear() {
        return new Date(this.getTime() + 28800000).getUTCFullYear();
    }});
    Object.defineProperty(Date.prototype, "getYear", {"value": function getYear() {
        return new Date(this.getTime() + 28800000).getUTCYear();
    }});
    Object.defineProperty(Date.prototype, "getMonth", {"value": function getMonth() {
        return new Date(this.getTime() + 28800000).getUTCMonth();
    }});
    Object.defineProperty(Date.prototype, "getDate", {"value": function getDate() {
        return new Date(this.getTime() + 28800000).getUTCDate();
    }});
    Object.defineProperty(Date.prototype, "getDay", {"value": function getDay() {
        return new Date(this.getTime() + 28800000).getUTCDay();
    }});
    Object.defineProperty(Date.prototype, "getHours", {"value": function getHours() {
        return new Date(this.getTime() + 28800000).getUTCHours();
    }});
    Object.defineProperty(Date.prototype, "getMinutes", {"value": function getMinutes() {
        return new Date(this.getTime() + 28800000).getUTCMinutes();
    }});
    Object.defineProperty(Date.prototype, "getTimezoneOffset", {"value": function getTimezoneOffset() {
        return -480;
    }});
})();
