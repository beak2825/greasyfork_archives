// ==UserScript==
// @name         Ez spam Skinny
// @version      0.1
// @description  Lets have fun with skouaayni haway la9tot
// @author       You
// @match        https://trovo.live/s/skiNNNyX
// @grant        none
// @namespace https://greasyfork.org/users/1026187
// @downloadURL https://update.greasyfork.org/scripts/459932/Ez%20spam%20Skinny.user.js
// @updateURL https://update.greasyfork.org/scripts/459932/Ez%20spam%20Skinny.meta.js
// ==/UserScript==

;(function() {
    'use strict';

    // Check if the xpath exists on the page
    function xpathExists(xpath) {
        let result = document.evaluate(xpath, document, null, XPathResult.ANY_TYPE, null);
        let node = result.iterateNext();
        return node !== null;
    }
    let button = document.createElement("button");
    button.style.cssText = "width: 50px; height: 30px; float: left; bottom: 0; right: -50;";
    button.style.minWidth = "60px";
    button.style.height = "32px";
    button.style.padding = "0 12px";
    button.style.fontSize = "14px";
    button.style.color = "var(--color-white)";
    button.style.backgroundColor = "var(--color-brand-regular)";
    button.style.borderRadius = "2px";
    button.style.margin = "0 0 0 15px";
    button.innerHTML = "Spam";

    let isRunning = false;

button.addEventListener("click", function() {
    isRunning = !isRunning;
    const xpath = "/html/body[@class=' base-dark-mode']/div[@id='__nuxt']/div[@id='__layout']/div[@class='top-container webp']/div[@class='base-container']/div[@class='base-main flex flex-column']/div[@class='space relative flex flex-auto live-room']/div[@class='flex flex-column flex-auto']/div[@class='flex relative flex-auto']/div[@class='slide-right-panel auto']/section[@class='chat-wrap flex flex-column room-info']/div[@class='flex flex-auto flex-column']/section[@class='input-panels-container']/div[@class='input-container']/div[@class='flex input-face-container']/div[@class='input-box']/div[@class='editor']";
    const xpathbutton = "/html/body[@class=' base-dark-mode']/div[@id='__nuxt']/div[@id='__layout']/div[@class='top-container webp']/div[@class='base-container']/div[@class='base-main flex flex-column']/div[@class='space relative flex flex-auto live-room']/div[@class='flex flex-column flex-auto']/div[@class='flex relative flex-auto']/div[@class='slide-right-panel auto']/section[@class='chat-wrap flex flex-column room-info']/div[@class='flex flex-auto flex-column']/section[@class='input-panels-container']/div[@class='input-container']/div[@class='input-feature-box align-center justify-between']/button[@class='cat-button normal primary btn-send']";
    const target = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    const targetbtn = document.evaluate(xpathbutton, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    let txt = target.innerHTML + " ";
    if (target) {
        let interval = setInterval(function() {
            if (!isRunning) {
                clearInterval(interval);
                return;
            }
            //let randomChars = Math.random().toString(36).charAt(2);
            txt = txt + " ";
            target.innerHTML = txt;
            target.focus();

            let event = new InputEvent('input', {
                data: txt,
                bubbles: true,
                cancelable: true,
                composed: true,
                isComputing: false,
                inputType: 'insertText',
                dataTransfer: null
            });
            target.dispatchEvent(event);

            event = new Event('change', {
                bubbles: true
            });
           target.dispatchEvent(event);
            setTimeout(function() {
               targetbtn.click();
           },250);
        }, 950);
    } else {
        alert("Chat not found");
    }
});

    let xpath = "/html/body[@class=' base-dark-mode']/div[@id='__nuxt']/div[@id='__layout']/div[@class='top-container webp']/div[@class='base-container']/div[@class='base-main flex flex-column']/div[@class='space relative flex flex-auto live-room']/div[@class='flex flex-column flex-auto']/div[@class='flex relative flex-auto']/div[@class='slide-right-panel auto']/section[@class='chat-wrap flex flex-column room-info']/div[@class='flex flex-auto flex-column']/section[@class='input-panels-container']/div[@class='input-container']/div[@class='input-feature-box align-center justify-between']";
    // Create a mutation observer to watch for changes to the xpath
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                // Find the node using the xpath
                var node = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                // Append new inputs to the node
                node.appendChild(button);
                // Disconnect the observer
                observer.disconnect();
            }
        });
    });
    // Start observing the document
    observer.observe(document, {
        childList: true,
        subtree: true
    });
})();


