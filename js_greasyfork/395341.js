// ==UserScript==
// @name         Zap Uploads on ipTorrents.com
// @namespace    https://www.iptorrents.com
// @version      1.0.8
// @description  Zap pending uploads with credit on ipTorrents.com
// @author       AppEternal
// @match        https://*.iptorrents.com/seeding_required.php
// @grant        none
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/395341/Zap%20Uploads%20on%20ipTorrentscom.user.js
// @updateURL https://update.greasyfork.org/scripts/395341/Zap%20Uploads%20on%20ipTorrentscom.meta.js
// ==/UserScript==

(function() {
    $( "th:contains('Zap')" ).append ( `<a id="purge" href="javascript:void(0);"> | Zap All</a>` );
})();

$("#purge").click (() => {
	if (confirm("Are you sure you want to zap all your torrents?") == true) {
		$("input[value*='Surplus Credit']").click();
	}
});