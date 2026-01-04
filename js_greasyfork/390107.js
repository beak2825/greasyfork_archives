// ==UserScript==
// @name         Shikme Markdown
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Добавляет базовую разметку маркдаун в чат
// @author       You
// @match        https://shikme.ru/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390107/Shikme%20Markdown.user.js
// @updateURL https://update.greasyfork.org/scripts/390107/Shikme%20Markdown.meta.js
// ==/UserScript==

/*jshint esversion: 6 */

(function() {
    'use strict';

    const container = document.querySelector("#chat_logs_container");
    if (!container) return;



    function markdownIt(textEl) {
        let text = textEl.innerHTML;
        let newText = text.replace(/\*\*(.+)\*\*/, "<b>$1</b>");
        newText = newText.replace(/\*(.+)\*/, "<em>$1</em>");
        newText = newText.replace(/~~(.+)~~/, "<s>$1</s>");
        newText = newText.replace(/__(.+)__/, "<u>$1</u>");
        textEl.innerHTML = newText;
    }

    setTimeout(() => {
        container.querySelectorAll('.chat_message').forEach(msg => markdownIt(msg));
    }, 500);

    var mutationObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            // console.log(mutation);
            if (!mutation.addedNodes.length) return;
            mutation.addedNodes.forEach(node => markdownIt(node.querySelector(".chat_message")));
        });
    });

    mutationObserver.observe(container, {
        attributes: false,
        characterData: false,
        childList: true,
        subtree: false,
        attributeOldValue: false,
        characterDataOldValue: false
    });
})();