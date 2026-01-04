// ==UserScript==
// @name         Hook_cookie v0.2
// @namespace    https://github.com/0xsdeo/Hook_JS
// @version      2024-12-19
// @description  set cookie -> log stack and cookie
// @author       0xsdeo
// @match        http://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536971/Hook_cookie%20v02.user.js
// @updateURL https://update.greasyfork.org/scripts/536971/Hook_cookie%20v02.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let cookie_accessor = Object.getOwnPropertyDescriptor(Document.prototype,"cookie");
    let get_cookie = cookie_accessor.get;
    let set_cookie = cookie_accessor.set;

    Object.defineProperty(document, "cookie", {
        get: function () {
            return get_cookie.call(document);
        },
        set: function (cookie) {
            console.log(cookie);
            console.log(new Error().stack);

            set_cookie.call(document,cookie);
        }
    });
})();