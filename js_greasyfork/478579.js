// ==UserScript==
// @name     eBird Recent Visits
// @version  2.1.1
// @description Various fixes to make the Recent Visits page usable.
// @include  https://ebird.org/region/*/activity*
// @include  https://ebird.org/hotspot/*/activity*
// @require  https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.js
// @namespace https://github.com/StuartMacKay/userscripts/
// @author smackay
// @copyright 2018-2023 Stuart MacKay (https://github.com/StuartMacKay/userscripts)
// @license MIT
// @homepage https://github.com/StuartMacKay/userscripts
// @grant GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/478579/eBird%20Recent%20Visits.user.js
// @updateURL https://update.greasyfork.org/scripts/478579/eBird%20Recent%20Visits.meta.js
// ==/UserScript==

// This script makes reading through all the checklists listed on the eBird
// Recent Visits page for a location or region easier by:
//
// 1. Changing the colour of visited links to dark orange so you can see what
//    checklists you've read.
//
// 2. Adding an 'x' next to the name of the observer so you can temporarily
//    hide all checklists from that person, until the page is reloaded.
//
// 3. Adding an 'x' next to the name of the location so you can temporarily
//    hide all checklists from that location, until the page is reloaded. The
//    greyed-out location icon is hidden to reduce the clutter on the page.
//
// 4. Opening all checklists in a new tab. That way you can click on all the
//    lists you want to read without either using ctrl+click or having to
//    navigate back to the Recent Visits page to select the next checklist.
//
// 5. Optional - commented out. Hiding all checklists that contain coordinates
//    in the name. Usually these are for one-off or personal locations and
//    often are of limited interest.

// Show visited link so you can see what checklists you have read.
GM_addStyle('div.Meta--date > a:visited { color: darkorange; }');

// Hide all location icons. They don't so anything useful.
GM_addStyle('svg.Icon--locationGeneric{ display: none; }');


(function() {
  'use strict';

  // Hide all checklists from selected observers.

  function hideObserver(name) {
    $('div.Observation-species h3').each(function () {
      if (name ===  $(this).attr('data-observer')) {
        $(this).closest('section.Observation--placeRecentVisits').css('display', 'none');
      }
    });
  }

  $('div.Observation-species h3').each(function () {
    let name = $(this).contents().text().trim().replace(/\s{2,}/, ' ');
    $(this).prepend('<span style="font-weight: normal; cursor: pointer; margin-right: 6px;" title="Hide all checklists from ' + name + '">x</span> ');
    $(this).attr('data-observer', name);
    $(this).children(":first").click(function () {
      hideObserver(name);
    });
  });

  // Hide all checklists from selected locations.

  function hideLocation(name) {
    $('div.Meta--location').each(function () {
      if (name ===  $(this).attr('data-location')) {
        $(this).closest('section.Observation--placeRecentVisits').css('display', 'none');
      }
    });
  }

  $('div.Meta--location').each(function () {
    let name = $(this).contents().text().trim().replace(/\s{2,}/, ' ');
    if (name !== "Location") {
      $(this).prepend('<span style="font-weight: normal; cursor: pointer; margin-right: 6px;" title="Hide all checklists for ' + name + '">x</span> ');
      $(this).attr('data-location', name);
      $(this).children(":first").click(function () {
        hideLocation(name);
      });
    }
  });

  // Hide all checklists that contain latitude and longitude in the name.

//  const coords = /\-?\d{1,2}[.,]\d{1,5}[,x] ?\-?\d{1,2}[.,]\d{1,5}/;
//
//  $('div.Meta--location span.Meta-label').each(function () {
//    let name = $(this).contents().text().trim();
//    if (coords.test(name)) {
//      $(this).closest('section.Observation--placeRecentVisits').css('display', 'none');
//    }
//  });

  // Open checklists in a new tab view.

  $('div.Meta--date a.Meta-label').each(function () {
    $(this).attr('target', '_blank');
  });

})();
