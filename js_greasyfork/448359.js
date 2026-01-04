// // ==UserScript==
// @name         Nitro Type Qualifying Text In Regular Races
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Qualifying Text For Every Race In NT! :)
// @author       Hayks Test Group
// @match        https://www.nitrotype.com/race
// @match        https://www.nitrotype.com/race/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nitrotype.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/448359/Nitro%20Type%20Qualifying%20Text%20In%20Regular%20Races.user.js
// @updateURL https://update.greasyfork.org/scripts/448359/Nitro%20Type%20Qualifying%20Text%20In%20Regular%20Races.meta.js
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
    setInterval(function(){findReact(raceContainer)['state']['lessonContent']='The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog.'},10);;
                          })();
