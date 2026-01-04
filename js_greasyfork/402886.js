// ==UserScript==
// @name         Scavenger
// @version      0.1
// @author       cheesesaurus
// @namespace    https://forum.tribalwars.net/index.php?threads/another-scavenging-script.283655/
// @description  scavenge by cheesesaurus https://github.com/cheesasaurus/twcheese
// @include      https://*/game.php?village=*&screen=place&mode=scavenge
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/402886/Scavenger.user.js
// @updateURL https://update.greasyfork.org/scripts/402886/Scavenger.meta.js
// ==/UserScript==

javascript:
(window.TwCheese && TwCheese.tryUseTool('ASS'))
|| $.ajax('https://cheesasaurus.github.io/twcheese/launch/ASS.js?'
+~~((new Date())/3e5),{cache:1});void 0;