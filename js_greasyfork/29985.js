// ==UserScript==
// @name         _Ex Add button Read in Pocket [getpocket.com]
// @version      0.2
// @namespace    132-421-129
// @description  add button "Read in Pocket" to panel
// @author       Vyacheslav Vasiliev
// @include      http://getpocket.com/a/*
// @include      https://getpocket.com/a/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/29985/_Ex%20Add%20button%20Read%20in%20Pocket%20%5Bgetpocketcom%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/29985/_Ex%20Add%20button%20Read%20in%20Pocket%20%5Bgetpocketcom%5D.meta.js
// ==/UserScript==


window.event_for_read_in_pocket = true;
$(document).on('DOMNodeInserted', function () {
    if(window.event_for_read_in_pocket){
        window.event_for_read_in_pocket = false;
        console.log('+ change');
        var tmp_button = '<a class="read_in_pocket" href="/a/read/%ID_PAGE%" target="_blank" style="\
            position: absolute;\
            padding: 5px 10px;\
            right: 2em;\
            bottom: 0.5em;\
            background-color: #a5a5a5;\
            color: white;\
            border-radius: 5px;\
            z-index: 999;\
            ">Read in Pocket</a>';
        $('.item_type_normal').not(':has(.read_in_pocket)').each(function (ind, elem) {
            var id_page = $(elem).attr('id').match(/\d+/);
            var q = $(elem).find('.item_content');
            if(q.length){
                $(q).append(tmp_button.replace('%ID_PAGE%', id_page));
            }
        });
        window.event_for_read_in_pocket = true;
    }
});