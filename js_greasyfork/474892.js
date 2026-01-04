// ==UserScript==
// @name         AO3: Badge for Unread Inbox Messages
// @namespace    https://greasyfork.org/en/users/906106-escctrl
// @version      3.1
// @description  puts a little notification badge in the menu for unread messages in your AO3 inbox
// @author       escctrl
// @match        https://*.archiveofourown.org/*
// @license      MIT
// @require      https://cdn.jsdelivr.net/npm/webix@11.1.0/webix.min.js
// @require      https://update.greasyfork.org/scripts/491888/1355841/Light%20or%20Dark.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/474892/AO3%3A%20Badge%20for%20Unread%20Inbox%20Messages.user.js
// @updateURL https://update.greasyfork.org/scripts/474892/AO3%3A%20Badge%20for%20Unread%20Inbox%20Messages.meta.js
// ==/UserScript==

/* global webix, $$, lightOrDark */

(async function() {
    'use strict';

    // utility to reduce verboseness
    const qs = (selector, node=document) => node.querySelector(selector);
    const qa = (selector, node=document) => node.querySelectorAll(selector);

    const cfg = 'unread_inbox'; // name of dialog and localstorage used throughout

    const defaults = [{key: "badgeInterval", val: 12},
                      {key: "badgeColor", val: '#FFD700'},
                      {key: "badgeIcon", val: 1},
                      {key: "dashFilter", val: 1}];
    const storedConfig = getConfig('stored'); // returns object with key: value pairs

    // first question: is the user logged in? if not, don't bother with any of this
    let linkDash = qs("#greeting p.icon a").href || "";
    if (linkDash === "") {
        localStorage.removeItem(cfg+'_count');
        localStorage.removeItem(cfg+'_date');
        return;
    }
    if ( linkDash.includes('?')) linkDash = linkDash.slice(0, linkDash.indexOf('?')); // fix on FAQ pages containing a searchParam

    qs("head").insertAdjacentHTML('beforeend', `<style type="text/css"> a#inboxbadge .iconify { width: 1em; height: 1em; display: inline-block; vertical-align: -0.125em; }
            a#inboxbadge { display: block; padding: .25em .75em !important; text-align: center; float: left; margin: 0 1em; line-height: 1.286; height: 1.286em; }
            #greeting #inboxbadge { background-color: ${storedConfig.badgeColor}; border-radius: .25em; }
            #greeting .icon a { float: left; }</style>`);

    // build a new inbox link (filtered to unread)
    const linkInbox = linkDash + "/inbox?filters[read]=false&filters[replied_to]=all&filters[date]=desc&commit=Filter";

    // the fun begins: on a page where we're seeing the unread msgs, we simply set the value
    let count = 0;
    let pageURL = new String(window.location);
    if (pageURL.includes(linkDash)) {

        // grab unread msgs # from the sidebar
        count = (pageURL.includes("/inbox")) ? qs("div#dashboard li span.current").innerHTML : qs("div#dashboard a[href$='inbox']").innerHTML;
        count = count.match(/\d+/)[0];

        // change sidebar inbox link as well to filtered
        if (storedConfig.dashFilter === 1 && !pageURL.includes("/inbox")) qs("div#dashboard a[href$='inbox']").href = linkInbox;
    }
    // on other pages, we check if the stored value is recent enough, otherwise we load it again
    else {

        var timeStored = new Date(localStorage.getItem("unread_inbox_date") || '1970'); // the date when the storage was last refreshed
        var timeNow = createDate(0, 0, storedConfig.badgeInterval*-1, 0, 0, 0); // hours before that's max allowed

        // if not recent enough, we have to start a background load; otherwise we use what was stored
        count = (timeStored < timeNow) ? await getUnreadCount(linkDash) : (localStorage.getItem('unread_inbox_count') || 0);
    }

    // store the current value with the current date
    localStorage.setItem(cfg+'_count', count);
    localStorage.setItem(cfg+'_date', new Date());

    // add a little round badge to the user icon in the menu (if there are unread emails)
    // icon SVGs from https://heroicons.com (MIT license Copyright (c) Tailwind Labs, Inc. https://github.com/tailwindlabs/heroicons/blob/master/LICENSE)
    const displaytext = (storedConfig.badgeIcon === 1) ? `<span class="iconify">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
        <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" /></svg></span>&nbsp;&nbsp;${count}`
        : `Inbox (${count})`;
    if (count != "0") qs("#greeting p.icon").insertAdjacentHTML('afterbegin', `<a id="inboxbadge" href="${linkInbox}" title="You have unread messages in you inbox">${displaytext}</a>`);

    // function to grab the count of unread inbox messages if we're viewing a page that doesn't have a dashboard
    async function getUnreadCount(url) {
        try {
            let response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error: ${response.status}`); // the response has hit an error eg. 429 retry later
            else {
                let txt = await response.text();
                let parser = new DOMParser(); // Initialize the DOM parser
                let unread = qs("div#dashboard a[href$='inbox']", parser.parseFromString(txt, "text/html")); // Parse the text into HTML and grab the unread count
                if (!unread) throw new Error(`response didn't contain inbox count\n${txt}`); // the response has hit a different page e.g. a CF prompt
                else {
                    unread = unread.innerHTML;
                    return unread.match(/\d+/)[0];
                }
            }
        }
        catch(error) {
            // in case of any other JS errors
            console.log("[script] Badge for Unread Inbox Messages encountered an error", error.message);
            return '[ERROR]';
        }
    }

    /***************** CONFIG DIALOG *****************/

    // if no other script has created it yet, write out a "Userscripts" option to the main navigation
    if (qa('#scriptconfig').length === 0) {
        qa('#header nav[aria-label="Site"] li.search')[0] // insert as last li before search
            .insertAdjacentHTML('beforebegin', `<li class="dropdown" id="scriptconfig">
                <a class="dropdown-toggle" href="/" data-toggle="dropdown" data-target="#">Userscripts</a>
                <ul class="menu dropdown-menu"></ul></li>`);
    }

    // then add this script's config option to navigation dropdown
    qs('#scriptconfig .dropdown-menu').insertAdjacentHTML('beforeend', `<li><a href="javascript:void(0);" id="opencfg_${cfg}">Unread Inbox Messages</a></li>`);

    // NOTE: we try to not have to run through all the config dialog logic on every page load. it rarely gets opened once you have the config down
    // we initialize the configuration dialog only on first click (part of initialization is adding a listener for subsequent clicks)
    qs("#opencfg_"+cfg).addEventListener("click", createDialog, { once: true });

    function createDialog(e) {
        // setting up the GUI CSS
        qs("head").insertAdjacentHTML('beforeend',`<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/webix@11.1.0/webix.min.css" type="text/css">`);
        qs("head").insertAdjacentHTML('beforeend',`<style type="text/css">/* webix stuff that's messed up by AO3 default skins */
            .webix_view {
                label { margin-right: unset; }
                button { box-shadow: unset; }
            }</style>`);

        // if the background is dark, use a dark UI theme to match
        let dialogtheme = lightOrDark(getComputedStyle(qs("body")).getPropertyValue("background-color")) === "dark" ? "darkmode" : "";
        if (dialogtheme === "darkmode") qs("head").insertAdjacentHTML('beforeend',`<style type="text/css">/* switching webix colors to a dark mode if AO3 is dark */
            .webix_view.darkmode[view_id="${cfg}"],
            .webix_view.darkmode[view_id="${defaults[1].key+"Picker"}"] {
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

                &.webix_popup { border: 1px solid var(--border-on-dark); }
                .webix_win_head { border-bottom-color: var(--border-on-dark); }
                .webix_icon_button:hover::before { background-color: var(--highlight-on-dark); }

                .webix_view.webix_form, .webix_view.webix_header, .webix_win_body>.webix_view { background-color: var(--background-dark); }
                .webix_secondary .webix_button, .webix_slider_box .webix_slider_right, .webix_el_colorpicker .webix_inp_static, .webix_color_out_text, .webix_switch_box { background-color: var(--button-dark); }
                .webix_primary .webix_button, .webix_slider_box .webix_slider_left, .webix_switch_box.webix_switch_on { background-color: var(--highlight-on-dark); }
                .webix_switch_handle, .webix_slider_box .webix_slider_handle { background-color: var(--handles-on-dark); }
                .webix_el_colorpicker .webix_inp_static, .webix_color_out_block, .webix_color_out_text,
                .webix_switch_handle, .webix_slider_box .webix_slider_handle { border-color: var(--border-on-dark); }
                .webix_switch_box, .webix_slider_box .webix_slider_left, .webix_slider_box .webix_slider_right { border-color: var(--no-border); }
                * { color: var(--text-on-dark); }
            }</style>`);

        let dialogwidth = parseInt(getComputedStyle(qs("body")).getPropertyValue("width")); // parseInt ignores letters (px)

        webix.ui({
            view: "window",
            id: cfg,
            css: dialogtheme,
            width: dialogwidth > 500 ? 500 : dialogwidth * 0.9,
            position: "top",
            head: "Unread Inbox Messages",
            close: true,
            move: true,
            body: {
                view:"form", id:cfg+"_form",
                elements:[ // alias for rows
                    { // interval slider
                        view: "slider", value:storedConfig.badgeInterval, min:1, max: 24, name:defaults[0].key, id:defaults[0].key,
                        label:"Check for new messages every", labelWidth: "auto", labelPosition:"top",
                        title: webix.template("#value# hours")
                    },
                    {},
                    { // colorpicker
                        view:"colorpicker", value:storedConfig.badgeColor, name:defaults[1].key, id:defaults[1].key, clear: true,
                        label:"Pick your badge background color:", labelWidth: "auto",
                        suggest: { type:"colorselect", body: { button:true }, id:defaults[1].key+"Picker", css: dialogtheme }
                    },
                    {},
                    { // icon toggle
                        view: "switch", value:storedConfig.badgeIcon, name:defaults[2].key, id:defaults[2].key,
                        labelRight:"Show envelope icon on badge", labelWidth: "auto"
                    },
                    { // auto filter toggle
                        view: "switch", value:storedConfig.dashFilter, name:defaults[3].key, id:defaults[3].key,
                        labelRight:"Inbox link always filters to unread messages", labelWidth: "auto"
                    },
                    { cols:[ // buttonbar
                        {
                            view:"button", value:"Reset",
                            click: function() { // revert all values to the default in the GUI and delete the stored config
                                $$(cfg+"_form").setValues(getConfig('default'));
                                localStorage.removeItem(cfg+'_conf');
                                if (qs('#inboxbadge')) qs('#inboxbadge').style.background = defaults[1].val; // update the badge color without page reload
                                $$(cfg).hide(); // close the dialog
                            }
                        },
                        {
                            view:"button", value:"Cancel",
                            click: function() { $$(cfg).hide(); } // close the dialog
                        },
                        {
                            view:"button", value:"Save", css:"webix_primary",
                            click: function() {
                                let selected = $$(cfg+"_form").getValues();
                                localStorage.setItem(cfg+'_conf', JSON.stringify(selected));
                                if (qs('#inboxbadge')) qs('#inboxbadge').style.background = selected.badgeColor; // update the badge color without page reload
                                $$(cfg).hide(); // close the dialog
                            }
                        }
                    ]}
                ]
            }
        }).show();

        e.target.addEventListener("click", function(e) { $$(cfg).show(); }); // add a new event listener for reopening the dialog on subsequent clicks
    }

    /****************** CONFIGURATION STORAGE and DEFAULTS ******************/

    function getConfig(type) {
        let def = {
            [defaults[0].key]: defaults[0].val,
            [defaults[1].key]: defaults[1].val,
            [defaults[2].key]: defaults[2].val,
            [defaults[3].key]: defaults[3].val
        };
        if (type === 'default') return def;
        else if (type === 'stored') return JSON.parse(localStorage.getItem(cfg+'_conf')) ?? def;
        else return false;
    }

})();

// convenience function to be able to pass minus values into a Date, so JS will automatically shift correctly over month/year boundaries
// thanks to Phil on Stackoverflow for the code snippet https://stackoverflow.com/a/37003268
function createDate(secs, mins, hours, days, months, years) {
    var date = new Date();
    date.setFullYear(date.getFullYear() + years);
    date.setMonth(date.getMonth() + months);
    date.setDate(date.getDate() + days);
    date.setHours(date.getHours() + hours);
    date.setMinutes(date.getMinutes() + mins);
    date.setSeconds(date.getSeconds() + secs);
    return date;
}