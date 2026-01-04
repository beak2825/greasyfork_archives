// ==UserScript==
// @name         BGG Preview Upgrade
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  improves the BGG Previews, particularly for printing
// @author       You
// @match        https://www.boardgamegeek.com/geekpreview/51/spiel-21-preview?*
// @icon         https://www.google.com/s2/favicons?domain=boardgamegeek.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433596/BGG%20Preview%20Upgrade.user.js
// @updateURL https://update.greasyfork.org/scripts/433596/BGG%20Preview%20Upgrade.meta.js
// ==/UserScript==

var css = `
@media print
{
  geekpreview-header, .geekpreview-toolbar-primary, .global-header, .geekpreview-sticky-menu, .geekpreview-toolbar-secondary-views, #global-header-outer, .pace
  {
    display: none;
  }

  /* link to publisher */
  .geekpreview-parent-social
  {
    display: none;
  }
  /* publisher header */
  .geekpreview-parent-info > h2
  {
    display: inline;
  }

  .global-body-content-primary
  {
    padding-left: 0;
    padding-right: 0;
  }
  .global-body-content-container
  {
    margin-left: 0;
    margin-right: 0;
    padding-left: 0;
    padding-right: 0;
  }

  /* "Show more" button in item */
  .geekpreview-item-inner-info-body > button
  {
    display: none;
  }
  /* "Edit/Add" in collection button */
  .geekpreview-item-inner-info-header-save
  {
    display: none;
  }
  /* Thumbs button / stats */
  .geekpreview-item-community-actions
  {
    display: none;
  }
}
  /* stats like player count */
  dl.geekpreview-item-inline-summary > div
  {
    padding: 1px 3px 1px 2px;
    min-width: auto;
  }

`;

(function() {
    'use strict';

    // Your code here...

    var style = document.createElement('style');
    style.innerHTML = css;
    document.getElementsByTagName('head')[0].appendChild(style);
})();