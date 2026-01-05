// ==UserScript==
// @name         Copy Paste Bypasser By Pak Defndr
// @namespace    https://greasyfork.org/en/scripts/26476-copy-paste-bypasser
// @author       Pak Defndr
// @version      2.0.1
// @copyright    2017+, Pakdefndr
// @description  The userscript helps you to bypass the copy paste block until you solve the quiz.
// @run-at       document-start
// @include      http://quiz.vu.edu.pk*
// @include      https://quiz.vu.edu.pk*
// @require      https://greasyfork.org/scripts/26650-pakdefndr-library/code/Pakdefndr_Library.user.js
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/26476/Copy%20Paste%20Bypasser%20By%20Pak%20Defndr.user.js
// @updateURL https://update.greasyfork.org/scripts/26476/Copy%20Paste%20Bypasser%20By%20Pak%20Defndr.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $("body").unbind('contextmenu');
    $("body").unbind();
    var events_blacklist = [
            'onmousedown',
            'onmouseup',
            'oncontextmenu',
            'onselectstart',
            'ondragstart',
            'ondrag',
            'ondragenter',
            'ondragleave',
            'ondragover',
            'ondrop',
            'keydown',
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
    document.getElementsByTagName("body")[0].setAttribute("oncopy", "return true");
    document.getElementsByTagName("body")[0].setAttribute("oncut", "return true");
    document.getElementsByTagName("body")[0].setAttribute("onpaste", "return true");
    document.getElementsByTagName("body")[0].setAttribute("onkeypress", "null");
    document.getElementsByTagName("body")[0].setAttribute("onkeydown", "null");
    var elmLink = document.getElementById('txtQuestion');
    elmLink.removeAttribute('readonly');
    elmLink.removeAttribute('disabled');
    var elmLink1 = document.getElementById('lblAnswer0');
    elmLink1.removeAttribute('readonly');
    elmLink1.removeAttribute('disabled');
    var elmLink2 = document.getElementById('lblAnswer1');
    elmLink2.removeAttribute('readonly');
    elmLink2.removeAttribute('disabled');
    var elmLink3 = document.getElementById('lblAnswer2');
    elmLink3.removeAttribute('readonly');
    elmLink3.removeAttribute('disabled');
    var elmLink4 = document.getElementById('lblAnswer3');
    elmLink4.removeAttribute('readonly');
    elmLink4.removeAttribute('disabled');
    var elmLink5 = document.getElementById('lblAnswer4');
    elmLink5.removeAttribute('readonly');
    elmLink5.removeAttribute('disabled');
})();
