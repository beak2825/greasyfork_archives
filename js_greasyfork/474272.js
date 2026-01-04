// ==UserScript==
// @name         Make the code block language and copy button hidden to screen readers
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  To avoid language and copy announced unnecessarily
// @author       greasywei
// @license      MIT
// @match        https://learn.microsoft.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=microsoft.com
// @require      http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/474272/Make%20the%20code%20block%20language%20and%20copy%20button%20hidden%20to%20screen%20readers.user.js
// @updateURL https://update.greasyfork.org/scripts/474272/Make%20the%20code%20block%20language%20and%20copy%20button%20hidden%20to%20screen%20readers.meta.js
// ==/UserScript==

(function () {
  "use strict";
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
  function waitForKeyElements(
    selectorTxt /* Required: The jQuery selector string that
                        specifies the desired element(s).
                    */,
    actionFunction /* Required: The code to run when elements are
                        found. It is passed a jNode to the matched
                        element.
                    */,
    bWaitOnce /* Optional: If false, will continue to scan for
                        new elements even after the first match is
                        found.
                    */,
    iframeSelector /* Optional: If set, identifies the iframe to
                        search.
                    */
  ) {
    var targetNodes, btargetsFound;

    if (typeof iframeSelector == "undefined") targetNodes = $(selectorTxt);
    else targetNodes = $(iframeSelector).contents().find(selectorTxt);

    if (targetNodes && targetNodes.length > 0) {
      btargetsFound = true;
      /*--- Found target node(s).  Go through each and act if they
            are new.
        */
      targetNodes.each(function () {
        var jThis = $(this);
        var alreadyFound = jThis.data("alreadyFound") || false;

        if (!alreadyFound) {
          //--- Call the payload function.
          var cancelFound = actionFunction(jThis);
          if (cancelFound) btargetsFound = false;
          else jThis.data("alreadyFound", true);
        }
      });
    } else {
      btargetsFound = false;
    }

    //--- Get the timer-control variable for this selector.
    var controlObj = waitForKeyElements.controlObj || {};
    var controlKey = selectorTxt.replace(/[^\w]/g, "_");
    var timeControl = controlObj[controlKey];

    //--- Now set or clear the timer as appropriate.
    if (btargetsFound && bWaitOnce && timeControl) {
      //--- The only condition where we need to clear the timer.
      clearInterval(timeControl);
      delete controlObj[controlKey];
    } else {
      //--- Set a timer, if needed.
      if (!timeControl) {
        timeControl = setInterval(function () {
          waitForKeyElements(
            selectorTxt,
            actionFunction,
            bWaitOnce,
            iframeSelector
          );
        }, 300);
        controlObj[controlKey] = timeControl;
      }
    }
    waitForKeyElements.controlObj = controlObj;
  }

  waitForKeyElements(".codeHeader", commentCallbackFunction);

  function commentCallbackFunction(jNode) {
    document
      .querySelectorAll(".codeHeader")
      .forEach((div) => div.setAttribute("aria-hidden", true));
  }
})();
