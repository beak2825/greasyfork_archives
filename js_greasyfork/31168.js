// ==UserScript==
// @name         Memrise Dynamic Font for Kanji v3
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Force the Memrise website to change font dynamicly in choice boxes.
// @author       superpawko
// @match        *://www.memrise.com/course/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/31168/Memrise%20Dynamic%20Font%20for%20Kanji%20v3.user.js
// @updateURL https://update.greasyfork.org/scripts/31168/Memrise%20Dynamic%20Font%20for%20Kanji%20v3.meta.js
// ==/UserScript==

// Add some fancy fonts first.
function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}
addGlobalStyle('@import url("https://fonts.googleapis.com/css?family=Lato|Playfair+Display")');



$(document).ready(function() {
    MEMRISE.garden.boxes.load = (function() {
        var cached_function = MEMRISE.garden.boxes.load;
        return function() {
            MEMRISE.garden.boxes.activate_box = (function() {
                var cached_function = MEMRISE.garden.boxes.activate_box;
                return function() {
                    var result = cached_function.apply(this, arguments);

                    $("#boxes > div > ol > li").each(function( index ) {

                        var $index = index + 1;
                        var $quote = $("#boxes > div > ol > li:nth-child("+ $index +") > span.val");
                        var $questionTrimed = $.trim($quote.text());
                        var $numWords = $questionTrimed.split(" ").length;

                        var $questionCharNum = $questionTrimed.length;
                        var qsize = (3.3 - Math.sqrt($questionCharNum) * 0.4) * (1.2 - $numWords * 0.1); // Function for text size in REM
                        //console.log("------------ FONT CHANGED");
                        //console.log("idx: " + index + " qtrimmed: " + $questionTrimed + " qtrimmedLENGTH: " + $questionCharNum + " numWords: " + $numWords + " ftsize: " + qsize);

                        if (($numWords <= 4) && ($questionCharNum < 28)) {

                            $("#boxes > div > ol > li:nth-child(" + $index + ") > span.val").css({
                                fontSize: qsize +"rem",
                                'line-height': qsize +"rem"
                            });
                        } else {
                            $("#boxes > div > ol > li").css({
                                'float': 'left',
                                'width': '570px'
                            });
                        }

                        return result;

                    });
                };
            }());

            return cached_function.apply(this, arguments);
        };
    }());
});
