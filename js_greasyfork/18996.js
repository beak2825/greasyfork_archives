// ==UserScript==
// @name         微博嘿嘿
// @namespace    http://tampermonkey.net/
// @version      0.5.2
// @description  Hide 'liked by friends' items in weibo.
// @author       Mikkkee
// @include      http://weibo.com/*
// @include      http://www.weibo.com/*
// @require      http://code.jquery.com/jquery-2.2.3.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/18996/%E5%BE%AE%E5%8D%9A%E5%98%BF%E5%98%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/18996/%E5%BE%AE%E5%8D%9A%E5%98%BF%E5%98%BF.meta.js
// ==/UserScript==

/*--- waitForKeyElements():  A utility function, for Greasemonkey scripts,
    that detects and handles AJAXed content. From https://gist.github.com/BrockA/2625891
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
        delete controlObj [controlKey];
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

function removePraisedElements(jNode){
    // console.log(jNode, jNode.parent().parent().parent().parent());
    // console.log(jNode.parent().parent(), jNode.parent().parent().prop('tagName'));
    // 图片上也有赞同icon，需要区分。
    if (jNode.parent().parent().prop('tagName') === 'H4') {
        jNode.parent().parent().parent().parent().remove();
    }
}

// 'i.ficon_praised' 是XXX等人赞过的图标。
// waitForKeyElements 可以处理ajax请求得到的微博。
waitForKeyElements('i.ficon_praised', removePraisedElements);