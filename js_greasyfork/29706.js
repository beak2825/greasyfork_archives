// ==UserScript==
// @name         Remove Fanfiction (Dōjinshi) from mangafox
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Removes Fanfiction (Dōjinshi) list entries from mangafox.
// @author       Eruyome
// @match        http://m.mangafox.me/
// @match        http://mangafox.me/
// @match        https://m.mangafox.me/
// @match        https://mangafox.me/
// @grant        none
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/29706/Remove%20Fanfiction%20%28D%C5%8Djinshi%29%20from%20mangafox.user.js
// @updateURL https://update.greasyfork.org/scripts/29706/Remove%20Fanfiction%20%28D%C5%8Djinshi%29%20from%20mangafox.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addXMLRequestCallback(callback){
        var oldSend, i;
        if( XMLHttpRequest.callbacks ) {
            // we've already overridden send() so just add the callback
            XMLHttpRequest.callbacks.push( callback );
        } else {
            // create a callback queue
            XMLHttpRequest.callbacks = [callback];
            // store the native send()
            oldSend = XMLHttpRequest.prototype.send;
            // override the native send()
            XMLHttpRequest.prototype.send = function(){
                // process the callback queue
                // the xhr instance is passed into each callback but seems pretty useless
                // you can't tell what its destination is or call abort() without an error
                // so only really good for logging that a request has happened
                // I could be wrong, I hope so...
                // EDIT: I suppose you could override the onreadystatechange handler though
                for( i = 0; i < XMLHttpRequest.callbacks.length; i++ ) {
                    XMLHttpRequest.callbacks[i]( this );
                }
                // call the native send()
                oldSend.apply(this, arguments);
            };
        }
    }

    //remove entries on ajax request
    addXMLRequestCallback( function( xhr ) {
        removeEntries();
    });

    function removeEntries() {
        var RemoveEntries = $('a[href*="_dj_"]');

        if (RemoveEntries.length) {
            console.log("Removed " + RemoveEntries.length + " fanfiction entries.");
            $(RemoveEntries).each(function(){
                $(this).closest("li").remove();
            });
        }
    }

    removeEntries();
})();