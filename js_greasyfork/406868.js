// ==UserScript==
// @name         WUT JWC Assistance
// @namespace    http://blog.achacker.com/
// @version      0.1
// @description  武汉理工大学教务处辅助系统
// @author       Kingfish404
// @match        http://218.197.102.183/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/406868/WUT%20JWC%20Assistance.user.js
// @updateURL https://update.greasyfork.org/scripts/406868/WUT%20JWC%20Assistance.meta.js
// ==/UserScript==

(function() {

    // 默认遮挡隐藏
    $(" #MyDiv").append('<button id="hideTips" style="width:20%;height:10%;margin:5%;" >隐藏此提示</button>');
    $("#hideTips").click(function(){
        $("#MyDiv").hide();
        $("#fade").hide();
    });

})();