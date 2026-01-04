// ==UserScript==
// @name         恢复老子的av号
// @version      1.0
// @description  让BV变AV
// @match        *www.bilibili.com/video/BV*
// @namespace bilibiliganbei
// @downloadURL https://update.greasyfork.org/scripts/401530/%E6%81%A2%E5%A4%8D%E8%80%81%E5%AD%90%E7%9A%84av%E5%8F%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/401530/%E6%81%A2%E5%A4%8D%E8%80%81%E5%AD%90%E7%9A%84av%E5%8F%B7.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var str=document.getElementsByTagName('html')[0].innerHTML;
    var str1 = str.indexOf("https://www.bilibili.com/video/av");
    var str2 = str.indexOf("\"><meta data-vue-meta=\"true\" itemprop=\"i");
    str1 = str1+33;
    var avid = str.slice(str1,str2);
    var regPos = /^[0-9]+.?[0-9]*/;
    if(regPos.test(avid) ){
        var toav;
        toav = "https://www.bilibili.com/video/av" + avid;
        console.log("获取成功，即将跳转到:" + toav)
        window.location.href=toav;
    }else{
        console.log("获取失败")
        alert("哦吼，转失败了，请反馈给我来修复~");
    }
})();