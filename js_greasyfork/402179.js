// ==UserScript==
// @name         Mildom chat autoloder
// @namespace    Mildom chat autoloder
// @version      0.3
// @description  It scroll Mildom's chat automatic.(ミルダムのチャットを自動でスクロール)
// @author       meguru
// @license      MIT
// @match        https://www.mildom.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/402179/Mildom%20chat%20autoloder.user.js
// @updateURL https://update.greasyfork.org/scripts/402179/Mildom%20chat%20autoloder.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let myEnv = {
        enableAutoReload: true,
        observer: undefined
    }

    setTimeout(function() {
        console.log('-------- start tamper ------------')

        function addObserver() {
            const config = {
                attributes: true,
                childList: true,
                subtree: true
            }
            const messageListContainer = document.getElementsByClassName('message-list-container')[0]
            myEnv.observer = new MutationObserver((mutations) => {
                if (messageListContainer.children[1]) {
                    messageListContainer.children[1].click();
                }
            })
            myEnv.observer.observe(messageListContainer, config)
        }

        function stopObserver() {
            myEnv.observer.disconnect()

        }

        const toolBar = document.getElementsByClassName('tool-bar')[0]
        if (!toolBar) {
            console.log('not found chat tool bar');
            return;
        }
        const autoReloadButton = document.createElement('div')
        autoReloadButton.textContent = "🌊"
        autoReloadButton.id = "myAutoReloadButton"
        autoReloadButton.onclick = () => {
            let el = document.getElementById('myAutoReloadButton')
            if (myEnv.enableAutoReload === true) {
                myEnv.enableAutoReload = false
                el.textContent = "❄"
                stopObserver()
            } else {
                myEnv.enableAutoReload = true
                el.textContent = "🌊"
                addObserver()
            }
        }
        toolBar.appendChild(autoReloadButton)
        addObserver()

        console.log('--------- end tamper -------------')
    }, 6000)

})();