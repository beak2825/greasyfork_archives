// ==UserScript==
// @name         Udemy - Percentage of course completed
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  See how much of the course you have done as a percentage of the course.
// @author       Facu
// @license      MIT
// @match        https://www.udemy.com/course/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=udemy.com
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/467999/Udemy%20-%20Percentage%20of%20course%20completed.user.js
// @updateURL https://update.greasyfork.org/scripts/467999/Udemy%20-%20Percentage%20of%20course%20completed.meta.js
// ==/UserScript==

function init() {
    document.body.addEventListener('click', function(e) {
        var target = e.target;
        if (!target.closest('.option') && !target.classList.contains('popper-module--popper--2BpLn')) {
            var container = document.querySelector('div[data-purpose="progress-popover-text"]');

            var text = container.textContent;
            var text2 = text.split(" ");

            var hechas = parseInt(text2[0]);
            var total = parseInt(text2[2]);
            var porcentaje = hechas * 100 / total;

            var nuevoContenido = `<span class="ag_porcentaje"> ${Math.round(porcentaje)}%</span>`;

            if ($(container).children().length === 0) {
                $(container).append(nuevoContenido);
            } else {
                $(container).children().last().replaceWith(nuevoContenido);
            }

        }
    });
}

$( document ).ready(function() {
    init()
});
