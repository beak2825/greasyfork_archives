// ==UserScript==
// @name        BCPop
// @author      theinternetftw
// @namespace   theinternetftw.com
// @description Filter bandcamp user collections by popularity
// @license     GPL version 2 or any later version; http://www.gnu.org/licenses/gpl-2.0.txt
// @include     https://bandcamp.com/*
// @version     1.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/13056/BCPop.user.js
// @updateURL https://update.greasyfork.org/scripts/13056/BCPop.meta.js
// ==/UserScript==

var defaultThreshold = 0;
var rangeLimit = 1000;

var visUpdateInterval = 100; // ms
var ajaxUpdateInterval = 2500; // ms, for bc's lazy loading

var isPopular = function($item) {
  if (threshold === 0)
    return true;
  if (!$item.has('.collected-by-header').length)
    return false;
  var collectors = $item.find('.collected-by-header').find('a').text().trim().split(' ')[0];
  return parseInt(collectors) >= threshold;
};

var updateVis = function() {
  $('.collection-item-container').has('.collection-item-fav-track').each(function() {
    var $item = $(this);
    isPopular($item) ? $item.show() : $item.hide();
  });
};

var updateControls = function() {
  $('#bcpop-threshold').text('BCPop: ' + threshold);
};

var threshold = defaultThreshold;
var everTouchedControls = false;
var shouldUpdateVis = false;

if ($('.fan-banner').length) {
  
  var input = document.createElement('input');
  input.type = 'range';
  input.max = rangeLimit;
  input.value = threshold;
  
  input.addEventListener('input', function(e) {
    everTouchedControls = true;
    shouldUpdateVis = true;
    threshold = e.target.value;
    updateControls();
  });
  
  var span = document.createElement('span');
  span.id = 'bcpop-threshold';
  span.style.fontSize = '8pt';
  
  var div = document.createElement('div');
  div.style.position = 'fixed';
  div.style.backgroundColor = 'white';
  div.style.bottom = 0;
  
  div.appendChild(input);
  div.appendChild(span);
  document.body.appendChild(div);
  
  // don't spam DOM updates
  setInterval(function() {
    if (shouldUpdateVis) {
      shouldUpdateVis = false;
      updateVis();
    }
  }, visUpdateInterval);
  
  // encorage bc to load more songs if you've touched the controls on this page
  setInterval(function() {
    everTouchedControls && $(window).scroll();
  }, ajaxUpdateInterval);
  
  var observer = new MutationObserver(function(mutation) {
    shouldUpdateVis = true;
  });
  observer.observe(document.body, {childList:true, subtree:true});

  updateControls();
  updateVis();
}