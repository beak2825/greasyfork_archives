// ==UserScript==
// @name				Landmark Loader
// @description 		Loads and generatates Places from a DB table
// @match 				https://www.waze.com/*editor*
// @match 				https://beta.waze.com/*editor*
// @grant				GM_xmlhttpRequest
// @version 			1.33
// @copyright			2020-2025, pvo11
// @namespace			https://greasyfork.org/en/scripts/395643-landmark-loader
// @downloadURL https://update.greasyfork.org/scripts/395643/Landmark%20Loader.user.js
// @updateURL https://update.greasyfork.org/scripts/395643/Landmark%20Loader.meta.js
// ==/UserScript==

const db_server = 'http://jsdi.wazer.cz:8090';

const LockRank = 3; // L4
const CountryID = 57; // Czech republic

var uOpenLayers;
var uWaze;
var epsg900913; 	// Google Spherical Mercator Projection
var epsg4326;		// WGS 84
var userName;


var selTypes = {
	"-": "------------------------",
	přejezdy: "přejezdy",
	rybníky: "rybníky",
	řeky: "řeky",
	lesy: "lesy",
	ostrovy: "ostrovy",
	rampy: "rampy (Škoda auto)",
	//	cez: "nabíjecí stanice ČEZ",
	//	eon: "nabíjecí stanice E.ON",
	//	pre: "nabíjecí stanice PRE",
	//	wedo_b: "WE|DO BOXy",
	//	wedo_p: "WE|DO POINTy",
	dibavod: "nové vodní plochy"
};


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
	getId("llStatus").style.color = "black";
	getId("llStatus").innerHTML = 'načítám ...';
	var data;
	if (url === "l-delete") {
		data = JSON.stringify({dupl:param, user: userName, type: getId("selLLtype").value, okres: getId("inLLOkres").value});
	} else if (url === "l-mark") {
		data = JSON.stringify({user: userName, type: getId("selLLtype").value, id: repData.id});
	} else {
		data = JSON.stringify({user: userName, type: getId("selLLtype").value, okres: getId("inLLOkres").value});
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
				getId("llStatus").style.color = "red";
				getId("llStatus").innerHTML = 'Server response ERROR: ' + response.status + '!!!';
				getId(id).disabled = false;
				return;
			}
			var resp = response.responseText;
			var respJSON = JSON.parse(resp);
			if (respJSON[0].places != null) {
				getId("llStatus").style.color = "black";
				var txt = 'Místo načteno';
				if (respJSON[0].places[0].move == true) {
					txt += ' (posun)';
				}
				txt += '<br><small>' + respJSON[0].places[0].nazev + '</small>';
				getId("llStatus").innerHTML = txt;

				if (url === "l-delete") {
					fn(respJSON[0].places[0], id);
					return;
				}

				var alt_nazvy = [];
				if (respJSON[0].places[0].alt_nazev1 != null) {
					alt_nazvy.push(respJSON[0].places[0].alt_nazev1)
				}
				if (respJSON[0].places[0].alt_nazev2 != null) {
					alt_nazvy.push(respJSON[0].places[0].alt_nazev2)
				}
				if (respJSON[0].places[0].alt_nazev3 != null) {
					alt_nazvy.push(respJSON[0].places[0].alt_nazev3)
				}
				if (respJSON[0].places[0].alt_nazev4 != null) {
					alt_nazvy.push(respJSON[0].places[0].alt_nazev4)
				}
				respJSON[0].places[0].alt_nazvy = alt_nazvy;
				getId("btnLLMarkNo").disabled = false;
				fn(respJSON[0].places[0], id);
				return;
			} else if (respJSON[0].status != null) {
				getId("llStatus").style.color = "black";
				getId("llStatus").innerHTML = respJSON[0].status.result;
			} else if (respJSON[0].info != null) {
				fn(respJSON[0].info);
				getId("llStatus").style.color = "black";
				getId("llStatus").innerHTML = 'počty načteny';
				getId(id).disabled = false;
			} else {
				getId("llStatus").style.color = "blue";
				getId("llStatus").innerHTML = 'žádné Místo nenačteno';
				getId(id).disabled = false;
			}
		},
		ontimeout: function(response) {
			getId("llStatus").style.color = "red";
			getId("llStatus").innerHTML = 'Server timeout!!!';
			getId(id).disabled = false;
		},
		onerror: function(response) {
			getId("llStatus").style.color = "red";
			getId("llStatus").innerHTML = 'Request error!!!';
			getId(id).disabled = false;
		}
	});
}


function addPlace(data)
{
	var Landmark = require('Waze/Feature/Vector/Landmark');
	var AddLandmark = require('Waze/Action/AddLandmark');
	var UpdateFeatureAddress = require('Waze/Action/UpdateFeatureAddress');
	var OpeningHour = require('Waze/Model/Objects/OpeningHour');
	var UpdateObject = require("Waze/Action/UpdateObject");
	//	var MultiAction = require("Waze/Action/MultiAction");

	var res;
	if (data.polygon != null) {
		var r = new uOpenLayers.Format.GeoJSON();
		var p = r.read(data.polygon,  "Geometry");
		res = new Landmark({ geoJSONGeometry: uWaze.userscripts.toGeoJSONGeometry(p.transform(epsg4326, epsg900913)) });
	} else {
		res = new Landmark({ geoJSONGeometry: uWaze.userscripts.toGeoJSONGeometry(new uOpenLayers.Geometry.Point(data.lon, data.lat).transform(epsg4326, epsg900913))});
	}
	res.attributes.name = data.nazev;
	res.attributes.aliases = data.alt_nazvy;
	if (data.popis === null) {
		data.popis = "";
	}
	res.attributes.description = data.popis.replace(/\\n/g, String.fromCharCode(10));
	res.attributes.categories = data.categories;
	res.attributes.phone = data.phone;
	res.attributes.url = data.url;
	res.attributes.services = data.services;


	if (data.lock != null) {
		res.attributes.lockRank = data.lock;
	} else {
		res.attributes.lockRank = LockRank;
	}
	if (data.nav_lon != null && data.nav_lat != null ) {
		var np = new NavigationPoint(new uOpenLayers.Geometry.Point(data.nav_lon, data.nav_lat).transform(epsg4326, epsg900913));
		res.attributes.entryExitPoints.push(np)
	}
	uWaze.model.actionManager.add(new AddLandmark(res));

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
	addr.houseNumber = data.cislo;

	uWaze.model.actionManager.add(new UpdateFeatureAddress(res, addr));

	if (data.openinghours != null) {
		var  oh = [];
		for (var i = 0; i < data.openinghours.length; i++) {
			var oh1 = new OpeningHour(data.openinghours[i]);
			oh.push(oh1);
		}

		uWaze.model.actionManager.add(new UpdateObject(res, {openingHours: oh}));
	}
}


function editPlace(data, obj)
{
	var UpdateObject = require("Waze/Action/UpdateObject");
	var UpdateFeatureGeometry = require("Waze/Action/UpdateFeatureGeometry");
	var UpdateFeatureAddress = require('Waze/Action/UpdateFeatureAddress');
	var OpeningHour = require('Waze/Model/Objects/OpeningHour');
	var MultiAction = require("Waze/Action/MultiAction");

	var multiaction = new MultiAction();

	var res = {};

	if (data.move) {
		if (data.polygon != null) {
			var r = new uOpenLayers.Format.GeoJSON();
			var p = r.read(data.polygon,  "Geometry");
			multiaction.doSubAction(uWaze.model, new UpdateFeatureGeometry(obj, uWaze.model.venues, obj.getOLGeometry, uWaze.userscripts.toGeoJSONGeometry(p.transform(epsg4326, epsg900913))));
		} else {
			multiaction.doSubAction(uWaze.model, new UpdateFeatureGeometry(obj, uWaze.model.venues, obj.getOLGeometry, uWaze.userscripts.toGeoJSONGeometry(new uOpenLayers.Geometry.Point(data.lon, data.lat).transform(epsg4326, epsg900913))));
		}
	}

	if (JSON.stringify(obj.attributes.aliases) != JSON.stringify(data.alt_nazvy)) {
		res.aliases = data.alt_nazvy;
	}

	if (data.popis === null) {
		data.popis = "";
	}
	var popis = data.popis.replace(/\\n/g, String.fromCharCode(10));
	if (obj.attributes.description != popis) {
		res.description = popis;
	}

	if (obj.attributes.categories.length != 1 || obj.attributes.categories[0] != data.categories[0]) {
		res.categories = data.categories;
	}

	if (data.lock != null) {
		if (obj.attributes.lockRank != data.lock) {
			res.lockRank = data.lock;
		}
	}

	if (obj.attributes.name != data.nazev) {
		res.name = data.nazev;
	}

	if (obj.attributes.phone != data.phone) {
		res.phone = data.phone;
	}

	if (obj.attributes.url != data.url) {
		res.url = data.url;
	}

	if (obj.attributes.services != data.services) {
		res.services = data.services;
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
	if (obj.attributes.houseNumber != data.cislo) {
		addr.houseNumber = data.cislo;
	}


	multiaction.doSubAction(uWaze.model, new UpdateFeatureAddress(obj, addr));

	if (data.openinghours != null) {
		var  oh = [];
		for (var i = 0; i < data.openinghours.length; i++) {
			var oh1 = new OpeningHour(data.openinghours[i]);
			oh.push(oh1);
		}

		multiaction.doSubAction(uWaze.model, new UpdateObject(obj, {openingHours: oh}));
	}

	uWaze.model.actionManager.add(multiaction);
}


function deletePlace(obj)
{
	var DeleteObject = require("Waze/Action/DeleteObject");

	uWaze.model.actionManager.add(new DeleteObject(obj));
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
	if (getId("selLLtype").value === "přejezdy") {
		uWaze.map.getOLMap().zoomTo(20);
	} else if ((getId("selLLtype").value === "wedo_p") || (getId("selLLtype").value === "wedo_b")) {
		uWaze.map.getOLMap().zoomTo(19);
	} else {
		uWaze.map.getOLMap().zoomTo(18);
	}
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


function waitAddPlace(data, id, cnt)
{
	repData = data;
	if (cnt > 10) {
		if (cnt > 20) {
			getId("llStatus").style.color = "red";
			getId("llStatus").innerHTML += '<br>okres nenalezen!';

			repFn = jumpAddPlace;
			repId = id;
			getId("btnLLRepeat").disabled = false;
		} else {
			jump2(data);
			setTimeout(waitAddPlace, 500, data, id, cnt + 1);
			return;
		}
	} else {
		if (typeof(uWaze.model.states.objects[data.waze_id_okresu]) == 'object') {
			addPlace(data);
		} else {
			setTimeout(waitAddPlace, 500, data, id, cnt + 1);
			return;
		}
	}
	getId(id).disabled = false;
}


function jumpAddPlace(data, id)
{
	jump(data, id, waitAddPlace);
}


function newPlace()
{
	getId("btnLLRepeat").disabled = true;
	getId("btnLLMarkNo").disabled = true;
	request("btnLLNew", false, "l-new", jumpAddPlace);

}


function waitEditPlace(data, id, cnt)
{
	repData = data;
	if (cnt > 10) {
		if (cnt > 20) {
			getId("llStatus").style.color = "red";
			getId("llStatus").innerHTML += '<br>Místo nenalezeno!';

			repFn = jumpEditPlace;
			repId = id;
			getId("btnLLRepeat").disabled = false;
		} else {
			jump2(data);
			setTimeout(waitEditPlace, 500, data, id, cnt + 1);
			return;
		}
	} else {
		if (typeof(uWaze.model.venues.objects[data.wme_misto]) == 'object') {
			if (typeof(uWaze.model.states.objects[data.waze_id_okresu]) == 'object') {
				editPlace(data, uWaze.model.venues.objects[data.wme_misto]);
			} else {
				getId("llStatus").style.color = "red";
				getId("llStatus").innerHTML += '<br>okres nenalezen!';

				repFn = jumpEditPlace;
				repId = id;
				getId("btnLLRepeat").disabled = false;
			}
		} else {
			setTimeout(waitEditPlace, 500, data, id, cnt + 1);
			return;
		}
	}
	getId(id).disabled = false;
}


function jumpEditPlace(data, id)
{
	jump(data, id, waitEditPlace);
}


function wrongPlace()
{
	getId("btnLLRepeat").disabled = true;
	getId("btnLLMarkNo").disabled = true;
	if (document.getElementById('layer-switcher-group_places').checked && document.getElementById('layer-switcher-item_venues').checked) {
		request("btnLLWrong", false, "l-wrong", jumpEditPlace);
	} else {
		getId("llStatus").style.color = "red";
		getId("llStatus").innerHTML = 'Vrstva <b>Obecná místa</b> není zapnuta!';
	}
}


function waitDeletePlace(data, id, cnt)
{
	repData = data;
	if (cnt > 10) {
		if (cnt > 20) {
			getId("llStatus").style.color = "red";
			getId("llStatus").innerHTML += '<br>místo nenalezeno!';

			repFn = jumpDeletePlace;
			repId = id;
			getId("btnLLRepeat").disabled = false;
		} else {
			jump2(data);
			setTimeout(waitDeletePlace, 500, data, id, cnt + 1);
			return;
		}
	} else {
		if (typeof(uWaze.model.venues.objects[data.wme_misto]) == 'object') {
			deletePlace(uWaze.model.venues.objects[data.wme_misto]);
		} else {
			setTimeout(waitDeletePlace, 500, data, id, cnt + 1);
			return;
		}
	}
	getId(id).disabled = false;
}


function jumpDeletePlace(data, id)
{
	jump(data, id, waitDeletePlace);
}


function delInvPlace()
{
	getId("btnLLRepeat").disabled = true;
	getId("btnLLMarkNo").disabled = true;
	if (document.getElementById('layer-switcher-group_places').checked && document.getElementById('layer-switcher-item_venues').checked) {
		request("btnLLDelInv", false, "l-delete", jumpDeletePlace);
	} else {
		getId("llStatus").style.color = "red";
		getId("llStatus").innerHTML = 'Vrstva <b>Obecná místa</b> není zapnuta!';
	}
}


function delDupPlace()
{
	getId("btnLLRepeat").disabled = true;
	getId("btnLLMarkNo").disabled = true;
	if (document.getElementById('layer-switcher-group_places').checked && document.getElementById('layer-switcher-item_venues').checked) {
		request("btnLLDelDup", true, "l-delete", jumpDeletePlace);
	} else {
		getId("llStatus").style.color = "red";
		getId("llStatus").innerHTML = 'Vrstva <b>Obecná místa</b> není zapnuta!';
	}
}


function showInfo(data)
{
	if (getId("selLLtype").value === "-") {
		var s = '<b>Nedoděláno:</b>';
		for (var i=0; i<data.length; i++) {
			if (selTypes[data[i]] !== undefined) {
				s += '<br>' + selTypes[data[i]];
			}
		}
		getId("llInfo").innerHTML = s;
	} else {
		getId("llInfo").innerHTML = '<b>Zbývá</b><br>nových: ' + data.new + '<br>oprav: ' + data.wrong + '<br>chybných: ' + data.inv + '<br>duplicitních: ' + data.dupl;
	}
}


function getInfo()
{
	getId("btnLLRepeat").disabled = true;
	getId("btnLLMarkNo").disabled = true;
	request("btnLLInfo", false, "l-info", showInfo);
}


var repFn;
var repId;
var repData;

function repeat()
{
	getId("btnLLRepeat").disabled = true;
	getId("llStatus").style.color = "black";
	var txt = 'Místo znovu zpracováno';
	if (repData.move == true) {
		txt += ' (posun)';
	}
	txt += '<br><small>' + repData.nazev + '</small>';
	getId("llStatus").innerHTML = txt;
	repFn(repData, repId);

}

function markNo()
{
	request("btnLLMarkNo", false, "l-mark", null);
}

function ll_reg_kl_zkratky(actionName, callback, keyName) {
	I18n.translations[I18n.locale].keyboard_shortcuts.groups['default'].members[keyName] = actionName;
	W.accelerators.addAction(keyName, {group: 'default'});
	W.accelerators.events.register(keyName, null, callback);
	W.accelerators._registerShortcuts({["name"]: keyName});
}

function ll_obsluha_kl_zkratky(element) {
	return function() {
		document.getElementById(element).click();
	};
}

async function lLoader_init()
{

	uWaze = unsafeWindow.W;
	uOpenLayers = unsafeWindow.OpenLayers;

	epsg900913 = new uOpenLayers.Projection("EPSG:900913");
	epsg4326 = new uOpenLayers.Projection("EPSG:4326");
	userName = uWaze.loginManager.user.getUsername();

	var addon = document.createElement('section');
	addon.innerHTML = '<b><u><a href="https://greasyfork.org/en/scripts/395643-landmark-loader" target="_blank">Landmark Loader</a></u></b> &nbsp; v' + GM_info.script.version;

	var section = document.createElement('section');
	section.style.fontSize = "11px";
	section.id = "LLoader";
	section.style.marginBottom = "15px";
	section.innerHTML = '<br><br>'
		+ '<label for="inLLOkres" style="font-size:15px">Okres:&nbsp;</label><input  type="text" id="inLLOkres" onclick="this.focus();this.select()"><br><br>'
		+ '<label for="selLLtype" style="font-size:15px">Typ:&nbsp;</label><select id="selLLtype"></select><br><br>'
		+ '<button class="btn btn-primary" id="btnLLNew" >Načíst Místo</button><br><br>'
		+ '<button class="btn btn-warning" id="btnLLWrong" >Načíst opravu Místa</button><br><br>'
		+ '<button class="btn btn-pastrama" id="btnLLDelInv" >Smazat chybné Místo</button><br><br>'
		+ '<button class="btn btn-pastrama" id="btnLLDelDup" >Smazat duplicitu</button><br><br>';

	section.innerHTML += '<br><b><span id=llStatus style="font-size:20px"></span></b><br><br>'
		+ '<button class="btn btn-default" id="btnLLInfo" >Načíst počty</button><br><br>'
		+ '<br><span id=llInfo style="font-size:15px"></span><br><br>'
		+ '<button class="btn btn-primary" id="btnLLRepeat" disabled >Opakovat po chybě</button><br><br>'
		+ '<button class="btn btn-pastrama" id="btnLLMarkNo" disabled >Označit příznakem nezadávat</button><br><br>';
	addon.appendChild(section);

	const { tabLabel, tabPane } = uWaze.userscripts.registerSidebarTab("lloader");
	tabLabel.innerText = 'LL';
	tabLabel.title = 'Landmark Loader';
	tabLabel.id = "sidepanel-lloader";
	tabPane.appendChild(addon);

	await uWaze.userscripts.waitForElementConnected(tabPane);

	var selectType = getId("selLLtype");
	for (var id in selTypes) {
		var txt = selTypes[id];
		var usrOption = document.createElement('option');
		var usrText = document.createTextNode(txt);
		if (id === "-") {
			usrOption.setAttribute('selected',true);
		}
		usrOption.setAttribute('value',id);
		usrOption.appendChild(usrText);
		selectType.appendChild(usrOption);
	}

	getId("btnLLNew").onclick = newPlace;
	getId("btnLLWrong").onclick = wrongPlace;
	getId("btnLLInfo").onclick = getInfo;
	getId("btnLLDelInv").onclick = delInvPlace;
	getId("btnLLDelDup").onclick = delDupPlace;
	getId("btnLLRepeat").onclick = repeat;
	getId("btnLLMarkNo").onclick = markNo;

	// definice klavesovych zkratek
	ll_reg_kl_zkratky('Landmark Loader - načíst místo', ll_obsluha_kl_zkratky('btnLLNew'), 'll_nacist');
	ll_reg_kl_zkratky('Landmark Loader - načíst opravu místa', ll_obsluha_kl_zkratky('btnLLWrong'), 'll_oprava');
	ll_reg_kl_zkratky('Landmark Loader - načíst počty', ll_obsluha_kl_zkratky('btnLLInfo'), 'll_pocty');
	ll_reg_kl_zkratky('Landmark Loader - smazat chybné místo', ll_obsluha_kl_zkratky('btnLLDelInv'), 'll_chybne');
	ll_reg_kl_zkratky('Landmark Loader - smazat duplicitu', ll_obsluha_kl_zkratky('btnLLDelDup'), 'll_duplicita');

}

document.addEventListener("wme-map-data-loaded", lLoader_init, {once: true});

