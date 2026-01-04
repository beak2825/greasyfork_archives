// ==UserScript==
// @name         破产把手_1
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://www.neopets.com/space/strangelever.phtml
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/35265/%E7%A0%B4%E4%BA%A7%E6%8A%8A%E6%89%8B_1.user.js
// @updateURL https://update.greasyfork.org/scripts/35265/%E7%A0%B4%E4%BA%A7%E6%8A%8A%E6%89%8B_1.meta.js
// ==/UserScript==

setTimeout(function(){$('input[value="Pull the Lever Anyway"]').trigger("click");},Math.floor(Math.random()*4000))