// ==UserScript==
// @name         Unity Learn - Deprecated Block Remover
// @namespace    https://greasyfork.org/en/users/10118-drhouse
// @version      1.1
// @description  allows user to view deprecated lessons that are otherwise blocked
// @include      https://learn.unity.com/*
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @author       drhouse
// @license      CC-BY-NC-SA-4.0
// @icon         https://www.google.com/s2/favicons?domain=learn.unity.com
// @downloadURL https://update.greasyfork.org/scripts/437281/Unity%20Learn%20-%20Deprecated%20Block%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/437281/Unity%20Learn%20-%20Deprecated%20Block%20Remover.meta.js
// ==/UserScript==
this.$ = this.jQuery = jQuery.noConflict(true);
var $ = window.$;

jQuery(function($){

    setTimeout(function(){
        $("div.backdrop_1t7ADNYQ").remove()
        $("div.modal_1VeXxnkx.pc_6ce9b5Un > div").remove()
    }, 3000); 


});