// ==UserScript==
// @name         Support tools
// @namespace    http://tampermonkey.net/
// @version      0.22
// @description  Support tools for a cool guys
// @author       Andrei Nazarov
// @include        *
// @icon         https://ads.vk.com/favicon.ico
// @grant        GM_openInTab
// @grant        GM_registerMenuCommand
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/490731/Support%20tools.user.js
// @updateURL https://update.greasyfork.org/scripts/490731/Support%20tools.meta.js
// ==/UserScript==

(function() {
    'use strict';
const isMac = navigator.platform.includes('Mac')


function findBanners() {

    const dataType = () => {

        if(selObj.length === 7){

            navigator.clipboard.writeText(selObj)
            
            return 'ad_plan%3D' + selObj

        }

        if(selObj.length === 8 && (selObj.startsWith("1") || selObj.startsWith("2"))){

            return 'user%3D' + selObj

        } else if (selObj.length === 8){

            return 'campaign%3D' + selObj

        }

        if(selObj.length === 9){

            return 'banner%3D' + selObj

        }

    }
    const selObj = window.getSelection().toString();
    let a = dataType()
    if (selObj && a ) { 
        GM_openInTab(`https://target.my.com/admin/banners_search/?search_filter=vk&search_data_filter=${a}`) 
}
    
}

    GM_registerMenuCommand("Banner", findBanners, "b");

    document.body.addEventListener("keydown", (ev) => {
      
        ev = ev || window.event; 
        const key = ev.which || ev.keyCode; 
        
        const altwin = ev.altKey ? ev.altKey : (key === 18) ? true : false;
        const altmac = ev.ctrlKey ? ev.ctrlKey : (key === 17) ? true : false;

        if(isMac){
            if (key == 67 && altmac) {
                navigator.clipboard
                .readText()
                .then(
                    (clipText) => (navigator.clipboard.writeText(clipText + ' ' + window.getSelection().toString()))
                    );
                }
        } else {
            if (key == 67 && altwin) {
                navigator.clipboard
                .readText()
                .then(
                    (clipText) => (navigator.clipboard.writeText(clipText + ' ' + window.getSelection().toString()))
                    );
                }
        }

        if (key == 77 && altwin && !isMac || key == 77 && altmac) {
            findBanners()
        }
        
    }, false);


})();