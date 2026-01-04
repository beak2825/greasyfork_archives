// ==UserScript==
// @name        MS Learn and MDN always in EN-US
// @namespace   mslearn_to_enus
// @description Redirect learn.microsoft.com and developer.mozilla.org to en-us version
// @icon        https://learn.microsoft.com/favicon.ico
// @match       *://learn.microsoft.com/*
// @match       *://developer.mozilla.org/*
// @version     1.0.0
// @grant       none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/481293/MS%20Learn%20and%20MDN%20always%20in%20EN-US.user.js
// @updateURL https://update.greasyfork.org/scripts/481293/MS%20Learn%20and%20MDN%20always%20in%20EN-US.meta.js
// ==/UserScript==

var path = location.pathname.split('/');
if (path[1].toLowerCase()!='en-us')
{
    if (location.hostname.toLowerCase()=='learn.microsoft.com') path[1] = 'en-us'
        else path[1] = 'en-US';
    location.pathname = path.join('/');
}
