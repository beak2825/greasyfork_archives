// ==UserScript==
// @name         AO3: [Wrangling] Collapse and Expand Tag Lists
// @namespace    https://greasyfork.org/en/users/906106-escctrl
// @description  On tags landing pages, turns long tag lists into a collapsable/expandable accordion, as well as each subtag which in turn has subtags
// @author       escctrl
// @version      1.1
// @match        *://*.archiveofourown.org/tags/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/448717/AO3%3A%20%5BWrangling%5D%20Collapse%20and%20Expand%20Tag%20Lists.user.js
// @updateURL https://update.greasyfork.org/scripts/448717/AO3%3A%20%5BWrangling%5D%20Collapse%20and%20Expand%20Tag%20Lists.meta.js
// ==/UserScript==
 
(function($) {
    'use strict';
 
    // we'll show little triangles pointing down/up to show where subtags are hidden
    const arrow_expand = '&#9661;';
    const arrow_collapse = '&#9651;';
 
    // don't make accordions if there are less then this many tags in the list:
    const magic_number = 10;
 
    // ***** SUBTAG ACCORDIONS
 
    // find all subtags that have subtags themselves
    const subhassub = $('div.sub li').has('ul.tags.tree');
 
    $(subhassub).each(function() {
        if ($(this).children('ul').children().length < magic_number) { return; }
        // after the link of the tag, add the triangle
        $(this).contents().first().after(' <a class="accordion" style="cursor: pointer;">'+arrow_expand+'</a>');
        // event listener to toggle visibility of the following subtag list
        $(this).children('a.accordion').click(toggleAccordion);
        // initialization: hide all subtag lists
        $(this).children('a.accordion').siblings('ul').hide();
    });
 
    function toggleAccordion() {
        $(this).siblings('ul').toggle("fast", "swing");
 
        var is_collapsed = $('<div/>').html(arrow_collapse);
        var is_expanded = $('<div/>').html(arrow_expand);
 
        if ($(this).html() == is_collapsed.html()) { $(this).html(arrow_expand); }
        else if ($(this).html() == is_expanded.html()) { $(this).html(arrow_collapse); }
    }
 
    // ***** VARIOUS TAG LIST GROUP HEADING ACCORDIONS
 
    // find all subtags that have subtags themselves
    const taggroups = $('div.listbox').not('.child,.parent,.meta').find('h3,h4');
 
    $(taggroups).each(function() {
        if ($(this).siblings('ul.tags').children().length < magic_number) { return; }
        // after the link of the tag, add the triangle
        $(this).contents().first().after(' <a class="accordion" style="cursor: pointer; border-bottom: none; font-size: smaller;">'+arrow_expand+'</a>');
        // event listener to toggle visibility of the following tag list
        $(this).children('a.accordion').click(toggleAccordionGroup);
        // initialization: hide all tag lists
        $(this).siblings('ul.tags').hide();
    });
 
    function toggleAccordionGroup() {
        $(this).parent().siblings('ul').toggle("fast", "swing");
 
        var is_collapsed = $('<div/>').html(arrow_collapse);
        var is_expanded = $('<div/>').html(arrow_expand);
 
        if ($(this).html() == is_collapsed.html()) { $(this).html(arrow_expand); }
        else if ($(this).html() == is_expanded.html()) { $(this).html(arrow_collapse); }
    }
 
 
})(jQuery);