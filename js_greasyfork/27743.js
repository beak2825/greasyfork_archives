// ==UserScript==
// @name         Add users count to people nav when on users page
// @namespace    http://canvas.vt.edu/
// @version      0.2
// @description  https://github.com/thegreatmichael/canvas-people-count-badge
// @author       Michael Stewart 
// @match        https://canvas.vt.edu/courses/*/users
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27743/Add%20users%20count%20to%20people%20nav%20when%20on%20users%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/27743/Add%20users%20count%20to%20people%20nav%20when%20on%20users%20page.meta.js
// ==/UserScript==
$(function () {
    var timerId = window.setInterval(function(){
  function addBadge () {
    if ($('table.roster tbody tr').length > 0) {
      $('nav li.section a.people').append('<span class="badge pull-right">'+$('table.roster tbody tr').length+'</span>');
    }
  }
  if ($._data(window).events.scroll && $._data(window).events.scroll.length > 0 && $('.paginatedLoadingIndicator').is(":visible"))  {
    $._data(window).events.scroll[0].handler();
  } else {
    addBadge();
  }
}, 250);
});