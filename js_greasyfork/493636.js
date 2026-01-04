// ==UserScript==
// @name         Lichess auto analyse
// @version      0.2
// @description  Automatically request analysis when going to the analysis page.
// @author       anakojm
// @license      GNU GPL V3
// @include      /lichess\.org/\w{8}(|/white|/black)$/
// @grant none
// @namespace https://greasyfork.org/users/933055
// @downloadURL https://update.greasyfork.org/scripts/493636/Lichess%20auto%20analyse.user.js
// @updateURL https://update.greasyfork.org/scripts/493636/Lichess%20auto%20analyse.meta.js
// ==/UserScript==

function auto_analyse() {
  var button = document.querySelector("form.future-game-analysis").querySelector('button[type=submit]');
  if (button) {
    button.click();
  }
}

auto_analyse();