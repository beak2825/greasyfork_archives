// ==UserScript==
// @name         Bell Fibe TV (Skip Forward)
// @version      0.1
// @description  Forcefully enable the skip forward button on Bell Fibe TV website
// @author       Fatr3d
// @include      https://tv.bell.ca/watch/*
// @icon         https://www.google.com/s2/favicons?domain=bell.ca
// @grant        none
// @require  	http://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js
// @namespace https://greasyfork.org/users/806731
// @downloadURL https://update.greasyfork.org/scripts/431119/Bell%20Fibe%20TV%20%28Skip%20Forward%29.user.js
// @updateURL https://update.greasyfork.org/scripts/431119/Bell%20Fibe%20TV%20%28Skip%20Forward%29.meta.js
// ==/UserScript==
this.$ = this.jQuery = jQuery.noConflict(true);

window.addEventListener('load', function() {
    $('#ember16').removeAttr('disabled');
    $('#ember16').removeAttr('style');
}, false)();