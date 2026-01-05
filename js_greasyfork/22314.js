// ==UserScript==
// @name        CubecraftHideLockedThreads
// @namespace   de.rasmusantons
// @description Adds an option to hide locked threads on the cubecraft forums.
// @include     https://www.cubecraft.net/forums/*/*
// @version     2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/22314/CubecraftHideLockedThreads.user.js
// @updateURL https://update.greasyfork.org/scripts/22314/CubecraftHideLockedThreads.meta.js
// ==/UserScript==

function updateThreadList(hideLocked) {
  var lockedThreads = $('.discussionListItem.locked');
  lockedThreads.each(function(i, e) {
    var thread = $(e);
    thread.css('display', hideLocked ? 'none' : '');
  });
  cnt.text(hideLocked ? '(' + lockedThreads.length + ' locked threads hidden)' : '');
}

function onCbChange() {
  localStorage.setItem('hideLocked', this.checked);
  updateThreadList(this.checked);
}

var cb = $('<input type="checkbox" />');
var cnt = $('<span></span>');
cnt.css('margin-left', '5px');
cb.get(0).checked = (localStorage.getItem('hideLocked') == "true");
updateThreadList(cb.get(0).checked);
cb.change(onCbChange);
$($('.secondaryContent > .col2')[0]).append($('<li></li>').append($('<a></a>').append($('<label>hide locked threads</label>').prepend(cb))));
$($('.sectionFooter.SelectionCountContainer')[0]).append(cnt);