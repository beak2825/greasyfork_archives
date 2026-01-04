// ==UserScript==
// @name         AO3: Initialize jQueryUI
// @namespace    https://greasyfork.org/en/users/906106-escctrl
// @description  library to load the jQuery, jQueryUI and TouchPunch JS from CDN only if it hasn't already, and create the menu
// @author       escctrl
// @version      1.0
// @grant        none
// @license      MIT
// ==/UserScript==

// HOW TO USE:
// please refer to https://greasyfork.org/en/scripts/542049 for a full description how to use this library

/* global jQuery, $ */
'use strict';

// utility to reduce verboseness
const q = (selector, node=document) => node.querySelector(selector);
const qa = (selector, node=document) => node.querySelectorAll(selector);

function createMenu(id, heading) {
    // if no other script has created it yet, write out a "Userscripts" option to the main navigation
    if (qa('#scriptconfig').length === 0) {
        qa('#header nav[aria-label="Site"] li.search')[0] // insert as last li before search
            .insertAdjacentHTML('beforebegin', `<li class="dropdown" id="scriptconfig">
                <a class="dropdown-toggle" href="/" data-toggle="dropdown" data-target="#">Userscripts</a>
                <ul class="menu dropdown-menu"></ul></li>`);
    }

    // then add this script's config option to navigation dropdown
    q('#scriptconfig .dropdown-menu').insertAdjacentHTML('beforeend', `<li><a href="javascript:void(0);" id="opencfg_${id}">${heading}</a></li>`);
}

function loadjQuery(URI) {
    return new Promise((resolve, reject) => {
        // based on https://stackoverflow.com/a/44807594
        new Promise((resolve, reject) => {
            const script = document.createElement('script');
            document.head.appendChild(script);
            script.onload = resolve;
            script.onerror = reject;
            script.async = true;
            script.src = URI;
        })
        .then(() => resolve("success"))
        .catch((err) => reject(err));
    });
}

async function initGUI(e, id, heading, maxWidth) {

    if (!q("head script[src*='/3.7.0/jquery.min.js']")) {
        let loadSuccess = await loadjQuery('https://ajax.googleapis.com/ajax/libs/jquery/3.7.0/jquery.min.js');
        if (loadSuccess !== "success") { console.debug("library has failed to load jQuery", loadSuccess); return false; }
    }
    if (!q("head script[src*='/1.13.2/jquery-ui.min.js']")) {
        loadSuccess = await loadjQuery('https://ajax.googleapis.com/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js');
        if (loadSuccess !== "success") { console.debug("library has failed to load jQueryUI", loadSuccess); return false; }
    
        loadSuccess = await loadjQuery('https://cdnjs.cloudflare.com/ajax/libs/jqueryui-touch-punch/0.2.3/jquery.ui.touch-punch.min.js');
        if (loadSuccess !== "success") { console.debug("library has failed to load TouchPunch", loadSuccess); return false; }
    }
    
    // automatic darkmode if the background is dark (e.g. Reversi)
    let theme = lightOrDark(getComputedStyle(q("body")).getPropertyValue("background-color"));
    theme = theme == "dark" ? "dark-hive" : "base";

    id = "#"+id;
    // setting up the GUI CSS (only if no other script has created it yet)
    if (!q("head link[href*='jquery-ui.css']")) {
        q("head").insertAdjacentHTML('beforeend',`<link rel="stylesheet" href="https://code.jquery.com/ui/1.13.2/themes/${theme}/jquery-ui.css" type="text/css">`);
    }
    q("head").insertAdjacentHTML('beforeend',`<style type="text/css">/* jQueryUI stuff that's messed up by AO3 default skins */
        .ui-widget, ${id}, .ui-dialog .ui-dialog-buttonpane button {font-size: revert !important; line-height: 1.286;}
        ${id} {
            form, fieldset {border: revert; box-shadow: revert; background: revert; cursor:auto;}
            ol { margin-left: 2em; li { list-style: decimal; } }
            fieldset p { padding-left: 0; padding-right: 0; }
            legend {font-size: inherit; height: auto; width: auto; opacity: inherit;}
            label { margin: 0; }
            select { vertical-align: baseline; }
            .ui-sortable li { background-color: revert; border: revert; margin: 0; float: none; clear: none; box-shadow: revert; width: auto; display: inline-block; }
            
            /* Toggle Switches (CSS) */
            --switch-height: 1.5em;
            --slider-size: calc(var(--switch-height) - 0.2em);
            --slider-color: currentColor;
            
            /* The switch - the box around the slider */
            .switch { position: relative; bottom: 0.1em; display: inline-block; width: 3em; height: var(--switch-height); padding: 0; border-radius: 1em; }
            /* Hide default HTML checkbox */
            .switch input { opacity: 0; width: 0; height: 0; }
            /* The slider */
            .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; -webkit-transition: .4s; transition: .4s; }
            .slider:before { position: absolute; content: ""; height: var(--slider-size); width: var(--slider-size); left: 0.2em; bottom: 0.1em;
                background-color: var(--slider-color); -webkit-transition: .4s; transition: .4s; }
            input:checked + .slider { }
            input:focus + .slider { }
            input:checked + .slider:before { -webkit-transform: translateX(var(--slider-size)); -ms-transform: translateX(var(--slider-size)); transform: translateX(var(--slider-size)); }
            /* Rounded sliders */
            .slider.round { border-radius: 1em; }
            .slider.round:before { border-radius: 50%; }
        }</style>`);

    // wrapper div for the dialog
    $("body").append(`<div id="${id.slice(1)}"></div>`);

    let dialogwidth = parseInt($("body").css("width"));
    dialogwidth = dialogwidth > maxWidth ? maxWidth : dialogwidth * 0.9;

    $(id).dialog({
        appendTo: "#main",
        modal: true,
        title: heading,
        draggable: false,
        resizable: false,
        autoOpen: false,
        width: dialogwidth,
        position: {my:"center", at: "center top", of: window},
    });

    // event listener for reopening the dialog on subsequent menu clicks (without recreating the whole GUI)
    e.target.addEventListener("click", function(e) { $( id ).dialog('open'); });

    // if the window resizes the dialog would move off of the screen
    window.addEventListener('resize', function(e) {
        let dialogwidth = parseInt($("body").css("width")); // get the new browser width
        dialogwidth = dialogwidth > maxWidth ? maxWidth : dialogwidth * 0.9;

        $(id).dialog("option", "width", dialogwidth) // resize the dialog
             .dialog("option", "position", {my:"center top", at: "center top", of: window} ); // reposition the dialog
    });

    return $(id);
}

// helper function to determine whether a color (the background in use) is light or dark
// https://awik.io/determine-color-bright-dark-using-javascript/
function lightOrDark(color) {
    var r, g, b, hsp;
    if (color.match(/^rgb/)) { color = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);
        r = color[1]; g = color[2]; b = color[3]; }
    else { color = +("0x" + color.slice(1).replace(color.length < 5 && /./g, '$&$&'));
        r = color >> 16; g = color >> 8 & 255; b = color & 255; }
    hsp = Math.sqrt( 0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b) );
    if (hsp>127.5) { return 'light'; } else { return 'dark'; }
}