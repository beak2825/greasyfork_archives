// ==UserScript==
// @name         Twitch - Bring back PogChamp
// @namespace    Chia233
// @version      0.4
// @description  Brings back OG PogChamp via BTTV CDN
// @author       Chia233
// @match        https://www.twitch.tv/*
// @grant        none
// @run-at       document-idle
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/420095/Twitch%20-%20Bring%20back%20PogChamp.user.js
// @updateURL https://update.greasyfork.org/scripts/420095/Twitch%20-%20Bring%20back%20PogChamp.meta.js
// ==/UserScript==
//use

(function() {

    'use-strict';

    let observer = new MutationObserver((mutations) => {
       mutations.forEach((m) => {
           if (m.addedNodes.length) {

               let resultLength =  $("img[alt='PogChamp']").length
               //console.log(`Current node length is: ${length}`)

               for (let i = 0; i < resultLength; i++) {
                   $("img[alt='PogChamp']")[i].src = "https://cdn.betterttv.net/emote/5ff8cf3194ed120c66d3bb9e/3x"
                   $("img[alt='PogChamp']")[i].srcset = "https://cdn.betterttv.net/emote/5ff8cf3194ed120c66d3bb9e/3x"
               };
          };

       });
    });

    function observeDOM() {
        observer.observe(document.querySelector(".chat-shell"), {
            childList: true,
            attributes: true,
            attributeFilter: ['style'],
            subtree: true
        });
    };

    setTimeout(observeDOM, 3000);
})();