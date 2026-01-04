// ==UserScript==
// @name         Krunker.io nametags
// @namespace    https://krunker.io/social.html?p=profile&q=MrLaugh
// @version      v3.3.1
// @author       MrLaugh
// @match        https://krunker.io/*
// @grant        none
// @description  Krunker.io nametags hack v3.3.1
// @downloadURL https://update.greasyfork.org/scripts/416463/Krunkerio%20nametags.user.js
// @updateURL https://update.greasyfork.org/scripts/416463/Krunkerio%20nametags.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function hook_join(wnd) {
        const array_join = wnd.Array.prototype.join;
        wnd.Array.prototype.join = new Proxy(array_join, {
            apply: function(target, _this, _arguments) {
                var ret = Function.prototype.apply.apply(target, [_this, _arguments]);
                if (_arguments.length && _arguments[0] == '' && _this.length > 1000) {
                    var game_js = ret;
                    game_js = game_js.replace(/(if\(!\w+\['\w+'\]\)conti)nue;/, '/*$1*/'); // esp whilst keeping same script length
                    return game_js;
                }
                return ret;
            }
        });
    }

    const append_child = HTMLBodyElement.prototype.appendChild;
    HTMLBodyElement.prototype.appendChild = new Proxy(append_child, {
        apply: function(target, _this, _arguments) {
            var ret = Function.prototype.apply.apply(target, [_this, _arguments]);
            if (_arguments.length && _arguments[0].__proto__ == HTMLIFrameElement.prototype) {
                hook_join(_arguments[0].contentWindow);
            }
            return ret;
        }
    });
})();