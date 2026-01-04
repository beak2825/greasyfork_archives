// ==UserScript==
// @name    Mangakatana Left/Right Arrow Key Chapter Navigation
// @author  derickmj
// @version 1.00
// @description Left and Right keyboard arrow key navigation to the previous or next chapter in the manga
// @grant   none
// @include /^https?:\/\/(?:www\.)?(mangakatana\.com)(?:.*)$/
// @namespace https://greasyfork.org/users/417388
// @downloadURL https://update.greasyfork.org/scripts/393727/Mangakatana%20LeftRight%20Arrow%20Key%20Chapter%20Navigation.user.js
// @updateURL https://update.greasyfork.org/scripts/393727/Mangakatana%20LeftRight%20Arrow%20Key%20Chapter%20Navigation.meta.js
// ==/UserScript==
(function() {
    'use strict';
    document.addEventListener("keyup", function(event) {
        const previous = document.querySelector('.next'),
        next = document.querySelector('.prev');
        if (event.keyCode == 39 && previous !== null) {
            previous.click()
        } else if(event.keyCode == 37 && next !== null) {
            next.click()
        }
    })
})();