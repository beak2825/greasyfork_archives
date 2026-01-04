// ==UserScript==
// @name         Baidu Ad Fucker
// @description  Hide Baidu ads
// @version      0.1
// @namespace    https://greasyfork.org/users/209602
// @author       Nianyi Wang
// @match        */*
// @downloadURL https://update.greasyfork.org/scripts/373396/Baidu%20Ad%20Fucker.user.js
// @updateURL https://update.greasyfork.org/scripts/373396/Baidu%20Ad%20Fucker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var regex = /pos\.baidu\.com/;

    function fuck() {
        var iframes = Array.prototype.slice.call(document.getElementsByTagName('iframe'));
        iframes.forEach(function(iframe) {
            if(regex.exec(iframe.src) !== null) {
                var parent = iframe.parentNode;
                while(true) {
                    var _ = parent.parentNode;
                    var children = Array.prototype.slice.call(_.childNodes)
                        .filter(function(_) {
                            if(_.nodeType !== 1)
                                return false;
                            if(/^(?:script|link|span)$/i.exec(_.tagName))
                                return false;
                            return true;
                        });
                    if(children.length <= 1) {
                        parent = _;
                    } else {
                        break;
                    }
                }
                parent.outerHTML = '';
            }
        });
    };

    window.addEventListener('load', fuck);
    document.addEventListener('DOMContentLoaded', fuck);
    setTimeout(fuck, 100);
})();