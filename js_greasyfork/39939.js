// ==UserScript==
// @name         lalala
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  某网站的游客三次播放限制,需禁用cookie
// @author       You
// @match        http://www.mitaozhi.net/**
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/39939/lalala.user.js
// @updateURL https://update.greasyfork.org/scripts/39939/lalala.meta.js
// ==/UserScript==

(function() {
    'use strict';
    XMLHttpRequest.prototype.realOpen = XMLHttpRequest.prototype.open;


    $(".index-integral-container").remove();
    var myOpen = function(method, url, async, user, password) {
        //do whatever mucking around you want here, e.g.
        //changing the onload callback to your own version

        // "http://www.mitaozhi.net/v/video_v_href/24463?flag=0&fingerprint=sdfz"
        if(url.indexOf("fingerprint")==-1){
            this.realOpen (method, url, async, user, password);
            console.log("yes",url);
            return;
        };
        var url1=url.substring(0,url.indexOf("fingerprint"))+"fingerprint="+uuid();
        var url2=url.substring(url.indexOf("fingerprint"))+"fingerprint="+uuid();
        this.realOpen (method, url1, async, user, password);
        //call original

    };


   var uuid = (function (uuidRegEx, uuidReplacer) {
        return function () {
            return "xxxxxxxxxxxxxxxxxxxxxxxx4xyxxxxx".replace(uuidRegEx, uuidReplacer).toUpperCase();
        };
    })(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c == "x" ? r : (r & 3 | 8);
        return v.toString(16);
    });

    //ensure all XMLHttpRequests use our custom open method
    XMLHttpRequest.prototype.open = myOpen ;
})();