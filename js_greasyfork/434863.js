// ==UserScript==
// @name         Washington Post Paywall remover
// @version      0.0.2
// @author       pp
// @description  Remove startup paywall window
// @include      https://www.washingtonpost.com/*
// @grant none
// @license MIT
// @namespace https://greasyfork.org/users/814032
// @downloadURL https://update.greasyfork.org/scripts/434863/Washington%20Post%20Paywall%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/434863/Washington%20Post%20Paywall%20remover.meta.js
// ==/UserScript==

(function() {
	'use strict';

	var WPPR = {

		mutas: function(m) {
			if (m.type == 'attributes' && m.target.tagName == 'BODY') {
				m.target.style.overflow = 'auto';
			}
          
          	if (m.type == 'childList') {
                m.addedNodes.forEach(function(node) {
                    if (node.tagName == 'DIV' && node.id.match(/paywall\-intl\-*/)) {
                        node.parentNode.removeChild(node);
                        console.log('WP Paywall removed');
                    }
                });
            }
   		},
		run: function() {

			var observer = new MutationObserver(function(mutations) {
				return mutations.forEach(WPPR.mutas);
			});

			observer.observe(document.querySelector('body'), {
				childList: true,
				subtree: true,
				attributes: true,
				characterData: false
			});

			setTimeout(function() {
				observer.disconnect();
			}, 2000);
		}
	};

	WPPR.run();

})();
