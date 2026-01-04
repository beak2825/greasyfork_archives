// ==UserScript==
// @name		Melvor Sort By Type
// @namespace	http://tampermonkey.net/
// @version		0.01/SVN?1354
// @description Overrides melvor's item sort algorithm to something more logical
// @author		mootykins
// @match		https://*.melvoridle.com/*
// @exclude		https://wiki.melvoridle.com*
// @exclude		https://*.melvoridle.com/index.php
// @noframes
// @license unlicense
// @grant		none
// @downloadURL https://update.greasyfork.org/scripts/436345/Melvor%20Sort%20By%20Type.user.js
// @updateURL https://update.greasyfork.org/scripts/436345/Melvor%20Sort%20By%20Type.meta.js
// ==/UserScript==
// Loading code by GMiclotte
function sortScript() {
    if (window.SortScript !== undefined) {
        console.error('SortBank is already loaded!');
    } else {
        loadSortScript();
    }

    function loadSortScript(){
      window.SortScript = {}
      sortBank = function() {
        bank.sort((a,b) => {
          let a_full = items[a.id];
          let b_full = items[b.id];
          if(a_full.category == b_full.category){
            if(a_full.type == b_full.type){
              if(typeof(a_full.tier) !== 'undefined' && typeof(b_full.tier) !== 'undefined'){
                if(a_full.tier == b_full.tier){
                  return a.sellsFor < b.sellsFor;                  
                }else{
                  return a_full.tier < b_full.tier;
                }
              }else{
                return a.sellsFor < b.sellsFor;
              }
            }else{
              return a_full.type < b_full.type;
            }
          }else{
            return a_full.category < b_full.category;
          }
        });
        loadBank();
      }
    }
}

// inject the script
(function () {
    function injectScript(main) {
        const sortScriptElement = document.createElement('script');
        sortScriptElement.textContent = `try {(${main})();} catch (e) {console.log(e);}`;
        document.body.appendChild(sortScriptElement).parentNode.removeChild(sortScriptElement);
    }

    function loadScript() {
        if (typeof(confirmedLoaded) !== 'undefined' && confirmedLoaded) {
            // Only load script after game has opened
            clearInterval(sortScriptLoader);
            injectScript(sortScript);
        }
    }

    const sortScriptLoader = setInterval(loadScript, 200);
})();