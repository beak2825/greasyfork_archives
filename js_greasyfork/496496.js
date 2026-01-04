// ==UserScript==
// @name         Kick Kufur Tespiti
// @namespace    https://openuserjs.org/users/DeadLyBro/scripts
// @version      1.3
// @description  Kick platformunda sohbete atılan küfürü tespit ederek kırmızı renkle boyar. Eklenen küfürlerin az olduğunu düşünüyorsanız Discord: DeadLyBro            Not: Birleşik yazılanları da tespit ediyor, araya küfür sıkıştıranları muck.
// @author       DeadLyBro
// @copyright    2024, DeadLyBro (https://openuserjs.org/users/DeadLyBro)
// @match        https://kick.com/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAJ1BMVEVHcExM+RhS/BhT/BhT/BhT/BhT/BhT/RhT/BhT/BhT/BhT/BhT/BhpKvhpAAAADHRSTlMACICP9rHRQ0Um6EeNmbQ8AAAAj0lEQVRYhe3XyQ6AIAxF0TKJ0/9/rwq4IGkcWgibd7fCWSgSIDJ256KqwA1x+RmA7oBJyQGz+hQ75BPATwXwByA5MOUe5r8AHwKgAcoPJgfCHM+2RQzYarMBIAKcFPDBXrkoBmZi+gNEAPqXqP2Md+OXMoAGm6p6Wy8B6H7EKatk+DEPQIMLh/rKcwegK3AAMjSQjsrgRgUAAAAASUVORK5CYII=
// @grant        none
// @license      MIT
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/496496/Kick%20Kufur%20Tespiti.user.js
// @updateURL https://update.greasyfork.org/scripts/496496/Kick%20Kufur%20Tespiti.meta.js
// ==/UserScript==

// ==OpenUserJS==
// @author DeadLyBro
// ==/OpenUserJS==

function waitForKeyElements(selector, callback) {
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === 1 && $(node).is(selector)) {
                    callback($(node));
                }
            });
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
}


(function() {

	'use strict';

    waitForKeyElements(
        "div[#chatroom-messages]",
        function(div) {
            let bad_words = ["amk", "aq", "mk", "amcık", "şerefsiz", "serefsiz", "piç", "göt", "sokuk", "sikik", "emcuk", "sikti", "sik", "penis", "am", "sikiş", "orospu", "orospu evladı", "piç kurusu"];
            let textContent = div.find('div > div > span:nth-child(4)').text().toLowerCase();

            for (let word of bad_words) {
                if (textContent.includes(word)) {
                    div.css({
                        "background": "#761e1e",
                        "border": "2px solid red",
                        "border-radius": "5px"
                    });
                    break;
                }
            }
        }
    );
})();
