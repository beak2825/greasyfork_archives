// ==UserScript==
// @name  Auto-Refresh
// @author  redtrillix
// @description  Website Auto-Refresh Timer
// @include  https://myanimelist.net/animelist/RedTrillix?order=5&status=1
// @include  https://myanimelist.net/history/RedTrillix
// @version 0.0.1.20220623220144
// @namespace https://greasyfork.org/users/928640
// @downloadURL https://update.greasyfork.org/scripts/446939/Auto-Refresh.user.js
// @updateURL https://update.greasyfork.org/scripts/446939/Auto-Refresh.meta.js
// ==/UserScript==

setTimeout(function(){ location.reload(); }, 60*1000);