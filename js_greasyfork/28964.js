// ==UserScript==
// @name         airbnb search beautifier
// @namespace    https://github.com/docomoz/airbnb-beautifier
// @version      0.1
// @description  Makes search results map bigger for a better user experience
// @author       Maxim Berezkin
// @include      /^https?://(.+\.)?airbnb\.(\w{2-3}\.)?\w+\/.*$/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28964/airbnb%20search%20beautifier.user.js
// @updateURL https://update.greasyfork.org/scripts/28964/airbnb%20search%20beautifier.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var size = {
        map: '70%',
        panel: '30%'
    };

    function airbnb_beautify() {
        var path = window.location.pathname.substring(1);
        if(/^s\//.test(path)) {
            var element = document.getElementsByClassName('search-results-map');
            if(element.length) {
                element[0].parentNode.style.cssText = 'width: ' + size.map + ' !important';
                element[0].parentNode.previousSibling.style.cssText = 'width: ' + size.panel + ' !important';

                window.dispatchEvent(new Event('resize'));
                element = document.getElementsByClassName('gm-bundled-control');
                if(element.length) {
                    element[0].childNodes[0].style.cssText = 'position: absolute; top: 65px; left: 0px';
                }
            }
        }
    }

    window.onload = airbnb_beautify;
    window.addEventListener('click', function() {
        airbnb_beautify();
    }, false);
})();
