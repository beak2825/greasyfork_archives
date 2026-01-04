// ==UserScript==
// @name         Spring Doc Index Fixed
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  fixed spring doc index column
// @author       wdzxc
// @match        https://docs.spring.io/spring/docs*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/32706/Spring%20Doc%20Index%20Fixed.user.js
// @updateURL https://update.greasyfork.org/scripts/32706/Spring%20Doc%20Index%20Fixed.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    var el = document.createElement("style");
    el.innerHTML = ".toc{position: fixed;\n" +
        "width: 500px;\n" +
        "background-color: #f2f2f2;\n" +
        "top: 0;\n" +
        "left: 0;\n" +
        "height: 100vh;\n" +
        "overflow: auto;}" +
        "div.part,.book>.titlepage{ margin-left: 520px;}div.book{max-width:initial;min-width:initial;}";
    document.body.appendChild(el);
    
})();