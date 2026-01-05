// ==UserScript==
// @name        FixUncachedBattles
// @namespace   by guardian
// @description Fix for the uncached battles problems while browsing battlelogs in warring factions game.
// @include     *.war-facts.com/battle_history.php?battle=*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/10686/FixUncachedBattles.user.js
// @updateURL https://update.greasyfork.org/scripts/10686/FixUncachedBattles.meta.js
// ==/UserScript==


links = document.evaluate("//a[@href]",
    document,
    null,
    XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
    null);

for (var i=0;i<links.snapshotLength;i++) {
    var thisLink = links.snapshotItem(i);

    thisLink.href = thisLink.href.replace('/admin/uncached.php?',
                                          '/battle_history.php?');
}