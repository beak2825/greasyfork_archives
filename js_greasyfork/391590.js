// ==UserScript==
// @name         500px.com
// @namespace    http://zszen.github.io/
// @version      1.1
// @description  download picture
// @author       Zszen John
// @match        https://web.500px.com/photo/*
// @match        https://500px.com/photo/*
// @require https://cdn.staticfile.org/jquery/3.3.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391590/500pxcom.user.js
// @updateURL https://update.greasyfork.org/scripts/391590/500pxcom.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var sid = setInterval(initMe, 500);
    function initMe() {
        if($("button#dw123").length>0){
            clearInterval(sid);
            return;
        }
        $("div#copyrightTooltipContainer").after("<button id='dw123'>DOWNLOAD</button>");
        //console.log(bt);
        $("button#dw123").on('click',function(){
            var img = $("div#copyrightTooltipContainer").find("img")[0].src;
            window.open(img,"_blank");
        })
    }
    // Your code here...
})();