// ==UserScript==
// @name                nodeBB remap shortcuts
// @namespace	        https://hoover.gplrank.de/
// @description	        remaps various nodeBB keyboard shortcuts to simple keypresses
// @description         author: hoover
// @description         You'll need to replace "hoover" with your forum username for the "chat" link to work below.
// @include             http*://forum.falcon-bms.com/*
// 
// @version 0.0.2.20211018140000
// @downloadURL https://update.greasyfork.org/scripts/433433/nodeBB%20remap%20shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/433433/nodeBB%20remap%20shortcuts.meta.js
// ==/UserScript==

function findTopicLink()
{
    var anchors = document.getElementsByTagName('a');
    var href="/unread";
    for (var i = 0  ; i < anchors.length ; i++) {
       href = anchors[i].getAttribute('href');
       if (href) {
          if(href.match(/topic/)) {
              return(href);
             break ;

             }
          }
       }
}

var key_map = {
    "N" : "/unread",
    "R": "/recent",
    "P": "/popular",
    "H": "/",
    "C": "/user/hoover/chats",
    "S": "/search",
    "M": "/notifications",
    "G": findTopicLink()
    }

// stolen shamelessly from userscript.org's facebook key navigation
// Thanks to Droll Troll

function OnKeyUp(e)
{
  

    if (String.fromCharCode(e.keyCode) in key_map && 	
	(typeof e.target.type == "undefined" || (e.target.type != "text" && e.target.type != "textarea")) && 
	!e.altKey && !e.ctrlKey && e.keyCode <= 90)
    {
	window.location.replace(key_map[String.fromCharCode(e.keyCode)])
    }
}


window.addEventListener("keyup",function(event) { OnKeyUp(event); },false)

