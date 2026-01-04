// ==UserScript==
// @name         PPAB
// @description  Pixel Place Anti Ban
// @version      1.0.4
// @author       0vC4
// @namespace    https://greasyfork.org/users/670183
// @match        https://pixelplace.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pixelplace.io
// @license      MIT
// @grant        none
// @run-at       document-start
// ==/UserScript==

Object.defineProperty(document.body, 'innerHTML', {});
XMLHttpRequest.prototype._open = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function(_, url){
    if (url.includes('post-logout.php')) throw 'lol';
    return this._open(...arguments);
}