// ==UserScript==
// @name       AutoThanked
// @description  Automatically sets the top 10 stats to use the Top Thanked list
// @version    1.0
// @match      http://jiggmin.com/forum.php
// @namespace  http://jiggmin.com/forum.php
// @downloadURL https://update.greasyfork.org/scripts/2168/AutoThanked.user.js
// @updateURL https://update.greasyfork.org/scripts/2168/AutoThanked.meta.js
// ==/UserScript==

Cas_getStats('latestblogs', 'cs_blocksec');
Cas_getStats('cs_blockfir', 'thanked');