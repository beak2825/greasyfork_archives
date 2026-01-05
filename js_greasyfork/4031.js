// ==UserScript==
// @name        Forum AutoIt FR
// @namespace   http://www.autoitscript.fr/forum/
// @include     http://www.autoitscript.fr/forum/*
// @version     1
// @grant       none
// @description Un clic sur le lien d'un sujet permet d'aller au premier message non lu.
// @downloadURL https://update.greasyfork.org/scripts/4031/Forum%20AutoIt%20FR.user.js
// @updateURL https://update.greasyfork.org/scripts/4031/Forum%20AutoIt%20FR.meta.js
// ==/UserScript==

var nodesTopictitle = document.evaluate("//*[@id='page-body']//a[@class='topictitle'][preceding-sibling::node()[contains(@href, '#unread')]]",
                                        document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

for (var i = 0; i < nodesTopictitle.snapshotLength; i++) {
    nodesTopictitle.snapshotItem(i).href += '&view=unread#unread';
}
