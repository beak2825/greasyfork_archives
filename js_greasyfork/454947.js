// ==UserScript==
//
// @name            Desert Bus Chat Images
// @description     Auto-embed chat images in the Desert Bus Twitch chat!
// @include         https://www.twitch.tv/desertbus
// @version         1.5
// @require https://code.jquery.com/jquery-3.6.0.min.js
//
// @namespace https://greasyfork.org/users/984176
// @downloadURL https://update.greasyfork.org/scripts/454947/Desert%20Bus%20Chat%20Images.user.js
// @updateURL https://update.greasyfork.org/scripts/454947/Desert%20Bus%20Chat%20Images.meta.js
// ==/UserScript==

setInterval(function(){ 
    for (let message of $("[data-test-selector='chat-line-message-body']")) { 
        if (message.classList.contains("processed-for-codes")) { 
            continue; 
        }
        message.classList.add("processed-for-codes");
        
        for (let word of message.innerText.split(" ")) {
            if (word.startsWith("https://pump19.eu/codefall/")) {
                window.open(word, '_blank');
            }
        }
    }
}, 50);