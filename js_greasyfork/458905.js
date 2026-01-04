// ==UserScript==
// @name         Twitch Chat HUD (mirror screen vertically)
// @namespace    http://tampermonkey.net/
// @version      0.67
// @description  Mirror screen horizontally to use a phone or tablet as HUD with twitch chat
// @author       h93
// @match        https://www.twitch.tv/popout/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitch.tv
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/458905/Twitch%20Chat%20HUD%20%28mirror%20screen%20vertically%29.user.js
// @updateURL https://update.greasyfork.org/scripts/458905/Twitch%20Chat%20HUD%20%28mirror%20screen%20vertically%29.meta.js
// ==/UserScript==

function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}


(function() {
    'use strict';
 
    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }

    if(true){
    addGlobalStyle(`
      body {
        margin: 0 auto;
        width: 300px;
        -moz-transform: scaleY(-1);
        -o-transform: scaleY(-1);
        -webkit-transform: scaleY(-1);
        transform: scaleY(-1);
        filter: FlipV;
        -ms-filter: "FlipV";
      }`);
    }

    waitForElm('.chat-line__message').then((elm) => {
        console.log('start');
        delay(3000).then(() => {
            var chatNode = document.querySelector('[aria-label="Chatnachrichten"]');
            var toDeleteNodes = document.querySelectorAll('.chat-room__content > *');
            [...toDeleteNodes].forEach(e => {
                if(e != chatNode){
                    e.remove();
                    console.log('removed');
                }
            });
            document.querySelector('.stream-chat-header').remove();

    });
    });

})();