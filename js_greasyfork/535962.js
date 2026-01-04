// ==UserScript==
// @name          Widescreen Full page width dba.dk
// @description   make dba usable on widescreen
// @namespace     Violentmonkey Scripts
// @match         https://www.dba.dk/*
// @version       2.1
// @author        stewil
// @homepageURL   https://github.com/stewil
// @grant         GM_addStyle
// @run-at        document-start
// @license       GNU AGPLv3
// @downloadURL https://update.greasyfork.org/scripts/535962/Widescreen%20Full%20page%20width%20dbadk.user.js
// @updateURL https://update.greasyfork.org/scripts/535962/Widescreen%20Full%20page%20width%20dbadk.meta.js
// ==/UserScript==

GM_addStyle ( `
main {
  max-width: 100% !important;
}

.grid-cols-2 {
  grid-template-columns:repeat(3,minmax(0,1fr)) !important;
}

.grid-cols-3 {
  grid-template-columns:repeat(4,minmax(0,1fr)) !important;
}

.col-span-2 {
  grid-column:span 3/span 3 !important;
}

.col-span-3 {
  grid-column:span 4/span 4 !important;
}

article {
  height: 26vw !important;
}

@media (min-width: 768px) {
  .col-span-2 {
    grid-column:span 3/span 3 !important;
  }
  .grid-cols-2 {
    grid-template-columns:repeat(3,minmax(0,1fr)) !important;
  }
  .grid-cols-1 {
    grid-template-columns:repeat(3,minmax(0,1fr)) !important;
  }
}

` );