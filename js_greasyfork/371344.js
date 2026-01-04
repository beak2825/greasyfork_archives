// ==UserScript==
// @name      **JobSpotter2
// @version      1.3
// @description Does stuff
// @author     JKS
// @icon       https://i.imgur.com/YAadD6h.png
// @include    https://jobspotter.indeed.com*
// @require    https://code.jquery.com/jquery-3.1.1.min.js
// @grant        none
// @namespace https://greasyfork.org/users/164486
// @downloadURL https://update.greasyfork.org/scripts/371344/%2A%2AJobSpotter2.user.js
// @updateURL https://update.greasyfork.org/scripts/371344/%2A%2AJobSpotter2.meta.js
// ==/UserScript==


window.focus()
window.onkeydown = function (event) {
    if(event.which == 32){                                                                                           //spacebar --not english
        document.querySelector('#input-language-no').click()}
    if(event.which == 49){                                                                                           // numpad 1 -- all good
        document.querySelector('#input-clear-photo-yes').click()
        document.querySelector('#input-recognizable-people-hirign-sign-no').click()
        document.querySelector('#input-predicted-store-name-yes').click()
        document.querySelector('#input-recognizable-people-storefront-no').click();}
    if(event.which == 50){                                                                                           // numpad 2 -- bad store
        document.querySelector('#input-clear-photo-yes').click()
        document.querySelector('#input-recognizable-people-hirign-sign-no').click()
        document.querySelector(`#input-predicted-store-name-no`).click()
        document.querySelector('#input-recognizable-people-storefront-no').click();}
    if(event.which == 51){                                                                                           // numpad 3 -- bad sign
        document.querySelector('#input-clear-photo-no').click()
        document.querySelector('#input-recognizable-people-hirign-sign-no').click()
        document.querySelector(`#input-predicted-store-name-yes`).click()
        document.querySelector('#input-recognizable-people-storefront-no').click();}
    if(event.which == 52){                                                                                           // numpad 4 -- all bad
        document.querySelector('#input-clear-photo-no').click()
        document.querySelector('#input-recognizable-people-hirign-sign-no').click()
        document.querySelector(`#input-predicted-store-name-no`).click()
        document.querySelector('#input-recognizable-people-storefront-no').click();}
    if(event.which == 13){                                                                                            // enter submits
        document.querySelector(`#content > div > div.submit-button-container > button`).click();}

};