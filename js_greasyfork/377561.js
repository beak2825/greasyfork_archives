// ==UserScript==
// @name         Block AcFun UP
// @version      1.2
// @description  屏蔽不想看见的UP主
// @author       zhpzhp
// @require      http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @match        http://www.acfun.cn/*
// @reference    https://stackoverflow.com/questions/9169032/how-to-use-greasemonkey-to-selectively-remove-content-from-a-website
// @reference    https://stackoverflow.com/questions/47808117/filter-items-based-on-data-attribute-in-jquery
// @namespace    https://greasyfork.org/users/245339
// @github       https://github.com/zhpzhp/Block-AcFun-UP
// @downloadURL https://update.greasyfork.org/scripts/377561/Block%20AcFun%20UP.user.js
// @updateURL https://update.greasyfork.org/scripts/377561/Block%20AcFun%20UP.meta.js
// ==/UserScript==

// https://gist.github.com/raw/2625891/waitForKeyElements.js not suppored by Greasy Fork, copied here
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

var AuthorList=[
    "实锤社i",
    "暴走漫画",
];

waitForKeyElements ("div.article-item.clearfix.weblog-item", deleteArticle);
waitForKeyElements ("figure.fl.block-box.block-video.weblog-item", deleteVideo);

function deleteVideo (jNode) {
    var $ = window.jQuery;
    var allFigures = $("figure.fl.block-box.block-video.weblog-item").find("> a[data-info]");
    var allBananas = $("figure.fl.block-box.block-video.weblog-item").find("> figcaption > em > a");
    var badFigures = allFigures.filter(function (){
            var i;
            for (i = 0; i < AuthorList.length; i++) {
                if ($(this).data('info').userName == AuthorList[i]){
                    return $(this);
                }
            }
    });
    var badBananas = allBananas.filter(function (){
            var i;
            for (i = 0; i < AuthorList.length; i++) {
                if ($(this).attr("title") == AuthorList[i]){
                    return $(this);
                }
            }
    });
    badFigures.parent().remove ();
    badBananas.parent().parent().parent().remove ();
}

function deleteArticle (jNode) {
    var $ = window.jQuery;
    var i;
    for (i = 0; i < AuthorList.length; i++) {
        var badDivs = $("div.article-item.clearfix.weblog-item div:contains('" + AuthorList[i] + "')");
        badDivs.parent().remove ();
    }
}
