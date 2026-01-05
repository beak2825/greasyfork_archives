// ==UserScript==
// @name         Now News Adblock Fix
// @namespace    now.com
// @version      0.1
// @description  Fix broken page of Now News when adblock is enabled
// @author       lacek
// @include      http://*.now.com*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/21281/Now%20News%20Adblock%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/21281/Now%20News%20Adblock%20Fix.meta.js
// ==/UserScript==

(function() {
    // from https://gist.github.com/nylen/6234717
    function inject(src, callback) {
        if (typeof callback != 'function') callback = function() { };

        var el;

        if (typeof src != 'function' && /\.css[^\.]*$/.test(src)) {
            el      = document.createElement('link');
            el.type = 'text/css';
            el.rel  = 'stylesheet';
            el.href = src;
        } else {
            el      = document.createElement('script');
            el.type = 'text/javascript';
        }

        el.class = 'injected';

        if (typeof src == 'function') {
            el.appendChild(document.createTextNode('(' + src + ')();'));
            callback();
        } else {
            el.src   = src;
            el.async = false;
            el.onreadystatechange = el.onload = function() {
                var state = el.readyState;
                if (!callback.done && (!state || /loaded|complete/.test(state))) {
                    callback.done = true;
                    callback();
                }
            };
        }

        var head = document.head || document.getElementsByTagName('head')[0];
        head.insertBefore(el, head.lastChild);
    }

    inject(function () {
        var noop = function() {};
		var event = {
			Type: {
				ADS_MANAGER_LOADED: null,
				AD_ERROR: null,
			}
		};
		window.google = {
			ima: {
				AdDisplayContainer: function() {
					this.initialize = noop;
				},
				AdsLoader: function() {
					this.addEventListener = noop;
					this.requestAds = noop;
				},
				AdsManagerLoadedEvent: event,
				AdErrorEvent: event,
				AdsRequest: noop
			}
		};
    });
})();