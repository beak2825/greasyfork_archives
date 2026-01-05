// ==UserScript==
// @name         WME Auto-Verify Speed Limits
// @namespace    wme-auto-verify-speed-limits
// @version      1.4
// @description  Automatically confirms unverified speed limits in Poland
// @author       FZ69617
// @include      https://www.waze.com/*/editor/*
// @include      https://www.waze.com/editor/*
// @include      https://editor-beta.waze.com/*
// @exclude      https://www.waze.com/user/*editor/*
// @exclude      https://www.waze.com/*/user/*editor/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/18893/WME%20Auto-Verify%20Speed%20Limits.user.js
// @updateURL https://update.greasyfork.org/scripts/18893/WME%20Auto-Verify%20Speed%20Limits.meta.js
// ==/UserScript==

(function() {
'use strict';

var verifyRoadType = {
  3: true,  // Freeway
  6: true,  // Major Highway
  7: true,  // Minor Highway
  4: true,  // Ramp
  2: false, // Primary Street
  1: false, // Street
  8: false  // Dirt road
};

var verifyCountry = "PL";

function getStandardSpeedLimit(segment) {
  var attrs = segment.attributes;
  var street = Waze.model.streets.get(attrs.primaryStreetID);
  var city = Waze.model.cities.get(street.cityID);

  var inCity = city.name !== "";

  switch (attrs.roadType) {
    case 3: // Freeway
      return 140;
    case 4: // Ramp
      return 40;
    case 8: // Dirt road
      return null;
    case 6: // Major Highway
      if (/S\d+/g.test(street.name)) return 120;
    case 7: // Minor Highway
    case 2: // Primary Street
    case 1: // Street
    default:
      return inCity ? 50 : 90;
  }
}

var Waze_Model_Object = {};
var Waze_Action = {};


function verifySpeedLimits() {
  //console.log('WMEAVSL: Veryfing speeds...');

  var previousSelection = getSelectedSegments();
  var changeCount = 0;
  var finished = true;

  for (var seg in Waze.model.segments.objects) {
    var segment = Waze.model.segments.get(seg);

    if (!isOnScreen(segment)) continue;
    if (!segment.arePropertiesEditable()) continue;

    if (segment.state === "Update") continue;

    var attrs = segment.attributes;

    if (!verifyRoadType[attrs.roadType]) continue;

    var street = Waze.model.streets.get(attrs.primaryStreetID);
    var city = Waze.model.cities.get(street.cityID);
    var country = Waze.model.countries.get(city.countryID);

    if (verifyCountry !== country.abbr) continue;

    var stdSpeedLimit = getStandardSpeedLimit(segment);

    if (stdSpeedLimit === null) continue;


    var fwdVerify = attrs.fwdDirection && attrs.fwdMaxSpeedUnverified;
    var revVerify = attrs.revDirection && attrs.revMaxSpeedUnverified;

    if (!fwdVerify && !revVerify) continue;

    if (fwdVerify && attrs.fwdMaxSpeed !== stdSpeedLimit) continue;
    if (revVerify && attrs.revMaxSpeed !== stdSpeedLimit) continue;

    //Waze.selectionManager.select([segment]);

    var fwdSL = fwdVerify ? attrs.fwdMaxSpeed : null;
    var revSL = revVerify ? attrs.revMaxSpeed : null;

    doVerifySL(segment, fwdSL, revSL);

    ++changeCount;

    if (changeCount >= 100) {
      finished = false;
      break;
    }
  }

  if (changeCount > 0) {
    console.log('WMEAVSL: Verified segments:', changeCount);
    Waze.selectionManager.select(previousSelection);
  }

  return finished;
}



function doVerifySL(segment, fwdSL, revSL) {

  function cloneArray(a) {
    return a ? a.map(function (i) { return i.clone(); }) : [];
  }

  var verify = {};

  var fwdRestrictions = cloneArray(segment.attributes.fwdRestrictions);
  var revRestrictions = cloneArray(segment.attributes.revRestrictions);

  var user = Waze.app.loginManager.user;

  function makeR(sl) {
    return new Waze_Model_Object.Restriction({
      allDay: false,
      days: 1,
      description: "Auto-verified speed limit " + sl +
          " by " + user.userName + "(" + user.normalizedLevel + ")" +
          ", " + new Date().toISOString().substring(0, 10) +
          ", AVSL " + GM_info.script.version + ".",
      fromDate: "2020-01-01",
      fromTime: "00:00",
      toDate: "2020-01-01",
      toTime: (sl/10 < 10 ? "0" : "") + Math.ceil(sl/10) + ":0" + (sl%10),
      vehicleTypes: -1
    });
  }

  if (fwdSL) {
    fwdRestrictions.push(makeR(fwdSL));
    verify.fwdMaxSpeedUnverified = false;
    verify.fwdMaxSpeed = fwdSL;
  }

  if (revSL) {
    revRestrictions.push(makeR(revSL));
    verify.revMaxSpeedUnverified = false;
    verify.revMaxSpeed = revSL;
  }

  var a = new Waze_Action.MultiAction();

  Waze.model.actionManager.add(a);

  a.doSubAction(new Waze_Action.UpdateObject(segment, verify));
  a.doSubAction(new Waze_Action.UpdateObject(segment, {
    fwdRestrictions: fwdRestrictions,
    revRestrictions: revRestrictions
  }));

}


function getSelectedSegments() {
  return Waze.selectionManager.selectedItems
    .filter(function (item) { return item.model.type === "segment"; })
    .map(function (item) { return item.model; });
}

function isOnScreen(segment) {
  var e = Waze.map.getExtent();
  var eg = e.toGeometry();
  return eg.intersects(segment.geometry);
}


var verifySet = false;

function setVerifySpeedLimits() {
  verifySet = true;
}
function verifySpeedLimitsIfSet() {
  if (verifySet) {
    verifySet = !verifySpeedLimits();
  }
}

function init() {
  console.log('WMEAVSL: Version ' + GM_info.script.version + ' started');

  Waze_Model_Object.Restriction = require('Waze/Model/Object/Restriction');
  Waze_Action.MultiAction = require('Waze/Action/MultiAction');
  Waze_Action.UpdateObject = require('Waze/Action/UpdateObject');

  Waze.map.events.register("moveend", null, setVerifySpeedLimits);
  Waze.map.baseLayer.events.register("loadend", null, setVerifySpeedLimits);
  Waze.model.events.register("mergeend", null, setVerifySpeedLimits);
  Waze.vent.on("operationDone", setVerifySpeedLimits);

  setVerifySpeedLimits();
}

function bootstrap() {
  if (typeof Waze === 'undefined' ||
      typeof Waze.map === 'undefined' ||
      typeof Waze.map.events === 'undefined' ||
      typeof Waze.map.baseLayer === 'undefined' ||
      typeof Waze.model === 'undefined' ||
      typeof Waze.model.events === 'undefined' ||
      typeof Waze.vent === 'undefined' ||
      typeof I18n === 'undefined') {
    console.log('WMEAVSL: Waze not fully initialzed yet...');
    setTimeout(bootstrap, 500);
    return;
  }
  init();
}

setTimeout(bootstrap, 1000);
setInterval(verifySpeedLimitsIfSet, 500);

})();