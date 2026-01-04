// ==UserScript==
// @name      5'Spotters
// @version      1.2
// @description Does stuff
// @author     JKS
// @icon       https://i.imgur.com/YAadD6h.png
// @include    https://jobspotter.indeed.com*
// @require    https://code.jquery.com/jquery-3.1.1.min.js
// @grant        none
// @namespace https://greasyfork.org/users/164486
// @downloadURL https://update.greasyfork.org/scripts/371834/5%27Spotters.user.js
// @updateURL https://update.greasyfork.org/scripts/371834/5%27Spotters.meta.js
// ==/UserScript==


window.focus()
window.onkeydown = function (event) {
    if(event.which == 81){                                                                                           //q--not english
        document.querySelector('#input-language-no').click()}
    if(event.which == 97){                                                                                           // numpad 1 -- all good
        document.querySelector('#input-is-hiring-sign-yes').click();
        document.querySelector('#content > div > div:nth-child(1) > div > div:nth-child(5) > div.form-container > div:nth-child(2) > div:nth-child(2) > div:nth-child(3) > input').focus()}
    if(event.which == 98){                                                                                           // numpad 2 -- bad store
        document.querySelector('#input-is-hiring-sign-no').click();
        document.querySelector('#content > div > div:nth-child(1) > div > div:nth-child(5) > div.form-container > div:nth-child(2) > div:nth-child(2) > div:nth-child(3) > input').focus()}
    if(event.which == 13){                                                                                            // enter submits
        document.querySelector(`#content > div > div.submit-button-container > button`).click();}
    if(event.which == 101){                                                                                            // numpad 5 focus to textbox
        document.querySelector('#content > div > div:nth-child(1) > div > div:nth-child(5) > div.form-container > div:nth-child(2) > div:nth-child(2) > div:nth-child(3) > input').focus();}
};
