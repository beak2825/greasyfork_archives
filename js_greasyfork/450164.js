// ==UserScript==
// @name         Graticule-assistant
// @namespace    http://tampermonkey.net/
// @version      0.01
// @description  Show graticules and founds on geojson.io
// @author       mrummuka@hotmail.com
// @match        http://geojson.io/
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_setClipboard
// @require      https://cdnjs.cloudflare.com/ajax/libs/Turf.js/5.1.6/turf.js
// @require      https://unpkg.com/@tmcw/togeojson@4.3.0/dist/togeojson.umd.js
// @require     https://unpkg.com/sweetalert2@7.26.29/dist/sweetalert2.all.min.js
// @downloadURL https://update.greasyfork.org/scripts/450164/Graticule-assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/450164/Graticule-assistant.meta.js
// ==/UserScript==
/* jshint esversion: 9 */


// appends file input button for uploading gpx //TODO handling
// https://stackoverflow.com/questions/14249712/basic-method-to-add-html-content-to-the-page-with-greasemonkey
// https://stackoverflow.com/questions/572768/styling-an-input-type-file-button
// https://stackoverflow.com/questions/5927012/javascript-createelement-style-problem
// TODO: unsafewindow

const graticules = [];
//
const types_graticules = [];
const ctypes = [];
const caches = [];
// array holding
// [1] = how many graticules with one types
// [2] = "" with two types
// [3] = "" with three types
// ...
const graticules_with_n_types = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

// array holding graticule - type objects
// [ { graticule: "xx, yy", type: "Traditional"} ]
const graticules_with_type = [];


function genGraticulesGrid() {
    let lines = [];

    for( let lat=-179; lat<180; lat++) {
        let feat = {
            "type": "Feature",
            "properties": { "stroke": "#A0A0A0",
            "stroke-width": 0.8}, //#A0A0A0
            "geometry": {
            "type": "LineString",
            "coordinates": [
                [lat,-90],
                [lat,90]  ]
            }
        }
        lines.push( feat);
      }

      for( let lng=-90; lng<90; lng++) {
        let feat = {
            "type": "Feature",
            "properties": { "stroke": "#A0A0A0",
            "stroke-width": 0.8},
            "geometry": {
            "type": "LineString",
            "coordinates": [
                [-180,lng],
                [180,lng]  ]
            }
        }
        lines.push( feat);
      }
      return lines;

}

function genGraticuleDone( lng, lat ) {
    let lines = [];

    let feat1 = {
        "type": "Feature",
        "properties": {
            "stroke": "#00FF00",
            "stroke-width": 9
        }
            ,
        "geometry": {
        "type": "LineString",
        "coordinates": [
            [lat,lng],
            [lat+1,lng+1]  ]
        }
    }

    let feat2 = {
        "type": "Feature",
        "properties": {
            "stroke": "#00FF00",
            "stroke-width": 9 },
        "geometry": {
        "type": "LineString",
        "coordinates": [
            [lat+1,lng],
            [lat,lng+1]  ]
        }
    }

    lines.push( feat1 );
    lines.push( feat2 );

    return lines;
}


// TODO: load caches from GPX
async function loadCaches() {
    //xmldom.gpx(mygpx)
    console.log("LOG: started load");


    if( gpxfiledata != null ) {
        const geojson = toGeoJSON.gpx(gpxfiledata);
    console.log("LOG: Parsed to geojson");

        //TODO: now simply merges all from gpx directly to model
        // extract graticules for cache wps
        let graticules = [];
        graticules = getGraticules( geojson );
        console.log(JSON.stringify((graticules)));

        let allDone = [];
        graticules.forEach( g => {
            let res =  ( genGraticuleDone( g[0], g[1] ) );
            allDone.push( res[0] ); // New graticule found
            allDone.push( res[1] );
        })
        unsafeWindow.api.data.mergeFeatures( allDone );

        return graticules;
    }

    //console.print( mygpx );
}

// find all features that are cache wps (excluding bruteforce cache's bogus)
function getCaches1( fc ) {
    let known_caches = fc.features.filter( feat =>
        (feat.properties.sym == "Geocache" || feat.properties.sym == "Geocache Found"));
    return known_caches;
}


function getGraticules( geojson ) {
    console.log("LOG: Getting graticules");

    let caches = [];
    console.debug("Looking thru", geojson.features.length, "waypoints" );
    for( let n = 0; n< geojson.features.length; n++) {
        let cache = geojson.features[n];

        if( cache.properties.sym == "Geocache Found")
        {
            let graticule = [ Math.floor( cache.geometry.coordinates[1] ) , Math.floor( cache.geometry.coordinates[0] ) ];
            cache.graticule = graticule;

            caches.push(cache);

            // check if new type
            if( !ctypes.includes( cache.properties.type ) ) {
                ctypes.push( cache.properties.type );

                // add graticules array for this type
                types_graticules.push( [] );
                console.debug("Added type", cache.properties.type)
            }

            // check if new graticule
//            if( !graticules.includes( graticule )) {
            if( !graticules.find( el => el[0] == graticule[0] && el[1] == graticule[1] )) {
                graticules.push( graticule );
                //console.debug("New graticule: ", graticule );
                console.debug("graticules.push( [", graticule, "]); // New graticule found!");

            }


            // NEW
            // [ { graticule: "xx, yy", type: "Traditional" } ]
            const count = graticules_with_type.filter( obj => {
                if ( obj.type == cache.properties.type && obj.graticule == graticule ) {
                    return true;
                }
                return false;
            }).length;
            if( count == 0 ) {
                console.debug("New graticule/type for ", cache.properties.type, " - ", graticule );
                graticules_with_type.push( { graticule: graticule, type: cache.properties.type } );
            }
            if( count >1 ) {
                console.error("Found ", count, " types for ", graticule, " - ", cache.properties.type);
            }

        }

    }
    return graticules;

}

function appendFileInput() {
    var newLabel = document.createElement('label');
    newLabel.setAttribute('for', 'file-upload');
    newLabel.setAttribute('class', 'custom-file-upload');
    newLabel.style.cssText = 'border: 1px solid #666;display: inline-block;padding: 9px 9px;cursor: pointer; ';

    var newI = document.createElement('i');
    newI.setAttribute('class', 'fa fa-cloud-upload');
    newLabel.textContent = "Import GPX";

    var newHTML = document.createElement ('input');
    newHTML.setAttribute('type', 'file');
    newHTML.setAttribute('id', 'file-upload');
    newHTML.style.display = "none";

    //newHTML.innerHTML   = '<input id="gpxinput" name="gpxinput"></input>';
    document.getElementsByClassName("buttons")[0].appendChild (newLabel);
    document.getElementsByClassName("custom-file-upload")[0].appendChild (newI);
    document.getElementsByClassName("buttons")[0].appendChild (newHTML);

    return;
}
class uploadDealgpx {
    constructor() { }
    /*------ Method for read uploded gpx file ------*/
    getGpx(e) {
        console.log("LOG: getGpx");

        let input = document.getElementById('file-upload');
        input.addEventListener('change', function () {

            if (this.files && this.files[0]) {

                var myFile = this.files[0];
                var reader = new FileReader();

                reader.addEventListener('load', function (e) {
                    console.log("LOG: onload");
                    let gpxdata = e.target.result;

                    gpxfiledata = parseGpx.getParsegpxdata(gpxdata);
                    console.log("LOG: GPX parsed");
                    //gpxfiledata = new DOMParser().parseFromString(gpxdata, "text/xml");
                    //console.log(gpxfiledata);
                    // insert and show on map
                    loadCaches();
                    //return xml;
                    //parseGpx.getParsegpxdata(gpxdata); // calling function for parse gpx data
                });

                reader.readAsBinaryString(myFile);
            }
        });
    }
    /*------- Method for parse gpx data and display --------------*/
    getParsegpxdata(data) {
        const xml = new DOMParser().parseFromString(data, 'text/xml');
        return xml;
    }
}

    appendFileInput();
    var parseGpx = new uploadDealgpx();
    parseGpx.getGpx();
    let gpxfiledata;

    (function() {
        'use strict';


        let allGrats = genGraticulesGrid();
        unsafeWindow.api.data.mergeFeatures( allGrats );


        // Your code here...
        /*
        doesn't work here, neither in "global" nor within function
        basically appendfileinput = OK, but getGpx tries to point out to global parseGPX which is not available
        appendFileInput();
        var parseGpx = new uploadDealgpx();
        parseGpx.getGpx();
    */

    } ());