// ==UserScript==
// @name         Total Filter
// @namespace    Anh.Nguyen
// @version      0.0.0.7
// @description  Try to use jquery
// @author       Anh Nguyen
// @grant        none

// @require         http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js
// @require         http://code.jquery.com/ui/1.11.2/jquery-ui.js
// @include        /^https?://Anh\.Nguyen\.com/.*$/

// @downloadURL https://update.greasyfork.org/scripts/14025/Total%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/14025/Total%20Filter.meta.js
// ==/UserScript==

//Next element, next all element, find element
$('div.middleads').next('div').find('table:first-child > tbody > tr > td:last').remove();
$('div#forumsearch_menu').nextAll('table').empty();

//Find parent first
$('div#neo_logobar').closest('div').remove();

//Set css element
$( "table" ).css("border","10px solid red");

//Remove element
//$("#divHeader").remove();

//Delete html in element
$('footer').empty();

//To move ABOVE an element:
$('.whatToMove').insertBefore('.whereToMove');
//To move AFTER an element:
$('.whatToMove').insertAfter('.whereToMove');
//To move inside an element, ABOVE ALL elements inside that container:
$('.whatToMove').prependTo('.whereToMove');
//To move inside an element, AFTER ALL elements inside that container:
$('.whatToMove').appendTo('.whereToMove');

$( "body" ).wrapInner( '<div id="wrapperDiv"></div>' );
$( "body" ).wrap( '<div id="wrapperDiv"></div>' );

jQuery(document).ready(function ($) {  
    $("body").prepend('<style> html, body {   height: 100%;   min-height: 100%; } <style>');
    $("body").prepend( '<div id="AutoDiv" class="fullheight"><input type="text" id="autoInput"></div>'); 

    AutoRun();

    function AutoRun(){
        CountText();
        setTimeout(AutoRun, 100);
    }

    function CountText()
    {
        var autoInput = $('#autoInput').val();
        var i = 0;
        if(autoInput!="")
            i = parseInt(autoInput);
        i = i+1;
        $('#autoInput').val(i);
    }    
});


