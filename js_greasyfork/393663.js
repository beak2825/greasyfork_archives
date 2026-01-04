// ==UserScript==
// @name         RemoveBilbiliGrayscale
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       James Young
// @include      https://*.bilibili.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393663/RemoveBilbiliGrayscale.user.js
// @updateURL https://update.greasyfork.org/scripts/393663/RemoveBilbiliGrayscale.meta.js
// ==/UserScript==
document.getElementsByTagName('html')[0].setAttribute('style','');