// ==UserScript==
// @name         NX_DOC
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  调整 https://docs.sw.siemens.com/的页面，使他更适合 1980*1050 分辨率的
// @author       gnix.oag@gmail.com
// @match        https://docs.sw.siemens.com/*
// @match        http://localhost:5000/*
// @icon         https://www.google.com/s2/favicons?domain=tampermonkey.net
// @grant        unsafaWindow
// @ require      http://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js
// @run-at       document-end


// @downloadURL https://update.greasyfork.org/scripts/441256/NX_DOC.user.js
// @updateURL https://update.greasyfork.org/scripts/441256/NX_DOC.meta.js
// ==/UserScript==

(function() {
    'use strict';
$(".body-fixed-top").css({"padding-top":"0px"}); //调整body的边距

    //隐藏头部内容
$("disw-header-v2").css({"display":"none"});
$("#root .disw-sub-header").css({"display":"none"});
$("#root .doc-toolbar").css({"display":"none"});
$("#topic-navigator").css({"display":"none"});


 $(".disw-breadcrumb ol>li:first-child").css({"padding-top":"0px"});

// 把整个页面的字体调大1.5
    var css = 'body { font-size: 1.5em !important; }';

    var style = document.createElement('style');
    style.type = 'text/css';
    style.appendChild(document.createTextNode(css));

    var head = document.head || document.getElementsByTagName('head')[0];
    head.appendChild(style);

//修改内容页面的高度
 var targetDiv = document.querySelector('.doc-sidebar .doc-topics');
    if (targetDiv) {
        targetDiv.style.height = '100vh';
    }
 var targetDiv1 = document.querySelector('#doc-main > div > div.pos-r');
    if (targetDiv1) {
        targetDiv1.style.height = '100vh';
    }

})();