// ==UserScript==
// @name        AmiAmi filter
// @author      DaLimCodes
// @namespace   https://greasyfork.org/en/users/76021-bootresha
// @description Filter for AmiAmi, only for current gallery page of items
// @include     http://*.amiami.com/*
// @include     http://amiami.com/*
// @version     1.2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/24760/AmiAmi%20filter.user.js
// @updateURL https://update.greasyfork.org/scripts/24760/AmiAmi%20filter.meta.js
// ==/UserScript==

// <TODO>
// 1. Save selected option
// 2. OPTIONAL. Maybe make it even bigger by preloading more than 200 results
// </TODO>

$(document).ready(function () {
    addFilterButtonDiv();
    reformatOriginalTable();
});

function reformatOriginalTable(){
    var itemArray = [  ];
    var preorderArray = [  ];
    var backorderArray = [  ];
    var outofstockArray = [  ];
    var instockArray = [  ];
    var rereleaseArray = [  ];
    var table = $('.product_table tbody');
    var tableRowLength = table.children().length;

    // Copy each entry from the displayed table to an array, to be processed later
    for (i = 1; i <= tableRowLength; i++) {
        itemArray.push($('.product_table tbody tr:nth-child(' + i + ') td:nth-child(1)'));
        itemArray.push($('.product_table tbody tr:nth-child(' + i + ') td:nth-child(2)'));
    }

    // Remove the original table
    $('.product_table').remove();

    // Move each item to their respective array
    for (i = 0; i < itemArray.length; i++) {
        if (itemArray[i].children('.product_ul').children('.product_icon').children('.icon_preorder').length > 0) {
            preorderArray.push(itemArray[i]);
        } else if (itemArray[i].children('.product_ul').children('.product_icon').children('.icon_re_release').length > 0) {
            rereleaseArray.push(itemArray[i]);
        } else if (itemArray[i].children('.product_ul').children('.product_icon').children('.icon_backorder').length > 0) {
            backorderArray.push(itemArray[i]);
        } else if (itemArray[i].children('.product_ul').children('.product_day').text() == 'Sold out') {
            outofstockArray.push(itemArray[i]);
        } else {
            instockArray.push(itemArray[i]);
        }
    }

    // Attach new table to the right section of the page
    var newISTable = '<table id="tableInStock"></table>';
    var newPOTable = '<table id="tablePreOrder"></table>';
    var newRPOTable = '<table id="tableRereleasePreOrder"></table>';
    var newBOTable = '<table id="tableBackOrder"></table>';
    var newOOSTable = '<table id="tableOutOfStock"></table>';
    if ($('#search_table').length ){
        $('#search_table').append(newISTable);
        $('#search_table').append(newPOTable);
        $('#search_table').append(newRPOTable);
        $('#search_table').append(newBOTable);
        $('#search_table').append(newOOSTable);
    } else {
        $(newISTable).insertAfter('.heading_11');
        $(newPOTable).insertAfter('#tableInStock');
        $(newRPOTable).insertAfter('#tablePreOrder');
        $(newBOTable).insertAfter('#tableRereleasePreOrder');
        $(newOOSTable).insertAfter('#tableBackOrder');
    }

    // Populate each table with their respective data
    $('#tableInStock').append('<tr><td class="tableHeader">In Stock Section</td></tr>');
    $('#tableInStock').css('background-color', 'LightGreen');
    for (i = 0; i < instockArray.length; i += 2) {
        $('#tableInStock').append('<tr id="ISRow' + i + '"></tr>');
        $('#ISRow' + i + '').append(instockArray[i]);
        $('#ISRow' + i + '').append(instockArray[i + 1]);
    }
    $('#tablePreOrder').append('<tr><td class="tableHeader">Pre-Order Section</td></tr>');
    $('#tablePreOrder').css('background-color', 'NavajoWhite');
    for (i = 0; i < preorderArray.length; i += 2) {
        $('#tablePreOrder').append('<tr id="PORow' + i + '"></tr>');
        $('#PORow' + i + '').append(preorderArray[i]);
        $('#PORow' + i + '').append(preorderArray[i + 1]);
    }
    $('#tableRereleasePreOrder').append('<tr><td class="tableHeader">Re-Release Pre-Order Section</td></tr>');
    $('#tableRereleasePreOrder').css('background-color', 'Gold');
    for (i = 0; i < rereleaseArray.length; i += 2) {
        $('#tableRereleasePreOrder').append('<tr id="RPORow' + i + '"></tr>');
        $('#RPORow' + i + '').append(rereleaseArray[i]);
        $('#RPORow' + i + '').append(rereleaseArray[i + 1]);
    }
    $('#tableBackOrder').append('<tr><td class="tableHeader">Back Order Section</td></tr>');
    $('#tableBackOrder').css('background-color', 'Plum');
    for (i = 0; i < backorderArray.length; i += 2) {
        $('#tableBackOrder').append('<tr id="BORow' + i + '"></tr>');
        $('#BORow' + i + '').append(backorderArray[i]);
        $('#BORow' + i + '').append(backorderArray[i + 1]);
    }
    $('#tableOutOfStock').append('<tr><td class="tableHeader">Out of Stock Section</td></tr>');
    $('#tableOutOfStock').css('background-color', 'LightCoral');
    for (i = 0; i < outofstockArray.length; i += 2) {
        $('#tableOutOfStock').append('<tr id="OOSRow' + i + '"></tr>');
        $('#OOSRow' + i + '').append(outofstockArray[i]);
        $('#OOSRow' + i + '').append(outofstockArray[i + 1]);
    }
    $('.tableHeader').css("font-weight","bold");
}

function addFilterButtonDiv() {
    var fixedDiv = '<div class="fixedDivArea">Filters: </div>';
    var buttonPreorder = '<br><button class="filterButton" id="buttonPO">Hide pre-order items';
    var buttonBackorder = '<br><button class="filterButton" id="buttonBO">Hide backorder items';
    var buttonOutOfStock = '<br><button class="filterButton" id="buttonOOS">Hide out of stock items';
    $('body').append(fixedDiv);
    $('.fixedDivArea').append(buttonPreorder);
    $('.fixedDivArea').append(buttonBackorder);
    $('.fixedDivArea').append(buttonOutOfStock);
    $('.fixedDivArea').css({
        'position': 'fixed',
        'top': '0',
        'right': '0',
        'width': '200',
        'height': '100',
        'align': 'right',
        'background-color': 'yellow'
    });
    $('#buttonPO').click(function () {
        if ($('#buttonPO').text() == 'Hide pre-order items') {
            $('#tablePreOrder').hide();
            $('#tableRereleasePreOrder').hide();
            $('#buttonPO').text('Show pre-order items');
        } else {
            $('#tablePreOrder').show();
            $('#tableRereleasePreOrder').show();
            $('#buttonPO').text('Hide pre-order items');
        }
    });
    $('#buttonBO').click(function () {
        if ($('#buttonBO').text() == 'Hide backorder items') {
            $('#tableBackOrder').hide();
            $('#buttonBO').text('Show backorder items');
        } else {
            $('#tableBackOrder').show();
            $('#buttonBO').text('Hide backorder items');
        }
    });
    $('#buttonOOS').click(function () {
        if ($('#buttonOOS').text() == 'Hide out of stock items') {
            $('#tableOutOfStock').hide();
            $('#buttonOOS').text('Show out of stock items');
        } else {
            $('#tableOutOfStock').show();
            $('#buttonOOS').text('Hide out of stock items');
        }
    });
}
