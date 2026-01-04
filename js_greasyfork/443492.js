// ==UserScript==
// @name         驿站掌柜防止掉线
// @namespace    红星闪闪丶放光芒
// @version      1.0
// @description  定时刷新页面，防止账号掉线导致无法打印快递单
// @author       红星闪闪丶放光芒
// @match        https://cainiaoyizhan.cainiao.com
// @icon         https://img.alicdn.com/tfs/TB1uUY1eMoQMeJjy0FoXXcShVXa-64-64.png
// @grant        none
// @include    *://cainiaoyizhan.cainiao.com/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/443492/%E9%A9%BF%E7%AB%99%E6%8E%8C%E6%9F%9C%E9%98%B2%E6%AD%A2%E6%8E%89%E7%BA%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/443492/%E9%A9%BF%E7%AB%99%E6%8E%8C%E6%9F%9C%E9%98%B2%E6%AD%A2%E6%8E%89%E7%BA%BF.meta.js
// ==/UserScript==

(function() {
    var a= new Date();
    var year = a.getFullYear();
    var mon = a.getMonth() + 1;
    var day = a.getDate();
    var hour = a.getHours();
    var minute = a.getMinutes();
    var second = a.getSeconds();
    var week = a.getDay();
    var arr = ["星期日","星期一","星期二","星期三","星期四","星期五","星期六"];
    function prin(){
        location.reload();
        console.log('现在时间：'+year+'-'+mon+'-'+day+' '+hour+'-'+minute+'-'+second+arr[week]+'已经刷新当前页面了');
    }
    //1000:1秒，60*60:60分钟的秒数，2:2小时
    setInterval(prin,1000*60*30);
})();