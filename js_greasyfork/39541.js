// ==UserScript==
// @name         Expand cengage mindtap Textbook Display Width
// @version      0.2
// @description  Make ebook display utilize full screen width
// @author       magickaiyang
// @namespace    kaiyang
// @license      MIT
// @include     http://ng.cengage.com/static/nbreader/ui/apps/nbreader/nbreader.html*
// @require     https://code.jquery.com/jquery-3.3.1.slim.min.js
// @downloadURL https://update.greasyfork.org/scripts/39541/Expand%20cengage%20mindtap%20Textbook%20Display%20Width.user.js
// @updateURL https://update.greasyfork.org/scripts/39541/Expand%20cengage%20mindtap%20Textbook%20Display%20Width.meta.js
// ==/UserScript==

waitForKeyElements("div.container", actionFunction);

function actionFunction(node) {
    node.css("max-width", 'unset');
}

function waitForKeyElements(
    selectorTxt,
    actionFunction,
    bWaitOnce,
    iframeSelector
) {
    var targetNodes, btargetsFound;

    if (typeof iframeSelector == "undefined")
        targetNodes = $(selectorTxt);
    else
        targetNodes = $(iframeSelector).contents()
            .find(selectorTxt);

    if (targetNodes && targetNodes.length > 0) {
        btargetsFound = true;
        /*--- Found target node(s).  Go through each and act if they
            are new.
        */
        targetNodes.each(function () {
            var jThis = $(this);
            var alreadyFound = jThis.data('alreadyFound') || false;

            if (!alreadyFound) {
                //--- Call the payload function.
                var cancelFound = actionFunction(jThis);
                if (cancelFound)
                    btargetsFound = false;
                else
                    jThis.data('alreadyFound', true);
            }
        });
    }
    else {
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
    }
    else {
        //--- Set a timer, if needed.
        if (!timeControl) {
            timeControl = setInterval(function () {
                waitForKeyElements(selectorTxt,
                    actionFunction,
                    bWaitOnce,
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