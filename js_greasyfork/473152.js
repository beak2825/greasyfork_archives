// ==UserScript==
// @name         The first working bloxd script-made by ottery2100 (patched)
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  W rizz
// @author       You
// @match        https://bloxd.io/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bloxd.io
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/473152/The%20first%20working%20bloxd%20script-made%20by%20ottery2100%20%28patched%29.user.js
// @updateURL https://update.greasyfork.org/scripts/473152/The%20first%20working%20bloxd%20script-made%20by%20ottery2100%20%28patched%29.meta.js
// ==/UserScript==


;(original => (Date.now = () => original() * 10000000000000).toString = () => "function now() {\n    [native code]\n}")(Date.now);