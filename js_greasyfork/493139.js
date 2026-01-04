// ==UserScript==
// @name         OC travel check
// @namespace    https://gitgud.com/stephenlynx
// @version      0.0.2
// @description  Blocks flying through an OC
// @author       Stephen Lynx
// @license      MIT
// @match        https://www.torn.com/travelagency.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/493139/OC%20travel%20check.user.js
// @updateURL https://update.greasyfork.org/scripts/493139/OC%20travel%20check.meta.js
// ==/UserScript==
const countryTimes = {
  2 : 26,
  12 : 35,
  9 : 41,
  3 : 134,
  10 : 159,
  7 : 167,
  8 : 175,
  5 : 225,
  6 : 242,
  11 : 271,
  4 : 297
};

/*
mexico: 2
haway: 3
africa: 4
japan:5
china: 6
argentina: 7
switch: 8
canada: 9
uk: 10
uae: 11
cayman: 12
*/

var referenceTime = 950;

function getConvertedTime(date) {
  return date.getUTCMinutes() + (date.getUTCHours() * 60);
}

function getTimeModifier() {

  var element = $("#tab-menu4 > ul > li[aria-selected='true'] .travel-name");

  switch (element ? element.html().toLowerCase() : 'standard') {
  case "standard":
    return 1;
  case "airstrip":
    return 0.7;
  case "private":
    return 0.5;
  case "business":
    return 0.3;
  default:
    console.error("Unknown travel type");
    return 1;
  }
}

var timeoutId;

var lynx = {};

function checkOCAlert(baseElement) {

  //if it conflicts with the OC, hide, but show 5 seconds later
  if (baseElement.getElementsByClassName('travel-confirm')[0].getElementsByClassName('t-red')[0]) {
    $('.travel-confirm .btn').hide();
    timeoutId = setTimeout(function() {
      $('.travel-confirm .btn').show();
    },
    5000);
  }
}

(function() {
  'use strict';

  lynx.reminderCheckbox = document.createElement('input');
  lynx.reminderCheckbox.type = 'checkbox';
  lynx.reminderCheckbox.onchange = function() {
    localStorage.setItem('lynxRehab', lynx.reminderCheckbox.checked ? 1 : 0);
  }

  lynx.reminderCheckbox.checked = !!+localStorage.getItem('lynxRehab');

  var titleElement = document.getElementsByClassName('content-title')[0];

  var rehabSpan = document.createElement('div');

  rehabSpan.appendChild(lynx.reminderCheckbox);

  var rehabLabel = document.createElement('span');
  rehabLabel.innerHTML = 'Rehab before next work day';

  rehabSpan.appendChild(rehabLabel);

  titleElement.appendChild(rehabSpan);

  $('.travel-info .btn').live('click',
  function(event) {
    clearTimeout(timeoutId);
    $('.travel-confirm .btn').show();

    var baseElement = event.srcElement.parentNode.parentNode.parentNode.parentNode
    var locationId = baseElement.getElementsByClassName('travel-buttons')[0].getAttribute('data-id');

    var currentTime = getConvertedTime(new Date());

    //if we do not checked the box, are going to rehab or it's already past 15:50 TCT, ignore
    if (!lynx.reminderCheckbox.checked || locationId == 8 || currentTime > referenceTime) {
      return checkOCAlert(baseElement);
    }

    var toAdd = countryTimes[locationId] * getTimeModifier() * 2;

    //if we will get back in time, ignore
    if ((toAdd + currentTime) < referenceTime) {
      return checkOCAlert(baseElement);
    }

    //hide permanently
    $('.travel-confirm .btn').hide();

  });

})();
