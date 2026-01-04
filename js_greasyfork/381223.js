// ==UserScript==
// @name         123
// @description  1234
// @include      *://vk.com/*
// @include      *://*.vk.com/*
// @include      *://*.vk.me/*
// @version      1.0
// @author       rzakirov99 (vk.com/rzakirov99)
// @grant        none
// @namespace https://greasyfork.org/users/287876
// @downloadURL https://update.greasyfork.org/scripts/381223/123.user.js
// @updateURL https://update.greasyfork.org/scripts/381223/123.meta.js
// ==/UserScript==


function radmije() {
    var je = document.getElementsByClassName("footer");
    var buttonName = '.Разморозить.Страницу.'
    var text = new RegExp(buttonName, 'mi');
    for (var i = 0; i < je.length; i++) {
        if (je[i].getAttribute('vfx') != 'true') {
            je[i].setAttribute('vfx', 'true');
            if (text.test(je[i].innerHTML) == true) {
                je[i].parentNode.parentNode.parentNode.setAttribute('style', 'display: none;');
            }
        }
    }
}
setInterval(radmije, 1);