// ==UserScript==
// @name        Para salvar links twitter
// @autor       Hader Araujo
// @namespace   http://tampermonkey.net/
// @description Script para salvar links twitter
// @match       *://*/*
// @license     MIT
// @version     0.6
// @grant       none
// @require     http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/458514/Para%20salvar%20links%20twitter.user.js
// @updateURL https://update.greasyfork.org/scripts/458514/Para%20salvar%20links%20twitter.meta.js
// ==/UserScript==


alert('sad')
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

(async function () {
    'use strict';
debugger
    console.log("inicio");
    await sleep(1000);


    var all = $$("a[href^='https://twitter.com']")
    all.forEach(function(item) { 
        
        item.href =  'http://38.242.159.68:5000/twitter/save?link=' + item.href;
      
   });
    
})();