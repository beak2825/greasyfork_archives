// ==UserScript==
// @name         myitmo changer
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  myitmo zach changer
// @author       You
// @match        http://my.itmo.ru/points*
// @match        https://my.itmo.ru/points*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/475943/myitmo%20changer.user.js
// @updateURL https://update.greasyfork.org/scripts/475943/myitmo%20changer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener('load', (event) => {
    var els = document.querySelectorAll("text, p[class='list-item__bold m-0 mb-3']");
    els.forEach(function(elem) {
        if (elem.textContent.toString().includes('6')) {
            return;
        }
        if (elem.textContent.toString().includes('4')) {
            elem.textContent = '45';
            elem.previousElementSibling.setAttribute("stroke", "#00A911");
        }
        if (elem.textContent.toString().includes('10')) {
            elem.textContent = '38';
            elem.previousElementSibling.setAttribute("stroke", "#00A911");
        }
    });
    els = document.querySelectorAll("button[class='list-item__grade list-item__grade_bad']");
    var flag = false;
    els.forEach(function(elem) {
        if (!flag) {
            flag = true;
            return;
        }
        elem.setAttribute("class", "list-item__grade list-item__grade_good");
        elem.textContent = "зачет";
    });
});
})();