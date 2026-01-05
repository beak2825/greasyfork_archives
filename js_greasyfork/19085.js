// ==UserScript==
// @name        Alldatasheet.com: Decrapify and move search results to top
// @description Move search to top, remove questionably-useful inventory and distributor search, remove gratuitous line breaks.
// @namespace   giferrari.net
// @include     http://*.alldatasheet.com/*
// @version     2
// @grant       none
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.6/jquery.js
// @downloadURL https://update.greasyfork.org/scripts/19085/Alldatasheetcom%3A%20Decrapify%20and%20move%20search%20results%20to%20top.user.js
// @updateURL https://update.greasyfork.org/scripts/19085/Alldatasheetcom%3A%20Decrapify%20and%20move%20search%20results%20to%20top.meta.js
// ==/UserScript==

// Of note: almost every darn thing on this page is wrapped in its own table.
// They went really overboard here... even the headers are their own tables.
// This is why there's a bunch of .closest('table') going on.

// *** Remove gratuitous line breaks. ***
$('body br').remove();

// *** Prevent gratuitous new windows
$('[target="_blank"]').prop('target', '');

// *** Remove the inventory sections ***.

// Hide the headers.
var inventoryHeaders = $('.h2view:contains("Inventory")').closest('table');
inventoryHeaders.hide();
//Now hide the actual inventory tables.
inventoryHeaders.next('table').hide();
// Since we only have one section remaining, hide the header for the real datasheet section.
$('.h2view:contains(" Datasheets")').closest('table').hide();


// *** Move the datasheet results to the top ***
// Easy way is to move the search refinement box down to where the link share box is.

// Find some bits of the DOM we need.
var datasheetResultsHeader = $('td:contains("Search ")').closest('table');
var datasheetResults = datasheetResultsHeader.next('table');

var searchRefinementBox = $('#tdnews').closest('table');
var linkBox = $('form[name="Linkurl"]').closest('table');

// Move the search refinement box down by the link share box at the bottom.
linkBox.prev().before(searchRefinementBox);

$('#layer1').remove();
$('#abc').remove(); // Yes, there's a random DIV with an ID of abc. Nix.

// Get rid of manufacturer noise
var manufacturersHeaderTable = $('td b').filter(function() { return $(this).text().endsWith(' Manufacturer'); }).closest('table');
manufacturersHeaderTable.next('table').remove();
manufacturersHeaderTable.remove();

$('.h2view:contains(" Distributor")').closest('table').remove();
