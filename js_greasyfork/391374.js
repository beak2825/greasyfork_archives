// ==UserScript==
// @name         Ahrefs sticky table headings
// @namespace    https://www.ahrefs.com/
// @version      0.1.1
// @description  Add sticky table headings to Ahrefs.
// @author       Nick Drewe (@nickdrewe)
// @match        https://ahrefs.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391374/Ahrefs%20sticky%20table%20headings.user.js
// @updateURL https://update.greasyfork.org/scripts/391374/Ahrefs%20sticky%20table%20headings.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

(function() {
    'use strict';
    const newStyles = document.createElement('style');
    newStyles.innerHTML = `


/* Site Explorer */

#main-page-content{
  overflow: visible;
}
.container-wrapped{
  overflow: visible;
}
.table-responsive{
  overflow: visible;
}
.table-ahrefs{
  position: relative;
  overflow: visible;
}
.table-ahrefs > thead > tr > th {
  position: sticky;
  top: 0;
  background: white;
  z-index: 100;
  box-shadow: 0px 1px 0px #ebebee;
}
.table-ahrefs tr:nth-of-type(2) th {
  top: 34px;
}


/* Keywords Explorer - Widget */

.widget.serpOverview{
  overflow: visible;
  overflow-x: visible;
}
.serpOverviewTable.serpOverviewTable {
  position: relative;
}
.serpOverviewTable.serpOverviewTable th {
  position: sticky;
  top: -1px;
  background: white;
  z-index: 100;
  box-shadow: 0px 1px 0px #ebebee;
}


/* Keywords Explorer - Ideas */

.resultsTable-scroller {
  overflow-x: visible;
}
.resultsTable-table.table {
  position: relative;
}
.resultsTable-table.table > thead > tr > th {
  position: sticky;
  top: 0;
  background: white;
  z-index: 100;
  box-shadow: 0px 1px 0px #ebebee;
}
`;
    document.head.appendChild(newStyles);

})();