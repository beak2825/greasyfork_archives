// ==UserScript==
// @name           Flickr - AUTO ShowAllGroups (Photo Page)  v.3.0
// @version        3.1
// @description	   Auto Expand all groups on photo page (author of the Library: Brock Adams , fork decembre)
// @icon           https://external-content.duckduckgo.com/ip3/blog.flickr.net.ico

// @match          https://www.flickr.com/photos/*
// @exclude        http*://www.flickr.com/photos/*/sets/*

// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @author         decembre / Brock Adams

// @grant          GM_addStyle

// @namespace      https://greasyfork.org/users/8

// @downloadURL https://update.greasyfork.org/scripts/29600/Flickr%20-%20AUTO%20ShowAllGroups%20%28Photo%20Page%29%20%20v30.user.js
// @updateURL https://update.greasyfork.org/scripts/29600/Flickr%20-%20AUTO%20ShowAllGroups%20%28Photo%20Page%29%20%20v30.meta.js
// ==/UserScript==

// FROM a script of Brock Adams (Thanks to him!)
// in stackoverflow :
// http://stackoverflow.com/questions/12252701/how-do-i-click-on-this-button-with-greasemonkey?lq=1
// with :
// https://gist.github.com/raw/2625891/waitForKeyElements.js

/*- The @grant directive is needed to work around a major design change
    introduced in GM 1.0.
    It restores the sandbox.
*/


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

(function(){
function actionMorePools(node){
console.log ("Found More Pools Button. Clicking it!");
//node.click();
var clickEvent = document.createEvent ('MouseEvents');
clickEvent.initEvent ('click', true, true);
node[0].dispatchEvent (clickEvent);
return true;
}
console.log ("Waiting for More Pools Button");
waitForKeyElements(".sub-photo-contexts-view .sub-photo-context.sub-photo-context-groups .view-all-contexts-of-type a", actionMorePools);
})();

