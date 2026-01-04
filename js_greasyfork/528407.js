// ==UserScript==
// @name         Grundos.cafe - I Like Big Buttons And I Can Not Lie
// @version      v1.0.0
// @description  Bigger is better.
// @author       Trevor Slocum
// @match        https://grundos.cafe/*
// @match        https://www.grundos.cafe/*
// @noframes
// @grant        none
// @run-at       document-body
// @license      MIT
// @namespace https://greasyfork.org/users/1441150
// @downloadURL https://update.greasyfork.org/scripts/528407/Grundoscafe%20-%20I%20Like%20Big%20Buttons%20And%20I%20Can%20Not%20Lie.user.js
// @updateURL https://update.greasyfork.org/scripts/528407/Grundoscafe%20-%20I%20Like%20Big%20Buttons%20And%20I%20Can%20Not%20Lie.meta.js
// ==/UserScript==

var style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = `.search-helper-sw, .search-helper-sdb, .search-helper-sdb-exists {
  width: 44px !important;
  height: 44px !important;
}
.search-helper-wish-witch, .search-helper-wish-witch-add {
  display: none;
}
.item-info {
  min-height: 70px;
}`;
document.head.appendChild(style);
