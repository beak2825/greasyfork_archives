// ==UserScript==
// @name         Hip-Hop.pl Tweaks
// @namespace    http://tampermonkey.net/
// @version      0.13
// @description  experimental
// @author       siwy_dym
// @require http://code.jquery.com/jquery-3.4.1.min.js
// @match        https://www.hip-hop.pl/forum/projector.php?forum=8*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393164/Hip-Hoppl%20Tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/393164/Hip-Hoppl%20Tweaks.meta.js
// ==/UserScript==
$(document).ready(function() {
    var boniu = $("a:contains('japs')");
    boniu.parentsUntil('.posty').find('img:last').remove();

});