// ==UserScript==
// @name         AdSkipper
// @namespace    http://adfly-skipper.blogspot.com
// @version      1.0
// @run-at       document-start
// @description  Skip adf.ly urls
// @author       StoreClerk
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38328/AdSkipper.user.js
// @updateURL https://update.greasyfork.org/scripts/38328/AdSkipper.meta.js
// ==/UserScript==

// AdF.ly skipper script
var code = `
Object.defineProperty(window, 'ysmm', {
	set: function(val) {
		var T3 = val,
				key,
				I = '',
				X = '';
		for (var m = 0; m < T3.length; m++) {
			if (m % 2 == 0) {
				I += T3.charAt(m);
			} else {
				X = T3.charAt(m) + X;
			}
		}
		T3 = I + X;
		var U = T3.split('');
		for (var m = 0; m < U.length; m++) {
			if (!isNaN(U[m])) {
				for (var R = m + 1; R < U.length; R++) {
					if (!isNaN(U[R])) {
						var S = U[m]^U[R];
						if (S < 10) {
							U[m] = S;
						}
						m = R;
						R = U.length;
					}
				}
			}
		}
		T3 = U.join('');
		T3 = window.atob(T3);
		T3 = T3.substring(T3.length - (T3.length - 16));
		T3 = T3.substring(0, T3.length - 16);
		key = T3;
		if (key && (key.indexOf('http://') === 0 || key.indexOf("https://") === 0)) {
			document.write('<!--');
			window.stop();

			window.onbeforeunload = null;
			window.location = key;
		}
	}
});
`;

// Only use the script for HTML webpages
if (document instanceof HTMLDocument) {
	// Insert the AdF.ly skipper script
	var script = document.createElement('script');
	script.textContent = code;
	document.documentElement.appendChild(script);
}