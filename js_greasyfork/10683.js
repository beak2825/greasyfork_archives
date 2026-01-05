// ==UserScript==
// @name        Wikitable filter
// @description Filter for wiki tables using the jQuery tablesorter filter widget
// @include     *wiki*
// @require     http://code.jquery.com/jquery-1.11.3.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery.tablesorter/2.22.1/js/jquery.tablesorter.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery.tablesorter/2.22.1/js/jquery.tablesorter.widgets.js
// @version     1.1.1
// @grant       GM_info
// @namespace https://greasyfork.org/users/12797
// @downloadURL https://update.greasyfork.org/scripts/10683/Wikitable%20filter.user.js
// @updateURL https://update.greasyfork.org/scripts/10683/Wikitable%20filter.meta.js
// ==/UserScript==

// Constants

SHOW_FILTERS_CLASS = "wikitable_show_filters";
FILTERED_CLASS = "wikitable_filter_filtered";

// Globals
style_initialised = false;

// Functions

showFilters = function() {
  var tbl = $(this).next(".wikitable");
  tbl.addClass("tablesorter");
  tbl.tablesorter({
    "widgets": ["filter"],
    "widgetOptions": {
      "filter_filteredRow": FILTERED_CLASS
    }
  });
  $(this).hide();
  return false;
}

addShowFiltersButton = function() {
  var btn = $("<button/>",
  { "type": "button",
    "class": SHOW_FILTERS_CLASS,
    "html": "\u2261 Filters" }
  );
  btn.click(showFilters);
  return btn;
}

initTables = function(tbl) {
  if (tbl.length > 0) {
    if (!style_initialised) {
      // Add our stylesheet
      var styleElem = document.createElement('style');
      document.head.appendChild(styleElem);
      styleSheet = styleElem.sheet;
      styleSheet.insertRule("tr."+FILTERED_CLASS+" { display: none; }", 0);
      style_initialised = true;
    }
    // Add button to show the filters
    tbl.before(addShowFiltersButton);
  }
}

// Main

// Check if there are wiki tables on this page in the first place
var tbl = $("table.wikitable");
// Initialise them (if necessary)
initTables(tbl.has("thead").has("tbody"));
// Register observer that initialises tables that were modified to fit our
// criteria.
var tblMutationObserver = new MutationObserver(function(mutations) {
  var mutatedNodes = new Array();
  mutations.forEach(function(mutation) {
    mutatedNodes.push(mutation.target);
  });
  var jqMutatedTbl = $(mutatedNodes);
  jqMutatedTbl = jqMutatedTbl.filter(".wikitable").has("thead").has("tbody");
  jqMutatedTbl = $.unique(jqMutatedTbl);
  // Do not initialise tables twice!
  jqMutatedTbl = jqMutatedTbl.not(".tablesorter");
  if (jqMutatedTbl.length <= 0) {
    return null;
  }
  console.log(jqMutatedTbl);
  initTables(jqMutatedTbl);
});
tbl.each(function(index, node) {
  tblMutationObserver.observe(
    // node to be observed
    node,
    // options
    { "childList": true }
  );
});