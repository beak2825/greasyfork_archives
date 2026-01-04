// ==UserScript==
// @name         deviantART filter
// @namespace    dA-filter
// @description  Filter some mentally disordered content from dA. 
// @include      *.deviantart.*
// @grant        none
// @require      https://code.jquery.com/jquery-latest.js
// @run-at       document-start
// @version      1.0
// @downloadURL https://update.greasyfork.org/scripts/370523/deviantART%20filter.user.js
// @updateURL https://update.greasyfork.org/scripts/370523/deviantART%20filter.meta.js
// ==/UserScript==

$(document).ready(doIgnore);
$(document).scroll(doIgnore);

function doIgnore() {
var ignoreuser = ['DestructiveOrgy', 'SenshiStock', 'DoomXWolf', 'KipTeiTei', 'TF-Warlock', 'LordStormCaller', 'beltpop', 'Cookies-Cat', 'tsilver', 'HellResident-Infl8', 'beltpop', 'TheWinterBunny', 'shepherd0821', 'Riendonut', 'deztyle', 'RebisDungeon', 'SolitaryScribbles', 'Sarilain', 'Mac-Nova', 'SaburoX', 'mangrowing', 'thanshuhai', 'ground-lion', 'R-MK', 'svoidist', 'youranus32', 'LeonKatlovre', 'lordvadersempire', 'Raikovjaba', 'Commoddity', 'AngelTheCatgirl', 'LakeHylia', 'The-Kappass', 'Ipku', 'CSImadmax', 'LiLaiRa', 'Lopoddity', 'AngriestAngryArtist', 'kittydogcrystal', 'Neytirix', 'doubleWbrothers', 'generalzoi', 'shgurr', 'Better-with-Salt', 'PrinceDodgerCakes', 'Sweet-n-treat', 'Holivi', 'Earthsong9405', 'DiscordTheGE', 'KishiAnimation', 'Axel-Rosered', 'arthsong9405', 'Fuzon-S', 'MagnaLuna', 'Temiree', 'grimphantom', 'KeryDarling', 'AssasinMonkey', 'G-Nibbles', 'quvr', 'GhostfaceNikol', 'II-Art', 'Slugbox', 'GraWolfQuinn', 'SilFoe', 'w-oo-t', 'bokuman', 'DJ-Bapho', 'Bamboo-Ale', 'Xcel-Zero', 'Kuroonehalf', 'Bamboo-Ale', 'MellowKun', 'ShubiJubi', 'Maternal-reads', 'TubbyToon', 'WossaRem', 'hataraki-ari', 'miles-df', 'Blazbaros', 'BIGBIG-on-DA', 'gajeco', 'TubbyToonw', 'SeriojaInc', 'MyFetishSituation', 'CoffeeSlice', 'phation', 'Jay-Marvel', 'Franktonius', 'Fimif', 'BedBendersInc', 'XSuperiX', 'Mizz-Britt', 'Renciel', 'kenket', 'oLEEDUEOLo', 'sasucchi95', 'Daycolors', 'infinitedge2u', 'GigaMessy', 'FlyingPings', 'kellylaeriza132003', 'ButtercupBabyPPG', 'McTranceFox', 'NamyGaga', 'Plumpchu'];


  
var filterUser = document.querySelectorAll('a[class*="username"]');

for (var i = 0; i < filterUser.length; i++) {
	checkUser(filterUser[i], 'textContent');
}
  
function checkUser(obj, elemento) {
	var text = obj[elemento];
	for (var i = 0; i < ignoreuser.length; i++) {
		if (text.toLowerCase().indexOf(ignoreuser[i].toLowerCase()) !== -1) {
			obj.closest('span[class*="thumb"]').style.display = "none";
		}
	}
}
  
}