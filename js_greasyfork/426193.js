// ==UserScript==
// @name        1280 List page thumbnail to original
// @namespace   List page thumbnail to original
// @match       http://1280inke.com/forum-280-1.html
// @grant       none
// @version     1.9
// @require     https://greasyfork.org/scripts/415668-zmquery3-5-1/code/zmQuery351.js?version=866815
// @author      ddx2002
// @description 2021/5/9上午11:43:11——List page thumbnail to original
// @match        *://*1280*.com/forum-*
// @match        *://www.woyaogexing.com/*.html 
// @downloadURL https://update.greasyfork.org/scripts/426193/1280%20List%20page%20thumbnail%20to%20original.user.js
// @updateURL https://update.greasyfork.org/scripts/426193/1280%20List%20page%20thumbnail%20to%20original.meta.js
// ==/UserScript==   
(function () {
    'use strict';
  
    var $$$ = $ || window._$ || zmQuery;
    var href = window.location.href;
    if (href.indexOf('1280') != -1) {
      console.log("检测到1280!")
      $$$('.thread-img').each(function(){ 
        $$$(this).attr('src',$$$(this).attr('src').split('-135-100').join(''))
      }) 
    }
    if (href.indexOf('www.woyaogexing.com') != -1) {
      console.log("检测到www.woyaogexing.com!")
      $$$('.tx-img .swipebox img').each(function(){ 
        $$$(this).attr('src',$$$(this).attr('src').split('!400x400').join(''))
      }) 
    }
  
})();