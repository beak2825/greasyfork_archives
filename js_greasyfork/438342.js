// ==UserScript==
// @name         PdCgnew
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try
// @author       YQ
// @include     *10.242.181.254:30080/CGZF_Web/SiteAdmin/Home/*
// @icon         https://www.google.com/s2/favicons?domain=39.232
// @grant        none
// @license      AGPL License
// @downloadURL https://update.greasyfork.org/scripts/438342/PdCgnew.user.js
// @updateURL https://update.greasyfork.org/scripts/438342/PdCgnew.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('我的脚本加载了');
    var $ = $ || window.$; //获得jquery的$标识符
    const helper={};
    helper.isRun=function(){
    var windowurl = window.location.href;

   location.reload();
   $(".btn_loadingbar:eq(15)").trigger('click');
};
setTimeout(function(){
    helper.isRun();
	    }, 5000);

    // Your code here...
})();