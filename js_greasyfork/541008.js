// ==UserScript==
// @name         AO3: Initialize webix GUI
// @namespace    https://greasyfork.org/en/users/906106-escctrl
// @description  library to load the webix JS from CDN only if it hasn't already, and create the menu
// @author       escctrl
// @version      1.2
// @grant        none
// @license      MIT
// ==/UserScript==

// HOW TO USE:
// please refer to https://greasyfork.org/en/scripts/541008-ao3-initialize-webix-gui for a full description how to use this library

/* global webix, $$ */
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

function loadWebix() {
    return new Promise((resolve, reject) => {
        if (typeof webix !== "undefined") resolve("success");
        else {
            // based on https://stackoverflow.com/a/44807594
            new Promise((resolve, reject) => {
                const script = document.createElement('script');
                document.head.appendChild(script);
                script.onload = resolve;
                script.onerror = reject;
                script.async = true;
                script.src = 'https://cdn.jsdelivr.net/npm/webix@11.1.0/webix.min.js';
            })
            .then(() => resolve("success"))
            .catch((err) => reject(err));
        }
    });
}

async function initGUI(e, id, heading, maxWidth, views=null) {
    let loadSuccess = await loadWebix();
    if (loadSuccess === "success") {

        // setting up the GUI CSS (only if no other script has created it yet)
        if (!q("head link[href*='webix.min.css']")) {
            q("head").insertAdjacentHTML('beforeend',`<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/webix@11.1.0/webix.min.css" type="text/css">`);
            q("head").insertAdjacentHTML('beforeend',`<style type="text/css">/* webix stuff that's messed up by AO3 default skins */
                .webix_view {
                    label { margin-right: unset; }
                    button { box-shadow: unset; }
                    legend { display: block; }
                    .webix_template { padding: 0; }
                    &:has(>.webix_template) { border: 0; }
                }</style>`);
        }

        // automatic darkmode if the background is dark (e.g. Reversi)
        let theme = lightOrDark(getComputedStyle(q("body")).getPropertyValue("background-color"));
        if (theme === "dark") {
            if (views === null) views = [id];
            views = views.map((x) => `.webix_view[view_id="${x}"]`).join(', ');

            q("head").insertAdjacentHTML('beforeend',`<style type="text/css">/* switching webix colors to a dark mode if AO3 is dark */
            ${views} {
                --text-on-dark: #ddd;
                --handles-on-dark: #bbb;
                --highlight-on-dark: #0c6a82;
                --background-dark: #222;
                --border-on-dark: #555;
                --no-border: transparent;
                --button-dark: #333;

                background-color: var(--background-dark);
                color: var(--text-on-dark);
                border-color: var(--border-on-dark);

                &.webix_popup, > fieldset { border: 1px solid var(--border-on-dark); }
                .webix_win_head { border-bottom-color: var(--border-on-dark); }
                .webix_icon_button:hover::before { background-color: var(--highlight-on-dark); }

                .webix_view.webix_form, .webix_view.webix_header, .webix_win_body>.webix_view, .webix_view.webix_control.webix_el_tabbar { background-color: var(--background-dark); }
                .webix_secondary .webix_button, .webix_slider_box .webix_slider_right, .webix_el_colorpicker .webix_inp_static, .webix_color_out_text, .webix_switch_box { background-color: var(--button-dark); }
                .webix_primary .webix_button, .webix_slider_box .webix_slider_left, .webix_switch_box.webix_switch_on { background-color: var(--highlight-on-dark); }
                .webix_switch_handle, .webix_slider_box .webix_slider_handle { background-color: var(--handles-on-dark); }
                .webix_el_colorpicker .webix_inp_static, .webix_color_out_block, .webix_color_out_text,
                .webix_switch_handle, .webix_slider_box .webix_slider_handle { border-color: var(--border-on-dark); }
                .webix_switch_box, .webix_slider_box .webix_slider_left, .webix_slider_box .webix_slider_right { border-color: var(--no-border); }
                * { color: var(--text-on-dark); }
            }</style>`);
        }

        let dialogwidth = parseInt(getComputedStyle(q("body")).getPropertyValue("width"));

        webix.ui({
            view: "window",
            id: id,
            width: dialogwidth > maxWidth ? maxWidth : dialogwidth * 0.9,
            position: "top",
            head: heading,
            close: true,
            move: true,
            body: { type:"wide", id:"container", rows:[ ] }
        });

        // event listener for reopening the dialog on subsequent menu clicks (without recreating the whole GUI)
        e.target.addEventListener("click", function(e) { $$(id).show(); });

        // if the window resizes the dialog would move off of the screen
        window.addEventListener('resize', function(e) {
            let dialogwidth = parseInt(getComputedStyle(q("body")).getPropertyValue("width")); // get the new browser width
            $$(id).config.width = dialogwidth > maxWidth ? maxWidth : dialogwidth * 0.9; // reoptimize dialog width
            $$(id).resize(); // repaint the GUI and its components
        });

        return $$(id).queryView((view) => view.config.id === "container");
    }
    else {
        console.debug("library has failed to load webix", loadSuccess);
        return false;
    }
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