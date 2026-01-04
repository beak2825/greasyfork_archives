// ==UserScript==
// @name         Autocompletar recompensas de un usuario
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://www.twitch.tv/popout/pururinpaw/reward-queue
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430544/Autocompletar%20recompensas%20de%20un%20usuario.user.js
// @updateURL https://update.greasyfork.org/scripts/430544/Autocompletar%20recompensas%20de%20un%20usuario.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let userToCompleteReward = 'Ota_kun_';

    var observeDOM = (function(){
        var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

        return function( obj, callback ){
            if( !obj || obj.nodeType !== 1 ) return;

            if( MutationObserver ){
                // define a new observer
                var mutationObserver = new MutationObserver(callback)

                // have the observer observe foo for changes in children
                mutationObserver.observe( obj, { childList:true, subtree:true })
                return mutationObserver
            }

            // browser support fallback
            else if( window.addEventListener ){
                obj.addEventListener('DOMNodeInserted', callback, false)
                obj.addEventListener('DOMNodeRemoved', callback, false)
            }
        }
    })();

setTimeout(function(){
    let listElm = document.querySelector('div');
    console.log("script autocomplete loaded");
    observeDOM( listElm, function(m){
        let list = document.getElementsByClassName("tw-transition");
        for (let item of list) {
            if(item.innerHTML.indexOf(userToCompleteReward) !== -1) {
                item.querySelector('[data-test-selector=complete-button]').click();
                console.log("pa tu casa");
            }
        }
    });
}, 3000);
})();