// ==UserScript==
// @name         Youtube fix share url
// @namespace    http://tampermonkey.net/
// @version      6
// @description  Remove tracking parametr "si" from video link from share button
// @author       SergoZar
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/489533/Youtube%20fix%20share%20url.user.js
// @updateURL https://update.greasyfork.org/scripts/489533/Youtube%20fix%20share%20url.meta.js
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
 
    // thanks https://greasyfork.org/uk/users/1273743-satandidnowrong for this code)
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === "attributes" && mutation.attributeName === "aria-checked") {
                fix_url();
            }
        });
    });
 
    observer.observe(document.body, { subtree: true, attributes: true });
})();