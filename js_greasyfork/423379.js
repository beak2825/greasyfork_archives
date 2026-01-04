// ==UserScript==
// @name         witch background
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  meppy's jstris background script
// @author       meppydc
// @match        https://*.jstris.jezevec10.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423379/witch%20background.user.js
// @updateURL https://update.greasyfork.org/scripts/423379/witch%20background.meta.js
// ==/UserScript==

(function() {
    'use strict';

 window.addEventListener('load', function(){
        //Jstris Custom Background Image
        if (!window.location.href.includes("replay")) {
            document.head.getElementsByTagName("style")[0].innerHTML="";
            document.body.style.backgroundImage="url('https://i.imgur.com/DE1hvNT.png')";
            document.body.style.backgroundSize="100%";
            //document.body.style.backgroundPosition="100px 0px";
            document.body.style.backgroundRepeat="no-repeat";
            document.body.style.backgroundColor="black";
            document.getElementById("app").style.backgroundColor="rgba(0, 0, 0, 0)";
            document.getElementById("app").style.height="800px";
         }

 });
})();