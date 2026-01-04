// ==UserScript==
// @name          GeoGuessr Hide Footprint
// @namespace     MrMike/GeoGuessr/HideFootprint
// @version       1.0
// @description   Hides GeoGuessr Footprint - This means hidding the author of the photo in the location while playing.
// @author        MrMike
// @include       /^(https?)?(\:)?(\/\/)?([^\/]*\.)?geoguessr\.com($|\/.*)/
// @grant         GM_addStyle
// @run-at        document-start
// @downloadURL https://update.greasyfork.org/scripts/393138/GeoGuessr%20Hide%20Footprint.user.js
// @updateURL https://update.greasyfork.org/scripts/393138/GeoGuessr%20Hide%20Footprint.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

GM_addStyle(`
	.gmnoprint, .gm-style-cc{
		display: none;
	}
`);
