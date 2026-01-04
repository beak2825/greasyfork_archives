// ==UserScript==
// @name         Breitbart Comment Fix
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  BB Comment Fix
// @author       You
// @match        https://www.breitbart.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=breitbart.com
// @grant        none
// @require http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/452887/Breitbart%20Comment%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/452887/Breitbart%20Comment%20Fix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $(document).ready(function(){
       start();
    });


    function start(){
        let containerW = $("#ContainerW");
        let container = document.querySelectorAll(".d-c-button-container");
        let linkLoc = $("a.d-comments-button").attr("href");

        let width = $("#MainW").width();
        let height = 500;

        if(container !== null) {
            $("a.d-comments-button").remove();

            let iframe = document.createElement("iframe");
            iframe.src = linkLoc;
            iframe.width = width + "px";
            iframe.height = height + "px";

            $("#comments").append(iframe);

            let containerTop = containerW.offset().top;

            let iframeTop = $(iframe).offset().top;
            let posDiff = iframeTop - containerTop;

            let containerWHeight = containerW.height();
            let diff = containerWHeight - posDiff;

            iframe.height = diff + "px";
        }
    };

    
})();