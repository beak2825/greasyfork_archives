// ==UserScript==
// @name         Hide Google AI Overview
// @namespace    https://gsajith.com/
// @version      2024-05-19
// @description  Hide AI Panel in Google search
// @author       https://twitter.com/guamhat
// @match        https://www.google.com/search?q=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/495549/Hide%20Google%20AI%20Overview.user.js
// @updateURL https://update.greasyfork.org/scripts/495549/Hide%20Google%20AI%20Overview.meta.js
// ==/UserScript==

document.querySelector("[jscontroller='qTdDb']")?.remove();
