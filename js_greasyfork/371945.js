// ==UserScript==
// @name         RedFinPlus
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Provide an external links for title reviews
// @author       info@alientech.software
// @match        http*://www.redfin.com/*
// @include      /^https?:\/\/www.redfin.com\/.*\/[\d]+$/
// @grant        GM_*
// @grant        unsafeWindow
// @run-at       document-end
// @require      http://code.jquery.com/jquery-3.2.1.min.js

// @downloadURL https://update.greasyfork.org/scripts/371945/RedFinPlus.user.js
// @updateURL https://update.greasyfork.org/scripts/371945/RedFinPlus.meta.js
// ==/UserScript==
// devtools.chrome.enabled: true
// devtools.debugger.remote-enabled: true
var timer;

var GetAddressParts = function(address_url) {
    // https://www.redfin.com/WA/Bothell/933-223rd-Pl-SE-98021/unit-16-S/home/146122663
    // https://www.redfin.com/WA/Bothell/933-223rd-Pl-SE-98021/home/146122663
    var myRegx = /http[s]?:\/\/www.redfin.com\/([\w]+)\/([\w]+)\/([\w-+]+)-([\d]+)?(\/(.*))?\/home\/([\d]+)/ig
    var res = myRegx.exec(address_url);
    return {
        "state":res[1],
        "city":res[2],
        "display":res[3],
        "zip":res[4],
        "unit":res[6],
        "propertyId":res[7],
    };
};

function replaceAll(original_str, find_str, replace_str) {
  return original_str.split(find_str).join(replace_str);
};

var HandleHouse = function() {
    //debugger;
    console.log("detected a house url");
    var commentsSection = jQuery("[class*='CommentsSection']")[0];
    console.log("commentsSection = " + commentsSection.attributes[0].value);
    var parent = commentsSection.parentNode;

    var address_parts = GetAddressParts(location.href)
    console.log("address_parts = " + address_parts);

    var areavibes_sub_path = ""
    if (address_parts.display.length > 0) {
        areavibes_sub_path = address_parts.city + "-" + address_parts.state + "/livability/";
    }
    var areavibes = document.createElement("DIV")
    areavibes.innerHTML = "<H2>Areavibes</H2><IFRAME width='100%' height='500' src='https://www.areavibes.com/" + areavibes_sub_path + "'/>"
    parent.appendChild(areavibes);

    var spotcrime_sub_path = ""
    if (address_parts.display.length > 0) {
        spotcrime_sub_path = "#"
            + replaceAll(address_parts.display, '-', '%20') + "%2C"
            + replaceAll(address_parts.city, '-', '%20') + "%2C"
            + address_parts.state + '%20' + address_parts.zip;
    }
    var spotcrime = document.createElement("DIV")
    spotcrime.innerHTML = "<H2>spotcrime</H2><IFRAME width='100%' height='500' src='https://spotcrime.com/"+spotcrime_sub_path+"'/>"
    parent.appendChild(spotcrime);
};

(function() {
    'use strict';

    // check URL to see if it represents a house
    //debugger;
    if (/^https?:\/\/www.redfin.com\/.*\/[\d]+$/.test (location.href) ) {
        timer = setTimeout(HandleHouse, 5000);
    }
})();


