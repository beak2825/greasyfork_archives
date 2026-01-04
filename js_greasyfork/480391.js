// ==UserScript==
// @name         meiyouad-phone
// @version      2.7
// @description  meiyouad-phone插件
// @author       examplecode
// @match        xstree.com/*
// @run-at       document-start
// @require      https://cdn.jsdelivr.net/npm/jquery@2.1.4/dist/jquery.min.js
// @license       xxx
// @namespace https://greasyfork.org/users/889747
// @downloadURL https://update.greasyfork.org/scripts/480391/meiyouad-phone.user.js
// @updateURL https://update.greasyfork.org/scripts/480391/meiyouad-phone.meta.js
// ==/UserScript==
 

setTimeout(() => {

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
            value: '  Mac Android xstree  Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Safari/605.1.15',
            configurable: false,
            enumerable: true,
            writable: false
        },
        appVersion: {
            value: '  Mac Android xstree  Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Safari/605.1.15',
            configurable: false,
            enumerable: true,
            writable: false
        }
    });

}, 10);