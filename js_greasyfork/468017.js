// ==UserScript==
// @name        Revert to Gmails's Old 2012-2020 Favicon
// @version     3.25
// @author      H. Brown
// @namespace   https://example.com
// @description Replaces New 2020 Google mail Favicon in Browser Tabs, Address Bar, Bookmarks
// @icon        https://googlewebhp.neocities.org/favicon-32x32.png

// @include     http*://www.mail.google.*

// @exclude     http*://www.google.com/cloudprint*
// @exclude     http*://www.google.com/calendar*
// @exclude     http*://www.google.com/intl/*/drive*
// @exclude     http*://www.google.com/earth*
// @exclude     http*://www.google.com/finance*
// @exclude     http*://www.google.com/maps*
// @exclude     http*://www.google.com/voice*
// @grant       none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/468017/Revert%20to%20Gmails%27s%20Old%202012-2020%20Favicon.user.js
// @updateURL https://update.greasyfork.org/scripts/468017/Revert%20to%20Gmails%27s%20Old%202012-2020%20Favicon.meta.js
// ==/UserScript==

var head = document.getElementsByTagName('head')[0];
var icon = document.createElement('link');

icon.setAttribute('type', 'image/x-icon');
icon.setAttribute('rel', 'icon');


head.appendChild(icon);