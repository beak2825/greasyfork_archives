// ==UserScript==
// @name Site Editor
// @license MIT        
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Change text on any site.
// @author       that-damn-doge
// @match        http*://*/*
// @exclude      https://docs.google.com/*/*
// @exclude      https://sites.google.com/*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/490574/Site%20Editor.user.js
// @updateURL https://update.greasyfork.org/scripts/490574/Site%20Editor.meta.js
// ==/UserScript==
javascript:document.body.contentEditable = true; void 0;