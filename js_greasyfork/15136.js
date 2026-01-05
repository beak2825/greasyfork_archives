// ==UserScript==
// @name        CH Reload Frame Button
// @author      clickhappier
// @namespace   clickhappier
// @description Adds a reload button on pages loaded in an iframe/frame. For more convenient access than the right-click menu, or for browser versions which don't have that menu command. Also shows the frame's URL in the button's mouseover text.
// @version     1.0c
// @include     *
// @exclude     http://platform.twitter.com/*
// @exclude     https://platform.twitter.com/*
// @exclude     http://www.facebook.com/*
// @exclude     https://www.facebook.com/*
// @exclude     http://www.youtube.com/embed/*
// @exclude     https://www.youtube.com/embed/*
// @exclude     http://player.vimeo.com/*
// @exclude     https://player.vimeo.com/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @grant       GM_log
// @downloadURL https://update.greasyfork.org/scripts/15136/CH%20Reload%20Frame%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/15136/CH%20Reload%20Frame%20Button.meta.js
// ==/UserScript==


// if page is loaded in an iframe/frame
if ( window.location != window.parent.location ) 
{
    // add a reload button, if page doesn't already have one from mmmturkeybacon's script for Google-hosted MTurk HITs
    if ( $('input[type="button"][value="Reload"]').length < 1 )
    {
        // adapted from https://greasyfork.org/en/scripts/10449-mmmturkeybacon-google-iframe-reload-button/
        var button_holder = document.createElement("DIV");
        button_holder.style.cssText = "position: fixed; top: 0px; right: 0px; z-index: 20;";
        button_holder.innerHTML = '<input type="button" onclick="window.location.reload(true)" value="&#8635;" id="CHReloadFrame" style="font-size:150%;" title="CH Reload Frame: ' + window.location + '" />';
        document.body.insertBefore(button_holder, document.body.firstChild);
    }
}