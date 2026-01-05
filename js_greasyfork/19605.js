// ==UserScript==
// @name        MyTutorWeb Back Office UX Mods
// @namespace   MTW
// @description Modifies various widgets in the MTW back office for an improved expereince
// @include     *.mytutorweb.co.uk/secure/*
// @exclude     %exclude%
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/19605/MyTutorWeb%20Back%20Office%20UX%20Mods.user.js
// @updateURL https://update.greasyfork.org/scripts/19605/MyTutorWeb%20Back%20Office%20UX%20Mods.meta.js
// ==/UserScript==


/************
Modifications to the support log table
************/

/** The commented code below adds a button that can be used to expand rather than using the on hover function. **/
//jQuery('#mainform\\:customerSupportLogTable_data td').css('height', '60px');
//var $expandSupportLogButton = jQuery('<button style="margin: 0px 0px 0px 8px" class="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only smallbutton"> <span class="ui-button-text ui-c"> Expand  </span></button>');

//jQuery('button:contains("Add entry")').after($expandSupportLogButton);



var $originalTableHeight = jQuery('#mainform\\:customerSupportLogTable .ui-datatable-scrollable-body').height();
var $tableHeight = jQuery('#mainform\\:customerSupportLogTable tbody').height() + 10;
var maxHeight = 400;
var height = maxHeight > $tableHeight ? $tableHeight : maxHeight;

jQuery('#mainform\\:customerSupportLogTable').hover(

    function () {
        jQuery('#mainform\\:customerSupportLogTable .ui-datatable-scrollable-body').stop().animate({
                height: $tableHeight,
            }, 500
        );
    },
    function () {
        jQuery('#mainform\\:customerSupportLogTable .ui-datatable-scrollable-body').stop().animate({
                height: $originalTableHeight,
            }, 500
        );
    }
);



/**
* Automatically save the page if it is updated by 'It's all text' plugin
**/
$('.mainin').change('textarea', function (event) {

    var $backgroundColor = $(event.target).css('backgroundColor').toString();
    console.log($backgroundColor);
    if ($backgroundColor != 'rgb(255, 255, 255)')
    {
        var event = jQuery.Event("keydown");
        event.which = 90;
        event.ctrlKey = true;
        event.shiftKey = true;
        jQuery(document).trigger(event);
    }
});




