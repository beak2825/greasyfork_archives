// ==UserScript==
// @name        fragrantica.com fixes
// @namespace   Violentmonkey Scripts
// @match       https://www.fragrantica.com/*
// @grant       none
// @version     1.0
// @author      Azuravian
// @license     MIT
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @description 1/11/2025, 6:34:17 PM
// @downloadURL https://update.greasyfork.org/scripts/532483/fragranticacom%20fixes.user.js
// @updateURL https://update.greasyfork.org/scripts/532483/fragranticacom%20fixes.meta.js
// ==/UserScript==


waitForKeyElements(
  "#showDiagram",
  start);

function start() {
  const infonotes = document.getElementsByClassName('info-note');
  const topdiv = document.getElementById('toptop')
  for (const p of infonotes) {
    if (p.innerText.includes('Perfume rating')) {
      topdiv.appendChild(p);
    }
  }

  pyramidevent();
}

function pyramidevent() {
  document.getElementById('showDiagram').addEventListener('change', function () {
    if (this.checked) {
      // Call your function when checkbox is checked
      setTimeout(pyramid, 500);
    }
  });
}

function pyramid() {
  const imageDict = {};

  document.querySelectorAll('div').forEach(grandparent => {
      const children = Array.from(grandparent.children);

      if (children.length === 2) {
          const [imgParent, textDiv] = children;
          const img = imgParent.querySelector('img');

          if (img) {
              const src = img.getAttribute('src');
              const filename = src.split('/').pop();
              const text = textDiv.textContent.trim();
              imageDict[filename] = text;
          }
      }
  });

  var notesbox = document.getElementsByClassName('notes-box')[0].querySelector('div');

  if (notesbox) {
    var nbImgs = notesbox.querySelectorAll('div > div > div > img');
    nbImgs.forEach(nbimg => {
      var nbfn = nbimg.getAttribute('src').split('/').pop();
      var nbtext = document.createElement('div');
      nbtext.style.fontSize = '12px';
      nbtext.innerText = imageDict[nbfn];
      nbimg.parentElement.appendChild(nbtext);
    });
  }
}

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
        targetNodes     = jQuery(selectorTxt);
    else
        targetNodes     = jQuery(iframeSelector).contents ()
                                           .find (selectorTxt);

    if (targetNodes  &&  targetNodes.length > 0) {
        btargetsFound   = true;
        /*--- Found target node(s).  Go through each and act if they
            are new.
        */
        targetNodes.each ( function () {
            var jThis        = jQuery(this);
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