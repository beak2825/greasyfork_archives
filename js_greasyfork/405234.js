// ==UserScript==
// @name		Private - SK WMS layers
// @version		2020.10.01
// @authorCZ		petrjanik, d2-mac, MajkiiTelini, hamilnes
// @description		Displays layers from Slovak WMS services in WME
// @include		/^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor.*$/
// @run-at		document-end
// @namespace		https://greasyfork.org/cs/users/587499
// @downloadURL https://update.greasyfork.org/scripts/405234/Private%20-%20SK%20WMS%20layers.user.js
// @updateURL https://update.greasyfork.org/scripts/405234/Private%20-%20SK%20WMS%20layers.meta.js
// ==/UserScript==

var WMSLayersTechSource = {};
var W;
var OL;
var I18n;
init();

function init(e) {
	W = unsafeWindow.W;
	OL = unsafeWindow.OpenLayers;
	I18n = unsafeWindow.I18n;
	if (e && e.user === null) {
		return;
	}
	if (typeof W === "undefined" || typeof W.loginManager === "undefined") {
		setTimeout(init, 100);
		return;
	}
	if (!W.loginManager.user) {
		W.loginManager.events.register("login", null, init);
		W.loginManager.events.register("loginStatus", null, init);
	}
	if (document.getElementById("layer-switcher") === null && document.getElementById("layer-switcher-group_display") === null) {
		setTimeout(init, 200);
		return;
	}
	WMSLayersTechSource.tileSizeG = new OL.Size(512,512);
	WMSLayersTechSource.resolutions =	 [156543.03390625,
										  78271.516953125,
										  39135.7584765625,
										  19567.87923828125,
										  9783.939619140625,
										  4891.9698095703125,
										  2445.9849047851562,
										  1222.9924523925781,
										  611.4962261962891,
										  305.74811309814453,
										  152.87405654907226,
										  76.43702827453613,
										  38.218514137268066,
										  19.109257068634033,
										  9.554628534317017,
										  4.777314267158508,
										  2.388657133579254,
										  1.194328566789627,
										  0.5971642833948135,
										  0.298582141697406,
										  0.149291070848703,
										  0.0746455354243515,
										  0.0373227677121757
										 ];
	// adresy WMS služeb
	var service_wms_cdb_cesty = {"type" : "WMS", "url" : "https://ismcs.cdb.sk/inspire/services/FREE/WMS_ReferencnaSiet/MapServer/WMSServer?", "attribution" : "© CDB", "comment" : "CDB - cestná sieť"};
	var service_wms_cdb_objekty = {"type" : "WMS", "url" : "http://ismcs.cdb.sk/inspire/services/FREE/WMS_CestneObjekty/MapServer/WMSServer?", "attribution" : "© CDB", "comment" : "CDB - cestné objekty"};
	var service_wms_orto = {"type" : "WMS", "url" : "https://zbgisws.skgeodesy.sk/zbgis_ortofoto_wms/service.svc/get?", "attribution" : "© GKÚ, NLC; r.2017 - 2019", "comment" : "Geoportál ZBGIS - Ortofotomozaika"};
	var service_wms_hranice = {"type" : "WMS", "url" : "https://zbgisws.skgeodesy.sk/zbgis_administrativne_hranice_wms_featureinfo/service.svc/get?", "attribution" : "© GKÚ Bratislava; r. 2017", "comment" : "Geoportál ZBGIS - Administratívne hranice"};
	var service_wms_geonames = {"type" : "WMS", "url" : "https://zbgisws.skgeodesy.sk/zbgis_geograficke_nazvoslovie_wms/service.svc/get?", "attribution" : "© GKÚ Bratislava; r. 2017", "comment" : "Geoportál ZBGIS - Geografické názvoslovie"};
	var service_wms_katastr = {"type" : "WMS", "url" : "https://kataster.skgeodesy.sk/eskn/services/NR/kn_wms_orto/MapServer/WmsServer?", "attribution" : "© ÚGKK SR; r. 2015", "comment" : "Geoportál ZBGIS - Služba WMS - Parcely C (SJTSK aj Web Mercator)"};
	var service_wms_nlc = {"type" : "WMS", "url" : "https://gis.nlcsk.org/arcgis/services/Inspire/LesneCesty/MapServer/WMSServer?", "attribution" : "© NLC SR, r. 2010", "comment" : "NLC SR - Lesné cesty"};
	var service_wms_nipi = {"type" : "WMS", "url" : "http://maps.geop.sazp.sk/atlassr/wms?", "attribution" : "© SOPSR", "comment" : "SAZP - Kamiony za 24h"};
	var service_wms_zbgis = {"type" : "WMS", "url" : "https://zbgisws.skgeodesy.sk/zbgis_wms_featureinfo/service.svc/get?", "attribution" : "© GKÚ Bratislava; r. 2017", "comment" : "Geoportál ZBGIS - všetky kategórie"};
	var service_wms_zeleznice = {"type" : "WMS", "url" : "https://gisgeo.zsr.sk/geoserver/public/wms?", "attribution" : "© ŽSR", "comment" : "WMS - ŽSR verejná"};
	var service_wms_sazp = {"type" : "WMS", "url" : "http://maps.geop.sazp.sk/sopsr/wms?", "attribution" : "© Štátna ochrana prírody Slovenskej Republiky", "comment" : "SAZP - Chránené územia"};
    //adresy MapTile služeb
	var service_xyz_livemap = {"type" : "XYZ", "url" : ["https://worldtiles1.waze.com/tiles/${z}/${x}/${y}.png", "https://worldtiles2.waze.com/tiles/${z}/${x}/${y}.png", "https://worldtiles3.waze.com/tiles/${z}/${x}/${y}.png"],
							   "attribution" : "© 2006-2017 Waze Mobile. Všechna práva vyhrazena. <a href='https://www.waze.com/legal/notices' target='_blank'>Poznámky</a>", "comment" : "Waze Livemapa"};
	var service_xyz_google = {"type" : "XYZ", "url" : ["https://mts0.googleapis.com/vt/lyrs=m&x=${x}&y=${y}&z=${z}", "https://mts1.googleapis.com/vt/lyrs=m&x=${x}&y=${y}&z=${z}", "https://mts2.googleapis.com/vt/lyrs=m&x=${x}&y=${y}&z=${z}", "https://mts3.googleapis.com/vt/lyrs=m&x=${x}&y=${y}&z=${z}"],
							  "attribution" : "Mapová data ©2017 GeoBasis-DE/BKG (©2009),Google <a href='https://www.google.com/intl/cs_cz/help/terms_maps.html' target='_blank'>Smluvní podmínky</a>", "comment" : "Google Mapy"};
	var service_xyz_google_terrain = {"type" : "XYZ", "url" : ["https://mts0.googleapis.com/vt/lyrs=p&x=${x}&y=${y}&z=${z}", "https://mts1.googleapis.com/vt/lyrs=p&x=${x}&y=${y}&z=${z}", "https://mts2.googleapis.com/vt/lyrs=p&x=${x}&y=${y}&z=${z}", "https://mts3.googleapis.com/vt/lyrs=p&x=${x}&y=${y}&z=${z}"],
									  "attribution" : "Mapová data ©2017 GeoBasis-DE/BKG (©2009),Google <a href='https://www.google.com/intl/cs_cz/help/terms_maps.html' target='_blank'>Smluvní podmínky</a>", "comment" : "Google Terénní Mapy"};
	var service_xyz_google_hybrid = {"type" : "XYZ", "url" : ["https://mts0.googleapis.com/vt/lyrs=y&x=${x}&y=${y}&z=${z}", "https://mts1.googleapis.com/vt/lyrs=y&x=${x}&y=${y}&z=${z}", "https://mts2.googleapis.com/vt/lyrs=y&x=${x}&y=${y}&z=${z}", "https://mts3.googleapis.com/vt/lyrs=y&x=${x}&y=${y}&z=${z}"],
									 "attribution" : "Snímky ©2017 Landsat / Copernicus, Google, GEODIS Brno, Mapová data ©2017 GeoBasis-DE/BKG (©2009),Google <a href='https://www.google.com/intl/cs_cz/help/terms_maps.html' target='_blank'>Smluvní podmínky</a>", "comment" : "Google Hybridní Mapy"};
	var service_xyz_google_streetview = {"type" : "XYZ", "url" : ["https://mts0.google.com/mapslt?lyrs=svv&&x=${x}&y=${y}&z=${z}&style=40", "https://mts1.google.com/mapslt?lyrs=svv&&x=${x}&y=${y}&z=${z}&style=40", "https://mts2.google.com/mapslt?lyrs=svv&&x=${x}&y=${y}&z=${z}&style=40", "https://mts3.google.com/mapslt?lyrs=svv&&x=${x}&y=${y}&z=${z}&style=40"],
										 "attribution" : "Google <a href='https://www.google.com/intl/cs_cz/help/terms_maps.html' target='_blank'>Smluvní podmínky</a>", "comment" : "Google Streetview"};
	var service_xyz_osm = {"type" : "XYZ", "maxZoom" : 20, "url" : ["https://a.tile.openstreetmap.org/${z}/${x}/${y}.png","https://b.tile.openstreetmap.org/${z}/${x}/${y}.png","https://c.tile.openstreetmap.org/${z}/${x}/${y}.png"],
						   "attribution" : "© Přispěvatelé<a href='http://www.openstreetmap.org/copyright' target='_blank'>OpenStreetMap</a>", "comment" : "OpenStreetMapy"};
	var service_xyz_here = {"type" : "XYZ", "maxZoom" : 20,
							"url" : ["https://1.base.maps.cit.api.here.com/maptile/2.1/maptile/newest/normal.day/${z}/${x}/${y}/256/png8?token=TrLJuXVK62IQk0vuXFzaig%3D%3D&requestid=yahoo.prod&app_id=eAdkWGYRoc4RfxVo0Z4B",
									 "https://2.base.maps.cit.api.here.com/maptile/2.1/maptile/newest/normal.day/${z}/${x}/${y}/256/png8?token=TrLJuXVK62IQk0vuXFzaig%3D%3D&requestid=yahoo.prod&app_id=eAdkWGYRoc4RfxVo0Z4B",
									 "https://3.base.maps.cit.api.here.com/maptile/2.1/maptile/newest/normal.day/${z}/${x}/${y}/256/png8?token=TrLJuXVK62IQk0vuXFzaig%3D%3D&requestid=yahoo.prod&app_id=eAdkWGYRoc4RfxVo0Z4B",
									 "https://4.base.maps.cit.api.here.com/maptile/2.1/maptile/newest/normal.day/${z}/${x}/${y}/256/png8?token=TrLJuXVK62IQk0vuXFzaig%3D%3D&requestid=yahoo.prod&app_id=eAdkWGYRoc4RfxVo0Z4B"],
							"attribution" : "© Here, EuroGeographics <a href='https://legal.here.com/cz-cs/terms/serviceterms/' target='_blank'>Podmínky</a>", "comment" : "Here Mapy"};
	var service_xyz_here_orto = {"type" : "XYZ", "maxZoom" : 20,
								 "url" : ["https://1.aerial.maps.cit.api.here.com/maptile/2.1/maptile/newest/satellite.day/${z}/${x}/${y}/256/jpg?token=TrLJuXVK62IQk0vuXFzaig%3D%3D&requestid=yahoo.prod&app_id=eAdkWGYRoc4RfxVo0Z4B",
										  "https://2.aerial.maps.cit.api.here.com/maptile/2.1/maptile/newest/satellite.day/${z}/${x}/${y}/256/jpg?token=TrLJuXVK62IQk0vuXFzaig%3D%3D&requestid=yahoo.prod&app_id=eAdkWGYRoc4RfxVo0Z4B",
										  "https://3.aerial.maps.cit.api.here.com/maptile/2.1/maptile/newest/satellite.day/${z}/${x}/${y}/256/jpg?token=TrLJuXVK62IQk0vuXFzaig%3D%3D&requestid=yahoo.prod&app_id=eAdkWGYRoc4RfxVo0Z4B",
										  "https://4.aerial.maps.cit.api.here.com/maptile/2.1/maptile/newest/satellite.day/${z}/${x}/${y}/256/jpg?token=TrLJuXVK62IQk0vuXFzaig%3D%3D&requestid=yahoo.prod&app_id=eAdkWGYRoc4RfxVo0Z4B"],
								 "attribution" : "© Here, DigitalGlobe, EuroGeographics <a href='https://legal.here.com/cz-cs/terms/serviceterms/' target='_blank'>Podmínky</a>", "comment" : "Here Ortofoto Mapy"};
	var service_xyz_mapycz = {"type" : "XYZ", "maxZoom" : 20, "url" : ["https://mapserver.mapy.cz/base-m/${z}-${x}-${y}"],
							  "attribution" : "<a href='https://mapy.cz/?z=8' target='_blank'><img src='https://mapy.cz/img/logo-small.svg'/><a> ©<a href='https://www.seznam.cz/' target='_blank'>Seznam.cz, a.s</a>, © Slovenská agentúra živ. prostredia, © Národné lesnické centrum SR, © Přispěvatelé <a href='http://www.openstreetmap.org/copyright' target='_blank'>OpenStreetMap</a>", "comment" : "Mapy.cz základní mapa"};
	var service_xyz_mapycz_turist = {"type" : "XYZ", "maxZoom" : 20, "url" : ["https://mapserver.mapy.cz/turist-m/${z}-${x}-${y}"],
									 "attribution" : "<a href='https://mapy.cz/?z=8' target='_blank'><img src='https://mapy.cz/img/logo-small.svg'/><a> ©<a href='https://www.seznam.cz/' target='_blank'>Seznam.cz, a.s</a>, © AOPK ČR – ochrana přírody a krajiny, © Slovenská agentúra živ. prostredia, © Národné lesnické centrum SR, © Přispěvatelé <a href='http://www.openstreetmap.org/copyright' target='_blank'>OpenStreetMap</a>, © NASA", "comment" : "Mapy.cz turistická mapa"};
	var service_xyz_mapycz_zima = {"type" : "XYZ", "maxZoom" : 20, "url" : ["https://mapserver.mapy.cz/wturist_winter-m/${z}-${x}-${y}"],
								   "attribution" : "<a href='https://mapy.cz/?z=8' target='_blank'><img src='https://mapy.cz/img/logo-small.svg'/><a> ©<a href='https://www.seznam.cz/' target='_blank'>Seznam.cz, a.s</a>, © AOPK ČR – ochrana přírody a krajiny, © Slovenská agentúra živ. prostredia, © Národné lesnické centrum SR, © Přispěvatelé <a href='http://www.openstreetmap.org/copyright' target='_blank'>OpenStreetMap</a>, © NASA", "comment" : "Mapy.cz zimní mapa"};
	var service_xyz_mapycz_zemepis = {"type" : "XYZ", "maxZoom" : 19, "url" : ["https://mapserver.mapy.cz/zemepis-m/${z}-${x}-${y}"],
									  "attribution" : "<a href='https://mapy.cz/?z=8' target='_blank'><img src='https://mapy.cz/img/logo-small.svg'/><a> ©<a href='https://www.seznam.cz/' target='_blank'>Seznam.cz, a.s</a>, © AOPK ČR – ochrana přírody a krajiny, © Slovenská agentúra živ. prostredia, © Národné lesnické centrum SR, © Přispěvatelé <a href='http://www.openstreetmap.org/copyright' target='_blank'>OpenStreetMap</a>, © NASA", "comment" : "Mapy.cz zeměpisná mapa"};
	var service_xyz_mapycz_orto = {"type" : "XYZ", "maxZoom" : 21, "url" : ["https://mapserver.mapy.cz/bing/${z}-${x}-${y}"],
								   "attribution" : "<a href='https://mapy.cz/?z=8' target='_blank'><img src='https://mapy.cz/img/logo-small.svg'/><a> ©<a href='https://www.seznam.cz/' target='_blank'>Seznam.cz, a.s</a>, © TopGis, s.r.o., © EUROSENSE s.r.o., © GEODIS Slovakia s.r.o., © <a href='https://www.basemap.at/' target='_blank'>www.basemap.at</a>, © NASA Earth Observatory, © USGS & NASA. Datasource: Global Land Cover Facility, © <a href='https://www.microsoft.com/maps/assets/docs/terms.aspx' target='_blank'>Microsoft Corporation</a>", "comment" : "Mapy.cz letecká mapa"};
	var service_xyz_mapycz_panorama = {"type" : "XYZ", "maxZoom" : 21, "url" : ["https://mapserver.mapy.cz/panorama_hybrid-m/${z}-${x}-${y}"],
									   "attribution" : "<a href='https://mapy.cz/?z=8' target='_blank'><img src='https://mapy.cz/img/logo-small.svg'/><a> ©<a href='https://www.seznam.cz/' target='_blank'>Seznam.cz, a.s</a>", "comment" : "Mapy.cz Panorama"};
	var service_xyz_shocart_turist = {"type" : "XYZ", "maxZoom" : 18, "url" : ["http://webtiles.timepress.cz/open/hike_256/${z}/${x}/${y}"],
									  "attribution" : "Mapová data: ©<a href='http://www.freytagberndt.cz/' target='_blank'>freytag &amp; berndt</a>, <a href='http://www.shocart.cz/' target='_blank'>SHOCart</a>, Přispěvatelé<a href='http://www.openstreetmap.org/copyright' target='_blank'>OpenStreetMap</a>", "comment" : "Shocart turistická mapa"};
	var service_xyz_shocart_cyklo = {"type" : "XYZ", "maxZoom" : 18, "url" : ["http://webtiles.timepress.cz/cyklo_256/${z}/${x}/${y}"],
									 "attribution" : "Mapová data: ©<a href='http://www.freytagberndt.cz/' target='_blank'>freytag &amp; berndt</a>, <a href='http://www.shocart.cz/' target='_blank'>SHOCart</a>, Přispěvatelé<a href='http://www.openstreetmap.org/copyright' target='_blank'>OpenStreetMap</a>"};
	var service_xyz_april = {"type" : "XYZ", "maxZoom" : 19,
							 "url" : ["https://worldtiles1.waze.com/tiles/${z}/${x}/${y}.png", "https://mts0.googleapis.com/vt/lyrs=m&z=${z}&x=${x}&y=${y}", "https://mts0.googleapis.com/vt/lyrs=p&z=${z}&x=${x}&y=${y}",
									  "https://1.base.maps.cit.api.here.com/maptile/2.1/maptile/newest/normal.day/${z}/${x}/${y}/256/png8?token=TrLJuXVK62IQk0vuXFzaig%3D%3D&requestid=yahoo.prod&app_id=eAdkWGYRoc4RfxVo0Z4B",
									  "http://a.tile.openstreetmap.org/${z}/${x}/${y}.png", "https://mapserver.mapy.cz/base-m/${z}-${x}-${y}", "https://mapserver.mapy.cz/wturist-m/${z}-${x}-${y}",
									  "https://mapserver.mapy.cz/wturist_winter-m/${z}-${x}-${y}", "https://mapserver.mapy.cz/zemepis-m/${z}-${x}-${y}",
									  "http://webtiles.timepress.cz/open/hike_256/${z}/${x}/${y}", "http://webtiles.timepress.cz/cyklo_256/${z}/${x}/${y}"],
							 "attribution" : "mišmaš", "comment" : "mišmaš"};
	//skupiny vrstev v menu
	var groupTogglerPlaces = addGroupToggler(true, "layer-switcher-group_places");
	var groupTogglerRoad = addGroupToggler(true, "layer-switcher-group_road");
	var groupTogglerDisplay = addGroupToggler(true, "layer-switcher-group_display");
	var groupTogglerNames = addGroupToggler(false, "layer-switcher-group_names", "Názvy a adresy");
	var groupTogglerBorders = addGroupToggler(false, "layer-switcher-group_borders", "Hranice");
	var groupTogglerExternal = addGroupToggler(false, "layer-switcher-group_external", "Externé mapy!!!");
	//vrstvy v menu
	var WMSLayerTogglers = {};
	//MIESTA
	//WMSLayerTogglers.wms_parkoviste = addLayerToggler(groupTogglerPlaces, "Parkovací plochy", false, [addNewLayer("wms_parkoviste", service_wms_zabaged, "29", 201, 0.7)]);
	//WMSLayerTogglers.wms_parkoviste_praha = addLayerToggler(groupTogglerPlaces, "Zóny placeného stání Praha", false, [addNewLayer("wms_parkoviste_praha", service_wms_praha, "0,1", 0, 0.6)]);
	//WMSLayerTogglers.wms_religiozni = addLayerToggler(groupTogglerPlaces, "Religiózní místa", false, [addNewLayer("wms_religiozni", service_wms_zabaged, "173,174,175,176,177"), addNewLayer("wms_religiozni_1", service_wms_zabaged, "37", 201, 0.7), addNewLayer("wms_religiozni_2", service_wms_geonames, "GN6,GN11")]);
	//WMSLayerTogglers.wms_verejne = addLayerToggler(groupTogglerPlaces, "Veřejné budovy", true, [addNewLayer("wms_verejne", service_wms_zabaged, "80,81,82,143,144,145,146,147,148,165", 202), addNewLayer("wms_verejne_1", service_wms_zabaged, "24,25,26,39,40,41,46,47,55,60,61,62,79", 201, 0.7), addNewLayer("wms_verejne_2", service_wms_geonames, "GN8,GN10")]);
	//WMSLayerTogglers.wms_pamatky = addLayerToggler(groupTogglerPlaces, "Památky a atrakce", false, [addNewLayer("wms_pamatky", service_wms_zabaged, "154,155,160,161,168,169,170,171,172,192,193,194"), addNewLayer("wms_pamatky_1", service_wms_zabaged, "22,58,44,45", 201, 0.7), addNewLayer("wms_pamatky_2", service_wms_geonames, "GN16,GN17,GN7")]);
	//WMSLayerTogglers.wms_sport = addLayerToggler(groupTogglerPlaces, "Sport a rekreace", false, [addNewLayer("wms_sport", service_wms_zabaged, "117,151", 201), addNewLayer("wms_sport_1", service_wms_zabaged, "42,43", 201, 0.7), addNewLayer("wms_sport_2", service_wms_geonames, "GN5,GN9")]);
	WMSLayerTogglers.wms_lesvoda = addLayerToggler(groupTogglerPlaces, "Lesy a vody", true, [addNewLayer("wms_lesvoda", service_wms_zbgis, "6,129", 400), addNewLayer("wms_lesvoda_1", service_wms_zbgis, "20,21,22,25,38,39,50,52,69,70,72,75,77,103,104,137,149,151", 201, 0.7)]);
	//CESTA
	WMSLayerTogglers.wms_cdb_cesty = addLayerToggler(groupTogglerRoad, "Cesty CDB", true, [addNewLayer("wms_cdb_cesty", service_wms_cdb_cesty, "3,4,6,7,8,10,11,12,14,15,18,19,20,22,23,24,26,27,28,29,30,31,38")]);
	WMSLayerTogglers.wms_cdb_objekty = addLayerToggler(groupTogglerRoad, "Objekty CDB", true, [addNewLayer("wms_cdb_objekty", service_wms_cdb_objekty, "1,2,3,4,5,6,7,8")]);
	//WMSLayerTogglers.wms_cesty = addLayerToggler(groupTogglerRoad, "Cesty", true, [addNewLayer("wms_cesty", service_wms_zabaged, "89,91,92,95", 201), addNewLayer("wms_cesty_1", service_wms_zabaged, "87,88", 201, 0.6)]);
	//WMSLayerTogglers.wms_doprava = addLayerToggler(groupTogglerRoad, "Doprava", false, [addNewLayer("wms_doprava", service_wms_zbgis, "33,56,57,58,59,60,61,63,73,96,138,139,140,141,142")]);
	WMSLayerTogglers.wms_zeleznice = addLayerToggler(groupTogglerRoad, "Železnice ŽSR", true, [addNewLayer("wms_zeleznice", service_wms_zeleznice, "public:MV_TRAT_USEK_PUBLIC,public:MV_MOST_PUBLIC,public:MV_PRIECESTIE_PUBLIC,public:MV_TUNEL_PUBLIC")]);
	WMSLayerTogglers.wms_nlc = addLayerToggler(groupTogglerRoad, "Lesné cesty NLC", true, [addNewLayer("wms_nlc", service_wms_nlc, "0,1,2")]);
    //ZOBRAZIŤ
	WMSLayerTogglers.wms_orto = addLayerToggler(groupTogglerDisplay, "Ortofoto ZBGIS", true, [addNewLayer("wms_orto", service_wms_orto, "1,2,3", 200)]);
	WMSLayerTogglers.wms_katastr = addLayerToggler(groupTogglerDisplay, "Katastrálna mapa", true, [addNewLayer("wms_katastr", service_wms_katastr, "1,2,3,5,6,7,8,10,11,12,13,14,15")]);
	//NÁZVY A ADRESY
	WMSLayerTogglers.wms_geonames = addLayerToggler(groupTogglerNames, "Názvy geo", true, [addNewLayer("wms_geonames", service_wms_geonames, "0,1,2,3,4", 470)]);
	//WMSLayerTogglers.wms_ulice = addLayerToggler(groupTogglerNames, "Názvy ulíc", false, [addNewLayer("wms_ulice", service_wms_inspire, "")]);
	//WMSLayerTogglers.wms_budovy = addLayerToggler(groupTogglerNames, "Kamiony 24h", true, [addNewLayer("wms_budovy", service_wms_nipi, "atlassr:E06101_00")]);
	//WMSLayerTogglers.wms_budovy_b = addLayerToggler(groupTogglerNames, "Adresní místa 1b", true, [addNewLayer("wms_budovy_b", service_wms_inspire, "AD.Addresses.Text.AddressAreaName,AD.Addresses.Text.ThoroughfareName")]);
	//HRANICE
	WMSLayerTogglers.wms_stat = addLayerToggler(groupTogglerBorders, "Štátne hranice", true, [addNewLayer("wms_stat", service_wms_hranice, "3")]);
	WMSLayerTogglers.wms_kraje = addLayerToggler(groupTogglerBorders, "Hranice krajov", true, [addNewLayer("wms_kraje", service_wms_hranice, "2")]);
	WMSLayerTogglers.wms_okresy = addLayerToggler(groupTogglerBorders, "Hranice okresov", true, [addNewLayer("wms_okresy", service_wms_hranice, "1")]);
	//WMSLayerTogglers.wms_orp = addLayerToggler(groupTogglerBorders, "Hranice ORP", false, [addNewLayer("wms_orp", service_wms_hranice, "GT_SPH_ORP,GP_SPH_ORP")]);
	//WMSLayerTogglers.wms_pou = addLayerToggler(groupTogglerBorders, "Hranice OPÚ", false, [addNewLayer("wms_pou", service_wms_hranice, "GT_SPH_OPU,GP_SPH_OPU")]);
	WMSLayerTogglers.wms_obce = addLayerToggler(groupTogglerBorders, "Hranice obcí", true, [addNewLayer("wms_obce", service_wms_hranice, "0")]);
	//WMSLayerTogglers.wms_katuzemi = addLayerToggler(groupTogglerBorders, "Hranice KÚ", false, [addNewLayer("wms_katuzemi", service_wms_hranice, "GT_SPH_KU,GP_SPH_KU")]);
	//WMSLayerTogglers.wms_zsj = addLayerToggler(groupTogglerBorders, "Hranice ZSJ", false, [addNewLayer("wms_zsj", service_wms_hranice, "GT_SPH_ZSJ,GP_SPH_ZSJ")]);
	WMSLayerTogglers.wms_chuhr = addLayerToggler(groupTogglerBorders, "Chránené územia", true, [addNewLayer("wms_chuhr", service_wms_sazp, "sopsr:chranene_vtacie_uzemia,sopsr:vchu,sopsr:mchu,sopsr:uzemia_europskeho_vyznamu,sopsr:unesco")]);
	//EXTERNÉ MAPY
	WMSLayerTogglers.xyz_livemap = addLayerToggler(groupTogglerExternal, "Waze LiveMap", false, [addNewLayer("xyz_livemap", service_xyz_livemap)]);
	WMSLayerTogglers.xyz_google = addLayerToggler(groupTogglerExternal, "Google Maps", false, [addNewLayer("xyz_google", service_xyz_google)]);
	WMSLayerTogglers.xyz_google_terrain = addLayerToggler(groupTogglerExternal, "Google Terrain Maps", false, [addNewLayer("xyz_google_terrain", service_xyz_google_terrain)]);
	WMSLayerTogglers.xyz_google_hybrid = addLayerToggler(groupTogglerExternal, "Google Hybrid Maps", false, [addNewLayer("xyz_google_hybrid", service_xyz_google_hybrid)]);
	WMSLayerTogglers.xyz_google_streetview = addLayerToggler(groupTogglerExternal, "Google StreetView", false, [addNewLayer("xyz_google_streetview", service_xyz_google_streetview, null, 470)]);
	WMSLayerTogglers.xyz_osm = addLayerToggler(groupTogglerExternal, "OpenStreetMaps", false, [addNewLayer("xyz_osm", service_xyz_osm)]);
	WMSLayerTogglers.xyz_here = addLayerToggler(groupTogglerExternal, "Here Maps", false, [addNewLayer("xyz_here", service_xyz_here)]);
	WMSLayerTogglers.xyz_here_orto = addLayerToggler(groupTogglerExternal, "Here Satelitte Maps", false, [addNewLayer("xyz_here_orto", service_xyz_here_orto)]);
	WMSLayerTogglers.xyz_mapycz = addLayerToggler(groupTogglerExternal, "Mapy.cz", false, [addNewLayer("xyz_mapycz", service_xyz_mapycz)]);
	WMSLayerTogglers.xyz_mapycz_turist = addLayerToggler(groupTogglerExternal, "Mapy.cz turistické", false, [addNewLayer("xyz_mapycz_turist", service_xyz_mapycz_turist)]);
	WMSLayerTogglers.xyz_mapycz_zima = addLayerToggler(groupTogglerExternal, "Mapy.cz zimní", false, [addNewLayer("xyz_mapycz_zima", service_xyz_mapycz_zima)]);
	//WMSLayerTogglers.xyz_mapycz_zemepis = addLayerToggler(groupTogglerExternal, "Mapy.cz zeměpisné", false, [addNewLayer("xyz_mapycz_zemepis", service_xyz_mapycz_zemepis)]);
	WMSLayerTogglers.xyz_mapycz_orto = addLayerToggler(groupTogglerExternal, "Mapy.cz ortofoto", false, [addNewLayer("xyz_mapycz_orto", service_xyz_mapycz_orto)]);
	//WMSLayerTogglers.xyz_mapycz_panorama = addLayerToggler(groupTogglerExternal, "Mapy.cz Panorama", false, [addNewLayer("xyz_mapycz_panorama", service_xyz_mapycz_panorama, null, 470)]);
	WMSLayerTogglers.xyz_shocart_turist = addLayerToggler(groupTogglerExternal, "Shocart turistická", false, [addNewLayer("xyz_shocart_turist", service_xyz_shocart_turist)]);
	//WMSLayerTogglers.xyz_shocart_cyklo = addLayerToggler(groupTogglerExternal, "Shocart cyklo", false, [addNewLayer("xyz_shocart_cyklo", service_xyz_shocart_cyklo)]);
	//WMSLayerTogglers.xyz_april = addLayerToggler(groupTogglerExternal, "Apríl !!!", false, [addNewLayer("xyz_april", service_xyz_april)]);

	W.map.olMap.events.register("addlayer", null, fillWMSLayersSelectList);
	W.map.olMap.events.register("removelayer", null, fillWMSLayersSelectList);
	W.map.olMap.events.register("addlayer", null, setZOrdering(WMSLayerTogglers));
	W.map.olMap.events.register("removelayer", null, setZOrdering(WMSLayerTogglers));
	W.map.olMap.events.register("moveend", null, setZOrdering(WMSLayerTogglers));

	var isLoaded = false;
	window.addEventListener("beforeunload", function() {
		if (localStorage !== undefined & isLoaded) {
			var JSONStorageOptions = {};
			for (var key in WMSLayerTogglers) {
				if (WMSLayerTogglers[key].serviceType == "WMS") {
					JSONStorageOptions[key] = document.getElementById(WMSLayerTogglers[key].htmlItem).checked;
				}
			}
			localStorage.WMSLayers = JSON.stringify(JSONStorageOptions);
		}
	}, false);
	window.addEventListener("load", function() {
		isLoaded = true;
		if (localStorage.WMSLayers) {
			var JSONStorageOptions = JSON.parse(localStorage.WMSLayers);
			for (var key in WMSLayerTogglers) {
				if (JSONStorageOptions[key] & WMSLayerTogglers[key].serviceType == "WMS") {
					document.getElementById(WMSLayerTogglers[key].htmlItem).click();
				}
			}
		}
	}, false);

	var layer = WMSLayerTogglers.xyz_google_streetview.layerArray[0].layer;
	var controlObserver = new MutationObserver(function(mutationRecords) {
		if (!document.getElementById("layer-switcher-item_Google_StreetView").checked) {
			if (mutationRecords[mutationRecords.length-1].target.style.display == "none") {
				W.map.addLayer(layer);
				layer.setVisibility(true);
			} else{
				layer.setVisibility(false);
				W.map.removeLayer(layer);
			}
		}
	});
	controlObserver.observe(document.querySelector(".street-view-control"), { attributes: true, attributeFilter: ["style"] });

	var userTabs = document.getElementById("user-info");
	var navTabs = document.getElementsByClassName("nav-tabs", userTabs)[0];
	var tabContent = document.getElementsByClassName("tab-content", userTabs)[0];

	var newtab = document.createElement("li");
	newtab.innerHTML = "<a href='#sidepanel-wms' data-toggle='tab' title='Private - SK WMS layers'>WMS</a>";
	navTabs.appendChild(newtab);

	var addon = document.createElement("section");
	addon.innerHTML = "<b><u><a href='https://greasyfork.org/scripts/405234' target='_blank'>" + GM_info.script.name + "</a></u></b> &nbsp; v" + GM_info.script.version;
	addon.id = "sidepanel-wms";
	addon.className = "tab-pane";
	tabContent.appendChild(addon);

	var section = document.createElement("section");
	section.style.fontSize = "13px";
	section.id = "WMS";
	section.style.marginBottom = "15px";
	section.appendChild(document.createElement("br"));
	section.appendChild(document.createTextNode("WMS vrstva: "));
	var WMSSelect = document.createElement("select");
	WMSSelect.id = "WMSLayersSelect";
	section.appendChild(WMSSelect);
	var opacityRange = document.createElement("input");
	var opacityLabel = document.createElement("label");
	opacityRange.type = "range";
	opacityRange.min = 0;
	opacityRange.max = 100;
	opacityRange.value = 100;
	opacityRange.id = "WMSOpacity";
	opacityLabel.textContent = "Priehľadnosť vrstvy: " + opacityRange.value + " %";
	opacityLabel.id = "WMSOpacityLabel";
	opacityLabel.htmlFor = opacityRange.id;
	section.appendChild(opacityLabel);
	section.appendChild(opacityRange);
	addon.appendChild(section);
	opacityRange.addEventListener("input", function() {
		var value = document.getElementById("WMSLayersSelect").value;
		if (value !== "" && value !== "undefined") {
			var layer = W.map.getLayerByUniqueName(value);
			layer.setOpacity(opacityRange.value / 100);
			document.getElementById("WMSOpacityLabel").textContent = "Priehľadnosť vrstvy: " + document.getElementById("WMSOpacity").value + " %";
		}
	});
	WMSSelect.addEventListener("change", function() {
		opacityRange.value = W.map.layers.filter(layer => layer.uniqueName == WMSSelect.value)[0].opacity * 100;
		document.getElementById("WMSOpacityLabel").textContent = "Priehľadnosť vrstvy: " + document.getElementById("WMSOpacity").value + " %";
	});
	setZOrdering(WMSLayerTogglers);
}

function fillWMSLayersSelectList() {
	var select = document.getElementById("WMSLayersSelect");
	var value = select.value;
	var htmlCode;
	W.map.layers.filter(layer => layer.uniqueName !== undefined && layer.uniqueName.startsWith("_wms_")).forEach(
		layer => (htmlCode += "<option value='" + layer.uniqueName + "'>" + layer.name + " [" + layer.uniqueName + "]</option><br>"));
	select.innerHTML = htmlCode;
	select.value = value;
}

function addNewLayer(id, service, serviceLayers, zIndex = 0, opacity = 1) {
	var newLayer = {};
	newLayer.uniqueName = "_" + id;
	newLayer.serviceType = service.type;
	newLayer.zIndex = (service.type == "XYZ" & zIndex == 0) ? 200 : zIndex;
	switch(service.type) {
		case "WMS":
			newLayer.layer = new OL.Layer.WMS(
				id, service.url,
				{
					layers: serviceLayers ,
					transparent: "true",
					format: "image/png"
				},
				{
					opacity: opacity,
					tileSize: WMSLayersTechSource.tileSizeG,
					isBaseLayer: false,
					visibility: false,
					transitionEffect: "resize",
					attribution: service.attribution,
					uniqueName: newLayer.uniqueName,
					projection: new OL.Projection("EPSG:3857") //alternativa defaultní EPSG:900913
				}
			);
			break;
		case "WMS_4326":
			newLayer.layer = new OL.Layer.WMS(
				id, service.url,
				{
					layers: serviceLayers ,
					transparent: "true",
					format: "image/png"
				},
				{
					opacity: opacity,
					tileSize: WMSLayersTechSource.tileSizeG,
					isBaseLayer: false,
					visibility: false,
					transitionEffect: "resize",
					attribution: service.attribution,
					uniqueName: newLayer.uniqueName,
					epsg4326: new OL.Projection("EPSG:4326"),
					getURL: getUrl4326,
					getFullRequestString: getFullRequestString4326
				}
			);
			break;
		case "XYZ":
			newLayer.layer = new OL.Layer.XYZ(
				id, service.url,
				{
					sphericalMercator: true,
					isBaseLayer: false,
					visibility: false,
					zoomOffset: 12,
					RESOLUTION_PROPERTIES: {},
					resolutions: WMSLayersTechSource.resolutions,
					serverResolutions: WMSLayersTechSource.resolutions.slice(0, ("maxZoom" in service & service.maxZoom > 0) ? service.maxZoom : 23),
					transitionEffect: "resize",
					attribution: service.attribution,
					uniqueName: newLayer.uniqueName
				}
			);
			break;
		default:
			newLayer.layer = null;
	}
	return newLayer;
}

function addGroupToggler(isDefault, layerSwitcherGroupItemName, layerGroupVisibleName) {
	var group;
	if (isDefault === true) {
		group = document.getElementById(layerSwitcherGroupItemName).parentElement.parentElement;
	}
	else {
		var layerGroupsList = document.getElementsByClassName("list-unstyled togglers")[0];
		group = document.createElement("li");
		group.className = "group";
		var togglerContainer = document.createElement("div");
		togglerContainer.className = "layer-switcher-toggler-tree-category";
		var iCaretDown = document.createElement("i");
		iCaretDown.className = "toggle-category w-icon w-icon-caret-down";
		iCaretDown.dataset.groupId = layerSwitcherGroupItemName.replace("layer-switcher-", "").toUpperCase();
		iCaretDown.addEventListener("click", layerTogglerGroupMinimizerEventHandler(iCaretDown));
		var togglerSwitch = document.createElement("wz-toggle-switch");
		togglerSwitch.className = layerSwitcherGroupItemName + " hydrated";
		togglerSwitch.id = layerSwitcherGroupItemName;
		togglerSwitch.checked = true;
		var label = document.createElement("label");
		label.className = "label-text";
		label.htmlFor = togglerSwitch.id;
		var togglerChildrenList = document.createElement("ul");
		togglerChildrenList.className = "collapsible-" + layerSwitcherGroupItemName.replace("layer-switcher-", "").toUpperCase();
		label.appendChild(document.createTextNode(layerGroupVisibleName));
		togglerContainer.appendChild(iCaretDown);
		togglerContainer.appendChild(togglerSwitch);
		togglerContainer.appendChild(label);
		group.appendChild(togglerContainer);
		group.appendChild(togglerChildrenList);
		layerGroupsList.appendChild(group);
	}
	return group;
}

function addLayerToggler(groupToggler, layerName, isPublic, layerArray) {
	var layerToggler = {};
	layerToggler.layerName = layerName;
	layerToggler.serviceType = (layerArray.filter(function(e) {return e.serviceType == "XYZ";}).length > 0) ? "XYZ" : "WMS";
	var layerShortcut = layerName.replace(/ /g, "_").replace(".", "");
	layerToggler.htmlItem = "layer-switcher-item_" + layerShortcut;
	layerToggler.layerArray = layerArray;
	var layer_container = groupToggler.getElementsByTagName("UL")[0];
	var layerGroupCheckbox = groupToggler.getElementsByClassName("layer-switcher-toggler-tree-category")[0].getElementsByTagName("wz-toggle-switch")[0];
	var toggler = document.createElement("li");
	var togglerCheckbox = document.createElement("wz-checkbox");
	togglerCheckbox.id = layerToggler.htmlItem;
	togglerCheckbox.className = "hydrated";
	var labelSymbol = document.createElement("span");
	labelSymbol.className = (isPublic) ? "fa fa-location-arrow" : "fa fa-lock";
	togglerCheckbox.appendChild(labelSymbol);
	togglerCheckbox.appendChild(document.createTextNode(layerName));
	toggler.appendChild(togglerCheckbox);
	layer_container.appendChild(toggler);
	for (var i = 0; i < layerArray.length; i++){
		togglerCheckbox.addEventListener("click", layerTogglerEventHandler(layerArray[i]));
		layerGroupCheckbox.addEventListener("click", layerTogglerGroupEventHandler(togglerCheckbox, layerArray[i]));
		layerArray[i].layer.name = layerName;
	}
	registerKeyShortcut("WMS: " + layerName, layerKeyShortcutEventHandler(layerGroupCheckbox, togglerCheckbox), layerShortcut);
	return layerToggler;
}

function registerKeyShortcut(actionName, callback, keyName) {
	I18n.translations[I18n.locale].keyboard_shortcuts.groups.default.members[keyName] = actionName;
	W.accelerators.addAction(keyName, {group: "default"});
	W.accelerators.events.register(keyName, null, callback);
	W.accelerators._registerShortcuts({[""]: keyName});
}

function layerTogglerEventHandler(layerType) {
	return function() {
		if (this.checked) {
			W.map.addLayer(layerType.layer);
			layerType.layer.setVisibility(this.checked);
		}
		else {
			layerType.layer.setVisibility(this.checked);
			W.map.removeLayer(layerType.layer);
		}
	};
}

function layerKeyShortcutEventHandler(groupCheckbox, checkbox) {
	return function() {
		if (!groupCheckbox.disabled) {
			checkbox.click();
		}
	};
}

function layerTogglerGroupEventHandler(checkbox, layerType) {
	return function() {
		if (this.checked) {
			if (checkbox.checked) {
				W.map.addLayer(layerType.layer);
				layerType.layer.setVisibility(this.checked & checkbox.checked);
			}
		}
		else {
			if (checkbox.checked) {
				layerType.layer.setVisibility(this.checked & checkbox.checked);
				W.map.removeLayer(layerType.layer);
			}
		}
		checkbox.disabled = !this.checked;
	};
}

function layerTogglerGroupMinimizerEventHandler(iCaretDown) {
	return function() {
		var ulCollapsible = iCaretDown.parentElement.parentElement.getElementsByTagName("UL")[0];
		if (!iCaretDown.classList.contains("upside-down")) {
			iCaretDown.classList.add("upside-down");
			ulCollapsible.classList.add("collapse-layer-switcher-group");
		}
		else {
			iCaretDown.classList.remove("upside-down");
			ulCollapsible.classList.remove("collapse-layer-switcher-group");
		}
	};
}

function setZOrdering(layerTogglers) {
	return function() {
		for (var key in layerTogglers) {
			for (var j = 0; j < layerTogglers[key].layerArray.length; j++) {
				if (layerTogglers[key].layerArray[j].zIndex > 0) {
					var l = W.map.getLayersBy("uniqueName", layerTogglers[key].layerArray[j].uniqueName);
					if (l.length > 0) {
						l[0].setZIndex(layerTogglers[key].layerArray[j].zIndex);
					}
				}
			}
		}
	};
}

function getUrl4326(bounds) {
	var newParams = {};
	bounds.transform(this.projection, this.epsg4326);
	newParams.BBOX = bounds.toArray(this.reverseAxisOrder());
	newParams.WIDTH = 742;
	newParams.HEIGHT = 485;
	var requestString = this.getFullRequestString(newParams);
	return requestString;
}

function getFullRequestString4326(newParams) {
	this.params.SRS = "EPSG:4326";
	return OL.Layer.Grid.prototype.getFullRequestString.apply(this, arguments);
}