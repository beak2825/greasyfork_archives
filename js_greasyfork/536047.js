// ==UserScript==
// @name         Photopea No Ads One-liner
// @version      0.0.2
// @description  Hide Photopea Ads
// @icon         https://www.photopea.com/promo/thumb256.png

// @author       ml98
// @namespace    http://tampermonkey.net/
// @license      MIT

// @match        https://www.photopea.com/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/469575/Photopea%20No%20Ads%20One-liner.user.js
// @updateURL https://update.greasyfork.org/scripts/469575/Photopea%20No%20Ads%20One-liner.meta.js
// ==/UserScript==

/* Plan A */
String.prototype.split=(f=>function(){return f.apply(this.replace('photopea','vectorpea'),arguments)})(String.prototype.split)

/* Plan B */
/*
Object.defineProperty(Object.prototype,'Vn',{get:_=>0})
*/

/* Plan C */
/*
let state = -1;
const charCodeAt = String.prototype.charCodeAt;
String.prototype.charCodeAt = function (n) {
    if (this == 'YMVVHAj=FA' && state == -1) {
        state = 0;
    }
    return charCodeAt.call(this, n);
};
const fromCharCode = String.fromCharCode;
String.fromCharCode = function () {
    if (state >= 0 && state < 10) {
        return state++ == 0 ? 'photopea.com' : '';
    }
    state = -1;
    return fromCharCode.apply(this, arguments);
};
*/

/* Not working anymore */
/*
location.hash = '#8887';
*/
