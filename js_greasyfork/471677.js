// ==UserScript==
// @name         Make bluebird great again
// @namespace    TypeNANA
// @version      0.10
// @description  Twitter's bluebird is better than 𝕏
// @author       You
// @match        *://*.twitter.com/*
// @match        *://twitter.com/*
// @match        *://*.x.com/*
// @match        *://x.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/471677/Make%20bluebird%20great%20again.user.js
// @updateURL https://update.greasyfork.org/scripts/471677/Make%20bluebird%20great%20again.meta.js
// ==/UserScript==

(function() {
    waitForKeyElements(
        'a[aria-label="X"]',
        makeBlueBirdGreatAgain
    );
    waitForKeyElements(
        'div[data-testid="TopNavBar"]',
        makeBlueBirdGreatAgain
    );
    changeFavIcon();

    function changeFavIcon(){
        let v = $('link[rel="shortcut icon"]');
        if (v == null || v.length == 0) return;
        v[0].setAttribute("href", 'https://abs.twimg.com/favicons/twitter.ico');
    }

    function makeBlueBirdGreatAgain(v){
        if (v == null || v.length == 0) return;
        v[0].getElementsByTagName("path")[0].setAttribute("d", 'M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z')
    }

    function waitForKeyElements(
    selectorTxt,
     actionFunction,
     bWaitOnce,
     iframeSelector
    ) {
        var targetNodes, btargetsFound;

        if (typeof iframeSelector == "undefined") {
            targetNodes = $(selectorTxt);
        } else {
            targetNodes = $(iframeSelector).contents().find(selectorTxt);
        }

        if (targetNodes && targetNodes.length > 0) {
            btargetsFound = true;
            targetNodes.each(function () {
                var jThis = $(this);
                var alreadyFound = jThis.data('alreadyFound') || false;

                if (!alreadyFound) {
                    var cancelFound = actionFunction(jThis);
                    if (cancelFound) {
                        btargetsFound = false;
                    } else {
                        jThis.data('alreadyFound', true);
                    }
                }
            });
        } else {
            btargetsFound = false;
        }

        var controlObj = waitForKeyElements.controlObj || {};
        var controlKey = selectorTxt.replace(/[^\w]/g, "_");
        var timeControl = controlObj[controlKey];

        if (btargetsFound && bWaitOnce && timeControl) {
            clearInterval(timeControl);
            delete controlObj[controlKey]
        } else {
            if (!timeControl) {
                timeControl = setInterval(function () {
                    waitForKeyElements(selectorTxt,
                                       actionFunction,
                                       bWaitOnce,
                                       iframeSelector
                                      );
                }, 300);
                controlObj[controlKey] = timeControl;
            }
        }
        waitForKeyElements.controlObj = controlObj;
    }
})();