// ==UserScript==
// @name         Hide Google logo in searchbox
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Hide 
// @author       eggplants
// @homepage     https://github.com/eggplants
// @match        https://*.google.com/search*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/418493/Hide%20Google%20logo%20in%20searchbox.user.js
// @updateURL https://update.greasyfork.org/scripts/418493/Hide%20Google%20logo%20in%20searchbox.meta.js
// ==/UserScript==

document.getElementsByClassName('x32v3e S003Ke ZoN4Lb')[0].remove()