// ==UserScript==
// @name         Molineux Mix Lite
// @namespace    http://www.molineuxmix.co.uk/mm
// @version      0.2
// @description  Cruft Free Molineux Mix Browsing
// @author       Gil
// @match        *.www.molineuxmix.co.uk/mm/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/22142/Molineux%20Mix%20Lite.user.js
// @updateURL https://update.greasyfork.org/scripts/22142/Molineux%20Mix%20Lite.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var elmDeleted = document.getElementById("funboxMessage");
	elmDeleted.parentNode.removeChild(elmDeleted);
    var elmDeleted2= document.getElementById("logoBlock");
	elmDeleted2.parentNode.removeChild(elmDeleted2);
    var elmDeleted3= document.getElementById("headerProxy");
	elmDeleted3.parentNode.removeChild(elmDeleted3);
    var p = document.getElementsByClassName('arrow');
    for (var i=p.length; --i>=0;) {
    p[i].parentNode.removeChild(p[i]);
    }
})();