// ==UserScript==
// @name         东软慕课刷脚本
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       yefeng
// @match        *://mooc.neumooc.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/415591/%E4%B8%9C%E8%BD%AF%E6%85%95%E8%AF%BE%E5%88%B7%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/415591/%E4%B8%9C%E8%BD%AF%E6%85%95%E8%AF%BE%E5%88%B7%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
     var api=document.getElementsByClassName("fp-engine hlsjs-engine");
    function afind(){
          //  alert("生效");
			api[0].play();
    }
    function bbb(){api[0].play();};
    setTimeout(afind,3000);
    window.onblur = afind;

    setInterval(bbb,1000);

})();