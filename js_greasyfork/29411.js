// ==UserScript==
// @name         HDRezka Unrestricted
// @namespace    lainscripts_hdr_unr
// @version      0.3
// @description  Attempts to enable access to country-restricted video.
// @author       lainverse
// @match        *://hdrezka.me/*
// @run-at       document-start
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/29411/HDRezka%20Unrestricted.user.js
// @updateURL https://update.greasyfork.org/scripts/29411/HDRezka%20Unrestricted.meta.js
// ==/UserScript==
(function() {
    'use strict';
    let setTo = '0', attName = 'data-restricted',
        _hasAttribute = Element.prototype.hasAttribute,
        _setAttribute = Element.prototype.setAttribute;
    function applyUnrestrict(node) {
        if (_hasAttribute.call(node, attName)) {
            _setAttribute.call(node, attName, setTo);
        }
        if (node.classList.contains('active')) {
            node.classList.remove('active');
            node.click();
        }
    }
    function unsetRestricted(scope) {
        for (let node of scope.querySelectorAll('['+attName+']:not(['+attName+'="'+setTo+'"]')) {
            applyUnrestrict(node);
        }
    }
    document.addEventListener('DOMContentLoaded', function(){
        unsetRestricted(document.body);
    });
    (new MutationObserver(function(ms){
        for (let m of ms) {
            for (let node of m.removedNodes) {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    console.log('r', node);
                }
            }
            for (let node of m.addedNodes) {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    console.log('a', node);
                    if (node.tagName === 'LI') {
                        applyUnrestrict(node);
                    }
                    if (node.tagName === 'UL') {
                        unsetRestricted(node);
                    }
                }
            }
        }
    })).observe(document, {subtree: true, childList: true});
})();