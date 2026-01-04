// ==UserScript==
// @name         DevTools Anti-Detector
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Simple tool to temporarily prevent site from using popular methods of DevTools detection. Do not leave enabled!
// @author       lainverse
// @match        *://*/*
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/41559/DevTools%20Anti-Detector.user.js
// @updateURL https://update.greasyfork.org/scripts/41559/DevTools%20Anti-Detector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let knownRoots = new WeakSet();
    function wrapRegExp(root) {
        if (knownRoots.has(root))
            return;
        let _proto = void 0;
        try {
            _proto = root.RegExp.prototype;
        } catch(ignore) {
            return;
        }
        // Prevent RegExpt + toString trick (technically possible with any other object, but I encountered only this one
        let _RE_tS = Object.getOwnPropertyDescriptor(_proto, 'toString');
        let _RE_tSV = _RE_tS.value || _RE_tS.get();
        let fts = Function.prototype.toString;
        Object.defineProperty(_proto, 'toString', {
            enumerable: _RE_tS.enumerable,
            configurable: _RE_tS.configurable,
            get: () => _RE_tSV,
            set: function(val) {
                console.warn('Attempt to change toString for', this, 'with', fts.call(val));
                //throw 'stop it!';
                return true;
            }
        });
    }

    wrapRegExp(unsafeWindow);

    let _contentWindow = Object.getOwnPropertyDescriptor(HTMLIFrameElement.prototype, 'contentWindow');
    let _get_contentWindow = _contentWindow.get;
    _contentWindow.get = function() {
        let _cw = _get_contentWindow.apply(this, arguments);
        if (_cw)
            wrapRegExp(_cw);
        return _cw;
    };
    Object.defineProperty(HTMLIFrameElement.prototype, 'contentWindow', _contentWindow);
})();