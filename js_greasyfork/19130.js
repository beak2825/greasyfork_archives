// ==UserScript==
// @name        3DSISO AnnoyanceBlocker
// @namespace   3DSISOAnnoyanceBlocker
// @description Remove shill content and other crap from 3DSISO!
// @include     http://3dsiso.com/*
// @include     https://3dsiso.com/*
// @include     http://*.3dsiso.com/*
// @include     https://*.3dsiso.com/*
// @resource      myCustomCss http://megamatt.xyz/css/fuck3dsiso.css
// @version     1.0
// @grant         GM_addStyle
// @grant         GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/19130/3DSISO%20AnnoyanceBlocker.user.js
// @updateURL https://update.greasyfork.org/scripts/19130/3DSISO%20AnnoyanceBlocker.meta.js
// ==/UserScript==
/* Sharing is caring! 
* With love,
* Dropbox Anon
*/
GM_addStyle(GM_getResourceText('myCustomCss'));
