// ==UserScript==
// @name         AutoClose SDQL Tabs
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Invert SDQL Table for Killersports.com queries results
// @author       Swain Scheps
// @match        https://transition.killersports.com/query*
// @match        https://transition.killersports.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/497754/AutoClose%20SDQL%20Tabs.user.js
// @updateURL https://update.greasyfork.org/scripts/497754/AutoClose%20SDQL%20Tabs.meta.js
// ==/UserScript==
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// ==/UserScript==
/* global $ */
$(document).ready(function() {
    //You'll need to change the match statements when ks removes 'transition' from url
  console.log('SDQL Transition AutoCloser Script Started');
  var rows = $('#DT_Table tbody tr').get();
  var keepIt = false;
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time part to avoid comparison issues
  const tenDaysOut = new Date();
  tenDaysOut.setDate(today.getDate() + 10);//won't close tabs with games dated between today and 10 days out. (change 10 to whatever you want)
  rows.sort(function(a, b) {
    var dateTextA = $(a).children('td').first().text().trim();
    var dateTextB = $(b).children('td').first().text().trim();
  //  console.log('Date Text A:', dateTextA);
  //  console.log('Date Text B:', dateTextB);
    var A = new Date(dateTextA);
    var B = new Date(dateTextB);
  //  console.log('Parsed Date A:', A);
  //  console.log('Parsed Date B:', B);
    // Check for games today or soon
    let result = !isNaN(A.getTime()) && A >= today && A <= tenDaysOut;
  //  console.log('Result for A:', result);
    if (result) {
      keepIt = true;
     // console.log('Keep it set to true');
    }
    if (A < B) {
      return 1;
    }
    if (A > B) {
      return -1;
    }
    return 0;
  });
    //These'append' statements reverse the sort order of the table by date. Not needed on the new site
  $.each(rows, function(index, row) {
 // $('#DT_Table').children('tbody').append(row);
 //   console.log('Row appended');
  }
        );
  // Replace double 'and' with single 'and'
  $('form').on('submit', function(e) {
    var inputField = $(this).find('input[name="sdql"]');
    var inputValue = inputField.val();
    var correctedValue = inputValue.replace(/\band and\b/gi, "and");
    // Update the input field if correction is made
    if (correctedValue !== inputValue) {
      inputField.val(correctedValue);
      console.log('Corrected a Double-And');
    }
  });
  let table = document.querySelector('#DT_Table');
  let firstColumnHeader = table.querySelector('thead tr th:first-child').innerText.trim();
  if (firstColumnHeader.toLowerCase() !== 'date') {
    // If the first column isn't 'Date', don't close the tab
    console.log('First column not a date column...not closing this tab');
    keepIt = true;
  }
  // Check row by row for valid dates
  $('#DT_Table tbody tr').each(function() {
    var dateText = $(this).children('td').first().text().trim();
    var rowDate = new Date(dateText);
    console.log('Row date:', rowDate, 'Class:', $(this).attr('class'));
    if (!isNaN(rowDate.getTime()) && rowDate >= today && rowDate <= tenDaysOut) {
      console.log('Found a row with a valid date:', dateText);
      keepIt = true;
    }
  });
  if (document.body.innerText.includes('Research')) {
    // If 'Research' is found, don't close the tab
    console.log('Research keyword identified...not closing this tab...');
    keepIt = true;
  }
  if (keepIt) {
    console.log('Keep This Page Open. Script Complete');
  } else {
    console.log('No Rows with Valid Dates Found. Attempting to close');
    window.close();
  }
});