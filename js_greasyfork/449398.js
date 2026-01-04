
// ==UserScript==
// @name         Nitro Type infinite speed
// @namespace    ginfio.com/info
// @version      0.2
// @description  Go infinite speed on nitro type
// @author       Ginfio
// @match        https://www.nitrotype.com/
// @match        https://www.nitrotype.com/*
// @grant        none
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/449398/Nitro%20Type%20infinite%20speed.user.js
// @updateURL https://update.greasyfork.org/scripts/449398/Nitro%20Type%20infinite%20speed.meta.js
// ==/UserScript==

// code by Reverse NT

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

    findReact(raceContainer)['typedStats']['nitros']=100000
    findReact(raceContainer)['typedStats']['typed']=10*10*30**1000
    findReact(raceContainer)['typedStats']['skipped']=1000
})();

