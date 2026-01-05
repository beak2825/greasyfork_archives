// ==UserScript==
// @name WME-JumpMaps
// @namespace https://greasyfork.org/ru/scripts/19626-wme-jumpmaps
// @description The script adds in the WME links to third party mapping systems (yandex/2gis/Here/bing/etc.)
// @include https://*.waze.com/*editor*
// @include https://n.maps.yandex.ru/*
// @include /^https?://maps\.yandex\.(ru|by)/*$/
// @include /^https?://yandex\.(ru|by)/maps.*$/
// @include https://www.google.*/maps*
// @include https://www.google.com.*/maps*
// @include https://maps.google.*
// @include http://maps.google.*
// @include /^https?://2gis\.(ru|ua|kz|kg|ae|cl|com\.cy|cz|it)/.*$/
// @include http://mapcam.info/speedcam/*
// @include https://mapcam.info/speedcam/*
// @include /^https?://.*\.rosreestr\.ru/.*$/
// @include http://wikimapia.org/*
// @include https://wikimapia.org/*
// @include http://*.balticmaps.eu/*
// @include https://*.balticmaps.eu/*
// @include http://balticmaps.eu/*
// @include https://balticmaps.eu/*
// @include http://*.map.nca.by/*
// @include https://*.map.nca.by/*
// @include http://map.nca.by/*
// @include https://map.nca.by/*
// @include https://www.kadastrs.lv/map/*
// @include http://www.openstreetmap.org/*
// @include https://www.openstreetmap.org/*
// @include http://map.land.gov.ua/kadastrova-karta*
// @include http://maps.by/searchate*
// @include https://www.mapillary.com/*
// @include http://www.maps.lt/map/*
// @match https://*.waze.com/*map-editor/*
// @match https://*.waze.com/*editor*
// @match https://*.waze.com/*beta_editor/*
// @icon data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACcAAAAnCAYAAACMo1E1AAAJiklEQVRYCc1YaWxU1xX+3uZZvALGZjG7y2bMEsBJnVDsFlEgRTQqXQhS1bRVm+CkqIW0SaVUpKqiSE2qQINEkFrRkPQHRkUVCaGUBIckDmERxbUxDWAZzGK8YHvGnhnP8l6/c+1nvANNg3KlO3c7757vnu2euZrjOLjbsvMUrFi8ukhLOA/z+6mAM86BNg4aRsFBswbnGqCx4iJM/YBlzir7yULE7paPdjfgtpdXf8WB/TiZr+KZ0u+UmaahjeAPaNB3lBTOOnrH390JuO0nzuYh5rxI2m/c6cZD0Wma9hYs7ZmSxbOrhqJx54eVXBlgVpVXvsxTPwnH0d2PPnOrabYO7Y+zC2dvLgLiQ+03JLjtx8+NQjxRSmkVD/XxZ52nFI/ANL5dUjCzebC9BgVHYNMRi79DV6Gxf75FA2pgmSsJ8NP+nAaAUxKLxY/fC2AumG6ABf0laLoE0pbRxpQq71Bi7S03ce3TGlyqPIfW+uuIRjqgaTqS/KnIyMrGpDkzMWH2dHhTUnqzGdAXQWg0IfJfXtTLBvtIbnt55VaGiJ8N+LrfRKChHlVHjyFw5SwmZd9AXm47skcE4UsK028SiHQaaGz1oOp8Oi42zUBO/gPIW/Jl6JbVb6e+Q4acbSWFcza6sz3gJFw4Mafidl5Ze/oUKg4dwFeXtGDtsiZMTb0B3W4FbMZYmwoiB+hSbdgJHZX1qdhRmovrkSV46Ltr4ElOc3kPbOnFmqXNdcPMrfDAOHY7YNUfvI+zh/fiuZ834Jn1l5FrXYQeoKO1k0/YC0R9QCdb6Xf4oEc8mJsVwksbzyBv7Hv4ZN87sOPDXBQSrgRHd1HgVOS/TYC9eq4al47/A7/7dQhLpl0H6nk7RaOUFFWl03R1g5Xb9VQZs8aS4I9YePb71UiNlaHqw2Mu70FbCfSCRxYVOLmSBqXsnoy0B3By/35sfDyK+3KagGaC0whMJzCtFzA6A7RuUAJM9YWFgeSEgQ3rLqLmkyNov3lzOHa8nrvw6HKJy105HPWFk6eRP70ZX5sXABobeM+LxAhKwIh9KVAy7gYroOj4CpwLPmph4ZQgFs26hNrK/wzHjvmDs0pw6ZJdDHeJRyMRXKk4iUe/ZUMP0fATwS4wlEYXKJGWC0QcQcbdoFVfgLJKP25gxYMNqD9fPSw4wSO4dEl7hqO8UVOL0WmNyJ8coZFTcnIVKkkJCIIRxmId0pd5jh1K0BHA6gBsFD3pYiZm5rQgdKMSZW/uRe2/zjA2hkkwsAgunQY4deDSrZlrFy7ivnmAR+cmMVYFSMAIEGlFWuyytQnI7rYzh630paW4WXkox0JWxjS88KyJRwpPIVjxBj7c/WdI3OxfBBe3dcb1X3DHjm0jUH8F+bMIoLOT0wwDAsYQKTGus+mKaV2tcljRMHdVDix90wP4soF0njCrGFr6fCxamIX1j47EKy+Pxvzca/h4z16XZa/WGWeqDJb+MViJhsPQOtuQlWmjJRRmjKJqSctLQCFgxGTLsUhIJwjDT1RJDJde2KBqHQ8SmpeCo0TpQ3ZLEJ3hFjQHTVy+buDMvx1cupGGOcVLBrAXXGZ3aj1gUU1QMr6MFPzh1Q6MGb+MYa0TCdvpqjyP6iccmKZFCVno6IggwbHtaIiTzmFreLzojHQyyZETkZ3lR1vdVYzMmYzJCxZhUfFE+NIGuTWY8puS8/OrsYOh8/iTkZ4zDZnx8fjpLzYj2B6i9ei0HgIkuLgI3EpC5YlynDn+MdY89mMkGPvC0bhaaw204ljp68j9+jKkjJuMMD0fSV5U73oJcx5cjKwv5Q3GtmuOuBil5M/I0KWprhaTpkyARmfw2GGkIYxRehRZZgzZrBOpyfCVC0wEDiNLiyDHY2N8UgI5PgcjowHUlR+Gt6kOE/waxlgJjIgFYbe3wZOWMTRTrgguMVmCcxb2pqSnIBxsw9XqSoTq6zBv4QaqLEQSqorWZPBTCVuWHI12uXbtd7BmzTdhWB5E43FETROdcRsZUybihdf3UIo6OjojGJ2ZhgsVZ5Dk8yM1M6s3y0H62jWTqXKNgOldKg7+DS0155HsScITTz6FtIwRiNJbDbqjTQ+2DYdJh04VanReBmf2daozQWASOLyc9/DeEftLS/YiznnH64dl6Cg9uA+TFi7htUtnGr5cNB1De5tG1JNDCX08Fke634vnnv8tDG8ymm+2UFYSNxJITvbDobHzULAsExHxaM7L2D2izcN6vB7+ZeVMIgHL76OUdezauQNB04cF+QuGhyWr/L+rvXbSsWKdlY1yZbhf2NzwWOlfkBIO4KlNmzEyexxa24K0fRMfHHkXh97eT090sHLVwyhevkIZui7xj0WA+ai2qorT2PPXN9EeCKKgsBBJPMi7Hx3D0h9soHfext74P9fyzBlt7H9ti328rnEu981Xu/NH4ynHTp+F+sZG/P2NXYh2tGP6jOk4evif2Pr7F2l/7Qi0tuL9I+9hZOYo5M2dj2gsRslRnV4vLl+qxW9+9TSzqmsI0VYraWe1V+qx9LESpIzMVAcTXiJtKXJQt68mNG3fE/dnldIhxDP0HQwO69QCf+RmMOjy81c+gpYFBfjoyEGUPb0JwZZmpPHUAkgOYJP5UQJ8aGkRHUDimoMYc7xDb+1HhGEje8wY+JJ9aGm6yX+AvAIZz5TqSUc0ip0C5jLubgWPdG+l6eVV+0mo/tEnHFttIh8avIcYSxFqY8zavQOtV2rhT02lA2iUXoAemkS1j+mRhrhxKBBAqPUmvH4/VexFoC0A0+PDil8+Dy8dQwHqAUdeZCD7KUB8ESgpzFstfSU5NcsnAl6dq0hJOhq3ErXOllLkQVPTM7B4zfdQ9qdt6CAzKRalW7j+R8jKnYEY1SrbG7wpIsFWlO3cio6WJkRDIbXH3NVrqXIGRZa+KqSnd+GSBd56xNFdjC1btqhuwfjRjSfqGkZxcL94pmzgVnYUjZcqTcuZiIbaC8q+Fq/7IcbPyqeKDZiUoEhRNwxY9PCxs/OZ8TYjxCx65vLVmPnQMgVebdTrx8UlU7qmbyt5YPZud7lHrTJRRklWlVcdotSKXYJ71VIQR/IK85YXqdyqi6tkYj2lSBb4dsHT1PRM3oOO4ke+in8vfn3Aybx6EuDbxb0CqPh0vZVIAtKnDAAnq+pRxTILRNR9qP/PA7U/+Qz2iCOs+thcf95lygY/n/c5xoNX8wrnbCrqZWP9+Q8LziX+Qr5suuDc9gv5JuyCc9s7fU2nTdVI1vO/vqb/Fz8AGFNbpfcoAAAAAElFTkSuQmCC
// @version 3.6.1.0
// @author skirda
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/19626/WME-JumpMaps.user.js
// @updateURL https://update.greasyfork.org/scripts/19626/WME-JumpMaps.meta.js
// ==/UserScript==

var wmeJM_version = "3.6.1.0";
console.log("WME-JumpMaps (" + wmeJM_version + "): Start");

var wmeJM_IconWME='data:image/png;base64,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';
//'

var wmeJM_countProbe=0;
var wmeJM_countProbe2=0;
var wmeJM_countProbeWM=0;
var wmeJM_countProbeLOC=0;
var wmeJM_debug=false;
var wmeJM_restoreSelected=false;
var wmeJM_around=false;

/*
localStorage:
	WMEJumpMapsDebug = bool = "true" || "1" - enable debug
	WMEJumpMapsLink  = JSON = links
	WMEJumpMapsRestoreSelected = bool = восстанавливать выделенные объекты после прыжка = "true" || "1" - restore

localStorage.getItem(Name)
localStorage.setItem(Name,value)
localStorage.removeItem(Name)


localStorage.removeItem("WMEJumpMapsLink")
localStorage.getItem("WMEJumpMapsLink")
localStorage.setItem("WMEJumpMapsLink",)

localStorage.removeItem("WMEJumpMapsDebug")
localStorage.setItem("WMEJumpMapsDebug","1")
localStorage.getItem("WMEJumpMapsDebug")
*/

var wmeJM_Config={};
var wmeJM_Config0 = {
	"_map_WME":    {save:0, title:"Open in WME",                 name:"[WME]",   template:'https://www.waze.com/editor/?env=row&zoom={{zoom}}&lat={{lat}}&lon={{lon}}'},
	"_map_WMEB":   {save:0, title:"Open in WME Beta",            name:"[WMEB]",  template:'https://beta.waze.com/editor/?env=row&zoom={{zoom}}&lat={{lat}}&lon={{lon}}'},
	"_map_LI":     {save:0, title:"Open in LiveMap",             name:"[Live]",  template:'https://www.waze.com/livemap/?zoom={{zoom}}&lon={{lon}}&lat={{lat}}'},
	//-------------------------------------
	"_map_2GIS":   {save:1, title:"Open in 2GIS Map",            name:"[2Gis]",  template:'http://2gis.ru/{{city}}?queryState=center/{{lon}}%2C{{lat}}/zoom/{{zoom}}'},
	"_map_NM":     {save:1, title:"Open in Yandex Narod",        name:"[NYM]",   template:'http://n.maps.yandex.ru/?ll={{lon}}%2C{{lat}}&z={{zoom}}&l=pmap'},
	"_map_SC":     {save:1, title:"Open in mapcam.info",         name:"[SC]",    template:'http://mapcam.info/speedcam/?lng={{lon}}&lat={{lat}}&z={{zoom}}&t=OSM'},
	"_map_WM":     {save:1, title:"Open in wikimapia.org",       name:"[WM]",    template:'http://wikimapia.org/#lang=ru&lat={{lat}}&lon={{lon}}&z={{zoom}}&m=b'},
	"_map_RE":     {save:1, title:"Open in RosReestr",           name:"[RE]",    template:'http://pkk5.rosreestr.ru/#x={{lon}}&y={{lat}}&z={{zoom}}'},
	"_map_GM":     {save:1, title:"Open in Google MapMaker",     name:"[GMM]",   template:'https://www.google.com/mapmaker?ll={{lat}},{{lon}}&z={{zoom}}&spn=0.01277,0.030212&lyt=large_map_v3'},
	"_map_BP":     {save:1, title:"Open in benzin-price.ru",     name:"[BP]",    template:'http://www.benzin-price.ru/m/index.php?lat={{lat}}&lon={{lon}}&distance=1'},// distance=1 == 500m, 2 == 2km... 5km, 10km},
	"_map_NAVITEL":{save:1, title:"Open in Navitel",             name:"[Navi]",  template:'http://maps.navitel.su/?zoom={{zoom}}&lat={{lat}}&lon={{lon}}'},
	"_map_OSM":    {save:1, title:"Open in OSM",                 name:"[OSM]",   template:'http://www.openstreetmap.org/#map={{zoom}}/{{lat}}/{{lon}}'},
	"_map_SC2":    {save:1, title:"Open in SpeedCamOnLine.ru",   name:"[SCO]",   template:'http://speedcamonline.ru/view/Rus/{{lat}}/{{lon}}/{{zoom}}'},
	"_map_YM":     {save:1, title:"Open in Yandex Map",          name:"[YM]",    template:'http://maps.yandex.ru/?ll={{lon}}%2C{{lat}}&z={{zoom}}&l=pmap%2Cstv'},
	"_map_Google": {save:1, title:"Open in Google Map",          name:"[G]",     template:'http://www.google.com/maps/?ll={{lat}}%2C{{lon}}&z={{zoom}}&t=m'},
	"_map_BING":   {save:1, title:"Open in Bing Map",            name:"[Bing]",  template:'http://www.bing.com/maps/?v=2&cp={{lat}}~{{lon}}&lvl={{zoom}}&dir=0&sty=h&form=LMLTEW'}, // sty: "h" - ariel, "r" - map
	"_map_HERE":   {save:1, title:"Open in Here Map ",           name:"[Here]",  template:'https://www.here.com/?map={{lat}},{{lon}},{{zoom}},normal'}, // "hybrid.day" - ariel, "normal.day" - map
	"_map_BM":     {save:1, title:"Open in Baltic Maps",         name:"[BM]",    template:'http://old.balticmaps.eu/?lang=lv&centerx={{lon}}&centery={{lat}}&zoom={{zoom}}&layer=map&ls=o'},
	"_map_KDL":    {save:1, title:"Open in Kadastr LV",          name:"[KDL]",   template:'https://www.kadastrs.lv/map/di?xy={{lat}},{{lon}}&z={{zoom}}'},
	"_map_NCABY":  {save:1, title:"Open in Kadastr BY",          name:"[NCA]",   template:'http://map.nca.by/map.html?xy={{lat}},{{lon}}&z={{zoom}}'},
	"_map_MRY":    {save:1, title:"Open in mapillary.com",       name:"[MRY]",   template:'https://www.mapillary.com/app/?lat={{lat}}&lng={{lon}}&z={{zoom}}'},
	"_map_WMFLAB": {save:1, title:"Open in tools.wmflabs.org",   name:"[WMF]",   template:'https://tools.wmflabs.org/geohack/geohack.php?params={{lat}}_N_{{lon}}_E_scale:{{zoom}}'},
	"_map_OSV":    {save:1, title:"Open in openstreetcam.org",   name:"[OSV]",   template:'http://openstreetcam.org/map/@{{lat}},{{lon}},{{zoom}}z'},
	"_map_AMR":    {save:1, title:"Open in atlas.mos.ru",        name:"[AMR]",   template:'https://atlas.mos.ru/?lang=ru&z={{zoom}}&ll={{lon}}%2C{{lat}}'},
	"_map_VCUA":   {save:1, title:"Open in maps.visicom.ua",     name:"[VCUA]",  template:'https://maps.visicom.ua/c/{{lon}},{{lat}},{{zoom}}?lang=uk'},
	"_map_MRUA":   {save:1, title:"Open in atu.minregion.gov.ua",name:"[MRUA]",  template:'http://atu.minregion.gov.ua/ua/karta#map={{zoom}}//{{lat}}//{{lon}}&&layer=10615838328233625-v:1%7Cop:1//8906587737484582-v:0%7Cop:1//8894715282779406-v:1%7Cop:1'},
	"_map_KADUA":  {save:1, title:"Open in Kadastr UA",          name:"[KADUA]", template:'http://map.land.gov.ua/kadastrova-karta#map={{zoom}}//{{lon}}//{{lat}}'},
	"_map_MAPLT":  {save:1, title:"Open in maps.lt",             name:"[MAPLT]", template:'http://www.maps.lt/map/default.aspx?lang=lt#q={{lat}}%2C%20{{lon}}'}
};


var wmeJM_ArrW2B  =[{w:7,b:-2},{w:6,b:-1},{w:5,b:0},{w:4,b:1},{w:3,b:2},{w:2,b:3},{w:1,b:4},{w:0,b:5}];
var wmeJM_ArrW2KDL=[{w:0,r:75000},{w:1,r:50000},{w:2,r:15000},{w:3,r:10000},{w:4,r:5000},{w:5,r:3000},{w:6,r:1000},{w:7,r:750},{w:8,r:500},{w:9,r:200}];

function cloneConfig(obj)
{
	if (null === obj || "object" != typeof obj) return obj;
	var copy = obj.constructor();
	for (var attr in obj)
	{
		if (obj.hasOwnProperty(attr))
		{
			copy[attr] = cloneConfig(obj[attr]);
		}
	}
	return copy;
}

function CreateID()
{
	return 'WME-JumpMaps-' + wmeJM_version.replace(/\./g,"-");
}

function WmeJM_Config2String()
{
	// exclude private
	var jsn={};
	for(var i in wmeJM_Config)
	{
		if(wmeJM_Config[i].save === 1)
		{
			jsn[i]=wmeJM_Config[i];
		}
	}
	return JSON.stringify(jsn);//,function(key, value) { if (key === "save" && value === 1) {return undefined; }  return value;});
}


function getElementsByClassName(classname, node)
{
	if(!node)
		node = document.getElementsByTagName("body")[0];
	var a = [];
	var re = new RegExp('\\b' + classname + '\\b');
	var els = node.getElementsByTagName("*");
	for (var i=0,j=els.length; i<j; i++)
		if (re.test(els[i].className)) a.push(els[i]);
	return a;
}

function wmer_generate_permalink() {
  	var wcp=document.getElementsByClassName('WazeControlPermalink');
  	for(var i=0; i < wcp.length; ++i)
  		for (var j=0; j < wcp[i].getElementsByTagName('a').length;++j)
  		{
  			var href=wcp[i].getElementsByTagName('a')[j].href;
			if (href.indexOf(".waze.com/") > 0 && href.indexOf("/editor") > 0)
			{
				// kill "/ru/", kill "layers"
				href=href.replace("/ru/","/").replace(/layers=([0-9]+)\&/,"") + "&marker=yes";
				return href;
			}
		}
	return "";
}

// где мы сейчас?
function WmeJM_GetLocationType()
{
	if(wmeJM_debug) console.log("WME-JumpMaps (" + wmeJM_version + "): WmeJM_GetLocationType(), location.hostname=" + location.hostname + ", location.href=" + location.href);

	if (location.hostname === "www.waze.com" || location.hostname === "editor-beta.waze.com" || location.hostname === "beta.waze.com")
		return "waze";
	if (location.hostname === "n.maps.yandex.ru")
		return "NM";
	if ((location.hostname === "yandex.ru" || location.hostname === "yandex.by") && location.pathname.indexOf("/maps/") >= 0)
		return "YM";
	if (location.hostname === "maps.google.com" || location.hostname.startsWith("www.google."))
		return "google";
	if (location.hostname === "2gis.ru" || location.hostname === "2gis.ua" || location.hostname === "2gis.kz" || location.hostname === "2gis.kg") //ae	cl	com.cy	cz	it
		return "2gis";
	if (location.hostname.indexOf(".rosreestr.ru") >= 0)
		return "re";
	if (location.hostname === "mapcam.info")
		return "sc";
	if (location.hostname === "wikimapia.org")
		return "wm";
	if (location.hostname === "balticmaps.eu")
		return "bm";
	if (location.hostname === "www.kadastrs.lv")
		return "kdl";
	if (location.hostname === "map.nca.by")
		return "ncaby";
	if (location.hostname === "www.openstreetmap.org")
		return "osm";
	if (location.hostname === "www.mapillary.com")
		return "mry";
	if (location.hostname === "tools.wmflabs.org")
		return "wmflab";
	if (location.hostname === "openstreetcam.org")
		return "osv";
	if (location.hostname === "atlas.mos.ru")
		return "amr";
	if (location.hostname === "maps.visicom.ua")
		return "vcua";
	if (location.hostname === "atu.minregion.gov.ua")
		return "mrua";
	if (location.hostname === "map.land.gov.ua")
		return "kadua";
	if (location.hostname === "maps.by" && location.pathname.indexOf("/searchate") >= 0)
		return "mapbys";
	if (location.hostname === "www.maps.lt" && location.pathname.indexOf("/map") >= 0)
		return "maplt";
	return "";
}

function __getQueryString(link, name)
{
	if (link.indexOf( name + '=' ) <= 0)
		return -1;
	var pos = link.indexOf( name + '=' ) + name.length + 1;
	var len = link.substr(pos).indexOf('&');
	return (len == -1)?link.substr(pos):link.substr(pos,len);
}

// только получение координат и зума как есть (преобразования потом)
function WmeJM_GetLLZ()
{
	var lat=0;
	var lon=0;
	var zoom=0;
	var city='';
	var href=location.href;
	var locType=WmeJM_GetLocationType();
	switch(locType)
	{
		case "waze":
		{
			var urPos=new OpenLayers.LonLat(W.map.getCenter().lon,W.map.getCenter().lat);
			urPos.transform(new OpenLayers.Projection("EPSG:900913"),new OpenLayers.Projection("EPSG:4326"));
			zoom=W.map.getZoom();
			lat=urPos.lat;
			lon=urPos.lon;
			break;
		}
		case "NM":
		{
			zoom = parseInt(__getQueryString(href, 'z'));
			var ll = __getQueryString(href, 'll').split('%2C');
			lat=ll[1];
			lon=ll[0];
			break;
		}
		case "YM":
		{
			//if(wmeJM_debug) console.log("locType",locType)
			// https://yandex.ru/maps/?whatshere[point]=37.500278%2C56.130350&whatshere[zoom]=17&mode=whatshere
			//if(wmeJM_debug) console.log("href",href)
			var qll=__getQueryString(href, 'whatshere%5Bpoint%5D');
			var shortLink=false;
			if (qll === -1)
			{
				qll=__getQueryString(href, 'll');
				shortLink=true;
			}
			//if(wmeJM_debug) console.log("qll",qll)
            let lnk=href;
			if (qll == -1) // Грязный хак :-(
				lnk=document.getElementsByClassName("home-panel-content-view_has-panorama__link-nmaps")[0].href;

			let ll = __getQueryString(lnk, (shortLink?'ll':'whatshere%5Bpoint%5D')).split('%2C');
			//if(wmeJM_debug) console.log("ll",ll)
			lat=ll[1];
			lon=ll[0];
			zoom = parseInt(__getQueryString(lnk, (shortLink?'z':'whatshere%5Bzoom%5D')));
			//if(wmeJM_debug) console.log("zoom",zoom)
			break;
		}
		case "google":
		{
			var i2=href.indexOf("@");
			if (i2 >= 0)
			{
				// https://www.google.com/maps/@51.70131,39.14356,18z
				var l=href.substr(i2+1).split(",");
				lat=l[0];
				lon=l[1];
				var re = /([0-9]+)([zm]+).*/;
				if (l[2].indexOf("/data") > -1)
					re = /([0-9]+)([zm]+)\/.*/;
				var zoomAttr = l[2].replace(re, '$1.$2').split(".");
				if (zoomAttr[1] === "m")
				{
					var ArrM2Z=new Array(
					{z:1,m:51510000},{z:2,m:25755000},{z:3,m:12877500},{z:4,m:6438750},{z:5,m:3219375},{z:6,m:1609687},{z:7,m:804844},{z:8,m:402422},
						{z:9,m:201211},{z:10,m:100605},{z:11,m:50303},{z:12,m:25151},{z:13,m:12576},{z:14,m:6288},{z:15,m:3144},{z:16,m:1572},{z:17,m:786},
						{z:18,m:393},{z:19,m:196},{z:20,m:98},{z:21,m:49},{z:22,m:25},{z:23,m:12}
					);
					var z=parseInt(zoomAttr[0]);
					for(var i=0; i < ArrM2Z.length-1; ++i)
					{
						if(z <= ArrM2Z[i].m && z >= ArrM2Z[i+1].m)
						{
							zoom=ArrM2Z[i].z;
							break;
						}
					}
				}
				else
					zoom=zoomAttr[0];
			}
			else
			{
				// https://www.google.com/maps/?ll=51.70130999999983%2C39.143560000000086&z=18&t=m
				lat = __getQueryString(href, 'y');
				lon = __getQueryString(href, 'x');
				zoom = parseInt(__getQueryString(href, 'z'));
			}
			break;
		}
		case "2gis":
		{
			// http://2gis.ru/#!/voronezh/center/39.40487%2C51.621363/zoom/15/state/index
			// queryState=center%2F37.614634%2C55.627681%2Fzoom%2F16
			let ll="";
			if(href.indexOf("queryState=") > 0)
				ll = href.split('=')[1].split('%2F');
			else
				ll = href.split('/');

			for (let i=0; i < ll.length; ++i)
			{
				if (ll[i] == "center")
				{
					var ll0=ll[i+1].split("%2C");
					if (ll0.length < 2)
						ll0=ll[i+1].split(",");
					if(wmeJM_debug) console.log(ll0.length);
					lon=ll0[0];
					lat=ll0[1];
				}
				else if (ll[i] == "zoom")
					zoom=parseInt(ll[i+1]);
			}

			break;
		}
		case "re":
		{
			lat = __getQueryString(href, 'y');
			lon = __getQueryString(href, 'x');
			zoom = parseInt(__getQueryString(href, 'z'));
			/*
			if ((typeof extent) !== "undefined")
			{
				lon=extent.xmin+(extent.xmax-extent.xmin)/2;
				lat=extent.ymin+(extent.ymax-extent.ymin)/2;
			}
			*/

			/*
			if ((typeof esri) !== "undefined")
			{
				zoom=_map.getLevel();
				lon=_map.extent.getCenter().x;
				lat=_map.extent.getCenter().y;
			}
			*/
			break;
		}
		case "sc":
		{
			lon=map.center.lng();
			lat=map.center.lat();
			zoom=map.getZoom();
			break;
		}
		case "wm":
		{
			lat = __getQueryString(href, 'lat');
			lon = __getQueryString(href, 'lon');
			zoom = parseInt(__getQueryString(href, 'z'));
			break;
		}
		case "bm":
		{
			lon=map.center.lng();
			lat=map.center.lat();
			zoom=map.getZoom();
			break;
		}
		case "kdl":
		{
			var frmap=null;
			for(var ii=0; ii < frames.length; ++ii)
				if(!(typeof (frames[ii].esri) === "undefined"))
				{
					frmap=frames[ii];
					break;
				}
			if(frmap)
			{
				// BUGBUG!!!
				frmap.document.getElementById("dijit_form_Button_14").click();
				var url=frmap.document.getElementById("dijit_Dialog_0").getElementsByTagName("textarea")[0].value;
				frmap.document.getElementsByClassName("dijitDialogCloseIcon")[0].click();
				// https://www.kadastrs.lv/map/di?xy=507833.2477552314,311378.4889039769&z=5000

				let ll = __getQueryString(url, 'xy').split(',');
				lon=ll[0]; //???
				lat=ll[1]; //???
				zoom=parseInt(__getQueryString(url, 'z'));
				//if(wmejm_debug) console.log("z="+z)
			}
			break;
		}
		case "ncaby":
		{
			if (!(typeof esri === "undefined"))
			{
				zoom=map.getLevel();
				lon=map.extent.getCenter().x;
				lat=map.extent.getCenter().y;
			}
			break;
		}
		case "osm":
		{
			var xy=OSM.mapParams();
			lon=xy.lon;
			lat=xy.lat;
			zoom=xy.zoom;
			break;
		}

		case "mry":
		{
			lat = __getQueryString(href, 'lat');
			lon = __getQueryString(href, 'lng');
			zoom = parseInt(__getQueryString(href, 'z'));
			break;
		}

		case "wmflab":
		{
			break;
		}

		case "osv":
		{
			break;
		}
		case "amr":
		{
			break;
		}
		case 'kadua':
		{
			//map.getCenter() ==> Object { lon: 3329565.9696268, lat: 6070332.4028958 }
			//map.getZoom()
			break;
		}
		case 'mapbys':
		{
			break;
		}
		case 'maplt':
		{
			break;
		}
	}

	if(wmeJM_debug) console.log("WME-JumpMaps (" + wmeJM_version + "): WmeJM_GetLLZ(): locType="+locType+": return {lat="+lat+",lon="+lon+",zoom="+zoom+"}");

	return {lat:lat,lon:lon,zoom:zoom,city:city};
}

// преобразование из "ихних" в "наши"
function WmeJM_Convert_Other2WME(llz)
{
	if(wmeJM_debug) console.log("WME-JumpMaps (" + wmeJM_version + "): WmeJM_Convert_Other2WME("+JSON.stringify(llz)+")");

	var locType=WmeJM_GetLocationType();
	if (locType != "waze")
		llz.zoom = llz.zoom - 12;

	switch(locType)
	{
		case "waze":
		{
			break;
		}
		case "NM":
		{
			break;
		}
		case "YM":
		{
			break;
		}
		case "google":
		{
			break;
		}
		case "2gis":
		{
			break;
		}
		case "re":
		{
			if (typeof esri !== "undefined")
			{
				var webMercatorUtils=require("esri/geometry/webMercatorUtils");
				if(webMercatorUtils)
				{
					var g=webMercatorUtils.xyToLngLat(llz.lon, llz.lat);
					llz.lon=g[0];
					llz.lat=g[1];
				}
			}
			break;
		}
		case "sc":
		{
			break;
		}
		case "wm":
		{
			break;
		}
		case "bm":
		{
			if (!(typeof Kijs_Lks_2_LatLon === "undefined"))
			{
				let g=Kijs_Lks_2_LatLon(llz.lon,llz.lat); //??
				llz.lon=g.lon;
				llz.lat=g.lat;
			}
			for(var i=0; i < wmeJM_ArrW2B.length; ++i)
			{
				if(map.zoom_level == wmeJM_ArrW2B[i].b)
				{
					llz.zoom=wmeJM_ArrW2B[i].w;
					break;
				}
			}
			break;
		}
		case "kdl":
		{
			// function convert from https://gist.github.com/laacz/8654c9bb3f62e6a6c201b11075ad5905
			function LKSToLatLon(t,a){var o=function(t){return t/Math.PI*180;};var f=function(t){return t*Math.PI/180;};UTMScaleFactor=0.9996;sm_a=6378137;sm_b=6356752.314;sm_EccSquared=0.00669437999013;t-=5e5;a-=-6e6;t/=UTMScaleFactor;a/=UTMScaleFactor;lambda0=f(24);n=(sm_a-sm_b)/(sm_a+sm_b);alpha_=(sm_a+sm_b)/2*(1+Math.pow(n,2)/4+Math.pow(n,4)/64);y_=a/alpha_;beta_=3*n/2+-27*Math.pow(n,3)/32+269*Math.pow(n,5)/512;gamma_=21*Math.pow(n,2)/16+-55*Math.pow(n,4)/32;delta_=151*Math.pow(n,3)/96+-417*Math.pow(n,5)/128;epsilon_=1097*Math.pow(n,4)/512;phif=y_+beta_*Math.sin(2*y_)+gamma_*Math.sin(4*y_)+delta_*Math.sin(6*y_)+epsilon_*Math.sin(8*y_);ep2=(Math.pow(sm_a,2)-Math.pow(sm_b,2))/Math.pow(sm_b,2);cf=Math.cos(phif);nuf2=ep2*Math.pow(cf,2);Nf=Math.pow(sm_a,2)/(sm_b*Math.sqrt(1+nuf2));Nfpow=Nf;tf=Math.tan(phif);tf2=tf*tf;tf4=tf2*tf2;x1frac=1/(Nfpow*cf);Nfpow*=Nf;x2frac=tf/(2*Nfpow);Nfpow*=Nf;x3frac=1/(6*Nfpow*cf);Nfpow*=Nf;x4frac=tf/(24*Nfpow);Nfpow*=Nf;x5frac=1/(120*Nfpow*cf);Nfpow*=Nf;x6frac=tf/(720*Nfpow);Nfpow*=Nf;x7frac=1/(5040*Nfpow*cf);Nfpow*=Nf;x8frac=tf/(40320*Nfpow);x2poly=-1-nuf2;x3poly=-1-2*tf2-nuf2;x4poly=5+3*tf2+6*nuf2-6*tf2*nuf2-3*(nuf2*nuf2)-9*tf2*(nuf2*nuf2);x5poly=5+28*tf2+24*tf4+6*nuf2+8*tf2*nuf2;x6poly=-61-90*tf2-45*tf4-107*nuf2+162*tf2*nuf2;x7poly=-61-662*tf2-1320*tf4-720*(tf4*tf2);x8poly=1385+3633*tf2+4095*tf4+1575*(tf4*tf2);lat=phif+x2frac*x2poly*(t*t)+x4frac*x4poly*Math.pow(t,4)+x6frac*x6poly*Math.pow(t,6)+x8frac*x8poly*Math.pow(t,8);lon=lambda0+x1frac*t+x3frac*x3poly*Math.pow(t,3)+x5frac*x5poly*Math.pow(t,5)+x7frac*x7poly*Math.pow(t,7);return {lat:o(lat),lon:o(lon)};}
			let g=LKSToLatLon(llz.lon,llz.lat); // ???
			llz.lon=g.lon;
			llz.lat=g.lat;

			for(let i=0; i < wmeJM_ArrW2KDL.length-1; ++i)
			{
				//if(wmejm_debug) console.log(i+") z="+z+", ["+wmeJM_ArrW2KDL[i].r+", "+wmeJM_ArrW2KDL[i+1].r+"] = " + (z >= wmeJM_ArrW2KDL[i+1].r && z <= wmeJM_ArrW2KDL[i].r))
				if(llz.zoom >= wmeJM_ArrW2KDL[i+1].r && llz.zoom <= wmeJM_ArrW2KDL[i].r)
				{
					llz.zoom=wmeJM_ArrW2KDL[i].w;
					break;
				}
			}
			//zoom = zoom - 12; if (zoom < 0) zoom=0; //???
			break;
		}
		case 'mapbys':
		{
			break;
		}
		case "ncaby":
		{
			if (!(typeof esri === "undefined"))
			{
				var incoord={x:llz.lon,y:llz.lat};
				var inSR = new esri.SpatialReference({wkid: 900913});
				let geometry = new esri.geometry.Point(incoord.x,incoord.y,inSR);
				let g = esri.geometry.webMercatorToGeographic(geometry);
				llz.lon=g.x;
				llz.lat=g.y;
			}
			break;
		}
		case "osm":
		{
			break;
		}
		case "mry":
		{
			break;
		}
		case "wmflab":
		{
			break;
		}
		case "osv":
		{
			// TODO !!!
			break;
		}
		case "amr":
		{
			break;
		}
		case 'vcua':
		{
			break;
		}
		case 'mrua':
		{
			break;
		}
		case 'kadua':
		{
			// ...
			break;
		}
		case 'maplt':
		{
			break;
		}
	}

	if(wmeJM_debug) console.log("WME-JumpMaps (" + wmeJM_version + "): WmeJM_Convert_Other2WME(): return {lat="+llz.lat+",lon="+llz.lon+",zoom="+llz.zoom+"}");
	return llz;
}

// преобразование из "наших" в "ихние"
function WmeJM_Convert_WME2Other(id,llz)
{
	if(wmeJM_debug) console.log("WME-JumpMaps (" + wmeJM_version + "): WmeJM_Convert_WME2Other('"+id+"',"+JSON.stringify(llz)+")");

	if (this.id == '_map_WME' || this.id == '_map_WMEB')
;//		llz.zoom = llz.zoom - 12;

// W.Config.livemap.zoom_offset = 12
// W.Config.livemap.max_zoom = 17
	var origzoom=llz.zoom;
	llz.zoom = this.id=='_map_LI' ? (llz.zoom >= 5 ? 17 : llz.zoom + 11) : (llz.zoom > 6 ? 19 : llz.zoom + 12);
	if(wmeJM_debug) console.log("WME-JumpMaps (" + wmeJM_version + "): WmeJM_Convert_WME2Other: llz"+JSON.stringify(llz)+")");

	switch(id)
	{
		case "_map_2GIS":
		{
			// границы проектов lon0-lat0 = лево-верх, lon1-lat1 = право-низ,
			var Arr2GisCity=new Array(
				{c:'abakan',t:'Абакан',lon0:91.148493,lat0:53.900164,lon1:91.822532,lat1:53.570522},
				{c:'almaty',t:'Алматы',lon0:76.720148,lat0:43.467339,lon1:77.104243,lat1:43.109829},
				{c:'almetevsk',t:'Альметьевск',lon0:52.198749,lat0:54.949952,lon1:52.475853,lat1:54.796869},
				{c:'astana',t:'Астана',lon0:71.122398,lat0:51.37162,lon1:71.837025,lat1:50.93447},
				{c:'armawir',t:'Армавир',lon0:40.856599,lat0:45.249437,lon1:41.319762,lat1:44.721796},
				{c:'arkhangelsk',t:'Архангельск',lon0:39.462275,lat0:64.828929,lon1:41.317017,lat1:64.285363},
				{c:'astrakhan',t:'Астрахань',lon0:47.867187,lat0:46.50974,lon1:48.18167,lat1:46.242946},
				{c:'barnaul',t:'Барнаул',lon0:83.449949,lat0:53.485245,lon1:84.083776,lat1:53.160058},
				{c:'belgorod',t:'Белгород',lon0:36.424588,lat0:50.699354,lon1:36.724468,lat1:50.491576},
				{c:'biysk',t:'Бийск',lon0:84.573055,lat0:52.645225,lon1:85.488328,lat1:51.901409},
				{c:'blagoveshensk',t:'Благовещенск',lon0:127.347707,lat0:50.600674,lon1:127.761741,lat1:50.224428},
				{c:'bratsk',t:'Братск',lon0:101.320597,lat0:56.405462,lon1:102.048297,lat1:55.997912},
				{c:'bryansk',t:'Брянск',lon0:34.119591,lat0:53.430104,lon1:34.600268,lat1:53.139985},
				{c:'v_novgorod',t:'Великий Новгород',lon0:31.135553,lat0:58.682364,lon1:31.510536,lat1:58.461694},
				{c:'vladivostok',t:'Владивосток',lon0:131.562748,lat0:43.614385,lon1:132.339527,lat1:42.805235},
				{c:'vladimir',t:'Владимир',lon0:40.169351,lat0:56.466473,lon1:40.691011,lat1:56.029602},
				{c:'volgograd',t:'Волгоград',lon0:43.973242,lat0:48.925678,lon1:44.92821,lat1:48.315128},
				{c:'vologda',t:'Вологда',lon0:39.61246,lat0:59.336048,lon1:40.073782,lat1:59.151771},
				{c:'voronezh',t:'Воронеж',lon0:38.989754,lat0:51.910993,lon1:39.611678,lat1:51.475593},
				{c:'gornoaltaysk',t:'Горно-Алтайск',lon0:85.488768,lat0:52.154998,lon1:86.454212,lat1:51.250738},
				{c:'dnepropetrovsk',t:'Днепропетровск',lon0:34.736329,lat0:48.613427,lon1:35.278999,lat1:48.341643},
				{c:'donetsk',t:'Донецк',lon0:37.514653,lat0:48.188299,lon1:38.242047,lat1:47.797406},
				{c:'ekaterinburg',t:'Екатеринбург',lon0:60.236538,lat0:57.034771,lon1:60.939082,lat1:56.600044},
				{c:'ivanovo',t:'Иваново',lon0:40.801743,lat0:57.088235,lon1:41.185247,lat1:56.892642},
				{c:'izhevsk',t:'Ижевск',lon0:52.934619,lat0:57.057068,lon1:53.492953,lat1:56.668377},
				{c:'irkutsk',t:'Иркутск',lon0:103.62301,lat0:52.648075,lon1:104.966649,lat1:51.711951},
				{c:'yoshkarola',t:'Йошкар-Ола',lon0:47.575103,lat0:56.760655,lon1:48.150626,lat1:56.508362},
				{c:'kazan',t:'Казань',lon0:48.295321,lat0:55.997169,lon1:49.531335,lat1:55.568003},
				{c:'kaliningrad',t:'Калининград',lon0:19.843247,lat0:55.054121,lon1:20.659358,lat1:54.535552},
				{c:'kaluga',t:'Калуга',lon0:35.903119,lat0:54.76571,lon1:36.47395,lat1:54.323868},
				{c:'k_uralskiy',t:'Каменск-Уральский',lon0:61.670208,lat0:56.575513,lon1:62.214718,lat1:56.275529},
				{c:'karaganda',t:'Караганда',lon0:72.858651,lat0:50.132622,lon1:73.409223,lat1:49.649931},
				{c:'kemerovo',t:'Кемерово',lon0:85.943609,lat0:55.534059,lon1:86.262256,lat1:55.262515},
				{c:'kirov',t:'Киров',lon0:49.035362,lat0:58.797004,lon1:49.946385,lat1:58.400486},
				{c:'komsomolsk',t:'Комсомольск-на-Амуре',lon0:136.771299,lat0:50.721413,lon1:137.257084,lat1:50.189817},
				{c:'kostroma',t:'Кострома',lon0:40.729746,lat0:57.921793,lon1:41.14355,lat1:57.678341},
				{c:'krasnodar',t:'Краснодар',lon0:38.652738,lat0:45.264319,lon1:39.375902,lat1:44.944625},
				{c:'krasnoyarsk',t:'Красноярск',lon0:92.131003,lat0:56.306914,lon1:93.595133,lat1:55.812773},
				{c:'kurgan',t:'Курган',lon0:65.153256,lat0:55.530273,lon1:65.48145,lat1:55.368658},
				{c:'kursk',t:'Курск',lon0:35.892024,lat0:51.841854,lon1:36.432691,lat1:51.557738},
				{c:'lenkuz',t:'Ленинск-Кузнецкий',lon0:85.748699,lat0:54.774251,lon1:86.501493,lat1:54.179407},
				{c:'lipetsk',t:'Липецк',lon0:39.37308,lat0:52.719876,lon1:39.821953,lat1:52.490548},
				{c:'magnitogorsk',t:'Магнитогорск',lon0:58.521718,lat0:53.623234,lon1:59.502817,lat1:53.229866},
				{c:'miass',t:'Миасс',lon0:59.5303,lat0:55.277446,lon1:60.250081,lat1:54.890992},
				{c:'moscow',t:'Москва',lon0:36.763166,lat0:56.108107,lon1:38.220866,lat1:55.105405},
				{c:'murmansk',t:'Мурманск',lon0:32.698349,lat0:69.06473,lon1:33.222506,lat1:68.761069},
				{c:'nabchelny',t:'Набережные Челны',lon0:51.710023,lat0:55.86518,lon1:52.626277,lat1:55.536676},
				{c:'nahodka',t:'Находка',lon0:132.748007,lat0:42.907327,lon1:133.036644,lat1:42.722126},
				{c:'nizhnevartovsk',t:'Нижневартовск',lon0:75.920854,lat0:61.190935,lon1:77.027174,lat1:60.851182},
				{c:'n_novgorod',t:'Нижний Новгород',lon0:43.301231,lat0:56.476065,lon1:44.250653,lat1:56.073596},
				{c:'ntagil',t:'Нижний Тагил',lon0:59.761784,lat0:58.091704,lon1:60.346479,lat1:57.749301},
				{c:'novokuznetsk',t:'Новокузнецк',lon0:86.509223,lat0:54.12147,lon1:87.462249,lat1:53.497556},
				{c:'novorossiysk',t:'Новороссийск',lon0:36.941617,lat0:45.220677,lon1:38.667966,lat1:44.308124},
				{c:'novosibirsk',t:'Новосибирск',lon0:82.510765,lat0:55.247648,lon1:83.392393,lat1:54.554446},
				{c:'norilsk',t:'Норильск',lon0:87.260832,lat0:69.562188,lon1:88.505768,lat1:69.24282},
				{c:'noyabrsk',t:'Ноябрьск',lon0:74.303375,lat0:63.879187,lon1:76.261961,lat1:63.018253},
				{c:'odessa',t:'Одесса',lon0:30.516309,lat0:46.655044,lon1:30.907145,lat1:46.255108},
				{c:'omsk',t:'Омск',lon0:72.887675,lat0:55.41625,lon1:73.767507,lat1:54.786527},
				{c:'orenburg',t:'Оренбург',lon0:54.924569,lat0:51.934474,lon1:55.492074,lat1:51.664988},
				{c:'orel',t:'Орёл',lon0:35.862453,lat0:53.100811,lon1:36.307015,lat1:52.841941},
				{c:'penza',t:'Пенза',lon0:44.799634,lat0:53.347629,lon1:45.354652,lat1:53.067028},
				{c:'perm',t:'Пермь',lon0:55.614632,lat0:58.24263,lon1:56.657883,lat1:57.687295},
				{c:'petrozavodsk',t:'Петрозаводск',lon0:34.097521,lat0:61.958332,lon1:34.704693,lat1:61.692627},
				{c:'p_kamchatskiy',t:'Петропавловск-Камчатский',lon0:158.192879,lat0:53.349661,lon1:159.022701,lat1:52.855709},
				{c:'pskov',t:'Псков',lon0:28.168843,lat0:57.887497,lon1:28.486188,lat1:57.728751},
				{c:'minvody',t:'Пятигорск (МКВ)',lon0:42.601023,lat0:44.303459,lon1:43.526522,lat1:43.809756},
				{c:'rostov',t:'Ростов-на-Дону',lon0:39.359282,lat0:47.36713,lon1:39.922182,lat1:47.054343},
				{c:'ryazan',t:'Рязань',lon0:39.437034,lat0:54.880683,lon1:39.98795,lat1:54.488756},
				{c:'samara',t:'Самара',lon0:49.780398,lat0:53.712492,lon1:50.5218,lat1:53.039959},
				{c:'spb',t:'Санкт-Петербург',lon0:29.413543,lat0:60.291813,lon1:31.025315,lat1:59.536028},
				{c:'saransk',t:'Саранск',lon0:44.865611,lat0:54.301903,lon1:45.510315,lat1:53.984632},
				{c:'saratov',t:'Саратов',lon0:45.734752,lat0:51.698298,lon1:46.310632,lat1:51.354685},
				{c:'smolensk',t:'Смоленск',lon0:31.759159,lat0:54.887908,lon1:32.264515,lat1:54.689285},
				{c:'sochi',t:'Сочи',lon0:38.939135,lat0:44.353733,lon1:40.485856,lat1:43.364347},
				{c:'stavropol',t:'Ставрополь',lon0:41.662292,lat0:45.267846,lon1:42.319957,lat1:44.894653},
				{c:'staroskol',t:'Старый Оскол',lon0:37.747518,lat0:51.376996,lon1:37.979511,lat1:51.247807},
				{c:'sterlitamak',t:'Стерлитамак',lon0:55.804271,lat0:53.736985,lon1:56.131425,lat1:53.302877},
				{c:'surgut',t:'Сургут',lon0:72.380354,lat0:61.408286,lon1:73.795756,lat1:60.977162},
				{c:'syktyvkar',t:'Сыктывкар',lon0:50.430121,lat0:61.92271,lon1:51.273671,lat1:61.570344},
				{c:'tambov',t:'Тамбов',lon0:41.274139,lat0:52.824738,lon1:41.596269,lat1:52.563152},
				{c:'tver',t:'Тверь',lon0:35.539365,lat0:57.014891,lon1:36.306018,lat1:56.668274},
				{c:'tobolsk',t:'Тобольск',lon0:68.02465,lat0:58.337205,lon1:68.627772,lat1:58.061143},
				{c:'togliatti',t:'Тольятти',lon0:48.960426,lat0:53.708123,lon1:49.795328,lat1:53.028213},
				{c:'tomsk',t:'Томск',lon0:84.767252,lat0:56.595693,lon1:85.245125,lat1:56.348027},
				{c:'tula',t:'Тула',lon0:37.418202,lat0:54.317121,lon1:38.417427,lat1:53.900976},
				{c:'tyumen',t:'Тюмень',lon0:65.211818,lat0:57.26989,lon1:66.689442,lat1:56.39768},
				{c:'ulanude',t:'Улан-Удэ',lon0:107.35702,lat0:52.056482,lon1:107.989383,lat1:51.691354},
				{c:'ulyanovsk',t:'Ульяновск',lon0:48.035268,lat0:54.469311,lon1:48.770267,lat1:54.10641},
				{c:'ussuriysk',t:'Уссурийск',lon0:131.747838,lat0:43.971874,lon1:132.140642,lat1:43.708082},
				{c:'ustkam',t:'Усть-Каменогорск',lon0:82.443429,lat0:50.059191,lon1:82.804309,lat1:49.857962},
				{c:'ufa',t:'Уфа',lon0:55.713687,lat0:54.923449,lon1:56.31101,lat1:54.478525},
				{c:'khabarovsk',t:'Хабаровск',lon0:134.87774,lat0:48.605492,lon1:135.254878,lat1:48.2902},
				{c:'kharkov',t:'Харьков',lon0:35.985546,lat0:50.125366,lon1:36.435986,lat1:49.835602},
				{c:'cheboksary',t:'Чебоксары',lon0:46.993754,lat0:56.340676,lon1:47.601603,lat1:55.982206},
				{c:'chelyabinsk',t:'Челябинск',lon0:61.189643,lat0:55.318442,lon1:61.740423,lat1:54.991858},
				{c:'chita',t:'Чита',lon0:113.10627,lat0:52.184623,lon1:113.635026,lat1:51.928002},
				{c:'yuzhnosakhalinsk',t:'Южно-Сахалинск',lon0:142.455994,lat0:47.512348,lon1:142.963443,lat1:46.586553},
				{c:'yakutsk',t:'Якутск',lon0:129.529959,lat0:62.186695,lon1:129.988145,lat1:61.801651},
				{c:'yaroslavl',t:'Ярославль',lon0:39.726128,lat0:57.773598,lon1:40.0046,lat1:57.521928},
				{c:'makhachkala',t:'Махачкала',lon0:47.044144,lat0:43.208304,lon1:47.678261,lat1:42.688871},
				{c:'bishkek',t:'Бишкек',lon0:74.21402,lat0:43.014815,lon1:74.914398,lat1:42.67398},
				{c:'pavlodar',t:'Павлодар',lon0:76.557198,lat0:52.529277,lon1:77.310448,lat1:51.903507},
				{c:'kiev',t:'Киев',lon0:30.045719,lat0:50.652889,lon1:30.679836,lat1:50.147921}
			);

			if(llz.zoom > 18) llz.zoom = 18; //???
			for (i=0; i < Arr2GisCity.length; ++i)
			{
				if (llz.lon >= Arr2GisCity[i].lon0 && llz.lon <= Arr2GisCity[i].lon1 &&
					llz.lat >= Arr2GisCity[i].lat1 && llz.lat <= Arr2GisCity[i].lat0)
				{
					llz.city=Arr2GisCity[i].c;
					break;
				}
			}
			break;
		}
		case "_map_NM":
		{
			break;
		}
		case "_map_YM":
		{
			break;
		}
		case "_map_Google":
		{
			if(wmeJM_debug) console.log("WME-JumpMaps (" + wmeJM_version + "): WmeJM_Convert_WME2Other(): location.href.indexOf('mapmaker')="+location.href.indexOf("mapmaker"));
			if(location.href.indexOf("mapmaker") > 0)
				llz.zoom=llz.zoom+1;
			break;
		}
		case "_map_SC":
		{
			break;
		}
		case "_map_SC2":
		{
			break;
		}
		case "_map_NAVITEL":
		{
			break;
		}
		case "_map_BING":
		{
			break;
		}
		case "_map_HERE":
		{
			break;
		}
		case "_map_LI":
		{
			break;
		}
		case "_map_WM":
		{
			break;
		}
		case "_map_OSM":
		{
			break;
		}
		case "_map_BP":
		{
			break;
		}
		case "_map_RE":
		{
			var urPos=new OpenLayers.LonLat(llz.lon,llz.lat);
			urPos.transform(new OpenLayers.Projection("EPSG:4326"),new OpenLayers.Projection("EPSG:900913"));
			llz.lat=urPos.lat;
			llz.lon=urPos.lon;
			break;
		}
		case "_map_GM":
		{
			break;
		}
		case "_map_BM":
		{
			var zoom = llz.zoom - 12;
			if (zoom > 7) zoom=7;
//var wmeJM_ArrW2B  =[{w:7,b:-2},{w:6,b:-1},{w:5,b:0},{w:4,b:1},{w:3,b:2},{w:2,b:3},{w:1,b:4},{w:0,b:5}];
			for(var i=0; i < wmeJM_ArrW2B.length; ++i)
			{
				if(zoom == wmeJM_ArrW2B[i].w)
				{
					zoom=wmeJM_ArrW2B[i].b;
					if(wmeJM_debug) console.log("WME-JumpMaps (" + wmeJM_version + "): WmeJM_Convert_WME2Other(): zoom("+i+")="+zoom+", llz.zoom="+llz.zoom);
					break;
				}
			}
			llz.zoom= zoom;
			// <function from http://balticmaps.eu>
			function Kijs_LatLon_2_Lks(c,r){c*=1;r*=1;var h;var n,W,t,B,G,w;var D,C,A,u;var S,Q,g,m,q,o,l,k,y,x;var s;var p;var b,a,Z,Y,O,X,U,T,H,e;var F,I,J,v,N,f,d;h=Math.PI/180;n=0.9996;W=6378137*n;t=6356752.3142*n;B=0;G=0;w=500000;D=(W-t)/(W+t);C=D*D;A=C*D;u=((W*W)-(t*t))/(W*W);S=c*h;Q=r*h;g=Math.sin(S);m=Math.cos(S);q=g/m;o=q*q;l=m*m;k=l*m;y=S-B;x=S+B;s=24;p=s*h;b=y*(1+D+1.25*(C+A));a=Math.sin(y)*Math.cos(x)*(3*(D+C+0.875*A));Z=Math.sin(2*y)*Math.cos(2*x)*(1.875*(C+A));Y=Math.sin(3*y)*Math.cos(3*x)*35/24*A;O=(b-a+Z-Y)*t;F=1-u*g*g;I=W/Math.sqrt(F);J=I*(1-u)/F;v=I/J-1;N=Q-p;f=N*N;d=f*f;b=O+G;a=I/2*g*m;Z=I/24*g*(k)*(5-(o)+9*v);Y=I/720*g*k*l*(61-58*(o)+o*o);H=b+f*a+d*Z+d*f*Y;X=I*m;U=I/6*k*(I/J-o);T=I/120*k*l;T=T*(5-18*o+o*o+14*v-58*o*v);e=w+N*X+f*N*U+d*N*T;return{x:e,y:H};}
			// </function from http://balticmaps.eu>
			let urPos=Kijs_LatLon_2_Lks(llz.lat,llz.lon);
			llz.lat=urPos.y;
			llz.lon=urPos.x;
			break;
		}
		case "_map_KDL":
		{
			// function convert from https://gist.github.com/laacz/8654c9bb3f62e6a6c201b11075ad5905
			function LatLonToLKS(a,o){function f(t){return sm_a=6378137,sm_b=6356752.31414,n=(sm_a-sm_b)/(sm_a+sm_b),alpha=(sm_a+sm_b)/2*(1+Math.pow(n,2)/4+Math.pow(n,4)/64),beta=-3*n/2+9*Math.pow(n,3)/16+-3*Math.pow(n,5)/32,gamma=15*Math.pow(n,2)/16+-15*Math.pow(n,4)/32,delta=-35*Math.pow(n,3)/48+105*Math.pow(n,5)/256,epsilon=315*Math.pow(n,4)/512,result=alpha*(t+beta*Math.sin(2*t)+gamma*Math.sin(4*t)+delta*Math.sin(6*t)+epsilon*Math.sin(8*t)),result;} function p(t){return t*Math.PI/180;}return LKS_UTM_SCALE_FACTOR=0.9996,a=p(a),o=p(o),sm_a=6378137,sm_b=6356752.31414,xy=[],phi=a,lambda=o,lambda0=p(24),ep2=(sm_a*sm_a-sm_b*sm_b)/sm_b/sm_b,nu2=ep2*Math.cos(phi)*Math.cos(phi),N=sm_a*sm_a/(sm_b*Math.sqrt(1+nu2)),t=Math.tan(phi),t2=t*t,l=lambda-lambda0,l3coef=1-t2+nu2,l4coef=5-t2+9*nu2+4*(nu2*nu2),l5coef=5-18*t2+t2*t2+14*nu2-58*t2*nu2,l6coef=61-58*t2+t2*t2+270*nu2-330*t2*nu2,l7coef=61-479*t2+179*(t2*t2)-t2*t2*t2,l8coef=1385-3111*t2+543*(t2*t2)-t2*t2*t2,xy[0]=N*Math.cos(phi)*l+N/6*Math.pow(Math.cos(phi),3)*l3coef*Math.pow(l,3)+N/120*Math.pow(Math.cos(phi),5)*l5coef*Math.pow(l,5)+N/5040*Math.pow(Math.cos(phi),7)*l7coef*Math.pow(l,7),xy[1]=f(phi)+t/2*N*Math.pow(Math.cos(phi),2)*Math.pow(l,2)+t/24*N*Math.pow(Math.cos(phi),4)*l4coef*Math.pow(l,4)+t/720*N*Math.pow(Math.cos(phi),6)*l6coef*Math.pow(l,6)+t/40320*N*Math.pow(Math.cos(phi),8)*l8coef*Math.pow(l,8),xy[0]=xy[0]*LKS_UTM_SCALE_FACTOR+5e5,xy[1]=xy[1]*LKS_UTM_SCALE_FACTOR-6e6,xy[1]<0&&(xy[1]=xy[1]+1e7),{x:xy[0],y:xy[1]};}

			var p=LatLonToLKS(llz.lat,llz.lon);
			llz.lat=p.x;
			llz.lon=p.y;

			let zoom = llz.zoom-12;
			if (zoom > 7) zoom=7;

			for(let i=0; i < wmeJM_ArrW2KDL.length; ++i)
			{
				if(zoom == wmeJM_ArrW2KDL[i].w)
				{
					zoom=wmeJM_ArrW2KDL[i].r;
					break;
				}
			}
			llz.zoom= zoom;
			break;
		}
		case "_map_NCABY":
		{
			let urPos=new OpenLayers.LonLat(llz.lon,llz.lat);
			urPos.transform(new OpenLayers.Projection("EPSG:4326"),new OpenLayers.Projection("EPSG:900913"));
			llz.lat=urPos.lat;
			llz.lon=urPos.lon;
			break;
		}
		case "_map_MRY":
		{
			llz.zoom--; // TEMP!!!
			break;
		}
		case "_map_WMFLAB":
		{
			function convertd2dms(degrees)
			{
				var mydegrees = parseInt(degrees);
				var remaining = degrees - (mydegrees * 1.0);
				var minutes = remaining * 60.0;
				var myminutes = parseInt(minutes);
				remaining = minutes - (myminutes * 1.0);
				var myseconds = remaining * 60.0;
					myseconds = Math.round (myseconds * 10.0) / 10.0;

				return {d:mydegrees,m:myminutes,s:myseconds};
			}
			var la=convertd2dms(llz.lat);
			llz.lat=la.d+'_'+la.m+'_'+la.s;
			var lo=convertd2dms(llz.lon);
			llz.lon=lo.d+'_'+lo.m+'_'+lo.s;
			llz.zoom = Math.pow(2, 12 - llz.zoom) * 100000; //??
			break;
		}
		case "_map_OSV":
		{
			if (llz.zoom > 18) llz.zoom=18;
			break;
		}
		case "_map_AMR":
		{
			//var ArrW2A=new Array({w:0,a:4},{w:1,a:5},{w:2,a:6},{w:3,a:7},{w:4,a:8},{w:5,a:9},{w:6,a:10});
			if (origzoom >= 7)
				llz.zoom=10;
			else
				llz.zoom=origzoom+4;
			break;
		}
		case '_map_VCUA':
		{
			break;
		}
		case '_map_MRUA':
		{
			break;
		}
		case '_map_KADUA':
		{
			// ZOOM!!!!
			break;
		}
		case '_map_MAPBYS':
		{
			break;
		}
		case '_map_MAPLT':
		{
			break;
		}
	}
	if(wmeJM_debug) console.log("WME-JumpMaps (" + wmeJM_version + "): WmeJM_Convert_WME2Other(): return "+JSON.stringify(llz));
	return llz;
}


// дополнительно-принудительная обработка после прыжка "туда"
function WmeJM_PostLoadOtherMaps()
{
	if(wmeJM_debug) console.log("WME-JumpMaps (" + wmeJM_version + "): WmeJM_PostLoadOtherMaps()");
	var waiting=false;
	var locType=WmeJM_GetLocationType();
	var llz=WmeJM_GetLLZ();
	if(wmeJM_debug) console.log("WME-JumpMaps (" + wmeJM_version + "): WmeJM_PostLoadOtherMaps(): locType="+locType+": {lat="+llz.lat+",lon="+llz.lon+",zoom="+llz.zoom+"}");

	switch(locType)
	{
		case "waze":
		{
			break;
		}
		case "NM":
		{
			break;
		}
		case "YM":
		{
			break;
		}
		case "google":
		{
			break;
		}
		case "2gis":
		{
			break;
		}
		case "re":
		{
			break;
		}
		case "sc":
		{
			break;
		}
		case "wm":
		{
			break;
		}
		case "bm":
		{
			break;
		}
		case "kdl":
		{
			break;
		}
		case "ncaby":
		{
			if (map)
			{
				if(wmeJM_debug) console.log("WME-JumpMaps (" + wmeJM_version + "): WmeJM_PostLoadOtherMaps(): map.loaded="+map.loaded);
				if (map.loaded)
				{
					// http://map.nca.by/map.html?xy=6878238.761035528,3451752.4686308377&z=17
					var xy=__getQueryString(location.href, 'xy');
					if(xy != -1)
					{
						var axy=xy.split(",");
						llz.lon = parseFloat(axy[1]);
						llz.lat = parseFloat(axy[0]);
						llz.zoom = parseInt(__getQueryString(location.href, 'z'));
						if(llz.zoom > 19) llz.zoom=19;
						if(wmeJM_debug) console.log("WME-JumpMaps (" + wmeJM_version + "): WmeJM_PostLoadOtherMaps(): locType="+locType+": map.centerAndZoom({x:"+llz.lon+",y:"+llz.lat+"},"+llz.zoom+")");
						map.setZoom(llz.zoom).then(function() {
							map.centerAt({x:llz.lon,y:llz.lat});
							basemapGallery.select("google_satellite");
						});
						//basemapGallery.select("OpenStreetMap"); // google_satellite
						//map.centerAndZoom({x:llz.lon,y:llz.lat}, llz.zoom);
					}
				}
				else
					waiting=true;
			}
			break;
		}
		case "osm":
		{
			break;
		}
		case "mry":
		{
			break;
		}
		case "wmflab":
		{
			break;
		}
		case "osv":
		{
			break;
		}
		case "amr":
		{
			break;
		}
		case 'vcua':
		{
			break;
		}
		case 'mrua':
		{
			break;
		}
		case 'kadua':
		{
	        var re = new RegExp("\\bmap=(.*?)//(.*?)//(.*?)$");
    	    var m = re.exec(document.location.hash);
    	    if (m.length==4)
    	    {
				Proj4js.defs["EPSG:4284"] = '+proj=longlat+ellps=kras+towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12+no_defs';
				//Proj4js.defs["EPSG:4326"] = '+proj=longlat+ellps=WGS84+datum=WGS84+no_defs+towgs84=0,0,0';
				Proj4js.defs["EPSG:900913"] = '+proj=merc+a=6378137+b=6378137+lat_ts=0.0+lon_0=0.0+x_0=0.0+y_0=0+k=1.0+units=m+nadgrids=@null+wktext+over+no_defs';

				var point1 = new Proj4js.Point(m[2],m[3]);
				//if(wmeJM_debug) console.log("RepositionKadastrUA:",m, point1);
				Proj4js.transform(new Proj4js.Proj("EPSG:4284"), new Proj4js.Proj("EPSG:900913"), point1);

				var new_response =  point1.x + "," + point1.y + "," + point1.x + "," + point1.y;
				var new_bounds_res = new OpenLayers.Bounds.fromString(new_response);
				map.zoomToExtent(new_bounds_res);
				var x = new_bounds_res.centerLonLat.lat;
				var y = new_bounds_res.centerLonLat.lon;
				map.setCenter(new OpenLayers.LonLat(y,x),m[1]);
				map.setBaseLayer(tmsoverlay_orto);
			}
			break;
		}
		case 'mapbys':
		{
			break;
		}
		case 'maplt':
		{
			break;
		}
	}

	if (waiting)
	{
		setTimeout(WmeJM_PostLoadOtherMaps,2000);
	}
}



// обработчик мышиных кликов - собственно - прыгаем.
function WmeJM_clickJumpToMaps()
{
	if(wmeJM_debug) console.log("WME-JumpMaps (" + wmeJM_version + "): WmeJM_clickJumpToMaps("+this.id+")");

	var savedSelectedItems=[];
	if (wmeJM_restoreSelected && !(this.id === '_map_WME' || this.id.indexOf("_map_WME_") >= 0 || this.id === '_map_WMEB'))
	{
		if(wmeJM_debug) console.log("WME-JumpMaps (" + wmeJM_version + "): WmeJM_clickJumpToMaps("+this.id+"): save selected");
		for( var i=0; i < W.selectionManager.getSelectedFeatures().length; ++i)
			savedSelectedItems.push(W.selectionManager.getSelectedFeatures()[i].model);
	}

	var llz=WmeJM_GetLLZ();
	//if(wmeJM_debug) console.log("WME-JumpMaps (" + wmeJM_version + "): WmeJM_clickJumpToMaps("+this.id+"): llz={lat:"+llz.lat+",lon:"+llz.lon+",zoom:"+llz.zoom+"}");
	if(wmeJM_debug) console.log("WME-JumpMaps (" + wmeJM_version + "): WmeJM_clickJumpToMaps("+this.id+"): llz="+JSON.stringify(llz));

	if (this.id == '_map_WME' || this.id == '_map_WMEB' || this.id.indexOf("_map_WME_") >= 0)
		llz=WmeJM_Convert_Other2WME(llz);
	else
		llz=WmeJM_Convert_WME2Other(this.id,llz);

	if(wmeJM_debug) console.log("WME-JumpMaps (" + wmeJM_version + "): WmeJM_clickJumpToMaps("+this.id+"): wmeJM_Config["+this.id+"]="+JSON.stringify(wmeJM_Config[this.id]));

	var template=(typeof wmeJM_Config[this.id] !== "undefined")?wmeJM_Config[this.id].template:"";
	if (this.id.indexOf("_map_WME_") >= 0)
		template=wmeJM_Config["_map_WME"].template;
	var url=template.replace("{{city}}",llz.city).replace("{{lon}}",llz.lon).replace("{{lat}}",llz.lat).replace("{{zoom}}",llz.zoom) + ((this.id == '_map_WME' || this.id.indexOf("_map_WME_") >= 0 || this.id == '_map_WMEB')?"&marker=yes":"");

	if(wmeJM_debug) console.log("WME-JumpMaps (" + wmeJM_version + "): WmeJM_clickJumpToMaps("+this.id+"): " + url + ', _url'+this.id);

	if(wmeJM_restoreSelected && !(this.id == '_map_WME' || this.id.indexOf("_map_WME_") >= 0 || this.id == '_map_WMEB')) // restore selections
	{
		if(wmeJM_debug) console.log("WME-JumpMaps (" + wmeJM_version + "): WmeJM_clickJumpToMaps("+this.id+"): restore selected");
		setTimeout(function() {if (savedSelectedItems.length > 0){W.selectionManager.select(savedSelectedItems);savedSelectedItems.length=0;}},50);
	}

	if (this.id.indexOf("_map_WME_") >= 0) // если что-то эдакое, jmlink - киляем из урла латы/лонги/зумы...
	{
		if (this.getAttribute("jmfrom") === "mapbys") // если что-то эдакое, jmlink - киляем из урла латы/лонги/зумы...
		{
			window.open("http://map.nca.by/map.html?xy="+this.getAttribute("jmlink")+"&z=16",'_url_jm'+this.id);
		}
		url=url.split("&")[0]+"&jmlink="+this.getAttribute("jmlink");
	}

	window.open(url,'_url'+this.id);
}


function WmeJM_UpdateJumpStyle()
{
	//if(wmeJM_debug) console.log("WME-JumpMaps (" + wmeJM_version + "): WmeJM_UpdateJumpStyle()");
	var JumpTools=document.getElementById('WME.JumpMaps_' + wmeJM_version);
	if (JumpTools)
	{
		var w=
			document.getElementsByClassName("olControlScaleLine")[0].clientWidth+
			document.getElementsByClassName("WazeControlMousePosition")[0].clientWidth+
			document.getElementsByClassName("WazeControlPermalink")[0].clientWidth+
			50;

		//if(wmeJM_debug) console.log("WME-JumpMaps (" + wmeJM_version + "): WmeJM_UpdateJumpStyle(): w="+w);
		JumpTools.setAttribute('style','position:absolute;z-index:2003;float:right;font-size:10px; right: '+w+'px;');
		//if(wmeJM_debug) console.log("WME-JumpMaps (" + wmeJM_version + "): WmeJM_UpdateJumpStyle(): style="+JumpTools.getAttribute('style'));

	}
	setTimeout(WmeJM_UpdateJumpStyle,300);
}


// добавить в WME
function WmeJM_InsertWMEIcon()
{
	if(wmeJM_debug) console.log("WME-JumpMaps (" + wmeJM_version + "): WmeJM_InsertWMEIcon(): "+(document.getElementById('WME.JumpMaps_' + wmeJM_version)?"found":"none"));
	var nod=document.getElementById('WME.JumpMaps_' + wmeJM_version);
	if(nod)
	{
		// clear exist
		nod.innerHTML="";
	}
	else
	{
		// create new
		nod=document.createElement("div");
		nod.setAttribute('id', 'WME.JumpMaps_' + wmeJM_version);
		nod.setAttribute('unselectable', 'on');
	}

	nod.innerHTML="";

	function IsJsonString(str) {
		try {
			JSON.parse(str);
		} catch (e) {
			return false;
		}
		return true;
	}

	var WMEJumpMapsLink=null;

	if ("undefined" === typeof localStorage.WMEJumpMapsLink || !IsJsonString(localStorage.getItem('WMEJumpMapsLink')))
	{
		localStorage.setItem('WMEJumpMapsLink', WmeJM_Config2String());
		WMEJumpMapsLink=localStorage.getItem("WMEJumpMapsLink");

		//if(wmeJM_debug) console.log("WME-JumpMaps (" + wmeJM_version + "): use WMEJumpMapsLink0!!! ");
	}
	else
	{
		WMEJumpMapsLink=localStorage.getItem("WMEJumpMapsLink");
		//if(wmeJM_debug) console.log("WME-JumpMaps (" + wmeJM_version + "): use custom WMEJumpMapsLink="+WMEJumpMapsLink);
	}

	var innerHTML="";
	if (WMEJumpMapsLink)
	{
		var aLinks = JSON.parse(WMEJumpMapsLink);
		// clear save
		for(var i in wmeJM_Config)
			wmeJM_Config[i].save = 0;

		// set save & create labels
		for (let i in aLinks)
		{
			if (["_map_WME","_map_WMEB","_map_LI"].indexOf(i) < 0)
			{
				//if(wmeJM_debug) console.log("process "+i +"  typeof wmeJM_Config[i]="+(typeof wmeJM_Config[i])+ " " + JSON.stringify(wmeJM_Config[i]));
				if (typeof wmeJM_Config[i] !== "undefined")
				{
					wmeJM_Config[i].save	 = 1;
					wmeJM_Config[i].title	= aLinks[i].title;
					wmeJM_Config[i].name	 = aLinks[i].name;
					wmeJM_Config[i].template = aLinks[i].template;

					innerHTML += "<a id='" + i + "' style='font-size: 10px' title='" + aLinks[i].title + "'>" + aLinks[i].name + "</a>&nbsp;";
				}
			}
		}
	}

	var main_site=location.hostname === "www.waze.com";
	nod.innerHTML = innerHTML
					+ "<a id='_map_LI' style='font-size: 10px' title='Open in LiveMap'>[Live]</a>&nbsp;"
					+ "<a id='_map_AB' tp="+(main_site?'A':'B')+" href='' style='font-size: 12px' title='Open in "+(main_site?"Beta":"Main")+" editor' target='" +CreateID()+ (main_site?"b":"a")+"' id='__map_BETAALPA'>["+ (main_site?"&#946;":"&#945;")+"]</a>&nbsp;"
					+ "<a href='https://greasyfork.org/ru/scripts/19626-wme-jumpmaps' title='WME-JumpMaps_" + wmeJM_version + "' style='font-size: 10px' target='_blank'>[?]</a>&nbsp;";

	document.getElementsByClassName('olControlAttribution')[0].parentElement.appendChild(nod);

	if(wmeJM_debug) console.log("WME-JumpMaps (" + wmeJM_version + "): WmeJM_InsertWMEIcon(): innerHTML="+document.getElementById('WME.JumpMaps_' + wmeJM_version).innerHTML);

	{
		//if(wmeJM_debug) console.log("call JSON.parse");
		let aLinks = JSON.parse(WMEJumpMapsLink);
		//if(wmeJM_debug) console.log("call JSON.parse - done");
		for (let i in aLinks)
		{
			if (document.getElementById(i))
				document.getElementById(i).onclick	= WmeJM_clickJumpToMaps;
		}
		document.getElementById('_map_LI').onclick	= WmeJM_clickJumpToMaps;
		document.getElementById('_map_AB').onclick	= function(){
			var permalink="?"+wmer_generate_permalink().split("?")[1];
			if(wmeJM_debug) console.log("_map_AB.click(), permalink=",permalink);
			if(wmeJM_debug) console.log(this.getAttribute('tp'));
			var main_site=this.getAttribute('tp')==='A';
			this.href=(main_site?"https://beta.waze.com/editor":"https://www.waze.com/editor") + permalink;
			if(wmeJM_debug) console.log(this.href);
			//this.click();
			//return false;
		};
	}

	WmeJM_UpdateJumpStyle();
}

// вставка "ссылки" для прыжка
function WmeJM_InsertIcon()
{
	if(wmeJM_debug) console.log("WME-JumpMaps (" + wmeJM_version + "): WmeJM_InsertIcon()");
	var locType=WmeJM_GetLocationType();
	if(wmeJM_debug) console.log("WME-JumpMaps (" + wmeJM_version + "): WmeJM_InsertIcon(): locType="+locType);

	if(locType == "waze")
		return true;

	var result = false;

	var nod=document.createElement(locType === "mry" || locType === "osm" || locType === "re" || locType === "2gis" || locType === "YM"?"div":(locType === "NM"?"div":"span"));
	nod.setAttribute('id', 'WME.JumpMaps_' + wmeJM_version);
	window.nod=nod;

	var clsid=
	{
		//"NM"	  : {t:0,c:"nk-map-region-view__actions-and-path"},
		"NM"	  : {t:0,c:"nk-button nk-button_theme_on-map nk-button_size_l nk-geolocation-view"},
		//"NM"	  : {t:3,c:"body"},
		"YM"	  : {t:2,c:"print-control"},
		"google"  : {t:0,c:"fineprint-item fineprint-padded fineprint-tld-escape-holder noprint"},
		"2gis"	  : {t:0,c:"online__controlsItem _geoLocation"},
		"sc"	  : {t:1,c:"Right_menu"},
		"re"	  : {t:0,c:"logo"},
		"wm"	  : {t:1,c:"wm-Add"},
		"bm"	  : {t:0,c:"kijs_noprint"},
		"kdl"	  : {t:1,c:"social_networks"},
		"ncaby"   : {t:1,c:"LocateButton"},
		"osm"	  : {t:0,c:"control-layers leaflet-control"},
		"mapbys"  : {t:1,c:"search_td"},
		"mry"     : {t:0,c:"comments"} //
	};

	if(typeof clsid[locType] === 'undefined')
	{
		WmeJM_PostLoadOtherMaps();
		return true;
	}

	var WazeControlAttribution = null;
	if(wmeJM_debug) console.log("WME-JumpMaps (" + wmeJM_version + "): WmeJM_InsertIcon(): clsid[locType]="+JSON.stringify(clsid[locType]));
	if(clsid[locType])
		WazeControlAttribution = clsid[locType].t == 1?document.getElementById(clsid[locType].c):(clsid[locType].t == 0 || clsid[locType].t == 2?document.getElementsByClassName(clsid[locType].c):document.getElementsByTagName(clsid[locType].c));
	if(wmeJM_debug) console.log("WME-JumpMaps (" + wmeJM_version + "): WmeJM_InsertIcon(): WazeControlAttribution="+(typeof WazeControlAttribution),WazeControlAttribution);

	var found00=false;
	if (WazeControlAttribution)
	{
		if (!clsid[locType].t)
		{
			if (WazeControlAttribution.length > 0)
			{
				found00=true;
			}
			else
			{
				if(wmeJM_debug) console.log("WME-JumpMaps (" + wmeJM_version + "): WmeJM_InsertIcon(): wait 1 ",locType,clsid[locType]);
				setTimeout(function() {WmeJM_InsertIcon();},500,this);
				return false;
			}
		}
		else
		{
			if(wmeJM_debug) console.log("WME-JumpMaps (" + wmeJM_version + "): WmeJM_InsertIcon(): found00=true;");
			found00=true;
		}

		if (!found00)
		{
			if(document.readyState != 'complete' && ++wmeJM_countProbe2 < 5)
			{
				if(wmeJM_debug) console.log("WME-JumpMaps (" + wmeJM_version + "): WmeJM_InsertIcon(): wait 2 ",locType,clsid[locType]);
				setTimeout(function() {WmeJM_InsertIcon();},500,this);
				return false;
			}
		}
	}
	else
	{
		if(wmeJM_debug) console.log("WME-JumpMaps (" + wmeJM_version + "): WmeJM_InsertIcon(): wait 3 ",clsid[locType]);
		setTimeout(function() {WmeJM_InsertIcon();},100,this);
		return false;
	}

	if (found00)
	{
		if(wmeJM_debug) console.log("WME-JumpMaps (" + wmeJM_version + "): WmeJM_InsertIcon(): found '", (clsid[locType].t?WazeControlAttribution:WazeControlAttribution[0]));
		if(wmeJM_debug) console.log("WME-JumpMaps (" + wmeJM_version + "): WmeJM_InsertIcon(): document.readyState=" + document.readyState);

		switch(locType)
		{
			case "NM":
			{
				//nod.setAttribute('class', 'button button_type_link button_theme_on-map button_view_dark button_size_l nk-tooltip nk-map-region-view__button nk-tooltip_for_button button__control i-bem button_js_inited');
				//nod.setAttribute('data-bem', '{"button":{},"nk-tooltip":{"title":"Open to"}}');
				nod.setAttribute('style', 'z-index:99999;width: 34px;height: 34px;;bottom: 320px;left: 19px;position: absolute;');
				//nod.innerHTML = '<span class="nk-icon icon"><img id="_map_WME" style="cursor: pointer;" alt="Open to WME" src="'+wmeJM_IconWME+'" width="32px" height="32px"></span>';
				nod.innerHTML = '<img id="_map_WME" style="cursor: pointer;" alt="Open to WME" src="'+wmeJM_IconWME+'" width="32px" height="32px">';
				//WazeControlAttribution[0].innerHTML=WazeControlAttribution[0].innerHTML+nod.outerHTML;
				WazeControlAttribution[0].outerHTML=WazeControlAttribution[0].outerHTML+nod.outerHTML;
/*
				//nod.setAttribute('class', 'button button_type_link button_theme_on-map button_view_dark button_size_l nk-tooltip nk-map-region-view__button nk-tooltip_for_button button__control i-bem button_js_inited');
				//nod.setAttribute('class', 'nk-button_theme_on-map');
				//nod.setAttribute('data-bem', '{"button":{},"nk-tooltip":{"title":"Open to"}}');position: relative;
				nod.setAttribute('style', 'z-index:9999;margin-right: 8px;margin-left: 8px; bottom: 320px; left: 9px;position: absolute;');
				nod.innerHTML = '<span class="nk-icon icon" style="width: 32px; height: 32px;"><img id="_map_WME" style="cursor: pointer;" alt="Open to WME" src="'+wmeJM_IconWME+'" width="32px" height="32px"></span>';
				WazeControlAttribution[0].parentNode.innerHTML=WazeControlAttribution[0].parentNode.innerHTML+nod.outerHTML;
				console.dir (WazeControlAttribution[0])
*/
				break;
			}
			case "YM":
			{
				nod.setAttribute('style', 'background-color:#fff;width:40px');

				if (1)
				{
				nod.setAttribute('class', 'controls-group__child');
				nod.innerHTML = '<a id="_map_WME" style="cursor: pointer;width:32px;height:32px;" title="Open to WME"><img src="'+wmeJM_IconWME+'" class="button_basic-medium _checked _pin-left _pin-right" align="center"></a>';
				WazeControlAttribution[0].parentElement.parentElement.insertBefore(nod, WazeControlAttribution[0].parentElement);
				}
				else
				{
				nod.setAttribute('class', 'controls-group__child'); // map-controls-view__control-layout
				nod.innerHTML = '<a id="_map_WME" style="cursor: pointer;" title="Open to WME"><img src="'+wmeJM_IconWME+'" width="36px" height="36px"></a>';

				setTimeout(function() {WmeJM_InsertIcon();
					WazeControlAttribution[0].parentElement.parentElement.insertBefore(nod, WazeControlAttribution[0].parentElement);
					document.getElementById('_map_WME').onclick	 = WmeJM_clickJumpToMaps;
				},3000,this);
				}
				break;
			}
			case "google":
			{
				nod.innerHTML = "<a id='_map_WME' title='Open in WME'>[WME]</a>&nbsp;&nbsp;&nbsp;";
				WazeControlAttribution[0].parentElement.insertBefore(nod, WazeControlAttribution[0]);
				break;
			}
			case "2gis":
			{
				nod.setAttribute('class', 'online__controlsItem');
				nod.setAttribute('style', 'margin-top:16px');
				nod.innerHTML = "<div id='_map_WME' style='border:5px solid #3d3d3d;border-radius:50%;width:30px;height:30px' title='Open to WME'><img style='cursor: pointer;' width=30 height=30  src='"+wmeJM_IconWME+"'></div>";
				WazeControlAttribution[0].parentElement.insertBefore(nod, WazeControlAttribution[0]);
				break;
			}
			case "re":
			{
				nod.setAttribute("style","position: absolute; top: 15px; right: 32px; z-index:2003;");
				nod.innerHTML = "<a id='_map_WME' title='Open to WME'><img style='cursor: pointer;' width=32 height=32  src='"+wmeJM_IconWME+"'></a>";
				WazeControlAttribution[0].parentElement.insertBefore(nod, WazeControlAttribution[0]);
				break;
			}
			case "sc":
			{
				if(wmeJM_debug) console.log("WME-JumpMaps (" + wmeJM_version + "): WmeJM_FakeLoad(), WazeControlAttribution.innerHTML: " + WazeControlAttribution.innerHTML);
				$("#Right_menu").append('<div id="_map_WMEB" class="butt" title="Open in WME BETA!">Waze Beta</div>');
				break;
			}
			case "wm":
			{
				WazeControlAttribution.innerHTML=WazeControlAttribution.innerHTML+'<div class="butt" id="_map_WME" title="Open in WME"><img style="cursor: pointer; padding-top: 0px;" width=39 height=39  src="'+wmeJM_IconWME+'"></div>';
				break;
			}
			case "bm":
			{
				if(wmeJM_debug) console.log("WME-JumpMaps (" + wmeJM_version + "): locType === bm");
				var td=document.createElement("TD");
				td.style="background: transparent none repeat scroll 0% 0%; padding: 0px; margin: 0px; border: 0px solid black;";

				td.setAttribute('id', 'WME.JumpMaps_' + wmeJM_version);
				td.innerHTML = "<a id='_map_WME' title='Open to WME'><img style='cursor: pointer; ' width=24 height=24  src='"+wmeJM_IconWME+"'></a>";

				for(var i=0; i < WazeControlAttribution.length; ++i)
				{
					if(wmeJM_debug) console.log("WME-JumpMaps (" + wmeJM_version + "): WazeControlAttribution[i].tagName="+WazeControlAttribution[i].tagName);

					if(WazeControlAttribution[i].tagName == "TABLE")
					{
						WazeControlAttribution[i].rows[0].appendChild(td);
						break;
					}
				}
				break;
			}
			case "kdl":
			{
				WazeControlAttribution.innerHTML=WazeControlAttribution.innerHTML+'<a id="_map_WME" class="waze" title="Open in WME"></a>';
				document.styleSheets[0].insertRule("#social_networks a.waze { background:url("+wmeJM_IconWME+" );background-size: 100% 100%; right: 236px;}", 0);
				break;
			}
			case "ncaby":
			{
				WazeControlAttribution.innerHTML=WazeControlAttribution.innerHTML+
				  '<div style="display: block; top: 340px;" widgetid="WazeButton" id="WazeButton" role="presentation">'+
					'<a id="_map_WME" title="Open to WME"><img style="cursor: pointer; padding-left: 4px;" width=28 height=28  src="'+wmeJM_IconWME+'"></a></div>';
				break;
			}
			case "osm":
			{
				nod.setAttribute('class', "leaflet-control");
				nod.innerHTML = "<a id='_map_WME' title='Open to WME'><img style='cursor: pointer; padding-top: 0px;' width=39 height=39  src='"+wmeJM_IconWME+"'></a>";
				WazeControlAttribution[0].parentElement.insertBefore(nod, WazeControlAttribution[0]);
				break;
			}
			case "mapbys":
			{
				var aArray=$("#search_td").find("a");
				if(wmeJM_debug) console.log("aArray.length",aArray.length);
				if (aArray.length > 0)
				{
					for(i=0; i < aArray.length;++i)
					{
						if (!document.getElementById('WME.JumpMaps_' + wmeJM_version))
						{
							nod.innerHTML="";
							aArray[i].parentElement.insertBefore(nod, aArray[i]);
						}

						if(aArray[i].href.indexOf("maps.by/map/")>0)
						{
							if(wmeJM_debug) console.log("aArray["+i+"].href=",aArray[i].href);
							var llll = __getQueryString(aArray[i].href, 'link').split(',');
							let lon=parseFloat(llll[0])+(parseFloat(llll[2])-parseFloat(llll[0]))/2;
							let lat=parseFloat(llll[1])+(parseFloat(llll[3])-parseFloat(llll[1]))/2;

	                      	var anod=document.createElement("a");
							anod.setAttribute('id', '_map_WME_' + i); // !!!  !!!
							anod.setAttribute('jmlink', ""+lat+","+lon); // преобразовывать координаты будем "там" (в WME)
							anod.setAttribute('jmfrom', 'mapbys'); // !!!  !!!
							anod.setAttribute('title','Open to WME');
							anod.setAttribute('style','color:#2a4984;text-decoration: underline;cursor:pointer');
							anod.innerHTML='<img style="cursor: pointer; padding-left: 8px;" align="top" width=18 height=18 src="'+wmeJM_IconWME+'">';

							aArray[i].parentElement.insertBefore(anod, aArray[i]);
							aArray[i].setAttribute('title',aArray[i].innerText);
							aArray[i].innerHTML='<img style="cursor: pointer;" width=18 height=18 src="http://maps.by/img/logo_min.png">';

							aArray[i].parentNode.insertBefore(aArray[i],aArray[i].parentNode.firstChild); // swap

							document.getElementById('_map_WME_'+ i).onclick	 = WmeJM_clickJumpToMaps;
							if(wmeJM_debug) console.log("anod=",document.getElementById('_map_WME_'+ i));
						}
					}
				}
                /*
                	for maps.by/map - обратка
					WazeControlAttribution.parentElement.parentElement.innerHTML=
					'<div id="WME.JumpMaps_' + wmeJM_version + '">' +
						'<a id="_map_WME" title="Open to WME"><img style="cursor: pointer; padding-left: 4px;" width=28 height=28  src="'+wmeJM_IconWME+'"></a></div>' +
					WazeControlAttribution.parentElement.parentElement.innerHTML;
				*/
				break;
			}
			case "mry":
			{
				WazeControlAttribution[0].parentElement.parentElement.innerHTML=
					'<div _ngcontent-yrv-39="" id="WME.JumpMaps_' + wmeJM_version + '" class="IconContainer bg-icon m1 mt2 relative cursor-pointer pointer-events-auto" dropup-control="" for="">' +
						'<a id="_map_WME" title="Open to WME"><img style="cursor: pointer; padding-left: 4px;" width=28 height=28  src="'+wmeJM_IconWME+'"></a></div>' +
					WazeControlAttribution[0].parentElement.parentElement.innerHTML;
				break;
			}
		}

		if (document.getElementById('_map_WME'))
		{
			document.getElementById('_map_WME').onclick	 = WmeJM_clickJumpToMaps;
			result=true;
		}
		if (document.getElementById('_map_WMEB'))
		{
			document.getElementById('_map_WMEB').onclick	 = WmeJM_clickJumpToMaps;
			result=true;
		}
	}
	else
	{
		if(wmeJM_debug) console.log("WME-JumpMaps (" + wmeJM_version + "): WmeJM_InsertIcon(): ELSE typeof WazeControlAttribution="+(typeof WazeControlAttribution)+", clsid[locType].t="+clsid[locType].t +", WazeControlAttribution.length="+WazeControlAttribution.length+" ["+(WazeControlAttribution && (clsid[locType].t || WazeControlAttribution.length >= 1))+"]");
	}

	if (result)
		WmeJM_PostLoadOtherMaps();

	return result;
}

function WmeJM_InitConfig()
{
	if(wmeJM_debug) console.log("WME-JumpMaps (" + wmeJM_version + "): WmeJM_InitConfig(): "+document.getElementById(CreateID()));
	if(!document.getElementById(CreateID()))
	{
		var srsCtrl = document.createElement('section');
		srsCtrl.id = CreateID();

		var userTabs = document.getElementById('user-info');
		if (typeof userTabs !== "undefined")
		{
			var navTabs = getElementsByClassName('nav-tabs', userTabs)[0];
			if (typeof navTabs !== "undefined")
			{
				var tabContent = getElementsByClassName('tab-content', userTabs)[0];
				if (typeof tabContent !== "undefined")
				{
					let newtab = document.createElement('li');
					// fa ==> http://fontawesome.io/cheatsheet/
					newtab.innerHTML = '<a href="#' + CreateID() + '" id="pwmejumpmaps" data-toggle="tab"><span class="fa fa-rocket"></span>&nbsp;JM</a>';
					navTabs.appendChild(newtab);

					//srsCtrl.id = "sidepanel-???";
					var padding="padding:5px 9px";

					// -------------------------------
					var strFormCode = ''
						+'<div class="side-panel-section">'
						+'<h4>WME JumpMaps <sup>' + wmeJM_version + '</sup>&nbsp;<sub><a href="https://greasyfork.org/ru/scripts/19626-wme-jumpmaps" target="_blank"><span class="fa fa-external-link"></span></a></sub></h4>'
						+'<form class="attributes-form side-panel-section" action="javascript:return false;">'

						+'<div class="form-group">'
						+'<label class="control-label">Назначения:</label>'
						+'<div class="controls">';
						for(var i in wmeJM_Config)
						{
							if (["_map_WME","_map_WMEB","_map_LI"].indexOf(i) >= 0)
							{
								continue;
							}
							var id=i;
							var title=wmeJM_Config[i].title;
							var template=wmeJM_Config[i].template;
							var save=wmeJM_Config[i].save;
							strFormCode += ''
								+'<div class="form-group">'
								+'<label class="control-label">'
								+'<input data="'+id+'" name="wmejm_cfg_'+id+'" id="wmejm_cfg_'+id+'" type="checkbox"><label id="wmejm_cfg_'+id+'_chklab" for="wmejm_cfg_'+id+'">&nbsp;'+title+'</label>'
								+'</label>' + '&nbsp;<a style="display: inline;" class="__wmejm_cfg_editlab__" data="'+id+'"><i class="waze-icon-edit"></i></a>'
								//+'<div class="controls" id="wmejm_inp_'+id+'_all" '+(save?'':'style="display: none;"')+'>'
								+'<div class="controls" id="wmejm_inp_'+id+'_all" style="display: none;">'
								+'Имя: <input data="'+id+'" type="text" class="form-control" autocomplete="off" id="wmejm_cfg_'+id+'_val" name="wmejm_cfg_'+id+'_val" value="'+wmeJM_Config[id].name+'" size="13"/></label><br>'
								+'Заголовок: <input data="'+id+'" type="text" class="form-control" autocomplete="off" id="wmejm_cfg_'+id+'_tit" name="wmejm_cfg_'+id+'_tit" value="'+title+'" size="13"/></label><br>'
								+'Шаблон: <input data="'+id+'" type="text" class="form-control" autocomplete="off" id="wmejm_cfg_'+id+'_templ" name="wmejm_cfg_'+id+'_templ" value="'+template+'" size="13" title="Подстановочные знаки: {{city}}, {{lon}}, {{lat}}, {{zoom}}"/></label><br>'
								+'</div>'
								+'</div>'
								+ '';
						}

					strFormCode += ''
						+'</div>'
						+'</div>';

					// -------------------------------
					strFormCode += ''
						+'<div class="form-group">'
						+'<label class="control-label">Прочие настройки:</label>'
						+'<div class="controls">'
						+'<input name="wmejm_cfg_savedsel" value="" id="wmejm_cfg_savedsel" type="checkbox"><label for="wmejm_cfg_savedsel" title="Восстанавливать выделенные объекты после прыжка">&nbsp;Restore selected</label>'
//						+'<br>'
//						+'<input name="wmejm_cfg_around" value="" id="wmejm_cfg_around" type="checkbox"><label for="wmejm_cfg_around" title="">&nbsp;Show link around</label>'
//wmeJM_around
						+'<br>'
						+'<input name="wmejm_cfg_debug" value="" id="wmejm_cfg_debug" type="checkbox"><label for="wmejm_cfg_debug" title="Включить логирование">&nbsp;Debug script</label>'
						+'<br>'
						+'<button id="wmejm_cfg_resetConfig"  class="btn btn-default" style="font-size:9px;'+padding+'" title="Reset config!"><i class="fa fa-recycle"></i>&nbsp;Reset config</button>'
						+'</div>'
						+'</div>'

						+'</form>'
						+'</div>'
						+'';

					srsCtrl.className = "tab-pane";
					srsCtrl.innerHTML=strFormCode;
					tabContent.appendChild(srsCtrl);
				}
				else
				{
					if(wmeJM_debug) console.log("WME-JumpMaps (" + wmeJM_version + "): WmeJM_InitConfig(): 'tab-content' not found");
					srsCtrl.id='';
				}
			}
			else
			{
				if(wmeJM_debug) console.log("WME-JumpMaps (" + wmeJM_version + "): WmeJM_InitConfig(): 'nav-tabs' not found");
				srsCtrl.id='';
			}
		}
		else
		{
			if(wmeJM_debug) console.log("WME-JumpMaps (" + wmeJM_version + "): WmeJM_InitConfig(): 'user-info' not found");
			srsCtrl.id='';
		}

		if(wmeJM_debug) console.log("WME-JumpMaps (" + wmeJM_version + "): WmeJM_InitConfig(): srsCtrl.id='"+srsCtrl.id+"'");
		if(srsCtrl.id != '')
		{
			document.getElementById("wmejm_cfg_resetConfig").onclick = function(){
				setTimeout(function() {
					if(confirm("Reset config for WME-JumpMaps?"))
					{
						let d=document.getElementById(CreateID());
						d.parentNode.removeChild(d);
						d=document.getElementById("pwmejumpmaps");
						d.parentNode.removeChild(d);

						localStorage.removeItem("WMEJumpMapsLink");
						for(var i in wmeJM_Config)	{ delete wmeJM_Config[i]; }
						wmeJM_Config = cloneConfig(wmeJM_Config0);

						localStorage.removeItem("WMEJumpMapsDebug");
						wmeJM_debug=false;

						WmeJM_InsertWMEIcon();
						WmeJM_InitConfig();
					}
				},100,this);
				return false;
			};

			document.getElementById("wmejm_cfg_debug").onclick = function(){wmeJM_debug=this.checked;localStorage.setItem("WMEJumpMapsDebug",wmeJM_debug?"1":"0");};
			document.getElementById("wmejm_cfg_debug").checked = wmeJM_debug;

			document.getElementById("wmejm_cfg_savedsel").onclick = function(){wmeJM_restoreSelected=this.checked;localStorage.setItem("WMEJumpMapsRestoreSelected",wmeJM_restoreSelected?"1":"0");};
			document.getElementById("wmejm_cfg_savedsel").checked = wmeJM_restoreSelected;

			var __wmejm_cfg_editlab__=document.getElementsByClassName("__wmejm_cfg_editlab__");
			for(let i=0; i < __wmejm_cfg_editlab__.length; ++i)
			{
				__wmejm_cfg_editlab__[i].onclick= function(){
					var id=this.getAttribute('data');
					var dstyle=document.getElementById("wmejm_inp_"+id+"_all").style.display;
					document.getElementById("wmejm_inp_"+id+"_all").style.display=(dstyle=="block")?"none":"block";
					//document.getElementById("wmejm_inp_"+id+"_all").style.display="block";
					//wmejm_cfg_'+id+'_val
				};
			}

			var aLinks = JSON.parse(localStorage.getItem('WMEJumpMapsLink'));
			for(let i in wmeJM_Config)
			{
				if (["_map_WME","_map_WMEB","_map_LI"].indexOf(i) >= 0)
					continue;

				document.getElementById("wmejm_cfg_"+i).checked = typeof aLinks[i] != "undefined"?true:false;
				var name=wmeJM_Config[i].name;
				if (name.length > 0)
					document.getElementById("wmejm_cfg_"+i+"_val").value = name;
				let title=wmeJM_Config[i].title;
				if (title.length > 0)
				{
					document.getElementById("wmejm_cfg_"+i+"_tit").value = title;
					document.getElementById("wmejm_cfg_"+i+"_chklab").innerHTML="&nbsp;"+title;
				}
				let template=wmeJM_Config[i].template;
				if (template.length > 0)
				{
					document.getElementById("wmejm_cfg_"+i+"_templ").value = template;
				}

				// обработчик видимости
				document.getElementById("wmejm_cfg_"+i).onchange = function(){
					var id=this.getAttribute('data');
					//document.getElementById("wmejm_inp_"+id+"_all").style.display=this.checked?"block":"none";
					localStorage.setItem('WMEJumpMapsLink', WmeJM_Config2String());
					WmeJM_InsertWMEIcon();
				};

				// обработчик имени
				document.getElementById("wmejm_cfg_"+i+"_val").onchange = function(){
					var id=this.getAttribute('data');
					wmeJM_Config[id].name=this.value;
					localStorage.setItem('WMEJumpMapsLink', WmeJM_Config2String());
					WmeJM_InsertWMEIcon();
				};

				// обработчик заголовка
				document.getElementById("wmejm_cfg_"+i+"_tit").onchange = function(){
					var id=this.getAttribute('data');
					wmeJM_Config[id].title=this.value;
					document.getElementById("wmejm_cfg_"+id+"_chklab").innerHTML="&nbsp;"+this.value;
					localStorage.setItem('WMEJumpMapsLink', WmeJM_Config2String());
					WmeJM_InsertWMEIcon();
				};

				// обработчик шаблона
				document.getElementById("wmejm_cfg_"+i+"_templ").onchange = function(){
					var id=this.getAttribute('data');
					wmeJM_Config[id].template=this.value;
					localStorage.setItem('WMEJumpMapsLink', WmeJM_Config2String());
					WmeJM_InsertWMEIcon();
				};

				// обработчик видимости на линейке прыгалки
				document.getElementById("wmejm_cfg_"+i).onclick = function(){
					var id=this.getAttribute('data');
					wmeJM_Config[id].save=this.checked?1:0;
					localStorage.setItem('WMEJumpMapsLink', WmeJM_Config2String());
					WmeJM_InsertWMEIcon();
				};
			}



			//WmeJM_InsertWMEIcon()
		}
		else
		{
			if(wmeJM_debug) console.log("WME-JumpMaps (" + wmeJM_version + "): WmeJM_InitConfig(): wait 500ms");
			setTimeout(WmeJM_InitConfig,500);
		}
	}
	else
		if(wmeJM_debug) console.log("WME-JumpMaps (" + wmeJM_version + "): WmeJM_InitConfig(): not found '"+CreateID()+"'");
}

//
function WmeJM_FakeLoad()
{
	if(wmeJM_debug) console.log("WME-JumpMaps (" + wmeJM_version + "): start WmeJM_FakeLoad(): this"+ this);
	var loctype=WmeJM_GetLocationType();
	if(wmeJM_debug) console.log("WME-JumpMaps (" + wmeJM_version + "): start WmeJM_FakeLoad(): loctype="+loctype);

	if(window.document.getElementById('WME.JumpMaps_' + wmeJM_version)) // если ЭТО есть, значит другие проверки пройдены
	{
		if(wmeJM_debug) console.log("WME-JumpMaps (" + wmeJM_version + "): WmeJM_FakeLoad(): FOUND WME.JumpMaps_" + wmeJM_version + "!!!. Done");
		return;
	}

	if (loctype === "waze")
	{
		if (typeof Waze === "undefined")
		{
			if(wmeJM_debug) console.log("WME-JumpMaps (" + wmeJM_version + "): WmeJM_FakeLoad(): wait W. Wait 500ms");
			setTimeout(WmeJM_FakeLoad,500);
			return;
		}
		if (typeof W.selectionManager === "undefined")
		{
			if(wmeJM_debug) console.log("WME-JumpMaps (" + wmeJM_version + "): WmeJM_FakeLoad(): wait W.selectionManager. Wait 500ms");
			setTimeout(WmeJM_FakeLoad,500);
			return;
		}
		if (document.getElementsByClassName('olControlAttribution')[0] === null)
		{
			if(wmeJM_debug) console.log("WME-JumpMaps (" + wmeJM_version + "): WmeJM_FakeLoad(): wait waze olControlAttribution. Wait 500ms");
			setTimeout(WmeJM_FakeLoad,500);
		}
	}

	if (document.readyState != 'complete' && ++wmeJM_countProbe2 < 5)
	{
		if(wmeJM_debug) console.log("WME-JumpMaps (" + wmeJM_version + "): WmeJM_FakeLoad(): document.readyState != 'complete', wmeJM_countProbe="+wmeJM_countProbe2+". Wait 3000ms");
		setTimeout(WmeJM_FakeLoad,3000);
		return;
	}

	// дальнейшая инициализация
	if (loctype === "waze")
	{
		// а вдруг мы прыгнули "оттуда" и если в URL есть компонента "jmlink", то центрируем редактор по указанным координатам (EPSG:900913).
		if (__getQueryString(location.href, "jmlink") != -1)
		{
			var jmlink=__getQueryString(location.href, "jmlink").split(",");
			var urPos=new OpenLayers.LonLat(jmlink[1],jmlink[0]);
			urPos.transform(new OpenLayers.Projection("EPSG:900913"),new OpenLayers.Projection("EPSG:4326"));
	        var xy = OpenLayers.Layer.SphericalMercator.forwardMercator(parseFloat(urPos.lon), parseFloat(urPos.lat));
    	    W.map.setCenter(xy);
		}
		WmeJM_InsertWMEIcon();
		WmeJM_InitConfig();
		WmeJM_initBindKey();
	}
	else
	{
		// другие сервисы...
		if(document.getElementById('WME.JumpMaps_' + wmeJM_version) === null && !WmeJM_InsertIcon())
		{
			if(++wmeJM_countProbe < 8) // 8 попыток
			{
				let cls="";
				if(wmeJM_debug) console.log("WME-JumpMaps (" + wmeJM_version + "): not other found '"+cls+"'. wmeJM_countProbe="+wmeJM_countProbe+". Wait 5000ms");
				setTimeout(WmeJM_FakeLoad,5000);
				return;
			}
		}
		//WmeJM_PostLoadOtherMaps();
	}
}


function __GetLocalStorageItem(Name,Type,Def,Arr)
{
	//if (wme2GIS_debug) console.log("__GetLocalStorageItem(): Name="+Name+",Type="+Type+",Def="+Def+",Arr="+Arr);
	var tmp0=localStorage.getItem(Name);
	if (tmp0)
	{
		switch(Type)
		{
			case 'string':
				break;
			case 'bool':
				tmp0=(tmp0 === "true" || tmp0 === "1")?true:false;
				break;
			case 'int':
				tmp0=!isNaN(parseInt(tmp0))?parseInt(tmp0):0;
				break;
			case 'arr':
				if (tmp0.length > 0)
					if(!Arr[tmp0])
						tmp0=Def;
				break;
		}
	}
	else
		tmp0=Def;
	return tmp0;
}


// запускатор скрипта
function WmeJM_bootstrap()
{
	console.log("WME-JumpMaps (" + wmeJM_version + "): WmeJM_bootstrap()");

	wmeJM_Config = cloneConfig(wmeJM_Config0);

	wmeJM_debug				= __GetLocalStorageItem("WMEJumpMapsDebug",'bool',false);
	wmeJM_restoreSelected	= __GetLocalStorageItem("WMEJumpMapsRestoreSelected",'bool',false);
	wmeJM_around			= __GetLocalStorageItem("WMEJumpMapsAround",'bool',false);

	setTimeout(function() {WmeJM_FakeLoad();},(WmeJM_GetLocationType() === "YM")?3000:500,this);
}

function WmeJM_clickJumpToMapsArg()
{
	if ((typeof arguments[0]) === "object")
	{
		var o=document.getElementById(arguments[0].id);
		if (typeof o !== "undefined")
		{
			if (arguments[0].save)
				o.click();
		}
	}
}

function WmeJM_initBindKey()
{
	if(wmeJM_debug) console.log("WmeJM_initBindKey()");
	if(!W || !W.model || !I18n || !W.accelerators || !W.model.countries || !W.model.countries.top) {
		setTimeout(WmeJM_initBindKey, 500);
		return;
	}

    var Config =[];

	for(let i in wmeJM_Config)
	{
        Config.push({handler: 'WME-JumpMaps'+i,  title: wmeJM_Config[i].title,  func: WmeJM_clickJumpToMapsArg, key:-1, arg:{id:i,save:wmeJM_Config[i].save}});
	}

    for(let i=0; i < Config.length; ++i)
    {
        WMEKSRegisterKeyboardShortcut('WME-JumpMaps', 'WME-JumpMaps', Config[i].handler, Config[i].title, Config[i].func, Config[i].key, Config[i].arg);
    }

    WMEKSLoadKeyboardShortcuts('WME-JumpMaps');

    window.addEventListener("beforeunload", function() {
        WMEKSSaveKeyboardShortcuts('WME-JumpMaps');
    }, false);

}


WmeJM_bootstrap();
/*
a=$("#search_td").find("a")
for(i=0; i < a.length;++i){if(a[i].href.indexOf("maps.by/map/")>0)console.log(a[i].href)}
*/


// from: https://greasyfork.org/en/users/5920-rickzabel
/*
when adding shortcuts each shortcut will need a uniuque name
the command to add links is WMERegisterKeyboardShortcut(ScriptName, ShortcutsHeader, NewShortcut, ShortcutDescription, FunctionToCall, ShortcutKeysObj) {
    ScriptName: This is the name of your script used to track all of your shortcuts on load and save.
    ScriptName: replace 'WMEAwesome' with your scripts name such as 'SomeOtherScript'
    ShortcutsHeader: this is the header that will show up in the keyboard editor
    NewShortcut: This is the name of the shortcut and needs to be uniuque from all of the other shortcuts, from other scripts, and WME
    ShortcutDescription: This wil show up as the text next to your shortcut
    FunctionToCall: this is the name of your function that will be called when the keyboard shortcut is presses
    ShortcutKeysObj: the is the object representing the keys watched set this to '-1' to let the users specify their own shortcuts.
    ShortcutKeysObj: The alt, shift, and ctrl keys are A=alt, S=shift, C=ctrl. for short cut to use "alt shift ctrl and l" the object would be 'ASC+l'
*/
function WMEKSRegisterKeyboardShortcut(e,r,t,a,o,s,c){try{I18n.translations[I18n.locale].keyboard_shortcuts.groups[e].members.length}catch(n){W.accelerators.Groups[e]=[],W.accelerators.Groups[e].members=[],I18n.translations[I18n.locale].keyboard_shortcuts.groups[e]=[],I18n.translations[I18n.locale].keyboard_shortcuts.groups[e].description=r,I18n.translations[I18n.locale].keyboard_shortcuts.groups[e].members=[]}if(o&&"function"==typeof o){I18n.translations[I18n.locale].keyboard_shortcuts.groups[e].members[t]=a,W.accelerators.addAction(t,{group:e});var l="-1",i={};i[l]=t,W.accelerators._registerShortcuts(i),null!==s&&(i={},i[s]=t,W.accelerators._registerShortcuts(i)),W.accelerators.events.register(t,null,function(){o(c)})}else alert("The function "+o+" has not been declared")}function WMEKSLoadKeyboardShortcuts(e){if(localStorage[e+"KBS"])for(var r=JSON.parse(localStorage[e+"KBS"]),t=0;t<r.length;t++)W.accelerators._registerShortcuts(r[t])}function WMEKSSaveKeyboardShortcuts(e){var r=[];for(var t in W.accelerators.Actions){var a="";if(W.accelerators.Actions[t].group==e){W.accelerators.Actions[t].shortcut?(W.accelerators.Actions[t].shortcut.altKey===!0&&(a+="A"),W.accelerators.Actions[t].shortcut.shiftKey===!0&&(a+="S"),W.accelerators.Actions[t].shortcut.ctrlKey===!0&&(a+="C"),""!==a&&(a+="+"),W.accelerators.Actions[t].shortcut.keyCode&&(a+=W.accelerators.Actions[t].shortcut.keyCode)):a="-1";var o={};o[a]=W.accelerators.Actions[t].id,r[r.length]=o}}localStorage[e+"KBS"]=JSON.stringify(r)}
/* ********************************************************** */
