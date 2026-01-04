// ==UserScript==
// @name         封印解除
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  灵梦封印自动解除
// @author       Kyaru
// @match        https://blog.reimu.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reimu.net
// @require      http://code.jquery.com/jquery-latest.js
// @run-at document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/456730/%E5%B0%81%E5%8D%B0%E8%A7%A3%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/456730/%E5%B0%81%E5%8D%B0%E8%A7%A3%E9%99%A4.meta.js
// ==/UserScript==
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



const observer = new MutationObserver((mutations) => {
  mutations.forEach(({ addedNodes }) => {
    addedNodes.forEach((addedNode) => {
      if (addedNode.nodeType === 1 && addedNode.matches('script') && addedNode.src === 'https://blog.reimu.net/wp-content/driver.js') {
        addedNode.remove();
        observer.disconnect();
      }
    });
  });
});
observer.observe(document.documentElement, { childList: true, subtree: true });


$(document).ready(function() {
    waitForKeyElements (".entry-content", function(){
        observer.observe(document.documentElement, { childList: true, subtree: true });
        $("pre").css("display","block")
//         var txt = $("pre").html()
//         $("pre").after(function(){
//             return "<div style='color:red'>" + txt + "</div>"
//         })
    });
});