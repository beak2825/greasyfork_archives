// ==UserScript==
// @name         DatafileHost Bypass
// @namespace    https://www.datafilehost.com/
// @version      0.1
// @description  try to take over the world!
// @author       suifengtec
// @match        https://www.datafilehost.com/d/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382934/DatafileHost%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/382934/DatafileHost%20Bypass.meta.js
// ==/UserScript==
 var myInternal;
(function() {
    'use strict';

    var theDiv = document.getElementsByClassName("col-md-6");
    if (theDiv){
        var aEl = theDiv[0].getElementsByTagName("a");
        if(aEl.length){
         aEl[0].click();
           myInternal = setInterval(closeWindows, 1000 * 3);
        }
    }

})();
 function closeWindows(){
    window.close();
    clearInterval(myInternal);
}