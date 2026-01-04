// ==UserScript==
// @name         Graphic is a bozo
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  grpahi is bozo
// @author       milad
// @match        https://classroom.google.com/u/0/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/441433/Graphic%20is%20a%20bozo.user.js
// @updateURL https://update.greasyfork.org/scripts/441433/Graphic%20is%20a%20bozo.meta.js
// ==/UserScript==

(function() {

window.location.pathname = location.pathname.replace("/u/0", "/u/1")

})();