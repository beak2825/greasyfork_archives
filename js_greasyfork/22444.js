// ==UserScript==
// @name           Anti-Disabler
// @namespace      https://greasyfork.org/ro/scripts/22444-anti-disabler / http://userscripts-mirror.org/scripts/review/30096
// @description    Restore context menus on sites that try to disable them
// @include        http://*
// @include        https://*
// @exclude        http://*.google.com/*
// @exclude        https://*.google.com/*
// @exclude        http://*.youtube.com/*
// @exclude        http://youtube.com/*
// @exclude        https://*.youtube.com/*
// @exclude        https://youtube.com/*
// @exclude        http://*.facebook.com/*
// @exclude        https://*.facebook.com/*
// @exclude        http://userscripts.org/*
// @exclude        https://userscripts.org/*
// @exclude        http://*.deviantart.com/*
// @exclude        http://www.jslint.com/*
// @exclude        https://www.jslint.com/*
// @exclude        file:///*/perf.html*
// @exclude        http://ninjakiwi.com/*
// @exclude        https://ninjakiwi.com/*
// @exclude        http://jsfiddle.net/*
// @exclude        https://jsfiddle.net/*
// @exclude        http://*.wikipedia.org/*
// @exclude        https://*.wikipedia.org/*
// @require        https://greasyfork.org/scripts/22443-joesimmons-library/code/JoeSimmons'%20Library.js
// @copyright      JoeSimmons & Mark Pilgrim
// @version        1.1.3
// @run-at         document-start
// @downloadURL https://update.greasyfork.org/scripts/22444/Anti-Disabler.user.js
// @updateURL https://update.greasyfork.org/scripts/22444/Anti-Disabler.meta.js
// ==/UserScript==

/* CHANGELOG

1.1.3 (3/20/2014)
    - fixed a variable reference error
    - made the event blacklist regex case-insensitive

1.1.2 (3/19/2014)
    - changed include to http and https protocols only

*/



(function () {

    'use strict';

    // Anti-Disabler modified by Joe Simmons
    /*
    Other mild credit:
        absurdlyobfuscated
        Jeroenz0r
        rinopo_d
    */

    var events_blacklist = [
            'onmousedown',
            'onmouseup',
            'oncontextmenu',
            'oncopy',
            'onselectstart',
            'onselect',
            'ondragstart',
            'ondrag',
            'ondragenter',
            'ondragleave',
            'ondragover',
            'ondrop',
            'ondragend'
        ],
        rEventBlacklist = new RegExp( events_blacklist.join('|').replace(/^on/g, ''), 'i' ),
        oldAEL, win;

    // unwraps the element so we can use its methods freely
    function unwrap(elem) {
        if (elem) {
            if (typeof XPCNativeWrapper === 'function' && typeof XPCNativeWrapper.unwrap === 'function') {
                return XPCNativeWrapper.unwrap(elem);
            } else if (elem.wrappedJSObject) {
                return elem.wrappedJSObject;
            }
        }

        return elem;
    }

    win = unwrap(window);

    // don't let blacklisted events get added by addEventListener
    oldAEL = win.Element.prototype.addEventListener; // store a reference to the original addEventListener
    win.Element.prototype.addEventListener = function () {
        if ( !rEventBlacklist.test(name) ) {
            return oldAEL.apply(this, arguments);
        }
    };

    // remove other listeners when the page loads
    JSL.runAt('interactive', function (event) {
        var all = document.getElementsByTagName('*'),
            doc = win.document,
            body = win.document.body,
            isPrototype = typeof doc.observe === 'function' && typeof doc.stopObserving === 'function',
            len, e, i, jQall, jQdoc; 

        events_blacklist.forEach(function (event) {
            doc[event] = null;
            body.removeAttribute(event);
            if (isPrototype === true) {
                doc.stopObserving(event); // disable Prototype observation
            }
        });

        // Disabling of specific elements
        for (i = 0, len = all.length; i < len; i += 1) {

            e = unwrap( all[i] );

            events_blacklist.forEach(function (event) {
                e[event] = null;
                e.removeAttribute(event);
            });

            if (e.style.MozUserSelect === 'none') {
                e.style.MozUserSelect = 'text';
            }

        }

        // Disabling by jQuery
        if (typeof win.$ === 'function' && typeof win.$.prototype.unbind === 'function') {
            jQall = win.$('*');
            jQdoc = win.$(doc);
            events_blacklist.forEach(function (event) {
                jQall.unbind(event);
                jQdoc.unbind(event);
            });
        }

        if (typeof win.jQuery === 'function' && typeof win.jQuery.prototype.unbind === 'function') {
            win.jQuery(win).unbind('keypress'); // Remove keyboard blocking - comment line out if you don't want it
        }

        if (typeof win.ProtectImg !== 'undefined') {
            win.ProtectImg = function () {
                return true;
            };
        }
    });

}());