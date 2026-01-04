// ==UserScript==
// @name				HN Loader
// @description 		Loads and generatates house numbers as Places
// @match 				https://www.waze.com/*editor*
// @match 				https://beta.waze.com/*editor*
// @grant				GM_xmlhttpRequest
// @version 			1.22
// @copyright			2019-2025, pvo11
// @namespace			https://greasyfork.org/scripts/387178-hn-loader
// @downloadURL https://update.greasyfork.org/scripts/387178/HN%20Loader.user.js
// @updateURL https://update.greasyfork.org/scripts/387178/HN%20Loader.meta.js
// ==/UserScript==

const db_server = 'http://jsdi.wazer.cz:8090';

const Categories = ["CONSTRUCTION_SITE"];
const LockRank = 3; // L4
const CountryID = 57; // Czech republic

var uOpenLayers;
var uWaze;
var epsg900913; 	// Google Spherical Mercator Projection
var epsg4326;		// WGS 84
var userName;



class NavigationPoint
{
	constructor(point){
		this._point = point.clone();
		this._entry = true;
		this._exit = true;
		this._isPrimary = true;
		this._name = "";
	}

	with(){
		var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
		if(e.point == null) {
			e.point = this.toJSON().point;
		}
		return new this.constructor((this.toJSON().point, e.point));
	}

	getPoint(){
		return this._point.clone();
	}

	getEntry(){
		return this._entry;
	}

	getExit(){
		return this._exit;
	}

	getName(){
		return this._name;
	}

	isPrimary(){
		return this._isPrimary;
	}

	toJSON(){
		return	{
			point: this._point,
			entry: this._entry,
			exit: this._exit,
			primary: this._isPrimary,
			name: this._name
		};
	}

	clone(){
		return this.with();
	}
}


function getId(node)
{
	return document.getElementById(node);
}


function getElementsByClassName(classname, node)
{
	if(!node) {
		node = document.getElementsByTagName("body")[0];
	}
	var a = [];
	var re = new RegExp('\\b' + classname + '\\b');
	var els = node.getElementsByTagName("*");
	for (var i=0,j=els.length; i<j; i++) {
		if (re.test(els[i].className)) {
			a.push(els[i]);
		}
	}
	return a;
}


function request(id, param, url, fn)
{
	getId(id).disabled = true;
	getId("hnStatus").style.color = "black";
	getId("hnStatus").innerHTML = 'načítám ...';
	var data;
	if (url === "delete") {
		data = JSON.stringify({dupl:param, user: userName, okres: getId("inHNOkres").value});
	} else if (param) {
		var extent = uWaze.map.getExtent();
		var pLB = new uOpenLayers.Geometry.Point(extent[0], extent[3]);
		var pRT = new uOpenLayers.Geometry.Point(extent[2], extent[1]);
		data = JSON.stringify({l:pLB.x, r:pRT.x, t:pRT.y, b:pLB.y, user: userName, okres: getId("inHNOkres").value});
	} else {
		data = JSON.stringify({user: userName, okres: getId("inHNOkres").value});
	}

	GM_xmlhttpRequest({
		method: "POST",
		url: db_server + '/' + url,
		data: data,
		headers: {
			'Content-Type': 'application/json',
		},
		onload: function(response) {
			if (response.status != 200) {
				getId("hnStatus").style.color = "red";
				getId("hnStatus").innerHTML = 'Server response ERROR: ' + response.status + '!!!';
				getId(id).disabled = false;
				return;
			}
			var resp = response.responseText;
			var respJSON = JSON.parse(resp);
			if (respJSON[0].hns != null) {
				getId("hnStatus").style.color = "black";
				var num = respJSON[0].hns.length;
				var txt;
				if ((num >= 2) && (num <= 4)) {
					txt = 'načtena';
				} else {
					txt = 'načteno';
				}
				txt += ' ' + num + ' ';
				if (num == 1) {
					txt += 'číslo';
				} else if ((num >= 2) && (num <= 4)) {
					txt += 'čísla';
				} else {
					txt += 'čísel';
				}
				if (respJSON[0].hns[0].move == true) {
					txt += ' (posun)';
				}
				txt += '<br><small>' + respJSON[0].hns[0].nazev + '</small>';
				getId("hnStatus").innerHTML = txt;

				if (url === "delete") {
					fn(respJSON[0].hns[0], id);
					return;
				}

				for (var i = 0; i < num; i++) {
					var hn = respJSON[0].hns[i];
					hn.alt_nazvy = [];
					if (hn.alt_nazev1 != null) {
						hn.alt_nazvy.push(hn.alt_nazev1)
					}
					if (hn.alt_nazev2 != null) {
						hn.alt_nazvy.push(hn.alt_nazev2)
					}
					if (hn.alt_nazev3 != null) {
						hn.alt_nazvy.push(hn.alt_nazev3)
					}
					if (hn.alt_nazev4 != null) {
						hn.alt_nazvy.push(hn.alt_nazev4)
					}
					if (param) {
						fn(hn);
					} else {
						fn(respJSON[0].hns[0], id);
						return;
					}
				}
				getId(id).disabled = false;
			} else if (respJSON[0].info != null) {
				fn(respJSON[0].info);
				getId("hnStatus").style.color = "black";
				getId("hnStatus").innerHTML = 'počty načteny';
				getId(id).disabled = false;
			} else {
				getId("hnStatus").style.color = "blue";
				getId("hnStatus").innerHTML = 'žádné číslo nenačteno';
				getId(id).disabled = false;
			}
		},
		ontimeout: function(response) {
			getId("hnStatus").style.color = "red";
			getId("hnStatus").innerHTML = 'Server timeout!!!';
			getId(id).disabled = false;
		},
		onerror: function(response) {
			getId("hnStatus").style.color = "red";
			getId("hnStatus").innerHTML = 'Request error!!!';
			getId(id).disabled = false;
		}
	});
}


function addHN(data)
{
	var Landmark = require('Waze/Feature/Vector/Landmark');
	var AddLandmark = require('Waze/Action/AddLandmark');
	var UpdateFeatureAddress = require('Waze/Action/UpdateFeatureAddress');

	var res = new Landmark({ geoJSONGeometry: uWaze.userscripts.toGeoJSONGeometry(new uOpenLayers.Geometry.Point(data.lon, data.lat).transform(epsg4326, epsg900913))});
	res.attributes.name = data.nazev;
	res.attributes.aliases = data.alt_nazvy;
	res.attributes.description = data.popis.replace(/\\n/g, String.fromCharCode(10));
	res.attributes.categories = Categories;
	res.attributes.lockRank = LockRank;
	if (data.nav_lon != null && data.nav_lat != null ) {
		var np = new NavigationPoint(uWaze.userscripts.toGeoJSONGeometry(new uOpenLayers.Geometry.Point(data.nav_lon, data.nav_lat).transform(epsg4326, epsg900913)));
		res.attributes.entryExitPoints.push(np)
	}
	uWaze.model.actionManager.add(new AddLandmark(res));

	var addr = {};
	addr.countryID = CountryID;
	addr.stateID = data.waze_id_okresu;
	if (data.obec == "" || data.obec == null) {
		addr.cityName = null;
		addr.emptyCity = true;
	} else {
		addr.cityName = data.obec;
		addr.emptyCity = false;
	}
	if (data.ulice == "" || data.ulice == null) {
		addr.streetName = null;
		addr.emptyStreet = true;
	} else {
		addr.streetName = data.ulice;
		addr.emptyStreet = false;
	}

	uWaze.model.actionManager.add(new UpdateFeatureAddress(res, addr));
}


function editHN(data, obj)
{
	var UpdateObject = require("Waze/Action/UpdateObject");
	var UpdateFeatureGeometry = require("Waze/Action/UpdateFeatureGeometry");
	var UpdateFeatureAddress = require('Waze/Action/UpdateFeatureAddress');
	var MultiAction = require("Waze/Action/MultiAction");

	var multiaction = new MultiAction();

	var res = {};

	if (data.move) {
		multiaction.doSubAction(uWaze.model, new UpdateFeatureGeometry(obj, uWaze.model.venues, obj.getOLGeometry, uWaze.userscripts.toGeoJSONGeometry(new uOpenLayers.Geometry.Point(data.lon, data.lat).transform(epsg4326, epsg900913))));
	}

	//	if (JSON.stringify(obj.attributes.aliases) != JSON.stringify(data.alt_nazvy)) {
	res.aliases = data.alt_nazvy;
	//	}

	var popis = data.popis.replace(/\\n/g, String.fromCharCode(10));
	if (obj.attributes.description != popis) {
		res.description = popis;
	}

	if (obj.attributes.categories.length != 1 || obj.attributes.categories[0] != Categories[0]) {
		res.categories = Categories;
	}

	if (obj.attributes.lockRank != LockRank) {
		res.lockRank = LockRank;
	}
	if (typeof(obj.attributes.houseNumber) !== "undefined" || obj.attributes.houseNumber == '') {
		res.houseNumber = '';
	}

	if (obj.attributes.name != data.nazev) {
		res.name = data.nazev;
	}


	if (!jQuery.isEmptyObject(res)) {
		multiaction.doSubAction(uWaze.model, new UpdateObject(obj, res));
	}

	var addr = {};
	addr.countryID = CountryID;
	addr.stateID = data.waze_id_okresu
	if (data.obec == "" || data.obec == null) {
		addr.cityName = null;
		addr.emptyCity = true;
	} else {
		addr.cityName = data.obec;
		addr.emptyCity = false;
	}
	if (data.ulice == "" || data.ulice == null) {
		addr.streetName = null;
		addr.emptyStreet = true;
	} else {
		addr.streetName = data.ulice;
		addr.emptyStreet = false;
	}
	multiaction.doSubAction(uWaze.model, new UpdateFeatureAddress(obj, addr));

	uWaze.model.actionManager.add(multiaction);
}


function deleteHN(obj)
{
	var DeleteObject = require("Waze/Action/DeleteObject");

	uWaze.model.actionManager.add(new DeleteObject(obj));
}


function loadHNs()
{
	request("btnHNLoad", true, "rect", addHN);
}


function jump(data, id, fn)
{
	var p;
	if (data.wme_lon != null && data.wme_lat != null) {
		p = uOpenLayers.Layer.SphericalMercator.forwardMercator(data.wme_lon, data.wme_lat);
	} else {
		p = uOpenLayers.Layer.SphericalMercator.forwardMercator(data.lon, data.lat);
	}

	uWaze.map.setCenter(p);
	uWaze.map.getOLMap().zoomTo(20)
	fn(data, id, 0);
}


function jump2(data)
{
	if (data.wme_lon != null && data.wme_lat != null) {
		uOpenLayers.Layer.SphericalMercator.forwardMercator(data.wme_lon + 0.0001, data.wme_lat + 0.0001);
	} else {
		uOpenLayers.Layer.SphericalMercator.forwardMercator(data.lon + 0.0001, data.lat + 0.0001);
	}
}


function waitAddHN(data, id, cnt)
{
	if (cnt > 10) {
		if (cnt > 20) {
			getId("hnStatus").style.color = "red";
			getId("hnStatus").innerHTML += '<br>okres nenalezen!';
		} else {
			jump2(data);
			setTimeout(waitAddHN, 500, data, id, cnt + 1);
			return;
		}
	} else {
		if (typeof(uWaze.model.states.objects[data.waze_id_okresu]) == 'object') {
			addHN(data);
		} else {
			setTimeout(waitAddHN, 500, data, id, cnt + 1);
			return;
		}
	}
	getId(id).disabled = false;
}


function jumpAddHN(data, id)
{
	jump(data, id, waitAddHN);
}


function newHN()
{
	request("btnHNNew", false, "new", jumpAddHN);

}


function waitEditHN(data, id, cnt)
{
	if (cnt > 10) {
		if (cnt > 20) {
			getId("hnStatus").style.color = "red";
			getId("hnStatus").innerHTML += '<br>místo s čislem nenalezeno!';
		} else {
			jump2(data);
			setTimeout(waitEditHN, 500, data, id, cnt + 1);
			return;
		}
	} else {
		if (typeof(uWaze.model.venues.objects[data.wme_misto]) == 'object') {
			editHN(data, uWaze.model.venues.objects[data.wme_misto]);
		} else {
			setTimeout(waitEditHN, 500, data, id, cnt + 1);
			return;
		}
	}
	getId(id).disabled = false;
}


function jumpEditHN(data, id)
{
	jump(data, id, waitEditHN);
}


function wrongHN()
{
	if (document.getElementById('layer-switcher-group_places').checked && document.getElementById('layer-switcher-item_venues').checked) {
		request("btnHNWrong", false, "wrong", jumpEditHN);
	} else {
		getId("hnStatus").style.color = "red";
		getId("hnStatus").innerHTML = 'Vrstva <b>Obecná místa</b> neni zapnuta!';
	}
}


function waitDeleteHN(data, id, cnt)
{
	if (cnt > 10) {
		if (cnt > 20) {
			getId("hnStatus").style.color = "red";
			getId("hnStatus").innerHTML += '<br>místo s čislem nenalezeno!';
		} else {
			jump2(data);
			setTimeout(waitAddHN, 500, data, id, cnt + 1);
			return;
		}
	} else {
		if (typeof(uWaze.model.venues.objects[data.wme_misto]) == 'object') {
			deleteHN(uWaze.model.venues.objects[data.wme_misto]);
		} else {
			setTimeout(waitDeleteHN, 500, data, id, cnt + 1);
			return;
		}
	}
	getId(id).disabled = false;
}


function jumpDeleteHN(data, id)
{
	jump(data, id, waitDeleteHN);
}


function delInvHN()
{
	if (document.getElementById('layer-switcher-group_places').checked && document.getElementById('layer-switcher-item_venues').checked) {
		request("btnHNDelInv", false, "delete", jumpDeleteHN);
	} else {
		getId("hnStatus").style.color = "red";
		getId("hnStatus").innerHTML = 'Vrstva <b>Obecná místa</b> není zapnuta!';
	}
}


function delDupHN()
{
	if (document.getElementById('layer-switcher-group_places').checked && document.getElementById('layer-switcher-item_venues').checked) {
		request("btnHNDelDup", true, "delete", jumpDeleteHN);
	} else {
		getId("hnStatus").style.color = "red";
		getId("hnStatus").innerHTML = 'Vrstva <b>Obecná místa</b> není zapnuta!';
	}
}


function showInfo(data)
{
	getId("hnInfo").innerHTML = '<b>Zbývá</b><br>nových: ' + data.new + '<br>oprav: ' + data.wrong + '<br>chybných: ' + data.inv + '<br>duplicitních: ' + data.dupl;
}


function getInfo()
{
	request("btnHNInfo", false, "info", showInfo);
}


function hnl_reg_kl_zkratky(actionName, callback, keyName) {
	I18n.translations[I18n.locale].keyboard_shortcuts.groups['default'].members[keyName] = actionName;
	W.accelerators.addAction(keyName, {group: 'default'});
	W.accelerators.events.register(keyName, null, callback);
	W.accelerators._registerShortcuts({["name"]: keyName});
}


function hnl_obsluha_kl_zkratky(element) {
	return function() {
		document.getElementById(element).click();
	};
}


async function hnLoader_init()
{

	uWaze = unsafeWindow.W;
	uOpenLayers = unsafeWindow.OpenLayers;

	epsg900913 = new uOpenLayers.Projection("EPSG:900913");
	epsg4326 = new uOpenLayers.Projection("EPSG:4326");
	userName = uWaze.loginManager.user.getUsername();

	var addon = document.createElement('section');
	addon.innerHTML = '<b><u><a href="https://greasyfork.org/en/scripts/387178-hn-loader" target="_blank">HN Loader</a></u></b> &nbsp; v' + GM_info.script.version;

	var section = document.createElement('section');
	section.style.fontSize = "11px";
	section.id = "HNLoader";
	section.style.marginBottom = "15px";
	section.innerHTML = '<br><br>'
		+ '<label for="inHNOkres" style="font-size:15px">Okres:&nbsp;</label><input  type="text" id="inHNOkres" onclick="this.focus();this.select()"><br><br>'
		+ '<button class="btn btn-success" id="btnHNLoad">Načíst čísla v zobrazené oblasti</button><br><br>'
		+ '<button class="btn btn-primary" id="btnHNNew" >Načíst nové číslo</button><br><br>'
		+ '<button class="btn btn-warning" id="btnHNWrong" >Načíst opravu čísla</button><br><br>'
		+ '<button class="btn btn-pastrama" id="btnHNDelInv" >Smazat chybné číslo</button><br><br>'
		+ '<button class="btn btn-pastrama" id="btnHNDelDup" >Smazat duplicitu</button><br><br>'
		+ '<br><b><span id=hnStatus style="font-size:20px"></span></b><br><br>'
	//		+ '<u><a href="https://docs.google.com/spreadsheets/d/1Sfc0ii_okhg_X5UiX2Yf0lHTYCuAk7JmRp1XkIQAJX0/edit?usp=sharing" target="_blank">Tabulka pro rezervaci okresů</a></u><br><br>'
		+ '<button class="btn btn-default" id="btnHNInfo" >Načíst počty</button><br><br>'
		+ '<br><span id=hnInfo style="font-size:15px"></span><br><br>';
	addon.appendChild(section);

	const { tabLabel, tabPane } = uWaze.userscripts.registerSidebarTab("hnloader");
	tabLabel.innerText = 'HNL';
	tabLabel.title = 'HN Loader';
	tabLabel.id = "sidepanel-hnloader";
	tabPane.appendChild(addon);

	await uWaze.userscripts.waitForElementConnected(tabPane);

	getId("btnHNLoad").onclick = loadHNs;
	getId("btnHNNew").onclick = newHN;
	getId("btnHNWrong").onclick = wrongHN;
	getId("btnHNInfo").onclick = getInfo;
	getId("btnHNDelInv").onclick = delInvHN;
	getId("btnHNDelDup").onclick = delDupHN;

	// definice klavesovych zkratek
	hnl_reg_kl_zkratky('HN Loader - načíst oblast', hnl_obsluha_kl_zkratky('btnHNLoad'), 'hnl_oblast');
	hnl_reg_kl_zkratky('HN Loader - načíst číslo', hnl_obsluha_kl_zkratky('btnHNNew'), 'hnl_nacist');
	hnl_reg_kl_zkratky('HN Loader - načíst opravu čísla', hnl_obsluha_kl_zkratky('btnHNWrong'), 'hnl_oprava');
	hnl_reg_kl_zkratky('HN Loader - nnačístt počty', hnl_obsluha_kl_zkratky('btnHNInfo'), 'hnl_pocty');
	hnl_reg_kl_zkratky('HN Loader - smazat chybné číslo', hnl_obsluha_kl_zkratky('btnHNDelInv'), 'hnl_chybne');
	hnl_reg_kl_zkratky('HN Loader - smazat duplicitu', hnl_obsluha_kl_zkratky('btnHNDelDup'), 'hnl_duplicita');

}


function hnLoader_bootstrap()
{
	uWaze = unsafeWindow.W;
	uOpenLayers = unsafeWindow.OL;

	if ((typeof(uWaze) === 'undefined') || (typeof(uWaze.model) === 'undefined') || (typeof(uWaze.model.countries.objects) === 'undefined') || (Object.keys(uWaze.model.countries.objects).length === 0)) {
		setTimeout(hnLoader_bootstrap, 500);
	} else {
		hnLoader_init();
	}
}


document.addEventListener("wme-map-data-loaded", hnLoader_init, {once: true});


