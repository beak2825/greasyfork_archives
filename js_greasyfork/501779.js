// ==UserScript==
// @name         BVE
// @description  Set favicon for BVE
// @match        https://www.beachvolley-eindhoven.nl/*
// @grant        none
// @run-at       document-end
// @version 0.0.1.20240725160421
// @namespace https://greasyfork.org/users/1312904
// @downloadURL https://update.greasyfork.org/scripts/501779/BVE.user.js
// @updateURL https://update.greasyfork.org/scripts/501779/BVE.meta.js
// ==/UserScript==

const lnk = document.createElement('link');

lnk.rel = 'icon';
lnk.href = 'https://i.ibb.co/3ygDChv/flat-750x-075-f-pad-750x1000-f8f8f8-1.png';
lnk.sizes= '128x128';

document.head.append(lnk);