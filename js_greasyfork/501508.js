// ==UserScript==
// @name         Imgur Save to archive.is
// @namespace    http://tampermonkey.net/
// @version      2025-03-27
// @description  Save the imgur page to archive.is
// @author       hangjeff
// @match        https://imgur.com/a/*
// @match        https://imgur.com/*
// @match        https://imgur.com/gallery/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.7.1.slim.min.js
// @downloadURL https://update.greasyfork.org/scripts/501508/Imgur%20Save%20to%20archiveis.user.js
// @updateURL https://update.greasyfork.org/scripts/501508/Imgur%20Save%20to%20archiveis.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    let Imgur_Url = window.location.href;
    console.log(Imgur_Url);

    let Bootstrap = $('<link>', {
        href: 'https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css',
        rel: 'stylesheet'
    }).appendTo('head');

    $('body').css('background-color', '#171544');

    let form = $('<form>', {
        id: 'submiturl',
        action: 'https://archive.is/submit/',
        method: 'GET',
        target: '_blank',
        class: 'row justify-content-center'
    });

    form.append(
        $('<input>', {
            id: 'url',
            type: 'hidden',
            name: 'url',
            value: Imgur_Url
        })
    );

    form.append(
        $('<input>', {
            type: 'submit',
            value: 'Save to archive.is',
            tabindex: '1',
            class: 'btn btn-primary col-1'
        })
    );
    $('body').prepend(form);
})();