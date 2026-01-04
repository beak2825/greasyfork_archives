// ==UserScript==
// @name         Funnelish Access
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Funnelish Access Tool For Saker!
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
// @downloadURL https://update.greasyfork.org/scripts/449212/Funnelish%20Access.user.js
// @updateURL https://update.greasyfork.org/scripts/449212/Funnelish%20Access.meta.js
// ==/UserScript==

(function() {
    let isFunnelishAccess = localStorage.getItem('isFunnelishAccess') || "";
    if(!isFunnelishAccess){
        isFunnelishAccess = true;
        localStorage.setItem('isFunnelishAccess',isFunnelishAccess);
    }
})();