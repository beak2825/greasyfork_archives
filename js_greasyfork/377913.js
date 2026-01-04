// ==UserScript==
// @name         Lightshot Printsc Printscreen redirect to image
// @namespace    https://greasyfork.org/users/200700
// @version      1.0.0
// @description  Automatically redirects prntsc/printscreen lightshot screenshots to the image
// @author       SuperOP535
// @include      /^https?:\/\/prnt.sc\/\w+$/
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/377913/Lightshot%20Printsc%20Printscreen%20redirect%20to%20image.user.js
// @updateURL https://update.greasyfork.org/scripts/377913/Lightshot%20Printsc%20Printscreen%20redirect%20to%20image.meta.js
// ==/UserScript==

window.addEventListener('DOMContentLoaded', () => location.href = document.querySelector('meta[property="og:image"]').content);