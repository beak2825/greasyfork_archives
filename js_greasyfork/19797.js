// ==UserScript==
// @icon       https://services.gametomato.net/sto/favicon.ico
// @name       Youtube to MP3 using Peggo
// @namespace  https://gametomato.net
// @version    0.1.beta.03
// @description  Adds a Peggo Download button next to the subscribe button, thanks to Peggo for their download service (http://peggo.co/).
// @match         http://www.youtube.com/*
// @match         https://www.youtube.com/*
// @author          HACKSCOMICON
// @grant           none
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/19797/Youtube%20to%20MP3%20using%20Peggo.user.js
// @updateURL https://update.greasyfork.org/scripts/19797/Youtube%20to%20MP3%20using%20Peggo.meta.js
// ==/UserScript==

function getQueryVariable(variable)
{
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
}

myObject = getQueryVariable("v");

var linkPath ='http://peggo.tv/dvr/'+myObject;
$(  '<a id="peggoscript" class="yt-uix-button yt-uix-button-default" target="_blank" href="'+linkPath+'" style="margin-left: 8px; height: 26px; padding: 0 22px;"><img src="https://s32.postimg.org/u8z3vnhad/pggbrntransparent_h100.png" style="vertical-align:middle;color: white;" height="14px" width="43px"> <span class="yt-uix-button-content" style="line-height: 25px; font-size: 12px;">Download</span></a>').insertAfter( "#watch7-subscription-container" );