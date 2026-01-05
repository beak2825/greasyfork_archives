// ==UserScript==
// @name           HKG Show User ID
// @namespace      https://greasyfork.org/users/1006-peach
// @version        1.0.3
// @description    Show User ID in HKGolden
// @homepageURL    https://greasyfork.org/scripts/1279-hkg-show-user-id
// @include        http://forum*.hkgolden.com/view.aspx*
// @include        http://search.hkgolden.com/view.aspx*
// @include        http://archive.hkgolden.com/view.aspx*
// @include        http://profile.hkgolden.com/view.aspx*
// @include        https://forum*.hkgolden.com/view.aspx*
// @include        https://search.hkgolden.com/view.aspx*
// @include        https://archive.hkgolden.com/view.aspx*
// @include        https://profile.hkgolden.com/view.aspx*
// @require        http://code.jquery.com/jquery-1.10.2.min.js
// @copyright      2014, Peach
// @downloadURL https://update.greasyfork.org/scripts/1279/HKG%20Show%20User%20ID.user.js
// @updateURL https://update.greasyfork.org/scripts/1279/HKG%20Show%20User%20ID.meta.js
// ==/UserScript==

var $j = jQuery.noConflict();

function showUserID(jNode) {
    var userID = jNode.attr('userid');
    var show = jNode.find(".repliers_left>div:eq(0)>br:eq(0)");
    $j("<div style=\"font-family:Courier\">"+userID+"</div>").insertAfter(show);
}

waitForKeyElements(".repliers tr[userid]", showUserID, false);


function waitForKeyElements(selectorTxt,actionFunction,bWaitOnce,iframeSelector) {
    var targetNodes, btargetsFound;

    if (typeof iframeSelector == "undefined")
        targetNodes     = $j(selectorTxt);
    else
        targetNodes     = $j(iframeSelector).contents ()
                                           .find (selectorTxt);

    if (targetNodes  &&  targetNodes.length > 0) {
        btargetsFound   = true;

        targetNodes.each ( function () {
            var jThis        = $j(this);
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

    var controlObj      = waitForKeyElements.controlObj  ||  {};
    var controlKey      = selectorTxt.replace (/[^\w]/g, "_");
    var timeControl     = controlObj [controlKey];

    if (btargetsFound  &&  bWaitOnce  &&  timeControl) {
        clearInterval (timeControl);
        delete controlObj [controlKey];
    }
    else {
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