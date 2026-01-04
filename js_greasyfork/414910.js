// ==UserScript==
// @name         Unfortunate-Maps RES Preview Image Proxy
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Fixes u-m preview images not loading in RES expandos.
// @author       Electro
// @match        https://*.reddit.com/r/TagPro/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/414910/Unfortunate-Maps%20RES%20Preview%20Image%20Proxy.user.js
// @updateURL https://update.greasyfork.org/scripts/414910/Unfortunate-Maps%20RES%20Preview%20Image%20Proxy.meta.js
// ==/UserScript==


(function() {
    'use strict';
    $(function(){
        console.log("loaded");
        setTimeout(() => {
            $(".expando-button").click(updateUMImages);
        }, 1000);
    });

    setInterval(() => {
        $(".res-expando-link .res-image-media").each(function(){
            let imageSRC = $(this).attr("src");
            if(!imageSRC.includes("unfortunate")) return;
            if(imageSRC.includes("parretlabs.xyz:8006")) return;

            $(this).attr("src", `https://parretlabs.xyz:8006/proxy?link=${imageSRC}&isBlob=1&type=image/png`);
        });
    }, 1000);

    function updateUMImages() {
        setTimeout(() => {
            let imageSRC = $(this).parent().parent().find(".res-image-media").attr("src");
            if(!imageSRC.includes("unfortunate")) return;
            if(imageSRC.includes("parretlabs.xyz:8006")) return;
            $(this).parent().parent().find(".res-image-media").attr("src", `https://parretlabs.xyz:8006/proxy?link=${imageSRC}&isBlob=1&type=image/png`);
        }, 200);
    }
    // Your code here...
})();