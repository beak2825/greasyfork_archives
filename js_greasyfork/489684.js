// ==UserScript==
// @name         YouTube Remove Share URL Tracking
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Remove tracking parameter "si" in video link from share button
// @author       SergoZar, satandidnowrong
// @match        https://www.youtube.com/watch*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @license      Creative Commons Attribution-NonCommercial 4.0 International License
// @downloadURL https://update.greasyfork.org/scripts/489684/YouTube%20Remove%20Share%20URL%20Tracking.user.js
// @updateURL https://update.greasyfork.org/scripts/489684/YouTube%20Remove%20Share%20URL%20Tracking.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function fix_url(){
        var share_url = document.getElementById("share-url");
        if(share_url){
            var url = new URL(share_url.value);
            url.searchParams.delete("si");
            share_url.value = url.toString();
        }
    }

    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === "attributes" && mutation.attributeName === "aria-checked") {
                fix_url();
            }
        });
    });

    observer.observe(document.body, { subtree: true, attributes: true });

})();
