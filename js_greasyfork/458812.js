// ==UserScript==
// @name         Blaseball TTS
// @namespace    https://freshbreath.zone
// @version      2.1
// @description  Add a "Speak" button to Blaseball live games
// @author       MOS Technology 6502
// @match        https://*.blaseball.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=blaseball.com
// @grant        none
// @license      CC0; https://creativecommons.org/share-your-work/public-domain/cc0/
// @downloadURL https://update.greasyfork.org/scripts/458812/Blaseball%20TTS.user.js
// @updateURL https://update.greasyfork.org/scripts/458812/Blaseball%20TTS.meta.js
// ==/UserScript==

(function() {
    "use strict";

    // This variable tracks which log we are "listening" to currently.
    let audibleLog;

    // Speak a string
    function speak(message) {

        // Reformat some of the messages for better speech playback.
        //  Fix inning ordinals (1, 2, 3 -> 1st, 2nd, 3rd...)
        function ordinal(n) {
            let s = ["th", "st", "nd", "rd"];
            let v = n%100;
            return (s[(v-20)%10] || s[v] || s[0]);
        }
        let inning = message.match(/End of the (?:top|bottom) of the (\d+)\./);
        if (inning != null) {
            message = message.slice(0, -1) + ordinal(inning[1]);
        }

        // Make pitch counts more phonetic
        message = message.replace(' 0-1', ' oh-n-one');
        message = message.replace(' 0-2', ' oh-n-two');
        message = message.replace(' 1-0', ' one-n-oh');
        if (Math.random() < 0.5) {
            message = message.replace(' 1-1', ' count\'s even at one');
        } else {
            message = message.replace(' 1-1', ' one-n-one');
        }
        message = message.replace(' 1-2', ' one-n-two');
        message = message.replace(' 2-0', ' two-n-oh');
        message = message.replace(' 2-1', ' two-n-one');
        if (Math.random() < 0.5) {
            message = message.replace(' 2-2', ' count\'s even at two');
        } else {
            message = message.replace(' 2-2', ' two-n-two');
        }
        message = message.replace(' 3-0', ' three-n-oh');
        message = message.replace(' 3-1', ' three-n-one');
        message = message.replace(' 3-2', ' full count');

        console.log("Blaseball TTS: Speaking '" + message + "'");

        // Create the TTS object
        let msg = new SpeechSynthesisUtterance();
        msg.text = message;
        // Other fun voice options
        // msg.lang to change language
        // msg.pitch to sets the pitch (tone)
        // msg.rate  to set rate (how fast they talk)
        // msg.voice to change voice (should be one of window.SpeechSynthesis.getVoices())
        // msg.volume to change volume

        // Send the msg to the speech engine
        window.speechSynthesis.speak(msg);
    }

    // Callback for when a button is clicked.
    //  This should try to find the sibling game-widget__log, and set audibleLog to it.
    const buttonCallback = (event) => {
        let node = event.target.parentNode;

        // Reset the audible log
        audibleLog = undefined;
        // Try to set audible log to the game log, if it exists
        for (const subNode of node.childNodes) {
            if (subNode.classList?.contains("game-widget__log")) {
                audibleLog = subNode;
                break;
            }
        }
        console.log("Blaseball TTS: Updating audibleLog to " + audibleLog)
    };

    // Observer added to document which looks for changes
    const callback = (mutationList, observer) => {
        for (const mutation of mutationList) {
            if (mutation.type === "childList") {
                for (const node of mutation.addedNodes) {
                    // Checking for the appearance of the game-widget__status, so we can add our button
                    if (node.classList?.contains("game-widget__status")) {
                        // found it!  create button and add to main list
                        let btn = document.createElement("button");
                        btn.textContent = '🔊';
                        btn.classList.add('schedule__day');
                        btn.addEventListener("click", buttonCallback);
                        node.appendChild(btn);
                    }
                }
            } else if (mutation.type === "characterData") {
                // Verify that the owner of this changed text is the audibleLog.
                //  If so, send the new text to TTS.
                if (audibleLog && (mutation.target.parentNode === audibleLog)) {
                    speak(mutation.target.data);
                }
            }
        }
    };

    // Finally, attach the observer to the HTML document, and we are ready to go!
    const observer = new MutationObserver(callback);
    observer.observe(document, { subtree: true, childList: true, characterData: true });
})();
