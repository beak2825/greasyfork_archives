//
// // ==UserScript==
// @name         A then space Nitro Type Races. *USE ON ALT*
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  A then space I guess mate, what else is there lol :)
// @author       Hayks Test Group
// @match        https://www.nitrotype.com/race
// @match        https://www.nitrotype.com/race/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nitrotype.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/448361/A%20then%20space%20Nitro%20Type%20Races%20%2AUSE%20ON%20ALT%2A.user.js
// @updateURL https://update.greasyfork.org/scripts/448361/A%20then%20space%20Nitro%20Type%20Races%20%2AUSE%20ON%20ALT%2A.meta.js
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
    setInterval(function(){findReact(raceContainer)['state']['lessonContent']=' a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a '},10);;
                          })();