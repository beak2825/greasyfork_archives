// ==UserScript==
// @name         Base64 unicode support
// @namespace    https://greasyfork.org/users/471937
// @version      0.1
// @description  Wraps atob & btoa functions for unicode conversions
// @author       YukkuriC
// @match        */*
// @icon         https://screeps.com/a/icon.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420000/Base64%20unicode%20support.user.js
// @updateURL https://update.greasyfork.org/scripts/420000/Base64%20unicode%20support.meta.js
// ==/UserScript==

(function () {
    'use strict';

    decorator(window, 'atob', func => b64 => decodeURIComponent(escape(func(b64))))
    decorator(window, 'btoa', func => data => func(unescape(encodeURIComponent(data))))

    function decorator(obj, key, deco) {
        var func = obj[key]
        if (func.deco_mark) return
        var alt_func = deco(func),
            res = function (data) {
                try {
                    return func(data)
                } catch (e) {
                    return alt_func(data)
                }
            }
        res.deco_mark = true
        obj[key] = res
    }
})();