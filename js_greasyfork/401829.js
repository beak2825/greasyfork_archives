// ==UserScript==
// @name         DNS rebinding detection
// @namespace    http://anend.net
// @version      0.2
// @description  DNS rebinding detection for 479
// @author       Anend Yan
// @match        *
// @grant        none
// @require http://code.jquery.com/jquery-3.4.1.min.js
/* globals $ */
// @downloadURL https://update.greasyfork.org/scripts/401829/DNS%20rebinding%20detection.user.js
// @updateURL https://update.greasyfork.org/scripts/401829/DNS%20rebinding%20detection.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var url = window.top.document.URL;
    var DNS="http://172.20.0.2:18180/host/"
    $.get(DNS+url.slice(url.indexOf("://")+3, url.indexOf(".")), function(data){
        if(data.ttl<=60){
        alert("ttl: " + data.ttl+ "DNS rebinding detected");}
    });

    //alert(userIP);
    // Your code here...
})();