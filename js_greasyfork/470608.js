// ==UserScript==
// @name         WME-to-Schneider-corp_GIS_interface

// @namespace    https://greasyfork.org/en/users/173378-ramblinwreck
// @version      2023.08.16.1
// @description  this script needs WME GIS Locator script installed and working.  This scripts works with that script to center schenidercorp GIS pages on the WME map center screen.
// @author       ramblinwreck_81
// @match    qpublic.schneidercorp.com*
// @include *qpublic.schneidercorp.com*
// @exclude      https://www.waze.com/user/editor*
// @grant GM_setClipboard


// @downloadURL https://update.greasyfork.org/scripts/470608/WME-to-Schneider-corp_GIS_interface.user.js
// @updateURL https://update.greasyfork.org/scripts/470608/WME-to-Schneider-corp_GIS_interface.meta.js
// ==/UserScript==
/* global W */
// This script works in conjunction with script WME GIS Locator.
// WME GIS Locator requires WME GIS Buttons running.
// To successfully use this script, you must have WME  GIS Locator, WME GIS Buttons, and this script installed/enabled.
// GIS Buttons does a great job of taking a county/city GIS map and taking WME center screen coordinates to open a county web page at the exact same coordinates.
// But GIS Buttons does not work well with city/county web pages produced by qpublic or schneidercorp.
// GIS Locator does the behind the scenes work of 1) getting lat/lon from WME and 2) parsing a qpublic or schneidercorp website to create a URL that can be used by a Waze map editor (opening a
// qpublic or schneidercorp page centered based on WME lat/lon coordinates.

function bootstrap(tries) {
//         console.log('GIS-Locator: initiating bootstrap');
         tries = tries || 1;

        if ((document.getElementsByClassName('sprite ZoomXY')[0]) && ((document.getElementsByClassName('ItemInactive').length) >=13)){
//             $ && WazeWrap.Ready ) {
            console.log('Schneider page loaded');
            readCoordinates();

        } else if (tries < 1000) {
            console.log('not loaded.  Retrying');
            setTimeout(function () {bootstrap(tries++);}, 200);
         }
    }
async function readCoordinates()
{
    const coordinates = await navigator.clipboard.readText();
    var validClipboardRegExp = /((lon=)\-?\d{1,3}\.\d{3,6})\,((lat=)\-?\d{1,3}\.\d{3,6})/g;
    let clipboardValidity = coordinates.toString().match(validClipboardRegExp) || [];
    if (clipboardValidity.length !== 1)
    {
        alert ('Clipboard contents cannot be passed to the county GIS page.');
        return;
    }
    var coordinateExtraction = /(\-?\d{1,3}\.\d{3,6})/g
    var coordArray = clipboardValidity[0].match(coordinateExtraction);
    const lon = coordArray[0];
    const lat = coordArray[1];
    document.getElementsByClassName('sprite ZoomXY')[0].click();
    document.getElementById('ddlZoomToXyCoordSys').selectedIndex = '1';
//    document.getElementsByClassName('ItemInactive')[7].click();
    document.getElementById('txtXpos').value = lon;
    document.getElementById('txtYpos').value = lat;
    document.getElementById('btnZoomToXY').click();

};
bootstrap();


// lon=-84.772123,lat=31.784302
//regexp for testing validity of clipboard:  /((lon=)\-?\d{1,3}\.\d{3,6})\,((lat=)\-?\d{1,3}\.\d{3,6})/g
//regexp for either lon or lat is: /(\-?\d{1,3}\.\d{3,6})/g