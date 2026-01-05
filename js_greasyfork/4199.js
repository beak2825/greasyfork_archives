// ==UserScript==
// @name        Twitter CTRL-T Fix
// @namespace   Lorne
// @include     https://twitter.com/*
// @version     2
// @grant       metadata
// @description Prevent Twitter from hijacking keyboard shortcuts like CTRL-T for new tab.
// @downloadURL https://update.greasyfork.org/scripts/4199/Twitter%20CTRL-T%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/4199/Twitter%20CTRL-T%20Fix.meta.js
// ==/UserScript==
// Keycode for 'r' and 's' and 't'. Add more to disable other ctrl+X interceptions
// Version 2: added F and N (find and new window)
ctrlkeycodes = [70, 78, 82, 83, 84];  
keycodes = [70, 78, 82, 83, 84];  


(window.opera ? document.body : document).addEventListener('keydown', function(e) {
reclaim_all = false; // Turn this to true to kill ALL keyboard shortcuts
allow = true;

    if (keycodes.indexOf(e.keyCode) != -1)
    {
        allow = false;
    }
    
    if(ctrlkeycodes.indexOf(e.keyCode) != -1 && e.ctrlKey)
    {
        allow = false;
    }
    
    if (reclaim_all  || (! allow))
    {
        e.cancelBubble = true;
        e.stopImmediatePropagation();
    
    }
    return false;
}, !window.opera);