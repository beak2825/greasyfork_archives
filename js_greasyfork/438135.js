// ==UserScript==
// @name		Hide Purchased Items in Solomon's General Store
// @namespace		github.com/gmiclotte
// @version		0.0.1
// @description		Hide purchased items in Solomon's General Store
// @author		GMiclotte
// @include		https://secure.runescape.com/m=mtxn_rs_shop/*
// @inject-into page
// @noframes
// @grant		none
// @downloadURL https://update.greasyfork.org/scripts/438135/Hide%20Purchased%20Items%20in%20Solomon%27s%20General%20Store.user.js
// @updateURL https://update.greasyfork.org/scripts/438135/Hide%20Purchased%20Items%20in%20Solomon%27s%20General%20Store.meta.js
// ==/UserScript==

document.styleSheets[0].insertRule(`.purchased {display:none}`);
