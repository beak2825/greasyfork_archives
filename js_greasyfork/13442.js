// ==UserScript==
// @name       IndieGala trades steam links
// @namespace  http://akhanubis.com/
// @version    0.2.1
// @description Adds links to the steam store page for IG trade pages 
// @match      http://www.indiegala.com/trades/*
// @match      https://www.indiegala.com/trades/*
// @match      http://www.indiegala.com/profile?*
// @match      https://www.indiegala.com/profile?*
// @copyright  2015+, akhanubis
// @downloadURL https://update.greasyfork.org/scripts/13442/IndieGala%20trades%20steam%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/13442/IndieGala%20trades%20steam%20links.meta.js
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









var add_link = function(e) {
    var img = e.find('img[src*="/steam/apps/"]:first');
    var link = 'http://store.steampowered.com/app/' + img.attr('src').split('steam/apps/')[1].split('/')[0];
    img.wrap('<a href="' + link + '" target="blank">');
};

waitForKeyElements ('.offer-img-cont', function(e){
    add_link(e);
}, false);

jQuery('.game-to-trade, .trade-img-cont').each(function() {
    add_link($(this));
});

waitForKeyElements ('#other-games-list .row, #owned-games-list .row', function(e){
    var link = e.find('input[rel="gameUrl"]').val();
    e.find('.game-title').wrap('<a href="' + link + '" target="blank">')
}, false);