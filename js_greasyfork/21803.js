// ==UserScript==
// @name        Furvilla - Hide Recent Activity
// @namespace   Shaun Dreclin
// @description Removes recent forum activity from the sidebar.
// @include     /^https?://www\.furvilla\.com/.*$/
// @version     1.0
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/21803/Furvilla%20-%20Hide%20Recent%20Activity.user.js
// @updateURL https://update.greasyfork.org/scripts/21803/Furvilla%20-%20Hide%20Recent%20Activity.meta.js
// ==/UserScript==

//Chemotherapy
GM_addStyle(".recent-posts { display: none; }");
