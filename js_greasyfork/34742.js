// ==UserScript==
// @name         Gogo+
// @namespace    http://yeoxingyee.ml/
// @version      1.0
// @description  Clean up gogoanime!
// @author       YXY
// @match        *://*.gogoanime.*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/34742/Gogo%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/34742/Gogo%2B.meta.js
// ==/UserScript==

(function(){
    'use strict';
    var script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.js";
    document.getElementsByTagName("head")[0].appendChild(script);
})();


    window.onload=function(){
        console.log("Gogo+: Initialising...");
        var ADs = $('*[id^="BB"]');
        console.log("Gogo+: " + ADs.length + " ADs detected");
        $(ADs).css("display", "none");
        $(".banner_center").css("display", "none");
        $(".banner_info").remove();
        $(".ads_upper_video").css("display", "none");
        ADs.remove();
        $(".banner_center").remove();
        $(".ads_upper_video").remove();
        var disads = $('*[src^="disqusads"]');
        console.log("Gogo+: " + disads + "detected");
        disads.remove();
         $('* a').each(function() {
        if ($(this).attr('target') == '_blank'){
            $(this).remove();
        }
         });
        var iframe = document.createElement("iframe");
        console.log("Gogo+: Cleanup complete!");
    };