// ==UserScript==
// @name        Spiceworks upload file with ctrl+v
// @namespace   Violentmonkey Scripts
// @match       https://akhost02.wam.co.nz/tickets/*
// @grant       GM_addStyle
// @grant       GM_xmlhttpRequest
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @version     1.0.1
// @author      -
// @download    https://greasyfork.org/scripts/431733-spiceworks-upload-file-with-ctrl-v/code/Spiceworks%20upload%20file%20with%20ctrl+v.user.js
// @description 12-8-2021 08:46:16
// @require https://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/431733/Spiceworks%20upload%20file%20with%20ctrl%2Bv.user.js
// @updateURL https://update.greasyfork.org/scripts/431733/Spiceworks%20upload%20file%20with%20ctrl%2Bv.meta.js
// ==/UserScript==

// could store this in the browser but would need to monitor for updates...
var ticketsJSON;

function waitForKeyElements (
    selectorTxt,    // Required: The jQuery selector string that
                    //    specifies the desired element(s).
                    //
    actionFunction, // Required: The code to run when elements are
                      //  found. It is passed a jNode to the matched
                     //   element.
                    //
    bWaitOnce,      // Optional: If false, will continue to scan for
                    //    new elements even after the first match is
                      //  found.
                    //
    iframeSelector  // Optional: If set, identifies the iframe to
                    //    search.
                    //
) {
    var targetNodes, btargetsFound;
 
    if (typeof iframeSelector == "undefined")
        targetNodes     = $(selectorTxt);
    else
        targetNodes     = $(iframeSelector).contents ()
                                           .find (selectorTxt);
 
    if (targetNodes  &&  targetNodes.length > 0) {
        btargetsFound   = true;
        //--- Found target node(s).  Go through each and act if they
         //   are new.
        //
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
      
waitForKeyElements (
  "#comment_file_attachment",
  function aa(fileInput) 
  {
    console.log("FILEINPUT FOUND");
    const form = document.getElementsByTagName("form")[6];
    fileInput = fileInput[0];
    //const fileInput = document.getElementById("comment_file_attachment");

    fileInput.addEventListener('change', () => {
      form.submit();
    });
    console.log(fileInput);

    window.addEventListener('paste', e => {
      fileInput.files = e.clipboardData.files;
    });
    console.log(fileInput);
  }
)