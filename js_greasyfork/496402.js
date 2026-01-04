// ==UserScript==
// @name         JSenable
// @namespace    http://tampermonkey.net/
// @version      2024-05-07 
// @description  enable js on ST
// @author       constantchange
// @match        http://127.0.0.1:8000/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=0.1
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/496402/JSenable.user.js
// @updateURL https://update.greasyfork.org/scripts/496402/JSenable.meta.js
// ==/UserScript==

const sanitize = DOMPurify.sanitize;
DOMPurify.sanitize = str => str.startsWith("#A") ? str.replace("#A", "") : sanitize(str);