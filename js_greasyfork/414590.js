// ==UserScript==
// @name        Jetri - Enable multistream watching
// @namespace   Violentmonkey Scripts
// @match       https://hololive.jetri.co/
// @grant       none
// @version     1.0
// @author      -
// @description 10/25/2020, 8:50:32 AM
// @downloadURL https://update.greasyfork.org/scripts/414590/Jetri%20-%20Enable%20multistream%20watching.user.js
// @updateURL https://update.greasyfork.org/scripts/414590/Jetri%20-%20Enable%20multistream%20watching.meta.js
// ==/UserScript==


function main() {
  localStorage.setItem('ruleOnePlayer', 0);
  localStorage.setItem('rulePauseOther', 0);
}

main();
