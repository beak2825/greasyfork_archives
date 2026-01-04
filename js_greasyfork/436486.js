// ==UserScript==
// @name			mycnucc work链接
// @version			0.2
// @description		对cnu.cc的作品，添加一个反向链接到我自己的主机上
// @match			http://www.cnu.cc/works/*
// @icon			http://imgoss.cnu.cc/assets/images/favicon.ico
// @grant			none

// @author			kingwant
// @license			MIT
// @namespace		https://greasyfork.org/zh-CN/users/439785
// @downloadURL https://update.greasyfork.org/scripts/436486/mycnucc%20work%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/436486/mycnucc%20work%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $('.work-title').map(function(){
        var lcs=document.location+"";
        var urlsp=lcs.split("/");
        //window.alert(urlsp[urlsp.length-1]);
        var a = "http://mypics.tangjunyue.com:19840/cnucc/_/works/"+urlsp[urlsp.length-1];
        $(this).wrap("<a href='"+ a +"' ></a>");
    });
    // Your code here...
})();