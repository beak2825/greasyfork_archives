
// race early // ==UserScript==
// @name         Nitro Type start race early
// @namespace    ginfio.com/
// @version      0.2
// @description  Lets you start nitro type races earlier than everyone else.
// @author       Ginfio
// @match        https://www.nitrotype.com/race
// @match        https://www.nitrotype.com/race/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/449404/Nitro%20Type%20start%20race%20early.user.js
// @updateURL https://update.greasyfork.org/scripts/449404/Nitro%20Type%20start%20race%20early.meta.js
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

    setInterval(function(){findReact(raceContainer)['state']['started']=true},3000);
})();