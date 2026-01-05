// ==UserScript==
// @name         Bierdopje Move
// @namespace    http://www.bierdopje.com
// @version      1.1
// @description  Allows you to move and position the blocks on the homepage.
// @match        http://*.bierdopje.com/
// @grant        unsafeWindow
// @require      http://code.jquery.com/jquery-1.10.2.js
// @require      http://code.jquery.com/ui/1.11.4/jquery-ui.js
// @author       Tom
// @copyright    2016+, Tom
// @downloadURL https://update.greasyfork.org/scripts/23762/Bierdopje%20Move.user.js
// @updateURL https://update.greasyfork.org/scripts/23762/Bierdopje%20Move.meta.js
// ==/UserScript==
/* jshint -W097 */
/* global $, console */
'use strict';

$(function() {
    // Change cursor on block headers
    $(".header").css('cursor', 'pointer');

    // Fix position of the billboard.
    const billboardStyle = {
        position: "relative",
        top:      "5px",
        left:     "15px"
    };
    $("#billboards").css(billboardStyle);

    // Identify and add appropriate classes to the columns and blocks.
    const col1 = $("#col1");
    const col2 = $("#col2");

    col1.addClass("sortable1");
    col2.addClass("sortable2");

    // Find each block and add their state + make them serializable.
    $('.sortable1 .block').each((i, obj) => {
        $(obj).addClass("ui-state-default");
        $(obj).attr('id', "i_" + (i+1));
    });
    $('.sortable2 .block').each((j, obj) => {
        $(obj).addClass("ui-state-default");
        $(obj).attr('id', "j_" + (j+1));
    });

    // Load the blocks collapse state.
    var collapsedBlocks = getCollapsedBlocks();
    restoreCollapsedBlocks(collapsedBlocks);

    // Load the blocks in the right order.
    restoreOrder();

    col1.addClass("connectedSortable");
    col2.addClass("connectedSortable");

    // Collapsing feature
    $('.sortable1 > .block > .header').click(function() {
        collapseFeature($(this));

        return false;
    });
    $('.sortable2 > .block > .header').click(function() {
        collapseFeature($(this));

        return false;
    });

    function collapseFeature(me) {
        var body = me.next();
        var blockId = me.parent().attr("id");

        body.slideToggle("slow", function() {
            if (body.is(":hidden")) {
                collapsedBlocks.push(blockId);
                console.log("hiddenarray: " + collapsedBlocks);
            } else {
                collapsedBlocks = deleteFromArrayByValue(collapsedBlocks, blockId);
                console.log("visiblearray: " + collapsedBlocks);
            }

            const jsonValue = JSON.stringify(collapsedBlocks);
            localStorage.setItem("collapsedBlocks", jsonValue);
        });
    }

    function getCollapsedBlocks() {
        const collapsedBlocks = localStorage.getItem("collapsedBlocks");

        if (collapsedBlocks == null) {
            console.log("Found no collapsedBlocks.");
            return [];
        }

        console.log("Found data in collapsedBlocks: " + collapsedBlocks);
        return JSON.parse(collapsedBlocks);
    }

    function restoreCollapsedBlocks(cBlocks) {
        for (let i = 0; i < cBlocks.length; i++) {
            var target = document.getElementById(cBlocks[i]);
            $(target).children(".body").hide();
        }
    }

    function deleteFromArrayByValue(array, value) {
        // todo?:
        // https://api.jquery.com/jQuery.inArray/
        var i = array.length;
        while (i--) {
            if (array[i] === value) {
                array.splice(i, 1);
            }
        }

        return array;
    }

    // Actual sorting.
    $(".sortable1, .sortable2").sortable({
        connectWith: ".connectedSortable",
        cursor:    "move",
        handle:    ".block_title",
        items :    ".ui-state-default",
        update: function (event, ui) {
            var cooked1 = [];
            var cooked2 = [];
            $(".sortable1").each(function(index, domEle) {
                    cooked1[index] = $(domEle).sortable('toArray', {key: 'i', attribute: 'id'});
                }
            );
            $(".sortable2").each(function(index, domEle) {
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
        if (!order1 || !order2) return;

        console.log("order1: " + order1);
        console.log("order2: " + order2);

        var SavedID1 = order1.split('|');
        var SavedID2 = order2.split('|');

        for (let u = 0, ul=SavedID1.length; u < ul; u++) {
            SavedID1[u] = SavedID1[u].split(',');
        }
        for (let u = 0, ul=SavedID2.length; u < ul; u++) {
            SavedID2[u] = SavedID2[u].split(',');
        }
        for (let Scolumn = 0, n = SavedID1.length; Scolumn < n; Scolumn++) {
            for (let Sitem = 0, m = SavedID1[Scolumn].length; Sitem < m; Sitem++) {
                console.log(" checking first column " + SavedID1[Scolumn][Sitem]);

                if (SavedID1[Scolumn][Sitem].indexOf("i") >= 0) {
                    console.log("found i");
                    $(".sortable1").eq(Scolumn).append($(".sortable1").children("#" + SavedID1[Scolumn][Sitem]));
                } else {
                    console.log("found j (other column)");
                    $(".sortable1").eq(Scolumn).append($(".sortable2").children("#" + SavedID1[Scolumn][Sitem]));
                }
            }
        }
        for (let Scolumn = 0, n = SavedID2.length; Scolumn < n; Scolumn++) {
            for (let Sitem = 0, m = SavedID2[Scolumn].length; Sitem < m; Sitem++) {
                console.log(" checking second column " + SavedID2[Scolumn][Sitem]);

                if (SavedID2[Scolumn][Sitem].indexOf("i") >= 0) {
                    console.log("found i (other column)");
                    $(".sortable2").eq(Scolumn).append($(".sortable1").children("#" + SavedID2[Scolumn][Sitem]));
                } else {
                    console.log("found j");
                    $(".sortable2").eq(Scolumn).append($(".sortable2").children("#" + SavedID2[Scolumn][Sitem]));
                }
            }
        }
    }
});