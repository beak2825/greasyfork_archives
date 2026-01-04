// ==UserScript==
// @name         gitee快速跳转sikp
// @namespace    http://gitee.com
// @version      1.1
// @description  实现giteee平台的跳转问题
// @author       You
// @include      *://gitee.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422179/gitee%E5%BF%AB%E9%80%9F%E8%B7%B3%E8%BD%ACsikp.user.js
// @updateURL https://update.greasyfork.org/scripts/422179/gitee%E5%BF%AB%E9%80%9F%E8%B7%B3%E8%BD%ACsikp.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
    var divs = window.document.createElement('div')
    divs.style.width = '50px'
    divs.style.height = '50px'
    divs.style.background = 'red'
    divs.style.position = 'fixed'
    divs.style.top = '50%'
    divs.left = 0
    divs.addEventListener("click", function( event ) {
       window.open(window.location.href.replace('github','github1s'))
      }, false);
    var body = window.document.body
    body.appendChild(divs)
    // Your code here...
})();