// ==UserScript==
// @name         TrelloLess by zhuhang
// @namespace    https://greasyfork.org/en/users/200777
// @version      1.3
// @description  Remove unwanted Trello cosmetic stuffs. 1. Remove colon(:) character from badges in front-of-card (especially 'Custom Fields' Power-Up)
// @author       zhuhang.jasper
// @match        https://trello.com/b/*
// @match        https://trello.com/c/*
// @match        https://trello.com/1/boards/*
// @include      /^https:\/\/.*\.trello\.com\/b\/.*$/
// @include      /^https:\/\/.*\.trello\.com\/c\/.*$/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370846/TrelloLess%20by%20zhuhang.user.js
// @updateURL https://update.greasyfork.org/scripts/370846/TrelloLess%20by%20zhuhang.meta.js
// ==/UserScript==

// FN001 : Hide colon symbol from custom field badges in cards
$.fn.hideColonInBadge = function() {
    $('span .badge-text').each(function(){
        var newContent = $(this).html();
        newContent = newContent.replace(":","");
        newContent = newContent.replace("&lt;NONE&gt;","");
        newContent = newContent.replace("<NONE>","");
        $(this).html(newContent);
    });
}

/*** Event Appenders ***/
$.fn.bindEvents = function() {

    // FN001
    //$('div.window-wrapper > .dialog-close-button,div.window-wrapper > .js-close-window').off('click').on('click'
    $('div.window-overlay > div.window').on('hide', function(e) {
        if ($(this).is(':hidden')) {
            console.log('TrelloLess-FN001 event triggered');
            $.fn.hideColonInBadge();
        }
    });

}

/*** Startup Events ***/
$.fn.startUpTrigger = function() {

    // Bind Events On Modal
    /*$('div.window-overlay > div.window').off('show').on('show', function(e) {
        //console.log('triggering bindEvents()');
        $.fn.bindEvents();
    });*/

    // Add functions on startup here:
    $.fn.hideColonInBadge(); // FN001

}

/*** Main Body ***/
function main() {
    $.fn.bindEvents();
    $.fn.startUpTrigger();
}

// Enable CSS show/hide events listener
// src: https://gist.github.com/kairyou/4aaca43d1528d042fa4c
(function ($) {
    $.each(['show', 'hide', 'fadeOut', 'fadeIn'], function (i, ev) {
        var el = $.fn[ev];
        $.fn[ev] = function () {
            var result = el.apply(this, arguments);
            result.promise().done(function () {
                this.trigger(ev, [result]);
            })
            return result;
        };
    });
})(jQuery);

// A function that loads jQuery and calls a callback function when jQuery has finished loading
function addJQuery(callback) {
  var script = document.createElement("script");
  script.setAttribute("src", "//code.jquery.com/jquery-1.12.4.min.js");
  script.addEventListener('load', function() {
    var script = document.createElement("script");
    script.textContent = "window.jQ=jQuery.noConflict(true);(" + callback.toString() + ")();";
    document.body.appendChild(script);
  }, false);
  document.body.appendChild(script);
}

// Script jQuery Wrapper
(function() {
    'use strict';
    addJQuery(main);
})();