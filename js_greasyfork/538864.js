// ==UserScript==
// @name         HDFM Vote Buttons
// @namespace    http://tampermonkey.net/
// @version      2025-06-08
// @description  Add vote buttons to the HDFM stream chat
// @author       rewbycraft
// @match        https://www.twitch.tv/radiohdfm
// @match        https://www.twitch.tv/popout/radiohdfm/chat
// @match        https://twitch.tv/radiohdfm
// @match        https://twitch.tv/popout/radiohdfm/chat
// @match        https://www.twitch.tv/moderator/radiohdfm
// @match        https://twitch.tv/moderator/radiohdfm
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hdfm.nl
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538864/HDFM%20Vote%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/538864/HDFM%20Vote%20Buttons.meta.js
// ==/UserScript==

(function() {
    'use strict';


    // === START CODE YOINKED FROM BETTER TTV === //
    function getReactInstance(element) {
        for (const key in element) {
            if (key.startsWith('__reactInternalInstance$') || key.startsWith('__reactFiber$')) {
                return element[key];
            }
        }

        return null;
    }

    function searchReactParents(node, predicate, maxDepth = 15, depth = 0) {
        try {
            if (predicate(node)) {
                return node;
            }
        } catch (_) {}

        if (!node || depth > maxDepth) {
            return null;
        }

        const {return: parent} = node;
        if (parent) {
            return searchReactParents(parent, predicate, maxDepth, depth + 1);
        }

        return null;
    }

    const CHAT_CONTAINER = 'section[data-test-selector="chat-room-component-layout"]';

    function getCurrentChat() {
        let currentChat;
        try {
            const node = searchReactParents(
                getReactInstance(document.querySelector(CHAT_CONTAINER)),
                (n) => n.stateNode && n.stateNode.props && n.stateNode.props.onSendMessage
            );
            currentChat = node.stateNode;
        } catch (_) {}

        return currentChat;
    }

    function sendChatMessage(message) {
        const currentChat = getCurrentChat();
        if (!currentChat) return;
        currentChat.props.onSendMessage(message);
    }

    // === END CODE YOINKED FROM BETTER TTV === //

    function createButton(text, chatMessage) {
        const container2 = document.createElement('div');
        container2.classList.add('ScCoreButton-sc-ocjdkq-0');
        const container = document.createElement('div');
        container.classList.add('Layout-sc-1xcs6mc-0');
        container.classList.add('ScAttachedTooltipWrapper-sc-1ems1ts-0');
        container2.appendChild(container);

        const button = document.createElement('button');
        button.innerText = text;
        button.style.padding = "4px";
        container.appendChild(button);

        button.onclick = function() {
            sendChatMessage(chatMessage);
        };

        let buttonContainer = document.getElementsByClassName("community-points-summary");
        for (let bContainer of buttonContainer) {
            bContainer.appendChild(container2);
        }
    }

    function createAllButtons() {
        createButton("NICE", "!vote nice");
        createButton("MEH", "!vote meh");
        createButton("BAD", "!vote bad");
    }

    // I hate this code.
    // WHY DOESN'T THE OBSERVER TRIGGER ON THE CHILDREN NODES BEING ADDED
    function callbackRecursionCheck(node, observer) {
        if (node.classList.contains('community-points-summary')) {
            createAllButtons();
            observer.disconnect();
        }
        for (let child of node.children) {
            callbackRecursionCheck(child, observer);
        }
    };
    const callback = function(mutations, observer) {
        mutations.forEach((mutation) => {
            if (mutation.type === "childList") {
                for (let node of mutation.addedNodes) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        callbackRecursionCheck(node, observer);
                    }
                }
            }
        });
    };
    const observer = new MutationObserver(callback);
    const targetNode = document.getElementById('root');
    const config = { attributes: false, childList: true, subtree: true };
    observer.observe(targetNode, config);

})();
