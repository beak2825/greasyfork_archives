// ==UserScript==
// @name        Paywall remover - ilgazzettino.it
// @namespace   Violentmonkey Scripts
// @match       https://www.ilgazzettino.it/
// @description     Shows the full text of Il Gazzettino by removing the paywall
// @description:it  Mostra il testo completo degli articoli de Il Gazzettino rimuovendo il paywall
// @grant       none
// @version     1.0
// @author      Seb Venice Paywall Killer
// @description 8/30/2020, 8:42:10 PM
// @downloadURL https://update.greasyfork.org/scripts/410205/Paywall%20remover%20-%20ilgazzettinoit.user.js
// @updateURL https://update.greasyfork.org/scripts/410205/Paywall%20remover%20-%20ilgazzettinoit.meta.js
// ==/UserScript==


function addCss(rule) {
  var css = document.createElement('style');
  css.type = 'text/css';
  if (css.styleSheet) css.styleSheet.cssText = rule; // Support for IE
  else css.appendChild(document.createTextNode(rule)); // Support for the rest
  document.getElementsByTagName("head")[0].appendChild(css);
}

// CSS rules
var rule  = '#paywall_wrapper { display: none !important; } body { overflow: scroll !important; position: relative !important; }';


new MutationObserver(function(mutations, observer) {
  for(var i=0; i<mutations.length; ++i) {
        for(var j=0; j<mutations[i].addedNodes.length; ++j) {
            if(mutations[i].addedNodes[j].id == "paywall_wrapper") {
                addCss(rule);
            }
        }
    }
    
}).observe(document.body, {childList: true});
