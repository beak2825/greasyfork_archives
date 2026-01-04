// ==UserScript==
// @name         NextDNS
// @description  Set favicon for NextDNS
// @match        https://my.nextdns.io/*
// @grant        none
// @run-at       document-end
// @version 0.0.1.20240619101100
// @namespace https://greasyfork.org/users/1312904
// @downloadURL https://update.greasyfork.org/scripts/498178/NextDNS.user.js
// @updateURL https://update.greasyfork.org/scripts/498178/NextDNS.meta.js
// ==/UserScript==

const lnk = document.createElement('link');

lnk.rel = 'icon';
lnk.href = 'https://i.ibb.co/KXzsh4n/nextdns.png';
lnk.sizes= '128x128';

document.head.append(lnk);