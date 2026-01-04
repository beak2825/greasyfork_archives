// ==UserScript==
// @name         Select All Items
// @namespace    shade.selectall.cartelempire.online
// @version      1.0
// @description  Select all items when selling to NPCs
// @author       SHADE [4740]
// @match        https://cartelempire.online/Town/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cartelempire.online
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/503774/Select%20All%20Items.user.js
// @updateURL https://update.greasyfork.org/scripts/503774/Select%20All%20Items.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $("h2:contains('Sell Items')").html('Sell Items <a id="select_all" class="btn btn-sm btn-primary float-end" href="javascript:void(0);">Select All</a><a id="unselect_all" class="btn btn-sm btn-secondary float-end d-none" href="javascript:void(0);">Unselect All</a>');

    let selectAll = $("a#select_all");
    let unselectAll = $("a#unselect_all");
    let inputs = $(".collapse .itemQuantityInput");
    if ($(window).width() >= 992 ){
        inputs = $("div:visible>.input-group .itemQuantityInput");
    }

    selectAll.on('click', function(){
        let found = false;
        inputs.each(function() {
            if ($(this).attr("cost")) {
                $(this).val($(this).attr('max')).change();
                found = true;
            }
        });

        if(found == true) {
            selectAll.addClass('d-none');
            unselectAll.removeClass("d-none");
        }
    });

    unselectAll.on('click', function(){
        inputs.each(function() {
            if ($(this).attr("cost")) {
                $(this).val($(this).attr('min')).change();
            }
        });

        unselectAll.addClass('d-none');
        selectAll.removeClass("d-none");
    });
})();