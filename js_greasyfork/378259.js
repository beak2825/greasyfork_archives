// ==UserScript==
// @name         Redmine autocomplete
// @namespace    reyez
// @version      1.1.3
// @description  Autocomplete voor het project-veld van Redmine
// @author       Thomas Moeskops
// @match        https://projects.reyez.nl/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/378259/Redmine%20autocomplete.user.js
// @updateURL https://update.greasyfork.org/scripts/378259/Redmine%20autocomplete.meta.js
// ==/UserScript==

(function() {
    'use strict';

    return false;

    // Add Chosen
    var GM_JS = document.createElement('script');
    GM_JS.src = 'https://cdnjs.cloudflare.com/ajax/libs/chosen/1.8.7/chosen.jquery.js';
    GM_JS.type = 'text/javascript';
    document.getElementsByTagName('head')[0].appendChild(GM_JS);
    var GM_CSS = document.createElement('link');
    GM_CSS.href = 'https://cdnjs.cloudflare.com/ajax/libs/chosen/1.8.7/chosen.css';
    GM_CSS.rel = 'stylesheet'
    GM_CSS.type = 'text/css';
    document.getElementsByTagName('head')[0].appendChild(GM_CSS);

    // Check if chosen is loaded
    function GM_wait() {
        if(!jQuery().chosen)
        { window.setTimeout(GM_wait,100); }
        else { handle(); }
    }
    GM_wait();

    // Run!
    function handle() {
        $("#project_quick_jump_box").find('option:first').html("");
        $("#project_quick_jump_box").find('option:nth(1)').remove();
        $("#project_quick_jump_box").attr('data-placeholder', "Ga naar een project...").chosen({no_results_text: "Geen resultaten"});
        $(".chosen-container-single").find("span").css('color', '#333 !important');

        // START FIXES NEW TEMPLATE
        $("#header").css({
            'background-color': '#000 !important'
        });
        $("#quick-search").css({
            'width': '440',
            'padding-right': '10px',
            'margin-top': '12px'
            //'padding-top': '25px'
        });
        $("#quick-search").find('label').css('margin-top', '-5px');
        $("#quick-search").find('form').css('width', '150px');
        $("#project_quick_jump_box_chosen").css({
            'float': 'right',
            'margin-top': '3px'
        });
        $("#q").attr('style', 'background-color: #FFF !important; padding: 0 10px');
        $("#main-menu").css('margin-top', '-13px');
        // END FIXES NEW TEMPLATE
    }
})();