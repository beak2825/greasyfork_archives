// ==UserScript==
// @name         fast reload
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Refreshes script as soon as finished in Nitro Type!
// @author       Epic NT
// @license      MIT
// @match        https://www.nitrotype.com/race
// @match        https://www.nitrotype.com/race/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nitrotype.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/455301/fast%20reload.user.js
// @updateURL https://update.greasyfork.org/scripts/455301/fast%20reload.meta.js
// ==/UserScript==

(function() {
    'use strict';

         const findReact = (dom, traverseUp = 0) => {
const key = Object.keys(dom).find((key) => key.startsWith("__reactFiber$"))
const domFiber = dom[key]
if (domFiber == null) return null
const getCompFiber = (fiber) => {
let parentFiber = fiber?.return
while (typeof parentFiber?.type == "string") {
parentFiber = parentFiber?.return
}
return parentFiber
}
let compFiber = getCompFiber(domFiber)
for (let i = 0; i < traverseUp && compFiber; i++) {
compFiber = getCompFiber(compFiber)
}
return compFiber?.stateNode
}
         setInterval(function(){if(findReact(raceContainer)['finished']==true){location.reload()}
         },250);
})();