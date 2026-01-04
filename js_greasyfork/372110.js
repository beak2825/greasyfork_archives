// ==UserScript==
// @name         zippyshare
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *://*.zippyshare.com/v/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/372110/zippyshare.user.js
// @updateURL https://update.greasyfork.org/scripts/372110/zippyshare.meta.js
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
    document.getElementById('dlbutton').click();
    setTimeout( function(){
      CloseWebPage();
    }, 1500 );
})();