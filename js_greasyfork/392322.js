// ==UserScript==
// @name					LazyScroll
// @description				Scroll pages when mouse hover on scrollbar
// @author					EvilSpark
// @namespace				EvilSpark
// @version					1.1.0
// @license					MIT
// @grant					GM_getValue
// @grant					GM_setValue
// @grant					GM_addStyle
// @run-at					document-end
// @include *
//@downloadURL				https://github.com/EvilSpark/LazyScroll/blob/master/LazyScroll.js
// @downloadURL https://update.greasyfork.org/scripts/392322/LazyScroll.user.js
// @updateURL https://update.greasyfork.org/scripts/392322/LazyScroll.meta.js
// ==/UserScript==

function scrollPlus() {
	//###Customization:

	//Show the scrolling indicator box or not, "1" to show. |
	var scrollShowIndicator = 1;

	//Set the width of scroll-sensitive zone, "100" as full width, "10" as one tenth.

	var VScrollonWidth = 5;

	//Set the background of the indicator bar.
	var IndicBarBG = '#8f8f8f';

	//Set the height of "thickness" of the indicator bar.
	var IndicBarH = 20;

	//Write here the width of the scrollbar (set in display properties) for highest accuracy.

	var ScrollbarWidth = 7;

	//Set a trigger for activation, 1-none, 2-Ctrl key, 3-middle 100px range.

	var activateCond = 1;

	//###Customization ends.
	var scrollStartSWTM = -1;

	var factor;
	var b = null;
	var VScrollOn = 0;
	var delayed = 0;

	document.addEventListener(
		'mousemove',
		function(event) {
			if (document.body.contentEditable == 'true') {
				return;
			}

			var dheightMax = Math.max(
				document.body.scrollHeight,
				document.documentElement.scrollHeight
			);
			var cwidthMax =
				Math.max(
					document.body.clientWidth,
					document.documentElement.clientWidth
				) - ScrollbarWidth;
			var cwinHeight = window.innerHeight;
			var scrollboxHeight = window.innerHeight - 2 * ScrollbarWidth;

			if (dheightMax > cwinHeight) {
				if (event.clientX > cwidthMax) {
					switch (activateCond) {
						case 1:
							VScrollOn = 1;
							break;
						case 2:
							if (event.ctrlKey) VScrollOn = 1;
							break;
						case 3:
							if (
								event.clientY > cwinHeight / 2 - 50 &&
								event.clientY < cwinHeight / 2 + 50
							)
								VScrollOn = 1;
							break;
					}
				}

				if (event.clientX < (1 - VScrollonWidth / 100) * cwidthMax)
					VScrollOn = 0;
			}

			if (VScrollOn && !delayed) {
				setTimeout(function() {
					if (VScrollOn) {
						delayed = 1;
					} else {
						delayed = 0;
					}
				}, 200);

				return;
			}

			if (VScrollOn) {
				if (scrollShowIndicator == 1) make_boxes();

				if (scrollStartSWTM != -1) {
					factor = event.ctrlKey
						? dheightMax / scrollboxHeight / 2
						: dheightMax / scrollboxHeight;
					if (b) {
						b.style.top = event.clientY - IndicBarH / 2 + 'px';
					}

					var delta = factor * (event.clientY - scrollStartSWTM);
					document.body.scrollTop += delta;
					document.documentElement.scrollTop += delta;
					if (event.clientY + 20 > cwinHeight) {
						document.body.scrollTop += factor * 10;
						document.documentElement.scrollTop += factor * 10;
					}
					if (event.clientY > 0 && event.clientY < 20) {
						document.body.scrollTop -= factor * 10;
						document.documentElement.scrollTop -= factor * 10;
					}
				}
				scrollStartSWTM = event.clientY;
			} else {
				scrollStartSWTM = -1;
				if (b)
					setTimeout(function() {
						b.style.top = -200 + 'px';
					}, 200);

				delayed = 0;
			}
		},
		false
	);

	document.addEventListener(
		'click',
		function() {
			VScrollOn = 0;
		},
		false
	);

	function make_boxes() {
		if (!b) {
			b = document.createElement('div');
			b.setAttribute('id', 'IndicatorBox');
			b.setAttribute(
				'style',
				'width:' +
					VScrollonWidth +
					'%;background:' +
					IndicBarBG +
					';min-height:' +
					IndicBarH +
					'px;text-align:center;position: fixed; top: -40px; right: 0;overflow: hidden; z-index: 102400;font-family:Arial !important;cursor:n-resize;cursor:ns-resize;'
			);
			document.body.appendChild(b);
			b.addEventListener(
				'click',
				function() {
					VScrollOn = 0;
				},
				false
			);
			return true;
		}
	}
}

if (!(window !== window.top || window.document.title === '')) {
	setTimeout(scrollPlus, 100);
}
