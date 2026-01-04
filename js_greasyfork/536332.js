// ==UserScript==
// @name        pr0game mouse hover fix
// @namespace   pr0game
// @match       https://pr0game.com/uni*/game.php*
// @grant       none
// @include     https://pr0game.com/uni5/scripts/base/jquery.js
// @run-at      document-end
// @version     1.0
// @author      moh
// @license     MIT
// @icon        https://www.google.com/s2/favicons?sz=64&domain=pr0game.com
// @description Quick and dirty fix for not working hover elements in my gecko/chromiuim based browsers.
// @downloadURL https://update.greasyfork.org/scripts/536332/pr0game%20mouse%20hover%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/536332/pr0game%20mouse%20hover%20fix.meta.js
// ==/UserScript==

$(document).ready(function () {
	const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

	if (isTouchDevice) {
    // force unregister default handler
    $(document).off("click touchstart", ".tooltip, .tooltip_sticky");

		// For touch devices
		$(document).on("click touchstart", ".tooltip, .tooltip_sticky", function (e) {
			console.log('clicked?')
      e.preventDefault();
			e.stopImmediatePropagation();

			const tip = $('#tooltip');
			const content = $(this).attr('data-tooltip-content');

			if (tip.is(':visible') && tip.html() === content) {
				// Close tooltip if it is already visible
				tip.hide();
				return;
			}

			const { touches, changedTouches } = e.originalEvent ?? e;
			const touch = typeof touches !== "undefined" ? touches[0] : null
        ?? typeof changedTouches !== "undefined" ? changedTouches[0] : null;
			const touchX = touch ? touch.pageX : e.clientX;
			const touchY = touch ? touch.pageY : e.clientY;

			tip.html(content);
			tip.css({
				top: Math.max(0, touchY + 20) + 'px',
				//left: Math.min(50, Math.max(0, touchX + 20)) + 'px'
        left: (touchX - (tip.outerWidth() / 2)) + 'px'
			});
			tip.show();

		});

    // Close tooltip when clicked outside
    $(document).on("click touchstart", function (event) {
      if (!$(event.target).closest('.tooltip, #tooltip').length) {
        $('#tooltip').hide();
      }
    });

	} else {
		$(".tooltip").live({
			mouseenter: function (e) {
				var tip = $('#tooltip');
				tip.html($(this).attr('data-tooltip-content'));
				tip.show();
			},
			mouseleave: function () {
				var tip = $('#tooltip');
				tip.hide();
			},
			mousemove: function (e) {
				var tip = $('#tooltip');
				var mousex = e.pageX + 20;
				var mousey = e.pageY + 20;
				var tipWidth = tip.width();
				var tipHeight = tip.height();
				var tipVisX = $(window).width() - (mousex + tipWidth);
				var tipVisY = $(window).height() - (mousey + tipHeight);
				if (tipVisX < 20) {
					mousex = e.pageX - tipWidth - 20;
				};
				if (tipVisY < 20) {
					mousey = e.pageY - tipHeight - 20;
				};
				tip.css({
					top: mousey,
					left: mousex
				});
			}
		});

		$(".tooltip_sticky").live('mouseenter', function (e) {
			e.preventDefault();
			e.stopImmediatePropagation();

			var tip = $('#tooltip');
			tip.html($(this).attr('data-tooltip-content'));
			tip.addClass('tooltip_sticky_div');
			tip.css({
				top: e.pageY - tip.outerHeight() / 2,
				left: e.pageX - tip.outerWidth() / 5
			});
			tip.show();
		});

		$(".tooltip_sticky_div").live('mouseleave', function (e) {
			e.preventDefault();
			e.stopImmediatePropagation();

			var tip = $('#tooltip');
			tip.removeClass('tooltip_sticky_div');
			tip.hide();
		});
	}
});
