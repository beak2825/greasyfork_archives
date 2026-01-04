// ==UserScript==
// @name         Nitro Type - Custom Race Text
// @namespace    https://www.nitrotype.com/racer/*
// @version      4.0.0
// @description  Lets You To Change The Nitro Type Race Text to ANY text you want. *USE ON ALT*
// @author       Rynna Sanchez
// @match        https://www.nitrotype.com/race
// @match        https://www.nitrotype.com/race/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543466/Nitro%20Type%20-%20Custom%20Race%20Text.user.js
// @updateURL https://update.greasyfork.org/scripts/543466/Nitro%20Type%20-%20Custom%20Race%20Text.meta.js
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
/*Type Whatever Text You Want in The 'Your Custom Text Here' Field */
    setInterval(function(){findReact(raceContainer)['state']['lessonContent']='Enter Custom Text Here'},10);;
                          })();