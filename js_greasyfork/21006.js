// ==UserScript==
// @name Steam web chat scroller
// @namespace http://sharparam.com/
// @description Scrolls the message view on new messages in the Steam web chat.
// @include https://steamcommunity.com/chat/*
// @version 1.0.3
// @grant none
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/21006/Steam%20web%20chat%20scroller.user.js
// @updateURL https://update.greasyfork.org/scripts/21006/Steam%20web%20chat%20scroller.meta.js
// ==/UserScript==

var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
        Array.prototype.forEach.call(mutation.addedNodes, function(node) {
            if (node.className == 'chat_dialog') {
                observer.observe(node.querySelector('.chat_dialog_content_inner'), {
                    childList: true
                });
            } else if (node.classList.contains('chat_message')) {
                node.scrollIntoView(true);
            }
        });
    });
});

observer.observe(document.querySelector('#chatlog'), {
    childList: true
});
