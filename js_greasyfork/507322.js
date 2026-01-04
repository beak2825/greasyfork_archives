// ==UserScript==
// @name         Farside to Fastside
// @namespace    happyviking
// @version      1.0.0
// @grant        none
// @run-at       document-end
// @license      MIT
// @description  Automatically redirects to Fastside if Farside is not working
// @icon         https://camo.githubusercontent.com/e14ce80abe479ce36ade067e9d00a252f9667c73e45d1e8f347b00c391e0d6e0/68747470733a2f2f62656e62757362792e636f6d2f6173736574732f696d616765732f666172736964652e737667
// @author       HappyViking
// @match	     *://*.farside.com/*
// @downloadURL https://update.greasyfork.org/scripts/507322/Farside%20to%20Fastside.user.js
// @updateURL https://update.greasyfork.org/scripts/507322/Farside%20to%20Fastside.meta.js
// ==/UserScript==

function tryNewInstance() {
    location.replace('https://fastside.link/' + window.location.pathname + window.location.search);
}

function main() {
    const serializedDocument = new XMLSerializer().serializeToString(document).toLowerCase()
    if (serializedDocument.includes("bad gateway") || serializedDocument.includes("too many requests")) {
        tryNewInstance()
    }
}

main()