// ==UserScript==
// @name         抢抢抢
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  很简陋，不过大概能抢到转职丹
// @author       Quasar
// @match       https://wuxia.qq.com/cp/a20201128wbtd/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418287/%E6%8A%A2%E6%8A%A2%E6%8A%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/418287/%E6%8A%A2%E6%8A%A2%E6%8A%A2.meta.js
// ==/UserScript==
(function() {
    'use strict';
       for (var i=0; i<1;){
    var list=document.getElementsByTagName("a") ;
    var d = new Date();
	var x = d.getHours();
	var z = d.getSeconds();
	var y = d.getMinutes();
    if (x==11&&y==59&&z==59){
	setTimeout(function(){list[12].click()},995);
       i=1 }
        }
})();