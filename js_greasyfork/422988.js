// ==UserScript==
// @name         ad
// @namespace    test
// @version      0.1
// @match        https://lovehug.net/*/*
// @description test
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422988/ad.user.js
// @updateURL https://update.greasyfork.org/scripts/422988/ad.meta.js
// ==/UserScript==


$(function(){
    setInterval(function(){
        $("iframe").remove();
    },500);
});
