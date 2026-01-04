// ==UserScript==
// @name         H i d e  YTB   g u i d e   M e n u
// @namespace    https://greasyfork.org/ru/scripts/427241
// @version      0.2
// @description  вспомогательный Скрипт довесок для стиля: "Compact Tube (White)" сворачивающий Главное левое меню.
// @author       -
// @match        *://*.youtube.com/*
// @compatible   firefox 56
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/427241/H%C2%A0i%C2%A0d%C2%A0e%C2%A0%C2%A0YTB%C2%A0%C2%A0%C2%A0g%C2%A0u%C2%A0i%C2%A0d%C2%A0e%C2%A0%C2%A0%C2%A0M%C2%A0e%C2%A0n%C2%A0u.user.js
// @updateURL https://update.greasyfork.org/scripts/427241/H%C2%A0i%C2%A0d%C2%A0e%C2%A0%C2%A0YTB%C2%A0%C2%A0%C2%A0g%C2%A0u%C2%A0i%C2%A0d%C2%A0e%C2%A0%C2%A0%C2%A0M%C2%A0e%C2%A0n%C2%A0u.meta.js
// ==/UserScript==

//debug helper:
//window.YTFixes = {};
(function() {
    'use strict';
	if (window.YTEngine2) return;	// in-development kill-switch
	if (document.location.pathname == '/error')	// there is nothing to do on error page
		return;
	// test local storage availability (required for settings saving) and load settings
	let settings = {}, ls;
	try {
		function lsTest (st, v) {
			st.setItem ('__fix_test__', v);
			return st.getItem ('__fix_test__') == v;
			};
		let _s = window.localStorage;
		if (lsTest (_s, 'qwe') && lsTest (_s, 'rty')) { // do 2 times just in case LS stored value once, but does not let change it later
			ls = _s;
			settings = JSON.parse (ls.getItem ('__fix__settings__')) || {};
			}
		}
    	catch (e) { }

	// set default values
	if (!("hide_guide" in settings))
		settings.hide_guide = true;
	console.log ('fix settings:', settings);
	// catch "settings" page
	if (document.location.pathname == '/fix-settings') {
		document.title = "YouTube Polymer Fixes: Settings";
		let back = document.createElement ('div');
		back.className = 'ytfixback';
		let plane = document.createElement ('div'), e1, e2;
		plane.className = 'ytfix';
		let style = document.createElement ('style');
		style.type = 'text/css';
		style.innerHTML = [
			'.ytfix{position:absolute;left:0;top:0;right:0;background:#eee;padding:3em}',
			'.ytfix_line{margin:1em}',
			'.ytfix_line span,.ytfix_line input,.ytfix_line select{margin-right:1em}',
			'.ytfix_field{padding:0.2em;border:1px solid #888}',
			'.ytfix_button{padding:0.4em;border:1px solid #888}',
			'.ytfix_hide{display:none}',
			'.ytfixback{position:absolute;left:0;top:0;right:0;height:100%;background:#eee}'
			].join ('');
		plane.appendChild (style);
		function AddLine () {
			let q = document.createElement ('div');
			q.className = 'ytfix_line';
			for (let i = 0, L = arguments.length; i < L; ++i)
				q.appendChild (arguments [i]);
			plane.appendChild (q);
			return q;
			}
		e1 = document.createElement ('b');
		e1.appendChild (document.createTextNode ('YouTube Polymer Fixes: Settings'));
		AddLine (e1);
		if (!ls) {
			e1 = document.createElement ('span');
			e1.style = 'color:red';
			e1.appendChild (document.createTextNode ('Cannot edit settings: no access to local storage.'));
			AddLine (e1);
			e1 = document.createElement ('span');
			e1.appendChild (document.createTextNode ('If you are using Firefox, allow cookies for this site.'));
			AddLine (e1);
			}
		else {
			let ess = {};
			function MakeDesc (desc) {
				let e = document.createElement ('span');
				e.appendChild (document.createTextNode (desc));
				return e;
				}
			function MakeBoolElement (nm) {
				let e = document.createElement ('input');
				e.type = 'checkbox';
				e.checked = settings [nm];
				ess [nm] = e;
				return e;
				}
			function MakeListElement (nm, opts) {
				let e = document.createElement ('select');
				e.className = 'ytfix_field';
				ess [nm] = e;
				for (let i = 0, L = opts.length; i < L; ++i) {
					let o = document.createElement ('option');
					o.appendChild (document.createTextNode (opts [i]));
					//if (i == val)
					//	o.setAttribute ('selected', '');
					e.appendChild (o);
					}
				e.selectedIndex = settings [nm];
				return e;
				}
			function MakeTextElement (nm) {
				let e = document.createElement ('input');
				e.className = 'ytfix_field';
				e.value = settings [nm];
				ess [nm] = e;
				return e;
				}
			AddLine (MakeBoolElement ("hide_guide"), MakeDesc ('Hide "Guide" menu when page opens'));
			e1 = document.createElement ('input');
			e1.type = 'button';
			e1.className = 'ytfix_button';
			e1.value = 'Save settings and return to YouTube';
			e1.addEventListener ('click', function () {
				settings.hide_guide = ess.hide_guide.checked;
				settings.reduce_font = ess.reduce_font.checked;
				settings.thumbnail_size = ess.thumbnail_size.selectedIndex;
				if (settings.thumbnail_size == 5) {
					let v = ess.thumbnail_size_m.value;
					if (!/^\d+$/.test (v)) {
						alert ('Error: invalid value for thumbnails size');
						return;
						}
					}

				ls.setItem ('__fix__settings__', JSON.stringify (settings));
				alert ('Settings saved');
				history.back ();
				});

			AddLine (e1, e2);
			}
		let int = setInterval (function () {
			if (!document.body)
				return;

			}, 1);
		}

    // apply settings
	let styles = [], intervals = [];
	function addInterval (period, func, params) {
		if (!period)
			period = 1;
		intervals.push ({ cnt: period, period: period, call: func, params: params || [] });
	    }
	if (settings.hide_guide)
		addInterval (1, function (info) {
			if (info.act == 0) {	// observe location change
				let url = document.location.toString ();
				if (url != info.url)
					info.act = 1;
				}
			if (info.act == 1) {	// wait for sorp page load completion
				let Q = document.getElementsByTagName ('yt-page-navigation-progress');
				if (!Q.length)
					return;
				if (Q [0].hasAttribute ('hidden'))
					info.act = 2;
				}
			if (info.act == 2) {	// wait for button and press it if necessary
				let guide_button = document.getElementById ('guide-button');
				if (!guide_button)
					return;
				let tmp = guide_button.getElementsByTagName ('button');
				if (!tmp.length)
					return;
				tmp = tmp [0];
				if (!tmp.hasAttribute ('aria-pressed'))
					return;
				if (tmp.attributes ['aria-pressed'].value == 'true')
					guide_button.click ();
				else {
					info.url = document.location.toString ();
					info.act = 0;
					}
				}
			}, [{ act: 2 }]);


	// intervals
	setInterval (function () {
		for (let i = intervals.length; --i >= 0; ) {
			let Q = intervals [i];
			if (--Q.cnt > 0)
				continue;
			Q.call.apply (this, Q.params);
			Q.cnt = Q.period;
			}
		}, 1000);
	console.log ('Fixed loaded');
	}) ();