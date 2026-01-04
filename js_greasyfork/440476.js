// ==UserScript==
// @name         RNK Extension
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  RNK Extension For Vanis.io
// @author       Rinck#0001
// @match        https://vanis.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/440476/RNK%20Extension.user.js
// @updateURL https://update.greasyfork.org/scripts/440476/RNK%20Extension.meta.js
// ==/UserScript==

if (location.host === 'vanis.io' && location.href !== 'https://vanis.io/RNK') {
    window.stop();
    location.href = 'https://vanis.io/RNK';
    return;
}

document.documentElement.style.cssText = "font-family:system-ui;color:white;background-color:#111;";
document.documentElement.innerHTML = "<big><center><h3>DELETED EXTENSION! Please uninstall the script.</h3></center></big>";


// Working more on this soon as possible. Stay Tuned for updates!