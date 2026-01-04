// ==UserScript==
// @name        Bullhorn Overflow Fix
// @namespace   https://github.com/soaringsky
// @match       https://app.bullhornstaffing.com/*
// @version     1.0
// @author      Sky, Dot
// @description Fix for non-scrollable Pins
// @license GPLv3
// @downloadURL https://update.greasyfork.org/scripts/441287/Bullhorn%20Overflow%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/441287/Bullhorn%20Overflow%20Fix.meta.js
// ==/UserScript==
var styles = `
 #novo-body.disable-scrolling.zoom-out {
    overflow-y: scroll;
}
`

var styleSheet = document.createElement('style');
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);