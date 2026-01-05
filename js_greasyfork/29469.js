// ==UserScript==
// @name         iEMB+
// @namespace    http://yeoxingyee.ml/
// @version      2.0b2
// @description  Makes the new iEMB more tolerable
// @author       YXY
// @match        *://iemb.hci.edu.sg/Board/BoardList*
// @match        *://iemb.hci.edu.sg/Board/Detail*
// @match        *://iemb.hci.edu.sg/Board/content*
// @match        *://iemb.hci.edu.sg/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/29469/iEMB%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/29469/iEMB%2B.meta.js
// ==/UserScript==
$(function(){
    console.log("iEMB+: Initialising...");
    var script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.js";
    document.getElementsByTagName("head")[0].appendChild(script);
    var scriptinject = document.createElement("script");
    scriptinject.src = "https://yeoxingyee.github.io/iembplus/iembp.js";
    document.getElementsByTagName("head")[0].appendChild(scriptinject);
        if(window.location.href.indexOf("iemb.hci.edu.sg") > -1){
        var x = $('.messageboard').length;
        $("#allMsg a em").text(x);
        var reader = '<button id="reader" onClick="autoread()"><a style="text-decoration: none; font-weight: normal;" href="#">Read All</a></button>';
        $(".unread_mess_bg").append(reader);
        var iframe = document.createElement("iframe");
        var verbose = document.createElement("div");
        verbose.id = "verbose";
        document.getElementsByTagName("body")[0].appendChild(verbose);
        $("#verbose").css("background","#000");
        $("#verbose").css("opacity", "0.3");
        $("#verbose").css("color", "white");
        $("#verbose").css("position", "fixed");
        $("#verbose").css("top", "0");
        $("#verbose").css("pointer-events", "none");
    }

});
window.onload=function(){
    linkstart();
    if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        var mobilecss=document.createElement("link");
        mobilecss.href = "https://yeoxingyee.github.io/iembplus/iemb_mobile.css";
        mobilecss.type = "text/css";
        mobilecss.rel = "stylesheet";
        mobilecss.id = "mobilecss";
        document.getElementsByTagName("head")[0].appendChild(mobilecss);
    }
};