// ==UserScript==
// @name         Diep.io no Privacy settings button
// @version      1.1
// @description  Removes the weird button Zeach added
// @author       shadaman
// @match        https://diep.io
// @icon         https://www.google.com/s2/favicons?domain=diep.io
// @grant        none
// @namespace https://greasyfork.org/users/719520
// @downloadURL https://update.greasyfork.org/scripts/428509/Diepio%20no%20Privacy%20settings%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/428509/Diepio%20no%20Privacy%20settings%20button.meta.js
// ==/UserScript==

setInterval(function() {
  let a = document.getElementById("qc-cmp2-persistent-link");
  if(a != null) {
    a.parentElement.removeChild(a);
  }
}, 100);