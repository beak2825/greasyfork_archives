// ==UserScript==
// @name         megaup自動下載
// @version      1.0.0
// @description  自動下載megaup檔案
// @author       聖冰如焰
// @match        https://megaup.net/*
// @icon         https://www.google.com/s2/favicons?domain=megaup.net
// @grant        none
// @namespace https://greasyfork.org/users/442438
// @downloadURL https://update.greasyfork.org/scripts/425697/megaup%E8%87%AA%E5%8B%95%E4%B8%8B%E8%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/425697/megaup%E8%87%AA%E5%8B%95%E4%B8%8B%E8%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let clicked = true
   setInterval(()=>{
       if ($("#btnsubmit").length && clicked){
           $("#btnsubmit").click();
           clicked = false;
       }
   },200)
})();