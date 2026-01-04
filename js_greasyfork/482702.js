// ==UserScript==
// @name          Wait for key elements
// @namespace     http://tampermonkey.net/
// @version       0.1
// @description   A utility function, for Greasemonkey scripts, that detects and handles dynamic content.
// @author        https://github.com/cgriebel
// @grant         none
// @include       *
// ==/UserScript==

/*--- waitForKeyElements():  
    Usage example:

        waitForKeyElements ("div.comments", commentCallbackFunction);

        //--- Page-specific function to do what we want when the node is found.
        function commentCallbackFunction (jNode) {
            jNode.text ("This comment changed by waitForKeyElements().");
        }
*/
function waitForKeyElements(
  selectorTxt,    /* Required: The selector string that specifies the desired element(s). */
  actionFunction, /* Required: The code to run when elements are found. It is passed a jNode to the matched element. */
  waitOnce,      /* Optional: If false, will continue to scan for new elements even after the first match is found. */
  iframeSelector  /* Optional: If set, identifies the iframe to search. */
) {
  const dataAttr = 'data-wait-for-elements-found';
  var targetNodes, targetsFound;

  if (typeof iframeSelector == "undefined") {
    var nodes = document.querySelectorAll(selectorTxt);
    targetNodes = nodes ? [...nodes] : null;
  }
  else {
    // TODO: CG - test iframes, I currently have no use for this
    // targetNodes = $(iframeSelector).contents()
    //   .find(selectorTxt);
  }

  if (targetNodes && targetNodes.length > 0) {
    targetsFound = true;
    /*--- Found target node(s).  Go through each and act if they
        are new.
    */
    targetNodes.forEach((node) => {
      if (!node.getAttribute(dataAttr)) {
        //--- Call the payload function.
        var cancelFound = actionFunction(node);
        if (cancelFound) {
          targetsFound = false;
        }
        else {
          node.setAttribute(dataAttr, true);
        }
      }
    })
  }
  else {
    targetsFound = false;
  }

  //--- Get the timer-control variable for this selector.
  var controlObj = waitForKeyElements.controlObj || {};
  var controlKey = selectorTxt.replace(/[^\w]/g, "_");
  var timeControl = controlObj[controlKey];

  //--- Now set or clear the timer as appropriate.
  if (targetsFound && waitOnce && timeControl) {
    //--- The only condition where we need to clear the timer.
    clearInterval(timeControl);
    delete controlObj[controlKey]
  }
  else {
    //--- Set a timer, if needed.
    if (!timeControl) {
      timeControl = setInterval(function () {
        waitForKeyElements(selectorTxt,
          actionFunction,
          waitOnce,
          iframeSelector
        );
      },
        300
      );
      controlObj[controlKey] = timeControl;
    }
  }
  waitForKeyElements.controlObj = controlObj;
}