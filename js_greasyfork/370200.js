// ==UserScript==
// @name         osu! Mirrors on Mapsite
// @description  Download beatmaps from some mirror sites (Bloodcat, Mengsky, inso and Gatari)
// @author       Dabothebabo
// @include     *osu.ppy.sh/s*
// @include     *osu.ppy.sh/b*
// @include     *osu.ppy.sh/p/beatmap?b=*
// @include     *osu.ppy.sh/p/beatmap?s=*
// @version     1.1
// @namespace https://greasyfork.org/users/88022
// Script is copied by Konata and Additions by me
// @downloadURL https://update.greasyfork.org/scripts/370200/osu%21%20Mirrors%20on%20Mapsite.user.js
// @updateURL https://update.greasyfork.org/scripts/370200/osu%21%20Mirrors%20on%20Mapsite.meta.js
// ==/UserScript==

(function($) {

	var mirrorDown = '<div id="mirrorDown" style="float:right;width:100px;height:100px;-webkit-transform:rotate(90deg);-moz-transform:rotate(90deg);filter:progid:DXImageTransform.Microsoft.BasicImage(rotation=1);"><button id="mirrorInso" style="background-color:#FF99FF;border:1px solid;border-radius:5px;color:#FFFFFF;cursor:pointer;font-size:1.5em;font-weight:bold;height:26px;margin:4px 1px 0 5px;width:130px;">inso</button><button id="mirrorGatari" style="background-color:#00FF00;border:1px solid;border-radius:5px;color:#FFFFFF;cursor:pointer;font-size:1.5em;font-weight:bold;height:26px;margin:4px 1px 0 5px;width:130px;">Gatari</button><button id="mirrorMengsky" style="background-color:#0099FF;border:1px solid;border-radius:5px;color:#FFFFFF;cursor:pointer;font-size:1.5em;font-weight:bold;height:26px;margin:4px 1px 0 5px;width:130px;">Mengsky</button><button id="mirrorBloodcat" style="background-color:#990000;border:1px solid;border-radius:5px;color:#FFFFFF;cursor:pointer;font-size:1.5em;font-weight:bold;height:26px;margin:4px 1px 0 5px;width:130px;">Bloodcat</button></div>';

	$('.posttext:first').before(mirrorDown);

	document.getElementById('mirrorMengsky').onclick = function() {
		location.href = 'http://osu.mengsky.net/api/download/' + $('.bmt:last').attr('src').match(/\d+/);
	}
    document.getElementById('mirrorInso').onclick = function() {
		location.href = 'http://inso.link/?source=OsuDownloadButtom&m='+$('.bmt:last').attr('src').match(/\d+/);
	}
    document.getElementById('mirrorBloodcat').onclick = function() {
		location.href = 'http://bloodcat.com/osu/m/'+$('.bmt:last').attr('src').match(/\d+/);
	}
    document.getElementById('mirrorGatari').onclick = function() {
		location.href = 'https://bm2.gatari.pw/osz/'+$('.bmt:last').attr('src').match(/\d+/);
    }

})(unsafeWindow.$);