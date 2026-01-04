// ==UserScript==
// @name        Terraria Wiki Cleaner
// @description Terraria Wiki Cleaner removes the annoying header, sidebar and footer banners from the wiki while also fixing the spacing issues when removing those ads.
// @match       *://terraria.wiki.gg/*
// @author      Spectrox
// @version     0.2
// @license     http://unlicense.org
// @namespace   *://terraria.wiki.gg/*
// @icon        https://external-content.duckduckgo.com/ip3/terraria.wiki.gg.ico
// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.0/jquery.min.js
// @require     https://greasyfork.org/scripts/383527-wait-for-key-elements/code/Wait_for_key_elements.js?version=701631
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/442884/Terraria%20Wiki%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/442884/Terraria%20Wiki%20Cleaner.meta.js
// ==/UserScript==

waitForKeyElements(".games-showcase-sidebar", killNode);
waitForKeyElements(".header-showcase", killNode);
waitForKeyElements(".games-showcase-footer", killNode);

function killNode(jNode) {
    jNode.remove();
}