// ==UserScript==
// @name         知乎去视频、广告
// @namespace    ZhiHuSupport
// @version      2.0.2
// @description  去掉知乎首页的视频，广告
// @author       adogie@outlook.com
// @match        *://www.zhihu.com/*
// @license      MIT
// @run-at document-body
// @downloadURL https://update.greasyfork.org/scripts/447809/%E7%9F%A5%E4%B9%8E%E5%8E%BB%E8%A7%86%E9%A2%91%E3%80%81%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/447809/%E7%9F%A5%E4%B9%8E%E5%8E%BB%E8%A7%86%E9%A2%91%E3%80%81%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function () {
	'use strict';

/**
 * Add a stylesheet rule to the document (it may be better practice
 * to dynamically change classes, so style information can be kept in
 * genuine stylesheets and avoid adding extra elements to the DOM).
 * Note that an array is needed for declarations and rules since ECMAScript does
 * not guarantee a predictable object iteration order, and since CSS is
 * order-dependent.
 * @param {Array} rules Accepts an array of JSON-encoded declarations
 * @example
addStylesheetRules([
  ['h2', // Also accepts a second argument as an array of arrays instead
    ['color', 'red'],
    ['background-color', 'green', true] // 'true' for !important rules
  ],
  ['.myClass',
    ['background-color', 'yellow']
  ]
]);
*/
	const addStylesheetRules = (rules) => {
		const styleEl = document.createElement('style');

		// Append <style> element to <head>
		document.head.appendChild(styleEl);

		// Grab style element's sheet
		const styleSheet = styleEl.sheet;

		for (let i = 0; i < rules.length; i++) {
			let j = 1,
				rule = rules[i],
				selector = rule[0],
				propStr = '';
			// If the second argument of a rule is an array of arrays, correct our variables.
			if (Array.isArray(rule[1][0])) {
				rule = rule[1];
				j = 0;
			}

			for (let pl = rule.length; j < pl; j++) {
				const prop = rule[j];
				propStr +=
					prop[0] + ': ' + prop[1] + (prop[2] ? ' !important' : '') + ';\n';
			}

			// Insert CSS Rule
			styleSheet.insertRule(
				selector + '{' + propStr + '}',
				styleSheet.cssRules.length
			);
		}
	};

	addStylesheetRules([
		[
			[
				'.TopstoryItem--advertCard',
				'.Pc-card',
				'.css-1hrc83f',
				'.VideoAnswerPlayer',
				'.RichContent-cover'
			], // Also accepts a second argument as an array of arrays instead
			['display', 'none', true],
		],
		[
			[
				'.ZVideoItem-toolbar',
			], // Also accepts a second argument as an array of arrays instead
			['padding', 0, true],
		],
	]);
})();
