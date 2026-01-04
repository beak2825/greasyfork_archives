// ==UserScript==
// @name			Private - Czech WMS layers
// @version			2025.11.06
// @author			petrjanik, d2-mac, MajkiiTelini
// @description		Displays layers from Czech WMS services (ŘSD & ČÚZK) in WME
// @match 			https://*.waze.com/*editor*
// @run-at			document-end
// @namespace		https://greasyfork.org/cs/users/135686
// @downloadURL https://update.greasyfork.org/scripts/34720/Private%20-%20Czech%20WMS%20layers.user.js
// @updateURL https://update.greasyfork.org/scripts/34720/Private%20-%20Czech%20WMS%20layers.meta.js
// ==/UserScript==

var WMSLayersTechSource = {};
var W;
var OL;
var I18n;
var ZIndexes = {};

async function init() {
	W = unsafeWindow.W;
	OL = unsafeWindow.OpenLayers;
	I18n = unsafeWindow.I18n;

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
	ZIndexes.base = W.map.olMap.Z_INDEX_BASE.Overlay + 20;
	ZIndexes.overlay = W.map.olMap.Z_INDEX_BASE.Overlay + 100;
	ZIndexes.popup = W.map.olMap.Z_INDEX_BASE.Overlay + 500;

	// adresy WMS služeb
	var service_wms_rsd_sit = {"type" : "WMS", "url" : "https://geoportal.rsd.cz/arcgis/services/WMS_ULS/MapServer/WmsServer?", "attribution" : "© Ředitelství silnic a dálnic ČR", "comment" : "ŘSD třídy silnic + popisky"};
	var service_wms_rsd_objekty = {"type" : "WMS", "url" : "https://geoportal.rsd.cz/arcgis/services/WMS_objekty/MapServer/WmsServer?", "attribution" : "© Ředitelství silnic a dálnic ČR", "comment" : "ŘSD objekty na silniční síti"};
	var service_wms_orto = {"type" : "WMS", "url" : "https://ags.cuzk.gov.cz/arcgis1/services/ORTOFOTO/MapServer/WMSServer?", "attribution" : "ČUZK Ortofoto", "comment" : "ČUZK ortofoto"};
	var service_wms_orto_praha = {"type" : "WMS_4326", "url" : "https://gs-pub.praha.eu/arcgis/services/ort/ortofotomapa_archiv/MapServer/WMSServer?", "attribution" : "IPR Praha", "comment" : "Ortofoto Praha"};
	var service_wms_orto_brno = {"type" : "WMS_4326", "url" : "https://gis.brno.cz/ags2/services/PUBLIC/basemap_ortofoto_aktualni/MapServer/WMSServer?", "attribution" : "Brno", "comment" : "Ortofoto Brno"};
	var service_wms_hranice = {"type" : "WMS", "url" : "https://geoportal.cuzk.cz/WMS_SPH_PUB/service.svc/get?", "attribution" : "ČUZK Správní a katastrální hranice ČR", "comment" : "ČUZK hranice obce, kraje, okresy"};
	var service_wms_geonames = {"type" : "WMS", "url" : "https://geoportal.cuzk.cz/WMS_GEONAMES_PUB/WMService.aspx?", "attribution" : "ČUZK Geonames", "comment" : "ČUZK GeoNames"};
	var service_wms_katastr = {"type" : "WMS", "url" : "https://services.cuzk.gov.cz/wms/wms.asp?", "attribution" : "ČUZK Katastrální mapy", "comment" : "ČUZK katastr"};
	var service_wms_zm10 = {"type" : "WMS", "url" : "https://ags.cuzk.gov.cz/arcgis1/services/ZTM/ZTM10/MapServer/WMSServer?", "attribution" : "ČUZK Základní mapa", "comment" : "ČUZK Základní mapa"};
	var service_wms_inspire = {"type" : "WMS", "url" : "https://services.cuzk.gov.cz/wms/inspire-ad-wms.asp?", "attribution" : "ČUZK INSPIRE", "comment" : "ČUZK čísla popisná a orientační + názvy ulic"};
	var service_wms_zabaged = {"type" : "WMS", "url" : "https://ags.cuzk.gov.cz/arcgis/services/ZABAGED/MapServer/WMSServer?", "attribution" : "ČUZK ZABAGED®", "comment" : "ČUZK Doprava, Lesy, Vodní plochy"};
	var service_wms_krnap = {"type" : "WMS", "url" : "https://arcgis2.krnap.cz:6443/arcgis/services/old_public/Turismus/MapServer/WMSServer?", "attribution" : "KRNAP Komunikace s regulací vjezdu", "comment" : "KRNAP turismus"};
	var service_wms_praha = {"type" : "WMS_4326", "url" : "https://gs-pub.praha.eu/arcgis/services/dop/zony_placeneho_stani/MapServer/WMSServer?", "attribution" : "PRAHA ICT operátor", "comment" : "Praha ICT operátor"};
	var service_wms_brno = {"type" : "WMS", "url" : "https://gis.brno.cz/services/mapserver/common/pakom/gservice?", "attribution" : "Brno pasport DZ", "comment" : "Brno pasport DZ"};
	var service_wms_izs = {"type" : "WMS_4326", "url" : "https://gis.izscr.cz/arcgis/services/base_maps/vektor_cr/MapServer/WMSServer?", "attribution" : "Mapa IZS", "comment" : "Mapa IZS"};
	//adresy MapTile služeb
	var service_xyz_livemap = {"type" : "XYZ", "url" : ["https://worldtiles1.waze.com/tiles/${z}/${x}/${y}.png?highres=true", "https://worldtiles2.waze.com/tiles/${z}/${x}/${y}.png?highres=true", "https://worldtiles3.waze.com/tiles/${z}/${x}/${y}.png?highres=true"],
							   "attribution" : "© 2006-2023 Waze Mobile. Všechna práva vyhrazena. <a href='https://www.waze.com/legal/notices' target='_blank'>Poznámky</a>", "comment" : "Waze Livemapa"};
	var service_xyz_google = {"type" : "XYZ", "url" : ["https://mts0.googleapis.com/vt/lyrs=m&x=${x}&y=${y}&z=${z}", "https://mts1.googleapis.com/vt/lyrs=m&x=${x}&y=${y}&z=${z}", "https://mts2.googleapis.com/vt/lyrs=m&x=${x}&y=${y}&z=${z}", "https://mts3.googleapis.com/vt/lyrs=m&x=${x}&y=${y}&z=${z}"],
							  "attribution" : "Mapová data ©2023 GeoBasis-DE/BKG (©2009),Google <a href='https://www.google.com/intl/cs_cz/help/terms_maps.html' target='_blank'>Smluvní podmínky</a>", "comment" : "Google Mapy"};
	var service_xyz_google_terrain = {"type" : "XYZ", "url" : ["https://mts0.googleapis.com/vt/lyrs=p&x=${x}&y=${y}&z=${z}", "https://mts1.googleapis.com/vt/lyrs=p&x=${x}&y=${y}&z=${z}", "https://mts2.googleapis.com/vt/lyrs=p&x=${x}&y=${y}&z=${z}", "https://mts3.googleapis.com/vt/lyrs=p&x=${x}&y=${y}&z=${z}"],
									  "attribution" : "Mapová data ©2023 GeoBasis-DE/BKG (©2009),Google <a href='https://www.google.com/intl/cs_cz/help/terms_maps.html' target='_blank'>Smluvní podmínky</a>", "comment" : "Google Terénní Mapy"};
	var service_xyz_google_hybrid = {"type" : "XYZ", "url" : ["https://mts0.googleapis.com/vt/lyrs=y&x=${x}&y=${y}&z=${z}", "https://mts1.googleapis.com/vt/lyrs=y&x=${x}&y=${y}&z=${z}", "https://mts2.googleapis.com/vt/lyrs=y&x=${x}&y=${y}&z=${z}", "https://mts3.googleapis.com/vt/lyrs=y&x=${x}&y=${y}&z=${z}"],
									 "attribution" : "Snímky ©2023 Landsat / Copernicus, Google, GEODIS Brno, Mapová data ©2023 GeoBasis-DE/BKG (©2009),Google <a href='https://www.google.com/intl/cs_cz/help/terms_maps.html' target='_blank'>Smluvní podmínky</a>", "comment" : "Google Hybridní Mapy"};
	var service_xyz_google_streetview = {"type" : "XYZ", "url" : ["https://mts0.google.com/mapslt?lyrs=svv&&x=${x}&y=${y}&z=${z}&style=40", "https://mts1.google.com/mapslt?lyrs=svv&&x=${x}&y=${y}&z=${z}&style=40", "https://mts2.google.com/mapslt?lyrs=svv&&x=${x}&y=${y}&z=${z}&style=40", "https://mts3.google.com/mapslt?lyrs=svv&&x=${x}&y=${y}&z=${z}&style=40"],
										 "attribution" : "Google <a href='https://www.google.com/intl/cs_cz/help/terms_maps.html' target='_blank'>Smluvní podmínky</a>", "comment" : "Google Streetview"};
	var service_xyz_osm = {"type" : "XYZ", "maxZoom" : 20, "url" : ["https://tile.openstreetmap.org/${z}/${x}/${y}.png"], "attribution" : "© Přispěvatelé <a href='https://www.openstreetmap.org/copyright' target='_blank'>OpenStreetMap</a>", "comment" : "OpenStreetMapy"};
	var service_xyz_here = {"type" : "XYZ", "maxZoom" : 20,
							"url" : ["https://1.base.maps.api.here.com/maptile/2.1/maptile/81fda341e6/normal.day/${z}/${x}/${y}/256/png8?app_id=VgTVFr1a0ft1qGcLCVJ6&app_code=LJXqQ8ErW71UsRUK3R33Ow",
									 "https://2.base.maps.api.here.com/maptile/2.1/maptile/81fda341e6/normal.day/${z}/${x}/${y}/256/png8?app_id=VgTVFr1a0ft1qGcLCVJ6&app_code=LJXqQ8ErW71UsRUK3R33Ow",
									 "https://3.base.maps.api.here.com/maptile/2.1/maptile/81fda341e6/normal.day/${z}/${x}/${y}/256/png8?app_id=VgTVFr1a0ft1qGcLCVJ6&app_code=LJXqQ8ErW71UsRUK3R33Ow",
									 "https://4.base.maps.api.here.com/maptile/2.1/maptile/81fda341e6/normal.day/${z}/${x}/${y}/256/png8?app_id=VgTVFr1a0ft1qGcLCVJ6&app_code=LJXqQ8ErW71UsRUK3R33Ow"],
							"attribution" : "© Here, EuroGeographics <a href='https://legal.here.com/cz-cs/terms/serviceterms/' target='_blank'>Podmínky</a>", "comment" : "Here Mapy"};
	var service_xyz_here_orto = {"type" : "XYZ", "maxZoom" : 20,
								 "url" : ["https://1.aerial.maps.api.here.com/maptile/2.1/maptile/81fda341e6/satellite.day/${z}/${x}/${y}/256/jpg?app_id=VgTVFr1a0ft1qGcLCVJ6&app_code=LJXqQ8ErW71UsRUK3R33Ow",
										  "https://2.aerial.maps.api.here.com/maptile/2.1/maptile/81fda341e6/satellite.day/${z}/${x}/${y}/256/jpg?app_id=VgTVFr1a0ft1qGcLCVJ6&app_code=LJXqQ8ErW71UsRUK3R33Ow",
										  "https://3.aerial.maps.api.here.com/maptile/2.1/maptile/81fda341e6/satellite.day/${z}/${x}/${y}/256/jpg?app_id=VgTVFr1a0ft1qGcLCVJ6&app_code=LJXqQ8ErW71UsRUK3R33Ow",
										  "https://4.aerial.maps.api.here.com/maptile/2.1/maptile/81fda341e6/satellite.day/${z}/${x}/${y}/256/jpg?app_id=VgTVFr1a0ft1qGcLCVJ6&app_code=LJXqQ8ErW71UsRUK3R33Ow"],
								 "attribution" : "© Here, DigitalGlobe, EuroGeographics <a href='https://legal.here.com/cz-cs/terms/serviceterms/' target='_blank'>Podmínky</a>", "comment" : "Here Ortofoto Mapy"};
	var service_xyz_mapycz = {"type" : "XYZ", "maxZoom" : 20, "url" : ["https://mapserver.mapy.cz/base-m/retina/${z}-${x}-${y}"],
							  "attribution" : "<a href='https://mapy.cz/?z=8' target='_blank'><img src='https://mapy.cz/img/logo-small.svg'/><a> ©<a href='https://www.seznam.cz/' target='_blank'>Seznam.cz, a.s</a>, © Slovenská agentúra živ. prostredia, © Národné lesnické centrum SR, © Přispěvatelé <a href='https://www.openstreetmap.org/copyright' target='_blank'>OpenStreetMap</a>", "comment" : "Mapy.cz základní mapa"};
	var service_xyz_mapycz_turist = {"type" : "XYZ", "maxZoom" : 20, "url" : ["https://mapserver.mapy.cz/turist-m/retina/${z}-${x}-${y}"],
									 "attribution" : "<a href='https://mapy.cz/?z=8' target='_blank'><img src='https://mapy.cz/img/logo-small.svg'/><a> ©<a href='https://www.seznam.cz/' target='_blank'>Seznam.cz, a.s</a>, © AOPK ČR – ochrana přírody a krajiny, © Slovenská agentúra živ. prostredia, © Národné lesnické centrum SR, © Přispěvatelé <a href='https://www.openstreetmap.org/copyright' target='_blank'>OpenStreetMap</a>, © NASA", "comment" : "Mapy.cz turistická mapa"};
	var service_xyz_mapycz_zima = {"type" : "XYZ", "maxZoom" : 20, "url" : ["https://mapserver.mapy.cz/wturist_winter-m/${z}-${x}-${y}"],
								   "attribution" : "<a href='https://mapy.cz/?z=8' target='_blank'><img src='https://mapy.cz/img/logo-small.svg'/><a> ©<a href='https://www.seznam.cz/' target='_blank'>Seznam.cz, a.s</a>, © AOPK ČR – ochrana přírody a krajiny, © Slovenská agentúra živ. prostredia, © Národné lesnické centrum SR, © Přispěvatelé <a href='https://www.openstreetmap.org/copyright' target='_blank'>OpenStreetMap</a>, © NASA", "comment" : "Mapy.cz zimní mapa"};
	var service_xyz_mapycz_zemepis = {"type" : "XYZ", "maxZoom" : 19, "url" : ["https://mapserver.mapy.cz/zemepis-m/${z}-${x}-${y}"],
									  "attribution" : "<a href='https://mapy.cz/?z=8' target='_blank'><img src='https://mapy.cz/img/logo-small.svg'/><a> ©<a href='https://www.seznam.cz/' target='_blank'>Seznam.cz, a.s</a>, © AOPK ČR – ochrana přírody a krajiny, © Slovenská agentúra živ. prostredia, © Národné lesnické centrum SR, © Přispěvatelé <a href='https://www.openstreetmap.org/copyright' target='_blank'>OpenStreetMap</a>, © NASA", "comment" : "Mapy.cz zeměpisná mapa"};
	var service_xyz_mapycz_orto = {"type" : "XYZ", "maxZoom" : 21, "url" : ["https://mapserver.mapy.cz/ophoto-m/${z}-${x}-${y}"],
								   "attribution" : "<a href='https://mapy.cz/?z=8' target='_blank'><img src='https://mapy.cz/img/logo-small.svg'/><a> ©<a href='https://www.seznam.cz/' target='_blank'>Seznam.cz, a.s</a>, © TopGis, s.r.o., © EUROSENSE s.r.o., © GEODIS Slovakia s.r.o., © <a href='https://www.basemap.at/' target='_blank'>www.basemap.at</a>, © NASA Earth Observatory, © USGS & NASA. Datasource: Global Land Cover Facility, © <a href='https://www.microsoft.com/maps/assets/docs/terms.aspx' target='_blank'>Microsoft Corporation</a>", "comment" : "Mapy.cz letecká mapa"};
	var service_xyz_mapycz_panorama = {"type" : "XYZ", "maxZoom" : 21, "url" : ["https://mapserver.mapy.cz/panorama_hybrid-m/${z}-${x}-${y}"],
									   "attribution" : "<a href='https://mapy.cz/?z=8' target='_blank'><img src='https://mapy.cz/img/logo-small.svg'/><a> ©<a href='https://www.seznam.cz/' target='_blank'>Seznam.cz, a.s</a>", "comment" : "Mapy.cz Panorama"};
	var service_xyz_shocart_turist = {"type" : "XYZ", "maxZoom" : 18, "url" : ["https://webtiles.timepress.cz/open/hike_256/${z}/${x}/${y}"],
									  "attribution" : "Mapová data: ©<a href='https://www.freytagberndt.cz/' target='_blank'>freytag &amp; berndt</a>, <a href='https://www.shocart.cz/' target='_blank'>SHOCart</a>, Přispěvatelé <a href='https://www.openstreetmap.org/copyright' target='_blank'>OpenStreetMap</a>", "comment" : "Shocart turistická mapa"};
	var service_xyz_shocart_cyklo = {"type" : "XYZ", "maxZoom" : 18, "url" : ["https://webtiles.timepress.cz/open/cyklo_256/${z}/${x}/${y}"],
									 "attribution" : "Mapová data: ©<a href='https://www.freytagberndt.cz/' target='_blank'>freytag &amp; berndt</a>, <a href='https://www.shocart.cz/' target='_blank'>SHOCart</a>, Přispěvatelé <a href='https://www.openstreetmap.org/copyright' target='_blank'>OpenStreetMap</a>"};
	var service_xyz_april = {"type" : "XYZ", "maxZoom" : 19,
							 "url" : ["https://worldtiles1.waze.com/tiles/${z}/${x}/${y}.png?highres=true", "https://mts0.googleapis.com/vt/lyrs=m&z=${z}&x=${x}&y=${y}", "https://mts0.googleapis.com/vt/lyrs=p&z=${z}&x=${x}&y=${y}",
									  "https://1.base.maps.api.here.com/maptile/2.1/maptile/81fda341e6/normal.day/${z}/${x}/${y}/256/png8?app_id=VgTVFr1a0ft1qGcLCVJ6&app_code=LJXqQ8ErW71UsRUK3R33Ow",
									  "https://tile.openstreetmap.org/${z}/${x}/${y}.png", "https://mapserver.mapy.cz/base-m/retina/${z}-${x}-${y}", "https://mapserver.mapy.cz/turist-m/retina/${z}-${x}-${y}",
									  "https://mapserver.mapy.cz/wturist_winter-m/${z}-${x}-${y}", "https://mapserver.mapy.cz/zemepis-m/${z}-${x}-${y}",
									  "https://webtiles.timepress.cz/open/hike_256/${z}/${x}/${y}", "https://webtiles.timepress.cz/open/cyklo_256/${z}/${x}/${y}"],
							 "attribution" : "mišmaš", "comment" : "mišmaš"};
	//skupiny vrstev v menu
	var groupTogglerPlaces = addGroupToggler(true, "layer-switcher-group_places");
	var groupTogglerRoad = addGroupToggler(true, "layer-switcher-group_road");
	var groupTogglerDisplay = addGroupToggler(true, "layer-switcher-group_display");
	var groupTogglerNames = addGroupToggler(false, "layer-switcher-group_names", "ČÚZK názvy a adresy");
	var groupTogglerBorders = addGroupToggler(false, "layer-switcher-group_borders", "ČÚZK hranice");
	var groupTogglerExternal = addGroupToggler(false, "layer-switcher-group_external", "Neklikat !!!");
	//vrstvy v menu
	var WMSLayerTogglers = {};
	//MÍSTA
	WMSLayerTogglers.wms_parkoviste = addLayerToggler(groupTogglerPlaces, "Parkovací plochy", false, [addNewLayer("wms_parkoviste", service_wms_zabaged, "29", 0, 0.7)]);
	WMSLayerTogglers.wms_parkoviste_praha = addLayerToggler(groupTogglerPlaces, "Zóny placeného stání Praha", false, [addNewLayer("wms_parkoviste_praha", service_wms_praha, "0,1", 0, 0.6)]);
	WMSLayerTogglers.wms_religiozni = addLayerToggler(groupTogglerPlaces, "Religiózní místa", false, [addNewLayer("wms_religiozni", service_wms_zabaged, "184,185,186,187,188"), addNewLayer("wms_religiozni_1", service_wms_zabaged, "37", 0, 0.7), addNewLayer("wms_religiozni_2", service_wms_geonames, "GN6,GN11")]);
	WMSLayerTogglers.wms_verejne = addLayerToggler(groupTogglerPlaces, "Veřejné budovy", true, [addNewLayer("wms_verejne", service_wms_zabaged, "89,90,91,154,155,156,157,159,158,176"), addNewLayer("wms_verejne_1", service_wms_zabaged, "24,25,26,39,40,41,46,47,57,68,69,70,88", 0, 0.7), addNewLayer("wms_verejne_2", service_wms_geonames, "GN8,GN10")]);
	WMSLayerTogglers.wms_pamatky = addLayerToggler(groupTogglerPlaces, "Památky a atrakce", false, [addNewLayer("wms_pamatky", service_wms_zabaged, "165,166,171,172,179,180,181,182,183,203,204,205"), addNewLayer("wms_pamatky_1", service_wms_zabaged, "22,44,45,62,63", 0, 0.7), addNewLayer("wms_pamatky_2", service_wms_geonames, "GN16,GN17,GN7")]);
	WMSLayerTogglers.wms_sport = addLayerToggler(groupTogglerPlaces, "Sport a rekreace", false, [addNewLayer("wms_sport", service_wms_zabaged, "129,162"), addNewLayer("wms_sport_1", service_wms_zabaged, "42,43", 0, 0.7), addNewLayer("wms_sport_2", service_wms_geonames, "GN5,GN9")]);
	WMSLayerTogglers.wms_lesvoda = addLayerToggler(groupTogglerPlaces, "Lesy a vodstva", true, [addNewLayer("wms_lesvoda", service_wms_zabaged, "77,78,79,80,82,83,84,143,189,190,191,192,193,194,195,196"), addNewLayer("wms_lesvoda_1", service_wms_zabaged, "0,1,2,3,4,5,6,7,8,9,10,11,19,20,21", 0, 0.7), addNewLayer("wms_lesvoda_2", service_wms_geonames, "GN13,GN18,GN19,GN20,GN21")]);
	//SILNICE
	WMSLayerTogglers.wms_rsd_sit = addLayerToggler(groupTogglerRoad, "ŘSD Silniční síť", false, [addNewLayer("wms_rsd_sit", service_wms_rsd_sit, "13,12,11,10,9,8,7,6,5,4,3,2,1")]);
	WMSLayerTogglers.wms_rsd_objekty = addLayerToggler(groupTogglerRoad, "ŘSD Objekty", false, [addNewLayer("wms_rsd_objekty", service_wms_rsd_objekty, "16,15,14,13,12,11,10,9,8,7,6,5,4,3")]);
	WMSLayerTogglers.wms_cesty = addLayerToggler(groupTogglerRoad, "Místní cesty", true, [addNewLayer("wms_cesty", service_wms_zabaged, "98,102,103,106", 0), addNewLayer("wms_cesty_1", service_wms_zabaged, "96,97", 0, 0.6)]);
	WMSLayerTogglers.wms_doprava = addLayerToggler(groupTogglerRoad, "Doprava", false, [addNewLayer("wms_doprava", service_wms_zabaged, "28,72,92,93,116,117,118,119,120,121,122,123,124,125,126,127,128,129,130,131,132,133,134,135,139,140,141,142,145,146,147,168"), addNewLayer("wms_doprava_1", service_wms_geonames, "GN12,GN13,GN14")]);
	WMSLayerTogglers.wms_krnap = addLayerToggler(groupTogglerRoad, "KRNAP regulace vjezdu", false, [addNewLayer("wms_krnap", service_wms_krnap, "1")]);
	WMSLayerTogglers.wms_brno = addLayerToggler(groupTogglerRoad, "Dopravní značení Brno", false, [addNewLayer("wms_brno", service_wms_brno, "pk-dzv,pk-dzs")]);
	//ZOBRAZENÍ
	WMSLayerTogglers.wms_orto = addLayerToggler(groupTogglerDisplay, "Ortofoto ČUZK", true, [addNewLayer("wms_orto", service_wms_orto, "0", ZIndexes.base)]);
	WMSLayerTogglers.wms_orto_praha = addLayerToggler(groupTogglerDisplay, "Ortofoto Praha", false, [addNewLayer("wms_orto_praha", service_wms_orto_praha, "1", ZIndexes.base)]);
	WMSLayerTogglers.wms_orto_brno = addLayerToggler(groupTogglerDisplay, "Ortofoto Brno", false, [addNewLayer("wms_orto_brno", service_wms_orto_brno, "1", ZIndexes.base)]);
	WMSLayerTogglers.wms_zm10 = addLayerToggler(groupTogglerDisplay, "Základní mapa ČR", false, [addNewLayer("wms_zm10", service_wms_zm10, "0", ZIndexes.base)]);
	WMSLayerTogglers.wms_izs = addLayerToggler(groupTogglerDisplay, "Mapa IZS", false, [addNewLayer("wms_izs", service_wms_izs, "0", ZIndexes.base)]);
	WMSLayerTogglers.wms_katastr = addLayerToggler(groupTogglerDisplay, "Katastrální mapa", true, [addNewLayer("wms_katastr", service_wms_katastr, "hranice_parcel,dalsi_p_mapy,RST_KN")]);
	//ČÚZK NÁZVY A ADRESY
	WMSLayerTogglers.wms_geonames = addLayerToggler(groupTogglerNames, "GeoNames", false, [addNewLayer("wms_geonames", service_wms_geonames, "GN1,GN2,GN3", ZIndexes.popup)]);
	WMSLayerTogglers.wms_ulice = addLayerToggler(groupTogglerNames, "Názvy ulic", false, [addNewLayer("wms_ulice", service_wms_inspire, "AD.Thoroughfare")]);
	WMSLayerTogglers.wms_budovy = addLayerToggler(groupTogglerNames, "Adresní místa 1a", true, [addNewLayer("wms_budovy", service_wms_inspire, "AD.Addresses.Text.AddressNumber,AD.Addresses.ByPrefixNumber.TypOfBuilding.2,AD.Addresses.ByPrefixNumber.TypOfBuilding.1")]);
	WMSLayerTogglers.wms_budovy_b = addLayerToggler(groupTogglerNames, "Adresní místa 1b", true, [addNewLayer("wms_budovy_b", service_wms_inspire, "AD.Addresses.Text.AddressAreaName,AD.Addresses.Text.ThoroughfareName")]);
	//ČÚZK HRANICE
	WMSLayerTogglers.wms_stat = addLayerToggler(groupTogglerBorders, "Státní hranice", false, [addNewLayer("wms_stat", service_wms_hranice, "GP_SPH_STAT")]);
	WMSLayerTogglers.wms_kraje = addLayerToggler(groupTogglerBorders, "Hranice krajů", false, [addNewLayer("wms_kraje", service_wms_hranice, "GP_SPH_KRAJ")]);
	WMSLayerTogglers.wms_okresy = addLayerToggler(groupTogglerBorders, "Hranice okresů", false, [addNewLayer("wms_okresy", service_wms_hranice, "GT_SPH_OKRES,GP_SPH_OKRES")]);
	WMSLayerTogglers.wms_orp = addLayerToggler(groupTogglerBorders, "Hranice ORP", false, [addNewLayer("wms_orp", service_wms_hranice, "GT_SPH_ORP,GP_SPH_ORP")]);
	WMSLayerTogglers.wms_pou = addLayerToggler(groupTogglerBorders, "Hranice OPÚ", false, [addNewLayer("wms_pou", service_wms_hranice, "GT_SPH_OPU,GP_SPH_OPU")]);
	WMSLayerTogglers.wms_obce = addLayerToggler(groupTogglerBorders, "Hranice obcí", false, [addNewLayer("wms_obce", service_wms_hranice, "GT_SPH_OBEC,GP_SPH_OBEC")]);
	WMSLayerTogglers.wms_katuzemi = addLayerToggler(groupTogglerBorders, "Hranice KÚ", false, [addNewLayer("wms_katuzemi", service_wms_hranice, "GT_SPH_KU,GP_SPH_KU")]);
	WMSLayerTogglers.wms_zsj = addLayerToggler(groupTogglerBorders, "Hranice ZSJ", false, [addNewLayer("wms_zsj", service_wms_hranice, "GT_SPH_ZSJ,GP_SPH_ZSJ")]);
	WMSLayerTogglers.wms_chuhr = addLayerToggler(groupTogglerBorders, "Hranice CHÚ", false, [addNewLayer("wms_chuhr", service_wms_zabaged, "213,214")]);
	//EXTERNÍ MAPY
	WMSLayerTogglers.xyz_livemap = addLayerToggler(groupTogglerExternal, "Waze LiveMap", false, [addNewLayer("xyz_livemap", service_xyz_livemap)]);
	WMSLayerTogglers.xyz_google = addLayerToggler(groupTogglerExternal, "Google Maps", false, [addNewLayer("xyz_google", service_xyz_google)]);
	WMSLayerTogglers.xyz_google_terrain = addLayerToggler(groupTogglerExternal, "Google Terrain Maps", false, [addNewLayer("xyz_google_terrain", service_xyz_google_terrain)]);
	WMSLayerTogglers.xyz_google_hybrid = addLayerToggler(groupTogglerExternal, "Google Hybrid Maps", false, [addNewLayer("xyz_google_hybrid", service_xyz_google_hybrid)]);
	WMSLayerTogglers.xyz_google_streetview = addLayerToggler(groupTogglerExternal, "Google StreetView", false, [addNewLayer("xyz_google_streetview", service_xyz_google_streetview, null, ZIndexes.popup)]);
	WMSLayerTogglers.xyz_osm = addLayerToggler(groupTogglerExternal, "OpenStreetMaps", false, [addNewLayer("xyz_osm", service_xyz_osm)]);
	WMSLayerTogglers.xyz_here = addLayerToggler(groupTogglerExternal, "Here Maps", false, [addNewLayer("xyz_here", service_xyz_here)]);
	WMSLayerTogglers.xyz_here_orto = addLayerToggler(groupTogglerExternal, "Here Satelitte Maps", false, [addNewLayer("xyz_here_orto", service_xyz_here_orto)]);
	WMSLayerTogglers.xyz_mapycz = addLayerToggler(groupTogglerExternal, "Mapy.cz", false, [addNewLayer("xyz_mapycz", service_xyz_mapycz)]);
	WMSLayerTogglers.xyz_mapycz_turist = addLayerToggler(groupTogglerExternal, "Mapy.cz turistické", false, [addNewLayer("xyz_mapycz_turist", service_xyz_mapycz_turist)]);
	WMSLayerTogglers.xyz_mapycz_zima = addLayerToggler(groupTogglerExternal, "Mapy.cz zimní", false, [addNewLayer("xyz_mapycz_zima", service_xyz_mapycz_zima)]);
	WMSLayerTogglers.xyz_mapycz_zemepis = addLayerToggler(groupTogglerExternal, "Mapy.cz zeměpisné", false, [addNewLayer("xyz_mapycz_zemepis", service_xyz_mapycz_zemepis)]);
	WMSLayerTogglers.xyz_mapycz_orto = addLayerToggler(groupTogglerExternal, "Mapy.cz ortofoto", false, [addNewLayer("xyz_mapycz_orto", service_xyz_mapycz_orto)]);
	WMSLayerTogglers.xyz_mapycz_panorama = addLayerToggler(groupTogglerExternal, "Mapy.cz Panorama", false, [addNewLayer("xyz_mapycz_panorama", service_xyz_mapycz_panorama, null, ZIndexes.popup)]);
	WMSLayerTogglers.xyz_shocart_turist = addLayerToggler(groupTogglerExternal, "Shocart turistická", false, [addNewLayer("xyz_shocart_turist", service_xyz_shocart_turist)]);
	WMSLayerTogglers.xyz_shocart_cyklo = addLayerToggler(groupTogglerExternal, "Shocart cykloturistická", false, [addNewLayer("xyz_shocart_cyklo", service_xyz_shocart_cyklo)]);
	WMSLayerTogglers.xyz_april = addLayerToggler(groupTogglerExternal, "Apríl !!!", false, [addNewLayer("xyz_april", service_xyz_april)]);

	window.addEventListener("beforeunload", function() {
		if (localStorage) {
			var JSONStorageOptions = {};
			for (var key in WMSLayerTogglers) {
				if (WMSLayerTogglers[key].serviceType == "WMS") {
					JSONStorageOptions[key] = document.getElementById(WMSLayerTogglers[key].htmlItem).checked;
				}
			}
			localStorage.WMSLayers = JSON.stringify(JSONStorageOptions);
		}
	}, false);
	if (localStorage.WMSLayers) {
		var JSONStorageOptions = JSON.parse(localStorage.WMSLayers);
		for (var key in WMSLayerTogglers) {
			if (JSONStorageOptions[key] && WMSLayerTogglers[key].serviceType == "WMS") {
				document.getElementById(WMSLayerTogglers[key].htmlItem).click();
			}
		}
	}

	var GSVlayer = WMSLayerTogglers.xyz_google_streetview.layerArray[0].layer;
	var enteringStreetView = false;
	var ignoreStreetViewExit = false;
	var previousDisplayState = true;
	var controlObserver = new MutationObserver(function(mutationRecords) {
			if (!document.getElementById("layer-switcher-item_Google_StreetView").checked) {
				if (mutationRecords[0].target.classList.contains('overlay-button-active') == previousDisplayState) {
					if (previousDisplayState == true && !ignoreStreetViewExit) {
						previousDisplayState = ! mutationRecords[0].target.classList.contains('overlay-button-active');
						W.map.addLayer(GSVlayer);
						enteringStreetView = true;
						GSVlayer.setVisibility(true);
						enteringStreetView = false;
					} else if (previousDisplayState == false) {
						previousDisplayState = ! mutationRecords[0].target.classList.contains('overlay-button-active');
						GSVlayer.setVisibility(false);
						W.map.removeLayer(GSVlayer);
					}
				}
			}
		});
	controlObserver.observe(document.querySelector(".street-view-control"), { attributes: true, attributeFilter: ['class'] });
	GSVlayer.events.register('visibilitychanged', null, function() {
		if (!enteringStreetView && GSVlayer.getVisibility()) {
			ignoreStreetViewExit = true;
		}
		if (!GSVlayer.getVisibility()) {
			ignoreStreetViewExit = false;
		}
	});

	const { tabLabel, tabPane } = W.userscripts.registerSidebarTab("wms-cz-private");
	tabLabel.innerText = 'WMS';
    tabLabel.title = 'Private - Czech WMS layers';
	tabLabel.id = "sidepanel-wms";
    tabPane.innerHTML = "<b><u><a href='https://greasyfork.org/scripts/28160' target='_blank'>" + GM_info.script.name + "</a></u></b> &nbsp; v" + GM_info.script.version;
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
	opacityLabel.textContent = "Průhlednost vrstvy: " + opacityRange.value + " %";
	opacityLabel.id = "WMSOpacityLabel";
	opacityLabel.htmlFor = opacityRange.id;
	section.appendChild(opacityLabel);
	section.appendChild(opacityRange);
	tabPane.appendChild(section);
	await W.userscripts.waitForElementConnected(tabPane);
	
	opacityRange.addEventListener("input", function() {
		var value = document.getElementById("WMSLayersSelect").value;
		if (value !== "" && value !== "undefined") {
			var layer = W.map.getLayerByName(value);
			layer.setOpacity(opacityRange.value / 100);
			document.getElementById("WMSOpacityLabel").textContent = "Průhlednost vrstvy: " + document.getElementById("WMSOpacity").value + " %";
		}
	});
	WMSSelect.addEventListener("change", function() {
		opacityRange.value = W.map.layers.filter(layer => layer.name == WMSSelect.value)[0].opacity * 100;
		document.getElementById("WMSOpacityLabel").textContent = "Průhlednost vrstvy: " + document.getElementById("WMSOpacity").value + " %";
	});
	setZOrdering(WMSLayerTogglers);
	W.map.events.register("addlayer", null, fillWMSLayersSelectList);
	W.map.events.register("removelayer", null, fillWMSLayersSelectList);
	W.map.events.register("addlayer", null, setZOrdering(WMSLayerTogglers));
	W.map.events.register("removelayer", null, setZOrdering(WMSLayerTogglers));
	W.map.events.register("moveend", null, setZOrdering(WMSLayerTogglers));
}

function fillWMSLayersSelectList() {
	var select = document.getElementById("WMSLayersSelect");
	var value = select.value;
	var htmlCode;
	W.map.layers.filter(layer => layer.params !== undefined && layer.params.SERVICE !== undefined && layer.params.SERVICE == "WMS").forEach(
		layer => (htmlCode += "<option value='" + layer.name + "'>" + layer.name + "</option><br>"));
	select.innerHTML = htmlCode;
	select.value = value;
}

function addNewLayer(id, service, serviceLayers, zIndex = 0, opacity = 1) {
	var newLayer = {};
	newLayer.serviceType = service.type;
	if (service.type == "XYZ" & zIndex == 0) {
		newLayer.zIndex = ZIndexes.base;
	} else {
		newLayer.zIndex = (zIndex == 0) ? ZIndexes.popup : zIndex;
	}
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
					RESOLUTION_PROPERTIES: {},
					resolutions: WMSLayersTechSource.resolutions,
					serverResolutions: WMSLayersTechSource.resolutions.slice(0, ("maxZoom" in service && service.maxZoom > 0) ? service.maxZoom : 23),
					transitionEffect: "resize",
					attribution: service.attribution
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
		var groupButton = document.createElement("wz-button");
		groupButton.color = "clear-icon";
		groupButton.size = "xs";
		var iCaretDown = document.createElement("i");
		iCaretDown.className = "toggle-category w-icon w-icon-caret-down";
		iCaretDown.dataset.groupId = layerSwitcherGroupItemName.replace("layer-switcher-", "").toUpperCase();
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
		groupButton.addEventListener("click", layerTogglerGroupMinimizerEventHandler(iCaretDown));
		togglerSwitch.addEventListener("click", layerTogglerGroupMinimizerEventHandler(iCaretDown));
		groupButton.appendChild(iCaretDown);
		togglerContainer.appendChild(groupButton);
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
		togglerCheckbox.addEventListener("change", layerTogglerEventHandler(layerArray[i]));
		layerGroupCheckbox.addEventListener("change", layerTogglerGroupEventHandler(togglerCheckbox, layerArray[i]));
		layerArray[i].layer.name = layerName + ((layerArray.length > 1) ? " " + i : "");
	}
	registerKeyShortcut("WMS: " + layerName, layerKeyShortcutEventHandler(layerGroupCheckbox, togglerCheckbox), layerShortcut);
	return layerToggler;
}

function registerKeyShortcut(actionName, callback, keyName) {
	I18n.translations[I18n.locale].keyboard_shortcuts.groups.default.members[keyName] = actionName;
	W.accelerators.addAction(keyName, {group: "default"});
	W.accelerators.events.register(keyName, null, callback);
	W.accelerators._registerShortcuts({["name"]: keyName});
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
				layerType.layer.setVisibility(this.checked && checkbox.checked);
			}
		}
		else {
			if (checkbox.checked) {
				layerType.layer.setVisibility(this.checked && checkbox.checked);
				W.map.removeLayer(layerType.layer);
			}
		}
		checkbox.disabled = !this.checked;
	};
}

function layerTogglerGroupMinimizerEventHandler(iCaretDown) {
	return function() {
		var ulCollapsible = iCaretDown.parentElement.parentElement.parentElement.getElementsByTagName("UL")[0];
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
					var l = W.map.getLayerByName(layerTogglers[key].layerName);
					if (l !== undefined) {
						l.setZIndex(layerTogglers[key].layerArray[j].zIndex);
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

document.addEventListener("wme-map-data-loaded", init, {once: true});