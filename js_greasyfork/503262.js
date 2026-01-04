// ==UserScript==
// @name         jinnanyq_remove_advs
// @namespace    http://tampermonkey.net/
// @version      2024-08-11-2
// @description  try to take over the world!
// @author       You
// @match        *://*.jinnanyq.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jinnanyq.com
// @grant        none
// @license      MIT
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/503262/jinnanyq_remove_advs.user.js
// @updateURL https://update.greasyfork.org/scripts/503262/jinnanyq_remove_advs.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

(function() {
    'use strict';

    setInterval(function (){
        let el = $('body');

        removeAdvs(el);

        let divs = $('div');

        for(let i=0;i<divs.length;i++){
            removeAdvs(divs[i]);
        }

        $('.float-activate-button-container').remove();
    }, 300);
})();

function removeAdvs(el){
    if(el.style !== undefined && el.style.zIndex>10000){
        el.style.visibility = "hidden";
    }else{
        try{
            let allChildren = el.childNodes;
            if (allChildren == undefined){
                allChildren = el.children();
            }
            if (allChildren == undefined){
                return;
            }
            for (let i =0; i < allChildren.length ; i++){
                removeAdvs(allChildren[i]);
            }
        }catch(e){
        }
    }
}