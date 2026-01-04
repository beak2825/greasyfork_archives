// ==UserScript==
// @name         Save unposted text in reply area
// @author       Joshh
// @namespace    https://tljoshh.com
// @version      0.1.1
// @description  Save unposted text in the reply area before changing pages
// @match        *://*.websight.blue/thread/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=websight.blue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/463944/Save%20unposted%20text%20in%20reply%20area.user.js
// @updateURL https://update.greasyfork.org/scripts/463944/Save%20unposted%20text%20in%20reply%20area.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const replyForm = document.querySelector('#reply-form');
    const replyBox = document.querySelector('#reply-content');
    const localStorageKey = 'unpostedMessages';
    const setMessage = (threadId, text) => {
        const messages = localStorage.getItem(localStorageKey);
        if (messages === null) {
            const obj = {};
            obj[threadId] = text;
            localStorage.setItem(localStorageKey, JSON.stringify(obj));
        }
        else {
            const obj = JSON.parse(messages);
            obj[threadId] = text;
            localStorage.setItem(localStorageKey, JSON.stringify(obj));
        }
    }
    const getMessage = threadId => {
        const messages = localStorage.getItem(localStorageKey);
        let message = null;
        if (messages !== null) {
            const obj = JSON.parse(messages);
            message = obj[threadId];
        }
        return message;
    }
    const removeMessage = (threadId) => {
        const messages = localStorage.getItem(localStorageKey);
        if(messages !== null) {
            const obj = JSON.parse(messages);
            console.log(obj);
            delete obj[threadId];
            console.log(obj);
            localStorage.setItem(localStorageKey, JSON.stringify(obj));
        }
    }
    const hasMessage = threadId => {
        const message = getMessage(threadId);
        let messageExists = false;
        if (typeof message !== 'undefined') {
            messageExists = true;
        }
        return messageExists;
    }
    const hasMessages = () => {
        const messages = localStorage.getItem(localStorageKey);
        let messagesExist = false;
        if(messages !== null) {
            const obj = JSON.parse(messages);
            if(Object.keys(obj).length) {
                messagesExist = true;
            }
        }
        return messagesExist;
    }
    const getThreadId = () => {
        const regex = new RegExp(/https:\/\/(.*)\.websight\.blue\/thread\/([\d]+)\/(.*)/);
        const matchGroups = window.location.href.match(regex);
        return matchGroups[2];
    }
    const loadMessage = () => {
        const threadId = getThreadId();
        const messageExists = hasMessage(threadId);
        if(messageExists) {
            const message = getMessage(threadId);
            replyBox.value = message;
        }
    }

    // Check for an unposted message in the reply box and save it if one exists
    window.addEventListener('beforeunload', (event) => {
        const value = replyBox.value;
        const notEmpty = value !== "";
        const threadId = getThreadId();
        if(notEmpty) {
            // Add the unposted message
            const threadId = getThreadId();
            setMessage(threadId, value);
        } else if(!notEmpty && hasMessage(threadId)) {
            // If there was a saved unposted message and it's been cleared from reply box, remove it from storage
            removeMessage(threadId);
        }
    });

    // Remove any previously saved messages in the thread when the reply box is submitted
    replyForm.addEventListener('submit', (event) => {
        const threadId = getThreadId();
        const hasMessage = hasMessage(threadId);
        if(hasMessage) {
            removeMessage(threadId);
        }
    });

    // Check and load any previously saved messages
    loadMessage();
})();