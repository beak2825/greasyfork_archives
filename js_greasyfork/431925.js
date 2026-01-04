// ==UserScript==
// @name         No GoogleHK
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Make Google.com.HK redirect to Google.com.
// @author       Redirect
// @match        https://www.google.com.hk/
// @icon         https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png
// @connect      www.google.com.hk
// @include      *://www.google.com.hk/*
// @grant        GM_getValue
// @grant        GM.getValue
// @grant        GM_setValue
// @grant        GM.setValue
// @grant        GM_addStyle
// @grant        GM_getResourceURL
// @grant        GM_listValues
// @grant        GM_getResourceUrl
// @grant        GM.getResourceUrl
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @grant        GM_registerMenuCommand
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/431925/No%20GoogleHK.user.js
// @updateURL https://update.greasyfork.org/scripts/431925/No%20GoogleHK.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var test = window.location.href;
    if (test == 'https://www.google.com.hk/'|| test == 'http://www.google.com.hk/'|| test == 'https://www.google.com.hk'|| test == 'http://www.google.com.hk'|| test == 'https:\\\\www.google.com.hk\\'|| test == 'http:\\\\www.google.com.hk\\'|| test == 'https:\\\\www.google.com.hk'|| test == 'http:\\\\www.google.com.hk'){
        window.location.href=('https://www.google.com/ncr');
    }
    else{
        if (test.charAt(4)=='s'){
            test=test.substring(26);
            window.location.href=('https://www.google.com/'+ test);
        }
        else{
            test=test.substring(25);
            window.location.href=('https://www.google.com/'+ test);
        }
    }
})();