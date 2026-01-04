// ==UserScript==
// @name         auto moodle correct display
// @namespace    http://www.gann.be/
// @version      0.6.2
// @description  correct the css problems in moodle based site wen you autorect tests.
// @author       Morgan Schaefer www.gann.be
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393814/auto%20moodle%20correct%20display.user.js
// @updateURL https://update.greasyfork.org/scripts/393814/auto%20moodle%20correct%20display.meta.js
// ==/UserScript==

(function() {
    'use strict';


function getMeta(metaName) {
   const metas = document.getElementsByTagName('meta');

   for (let i = 0; i < metas.length; i++) {
      if (metas[i].getAttribute('name') === metaName) {
         return metas[i].getAttribute('content');
      }
   }

   return '';
}

let keywords = getMeta('keywords');
let isItMoodle = keywords.search("moodle");
let tableauDeBord = keywords.search("Tableau de bord");
let acceuil = keywords.search("Campus Virtuel IEPS Fléron: Se connecter sur le site");

if((isItMoodle >= 0)&&(tableauDeBord<0)&&(acceuil<0)){
   console.log("this is a moodle based website");
   function addGlobalStyle(css) {
      var head, style;
      head = document.getElementsByTagName('head')[0];
      if (!head) { return; }
      style = document.createElement('style');
      style.type = 'text/css';
      style.innerHTML = css;
      head.appendChild(style);
   }
   addGlobalStyle('.jsenabled .collapsibleregion{ overflow: visible !important; }');
   addGlobalStyle('.container-fluid{ width: auto !important; }');
   addGlobalStyle('@media (min-width: 768px) .col-md-9 {  max-width: 100% !important;}');
   addGlobalStyle('.text-nowrap { white-space: normal !important;}');

} else{
   console.log("this is not a moodle based website or it is an exlued page");

}
})();