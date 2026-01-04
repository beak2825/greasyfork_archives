// ==UserScript==
// @name        WME Charge Station PUR Improvements (Belgium/Luxembourg)
// @author      Tom 'Glodenox' Puttemans
// @namespace   http://www.tomputtemans.com/
// @description Change some data when accepting charging station PURs
// @include     /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor.*$/
// @version     0.4
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/460332/WME%20Charge%20Station%20PUR%20Improvements%20%28BelgiumLuxembourg%29.user.js
// @updateURL https://update.greasyfork.org/scripts/460332/WME%20Charge%20Station%20PUR%20Improvements%20%28BelgiumLuxembourg%29.meta.js
// ==/UserScript==

/* global OpenLayers, W, require */

const nameReplacements = {
  "Laadpunt": "Laadstation",
  "laadpunt": "Laadstation",
  "Laadpaal": "Laadstation",
  "laadpaal": "Laadstation",
  "Lader": "Laadstation",
  "lader": "Laadstation",
  "stad_antwerpen": "Stad Antwerpen",
  "stad_gent": "Stad Gent",
  "Borne de charge": "Station de recharge",
  "borne de charge": "Station de recharge",
  "Borne de recharge": "Station de recharge",
  "borne de recharge": "Station de recharge",
  " Charging Station": ""
};
const affixRegex = /.*( #\d+)$/;
const httpRegex = /^https?:\/\/(www.)?/;
let brusselsPolygon = null;
let updateMessage = document.createElement('div');
updateMessage.textContent = "🌟 Charging station automatically improved!";
updateMessage.style.position = "absolute";
updateMessage.style.backgroundColor = "#060";
updateMessage.style.color = "#eee";
updateMessage.style.zIndex = 99999999;
updateMessage.style.top = "160px";
updateMessage.style.left = "800px";
updateMessage.style.borderRadius = "10px";
updateMessage.style.padding = "5px";
updateMessage.style.border = "2px solid #ccc";
updateMessage.style.cursor = "default";
updateMessage.style.display = "none";

function initUpdater() {
  if (typeof W === 'undefined' || typeof W.model === 'undefined' || typeof W.model.actionManager === 'undefined' || typeof OpenLayers === 'undefined') {
    setTimeout(initUpdater, 300);
    console.log('Waze action manager unavailable, map still loading');
    return;
  }

  const geoJsonFormatter = new OpenLayers.Format.GeoJSON();
  brusselsPolygon = geoJsonFormatter.read('{ "type": "MultiPolygon", "coordinates": [ [ [ [ 498682, 6585185 ], [ 489630, 6580321 ], [ 487272, 6579766 ], [ 484827, 6580207 ], [ 481749, 6582290 ], [ 478810, 6588529 ], [ 476785, 6587473 ], [ 472614, 6589804 ], [ 473937, 6592499 ], [ 476762, 6592973 ], [ 477468, 6595936 ], [ 476330, 6597939 ], [ 478442, 6602115 ], [ 482526, 6604176 ], [ 487283, 6603374 ], [ 490171, 6606238 ], [ 492087, 6604742 ], [ 493834, 6601734 ], [ 493778, 6600036 ], [ 492035, 6598240 ], [ 496510, 6595369 ], [ 498277, 6589785 ], [ 495918, 6589476 ], [ 494980, 6587928 ], [ 498682, 6585185 ] ] ] ] }', "Geometry");

  document.body.appendChild(updateMessage);
  W.model.actionManager.events.on("afteraction", handleAction);
}

function handleAction(event) {
  try {
    if (event.action.approved != true || event.action?.venue == null || !event.action?.venue.attributes.categories.includes("CHARGING_STATION")) {
      return;
    }
    let venue = event.action?.venue;
    if (!inSupportedCountry(venue)) {
      return;
    }
    let UpdateObject = require('Waze/Action/UpdateObject');
    let changes = {};
    let affix = "";
    if (affixRegex.test(venue.attributes.name)) {
      affix = affixRegex.exec(venue.attributes.name)[1];
    }
    let fixedName = affix.length > 0 ? venue.attributes.name.slice(0, affix.length * -1) : venue.attributes.name;
    Object.keys(nameReplacements).forEach(key => (fixedName = fixedName.replace(key, nameReplacements[key])));
    if (!fixedName.endsWith("Laadstation") && !fixedName.endsWith("Station de recharge")) {
      fixedName += getChargerLanguage(venue.attributes.geometry) == "NL" ? " Laadstation" : " Station de recharge";
    }
    fixedName += affix;
    if (venue.attributes.name != fixedName) {
      changes.name = fixedName;
    }
    let accessType = venue.attributes.categoryAttributes?.CHARGING_STATION?.accessType;
    if (venue.attributes.openingHours.length == 0 && (accessType == 'PUBLIC' || accessType == null)) {
      changes.openingHours = [
        {
          fromHour: "00:00",
          toHour: "00:00",
          days: [0, 1, 2, 3, 4, 5, 6],
          isAllDay: () => true
        }
      ];
    }
    let costType = venue.attributes.categoryAttributes?.CHARGING_STATION?.costType;
    if (venue.attributes.categoryAttributes.CHARGING_STATION && costType == null) {
      changes.categoryAttributes = {};
      changes.categoryAttributes.CHARGING_STATION = Object.assign({}, venue.attributes.categoryAttributes.CHARGING_STATION);
      changes.categoryAttributes.CHARGING_STATION.costType = "FEE";
    }
    if (venue.attributes.url?.startsWith("http")) {
      changes.url = venue.attributes.url.replace(httpRegex, "");
    }
    // Chargy
    if (venue.attributes.phone == "+352-80-062020") {
      changes.phone = "+352 80062020";
    } else if (venue.attributes.phone != null && venue.attributes.phone.indexOf("-") != -1) {
      changes.phone = venue.attributes.phone.replaceAll("-", " ");
    }
    if (Object.keys(changes).length != 0) {
      console.log(changes);
      W.model.actionManager.add(new UpdateObject(venue, changes));
      updateMessage.style.display = "block";
      setTimeout(() => (updateMessage.style.display = "none"), 2000);
    }
  } catch (e) {
    console.error("Failed to process venues", e);
  }
}

function inSupportedCountry(venue) {
  if (venue.attributes.streetID != null) {
    let cityId = W.model.streets.getObjectById(venue.attributes.streetID).attributes.cityID;
    let countryId = W.model.cities.getObjectById(cityId).attributes.countryID;
    return countryId == 21 || countryId == 130;
  }
  if (W.model.topCountry.abbr == 'BE' || W.model.topCountry.abbr == 'LU') {
    return true;
  }
  return false;
}

function getChargerLanguage(geometry) {
  // Probably Brussels
  if (brusselsPolygon.intersects(geometry)) {
    return "FR";
  }
  // Probably Flanders
  if (geometry.y > 6588038) {
    return "NL";
  }
  // Probably Wallonia or Luxembourg
  if (geometry.y < 6566417) {
    return "FR";
  }
  return window.confirm("Too close to language border to predict language for rewriting charging station name. Press OK for 'Laadstation' or Cancel for 'Station de recharge'") ? "NL" : "FR";
}

initUpdater();
