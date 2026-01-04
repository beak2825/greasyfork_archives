// ==UserScript==
// @name                nodeBB remap shortcuts new editor version
// @license MIT
// @namespace	        https://hoover.gplrank.de/
// @description	        remaps various nodeBB keyboard shortcuts to simple keypresses
// @description         author: hoover
// @description         You'll need to replace "hoover" with your forum username for the "chat" link to work below.
// @include             http*://forum.falcon-bms.com/*
// 
// @version 0.0.2.2022051005082836
// @downloadURL https://update.greasyfork.org/scripts/439812/nodeBB%20remap%20shortcuts%20new%20editor%20version.user.js
// @updateURL https://update.greasyfork.org/scripts/439812/nodeBB%20remap%20shortcuts%20new%20editor%20version.meta.js
// ==/UserScript==

function findReplyLink()
{
    var urls = [];
    for(var i = 0; i<document.links.length; i++) {
        var url=String(document.links[i]);
        if (url.match(/compose/)) {
            console.log("compose url found: ", url);
            return(url);
        }
    }
}
//https://forum.falcon-bms.com/compose?tid=21938&title=New%20editor%20does%20indeed%20break%20my%20greasemonkey%20script
//https://forum.falcon-bms.com/compose?tid=21914&title=engine%20overheat
function findTopicLink()
{
    var anchors = document.getElementsByTagName('a');
    var href="/unread";
    for (var i = 0  ; i < anchors.length ; i++) {
       href = anchors[i].getAttribute('href');
       if (href) {
          if(href.match(/topic/) && !href.match(/temporary-fixes/)) {
              return(href);
             break ;

             }
          }
       }
}


var key_map = {
    "N" : "/unread",
    "R": findReplyLink(),
    "P": "/popular",
    "H": "/",
    "C": "/user/hoover/chats",
    "S": "/search",
    "M": "/notifications",
    "G": findTopicLink()
    }

function OnKeyUp(e)
{

    //console.log(e.target);

    if (!(String.fromCharCode(e.keyCode) in key_map)) {
        console.log("keycode not found in keymap, exiting.");
        return true;
    }

    // check if editor is active element
    if ($(e.target).hasClass("ql-editor")) {
        console.log("in editor, exiting.");
        return true;
    }

    // check if the active element is a textfield or a text area
    if( e.target.type == "text" || e.target.type == "textarea") {
        console.log("target type text or textarea, exiting.");
        return true;
    }

    // check if any modifiers were sent along with the keypress
    if (e.altKey || e.ctrlKey || e.keyCode > 90) {
        console.log("Invalid or ctrl / alt keycode, exiting");
        return true;
    }

    // all good, let's jump to the URL defined in the keymap
    console.log("shortcut detected, relocating");
    window.location.replace(key_map[String.fromCharCode(e.keyCode)]);

}



window.addEventListener("keyup",function(event) { OnKeyUp(event); },false)
