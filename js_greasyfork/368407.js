// ==UserScript==
// @name         LocalStorage Clear
// @namespace    
// @version      0.4
// @description  Clear your browser for Local Storage
// @author       zzhicong
// @match        *://m.wayforcloud.com/*

// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/368407/LocalStorage%20Clear.user.js
// @updateURL https://update.greasyfork.org/scripts/368407/LocalStorage%20Clear.meta.js
// ==/UserScript==
function clearAllCookie() {
        var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
        if ( keys ) {
            for(var i = keys.length; i--;)
                document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString();
        }
    }
if(window.localStorage) {
    var PageReload = function reload(){
        window.location.reload();
    };
    var n=parseInt(2*Math.random());
    setInterval (PageReload,1000*60*n);
    clearAllCookie();
    localStorage.clear();
} else {
    alert('local storage does not exist in your browser');
}