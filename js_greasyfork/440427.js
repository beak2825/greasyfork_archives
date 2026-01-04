//@ts-check
// ==UserScript==
// @name         253874 face icon
// @namespace    {1863332F-7B8F-44F6-912E-6424CE3443F7}
// @version      0.3
// @description  添加表情图标
// @author       You
// @match        https://www.253874.net/*
// @match        https://253874.net/*
// @icon         https://www.253874.net/favicon.ico
// @grant        GM_addStyle
// @require      https://cdn.jsdelivr.net/gh/component/textarea-caret-position@b5845a4c39cf094b56925183c086f92c8f8fec68/index.js
// @run-at	     document-end
// @license     GPL
// @downloadURL https://update.greasyfork.org/scripts/440427/253874%20face%20icon.user.js
// @updateURL https://update.greasyfork.org/scripts/440427/253874%20face%20icon.meta.js
// ==/UserScript==

(function ()
{
	'use strict';

	/** @type {HTMLTextAreaElement} */
	let input = document.querySelector('textarea[name=message]');
	if (!input) return;
	if (!input.form) return;
	GM_addStyle(`
	.faceblock {
		position: absolute;
		display: flex;
		width: 65px;
		height: 65px;
		background: rgba(255, 255, 255, 0.363);
		border: 1px solid #ccc;

		justify-content: space-around;
		align-items: center;

		pointer-events: none;

		backdrop-filter: blur(5px);

		z-index: 100;
	}

	.faceblock img{
		max-width: 65px;
		max-height: 65px;

		display: block;
	}
`);
	//@ts-ignore
	hook_input(input);


	let ob = new MutationObserver(function (mutations)
	{
		for (const record of mutations)
		{
			if (record.type === 'childList' && record.addedNodes)
			{
				for (const n of record.addedNodes)
				{
					if (n instanceof HTMLElement &&
						typeof n.querySelector === 'function')
					{
						let input = n.querySelector('textarea[name=message]');
						//@ts-ignore
						if (input && input.form)
						{
							//@ts-ignore
							hook_input(input);
						}
					}
				}
			}
		}
	});
	ob.observe(document, {
		subtree: true,
		childList: true,
		attributes: false,
	});

	/**
	 *
	 * @param {HTMLInputElement} input
	 */
	function hook_input(input)
	{
		console.log('now hook the input,', input);
		let isfocus = input === document.activeElement;
		/** @type {HTMLDivElement} */
		let div;
		/** @type {HTMLFormElement} */
		let form = input.form;
		form.addEventListener('submit', function (e)
		{
			input.value = input.value.replace(/#([0-9]{3})([ \r\t\n]|$)/g, function (c, x)
			{
				return `<img src="/face/${x}.gif" alt="${x}" />`
			});
		}, { capture: true });
		input.addEventListener('focus', function ()
		{
			isfocus = true;
			update();
		});
		input.addEventListener('blur', function ()
		{
			isfocus = false;
			update();
		});

		input.addEventListener('input', function () { update(); });
		input.addEventListener('scroll', function () { update(); });
		input.addEventListener('keyup', function (e) { update(); });
		input.addEventListener('click', function (e) { update(); });
		function update()
		{
			function removediv()
			{
				if (div)
				{
					div.remove();
					div = null;
				}
			}
			if (!isfocus)
			{
				removediv();
			}
			else
			{
				let face;
				if ((face = getAroundFace(input)) && face)
				{
					//@ts-ignore
					const position = getCaretCoordinates(input, input.selectionStart);
					if (!div)
					{
						div = document.createElement('div');
						div.classList.add('faceblock');
						form.appendChild(div);
					}
					div.innerHTML = `<img src="/face/${face}.gif" alt="${face}"/>`;
					div.style.top = (input.offsetTop - input.scrollTop + position.top) + 'px';
					div.style.left = (input.offsetLeft - input.scrollLeft + position.left + 2) + 'px';
				}
				else
				{
					removediv();
				}
			}
		}

		function getAroundFace(input)
		{

			let value = input.value;
			let s1 = input.selectionStart;
			let s2 = input.selectionEnd;
			if (s1 >= 0 && s1 <= value.length &&
				s2 >= 0 && s2 <= value.length &&
				s1 === s2)
			{
				//#123
				for (let i = 0; i < 4; ++i)
				{
					if (value[s1] === '#') break;
					if (s1 < 0) break;
					--s1;
				}

				return getFaceAt(value, s1);
			}
			return null;
		}

		function getFaceAt(value, s1)
		{
			function isempty(x)
			{
				return ' \r\n\t'.indexOf(x) >= 0;
			}
			if (value[s1] === '#'
				&& (value.length === s1 + 4 || isempty(value[s1 + 4])))
			{
				let token = value.substring(s1 + 1, s1 + 1 + 3);
				if (/^[0-9]{3}$/.test(token))
					return token;
			}
			return null;
		}

	}
})();