// ==UserScript==
// @name         干掉灰机wiki广告
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Remove pop-up ads from huijiwiki.
// @author       You
// @match        *://*.huijiwiki.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424366/%E5%B9%B2%E6%8E%89%E7%81%B0%E6%9C%BAwiki%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/424366/%E5%B9%B2%E6%8E%89%E7%81%B0%E6%9C%BAwiki%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //setCookie('fndAds',true,100);
    var ads_status = getCookie('fndAds');
    if (ads_status == true)
    {
        //alert('ads cleaned');
        return;
    }
    else{
        //alert("cleaning...");
        setCookie('fndAds',true,100);
    }
    // Your code here...
})();
function setCookie(c_name, value, expiredays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate()+expiredays);
    document.cookie = c_name + "=" + escape(value) + ((expiredays==null) ?
                                                      "" :
                                                      ";expires="+exdate.toUTCString() + ";path=/");
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}