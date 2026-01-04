// ==UserScript==
// @name         Shopify Access
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Shopify Access Tool For Saker!
// @author       Jimmy
// @include      *.*
// @icon         https://img.staticdj.com/02face4114a147617cabf02ab9c59cec.png
// @license      AGPL License
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_cookie
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/437017/Shopify%20Access.user.js
// @updateURL https://update.greasyfork.org/scripts/437017/Shopify%20Access.meta.js
// ==/UserScript==

(function() {
    let isSakerAccess = localStorage.getItem('isSakerAccess') || "";
    if(!isSakerAccess){
        isSakerAccess = true;
        localStorage.setItem('isSakerAccess',isSakerAccess);
    }
})();