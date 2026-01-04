// ==UserScript==
// @name        Popmundo Chat Enhancer
// @description Some enhancements for the popmundo chat window
// @namespace   bheuv
// @version     1.0.1
//
// @include     https://*.popmundo.com*
//
// @run-at document-end
//
// @downloadURL https://update.greasyfork.org/scripts/402746/Popmundo%20Chat%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/402746/Popmundo%20Chat%20Enhancer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const iFrame = document.querySelector("iframe#chat");
    
    if (iFrame) {
        // Make the chat window a bit taller
        iFrame.style.height = "600px";
        return;
    }

    const chat = document.querySelector("#chat-posts");

    if (!chat) {
        return;
    }

    const config = {childList: true, subtree: false, attributes: false};

    const enhanceChatMessage = function(node) {
        if (node.dataset.enhanced) return;
        node.dataset.enhanced = true;

        let message = node.querySelector(".message");
        if (!message) return;
        
        // Detect links and images
        let parts = message.innerHTML.split("<");
        let messageText = parts.shift();
        let newMessage = messageText;
        
        const linkPattern = /(https?:\/\/[^\s]+)/g
        let link = linkPattern.exec(messageText);
        while(link) {
            if (link[1].endsWith(".gif") || link[1].endsWith(".jpg") || link[1].endsWith(".jpeg") || link[1].endsWith(".png")) {
                // Images become image elements
                newMessage = newMessage.replace(link[1], 
                    `<img style="max-width: 100%;" src="${link[1]}" />`
                );
            } else {
                // Links become anchor elements
                newMessage = newMessage.replace(link[1], 
                    `<a target="_blank" style="background-color: #fff; border-radius: 2px; color: #09639a; padding: 1px;" href="${link[1]}">${link[1]}</a>`
                );
            }

            link = linkPattern.exec(message.innerHTML);
        }

        message.innerHTML = [newMessage, ...parts].join('<');
    }

    const handleMutation = function(list, observer) {
        list.forEach((entry) => {
            if (entry.type === "childList" && entry.addedNodes && entry.addedNodes.length > 0) {
                entry.addedNodes.forEach((node) => {
                    enhanceChatMessage(node);
                });
            }
        });
    };

    const observer = new MutationObserver(handleMutation);
    observer.observe(chat, config);

})();