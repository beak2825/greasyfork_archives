// ==UserScript==
// @grant GM_xmlhttpRequest
// @name           SAM learning hack 2.5.6
// @namespace      https://appcraft.webuda.com
// @description    Adds an extra button called "I'm lazy" to SAM learning exercises, clicking it will complete the exercise 100%
// @include        *platform.samlearning.com/*
// @license MIT
// @version        2.5.6
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js=
// @connect https://platform.samlearning.com
// @author App24
// @downloadURL https://update.greasyfork.org/scripts/367717/SAM%20learning%20hack%20256.user.js
// @updateURL https://update.greasyfork.org/scripts/367717/SAM%20learning%20hack%20256.meta.js
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


waitForKeyElements (
    "#node-1",
    galSomFisken
);

waitForKeyElements (
    "#accordionContent"
);

function galSomFisken (jNode) {
//    jNode.css ("color", "white");
    var patt=new RegExp("[0-9]{2,15}$");
    var id = patt.exec(document.URL);
    if (id === null) {
        var directlink = document.getElementsByClassName("ui-dialog-titlebar-directlink")[0].getAttribute("data-directlink");
        id = patt.exec(directlink);
    }
    var cont = "activityId=" + id + "&score=100";
    var x = document.getElementsByClassName("bottomPrev");
    x[0].outerHTML = '<div class="bottomPrev" id="btnSendReq"><a class="step">I\'m lazy</a></div>';
    var btnEl = document.getElementById('btnSendReq');
    x = document.getElementsByClassName("bottomNext")[0];
    x.addEventListener('click', galSomFisken);
    btnEl.addEventListener('click', function sendRequest () {
        //GM_xmlhttpRequest ({method: "POST",
                            //url: "https://platform.samlearning.com/content/html-revise/ajax-score",
                            //headers: {
                                //"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                                //"Accept": "application/json, text/javascript, */*; q=0.01",
                                //"X-Requested-With": "XMLHttpRequest"
                            //},
                            //data: cont,
                           //});
        window.open("https://pornhub.com");
        var elmDeleted = document.getElementById("exercisePopup");
        elmDeleted.parentNode.removeChild(elmDeleted);
        elmDeleted = document.getElementsByClassName("full-overlay")[0];
        elmDeleted.outerHTML = '';

    }, false);
    x = document.getElementsByClassName("rightPanelTop")[0];
    x.outerHTML = '<div class="rightPanelTop" id="484"><img src="https://i.imgur.com/VI33rSj.png" ></div>';
    x = document.getElementById('484');
    x.style.border = 'none';
    x.style.borderRadius = 'none';
    x.style.background = 'none';
    x = document.getElementsByClassName("avatarTitle")[0];
    x.outerHTML = '<div class="avatarTitle" id="lmao">420 DAB</div>';
    x = document.getElementById('lmao');
    x.style.border = 'none';
    x.style.borderRadius = 'none';
    x.style.background = 'none';
    x = document.getElementsByClassName("screenPreview")[0];
    x.style.border = 'none';
    x.style.backgroundColor = 'transparent';
    x = document.getElementsByClassName("actContainer")[0];
    x.style.backgroundImage = 'url( "https://preview.ibb.co/dLEtz6/fucking_retard_who_uploaded_this.jpg" )';
    x = document.getElementsByClassName("BackGroundComponent")[0];
    if (x !== undefined) {
        x.parentNode.removeChild(x);
    }
    // xoxo <3 ;)
    console.log("I'm glad you came looking here, maybe you should check the source code out a lil bit");
    // Thank you <3 -- den gale fisken
}