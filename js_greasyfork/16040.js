// ==UserScript==
// @name         JSS - Edit Buttons & No Category On Top
// @namespace    http://your.homepage/
// @version      0.41
// @description  Put edit links next to app names and move the no category category to the top of the page
// @author       Ryan Meyers
// @match        https://serenity.local:8443/mobileDeviceApps.html*
// @grant    GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/16040/JSS%20-%20Edit%20Buttons%20%20No%20Category%20On%20Top.user.js
// @updateURL https://update.greasyfork.org/scripts/16040/JSS%20-%20Edit%20Buttons%20%20No%20Category%20On%20Top.meta.js
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

waitForKeyElements ("#profile-filter", actionFunction);
waitForKeyElements ("#FIELD_ASSIGN_DEVICE_LICENSES", actionFunction);
function actionFunction(){
$.each($('.group-item > td > a'), function(i,v){$(v).parent().append("<a href=\""+$(v).attr("href").replace("o=r","o=u")+"\" style=\"font-size:7pt\">edit</a>");});
$.each($('tr.group-item-no-category-assigned'), function(i,v){$('tbody').prepend($(v));});
$('tbody').prepend($('tr.no-category-assigned'));
if($('#FIELD_CATEGORY').length > 0 && $('#FIELD_CATEGORY').val() == -1)
{
$('#FIELD_MOBILE_DEVICE_TARGETS').val('All');
$('#FIELD_USER_TARGETS').val('All');
$('#FIELD_ASSIGN_DEVICE_LICENSES').prop('checked',true);
}
if($('tr.group-item-no-category-assigned').length > 0) $('#content-inside > h2').append(" - "+$('tr.group-item-no-category-assigned').length+" unassigned");
}