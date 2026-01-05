// ==UserScript==
// @name                WME OpenData
// @namespace           http://greasemonkey.chizzum.com
// @description         Provides access to certain OS OpenData products within the WME environment
// @include             https://*.waze.com/*editor*
// @exclude             https://editor-beta.waze.com/*
// @exclude             https://beta.waze.com/*
// @include             https://one.network/*
// @include             https://public.londonworks.gov.uk/roadworks/*
// @include             http://public.londonworks.gov.uk/roadworks/*
// @include             https://search-property-information.service.gov.uk/search/search-by-map/*
// @grant               GM_setValue
// @grant               GM_getValue
// @grant               GM_addValueChangeListener
// @grant               unsafeWindow
// @version             4.1
// @downloadURL https://update.greasyfork.org/scripts/1941/WME%20OpenData.user.js
// @updateURL https://update.greasyfork.org/scripts/1941/WME%20OpenData.meta.js
// ==/UserScript==

// Contains Ordnance Survey data Crown copyright and database right 2024
//
// Contents of the locatorData_*.js files are derived under the
// Open Government Licence from the OS Open Names and Open Roads datasets
//
// Contents of the gazetteer.js file are derived under the
// Open Government Licence from the OS Open Names dataset

/*
=======================================================================================================================
DONE FOR THIS RELEASE
=======================================================================================================================
Auto-repositioning of the UI on startup, if previously stored values no longer fit for the size of the browser window,
now tries to reposition to somewhere close to where the UI was, rather than just using a fixed default each time.

Updates to support latest tweaks on OS map donor site


=======================================================================================================================
Bug fixes - MUST BE CLEARED BEFORE RELEASE
=======================================================================================================================

=======================================================================================================================
Things to be checked
=======================================================================================================================

*/

/* JSHint Directives */
/* globals W: true */
/* globals getWmeSdk: true */
/* globals OpenLayers: true */
/* globals Elgin: true */
/* globals gazetteerData: true */
/* globals oslRoadNameMatches: true */
/* globals map: true */
/* globals GM_setValue: true */
/* globals GM_getValue: true */
/* globals GM_addValueChangeListener: true */
/* globals unsafeWindow: true */
/* globals trustedTypes: */
/* jshint evil: true */
/* jshint bitwise: false */
/* jshint eqnull: true */
/* jshint esversion: 11 */
/* jshint undef: true */
/* jshint unused: true */

const oslVersion = '4.1';
const oslUpdateURL = 'https://greasyfork.org/scripts/1941-wme-to-os-link';
const oslBlockPath = 'https://greasemonkey.chizzum.com/osl_v3.0/';
const oslGazetteerURL = 'https://chizzum.com/greasemonkey/gaz_v5/_gazetteer.js';
const oslPi = 3.14159265358979;
const oslPiDiv180 = (oslPi / 180);
const osl180DivPi = (180 / oslPi);
const oslLocatorBlockSize = 1000;
const oslCacheDecayPeriod = 60;

const oslNameTextPts = '12pt';
const oslNameHalfPix = 12;


const GAZ_ELM =
{
   Name: 0,
   CEast: 1,
   CNorth: 2,
   Type: 3,
   Area: 4,
   LEast: 5,
   LNorth: 6,
   REast: 7,
   RNorth: 8
};
const OSL_ELM =
{
   RoadName: 0,
   RoadNumber: 1,
   BoundW: 2,
   BoundE: 3,
   BoundS: 4,
   BoundN: 5,
   Geometry: 6,
   AreaName: 7,
   AltName: 8,
   Classification: 9,
   Function: 10,
   Form: 11,
   Structure: 12,
   IsPrimary: 13,
   IsTrunk: 14,
   MAX: 15
};
const OSL_MODE =
{
   Conversion: 0,
   OpenNames: 1,
   NameCheck: 2,
   OpenRoads: 3
};
const OSL_BBMODE = 
{
   Init: 0,
   Match: 1,
   Other: 2,
   Finalise: 3
};
const OSL_ROADRENDERER =
{
   Init: 0,
   Render: 1,
   Finalise: 2,
   Erase: 3
};

const oslRoadClassifications = new Array
(
   'Undefined',
   'Motorway',
   'A Road',
   'B Road',
   'Classified Unnumbered',
   'Unclassified',
   'Not Classified',
   'Unknown'
);

const oslRoadFunctions = new Array
(
   'Undefined',
   'Motorway',
   'A Road',
   'B Road',
   'Minor Road',
   'Local Road',
   'Local Access Road',
   'Restricted Local Access Road',
   'Secondary Access Road'
);
const oslStrokeColoursByFunction = new Array
(
   "red",
   "deepskyblue",
   "limegreen",
   "darkorange",
   "yellow",
   "white",
   "grey",
   "tan",
   "grey"
);
const oslRoadStructures = new Array
(
   '',
   '[Tunnel]',
   '[Bridge]'
);
const oslFormsOfWay = new Array
(
   'Undefined',
   'Single Carriageway',
   'Dual Carriageway',
   'Slip Road',
   'Roundabout',
   'Collapsed Dual Carriageway',
   'Guided Busway',
   'Shared Use Carriageway'
);

// List of all road name suffixes, giving both their full length and abbreviated forms,
// for use when automatically translating the standard OS names into the abbreviated
// forms we prefer to use in WME.
//
// Note that some suffixes are included where the abbreviated form is identical to the
// full length form - these are present to act as guidance to the translation code so
// that it recognises which part of the OS name is the suffix - remember that the suffix
// isn't always the last word in the name, as we also need to consider names that have 
// things after the suffix - e.g. Breakspear Road South, High Street Eastcote etc.  If
// these weren't present then we could end up incorrectly translating earlier parts of
// the name which match one of the other suffixes - e.g. West Green Way...
const oslNameAbbreviations = new Array
(
   'Avenue','Ave',
   'Boulevard','Blvd',
   'Broadway','Bdwy',
   'Circus','Cir',
   'Close','Cl',
   'Court','Ct',
   'Crescent','Cr',
   'Drive','Dr',
   'Garden','Gdn',
   'Gardens','Gdns',
   'Green','Gn',
   'Grove','Gr',
   'Lane','Ln',
   'Mews','Mews',
   'Mount','Mt',
   'Place','Pl',
   'Park','Pk',
   'Ridge','Rdg',
   'Road','Rd',
   'Square','Sq',
   'Street','St',
   'Terrace','Ter',
   'Valley','Val',
   'By-pass','Bypass',
   'Way','Way',
   'Hill','Hill'
);


let oslUserPrefs = {};

let oslGazetteerData = [];

let oslAdvancedMode = false;
let oslEvalString = '';
let oslLoadingMsg = false;
let oslMLCDiv = null;
let oslOSLDiv = null;
let oslBBDiv = null;
let oslNamesDiv = null;
let oslGazTagsDiv = null;
let oslPrevHighlighted = null;
let oslSegmentHighlighted = false;
let oslPrevMouseX = null;
let oslPrevMouseY = null;
let oslDivDragging = false;
let oslPrevSelected = null;
let oslDoOSLUpdate = false;
let oslMousepos = null;
let oslMousePixelpos = null;
let oslLastViewportWidth = null;
let oslDoneOnload = false;
let oslPrevStreetName = '';
let oslMergeGazData = false;
let oslOSLMaskLayer = null;
let oslOSLNameCheckTimer = 0;
let oslOSLNCSegments = [];
let oslInUK = false;
let oslInLondon = false;

let oslNorthings = null;
let oslEastings = null;
let oslLatitude = null;
let oslLongitude = null;

let oslBlocksToLoad = [];
let oslBlocksToTest = [];

let oslVPLeft = 0;
let oslVPRight = 0;
let oslVPBottom = 0;
let oslVPTop = 0;
const oslMinUIWidth = 315;
let oslBBDivInnerHTML = '';

let oslEvalEBlock = 0;
let oslEvalNBlock = 0;
let oslBlockData = null;
let oslBlockCacheList = [];
let oslBlockCacheTestTimer = (oslCacheDecayPeriod * 10);
let oslSegGeoDivInnerHTML = '';
let oslNamesDivInnerHTML = '';

let oslONC_E = null;
let oslONC_N = null;
let oslEBlock_min = null;
let oslEBlock_max = null;
let oslNBlock_min = null;
let oslNBlock_max = null;

let oslOSLDivLeft;
let oslOSLDivTop;
let oslSegGeoDiv;
let oslWazeMapElement;
let oslDragBar;
let oslWindow;
let oslOSLDivTopMinimised;
let oslNCDiv;
let oslSegGeoUIDiv;

let oslOffsetToolbar = false;
let oslMOAdded = false;

let oslLocatorElements = null;
let oslUsingNewName = false;
let oslUseName = false;
let oslCityName = '';
let oslCountyName = '';
let oslUseAlt = false;

let oslRORCenter = null;
let oslRORZoom = null;

let oslSDK = null;

function oslBootstrap()
{
   if(document.location.host == 'one.network')
   {
      hlp_ONE.init();
   }
   else if(document.location.host == 'search-property-information.service.gov.uk')
   {
      hlp_ODM.init();
   }
   else if(document.location.host == 'public.londonworks.gov.uk')
   {
      hlp_LRR.init();
   }
   else
   {
      oslInitialise();
   }
}
function oslAddLog(logtext)
{
   console.log('WMEOpenData: '+logtext);
}
function oslModifySrc(srcIn)
{
	if(typeof trustedTypes === "undefined")
	{
		return srcIn;
	}
	else
	{
		const escapeSrcPolicy = trustedTypes.createPolicy("name", {createScriptURL: (to_escape) => to_escape});
		return escapeSrcPolicy.createScriptURL(srcIn);
	}
}
function oslModifyHTML(htmlIn)
{
	if(typeof trustedTypes === "undefined")
	{
		return htmlIn;
	}
	else
	{
		const escapeHTMLPolicy = trustedTypes.createPolicy("forceInner", {createHTML: (to_escape) => to_escape});
		return escapeHTMLPolicy.createHTML(htmlIn);
	}
}
function oslGetExtent()
{
   // From DaveAcincy
   let extent = new OpenLayers.Bounds(oslSDK.Map.getMapExtent());
   extent = extent.transform('EPSG:4326', 'EPSG:3857');
   return extent;
}
function oslConvertLonLatXY(lon, lat)
{
   let tPos = new OpenLayers.LonLat(lon, lat);
   tPos.transform(new OpenLayers.Projection("EPSG:4326"),new OpenLayers.Projection("EPSG:900913"));
   return{x:tPos.lon, y:tPos.lat};
}
function oslConvertXYLonLat(x, y)
{
   let tPos = new OpenLayers.LonLat(x, y);
   tPos.transform(new OpenLayers.Projection("EPSG:900913"),new OpenLayers.Projection("EPSG:4326"));
   return{lon:tPos.lon, lat:tPos.lat};
}
function oslGetSegmentLayer()
{
   return W.map.getLayerByUniqueName('segments');
}

//-----------------------------------------------------------------------------------------------------------------------------------------
// all code between here and the next ------------- marker line is a stripped down version of the original from Paul Dixon
//
// * GeoTools javascript coordinate transformations
// * http://www.nearby.org.uk/tests/geotools2.js
// *
// * This file copyright (c)2005 Paul Dixon (paul@elphin.com)
// *
// * This program is free software; you can redistribute it and/or
// * modify it under the terms of the GNU General Public License
// * as published by the Free Software Foundation; either version 2
// * of the License, or (at your option) any later version.
// *
// * This program is distributed in the hope that it will be useful,
// * but WITHOUT ANY WARRANTY; without even the implied warranty of
// * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// * GNU General Public License for more details.
// *
// * You should have received a copy of the GNU General Public License
// * along with this program; if not, write to the Free Software
// * Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA  02111-1307, USA.
// *
// * ---------------------------------------------------------------------------
// *
// * Credits
// *
// * The algorithm used by the script for WGS84-OSGB36 conversions is derived
// * from an OSGB spreadsheet (www.gps.gov.uk) with permission. This has been
// * adapted into Perl by Ian Harris, and into PHP by Barry Hunter. Conversion
// * accuracy is in the order of 7m for 90% of Great Britain, and should be
// * be similar to the conversion made by a typical GPSr
// *
// * See accompanying documentation for more information
// * http://www.nearby.org.uk/tests/GeoTools2.html
function oslOSGBtoWGS(oseast, osnorth)
{
   const a = 6377563.396;
   const b = 6356256.910;
   const e0 = 400000;
   const n0 = -100000;
   const f0 = 0.999601272;
   const PHI0 = 49.00000;
   const LAM0 = -2.00000;
   const RadPHI0 = PHI0 * oslPiDiv180;
   const RadLAM0 = LAM0 * oslPiDiv180;

   //Compute af0, bf0, e squared (e2), n and Et
   const af0 = a * f0;
   const bf0 = b * f0;
   const e2 = (Math.pow(af0,2) - Math.pow(bf0,2)) / Math.pow(af0,2);
   const n = (af0 - bf0) / (af0 + bf0);
   let Et = oseast - e0;

   //Compute initial value for oslLatitude (PHId) in radians
   let PHI1 = ((osnorth - n0) / af0) + RadPHI0;
   let M = oslMarc(bf0, n, RadPHI0, PHI1);
   let PHId = ((osnorth - n0 - M) / af0) + PHI1;
   while (Math.abs(osnorth - n0 - M) > 0.00001)
   {
      PHId = ((osnorth - n0 - M) / af0) + PHI1;
      M = oslMarc(bf0, n, RadPHI0, PHId);
      PHI1 = PHId;
   }

   //Compute nu, rho and eta2 using value for PHId
   let nu = af0 / (Math.sqrt(1 - (e2 * ( Math.pow(Math.sin(PHId),2)))));
   let rho = (nu * (1 - e2)) / (1 - (e2 * Math.pow(Math.sin(PHId),2)));
   let eta2 = (nu / rho) - 1;

   //Compute Latitude/Longitude
   let tanPHId = Math.tan(PHId);
   let tanPHIdSquared = Math.pow(tanPHId, 2);
   let tanPHIdPowFour = Math.pow(tanPHId, 4);
   let cosPHId = Math.cos(PHId);
   let cosPHIdPowNegOne = Math.pow(cosPHId, -1);
   let nuPowThree = Math.pow(nu, 3);
   let nuPowFive = Math.pow(nu, 5);

   let VII = tanPHId / (2 * rho * nu);
   let VIII = (tanPHId / (24 * rho * nuPowThree)) * (5 + (3 * tanPHIdSquared) + eta2 - (9 * eta2 * tanPHIdSquared));
   let IX = (tanPHId / (720 * rho * nuPowFive)) * (61 + (90 * tanPHIdSquared) + (45 * tanPHIdPowFour));
   oslLatitude = osl180DivPi * (PHId - (Math.pow(Et,2) * VII) + (Math.pow(Et,4) * VIII) - (Math.pow(Et, 6) * IX));

   let X = cosPHIdPowNegOne / nu;
   let XI = (cosPHIdPowNegOne / (6 * nuPowThree)) * ((nu / rho) + (2 * tanPHIdSquared));
   let XII = (cosPHIdPowNegOne / (120 * nuPowFive)) * (5 + (28 * tanPHIdSquared) + (24 * tanPHIdPowFour));
   let XIIA = (cosPHIdPowNegOne / (5040 * Math.pow(nu,7))) * (61 + (662 * tanPHIdSquared) + (1320 * tanPHIdPowFour) + (720 * (Math.pow(tanPHId,6))));
   oslLongitude = osl180DivPi * (RadLAM0 + (Et * X) - (Math.pow(Et,3) * XI) + (Math.pow(Et,5) * XII) - (Math.pow(Et,7) * XIIA));



   let RadPHI = oslLatitude * oslPiDiv180;
   let RadLAM = oslLongitude * oslPiDiv180;

   const ee2 = (Math.pow(6377563.396,2) - Math.pow(6356256.910,2)) / Math.pow(6377563.396,2);
   let V = a / (Math.sqrt(1 - (ee2 * (  Math.pow(Math.sin(RadPHI),2)))));
   let cosRadPHI = Math.cos(RadPHI);

   X = V * cosRadPHI * Math.cos(RadLAM);
   let Y = V * cosRadPHI * Math.sin(RadLAM);
   let Z = (V * (1 - ee2)) * (Math.sin(RadPHI));

   // do Helmert transforms

   const sfactor = -20.4894 * 0.000001;
   const RadX_Rot = (0.1502 / 3600) * oslPiDiv180;
   const RadY_Rot = (0.2470 / 3600) * oslPiDiv180;
   const RadZ_Rot = (0.8421 / 3600) * oslPiDiv180;

   let X2 = (X + (X * sfactor) - (Y * RadZ_Rot) + (Z * RadY_Rot) + 446.448);
   let Y2 = (X * RadZ_Rot) + Y + (Y * sfactor) - (Z * RadX_Rot) -125.157;
   let Z2 = (-1 * X * RadY_Rot) + (Y * RadX_Rot) + Z + (Z * sfactor) + 542.060;

   let RootXYSqr = Math.sqrt(Math.pow(X2,2) + Math.pow(Y2,2));
   const eee2 = (Math.pow(6378137.000,2) - Math.pow(6356752.313,2)) / Math.pow(6378137.000,2);
   PHI1 = Math.atan2(Z2 , (RootXYSqr * (1 - eee2)) );
   let sinPHI1 = Math.sin(PHI1);
   let sinPHI1Squared = Math.pow(sinPHI1, 2);

   V = 6378137.000 / (Math.sqrt(1 - (eee2 * sinPHI1Squared)));
   let PHI2 = Math.atan2((Z + (eee2 * V * sinPHI1)) , RootXYSqr);
   while (Math.abs(PHI1 - PHI2) > 0.000000001)
   {
      PHI1 = PHI2;
      let innerSinPHI1 = Math.sin(PHI1);
      V = 6378137.000 / (Math.sqrt(1 - (eee2 * Math.pow(innerSinPHI1,2))));
      PHI2 = Math.atan2((Z2 + (eee2 * V * innerSinPHI1)) , RootXYSqr);
   }
   oslLatitude = PHI2 * osl180DivPi;
   oslLongitude = Math.atan2(Y2 , X2) * osl180DivPi;
}
function oslWGStoOSGB(lon, lat)
{
   let helm = oslLatLontoHelmXYZ(lon, lat);
   let lat2  = oslXYZtoLat(helm);
   let lon2 = Math.atan2(helm.y , helm.x) * osl180DivPi;
   oslLatLonoslToOSGrid(lat2,lon2);
}
function oslLatLontoHelmXYZ(lon, lat)
{
   const a = 6378137.0;
   const b = 6356752.313;
   const DX = -446.448;
   const DY = 125.157;
   const DZ = -542.060;
   const rotX = -0.1502;
   const rotY = -0.2470;
   const rotZ = -0.8421;
   const sfactor = 20.4894 * 0.000001;
   const e2 = (Math.pow(a,2) - Math.pow(b,2)) / Math.pow(a,2);

   // perform initial lat-lon to cartesian coordinate translation
   let RadPHI = lat * oslPiDiv180;
   let RadLAM = lon * oslPiDiv180;
   let V = a / (Math.sqrt(1 - (e2 * (  Math.pow(Math.sin(RadPHI),2)))));
   let cartX = V * (Math.cos(RadPHI)) * (Math.cos(RadLAM));
   let cartY = V * (Math.cos(RadPHI)) * (Math.sin(RadLAM));
   let cartZ = (V * (1 - e2)) * (Math.sin(RadPHI));

   // Compute Helmert transformed coordinates
   let RadX_Rot = (rotX / 3600) * oslPiDiv180;
   let RadY_Rot = (rotY / 3600) * oslPiDiv180;
   let RadZ_Rot = (rotZ / 3600) * oslPiDiv180;
   let helmX = (cartX + (cartX * sfactor) - (cartY * RadZ_Rot) + (cartZ * RadY_Rot) + DX);
   let helmY = (cartX * RadZ_Rot) + cartY + (cartY * sfactor) - (cartZ * RadX_Rot) + DY;
   let helmZ = (-1 * cartX * RadY_Rot) + (cartY * RadX_Rot) + cartZ + (cartZ * sfactor) + DZ;

   return {x:helmX,y:helmY,z:helmZ};
}
function oslXYZtoLat(helm)
{
   const a = 6377563.396;
   const b = 6356256.910;
   const e2 = (Math.pow(a,2) - Math.pow(b,2)) / Math.pow(a,2);

   let RootXYSqr = Math.sqrt(Math.pow(helm.x,2) + Math.pow(helm.y,2));
   let PHI1 = Math.atan2(helm.z , (RootXYSqr * (1 - e2)) );
   let PHI = oslIterateOSLXYZtoLat(a, e2, PHI1, helm.z, RootXYSqr);
   return PHI * osl180DivPi;
}
function oslIterateOSLXYZtoLat(a, e2, PHI1, Z, RootXYSqr)
{
   let V = a / (Math.sqrt(1 - (e2 * Math.pow(Math.sin(PHI1),2))));
   let PHI2 = Math.atan2((Z + (e2 * V * (Math.sin(PHI1)))) , RootXYSqr);
   while (Math.abs(PHI1 - PHI2) > 0.000000001)
   {
      PHI1 = PHI2;
      let sinPHI1 = Math.sin(PHI1);
      V = a / (Math.sqrt(1 - (e2 * Math.pow(sinPHI1,2))));
      PHI2 = Math.atan2((Z + (e2 * V * (sinPHI1))) , RootXYSqr);
   }
   return PHI2;
}
function oslMarc(bf0, n, PHI0, PHI)
{
   let c1 = PHI - PHI0;
   let c2 = PHI + PHI0;
   let c3 = Math.pow(n, 2);
   let c4 = Math.pow(n, 3);
   return bf0 * 
            (
               (
                  (1 + n + ((5 / 4) * c3) + ((5 / 4) * c4)) * c1
               ) - 
               (
                  ((3 * n) + (3 * c3) + ((21 / 8) * c4)) * 
                  Math.sin(c1) * 
                  Math.cos(c2)
               ) + 
               (
                  (((15 / 8) * c3) + ((15 / 8) * c4)) * 
                  Math.sin(2 * c1) * 
                  Math.cos(2 * c2)
               ) - 
               (
                  ((35 / 24) * c4) *
                  (Math.sin(3 * c1)) * (Math.cos(3 * c2))
               )
            );
}
function oslLatLonoslToOSGrid(PHI, LAM)
{
   const a = 6377563.396;
   const b = 6356256.910;
   const e0 = 400000;
   const n0 = -100000;
   const f0 = 0.999601272;
   const PHI0 = 49.00000;
   const LAM0 = -2.00000;
   const RadPHI0 = PHI0 * oslPiDiv180;
   const RadLAM0 = LAM0 * oslPiDiv180;
   const af0 = a * f0;
   const bf0 = b * f0;
   const n = (af0 - bf0) / (af0 + bf0);
   const e2 = (Math.pow(af0,2) - Math.pow(bf0,2)) / Math.pow(af0,2);

   let RadPHI = PHI * oslPiDiv180;
   let RadLAM = LAM * oslPiDiv180;
   let sinRadPHI = Math.sin(RadPHI);
   let sinRadPHISquared = Math.pow(sinRadPHI, 2);
   let cosRadPHI = Math.cos(RadPHI);
   let cosRadPHIPowThree = Math.pow(cosRadPHI, 3);
   let cosRadPHIPowFive = Math.pow(cosRadPHI, 5);
   let tanRadPHI = Math.tan(RadPHI);
   let tanRadPHISquared = Math.pow(tanRadPHI, 2);
   let tanRadPHIPowFour = Math.pow(tanRadPHI, 4);

   let nu = af0 / (Math.sqrt(1 - (e2 * sinRadPHISquared)));
   let rho = (nu * (1 - e2)) / (1 - (e2 * sinRadPHISquared));
   let eta2 = (nu / rho) - 1;
   let p = RadLAM - RadLAM0;
   let M = oslMarc(bf0, n, RadPHI0, RadPHI);
   let I = M + n0;
   let II = (nu / 2) * sinRadPHI * cosRadPHI;
   let III = ((nu / 24) * sinRadPHI * cosRadPHIPowThree) * (5 - tanRadPHISquared + (9 * eta2));
   let IIIA = ((nu / 720) * sinRadPHI * cosRadPHIPowFive) * (61 - (58 * tanRadPHISquared) + tanRadPHIPowFour);
   let IV = nu * cosRadPHI;
   let V = (nu / 6) * cosRadPHIPowThree * ((nu / rho) - tanRadPHISquared);
   let VI = (nu / 120) * cosRadPHIPowFive * ((5 - (18 * tanRadPHISquared)) + tanRadPHIPowFour + (14 * eta2) - (58 * tanRadPHISquared * eta2));
   oslEastings = Math.round(e0 + (p * IV) + (Math.pow(p,3) * V) + (Math.pow(p,5) * VI));
   oslNorthings = Math.round(I + (Math.pow(p,2) * II) + (Math.pow(p,4) * III) + (Math.pow(p,6) * IIIA));

   // Conversion errors

   // 50.06574112187924 -5.699894626953322
   // 135261,25033
   // 135256,25014
   // +6, +19

   // 51.35363338966115 1.4443961072966522
   // 639795,167306
   // 639800,167284
   // -5, +22

   // 60.15795987870581 -1.1466271562283679
   // 447367,1141743
   // 447362,1141733
   // +5, +10

   let nCorrect = Math.round(70 - PHI);
   oslNorthings -= nCorrect;
}
//-----------------------------------------------------------------------------------------------------------------------------------------
function oslCaseCorrect(wrongcase)
{
   let correctedCase = '';
   for(let loop=0;loop<wrongcase.length;loop++)
   {
      // capitalise first letter following one of these substrings
      if
      (
         (loop === 0)||
         (wrongcase[loop-1] == ' ')||
         (wrongcase[loop-1] == '(')||
         (wrongcase.substr(loop-3,3) == '-Y-')||
         (wrongcase.substr(loop-4,4) == '-YR-')
      ) correctedCase += wrongcase[loop].toUpperCase();
      else correctedCase += wrongcase[loop].toLowerCase();
   }
   // recapitalise any roman numerals
   correctedCase = correctedCase.replace(' Ii ',' II ');
   correctedCase = correctedCase.replace(' Iii ',' III ');
   correctedCase = correctedCase.replace(' Iv ',' IV ');
   correctedCase = correctedCase.replace(' Vi ',' VI ');
   correctedCase = correctedCase.replace(' Vii ',' VII ');
   return correctedCase;
}
function oslSaintsPreserveUs(oslName)
{
   let nameBits = [];
   if(oslName.indexOf('St ') != -1)
   {
      nameBits = oslName.split('St ');
      oslName = nameBits[0] + 'St. ' + nameBits[1];
   }
   else if(oslName.indexOf('Saint ') != -1)
   {
      nameBits = oslName.split('Saint ');
      oslName = nameBits[0] + 'St. ' + nameBits[1];
   }
   return oslName;
}
function oslWazeifyStreetName(oslName, debugOutput)
{
   let wazeName = '';

   // strip out any HTML encoding added by the server when returning the street name data...
   let textArea = document.createElement('textarea');
   textArea.innerHTML = oslModifyHTML(oslName);
   oslName = textArea.value;

   wazeName = oslCaseCorrect(oslName);
   wazeName = oslSaintsPreserveUs(wazeName);

   let nameoslPieces = wazeName.split(' ');
   if(nameoslPieces.length > 1)
   {
      let dirSuffix = '';
      let namePrefix = '';
      if((nameoslPieces[nameoslPieces.length-1] == 'North')||(nameoslPieces[nameoslPieces.length-1] == 'South')||(nameoslPieces[nameoslPieces.length-1] == 'East')||(nameoslPieces[nameoslPieces.length-1] == 'West'))
      {
         dirSuffix = ' ' + nameoslPieces[nameoslPieces.length-1][0];
         for(let loop=0;loop<nameoslPieces.length-1;loop++) 
         {
            namePrefix += (nameoslPieces[loop] + ' ');
         }
      }
      else
      {
         for(let loop=0;loop<nameoslPieces.length;loop++) 
         {
            namePrefix += (nameoslPieces[loop] + ' ');
         }
      }
      namePrefix = namePrefix.trimRight(1);

      if(debugOutput === true) console.log(oslName);
      // replace road type with abbreviated form
      for(let pass=0;pass<2;pass++)
      {
         for(let loop=0;loop<oslNameAbbreviations.length;loop+=2)
         {
            let abbrPos = namePrefix.lastIndexOf(oslNameAbbreviations[loop]);
            let abbrLen = oslNameAbbreviations[loop].length;
            let npLength = namePrefix.length;
            let npRemaining = npLength - abbrPos;
            if(debugOutput === true) console.log(pass,' ',oslNameAbbreviations[loop],' ',abbrPos,' ',abbrLen,' ',npLength,' ',npRemaining);
            if(abbrPos != -1)
            {
               // make sure the road type we've found comes firstly at the end of the name string, or is suffixed with a space
               // if there's a non-road type at the end of the string (e.g. High Road Eastcote)
               // isn't, then we've actually found a type match within a longer string segment (e.g. The Parkside) and so we
               // should leave it alone...
               if
               (
                  ((pass === 0) && (npRemaining == abbrLen)) ||
                  ((pass == 1) && (namePrefix[abbrPos+abbrLen] == ' '))
               )
               {
                  let preName = namePrefix.substr(0,abbrPos);
                  if((preName.length >= 4) && (preName.lastIndexOf("The") != (preName.length - 4)))
                  {
                     let theName = namePrefix.substr(abbrPos);
                     theName = theName.replace(oslNameAbbreviations[loop],oslNameAbbreviations[loop+1]);
                     wazeName = preName + theName + dirSuffix;
                     return wazeName;
                  }
               }
            }
         }
      }
      wazeName = namePrefix + dirSuffix;
   }
   return wazeName;
}
function oslCPDistance(cpE, cpN, posE, posN)
{
   return Math.round(Math.sqrt(((posE - cpE) * (posE - cpE)) + ((posN - cpN) * (posN - cpN))));
}
function oslGetBBCornerPixels(boxW, boxE, boxS, boxN)
{
   let lonlat_sw = {lonLat: {lon: boxW, lat: boxS}};
   let lonlat_se = {lonLat: {lon: boxE, lat: boxS}};
   let lonlat_nw = {lonLat: {lon: boxW, lat: boxN}};
   let lonlat_ne = {lonLat: {lon: boxE, lat: boxN}};

   let pix_sw = oslSDK.Map.getMapPixelFromLonLat(lonlat_sw);
   let pix_se = oslSDK.Map.getMapPixelFromLonLat(lonlat_se);
   let pix_nw = oslSDK.Map.getMapPixelFromLonLat(lonlat_nw);
   let pix_ne = oslSDK.Map.getMapPixelFromLonLat(lonlat_ne);

   boxE = (pix_ne.x + pix_se.x) / 2;
   boxW = (pix_nw.x + pix_sw.x) / 2;
   boxN = (pix_ne.y + pix_nw.y) / 2;
   boxS = (pix_se.y + pix_sw.y) / 2;

   let boxToleranceWidth = ((boxE - boxW) * 0.05);
   let boxToleranceHeight = ((boxS - boxN) * 0.05);

   boxW -= boxToleranceWidth;
   boxE += boxToleranceWidth;
   boxS += boxToleranceHeight;
   boxN -= boxToleranceHeight;

   boxE = Math.round(boxE);
   boxW = Math.round(boxW);
   boxS = Math.round(boxS);
   boxN = Math.round(boxN);

   // extend width/height of box if the calculated dimension is too small for the box to be readily visible
   if(boxE-boxW < 20)
   {
      boxE += 10;
      boxW -= 10;
   }
   if(boxS-boxN < 20)
   {
      boxS += 10;
      boxN -= 10;
   }

   return [boxW, boxE, boxS, boxN];
}
function oslVisualiseBoundingBox(boxW, boxE, boxS, boxN, mode)
{
   if(oslOSLDiv.style.height == '0px')
   {
      oslBBDiv.innerHTML = oslModifyHTML('');
      return;
   }

   let boxPos = [boxW, boxE, boxS, boxN];

   if((mode == OSL_BBMODE.Match) || (mode == OSL_BBMODE.Other))
   {
      boxPos = oslGetBBCornerPixels(boxW, boxE, boxS, boxN);
   }

   if(mode === OSL_BBMODE.Init)
   {
      oslBBDivInnerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="'+document.getElementById('WazeMap').offsetWidth+'px" height="'+document.getElementById('WazeMap').offsetHeight+'px" version="1.1">';
   }
   else if(mode == OSL_BBMODE.Match)
   {
      oslBBDivInnerHTML += '<rect x="'+boxPos[0]+'" y="'+boxPos[3]+'" width="'+(boxPos[1]-boxPos[0])+'" height="'+(boxPos[2]-boxPos[3])+'" style="fill:yellow;stroke:pink;stroke-width:4;fill-opacity:0.25;stroke-opacity:0.25"/>';
   }
   else if(mode == OSL_BBMODE.Other)
   {
      oslBBDivInnerHTML += '<rect x="'+boxPos[0]+'" y="'+boxPos[3]+'" width="'+(boxPos[1]-boxPos[0])+'" height="'+(boxPos[2]-boxPos[3])+'" style="fill:lightgrey;stroke:grey;stroke-width:4;fill-opacity:0.25;stroke-opacity:0.25"/>';
   }
   else if(mode == OSL_BBMODE.Finalise)
   {
      oslBBDivInnerHTML += '</svg>';
      oslBBDiv.innerHTML = oslModifyHTML(oslBBDivInnerHTML);
   }
}
function oslMergeGazetteerData()
{
   if(typeof(gazetteerData) == "undefined") return false;
   if(oslMergeGazData)
   {
      // We no longer need to inject the gazetteer data as two seperate arrays and then merge them here, 
      // but we do still need to create a local reference to the injected array data, as trying to access
      // it directly as gazetteerData[] throws errors...
      oslGazetteerData = gazetteerData;
      oslMergeGazData = false;
      for(let idx=0;idx<oslGazetteerData.length;idx++)
      {
         oslGazetteerData[idx] = oslSaintsPreserveUs(oslGazetteerData[idx]);
      }
      oslAddLog('gazetteer data loaded, '+oslGazetteerData.length+' entries');
   }
   return true;
}
function oslGetTextWidth(text)
{
   // from https://stackoverflow.com/questions/118241/calculate-text-width-with-javascript/21015393#21015393
   // re-use canvas object for better performance
   let canvas = oslGetTextWidth.canvas || (oslGetTextWidth.canvas = document.createElement("canvas"));
   let context = canvas.getContext("2d");
   context.font = 'bold '+oslNameTextPts+' arial';
   let metrics = context.measureText(text);
   return metrics.width;
}
function oslGetVisibleCityNames()
{
   if(oslMergeGazetteerData() === false) return;

   oslNamesDivInnerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="'+document.getElementById('WazeMap').offsetWidth+'px" height="'+document.getElementById('WazeMap').offsetHeight+'px" version="1.1">';
   if(document.getElementById('_cbGazTagsEnabled').checked === true)
   {
      let showCities = document.getElementById('_cbGazTagsCity').checked;
      let showTowns = document.getElementById('_cbGazTagsTown').checked;
      let showVillages = document.getElementById('_cbGazTagsVillage').checked;
      let showHamlets = document.getElementById('_cbGazTagsHamlet').checked;
      let showOthers = document.getElementById('_cbGazTagsOther').checked;

      for(let idx=0;idx<oslGazetteerData.length;idx++)
      {
         let gazElements = oslGazetteerData[idx].split(':');
         let cnType = gazElements[GAZ_ELM.Type];

         let showTag;
         let tagColour;
         if(cnType == 'C') 
         {
            showTag = showCities;
            tagColour = "#FFFF00";
         }
         else if(cnType == 'T') 
         {
            showTag = showTowns;
            tagColour = "#FF00FF";
         }
         else if(cnType == 'V') 
         {
            showTag = showVillages;
            tagColour = "#FF8080";
         }
         else if(cnType == 'H') 
         {
            showTag = showHamlets;
            tagColour = "#A0A0FF";
         }
         else 
         {
            showTag = showOthers;
            tagColour = "#C0C0C0";
         }

         if(showTag === true)
         {
            let cnEastings = gazElements[GAZ_ELM.CEast];
            let cnNorthings = gazElements[GAZ_ELM.CNorth];
            if
            (
               ((oslVPLeft < cnEastings) && (oslVPRight > cnEastings)) &&
               ((oslVPTop > cnNorthings) && (oslVPBottom < cnNorthings))
            )
            {
               let pix = oslOSGridRefToPixel(cnEastings,cnNorthings);
               let nameLength = oslGetTextWidth(gazElements[GAZ_ELM.Name]);

               oslNamesDivInnerHTML += '<polygon points="';
               oslNamesDivInnerHTML += pix.x+','+pix.y+' ';
               oslNamesDivInnerHTML += (pix.x+oslNameHalfPix)+','+(pix.y-oslNameHalfPix)+' ';
               oslNamesDivInnerHTML += (pix.x+nameLength+oslNameHalfPix+8)+','+(pix.y-oslNameHalfPix)+' ';
               oslNamesDivInnerHTML += (pix.x+nameLength+oslNameHalfPix+8)+','+(pix.y+oslNameHalfPix)+' ';
               oslNamesDivInnerHTML += (pix.x+oslNameHalfPix)+','+(pix.y+oslNameHalfPix)+'" ';
               oslNamesDivInnerHTML += 'fill="'+tagColour+'" fill-opacity="0.75" stroke="black" stroke-opacity="0.75" />';
               
               oslNamesDivInnerHTML += '<text x="'+(pix.x+oslNameHalfPix)+'" y="'+(pix.y+(oslNameHalfPix/2))+'" ';
               oslNamesDivInnerHTML += 'style="font-family:sans-serif;font-size:'+oslNameTextPts+';font-weight:600;fill:black;';
               oslNamesDivInnerHTML += 'fill-opacity:1">'+gazElements[GAZ_ELM.Name]+'</text>';         
            }
         }
      }
   }
   oslNamesDivInnerHTML += '</svg>';
   oslNamesDiv.innerHTML = oslModifyHTML(oslNamesDivInnerHTML);
}
function oslGetNearbyCityNames()
{
   if(oslMergeGazetteerData() === false) return;

   let names = [];
   for(var idx=0;idx<oslGazetteerData.length;idx++)
   {
      let gazElements = oslGazetteerData[idx].split(':');
      let cnEastings = gazElements[GAZ_ELM.CEast];
      let cnNorthings = gazElements[GAZ_ELM.CNorth];
      if((Math.abs(cnNorthings-oslNorthings) <= 5000)&&(Math.abs(cnEastings-oslEastings) <= 5000))
      {
         let dist = oslCPDistance(cnEastings,cnNorthings,oslEastings,oslNorthings);
         if(dist <= 5000)
         {
            names.push((dist * 1000000) + idx);
         }
      }
   }
   if(names.length > 1) names.sort(function(a,b){return a-b;});

   let cityInTopTen = false;
   let matchedOSName = false;
   let matchedIdx = -1;
   let listLength = names.length;
   if(listLength > 10) listLength = 10;

   let listOpt;
   let gElements;
   let gDist;

   let cityName;

   let oOCN = document.getElementById('oslOSCityNames');
   for(idx=0;idx<listLength;idx++)
   {
      gElements = oslGazetteerData[names[idx] % 1000000].split(':');
      gDist = (Math.round(names[idx] / 100000000)/10);

      // Build namestring for entry in the drop-down list - start with the placename :-)
      listOpt = document.createElement('option');
      cityName = gElements[GAZ_ELM.Name];
      listOpt.text = cityName;

      // if the name is neither a city nor unique, append a (county) suffix
      if(gElements[GAZ_ELM.Type] == 'C') cityInTopTen = true;
      else
      {
         if(oslCheckCityNameDuplicates(gElements[GAZ_ELM.Name],1) > 1)
         {
            listOpt.text += ', '+gElements[GAZ_ELM.Area];
         }
      }

      if(sessionStorage.cityNameRB == 'optUseOS')
      {
         if(cityName == sessionStorage.myCity)
         {
            matchedOSName = true;
            matchedIdx = idx;
         }
      }

      // Add place type and distance in [] brackets to allow easy removal later...
      if(gElements[GAZ_ELM.Type] == 'C') listOpt.text += ' [City, ';
      else if(gElements[GAZ_ELM.Type] == 'T') listOpt.text += ' [Town, ';
      else if(gElements[GAZ_ELM.Type] == 'V') listOpt.text += ' [Village, ';
      else if(gElements[GAZ_ELM.Type] == 'H') listOpt.text += ' [Hamlet, ';
      else listOpt.text += ' [Other, ';
      listOpt.text += gDist + 'km]';
      oOCN.add(listOpt,null);
   }

   if((!cityInTopTen) && (names.length > 10))
   {
      idx = 10;
      while((idx < names.length) && (!cityInTopTen))
      {
         gElements = oslGazetteerData[names[idx] % 1000000].split(':');
         if(gElements[GAZ_ELM.Type] == 'C')
         {
            cityInTopTen = true;
            gDist = ' [City, '+(Math.round(names[idx] / 100000000)/10)+'km]';
            listOpt = document.createElement('option');
            listOpt.text = gElements[GAZ_ELM.Name]+gDist;
            oOCN.add(listOpt,null);
            if(sessionStorage.cityNameRB == 'optUseOS')
            {
               if(gElements[GAZ_ELM.Name] == sessionStorage.myCity)
               {
                  matchedOSName = true;
                  matchedIdx = 10;
                  break;
               }
            }
         }
         idx++;
      }
   }

   if(matchedOSName === true) oOCN.options.selectedIndex = matchedIdx;

   if((sessionStorage.cityNameRB == 'optUseOS') && (matchedOSName === false))
   {
      oslAddLog('Selected city name no longer in nearby OS list...');
      alert('City name no longer present in nearby OS data, please reselect');
      sessionStorage.cityNameRB = 'optUseExisting';
      document.getElementById('optUseExisting').checked = true;
   }
}
function oslCheckCityNameDuplicates(cityName, mode)
{
   if(oslMergeGazetteerData() === false) return;

   let cnCount = 0;
   let searchDist = Math.round(oslGazetteerData.length/2);
   let searchIdx = searchDist;
   let hasCounty = false;

   let debugOutput = false;


   // remove county suffix from actual city name string if present
   if(cityName.indexOf('(') != -1)
   {
      cityName = cityName.substr(0,cityName.indexOf('('));
      cityName = cityName.replace(/^\s+|\s+$/g, "");
      hasCounty = true;
   }
   // remove script-appended county suffix from city name held in drop down if present
   if(cityName.indexOf(',') != -1)
   {
      cityName = cityName.substr(0,cityName.indexOf(','));
      cityName = cityName.replace(/^\s+|\s+$/g, "");
   }

   cityName = cityName.toLowerCase();
   cityName = cityName.replace(/-/g, ' ');
   let gazName = '';

   if(debugOutput === true) console.log('scan for duplicates of '+cityName);

   var gazElements = [];
   while((searchDist > 1) && (cityName.localeCompare(gazName) !== 0))
   {
      searchDist = Math.round(searchDist/2);
      gazElements = oslGazetteerData[searchIdx].split(':');
      gazName = gazElements[GAZ_ELM.Name].toLowerCase();
      gazName = gazName.replace(/-/g, ' ');
      if(debugOutput === true) console.log('a: '+searchDist+' '+searchIdx+' '+gazName);
      if(cityName.localeCompare(gazName) > 0) searchIdx += searchDist;
      else if(cityName.localeCompare(gazName) < 0) searchIdx -= searchDist;
      if(searchIdx >= oslGazetteerData.length) searchIdx = oslGazetteerData.length-1;
      if(searchIdx < 0) searchIdx = 0;
   }
   gazElements = oslGazetteerData[searchIdx].split(':');
   gazName = gazElements[GAZ_ELM.Name].toLowerCase();
   gazName = gazName.replace(/-/g, ' ');
   while((searchIdx > 0) && (cityName.localeCompare(gazName) == 0))
   {
      gazElements = oslGazetteerData[--searchIdx].split(':');
      gazName = gazElements[GAZ_ELM.Name].toLowerCase();
      gazName = gazName.replace(/-/g, ' ');
      if(debugOutput === true) console.log('b: '+(searchIdx)+' '+gazName);
   }
   ++searchIdx;
   gazElements = oslGazetteerData[searchIdx].split(':');
   gazName = gazElements[GAZ_ELM.Name].toLowerCase();
   gazName = gazName.replace(/-/g, ' ');
   while((searchIdx < (oslGazetteerData.length - 1)) && (cityName.localeCompare(gazName) > 0))
   {
      ++searchIdx;
      try
      {
         gazElements = oslGazetteerData[searchIdx].split(':');
         gazName = gazElements[GAZ_ELM.Name].toLowerCase();
         gazName = gazName.replace(/-/g, ' ');
         if(debugOutput === true) console.log('c: '+(searchIdx)+' '+gazName);
      }
      catch
      {
         oslAddLog("ERROR THROWN - "+oslGazetteerData[searchIdx]);
      }
   }
   while((cityName.localeCompare(gazName) === 0) && (searchIdx < oslGazetteerData.length))
   {
      cnCount++;
      gazElements = oslGazetteerData[++searchIdx].split(':');
      gazName = gazElements[GAZ_ELM.Name].toLowerCase();
      gazName = gazName.replace(/-/g, ' ');
      if(debugOutput === true) console.log('d: '+(searchIdx)+' '+gazName+' '+cnCount);
   }

   if(mode === 0)
   {
      let newHTML = '';
      if(cnCount === 0) newHTML = '&nbsp;&nbsp;Place name is not in OS data';
      else if(cnCount == 1)
      {
         newHTML = '&nbsp;&nbsp;Place name is unique';
         if(hasCounty) newHTML += '<br>&nbsp;&nbsp;<i>(County) suffix not required</i>';
      }
      else
      {
         newHTML = '&nbsp;&nbsp;Place name is not unique';
      }
      document.getElementById('oslCNInfo').innerHTML = oslModifyHTML(newHTML);
   }
   else return cnCount;
}
function oslHighlightAdjacentSameNameSegments(ldEastings, ldNorthings, ldIgnoreIdx, srcElements)
{
   ldNorthings -= oslLocatorBlockSize;
   ldEastings -= oslLocatorBlockSize;
   for(let x = 0; x < 3; ++x)
   {
      for(let y = 0; y < 3; ++y)
      {
         let arrayName = 'locatorData_'+(ldEastings + (x * oslLocatorBlockSize))+'_'+(ldNorthings + (y * oslLocatorBlockSize));
         oslEvalString = arrayName;
         if(typeof unsafeWindow[arrayName] != "undefined")
         {
            oslBlockData = unsafeWindow[arrayName];
            for(let loop = 0; loop < oslBlockData.length; ++loop)
            {
               if(loop != ldIgnoreIdx)
               {
                  var locatorElements = oslSplitEntry(oslBlockData[loop]);
                  if
                  (
                     (locatorElements[OSL_ELM.RoadName] == srcElements[OSL_ELM.RoadName]) &&
                     (locatorElements[OSL_ELM.RoadNumber] == srcElements[OSL_ELM.RoadNumber]) &&
                     (locatorElements[OSL_ELM.AreaName] == srcElements[OSL_ELM.AreaName])
                  )
                  {
                     oslVisualiseBoundingBox(locatorElements[OSL_ELM.BoundW],locatorElements[OSL_ELM.BoundE],locatorElements[OSL_ELM.BoundS],locatorElements[OSL_ELM.BoundN],OSL_BBMODE.Other);
                  }
               }
            }
         }
      }
   }
}
function oslRadioClick()
{
   let oslElements = document.getElementById('oslRoadNameMatches');
   let selectedName = '';
   let arrayName;

   for(let loop=0;loop<oslElements.childNodes.length;loop++)
   {
      if(oslElements.childNodes[loop].nodeType == 1)
      {
         let tagname = oslElements.childNodes[loop].tagName;
         if(tagname !== null)
         {
            if(tagname == "LABEL")
            {
               if(oslElements.childNodes[loop].childNodes[0].checked)
               {
                  let attr = oslElements.childNodes[loop].childNodes[0].attributes.getNamedItem("id").value;
                  if((attr.indexOf('oslID_') === 0) || (attr.indexOf('alt-oslID_') === 0))
                  {
                     let roadData = '';
                     let oslID = attr.split('_');
                     if(oslID[1] != 'null')
                     {
                        arrayName = 'locatorData_'+oslID[1]+'_'+oslID[2];
                        if(typeof unsafeWindow[arrayName] != "undefined")
                        {                        
                           roadData = unsafeWindow[arrayName][oslID[3]];
                        }
                     }
                     if(roadData == '')
                     {
                        roadData = "null:null";
                     }

                     let locatorElements = oslSplitEntry(roadData);

                     if(locatorElements[OSL_ELM.RoadName] != 'null')
                     {
                        selectedName = locatorElements[OSL_ELM.RoadName]+locatorElements[OSL_ELM.RoadNumber];
                        oslVisualiseBoundingBox(0,0,0,0,OSL_BBMODE.Init);
                        oslVisualiseBoundingBox(locatorElements[OSL_ELM.BoundW],locatorElements[OSL_ELM.BoundE],locatorElements[OSL_ELM.BoundS],locatorElements[OSL_ELM.BoundN],OSL_BBMODE.Match);

                        oslHighlightAdjacentSameNameSegments(oslID[1], oslID[2], oslID[3], locatorElements);
                     }
                     else
                     {
                        oslBBDiv.innerHTML = oslModifyHTML('');
                     }
                  }
               }
            }
         }
      }
   }

   if(selectedName === '')
   {
      oslBBDiv.innerHTML = oslModifyHTML('');
      return;
   }
   oslVisualiseBoundingBox(0,0,0,0,OSL_BBMODE.Finalise);
}
function oslClick()
{
   oslCityName = '';
   oslCountyName = '';
   oslUsingNewName = false;
   if(document.getElementById('optUseNewManual').checked)
   {
      oslCityName = oslCaseCorrect(document.getElementById('myCityName').value);
      oslUsingNewName = true;
   }
   else if(document.getElementById('optUseExistingWME').checked)
   {
      let oWCN = document.getElementById('oslWMECityNames');
      if(oWCN.options.selectedIndex !== -1)
      {
         oslCityName = oWCN.options[oWCN.options.selectedIndex].text;
         if(oslCityName.indexOf(', ') !== -1)
         {
            oslCountyName = oslCityName.split(', ')[1];
            oslCityName = oslCityName.split(', ')[0];
         }
         oslUsingNewName = true;
      }
   }
   else if(document.getElementById('optUseOS').checked)
   {
      let oOCN = document.getElementById('oslOSCityNames');
      if(oOCN.options.selectedIndex !== -1)
      {
         oslCityName = oOCN.options[oOCN.options.selectedIndex].text;
         oslCityName = oslCityName.substring(0,oslCityName.indexOf('[')-1);
         if(oslCityName.indexOf(', ') !== -1)
         {
            oslCountyName = oslCityName.split(', ')[1];
            oslCityName = oslCityName.split(', ')[0];
         }
         oslUsingNewName = true;
      }
   }
   if(sessionStorage.myCity === '')
   {
      oslAddLog('Update city name position at '+oslEastings+'x'+oslNorthings);
      sessionStorage.cityChangeEastings = oslEastings;
      sessionStorage.cityChangeNorthings = oslNorthings;
   }

   if(oslCountyName !== '')
   {
      sessionStorage.myCity = oslCityName+', '+oslCountyName;
   }
   else
   {
      sessionStorage.myCity = oslCityName;
   }

   oslUseName = false;
   if((oslCityName.length > 0) && oslUsingNewName)
   {
      oslCheckCityNameDuplicates(oslCityName,0);

      if(oslCityName != sessionStorage.prevCityName)
      {
         oslAddLog('Change of city name at '+oslEastings+'x'+oslNorthings);
         sessionStorage.cityChangeEastings = oslEastings;
         sessionStorage.cityChangeNorthings = oslNorthings;
         sessionStorage.prevCityName = oslCityName;
         oslUseName = true;
      }
      else
      {
         let nameChangeDist = oslCPDistance(oslEastings,oslNorthings,sessionStorage.cityChangeEastings,sessionStorage.cityChangeNorthings);
         oslAddLog('Current name was set '+nameChangeDist+'m away from segment location');
         if(nameChangeDist > 1000)
         {
            oslAddLog('Distance exceeds 1km threshold, name verification required...');
            if(confirm('Confirm continued use of this city name'))
            {
               oslAddLog('Confirm city name at '+oslEastings+'x'+oslNorthings);
               sessionStorage.cityChangeEastings = oslEastings;
               sessionStorage.cityChangeNorthings = oslNorthings;
               oslUseName = true;
            }
         }
         else
         {
            oslUseName = true;
         }
      }
   }

   let oslElements = document.getElementById('oslRoadNameMatches');
   let arrayName;
   for(let loop=0;loop<oslElements.childNodes.length;loop++)
   {
      if(oslElements.childNodes[loop].nodeType == 1)
      {
         let tagname = oslElements.childNodes[loop].tagName;
         if(tagname !== null)
         {
            if(tagname == "LABEL")
            {
               let rbElement = oslElements.childNodes[loop].childNodes[0];
               if((rbElement.name == "oslChoice") && (rbElement.checked))
               {
                  let attr = rbElement.attributes.getNamedItem("id").value;
                  let useMain = (attr.indexOf('oslID_') === 0);
                  oslUseAlt = (attr.indexOf('alt-oslID_') === 0);
                  if((useMain === true) || (oslUseAlt === true))
                  {
                     let roadData = '';
                     let oslID = attr.split('_');
                     if(oslID[1] != 'null')
                     {
                        arrayName = 'locatorData_'+oslID[1]+'_'+oslID[2];
                        if(typeof unsafeWindow[arrayName] != "undefined")
                        {
                           roadData = unsafeWindow[arrayName][oslID[3]];
                        }
                     }
                     
                     if(roadData == '')
                     {
                        oslAddLog(arrayName + "not found");
                        for(let i = 0; i < OSL_ELM.MAX; ++i)
                        {
                           roadData += ':';
                        }
                     }
                     oslLocatorElements = oslSplitEntry(roadData);

                     oslRenameSegments();
                  }
               }
            }
         }
      }
   }
}

function oslGetSegmentIDs()
{
   let selectedItems = W.selectionManager.getSelectedWMEFeatures();
   let segIDs = [];
   let allSegments = true;
   for(let i = 0; i < selectedItems.length; ++i)
   {
      if(selectedItems[i].featureType === "segment")
      {
         segIDs.push(selectedItems[i].id);
      }
      else
      {
         allSegments = false;
      }
   }
   if(allSegments === false)
   {
      segIDs = [];
   }
   return segIDs;
}
function oslGetNewStreetName(getPri)
{
   let roadName = "";
   let oslName = oslLocatorElements[OSL_ELM.RoadNumber];
   if((oslLocatorElements[OSL_ELM.RoadName].length > 0)&&(oslLocatorElements[OSL_ELM.RoadNumber].length > 0)) 
   {
      oslName += ' - ';
   }

   if(oslUseAlt === true)
   {
      getPri = !getPri;
   }
   if(getPri === true)
   {
      roadName = oslLocatorElements[OSL_ELM.RoadName];
   }
   else
   {
      roadName = oslLocatorElements[OSL_ELM.AltName];
      if(roadName.length === 0)
      {
         // Don't return anything for an empty alternate name
         oslName = null;
      }
   }
   if((oslName !== null) && (roadName.length > 0))
   {
      oslName += oslWazeifyStreetName(roadName, false);
      oslPrevStreetName = oslName;
   }

   return oslName;
}
function oslUpdateCityNameSelectionTracking()
{
   if(document.getElementById('optUseNewManual').checked === true)
   {
      sessionStorage.cityNameRB = 'optUseNewManual';
   }
   else if(document.getElementById('optUseExistingWME').checked === true)
   {
      sessionStorage.cityNameRB = 'optUseExistingWME';
   }
   else if(document.getElementById('optUseOS').checked === true)
   {
      sessionStorage.cityNameRB = 'optUseOS';
   }
   else if(document.getElementById('optClearExisting').checked === true)
   {
      sessionStorage.cityNameRB = 'optClearExisting';
   }
   else
   {
      sessionStorage.cityNameRB = 'optUseExisting';
   }
}
function oslGetCityIDForSegment(segID)
{
   // Obtain an ID either for an existing city or a newly created on, matching what
   // the user has selected for the given segment.  
   //
   // If the user has opted to select a new name from the script UI, oslUseName will
   // have been set to true, and oslCityName set to the new name, by the time we get
   // here.  So we only need to do a little bit of extra work here if the user has
   // either opted to retain the existing name or clear it entirely.
   if(oslUseName === false)
   {
      if(document.getElementById('optClearExisting').checked === true)
      {
         // Clear the name, or...
         oslCityName = "";
      }
      else
      {
         // ...use the name already on the segment
         let segAddr = oslSDK.DataModel.Segments.getAddress({segmentId:segID});
         if(segAddr.city !== null)
         {
            oslCityName = segAddr.city.name;
         }
         else
         {
            oslCityName = "";
         }
      }
   }
   // Now we know what the city name string should be, we can do a lookup to find
   // the corresponding ID...
   let city = oslSDK.DataModel.Cities.getCity({cityName:oslCityName});
   if(city === null)
   {
      // City name doesn't already exist, so create it...
      city = oslSDK.DataModel.Cities.addCity({cityName:oslCityName});
   }
   return city.id;
}
function oslGetStreetID(streetName, cityID)
{
   let street = oslSDK.DataModel.Streets.getStreet({streetName:streetName,cityId:cityID});
   if(street === null)
   {
      street = oslSDK.DataModel.Streets.addStreet({streetName:streetName,cityId:cityID});
   }
   return street.id;
}
function oslRenameSegments()
{
   let segIDs = oslGetSegmentIDs();
   if(segIDs.length !== 0)
   {
      oslUpdateCityNameSelectionTracking();

      // Primary and secondary (if selected) street names will be the same for all selected segments
      let priStreetName = oslGetNewStreetName(true);
      let altStreetName = oslGetNewStreetName(false);

      // For each selected segment...
      for(let i = 0; i < segIDs.length; ++i)
      {
         let segID = segIDs[i];

         // Clear any altnames first
         oslSDK.DataModel.Segments.updateAddress({segmentId:segID,alternateStreetIds:[]});
         // Get a city ID
         let cityID = oslGetCityIDForSegment(segID);
         // Get street IDs for the primary (and alternate if required)
         let priStreetID = oslGetStreetID(priStreetName, cityID);
         if(altStreetName !== null)
         {
            let altStreetID = oslGetStreetID(altStreetName, cityID);
            oslSDK.DataModel.Segments.updateAddress({segmentId:segID,primaryStreetId:priStreetID,alternateStreetIds:[altStreetID]});
         }
         else
         {
            oslSDK.DataModel.Segments.updateAddress({segmentId:segID,primaryStreetId:priStreetID});
         }
      }
   }
}

function oslMatch(oslLink, oslArea, oslRadioID, oslAltRadioID)
{
   this.oslLink = oslLink;
   this.oslArea = oslArea;
   this.oslRadioID = oslRadioID;
   this.oslAltRadioID = oslAltRadioID;
}
function oslSortCandidates(a,b)
{
   let x = a.oslArea;
   let y = b.oslArea;
   return((x<y) ? -1 : ((x>y) ? 1 : 0));
}
function oslCityNameKeyup()
{
   oslCheckCityNameDuplicates(oslCaseCorrect(document.getElementById('myCityName').value),0);
   document.getElementById('optUseNewManual').checked = true;
}
function oslSelectWMEName()
{
   let oWCN = document.getElementById('oslWMECityNames');
   if(oWCN.options.selectedIndex !== -1)
   {
      let cityName = oWCN.options[oWCN.options.selectedIndex].text;
      oslCheckCityNameDuplicates(cityName,0);
      document.getElementById('optUseExistingWME').checked = true;
   }
}
function oslSelectOSName()
{
   let oOCN = document.getElementById('oslOSCityNames');
   if(oOCN.options.selectedIndex !== -1)
   {
      let cityName = oOCN.options[oOCN.options.selectedIndex].text;
      cityName = cityName.substring(0,cityName.indexOf('[')-1);
      document.getElementById('optUseOS').checked = true;
      document.getElementById('oslCNInfo').innerHTML = oslModifyHTML('');
   }
}
function oslBlockCacheObj(blockName)
{
   this.blockName = blockName;
   this.lastAccessed = Math.floor(new Date().getTime() / 1000);
}
function oslLoadBlocks()
{
   for(let i = 0; i < oslBlocksToLoad.length;)
   {
      // inject block data
      let script = document.createElement("script");
      script.setAttribute('type','text/javascript');
      script.setAttribute('charset','UTF-8');
      script.src = oslBlocksToLoad[i];
      document.head.appendChild(script);
      oslLoadingMsg = true;
      oslBlockCacheList.push(new oslBlockCacheObj(oslBlocksToLoad[i+1]));
      oslAddLog('Loading '+oslBlocksToLoad[i+1]);
      i += 2;
   }
}
function oslSplitEntry(entryString)
{
   let elements = entryString.split(":");
   if(entryString != "null:null")
   {
      let ts=elements[OSL_ELM.Geometry].split(/[ ]+/).map(Number);
      let tsLon=[];
      let tsLat=[];
      ts.forEach((a,i) => {(i % 2 === 0) ? tsLon.push(a) : tsLat.push(a);});
      elements[OSL_ELM.BoundE] = Math.max(...tsLon);
      elements[OSL_ELM.BoundW] = Math.min(...tsLon);
      elements[OSL_ELM.BoundN] = Math.max(...tsLat);
      elements[OSL_ELM.BoundS] = Math.min(...tsLat);
   }

   return elements;
}
function oslToOSGrid(lat, lon, mode)
{
   if(oslInUK === false) return;

   if(oslMousePixelpos == null) return;

   // Correct mouse X pos if map viewport width has changed (e.g. when clicking on segment causing sidepanel to open...)
   let mvpWidth = oslSDK.Map.getMapViewportElement().getBoundingClientRect().width;
   let vpWidthDelta = (oslLastViewportWidth - mvpWidth);
   oslLastViewportWidth = mvpWidth;
   oslMousePixelpos.x -= vpWidthDelta;

   if((lat !== 0) && (mode != OSL_MODE.OpenRoads))
   {
      if(mode == OSL_MODE.NameCheck)
      {
         oslEastings = lat;
         oslNorthings = lon;
      }
      else
      {
         oslLatitude = lat;
         oslLongitude = lon;
         oslWGStoOSGB(lon, lat);
      }
   }

   if((mode == OSL_MODE.OpenNames) || (mode == OSL_MODE.NameCheck))
   {
      let eBlock;
      let nBlock;

      // determine which grid block contains the current mouse position
      let eBlock_point = (Math.floor(oslEastings/oslLocatorBlockSize)) * oslLocatorBlockSize;
      let nBlock_point = (Math.floor(oslNorthings/oslLocatorBlockSize)) * oslLocatorBlockSize;
      let candidates = [];
      oslBlocksToLoad = [];
      let arrayName;
      let oslEvalString;

      for(let x = -1; x < 2; x++)
      {
         for(let y = -1; y < 2; y++)
         {
            eBlock = (eBlock_point + (oslLocatorBlockSize * x));
            nBlock = (nBlock_point + (oslLocatorBlockSize * y));
            // check we're within the outer bounds of the current OS dataset...
            if
            (
               (eBlock >= 64000) &&
               (eBlock <= 655999) &&
               (nBlock >= 8000) &&
               (nBlock <= 1214999)
            )
            {
               // check to see if there's a corresponding array already loaded...
               arrayName = 'locatorData_'+eBlock+'_'+nBlock;
               if(typeof unsafeWindow[arrayName] == "undefined")
               {
                  // create a blank placeholder which will get replaced by the actual data if the array is present on the server...
                  unsafeWindow[arrayName] = [];
                  
                  oslBlocksToLoad.push(oslBlockPath+Math.floor(eBlock / 100000)+'/'+Math.floor(nBlock / 100000)+'/'+arrayName+'.user.js');
                  oslBlocksToLoad.push(arrayName);
               }
            }
         }
      }

      if(oslBlocksToLoad.length > 0)
      {
         oslLoadBlocks();
      }

      candidates = [];
      if(mode == OSL_MODE.OpenNames) candidates[candidates.length++] = new oslMatch('<label style="display:inline;"><input type="radio" name="oslChoice" id="oslID_null_null_null" />Un-named segment</label><br>',1000000000000,'oslID_null_null_null',null);

      for(let x = -1; x < 2; x++)
      {
         for(let y = -1; y < 2; y++)
         {
            eBlock = (eBlock_point + (oslLocatorBlockSize * x));
            nBlock = (nBlock_point + (oslLocatorBlockSize * y));

            // check we're within the outer bounds of the current OS dataset...
            if ((eBlock >= 64000) && (eBlock <= 655999) && (nBlock >= 8000) && (nBlock <= 1214999))
            {
               arrayName = 'locatorData_'+eBlock+'_'+nBlock;
               oslEvalString = arrayName;
               if(typeof unsafeWindow[arrayName] != "undefined")
               {
                  oslLoadingMsg = false;
                  // yes...
                  if((eBlock != oslEvalEBlock) || (nBlock != oslEvalNBlock))
                  {
                     oslEvalEBlock = eBlock;
                     oslEvalNBlock = nBlock;
                     oslBlockData = unsafeWindow['locatorData_'+eBlock+'_'+nBlock];
                  }

                  for (let bcObj in oslBlockCacheList)
                  {
                     if(oslBlockCacheList[bcObj].blockName == arrayName)
                     {
                        oslBlockCacheList[bcObj].lastAccessed = Math.floor(new Date().getTime() / 1000);
                     }
                  }

                  let preselect = false;

                  for(let loop = 0;loop < oslBlockData.length; loop++)
                  {
                     let locatorElements = [];
                     // for each entry in the array, test the centrepoint position to see if it lies within the bounding box for that entry
                     // note that we allow a 30m tolerance on all sides of the box to allow for inaccuracies in the latlon->gridref conversion,
                     // and to increase the chance of a successful match when the road runs E-W or N-S and thus has a long but narrow bounding box

                     locatorElements = oslSplitEntry(oslBlockData[loop]);

                     if((locatorElements[OSL_ELM.RoadName].length > 0) || (locatorElements[OSL_ELM.RoadNumber].length > 0))
                     {
                        let tolE;
                        let tolN;
                        if(mode == OSL_MODE.NameCheck)
                        {
                           // wider tolerance when doing a namecheck lookup, to reduce falsely flagging roads as being mis-named
                           tolE = 20;
                           tolN = 30;
                        }
                        else
                        {
                           // tighter tolerance when doing other lookups
                           tolE = 10;
                           tolN = 10;
                        }

                        let streetName = '';
                        if(locatorElements[OSL_ELM.RoadNumber].length > 0)
                        {
                           streetName += locatorElements[OSL_ELM.RoadNumber];
                           if(locatorElements[OSL_ELM.RoadName].length > 0)
                           {
                              streetName += ' - ';
                           }
                        }
                        streetName += oslWazeifyStreetName(locatorElements[OSL_ELM.RoadName], false);

                        let altName = '';
                        if(locatorElements[OSL_ELM.AltName] != '')
                        {
                           if(locatorElements[OSL_ELM.RoadNumber].length > 0)
                           {
                              altName += locatorElements[OSL_ELM.RoadNumber];
                              if(locatorElements[OSL_ELM.AltName].length > 0)
                              {
                                 altName += ' - ';
                              }
                           }
                           altName += oslWazeifyStreetName(locatorElements[OSL_ELM.AltName], false);
                        }

                        if(mode == OSL_MODE.OpenNames)
                        {
                           // Name search from mouse position...
                           let bbPix = oslGetBBCornerPixels(parseFloat(locatorElements[OSL_ELM.BoundW]), parseFloat(locatorElements[OSL_ELM.BoundE]), parseFloat(locatorElements[OSL_ELM.BoundS]), parseFloat(locatorElements[OSL_ELM.BoundN]));
                           bbPix[0] -= tolE;
                           bbPix[1] += tolE;
                           bbPix[2] += tolN;
                           bbPix[3] -= tolN;

                           if((oslMousePixelpos.x >= bbPix[0])&&(oslMousePixelpos.x <= bbPix[1])&&(oslMousePixelpos.y <= bbPix[2])&&(oslMousePixelpos.y >= bbPix[3]))
                           {
                              let area = ((bbPix[1] - bbPix[0]) * (bbPix[2] - bbPix[3]));

                              let radioID = 'oslID_'+eBlock+'_'+nBlock+'_'+loop;
                              let altRadioID = null;
                              let oslLink = '<label style="display:inline;"><input type="radio" name="oslChoice" id="'+radioID+'"';
                              if((streetName == oslPrevStreetName)&&(preselect === false))
                              {
                                 oslLink += 'checked="true"';
                                 preselect = true;
                              }
                              oslLink += '/>';
                              oslLink += streetName+'&nbsp;&nbsp;[<i>'+locatorElements[OSL_ELM.AreaName]+'</i>]</label>';

                              if(altName != '')
                              {
                                 altRadioID = 'alt-'+radioID;
                                 oslLink += '<br>&nbsp;<label style="display:inline;"><input type="radio" name="oslChoice" id="'+altRadioID+'"';
                                 if((altName == oslPrevStreetName)&&(preselect === false))
                                 {
                                    oslLink += 'checked="true"';
                                    preselect = true;
                                 }
                                 oslLink += '/>';
                                 oslLink += '<i>Alt name: '+altName+'</i></label>';
                              }

                              if(locatorElements[OSL_ELM.Form] == 'Collapsed Dual Carriageway')
                              {
                                 locatorElements[OSL_ELM.Form] = 'Dual Carriageway';
                              }

                              oslLink += '<br>&nbsp;<i>'+oslRoadClassifications[locatorElements[OSL_ELM.Classification]] + ' - ';
                              oslLink += oslRoadFunctions[locatorElements[OSL_ELM.Function]] + ' - ' + oslFormsOfWay[locatorElements[OSL_ELM.Form]];
                              if(locatorElements[OSL_ELM.Structure] !== '')
                              {
                                 oslLink += ' ' + oslRoadStructures[locatorElements[OSL_ELM.Structure]];
                              }
                              if(locatorElements[OSL_ELM.IsPrimary] == 'Y')
                              {
                                 oslLink += ' (PRN)';
                              }
                              if(locatorElements[OSL_ELM.IsTrunk] == 'Y')
                              {
                                 oslLink += ' (TRN)';
                              }
                              oslLink += '</i><br>';
                              candidates[candidates.length++] = new oslMatch(oslLink,area,radioID,altRadioID);
                           }
                        }
                        else if(mode == OSL_MODE.NameCheck)
                        {
                           // NameCheck comparisons...
                           let bbW = parseFloat(locatorElements[OSL_ELM.BoundW]) - tolE;
                           let bbE = parseFloat(locatorElements[OSL_ELM.BoundE]) + tolE;
                           let bbS = parseFloat(locatorElements[OSL_ELM.BoundS]) - tolN;
                           let bbN = parseFloat(locatorElements[OSL_ELM.BoundN]) + tolN;

                           for(let i=0;i<oslOSLNCSegments.length;i++)
                           {
                              if(oslOSLNCSegments[i].match === false)
                              {
                                 if
                                    (
                                       ((oslOSLNCSegments[i].lonA >= bbW) && (oslOSLNCSegments[i].lonA <= bbE)) &&
                                       ((oslOSLNCSegments[i].lonB >= bbW) && (oslOSLNCSegments[i].lonB <= bbE)) &&
                                       ((oslOSLNCSegments[i].latA >= bbS) && (oslOSLNCSegments[i].latA <= bbN)) &&
                                       ((oslOSLNCSegments[i].latB >= bbS) && (oslOSLNCSegments[i].latB <= bbN))
                                    )
                                 {
                                    if((oslOSLNCSegments[i].streetname == streetName) || (oslOSLNCSegments[i].streetname == altName)) oslOSLNCSegments[i].match = true;
                                 }
                              }
                           }
                        }
                     }
                  }
               }
            }
         }
      }

      if(mode == OSL_MODE.OpenNames)
      {
         let newHTML = '<b>Matches at '+oslEastings+', '+oslNorthings+'</b>';

         if(candidates.length > 0)
         {
            let btnStyle = "cursor:pointer;";
            btnStyle += "font-size:14px;";
            btnStyle += "border: thin outset black;";
            btnStyle += "padding:2px 10px 2px 10px;";
            btnStyle += "background: #ccccff;";
            newHTML += '<div style="margin:10px;"><span id="oslSelect" style="'+btnStyle+'">';
            newHTML += 'Apply to Properties';
            newHTML += '</span></div>';
            if(candidates.length > 1) candidates.sort(oslSortCandidates);
            for(let loop=0;loop<candidates.length;loop++)
            {
               newHTML += candidates[loop].oslLink;
            }
            newHTML += '<br>City name:<br>';
            newHTML += '<label style="display:inline;"><input type="radio" name="oslCityNameOpt" id="optUseExisting"/>Use existing segment name(s)</label><br>';
            newHTML += '<label style="display:inline;"><input type="radio" name="oslCityNameOpt" id="optClearExisting" />Clear existing segment name(s)</label><br>';
            newHTML += '<label style="display:inline;"><input type="radio" name="oslCityNameOpt" id="optUseNewManual" />Use new name:</label><br>';
            newHTML += '&nbsp;&nbsp;<input id="myCityName" style="font-size:14px; line-height:16px; height:22px; margin-bottom:4px; transition:none; focus:none; box-shadow:none" type="text"';
            if(sessionStorage.cityNameRB == 'optUseNewManual') newHTML += 'value="'+sessionStorage.myCity+'"/><br>';
            else newHTML += 'value=""/><br>';
            newHTML += '<label style="display:inline;"><input type="radio" name="oslCityNameOpt" id="optUseExistingWME" />Use name from map:</label><br>';
            newHTML += '&nbsp;&nbsp;<select id="oslWMECityNames"></select><br>';
            newHTML += '<label style="display:inline;"><input type="radio" name="oslCityNameOpt" id="optUseOS" />Use name from OS Gazetteer:</label><br>';
            newHTML += '&nbsp;&nbsp;<select id="oslOSCityNames"></select><br>';
            newHTML += '<div id="oslCNInfo"></div><br>';
            oslRoadNameMatches.innerHTML = oslModifyHTML(newHTML);
            oslGetNearbyCityNames();
            let oWCN = document.getElementById('oslWMECityNames');
            var nameList = [];
            let mcLonLat = oslSDK.Map.getMapCenter();
            let mc = oslConvertLonLatXY(mcLonLat.lon, mcLonLat.lat);
            let cityObj = oslSDK.DataModel.Cities.getAll();
            for(let i = 0; i < cityObj.length; ++i)
            {
               let cityAttrs = cityObj[i];
               if(cityAttrs.countryId === 234)
               {
                  let cityname = cityAttrs.name;
                  if(cityname !== '')
                  {
                     // WME now pollutes W.model.cities.objects with a myriad of places entirely unconnected to
                     // anything in the current WME view, issue tracker list etc.  The countryID check above
                     // manages to at least filter out the obviously useless entries, however that still leaves
                     // all the "local" ones which may well be at t'other end of the country and thus local only
                     // insofar as they're within the UK somewhere...
                     //
                     // To therefore deal with this, and continue presenting a genuinely useful list of potential
                     // city names to the user, we now perform a further distance-based filtering step to cull
                     // any entries for places more than 10km away from the present centrepoint of the WME view.                     
                     let cLL = oslConvertLonLatXY(cityAttrs.geometry.coordinates[0], cityAttrs.geometry.coordinates[1]);
                     let diffX = mc.x - cLL.x;
                     let diffY = mc.y - cLL.y;
                     let distToSquared = (diffX * diffX) + (diffY * diffY);
                     if(distToSquared < (10000 * 10000))
                     {
                        let county = oslSDK.DataModel.States.getById({stateId: cityAttrs.stateId});
                        if(county !== null)
                        {
                           cityname += ', ' + county.name;
                        }
                        nameList.push(cityname);
                     }
                  }
               }
            }
            nameList.sort();
            let matchedWMEName = false;
            for(let i=0; i<nameList.length; i++)
            {
               let listOpt = document.createElement('option');
               listOpt.text = nameList[i];
               oWCN.add(listOpt,null);
               if(sessionStorage.cityNameRB == 'optUseExistingWME')
               {
                  if(nameList[i] == sessionStorage.myCity)
                  {
                     oWCN.options.selectedIndex = i;
                     matchedWMEName = true;
                  }
               }
            }
            if((!matchedWMEName) && (sessionStorage.cityNameRB == 'optUseExistingWME'))
            {
               oWCN.options.selectedIndex = 0;
            }
            document.getElementById('oslSelect').addEventListener("click", oslClick, true);
            document.getElementById('oslWMECityNames').addEventListener("click", oslSelectWMEName, true);
            document.getElementById('optUseExistingWME').addEventListener("click", oslSelectWMEName, true);
            document.getElementById('oslOSCityNames').addEventListener("click", oslSelectOSName, true);
            document.getElementById('optUseOS').addEventListener("click", oslSelectOSName, true);
            document.getElementById('myCityName').addEventListener("keyup", oslCityNameKeyup, true);
            document.getElementById('optUseNewManual').addEventListener("click", oslCityNameKeyup, true);
            for(let loop=0;loop<candidates.length;loop++)
            {
               document.getElementById(candidates[loop].oslRadioID).addEventListener("click", oslRadioClick, true);
               if(candidates[loop].oslAltRadioID != null)
               {
                  document.getElementById(candidates[loop].oslAltRadioID).addEventListener("click", oslRadioClick, true);
               }
            }

            document.getElementById(sessionStorage.cityNameRB).checked = true;
            oslKeepUIVisible();
         }
         else oslRoadNameMatches.innerHTML = oslModifyHTML(newHTML);
      }
   }
   if(mode == OSL_MODE.OpenRoads)
   {
      // OpenRoads check
      let eastingsLeft = (Math.floor(oslVPLeft/oslLocatorBlockSize) - 1) * oslLocatorBlockSize;
      let eastingsRight = (Math.ceil(oslVPRight/oslLocatorBlockSize) + 1) * oslLocatorBlockSize;
      let northingsTop = (Math.ceil(oslVPTop/oslLocatorBlockSize) + 1) * oslLocatorBlockSize;
      let northingsBottom = (Math.floor(oslVPBottom/oslLocatorBlockSize) - 1) * oslLocatorBlockSize;

      let highlightMode = OSL_ROADRENDERER.Init;

      for(let eLoop = eastingsLeft; eLoop <= eastingsRight; eLoop += oslLocatorBlockSize)
      {
         for(let nLoop = northingsBottom; nLoop <= northingsTop; nLoop += oslLocatorBlockSize)
         {
            oslHighlightOpenRoads(eLoop,nLoop,highlightMode);
            highlightMode = OSL_ROADRENDERER.Render;
         }
      }
      oslHighlightOpenRoads(0,0,OSL_ROADRENDERER.Finalise);
   }

   else return '?e='+oslEastings+'&n='+oslNorthings;
}
function oslRemoveDirSuffix(currentName, dirSuffix)
{
   let dPos = currentName.indexOf(dirSuffix);
   if(dPos != -1)
   {
      let dLength = dirSuffix.length;
      currentName = currentName.substr(0,dPos) + currentName.substr(dPos+dLength);
   }
   return currentName;
}
function oslNameCheckTrigger()
{
   oslOSLNameCheckTimer = 2;
}
function oslNameComparison()
{
   for(;oslONC_E<=oslEBlock_max;)
   {
      for(;oslONC_N<=oslNBlock_max;)
      {
         oslToOSGrid(oslONC_E*oslLocatorBlockSize, oslONC_N*oslLocatorBlockSize, OSL_MODE.NameCheck);
         if(oslLoadingMsg === true)
         {
            window.setTimeout(oslNameComparison,500);
            return;
         }
         oslONC_N++;
      }
      oslONC_N = oslNBlock_min;
      oslONC_E++;
   }
   for(let i=0;i<oslOSLNCSegments.length;i++)
   {
      if(oslOSLNCSegments[i].match === false)
      {
         let pline = oslOSLNCSegments[i].pline;
         pline.setAttribute("stroke","#000000");
         pline.setAttribute("stroke-opacity","0.5");
         pline.setAttribute("stroke-width","10");
         pline.setAttribute("stroke-dasharray","none");
      }
   }
}
function oslNCCandidateNew(pline, lonA, latA, lonB, latB, streetname)
{
   this.pline = pline;
   this.lonA = lonA;
   this.latA = latA;
   this.lonB = lonB;
   this.latB = latB;
   this.streetname = streetname;
   this.match = false;
}
function oslNCStateChange()
{
   if(document.getElementById('_cbNCEnabled').checked === false)
   {
      let segs = oslSDK.DataModel.Segments.getAll();
      for(let i = 0; i < segs.length; ++i)
      {
         let pline = oslSDK.Map.getFeatureDomElement({featureId: segs.id, layerName: 'segments'});
         if(pline !== null)
         {
            pline.setAttribute("stroke-width","5");
            pline.setAttribute("stroke","#dd7700");
            pline.setAttribute("stroke-opacity","0.001");
            pline.setAttribute("stroke-dasharray","none");
         }
      }
   }
   else
   {
      if(oslSDK.Map.getZoomLevel() >= 16) oslNameCheck();
   }
}
function oslOpenRoadsStateChange(e)
{
   oslMapIsStaticProcessing();
   oslUpdateHighlightCBs(e.srcElement.id);
}
function oslNameCheck()
{
   if((document.getElementById('_cbNCEnabled').checked === false) || (oslSDK.Map.getZoomLevel() < 16)) return;

   let geoCenter = oslSDK.Map.getMapCenter();
   geoCenter = oslConvertLonLatXY(geoCenter.lon, geoCenter.lat);
   oslToOSGrid(geoCenter.y, geoCenter.x, OSL_MODE.Conversion);

   if(oslLoadingMsg === true)
   {
      window.setTimeout(oslNameCheck,500);
      return;
   }

   oslEBlock_min = 99999;
   oslEBlock_max = -1;
   oslNBlock_min = 99999;
   oslNBlock_max = -1;

   let mapExtents = oslGetExtent();
   let ignoreSegment;
   oslOSLNCSegments = [];

   for(let segObj in W.model.segments.objects)
   {
      if(W.model.segments.objects.hasOwnProperty(segObj))
      {
         ignoreSegment = false;
         let seg = W.model.segments.objects[segObj];
         let segRT = seg.attributes.roadType;
         let segBounds = seg.getOLGeometry().getBounds();

         if
         (
            (segBounds.left > mapExtents.right) ||
            (segBounds.right < mapExtents.left) ||
            (segBounds.top < mapExtents.bottom) ||
            (segBounds.bottom > mapExtents.top)
         )
         {
            // ignore segment as it's not visible...
            ignoreSegment = true;
         }
         if
         (
            (segRT < 1) ||
            ((segRT > 3) && (segRT < 6)) ||
            ((segRT > 8) && (segRT < 17)) ||
            ((segRT > 17) && (segRT < 20)) ||
            (segRT > 21)
         )
         {
            // ignore segment as it's non-driveable...
            ignoreSegment = true;
         }

         if(ignoreSegment === false)
         {
            let streetObj = W.model.streets.objects[seg.attributes.primaryStreetID];
            if(streetObj !== undefined)
            {
               let currentName = streetObj.attributes.name;
               let pline = W.userscripts.getFeatureElementByDataModel(seg);

               if((currentName !== null) && (pline !== null))
               {
                  currentName = oslRemoveDirSuffix(currentName,' (N)');
                  currentName = oslRemoveDirSuffix(currentName,' (S)');
                  currentName = oslRemoveDirSuffix(currentName,' (E)');
                  currentName = oslRemoveDirSuffix(currentName,' (W)');
                  currentName = oslRemoveDirSuffix(currentName,' (CW)');
                  currentName = oslRemoveDirSuffix(currentName,' (ACW)');

                  let geoComp = seg.getOLGeometry().components[0];
                  let endPointA = oslConvertXYLonLat(geoComp.x, geoComp.y);
                  oslToOSGrid(endPointA.lat, endPointA.lon, OSL_MODE.Conversion);
                  let eBlock = Math.floor(oslEastings/oslLocatorBlockSize);
                  let nBlock = Math.floor(oslNorthings/oslLocatorBlockSize);
                  if(eBlock < oslEBlock_min) oslEBlock_min = eBlock;
                  if(eBlock > oslEBlock_max) oslEBlock_max = eBlock;
                  if(nBlock < oslNBlock_min) oslNBlock_min = nBlock;
                  if(nBlock > oslNBlock_max) oslNBlock_max = nBlock;
                  geoComp = seg.getOLGeometry().components[seg.getOLGeometry().components.length-1];
                  let endPointB = oslConvertXYLonLat(geoComp.x, geoComp.y);
                  oslToOSGrid(endPointB.lat, endPointB.lon, OSL_MODE.Conversion);
                  oslOSLNCSegments.push(new oslNCCandidateNew(pline, endPointA.lon, endPointA.lat, endPointB.lon, endPointB.lat, currentName));
                  eBlock = Math.floor(oslEastings/oslLocatorBlockSize);
                  nBlock = Math.floor(oslNorthings/oslLocatorBlockSize);
                  if(eBlock < oslEBlock_min) oslEBlock_min = eBlock;
                  if(eBlock > oslEBlock_max) oslEBlock_max = eBlock;
                  if(nBlock < oslNBlock_min) oslNBlock_min = nBlock;
                  if(nBlock > oslNBlock_max) oslNBlock_max = nBlock;
               }
            }
         }
      }
   }

   if(oslOSLNCSegments.length > 0)
   {
      oslONC_E = oslEBlock_min;
      oslONC_N = oslNBlock_min;
      oslNameComparison();
   }
}
function oslTenthSecondTick()
{
   if(oslMOAdded === false)
   {
		if(document.getElementById('edit-panel') !== null)
		{
			oslAddLog('edit-panel mutation observer added...');
			let editPanelMO = new MutationObserver(oslEditPanelCheck);
			editPanelMO.observe(document.getElementById('edit-panel'),{childList:true,subtree:true});
			oslMOAdded = true;
		}
   }

   let hideUI = Boolean
   (
      (document.getElementsByClassName('menu').length > 0) &&
      (document.getElementsByClassName('menu')[0].className.indexOf('not-visible') === -1) &&
      (document.getElementsByClassName('menu')[0].className.indexOf('hide') === -1)
   );
   hideUI = Boolean(hideUI || (document.getElementsByClassName('toolbar-group open').length > 0));
   if(hideUI === false)
   {
      oslWindow.style.zIndex = 2000;
   }
   else
   {
      oslWindow.style.zIndex = -2000;
   }

   if(!oslAdvancedMode) oslEnableAdvancedOptions();

   let oslSelectedItems = W.selectionManager.getSelectedDataModelObjects();
   if(oslSelectedItems.length == 1)
   {
      if(oslPrevSelected === null) 
      {
         oslDoOSLUpdate = true;
      }
      else if(oslSelectedItems[0].attributes.id != oslPrevSelected) 
      {
         oslDoOSLUpdate = true;
      }
      oslPrevSelected = oslSelectedItems[0].attributes.id;
   }
   else
   {
      oslPrevSelected = null;
   }

   if(document.getElementById('oslSelect') !== null)
   {
      let editDisabled = ((document.getElementsByClassName('full-address disabled').length > 0) || (document.getElementsByClassName('full-address-container').length === 0));
      if(editDisabled === true)
      {
         document.getElementById('oslSelect').style.background = "rgb(160, 160, 160)";
      }
      else
      {
         document.getElementById('oslSelect').style.background = "rgb(204, 204, 255)";
      }
      document.getElementById('oslSelect').disabled = editDisabled;
   }

   if(oslOSLNameCheckTimer > 0)
   {
      if(--oslOSLNameCheckTimer === 0) oslNameCheck();
   }

   ////if(--oslBlockCacheTestTimer === 0)
   {
      oslBlockCacheTestTimer = (oslCacheDecayPeriod * 10);
      let timeNow = Math.floor(new Date().getTime() / 1000);
      for(let bcIdx = oslBlockCacheList.length-1; bcIdx >= 0; bcIdx--)
      {
         if((timeNow - oslBlockCacheList[bcIdx].lastAccessed) > oslCacheDecayPeriod)
         {
            oslAddLog('Deleting '+oslBlockCacheList[bcIdx].blockName);
            delete unsafeWindow[oslBlockCacheList[bcIdx].blockName];
            oslBlockCacheList.splice(bcIdx,1);
         }
      }
   }

   if((oslDoOSLUpdate === true) && (oslMousepos !== null))
   {
      // update the OS Locator matches
      oslToOSGrid(oslMousepos.lat,oslMousepos.lon,OSL_MODE.OpenNames);
      oslDoOSLUpdate = oslLoadingMsg;
      if(!oslDoOSLUpdate) oslRadioClick();
   }

   if(oslBlocksToTest.length > 0)
   {
      for(let i=0; i<oslBlocksToTest.length; i++)
      {
         if(typeof unsafeWindow[oslBlocksToTest[i]] != undefined)
         {
            oslBlocksToTest.splice(i, 1);
         }
      }

      if(oslBlocksToTest.length === 0)
      {
         oslMapIsStaticProcessing();
      }
   }   
}
function oslEnableAdvancedOptions()
{
   if (oslAdvancedMode) return;
   if(W.loginManager === null) return;
   if(W.loginManager.isLoggedIn() === true)
   {
      let thisUser = W.loginManager.user;
      if (thisUser !== null && thisUser.getRank() >= 2)
      {
         oslAdvancedMode = true;
         oslAddLog('advanced mode enabled');
      }
   }
}
function oslUpdateLiveMapLink()
{
   let lmLink = document.getElementById('livemap-link');
   if(lmLink === null)
   {
      window.setTimeout(oslUpdateLiveMapLink,100);
      return;
   }

   // translate the zoom level between WME and live map.
   let livemap_zoom = parseInt(sessionStorage.zoom);
   if (livemap_zoom > 17) livemap_zoom = 17;
   let livemap_url = 'https://www.waze.com/livemap/?';
   livemap_url += 'lon='+sessionStorage.lon;
   livemap_url += '&lat='+sessionStorage.lat;
   livemap_url += '&zoom='+livemap_zoom;

   // Modify existing livemap link to reference current position in WME
   lmLink.href = livemap_url;
   lmLink.target = '_blank';
}
function oslLonLatToPixel(lon, lat)
{
   lon = parseFloat(lon);
   lat = parseFloat(lat);
   return oslSDK.Map.getMapPixelFromLonLat({lonLat: {lon: lon, lat: lat}});
}
function oslOSGridRefToPixel(osEast, osNorth)
{
   oslOSGBtoWGS(osEast,osNorth);
   return oslLonLatToPixel(oslLongitude, oslLatitude);
}  
function oslBoundsCheck(pix1, pix2, width, height)
{
   let xmin = Math.min(pix1.x,pix2.x);
   let xmax = Math.max(pix1.x,pix2.x);
   let ymin = Math.min(pix1.y,pix2.y);
   let ymax = Math.max(pix1.y,pix2.y);
   let retval = 
   (
      (xmin <= width) &&
      (xmax >= 0) &&
      (ymin <= height) &&
      (ymax >= 0)
   );
   return retval;
}
function oslHighlightOpenRoads(oslEastings, oslNorthings, mode)
{
   oslBlocksToLoad = [];
   if((mode === OSL_ROADRENDERER.Init) || (mode == OSL_ROADRENDERER.Render))
   {
      let arrayName = 'locatorData_'+oslEastings+'_'+oslNorthings;
      // check to see if there's a corresponding array loaded already
      if(typeof unsafeWindow[arrayName] == "undefined")
      {
         // create a blank placeholder which will get replaced by the actual data if the array is present on the server...
         unsafeWindow[arrayName] = [];
         oslBlocksToLoad.push(oslBlockPath+Math.floor(oslEastings / 100000)+'/'+Math.floor(oslNorthings / 100000)+'/'+arrayName+'.user.js');
         oslBlocksToLoad.push(arrayName);
         oslBlocksToTest.push(arrayName);
         oslLoadBlocks();
      }

      let divWidth = document.getElementById('WazeMap').offsetWidth;
      let divHeight = document.getElementById('WazeMap').offsetHeight;
      let displayPoints = false;
      if(mode === OSL_ROADRENDERER.Init)
      {         
         // initialise SVG container
         oslSegGeoDivInnerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="'+divWidth+'px" height="'+divHeight+'px" version="1.1">';
      }

      if(typeof unsafeWindow[arrayName] == "undefined") return;
      let oslOpenRoadsData;
      oslOpenRoadsData = unsafeWindow[arrayName];

      // calculate an appropriate stroke width for the current zoom level
      let strokeWidth = oslSDK.Map.getZoomLevel() - 12;
      if(strokeWidth < 2) strokeWidth = 2;
      if(strokeWidth > 9) strokeWidth = 9;

      let renderByFunction = [];
      renderByFunction.push(true);  // Undefined roads always get rendered when the OpenRoads layer is enabled
      renderByFunction.push(document.getElementById('_cbSegGeoMotorway').checked);
      renderByFunction.push(document.getElementById('_cbSegGeoARoad').checked);
      renderByFunction.push(document.getElementById('_cbSegGeoBRoad').checked);
      renderByFunction.push(document.getElementById('_cbSegGeoMinor').checked);
      renderByFunction.push(document.getElementById('_cbSegGeoLocal').checked);
      if(oslAdvancedMode == true)
      {
         renderByFunction.push(document.getElementById('_cbSegGeoLocalAccess').checked);
         renderByFunction.push(document.getElementById('_cbSegGeoRestricted').checked);
         renderByFunction.push(document.getElementById('_cbSegGeoSecondary').checked);
      }
      else
      {
         renderByFunction.push(false);
         renderByFunction.push(false);
         renderByFunction.push(false);
      }
      let useFullGeo = document.getElementById('_cbOpenRoadsUseGeo').checked;
      let enhancePolylines = document.getElementById('_cbOpenRoadsEnhanceGeoVis').checked;
      let highlightPRN = document.getElementById('_cbOpenRoadsHighlightPRN').checked;

      let pix1;
      let pix2;
      let nameColour;
      for(let roadIdx = 0; roadIdx < oslOpenRoadsData.length; roadIdx++)
      {
         let roadEntry = oslOpenRoadsData[roadIdx];
         let elements = oslSplitEntry(roadEntry);
         let roadFunction = parseInt(elements[OSL_ELM.Function]);

         if ((elements[OSL_ELM.RoadName] == '') && (elements[OSL_ELM.RoadNumber] == ''))
         {
            nameColour = 'cyan';
         }
         else
         {
            nameColour = 'magenta';
         }

         let renderPrimary = ((highlightPRN == true) && (elements[OSL_ELM.IsPrimary] == 'Y'));

         if((renderPrimary == true) || (renderByFunction[roadFunction] == true))
         {
            pix1 = oslLonLatToPixel(elements[OSL_ELM.BoundW], elements[OSL_ELM.BoundS]);
            pix2 = oslLonLatToPixel(elements[OSL_ELM.BoundE], elements[OSL_ELM.BoundN]);
            if(oslBoundsCheck(pix1, pix2, divWidth, divHeight) == true)
            {
               if(useFullGeo == true)
               {
                  let geoPairs = elements[OSL_ELM.Geometry].split('  ');
                  let geoPoints = geoPairs[0].split(' ');
                  let isTunnel = (elements[OSL_ELM.Structure] == 1);
                  pix1 = oslLonLatToPixel(geoPoints[0], geoPoints[1]);
                  let pline = '';
                  for(let pts=1; pts < geoPairs.length; pts++)
                  {
                     geoPoints = geoPairs[pts].split(' ');
                     pix2 = oslLonLatToPixel(geoPoints[0],geoPoints[1]);
                     if(oslBoundsCheck(pix1, pix2, divWidth, divHeight) == true)
                     {
                        if(displayPoints === false)
                        {
                           pline += '<polyline points="';
                           displayPoints = true;
                        }
                        pline += pix1.x+','+pix1.y+' '+pix2.x+','+pix2.y+' ';
                     }
                     pix1 = pix2;
                  }

                  if(displayPoints === true)
                  {
                     let strokeColour = oslStrokeColoursByFunction[roadFunction];
                     let strokeArray = '';
                     if(isTunnel == true)
                     {
                        strokeArray = 'stroke-dasharray:10,10;';
                     }
                    
                     if(renderPrimary == true)
                     {
                        oslSegGeoDivInnerHTML += pline + '" style="stroke:black';
                        oslSegGeoDivInnerHTML += ';'+strokeArray+'stroke-width:'+(strokeWidth+25)+';stroke-linecap:round;fill:none"/>';                     
                        oslSegGeoDivInnerHTML += pline + '" style="stroke:green';
                        oslSegGeoDivInnerHTML += ';'+strokeArray+'stroke-width:'+(strokeWidth+21)+';stroke-linecap:round;fill:none"/>';                     
                     }
                     if(enhancePolylines == true)
                     {
                        oslSegGeoDivInnerHTML += pline + '" style="stroke:black';
                        oslSegGeoDivInnerHTML += ';'+strokeArray+'stroke-width:'+(strokeWidth+13)+';stroke-linecap:round;fill:none"/>';                     
                        oslSegGeoDivInnerHTML += pline + '" style="stroke:';
                        oslSegGeoDivInnerHTML += nameColour;
                        oslSegGeoDivInnerHTML += ';'+strokeArray+'stroke-width:'+(strokeWidth+11)+';stroke-linecap:round;fill:none"/>';
                     }
                     oslSegGeoDivInnerHTML += pline + '" style="stroke:black;'+strokeArray+'stroke-width:'+(strokeWidth+2)+';stroke-linecap:round;fill:none"/>';
                     oslSegGeoDivInnerHTML += pline + '" style="stroke:'+strokeColour+';'+strokeArray+'stroke-width:'+strokeWidth+';stroke-linecap:round;fill:none"/>';
                     displayPoints = false;
                  }
               }
               else
               {
                  const minDim = 20;
                  let bWidth = Math.abs(pix2.x-pix1.x);
                  if(bWidth < minDim) bWidth = minDim;
                  let bHeight = Math.abs(pix2.y-pix1.y);
                  if(bHeight < minDim) bHeight = minDim;

                  oslSegGeoDivInnerHTML += '<rect x="'+pix1.x+'" y="'+pix2.y+'" width="'+bWidth+'" height="'+bHeight+'" style="fill:';
                  oslSegGeoDivInnerHTML += nameColour;
                  oslSegGeoDivInnerHTML += ';stroke:black;stroke-width:4;fill-opacity:0.25;stroke-opacity:0.25"/>';
               }
            }
         }
      }
   }
   else if(mode == OSL_ROADRENDERER.Finalise)
   {
      // finalise SVG
      oslSegGeoDivInnerHTML += '</svg>';
      oslSegGeoDiv.innerHTML = oslModifyHTML(oslSegGeoDivInnerHTML);
   }
   else if(mode == OSL_ROADRENDERER.Erase)
   {
      // erase SVG
      oslSegGeoDiv.innerHTML = oslModifyHTML('');
   }
}
function oslRepositionOverlays()
{
   let segLayerDiv = oslGetSegmentLayer().div;
   let divTop = getComputedStyle(segLayerDiv).top;
   let divLeft = getComputedStyle(segLayerDiv).left;
   
   oslBBDiv.style.top = divTop;
   oslBBDiv.style.left = divLeft;   
   oslSegGeoDiv.style.top = divTop;
   oslSegGeoDiv.style.left = divLeft;
   oslNamesDiv.style.top = divTop;
   oslNamesDiv.style.left = divLeft;

}
function oslGetCorrectedLonLatFromPixelPos(px, py, toolbarCompensation)
{
   if((toolbarCompensation) && (oslOffsetToolbar)) py -= document.getElementById('toolbar').clientHeight;
   py -= document.getElementById('topbar-container').clientHeight;
   return(oslSDK.Map.getLonLatFromMapPixel({x:px, y:py}));
}
function oslGetOffsetMapCentre(returnAsXY)
{
   // get lon/lat of viewport centrepoint for modifying the livemap link and for passing to the external mapping sites.

   // shift the longitude pixel offset by half the width of the WME sidebar to account for the lateral offset that would
   // otherwise occur when switching between the WME tab and the other map tabs - all of those use a full-width map view,
   // so their map centre is further to the left within the browser window than the WME centrepoint...
   let mapVPElm = oslSDK.Map.getMapViewportElement();
   let mapVPX = (mapVPElm.clientWidth / 2) - (document.getElementById('sidebar').clientWidth / 2);
   let mapVPY = (mapVPElm.clientHeight / 2);

   let retval = oslGetCorrectedLonLatFromPixelPos(mapVPX, mapVPY, false);
   if(returnAsXY === true)
   {
      retval = oslConvertLonLatXY(retval.lon, retval.lat);
   }
   return retval;
}
function oslMouseMoveAndUp(e)
{
   if(oslUserPrefs.ui.state == 'minimised') 
   {
      return;
   }

   if(oslSDK.Editing.isDrawingInProgress() === true)
   {
      return;
   }

   if((e.pageX !== undefined) && (e.pageY !== undefined)) 
   {
      // Only valid when a mousemove event occurs...
      let mapBCR = document.getElementById('map').getBoundingClientRect();
      let mouseX = e.pageX - mapBCR.left;
      let mouseY = e.pageY - mapBCR.top;

      oslMousePixelpos = {x:mouseX, y:mouseY};      
      oslLastViewportWidth = oslSDK.Map.getMapViewportElement().clientWidth;
      let mouseLonLat = oslGetCorrectedLonLatFromPixelPos(mouseX, mouseY, true);
      oslMousepos = mouseLonLat;
      if
      (
         (oslMousepos != JSON.parse(sessionStorage.oslMousepos)) || 
         (
            (oslLoadingMsg == true) && 
            (typeof unsafeWindow[oslEvalString] != undefined)
         )
      )
      {
         oslLoadingMsg = false;
         sessionStorage.oslMousepos = JSON.stringify(oslMousepos);

         oslDoOSLUpdate = false;
         // update the OSL results if there are no selected segments, but there is a highlighted segment
         // which we haven't already done an update for

         oslSegmentHighlighted = false;
         let noneSelected = (W.selectionManager.getSelectedDataModelObjects().length === 0);
         if(noneSelected === true)
         {
            let segLayerFeatures = oslGetSegmentLayer().features;
            for(let slIdx=0; slIdx < segLayerFeatures.length; slIdx++)
            {
               if(segLayerFeatures[slIdx].renderIntent == 'highlight')
               {
                  if(slIdx != oslPrevHighlighted)
                  {
                     oslPrevHighlighted = slIdx;
                  }
                  oslDoOSLUpdate = true;
                  oslSegmentHighlighted = true;
               }
            }
         }
      }
   }

   // Valid for both mousemove and zoomend events...
   let gomc = oslGetOffsetMapCentre(false);
   let lat = gomc.lat;
   let lon = gomc.lon;
   let zoom = oslSDK.Map.getZoomLevel();
   // compare the new parameters against the persistent copies, and update the external links
   // only if there's a change required - the newly-inserted <a> element can't be clicked
   // on until the insertion process is complete, and if we were to re-insert it every timeout
   // then it'd spend a lot of its time giving the appearance of being clickable but without
   // actually doing anything...
   if((zoom != parseInt(sessionStorage.zoom))||(lat != parseFloat(sessionStorage.lat))||(lon != parseFloat(sessionStorage.lon)))
   {
      let country = W.model.getTopCountry()?.attributes?.name;

      if(country == "United Kingdom")
      {
         if (oslInUK === false)
         {
            oslAddLog('location is the UK, enabling full UI...');
            oslInUK = true;
            document.getElementById('oslOSLDiv').style.display = "block";
            document.getElementById('oslNCDiv').style.display = "block";
            document.getElementById('oslSegGeoUIDiv').style.display = "block";
            document.getElementById('oslGazTagsDiv').style.display = "block";
            document.getElementById('_extlinksUK').style.display = "block";
         }
      }
      else
      {
         // ...somewhere not yet supported, or WME isn't telling us just yet...
         oslAddLog('location not recognised, disabling UK-specific parts of UI...');
         oslInUK = false;
         oslInLondon = false;
         document.getElementById('oslOSLDiv').style.display = "none";
         document.getElementById('oslNCDiv').style.display = "none";
         document.getElementById('oslSegGeoUIDiv').style.display = "none";
         document.getElementById('oslGazTagsDiv').style.display = "none";
         document.getElementById('_extlinksUK').style.display = "none";
      }

      if(oslInUK === true)
      {
         // we're in the UK, so test to see if we're within the approximate Greater London bounding box
         if((lon >= -0.55) && (lon <= 0.30) && (lat >= 51.285) && (lat <= 51.695))
         {
            oslInLondon = true;
            document.getElementById('lrrCtrls').style.display='inline';
         }
         else
         {
            oslInLondon = false;
            document.getElementById('lrrCtrls').style.display='none';
         }
      }

      if(zoom != sessionStorage.zoom)
      {
         if(zoom < 16) document.getElementById('_cbNCEnabled').disabled = true;
         else document.getElementById('_cbNCEnabled').disabled = false;
      }
      // update the persistent vars with the new position
      sessionStorage.zoom = zoom;
      sessionStorage.lat = lat;
      sessionStorage.lon = lon;

      if(oslInUK === true)
      {
         // update the external site datalinks with the new coords/zoom
         if(document.getElementById('_cbAutoTrackOSOD').checked == 1)
         {
            oslOSODClick();
         }
         if(document.getElementById('_cbAutoTrackRWO').checked == 1)
         {
            oslUpdateOneKey();
         }
         if(document.getElementById('_cbAutoTrackLRR').checked == 1)
         {
            oslUpdateLRRKey();
         }
      }

      // wait to update the livemap link, as WME now does its own update after this point so any changes we make here
      // end up being wiped out...
      window.setTimeout(oslUpdateLiveMapLink,100);

      document.getElementById('_linkPermalink').href = document.getElementsByClassName('WazeControlPermalink')[0].getElementsByClassName('permalink')[0].href;
   }
   
   if((e.type == "mouseup") || (e.type == "zoomend"))
   {
      oslMapIsStaticProcessing();
   }
}
function oslSetAccessKey(keyName, requiresXY, requiresOSCoords)
{
   let lat = "0.0";
   let lon = "0.0";
   let zoom = oslSDK.Map.getZoomLevel();

   if(requiresOSCoords === true)
   {
      let geoCenter = oslSDK.Map.getMapCenter();
      oslToOSGrid(geoCenter.lat, geoCenter.lon, OSL_MODE.Conversion);

      lat = oslNorthings;
      lon = oslEastings;
   }
   else
   {
      let gomc = oslGetOffsetMapCentre(requiresXY);
      if(requiresXY === true)
      {
         lat = gomc.y;
         lon = gomc.x;
      }
      else
      {
         lat = gomc.lat.toFixed(8);
         lon = gomc.lon.toFixed(8);
      }
   }
   
   GM_setValue(keyName,Date.now()+','+lat+','+lon+','+zoom);
}
function oslOSODClick()
{
   oslSetAccessKey('_osodAccessKey', true, false);
}
function oslUpdateOneKey()
{
   oslSetAccessKey('_oneAccessKey', false, false);
}
function oslUpdateLRRKey()
{
   oslSetAccessKey('_lrrAccessKey', false, true);
}
function oslMapIsStaticProcessing()
{
   if(oslUserPrefs.ui.state == 'maximised')
   {
      let tCenter = oslSDK.Map.getMapCenter();
      let tZoom = oslSDK.Map.getZoomLevel();
      if
      (
         (oslRORCenter == null) || (tCenter.lat != oslRORCenter.lat) || (tCenter.lon != oslRORCenter.lon) ||
         (oslRORZoom == null) || (tZoom != oslRORZoom)
      )
      {
         oslRORCenter = tCenter;
         oslRORZoom = tZoom;
         window.setTimeout(oslMapIsStaticProcessing, 50);
         return;
      }

      let geoCenter = oslSDK.Map.getMapCenter();
      oslToOSGrid(geoCenter.lat, geoCenter.lon, OSL_MODE.Conversion);

      oslNameCheck();
      if(oslInUK === true)
      {
         let extent = oslGetExtent();
         // recalculate the map viewport extents in terms of oslEastings/oslNorthings
         let vpHalfWidth = (extent.right - extent.left) / (2 * 1.61);
         let vpHalfHeight = (extent.top - extent.bottom) / (2 * 1.61);
         oslVPLeft = oslEastings - vpHalfWidth;
         oslVPRight = oslEastings + vpHalfWidth;
         oslVPBottom = oslNorthings - vpHalfHeight;
         oslVPTop = oslNorthings + vpHalfHeight;

         if(document.getElementById('_cbOpenRoadsEnabled').checked === true)
         {
            oslToOSGrid(oslEastings,oslNorthings,OSL_MODE.OpenRoads);
         }
         else
         {
            oslHighlightOpenRoads(0,0,OSL_ROADRENDERER.Erase);
         }
         
         oslGetVisibleCityNames();
      }
      else
      {
         oslHighlightOpenRoads(0,0,OSL_ROADRENDERER.Erase);
      }
      oslRepositionOverlays();
      oslRadioClick();  // this regenerates the bounding boxes on the repositioned overlay...
   }
}
function oslTestPointerOutsideMap(mX, mY)
{
   let mapElm = document.getElementById("map");
   if(mapElm === undefined) return false;

   let bLeft = mapElm.parentElement.offsetLeft;
   let bRight = (bLeft + mapElm.offsetWidth);
   let bTop = (mapElm.parentElement.offsetTop + document.getElementById("topbar-container").clientHeight);
   let bBottom = (mapElm.parentElement.offsetTop + mapElm.offsetHeight + document.getElementById("topbar-container").clientHeight - document.getElementsByClassName("wz-map-ol-footer")[0].clientHeight);

   if((mX < bLeft) || (mX > bRight) || (mY < bTop) || (mY > bBottom)) return true;
   else return false;
}
function oslMouseOut(e)
{
   if(oslTestPointerOutsideMap(e.clientX, e.clientY))
   {
      // when the mouse pointer leaves the map area, WME treats it similarly to a mouseup
      // event without generating an actual mouseup event, so we need to do the same...
      oslMapIsStaticProcessing();
   }
}
function oslCancelEvent(e)
{
  e = e ? e : window.event;
  if(e.stopPropagation)
    e.stopPropagation();
  if(e.preventDefault)
    e.preventDefault();
  e.cancelBubble = true;
  e.cancel = true;
  e.returnValue = false;
  return false;
}
function oslOSLDivMouseDown(e)
{
   oslPrevMouseX = e.pageX;
   oslPrevMouseY = e.pageY;
   oslDivDragging = true;
   oslDragBar.style.cursor = 'move';
   document.body.addEventListener('mousemove', oslOSLDivMouseMove, false);
   document.body.addEventListener('mouseup', oslOSLDivMouseUp, false);
   // lock the UI width during a drag so we can correctly detect for falling off the window edge
   oslWindow.style.width = oslWindow.getBoundingClientRect().width+'px';
   return true;
}
function oslOSLDivMouseUp()
{
   if(oslDivDragging)
   {
      oslDivDragging = false;
      oslUserPrefs.ui.x = oslOSLDivLeft;
      oslUserPrefs.ui.y = oslOSLDivTop;
      oslWriteUserPrefs();
      // unlock the UI width again so we can expand/contract as required based on other script behaviour
      oslWindow.style.width = "auto";
   }
   oslDragBar.style.cursor = 'auto';
   document.body.removeEventListener('mousemove', oslOSLDivMouseMove, false);
   document.body.removeEventListener('mouseup', oslOSLDivMouseUp, false);
   return true;
}
function oslOSLDivMouseMove(e)
{
   let vpHeight = window.innerHeight;
   let vpWidth = window.innerWidth;

   oslOSLDivTop = parseInt(oslOSLDivTop) + parseInt((e.pageY - oslPrevMouseY));
   oslOSLDivLeft = parseInt(oslOSLDivLeft) + parseInt((e.pageX - oslPrevMouseX));
   oslPrevMouseX = e.pageX;
   oslPrevMouseY = e.pageY;

   if(oslOSLDivTop < 0) oslOSLDivTop = 0;
   if(oslOSLDivTop + 16 >= vpHeight) oslOSLDivTop = vpHeight-16;
   if(oslOSLDivLeft < 0) oslOSLDivLeft = 0;
   if(oslOSLDivLeft + 32 >= vpWidth) oslOSLDivLeft = vpWidth-32;

   oslWindow.style.top = oslOSLDivTop+'px';
   oslWindow.style.left = oslOSLDivLeft+'px';

   return oslCancelEvent(e);
}
function oslKeepUIVisible()
{
   let vpHeight = window.innerHeight;
   let topbarHeight = document.getElementById('toolbar').offsetHeight;
   let maxUIHeight = (vpHeight - topbarHeight);
   // Restore auto-sizing so we can see the effect of whatever UI change caused us to get here...
   oslWindow.style.height = "auto";
   oslWindow.style.overflow = "hidden";

   // If the bottom edge of the ui would fall off the bottom edge of the map viewport, nudge
   // the UI up as far as required to keep the whole UI visible.  If this would however require
   // the top edge of the UI to be pushed off the top of the map viewport, constrain the UI
   // height to the viewport height and enable a scrollbar...
   if(oslWindow.getBoundingClientRect().bottom >= maxUIHeight)
   {
      let newTop = (vpHeight-oslWindow.getBoundingClientRect().height);
      if(newTop < topbarHeight)
      {
         newTop = topbarHeight;
         oslWindow.style.height = maxUIHeight+'px';
         oslWindow.style.overflow = "scroll";
      }
      oslOSLDivTop = newTop;
      oslUserPrefs.ui.y = oslOSLDivTop;
      oslWindow.style.top = oslOSLDivTop+'px';
   }
}
function oslMinimiseDiv(divID)
{
   let tDiv = document.getElementById(divID);
   if(tDiv != null)
   {
      tDiv.style.height = '0px';
      tDiv.style.padding = '0px';
      tDiv.style.overflow = 'hidden';
   }
}
function oslMaximiseDiv(divID)
{
   let tDiv = document.getElementById(divID);
   if(tDiv != null)
   {
      tDiv.style.height = 'auto';
      tDiv.style.padding = '2px';
      tDiv.style.overflow = 'auto';
   }
}
function oslWindowMaximise()
{
   let tHTML = '';
   tHTML += '<span style="float:left"><a href="'+oslUpdateURL+'" target="_blank"><b>WMEOpenData</a> v'+oslVersion+'</b></span>';
   tHTML += '<span id="_minimax" style="float:right"><i class="fa fa-chevron-circle-up"></i></span>';
   tHTML += '<br>';
   oslDragBar.innerHTML = oslModifyHTML(tHTML);
   document.getElementById('_minimax').addEventListener('click', oslWindowMinimise, false);

   oslMaximiseDiv('oslOSLDiv');
   oslMaximiseDiv('oslNCDiv');
   oslMaximiseDiv('oslGazTagsDiv');
   oslMaximiseDiv('oslSegGeoUIDiv');
   oslMaximiseDiv('oslMLCDiv');
   oslKeepUIVisible();
   oslUserPrefs.ui.state = 'maximised';
   oslWriteUserPrefs();
   oslRepositionOverlays();
   oslMapIsStaticProcessing();
}
function oslWindowMinimise()
{
   let tHTML = '';
   tHTML += '<span style="float:left"><b>WMEOpenData v'+oslVersion+'</b></span>';
   tHTML += '<span id="_minimax" style="float:right"><i class="fa fa-chevron-circle-down"></i></span>';
   tHTML += '<br>';
   oslDragBar.innerHTML = oslModifyHTML(tHTML);
   document.getElementById('_minimax').addEventListener('click', oslWindowMaximise, false);

   oslMinimiseDiv('oslOSLDiv');
   oslMinimiseDiv('oslNCDiv');
   oslMinimiseDiv('oslGazTagsDiv');
   oslMinimiseDiv('oslSegGeoUIDiv');
   oslMinimiseDiv('oslMLCDiv');
   oslKeepUIVisible();
   oslBBDiv.innerHTML = oslModifyHTML('');
   oslNamesDiv.innerHTML = oslModifyHTML('');
   oslSegGeoDiv.innerHTML = oslModifyHTML('');
   oslUserPrefs.ui.state = 'minimised';
   oslWriteUserPrefs();
}
function oslSubDivSetState(divID, state)
{
   let tSubDiv = document.getElementById(divID).children[1];
   let tToggle = document.getElementById(divID).children[0].children[1].children[0];
   if(state == 'minimised')
   {
      tSubDiv.style.height = "0px";
      tSubDiv.style.padding = "0px";
      tSubDiv.style.overflow = "hidden";
      tToggle.className = "fa fa-chevron-circle-down";
   }
   else
   {
      tSubDiv.style.height = "auto";
      tSubDiv.style.width = "100%";
      tSubDiv.style.padding = "2px";
      tSubDiv.style.overflow = "auto";
      tToggle.className = "fa fa-chevron-circle-up";
   }
}
function oslUIMinMax(e)
{
   let headerDivID = e.srcElement.parentElement.parentElement.parentElement.id;
   let tSubDiv = document.getElementById(headerDivID).children[1];
   if(tSubDiv != null)
   {
      let newState;
      if(tSubDiv.style.height == "auto")
      {
         newState = 'minimised';
      }
      else
      {
         newState = 'maximised';
      }
      oslSubDivSetState(headerDivID, newState);
      oslUpdateMinMax(headerDivID, newState);
   }
   oslKeepUIVisible();
}
function oslIsLanesTabActive()
{
   let retval = false;
   if(document.querySelector('wz-tab.lanes-tab') !== null)
   {
      if(document.querySelector('wz-tab.lanes-tab').getAttribute("is-active") !== null)
      {
         retval = true;
      }
   }
   return retval;
}
function oslEditPanelCheck()
{
   if
   (
      (oslIsLanesTabActive() == true) ||
      (document.getElementById('edit-panel')?.getElementsByClassName('map-comment-feature-editor').length)
   )
   {
      document.body.style.overflow = "auto";
   }
   else
   {
      document.body.style.overflow = "hidden";
   }
}
function oslSetupBBDiv()
{
   // add a new div to the map viewport, to hold the bounding box SVG
   oslAddLog('create bounding box DIV');
   oslBBDiv = document.createElement('div');
   oslBBDiv.id = "oslBBDiv";
   oslBBDiv.style.position = 'absolute';
   let segLayerDiv = oslGetSegmentLayer().div;
   oslBBDiv.style.top = getComputedStyle(segLayerDiv).top;
   oslBBDiv.style.left = getComputedStyle(segLayerDiv).left;
   oslBBDiv.style.overflow = 'hidden';
   oslBBDiv.style.width = window.innerWidth;
   oslBBDiv.style.height = window.innerHeight;
   oslWazeMapElement.appendChild(oslBBDiv);
}
function oslSetupORDiv()
{
   // add a new div to the map viewport, to hold the OpenRoads SVG
   oslAddLog('create OpenRoads DIV');
   oslSegGeoDiv = document.createElement('div');
   oslSegGeoDiv.id = "oslSegGeoDiv";
   oslSegGeoDiv.style.position = 'absolute';
   let segLayerDiv = oslGetSegmentLayer().div;
   oslSegGeoDiv.style.top = getComputedStyle(segLayerDiv).top;
   oslSegGeoDiv.style.left = getComputedStyle(segLayerDiv).left;
   oslSegGeoDiv.style.overflow = 'hidden';
   oslSegGeoDiv.style.width = window.innerWidth;
   oslSegGeoDiv.style.height = window.innerHeight;
   oslWazeMapElement.appendChild(oslSegGeoDiv);
}
function oslSetupNamesDiv()
{
   // add a new div to the map viewport, to hold the place names SVG
   oslAddLog('create place names DIV');
   oslNamesDiv = document.createElement('div');
   oslNamesDiv.id = "oslNamesDiv";
   oslNamesDiv.style.position = 'absolute';
   oslNamesDiv.style.pointerEvents = 'none';
   let segLayerDiv = oslGetSegmentLayer().div;
   oslNamesDiv.style.top = getComputedStyle(segLayerDiv).top;
   oslNamesDiv.style.left = getComputedStyle(segLayerDiv).left;
   oslNamesDiv.style.overflow = 'hidden';
   oslNamesDiv.style.width = window.innerWidth;
   oslNamesDiv.style.height = window.innerHeight;
   oslWazeMapElement.appendChild(oslNamesDiv);
}
function oslGenerateOpenRoadsCBHTML(isStd, ID, label, indentLevel)
{
   let tHTML = '';
   let indent = 'padding-left: '+(indentLevel * 0.5)+'em;';
   
   tHTML += '<label style="display: inline; '+indent+'">';
   tHTML += '<input type="checkbox" name="oslOpenRoads_';
   if(isStd == true) tHTML += 'std';
   else tHTML += 'adv';
   tHTML += '" id="' + ID + '" />';
   tHTML += label + '</label>';
   return tHTML;
}
function oslGenerateCollapsibleSubDiv(headerText, subDivHTML)
{
   let tHTML;
   tHTML = '<div><span style="float:left"><b>'+headerText+'</b></span>';
   tHTML += '<span name="oslMinMaxToggle" style="float:right"><i class="fa fa-chevron-circle-down"></i></span></div>';
   tHTML += '<div style="height: 0px; padding: 0px; overflow: hidden;">';
   tHTML += subDivHTML;
   tHTML += '</div>';
   return tHTML;
}
function oslSetupUI()
{
   let subDivHTML;

   // add a new div to hold the OS Locator results, in the form of a draggable window
   oslAddLog('create lookup results DIV');
   oslWindow = document.createElement('div');
   oslWindow.id = "oslWindow";
   oslWindow.style.position = 'absolute';
   oslWindow.style.border = '1px solid #BBDDBB';
   oslWindow.style.borderRadius = '4px';
   oslWindow.style.overflow = 'hidden';
   oslWindow.style.zIndex = 2000;
   oslWindow.style.opacity = 0;
   oslWindow.style.transitionProperty = "opacity";
   oslWindow.style.transitionDuration = "1000ms";
   oslWindow.style.webkitTransitionProperty = "opacity";
   oslWindow.style.webkitTransitionDuration = "1000ms";
   oslWindow.style.boxShadow = '5px 5px 10px Silver';
   document.body.appendChild(oslWindow);

   // dragbar div
   oslAddLog('create dragbar DIV');
   oslDragBar = document.createElement('div');
   oslDragBar.id = "oslDragBar";
   oslDragBar.style.backgroundColor = '#D0D0D0';
   oslDragBar.style.padding = '4px';
   oslDragBar.style.fontSize = '16px';
   oslDragBar.style.lineHeight = '18px';
   oslWindow.appendChild(oslDragBar);

   // OS results div
   oslAddLog('create results DIV');
   oslOSLDiv = document.createElement('div');
   oslOSLDiv.id = "oslOSLDiv";
   oslOSLDiv.style.backgroundColor = '#DDFFDD';
   oslOSLDiv.style.padding = '2px';
   oslOSLDiv.style.fontSize = '14px';
   oslOSLDiv.style.lineHeight = '16px';
   oslOSLDiv.style.display = 'none';

   subDivHTML = "<div id='oslRoadNameMatches'></div>";
   oslOSLDiv.innerHTML = oslModifyHTML(oslGenerateCollapsibleSubDiv("OS Open Names", subDivHTML));

   oslWindow.appendChild(oslOSLDiv);

   // Segment geometry control div
   oslAddLog('create SegGeo control DIV');
   oslSegGeoUIDiv = document.createElement('div');
   oslSegGeoUIDiv.id = "oslSegGeoUIDiv";
   oslSegGeoUIDiv.style.backgroundColor = '#40A040';
   oslSegGeoUIDiv.style.padding = '2px';
   oslSegGeoUIDiv.style.fontSize = '14px';
   oslSegGeoUIDiv.style.lineHeight = '16px';
   oslSegGeoUIDiv.style.display = 'none';

   subDivHTML = oslGenerateOpenRoadsCBHTML(true, "_cbOpenRoadsEnabled", "Highlight by Classification:", 0) + '<br>';
   subDivHTML += oslGenerateOpenRoadsCBHTML(true, "_cbSegGeoMotorway", "Motorway", 1) + '<br>';
   subDivHTML += oslGenerateOpenRoadsCBHTML(true, "_cbSegGeoARoad", "A Road", 1) + '<br>';
   subDivHTML += oslGenerateOpenRoadsCBHTML(true, "_cbSegGeoBRoad", "B Road", 1) + '<br>';
   subDivHTML += oslGenerateOpenRoadsCBHTML(true, "_cbSegGeoMinor", "Minor Road", 1) + '<br>';
   subDivHTML += oslGenerateOpenRoadsCBHTML(true, "_cbSegGeoLocal", "Local Road", 1) + '<br>';
   if(oslAdvancedMode == true)
   {
      subDivHTML += oslGenerateOpenRoadsCBHTML(false, "_cbSegGeoLocalAccess", "Local Access Road", 1) + '<br>';
      subDivHTML += oslGenerateOpenRoadsCBHTML(false, "_cbSegGeoRestricted", "Restricted Access Road", 1) + '<br>';
      subDivHTML += oslGenerateOpenRoadsCBHTML(false, "_cbSegGeoSecondary", "Secondary Access Road", 1) + '<br>';
   }
   subDivHTML += '<br>' + oslGenerateOpenRoadsCBHTML(true, "_cbOpenRoadsUseGeo", "Show as polylines", 0) + '<br>';
   subDivHTML += oslGenerateOpenRoadsCBHTML(true, "_cbOpenRoadsEnhanceGeoVis", "Enhance polyline visibility", 1) + '<br><br>';
   subDivHTML += oslGenerateOpenRoadsCBHTML(true, "_cbOpenRoadsHighlightPRN", "Highlight PRN", 1);
   oslSegGeoUIDiv.innerHTML = oslModifyHTML(oslGenerateCollapsibleSubDiv("OS Open Roads", subDivHTML));
   oslWindow.appendChild(oslSegGeoUIDiv);

   // Gazetteer Tags div
   oslAddLog('create GazTags DIV');
   oslGazTagsDiv = document.createElement('div');
   oslGazTagsDiv.id = "oslGazTagsDiv";
   oslGazTagsDiv.style.backgroundColor = '#FFFF80';
   oslGazTagsDiv.style.padding = '2px';
   oslGazTagsDiv.style.fontSize = '14px';
   oslGazTagsDiv.style.lineHeight = '16px';
   oslGazTagsDiv.style.display = 'none';

   subDivHTML = oslGenerateOpenRoadsCBHTML(true, "_cbGazTagsEnabled", "Show by type:", 0) + '<br>';
   subDivHTML += oslGenerateOpenRoadsCBHTML(true, "_cbGazTagsCity", "City", 1) + '<br>';
   subDivHTML += oslGenerateOpenRoadsCBHTML(true, "_cbGazTagsTown", "Town", 1) + '<br>';
   subDivHTML += oslGenerateOpenRoadsCBHTML(true, "_cbGazTagsVillage", "Village", 1) + '<br>';
   subDivHTML += oslGenerateOpenRoadsCBHTML(true, "_cbGazTagsHamlet", "Hamlet", 1) + '<br>';
   subDivHTML += oslGenerateOpenRoadsCBHTML(true, "_cbGazTagsOther", "Other", 1);
   oslGazTagsDiv.innerHTML = oslModifyHTML(oslGenerateCollapsibleSubDiv("Gazetteer Tags", subDivHTML));
   oslWindow.appendChild(oslGazTagsDiv);

   // NameCheck div
   oslAddLog('create NameCheck DIV');
   oslNCDiv = document.createElement('div');
   oslNCDiv.id = "oslNCDiv";
   oslNCDiv.style.backgroundColor = '#DDDDFF';
   oslNCDiv.style.padding = '2px';
   oslNCDiv.style.fontSize = '14px';
   oslNCDiv.style.lineHeight = '16px';
   oslNCDiv.style.display = 'none';

   subDivHTML = '<label style="display:inline;"><input type="checkbox" id="_cbNCEnabled" />Highlight potential naming errors</label>';
   subDivHTML += '<br><i>Note: only active at at zoom level 16 and above</i>';
   oslNCDiv.innerHTML = oslModifyHTML(oslGenerateCollapsibleSubDiv("NameCheck", subDivHTML));
   oslWindow.appendChild(oslNCDiv);

   // external links div
   oslAddLog('create extern links DIV');
   oslMLCDiv = document.createElement('div');
   oslMLCDiv.id = "oslMLCDiv";
   oslMLCDiv.style.backgroundColor = '#EEFFEE';
   oslMLCDiv.style.padding = '2px';
   oslMLCDiv.style.fontSize = '14px';
   oslMLCDiv.style.lineHeight = '16px';
   
   // add the anchors and auto-track checkboxes for external sites.  Note that some urls are blank at this stage,
   // they'll be filled in by oslMouseMoveAndUp()...
   subDivHTML = '<div id="_extlinksUK" style="display: none;">';
   subDivHTML += '<a href="https://search-property-information.service.gov.uk/search/search-by-map/" id="_linkOSOD" target="_osopendata">OS OpenData</a> <input type="checkbox" id="_cbAutoTrackOSOD"></input> | ';
   subDivHTML += '<a href="https://one.network?showlinks=true" id="_linkRWO" target="_roadworksorg">one.network</a> <input type="checkbox" id="_cbAutoTrackRWO"></input><br>';
   subDivHTML += '<div id="lrrCtrls"><a href="https://public.londonworks.gov.uk/roadworks/home" id="_linkLRR" target="_londonregister">London Roadworks</a> <input type="checkbox" id="_cbAutoTrackLRR"></input></div>';
   subDivHTML += '</div>';
   subDivHTML += '<br>(Checkboxes enable auto-tracking)';
   subDivHTML += '<br><br><a href="" id="_linkPermalink">Permalink</a>';
   oslMLCDiv.innerHTML = oslModifyHTML(oslGenerateCollapsibleSubDiv("External resources", subDivHTML));
   oslWindow.appendChild(oslMLCDiv);
}
function oslSetupEventListeners()
{
   oslAddLog('adding event listeners');
   oslDragBar.addEventListener('mousedown', oslOSLDivMouseDown, false);
   oslDragBar.addEventListener('mouseup', oslOSLDivMouseUp, false);
   W.map.events.register("zoomend", null, oslMouseMoveAndUp);
   W.map.events.register("mouseout", null, oslMouseOut);
   document.getElementById('_cbNCEnabled').addEventListener('click', oslNCStateChange, false);
   document.getElementById('_linkOSOD').addEventListener('click', oslOSODClick, false);
   document.getElementById('_linkRWO').addEventListener('click', oslUpdateOneKey, false);
   document.getElementById('_linkLRR').addEventListener('click', oslUpdateLRRKey, false);

   for(let idx = 0; idx < document.getElementsByName('oslOpenRoads_std').length; ++idx)
   {
      document.getElementsByName('oslOpenRoads_std')[idx].addEventListener('click', oslOpenRoadsStateChange, false);
   }
   if(oslAdvancedMode == true)
   {
      for(let idx = 0; idx < document.getElementsByName('oslOpenRoads_adv').length; ++idx)
      {
         document.getElementsByName('oslOpenRoads_adv')[idx].addEventListener('click', oslOpenRoadsStateChange, false);
      }
   }

   for(let idx = 0; idx < document.getElementsByName('oslMinMaxToggle').length; ++idx)
   {
      document.getElementsByName('oslMinMaxToggle')[idx].addEventListener('click', oslUIMinMax, false);
   }

   W.map.events.register("mousemove", null, oslMouseMoveAndUp);
   W.map.events.register("mouseup", null, oslMouseMoveAndUp);

   let segLayer = oslGetSegmentLayer();
   segLayer.events.register("featuresadded", null, oslNameCheckTrigger);
   segLayer.events.register("featuresremoved", null, oslNameCheckTrigger);
}
function oslSetupUIPosition()
{
   oslAddLog('adjusting UI position...');
   document.body.style.overflow = 'hidden';

   let vpHeight = window.innerHeight;
   let vpWidth = window.innerWidth;

   oslOSLDivTop = oslUserPrefs.ui.y;
   oslOSLDivLeft = oslUserPrefs.ui.x;

   if((oslUserPrefs.ui.y < 0) || (oslUserPrefs.ui.y === null))
   {
      oslOSLDivTop = document.getElementById('sidebar').getBoundingClientRect().top + (document.getElementById('sidebar').getBoundingClientRect().height / 2);
   }
   else if(oslUserPrefs.ui.y > vpHeight)
   {
      oslKeepUIVisible();
   }

   if((oslUserPrefs.ui.x < 0) || (oslUserPrefs.ui.x === null))
   {
      oslOSLDivLeft = 8;
   }
   else if(oslUserPrefs.ui.x > (vpWidth - oslMinUIWidth))
   {
      oslOSLDivLeft = (vpWidth - oslMinUIWidth);
   }

   if(oslUserPrefs.ui.state === undefined) oslUserPrefs.ui.state = 'maximised';
   oslOSLDivTopMinimised = oslOSLDivTop;
   oslWindow.style.left = oslOSLDivLeft+'px';
   oslWindow.style.top = oslOSLDivTop+'px';
   if(oslUserPrefs.ui.state == 'maximised') oslWindowMaximise();
   else oslWindowMinimise();

   oslWindow.style.opacity = 1;   
}
function oslSetLayerZIndices()
{
   oslAddLog('setting layer zIndices...');
   for(let i=0; i < W.map.layers.length; i++)
   {
      if((W.map.layers[i].uniqueName == 'satellite_imagery')||(W.map.layers[i].name == 'satellite_imagery'))
      {
         let satZIndex = parseInt(W.map.layers[i].div.style.zIndex);
         oslBBDiv.style.zIndex = satZIndex + 1;
         oslSegGeoDiv.style.zIndex = satZIndex + 2;
         oslNamesDiv.style.zIndex = satZIndex + 1000;
      }
      if(W.map.layers[i].name == 'Spotlight') oslOSLMaskLayer = W.map.layers[i].div;
   }
}
function oslSetupAccessKey()
{
   oslAccessKeyUpdate();

   GM_addValueChangeListener("_rwoPositionToWME", function()
   {
      if(arguments[3] === true)
      {
         oslAddLog('WME reposition request from one.network...');
         let posBits = arguments[2].split(',');
         let tPos = {lon:parseFloat(posBits[3]), lat:parseFloat(posBits[2])};
         oslSDK.Map.setMapCenter({lonLat: tPos});
         let tZoom = parseInt(posBits[4]);
         if(tZoom < 12) tZoom = 12;
         if(tZoom > 22) tZoom = 22;
         oslSDK.Map.setZoomLevel({zoomLevel:tZoom});
      }
   });

   window.setInterval(oslAccessKeyUpdate,5000);
}
function oslLoadOrInitPrefs()
{
   // See if this system already has something in localStorage
   let userPrefs = localStorage.oslUserPrefs;
   if(userPrefs != undefined)
   {
      oslUserPrefs = JSON.parse(userPrefs);
   }

   // Fill out any undefined parts of the prefs object with default values - this works both to initialise
   // the object if nothing at all is stored in localStorage, and can also be used to initialise any newer
   // parameters that might get added later on which aren't yet defined in the localStorage copy
   if(oslUserPrefs.minmax == undefined) oslUserPrefs.minmax = [];
   if(oslUserPrefs.openRoads == undefined) oslUserPrefs.openRoads = [];
   if(oslUserPrefs.ui == undefined) oslUserPrefs.ui = {};
   if(oslUserPrefs.ui.x == undefined) oslUserPrefs.ui.x = null;
   if(oslUserPrefs.ui.y == undefined) oslUserPrefs.ui.y = null;
   if(oslUserPrefs.ui.state == undefined) oslUserPrefs.ui.state = null;

   // Remove any old reference to oslWindow from minmax, as this can prevent the OS Open Names section
   // being correctly displayed until the user minimises and maximises the entire script window...
   for(let i = 0; i < oslUserPrefs.minmax.length; ++i)
   {
      if(oslUserPrefs.minmax[i][0] === "oslWindow")
      {
         oslUserPrefs.minmax.splice(i,1);
         break;
      }
   }

   // Import any older preferences set on this system, then remove from localStorage - this should only ever
   // occur the first time this version of the script is run after updating an existing setup, so there
   // wouldn't be anything already stored in these three properties that would get wiped out by the import.
   if(localStorage.oslOSLDivState != undefined)
   {
      oslUserPrefs.ui.state = localStorage.oslOSLDivState;
      localStorage.removeItem("oslOSLDivState");
   }
   if(localStorage.oslOSLDivLeft != undefined)
   {
      oslUserPrefs.ui.x = localStorage.oslOSLDivLeft;
      localStorage.removeItem("oslOSLDivLeft");
   }
   if(localStorage.oslOSLDivTop != undefined)
   {
      oslUserPrefs.ui.y = localStorage.oslOSLDivTop;
      localStorage.removeItem("oslOSLDivTop");
   }
}
function oslApplyPrefs()
{
   // subDiv states
   for(let i = 0; i < oslUserPrefs.minmax.length; ++i)
   {
      oslSubDivSetState(oslUserPrefs.minmax[i][0], oslUserPrefs.minmax[i][1]);
   }

   // Open Roads options
   for(let i = 0; i < oslUserPrefs.openRoads.length; ++i)
   {
      let cbID = oslUserPrefs.openRoads[i][0];
      if(document.getElementById(cbID) != undefined)
      {
         document.getElementById(cbID).checked = oslUserPrefs.openRoads[i][1];
      }
   } 
   // Force-disable Open Roads display on startup to avoid problems if the current WME viewport is 
   // showing a more densely mapped area than before...
   document.getElementById('_cbOpenRoadsEnabled').checked = false;
   // Similarly, force-disable Gazetteer Tags display - this isn't quite as resource-sapping as
   // the Open Roads display could be, but it's still preferable to leave it off until the user is
   // ready to show the tags during this session
   document.getElementById('_cbGazTagsEnabled').checked = false;
}
function oslWriteUserPrefs()
{
   localStorage.oslUserPrefs = JSON.stringify(oslUserPrefs);
}
function oslUpdateMinMax(key, value)
{
   let found = false;
   for(let i = 0; i < oslUserPrefs.minmax.length; ++i)
   {
      if(oslUserPrefs.minmax[i][0] == key)
      {
         oslUserPrefs.minmax[i][1] = value;
         found = true;
         break;
      }
   }
   if(found == false)
   {
      oslUserPrefs.minmax.push([key, value]);
   }
   oslWriteUserPrefs();
}
function oslUpdateHighlightCBs(key)
{
   let found = false;
   let value = document.getElementById(key).checked;
   for(let i = 0; i < oslUserPrefs.openRoads.length; ++i)
   {
      if(oslUserPrefs.openRoads[i][0] == key)
      {
         oslUserPrefs.openRoads[i][1] = value;
         found = true;
         break;
      }
   }
   if(found == false)
   {
      oslUserPrefs.openRoads.push([key, value]);
   }
   oslWriteUserPrefs();
}
function oslFinaliseSetup()
{
   oslSDK = getWmeSdk({scriptId:"wmeod",scriptName:"WME Open Data"});

   let mvp = oslSDK.Map.getMapViewportElement();
   let cID = mvp.id.replace("ViewPort", "Container");
   oslWazeMapElement = mvp.querySelector('#'+cID);

   oslEnableAdvancedOptions();
   oslLoadOrInitPrefs();

   oslSetupBBDiv();
   oslSetupORDiv();
   oslSetupNamesDiv();
   oslSetupUI();
   oslSetupEventListeners();      
   oslSetupUIPosition();
   oslSetLayerZIndices();
   oslSetupAccessKey();

   oslApplyPrefs();

   oslOffsetToolbar = document.getElementById('map').contains(document.getElementById('toolbar'));
   window.setInterval(oslTenthSecondTick,100);
   oslDoneOnload = true;
}
function oslWaitForW()
{
   if(document.getElementsByClassName("sandbox").length > 0)
   {
      oslAddLog('WME practice mode detected, script is disabled...');
      return;
   }
   if(document.location.href.indexOf('user/') !== -1)
   {
      oslAddLog('User profile page detected, script is disabled...');
      return;
   }

   if(typeof W === "undefined")
   {
      window.setTimeout(oslWaitForW, 1000);
      return;
   }

   if (W.userscripts?.state?.isReady)
   {
      oslFinaliseSetup();
   } 
   else 
   {
      document.addEventListener("wme-ready", oslFinaliseSetup, {once: true});
   }
}
function oslAccessKeyUpdate()
{
   GM_setValue('_rwoAccessKey',Date.now());
}
function oslSNATest()
{
   // Checks the street name abbreviation processing code in oslWazeifyStreetName(),
   // to make sure it still correctly handles names of a form that are particularly
   // problematic, whilst also still correctly handling regular forms...
   const testNames =
   [
      // Standard forms for all the defined abbreviations
      ['Electric Avenue', 'Electric Ave'],
      ['Hollywood Boulevard', 'Hollywood Blvd'],
      ['Ealing Broadway', 'Ealing Bdwy'],
      ['Hillingdon Circus', 'Hillingdon Cir'],
      ['Glenn Close', 'Glenn Cl'],
      ['Crown Court', 'Crown Ct'],
      ['Red Crescent', 'Red Cr'],
      ['Test Drive', 'Test Dr'],
      ['Graham Garden', 'Graham Gdn'],
      ['Kensington Gardens', 'Kensington Gdns'],
      ['Theresa Green', 'Theresa Gn'],
      ['Byker Grove', 'Byker Gr'],
      ['Lois Lane', 'Lois Ln'],
      ['My Cat Mews', 'My Cat Mews'],
      ['Tripod Mount', 'Tripod Mt'],
      ['Last Place', 'Last Pl'],
      ['Gosford Park', 'Gosford Pk'],
      ['Sophy Ridge', 'Sophy Rdg'],
      ['Take The High Road', 'Take The High Rd'],
      ['Four Square', 'Four Sq'],
      ['Baker Street', 'Baker St'],
      ['No Idea Terrace', 'No Idea Ter'],
      ['Happy Valley', 'Happy Val'],
      ['Hyperspace By-pass', 'Hyperspace Bypass'],
      ['This Is The Way', 'This Is The Way'],
      ['Damon Hill', 'Damon Hill'],

      // Forms including cardinals as prefixes
      ["North Street", "North St"],
      ["South Street", "South St"],
      ["East Street", "East St"],
      ["West Street", "West St"],
      ["North Town Street", "North Town St"],
      ["South Town Street", "South Town St"],
      ["East Town Street", "East Town St"],
      ["West Town Street", "West Town St"],
      ["West View Lane", "West View Ln"],

      // Forms including cardinals as suffixes
      ["Aston Boulevard West", "Aston Blvd W"],
      ["Breakspear Road North", "Breakspear Rd N"],
      ["Breakspear Road South", "Breakspear Rd S"],
      ["Breakspear Road East", "Breakspear Rd E"],
      ["Breakspear Road West", "Breakspear Rd W"],

      // Forms including non-cardinal suffixes
      ["High Road Ickenham", "High Rd Ickenham"],

      // Forms including "The"
      ["Orchard On The Green", "Orchard On The Green"],
      ["The Orchard On The Green", "The Orchard On The Green"],
      ["The Avenue", "The Avenue"],

      // Forms including abbreviatable words elsewhere in the name
      ["Green Street", "Green St"],
      ["Kensal Green Way", "Kensal Green Way"],
      ["Green Lane Hill", "Green Lane Hill"],
      ["Court Court", "Court Ct"],
      ["The Street Road", "The Street Rd"],
      ["Great North Road", "Great North Rd"],
      ["North Park Brook Road", "North Park Brook Rd"],

      // Forms where abbreviatable words are found at the start of longer words
      ["Westway Avenue", "Westway Ave"],
      ["Parkway Park", "Parkway Pk"],
      ["Parkway Crescent", "Parkway Cr"],

      // Test for correct abbreviation of Saint -> St.
      ["Saint Albans Way", "St. Albans Way"],

      // Random names taken from forum etc. discussions on this topic...
      ["Bowling Green Road", "Bowling Green Rd"],
      ["Crescent Road Lane", "Crescent Road Ln"],
      ["Edge Lane Road", "Edge Lane Rd"],
      ["North East Road", "North East Rd"]
   ];

   let nTests = testNames.length;
   for(let i = 0; i < nTests; ++i)
   {
      let result = oslWazeifyStreetName(testNames[i][0], false);
      if(result !== testNames[i][1])
      {
         console.log(oslWazeifyStreetName(testNames[i][0], true));
      }
   }
}
function oslInitialise()
{
   oslAddLog('initialise()');

   oslSNATest();

   // inject gazetteer data
   let gazscript = document.createElement("script");
   gazscript.setAttribute('type','text/javascript');
   gazscript.setAttribute('charset','UTF-8');
   gazscript.src = oslModifySrc(oslGazetteerURL);
   document.head.appendChild(gazscript);
   oslMergeGazData = true;

   // initialise persistent vars
   sessionStorage.zoom = 0;
   sessionStorage.lat = '';
   sessionStorage.lon = '';
   sessionStorage.myCity = '';
   sessionStorage.prevCityName = '';
   sessionStorage.cityChangeEastings = 0;
   sessionStorage.cityChangeNorthings = 0;
   sessionStorage.cityNameRB = 'optUseExisting';
   sessionStorage.oslMousepos = '{"x":0,"y":0}';

   oslWaitForW();
}

// External site helper functions
const hlp_ONE =
{
   // one.network helper functions
   lat: 0,
   lng: 0,
   zoom: 0,
   checkInterval: 10000,
   addLog: function(logtext)
   {
      console.log('ONE: '+logtext);
   },
   checkDatalink: function()
   {
      let lastAccessKey = GM_getValue('_oneAccessKey', null);
      if(lastAccessKey !== null)
      {
         let keyBits = lastAccessKey.split(',');
         if(keyBits.length === 4)
         {
            let keyTS = parseInt(keyBits[0]);
            if((Date.now() - keyTS) <= hlp_ONE.checkInterval)
            {
               // the access key was written recently enough to imply an active WME tab, so reposition if required based on the lat/lon/zoom values in the key
               let lat = parseFloat(keyBits[1]);
               let lng = parseFloat(keyBits[2]);
               let zoom = parseFloat(keyBits[3]);
               if((lat != hlp_ONE.lat) || (lng != hlp_ONE.lng) || (zoom != hlp_ONE.zoom))
               {
                  hlp_ONE.lat = lat;
                  hlp_ONE.lng = lng;
                  hlp_ONE.zoom = zoom;
                  hlp_ONE.relocate();
               }
               hlp_ONE.checkInterval = 1000; // reduce the interval after the first check, to minimise the period where manually panning/zooming is overridden
            }
         }
      }
      setTimeout(hlp_ONE.checkDatalink, 50);
   },
   relocate: function()
   {
      Elgin.map.setCenter([hlp_ONE.lng, hlp_ONE.lat]);
      Elgin.map.setZoom(hlp_ONE.zoom - 1);
   },
   clickToWME: function()
   {
      let elginLat = Elgin.map.getCenter().lat;
      let elginLon = Elgin.map.getCenter().lng;
      let elginZoom = Elgin.map.getZoom();
      
      if(elginZoom < 12) elginZoom = 12;
      if(elginZoom > 22) elginZoom = 22;
      elginZoom += 1;

      // check for an active WME tab...
      let tabFound = false;
      let lastAccessKey = GM_getValue('_rwoAccessKey', null);
      if(lastAccessKey !== null)
      {
         lastAccessKey = parseInt(lastAccessKey);
         if((Date.now() - lastAccessKey) <= 10000)
         {
            // the access key was written within the last 10s which implies an active tab, so send it the repositioning data
            let toWrite = Date.now()+','+lastAccessKey+','+elginLat+','+elginLon+','+elginZoom;
            GM_setValue('_rwoPositionToWME',toWrite);
            tabFound = true;
         }
      }

      if(tabFound === false)
      {
         // couldn't find a WME tab to reposition, so open a new one...
         let wmeURL = 'https://www.waze.com/editor?';
         wmeURL += 'lon='+elginLon;
         wmeURL += '&lat='+elginLat;
         wmeURL += '&zoomLevel='+elginZoom;
         window.open(wmeURL);
      }
   },
   init: function()
   {
      hlp_ONE.addLog('initialise()');
      hlp_ONE.addLog('waiting for map objects...');
      let waitSomeMore = false;

      try
      {
         if(Elgin === undefined)
         {
            waitSomeMore = true;
         }
         else if (Elgin.map === undefined)
         {
            waitSomeMore = true;
         }
      }
      catch
      {
         waitSomeMore = true;
      }

      if(document.getElementById('map-canvas') === null)
      {
         waitSomeMore = true;
      }

      if(waitSomeMore)
      {
         window.setTimeout(hlp_ONE.init,500);
         return;
      }

      hlp_ONE.addLog('all required objects found...');

      // Add "open in WME" button...
      let tBtnDiv = document.createElement('div');
      tBtnDiv.id = 'rwoWMELink';
      let tHTML = '<div class="gmnoprint" draggable="false" controlwidth="40" controlheight="40" style="margin: 10px; user-select: none; position: absolute; bottom: 200px; right: 40px;">';
      tHTML += '<div class="gmnoprint" controlwidth="40" controlheight="40" style="position: absolute; left: 0px; top: 0px;">';
      tHTML += '<div draggable="false" style="user-select: none; box-shadow: rgba(0, 0, 0, 0.3) 0px 1px 4px -1px; border-radius: 2px; cursor: pointer; background-color: rgb(255, 255, 128); width: 40px; height: 40px;">';
      tHTML += '<button draggable="false" title="Open in WME" aria-label="Open in WME" type="button" class="gm-control-active" style="background: none; display: block; border: 0px; margin: 0px; padding: 0px; position: relative; cursor: pointer; user-select: none; overflow: hidden; width: 40px; height: 40px; top: 0px; left: 0px;"><strong>WME</strong></button>';
      tHTML += '</div></div></div>';
      tBtnDiv.innerHTML = oslModifyHTML(tHTML);
      document.getElementById('map-canvas').firstChild.appendChild(tBtnDiv);

      document.getElementById('rwoWMELink').addEventListener('click', hlp_ONE.clickToWME, false);
      setTimeout(hlp_ONE.checkDatalink, 500);
   }
};

const hlp_LRR =
{
   // London Roadworks Register helper functions
   lat: 0,
   lng: 0,
   zoom: 0,
   checkInterval: 10000,
   wmePresent: false,
   addLog: function(logtext)
   {
      console.log('LRR: '+logtext);
   },
   checkDatalink: function()
   {
      let lastAccessKey = GM_getValue('_lrrAccessKey', null);
      if(lastAccessKey !== null)
      {
         let keyBits = lastAccessKey.split(',');
         if(keyBits.length === 4)
         {
            let keyTS = parseInt(keyBits[0]);
            if((Date.now() - keyTS) <= hlp_LRR.checkInterval)
            {
               if(hlp_LRR.wmePresent === false)
               {
                  hlp_LRR.wmePresent = true;
                  document.querySelector('#messageContainer').style.display = "none";
               }
               // the access key was written recently enough to imply an active WME tab, so reposition if required based on the lat/lon/zoom values in the key
               let lat = parseFloat(keyBits[1]);
               let lng = parseFloat(keyBits[2]);
               let zoom = parseFloat(keyBits[3]);
               if((lat != hlp_LRR.lat) || (lng != hlp_LRR.lng) || (zoom != hlp_LRR.zoom))
               {
                  hlp_LRR.lat = lat;
                  hlp_LRR.lng = lng;
                  hlp_LRR.zoom = zoom;
                  hlp_LRR.relocate();
               }
               hlp_LRR.checkInterval = 1000; // reduce the interval after the first check, to minimise the period where manually panning/zooming is overridden
            }
         }
      }
      setTimeout(hlp_LRR.checkDatalink, 50);
   },
   relocate: function()
   {
      let waitSomeMore = false;

      if(map === undefined)
      {
         waitSomeMore = true;
      }
      if(OpenLayers === undefined)
      {
         waitSomeMore = true;
      }
      if(waitSomeMore)
      {
         return;
      }

      let tz = hlp_LRR.zoom - 12;
      if(tz > 5)
      {
         tz = 5;
      }         
      map.panTo(new OpenLayers.LonLat(hlp_LRR.lng,hlp_LRR.lat));
      map.zoomTo(tz);
   },
   init: function()
   {
      // trap the page reload that occurs when the map view is generated...
      if(document.location.href.indexOf('home') == -1)
      {
         hlp_LRR.addLog('page reloaded during map generation...');
         setTimeout(hlp_LRR.checkDatalink, 500);   
         return;
      }

      hlp_LRR.addLog('initialise()');
      hlp_LRR.addLog('waiting for search page to load...');
      var waitSomeMore = false;
      if(document.getElementsByName('mapResults')[0].length < 1)
      {
         waitSomeMore = true;
      }
      if(document.getElementsByName('postCode')[0].length < 1)
      {
         waitSomeMore = true;
      }

      if(waitSomeMore === true)
      {
         window.setTimeout(hlp_LRR.init,500);
         return;
      }

      hlp_LRR.addLog('accessing map...');
      // first set a "safe" postcode as the search criteria - whilst asking for the map view to be generated without any
      // search terms usually works OK, from time to time the site throws a wobbler and refuses to do anything without
      // having the search narrowed down a bit...
      document.getElementsByName('postCode')[0].value="EC1A 1AA";
      document.getElementsByName('mapResults')[0].click();

      setTimeout(hlp_LRR.checkDatalink, 500);
   }
};

const hlp_ODM =
{
   // OS OpenData map helper functions
   lat: 0,
   lng: 0,
   zoom: 0,
   checkInterval: 10000,
   wmePresent: false,
   lastAccessKey: null,
   addLog: function(logtext)
   {
      console.log('ODM: '+logtext);
   },
   checkDatalink: function()
   {
      let thisAccessKey = GM_getValue('_osodAccessKey', null);
      if((thisAccessKey !== null) && (thisAccessKey !== hlp_ODM.lastAccessKey))
      {
         hlp_ODM.lastAccessKey = thisAccessKey;
         let keyBits = thisAccessKey.split(',');
         if(keyBits.length === 4)
         {
            let keyTS = parseInt(keyBits[0]);
            let keyInterval = Date.now() - keyTS;
            if(keyInterval <= hlp_ODM.checkInterval)
            {
               if(hlp_ODM.wmePresent === false)
               {
                  hlp_ODM.addLog("WME detected");
                  hlp_ODM.wmePresent = true;
                  hlp_ODM.fakeOnload();
               }
               // the access key was written recently enough to imply an active WME tab, so reposition if required based on the lat/lon/zoom values in the key
               let lat = parseFloat(keyBits[1]);
               let lng = parseFloat(keyBits[2]);
               let zoom = parseFloat(keyBits[3]);
               if((lat != hlp_ODM.lat) || (lng != hlp_ODM.lng) || (zoom != hlp_ODM.zoom))
               {
                  hlp_ODM.lat = lat;
                  hlp_ODM.lng = lng;
                  hlp_ODM.zoom = zoom;
                  hlp_ODM.relocate();
               }
               hlp_ODM.checkInterval = 1000; // reduce the interval after the first check, to minimise the period where manually panning/zooming is overridden
            }
         }
      }
      setTimeout(hlp_ODM.checkDatalink, 50);
   },
   hideElement: function(elm)
   {
      let i = document.querySelectorAll(elm).length;
      if(i === 0)
      {
         hlp_ODM.addLog(elm + " not found...");
      }
      while(i > 0)
      {
         document.querySelectorAll(elm)[--i].style.display="none";
      }
   },
   fakeOnload: function()
   {
      // maximise the map view
      hlp_ODM.hideElement('.govuk-grid-row');
      hlp_ODM.hideElement('.govuk-phase-banner');
      hlp_ODM.hideElement('.govuk-service-navigation');
      hlp_ODM.hideElement('.govuk-heading-l');
      hlp_ODM.hideElement('.govuk-header ');
      hlp_ODM.hideElement('.govuk-footer');
      hlp_ODM.hideElement('.govuk-list');
      hlp_ODM.hideElement('.govuk-body');
      hlp_ODM.hideElement('.govuk-heading-m');
      hlp_ODM.hideElement('#gcd-container');
      hlp_ODM.hideElement('.language-switcher ');

      document.querySelector('.govuk-main-wrapper ').style.padding="0px 0px 0px 0px";

      let i = document.querySelectorAll('.govuk-width-container ').length;
      while(i > 0)
      {
         document.querySelectorAll('.govuk-width-container ')[--i].style.maxWidth="100%";
      }

      document.querySelector('#map').style.position="absolute";
      document.querySelector('#map').style.height="100%";
   },
   relocate: function()
   {
      map.getView().setCenter([hlp_ODM.lng, hlp_ODM.lat]);
      map.getView().setZoom(hlp_ODM.zoom);
   },
   init: function()
   {
      hlp_ODM.addLog('initialise()');
      if(typeof(map) === "undefined") window.setTimeout(hlp_ODM.init,100);
      else window.setTimeout(hlp_ODM.checkDatalink, 500);
   }
};

oslBootstrap();
