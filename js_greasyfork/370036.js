// ==UserScript==
// @name        BlueCat Address Manager Favorites button
// @namespace   *
// @description Add button to access Favorites list without going to MyIPAM first in BlueCat Address Manager
// @include     */app*
// @license		MIT
// @version     2
// @grant       none
// @copyright   2018, Marius Galm
// @license		MIT
// @icon        https://www.bluecatnetworks.com/wp-content/uploads/2018/03/cropped-bluecat-favicon-32x32.png
// @downloadURL https://update.greasyfork.org/scripts/370036/BlueCat%20Address%20Manager%20Favorites%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/370036/BlueCat%20Address%20Manager%20Favorites%20button.meta.js
// ==/UserScript==

if (document.readyState === "interactive" ) {
	var toolbar = document.getElementsByClassName("ToolBar");
	if (toolbar !== undefined) {
		var tRs = toolbar[0].getElementsByTagName("tr");
		if (tRs !== undefined) {
            var tR = tRs[0];
            var y = tR.insertCell(0);
            y.innerHTML = '<td><div class="ToolBarItemSeparator">&nbsp;</div></td>';
			var x = tR.insertCell(0);
			x.innerHTML='<td><a id="link_fav" onclick="ProteusWaitingPage.start();" name="FavoriteExtra" class="ToolBarItem" href="app?service=direct&amp;page=Favorites&amp;component=$Border&amp;sp=Spage=Favorites"><img src="/images/icons/small/favorite_add.png" border="0" alt="Favorites" title="Favorites"></a></td>';
		}
	}
}