// ==UserScript==
// @name         object_setDefault
// @namespace    bo.gd.an[at]rambler.ru
// @version      0.5
// @description  If object does not have key, add it.
// @author       Bogudan
// @license      LGPLv3
// ==/UserScript==

(function () {
    function setDefault (key, value) {
        if (!(key in this))
            this [key] = value;
        }
    Object.defineProperty (Object.prototype, 'setDefault', {
        get : () => setDefault,
        set : () => {},
        });
    }) ();