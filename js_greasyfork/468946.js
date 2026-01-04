// ==UserScript==
// @name         G.co To Google.com
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  if you are in g.co now you are in google.com the g.co page are by google
// @author       rafa
// @match        https://g.co
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/468946/Gco%20To%20Googlecom.user.js
// @updateURL https://update.greasyfork.org/scripts/468946/Gco%20To%20Googlecom.meta.js
// ==/UserScript==
window.close()
window.open("https://www.google.com/");