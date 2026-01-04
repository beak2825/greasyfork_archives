// ==UserScript==
// @name         DLsite filter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  filter dlsite result by type
// @author       Oscar0159
// @match        https://www.dlsite.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dlsite.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/469670/DLsite%20filter.user.js
// @updateURL https://update.greasyfork.org/scripts/469670/DLsite%20filter.meta.js
// ==/UserScript==

var block_list = ['漫畫', '單篇', '單行本', 'CG・插畫', '雜誌/精選集', '聲音作品・ASMR', '小說'];

// 隱藏的透明度
var opacity = "15%";

// 是否刪除元素
var delete_element = false;

(function() {
    'use strict';

    window.onload = function() {
        var hasElement = document.querySelector(".work_category");
        if (hasElement) {
            main();
        }
    }

    function main(){
        var block_elements = document.querySelectorAll('.work_category');

        block_elements.forEach(function(element) {
            var text = element.querySelector('a').textContent;
            // check if the text is in the block list
            if (block_list.indexOf(text) > -1) {
                // hide the element
                element.parentNode.parentNode.style.opacity = opacity;

                if (delete_element) {
                    // delete the element
                    element.parentNode.parentNode.parentNode.remove();
                }
            }
        });
    }
})();