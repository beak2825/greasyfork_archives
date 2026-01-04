// ==UserScript==
// @name         fast races nitro type
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  press a then space and skip the second word :)
// @author       Reverse NT
// @match        https://www.nitrotype.com/race
// @match        https://www.nitrotype.com/race/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nitrotype.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/448363/fast%20races%20nitro%20type.user.js
// @updateURL https://update.greasyfork.org/scripts/448363/fast%20races%20nitro%20type.meta.js
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
    setInterval(function(){findReact(raceContainer)['state']['lessonContent']='a  jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj'},10);;
                          })();