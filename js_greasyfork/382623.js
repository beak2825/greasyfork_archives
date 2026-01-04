// ==UserScript==
// @name         Auto hide comments for invidio.us
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Automatically hide comments for invidio.us.
// @author       eiko
// @match        http*://www.invidio.us/watch?v=*
// @match        http*://invidio.us/watch?v=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382623/Auto%20hide%20comments%20for%20invidious.user.js
// @updateURL https://update.greasyfork.org/scripts/382623/Auto%20hide%20comments%20for%20invidious.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var observer = new MutationObserver(function(){
        let a = document.querySelector("#comments a");
        if(a){
            observer.disconnect();
            a.click();
        }
    });

    observer.observe(document.body, {childList: true, subtree: true});
})();