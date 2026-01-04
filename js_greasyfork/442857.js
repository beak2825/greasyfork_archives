// ==UserScript==
// @name         OL: helperScript
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  hilft!
// @author       König von Weiden
// @match        https://www.onlineliga.de/*
// @icon         https://onlineliga.s3.eu-central-1.amazonaws.com/userimages/32830-5f7ec70c87047.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/442857/OL%3A%20helperScript.user.js
// @updateURL https://update.greasyfork.org/scripts/442857/OL%3A%20helperScript.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(document).ready(function(){
        const timeInterval = 100;
        let interval = setInterval(waitForKeyElement, timeInterval);

        async function waitForKeyElement(){
            if(($("#cookieConsentSelection").length)==1){
                $("#cookieConsentSelection").remove();
            }
            if(($("#ax-billboard-top").length)==1){
                $("#ax-billboard-top").remove();
            }
            if(($("#ax-billboard-bottom").length)==1){
                $("#ax-billboard-bottom").remove();
            }
            if(($("#ax-skyscraper-left").length)==1){
                $("#ax-skyscraper-left").remove();
            }
            if(($("#ax-skyscraper").length)==1){
                $("#ax-skyscraper").remove();
            }
            if($(".no-scroll").length==1){
                $(".no-scroll").attr("style","overflow-y: visible;");
            }
            if($(".ol-dropdown-item-formation.dropdown-menu.ol-dropdown-menu").length!=0){
                $(".dropdown-menu").attr("style","max-height: 800px;");
            }
        }
    })
})();