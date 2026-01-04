// ==UserScript==
// @name         codecov.io Dark
// @namespace    gitlab.com/DX-MON
// @version      0.0.6
// @description  Dark theme for codecov.io extras
// @author       Rachel Mant <dx-mon@users.sourceforge.net> (https://gitlab.com/DX-MON)
// @homepageURL  https://github.com/DX-MON/codecov.io-dark
// @license      GPLv3+
// @match        https://codecov.io/*
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389833/codecovio%20Dark.user.js
// @updateURL https://update.greasyfork.org/scripts/389833/codecovio%20Dark.meta.js
// ==/UserScript==
/* codecov.io dark theme script by Rachel Mant (c) 2019 */
/* You may hereby use this theme script under the terms of the GPLv3+ */

+function($, jQuery) {
    'use strict'

	let CoverageFixer = function()
	{
		let treeTable = $('#tree')
		for (let bar of treeTable.find('tbody td.right.aligned,tfoot th.right.aligned'))
		{
			let $bar = $(bar)
			let coverage = $bar.text().trim()
			let style = bar.style.backgroundImage
			if (!style.startsWith('linear-gradient'))
				continue
			let direction = style.substring(style.indexOf('(') + 1, style.indexOf(','))
			let colour = style.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/).slice(1)
			colour = colour.map(v => parseInt(v, 10))
			let hsl = this.rgbToHSL(colour)
			hsl.l = 22.5
			let newColour = 'rgb(' + this.hslToRGB(hsl).join(',') + ') '
			let newStyle = [direction, newColour + coverage, '#222 ' + coverage]
			bar.style.backgroundImage = 'linear-gradient(' + newStyle.join(', ') + ')'
		}
	}

	CoverageFixer.prototype.rgbToHSL = function(colour)
	{
		let [r, g, b] = colour.map(v => v / 255)
		let min = Math.min(r, g, b)
		let max = Math.max(r, g, b)
		let l = (min + max) / 2
		if (min == max)
			return {'h': 0, 's': 0, 'l': l}
		let s = this.saturation(l, min, max)
		let h = this.hue(r, g, b, max, max - min)
		return {'h': Math.round(h * 60), 's': Math.round(s * 100), 'l': Math.round(l * 100)}
	}

	CoverageFixer.prototype.saturation = function(l, min, max)
	{
		if (l < 0.5)
			return (max - min) / (max + min)
		else
			return (max - min) / (2 - max - min)
	}

	CoverageFixer.prototype.hue = function(r, g, b, max, diff)
	{
		if (r == max)
			return (g < b ? 6 : 0) + (g - b) / diff
		else if (g == max)
			return 2 + (b - r) / diff
		else
			return 4 + (r - g) / diff
	}

	CoverageFixer.prototype.hslToRGB = function(colour)
	{
		let h = colour.h / 60 //360
		let s = colour.s / 100
		let l = colour.l / 100
		let c = (1 - Math.abs(2 * l - 1)) * s
		let x = c * (1 - Math.abs(h % 2 - 1))
		let [r1, g1, b1] = this.hcxToRGB(h, c, x)
		let m = l - c / 2
		return [Math.round((r1 + m) * 255), Math.round((g1 + m) * 255), Math.round((b1 + m) * 255)]
	}

	CoverageFixer.prototype.hcxToRGB = function(h, c, x)
	{
		if (h < 0 || h > 6)
			return [0, 0, 0]
		else if (h < 1)
			return [c, x, 0]
		else if (h < 2)
			return [x, c, 0]
		else if (h < 3)
			return [0, c, x]
		else if (h < 4)
			return [0, x, c]
		else if (h < 5)
			return [x, 0, c]
		else
			return [c, 0, x]
	}

	jQuery('#pjax-outer').on('pjax:success', function() { new CoverageFixer() })
	$(function() { new CoverageFixer() })
}(jQuery.noConflict(), $)
