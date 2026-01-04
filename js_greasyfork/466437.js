// ==UserScript==
// @name         Education Posts
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Filter out as many religious schools as posisble, while highlighting Multi-D Schools
// @author       Paul O'Shea
// @match        https://www.educationposts.ie/posts/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=educationposts.ie
// @require      https://code.jquery.com/jquery-latest.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/466437/Education%20Posts.user.js
// @updateURL https://update.greasyfork.org/scripts/466437/Education%20Posts.meta.js
// ==/UserScript==

// NOTE: Due to greasy fork only have a pre approved list of
// requires, I have imported the code for waitForKeyElements
// here. Credit: https://gist.github.com/BrockA/2625891
// The actual script code starts below on line 109

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
    selectorTxt, /* Required: The jQuery selector string that
                    specifies the desired element(s).
                 */
    actionFunction, /* Required: The code to run when elements are
                       found. It is passed a jNode to the matched
                       element.
                    */
    bWaitOnce, /* Optional: If false, will continue to scan for
                new elements even after the first match is
                found.
               */
    iframeSelector /* Optional: If set, identifies the iframe to
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
                    waitForKeyElements ( selectorTxt,
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
    waitForKeyElements.controlObj = controlObj;
}


// The actual code which filters schools

const editSchoolRows = () => {
    const schoolRows = Array.from(document.getElementById("tblAdverts").children[1].children);

    schoolRows.forEach(schoolRow => {
        if (
            // Remove all religious named schools
            schoolRow.children[1].children[0].innerHTML.substring(0, 3).toLowerCase() === "st " ||
            schoolRow.children[1].children[0].innerHTML.substring(0, 4).toLowerCase() === "st. " ||
            schoolRow.children[1].children[0].innerHTML.toLowerCase().includes("christ ") ||
            schoolRow.children[1].children[0].innerHTML.toLowerCase().includes("muire") ||
            schoolRow.children[1].children[0].innerHTML.toLowerCase().includes("mhuire") ||
            schoolRow.children[1].children[0].innerHTML.toLowerCase().includes("loreto") ||
            schoolRow.children[1].children[0].innerHTML.toLowerCase().includes("saint ") ||
            schoolRow.children[1].children[0].innerHTML.toLowerCase().includes("saints ") ||
            schoolRow.children[1].children[0].innerHTML.toLowerCase().includes("sancta maria") ||
            schoolRow.children[1].children[0].innerHTML.toLowerCase().includes("peter and paul") ||
            schoolRow.children[1].children[0].innerHTML.toLowerCase().includes("queen of angels") ||
            schoolRow.children[1].children[0].innerHTML.toLowerCase().includes("our lady") ||
            schoolRow.children[1].children[0].innerHTML.toLowerCase().includes("immaculate") ||
            schoolRow.children[1].children[0].innerHTML.toLowerCase().includes("bishop ") ||
            schoolRow.children[1].children[0].innerHTML.toLowerCase().includes("divine ") ||
            schoolRow.children[1].children[0].innerHTML.toLowerCase().includes("grace ") ||
            schoolRow.children[1].children[0].innerHTML.toLowerCase().includes("virgin ") ||
            schoolRow.children[1].children[0].innerHTML.toLowerCase().includes("assumption ") ||
            schoolRow.children[1].children[0].innerHTML.toLowerCase().includes("holy ") ||
            schoolRow.children[1].children[0].innerHTML.toLowerCase().includes("naomh") ||
            schoolRow.children[1].children[0].innerHTML.toLowerCase().includes("naofa") ||
            schoolRow.children[1].children[0].innerHTML.toLowerCase().includes("mhuire") ||
            schoolRow.children[1].children[0].innerHTML.toLowerCase().includes("chriost ") ||
            schoolRow.children[1].children[0].innerHTML.toLowerCase().includes("cbs") ||
            schoolRow.children[1].children[0].innerHTML.toLowerCase().includes("muslim") ||
            schoolRow.children[1].children[0].innerHTML.toLowerCase().includes("sacred heart") ||
            schoolRow.children[1].children[0].innerHTML.toLowerCase().includes("aingeal") ||

            // remove single sex schools
            schoolRow.children[1].children[0].innerHTML.toLowerCase().includes("bns") ||
            schoolRow.children[1].children[0].innerHTML.toLowerCase().includes("gns") ||
            schoolRow.children[1].children[0].innerHTML.toLowerCase().includes("g.n.s") ||
            schoolRow.children[1].children[0].innerHTML.toLowerCase().includes("b.n.s") ||
            schoolRow.children[1].children[0].innerHTML.toLowerCase().includes("girls") ||
            schoolRow.children[1].children[0].innerHTML.toLowerCase().includes("boys") ||
            schoolRow.children[1].children[0].innerHTML.toLowerCase().includes("buachailli") ||
            schoolRow.children[1].children[0].innerHTML.toLowerCase().includes("buachaillí") ||
            schoolRow.children[1].children[0].innerHTML.toLowerCase().includes("cailíní") ||
            // remove gaelscoileanna
            schoolRow.children[1].children[0].innerHTML.toLowerCase().includes("scoil")

        ) {
            schoolRow.style.display = "none"
        } else if (
            // highlight very obvious ET and CNS schools with a nice green colour
            schoolRow.children[1].children[0].innerHTML.toLowerCase().includes("educate together") ||
            schoolRow.children[1].children[0].innerHTML.toLowerCase().includes("community national") ||
            schoolRow.children[1].children[0].innerHTML.toLowerCase().includes("multi denominational") ||
            schoolRow.children[1].children[0].innerHTML.toLowerCase().includes("etns") ||
            schoolRow.children[1].children[0].innerHTML.toLowerCase().includes("cns")
        ) {
            schoolRow.style.backgroundColor = "#0080001f";
        }
    });
}

waitForKeyElements ("#tblAdverts", editSchoolRows);