// ==UserScript==
// @name         OZBargain Affiliate Filter
// @description  Remove affiliate blocks for www.ozbargain.com.au
// @version      2025-03-13
// @author       realroyxu
// @match        https://www.ozbargain.com.au/*
// @icon         https://www.ozbargain.com.au/favicon.ico
// @grant        none
// @run-at document-idle
// @license MIT
// @namespace realroy.org
// @downloadURL https://update.greasyfork.org/scripts/531428/OZBargain%20Affiliate%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/531428/OZBargain%20Affiliate%20Filter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    const aff = document.getElementsByClassName('overlay-afflink');

    let rep = aff.length;
    for (let i = 0; i < rep; i++){
        try{
            let node = aff[0].closest('.node-ozbdeal');
            if (node){
                node.remove();
            }
            else{
                node = aff[0].closest('.node-competition');
                if(node){
                    node.remove();
                }
            }
        }
        catch(err){
            console.log(err);
        }
    }

})();