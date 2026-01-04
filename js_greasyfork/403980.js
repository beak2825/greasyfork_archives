// ==UserScript==
// @name         Twitch - unnerf oddoneSiSenor
// @namespace    Chia233
// @version      0.9
// @description  Increases oddoneSiSenor size back to the original size (thicc AF) POGGERS
// @author       Chia233
// @match        https://www.twitch.tv/*
// @grant        none
// @run-at       document-idle
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/403980/Twitch%20-%20unnerf%20oddoneSiSenor.user.js
// @updateURL https://update.greasyfork.org/scripts/403980/Twitch%20-%20unnerf%20oddoneSiSenor.meta.js
// ==/UserScript==
//use

(function() {

    'use-strict';

    let observer = new MutationObserver((mutations) => {
       mutations.forEach((m) => {
           if (m.addedNodes.length) {
               //get all oddoneSiSenors on the page
               let resultLength =  $("img[src='https://static-cdn.jtvnw.net/emoticons/v2/971/default/light/1.0").length
               console.log(`Current node length is: ${length}`)

               for (let i = 0; i < resultLength; i++) {
                   $("img[src='https://static-cdn.jtvnw.net/emoticons/v2/971/default/light/1.0']")[i].parentElement.style.width = '200%'
                   //fix alignment after emote
                   $("img[src='https://static-cdn.jtvnw.net/emoticons/v2/971/default/light/1.0']")[i].parentElement.parentElement.parentElement.parentElement.style.margin='0 2.5rem 0 0'
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