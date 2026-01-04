// ==UserScript==
// @name         Xavbt
// @namespace    http://tampermonkey.net/
// @version      2.0.2
// @description  try to take over the world!
// @author       You
// @match        *://xavbt.com/*
// @match        *://b.xavbt.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370525/Xavbt.user.js
// @updateURL https://update.greasyfork.org/scripts/370525/Xavbt.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function CloseWebPage(){
        if (navigator.userAgent.indexOf("MSIE") > 0) {
            if (navigator.userAgent.indexOf("MSIE 6.0") > 0) {
                window.opener = null;
                window.close();
            } else {
                window.open('', '_top');
                window.top.close();
            }
        }
        else if (navigator.userAgent.indexOf("Firefox") > 0) {
            window.location.href = 'about:blank ';
        } else {
            window.opener = null;
            window.open('', '_self', '');
            window.close();
        }
    }
    if(typeof openpage === 'function'){
       openpage = function(){
         console.log('花儿笑了')
       };
    }
    document.getElementsByTagName('form')[0].submit();
    setTimeout( function(){
      CloseWebPage();
    }, 3000 );
})();