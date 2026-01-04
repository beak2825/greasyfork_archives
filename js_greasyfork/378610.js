// ==UserScript==
// @name         ithome open news in new tab
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://*.ithome.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/378610/ithome%20open%20news%20in%20new%20tab.user.js
// @updateURL https://update.greasyfork.org/scripts/378610/ithome%20open%20news%20in%20new%20tab.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('click',function(event) {
        //get clicked news`s link
        let targetElement = event.target || event.srcElement;
        while(!targetElement.href){
            targetElement=targetElement.parentElement;
            if(!targetElement){return;}
        }

        event.preventDefault();

        let url = targetElement.href;
        // open link in new window
        window.open(url, '_blank');
    },true);

})();