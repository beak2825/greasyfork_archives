// ==UserScript==
// @name         Anti Cheeto Dust
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Replaces the stupid "Gulf of America" with the correct name in Google Maps
// @author       November2246
// @match        https://www.google.com/maps/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @run-at       document-start
// @license      ISC
// @downloadURL https://update.greasyfork.org/scripts/537829/Anti%20Cheeto%20Dust.user.js
// @updateURL https://update.greasyfork.org/scripts/537829/Anti%20Cheeto%20Dust.meta.js
// ==/UserScript==

const _fillText = CanvasRenderingContext2D.prototype.fillText;
CanvasRenderingContext2D.prototype.fillText = function fillText() {
    if (arguments[0] === 'America') arguments[0] = arguments[0].replace('America', ' Mexico');
    return _fillText.apply(this, arguments);
}

const _substring = String.prototype.substring;
String.prototype.substring = function substring() {
    let ret = _substring.apply(this, arguments);
    if (this.startsWith(')]}\'\n')) ret = ret.replaceAll('Gulf of America', 'Gulf of Mexico');
    return ret;
}