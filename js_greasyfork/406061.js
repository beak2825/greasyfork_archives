// ==UserScript==
// @name           Chaturbate - Enter
// @description     Enter Chaturbate
// @version           5.1
// @include        https://m.chaturbate.com/
// @include        https://chaturbate.com/
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @require        https://code.jquery.com/jquery-3.1.0.js
// @grant          GM_xmlhttpRequest
// @run-at         document-start
// @icon               https://www.google.com/s2/favicons?domain=chaturbate.com
// @namespace https://greasyfork.org/users/651255
// @downloadURL https://update.greasyfork.org/scripts/406061/Chaturbate%20-%20Enter.user.js
// @updateURL https://update.greasyfork.org/scripts/406061/Chaturbate%20-%20Enter.meta.js
// ==/UserScript==
 
 
 
$(function(){
 
    console.log('=============||||| RUNNING CHATURBATE LOGIN |||||==============');
 
        var url = window.location.href;
 
        if (url == "https://chaturbate.com/") {
            window.location.replace("https://chaturbate.com/male-cams/");
        }
 
});