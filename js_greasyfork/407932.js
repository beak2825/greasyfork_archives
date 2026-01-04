// ==UserScript==
// @name         Unfriend buttons
// @version      0.1
// @description  Unfriend friends efficiently
// @author       Mixu_78
// @match        https://www.roblox.com/users/*/friends*
// @match        https://web.roblox.com/users/*/friends*
// @grant        none
// @namespace https://greasyfork.org/users/671678
// @downloadURL https://update.greasyfork.org/scripts/407932/Unfriend%20buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/407932/Unfriend%20buttons.meta.js
// ==/UserScript==
/* jshint esversion: 6 */
let token
(function() {
    'use strict';
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type == "childList") {
                for (const node of mutation.addedNodes) {
                    if (node.textContent == "34" || !node.parentElement) continue;
                    if (node.parentElement.className == "tab-pane active" && node.className == "friends-content section") {
                        makeButtons()
                    }
                }
            }
        })
    })
    observer.observe(document, {childList: true, subtree: true})
})();


function makeButtons() {
    for (const x of document.getElementsByClassName("avatar-card-caption")) {
        const button = document.createElement("button")
        button.style = 'color: rgb(0,0,0)'
        button.onclick = function(event) {unfriendAndDisableButton(this.parentNode.parentNode.parentNode.parentNode.getAttribute("id"), this)}
        const text = document.createTextNode("Unfriend")
        button.appendChild(text)
        x.appendChild(button)
    }
}

/**
 * @param {number|string} userId
 * @param {Node} button
 */
function unfriendAndDisableButton(userId, button) {
    const request = new XMLHttpRequest()
    request.onreadystatechange = () => {
        if (request.readyState === XMLHttpRequest.DONE) {
            if (request.status == 200) {
                button.enabled = false
            }
        }
    }
    if (!token) {
        const tokenRequest = new XMLHttpRequest()
        tokenRequest.onreadystatechange = () => {
            if (tokenRequest.readyState === XMLHttpRequest.DONE) {
                token = tokenRequest.getResponseHeader("x-csrf-token")
            }
        }

        tokenRequest.open("POST", `https://auth.roblox.com/v2/logout`)
        tokenRequest.withCredentials = true
        tokenRequest.send()
    }

    request.open("POST", `https://friends.roblox.com/v1/users/${userId}/unfriend`)
    request.withCredentials = true
    request.setRequestHeader("x-csrf-token", token)
    request.send()
}