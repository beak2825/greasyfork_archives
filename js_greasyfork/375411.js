// ==UserScript==
// @name         byeByeCSDN登陆注册
// @namespace    byByeCSDN_login
// @version      0.5
// @description  qunideCSDN查看文章要登陆注册，文明文明
// @author       WILO
// @match        https://blog.csdn.net/*/*/*/*
// @grant        none
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/375411/byeByeCSDN%E7%99%BB%E9%99%86%E6%B3%A8%E5%86%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/375411/byeByeCSDN%E7%99%BB%E9%99%86%E6%B3%A8%E5%86%8C.meta.js
// ==/UserScript==

//去除展开登陆注册需求
document.getElementById('article_content').style.height='';
//去除展开按钮
document.getElementsByClassName('hide-article-box')[0].style.display='none';
//去除底部登陆注册提示
document.getElementsByClassName('pulllog-box')[0].style.display='none';
//去除页面中部广告
document.getElementsByClassName('mediav_ad')[0].style.display='none';
//去除谷歌广告,算了去除了很诡异，不去除了
//document.getElementsByClassName('adsbygoogle')[0].style.display='none';
//去除页面左侧侧栏广告
document.getElementsByClassName('fourth_column')[0].style.display='none';

