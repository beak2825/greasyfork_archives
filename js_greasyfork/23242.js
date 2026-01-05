// ==UserScript==
// @name         Shout Secret
// @namespace    https://realitygaming.fr/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://realitygaming.fr/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/23242/Shout%20Secret.user.js
// @updateURL https://update.greasyfork.org/scripts/23242/Shout%20Secret.meta.js
// ==/UserScript==

$('.titleBar').after('<iframe src="https://marent-dev.fr/forumpriver/shoutbox/popup" style="width: 100%;height: 400px;"> </iframe>');