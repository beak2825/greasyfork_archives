// ==UserScript==
// @name        HY清风自频道 播放页最大化&去广告
// @author      HY清风
// @description HY清风自频道专用
// @namespace   none 

// @match        *://i.youku.com/i/*
// @include      *://i.youku.com/i/*
// @include      *://i.youku.com/*
// @include      *://i.youku.com/u/*
// @include      http://i.youku.com/winune
// @include      *://v.youku.com/v_show/*
// @include      *://list.youku.com/show/*
// @include      file:///*.html

// @version      0.3
// @downloadURL https://update.greasyfork.org/scripts/377109/HY%E6%B8%85%E9%A3%8E%E8%87%AA%E9%A2%91%E9%81%93%20%E6%92%AD%E6%94%BE%E9%A1%B5%E6%9C%80%E5%A4%A7%E5%8C%96%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/377109/HY%E6%B8%85%E9%A3%8E%E8%87%AA%E9%A2%91%E9%81%93%20%E6%92%AD%E6%94%BE%E9%A1%B5%E6%9C%80%E5%A4%A7%E5%8C%96%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==
//读取整个网页内容
var htmlstr=document.getElementsByTagName('body')[0].innerHTML;

//播放地址切换
htmlstr=htmlstr.replace(/v.youku.com/g,"player.youku.com");
htmlstr=htmlstr.replace(/v_show/g,"embed");
htmlstr=htmlstr.replace(/id_/g,"");
htmlstr=htmlstr.replace(/==.html/g,"==");
htmlstr=htmlstr.replace(/.html/g,"");


//本地文件替换
htmlstr=htmlstr.replace(/undefined/g,"");

//把翻译结果替换整个网页内容
document.getElementsByTagName('body')[0].innerHTML=htmlstr;