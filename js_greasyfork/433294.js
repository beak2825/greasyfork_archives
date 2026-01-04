// ==UserScript==
// @name         KMF unlock
// @namespace    http://tampermonkey.net/
// @version      0.15
// @description  Remove region lock
// @include     *
// @author       mo
// @match        https://toefl.kmf.com/*
// @run-at       document-idle
// @grant        GM_log
// @downloadURL https://update.greasyfork.org/scripts/433294/KMF%20unlock.user.js
// @updateURL https://update.greasyfork.org/scripts/433294/KMF%20unlock.meta.js
// ==/UserScript==

(function() {
    /* TOEFL section */
    /* Remove blocking box */
    document.querySelectorAll('.shield-box').forEach(function(s){s.remove();});
    document.querySelectorAll('.login-cont').forEach(function(s){s.remove();});
    document.querySelectorAll('.blur').forEach(function(b){b.classList.remove('blur');});

    
    var observer = new MutationObserver(callback);
    observer.observe(document, {childList: true, attributes: true, characterData: true, subtree: true});
    function callback(changes, observer) {
        document.querySelectorAll('.login-cont').forEach(function(s){s.remove();});
        document.querySelectorAll('.blur').forEach(function(b){b.classList.remove('blur');});
    }    
    // Callback function to execute when mutations are observed

    // for (var targetNode in targetNodes) {
    //     // Callback function to execute when mutations are observed
    

    //     // Create an observer instance linked to the callback function
    //     var observer = new MutationObserver(callback);

    //     // Start observing the target node for configured mutations
    //     observer.observe(targetNode, config);
    // }

    /* Remove disable tab and text for mock section*/
    document.querySelectorAll('.tab-forbidden[data-type="PREP"]').forEach(function(e){e.classList.remove('tab-forbidden');});
})();