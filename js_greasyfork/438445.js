// ==UserScript==
// @name         bilibili网页端每天自动打开一次直播间
// @namespace    indefined
// @version      0.0.3
// @description  每天自动打开一次直播间（配合直播挂机助手使用）
// @author       indefined
// @match        *://www.bilibili.com/*
// @include      https://www.mcbbs.net/template/mcbbs/image/special_photo_bg.png?*
// @license      MIT
// @connect      app.bilibili.com
// @connect      api.bilibili.com
// @connect      passport.bilibili.com
// @connect      link.acg.tv
// @connect      www.mcbbs.net
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/438445/bilibili%E7%BD%91%E9%A1%B5%E7%AB%AF%E6%AF%8F%E5%A4%A9%E8%87%AA%E5%8A%A8%E6%89%93%E5%BC%80%E4%B8%80%E6%AC%A1%E7%9B%B4%E6%92%AD%E9%97%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/438445/bilibili%E7%BD%91%E9%A1%B5%E7%AB%AF%E6%AF%8F%E5%A4%A9%E8%87%AA%E5%8A%A8%E6%89%93%E5%BC%80%E4%B8%80%E6%AC%A1%E7%9B%B4%E6%92%AD%E9%97%B4.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //这里可以填自己想打开的直播间url
    var liveUrl = 'http://live.bilibili.com/13602541';
    //根据name获取Cookie
    function getCookie(name) {
    // 拆分 cookie 字符串
    var cookieArr = document.cookie.split(";");
    // 循环遍历数组元素
    for(var i = 0; i < cookieArr.length; i++) {
        var cookiePair = cookieArr[i].split("=");
        /* 删除 cookie 名称开头的空白并将其与给定字符串进行比较 */
        if(name == cookiePair[0].trim()) {
            // 解码cookie值并返回
            return decodeURIComponent(cookiePair[1]);
        }
    }
    // 如果未找到，则返回null
    return null;
    }
    //设置Cookie
    //这是有设定过期时间的使用示例：
    //s20是代表20秒
    //h是指小时，如12小时则是：h12
    //d是天数，30天则：d30
    function setCookie(name,value,time)
    {
        var strsec = getsec(time);
        var exp = new Date();
        exp.setTime(exp.getTime() + strsec*1);
        document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
    }
    function getsec(str)
{
    var str1=str.substring(1,str.length)*1;
    var str2=str.substring(0,1);
    if (str2=="s")
    {
        return str1*1000;
    }
    else if (str2=="h")
    {
        return str1*60*60*1000;
    }
    else if (str2=="d")
    {
        return str1*24*60*60*1000;
    }
}
Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "H+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
var today = new Date().Format("yyyy-MM-dd");
    if(!getCookie('openLive') || getCookie('openLive') != today){
        window.open(liveUrl);
        setCookie('openLive',today,'d7');
    }

})();