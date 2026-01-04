// ==UserScript==
// @name         Make web app apple mobile capable
// @version      0.2
// @description  Allows you to add the required header to a web app to run full screen on iOS devices
// @match        *://*/*
// @license MIT
// @namespace http://your-namespace.com
// @downloadURL https://update.greasyfork.org/scripts/478943/Make%20web%20app%20apple%20mobile%20capable.user.js
// @updateURL https://update.greasyfork.org/scripts/478943/Make%20web%20app%20apple%20mobile%20capable.meta.js
// ==/UserScript==

const newMeta = document.createElement('meta');
newMeta.name = 'apple-mobile-web-app-capable';
newMeta.content = 'yes';
document.head.appendChild(newMeta);