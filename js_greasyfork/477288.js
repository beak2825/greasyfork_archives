// ==UserScript==
// @name         GC Food Club Helper
// @namespace    https://greasyfork.org/en/users/1175371/
// @version      0.1
// @description  Moves the bet button above the form so you don't have to scroll when submitting someone else's bets.
// @author       sanjix
// @match        https://www.grundos.cafe/games/foodclub/bet/?bet*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/477288/GC%20Food%20Club%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/477288/GC%20Food%20Club%20Helper.meta.js
// ==/UserScript==

var form = document.querySelector('form[name="bet_form"]');
var betButton = document.querySelector('form[name="bet_form"] div.button-group');
form.prepend(betButton);