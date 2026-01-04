// ==UserScript==
// @name         hawkes-helper
// @namespace    https://github.com/zaz/hawkes-helper
// @version      0.4
// @description  Open a problem in Wolfram Alpha by pressing Alt + q
// @author       Zaz Brown; https://github.com/zaz/hawkes-helper
// @include      *://learn.hawkeslearning.com/*
// @grant        none
// @license      CC0-1.0
// @downloadURL https://update.greasyfork.org/scripts/466891/hawkes-helper.user.js
// @updateURL https://update.greasyfork.org/scripts/466891/hawkes-helper.meta.js
// ==/UserScript==

// You can copy the line below into the URL bar instead of adding this script to your browser
// javascript:$.getScript('https://cdn.jsdelivr.net/npm/@androettop/mathml2latex@1.1.17/lib/mathml2latex.browser.cjs.min.js');fixEquation  = latex => latex.replace(/ = $/, '');window.open('https://www.wolframalpha.com/input?i='+$(".MathJax").map((_, e) => $(e).data("mathml")).get().map(mathml2latex.convert).map(fixEquation).join(",  "))

$.getScript('https://cdn.jsdelivr.net/npm/@androettop/mathml2latex@1.1.17/lib/mathml2latex.browser.cjs.min.js')

let fixEquation = latex =>
	latex.replace(/ = $/, '')
	     .replace(/\\left/g, '')
	     .replace(/\\right/g, '')
	     .replace(/^{′}/g, '′')

// removes duplicates from an array, removing leftmost ones first
let deduplicate = arr =>
	Array.from(new Set( arr.reverse() )).reverse()

let viewProblemInWolframAlpha = () =>
	window.open(
		'https://www.wolframalpha.com/input?i=' +
		encodeURIComponent(
			deduplicate(
				$(".MathJax").map((_, e) => $(e).data("mathml"))
					     .get()
					     .map(mathml2latex.convert)
					     .map(fixEquation)
			).join(",  ")
		)
	)

$(document).keydown(function (event) {
	// if Alt + q is pressed
	if (event.altKey && event.key === 'q') {
		viewProblemInWolframAlpha()
		event.preventDefault()
	}
})
