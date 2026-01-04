// ==UserScript==
// @name         ShortRemover
// @namespace    http://tampermonkey.net/
// @version      0.03
// @description  Remove Shorts from subscription page
// @author       JP
// @match        https://www.youtube.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/458530/ShortRemover.user.js
// @updateURL https://update.greasyfork.org/scripts/458530/ShortRemover.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function observeDOM(callback){
        var mutationObserver = new MutationObserver(function(mutations) { //https://davidwalsh.name/mutationobserver-api
            mutations.forEach(function(mutation) {
                callback(mutation)
            });
        });
        // Keep an eye on the DOM for changes
        mutationObserver.observe(document.body, { //https://blog.sessionstack.com/how-javascript-works-tracking-changes-in-the-dom-using-mutationobserver-86adc7446401
            attributes: true,
            childList: true,
            subtree: true,
            attributeFilter: ["class"] 
        });
    }
    function run(){
        var allVideoDivs = document.querySelectorAll('ytd-grid-video-renderer')

        for( const video of allVideoDivs){
            var theLink = video.querySelector('a').href
            if(theLink.includes('shorts')){
               video.remove()
            }
        }
}

    observeDOM(doDomStuff);
    function doDomStuff(mutation){

        if(mutation.target.id === "items"){
            run();
        }
    }
})();