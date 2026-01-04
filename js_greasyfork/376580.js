// ==UserScript==
// @name         GitHub打印readme
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       xiaoming
// @match        https://github.com/*
// @grant        none
// @require      https://cdn.bootcss.com/jquery/1.6.4/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/PrintArea/2.4.1/jquery.PrintArea.js
// @downloadURL https://update.greasyfork.org/scripts/376580/GitHub%E6%89%93%E5%8D%B0readme.user.js
// @updateURL https://update.greasyfork.org/scripts/376580/GitHub%E6%89%93%E5%8D%B0readme.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var raw=document.getElementById('raw-url');
    var rawparentNode=raw.parentNode;
    var childNode = document.createElement('a');
    childNode.innerHTML='打印下面的页面';
    childNode.className='btn btn-sm BtnGroup-item';
    childNode.onclick=function () {
        //document.body.innerHTML=document.getElementById('readme').innerHTML;
        //document.body.innerHTML=document.getElementById('readme').innerHTML;
        //window.print();
        $("div#readme").printArea();
    }
    rawparentNode.appendChild(childNode);
})();