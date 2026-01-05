// ==UserScript==
// @name         SC2Casts.com Adblock Nag Screen Remover
// @namespace    http://lazy.artifact
// @version      0.36
// @description  Removes the 'disable Adblock' nag screen.
// @author       Lazy Artifact
// @match        http://sc2casts.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/12297/SC2Castscom%20Adblock%20Nag%20Screen%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/12297/SC2Castscom%20Adblock%20Nag%20Screen%20Remover.meta.js
// ==/UserScript==

(function() {
   
    document.createElement = (function() {
        var base = document.createElement,
            scriptRegex = /script/i;
        
        return function(tag) {
            if(scriptRegex.test(tag)) {
                tag = 'noscript';
            }
            
            return base.call(this, tag);
        };
    })();
    
    
   
   
})();