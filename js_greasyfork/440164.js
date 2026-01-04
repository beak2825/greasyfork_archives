// ==UserScript==
// @name        简书去header
// @namespace   简书去header
// @match       https://www.jianshu.com/p/*
// @grant       none
// @version     1.0
// @author      -
// @description 2022/2/17 10:23:57
// @downloadURL https://update.greasyfork.org/scripts/440164/%E7%AE%80%E4%B9%A6%E5%8E%BBheader.user.js
// @updateURL https://update.greasyfork.org/scripts/440164/%E7%AE%80%E4%B9%A6%E5%8E%BBheader.meta.js
// ==/UserScript==

(function () {
    'use strict';
    //*://*/*
    document.getElementsByTagName('header')[0].style.height=0
    document.getElementsByTagName('header')[0].style.opacity=0
  
    //document.getElementsByClassName('')[0].style.opacity=0

})();
