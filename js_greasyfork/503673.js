// ==UserScript==
// @name         Remove Image
// @namespace    piimage.nao
// @version      0.2
// @description  remove pi image
// @author       You
// @match        https://www.torn.com/properties.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/503673/Remove%20Image.user.js
// @updateURL https://update.greasyfork.org/scripts/503673/Remove%20Image.meta.js
// ==/UserScript==

function re(){
    if ($(".property-img").length > 0){
        $(".property-img").remove();
        
    }
    setTimeout(re,1000);

}

(function() {
    re();
})();