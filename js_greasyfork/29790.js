// ==UserScript==
// @name         GDocs - Focus Mode
// @namespace    qpqp.dk
// @version      0.1
// @description  In Google docs press 'Hide the menus' button, to enter focus mode.
// @author       Viktor Strate
// @match        https://docs.google.com/document/*
// @require      https://code.jquery.com/jquery-3.2.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/29790/GDocs%20-%20Focus%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/29790/GDocs%20-%20Focus%20Mode.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var style = '<style id="focusModeStyle">' +
        '.kix-paginateddocumentplugin, .kix-page-paginated { box-shadow: none; }'+
        '.kix-page:not(:first-child) .kix-page-header { border-top: 1px solid #ddd; }' +
        '.kix-appview-editor { background-color: #fff; }' +
        '</style>';

    var toolbar = $("#docs-toolbar-wrapper");
    toolbar.css("background-image", "none");
    toolbar.css("background-color", "#eee");

    $("#viewModeButton").mouseup(function(){
        // Let google update the DOM first
        setTimeout(updateFocusMode, 0);
    });

    function updateFocusMode() {
        // Is show menus button pressed or not
        var checked = $("#viewModeButton .docs-icon-img-container").hasClass("docs-icon-exit-compact");
        setFocusMode(checked);
    }

    function setFocusMode(focus) {
        console.log("Setting focus mode: "+focus);
        var focusStyle = $("#focusModeStyle");
        var explorer = $(".docs-explore-widget").first();

        if (focus) {
            if(focusStyle.length===0)
                $("body").append(style);
            explorer.hide();
        } else {
            if(focusStyle.length>0)
                focusStyle.remove();
            explorer.show();
        }
    }

    // Initial update
    updateFocusMode();
})();
