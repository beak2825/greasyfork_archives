// ==UserScript==
// @name        WaniKani SRS Reorder Button
// @namespace   towe.wk.srsreorder
// @author      Towe
// @description Adds button enabling item ordering by SRS level.
// @include     *://www.wanikani.com/review/session
// @version     1.2.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/29673/WaniKani%20SRS%20Reorder%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/29673/WaniKani%20SRS%20Reorder%20Button.meta.js
// ==/UserScript==

/* Settings */

const questionTypeOrder = 1; // 1 - reading first, 2 - meaning first, 3 - random
const itemTypeOrder = 1;     // 1 - rad->kan->voc, 2 - voc->kan->rad, 3 - random
const ascendingSRS = true;   // low-level items first
const priotitizeSRS = true;  // SRS order more important than item type order
const force1x1 = true;       // meaning and reading directly next to each other
const sortOnStartup = false; // sort items on startup
const hotkey = 'Digit3'      // keyboard shortcut (key code)

/* Utilities */

const $ = window.$;

function getTypePriority(item) {
  if (item.rad) {
    return 1;
  } else if (item.kan) {
    return 2;
  } else {
    return 3;
  }
}

function itemComparator(itemA, itemB) {
  const srsOrder = ascendingSRS ? itemA.srs - itemB.srs : itemB.srs - itemA.srs;
  const typeOrder = itemTypeOrder === 3 ? 0 : (getTypePriority(itemA) - getTypePriority(itemB)) * (3 - itemTypeOrder * 2);
  return priotitizeSRS ? srsOrder || typeOrder : typeOrder || srsOrder;
}

function showCounters(items) {
  const itemsByLevels = [0, 0, 0, 0, 0, 0, 0, 0];
  for (let i = 0; i < items.length; ++i) {
    ++itemsByLevels[items[i].srs - 1];
  }
  const $srsCounters = $('<div id="srsCounters" style="background-color:rgba(255,255,255,0.9);border-radius:8px;color:black;font-weight:bold;margin-top:5px;text-shadow:none"></div>');
  for (let level = 1; level <= itemsByLevels.length; ++level) {
    const color = level < 5 ? 'DD0093' : level < 7 ? '882D9E' : level < 8 ? '294DDB' : '0093DD';
    if (level > 1) {
      $srsCounters.append(', ');
    }
    $srsCounters.append($('<span style="color:#' + color + ';margin:0">' + itemsByLevels[level - 1] + '</span>'));
  }
  $('#srsCounters').remove();
  $('div#stats').append($srsCounters);
}

/* Event handlers */

const usedUIDs = [];

function reorderQuestionTypes() {
  const item = $.jStorage.get('currentItem');
  const newUID = (item.rad ? 'r' : item.kan ? 'k' : 'v') + item.id;
  if (usedUIDs.includes(newUID)) {
    return;
  }
  usedUIDs.push(newUID);
  const requestedType = ['reading', 'meaning'][item.rad ? 1 : questionTypeOrder - 1];
  if ($.jStorage.get("questionType") !== requestedType) {
    $.jStorage.set('questionType', requestedType);
    $.jStorage.set('currentItem', item);
  }
}

function updateCounters() {
  const items = $.jStorage.get('activeQueue').concat($.jStorage.get('reviewQueue'));
  showCounters(items);
  return items;
}

function reorderBySrs() {
  const items = updateCounters();
  items.sort(itemComparator);
  $.jStorage.set('activeQueue', items.slice(0, 10));
  $.jStorage.set('reviewQueue', items.slice(10).reverse());
  if (questionTypeOrder !== 3) {
    $.jStorage.listenKeyChange('currentItem', reorderQuestionTypes);
  }
  $.jStorage.listenKeyChange('currentItem', updateCounters);
  $.jStorage.set('currentItem', items[0]);
  if (force1x1) {
    try {
      unsafeWindow.Math.random = function() { return 0; };
    } catch (e) {
      Math.random = function() { return 0; };
    }
  }
}

/* Initialization */

$(function() {
  const $button = $('<div style="background-color: #A000f0; color: #FFFFFF; cursor: pointer; display: inline-block; font-size: 0.8125em; padding: 10px; vertical-align: bottom;">Sort by SRS</div>');
  $('footer').prepend($button.click(reorderBySrs));
  document.addEventListener('keydown', function(e) {
    if (e.code === hotkey) {
      reorderBySrs();
      e.preventDefault();
    }
  });
  if (sortOnStartup) {
    const observer = new MutationObserver(function() {
      reorderBySrs();
      observer.disconnect();
    });
    observer.observe(document.getElementById('loading'), { attributes: true });
  }
});