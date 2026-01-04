// ==UserScript==
// @name         Bunpro: Disable Backspace Undo
// @namespace    http://tampermonkey.net/
// @version      1.0.6
// @description  Disables the backspace functionality in reviews
// @author       Kumirei
// @include      *bunpro.jp/*
// @exclude      *community.bunpro.jp*
// @require      https://greasyfork.org/scripts/370623-bunpro-helpful-events/code/Bunpro:%20Helpful%20Events.js?version=974369
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396170/Bunpro%3A%20Disable%20Backspace%20Undo.user.js
// @updateURL https://update.greasyfork.org/scripts/396170/Bunpro%3A%20Disable%20Backspace%20Undo.meta.js
// ==/UserScript==

(function() {
    var $ = window.$;
    $('html')[0].addEventListener('quiz-page', ()=>{
        var input_elem = $('#study-answer-input');
        $('body').keydown((event)=>{
            var colors = input_elem.css('background-color').match(/\d+/g);
            var sum = colors.reduce((a, b)=>Number(a)+Number(b));
            var redness = colors[0]/sum;
            if (event.keyCode == 8 && redness > 0.4) {
                event.stopPropagation();
                input_elem.blur();
            }
        });
    });
})();
