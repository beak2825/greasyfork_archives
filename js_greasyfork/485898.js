// ==UserScript==
// @name         Sploop.io Debugging QOL
// @namespace    http://tampermonkey.net/
// @version      2024-06-03
// @description  Removes anti debugging attempts and deobfuscates the source code. You must have instant inject on for this to work.
// @author       You
// @match        https://sploop.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sploop.io
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/485898/Sploopio%20Debugging%20QOL.user.js
// @updateURL https://update.greasyfork.org/scripts/485898/Sploopio%20Debugging%20QOL.meta.js
// ==/UserScript==

// for redundancy, remapping code is already removed from custom appjs
let remappedProperties = ["log", "warn", "info", "error", "exception", "table", "trace"]
for (let i=0; i < remappedProperties.length; i++) {
    let origValue = window.console[remappedProperties[i]]
    Object.defineProperty(window.console, remappedProperties[i], {
        get: ()=>{
            return origValue
        },
        set: ()=>{}
    })
}

// custom appjs, deobfuscated and all anti debugging techniques removed
let current = false
new MutationObserver((mutations) => {
    for (let mutation of mutations) {
        if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
            mutation.addedNodes.forEach((node) => {
                if (node.src) {
                    if (/^https:\/\/sploop.io\/js\/.*\.js$/.test(node.src)) {
                        current = node.src.endsWith("/e08321e984a8efa957b1.js")
                        node.src = "https://sploop-src.glitch.me/app.js"
                    }
                }
            })
        }
    }
}).observe(document, {childList: true, subtree: true})

window.addEventListener("load", ()=>{
    if (!current) console.warn("%c\nWARNING: Custom app.js is outdated, use at your own risk!\n", "color: red; font-size: 20px")
})