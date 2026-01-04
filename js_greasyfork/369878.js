// ==UserScript==
// @name            WME MapsFrTEST
// @name:fr         WME MapsFrTEST
// @icon            data:image/png;base64,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
// @description     This script create buttons to permalink page on several Maps.
// @description:fr  Ce script créer des boutons pour accéder à des liens externes.
// @version         2024.12.21.009
// @match           https://www.waze.com/*/editor*
// @match           https://www.waze.com/editor*
// @match           https://beta.waze.com/*
// @match           https://fr.chargemap.com/map/*
// @match           https://www.google.fr/?MFR*
// @connect         https://www.google.fr/*
// @require     https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @grant           none
// @author          TXS, Laurent
// @license         Test
// @namespace       https://greasyfork.org/fr/scripts/369878-wme-mapsfr
// @downloadURL https://update.greasyfork.org/scripts/369878/WME%20MapsFrTEST.user.js
// @updateURL https://update.greasyfork.org/scripts/369878/WME%20MapsFrTEST.meta.js
// ==/UserScript==
// @match           https://guichet-adresse.ign.fr/map/*
/* global $ */

//(function() { // pour chargemap geoloc
    //'use strict';
/*window.*/localStorage.removeItem('last-saved-position');// pour fr.Chargemmap geoloc
//})();

const MapsFr_version = GM_info.script.version, MapsFr_link = GM_info.script.namespace, MapsFr_Icon = GM_info.script.icon;

const updateMessage = `Maps_FR` +
    `Plein de trucs`;
WazeWrap.Interface.ShowScriptUpdate("WME MapsFrTEST", GM_info.script.version, updateMessage, "https://greasyfork.org/fr/scripts/369878", "javascript:alert('No forum available');");

let gps,mapsUrl,gz,coord,href,addon,userTabs,navTabs,tabContent,newtab,token,setLayer,citycode,street,locality,oldcitycode,oldcity,context,depomcode;
let village,ville,city,town,county,country,country_code,bbox,postcode,road; // Geojson OSM

function getQueryString(link, name) {
    let pos = link.indexOf( name ) + name.length;
    let len = link.substr(pos).indexOf('&');
    if (-1 == len) len = link.substr(pos).length;
    return parseFloat(link.substr(pos,len)); }
function getGps(z) {
    let href = document.getElementsByClassName('permalink')[0].href;
    let lon = getQueryString(href, 'lon=');
    let lat = getQueryString(href, 'lat=');
    let zoom = parseInt(getQueryString(href, 'zoomLevel=')) + z;
    return {lon, lat, zoom}; }

function geobretagneZoom(gz) {
    switch (gz)
    {
        case 12:
        case 13:
        case 14: gz = 1400; break;
        case 15: gz = 700; break;
        case 16:
        case 17: gz = 280; break;
        case 18: gz = 140; break;
        case 19: gz = 70; break;
        case 20:
        case 21:
        case 22:
        default: gz = 280; break;
    }
    return gz; }

function GoogleEarthZoom(gz) {
    switch (gz)
    {
        case 12:
        case 13:
        case 14: gz = 7000; break;
        case 15: gz = 3500; break;
        case 16: gz = 1250; break;
        case 17: gz = 800; break;
        case 18: gz = 350; break;
        case 19: gz = 250; break;
        case 20: gz = 200; break;
        case 21:
        case 22:
        default: gz = 1250; break;
    }
    return gz; }

function AppleZoom(gz) {
    switch (gz)
    {
        case 12: gz = 1280; break;
        case 13: gz = 640; break;
        case 14: gz = 320; break;
        case 15: gz = 160; break;
        case 16: gz = 80; break;
        case 17: gz = 40; break;
        case 18: gz = 20; break;
        case 19: gz = 10; break;
        case 20: gz = 5; break;
        case 21: gz = 2.5; break;
        case 22: gz = 1.25; break;
        default: gz = 40; break;
    }
    return gz; }

function BetaAppleZoom(gz) {
    switch (gz)
    {
        case 3:
        case 4: gz = '74.99952669798041%2C192.33349629003095'; break;
        case 5: gz = '23.851978655945494%2C60.89019163581051'; break;
        case 6: gz = '14.576125245576598%2C37.24286921603317'; break;
        case 7: gz = '5.550676118643011%2C14.189649678352652'; break;
        case 8: gz = '3.476444460831786%2C8.887620700608977'; break;
        case 9: gz = '1.3538629720601634%2C3.4612933238653625'; break;
        case 10: gz = '0.8481948544197806%2C2.1685068370840668'; break;
        case 11: gz = '0.3287847951146503%2C0.8405773699554402'; break;
        case 12: gz = '0.20324287868177748%2C0.5196146586635564'; break;
        //case 12: gz = '0.2110378848490413,0.5395435162915305'; break;
        case 13: gz = '0.12867514098346788,0.3289733688154399'; break;
        case 14: gz = '0.05075787113434416,0.12976856634881528'; break;
        case 15: gz = '0.019803866258634173,0.05063095224772951'; break;
        case 16: gz = '0.0122330280088363,0.0312751989600315'; break;
        case 17: gz = '0.007550891689341199,0.019304757563361363'; break;
        case 18: gz = '0.0027971232248518163,0.007151180014261627'; break;
        case 19: gz = '0.0017153164936942744,0.004184246063232422'; break;
        case 20: //gz = 5; break;
        case 21: //gz = 2.5; break;
        case 22: //gz = 1.25; break;
        default: gz = '0.007550891689341199,0.019304757563361363'; break;
    }
    return gz; }

function FranceServiceZoom(gz) {
    switch (gz)
    {
        case 3:
        case 4:
        case 5:
        case 6: gz = 768; break;
        case 7: gz = 384; break;
        case 8: gz = 192; break;
        case 9: gz = 96; break;
        case 10: gz = 48; break;
        case 11: gz = 24; break;
        case 12: gz = 12; break;
        case 13: gz = 6; break;
        case 14: gz = 3; break;
        case 15: gz = 1.5; break;
        case 16: gz = 0.75; break;
        case 17: gz = 0.38; break;
        case 18: gz = 0; break;
        case 19:
        case 20:
        case 21:
        case 22:
        default: gz = 1.5; break;
    }
    return gz; }

function get4326CenterPoint(){
        let projI = new OpenLayers.Projection("EPSG:900913");
        let projE = new OpenLayers.Projection("EPSG:4326");
        let center_lonlat = (new OpenLayers.LonLat(W.map.getCenter().lon, W.map.getCenter().lat)).transform(projI,projE);
        let lat = (center_lonlat.lat);
        let lon = (center_lonlat.lon);
        return new OpenLayers.LonLat(lon, lat); }

function getCenterZoom() {
	var map = W.map.getOLMap()
	var zoom = map.getZoom()
	var center = map.getCenter().transform(new OpenLayers.Projection('EPSG:900913'), new OpenLayers.Projection('EPSG:4326'))
	center.zoom = zoom
	return center
}

function add_buttons() {

setTimeout(()=> {
    if (/cadvil/.test(window.location.href)) { detect_MonTerritoireVille(); }
    else if (/caddep/.test(window.location.href)) { detect_MonTerritoireDep(); }
    else if (/addrue/.test(window.location.href)) { detect_AdresseRue(); }
    else if (/addmairie/.test(window.location.href)) { detect_AdresseMairie(); }
    else if (/servpub/.test(window.location.href)) { detect_ServicePublic(); }
    else if (/gouvrue/.test(window.location.href)) { detect_GouvRue(); }
//    else if (/mappystr/.test(window.location.href)) { detect_MappyStreet(); }
    else if (/laposte/.test(window.location.href)) { detect_LaPoste(); }
    else if (/chargemap/.test(window.location.href)) { detect_ChargeMap(); }
    else if (/wiiiz/.test(window.location.href)) { detect_Wiiiz(); }
    else if (/izivia/.test(window.location.href)) { detect_Izivia(); }
    else if (/elect/.test(window.location.href)) { detect_Electromaps(); }
    else if (/villerue/.test(window.location.href)) { detect_VilleRue(); }
    else if (/villeru/.test(window.location.href)) { detect_VilleRu(); }
    else if (/clochers/.test(window.location.href)) { detect_Clochers(); }
    else if (/clocher/.test(window.location.href)) { detect_Clocher(); }
    else if (/inseecog/.test(window.location.href)) { detect_InseeCog(); }
    else if (/insecog/.test(window.location.href)) { detect_InseCog(); }
    else if (/chanomcom/.test(window.location.href)) { detect_ChaNomCom(); }
    else if (/creacom/.test(window.location.href)) { detect_CreaCom(); }
    else if (/cadgouv/.test(window.location.href)) { detect_CadGouv(); }
    else if (/radauto/.test(window.location.href)) { detect_RadAuto(); }
    else if (/pomvil/.test(window.location.href)) { detect_PomVil(); }
    else if (/pompvil/.test(window.location.href)) { detect_PompVil(); }
    else if (/franceservices/.test(window.location.href)) { detect_FranceServices(); }
    else if (/bisfutcour/.test(window.location.href)) { detect_BisFutCour(); }
    else if (/bisfutprev/.test(window.location.href)) { detect_BisFutPrev(); }
    else if (/anent/.test(window.location.href)) { detect_AnEnt(); }
    else if (/googlevil/.test(window.location.href)) { detect_GoogleVil(); }
    else if (/googlville/.test(window.location.href)) { detect_GooglVille(); }
    else if (/educnat/.test(window.location.href)) { detect_EducNat(); }
    else if (/educanat/.test(window.location.href)) { detect_EducaNat(); }
    else { console.log("Chargement de WME MapsFR"); }
}, 500);


/*function MapsFr_bootstrap() {
    if ('undefined' == typeof __RTLM_PAGE_SCOPE_RUN__) {
        (function page_scope_runner() {
            const my_src = "(" + page_scope_runner.caller.toString() + ")();";
            const script = document.createElement('script');
            script.setAttribute("type", "text/javascript");
            script.textContent = "var __RTLM_PAGE_SCOPE_RUN__ = true;\n" + my_src;
            document.body.appendChild(script);
            setTimeout(function() {
                add_buttons();

            }, 3000);
            return; })(); }
}*///-----------------------------------------------------------------------------------------------------|||||||||||||||||||||||||||||||||||||||||||||||||



/*const detect_AdresseIGN =()=> {
    let t = window.location.href.split("?")[1];
    let c = JSON.parse(t);
    let coord = ol.proj.transform([c[0], c[1]], "EPSG:4326", "EPSG:3857");
    console.log(coord);
    map.getView().setCenter(coord);
    map.getView().setZoom(c[2]);
}*/

/*const detect_MonTerritoireVille =()=> {
    let wazeapi = W || window.W;
    //let lonlat = new OpenLayers.Layer.SphericalMercator.inverseMercator( W.map.getExtent().getCenterLonLat().lon, W.map.getExtent().getCenterLonLat().lat );
    let lonlat = (new OpenLayers(wazeapi.map.getExtent().getCenterLonLat().c[0], wazeapi.map.getExtent().getCenterLonLat().c[1])).transform(new OpenLayers.Projection("EPSG:900913"), new OpenLayers.Projection("EPSG:4326"));//W.map.getCenter().transform("EPSG:900913", "EPSG:4326");
    //let lonlat = (new OpenLayers.LonLat(W.map.getCenter().c[0], W.map.getCenter().c[1])).transform(new OpenLayers.Projection("EPSG:900913"), new OpenLayers.Projection("EPSG:4326"));//W.map.getCenter().transform("EPSG:900913", "EPSG:4326");
    //let lonlat = (new OpenLayers.SphericalMercator.inverseMercator( W.map.getExtent().getCenterLonLat().c[0], W.map.getExtent().getCenterLonLat().c[1]));
    //c[0] = lonlat.lon;
    //c[1] = lonlat.lat;
    let t = window.location.href.split("?MFRcadvil")[1];
    let c = JSON.parse(t);
    fetch(`https://api-adresse.data.gouv.fr/reverse/?lon=${lonlat.c[0]}&lat=${lonlat.c[1]}`)
        .then(resp => resp.json())
        .then((geocodingResult) => {
        //if (geocodingResult.features[0].geometry=new OpenLayers.Geometry.Point(W.map.getExtent().getCenterLonLat().c[0], W.map.getExtent().getCenterLonLat().c[1]));{
        if (geocodingResult.features[0] === undefined) { alert(`Le code postal de la ville n'a pas été détecté.\rIl faut déplacer la carte plus proche d'une ville, ou utiliser le bouton "Cadastre Dep".`)};
        citycode = (geocodingResult.features[0].properties.citycode);
        mapsUrl = `https://www.monterritoire.fr/${citycode}?lat=${c[1]}&lng=${c[0]}&zoom=${c[2]}`;
        window.open(mapsUrl,'_self'); //}
    });}*/
const detect_MonTerritoireVille =()=> {
    let t = window.location.href.split("?MFRcadvil")[1];
    let c = JSON.parse(t);
    fetch(`https://api-adresse.data.gouv.fr/reverse/?lon=${c[0]}&lat=${c[1]}`)
        .then(resp => resp.json())
        .then((geocodingResult) => {
        if (geocodingResult.features[0] === undefined){ var s=''; if (window.getSelection){ s = window.getSelection();} else if (document.getSelection){ s= document.getSelection();} else if (document.selection){ s = document.selection.createRange().text;}
        if(s==''){s=prompt("Le code INSEE de la ville n'a pas été détecté.\n\nIl faut déplacer la carte plus proche d'une ville, ou utiliser le bouton \"Cadastre Dep\".\nOu écrire le n° du code INSEE ou n° du département ci-dessous.\n\nOu clic \"OK\" pour accéder à la carte du Géoportail Code INSEE.");}
        if((s!='')&&(s!=null)){window.open(`https://www.monterritoire.fr/${s}?lat=${c[1]}&lng=${c[0]}&zoom=${c[2]}`,'_self');}
        if((s=='')&&(s!=null)) {window.open(`https://www.geoportail.gouv.fr/carte?c=${c[0]},${c[1]}&z=${c[2]}&l0=ORTHOIMAGERY.ORTHOPHOTOS::GEOPORTAIL:OGC:WMTS(1)&l1=LIMITES_ADMINISTRATIVES_EXPRESS.LATEST::GEOPORTAIL:OGC:WMTS(1)&l2=STATISTICALUNITS.IRIS::GEOPORTAIL:OGC:WMS(1)&permalink=yes`,'_self');}
        if (s==null){window.close();}}
         citycode = (geocodingResult.features[0].properties.citycode);
        mapsUrl = `https://www.monterritoire.fr/${citycode}?lat=${c[1]}&lng=${c[0]}&zoom=${c[2]}`;
        window.open(mapsUrl,'_self');
    });};

const detect_MonTerritoireDep =()=> {
    let t = window.location.href.split("?MFRcaddep")[1];
    let c = JSON.parse(t);
    fetch(`https://nominatim.openstreetmap.org/reverse?format=geojson&lon=${c[0]}&lat=${c[1]}&zoom=${c[2]}`)
        .then(resp => resp.json())
        .then((data) => {
        postcode = (data.features[0].properties.address.postcode.slice(0, 2));
        mapsUrl = `https://www.monterritoire.fr/${postcode}?lat=${c[1]}&lng=${c[0]}&zoom=${c[2]}`;
        window.open(mapsUrl,'_self');
    });};

const detect_AdresseRue =()=> {
    let t = window.location.href.split("?MFRaddrue")[1];
    let c = JSON.parse(t);
    fetch(`https://api-adresse.data.gouv.fr/reverse/?lon=${c[0]}&lat=${c[1]}`)
        .then(resp => resp.json())
        .then((geocodingResult) => {
        //if (geocodingResult.features[0] === undefined) { alert(`Le code postal de la ville n'a pas été détecté.\rIl faut déplacer la carte plus proche d'une ville.`);}
        if (geocodingResult.features[0] === undefined) { var s=''; if (window.getSelection){ s = window.getSelection();} else if (document.getSelection){ s= document.getSelection();} else if (document.selection){ s = document.selection.createRange().text;}
        if(s==''){s=prompt("La ville et le n° du département n'ont pas été détectés.\n\nIl faut déplacer la carte plus proche d'une ville.\nOu écrire le nom de la ville et le n° du département ci-dessous.\nFormalisme:  saint-augustin-77\n\nOu clic \"OK\" pour accéder à la carte du Géoportail ayant les infos.");}
        if((s!='')&&(s!=null)){window.open(`https://www.annuaire-mairie.fr/rue-${s.replace(/[A-Za-z]/g).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[\u0020|\u0027|\u002c]/g, '-')}.html`,'_self');} // (/[\u0030-\u0039][\u0030-\u0039][\u0030-\u0039]?[\u0030-\u0039]?[\u0030-\u0039]?/g).slice(0,2)
        if((s=='')&&(s!=null)) {window.open(`https://www.geoportail.gouv.fr/carte?c=${c[0]},${c[1]}&z=${c[2]}&l0=ORTHOIMAGERY.ORTHOPHOTOS::GEOPORTAIL:OGC:WMTS(1)&l1=LIMITES_ADMINISTRATIVES_EXPRESS.LATEST::GEOPORTAIL:OGC:WMTS(1)&l2=STATISTICALUNITS.IRIS::GEOPORTAIL:OGC:WMS(1)&permalink=yes`,'_self');}
        if (s==null){window.close();}}
        city = (geocodingResult.features[0].properties.city);
        postcode = (geocodingResult.features[0].properties.postcode.slice(0, 2));
        mapsUrl = `https://www.annuaire-mairie.fr/rue-${city}-${postcode}.html`;
        window.open(mapsUrl,'_self');
    });};

const detect_AdresseMairie =()=> {
    let t = window.location.href.split("?MFRaddmairie")[1];
    let c = JSON.parse(t);
    fetch(`https://api-adresse.data.gouv.fr/reverse/?lon=${c[0]}&lat=${c[1]}`)
        .then(resp => resp.json())
        .then((geocodingResult) => {
        if (geocodingResult.features[0] === undefined) { var s=''; if (window.getSelection){ s = window.getSelection();} else if (document.getSelection){ s= document.getSelection();} else if (document.selection){ s = document.selection.createRange().text;}
        if(s==''){s=prompt("La ville et le n° du département n'ont pas été détectés.\n\nIl faut déplacer la carte plus proche d'une ville.\nOu écrire le nom de la ville et le n° du département ci-dessous.\nExemple:  saint-augustin-77\n\nOu clic \"OK\" pour accéder à la carte du Géoportail ayant les infos.");}
        if((s!='')&&(s!=null)){window.open(`https://www.annuaire-mairie.fr/?q=${s.replace(/[A-Za-z]/g).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[\u0020|\u0027|\u002c]/g, '-')}&sa=Rechercher&cx=1&cof=2&ie=UTF-8`,'_self');}
        if((s=='')&&(s!=null)) {window.open(`https://www.geoportail.gouv.fr/carte?c=${c[0]},${c[1]}&z=${c[2]}&l0=ORTHOIMAGERY.ORTHOPHOTOS::GEOPORTAIL:OGC:WMTS(1)&l1=LIMITES_ADMINISTRATIVES_EXPRESS.LATEST::GEOPORTAIL:OGC:WMTS(1)&l2=STATISTICALUNITS.IRIS::GEOPORTAIL:OGC:WMS(1)&permalink=yes`,'_self');}
        if (s==null){window.close();}}
        city = (geocodingResult.features[0].properties.city);
        postcode = (geocodingResult.features[0].properties.postcode.slice(0, 2));
        mapsUrl = `https://www.annuaire-mairie.fr/?q=${city}-${postcode}&sa=Rechercher&cx=1&cof=2&ie=UTF-8`;
        window.open(mapsUrl,'_self');
    });};

const detect_ServicePublic =()=> {
    let t = window.location.href.split("?MFRservpub")[1];
    let c = JSON.parse(t);
    fetch(`https://api-adresse.data.gouv.fr/reverse/?lon=${c[0]}&lat=${c[1]}`)
        .then(resp => resp.json())
        .then((geocodingResult) => {
        //if (geocodingResult.features[0] === undefined) { alert(`Le code postal de la ville n'a pas été détecté.\rIl faut déplacer la carte plus proche d'une ville.`);}
        if (geocodingResult.features[0] === undefined) { var s=''; if (window.getSelection){ s = window.getSelection();} else if (document.getSelection){ s= document.getSelection();} else if (document.selection){ s = document.selection.createRange().text;}
        if(s==''){s=prompt("Le Code Postal et n° du département n'ont pas été détectés.\n\nIl faut déplacer la carte plus proche d'une ville.\nOu écrire le nom de le code postal et le n° du département ci-dessous.\nFormalisme:  77515+saint-augustin\n\nOu clic \"OK\" pour accéder à la carte de La Poste ayant les infos.");}
        if((s!='')&&(s!=null)){window.open(`https://lannuaire.service-public.fr/recherche?whoWhat=&where=${s.replace(/[A-Za-z]/g).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[\u0020|\u0027|\u002c]/g, '-')}&sa=Rechercher&cx=1&cof=2&ie=UTF-8`,'_self');}
        if((s=='')&&(s!=null)) {window.open(`https://localiser.laposte.fr/?q=${c[1]},${c[0]}`,'_self');}
        if (s==null){window.close();}}
        postcode = (geocodingResult.features[0].properties.postcode);
        city = (geocodingResult.features[0].properties.city);
        mapsUrl = `https://lannuaire.service-public.fr/recherche?whoWhat=&where=${postcode}+${city}`;
        window.open(mapsUrl,'_self');
    });};

const detect_GouvRue =()=> {
    let t = window.location.href.split("?MFRgouvrue")[1];
    let c = JSON.parse(t);
    fetch(`https://api-adresse.data.gouv.fr/reverse/?lon=${c[0]}&lat=${c[1]}`)
        .then(resp => resp.json())
        .then((geocodingResult) => {
        if (geocodingResult.features[0] === undefined) { var s=''; if (window.getSelection){ s = window.getSelection();} else if (document.getSelection){ s= document.getSelection();} else if (document.selection){ s = document.selection.createRange().text;}
        if(s==''){s=prompt("Le Code INSEE n'a pas été détecté.\n\nIl faut déplacer la carte plus proche d'une ville.\nOu écrire le code INSEE ci-dessous.\n\nOu clic \"OK\" pour accéder à la carte du Géoportail ayant les infos.");}
        if((s!='')&&(s!=null)){window.open(`https://adresse.data.gouv.fr/base-adresse-nationale/${s}#${c[2]}/${c[1]}/${c[0]}`,'_self');}
        if((s=='')&&(s!=null)) {window.open(`https://www.geoportail.gouv.fr/carte?c=${c[0]},${c[1]}&z=${c[2]}&l0=ORTHOIMAGERY.ORTHOPHOTOS::GEOPORTAIL:OGC:WMTS(1)&l1=STATISTICALUNITS.IRIS::GEOPORTAIL:OGC:WMS(1)&l2=LIMITES_ADMINISTRATIVES_EXPRESS.LATEST::GEOPORTAIL:OGC:WMTS(1)&permalink=yes`,'_self');}
        if (s==null){window.close();}}
        citycode = (geocodingResult.features[0].properties.citycode);
        mapsUrl = `https://adresse.data.gouv.fr/base-adresse-nationale/${citycode}#${c[2]}/${c[1]}/${c[0]}`;
        window.open(mapsUrl,'_self');
    });};
    
/*const detect_MappyStreet =()=> {
    let t = window.location.href.split("?MFRmappystr")[1];
    let c = JSON.parse(t);
    fetch(`https://nominatim.openstreetmap.org/reverse?format=geojson&lon=${c[0]}&lat=${c[1]}&zoom=${c[2]}`)
        .then(resp => resp.json())
        .then((data) => {
        bbox = (data.features[0].bbox);
        //var bbox = W.map.getExtent().toBBOX();
        mapsUrl = `https://fr.mappy.com/plan#/recherche/categorie/commerce?bbox=${bbox}`;
        window.open(mapsUrl,'_self');
    });};*/

const detect_LaPoste =()=> {
    let t = window.location.href.split("?MFRlaposte")[1];
    let c = JSON.parse(t);
    fetch(`https://nominatim.openstreetmap.org/reverse?format=geojson&lon=${c[0]}&lat=${c[1]}&zoom=${c[2]}`)
        .then(resp => resp.json())
        .then((data) => {
        //village = (data.features[0].properties.address.village);
        city = (data.features[0].properties.address.city);
        //town = (data.features[0].properties.address.town)
        //country_code = (data.features[0].properties.address.country_code)
        //if (village === undefined) { ville = city} else { ville = village};
        //if (city === undefined) { city = town};
        if (data.features[0].properties.address.city === undefined) { var s=''; if (window.getSelection){ s = window.getSelection();} else if (document.getSelection){ s= document.getSelection();} else if (document.selection){ s = document.selection.createRange().text;}
        if(s==''){s=prompt("La ville n'a pas été détectée.\n\nIl faut déplacer la carte plus proche d'une ville.\nOu écrire le nom de la ville ci-dessous.\n\nOu clic \"OK\" pour accéder à la carte de La Poste ayant les infos.");}
        if((s!='')&&(s!=null)){window.open(`https://localiser.laposte.fr/?q=${s}`,'_self');}
        if((s=='')&&(s!=null)) {window.open(`https://localiser.laposte.fr/?q=${c[1]},${c[0]}`,'_self');}
        if (s==null){window.close();}}
        city = city.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        //country_code = country_code.toUpperCase()
        mapsUrl = `https://localiser.laposte.fr/?q=${city}&jesuis=professionnel`;
        window.open(mapsUrl,'_self');
    });};

const detect_ChargeMap =()=> {
    let t = window.location.href.split("?MFRchargemap")[1];
    let c = JSON.parse(t);
    fetch(`https://nominatim.openstreetmap.org/reverse?format=geojson&lon=${c[0]}&lat=${c[1]}&zoom=${c[2]}`)
        .then(resp => resp.json())
        .then((data) => {
        village = (data.features[0].properties.address.village);
        city = (data.features[0].properties.address.city);
        town = (data.features[0].properties.address.town);
        country_code = (data.features[0].properties.address.country_code);
        if (city === undefined) { city = town;}
        if (village === undefined) { ville = city;} else { ville = village;}
        ville = ville.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[\u0027]/g, '-'); // Minuscule et sans accent.
        country_code = country_code.toUpperCase();
        mapsUrl = `https://fr.chargemap.com/cities/${ville}-${country_code}`;
        window.open(mapsUrl,'_self');
    });};

const detect_Wiiiz =()=> {
    let t = window.location.href.split("?MFRwiiiz")[1];
    let c = JSON.parse(t);
    fetch(`https://nominatim.openstreetmap.org/reverse?format=geojson&lon=${c[0]}&lat=${c[1]}&zoom=${c[2]}`)
        .then(resp => resp.json())
        .then((data) => {
        village = (data.features[0].properties.address.village);
        city = (data.features[0].properties.address.city);
        town = (data.features[0].properties.address.town);
        //country_code = (data.features[0].properties.address.country_code);
        if (city === undefined) { city = town;}
        if (village === undefined) { ville = city;} else { ville = village;}
        ville = ville.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''); // Minuscule et sans accent.
        //country_code = country_code.toUpperCase();
        mapsUrl = `https://wiiiz.fr/portal/#/search?address=${ville}&lat=${c[1]}&lng=${c[0]}&type=neighborhood`;
        window.open(mapsUrl,'_self');
    });};

const detect_Electromaps =()=> {
    let t = window.location.href.split("?MFRelect")[1];
    let c = JSON.parse(t);
    fetch(`https://nominatim.openstreetmap.org/reverse?format=geojson&lon=${c[0]}&lat=${c[1]}&zoom=${c[2]}&accept-language=us`)
        .then(resp => resp.json())
        .then((data) => {
        village = (data.features[0].properties.address.village);
        city = (data.features[0].properties.address.city);
        county = (data.features[0].properties.address.county.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f|\u0027]/g, '')); // Minuscule et sans accent et pas d'apostrophe
        town = (data.features[0].properties.address.town);
        country = (data.features[0].properties.address.country.toLowerCase());
        if (city === undefined) { city = town;}
        if (village === undefined) { ville = city;} else { ville = village;}
        ville = ville.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f|\u0027]/g, ''); // Minuscule et sans accent et pas d'apostrophe
        mapsUrl = `https://www.electromaps.com/fr/stations-de-recharge/${country}/${county}/${ville}/`;
        window.open(mapsUrl,'_self');
    });};

const detect_Izivia =()=> {
    let t = window.location.href.split("?MFRizivia")[1];
    let c = JSON.parse(t);
    fetch(`https://nominatim.openstreetmap.org/reverse?format=geojson&lon=${c[0]}&lat=${c[1]}&zoom=${c[2]}&accept-language=us`)
        .then(resp => resp.json())
        .then((data) => {
        village = (data.features[0].properties.address.village);
        city = (data.features[0].properties.address.city);
        //county = (data.features[0].properties.address.county.toLowerCase());
        town = (data.features[0].properties.address.town);
        //country = (data.features[0].properties.address.country.toLowerCase());
        if (city === undefined) { city = town;}
        if (village === undefined) { ville = city;} else { ville = village;}
        ville = ville.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''); // Minuscule et sans accent.
        mapsUrl = `https://izivia.com/carte-bornes-electriques-izivia/bornes-de-recharge-${ville}`;
        window.open(mapsUrl,'_self');
    });};


// Test

/*const detect_VilleRue =()=> {
    let t = window.location.href.split("?MFRvillerue")[1];
    let c = JSON.parse(t);
    fetch(`https://nominatim.openstreetmap.org/reverse?format=geojson&lon=${c[0]}&lat=${c[1]}&zoom=${c[2]}`)
        .then(resp => resp.json())
        .then((data) => {
        village = (data.features[0].properties.address.village);
        city = (data.features[0].properties.address.city);
        town = (data.features[0].properties.address.town);
        //state_district = (data.features[0].properties.address.state_district);
        //country_code = (data.features[0].properties.address.country_code);
        if (city === undefined) { city = town};
        if (village === undefined) { ville = city} else { ville = village};
        ville = ville.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[\u0020|\u0027]/g, '-'); // Minuscule et sans accent.
       // country_code = country_code.toUpperCase();
        mapsUrl = `https://rues.openalfa.fr/${ville}`;
        window.open(mapsUrl,'_self');
    });}*/

const detect_VilleRue =()=> {
    let t = window.location.href.split("?MFRvillerue")[1];
    let c = JSON.parse(t);
    fetch(`https://api-adresse.data.gouv.fr/reverse/?lon=${c[0]}&lat=${c[1]}`)
        .then(resp => resp.json())
        .then((geocodingResult) => {
        if (geocodingResult.features[0] === undefined) { var s=''; if (window.getSelection){ s = window.getSelection();} else if (document.getSelection){ s= document.getSelection();} else if (document.selection){ s = document.selection.createRange().text;}
        if(s==''){s=prompt("La ville n'a pas été détectée.\n\nIl faut déplacer la carte plus proche d'une ville.\nOu écrire le nom de la ville selon le formalisme ci-dessous.\nExemple: pontivy\n\nOu clic \"OK\" pour accéder à la carte du Géoportail ayant les infos.");}
        if((s!='')&&(s!=null)){window.open(`https://rues.openalfa.fr/${s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[\u0020|\u0027]/g, '-')}_${s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[\u0020|\u0027]/g, '-')}`,'_self');}
        if((s=='')&&(s!=null)) {window.open(`https://www.geoportail.gouv.fr/carte?c=${c[0]},${c[1]}&z=${c[2]}&l0=ORTHOIMAGERY.ORTHOPHOTOS::GEOPORTAIL:OGC:WMTS(1)&l1=STATISTICALUNITS.IRIS::GEOPORTAIL:OGC:WMS(1)&l2=LIMITES_ADMINISTRATIVES_EXPRESS.LATEST::GEOPORTAIL:OGC:WMTS(1)&permalink=yes`,'_self');}
        if (s==null){window.close();}}
        city = (geocodingResult.features[0].properties.city.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[\u0020|\u0027]/g, '-'));
        window.open(`https://rues.openalfa.fr/${city}_${city}`,'_self');
        oldcity = (geocodingResult.features[0].properties.oldcity.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[\u0020|\u0027]/g, '-'));
        if (geocodingResult.features[0].properties.city !== geocodingResult.features[0].properties.oldcity) { window.open(`https://rues.openalfa.fr/${oldcity}_${city}`,'_self');}
        if (geocodingResult.features[0].properties.city && geocodingResult.features[0].properties.oldcity === undefined) { window.open(`https://rues.openalfa.fr/${oldcity}_${oldcity}`,'_self');}
        //if (geocodingResult.features[0].properties.city !== geocodingResult.features[0].properties.oldcity) { window.open(`https://rues.openalfa.fr/${oldcity}_${oldcity}`,'_self');}
    });};

const detect_VilleRu =()=> {
    let t = window.location.href.split("?MFRvilleru")[1];
    let c = JSON.parse(t);
    fetch(`https://api-adresse.data.gouv.fr/reverse/?lon=${c[0]}&lat=${c[1]}`)
        .then(resp => resp.json())
        .then((geocodingResult) => {
        //if (geocodingResult.features[0] === undefined) { alert(`Le code postal de la ville n'a pas été détecté.\rIl faut déplacer la carte plus proche d'une ville.`);}
        if (geocodingResult.features[0] === undefined) { var s=''; if (window.getSelection){ s = window.getSelection();} else if (document.getSelection){ s= document.getSelection();} else if (document.selection){ s = document.selection.createRange().text;}
        if(s==''){s=prompt("La ville n'a pas été détectée.\n\nIl faut déplacer la carte plus proche d'une ville.\nOu écrire le nom de la ville selon le formalisme ci-dessous.\nExemple: pontivy_pontivy\n\nOu clic \"OK\" pour accéder à la carte du Géoportail ayant les infos.");}
        if((s!='')&&(s!=null)){window.open(`https://rues.openalfa.fr/${s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[\u0020|\u0027]/g, '-')}`,'_self');}
        if((s=='')&&(s!=null)) {window.open(`https://www.geoportail.gouv.fr/carte?c=${c[0]},${c[1]}&z=${c[2]}&l0=ORTHOIMAGERY.ORTHOPHOTOS::GEOPORTAIL:OGC:WMTS(1)&l1=LIMITES_ADMINISTRATIVES_EXPRESS.LATEST::GEOPORTAIL:OGC:WMTS(1)&l2=STATISTICALUNITS.IRIS::GEOPORTAIL:OGC:WMS(1)&permalink=yes`,'_self');}
        if (s==null){window.close();}}
        city = (geocodingResult.features[0].properties.city.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[\u0020|\u0027]/g, '-'));
        mapsUrl = `https://rues.openalfa.fr/${city}_${city}`;
        window.open(mapsUrl,'_self');
    });};

const detect_InseCog =()=> {
    let t = window.location.href.split("?MFRinsecog")[1];
    let c = JSON.parse(t);
    fetch(`https://api-adresse.data.gouv.fr/reverse/?lon=${c[0]}&lat=${c[1]}`)
        .then(resp => resp.json())
        .then((geocodingResult) => {
        if (geocodingResult.features[0] === undefined) { var s=''; if (window.getSelection){ s = window.getSelection();} else if (document.getSelection){ s= document.getSelection();} else if (document.selection){ s = document.selection.createRange().text;}
        if(s==''){s=prompt("Le code INSEE et la ville n'ont pas été détectés.\n\nIl faut déplacer la carte plus proche d'une ville.\nOu écrire le code INSEE et la ville selon le formalisme ci-dessous:\n 56178-Pontivy\n\nClic \"OK\" pour accéder à la carte du Géoportail ayant les infos.\n\nClic \"Annuler\" pour quitter cette page");}
        if((s=='')&&(s!=null)) {window.open(`https://www.geoportail.gouv.fr/carte?c=${c[0]},${c[1]}&z=${c[2]}&l0=ORTHOIMAGERY.ORTHOPHOTOS::GEOPORTAIL:OGC:WMTS(1)&l1=STATISTICALUNITS.IRIS::GEOPORTAIL:OGC:WMS(1)&l2=LIMITES_ADMINISTRATIVES_EXPRESS.LATEST::GEOPORTAIL:OGC:WMTS(1)&permalink=yes`,'_self');}
        if (s==null){window.close();}}
        city = (geocodingResult.features[0].properties.city);
        oldcity = (geocodingResult.features[0].properties.oldcity);
        citycode = (geocodingResult.features[0].properties.citycode);
        oldcitycode = (geocodingResult.features[0].properties.oldcitycode);
        if ((oldcitycode !== undefined) && (oldcitycode === citycode) && (oldcity !== city)) { window.open(`https://www.insee.fr/fr/statistiques/2011101?geo=COM-${oldcitycode}-${oldcity}_(${city})`,'_self');} //alert('ligne 1');}/*-- 1  Naizin  */
        if ((oldcitycode !== undefined) && (oldcitycode !== citycode) && oldcity){ window.open(`https://www.insee.fr/fr/statistiques/2011101?geo=COM-${oldcitycode}-${oldcity}_(${city})`,'_self');} //alert('ligne 2');}/*------------ 2  Remungol   */
        if ((oldcitycode !== undefined) && (oldcitycode !== citycode) && (oldcity === city)) { window.open(`https://www.insee.fr/fr/statistiques/2011101?geo=COM-${oldcitycode}-${oldcity}_(${city})`,'_self'); alert('ligne 3 - Donner le permalien WME et ce n° de ligne, à laurenthembprd');}/*-- 3     */
        if ((oldcitycode !== undefined) && (oldcitycode === citycode) && (oldcity === city)){ window.open(`https://www.insee.fr/fr/statistiques/2011101?geo=COM-${citycode}-${city}`,'_self');} //alert('ligne 4');}/*------------------- 4  Plémet  */
       // if ((oldcitycode !== undefined) && (oldcitycode !== citycode) && (city)){ window.open(`https://www.insee.fr/fr/statistiques/2011101?geo=COM-${citycode}-${city}`,'_self');} //alert('ligne 5');}/*------------------------------- 5     */
        if ((oldcitycode === undefined) && citycode && city) { window.open(`https://www.insee.fr/fr/statistiques/2011101?geo=COM-${citycode}-${city}`,'_self');} //alert('ligne 6');}/*---------------------------------------------- 6  Pontivy  */
    });};

const detect_InseeCog =()=> {
    let t = window.location.href.split("?MFRinseecog")[1];
    let c = JSON.parse(t);
    fetch(`https://api-adresse.data.gouv.fr/reverse/?lon=${c[0]}&lat=${c[1]}`)
        .then(resp => resp.json())
        .then((geocodingResult) => {
        if (geocodingResult.features[0] === undefined) { var s=''; if (window.getSelection){ s = window.getSelection();} else if (document.getSelection){ s= document.getSelection();} else if (document.selection){ s = document.selection.createRange().text;}
        if(s==''){s=prompt("Le code INSEE et la ville n'ont pas été détectés.\n\nIl faut déplacer la carte plus proche d'une ville.\nOu écrire le code INSEE et la ville selon le formalisme ci-dessous:\n 56178-Pontivy\n\nOu clic \"OK\" pour accéder à la carte du Géoportail ayant les infos.");}
        if((s=='')&&(s!=null)) {window.open(`https://www.geoportail.gouv.fr/carte?c=${c[0]},${c[1]}&z=${c[2]}&l0=ORTHOIMAGERY.ORTHOPHOTOS::GEOPORTAIL:OGC:WMTS(1)&l1=STATISTICALUNITS.IRIS::GEOPORTAIL:OGC:WMS(1)&l2=LIMITES_ADMINISTRATIVES_EXPRESS.LATEST::GEOPORTAIL:OGC:WMTS(1)&permalink=yes`,'_self');}
        if (s==null){window.close();}}
        citycode = (geocodingResult.features[0].properties.citycode);
        city = (geocodingResult.features[0].properties.city);
        //mapsUrl = `https://www.insee.fr/fr/metadonnees/cog/commune/COM${citycode}-${city}`; // Minuscule et sans accent.
        mapsUrl = `https://www.insee.fr/fr/statistiques/2011101?geo=COM-${citycode}-${city}`;
        window.open(mapsUrl,'_self');
    });};

const detect_ChaNomCom =()=> {
    let t = window.location.href.split("?MFRchanomcom")[1];
    let c = JSON.parse(t);
    fetch(`https://api-adresse.data.gouv.fr/reverse/?lon=${c[0]}&lat=${c[1]}`)
        .then(resp => resp.json())
        .then((geocodingResult) => {
        if (geocodingResult.features[0] === undefined) { var s=''; if (window.getSelection){ s = window.getSelection();} else if (document.getSelection){ s= document.getSelection();} else if (document.selection){ s = document.selection.createRange().text;}
        if(s==''){s=prompt("Le n° du département n'a pas été détecté.\n\nIl faut déplacer la carte plus proche d'une ville.\nOu écrire le n° du département\n\nOu clic \"OK\" pour accéder à la carte du Géoportail ayant les infos.");}
        if((s!='')&&(s!=null)){window.open(`https://www.insee.fr/fr/metadonnees/historique-commune?debut=0&modification=MB&departement=${s.slice(0, 2)}`,'_self');}
        if((s=='')&&(s!=null)) {window.open(`https://www.geoportail.gouv.fr/carte?c=${c[0]},${c[1]}&z=${c[2]}&l0=ORTHOIMAGERY.ORTHOPHOTOS::GEOPORTAIL:OGC:WMTS(1)&l1=LIMITES_ADMINISTRATIVES_EXPRESS.LATEST::GEOPORTAIL:OGC:WMTS(1)&l2=STATISTICALUNITS.IRIS::GEOPORTAIL:OGC:WMS(1)&permalink=yes`,'_self');}
        if (s==null){window.close();}}
        postcode = (geocodingResult.features[0].properties.postcode.slice(0, 2));
        mapsUrl = `https://www.insee.fr/fr/metadonnees/historique-commune?debut=0&modification=MB&departement=${postcode}`;
        window.open(mapsUrl,'_self');
    });};

const detect_CreaCom =()=> {
    let t = window.location.href.split("?MFRcreacom")[1];
    let c = JSON.parse(t);
    fetch(`https://api-adresse.data.gouv.fr/reverse/?lon=${c[0]}&lat=${c[1]}`)
        .then(resp => resp.json())
        .then((geocodingResult) => {
        if (geocodingResult.features[0] === undefined) { var s=''; if (window.getSelection){ s = window.getSelection();} else if (document.getSelection){ s= document.getSelection();} else if (document.selection){ s = document.selection.createRange().text;}
        if(s==''){s=prompt("Le n° du département n'a pas été détecté.\n\nIl faut déplacer la carte plus proche d'une ville.\nOu écrire le n° du département\n\nOu clic \"OK\" pour accéder à la carte du Géoportail ayant les infos.");}
        if((s!='')&&(s!=null)){window.open(`https://www.insee.fr/fr/metadonnees/historique-commune?debut=0&modification=MG&departement=${s.slice(0, 2)}`,'_self');}
        if((s=='')&&(s!=null)) {window.open(`https://www.geoportail.gouv.fr/carte?c=${c[0]},${c[1]}&z=${c[2]}&l0=ORTHOIMAGERY.ORTHOPHOTOS::GEOPORTAIL:OGC:WMTS(1)&l1=LIMITES_ADMINISTRATIVES_EXPRESS.LATEST::GEOPORTAIL:OGC:WMTS(1)&l2=STATISTICALUNITS.IRIS::GEOPORTAIL:OGC:WMS(1)&permalink=yes`,'_self');}
        if (s==null){window.close();}}
        //if((s=='')&&(s==null)) window.location.href.split("?MFRcreacom")[1].close; // https://www.google.fr/?MFRcreacom[-2.7768,48.04798,16]   [${c[0]},${c[1]},${c[2]}]
        postcode = (geocodingResult.features[0].properties.postcode.slice(0, 2));
        mapsUrl = `https://www.insee.fr/fr/metadonnees/historique-commune?debut=0&modification=MG&departement=${postcode}`;
        window.open(mapsUrl,'_self');
    });};

const detect_CadGouv =()=> {
    let t = window.location.href.split("?MFRcadgouv")[1];
    let c = JSON.parse(t);
    fetch(`https://nominatim.openstreetmap.org/reverse?format=geojson&lon=${c[0]}&lat=${c[1]}&zoom=${c[2]}`)
        .then(resp => resp.json())
        .then((data) => {
        if (data.features[0].properties.address.postcode === undefined) { alert(`\r\rLe code postal de la ville n'a pas été détecté.\rIl faut déplacer la carte plus proche d'une ville".`);}//mapsUrl = `https://www.cadastre.gouv.fr/`; window.open(mapsUrl,'_blank'); }
        village = (data.features[0].properties.address.village);
        city = (data.features[0].properties.address.city);
        town = (data.features[0].properties.address.town);
        postcode = (data.features[0].properties.address.postcode);
        road = (data.features[0].properties.address.road.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[\u0027]/g, /[\u0020]/g));
        if (city === undefined) { city = town;}
        if (village === undefined) { ville = city;} else { ville = village;}
        ville = ville.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[\u0027]/g, '-'); // Minuscule et sans accent.
        //country_code = country_code.toUpperCase();
        mapsUrl = `https://inspire.cadastre.gouv.fr/scpc/rechercherPlan.do?numeroVoie=&indiceRepetition=&nomVoie=${road}&lieuDit=&ville=${ville}&codePostal=${postcode}&codeDepartement=#`;
        window.open(mapsUrl,'_self');
    });};
/*const detect_CadGouv =()=> {
    let t = window.location.href.split("?MFRcadgouv")[1];
    let c = JSON.parse(t);
    fetch(`https://nominatim.openstreetmap.org/reverse?format=geojson&lon=${c[0]}&lat=${c[1]}&zoom=${c[2]}`)
        .then(resp => resp.json())
        .then((data) => {
        village = (data.features[0].properties.address.village);
        city = (data.features[0].properties.address.city);
        town = (data.features[0].properties.address.town);
        postcode = (data.features[0].properties.address.postcode);
        road = (data.features[0].properties.address.road.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[\u0027]/g, /[\u0020]/g));
        //road = road.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[\u0027]/g, /[\u0020]/g);
        //if (city === undefined) { city = town};
        if (village === undefined) { ville = city} else { ville = village};
        //if (village === undefined) { village = town};
        ville = ville.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[\u0027]/g, '-');// Minuscule et sans accent.
        mapsUrl = `https://inspire.cadastre.gouv.fr/scpc/rechercherPlan.do?numeroVoie=&indiceRepetition=&nomVoie=${road}&lieuDit=&ville=${ville}&codePostal=${postcode}&codeDepartement=#`;
        window.open(mapsUrl,'_self');
    });}*/
/*const detect_CadGouv =()=> {
    let t = window.location.href.split("?MFRcadgouv")[1];
    let c = JSON.parse(t);
    fetch(`https://api-adresse.data.gouv.fr/reverse/?lon=${c[0]}&lat=${c[1]}`)
        .then(resp => resp.json())
        .then((geocodingResult) => {
        if (geocodingResult.features[0] === undefined) { alert(`\r\rLe code postal de la ville n'a pas été détecté.\rIl faut déplacer la carte plus proche d'une ville".`)}
        street = (geocodingResult.features[0].properties.street.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''));
        if (street=== undefined) {street=''};
        locality = (geocodingResult.features[0].properties.locality.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''));
        if (locality=== undefined) {locality=''};
        city = (geocodingResult.features[0].properties.city.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''));
        postcode = (geocodingResult.features[0].properties.postcode);
         mapsUrl = `https://inspire.cadastre.gouv.fr/scpc/rechercherPlan.do?numeroVoie=&indiceRepetition=&nomVoie=${street}&lieuDit=${locality}&ville=${city}&codePostal=${postcode}&codeDepartement=#`;
        window.open(mapsUrl,'_self');
    });}*/

const detect_RadAuto =()=> {
    let t = window.location.href.split("?MFRradauto")[1];
    let c = JSON.parse(t);
    fetch(`https://nominatim.openstreetmap.org/reverse?format=geojson&lon=${c[0]}&lat=${c[1]}&zoom=${c[2]}`)
        .then(resp => resp.json())
        .then((data) => {
        village = (data.features[0].properties.address.village);
        city = (data.features[0].properties.address.city);
        town = (data.features[0].properties.address.town);
        county = (data.features[0].properties.address.county.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[\u0020|\u0027]/g, '-')); // Minuscule et sans accent.  ' remplacée par -
        if (city === undefined) { city = town;}
        if (village === undefined) { ville = city;} else { ville = village;}
        ville = ville.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[\u0020|\u0027]/g, '-'); // Minuscule et sans accent.  ' remplacée par -
        mapsUrl = `https://www.radars-auto.com/emplacements/${county}/${ville}/`;
        window.open(mapsUrl,'_self');
    });};

/*const detect_PomVil =()=> {
    let t = window.location.href.split("?MFRpomvil")[1];
    let c = JSON.parse(t);
    fetch(`https://nominatim.openstreetmap.org/reverse?format=geojson&lon=${c[0]}&lat=${c[1]}&zoom=${c[2]}`)
        .then(resp => resp.json())
        .then((data) => {
        village = (data.features[0].properties.address.village)
        city = (data.features[0].properties.address.city)
        town = (data.features[0].properties.address.town)
        county = (data.features[0].properties.address.county.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')) // Minuscule et sans accent.
        if (city === undefined) { city = town}
        if (village === undefined) { ville = city} else { ville = village}
        ville = ville.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Minuscule et sans accent.
        mapsUrl = `https://www.pompiercenter.com/recherche-pompier.php?term-category=pompier&term=${ville}`;
        window.open(mapsUrl,'_self');
     });}*/

const detect_PomVil =()=> {
    let t = window.location.href.split("?MFRpomvil")[1];
    let c = JSON.parse(t);
    fetch(`https://api-adresse.data.gouv.fr/reverse/?lon=${c[0]}&lat=${c[1]}`)
        .then(resp => resp.json())
        .then((geocodingResult) => {
        if (geocodingResult.features[0] === undefined) { var s=''; if (window.getSelection){ s = window.getSelection();} else if (document.getSelection){ s= document.getSelection();} else if (document.selection){ s = document.selection.createRange().text;}
        if(s==''){s=prompt("La ville n'a pas été détectée.\n\nIl faut déplacer la carte plus proche d'une ville.\nOu écrire le nom de la ville ci-dessous.\n\nOu clic \"OK\" pour accéder à la carte du Géoportail ayant les infos.");}
        if((s!='')&&(s!=null)){window.open(`https://www.pompiercenter.com/recherche-pompier.php?term-category=pompier&term=${s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[\u0020|\u0027]/g, '-')}`,'_self');}
        if((s=='')&&(s!=null)) {window.open(`https://www.geoportail.gouv.fr/carte?c=${c[0]},${c[1]}&z=${c[2]}&l0=ORTHOIMAGERY.ORTHOPHOTOS::GEOPORTAIL:OGC:WMTS(1)&l1=LIMITES_ADMINISTRATIVES_EXPRESS.LATEST::GEOPORTAIL:OGC:WMTS(1)&l2=STATISTICALUNITS.IRIS::GEOPORTAIL:OGC:WMS(1)&permalink=yes`,'_self');}
        if (s==null){window.close();}}
        city = (geocodingResult.features[0].properties.city.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''));
        mapsUrl = `https://www.pompiercenter.com/recherche-pompier.php?term-category=pompier&term=${city}`;
        window.open(mapsUrl,'_self');
    });};

const detect_PompVil =()=> {
    let t = window.location.href.split("?MFRpompvil")[1];
    let c = JSON.parse(t);
    fetch(`https://api-adresse.data.gouv.fr/reverse/?lon=${c[0]}&lat=${c[1]}`)
        .then(resp => resp.json())
        .then((geocodingResult) => {
        if (geocodingResult.features[0] === undefined) { var s=''; if (window.getSelection){ s = window.getSelection();} else if (document.getSelection){ s= document.getSelection();} else if (document.selection){ s = document.selection.createRange().text;}
        if(s==''){s=prompt("Le n° du département n'a pas été détecté.\n\nIl faut déplacer la carte plus proche d'une ville.\nOu écrire le n° du département ci-dessous.\n\nOu clic \"OK\" pour accéder à la carte du Géoportail ayant les infos.");}
        if((s!='')&&(s!=null)){window.open(`https://www.pompiercenter.com/annuaire-sdis/sdis-${s}-groupement-territoriaux.htm`,'_self');}
        if((s=='')&&(s!=null)) {window.open(`https://www.geoportail.gouv.fr/carte?c=${c[0]},${c[1]}&z=${c[2]}&l0=ORTHOIMAGERY.ORTHOPHOTOS::GEOPORTAIL:OGC:WMTS(1)&l1=LIMITES_ADMINISTRATIVES_EXPRESS.LATEST::GEOPORTAIL:OGC:WMTS(1)&l2=STATISTICALUNITS.IRIS::GEOPORTAIL:OGC:WMS(1)&permalink=yes`,'_self');}
        if (s==null){window.close();}}
        citycode = (geocodingResult.features[0].properties.citycode.slice(0, 2));
        mapsUrl = `https://www.pompiercenter.com/annuaire-sdis/sdis-${citycode}-groupement-territoriaux.htm`;
        window.open(mapsUrl,'_self');
        });};

const detect_FranceServices =()=> {
    let t = window.location.href.split("?MFRfranceservices")[1];
    let c = JSON.parse(t);
    fetch(`https://nominatim.openstreetmap.org/reverse?format=geojson&lon=${c[0]}&lat=${c[1]}&zoom=${c[2]}`)
        .then(resp => resp.json())
        .then((data) => {
          village = (data.features[0].properties.address.village);
        city = (data.features[0].properties.address.city);
        town = (data.features[0].properties.address.town);
        if (city === undefined) { city = town;}
          if (village === undefined) { ville = city;} else { ville = village;}
        postcode = (data.features[0].properties.address.postcode);
        mapsUrl = `https://www.france-services.gouv.fr/recherche?lat=${c[1]}&lon=${c[0]}&comune=${ville}&code_postal${postcode}`;
        window.open(mapsUrl,'_self');
    });};

const detect_BisFutPrev =()=> {
    let t = window.location.href.split("?MFRbisfutprev")[1];
    let c = JSON.parse(t);
    fetch(`https://api-adresse.data.gouv.fr/reverse/?lon=${c[0]}&lat=${c[1]}`)
        .then(resp => resp.json())
        .then((geocodingResult) => {
        //if (geocodingResult.features[0] === undefined) { alert(`Le code postal de la ville n'a pas été détecté.\rIl faut déplacer la carte plus proche d'une ville".`);}
        if (geocodingResult.features[0] === undefined) { var s=''; if (window.getSelection){ s = window.getSelection();} else if (document.getSelection){ s= document.getSelection();} else if (document.selection){ s = document.selection.createRange().text;}
        if(s==''){s=prompt("Le n° du département n'a pas été détecté.\n\nIl faut déplacer la carte plus proche d'une ville.\nOu écrire le n° du département ci-dessous.\n\nOu clic \"OK\" pour accéder à la carte du Géoportail ayant les infos.");}
        if((s!='')&&(s!=null)){window.open(`https://tipi.bison-fute.gouv.fr/bison-fute-ouvert/publicationsDIR/Evenementiel-DIR/cnir/RecapChantiersPrevi.html#${s}`,'_self');}
        if((s=='')&&(s!=null)) {window.open(`https://www.geoportail.gouv.fr/carte?c=${c[0]},${c[1]}&z=${c[2]}&l0=ORTHOIMAGERY.ORTHOPHOTOS::GEOPORTAIL:OGC:WMTS(1)&l1=LIMITES_ADMINISTRATIVES_EXPRESS.LATEST::GEOPORTAIL:OGC:WMTS(1)&l2=STATISTICALUNITS.IRIS::GEOPORTAIL:OGC:WMS(1)&permalink=yes`,'_self');}
        if (s==null){window.close();}}
        citycode = (geocodingResult.features[0].properties.citycode.slice(0, 2));
        mapsUrl = `https://tipi.bison-fute.gouv.fr/bison-fute-ouvert/publicationsDIR/Evenementiel-DIR/cnir/RecapChantiersPrevi.html#${citycode}`;
        window.open(mapsUrl,'_self');
    });};

const detect_BisFutCour =()=> {
    let t = window.location.href.split("?MFRbisfutcour")[1];
    let c = JSON.parse(t);
    fetch(`https://api-adresse.data.gouv.fr/reverse/?lon=${c[0]}&lat=${c[1]}`)
        .then(resp => resp.json())
        .then((geocodingResult) => {
        //if (geocodingResult.features[0] === undefined) { alert(`Le code postal de la ville n'a pas été détecté.\rIl faut déplacer la carte plus proche d'une ville".`);}
        if (geocodingResult.features[0] === undefined) { var s=''; if (window.getSelection){ s = window.getSelection();} else if (document.getSelection){ s= document.getSelection();} else if (document.selection){ s = document.selection.createRange().text;}
        if(s==''){s=prompt("Le n° du département n'a pas été détecté.\n\nIl faut déplacer la carte plus proche d'une ville.\nOu écrire le n° du département ci-dessous.\n\nOu clic \"OK\" pour accéder à la carte du Géoportail ayant les infos.");}
        if((s!='')&&(s!=null)){window.open(`https://tipi.bison-fute.gouv.fr/bison-fute-ouvert/publicationsDIR/Evenementiel-DIR/cnir/RecapChantiersEnCours.html#${s}`,'_self');}
        if((s=='')&&(s!=null)) {window.open(`https://www.geoportail.gouv.fr/carte?c=${c[0]},${c[1]}&z=${c[2]}&l0=ORTHOIMAGERY.ORTHOPHOTOS::GEOPORTAIL:OGC:WMTS(1)&l1=LIMITES_ADMINISTRATIVES_EXPRESS.LATEST::GEOPORTAIL:OGC:WMTS(1)&l2=STATISTICALUNITS.IRIS::GEOPORTAIL:OGC:WMS(1)&permalink=yes`,'_self');}
        if (s==null){window.close();}}
        citycode = (geocodingResult.features[0].properties.citycode.slice(0, 2));
        mapsUrl = `https://tipi.bison-fute.gouv.fr/bison-fute-ouvert/publicationsDIR/Evenementiel-DIR/cnir/RecapChantiersEnCours.html#${citycode}`;
        window.open(mapsUrl,'_self');
    });};

const detect_AnEnt =()=> {
    let t = window.location.href.split("?MFRanent")[1];
    let c = JSON.parse(t);
    fetch(`https://api-adresse.data.gouv.fr/reverse/?lon=${c[0]}&lat=${c[1]}`)
        .then(resp => resp.json())
        .then((geocodingResult) => {
        if (geocodingResult.features[0] === undefined) { mapsUrl = `https://annuaire-entreprises.data.gouv.fr/rechercher?`; /*window.open(mapsUrl,'_self');*/}
        //if (geocodingResult.features[0] === undefined) { var s=''; if (window.getSelection){ s = window.getSelection();} else if (document.getSelection){ s= document.getSelection();} else if (document.selection){ s = document.selection.createRange().text;}
        //if(s==''){s=prompt("Le n° du département n'a pas été détecté.\n\nIl faut déplacer la carte plus proche d'une ville.\nOu écrire le n° du département ci-dessous.\n\nOu clic \"OK\" pour accéder à la carte du Géoportail ayant les infos.");}
        //if((s!='')&&(s!=null)){window.open(`https://tipi.bison-fute.gouv.fr/bison-fute-ouvert/publicationsDIR/Evenementiel-DIR/cnir/RecapChantiersEnCours.html#${s}`,'_self');}
        //if((s=='')&&(s!=null)) {window.open(`https://www.geoportail.gouv.fr/carte?c=${c[0]},${c[1]}&z=${c[2]}&l0=ORTHOIMAGERY.ORTHOPHOTOS::GEOPORTAIL:OGC:WMTS(1)&l1=LIMITES_ADMINISTRATIVES_EXPRESS.LATEST::GEOPORTAIL:OGC:WMTS(1)&l2=STATISTICALUNITS.IRIS::GEOPORTAIL:OGC:WMS(1)&permalink=yes`,'_self');}
        //if (s==null){window.close()};}
        citycode = (geocodingResult.features[0].properties.citycode);
        city = (geocodingResult.features[0].properties.city);
        postcode = (geocodingResult.features[0].properties.postcode);
        mapsUrl = `https://annuaire-entreprises.data.gouv.fr/rechercher?terme=&cp_dep_label=${city}+%28${postcode}%29&cp_dep_type=insee&cp_dep=${citycode}&fn=&n=&dmin=&dmax=&type=&label=&etat=&sap=&naf=&nature_juridique=&tranche_effectif_salarie=&categorie_entreprise=`;
        window.open(mapsUrl,'_self');
    });};

const detect_Clocher =()=> {
    let t = window.location.href.split("?MFRclocher")[1];
    let c = JSON.parse(t);
    fetch(`https://api-adresse.data.gouv.fr/reverse/?lon=${c[0]}&lat=${c[1]}`)
        .then(resp => resp.json())
        .then((geocodingResult) => {
        if (geocodingResult.features[0] === undefined)/*(postcode||citycode === undefined)*/ { var s=''; if (window.getSelection){ s = window.getSelection();} else if (document.getSelection){ s= document.getSelection();} else if (document.selection){ s = document.selection.createRange().text;}
        if(s==''){s=prompt("Le code INSEE n'a pas été détecté.\n\nIl faut déplacer la carte plus proche d'une ville.\nOu écrire le code INSEE de la ville.\n\nOu clic \"OK\" pour accéder à la carte du Géoportail ayant les infos.");}
        if((s!='')&&(s!=null)){window.open(`https://clochers.org/Fichiers_HTML/Accueil/Accueil_clochers/${s.slice(0, 2)}/accueil_${s}.htm`,'_self');}
        if((s=='')&&(s!=null)) {window.open(`https://www.geoportail.gouv.fr/carte?c=${c[0]},${c[1]}&z=${c[2]}&l0=ORTHOIMAGERY.ORTHOPHOTOS::GEOPORTAIL:OGC:WMTS(1)&l1=LIMITES_ADMINISTRATIVES_EXPRESS.LATEST::GEOPORTAIL:OGC:WMTS(1)&l2=STATISTICALUNITS.IRIS::GEOPORTAIL:OGC:WMS(1)&permalink=yes`,'_self');}
        if (s==null){window.close();}}
        postcode = (geocodingResult.features[0].properties.postcode.slice(0, 2));
        citycode = (geocodingResult.features[0].properties.citycode);
        window.open(`https://clochers.org/Fichiers_HTML/Accueil/Accueil_clochers/${postcode}/accueil_${citycode}.htm`,'_self');
    });};

const detect_Clochers =()=> {
    let t = window.location.href.split("?MFRclochers")[1];
    let c = JSON.parse(t);
    fetch(`https://api-adresse.data.gouv.fr/reverse/?lon=${c[0]}&lat=${c[1]}`)
        .then(resp => resp.json())
        .then((geocodingResult) => {
        if (geocodingResult.features[0] === undefined)/*(postcode||citycode||oldcitycode === undefined)*/ { var s=''; if (window.getSelection){ s = window.getSelection();} else if (document.getSelection){ s= document.getSelection();} else if (document.selection){ s = document.selection.createRange().text;}
        if(s==''){s=prompt("Le code INSEE n'a pas été détecté.\n\nIl faut déplacer la carte plus proche d'une ville.\nOu écrire le code INSEE de la ville.\n\nOu clic \"OK\" pour accéder à la carte du Géoportail ayant les infos.");}
        if((s!='')&&(s!=null)){window.open(`https://clochers.org/Fichiers_HTML/Accueil/Accueil_clochers/${s.slice(0, 2)}/accueil_${s}.htm`,'_self');}
        if((s=='')&&(s!=null)) {window.open(`https://www.geoportail.gouv.fr/carte?c=${c[0]},${c[1]}&z=${c[2]}&l0=ORTHOIMAGERY.ORTHOPHOTOS::GEOPORTAIL:OGC:WMTS(1)&l1=LIMITES_ADMINISTRATIVES_EXPRESS.LATEST::GEOPORTAIL:OGC:WMTS(1)&l2=STATISTICALUNITS.IRIS::GEOPORTAIL:OGC:WMS(1)&permalink=yes`,'_self');}
        if (s==null){window.close();}}
        postcode = (geocodingResult.features[0].properties.postcode.slice(0, 2));
        citycode = (geocodingResult.features[0].properties.citycode);
        oldcitycode = (geocodingResult.features[0].properties.oldcitycode);
        window.open(`https://clochers.org/Fichiers_HTML/Accueil/Accueil_clochers/${postcode}/accueil_${oldcitycode}.htm`,'_self');
        if (geocodingResult.features[0].properties.oldcitycode === geocodingResult.features[0].properties.citycode) { window.open(`https://clochers.org/Fichiers_HTML/Accueil/Accueil_clochers/${postcode}/accueil_${oldcitycode}_-anc.htm`,'_self');}
        if (geocodingResult.features[0].properties.oldcitycode === undefined) { window.open(`https://clochers.org/Fichiers_HTML/Accueil/Accueil_clochers/${postcode}/accueil_${citycode}.htm`,'_self');}
    });};


const detect_GoogleVil =()=> {
    let t = window.location.href.split("?MFRgooglevil")[1];
    let c = JSON.parse(t);
    fetch(`https://api-adresse.data.gouv.fr/reverse/?lon=${c[0]}&lat=${c[1]}`)
        .then(resp => resp.json())
        .then((geocodingResult) => {
        if (geocodingResult.features[0] === undefined) { var s=''; if (window.getSelection){ s = window.getSelection();} else if (document.getSelection){ s= document.getSelection();} else if (document.selection){ s = document.selection.createRange().text;}
        if(s==''){s=prompt("La ville n'a pas été détectée.\n\nIl faut déplacer la carte plus proche d'une ville.\nOu écrire le nom de la ville ci-dessous.\n\nOu clic \"OK\" pour accéder à la carte du Géoportail ayant les infos.");}
        if((s!='')&&(s!=null)){window.open(`https://www.google.fr/maps/place/${s}/@${c[1]},${c[0]},${c[2]}z/data=!3m1!1e3`,'_self');}
        if((s=='')&&(s!=null)) {window.open(`https://www.geoportail.gouv.fr/carte?c=${c[0]},${c[1]}&z=${c[2]}&l0=ORTHOIMAGERY.ORTHOPHOTOS::GEOPORTAIL:OGC:WMTS(1)&l1=LIMITES_ADMINISTRATIVES_EXPRESS.LATEST::GEOPORTAIL:OGC:WMTS(1)&l2=STATISTICALUNITS.IRIS::GEOPORTAIL:OGC:WMS(1)&permalink=yes`,'_self');}
        if (s==null){window.close();}}
        postcode = (geocodingResult.features[0].properties.postcode);
        city = (geocodingResult.features[0].properties.city.replace(/[\u0020]/g, '-'));
        if (geocodingResult.features[0].properties.oldcity === undefined){window.open(`https://www.google.com/maps/place/${postcode}+${city}/@${c[1]},${c[0]},${c[2]}z/data=!3m1!1e3`,'_self');}
        oldcity = (geocodingResult.features[0].properties.oldcity.replace(/[\u0020]/g, '-'));
        window.open(`https://www.google.fr/maps/place/${oldcity},+${postcode}+${city}/@${c[1]},${c[0]},${c[2]}z/data=!3m1!1e3`,'_self');
    });};

const detect_GooglVille =()=> {
    let t = window.location.href.split("?MFRgooglville")[1];
    let c = JSON.parse(t);
    fetch(`https://api-adresse.data.gouv.fr/reverse/?lon=${c[0]}&lat=${c[1]}`)
        .then(resp => resp.json())
        .then((geocodingResult) => {
        if (geocodingResult.features[0] === undefined) { var s=''; if (window.getSelection){ s = window.getSelection();} else if (document.getSelection){ s= document.getSelection();} else if (document.selection){ s = document.selection.createRange().text;}
        if(s==''){s=prompt("La ville n'a pas été détectée.\n\nIl faut déplacer la carte plus proche d'une ville.\nOu écrire le nom de la ville ci-dessous.\n\nOu clic \"OK\" pour accéder à la carte du Géoportail ayant les infos.");}
        if((s!='')&&(s!=null)){window.open(`https://www.google.fr/maps/place/${s}/@${c[1]},${c[0]},${c[2]}z/data=!3m1!1e3`,'_self');}
        if((s=='')&&(s!=null)) {window.open(`https://www.geoportail.gouv.fr/carte?c=${c[0]},${c[1]}&z=${c[2]}&l0=ORTHOIMAGERY.ORTHOPHOTOS::GEOPORTAIL:OGC:WMTS(1)&l1=LIMITES_ADMINISTRATIVES_EXPRESS.LATEST::GEOPORTAIL:OGC:WMTS(1)&l2=STATISTICALUNITS.IRIS::GEOPORTAIL:OGC:WMS(1)&permalink=yes`,'_self');}
        if (s==null){window.close();}}
        city = (geocodingResult.features[0].properties.city.replace(/[\u0020]/g, '-'));
        postcode = (geocodingResult.features[0].properties.postcode);
        window.open(`https://www.google.fr/maps/place/${postcode}+${city}/@${c[1]},${c[0]},${c[2]}z/data=!3m1!1e3`,'_self');
    });};

const detect_EducNat =()=> {
    let t = window.location.href.split("?MFReducnat")[1];
    let c = JSON.parse(t);
    fetch(`https://api-adresse.data.gouv.fr/reverse/?lon=${c[0]}&lat=${c[1]}`)
        .then(resp => resp.json())
        .then((geocodingResult) => {
        if (geocodingResult.features[0] === undefined) {var s=''; if (window.getSelection){ s = window.getSelection();} else if (document.getSelection){ s= document.getSelection();} else if (document.selection){ s = document.selection.createRange().text;}
        if (s==''){s=prompt("Le nom de la ville et son code INSEE n'ont pas été détectés.\n\nIl faut déplacer la carte plus proche d'une ville.\nOu écrire le nom officiel la ville en respectant la casse ou son code INSEE ci-dessous.\n\nOu clic \"OK\" pour choisir entre la carte avec la simple géolocation, ou la carte du Géoportail avec les infos.");}
        var re = /(\b[a-zé](?!\s))/g;
        if ((s!='')&&(s!=null)&&(/\D/.test(s))){window.open(`https://data.education.gouv.fr/explore/dataset/fr-en-annuaire-education/map/?disjunctive.type_etablissement&disjunctive.code_postal&disjunctive.nom_commune&disjunctive.code_departement&disjunctive.appartenance_education_prioritaire&disjunctive.libelle_academie&disjunctive.libelle_region&disjunctive.ministere_tutelle&refine.nom_commune=${s.replace(re, function(x){return x.charAt(0).toUpperCase() + x.slice(1);})}&location=${c[2]},${c[1]},${c[0]}&basemap=47b3ca`,'_self');}
        if ((s!='')&&(s!=null)&&(/\d/.test(s))){window.open(`https://data.education.gouv.fr/explore/dataset/fr-en-annuaire-education/map/?disjunctive.type_etablissement&disjunctive.code_postal&disjunctive.nom_commune&disjunctive.code_departement&disjunctive.appartenance_education_prioritaire&disjunctive.libelle_academie&disjunctive.libelle_region&disjunctive.ministere_tutelle&refine.code_commune=${s}&location=${c[2]},${c[1]},${c[0]}&basemap=47b3ca`,'_self');}
            if ((s=='')&&(s!=null)) {s=prompt("\n\nClic \"OK\" pour accéder à la carte avec la simple géolocation.\n\nOu écrire\" géo \" pour accéder à la carte du Géoportail avec les infos");
            if ((s=='')&&(s!=null)) {window.open(`https://data.education.gouv.fr/explore/dataset/fr-en-annuaire-education/map/?disjunctive.type_etablissement&disjunctive.code_postal&disjunctive.nom_commune&disjunctive.code_departement&disjunctive.appartenance_education_prioritaire&disjunctive.libelle_academie&disjunctive.libelle_region&disjunctive.ministere_tutelle&location=${c[2]},${c[1]},${c[0]}&basemap=47b3ca`,'_self');}
            if ((s!=null)&&((/g[eé]o/gi).test(s))) {window.open(`https://www.geoportail.gouv.fr/carte?c=${c[0]},${c[1]}&z=${c[2]}&l0=ORTHOIMAGERY.ORTHOPHOTOS::GEOPORTAIL:OGC:WMTS(1)&l1=STATISTICALUNITS.IRIS::GEOPORTAIL:OGC:WMS(1)&l2=LIMITES_ADMINISTRATIVES_EXPRESS.LATEST::GEOPORTAIL:OGC:WMTS(1)&permalink=yes`,'_self');}}
        if (s==null){window.close();}}
        citycode = (geocodingResult.features[0].properties.citycode);
        city = (geocodingResult.features[0].properties.city);
        //postcode = (geocodingResult.features[0].properties.postcode);
        //mapsUrl = `https://data.education.gouv.fr/explore/dataset/fr-en-annuaire-education/map/?disjunctive.type_etablissement&disjunctive.code_postal&disjunctive.nom_commune&disjunctive.code_departement&disjunctive.appartenance_education_prioritaire&disjunctive.libelle_academie&disjunctive.libelle_region&disjunctive.ministere_tutelle&location=${c[2]},${c[1]},${c[0]}&basemap=jawg.streets`
        mapsUrl = `https://data.education.gouv.fr/explore/dataset/fr-en-annuaire-education/map/?disjunctive.type_etablissement&disjunctive.code_postal&disjunctive.nom_commune&disjunctive.code_departement&disjunctive.appartenance_education_prioritaire&disjunctive.libelle_academie&disjunctive.libelle_region&disjunctive.ministere_tutelle&refine.code_commune=${citycode}&refine.nom_commune=${city}&location=${c[2]},${c[1]},${c[0]}&basemap=47b3ca`;
        window.open(mapsUrl,'_self');
    });};

const detect_EducaNat =()=> {
    let t = window.location.href.split("?MFReducanat")[1];
    let c = JSON.parse(t);
    fetch(`https://api-adresse.data.gouv.fr/reverse/?lon=${c[0]}&lat=${c[1]}`)
        .then(resp => resp.json())
        .then((geocodingResult) => {
        if (geocodingResult.features[0] === undefined) {var s=''; if (window.getSelection){ s = window.getSelection();} else if (document.getSelection){ s= document.getSelection();} else if (document.selection){ s = document.selection.createRange().text;}
        if(s==''){s=prompt("\u2000\u2000\u2000\u2000\u2000\u2000\u2000Le n° et le nom du département n'ont pas été détectés.\n\nIl faut déplacer la carte plus proche d'une ville.\nOu écrire le n° du département ou le nom officiel de la commune en respectant la casse, ci-dessous.\n\nOu clic \"OK\" pour accéder à la carte juste avec la géolocation.");}
        var re = /(\b[a-zé](?!\s))/g;
        if((s!='')&&(s!=null)&&(/\D/.test(s))){window.open(`https://data.education.gouv.fr/explore/dataset/fr-en-data-es-base-de-donnees/map/?refine.dep_nom=${s.replace(function(x){return x.charAt(0).toUpperCase() + x.slice(1);}).replace(/[\u0020]/g, '-')}&location=${c[2]},${c[1]},${c[0]}&basemap=jawg.streets`,'_self');}
        if((s!='')&&(s!=null)&&(/\d/.test(s))){window.open(`https://data.education.gouv.fr/explore/dataset/fr-en-data-es-base-de-donnees/map/?q=${s}&location=${c[2]},${c[1]},${c[0]}&basemap=47b3ca`,'_self');}
        if((s=='')&&(s!=null)) {window.open(`https://data.education.gouv.fr/explore/dataset/fr-en-data-es-base-de-donnees/map/?location=${c[2]},${c[1]},${c[0]}&basemap=47b3ca`,'_self');}
        if (s==null){window.close();}}
        citycode = (geocodingResult.features[0].properties.citycode.slice(0,2));
        //postcode = (geocodingResult.features[0].properties.postcode);
        //window.open(`https://www.google.fr/maps/place/${postcode}+${city}/@${c[1]},${c[0]},${c[2]}z/data=!3m1!1e3`,'_self');
        //mapsUrl = `https://data.education.gouv.fr/explore/dataset/fr-en-data-es-base-de-donnees/map/?location=${c[2]},${c[1]},${c[0]}&basemap=jawg.streets`;
        mapsUrl = `https://data.education.gouv.fr/explore/dataset/fr-en-data-es-base-de-donnees/map/?refine.dep_code_filled=${citycode}&location=${c[2]},${c[1]},${c[0]}&basemap=47b3ca`;
        window.open(mapsUrl,'_self');
    });};
// https://data.education.gouv.fr/explore/dataset/fr-en-data-es-base-de-donnees/map/?refine.dep_code_filled=988&refine.dep_nom=Nouvelle-Cal%C3%A9donie&location=7,-21.19722,166.16821&basemap=jawg.streets
// https://data.education.gouv.fr/explore/dataset/fr-en-data-es-base-de-donnees/map/?refine.dep_code_filled=56&refine.dep_nom=Morbihan&location=9,47.7504,-2.82074&basemap=jawg.streets



if (document.getElementById('user-info') == null) {
		setTimeout(add_buttons, 500);
		console.log('user-info element not yet available, page still loading');
		return
	}
	if (!W.loginManager.user) {
		W.loginManager.events.register('login', null, add_buttons);
		W.loginManager.events.register('loginStatus', null, add_buttons);
		// Double check as event might have triggered already
		if (!W.loginManager.user) {
			return
		}
    }
    // CSS INJECTION
(()=> {
    let mapsCss =
        `

         #Apple {
              background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="14" height="14" fill="currentColor" viewBox="0 0 16 16" opacity=".569" style="margin-bottom: -2px"> <g> <path d="M11.182.008C11.148-.03 9.923.023 8.857 1.18c-1.066 1.156-.902 2.482-.878 2.516.024.034 1.52.087 2.475-1.258.955-1.345.762-2.391.728-2.43Zm3.314 11.733c-.048-.096-2.325-1.234-2.113-3.422.212-2.189 1.675-2.789 1.698-2.854.023-.065-.597-.79-1.254-1.157a3.692 3.692 0 0 0-1.563-.434c-.108-.003-.483-.095-1.254.116-.508.139-1.653.589-1.968.607-.316.018-1.256-.522-2.267-.665-.647-.125-1.333.131-1.824.328-.49.196-1.422.754-2.074 2.237-.652 1.482-.311 3.83-.067 4.56.244.729.625 1.924 1.273 2.796.576.984 1.34 1.667 1.659 1.899.319.232 1.219.386 1.843.067.502-.308 1.408-.485 1.766-.472.357.013 1.061.154 1.782.539.571.197 1.111.115 1.652-.105.541-.221 1.324-1.059 2.238-2.758.347-.79.505-1.217.473-1.282Z"></path> <path d="M11.182.008C11.148-.03 9.923.023 8.857 1.18c-1.066 1.156-.902 2.482-.878 2.516.024.034 1.52.087 2.475-1.258.955-1.345.762-2.391.728-2.43Zm3.314 11.733c-.048-.096-2.325-1.234-2.113-3.422.212-2.189 1.675-2.789 1.698-2.854.023-.065-.597-.79-1.254-1.157a3.692 3.692 0 0 0-1.563-.434c-.108-.003-.483-.095-1.254.116-.508.139-1.653.589-1.968.607-.316.018-1.256-.522-2.267-.665-.647-.125-1.333.131-1.824.328-.49.196-1.422.754-2.074 2.237-.652 1.482-.311 3.83-.067 4.56.244.729.625 1.924 1.273 2.796.576.984 1.34 1.667 1.659 1.899.319.232 1.219.386 1.843.067.502-.308 1.408-.485 1.766-.472.357.013 1.061.154 1.782.539.571.197 1.111.115 1.652-.105.541-.221 1.324-1.059 2.238-2.758.347-.79.505-1.217.473-1.282Z"></path></g></svg>');
              background-repeat: no-repeat;
  	          background-position: left 15px bottom 4px;
           }

          .btnMaps {
              width: 95px;
              height: 24px;
              padding: 1px;
              font-size: 70%;
              border-radius: 6px;
              border: 1px solid #C4C4C4;
              background-color: #E7E7E7;
              font-family: "Arial Bold", Helvetica, sans-serif;
              font-weight: bold;
              -webkit-transform: scale(1);
              transform: scale(1);
              -webkit-transition: .5s ease-in-out;
              transition: .3s ease-in-out;
              position: relative;
              z-index: 1;
          }

          .btnMaps:hover {
              -webkit-transform: scale(1.1);
              transform: scale(1.15);
              z-index: 2;
          }

          .btnShape {
              width: 95px;
              height: 24px;
              padding: 1px;
              font-size: 70%;
              border-radius: 6px;
              border: 1px solid #C4C4C4;
              background-color: #E5413C;
              background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" viewBox="0 0 30 20" xml:space="preserve" height="10" width="20" ><g style= "fill= midnightblue" > <path d="M0 0 L0 20 L10 20 L10 0 Z" /></g> <g fill="white"><path d="M10 0 L10 20 L20 20 L20 0 Z" /></g> <g fill="red" ><path d="M20 0 L20 20 L30 20 L30 0 Z" /></g></svg>');
              background-repeat: no-repeat;
              background-position: left 10px bottom 5px;
              font-family: "Arial Bold", Helvetica, sans-serif;
              font-weight: bold;
              -webkit-transform: scale(1);
              transform: scale(1);
              -webkit-transition: .5s ease-in-out;
              transition: .3s ease-in-out;
              position: relative;
              z-index: 1;
          }

          .btnShape:hover {
              -webkit-transform: scale(1.1);
              transform: scale(1.15);
              z-index: 2;
          }


          .btnMapsIc {
              width: 80px;
              height: 35px;
              padding: 3px;
              border-radius: 6px;
              border: 1px solid #C4C4C4;
              background-color: #E7E7E7;
              -webkit-transform: scale(1);
              transform: scale(1);
              -webkit-transition: .3s ease-in-out;
              transition: .3s ease-in-out;
              position: relative;
              z-index: 1;
          }

          .btnMapsIc:hover {
              -webkit-transform: scale(1.1);
              transform: scale(1.15"); z-index: 2;
          }

          .btnMapsIce {
              width: 80px;
              height: 35px;
              padding: 1px;
              border-radius: 6px;
              border: 1px solid #C4C4C4;
              background-color: #E7E7E7;
              -webkit-transform: scale(1);
              transform: scale(1);
              -webkit-transition: .3s ease-in-out;
              transition: .3s ease-in-out;
              position: relative;
              z-index: 1;
          }

          .btnMapsIce:hover {
              -webkit-transform: scale(1.1);
              transform: scale(1.15"); z-index: 2;
          }


                  `;

    let style = document.createElement('style');
    style.type = 'text/css';
    (style.styleSheet) ? style.styleSheet.cssText = mapsCss : style.innerHTML = mapsCss; // IE or Other browsers

    document.getElementsByTagName("head")[0].appendChild( style );
})();


    let btn1 = $('<button class="btnMaps" title="clic => Google Maps sous-commune si présente,\rsinon ce sera Google Maps commune principale,\rCTRL+clic => Google Maps commune principale,\rShift+clic => Google Maps" style="background-color:#459BF7">Google</button>');
    btn1.click(()=>{
        let {lon, lat, zoom} = getGps(0);
        mapsUrl = `https://www.google.fr/?MFRgooglevil[${lon},${lat},${zoom}]`;
        if (event.ctrlKey) {mapsUrl = `https://www.google.fr/?MFRgooglville[${lon},${lat},${zoom}]`;}
        if (event.shiftKey) {mapsUrl = `https://www.google.fr/maps/@${lat},${lon},${zoom}z/data=!3m1!1e3`;}
        if (event.ctrlKey || event.shiftKey) {setTimeout(() => window.open(mapsUrl, '_blank')); } else { window.open(mapsUrl, '_blank');}
    });
    let btn2 = $('<button class="btnMaps" title="clic => Cartes Géoportail\rCTRL+clic => Vue aérienne 2024" style="background-color:#CBFA78" >Géoportail</button>');
    btn2.click(()=>{
        let {lon, lat, zoom} = getGps(0);
        setLayer = 'l0=ORTHOIMAGERY.ORTHOPHOTOS::GEOPORTAIL:OGC:WMTS(1)&l1=ORTHOIMAGERY.ORTHOPHOTOS.ORTHO-EXPRESS.2024::GEOPORTAIL:OGC:WMTS(1;h)&l2=STATISTICALUNITS.IRIS::GEOPORTAIL:OGC:WMS(1;h)&l3=LIMITES_ADMINISTRATIVES_EXPRESS.LATEST::GEOPORTAIL:OGC:WMTS(1)&l4=GEOGRAPHICALGRIDSYSTEMS.MAPS.BDUNI.J1::GEOPORTAIL:OGC:WMTS(1)&permalink=yes';
        mapsUrl = `https://www.geoportail.gouv.fr/carte?c=${lon},${lat}&z=${zoom}&${setLayer}`;
        if (event.ctrlKey || event.metaKey) {mapsUrl = `https://www.geoportail.gouv.fr/embed/visu.html?c=${lon},${lat}&z=${zoom}&l0=ORTHOIMAGERY.ORTHOPHOTOS.ORTHO-EXPRESS.2024::GEOPORTAIL:OGC:WMTS(1)&l1=LIMITES_ADMINISTRATIVES_EXPRESS.LATEST::GEOPORTAIL:OGC:WMTS(1)&permalink=yes`;}
        if (event.ctrlKey || event.metaKey) {setTimeout(() => window.open(mapsUrl, '_blank')); } else { window.open(mapsUrl, '_blank');}
    });
    let btn3 = $('<button class="btnMaps" title="clic => Base Adresse Nationale\nCTRL+clic => B A N > Rues de la ville" style="background-color:#E6E4FF">B A N</button>');
    btn3.click(()=>{
        let {lon, lat, zoom} = getGps(-1);
        mapsUrl = `https://adresse.data.gouv.fr/map#${zoom}/${lat}/${lon}`;
        if (event.ctrlKey || event.metaKey) {mapsUrl = `https://www.google.fr/?MFRgouvrue[${lon},${lat},${zoom}]`;}
        if (event.ctrlKey || event.metaKey) {setTimeout(() => window.open(mapsUrl, '_blank')); } else { window.open(mapsUrl, '_blank');}
    });
    let btn4 = $('<button class="btnMaps" title="Satellites Pro">SatellitesPro</button>');
    btn4.click(()=>{
        let {lon, lat, zoom} = getGps(0);
        mapsUrl = `https://satellites.pro/France_map#${lat},${lon},${zoom}`;
        window.open(mapsUrl,'_blank');
    });
    let btn5 = $('<button class="btnMaps" title="clic => OpenStreetMap .org\rCTRL+clic => OpenStreetMap FR">O S M +</button>');
    btn5.click(()=>{
        let {lon, lat, zoom} = getGps(0);
        mapsUrl = `http://www.openstreetmap.org/#map=${zoom}/${lat}/${lon}`;
        if (event.ctrlKey || event.metaKey) {mapsUrl = `https://layers.openstreetmap.fr/?zoom=${zoom}&lat=${lat}&lon=${lon}`;}
        if (event.ctrlKey || event.metaKey) {setTimeout(() => window.open(mapsUrl, '_blank')); } else { window.open(mapsUrl, '_blank');}
    });
    let btn6 = $('<button class="btnMaps" title="clic => Carte Via Michelin Trafic">Michelin</button>');
    btn6.click(()=>{
        let {lon, lat, zoom} = getGps(0);
        let tileBounds = new OpenLayers.Bounds(W.map.getExtent());
        tileBounds.extend(new OpenLayers.LonLat(lon, lat));
        mapsUrl = `https://www.viamichelin.fr/cartes-plans/trafic?bounds=${tileBounds.left}~${tileBounds.bottom}~${tileBounds.right}~${tileBounds.top}`;
        window.open(mapsUrl, '_blank');
    });
    let btn7 = $('<button class="btnMaps" title="Carte Here WeGo Satellite">Here WeGo</button>');
    btn7.click(()=>{
        let {lon, lat, zoom} = getGps(0);
        mapsUrl = `https://wego.here.com/?map=${lat},${lon},${zoom},satellite`;
        window.open(mapsUrl,'_blank');
    });
    let btn8 = $('<button class="btnMaps" title="clic => MapCrunch > Google Street View\rCTRL+clic => InstantStreetView">MapCrunch +</button>');
    btn8.click(()=>{
        let {lon, lat, zoom} = getGps(0);
        mapsUrl = `https://www.mapcrunch.com/p/${lat}_${lon}_144.89_15.95_-1`;
        if (event.ctrlKey) {mapsUrl = `https://www.instantstreetview.com/@${lat},${lon},301.14h,-5.08p,1z`; }
        if (event.ctrlKey) {setTimeout(() => window.open(mapsUrl, '_blank')); } else { window.open(mapsUrl, '_blank'); }
    });
    let btn9 = $('<button class="btnMaps" title="Mappy Commerces">Mappy</button>');
    btn9.click(()=>{
        let {lon, lat, zoom} = getGps(0);
        //var xmin,xmax,ymin,ymax;
        // mapsUrl = `https://www.google.fr/?MFRmappystr[${lon},${lat},${zoom}]`;
        let tileBounds = new OpenLayers.Bounds(W.map.getExtent());
        tileBounds.extend(new OpenLayers.LonLat(lon, lat));
        let tileCenters = get4326CenterPoint();
        mapsUrl = `https://fr.mappy.com/plan#/recherche/categorie/commerce?bbox=${tileBounds.left},${tileBounds.bottom},${tileBounds.right},${tileBounds.top}`;
        window.open(mapsUrl,'_blank');
    });
    let btn10 = $('<button class="btnMaps" title="Tomtom">Tomtom</button>');
    btn10.click(()=>{
        let {lon, lat, zoom} = getGps(-1);
        mapsUrl = `https://plan.tomtom.com/fr?p=${lat},${lon},${zoom}z`;
        //mapsUrl = `https://mydrive.tomtom.com/fr_fr/#mode=viewport+viewport=${lat},${lon},${zoom}`;
        window.open(mapsUrl,'_blank');
    });
    let btn11 = $('<button class="btnMaps" title="clic => Bing Cartes Satellite\nCTRL+clic => MSN Trafic\nSHIFT+clic => StreetSide">Bing +</button>');
    btn11.click(()=>{
        let {lon, lat, zoom} = getGps(0);
        mapsUrl = `https://www.bing.com/maps?cp=${lat}~${lon}&lvl=${zoom}&style=h`;
        if (event.ctrlKey || event.metaKey) {mapsUrl = `https://www.msn.com/fr-fr/traffic?locale=fr-fr&cp=${lat},%20${lon}&lvl=${zoom}`;}
        if (event.shiftKey) {mapsUrl = `https://www.bing.com/maps?cp=${lat}~${lon}&lvl=${zoom}&mo=om.1&style=x&pi=0&dir=0`;}
        if (event.ctrlKey || event.metaKey || event.shiftKey) {setTimeout(() => window.open(mapsUrl, '_blank')); } else { window.open(mapsUrl, '_blank'); }
    });
    let btn12 = $('<button class="btnMaps" title="clic => Mapbox Satellite,\rCTRL+clic Mapbox Street.">Mapbox Sat Str</button>');
    btn12.click(()=>{
        let {lon, lat, zoom} = getGps(-1);
        token = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA';
        mapsUrl = `https://api.mapbox.com/styles/v1/mapbox/`+((event.ctrlKey) ? `streets-v11` : `satellite-v9`)+`.html?title=true&access_token=${token}#${zoom}/${lat}/${lon}`;
        if (event.ctrlKey) {setTimeout(() => window.open(mapsUrl, '_blank')); } else { window.open(mapsUrl, '_blank'); }
    });
    let btn13 = $('<button class="btnMaps" title="clic => Mapillary\rCTRL+clic => OpenStreetCam\rSHIFT+clic => Mapilio\rALT+clic => Panoramax"style="background-color:#27cc35">Mapillary +</button>');
    btn13.click(()=>{
        let {lon, lat, zoom} = getGps(-1);
        mapsUrl = `https://www.mapillary.com/app/?lat=${lat}&lng=${lon}&z=${zoom}`;
        if (event.ctrlKey || event.metaKey) { mapsUrl = `https://kartaview.org/map/@${lat},${lon},${zoom}z`;}
        if (event.shiftKey) { mapsUrl = `https://mapilio.com/app?lat=${lat}&lng=${lon}&zoom=${zoom}`;}
        if (event.altKey) { mapsUrl = `https://panoramax.ign.fr/#background=streets&focus=map&map=${zoom}/${lat}/${lon}`;}
        if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) {setTimeout(() => window.open(mapsUrl, '_blank')); } else { window.open(mapsUrl, '_blank'); }
    });
    let btn14 = $('<button class="btnMaps" title="clic => Epsg Streets\rCTRL+clic => Epsg satellite">Epsg +</button>');
    btn14.click(()=>{
        let {lon, lat, zoom} = getGps(0);
        mapsUrl = `https://epsg.io/map#srs=4326&x=${lon}&y=${lat}&z=${zoom}&layer=streets`;
        if (event.ctrlKey || event.metaKey) { mapsUrl = `https://epsg.io/map#srs=4326&x=${lon}&y=${lat}&z=${zoom}&layer=satellite`;}
        if (event.ctrlKey || event.metaKey) {setTimeout(() => window.open(mapsUrl, '_blank')); } else { window.open(mapsUrl, '_blank'); }
    });
    let btn15 = $('<button class="btnMaps"; title="Map Compare" style="background-color:#e8dfc2">MapCompare</button>');
    btn15.click(()=>{
        let {lon, lat, zoom} = getGps(-1);
        setLayer = 'num=4&mt0=viamichelin-map&mt1=osmfr&mt2=google-satellite&mt3=mapy-base';
        mapsUrl = `https://mc.bbbike.org/mc/?lon=${lon}&lat=${lat}&zoom=${zoom}&${setLayer}`;
        window.open(mapsUrl,'_blank');
    });
    let btn16 = $('<button class="btnMaps" title="clic => Google Earth\rCTRL+clic => https://random.earth/" style="background-color:#74D0F1">GoogleEarth</button>');
    btn16.click(()=>{
        let {lon, lat, zoom} = getGps(0);
        var gz = GoogleEarthZoom(zoom);
        mapsUrl = `https://earth.google.com/web/@${lat},${lon},35.26224333a,${gz}d,35y,0h,29t,0r`;
        if (event.ctrlKey) { mapsUrl = `https://random.earth/@${lat},${lon},${zoom}z,2t`;}
        if (event.ctrlKey) {setTimeout(() => window.open(mapsUrl, '_blank')); } else { window.open(mapsUrl, '_blank'); }
    });

    let btn18 = $('<button class="btnMaps" title="Cadastre Ville"style="background-color:#E8B027">Cadastre Ville</button>');
    btn18.click(()=>{
        let {lon, lat, zoom} = getGps(0);
        mapsUrl = `https://www.google.fr/?MFRcadvil[${lon},${lat},${zoom}]`;
        window.open(mapsUrl,'_blank');
    });

    let btn18b = $('<button class="btnMaps" title="Cadastre Département"style="background-color:#E8D627">Cadastre Dep</button>');
    btn18b.click(()=>{
        let {lon, lat, zoom} = getGps(0);
        mapsUrl = `https://www.google.fr/?MFRcaddep[${lon},${lat},${zoom}]`;
        window.open(mapsUrl,'_blank');
    });

    let btn20 = $('<button class="btnMaps" title="Annuaire Mairies" style="background-color:#ffb6c1">Mairies</button>');
    btn20.click(()=>{
        let {lon, lat, zoom} = getGps(0);
        mapsUrl = `https://www.google.fr/?MFRaddmairie[${lon},${lat},${zoom}]`;
        window.open(mapsUrl,'_blank');
    });

    let btn21 = $('<button class="btnMaps" title="Annuaire Mairie - Rues" style="background-color:#F8E0F7">Rues</button>');
    btn21.click(()=>{
        let {lon, lat, zoom} = getGps(0);
        mapsUrl = `https://www.google.fr/?MFRaddrue[${lon},${lat},${zoom}]`;
        window.open(mapsUrl,'_blank');
    });

    let btn22 = $('<button class="btnMaps" title="Annuaire Service Public" style="background-color:#6A81FF">ServicePublic</button>');
    btn22.click(()=>{
        let {lon, lat, zoom} = getGps(0);
        mapsUrl = `https://www.google.fr/?MFRservpub[${lon},${lat},${zoom}]`;
        window.open(mapsUrl,'_blank');
    });

    let btn23 = $('<button class="btnMaps" id="Apple" alt="Apple Map" title="clic => Beta Apple Map\rCTRL+clic => Carte Apple Street View\rSHIFT+clic => Apple Street View direct au-dessus d\'un segment\rALT+clic => Apple de Duck Duck Go">&nbsp;Apple +</button>');
    btn23.click(()=>{
        let {lon, lat, zoom} = getGps(0);
        var gz = BetaAppleZoom(zoom);
        mapsUrl = `https://beta.maps.apple.com/?t=k&ll=${lat},${lon}&spn=${gz}`;
      //  mapsUrl = `https://duckduckgo.com/?q=${lat},${lon}&t=h_&iaxm=maps`;
        if (event.ctrlKey || event.metaKey) { mapsUrl = `https://lookmap.eu.pythonanywhere.com/#c=${zoom}/${lat}/${lon}`;}
        if (event.shiftKey) { mapsUrl = `https://lookmap.eu.pythonanywhere.com/#c=${zoom}/${lat}/${lon}&p=${lat}/${lon}&a=0.00/0.00`;}
        if (event.altKey) { mapsUrl = `https://duckduckgo.com/?q=${lat},${lon}&t=h_&iaxm=maps`;}
        if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) {setTimeout(() => window.open(mapsUrl, '_blank')); } else { window.open(mapsUrl, '_blank'); }
    });

    /*let btn24 = $('<button class="btnMaps" title="B A N - Rues" style="background-color:#F8E0F7">B A N  Rues</button>');
    btn24.click(()=>{
        let {lon, lat, zoom} = getGps(0);
        mapsUrl = `https://www.google.fr/?MFRgouvrue[${lon},${lat},${zoom}]`;
        window.open(mapsUrl,'_blank');
    });*/

    let btn25 = $('<button class="btnMaps" title="Cadastre Geobretagne" style="background-color:#FEFEE2">Geobretagne</button>');
    btn25.click(()=>{
        let {lon, lat, zoom} = getGps(0);
        var gz = geobretagneZoom(zoom);
        mapsUrl = `https://geobretagne.fr/mapfishapp/map/80f0b82cd897ed57f72012d5d0fde422?noheader&lon=${lon}&lat=${lat}&radius=${gz}`;
        window.open(mapsUrl,'_blank');
    });

    let btn30 = $('<input class="btnMapsIc" type="image" alt="La Poste" title="clic => carte La Poste \rCTRL+clic => carte La Poste OpenData\n\nShift+clic => Si ville détectée, accès aux codes INSEE et postal.\rAlt+clic => Code INSEE, code postal, commune,\rEntrer un de ces 3 paramètres pour connaître les autres." src="https://upload.wikimedia.org/wikipedia/fr/9/92/La_Poste_logo.png">');
    btn30.click(()=>{
        let {lon, lat, zoom} = getGps(0);
        mapsUrl = `https://localiser.laposte.fr/?q=${lat},${lon}&jesuis=professionnel`;
        let tileBounds = new OpenLayers.Bounds(W.map.getExtent());
        tileBounds.extend(new OpenLayers.LonLat(lon, lat));
        mapsUrl = `https://localiser.laposte.fr/?q=${lat},${lon}&jesuis=professionnel`;
        if (event.ctrlKey || event.metaKey) {mapsUrl = `https://datanova.laposte.fr/applications/liste-des-services-disponibles-en-bureaux-de-poste-agences-postales-et-relais-poste/full?_c_bbox=${tileBounds.left},${tileBounds.bottom},${tileBounds.right},${tileBounds.top}`;}
        if (event.shiftKey) {mapsUrl = `https://www.google.fr/?MFRlappost[${lon},${lat},${zoom}]`;}
        if (event.altKey) {var s=''; if (window.getSelection){ s = window.getSelection();} else if (document.getSelection){ s= document.getSelection();} else if (document.selection){ s = document.selection.createRange().text;}
        if (s==''){s = prompt("Pour connaître un code INSEE, un code postal, ou une commune,\n\nEntrer l'un de ces 3 paramètres.\n\nOu clic \"OK\" pour accéder à cette page web sans info.");}
        if ((s!='')&&(s!=null)) {mapsUrl=`https://datanova.laposte.fr/datasets/laposte-hexasmal/full?q=${s}`;}
        if ((s=='')&&(s!=null)) {mapsUrl=`https://datanova.laposte.fr/datasets/laposte-hexasmal/full?`;}
        if (s==null){window.close();}}
        if (event.ctrlKey || event.metaKey ||event.shiftKey || event.altKey) {setTimeout(() => window.open(mapsUrl, '_blank')); } else { window.open(mapsUrl, '_blank'); }
    });

    let btn35 = $('<input class="btnMapsIc" type="image" alt="Clochers\.org"  title="Clochers.org :\rclic => ancienne commune si présente,\rCTRL+clic => commune principale" src="https://www.zupimages.net/up/24/14/bd8m.png">');
    btn35.click(()=>{
        let {lon, lat, zoom} = getGps(0);
        mapsUrl = 'https://www.google.fr/?MFR'+((event.ctrlKey) ? 'clocher' : 'clochers')+`[${lon},${lat},${zoom}]`;
        if (event.ctrlKey) {setTimeout(() => window.open(mapsUrl, '_blank')); } else { window.open(mapsUrl, '_blank'); }
    });

    let btn31 = $('<input class="btnMapsIc" type="image" alt="Chargemap"  title="clic => Carte des bornes de recharge,\rCTRL+clic pour recherche par ville." src="https://fr.chargemap.com/client/chargemap/images/logo-light.svg">');
    btn31.click(()=>{
        let {lon, lat, zoom} = getGps(0);
        mapsUrl = `https://fr.chargemap.com/map/?lat=${lat}&lng=${lon}&zoom=${zoom}`;
        if (event.ctrlKey) { mapsUrl = `https://www.google.fr/?MFRchargemap[${lon},${lat},${zoom}]`;}
        if (event.ctrlKey) {setTimeout(() => window.open(mapsUrl, '_blank')); } else { window.open(mapsUrl, '_blank'); }
    });

    let btn32 = $('<input class="btnMapsIc" type="image" alt="Wiiiz"  title="Carte des bornes de recharge pour voitures électriques" src="https://wiiiz.fr/common/images/svg/logo-wiiiz.svg" >');
    btn32.click(()=>{
        let {lon, lat, zoom} = getGps(0);
        mapsUrl = `https://www.google.fr/?MFRwiiiz[${lon},${lat},${zoom}]`;
        window.open(mapsUrl,'_blank');
    });

    let btn33 = $('<input class="btnMapsIc" type="image" alt="Electromaps"  title="Carte des bornes de recharge pour voitures électriques" src="https://uploads-ssl.webflow.com/6278f767c8039e09089ab08c/62aae556d19e952671230c8b_horitzontal-logo.svg" >');
    btn33.click(()=>{
        let {lon, lat, zoom} = getGps(0);
        mapsUrl = `https://www.google.fr/?MFRelect[${lon},${lat},${zoom}]`;
        window.open(mapsUrl,'_blank');
    });

    let btn34 = $('<input class="btnMapsIc" type="image" alt="Izivia"  title="Carte des bornes de recharge pour voitures électriques" src="https://izivia.com/wp-content/uploads/2021/10/logo.png" >');
    btn34.click(()=>{
        let {lon, lat, zoom} = getGps(0);
        mapsUrl = `https://www.google.fr/?MFRizivia[${lon},${lat},${zoom}]`;
        window.open(mapsUrl,'_blank');
    });

    let btn26 = $('<button class="btnShape" title="https://rues.openalfa.fr données issues de OSM,\rclic => ancienne commune si présente,\rCTRL+clic => commune nouvelle" style="background-color:#FFFFFF"> &nbsp;Test rues</button>');
    btn26.click(()=>{
        let {lon, lat, zoom} = getGps(0);
        mapsUrl = 'https://www.google.fr/?MFR'+((event.ctrlKey) ? 'villeru' : 'villerue')+`[${lon},${lat},${zoom}]`;
        if (event.ctrlKey) {setTimeout(() => window.open(mapsUrl, '_blank')); } else { window.open(mapsUrl, '_blank'); }
    });

    let btn27 = $('<button class="btnMaps" title="clic => Prix des carburants,\rCTRL+clic => stations GNV" style="background-color:#F2FFCD">Prix 🚘⛽️</button>');
    btn27.click(()=>{
        let {lon, lat, zoom} = getGps(0);
        mapsUrl = `https://data.economie.gouv.fr/explore/dataset/prix-des-carburants-en-france-flux-instantane-v2/map/?location=${zoom},${lat},${lon}&basemap=jawg.streets`;
        if (event.ctrlKey) {mapsUrl = `https://data.opendatasoft.com/explore/dataset/stations-gnv%40reseaux-energies-rte/map/?disjunctive.statut&disjunctive.exploitant&disjunctive.commune&disjunctive.departement&disjunctive.nom_region&disjunctive.carburant&disjunctive.paiement&disjunctive.acces_pl&location=13,45.15263,0.75814&basemap=jawg.streets${zoom},${lat},${lon}&basemap=jawg.streets`; }
        if (event.ctrlKey) {setTimeout(() => window.open(mapsUrl, '_blank')); } else { window.open(mapsUrl, '_blank'); }
    });

    let btn36 = $('<button class="btnMaps" title="Code INSEE de la commune\nclic => Ancienne commune (et ancien code) si présente\nCTRL+clic => Commune actuelle" style="background-color:#E5413C">INSEE Cog</button>');
    btn36.click(()=>{
        let {lon, lat, zoom} = getGps(0);
        //mapsUrl = `https://www.google.fr/?MFRinseecog[${lon},${lat},${zoom}]`;
        mapsUrl = 'https://www.google.fr/?MFR'+((event.ctrlKey) ? 'inseecog' : 'insecog')+`[${lon},${lat},${zoom}]`;
        if (event.ctrlKey) {setTimeout(() => window.open(mapsUrl, '_blank')); } else { window.open(mapsUrl, '_blank'); }
    });

    let btn37 = $('<button class="btnMaps" title="INSEE - Tous les changements de nom de commune, \rCTRL+clic => créations communes nouvelles." style="background-color:#E5413C">INSEE Modifications</button>');
    btn37.click(()=>{
        let {lon, lat, zoom} = getGps(0);
        mapsUrl = 'https://www.google.fr/?MFR'+((event.ctrlKey) ? 'chanomcom' : 'creacom')+`[${lon},${lat},${zoom}]`;
        if (event.ctrlKey) {setTimeout(() => window.open(mapsUrl, '_blank')); } else { window.open(mapsUrl, '_blank'); }
    });

/*    let btn38 = $('<button class="btnMaps" title="Bison Futé - Travaux en cours,\nCTRL+clic => Travaux Pévisionnels" style="background-color:#ffca00">Bison Futé</button>');
    btn38.click(()=>{
        let {lon, lat, zoom} = getGps(0);
        mapsUrl = 'https://www.google.fr/?MFR'+((event.ctrlKey) ? 'bisfutprev' : 'bisfutcour')+`[${lon},${lat},${zoom}]`;
        if (event.ctrlKey) {setTimeout(() => window.open(mapsUrl, '_blank')); } else { window.open(mapsUrl, '_blank'); }
    });*/

    let btn39 = $('<button class="btnMaps" title="https://www.cadastre.gouv.fr/ " style="background-color:#fae902">Cadastre Gouv.fr</button>');
    btn39.click(()=>{
        let {lon, lat, zoom} = getGps(0);
        mapsUrl = `https://www.google.fr/?MFRcadgouv[${lon},${lat},${zoom}]`;
        window.open(mapsUrl,'_blank');
    });

    let btn40 = $('<input class="btnMapsIc" type="image" alt="radars-auto\.com"  title="https://radars-auto.com\r\rclic => Emplacement des radars routiers\rCTRL+clic carte des radars Lufop\rSHIFT+clic => Carte des radars OpenData" src="https://www.radars-auto.com/images/pictos/blog/.cat-general_sq.jpg" >');
    btn40.click(()=>{
        let {lon, lat, zoom} = getGps(0);
        let tileBounds = new OpenLayers.Bounds(W.map.getExtent());
        tileBounds.extend(new OpenLayers.LonLat(lon, lat));
        mapsUrl = `https://www.google.fr/?MFRradauto[${lon},${lat},${zoom}]`;
        if (event.ctrlKey || event.metaKey) { mapsUrl = `https://lufop.net/MAP/?point=off&q=${lat},${lon}&pays=FR&lang=fr#`;}
        if (event.shiftKey) { mapsUrl = `https://opendata.koumoul.com/applications/carte-des-radars-fixes-en-france/full?_c_bbox=${tileBounds.left},${tileBounds.bottom},${tileBounds.right},${tileBounds.top}`;}
        if (event.ctrlKey || event.metaKey || event.shiftKey) {setTimeout(() => window.open(mapsUrl, '_blank')); } else { window.open(mapsUrl, '_blank'); }
    });

    /*let btn41 = $('<input class="btnMapsIc" type="image" alt="pompiers center"  title="Annuaire des pompiers" src="https://www.pompiercenter.com/charte/header/logo-pompiercenter.png" >');
    btn41.click(()=>{
        let {lon, lat, zoom} = getGps(0);
        mapsUrl = `https://www.google.fr/?MFRpompvil[${lon},${lat},${zoom}]`;
        //window.open(mapsUrl,'_blank');
        if (event.ctrlKey || event.metaKey) {
        //let {lon, lat, zoom} = getGps(0);
        mapsUrl = `https://www.google.fr/?MFRpomvil[${lon},${lat},${zoom}]`};
        window.open(mapsUrl,'_blank');
    });*/
    let btn41 = $('<input class="btnMapsIc" type="image" alt="pompiers center"  title="Annuaire des pompiers par département,\rou CTRL+clic pour recherche par mot clé (ville)." src="https://www.pompiercenter.com/charte/header/logo-pompiercenter.png" >');
     btn41.click(()=>{
        let {lon, lat, zoom} = getGps(0);
        mapsUrl = 'https://www.google.fr/?MFR'+((event.ctrlKey) ? 'pomvil' : 'pompvil')+`[${lon},${lat},${zoom}]`;
        if (event.ctrlKey) {setTimeout(() => window.open(mapsUrl, '_blank')); } else { window.open(mapsUrl, '_blank'); }
    });

    let btn42 = $('<button class="btnMaps" title="clic => Annuaire France Services\rCTRL+clic => carte.">France Services</button>');
    btn42.click(()=>{
        let {lon, lat, zoom} = getGps(0);
        var gz = FranceServiceZoom(zoom);
        mapsUrl = `https://www.google.fr/?MFRfranceservices[${lon},${lat},${zoom}]`;
        //let cz = getCenterZoom();
        /*var center = new OpenLayers.LonLat(W.map.getCenter().lon,W.map.getCenter().lat);
        var projTo = new OpenLayers.Projection("EPSG:4326");
        var projFrom = new OpenLayers.Projection("EPSG:900913");
        var cproj = center.transform(projFrom, projTo);*/
        if (event.ctrlKey || event.metaKey) { mapsUrl = `https://anct-carto.github.io/france_services/?lat=${lat}&lng=${lon}&z=${zoom}&qtype=address&qlatlng=${lat}%2C${lon}&qlabel=&qr=${gz}`;}
        if (event.ctrlKey || event.metaKey) {setTimeout(() => window.open(mapsUrl, '_blank')); } else { window.open(mapsUrl, '_blank'); }
    });


    let btn43 = $('<input class="btnMapsIc" type="image" alt="Freshmile"  title="Bornes Freshmile" src="https://www.freshmile.com/_nuxt/freshmile.T0p-lfHm.svg" >');
    btn43.click(()=>{
        let {lon, lat, zoom} = getGps(+1);
        mapsUrl = `https://charge.freshmile.com/map?lat=${lat}&lng=${lon}&zoom=${zoom}`;
        window.open(mapsUrl,'_blank');
    });

    let btn44 = $('<input class="btnMapsIc" type="image" alt="Entreprises" title="clic => L\'Annuaire des Entreprises,\nCTRL+clic => Carte OpenData entreprises,\rSHIFT+clic => Annuaire vide" src="https://annuaire-entreprises.data.gouv.fr/images/logos/annuaire-entreprises.svg" >');
    btn44.click(()=>{
        let {lon, lat, zoom} = getGps(0);
        mapsUrl = `https://www.google.fr/?MFRanent[${lon},${lat},${zoom}]`;
        if (event.ctrlKey) { mapsUrl = `https://data.opendatasoft.com/explore/dataset/economicref-france-sirene-v3%40public/map/?disjunctive.libellecommuneetablissement&disjunctive.etatadministratifetablissement&disjunctive.activiteprincipaleetablissement&disjunctive.sectionetablissement&disjunctive.soussectionetablissement&disjunctive.divisionetablissement&disjunctive.groupeetablissement&disjunctive.classeetablissement&disjunctive.sectionunitelegale&disjunctive.soussectionunitelegale&disjunctive.classeunitelegale&disjunctive.naturejuridiqueunitelegale&location=${zoom},${lat},${lon}&basemap=jawg.light`;}
        if (event.shiftKey) { mapsUrl = `https://annuaire-entreprises.data.gouv.fr/rechercher`;}
        if (event.ctrlKey || event.shiftKey) {setTimeout(() => window.open(mapsUrl, '_blank')); } else { window.open(mapsUrl, '_blank'); }
    });

//    let btn45 = $('<button class="btnMaps" title="Carte de l\'INSEE">I N S E E</button>');
//    btn45.click(()=>{
//        let {lon, lat, zoom} = getGps(0);
//        mapsUrl = `https://www.google.fr/?MFRfranceservices[${lon},${lat},${zoom}]`;
        //var projE = new OpenLayers.Projection("EPSG:4326"); //4326
        //var projI = new OpenLayers.Projection("EPSG:3857"); //900913
        //var topleft= (new OpenLayers.LonLat(W.map.getExtent().left,W.map.getExtent().top)).transform(projE,projI);
        //var topleft= (new OpenLayers(W.map.getExtent().left,W.map.getExtent().top));//.transform(projE,projI);// modifié enlevé LonLat
        //var bottomright= (new OpenLayers.LonLat(W.map.getExtent().right,W.map.getExtent().bottom)).transform(projE,projI);
        //var bottomright= (new OpenLayers(W.map.getExtent().right,W.map.getExtent().bottom));//.transform(projE,projI);// modifié enlevé LonLat
        //var xmin = topleft.lon;
        //var xmax = bottomright.lon;
        //var ymin = bottomright.lat;
        //var ymax = topleft.lat;
      //  bbox=BBOX();
      //  mapsUrl = `https://statistiques-locales.insee.fr/#bbox=${bbox.toFixed(0)}&c=indicator&view=map1`;
        //mapsUrl = `https://statistiques-locales.insee.fr/#bbox=${ymax.toFixed(0)},${xmin.toFixed(0)},${ymin.toFixed(0)},${xmax.toFixed(0)}&c=indicator&view=map1`;
        //mapsUrl = `https://statistiques-locales.insee.fr/#bbox=${xmax.toFixed(0)},${ymax.toFixed(0)},${xmin.toFixed(0)},${ymin.toFixed(0)}&c=indicator&view=map1`;
        //mapsUrl = `https://statistiques-locales.insee.fr/#bbox=${ymin.toFixed(0)},${xmax.toFixed(0)},${ymax.toFixed(0)},${xmin.toFixed(0)}&c=indicator&view=map1`;
       // window.open(mapsUrl, '_blank');
     /*   var wazeExt = W.map.getExtent();
        //wazeExt.transform(new OpenLayers.Projection('EPSG:900913'),new OpenLayers.Projection('EPSG:4326'));
        mapsUrl = `https://statistiques-locales.insee.fr/#bbox=${wazeExt.bottom.toFixed(0)},${wazeExt.left.toFixed(0)}:${wazeExt.top.toFixed(0)},${wazeExt.right.toFixed(0)}&c=indicator&view=map1`;*/

// https://wxs.ign.fr/an7nvfzojv5wa96dsga5nk8w/geoportail/v/wms?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetFeatureInfo&FORMAT=image%2Fpng&TRANSPARENT=TRUE&QUERY_LAYERS=STATISTICALUNITS.IRISGE&LAYERS=STATISTICALUNITS.IRISGE&INFO_FORMAT=text%2Fhtml&I=50&J=50&CRS=EPSG%3A3857&STYLES=&WIDTH=101&HEIGHT=101&BBOX=-321156.27105565934%2C6111197.888493066%2C-319841.4690007886%2C6112512.690547937

        //mapsUrl = `https://statistiques-locales.insee.fr/#bbox=${xmin.toFixed(0)},${ymin.toFixed(0)},${xmax.toFixed(0)},${ymax.toFixed(0)}&c=indicator&view=map1`;
        //mapsUrl = `https://statistiques-locales.insee.fr/#bbox=${xmin.toFixed(0)},${ymin.toFixed(0)},${xmax.toFixed(0)},${ymax.toFixed(0)}&c=indicator&view=map1`;
        //mapsUrl = `https://statistiques-locales.insee.fr/#bbox=${xmin.toFixed(0)},${ymin.toFixed(0)},${xmax.toFixed(0)},${ymax.toFixed(0)}&c=indicator&view=map1`;
        //mapsUrl = `https://statistiques-locales.insee.fr/#bbox=${xmin.toFixed(0)},${ymin.toFixed(0)},${xmax.toFixed(0)},${ymax.toFixed(0)}&c=indicator&view=map1`;

        //mapsUrl = `https://statistiques-locales.insee.fr/#bbox=${xmin.toFixed(0)},${ymin.toFixed(0)},${xmax.toFixed(0)},${ymax.toFixed(0)}&c=indicator&view=map1`;
        //mapsUrl = `https://statistiques-locales.insee.fr/#bbox=${xmin.toFixed(0)},${ymin.toFixed(0)},${xmax.toFixed(0)},${ymax.toFixed(0)}&c=indicator&view=map1`;
        //mapsUrl = `https://statistiques-locales.insee.fr/#bbox=${xmin.toFixed(0)},${ymin.toFixed(0)},${xmax.toFixed(0)},${ymax.toFixed(0)}&c=indicator&view=map1`;
        //mapsUrl = `https://statistiques-locales.insee.fr/#bbox=${xmin.toFixed(0)},${ymin.toFixed(0)},${xmax.toFixed(0)},${ymax.toFixed(0)}&c=indicator&view=map1`;

        //mapsUrl = `https://statistiques-locales.insee.fr/#bbox=${xmin.toFixed(0)},${ymin.toFixed(0)},${xmax.toFixed(0)},${ymax.toFixed(0)}&c=indicator&view=map1`;
        //mapsUrl = `https://statistiques-locales.insee.fr/#bbox=${xmin.toFixed(0)},${ymin.toFixed(0)},${xmax.toFixed(0)},${ymax.toFixed(0)}&c=indicator&view=map1`;
        //mapsUrl = `https://statistiques-locales.insee.fr/#bbox=${xmin.toFixed(0)},${ymin.toFixed(0)},${xmax.toFixed(0)},${ymax.toFixed(0)}&c=indicator&view=map1`;
        //mapsUrl = `https://statistiques-locales.insee.fr/#bbox=${xmin.toFixed(0)},${ymin.toFixed(0)},${xmax.toFixed(0)},${ymax.toFixed(0)}&c=indicator&view=map1`;

//        window.open(mapsUrl, '_blank');
//    });

    let btn47 = $('<button class="btnMaps" title="clic => Annuaire de l\'éducation nationale par ville\n\nCTRL+clic => Annuaire de l\'éducation nationale par géolocation\n\nSHIFT+clic => Emplacements équipements sportifs." style="background-color:#02fae9">Éducation Nat\.</button>');
    btn47.click(()=>{
        let {lon, lat, zoom} = getGps(0);
        mapsUrl = `https://www.google.fr/?MFReducnat[${lon},${lat},${zoom}]`;
        if (event.ctrlKey || event.metaKey) { mapsUrl = `https://data.education.gouv.fr/explore/dataset/fr-en-annuaire-education/map/?disjunctive.type_etablissement&disjunctive.code_postal&disjunctive.nom_commune&disjunctive.code_departement&disjunctive.appartenance_education_prioritaire&disjunctive.libelle_academie&disjunctive.libelle_region&disjunctive.ministere_tutelle&location=${zoom},${lat},${lon}&basemap=47b3ca`;}
        if (event.shiftKey) { mapsUrl = `https://www.google.fr/?MFReducanat[${lon},${lat},${zoom}]`;}
        if (event.ctrlKey || event.metaKey || event.shiftKey) {setTimeout(() => window.open(mapsUrl, '_blank')); } else { window.open(mapsUrl, '_blank'); }
    });

    let btn48 = $('<input class="btnMapsIc" type="image" alt="Cartes Bison futé" title="Cartes Bison Futé\n\nclic => Carte principale avec tous les menus,\nCTRL+clic => Carte mobile avec calques,\nShift+clic => Travaux en cours,\nAlt+clic => Travaux Pévisionnels" src="https://zupimages.net/up/24/22/zuvq.png" >'); // https://www.bison-fute.gouv.fr/IMG/siteon0.png  https://www.zupimages.net/up/24/14/3en7.png
    btn48.click(()=>{
        let {lon, lat, zoom} = getGps(0);
        //var s=''; if (window.getSelection){ s = window.getSelection();} else if (document.getSelection){ s= document.getSelection();} else if (document.selection){ s = document.selection.createRange().text;}
        //if(s==''){s=prompt("Cartes Bison Futé\n\nclic => Carte principale avec tous les menus,\nCTRL+clic => Carte mobile avec calques,\nShift+clic => Carte DIRO hivernale");}
        //s = s.replace(/[A-Za-z]/g).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[\u0020]/g, '');
        //if((s!='')&&(s!=null)){window.open(`https://www.google.fr/?MFRlahalle[${lon},${lat},${zoom}]`,'_blank');}
        //if((s=='')&&(s!=null)) {window.open(`https://localiser.laposte.fr/?q=${c[1]},${c[0]}`,'_self');}
        //if (s==null){window.close();}
        mapsUrl = `https://www.bison-fute.gouv.fr/maintenant.html`;
        if (event.ctrlKey || event.metaKey) { mapsUrl = `https://www.bison-fute.gouv.fr/webapp/tabs/traffic?view=map&vh=false`;}
        if (event.shiftKey) { mapsUrl = `https://www.google.fr/?MFRbisfutcour[${lon},${lat},${zoom}]`;}
        if (event.altKey) { mapsUrl = `https://www.google.fr/?MFRbisfutprev[${lon},${lat},${zoom}]`;}
        if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) {setTimeout(() => window.open(mapsUrl, '_blank')); } else { window.open(mapsUrl, '_blank'); }
    });
    
    let btn52 = $('<input class="btnMapsIc" type="image" alt="Tesla Map"  title="Carte des bornes de recharge Tesla" src="https://i.imgur.com/y3aAf41.png">');
    btn52.click(()=>{
        let {lon, lat, zoom} = getGps(0);
        let tileBounds = new OpenLayers.Bounds(W.map.getExtent());
        tileBounds.extend(new OpenLayers.LonLat(lon, lat));
        mapsUrl = `https://www.tesla.com/fr_fr/findus?bounds=${tileBounds.top},${tileBounds.right},${tileBounds.bottom},${tileBounds.left}`;
        window.open(mapsUrl,'_blank');
    });
    
    let btn53 = $('<input class="btnMapsIc" type="image" alt="ChargePoint Map"  title="Carte des bornes de recharge ChargePoint" src="https://upload.wikimedia.org/wikipedia/commons/8/81/ChargePoint_logo.svg">');
    btn53.click(()=>{
        let {lon, lat, zoom} = getGps(0);
        mapsUrl = `https://driver.chargepoint.com/mapCenter/${lat}/${lon}/${zoom}?view=map`;
        window.open(mapsUrl,'_blank');
    });
    
/*    let addon = document.createElement("section");
    addon.id = "sidepanel-MapsFr";
    addon.className = "tab-pane";
    addon.innerHTML = '<a title='+ MapsFr_link +' target="_blank" href= '+ MapsFr_link + '> <b>Maps Fr</b><style type="text/css">a:link{text-decoration:none}</style> </a><i> - Version du ' + MapsFr_version + '</i><br>';
    userTabs = document.getElementById('user-info');
    navTabs = document.getElementsByClassName('nav-tabs', userTabs)[0];
    tabContent = document.getElementsByClassName('tab-content', userTabs)[0];
    newtab = document.createElement('li');
    //newtab.innerHTML = '<a data-toggle="tab" title="Maps France" href="#sidepanel-MapsFr">\&#127467;&#127479;</a>';
    newtab.innerHTML = '<a data-toggle="tab" title="Maps France" href="#sidepanel-MapsFr"> <img src='+ MapsFr_Icon +' alt="MapsFR" width="15" height="10"></a>';
    navTabs.appendChild(newtab);
    tabContent.appendChild(addon);*/
    // alert("Create Tab");
	let userTabs = document.getElementById('user-info');
	let navTabs = document.getElementsByClassName('nav-tabs', userTabs)[0];
	let tabContent = document.getElementsByClassName('tab-content', userTabs)[0];
	let newtab = '';

	newtab = document.createElement('li');
	newtab.innerHTML = '<a data-toggle="tab" title="Maps France" href="#sidepanel-MapsFr"> <img src='+ MapsFr_Icon +' alt="MapsFR" width="15" height="10"></a>';
	navTabs.appendChild(newtab);

	// add new box to left of the map
	let addon = document.createElement('section');
    addon.innerHTML = '<a title='+ MapsFr_link +' target="_blank" href= '+ MapsFr_link + '> <b>Maps Fr</b><style type="text/css">a:link{text-decoration:none}</style> </a><i> - Version du ' + MapsFr_version + '</i><br>';
	addon.id = 'sidepanel-MapsFr';
	addon.className = 'tab-pane';
	tabContent.appendChild(addon);

    let safeSourcesText = $('<div><i class="w-icon w-icon-warning" style="font-size: 30px;float: left;margin-right: 50x;margin-bottom: 20px;"></i> Remarque : Certains liens externes ne sont pas autorisés comme source d\'information pour l\'édition de la carte !</div>');

    $("#sidepanel-MapsFr").append('<br>');
    $("#sidepanel-MapsFr").append(btn1); $("#sidepanel-MapsFr").append(btn2); $("#sidepanel-MapsFr").append(btn3);
    $("#sidepanel-MapsFr").append('<br>');
    $("#sidepanel-MapsFr").append(btn4); $("#sidepanel-MapsFr").append(btn5); $("#sidepanel-MapsFr").append(btn6);
    $("#sidepanel-MapsFr").append('<br>');
    $("#sidepanel-MapsFr").append(btn7); $("#sidepanel-MapsFr").append(btn8); $("#sidepanel-MapsFr").append(btn9);
    $("#sidepanel-MapsFr").append('<br>');
    $("#sidepanel-MapsFr").append(btn10); $("#sidepanel-MapsFr").append(btn11); $("#sidepanel-MapsFr").append(btn12);
    $("#sidepanel-MapsFr").append('<br>');
    $("#sidepanel-MapsFr").append(btn13); $("#sidepanel-MapsFr").append(btn14); $("#sidepanel-MapsFr").append(btn15);
    $("#sidepanel-MapsFr").append('<br>');
    $("#sidepanel-MapsFr").append(btn16); $("#sidepanel-MapsFr").append(btn18); $("#sidepanel-MapsFr").append(btn18b);
    $("#sidepanel-MapsFr").append('<br>');
    $("#sidepanel-MapsFr").append(btn20); $("#sidepanel-MapsFr").append(btn21); $("#sidepanel-MapsFr").append(btn22);
    $("#sidepanel-MapsFr").append('<br>');
    $("#sidepanel-MapsFr").append(btn23);/* $("#sidepanel-MapsFr").append(btn24);*/ $("#sidepanel-MapsFr").append(btn25);
    $("#sidepanel-MapsFr").append('<br>');
    $("#sidepanel-MapsFr").append(btn36); $("#sidepanel-MapsFr").append(btn37); $("#sidepanel-MapsFr").append(btn39);
    $("#sidepanel-MapsFr").append('<br>');
   /* $("#sidepanel-MapsFr").append(btn38);*/ $("#sidepanel-MapsFr").append(btn42); $("#sidepanel-MapsFr").append(btn47);
    $("#sidepanel-MapsFr").append('<br>');
    $("#sidepanel-MapsFr").append('<br>');
    $("#sidepanel-MapsFr").append(btn26); $("#sidepanel-MapsFr").append(btn27); //$("#sidepanel-MapsFr").append(btn45);
    $("#sidepanel-MapsFr").append('<br>');
    $("#sidepanel-MapsFr").append('<br>');
    $("#sidepanel-MapsFr").append(btn48);
    $("#sidepanel-MapsFr").append(btn41); $("#sidepanel-MapsFr").append(btn44);
    $("#sidepanel-MapsFr").append('<br>');
    $("#sidepanel-MapsFr").append(btn30); $("#sidepanel-MapsFr").append(btn35); $("#sidepanel-MapsFr").append(btn40);
    $("#sidepanel-MapsFr").append('<br>');
    $("#sidepanel-MapsFr").append(btn31); $("#sidepanel-MapsFr").append(btn32); $("#sidepanel-MapsFr").append(btn33);
    $("#sidepanel-MapsFr").append('<br>');
    $("#sidepanel-MapsFr").append(btn34); $("#sidepanel-MapsFr").append(btn43); /*$("#sidepanel-MapsFr").append(btn45);*/ $("#sidepanel-MapsFr").append(btn52);
    $("#sidepanel-MapsFr").append(btn53);
    $("#sidepanel-MapsFr").append('<br>');
    $("#sidepanel-MapsFr").append('<br>');
    $('#sidepanel-MapsFr').append(safeSourcesText);
}

add_buttons()


