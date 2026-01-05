// ==UserScript==
// @name mozaNaplo autocomplete
// @name:hu mozaNapló jelszómegjegyzés iskolafüggetlenül
// @namespace https://gist.github.com/gnanet
// @version 2017.03.12
// @description Reenables password autofill on mozaNaplo
// @description:hu mozaNapló jelszómegjegyzés újraengedélyezése, iskolától függetlenül
// @match https://*.mozanaplo.hu/*
// @author gna@r-us.hu
// @downloadURL https://update.greasyfork.org/scripts/28100/mozaNaplo%20autocomplete.user.js
// @updateURL https://update.greasyfork.org/scripts/28100/mozaNaplo%20autocomplete.meta.js
// ==/UserScript==


$(document).ready(function() {
    $("form#loginform").removeAttr('autocomplete');
    $("input:hidden[name=loginname]").remove();
});