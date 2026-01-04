// ==UserScript==
// @name         APKMirror Anti-Adblock Killer
// @version      0.1.1
// @description  Removes the 15s waiting time
// @author       j4k0xb
// @license      MIT
// @match        https://www.apkmirror.com/apk/*-apk-download/
// @icon         https://icons.duckduckgo.com/ip2/apkmirror.com.ico
// @grant        none
// @namespace    https://greasyfork.org/users/941111
// @downloadURL https://update.greasyfork.org/scripts/448626/APKMirror%20Anti-Adblock%20Killer.user.js
// @updateURL https://update.greasyfork.org/scripts/448626/APKMirror%20Anti-Adblock%20Killer.meta.js
// ==/UserScript==

const downloadButton = document.querySelector(".downloadButton");
downloadButton.setAttribute("style", "background-color: #28a438 !important; pointer-events: initial !important; cursor: pointer !important");
