// ==UserScript==
// @name         Ekon Autoplay
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  Autoplays Ekon
// @author       Aitor Rosell Torralba
// @match        https://campus.ekon.es/mod/scorm/player.php
// @match        https://campus.ekon.es/mod/scorm/loadSCO.php
// @icon         https://www.google.com/s2/favicons?domain=ekon.es

// @grant unsafeWindow
// @grant GM_addStyle
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_xmlhttpRequest
// @grant GM_registerMenuCommand
// @grant GM_deleteValue
// @grant GM_listValues
// @grant GM_getResourceText
// @grant GM_getResourceURL
// @grant GM_log
// @grant GM_openInTab
// @grant GM_setClipboard
// @grant GM_info
// @grant GM_getMetadata
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/434265/Ekon%20Autoplay.user.js
// @updateURL https://update.greasyfork.org/scripts/434265/Ekon%20Autoplay.meta.js
// ==/UserScript==
function waitForKeyElements (
    selectorTxt,    /* Required: The querySelector string that
                        specifies the desired element(s).
                    */
    actionFunction, /* Required: The code to run when elements are
                        found. It is passed the matched element.
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

    //--- Additionally avoid what we've found
    var selectorClean = selectorTxt.replace(/(,)|$/g, ":not([wfke_found])$1");

    if (typeof iframeSelector == "undefined")
        targetNodes     = document.querySelectorAll(selectorClean);
    else {
        targetNodes = [];
        var iframe = document.querySelectorAll(iframeSelector);
        for (var i = 0, il = iframe.length; i < il; i++) {
            var nodes = iframe[i].querySelectorAll(selectorClean);
            if (nodes) targetNodes.concat(Array.from(nodes));
        }
    }

    if (targetNodes  &&  targetNodes.length > 0) {
        btargetsFound   = true;
        //--- Found target node(s).  Go through each and act if they are new.
        for (var t = 0, tl = targetNodes.length; t < tl; t++) {

            if (!targetNodes[t].getAttribute("wfke_found")) {
                //--- Call the payload function.
                var cancelFound = false;
                try {
                    cancelFound     = actionFunction (targetNodes[t]);
                }
                //--- Log errors to console rather than stopping altogether
                catch (error) {
                    var name = actionFunction.name;
                    if (name)
                        name = 'in function "' + name + '":\n';
                    console.log ("waitForKeyElements: actionFunction error\n"
                        + name + error);
                }
                if (cancelFound)
                    btargetsFound   = false;
                else
                    targetNodes[t].setAttribute("wfke_found", true);
            }
        }
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
(function() {

})();
function main(where) {
    'use strict';
    function listenKey(key, method, objectModel=document){
        return objectModel.addEventListener('keydown', e => {
            if (e.key == key) {
                e.preventDefault();
                method(e);
            }
        });
    }
    /*function fullScreen(postion,isFullScreen){
        postion.querySelector("iframe").style.cssText = isFullScreen ? "" : "position: fixed; top: 0px; left: 0px; width: 100vw; z-index: 2147483647; background-color: black; height: 100vh;";
    }*/
    listenKey("f",e => {
        if(!document.fullscreen) {
            document.querySelector("iframe#scorm_object").requestFullscreen();
        }else{
            document.exitFullscreen();
        }
    },document)
    //document.addEventListener("keydown", e => { 	if(e.key == "F") e.preventDefault();fullscreen(where, isFullScreen);isFullScreen = !isFullScreen });
    setInterval(()=>{
        var value = where.querySelector('input[aria-label="Seekbar"]');
        if (value && value.value == '1'){
            where.querySelector(".slide-control-button-next").click();
        }
        if (document.activeElement == document.querySelector("iframe#scorm_object")) {
            document.activeElement.blur();
        }
    },1000)
}

main(document); // run it on the top level document (as normal)

waitForKeyElements("iframe, frame", function(elem) {
  elem.addEventListener("load", function () {
    elem.removeAttribute("wfke_found");
  });
  main(elem.contentDocument);
});