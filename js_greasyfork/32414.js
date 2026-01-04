// ==UserScript==
// @name         Politics Reporter
// @version      1.0
// @description  Pozwala zgłosić znalezisko bez tagu #polityka
// @author       Dreszczyk
// @match        https://www.wykop.pl/*
// @grant        none
// @namespace https://greasyfork.org/users/29486
// @downloadURL https://update.greasyfork.org/scripts/32414/Politics%20Reporter.user.js
// @updateURL https://update.greasyfork.org/scripts/32414/Politics%20Reporter.meta.js
// ==/UserScript==

const runPoliticsReporter = () => {

    window.reportPolitics = (id) => {
        // https://www.wykop.pl/ajax/violations/form/link/3877561
        $.ajax({
            method: "GET",
            url: "https://www.wykop.pl/ajax/violations/form/link/" + id,
        }).done(function( data ) {
            const returnForm = $(data.html).find('form')[0];
            const actionURL = $(returnForm).attr('action');
            const tags = $(returnForm).find('#reason35').attr('data-extravalue') + ' #polityka';
            const violation = {
                'violation[reason]': '35',
                'violation[info]': tags,
                'violation[object_type]': 'link',
                'violation[object_id]': id,
            };
            $.ajax({
                type: "POST",
                url: actionURL,
                data: $.param(violation),
            }).done(function(data) {
                // callback hell ;(
                const button = $('.reportButton' + id);
                if(data[0] === true) {
                    button.text('OK!');
                } else {
                    button.text('Błąd');
                }
            });
        });
    };

    console.log('1.0');
    const linksList = document.querySelectorAll("#itemsStream .link.iC > .article.dC:not(.empty-media)");

    linksList.forEach((link) => {
        const buttonHandle = link.querySelectorAll('time');
        if(buttonHandle.length) {
            const linkID = link.getAttribute('data-id');
            buttonHandle[0].insertAdjacentHTML('afterend', '<span class="tag affect create reportButton' + linkID + '" onClick="reportPolitics(' + linkID + ');" style="margin-left: 20px; border: 1px solid rgba(100, 100, 100, 0.3);">brak tagu #polityka</span>');
        }
    });
};

runPoliticsReporter();