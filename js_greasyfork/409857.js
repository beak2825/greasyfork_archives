// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://pictsense.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/409857/New%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/409857/New%20Userscript.meta.js
// ==/UserScript==

(function() {
    'use strict';
  const BIG_p = document.createElement("p");
  BIG_p.style.backgroundColor = '#ffffff';
  BIG_p.append("カラーピッカー")

  document.getElementById('sizeButtonHolder').innerHTML =
      '<input type="color" id="head" name="head" value="#e66465"><label for="head">Head</label>'
    document.getElementById('undoButton').style.position = 'inherit';
    // Your code here...
})();