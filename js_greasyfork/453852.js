// ==UserScript==
// @name         fastttt
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  try to take over the world!ddff
// @author       You
// @match        https://www.nitrotype.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=discord.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/453852/fastttt.user.js
// @updateURL https://update.greasyfork.org/scripts/453852/fastttt.meta.js
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
    var token = 0
    var t = 0


setInterval(function(){findReact(raceContainer)['typedStats']['typed']=10000000000000},1000);
})();