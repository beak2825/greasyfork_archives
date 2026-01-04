// ==UserScript==
// @name         GreasyFork
// @description  Set favicon for Greasy Fork
// @match        https://greasyfork.org/*
// @grant        none
// @run-at       document-end
// @version 0.0.1.20240619155257
// @namespace https://greasyfork.org/users/1312904
// @downloadURL https://update.greasyfork.org/scripts/498368/GreasyFork.user.js
// @updateURL https://update.greasyfork.org/scripts/498368/GreasyFork.meta.js
// ==/UserScript==

const lnk = document.createElement('link');

lnk.rel = 'icon';
lnk.href = 'https://i.ibb.co/8xVtM7L/Greasy-Fork.png';
lnk.sizes= '198x198';

document.head.append(lnk);