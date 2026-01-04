// ==UserScript==
// @name         BGG Market Listing Detailed Locations
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  Attempts to display detailed locations on market listings on BGG.
// @author       Escher0
// @run-at       document-idle
// @match        https://boardgamegeek.com/market/product/*
// @icon         https://www.google.com/s2/favicons?domain=boardgamegeek.com
// @grant        GM_xmlhttpRequest
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/451722/BGG%20Market%20Listing%20Detailed%20Locations.user.js
// @updateURL https://update.greasyfork.org/scripts/451722/BGG%20Market%20Listing%20Detailed%20Locations.meta.js
// ==/UserScript==

(window.onload = (function() {

    'use strict';

    // Your code here...
    var locationBox = document.evaluate("//td[contains(text(),'Location')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE).singleNodeValue.nextElementSibling;
    var userLink = document.querySelector('[title="Items sold by this user"]');
    //console.log(userLink);
    //console.log(userLink.text);
    //console.log("^^^");
    //var userStr = userLink.href.split("user/")[1];
    var userStr = userLink.text;
    //var userStr = "dylansofia";
    //console.log(userStr);

    GM_xmlhttpRequest ( {
        method:     "GET",
        url:        "https://boardgamegeek.com/user/" + userStr,
        onload:     parseResponse,
        onerror:    function (e) { console.error ('**** error ', e); },
        onabort:    function (e) { console.error ('**** abort ', e); },
        ontimeout:  function (e) { console.error ('**** timeout ', e); }
    } );

    function parseResponse (response) {
        //alert(response.responseText);
        //alert(response.querySelector('[class="profile_table"]').innerText.split("State:\t")[1].split("\n")[0]);
        //alert(response.responseText.split("State:\t")[1].split("\n")[0]);

        var parser = new DOMParser ();
        /* IMPORTANT!
        1) For older browsers, see
        https://developer.mozilla.org/en-US/docs/Web/API/DOMParser
        for a work-around.

        2) jQuery.parseHTML() and similar is bad because it causes images, etc., to be loaded.
    */
        var ajaxDoc = parser.parseFromString (response.responseText, "text/html");
        //console.log (newStatTable);
        //alert (newStatTable);
        //console.log(ajaxDoc.querySelector('[class="profile_table"]').innerText);
        var state = ajaxDoc.querySelector('[class="profile_table"]').innerText.split("State:")[1].split("Town")[0].trim();
        //console.log(state);
        var city = ajaxDoc.querySelector('[class="profile_table"]').innerText.split("City:")[1].split("Website")[0].trim();
        //console.log(city);

        //var newLocation = document.createTextNode(" " + city + ", " + state);
        //userLink.appendChild(newLocation);
        locationBox.innerText = city + ", " + state + ", " + locationBox.innerText;
    }

}));