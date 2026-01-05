// ==UserScript==
// @name        CubeCraft Reports
// @namespace   de.rasmusantons
// @description Adds a link to the appeals page to each report.
// @include     https://reports.cubecraft.net/report*
// @version     2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/25495/CubeCraft%20Reports.user.js
// @updateURL https://update.greasyfork.org/scripts/25495/CubeCraft%20Reports.meta.js
// ==/UserScript==

$('tr td:nth-child(2)').each(function(i) {
  $(this).append($('<a href="https://appeals.cubecraft.net/find_appeals/'
                   + $.trim($(this).find('a').first().html())
                   + '"> ?</a>')
  );
});