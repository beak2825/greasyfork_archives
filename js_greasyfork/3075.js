// ==UserScript==
// @name        Pinterest Palooza
// @description Visit a Pin's source web site by clicking the Pin's thumbnail image. Easy peasy!
// @author      Corey Meredith
// @version     1.1.4
// @include     http://*pinterest.com/*
// @include     https://*pinterest.com/*
// @history     1.1.4 leveraging local navigation link for faster source article access
// @history     1.1.3 fixed script ... Pinterest changed a class name
// @history     1.1.2 only writing to new window for webkit before setting location
// @history     1.1.1 fixed pin selector
// @history     1.1.0 made entire pin image clickable
// @history     1.0.3 replaced loading text with throbber
// @history     1.0.2 moved code into IIFE
// @history     1.0.1 changed button from "Visit Source" to "Visit Site" and matched icon of same button on pin details page
// @history     1.0.0 initial release
// @namespace https://greasyfork.org/users/2306
// @downloadURL https://update.greasyfork.org/scripts/3075/Pinterest%20Palooza.user.js
// @updateURL https://update.greasyfork.org/scripts/3075/Pinterest%20Palooza.meta.js
// ==/UserScript==

(function () {
	function addVisitButton(e) {
        e.preventDefault();
		e.cancelBubble = true;

		var pin = this,
			buttonWrapperN = pin.getElementsByClassName('leftSideButtonsWrapper'),
			pinLinkN = pin.querySelectorAll('A.pinImageWrapper'),
            navLinkN = pin.querySelectorAll('A.NavigateButton');

		if (!buttonWrapperN.length || !pinLinkN.length)
			return;
			
		var buttonWrapper = buttonWrapperN[0],
			pinLink = pinLinkN[0];
			
		if (buttonWrapper.getElementsByClassName('sourceLaunchButton').length) // already wired up this pin
			return;


		var href = window.location.origin + pinLink.getAttribute('href'),
			btn = document.createElement('a');

		btn.style.cssText = 'display: inline-block; margin-left: 4px;';
		btn.className = 'rounded Button likeSmall btn hasText sourceLaunchButton';
		btn.innerHTML = '<span class="buttonText">...</span>';
		btn.setAttribute('title', 'View Pin Details Page');
		btn.href = pinLink.getAttribute('href');
		buttonWrapper.appendChild(btn);
		pinLink.setAttribute('data-original-href', pinLink.getAttribute('href'));
		pinLink.setAttribute('href', '#view');
        
        if (navLinkN.length) {
            var navLink = navLinkN[0],
                navHref = navLink.getAttribute('href');
			if (navHref && navHref.length)
                pinLink.setAttribute('data-href', navHref);
        }
        

		pinLink.addEventListener('click', function (e) {
			e.preventDefault();

			var pinLink = this,
				dataHref = pinLink.getAttribute('data-href');

			if (dataHref && dataHref.length) {
				if (dataHref == 'nolink')
					window.location = window.location.origin + pinLink.getAttribute('data-original-href');
				else
					window.open(dataHref);
			}
			else {
				var xhr = new XMLHttpRequest(),
					w = window.open();

				if (typeof navigator.webkitPersistentStorage === 'object' || /WebKit/.test(navigator.userAgent))
					w.document.write('<img style="position: fixed; top: 50%; left: 50%; margin: -12px 0 0 -110px;" title="Loading source page..." alt="Loading source page..." src="data:image/gif;base64,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" />');

				xhr.open('GET', href);
				xhr.onload = function () {
					var container = document.implementation.createHTMLDocument().documentElement;
					container.innerHTML = this.responseText;
					var sourceLinks = container.querySelectorAll('.richPinNameLink, .paddedPinLink');

					if (sourceLinks.length) {
						var sourceHref = sourceLinks[0].getAttribute('href');
						if (sourceHref && sourceHref.length) {
							pinLink.setAttribute('data-href', sourceHref);
							w.location = sourceHref;
						}
						else {
							pinLink.setAttribute('title', 'View Pin Details Page');
							pinLink.setAttribute('data-href', 'nolink');
							pinLink.className += ' no-link';
						}
					}
				}
				xhr.send();
			}

			return false;
		}, false);
	}

	function liveWrapper(selector, method) {
	    return function(e) {
	        var target = e.target,
	            ancestors = getAncestors(target),
	            i = 0,
	            l = ancestors.length,
	            elem;

	        while (i < l) {
	            elem = ancestors[i];
	            if (matches(elem, selector)) {
	                method.call(elem, e);
	                break;
	            }
	            i += 1;
	        }
	    };
	}

	function getAncestors(elm) {
	    var bucket = [];
	    do {
	        bucket[bucket.length] = elm;
	        elm = elm.parentNode;
	    } while (elm);
	    return bucket;
	}

	function matches(elm, selectors) {
	    var possibles = document.querySelectorAll(selectors),
	        i = possibles.length;
	    while (i) {
	        i -= 1;
	        if (elm === possibles[i])
	            return true;
	    }
	}

	function addStyle(style) {
		var head = document.getElementsByTagName('HEAD')[0],
			elementStyle = head.appendChild(document.createElement('style'));
		elementStyle.innerHTML = style;
	}

	addStyle('.Pin.summary .pinImageWrapper { cursor: pointer !important; } .Pin.summary .pinImageWrapper.no-link { cursor: zoom-in !important; }');
	document.addEventListener('mouseover', liveWrapper('.Pin', addVisitButton), false);
})();
