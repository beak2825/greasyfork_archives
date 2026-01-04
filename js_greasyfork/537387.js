// ==UserScript==
// @name        Koillection
// @license     MIT
// @namespace   Userscripts
// @match       http://127.0.0.1:5959/*
// @grant       none
// @version     1.3
// @author      azuravian
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @run-at      document-end
// @description Fix html for text fields.
// @downloadURL https://update.greasyfork.org/scripts/537387/Koillection.user.js
// @updateURL https://update.greasyfork.org/scripts/537387/Koillection.meta.js
// ==/UserScript==

const datablock = document.querySelector("div.data:has(div.datum-row)");

waitForKeyElements(datablock, start);


function start() {

  datablock.querySelectorAll('.datum-row').forEach(row => {
    if (!shouldProcessRow(row)) return;

    const spans = row.querySelectorAll('span[data-value]');
    if (spans.length === 0) return;

    const span = spans[spans.length - 1];
    const dataValue = span.getAttribute('data-value');

    if (!dataValue || dataValue.trim() === '') return;

    let parsedValue;
    try {
      parsedValue = JSON.parse(dataValue);
    } catch (e) {
      // Not JSON? Treat as raw HTML string
      parsedValue = dataValue;
    }

    // Create a fragment from a string of HTML
    const createFragmentFromHTML = html => {
      const temp = document.createElement('div');
      temp.innerHTML = html;
      const frag = document.createDocumentFragment();
      while (temp.firstChild) {
        frag.appendChild(temp.firstChild);
      }
      return frag;
    };

    // Remove the final text node or malformed HTML that matches escaped content
    const removeEscapedHTMLNode = () => {
      const nodes = Array.from(row.childNodes).reverse();
      for (const node of nodes) {
        if (
          (node.nodeType === Node.TEXT_NODE && /&lt;|&gt;/.test(node.nodeValue)) ||
          (node.nodeType === Node.ELEMENT_NODE && /&lt;|&gt;/.test(node.innerHTML)) ||
          (node.nodeType === Node.TEXT_NODE && /&lt;|&gt;/.test(node.innerHTML))
        ) {
          node.remove();
          return;
        }
        if (
          (node.nodeType === Node.TEXT_NODE && node == nodes[0])
        ) {
          node.remove()
        }
        if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'UL') {
          node.remove();
          return;
        }
      }
    };

    // === CASE 1: parsedValue is a string ===
    if (typeof parsedValue === 'string') {
      parsedValue = parsedValue.replace("\\u0026", "&amp")
      removeEscapedHTMLNode();
      const frag = createFragmentFromHTML(parsedValue);
      row.appendChild(frag);
      return;
    }

    // === CASE 2: parsedValue is an array ===
    if (Array.isArray(parsedValue)) {
      removeEscapedHTMLNode();
      if (parsedValue.length === 1) {
        // Insert single paragraph or plain text
        const frag = createFragmentFromHTML(parsedValue[0].replace("\\u0026", "&amp"));
        row.appendChild(frag);
      } else if (parsedValue.length > 1) {
        // Insert a new <ul><li>...</li></ul>
        const ul = document.createElement('ul');
        ul.classList.add('datum-list');
        parsedValue.forEach(html => {
          const li = document.createElement('li');
          li.innerHTML = stripQuotes(html.replace("\\u0026", "&amp"));
          ul.appendChild(li);
        });
        row.appendChild(ul);
      }
    }
  });

}

function stripQuotes(str) {
  return str.replace(/^"(.*)"$/, '$1');
}

function nodeContainsEscapedHTML(node) {
  if (!node) return false;

  if (node.nodeType === Node.TEXT_NODE) {
    return /&lt;.*&gt;|&quot;|&amp;/.test(node.nodeValue);
  }

  if (node.nodeType === Node.ELEMENT_NODE) {
    if (/&lt;.*&gt;|&quot;|&amp;/.test(node.innerHTML)) return true;

    // Recurse into children
    return [...node.childNodes].some(child => nodeContainsEscapedHTML(child));
  }

  return false;
}

function shouldProcessRow(row) {
  return nodeContainsEscapedHTML(row);
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
