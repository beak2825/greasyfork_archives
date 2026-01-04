// ==UserScript==
// @name        BlueCat Address Manager Generate Links
// @namespace   *
// @description Generate Links from Text in table cells in BlueCat Address Manager
// @include     */app*
// @version     4
// @grant       none
// @author      Marius Galm
// @copyright   2019, Marius Galm
// @license	MIT
// @icon        https://www.bluecatnetworks.com/wp-content/uploads/2018/03/cropped-bluecat-favicon-32x32.png
// @require     http://code.jquery.com/jquery-latest.min.js
// @require https://greasyfork.org/scripts/376375-anchorme/code/Anchorme.js?version=659847
// @downloadURL https://update.greasyfork.org/scripts/376377/BlueCat%20Address%20Manager%20Generate%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/376377/BlueCat%20Address%20Manager%20Generate%20Links.meta.js
// ==/UserScript==

var pattern = /^(https?:\/\/|ftps?:\/\/)?([a-z0-9%\-]+\.){1,}([a-z0-9\-]+)?(:(\d{1,5}))?(\/([a-z0-9\-._~:\/\?#\[\]@!$&'\(\)\*\+,;=%]+)?)?$/i;
if (document.readyState === "interactive" ) {
	$("#outerTable tr td").not(':first').hover(
		function () {
            //console.log($(this)[0].getElementsByTagName("span")[0]);
			if ($(this)[0].getElementsByTagName("span")[0] != null) {
				if ($(this)[0].getElementsByTagName("span")[0].innerHTML.trim() !== "") {
					var str = $(this)[0].getElementsByTagName("span")[0].innerHTML.trim();
					if ( str.match(pattern) ) {
			                	//console.log("found string to link");
						$(this)[0].getElementsByTagName("span")[0].innerHTML = anchorme(str, {attributes:[ { name:"target", value:"_blank" } ] } );
					}
				}
			}
		}
	);
}