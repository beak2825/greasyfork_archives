// ==UserScript==
// @name         新浪微博删除自己的名字
// @namespace    undefined
// @version      0.1.1
// @description  强迫症，不想刷微博的时候被舍友偶然瞄到自己的ID，你还可以去掉注释把右侧的显示详细关注人的列表也删掉
// @author       Sora Shiro
// @match        http://www.weibo.com/*
// @match        https://www.weibo.com/*
// @match        http://weibo.com/*
// @match        https://weibo.com/*
// @require    http://code.jquery.com/jquery-1.11.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/33520/%E6%96%B0%E6%B5%AA%E5%BE%AE%E5%8D%9A%E5%88%A0%E9%99%A4%E8%87%AA%E5%B7%B1%E7%9A%84%E5%90%8D%E5%AD%97.user.js
// @updateURL https://update.greasyfork.org/scripts/33520/%E6%96%B0%E6%B5%AA%E5%BE%AE%E5%8D%9A%E5%88%A0%E9%99%A4%E8%87%AA%E5%B7%B1%E7%9A%84%E5%90%8D%E5%AD%97.meta.js
// ==/UserScript==

// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_setClipboard

window.onload=deleteMessage;

$(document).ready(function(){
  deleteMessage();
});

$(window).scroll(function(event){
  deleteMessage();
});

function deleteMessage() {
  var name = $('*[nm="name"]').find('em.S_txt1');
    name.remove();
    var name2 = $('a.name.S_txt1');
    name2.remove();
    //var listOfGroups = $('div#v6_pl_rightmod_groups');
    //listOfGroups.remove();
}