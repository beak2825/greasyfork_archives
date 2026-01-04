// ==UserScript==
// @name         Hook cookie
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  dddd
// @author       You
// @match        http://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/459583/Hook%20cookie.user.js
// @updateURL https://update.greasyfork.org/scripts/459583/Hook%20cookie.meta.js
// ==/UserScript==

(function(k) {
    'use strict';
    var cookie_cache = document.cookie
    Object.defineProperty(document, 'cookie', {
        get(){
            return cookie_cache;
        },
        set(val) {
            prettyLog('监测到通过js set cookie: ', val);
            prettyLog('当前cookie', cookie_cache);
            if (val.indexOf(k) != -1) {
                debugger;
            }
            var cookie = val.split(";")[0];
            var ncookie = cookie.split("=");
            var hasKey = false;
            var cache = cookie_cache ? cookie_cache.split("; ") : [];
            cache = cache.map(function (a) {
                if (a.split("=")[0] === ncookie[0]) {
                    hasKey = true;
                    return cookie;
                }
                return a;
            })
            if (!hasKey) {
                cache.push(cookie)
            }
            cookie_cache = cache.join("; ");
            return cookie_cache;
        }
    })
    function prettyLog(label, content) {
        var a = '5px';
        var d = '#fff';
        var p = '#3498db';
        var m = 'RGB(33,125,187)';
        var h = 'RGB(212,233,247)';
        console.log("%c".concat(label, "%c").concat(content), "\npadding: 2px 5px;\nborder-radius: ".concat(a, " 0 0 ").concat(a, ";\ncolor: ").concat(d, ";\nbackground:").concat(p, "\n"), "\npadding: 2px 5px;\nborder-radius: 0 ".concat(a, " ").concat(a, " 0;\ncolor: ").concat(m, ";\nbackground: ").concat(h, ";\n"))
    }
})('=');