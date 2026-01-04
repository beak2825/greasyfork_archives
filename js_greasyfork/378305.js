// ==UserScript==
// @name         Remove Netease
// @namespace    https://minecraft.net
// @version      0.1
// @description  As of name
// @author       Dobby233Liu
// @match        https://minecraft.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/378305/Remove%20Netease.user.js
// @updateURL https://update.greasyfork.org/scripts/378305/Remove%20Netease.meta.js
// ==/UserScript==

(function() {
    'use strict';
    try{
        document.querySelectorAll("#netease-promotion-modal")[0].style.display="none";
        document.body.className.replace("modal-open","");
       }catch(e){}
    document.cookie="ne-p-shown=1";
})();