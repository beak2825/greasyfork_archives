// ==UserScript==
// @name     Axiom UB
// @description Change Axiom UB
// @include  http://hackforums.net/showthread.php?tid=*
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @grant    GM_addStyle
// @version 0.0.1.20151029211909
// @namespace https://greasyfork.org/users/11193
// @downloadURL https://update.greasyfork.org/scripts/13456/Axiom%20UB.user.js
// @updateURL https://update.greasyfork.org/scripts/13456/Axiom%20UB.meta.js
// ==/UserScript==

function waitForKeyElements (selectorTxt,actionFunction,bWaitOnce,iframeSelector) {
    var targetNodes, btargetsFound;
    if (typeof iframeSelector == "undefined")
        targetNodes = $(selectorTxt);
    else
        targetNodes = $(iframeSelector).contents().find (selectorTxt);

    if (targetNodes  &&  targetNodes.length > 0) {
        btargetsFound   = true;
        targetNodes.each ( function () {
            var jThis = $(this);
            var alreadyFound = jThis.data ('alreadyFound')  ||  false;

            if (!alreadyFound) {
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

    var controlObj = waitForKeyElements.controlObj  ||  {};
    var controlKey = selectorTxt.replace (/[^\w]/g, "_");
    var timeControl = controlObj [controlKey];

    if (btargetsFound  &&  bWaitOnce  &&  timeControl) {
        clearInterval (timeControl);
        delete controlObj [controlKey]
    }
    else {
        if ( ! timeControl) {
            timeControl = setInterval ( function () {
                    waitForKeyElements (selectorTxt, actionFunction, bWaitOnce, iframeSelector);
                },
                300
            );
            controlObj [controlKey] = timeControl;
        }
    }
    waitForKeyElements.controlObj   = controlObj;
}


waitForKeyElements("img[src*='axiom']", actionFunction);

function actionFunction () {
	if($("img[src*='axiom']").length >= 1) {
		$("img[src*='axiom']").each(function() {
			$(this).attr("src", "http://i.imgur.com/E4itTNk.jpg");
		});
	}
}