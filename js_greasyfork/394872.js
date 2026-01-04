// ==UserScript==
// @name         屏蔽胖妞
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       大西瓜一块五一斤
// @match        https://bbs.csdn.net*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/394872/%E5%B1%8F%E8%94%BD%E8%83%96%E5%A6%9E.user.js
// @updateURL https://update.greasyfork.org/scripts/394872/%E5%B1%8F%E8%94%BD%E8%83%96%E5%A6%9E.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    var fatGirls=document.getElementsByClassName("topic_r");
    console.log(fatGirls.length);
    for (var j=0;j<fatGirls.length;j++){
        if(fatGirls[j].getAttribute("data-username")=='xuzzzhen123'){
            fatGirls[j].parentElement.style.display="none";
        }
    }

})();