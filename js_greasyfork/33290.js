// ==UserScript==
// @name         Jenkins - Better select boxes
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  enlarge & sort selects
// @author       You
// @match        https://jenkins.niji.fr/**
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/33290/Jenkins%20-%20Better%20select%20boxes.user.js
// @updateURL https://update.greasyfork.org/scripts/33290/Jenkins%20-%20Better%20select%20boxes.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('bsb - better select box for jenkins init');

    var selects = document.querySelectorAll('select.select');
    selects.forEach(function(select) {
        select.style.height = '400px';
        select.addEventListener('mouseover', function() {
            if (select.classList.contains('bsb-sorted') || select.children.length <= 1) {
                return;
            } else {
                select.classList.add('bsb-sorted');
            }
            console.log('bsb - sorting select options');
            var html = '';
            select.childElements()
                .sort(function(a,b) {
                return a.text == b.text ? 0 : a.text < b.text ? -1 : 1;
            })
                .forEach(function(el) { html += el.outerHTML;});
            select.innerHTML = html;
        });
    });

})();