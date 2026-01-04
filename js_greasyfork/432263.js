// ==UserScript==
// @name         DiscordTokenLogin
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  Adds an option to login to discord via a token from the clipboard
// @author       idjawoo
// @match        *://discord.com/login
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432263/DiscordTokenLogin.user.js
// @updateURL https://update.greasyfork.org/scripts/432263/DiscordTokenLogin.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function waitForElm(selector) {
        return new Promise((resolve) => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }

            const observer = new MutationObserver(() => {
                if (document.querySelector(selector)) {
                    resolve(document.querySelector(selector));
                    observer.disconnect();
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true,
            });
        });
    }


    window.addEventListener('load', function () {
        waitForElm("button[type='submit']").then((result) => {
            var button = result
            var tokenButton = button.cloneNode(true)
            var buttonstack = document.getElementsByTagName("form")[0].children[1].children[0].children[0]
            var wrap = document.createElement('div');

            wrap.style.width = "100%"
            tokenButton.style.cursor = "pointer"
            tokenButton.innerHTML = "Use Token"
            tokenButton.type = "button"
            tokenButton.addEventListener (
                "click", ButtonClickAction, false
            );

            wrap.appendChild(tokenButton);
            wrap.style.marginTop = "20px"

            buttonstack.appendChild(wrap)
            function ButtonClickAction(event) {
                navigator.clipboard.readText()
                    .then(text => {
                    login(text);
                }).catch(error => {
                    console.error('Error whilst reading clipboard: ', error);
                });
            }

            function login(token) {
                document.body.appendChild(document.createElement `iframe`).contentWindow.localStorage.token = `"${token}"`
                location.reload();
            }
        })
    })
})();