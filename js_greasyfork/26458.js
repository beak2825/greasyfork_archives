// ==UserScript==
// @name         Pauls Problem
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://ecampus.nmit.ac.nz/moodle/enrol/meta/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.5.1/jquery.min.js

// @downloadURL https://update.greasyfork.org/scripts/26458/Pauls%20Problem.user.js
// @updateURL https://update.greasyfork.org/scripts/26458/Pauls%20Problem.meta.js
// ==/UserScript==


// Append some text to the element with id someText using the jQuery library.
$(".helplink").append(" <br /><strong>Make America Great again!</strong>");
//Get Exising Select Options
$('form#mform1 select').each(function(i, select){
    var $select = $(select);
    $select.find('option').each(function(j, option){
        var $option = $(option);
        // Create a radio:
        var $radio = $('<input type="radio" />');
        // Set name and value:
        $radio.attr('name', $select.attr('name')).attr('value', $option.val());
        // Set checked if the option was selected
        if ($option.attr('selected')) $radio.attr('checked', 'checked');
        // Insert radio before select box:
        $select.before($radio);
        // Insert a label:
        $select.before(
          $("<label />").attr('for', $select.attr('name')).text($option.text())
        );
        // Insert a <br />:
        $select.before("<br/>");
    });
    $select.remove();
});