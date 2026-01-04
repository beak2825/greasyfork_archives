// ==UserScript==
// @name         equalise-o-don
// @license      DWTFYW
// @namespace    http://pureandapplied.com.au/resizodon
// @version      0.1.0.1
// @description  equalised columns in mastodon
// @author       stib
// @match        https://*.social/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aus.social
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/454186/equalise-o-don.user.js
// @updateURL https://update.greasyfork.org/scripts/454186/equalise-o-don.meta.js
// ==/UserScript==


(function() {
    function makeResizable () {
        let cols =[];
        for (let a = 0; a < arguments.length; a++){
                    let divs = document.getElementsByClassName(arguments[a]);
            for (let d = 0; d < divs.length; d++){
                cols.push(divs[d]);
            }
        }

        for(let i=0; i< cols.length; i++){
            cols[i].style.flex = "1 1 auto";
            resizeObserver.observe(cols[i]);
        }
    }
    const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
            if (entry.contentBoxSize) {
                setupResizing();
            }
        }
    })
    function setupResizing(){
        makeResizable('drawer', 'column');
    }
    setupResizing();
})();