// ==UserScript==
// @name         Remove Baidu.pos
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  百度广告
// @author       Xeon
// @match        http*://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373293/Remove%20Baidupos.user.js
// @updateURL https://update.greasyfork.org/scripts/373293/Remove%20Baidupos.meta.js
// ==/UserScript==
  (function (win) {
    'use strict';
    // Your code here...
    //observer object
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
    var observer = new MutationObserver(function(/*mutations*/) {
      // mutations.forEach(function(mutation) {
      //   // console.log(mutation);
      // });
    });
    var config = {childList:true,subtree:true};
    var target = document.querySelectorAll('iframe');
     var isrc = "pos.baidu.com";

     for (var i = 0; i < target.length; i++) {
       observer.observe(target[i], config);
      var iframes = target[i].src;

      if (iframes.indexOf(isrc)>-1) {
      target[i].parentNode.removeChild(target[i]);
      }
    }
  })();
