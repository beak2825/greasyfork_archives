// ==UserScript==
// @name         MPCG Link Getter
// @namespace    http://cs8898.tk/
// @version      0.1
// @description  try to take over the world!
// @author       cs8898
// @match        http://www.mpc-g.com/*
// @exclude      http://www.mpc-g.com/full-list/
// @exclude      http://www.mpc-g.com/requests/
// @exclude      http://www.mpc-g.com/contact/
// @exclude      http://www.mpc-g.com/games/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/20308/MPCG%20Link%20Getter.user.js
// @updateURL https://update.greasyfork.org/scripts/20308/MPCG%20Link%20Getter.meta.js
// ==/UserScript==

(function() {
    'use strict';
     $(document).ready(function(){
         var content = $(".titleContent");
         $(content).children("form").hide();
         var links = $(".titleContent form input[name='downloadLink']");
         var name = $(".titleContent form input[name='downloadTitle']");
         $(content).append("<div class='userScriptAnkorList'></div>");
         $(links).each( (i) => {
             $("div.userScriptAnkorList").append("<a href='"+$(links[i]).val()+"'>"+$(name[i]).val()+"</a><br />");
         });
         $(content).append("<div class='userScriptLinkList'></div>");
         $("div.userScriptLinkList").css("font-size",".6em").css("font-family","monospace").css("font-weight","normal");
         $(links).each( (i) => {
             $("div.userScriptLinkList").append($(links[i]).val()+"<br />");
         });
     });
})();