// ==UserScript==
// @name         比特大熊广告移除
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       lampon
// @match        http://www.btdx8.com/*
// @grant        none
// @require    http://code.jquery.com/jquery-1.11.0.min.js  
// @downloadURL https://update.greasyfork.org/scripts/28363/%E6%AF%94%E7%89%B9%E5%A4%A7%E7%86%8A%E5%B9%BF%E5%91%8A%E7%A7%BB%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/28363/%E6%AF%94%E7%89%B9%E5%A4%A7%E7%86%8A%E5%B9%BF%E5%91%8A%E7%A7%BB%E9%99%A4.meta.js
// ==/UserScript==

(function() {
    setCookie('AD_btdx','"idx:1"',2);
    setCookie('AD_720','"idx:2"',365);
})();
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires+";path=/";
}