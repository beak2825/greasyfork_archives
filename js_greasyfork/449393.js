// ==UserScript==
// @name         nitro type 1-SECOND race
// @namespace    https://www.ginfio.com/live-sub-count/all-nitro-type-youtubers
// @version      1.1
// @description  Lets you complete a nitro type race in about a second.
// @author       Ginfio
// @match        https://www.nitrotype.com/race
// @match        https://www.nitrotype.com/race/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/449393/nitro%20type%201-SECOND%20race.user.js
// @updateURL https://update.greasyfork.org/scripts/449393/nitro%20type%201-SECOND%20race.meta.js
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
    setInterval(function(){findReact(raceContainer)['state']['lessonContent']='a  jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj'},10);;
                          })();