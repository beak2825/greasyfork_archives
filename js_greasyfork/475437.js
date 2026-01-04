// ==UserScript==
// @name         SweClike
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  More visible active like button
// @author       flashen
// @match        https://www.sweclockers.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sweclockers.c....
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/475437/SweClike.user.js
// @updateURL https://update.greasyfork.org/scripts/475437/SweClike.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var element = document.getElementsByClassName("like");

    for (var i = 0; i < element.length; i++) {
        element[i].addEventListener("click", buttonClick(i));
    }

    function buttonClick(i) {
        var isLiked = "";
        var isToggle = false;
        var isClassName = document.getElementsByClassName.bind(document);

        return function() {

            if (!isToggle) {

                isToggle = true;

                if (window.getComputedStyle(isClassName("like")[i].children[0]).getPropertyValue("fill") == "rgb(210, 96, 0)") {
                    isLiked = "rgb(210, 96, 0)";
                }

                isClassName('like')[i].setAttribute("style", "background-color: #546678 !important; color: #fff! important; border: 1px solid #424242 !important");
                isClassName('like')[i].children[0].setAttribute("style", "fill: #fff !important");
            } else {
                isToggle = false;

                if (isLiked == 'rgb(210, 96, 0)') {
                    isClassName('like')[i].setAttribute("style", "background-color: #f7f6f5 !important; color: #d26000 !important;");
                    isClassName('like')[i].children[0].setAttribute("style", "fill: #d26000 !important");
                } else {
                    isClassName('like')[i].setAttribute("style", "background-color: #f7f6f5 !important; color: dimgray !important;");
                    isClassName('like')[i].children[0].setAttribute("style", "fill: dimgray !important");
                }
            }
        };
    }
})();