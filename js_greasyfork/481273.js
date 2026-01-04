// ==UserScript==
// @name         reader for 69shuba
// @license      Apache License 2.0
// @namespace    https://www.52dzd.com/
// @version      0.1
// @description  make 69shuba reader fullscreen
// @author       xyfy
// @match        https://www.69shuba.com/txt/*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=69shuba.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/481273/reader%20for%2069shuba.user.js
// @updateURL https://update.greasyfork.org/scripts/481273/reader%20for%2069shuba.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const myNodeList = document.querySelectorAll(".container");

    var i;
    for (i = 0; i < myNodeList.length; i++) {
        myNodeList[i].style.maxWidth = "100%";
    }

    let txtnav=document.querySelectorAll('.txtnav')[0];
    if(txtnav){
        txtnav.innerHTML= txtnav.innerHTML.replaceAll(" <br>\n     <br>\n","<br />");
    }

})();