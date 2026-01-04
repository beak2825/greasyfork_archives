// ==UserScript==
// @name         Anti-Nahitan
// @namespace    https://koutarou.uy/
// @version      0.1
// @description  Informar al mundo sobre Fugitivo de la justicia, Nahitan Nandez
// @author       kouta-kun
// @match *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/467536/Anti-Nahitan.user.js
// @updateURL https://update.greasyfork.org/scripts/467536/Anti-Nahitan.meta.js
// ==/UserScript==

function textNodesUnder(el){
  var n, a=[], walk=document.createTreeWalker(el,NodeFilter.SHOW_TEXT,null,false);
  while(n=walk.nextNode()) a.push(n);
  return a;
}

function replacer(match, offset, string) {
    'use strict';
    const negativePrefix = "Fugitivo de la justicia, ";

    if (string.substring(offset-negativePrefix.length, offset) === negativePrefix) return match;
    return negativePrefix + match;
}

function onScrollStart() {
    'use strict';
    const searchTerm = /Nahitan N[aá]ndez/gi;

    for(let elem of textNodesUnder(document.body)) {
        if(elem.textContent.search(searchTerm) >= 0) {
            console.log(elem.textContent);
            elem.textContent = elem.textContent.replaceAll(searchTerm, replacer);
            console.log(elem.textContent);
        }
    }
}

(function() {
    'use strict';
    console.log("init script");
    window.addEventListener("scroll", onScrollStart, false);
    onScrollStart();
    // Your code here...
})();