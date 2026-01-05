// ==UserScript==
// @name           hwm_links_to_auction
// @description    Shows some links to offers in auction (2021.11.18)
// @version        2.30
// @include        http://178.248.235.15/auction.php
// @include	   http://178.248.235.15/auction.php?cat=my*
// @include        https://www.heroeswm.ru/auction.php
// @include	   https://www.heroeswm.ru/auction.php?cat=my*
// @include        https://www.lordswm.com/auction.php
// @include	   https://www.lordswm.com/auction.php?cat=my*
// @icon           	https://app.box.com/representation/file_version_34029013909/image_2048/1.png?shared_name=hz97b2qwo2ycc5ospb7ccffn13w3ehc4
// @license        GPL-3.0+
// @namespace ee3188f25b047f7229cc78df2e732ef3
// @downloadURL https://update.greasyfork.org/scripts/18926/hwm_links_to_auction.user.js
// @updateURL https://update.greasyfork.org/scripts/18926/hwm_links_to_auction.meta.js
// ==/UserScript==
(function () {
var version	= "2.30";
var elements = new Array('abrasive', 'snake_poison', 'tiger_tusk', 'ice_crystal', 'moon_stone', 'fire_crystal', 'meteorit', 'witch_flower', 'wind_flower', 'fern_flower', 'badgrib');
var res = {
	'b_wood'	: 1,
	'b_ore'		: 2,
	'b_mercury'	: 3,
	'b_sulphur'	: 4,
	'b_crystal'	: 5,
	'b_gem'		: 6
	};
var sectors = {
	"Empire Capital":"01",
	"East River":"02",
	"Tiger Lake":"03",
	"Rogues` Wood":"04",
	"Wolf Dale":"05",
	"Peaceful Camp":"06",
	"Lizard Lowland":"07",
	"Green Wood":"08",
	"Eagle Nest":"09",
	"Portal Ruins":"10",
	"Dragons` Caves":"11",
	"Shining Spring":"12",
	"Sunny Sity":"13",
	"Magma Mines":"14",
	"Bear Mountain":"15",
	"Fairy Trees":"16",
	"Harbour City":"17",
	"Mithril Coast":"18",
	"GreatWall":"19",
	"Titans` Valley":"20",
	"Fishing Village":"21",
	"Kingdom Capital":"22",
	"Ungovernable Steppe":"23",
	"Crystal Garden":"24",
	"East Island":"25",
	"Wilderness":"26",
	"Sublime Arbor":"27"
};

var type_arts, art, search_s, elem, link_art, bool_el;
var ems2, ems;
ems = document.querySelectorAll( "b > a[href*='auction_lot_protocol.php']");		//Ї®«гзЁ«Ё ¬ ббЁў ўлбв ў«Ґ­­ле «®в®ў
for (var i=0;i<ems.length;i++) {
	elem = ems[i].parentNode.parentNode.parentNode.childNodes[0].childNodes[0].childNodes[0];
	while ((elem.tagName == 'DIV') && (elem.childElementCount>0)) elem=elem.childNodes[0];
	elem=elem.parentNode.childNodes[1];
	if (elem.tagName == 'img'){							//аҐбл Ё н«Ґ¬Ґ­вл
		art = elem.getAttribute('src');
	        art = art.substring(art.lastIndexOf("/")+1,art.length-4);
		bool_el = false;
		for (var j=0;j<elements.length;j++) if (elements[j] == art) bool_el = true;
		if (bool_el)			link_art = location.protocol+'//'+location.hostname+'/auction.php?cat=elements&art_type='+art;
		else	if (res[art] != null)	link_art = location.protocol+'//'+location.hostname+'/auction.php?cat=res&type='+res[art];
			else	if (art == 'house_cert'){
					ems2 = ems[i].parentNode.parentNode.childNodes[3].data.replace(/(^\s+|\s+$)/g,'');
					link_art = location.protocol+'//'+location.hostname+'/auction.php?cat=cert&sort=0&art_type=sec_'+sectors[ems2];
				}
	} else {
		if (elem.tagName == 'A'){							//Їа®бвлҐ  авл
			art = elem.getAttribute('href');
			if  (art.indexOf("&") !=-1) 	art = art.substring(art.indexOf("=")+1,art.indexOf("&"))
			else 				art = art.substring(art.indexOf("=")+1);
		}
		if (elem.tagName == 'TABLE'){    						//б«®¦­®б®бв ў­лҐ Ё«Ё Ё¬Ґ­­лҐ  авл
			elem = elem.childNodes[0].childNodes[0].childNodes[0].childNodes[0];
			if (elem.tagName == 'TABLE') {						//б«®¦­®б®бв ў­лҐ Ё¬Ґ­­лҐ  авл
				elem = elem.childNodes[0].childNodes[0].childNodes[0].childNodes[0];
			}
			art = elem.getAttribute('href');
		        art = art.substring(art.indexOf("=")+1,art.indexOf("&"));
		}
		search_s = "option[value*='"+art+"']";
		ems2 = document.querySelectorAll(search_s);
		if (ems2.length > 0) {
			type_arts = ems2[0].getAttribute('value');
			type_arts = type_arts.substring(0,type_arts.indexOf("#"));
			link_art = location.protocol+'//'+location.hostname+'/auction.php?cat='+type_arts+'&art_type='+art;
		}
	}
	elem = ems[i].parentNode.parentNode;
	elem.appendChild(document.createElement('br'));
	var newa = document.createElement('a');
	newa.innerHTML = '<B>HA PblHOK</B> &gt;&gt;';
	newa.href = link_art;
	newa.setAttribute('class', 'pi');
	elem.appendChild(newa);
}
})();