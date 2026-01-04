/* eslint-disable no-multi-spaces */
/* eslint-disable no-implicit-globals */
/* eslint-disable userscripts/no-invalid-headers */
/* eslint-disable userscripts/no-invalid-grant */

// ==UserScript==
// @name               mousetip
// @displayname        鼠标提示框
// @namespace          Wenku8++
// @version            0.1.3
// @description        跟随鼠标的提示框改进，并为其他模块提供鼠标提示框相关接口
// @author             PY-DNG
// @license            GPL-v3
// @regurl             https?://www\.wenku8\.net/.*
// @require            https://greasyfork.org/scripts/449412-basic-functions/code/Basic%20Functions.js?version=1085783
// @grant              none
// ==/UserScript==

(function __MAIN__() {
    'use strict';
	const tipready = tipcheck();
	tipscroll();
	exports = {
		tipready: tipready,
		settip: settip,
		showtip: showtip,
		hidetip: hidetip
	};

	// Check if tipobj is ready, if not, then make it
	function tipcheck() {
		DoLog(LogLevel.Info, 'checking tipobj...');
		if (typeof(tipobj) === 'object' && tipobj !== null) {
			DoLog(LogLevel.Info, 'tipobj ready...');
			return true;
		} else {
			DoLog(LogLevel.Warning, 'tipobj not ready');
			if (typeof(tipinit) === 'function') {
				DoLog(LogLevel.Success, 'tipinit executed');
				tipinit();
				return true;
			} else {
				DoLog(LogLevel.Error, 'tipinit not found');
				return false;
			}
		}
	}

	// New tipobj movement method. Makes sure the tipobj stay close with the mouse.
	function tipscroll() {
		if (!tipready) {return false;}

		DoLog('tipscroll executed. ')
		tipobj.style.position = 'fixed';
		window.addEventListener('mousemove', tipmoveplus)
		return true;

		function tipmoveplus(e) {
			tipobj.style.left = e.clientX + tipx + 'px';
			tipobj.style.top = e.clientY + tipy + 'px';
		}
	}

	// show & hide tip when mouse in & out. accepts tip as a string or a function that returns the tip string
	function settip(elm, tip) {
		typeof(tip) === 'string' && (elm.tiptitle = tip);
		typeof(tip) === 'function' && (elm.tipgetter = tip);
		elm.removeEventListener('mouseover', showtip);
		elm.removeEventListener('mouseout', hidetip);
		elm.addEventListener('mouseover', showtip);
		elm.addEventListener('mouseout', hidetip);
	}

	function showtip(e) {
		if (e && e.currentTarget && (e.currentTarget.tiptitle || e.currentTarget.tipgetter)) {
			const tip = e.currentTarget.tiptitle || e.currentTarget.tipgetter();
			if (tipready) {
				tipshow(tip);
				e.currentTarget.title && e.currentTarget.removeAttribute('title');
			} else {
				e.currentTarget.title = e.currentTarget.tiptitle;
			}
		} else if (typeof(e) === 'string') {
			tipready && tipshow(e);
		}
	}

	function hidetip() {
		tipready && tiphide();
	}
})();