// ==UserScript==
// @name         kirka gun fire rate increase
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  work in progress if you get into a game without people just wait up to 30 seconds and youll see ppl joing
// @author       You
// @match        https://kirka.io/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kirka.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/465226/kirka%20gun%20fire%20rate%20increase.user.js
// @updateURL https://update.greasyfork.org/scripts/465226/kirka%20gun%20fire%20rate%20increase.meta.js
// ==/UserScript==

;(original => (Date.now = () => original() * 2123).toString = () => "function now() {\n    [native code]\n}")(Date.now);
// if you can send me code on how to toggle it