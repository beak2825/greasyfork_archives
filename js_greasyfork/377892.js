// ==UserScript==
// @name		Gmail Fix
// @namespace	http://tampermonkey.net/
// @version		1.1.2
// @description	Fix Gmail's broken reply-to
// @author		summersab
// @match		https://mail.google.com/*
// @grant		none
// @downloadURL https://update.greasyfork.org/scripts/377892/Gmail%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/377892/Gmail%20Fix.meta.js
// ==/UserScript==

(function() {
	'use strict';

	function setLanguage() {
		var language = document.querySelector('html').getAttribute('lang');

		var selectorReplyTo = "";

		switch (language) {
			case 'en':
				selectorReplyTo = 'reply-to';
				break;
			case 'en-gb':
				selectorReplyTo = 'reply-to';
				break;
			case 'nl':
				selectorReplyTo = 'Antwoorden op';
				break;
			case 'es':
				selectorReplyTo = 'responder a';
				break;
			case 'es-149':
				selectorReplyTo = 'responder a';
				break;
			case 'fr':
				selectorReplyTo = 'répondre à';
				break;
			case 'it':
				selectorReplyTo = 'rispondi a';
				break;
            case 'cs':
				selectorReplyTo = 'adresa pro odpověď';
				break;
		}
		document.querySelector('#re-to-settings').setAttribute('selector-reply-to', selectorReplyTo);
	}

	function reTo() {
		console.log("re-to");
		var selectorReplyTo = document.querySelector('#re-to-settings').getAttribute('selector-reply-to');

		if (document.querySelector('.Am.aO9.Al.editable.LW-avf') == null) {
			setTimeout(function() {
				reTo();
			}, 1000);
		}
		else {
			var reToAddress = "";
			document.querySelector('.ajy[role="menuitem"]').click();
			var els = document.querySelectorAll('.ajv');
			for (var i = 0; i < els.length; i++) {
				if (els[i].querySelector('.gG .gI').innerText == selectorReplyTo + ':') {
					reToAddress = els[1].querySelector('.gG').nextSibling.innerText;
					if (document.querySelector('textarea[name="to"]').innerHTML == reToAddress) {
						break;
					}
					document.querySelector('.aoD.hl').dispatchEvent(new Event('focus'));
					document.querySelector('.vN.bfK.a3q .vM').click();
					document.querySelector('.oL.aDm').dispatchEvent(new Event('focus'));
					document.querySelector('textarea[name="to"]').innerText = reToAddress;
					break;
				}
			}
			document.querySelector('.ajy[role="menuitem"]').click();
			document.querySelector('.Am.aO9.Al.editable.LW-avf').focus();
			document.querySelector('.Am.aO9.Al.editable.LW-avf').dispatchEvent(new Event('select'));
		}
		document.querySelector('#re-to-settings').setAttribute('re-to-running', false);
	}

	function loadListeners() {
		console.log("loading listeners");
		var selectorReplyTo = document.querySelector('#re-to-settings').getAttribute('selector-reply-to');

		if (document.querySelector('span.ams.bkH') != null) {
			var els = document.querySelectorAll('span.ams.bkH');
			for (var i = 0; i < els.length; i++) {
				els[i].addEventListener("click", function() {
					if (document.querySelector('#re-to-settings').getAttribute('re-to-running') == 'false') {
						document.querySelector('#re-to-settings').setAttribute('re-to-running', true);
						reTo()
					}
				});
			}
			document.querySelector('span.ams.bkH').addEventListener("click", function() {
				if (document.querySelector('#re-to-settings').getAttribute('re-to-running') == 'false') {
					document.querySelector('#re-to-settings').setAttribute('re-to-running', true);
					reTo()
				}
			});
			document.querySelector('.T-I.J-J5-Ji.T-I-Js-IF.aaq.T-I-ax7.L3').addEventListener("click", function() {
				if (document.querySelector('#re-to-settings').getAttribute('re-to-running') == 'false') {
					document.querySelector('#re-to-settings').setAttribute('re-to-running', true);
					reTo()
				}
			});
		}
		document.querySelector('#re-to-settings').setAttribute('load-listeners-running', false);
	}

	function watchChanges() {
		if (document.querySelector('div[aria-live="polite"]') == null) {
			setTimeout(function() {
				watchChanges();
			}, 1000);
		}
		else {
			var observer = new MutationObserver(function(mutations) {
				console.log("Mutilations: " + mutations.length);
				if (document.querySelector('#re-to-settings').getAttribute('load-listeners-running') == 'false') {
						document.querySelector('#re-to-settings').setAttribute('load-listeners-running', true);
						loadListeners();
				}
			});
			observer.observe(document.querySelector('div[aria-live="polite"]'), {childList: true});
		}
	}

	function initLoadListeners() {
		if (document.querySelector('#loading') != null && document.querySelector('#loading').style.display != "none") {
			setTimeout(function() {
				initLoadListeners();
			}, 1000);
		}
		else {
			if (document.querySelector('#re-to-settings') == null) {
				var node = document.createElement("DIV");
				node.setAttribute('id', 're-to-settings');
				node.setAttribute('load-listeners-running', false);
				node.setAttribute('re-to-running', false);
				document.querySelector('body').appendChild(node);
			}
			if (document.querySelector('#re-to-settings').getAttribute('load-listeners-running') == 'false') {
				document.querySelector('#re-to-settings').setAttribute('load-listeners-running', true);
				setLanguage();
				loadListeners();
			}
		}
	}

	watchChanges();
	initLoadListeners();
})();