// ==UserScript==
// @name         GC - Grumpy Old King
// @version      0.2
// @description  Autofill the avatar joke for both Skarl and Hagan
// @author       wibreth
// @match        https://www.grundos.cafe/medieval/grumpyoldking*
// @match        https://www.grundos.cafe/medieval/wiseking*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        none
// @namespace https://greasyfork.org/users/319295
// @downloadURL https://update.greasyfork.org/scripts/464848/GC%20-%20Grumpy%20Old%20King.user.js
// @updateURL https://update.greasyfork.org/scripts/464848/GC%20-%20Grumpy%20Old%20King.meta.js
// ==/UserScript==

(function() {
    'use strict';
    /* globals $:false */

    $('document').ready( function() {
        generateJoke();
        $('#question1').val('What');
        $('#question2').val('do');
        $('#question3').val('you do if');
        $('#question4').val('*Leave blank*');
        $('#question5').val('fierce');
        $('#question6').val('Grundos');
        $('#question7').val('*Leave blank*');
        $('#question8').val('has eaten too much');
        $('#question9').val('*Leave blank*');
        $('#question10').val('tin of olives');
        $('#wisdom6').val('nugget');
    });
})();