// ==UserScript==
// @name         Poe enlarge chat box, auto set focus to input box and toggles (show/hide) the left sidebar 
// @name:en      Poe enlarge chat box, auto set focus to input box and toggles (show/hide) the left sidebar
// @name:zh-CN   Poe 扩大聊天框，自动设置输入框焦点，隐藏侧边栏
// @namespace    http://tampermonkey.net/
// @version      0.8.0
// @description:en  Features: 1. Enlarge chat box. 2. Auto set focus to input box. 3. toggles (show/hide) the left sidebar. 
// @description:zh-CN  功能：1. 扩大聊天框。2. 自动设置输入框焦点。3. 切换显示侧边栏的显示和隐藏。
// @author       Cursor & Mason
// @match        *://poe.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=poe.com
// @grant        GM.registerMenuCommand
// @grant        GM.setValue
// @grant        GM.getValue
// @license      MIT
// @supportURL   https://github.com/hxy91819/poe-tampermonkey
// @homepageURL  https://github.com/hxy91819/poe-tampermonkey
// @description 1. Enlarges the chat box. 2. Automatically moves the focus to the chat input box when the user types. 3. Sets the chatInput as the focus when the page is focused.
// @downloadURL https://update.greasyfork.org/scripts/464463/Poe%20enlarge%20chat%20box%2C%20auto%20set%20focus%20to%20input%20box%20and%20toggles%20%28showhide%29%20the%20left%20sidebar.user.js
// @updateURL https://update.greasyfork.org/scripts/464463/Poe%20enlarge%20chat%20box%2C%20auto%20set%20focus%20to%20input%20box%20and%20toggles%20%28showhide%29%20the%20left%20sidebar.meta.js
// ==/UserScript==

(async function () {
    'use strict';

    /** Function 1: Enlarges the chat box */
    enlargeChatBox();
    /** Function 2: Automatically moves the focus to the chat input box when the user types or click button. (Has Problem with Chinese Input) */
    setChatInputFocus();
    /** Function 3: toggles (show/hide) the left sidebar */
    GM.registerMenuCommand('toggles (show/hide) the left sidebar', toggleShowHideTheLeftSidebarFeatures);

    /** Function 1.1: Add a listener to handle dynamic loading: resize when switching pages */
    const observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'href') {
                enlargeChatBox();
            }
        });
    });
    observer.observe(document.body, { attributes: true, subtree: true, attributeFilter: ['href'] });

    /** Function 1.2: Add a listener to handle dynamic loading: resize message bubbles */
    const bubbleObserver = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0 && Array.from(mutation.target.classList).some(className => className.startsWith('ChatMessagesView_messagePair'))) {
                // console.log(mutation)
                removeMessageBubbleMaxWidth();
            }
        });
    });
    bubbleObserver.observe(document.body, { childList: true, subtree: true });

    /** Remove the maximum width of message bubbles */
    function removeMessageBubbleMaxWidth() {
        console.log("removeMessageBubbleMaxWidth!")
        // Find all div elements with class starting with Message_botMessageBubble
        const messageBubbles = document.querySelectorAll('div[class^="Message_botMessageBubble"]');
        // Loop through each message bubble and remove the max-width property
        messageBubbles.forEach(messageBubble => {
            messageBubble.style.setProperty('max-width', 'unset', 'important');
        });

        const humanMessageBubbles = document.querySelectorAll('div[class^="Message_humanMessageBubble"]');
        // Loop through each message bubble and remove the max-width property
        humanMessageBubbles.forEach(messageBubble => {
            messageBubble.style.setProperty('max-width', 'unset', 'important');
        });
    }
    /** Remove the maximum width of message bubbles */
    function enlargeChatBox() {
        console.log("enlargeChatBox!")
        // Get all sections with class has prefix 'PageWithSidebarLayout_mainSection'
        const sections = document.querySelectorAll('[class^="PageWithSidebarLayout_mainSection"]');
        // Loop through each section and remove the width and max-width properties
        sections.forEach(section => {
            // make it important to prevent modify
            section.style.setProperty('width', 'unset', 'important');
            section.style.setProperty('max-width', 'unset', 'important');
            section.style.setProperty('min-width', '684px', 'important');
        });

        // Remove the maximum width of message bubbles
        removeMessageBubbleMaxWidth();

        const chatMessagesViews = document.querySelectorAll('div[class^="ChatMessagesView_emptyView"]');
        // Loop through each message bubble and remove the max-width property
        chatMessagesViews.forEach(messageView => {
            messageView.style.setProperty('max-width', 'unset', 'important');
        });
    }

    /** Set the focus of the input box */
    function setChatInputFocus() {

        // Check if there are any free opportunities to use to avoid setting focus causing pop-ups.
        function checkCredits() {
            // Find the div element with class starting with ChatMessageSendButton_noFreeMessageTooltip
            const chatMessageSendButton = document.querySelector('div[class^="ChatMessageSendButton_noFreeMessageTooltip"]');
            // If the chatMessageSendButton's innerHTML contains '0', return directly
            if (chatMessageSendButton && chatMessageSendButton.innerHTML.includes('0')) {
                console.log("no credits left...")
                return true;
            }

            return false;
        }

        // Find the textarea element with class starting with ChatMessageInputView_textInput
        const chatInput = document.querySelector('textarea[class^="GrowingTextArea_textArea"]');
        console.log(chatInput); // print chatInput for debug

        // Add an event listener to the document that listens for user input
        document.addEventListener('keypress', event => {
            if (checkCredits()) {
                return;
            }
            // If the target of the input event is the chatInput element and it does not have focus, set focus to it
            if (!chatInput.matches(':focus')) {
                chatInput.focus();
            }
        });

        // Add an event listener to the document that listens for a click event on button elements
        document.addEventListener('click', event => {
            if (checkCredits()) {
                return;
            }
            // If the clicked element is a button and the chatInput does not have focus, set focus to it
            if (event.target.tagName === 'BUTTON' && !chatInput.matches(':focus')) {
                chatInput.focus();
            }
        });


        /** Function 2.1: Sets the chatInput as the focus when the page is focused. */

        // Set the chatInput as the focus when the page is loaded
        window.addEventListener('focus', () => {
            if (checkCredits()) {
                return;
            }
            chatInput.focus();
        });
    }


    /** Toggle show/hide the left sidebar */
    let isLeftSideBarShow = await GM.getValue('isLeftSideBarShow', true);
    console.log('isLeftSideBarShow: ' + isLeftSideBarShow);
    // Show or hide the left sidebar based on the stored setting
    if (!isLeftSideBarShow) {
        hideTheLeftSidebar();
    }
    async function toggleShowHideTheLeftSidebarFeatures() {
        if (isLeftSideBarShow) {
            hideTheLeftSidebar();
        } else {
            showTheLeftSidebar();
        }
        isLeftSideBarShow = !isLeftSideBarShow;
        await GM.setValue('isLeftSideBarShow', isLeftSideBarShow);
    }

    /** Hide the left sidebar */
    function hideTheLeftSidebar() {
        // Get all sections with class has prefix 'PageWithSidebarLayout_mainSection'
        const sections = document.querySelectorAll('[class^="PageWithSidebarLayout_leftSidebar"]');
        // Loop through each section and set the display property to none
        sections.forEach(section => {
            // make it important to prevent modification
            section.style.setProperty('display', 'none', 'important');
        });
    }

    /** Show the left sidebar */
    function showTheLeftSidebar() {
        // Get all sections with class has prefix 'PageWithSidebarLayout_mainSection'
        const sections = document.querySelectorAll('[class^="PageWithSidebarLayout_leftSidebar"]');
        // Loop through each section and remove the width and max-width properties
        sections.forEach(section => {
            // make it important to prevent modify
            section.style.setProperty('display', 'inline');
        });
    }
})();

