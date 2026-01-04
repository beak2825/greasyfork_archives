// ==UserScript==
// @name         PdCg
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  pdcg
// @author       YQ
// @include     *172.20.39.232:9000/AppMuckcarManage/*
// @icon         https://www.google.com/s2/favicons?domain=39.232
// @grant        none
// @license      AGPL License
// @downloadURL https://update.greasyfork.org/scripts/436806/PdCg.user.js
// @updateURL https://update.greasyfork.org/scripts/436806/PdCg.meta.js
// ==/UserScript==
 /*jshint esversion: 6 */
(function() {
    'use strict';
    console.log('我的脚本加载了');
    var $ = $ || window.$; //获得jquery的$标识符
    const helper={};
    helper.isRun=function(){
    var windowurl = window.location.href;

    var node=$(".plateNumber");
    console.log(node.text());
    $(".auditPlateNumber").val(node.text());
    $(".auditRemark").val("照片抓拍不完整");
   var id=$("iframe:first").attr("id")
    console.log(id);
};
setTimeout(function(){
    helper.isRun();
	    }, 500);

    // Your code here...
})();