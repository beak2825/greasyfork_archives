// ==UserScript==
// @name         myTV Pearl Adblock Fix
// @namespace    http://mytv.tvb.com
// @version      0.1
// @description  Fix playback of Pearl on myTV due to adblock
// @author       lacek
// @match        http://mytv.tvb.com/tc/live/pearl
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/22287/myTV%20Pearl%20Adblock%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/22287/myTV%20Pearl%20Adblock%20Fix.meta.js
// ==/UserScript==

(function() {
    'use strict';

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

    inject(function() {
        adsManager = {
            destroy: function() {
                var ad = document.getElementById('adContainer');
                ad.parentNode.removeChild(ad);
                callSLPlay();
            }
        };
    });
})();