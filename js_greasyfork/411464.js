// ==UserScript==
// @name         geekhub更换logo
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  try to take over the world!
// @author       夜幕下的尖椒
// @match        https://geekhub.com/**
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/jquery@3.4.1/dist/jquery.slim.min.js
// @downloadURL https://update.greasyfork.org/scripts/411464/geekhub%E6%9B%B4%E6%8D%A2logo.user.js
// @updateURL https://update.greasyfork.org/scripts/411464/geekhub%E6%9B%B4%E6%8D%A2logo.meta.js
// ==/UserScript==

(function() {
    'use strict';
     //获取该对象
    var logo = $("header div div a")[0];
    logo.style.background="url(https://i.loli.net/2020/09/15/uNbf24htM3dQzev.png)";
    logo.style.width = '350px';
    logo.style.height = '108px';
    //logo.style.background-size = '50%';
    logo.innerHTML="";
    // Your code here...
})();