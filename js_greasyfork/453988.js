// ==UserScript==
// @name       没品图片显示
// @namespace  没品图片显示
// @version      1.0.3
// @description  just copy and paste
// @match        http*://meipin4.wordpress.com/*
// @downloadURL https://update.greasyfork.org/scripts/453988/%E6%B2%A1%E5%93%81%E5%9B%BE%E7%89%87%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/453988/%E6%B2%A1%E5%93%81%E5%9B%BE%E7%89%87%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var meta = document.createElement('meta');    
    meta.name = "referrer"; 
    meta.content = "no-referrer";
 document.getElementsByTagName('head')[0].appendChild(meta);
    var img_list = document.getElementsByTagName('img')
    for (var i = 0; i < img_list.length; i++) {   
     img_list[i].setAttribute('referrerPolicy', 'same-origin')
            }
    // Your code here...
})();