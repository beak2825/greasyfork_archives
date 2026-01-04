// ==UserScript==
// @name         Lemmy Subscription Helper
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  In the list of communities, darken communities that you're already subscribed to
// @author       MikeFez
// @match        https://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lemmy.world
// @grant        none
// @license      MIT
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/469163/Lemmy%20Subscription%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/469163/Lemmy%20Subscription%20Helper.meta.js
// ==/UserScript==

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

(function() {
    'use strict';

    var isLemmy;
    try {
        isLemmy = document.head.querySelector("[name~=Description][content]").content === "Lemmy";
    } catch (_er) {
        isLemmy = false;
    }
    function isCommunityPage() {
        return window.location.pathname.includes("/communities");
    }

    function GM_addStyle(css) {
        const style = document.getElementById("GM_addStyleBy8626") || (function() {
            const style = document.createElement('style');
            style.type = 'text/css';
            style.id = "GM_addStyleBy8626";
            document.head.appendChild(style);
            return style;
        })();
        const sheet = style.sheet;
        sheet.insertRule(css, (sheet.rules || sheet.cssRules || []).length);
    }

    function markSubscribedCommunities() {
        console.log("****RERUN")
        const communityRows = document.querySelectorAll('table#community_table > tbody > tr');
        communityRows.forEach(function(communityRow) {
            if (typeof communityRow.dataset['subscriptionChecked'] === 'string') {
                return;
            }
            if (communityRow.lastChild.innerText !== "Subscribe") {
                communityRow.setAttribute('data-is-subscribed-to', true);
            }
            communityRow.setAttribute('data-subscription-checked', true);
        });
    }

    function waitForTableLoad() {
        waitForKeyElements ("table#community_table > tbody > tr", markSubscribedCommunities);
    }

    if (isLemmy && isCommunityPage()) {
        GM_addStyle('[data-is-subscribed-to="true"] { background-color: rgba(0,0,0,0.5); opacity: 0.3; }');
        var pageURLCheckTimer = setInterval (
            function () {
                if (this.lastPathStr !== location.pathname
                    || this.lastQueryStr !== location.search
                    || this.lastPathStr === null
                    || this.lastQueryStr === null
                ) {
                    this.lastPathStr = location.pathname;
                    this.lastQueryStr = location.search;
                    waitForTableLoad ();
                }
            }
            , 222
        );
    }
})();

