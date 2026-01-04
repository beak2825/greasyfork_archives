// ==UserScript==
// @name        Add a goddamn button to suggest a motherfucking title
// @version     2
// @description suggest a fucking title
// @namespace   fuckyou
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @include     https://notabug.io/*
// @include     https://nab.cx/*
// @grant       GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/390101/Add%20a%20goddamn%20button%20to%20suggest%20a%20motherfucking%20title.user.js
// @updateURL https://update.greasyfork.org/scripts/390101/Add%20a%20goddamn%20button%20to%20suggest%20a%20motherfucking%20title.meta.js
// ==/UserScript==

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

waitForKeyElements("#newlink, #url-field input[name='url']", doShit);

function doShit() {
  let b = document.querySelector("#suggestMFTitle")
  if(!location.href.match("/submit$") || b) return;
  
  b = document.createElement("button");
  b.type = "button";
  b.id = "suggestMFTitle";
  b.append(document.createTextNode('suggest a fucking title'));
  document.querySelector('#newlink > .spacer').append(b);

  b.onclick = function() {
    GM.xmlHttpRequest({
      method: "GET",
      url: "https://textance.herokuapp.com/title/" + encodeURI(document.querySelector("#url-field input[name='url']").value),

      onload: function(response) {
        let el = document.querySelector('#title-field textarea');
        el.value = response.responseText;
        var evt = document.createEvent("Events");
        evt.initEvent("change", true, true);
        el.dispatchEvent(evt);        
      },

      onerror: function(response) {
        alert(response.responseText);
      }
    });
  }
}

doShit();
