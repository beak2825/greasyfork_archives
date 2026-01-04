// ==UserScript==
// @name         raymond.cc View All
// @namespace    https://greasyfork.org/en/users/223360
// @version      1.0.0
// @description  Load raymond.cc multipage blogs in one page
// @author       Zennar
// @match        https://www.raymond.cc/blog/*
// @grant        none
// @icon         https://www.raymond.cc/favicon.ico
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/380391/raymondcc%20View%20All.user.js
// @updateURL https://update.greasyfork.org/scripts/380391/raymondcc%20View%20All.meta.js
// ==/UserScript==



(function() {
    'use strict';
    var url=document.location.href;
    if(url.substr(url.length-1,1)=="/"){
        url=url.substr(0,url.length-1);
    }
    var sp=url.split("/")
    if(sp[sp.length-1].toLowerCase()!=="view-all"){
        url=url+"/view-all"
        document.location.href=url;
    }

})();