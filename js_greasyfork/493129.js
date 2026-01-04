// ==UserScript==
// @name        tf-geojson
// @namespace   Violentmonkey Scripts
// @match       *://www.trailforks.com/trails/*
// @grant       none
// @version     1.0.2
// @author      lolo
// @grant window.close
// @description 22/04/2024
// @downloadURL https://update.greasyfork.org/scripts/493129/tf-geojson.user.js
// @updateURL https://update.greasyfork.org/scripts/493129/tf-geojson.meta.js
// ==/UserScript==
//
//
//serves a string as a file for download
function downloadString(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    window.close();
}

//checks for problems, alerts user
function errCheck(pageStr) {
	let noTF = "It looks like you're not on a Trailforks.com page.";
	let noTrailRoute = "It looks like you're on Trailforks.com, but not looking at a route or trail page.";
	let noMap = "Impossible de trouver une carte sur cette page Trailforks. Appuyez sur OK pour accéder à la page où nous pensons que la carte se trouve.\n\nVous devrez cliquer à nouveau sur le bookmarklet après le chargement de cette page pour exporter."
	if (window.location.hostname.indexOf('trailforks') === -1) {
		window.alert(noTF)
		return false;
	} else if (window.location.pathname.indexOf('trails') === -1 && window.location.pathname.indexOf('route') === -1 && window.location.pathname.indexOf('ridelog/view') === -1) {
		window.alert(noTrailRoute);
		return false;
	} else if (pageStr.indexOf("encodedpath") === -1) {
//		if(confirm(noMap)) {
//			window.location.href = 'https://' + document.location.hostname + document.location.pathname + 'map/'
			return false;
//  	}
	} else {
		return true;
	}
}

//get page source
let pageString = document.getElementsByTagName('html')[0].innerHTML;

//loose check to make sure user's in the right spot
if ( errCheck(pageString) ) {

  let geojson = {
    "name":"GeoJson Trailforks",
    "type":"FeatureCollection",
    "crs": {
        "type": "name",
        "properties": {
            "name": "urn:ogc:def:crs:EPSG::4326"
        }
    },
    "features":[{
        "type":"Feature",
        "id": null,
        "geometry":{
            "type":"LineString",
            "coordinates":[]
        },
        "properties":[]
    }]
  };
  //get id json
  let tfget = pageString.match(/geoJSON\.push\((\{(.+?)properties: (\{.+?\})(.+?)\})\);\n/s)[3].replace(/\s\s+/g, ' ').replace(/'/g, '"');
  let tfinfo = JSON.parse(tfget);
//  console.log(tfinfo);

	//get page title
	let pageTitle = document.title;

	//get short title
	let shortTitle = pageTitle.split("|")[0].trim();

	//get page Url
	let pageUrl = 'https://' + window.location.hostname + window.location.pathname;

	//get filename
  $("div.definition.diffratingvoteLink > span.grey.underline.clickable").remove();
  let gpxColor = $("div.definition.diffratingvoteLink > span").attr('class').replace(/dicon_small d/g,'');
  let gpxFilename = "-Di-" + gpxColor;

  //get trail json
  let trailget = pageString.match(/var trail = \[(.*?)\];/);
  let trail = JSON.parse(trailget[1]);

//  console.log(trail);

  let trailid = trail.trailid;
  let alias = trail.alias.replace(/-/g, '_');
  gpxFilename = trailid + "-" + alias + gpxFilename;

	//find polyline
	//polyline value lives in an HTML <script> and has escaped backslashes that skew the results of the Mapbox decoder
	//replacing with the encoded 'HCX' to avoid JS backslash drama altogether
	//not sure how/why this works but it's how their own encoder handles backslashes https://developers.google.com/maps/documentation/utilities/polylineutility
	let trailPolyline = pageString.match(/encodedpath:\s?'(.*?)'/)[1].replaceAll('\\\\', 'HCX');

	//get waypoints
	let waypointArray = polyline.decode(trailPolyline);

	//empty string for trackpoints
	let gpxTrackpoints = '';

	//turn the waypoints into trackpoints
	for (let coord of waypointArray) {
    geojson.features[0].geometry.coordinates.push([coord[1], coord[0]]);
	}

	//output GPX string as file
//  let gpx = new DOMParser().parseFromString(outputGpx, 'text/xml');
//  let text = JSON.stringify(toGeoJSON.gpx(gpx));
//  let text = toGeoJSON.gpx(gpx);
  tfinfo["url"] = "http://www.trailforks.com/goto/trail/" + tfinfo.id;
  trail = Object.assign(trail, tfinfo);
  geojson.features[0]["id"] = tfinfo.id;
  geojson.features[0].properties.push(trail);
//  console.log(geojson);
  let text = JSON.stringify(geojson);
//  console.log(toGeoJSON.gpx(gpx));
	let filename = gpxFilename + ".geojson";

	downloadString(filename, text);
}