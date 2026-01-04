// ==UserScript==
// @name         Apple Music branding
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://musi.sh/
// @require  https://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @grant    GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/386750/Apple%20Music%20branding.user.js
// @updateURL https://update.greasyfork.org/scripts/386750/Apple%20Music%20branding.meta.js
// ==/UserScript==

(function() {

    'use strict';
    
    /*--- waitForKeyElements():  A utility function, for Greasemonkey scripts,
    that detects and handles AJAXed content.

    Usage example:

        waitForKeyElements (
            "div.comments"
            , commentCallbackFunction
        );

        //--- Page-specific function to do what we want when the node is found.
        function commentCallbackFunction (jNode) {
            jNode.text ("This comment changed by waitForKeyElements().");
        }

    IMPORTANT: This function requires your script to have loaded jQuery.
*/
function waitForKeyElements (
    selectorTxt,    /* Required: The jQuery selector string that
                        specifies the desired element(s).
                    */
    actionFunction, /* Required: The code to run when elements are
                        found. It is passed a jNode to the matched
                        element.
                    */
    bWaitOnce,      /* Optional: If false, will continue to scan for
                        new elements even after the first match is
                        found.
                    */
    iframeSelector  /* Optional: If set, identifies the iframe to
                        search.
                    */
) {
    var targetNodes, btargetsFound;

    if (typeof iframeSelector == "undefined")
        targetNodes     = $(selectorTxt);
    else
        targetNodes     = $(iframeSelector).contents ()
                                           .find (selectorTxt);

    if (targetNodes  &&  targetNodes.length > 0) {
        btargetsFound   = true;
        /*--- Found target node(s).  Go through each and act if they
            are new.
        */
        targetNodes.each ( function () {
            var jThis        = $(this);
            var alreadyFound = jThis.data ('alreadyFound')  ||  false;

            if (!alreadyFound) {
                //--- Call the payload function.
                var cancelFound     = actionFunction (jThis);
                if (cancelFound)
                    btargetsFound   = false;
                else
                    jThis.data ('alreadyFound', true);
            }
        } );
    }
    else {
        btargetsFound   = false;
    }

    //--- Get the timer-control variable for this selector.
    var controlObj      = waitForKeyElements.controlObj  ||  {};
    var controlKey      = selectorTxt.replace (/[^\w]/g, "_");
    var timeControl     = controlObj [controlKey];

    //--- Now set or clear the timer as appropriate.
    if (btargetsFound  &&  bWaitOnce  &&  timeControl) {
        //--- The only condition where we need to clear the timer.
        clearInterval (timeControl);
        delete controlObj [controlKey]
    }
    else {
        //--- Set a timer, if needed.
        if ( ! timeControl) {
            timeControl = setInterval ( function () {
                    waitForKeyElements (    selectorTxt,
                                            actionFunction,
                                            bWaitOnce,
                                            iframeSelector
                                        );
                },
                300
            );
            controlObj [controlKey] = timeControl;
        }
    }
    waitForKeyElements.controlObj   = controlObj;
}
    
    
    
    
    waitForKeyElements ("._4f59", printNodeText);

    function printNodeText (jNode) {
        $(jNode.hide());
   jNode.insertBefore = "<img src='https://cdn.worldvectorlogo.com/logos/apple-music.svg' width='100px'></img>";
    }
    waitForKeyElements (".b9ac", printNodeText1);
    function printNodeText1 (jNode) {
        $(jNode.hide());
    }
        waitForKeyElements (".dcfd", printNodeText2);
    function printNodeText2 (jNode) {
        $(jNode).append("<a href='/'><img src='https://cdn.worldvectorlogo.com/logos/apple-music.svg' width='100px'></img></a>");
    }
       var m=document.getElementsByTagName('link');

for(var c=0;c<m.length;c++) {
if(m[c].rel=='apple-touch-icon') {
   m[c].rel='';
  }
if(m[c].rel=='shortcut icon') {
   m[c].rel='';
  }
if(m[c].rel=='icon') {
   m[c].rel='';
  }
 }

var head = document.getElementsByTagName('head')[0];
var icon = document.createElement('link');

icon.setAttribute('type', 'image/png');
icon.setAttribute('rel', 'shortcut icon');

icon.setAttribute('href', 'https://www.iphonefaq.org/files/styles/large/public/apple-music-icon.png?itok=6ezEKp1E');

head.appendChild(icon);
document.title = "Music";
    window.onbeforeunload = null;
})();