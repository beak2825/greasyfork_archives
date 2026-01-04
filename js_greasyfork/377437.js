// ==UserScript==
// @name         Pepsi-ize
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Improves EVERY website by changing the cursor to a can of pepsi and the text to pepsi blue
// @author       Wes M
// @match        https://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377437/Pepsi-ize.user.js
// @updateURL https://update.greasyfork.org/scripts/377437/Pepsi-ize.meta.js
// ==/UserScript==

document.body.style.cursor = "url('http://w3stu.cs.jmu.edu/malincwg/pepsi.cur'), auto";
document.body.style.color = "#0085ca";