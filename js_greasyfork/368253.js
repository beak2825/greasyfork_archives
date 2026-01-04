// ==UserScript==
// @name         直播吧去除评论
// @namespace    http://tampermonkey.net/
// @version      1.02
// @description  删除评论栏
// @author       PLH
// @match        *://www.zhibo8.cc/
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/368253/%E7%9B%B4%E6%92%AD%E5%90%A7%E5%8E%BB%E9%99%A4%E8%AF%84%E8%AE%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/368253/%E7%9B%B4%E6%92%AD%E5%90%A7%E5%8E%BB%E9%99%A4%E8%AF%84%E8%AE%BA.meta.js
// ==/UserScript==
$(function(){
/*删除评论*/
var pl_box =document.getElementById('pl_box');
pl_box.display='none';

/*评论标题*/
var posts = document.getElementById('posts');
posts.display='none !important';
/*页脚*/
var container = document.getElementByClass('container');
container.display ='none !important';
});