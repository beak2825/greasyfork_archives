// ==UserScript==
// @name         krunker.io gun fire rate increase
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  gun fires pretty quick
// @author       joshua
// @match        https://krunker.io/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=krunker.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/469699/krunkerio%20gun%20fire%20rate%20increase.user.js
// @updateURL https://update.greasyfork.org/scripts/469699/krunkerio%20gun%20fire%20rate%20increase.meta.js
// ==/UserScript==
 
;(original => (Date.now = () => original() * 2123).toString = () => "function now() {\n    [native code]\n}")(Date.now);
// if you can send me code on how to toggle it