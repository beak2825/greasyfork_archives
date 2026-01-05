// ==UserScript==
// @name         WME AVSL Restrictions Removal Helper
// @namespace    wme-avsl-restrictions-removal-helper
// @version      1.4
// @description  Helps in removal of time based restrictions denoting auto-verified speed limits in Poland
// @author       FZ69617
// @include      https://www.waze.com/*/editor/*
// @include      https://www.waze.com/editor/*
// @include      https://editor-beta.waze.com/*
// @exclude      https://www.waze.com/user/*editor/*
// @exclude      https://www.waze.com/*/user/*editor/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/19098/WME%20AVSL%20Restrictions%20Removal%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/19098/WME%20AVSL%20Restrictions%20Removal%20Helper.meta.js
// ==/UserScript==

(function() {
'use strict';

var Waze_Model_Object = {};
var Waze_Action = {};


function hasTBRMarker(restrictions) {
  return restrictions && restrictions.some(function (r) {
    return r.fromDate == "2020-01-01" && r.toDate == "2020-01-01" &&
        /Auto-verified speed limit \d+ by .*/g.test(r.description);
  });
}

function removeTBRMarker(restrictions) {
  if (restrictions) {
    var ix = restrictions.find(function (r) {
      return r.fromDate == "2020-01-01" && r.toDate == "2020-01-01" &&
          /Auto-verified speed limit \d+ by .*/g.test(r.description);
    });
    if (ix) {
      var clone = restrictions.map(function (i) { return i.clone(); });
      clone.splice(ix, 1);

      return clone;
    }
  }
  return null;
}

function hasAVSLMarkers(dir, segments) {
  for (var i = 0; i < segments.length; ++i) {
    var segment = segments[i];
    if (hasTBRMarker(segment.attributes[dir + 'Restrictions'])) return true;
  }
  return false;
}

function hasUnverifiedSL(dir, segments) {
  for (var i = 0; i < segments.length; ++i) {
    var segment = segments[i];
    if (segment.attributes[dir + 'MaxSpeedUnverified']) return true;
  }
  return false;
}


function verifySpeedLimits(dir, segments) {
  var action = null;
  var count = 0;

  segments.forEach(function (segment) {
    var updateData = null;

    function setUpdateData(key, value) {
      if (!action) {
        action = new Waze_Action.MultiAction();

        Waze.model.actionManager.add(action);
      }
      updateData = updateData || {};
      updateData[key] = value;
    }

    var restrictions = segment.attributes[dir + 'Restrictions'];
    var newRestrictions = removeTBRMarker(restrictions);
    if (newRestrictions) {
      setUpdateData(dir + 'Restrictions', newRestrictions);
    }

    if (segment.attributes[dir + 'MaxSpeedUnverified']) {
      setUpdateData(dir + 'MaxSpeed', segment.attributes[dir + 'MaxSpeed']);
      setUpdateData(dir + 'MaxSpeedUnverified', false);
    }

    if (updateData) {
      action.doSubAction(new Waze_Action.UpdateObject(segment, updateData));
      ++count;
    }
  });

  return count;
}


function setSLControls(dir, segments) {
  var hasMarkers = hasAVSLMarkers(dir, segments);
  var hasUnverified = hasUnverifiedSL(dir, segments);

  var maxInput = $("input.form-control[name=" + dir + "MaxSpeed]");
  var hasMaxInput = maxInput.length > 0;

  var hasVerifyInput = $("input[id=" + dir + "MaxSpeedUnverifiedCheckbox]").length > 0;
  var hasVerifyAltInput = $("input[id=" + dir + "MaxSpeedUnverifiedAltCheckbox]").length > 0;

  //console.log('WMEAVSLRR:', dir, 'hasMarkers:', hasMarkers, 'hasMaxInput:', hasMaxInput, 'hasVerifyInput:', hasVerifyInput, 'hasVerifyAltInput:', hasVerifyAltInput);

  if ((hasMarkers || (hasUnverified && !hasVerifyInput)) && hasMaxInput && !hasVerifyAltInput) {
    //console.log('WMEAVSLRR:', dir, 'add marker & listeners...');

    var $div = $("<div>", {class: "controls-container"});
    var $input = $("<input>", {id: dir + "MaxSpeedUnverifiedAltCheckbox", type: "checkbox", name: dir + "MaxSpeedUnverifiedAlt"});
    var $label = $("<label>", {for: dir + "MaxSpeedUnverifiedAltCheckbox"}).text("Verified");

    $div.append($input).append($label);
    maxInput.parent().after($div);

    $input.click(function (e) {
      console.log('WMEAVSLRR:', dir, 'verify clicked...');
      e.preventDefault();
      setTimeout(function () {
        verifySpeedLimits(dir, segments);
        resetSelectionControls();
      }, 0);
    });

    maxInput.change(function (e) {
      console.log('WMEAVSLRR:', dir, 'max changed...');
      setTimeout(function () {
        verifySpeedLimits(dir, segments);
        resetSelectionControls();
      }, 0);
    });

  }
}

function resetSelectionControls() {
  var segments = getSelectedSegments();

  segments = segments.filter(function (segment) { return segment.arePropertiesEditable(); });

  setSLControls('fwd', segments);
  setSLControls('rev', segments);
}

function delayedResetSelectionControls() {
  setTimeout(resetSelectionControls, 0);
}

function getSelectedSegments() {
  return Waze.selectionManager.selectedItems
    .filter(function (item) { return item.model.type === "segment"; })
    .map(function (item) { return item.model; });
}

function init() {
  console.log('WMEAVSLRR: Version ' + GM_info.script.version + ' started');

  Waze_Model_Object.Restriction = require('Waze/Model/Object/Restriction');
  Waze_Action.MultiAction = require('Waze/Action/MultiAction');
  Waze_Action.UpdateObject = require('Waze/Action/UpdateObject');

  Waze.selectionManager.events.register("selectionchanged", null, resetSelectionControls);
  Waze.model.actionManager.events.register("afteraction", null, resetSelectionControls);
  Waze.model.actionManager.events.register("afterundoaction", null, delayedResetSelectionControls);
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
    console.log('WMEAVSL: WME not fully initialzed yet...');
    setTimeout(bootstrap, 500);
    return;
  }
  init();
}

setTimeout(bootstrap, 1000);

})();