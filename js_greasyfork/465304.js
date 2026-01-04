// ==UserScript==
// @name         Make Google Sorry Page Link Clickable
// @namespace    https://userscript.snomiao.com/
// @version      0.1.0
// @description  as the name
// @author       snomiao@gmail.com
// @match        https://www.google.com/sorry/index?*
// @icon         https://www.google.com/s2/favicons?domain=google.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/465304/Make%20Google%20Sorry%20Page%20Link%20Clickable.user.js
// @updateURL https://update.greasyfork.org/scripts/465304/Make%20Google%20Sorry%20Page%20Link%20Clickable.meta.js
// ==/UserScript==

document.body.innerHTML = document.body.innerHTML.replace(
  /URL: (.*?)<br>/,
  (_, $1) => 'URL: <a href="' + $1 + '">' + $1 + "</a>"
);
