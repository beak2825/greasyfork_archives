// ==UserScript==
// @name         [opennet.ru] text normalizer
// @namespace    MaxLevs
// @version      0.1
// @description  Теперь ты можешь прочитать, что там все-таки написано.
// @author       MaxLevs
// @match        https://*.opennet.ru/*
// @match        http://*.opennet.ru/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/32692/%5Bopennetru%5D%20text%20normalizer.user.js
// @updateURL https://update.greasyfork.org/scripts/32692/%5Bopennetru%5D%20text%20normalizer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var elem, article = document.getElementsByTagName("font");
    for(var item of article) {
        if (item.size == 1){
            elem = item;
            break;
        }
    }
    elem.size = 3;
})();