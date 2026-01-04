// ==UserScript==
// @name         anti-spm
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  anti-track
// @author       李远
// @match        */*
// @grant        none
//@require https://cdn.staticfile.org/jquery/3.5.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/404311/anti-spm.user.js
// @updateURL https://update.greasyfork.org/scripts/404311/anti-spm.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
demon();
   // setTimeout(demon,50)



})();
function demon(){
 funcUrlDel("spm")
   }
function funcUrlDel(name){
    var loca = window.location;
    var baseUrl = loca.origin + loca.pathname + "?";
    var query = loca.search.substr(1);
    if (query.indexOf(name)>-1) {
        var obj = {}
        var arr = query.split("&");
        for (var i = 0; i < arr.length; i++) {
            arr[i] = arr[i].split("=");
            obj[arr[i][0]] = arr[i][1];
        };
        delete obj[name];
        var url = baseUrl + JSON.stringify(obj).replace(/[\"\{\}]/g,"").replace(/\:/g,"=").replace(/\,/g,"&");
        window.location=url
    };
}