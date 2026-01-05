// ==UserScript==
// @name        Autocomplete Enabler
// @description Enables autocompletion on most websites.
// @version     1.3
// @namespace   http://www.studiopomyslow.com
// @include     http://*
// @include     https://*
// @exclude     https://e-bank.credit-agricole.pl/*
// @exclude     https://moj.raiffeisenpolbank.com/*
// @exclude     https://online.t-mobilebankowe.pl/*
// @exclude     https://ebank.db-pbc.pl/*
// @exclude     https://online.mbank.pl/*
// @copyright   2013+, Dawid Ciecierski
// @downloadURL https://update.greasyfork.org/scripts/17404/Autocomplete%20Enabler.user.js
// @updateURL https://update.greasyfork.org/scripts/17404/Autocomplete%20Enabler.meta.js
// ==/UserScript==

var forms = document.getElementsByTagName('form');
for (var f = 0; f < forms.length; f++) {
    forms[f].autocomplete = 'on';
}

var inputs = document.getElementsByTagName('input');
for (var i = 0; i < inputs.length; i++) {
    var input = inputs[i];
    var type = input.type.toLowerCase();
    if (type == 'text' || type == 'password') {
        input.autocomplete = 'on';
    }
}
