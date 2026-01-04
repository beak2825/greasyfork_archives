// ==UserScript==
// @name         内网标题修改
// @version      1.0.1
// @description  内网标题修改 自用
// @author       windnight
// @include      *://jumpserver.tcy365.*/*
// @include      *://data.ct108.net:*/*
// @include      *://backend.ct108.net:*/*
// @include      *://tcysyslog.admin.ct108.net/*
// @include      *://tcysyslog-in.admin.ct108.net:*/*
// @include      *://ctdocker2.admin.ct108.net/*
// @include      *://ctdocker-in.admin.ct108.net:*/*
// @include      http://47.98.181.128/*
// @include      http://192.168.105.150/*
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @namespace
// @namespace https://greasyfork.org/users/222560
// @downloadURL https://update.greasyfork.org/scripts/411719/%E5%86%85%E7%BD%91%E6%A0%87%E9%A2%98%E4%BF%AE%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/411719/%E5%86%85%E7%BD%91%E6%A0%87%E9%A2%98%E4%BF%AE%E6%94%B9.meta.js
// ==/UserScript==   

var $ = $ || window.$;

var serverNameObj = [{
    "SId": 1248,
    "SCode": "TcPromoteTrackWeb",
    "SName": "跟踪系统站点"
},
{
    "SId": 1385,
    "SCode": "TcPromoteTrackDcRegisterConsumerSvr",
    "SName": "订阅大数据注册消费者服务"
},
{
    "SId": 1386,
    "SCode": "TcTrackCallBackToSgJobSvr",
    "SName": "回调搜狗定时任务服务"
}, {
    "SId": 1389,
    "SCode": "TcTrackCallBackToSmJobSvr",
    "SName": "回调搜狗定时任务服务"
}, {
    "SId": 1391,
    "SCode": "TcTrackCommonSvr",
    "SName": "跟踪系统基础服务"
},
]
function GetSNameById(sId) {
    console.log("sId input is " + sId);
    console.log("serverNameObj is " + JSON.stringify(serverNameObj));
    var sInfo = serverNameObj.filter(m => m.SId == sId)[0]
    console.log(sInfo);
    console.log("sId input is " + sId + " sInfo is " + JSON.stringify(sInfo));
    return sInfo != undefined ? sInfo.SName : sId;
}
function GetSNameByCode(sCode) {
    console.log("sCode input is " + sCode);
    console.log("serverNameObj is " + JSON.stringify(serverNameObj));
    var sInfo = serverNameObj.filter(m => m.SCode.toLowerCase() == sCode.toLowerCase())[0]
    console.log(sInfo);
    console.log("sCode input is " + sCode + " sInfo is " + JSON.stringify(sInfo));

    return sInfo != undefined ? sInfo.SName : sCode;
}

function GetCurrentSId() {
    var sId = getQueryString("id");
    console.log("GetCurrentSId is " + sId);
    return sId;
}

function GetCurrentSCode() {
    var sCode = getQueryString("servicecode");
    console.log("GetCurrentSCode is " + sCode);
    return sCode;
}

function GetCurrentSNameById() {
    var sId = GetCurrentSId();
    var sName = GetSNameById(sId);
    console.log("CurrentSNameById is " + sName);
    return sName;
}
function GetCurrentSNameByCode() {
    var sCode = GetCurrentSCode();
    var sName = GetSNameByCode(sCode);
    console.log("CurrentSNameByCode is " + sName);
    return sName;
}

window.jQuery = $;

String.prototype.endWith = function (endStr) {
    var d = this.length - endStr.length;
    return (d >= 0 && this.lastIndexOf(endStr) == d);
}


if (!String.prototype.endsWith) {
    String.prototype.endsWith = function (search, this_len) {
        if (this_len === undefined || this_len > this.length) {
            this_len = this.length;
        }
        return this.substring(this_len - search.length, this_len) === search;
    };
}

if (!String.prototype.startsWith) {
    Object.defineProperty(String.prototype, 'startsWith', {
        value: function (search, pos) {
            pos = !pos || pos < 0 ? 0 : +pos;
            return this.substring(pos, pos + search.length) === search;
        }
    });
}

// 获取参数
function getQueryString(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return null;
}

function IsJumpserver() {
    return window.location.href.includes("jumpserver") || window.location.host == "47.98.181.128" || window.location.host == "192.168.105.150";
}
function IsKibana() {
    return window.location.href.includes("kibana");
}

function IsCtdockerOnline() {
    return window.location.href.includes("ctdocker2.admin.ct108.net");
}

function IsCtdockerInner() {
    return window.location.href.includes("ctdocker-in.admin.ct108.net");
}

function IsConfigCenterV1() {
    return window.location.href.includes("ConfigManage.aspx");
}


function IsCtLogSysOnline() {
    return window.location.href.includes("tcysyslog.admin.ct108.net");
}

function IsCtLogSysInner() {
    return window.location.href.includes("tcysyslog-in.admin.ct108.net");
}


; $(document).ready(function () {
    var _host = window.location.host;
    var _href = window.location.href;
    var newTile = $("title").html();
    if (IsJumpserver()) {
        if (_host.endsWith("com") || _host == "47.98.181.128") {
            newTile = "堡垒机-正式版";
        }
        else if (_host.endsWith("org") || _host == "192.168.105.150") {
            newTile = "堡垒机-测试版";
        }
    }
    else if (IsKibana()) {
        newTile = "kibana-数据中心";
    }
    else if (IsCtdockerOnline()) {
        newTile = "Docker服务-" + GetCurrentSNameByCode();
    }
    else if (IsCtdockerInner()) {
        newTile = "Docker服务（内网）-" + GetCurrentSNameByCode();
    }
    else if (IsConfigCenterV1()) {
        newTile = "V1配置中心- " + GetCurrentSNameById();
    }
    else if (IsCtLogSysInner()) {
        newTile = "畅唐日志（内网）";
    }
    else if (IsCtLogSysOnline()) {
        newTile = "畅唐日志（外网）";
    }
    
    $("title").html(newTile);
});