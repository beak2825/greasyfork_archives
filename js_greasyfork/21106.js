// ==UserScript==
// @name         RTHK Adblock Fix
// @namespace    rthk.hk
// @version      0.1.1
// @description  Fix broken page of RTHK when adblock is enabled
// @author       lacek
// @include      http://rthk.hk*
// @include      http://*.rthk.hk/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/21106/RTHK%20Adblock%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/21106/RTHK%20Adblock%20Fix.meta.js
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
        window.WebTrends = function() {
            this.dcsGetId = noop;
            this.dcsCollect = noop;
        };
        window.dcsMultiTrack = noop;
    });
})();