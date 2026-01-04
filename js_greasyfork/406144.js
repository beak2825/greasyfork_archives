// ==UserScript==
// @name         斗鱼屏蔽SB
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @include	     *douyu.com*
// @grant        GM.addStyle
// @require      https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.slim.min.js
// @downloadURL https://update.greasyfork.org/scripts/406144/%E6%96%97%E9%B1%BC%E5%B1%8F%E8%94%BDSB.user.js
// @updateURL https://update.greasyfork.org/scripts/406144/%E6%96%97%E9%B1%BC%E5%B1%8F%E8%94%BDSB.meta.js
// ==/UserScript==


(function() {
    'use strict';

    //在这里增加要屏蔽的直播间号码，右键直播间卡片复制网址，斗鱼直播间链接格式为为 https://www.douyu.com/123456 或者 https://www.douyu.com/xxxxxx，只要把域名后面的数字填进去就行
    var sb = ["6567483","246195","64609","2150596","234544","8948464","8948464","59889","943298","339610"];
    
    sb.forEach((value)=>{
        waitForKeyElements (
            "[href='/" +value+"']",
            appendImageNumber
        );
    })

    function appendImageNumber (jNode) {
        jNode.parents (".layout-Cover-item").remove();
    };


  
    // Your code here...、
    //优化网页全屏UI
    GM.addStyle( ` body.is-fullScreenPage .layout-Player-video {
                       bottom: 44px;height: auto;
                   }
                   body.is-fullScreenPage .layout-Player-toolbar {
                       height: 44px;
                   }
              `);

})();

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

