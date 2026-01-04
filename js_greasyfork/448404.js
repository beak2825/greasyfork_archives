// ==UserScript==
// @name         Default Vermillion logo
// @namespace    http://tampermonkey.net/
// @version      6.6.6
// @description  get v3rm logo back
// @author       Zeerox
// @match        *://*.v3rmillion.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=v3rmillion.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/448404/Default%20Vermillion%20logo.user.js
// @updateURL https://update.greasyfork.org/scripts/448404/Default%20Vermillion%20logo.meta.js
// ==/UserScript==

document.getElementById('logo').children[0].children[0].src='https://v3rmillion.net/images/logo.png';