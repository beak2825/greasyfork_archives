// ==UserScript==
// @name         Forum EasyEdit
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  Alt + W edit mode, puis click to edit
// @author       Laïn
// @match        https://www.dreadcast.net/Forum/*
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/533939/Forum%20EasyEdit.user.js
// @updateURL https://update.greasyfork.org/scripts/533939/Forum%20EasyEdit.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const hoverStyleClass = 'message-hover-highlight-script';
    const messageSelector = 'div.zone_display_text';
    const listenersAttachedMarker = 'data-msg-listeners-attached';
    const messageContainerSelector = 'body';

    let currentlyHoveredMessageElement = null;
    let isEditModeActive = false;
    let messageObserver = null;

    function addHoverHighlightStyle() {
        const styleId = 'message-edit-hover-style';
        if (document.getElementById(styleId)) return;
        const css = `
            div.zone_display_text.${hoverStyleClass}[id^="message_"] {
                outline: 2px dashed rgba(30, 144, 255, 0.6) !important;
                outline-offset: 2px;
                cursor: pointer !important;
            }
            body.edit-mode-active-script {
                 cursor: crosshair !important;
            }
        `;
        try {
            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = css;
            document.head.appendChild(style);
        } catch (e) {
            if (typeof GM_addStyle !== "undefined") { GM_addStyle(css); }
        }
    }

    function isValidMessageDiv(element) {
        return element && element.matches && element.matches(messageSelector) && element.id && element.id.startsWith('message_');
    }

    function attachListenersToElement(element) {
        if (!isValidMessageDiv(element) || element.hasAttribute(listenersAttachedMarker)) {
            return;
        }
        element.removeEventListener('mouseenter', handleMouseEnter);
        element.removeEventListener('mouseleave', handleMouseLeave);
        element.removeEventListener('click', handleMessageClick);

        element.addEventListener('mouseenter', handleMouseEnter);
        element.addEventListener('mouseleave', handleMouseLeave);
        element.addEventListener('click', handleMessageClick);
        element.setAttribute(listenersAttachedMarker, 'true');
    }

    function handleMouseEnter(event) {
        const targetDiv = event.currentTarget;
        currentlyHoveredMessageElement = targetDiv;
        if (isEditModeActive) {
            targetDiv.classList.add(hoverStyleClass);
        }
    }

    function handleMouseLeave(event) {
        const targetDiv = event.currentTarget;
        targetDiv.classList.remove(hoverStyleClass);
        if (currentlyHoveredMessageElement === targetDiv) {
            currentlyHoveredMessageElement = null;
        }
    }

    function handleMessageClick(event) {
        if (!isEditModeActive) return;

        const messageDiv = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();

        const fullId = messageDiv.id;
        const idParts = fullId.split('_');

        if (idParts.length >= 2 && idParts[0] === 'message') {
            const messageIdNumber = parseInt(idParts[1], 10);
            if (!isNaN(messageIdNumber)) {
                if (typeof forum !== 'undefined' && typeof forum.editMessage === 'function') {
                    try {
                        let secondParameter = 0;
                        const profileLink = document.querySelector('a[href*="/Profil/"]');
                        if (profileLink) {
                            const match = profileLink.href.match(/\/Profil\/(\d+)/);
                            if (match && match[1]) { secondParameter = parseInt(match[1], 10); }
                        }

                        if (secondParameter !== 0) {
                            forum.editMessage(messageIdNumber, secondParameter);
                        } else {
                            try { forum.editMessage(messageIdNumber); }
                            catch (eOneParam) { forum.editMessage(messageIdNumber, 0); }
                        }
                    } catch (e) {
                        alert(`Script Error: Could not call forum.editMessage.`);
                    }
                } else {
                    alert(`Script Error: forum.editMessage function not found.`);
                }
            }
        }
        toggleEditMode();
    }

    function toggleEditMode() {
        isEditModeActive = !isEditModeActive;
        document.body.classList.toggle('edit-mode-active-script', isEditModeActive);
        if (isEditModeActive) {
            if (currentlyHoveredMessageElement && isValidMessageDiv(currentlyHoveredMessageElement)) {
                currentlyHoveredMessageElement.classList.add(hoverStyleClass);
            }
        } else {
             if (currentlyHoveredMessageElement) {
                  currentlyHoveredMessageElement.classList.remove(hoverStyleClass);
             }
             // Remove highlight from all elements just in case
             document.querySelectorAll(`.${hoverStyleClass}`).forEach(el => el.classList.remove(hoverStyleClass));
        }
    }

    function scanAndAttachListeners(containerElement) {
         if (!containerElement) return;
         const messageElements = containerElement.querySelectorAll(messageSelector);
         messageElements.forEach(element => {
              if(isValidMessageDiv(element)) {
                   attachListenersToElement(element);
              }
         });
    }

    function handleKeyDown(event) {
        if (event.altKey && event.key.toLowerCase() === 'w') {
            event.preventDefault();
            toggleEditMode();
        }
    }

    function handleDOMChanges(mutationsList, observer) {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (isValidMessageDiv(node)) {
                             attachListenersToElement(node);
                        } else if (node.querySelector) {
                             scanAndAttachListeners(node);
                        }
                    }
                });
            }
        }
    }

    function initializeScript() {
        addHoverHighlightStyle();
        const messageContainer = document.querySelector(messageContainerSelector);
        if (!messageContainer) {
             alert("Userscript warning: Could not find the specific message container. Script might not update correctly after edits.");
             return;
        }

        scanAndAttachListeners(messageContainer);
        messageObserver = new MutationObserver(handleDOMChanges);

        const observerConfig = {
            childList: true,
            subtree: true
        };

        messageObserver.observe(messageContainer, observerConfig);
        window.addEventListener('keydown', handleKeyDown);
    }

    if (document.readyState === 'interactive' || document.readyState === 'complete') {
        initializeScript();
    } else {
        document.addEventListener('DOMContentLoaded', initializeScript, { once: true });
    }

    window.addEventListener('beforeunload', () => {
        if (messageObserver) {
            messageObserver.disconnect();
        }
        document.body.classList.remove('edit-mode-active-script'); // Clean up class on unload
    });

})();