// ==UserScript==
// @name            Flickr - AUTO More Comments v.7
// @description	    PHOTO / ALBUM Auto Load ALL comments

// @version         v.7.2
// @include         http*://www.flickr.com/photos/*
// @include         https://www.flickr.com/photos/*/sets/*
// @include         https://www.flickr.com/photos/*/albums/*

// @require         http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js

// @autor           decembre / Brock Adams

// @grant           GM_addStyle

// @run-at          document-start

// @namespace       https://greasyfork.org/users/8
// @downloadURL https://update.greasyfork.org/scripts/31416/Flickr%20-%20AUTO%20More%20Comments%20v7.user.js
// @updateURL https://update.greasyfork.org/scripts/31416/Flickr%20-%20AUTO%20More%20Comments%20v7.meta.js
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


/*--- waitForKeyElements():  

FIND IT HERE :
https://gist.github.com/raw/2625891/waitForKeyElements.js

A utility function, for Greasemonkey scripts,
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
        btargetsFound   = true;
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



//--- Note that contains() is CASE-SENSITIVE.
//waitForKeyElements ("a.simplebutton:contains('follow')", clickOnFollowButton);

// PB - - PHOTO pages - VIEW USER INFOS - CLIK OVERLAY
/*
waitForKeyElements (".fluid-droparound-overlay.transparent ", clickOnOverlay);

function clickOnOverlay (jNode) {
    var clickEvent  = document.createEvent ('MouseEvents');
    clickEvent.initEvent ('click', true, true);
    jNode[0].dispatchEvent (clickEvent);
}
*/

// NOT NEED it NOW
// read: https://www.flickr.com/help/forum/en-us/72157720163194555/#reply72157720164428390
// PHOTO pages - VIEW USER INFOS (new2)
// PB solved by CSS : PHOTO STREAM - https://www.flickr.com/photos/16062610@N00/
// .fluid.html-photo-page-scrappy-view .avatar.person.medium
// .view-all-contexts-of-type>a
/*
waitForKeyElements (".height-controller.enable-zoom  .avatar.person.medium", clickOnUserButton);
function clickOnUserButton (jNode) {
    var clickEvent  = document.createEvent ('MouseEvents');
    clickEvent.initEvent ('click', true, true);
    jNode[0].dispatchEvent (clickEvent);
}
*/

// TEST - OK ALBUM pages - PB NO SETS pages (identicals) - VIEW USER INFOS
// Example FOR: https://www.flickr.com/photos/137620031@N05/33277376702/in/album-72157676721768741/
// WHEN YOU click ON ALBUM "Models" you go to SET pages
// if you reload it you go to album pages (identicals pages but "album" in url ????

// .fluid.html-album-page-view .avatar.person.medium 
// NOT WORK on SET : 
// https://www.flickr.com/photos/137620031@N05/sets/72157677962971581

// .fluid.html-album-page-view .avatar.person.medium 
// WORK on ALBUM (identical but album in url ) : 
// https://www.flickr.com/photos/137620031@N05/albums/72157677962971581

// ALBUM 
/*
waitForKeyElements (".fluid.html-album-page-view .avatar.person.medium", clickOnAlbumUserButton);
function clickOnAlbumUserButton (jNode) {
    var clickEvent  = document.createEvent ('MouseEvents');
    clickEvent.initEvent ('click', true, true);
    jNode[0].dispatchEvent (clickEvent);
}
// SET
waitForKeyElements (".fluid.html-set-page-view .avatar.person.medium", clickOnSetUserButton);
function clickOnSetUserButton (jNode) {
    var clickEvent  = document.createEvent ('MouseEvents');
    clickEvent.initEvent ('click', true, true);
    jNode[0].dispatchEvent (clickEvent);
}
*/

// VIEW ALL POOLS
/*
waitForKeyElements (".view-all-contexts-of-type>a", clickOnPollButton);
function clickOnPollButton (jNode) {
    var clickEvent  = document.createEvent ('MouseEvents');
    clickEvent.initEvent ('click', true, true);
    jNode[0].dispatchEvent (clickEvent);
}
*/

// TEST MAIL ALERT - A VOIR
/*
waitForKeyElements (".c-notifications-menu  span", clickMAILalert);
function clickMAILalert (jNode) {
    var clickEvent  = document.createEvent ('MouseEvents');
    clickEvent.initEvent ('click', true, true);
    jNode[0].dispatchEvent (clickEvent);
}
*/
// MORE COMMENTS
/*waitForKeyElements('.sub-photo-content-container .photo-comments.with-emoji-picker a.load-more-button', actionFunction, false);*/
(function(){
function actionMoreCommnents(node){
console.log ("Found More Comments ButtoN. Clicking it!");
//node.click();
var clickEvent = document.createEvent ('MouseEvents');
clickEvent.initEvent ('click', true, true);
node[0].dispatchEvent (clickEvent);
return true;
}
console.log ("Waiting for More Comments ButtoN");
waitForKeyElements(".sub-photo-content-container .photo-comments.with-emoji-picker a.load-more-button:not(.hidden)", actionMoreCommnents);
})();