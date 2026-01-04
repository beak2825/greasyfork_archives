// ==UserScript==
// @name         yiyeting
// @version      1.7
// @description  一夜听
// @author       examplecode
// @match        m.yiyeting/*
// @run-at       document-start
// @require      https://cdn.jsdelivr.net/npm/jquery@2.1.4/dist/jquery.min.js
// @license       xxx
// @namespace https://greasyfork.org/users/889747
// @downloadURL https://update.greasyfork.org/scripts/488065/yiyeting.user.js
// @updateURL https://update.greasyfork.org/scripts/488065/yiyeting.meta.js
// ==/UserScript==
 


var navigator = window.navigator;
    var modifiedNavigator;
    if ('userAgent' in Navigator.prototype) {
        // Chrome 43+ moved all properties from navigator to the prototype,
        // so we have to modify the prototype instead of navigator.
        modifiedNavigator = Navigator.prototype;

    } else {
        // Chrome 42- defined the property on navigator.
        modifiedNavigator = Object.create(navigator);
        Object.defineProperty(window, 'navigator', {
            value: modifiedNavigator,
            configurable: false,
            enumerable: false,
            writable: false
        });
    }
    // Pretend to be Windows XP
    Object.defineProperties(modifiedNavigator, {
        userAgent: {
            value: 'mozilla/5.0 (linux; u; android 4.1.2; zh-cn; mi-one plus build/jzo54k) applewebkit/534.30 (khtml, like gecko) version/4.0 mobile safari/534.30 micromessenger/5.0.1.352',
            configurable: false,
            enumerable: true,
            writable: false
        },
        appVersion: {
            value: 'mozilla/5.0 (linux; u; android 4.1.2; zh-cn; mi-one plus build/jzo54k) applewebkit/534.30 (khtml, like gecko) version/4.0 mobile safari/534.30 micromessenger/5.0.1.352',
            configurable: false,
            enumerable: true,
            writable: false
        }
    });

