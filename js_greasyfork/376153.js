// ==UserScript==
// @name		Surrounded
// @namespace	cpriest
// @version		0.3
// @description	Surrounds selected text on web pages with pairs of characters when typed, keeps selection unchanged.
// @author		Clint Priest
// @homepage	https://github.com/cpriest/userscripts/tree/master/surrounded
// @include		*
// @grant		none
// @license		MIT
// @compatible 	firefox
// @compatible 	chrome
// @compatible 	opera
// @compatible 	safari
// @todo			Make it work with code editors (CodeMirror, ace)
// @downloadURL https://update.greasyfork.org/scripts/376153/Surrounded.user.js
// @updateURL https://update.greasyfork.org/scripts/376153/Surrounded.meta.js
// ==/UserScript==

(function() {
	'use strict';

	const CTRL  = 1,
		  ALT   = 2,
		  SHIFT = 4;

	const ActiveKeys = [`'`, `"`, '(', ')', '{', '}', '[', ']', '`', '*', '_', '<', '>',];

	/**
	 * Returns true if we work with the passed in elem
	 *
	 * @param {Element} elem
	 *
	 * @returns boolean
	 */
	function WeWorkWithThisElement(elem) {
		if(elem.tagName == 'TEXTAREA')
			return true;

		if(elem.tagName == 'INPUT') {
			if('selectionStart' in elem || 'selectionEnd' in elem)
				return true;
		}
		return false;
	}

	function note(...args) {
		console.log(...args);
	}

	/**
	 * Surrounds the given elements selection with the character set
	 *
	 * @param {HTMLInputElement|HTMLTextAreaElement} elem
	 * @param key
	 */
	function Surround(elem, key) {
		let { selectionStart, selectionEnd, selectionDirection } = elem;

		let leftKey    = key + '',
			rightKey   = key + '',
			leftValue  = elem.value.substring(0, elem.selectionStart),
			value      = elem.value.substring(elem.selectionStart, elem.selectionEnd),
			rightValue = elem.value.substring(elem.selectionEnd);

		switch(leftKey) {
			case '{':
				rightKey = '}';
				break;
			case '}':
				rightKey            = '{';
				[leftKey, rightKey] = [rightKey, leftKey];
				break;
			case '(':
				rightKey = ')';
				break;
			case ')':
				rightKey            = '(';
				[leftKey, rightKey] = [rightKey, leftKey];
				break;
			case '[':
				rightKey = ']';
				break;
			case ']':
				rightKey            = '[';
				[leftKey, rightKey] = [rightKey, leftKey];
				break;
			case '<':
				rightKey = '>';
				break;
			case '>':
				rightKey            = '<';
				[leftKey, rightKey] = [rightKey, leftKey];
				break;
		}

		// Remove Mode
		if(leftValue.substr(-1) === leftKey && rightValue.substr(0, 1) === rightKey) {
			leftValue  = leftValue.substr(0, leftValue.length - 1);
			rightValue = rightValue.substr(1);
			leftKey    = rightKey = '';
			selectionStart--;
			selectionEnd--;
		} else {
			// Add Mode
			selectionStart++;
			selectionEnd++;
		}

		elem.value          = `${leftValue}${leftKey}${value}${rightKey}${rightValue}`;
		elem.selectionStart = selectionStart;
		elem.selectionEnd   = selectionEnd;
	}

	window.document.addEventListener('keydown',
		/** @param {KeyboardEvent} e */e => {
			e.mods = (e.ctrlKey) + (e.altKey << 1) + (e.shiftKey << 2);

			if(e.mods > 0 && e.mods !== 4)
				return; // note(`${e.key}: CTRL/ALT active e.mods=${e.mods}`);

			if(ActiveKeys.indexOf(e.key) == -1)
				return; // note(`${e.key}: not a key we care about`);

			if(!document.activeElement)
				return; // note(`${e.key}: no valid activeElement: %o`, document.activeElement);

			let ae = document.activeElement;
			if(!WeWorkWithThisElement(ae))
				return; // note(`${e.key}: We don't work with: %o`, ae);

			if(ae.selectionStart === ae.selectionEnd)
				return; // note(`${e.key}: No characters are selected, start=${ae.selectionStart}, end=${ae.selectionEnd}` );

			Surround(ae, e.key);

			e.preventDefault();
			e.stopPropagation();

		}, true);
})();
