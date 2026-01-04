// ==UserScript==
// @name          Youtube Adblock Chrome Extension Hide Share Button
// @namespace     http://userstyles.org
// @description   Hides "Share" Button from Youtube Adblock Chrome Extension
// @description   https://chrome.google.com/webstore/detail/adblock-for-youtube/cmedhionkhpnakcndndgjdbohmhepckk
// @author        636597
// @include       *://*youtube.com/*
// @run-at        document-start
// @version       0.9
// @downloadURL https://update.greasyfork.org/scripts/380544/Youtube%20Adblock%20Chrome%20Extension%20Hide%20Share%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/380544/Youtube%20Adblock%20Chrome%20Extension%20Hide%20Share%20Button.meta.js
// ==/UserScript==

var share_button_id = "ab4yt-brand";
var doc_body = null;
var share_button_element = null;
var doc_body_obvserver = null;
var observerConfig = {
    childList: true,
    attributes: true,
    characterData: true,
    subtree: true,
    attributeOldValue: true,
    characterDataOldValue: true
};

(function() {
    function loadObserver() {
        doc_body = document.getElementsByTagName( "BODY" )[ 0 ];
        doc_body_obvserver = new MutationObserver( function( mutations ) {
            mutations.forEach( function( mutation , index ) {
                if ( mutation.type === "childList" ) {
                    mutation.addedNodes.forEach( function( node , index ) {
                        if ( node.id === share_button_id ) {
                            console.log( mutation );
                            node.setAttribute( "style" , "visibility: hidden !important" );
                        }
                    });
                }
            });
        });
        doc_body_obvserver.observe( doc_body , observerConfig );
        var x1 = document.getElementById( share_button_id );
        if ( x1 ) { x1.setAttribute( "style" , "visibility: hidden !important" ); }
    }
    window.addEventListener ( "load" , loadObserver );
})();