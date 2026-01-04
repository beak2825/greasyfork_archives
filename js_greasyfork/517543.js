// ==UserScript==
// @name         MU Storage
// @version      2024-11-15v0.1
// @description  Selects you as default Target
// @author       ++
// @match        https://eclesiar.com/militaryunit/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @namespace https://greasyfork.org/users/1397021
// @downloadURL https://update.greasyfork.org/scripts/517543/MU%20Storage.user.js
// @updateURL https://update.greasyfork.org/scripts/517543/MU%20Storage.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let userID = $(".top-side-user > a:nth-child(1)")[0].href.replace("https://eclesiar.com/user/","")
    let targetSelector = $("#target-squad-selection")[0]
    for (let i = 0; i < targetSelector.length; i++) {
      let optionN = targetSelector.children[i]
      if (optionN.value == userID) {
          optionN.selected = "true"
      }
    }
})();