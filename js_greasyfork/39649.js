// ==UserScript==
// @name         MyFigureCollection: style thingy and date input
// @namespace    https://myfigurecollection.net/profile/darkfader
// @version      0.2
// @description  Also switches item info to Japanese
// @author       Rafael Vuijk
// //@require      http://code.jquery.com/jquery-latest.js
// @match        http*://myfigurecollection.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/39649/MyFigureCollection%3A%20style%20thingy%20and%20date%20input.user.js
// @updateURL https://update.greasyfork.org/scripts/39649/MyFigureCollection%3A%20style%20thingy%20and%20date%20input.meta.js
// ==/UserScript==

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

$(document).ready(function() {
    'use strict';

    var ex = "";

    addGlobalStyle('.form-label { font-variant: normal !important; }');
    addGlobalStyle('.item-object .item-entry.important { font-weight: normal !important; }');
    addGlobalStyle('.form .form-field { padding: 2px 2px 2px 2px  !important; }');
    addGlobalStyle('h1.ellipsis { max-width: 100% !important; text-overflow: initial !important; }');
    addGlobalStyle('div.date-chooser { display: none; }');

    var todo = false;

    var toggleEventHandler = function(event) {
        //console.log("click");
        todo = true;

        // change date input to text field
        $('input.tbx-date').each(function() {
            if ($(this).attr('type') != 'text') {
                console.log('date to text');
                $(this).attr('type', 'text');
                todo = false;
            }
        });

        // check (after loading) if it worked (must have had date fields)
        setTimeout(function() {
            // after toggling, the links may need to have event added again?
            $('a.toggle').each(function() {
                this.addEventListener('click', toggleEventHandler);
            });

            // did it work?
            if (todo) {
                toggleEventHandler(null);
                //console.log("retry");
            } else {
                //console.log("done");
            }
        }, 500);
    };

    var windowEventHandler = function(event) {
        console.log("start!");
        toggleEventHandler(null);
    };

    $('.tbx-window').each(function() {
        this.addEventListener('click', windowEventHandler);
    });

    // Japanese
    $('a.item-switch-alphabet').click();

    $('div.error').each(function() {
        $(this).prop('style', 'display: none');
    });
    $('a.over18').each(function() {
        $(this).prop('style', 'display: none');
    });
    $('div.tbx-toggle-target').each(function() {
        $(this).prop('style', '');
    });
});
