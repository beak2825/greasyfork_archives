// ==UserScript==
// @name         Seriesfeed Move
// @namespace    https://www.seriesfeed.com
// @version      1.2
// @description  Allows you to move and position the cards on the homepage.
// @match        https://www.seriesfeed.com/
// @grant        unsafeWindow
// @require      https://code.jquery.com/jquery-3.2.1.min.js
// @require      https://code.jquery.com/ui/1.12.0/jquery-ui.min.js
// @author       Tom
// @copyright    2016+, Tom
// @downloadURL https://update.greasyfork.org/scripts/23766/Seriesfeed%20Move.user.js
// @updateURL https://update.greasyfork.org/scripts/23766/Seriesfeed%20Move.meta.js
// ==/UserScript==
/* jshint -W097 */
/* global $, console */
'use strict';

$(function() {
    // Identify the columns.
    const col1 = $(".row .col-md-6:eq(0)");
    const col2 = $(".row .col-md-6:eq(1)");

    // Add appropriate classes to the columns.
    col1.addClass("sortable1");
    col2.addClass("sortable2");

    // Make cards draggable to either column.
    col1.addClass("connectedSortable");
    col2.addClass("connectedSortable");

    // Find each card and add their state + make them serializable.
    $('.sortable1 > div').each((i, obj) => {
        addSortableData($(obj), 'i', i);
    });
    $('.sortable2 > div').each((i, obj) => {
        addSortableData($(obj), 'j', i);
    });

    function addSortableData(item, type, num) {
        item.addClass("ui-state-default");
		item.css({
			'border': '0px' // Revert border from JQuery UI
		});
        item.attr('id', type + "_" + (num+1));
        const cardContent = item.find('.blog-left');
        cardContent.prepend('<div class="handle" />');
        item.find('.handle').css({
            'padding-bottom': '75px',
            'height': '80px',
            'position': 'absolute',
            'left': '0',
            'right': '0'
        });
    }

    // Load the cards in the right order.
    restoreOrder();

    // Change cursor on card's handle.
    $(".handle").css('cursor', 'move');

    // Actual sorting.
    $(".sortable1, .sortable2").sortable({
        connectWith: ".connectedSortable",
        handle: '.handle',
        revert: true,
        cursor: "move",
        update: function (event, ui) {
            const cooked1 = [];
            const cooked2 = [];
            $(".sortable1").each((index, domEle) => {
                    cooked1[index] = $(domEle).sortable('toArray', {key: 'i', attribute: 'id'});
                }
            );
            $(".sortable2").each((index, domEle) => {
                    cooked2[index] = $(domEle).sortable('toArray', {key: 'j', attribute: 'id'});
                }
            );
            localStorage.setItem("blockOrder1", cooked1.join('|'));
            localStorage.setItem("blockOrder2", cooked2.join('|'));
        }
    });

    function restoreOrder() {
        const order1 = localStorage.getItem("blockOrder1");
        const order2 = localStorage.getItem("blockOrder2");
        if (!order1 || !order2) {
            return;
        }

        const SavedID1 = order1.split('|');
        const SavedID2 = order2.split('|');

        for (let u = 0, ul=SavedID1.length; u < ul; u++) {
            SavedID1[u] = SavedID1[u].split(',');
        }
        for (let u = 0, ul=SavedID2.length; u < ul; u++) {
            SavedID2[u] = SavedID2[u].split(',');
        }
        for (let Scolumn = 0, n = SavedID1.length; Scolumn < n; Scolumn++) {
            for (let Sitem = 0, m = SavedID1[Scolumn].length; Sitem < m; Sitem++) {
                if (SavedID1[Scolumn][Sitem].indexOf("i") >= 0) {
                    $(".sortable1").eq(Scolumn).append($(".sortable1").children("#" + SavedID1[Scolumn][Sitem]));
                } else {
                    $(".sortable1").eq(Scolumn).append($(".sortable2").children("#" + SavedID1[Scolumn][Sitem]));
                }
            }
        }
        for (let Scolumn = 0, n = SavedID2.length; Scolumn < n; Scolumn++) {
            for (let Sitem = 0, m = SavedID2[Scolumn].length; Sitem < m; Sitem++) {
                if (SavedID2[Scolumn][Sitem].indexOf("i") >= 0) {
                    $(".sortable2").eq(Scolumn).append($(".sortable1").children("#" + SavedID2[Scolumn][Sitem]));
                } else {
                    $(".sortable2").eq(Scolumn).append($(".sortable2").children("#" + SavedID2[Scolumn][Sitem]));
                }
            }
        }
    }
});