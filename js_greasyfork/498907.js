// ==UserScript==
// @name         AOPS classroom notification sound
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Beep when a new message div is created or a key is pressed
// @author       Shaun Wang
// @match        https://artofproblemsolving.com/classroom/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=artofproblemsolving.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498907/AOPS%20classroom%20notification%20sound.user.js
// @updateURL https://update.greasyfork.org/scripts/498907/AOPS%20classroom%20notification%20sound.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // notification sound
    function notificationSound() {
        var context = new (window.AudioContext || window.webkitAudioContext)();
        // Oscillators and gain nodes for A and E notes
        var oscillatorA = context.createOscillator();
        var oscillatorE = context.createOscillator();
        var gainNodeA = context.createGain(); // Gain node for A note
        var gainNodeE = context.createGain(); // Gain node for E note

        oscillatorA.type = 'sine';
        oscillatorE.type = 'sine';

        // Connect oscillators to their respective gain nodes
        oscillatorA.connect(gainNodeA);
        oscillatorE.connect(gainNodeE);

        // Connect gain nodes to context destination
        gainNodeA.connect(context.destination);
        gainNodeE.connect(context.destination);

        // A note settings
        oscillatorA.frequency.setValueAtTime(440, context.currentTime);
        gainNodeA.gain.setValueAtTime(1, context.currentTime);
        gainNodeA.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + 1);
        oscillatorA.start(context.currentTime);
        oscillatorA.stop(context.currentTime + 1);

        // E note settings (starts shortly after A)
        oscillatorE.frequency.setValueAtTime(659.25, context.currentTime);
        gainNodeE.gain.setValueAtTime(1, context.currentTime);
        gainNodeE.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + 1);
        oscillatorE.start(context.currentTime + 0.05);
        oscillatorE.stop(context.currentTime + 1);
    }

    // check if the new node has the required classes
    function isTargetNode(node) {
        return node.nodeType === 1 && node.classList.contains('styles_thread__3HaEQ') && node.classList.contains('styles_topTracked__wDRH_');
    }

    // mark existing messages to avoid triggering sound on them
    function markExistingMessages() {
        const existingMessages = document.querySelectorAll('.styles_thread__3HaEQ.styles_topTracked__wDRH_');
        existingMessages.forEach(message => {
            message.dataset.seen = 'true';
        });
    }

    // monitors the page
    var observer = new MutationObserver(function(mutationsList) {
        for (var mutation of mutationsList) {
            if (mutation.type === 'childList') {
                for (var addedNode of mutation.addedNodes) {
                    if (isTargetNode(addedNode) && !addedNode.dataset.seen) {
                        addedNode.dataset.seen = 'true';
                        notificationSound();
                    }
                }
            }
        }
    });

    // mark existing messages and start observing for new ones
    window.addEventListener('load', function() {
        markExistingMessages();
        observer.observe(document.body, { childList: true, subtree: true });
        notificationSound();
    });


})();
