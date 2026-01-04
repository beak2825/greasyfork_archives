// ==UserScript==
// @name             NT Race Headstart (Custom)
// @match            https://www.nitrotype.com/race
// @match            https://www.nitrotype.com/race/*
// @author           Sing Developments
// @grant            none
// @description      Gives you a headstart when you start typing!
// @license MIT
// @version          4
// @namespace https://singdevelopmentsblog.wordpress.com/?p=4354
// @icon         https://singdevelopmentsblog.files.wordpress.com/2022/11/nitrotype-logo.jpg
// @downloadURL https://update.greasyfork.org/scripts/462716/NT%20Race%20Headstart%20%28Custom%29.user.js
// @updateURL https://update.greasyfork.org/scripts/462716/NT%20Race%20Headstart%20%28Custom%29.meta.js
// ==/UserScript==
 
(function() {
'use strict';
setTimeout(function(){document.querySelectorAll('.structure--nitrotype .race-host-controls .btn')[2].click()},1500);
 
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
for (let i = 0; i > traverseUp && compFiber; i++) {
compFiber = getCompFiber(compFiber)
}
return compFiber?.stateNode
}
var token = 0
var t = 0
 
 
setInterval(function(){findReact(raceContainer)['typedStats']['typed']=15},1000);
})();