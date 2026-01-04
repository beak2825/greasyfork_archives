// ==UserScript==
// @name        Medium2Scribe
// @version     1.1
// @license     GPLv3
// @author      Lenicyl
// @description Redirect Medium.com links to Scribe.rip
// @include     /^https?://(?:.*\.)*(?<!(link\.|cdn\-images\-\d+\.))medium\.com(/.*)?$/
// @run-at      document-start
// @grant       none
// @icon        https://rimgo.bus-hit.me/WdK4ksA.png
// @namespace   https://greasyfork.org/users/866309
// @downloadURL https://update.greasyfork.org/scripts/443854/Medium2Scribe.user.js
// @updateURL https://update.greasyfork.org/scripts/443854/Medium2Scribe.meta.js
// ==/UserScript==

window.location.replace("https://scribe.rip" + window.location.pathname + window.location.search)