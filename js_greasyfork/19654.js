// ==UserScript==
// @name        AnimalQuery
// @description Tries to speedup browsing by disabling CSS content animations
// @license     WTFPLv2, no warranty
// @version     2019.09.18.2157
// @namespace   https://greasyfork.org/users/30-opsomh
// @grant       none
// @inject-into auto
// @run-at      document-start
// @include     *
// @downloadURL https://update.greasyfork.org/scripts/19654/AnimalQuery.user.js
// @updateURL https://update.greasyfork.org/scripts/19654/AnimalQuery.meta.js
// ==/UserScript==
/* jshint esversion: 6 */ 

(function(){
    let style = document.createElement('style');
    style.textContent = `*,*::before,*::after{
        /*animation-delay: 0ms !important;
        animation-duration: 0ms !important;*/
        animation-timing-function: step-start !important;

        /*transition-delay: 0.1ms !important;
        transition-duration: 0.1ms !important;*/
        transition-timing-function: step-start !important;

        scroll-behavior: auto !important;
    }`;
    
    try{
        if(document.head){
            document.head.appendChild(style);
        } else {
            document.documentElement.appendChild(style);
        }
    }catch(e){}
})();
