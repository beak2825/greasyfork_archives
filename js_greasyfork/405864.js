// ==UserScript==
// @name         Open Douban Link Directly
// @namespace    https://www.douban.com/people/MoNoMilky/
// @version      0.2
// @description  Do not remind me of leaving Douban please, I know that...
// @match        https://*.douban.com/*
// @author       Bambooom
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405864/Open%20Douban%20Link%20Directly.user.js
// @updateURL https://update.greasyfork.org/scripts/405864/Open%20Douban%20Link%20Directly.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function contains(selector, text) {
        var elements = document.querySelectorAll(selector);
        return Array.prototype.filter.call(elements, function(element) {
            return RegExp(text).test(element.textContent);
        });
    }

    var links = contains('a', /^https:\/\/douc\.cc/);
    for (let link of links) {
        link.onclick = function(event) {
            var url = event.target.title;
            if (url) { // only with title, the shorten url may need to open directly
                event.preventDefault();
                window.open(url);
            }
        }
    }

    if (location.pathname === '/link2/') {
        var url = (new URL(location)).searchParams.get('url');
        window.location = url;
    }
})();