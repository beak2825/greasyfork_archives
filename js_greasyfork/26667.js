// ==UserScript==
// @name         dynalist-mac
// @description Show raw text on hover.
// @author       Ken
// @match        https://dynalist.io/*
// @version 0.0.1.20170119024132
// @namespace https://greasyfork.org/users/38539
// @downloadURL https://update.greasyfork.org/scripts/26667/dynalist-mac.user.js
// @updateURL https://update.greasyfork.org/scripts/26667/dynalist-mac.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(function() {
        var childrenInner = document.getElementsByClassName('is-contentRendered');
        for (var i = 0; i < childrenInner.length; i++) {
            var nodeSelf = childrenInner[i];
            var nodeContent = nodeSelf.children[4].children[0];
            nodeSelf.addEventListener('mouseenter', function(event) {
                event.target.className = event.target.className.replace(" is-contentRendered", "");
            });
            nodeSelf.addEventListener('mouseleave', function(event) {
                console.log('focused?', event.target.focused);
                if (!event.target.children[4].children[0].focused) {
                    event.target.className += " is-contentRendered";
                }
            });
            nodeContent.addEventListener('focusin', function(event) {
                console.log('focusin');
                event.target.focused = true;
            });
            nodeContent.addEventListener('focusout', function(event) {
                console.log('focusout');
                event.target.focused = false;
            });
        }
    }, 3000);
})();