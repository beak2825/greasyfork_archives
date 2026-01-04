// ==UserScript==
// @name         AO3: [Wrangling] Keyboard Shortcuts
// @namespace    https://greasyfork.org/en/users/906106-escctrl
// @description	 adds keyboard shortcuts to the AO3 wrangling interface
// @author       escctrl
// @version      6.1
// @match        https://archiveofourown.org/tags/*
// @match        https://archiveofourown.org/tag_wranglings*
// @match        https://archiveofourown.org/tag_wranglers/*
// @match        https://archiveofourown.org/comments*
// @license      MIT
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.7.0/jquery.min.js
// @require      https://ajax.googleapis.com/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jqueryui-touch-punch/0.2.3/jquery.ui.touch-punch.min.js
// @require      https://update.greasyfork.org/scripts/491888/1355841/Light%20or%20Dark.js
// @downloadURL https://update.greasyfork.org/scripts/507705/AO3%3A%20%5BWrangling%5D%20Keyboard%20Shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/507705/AO3%3A%20%5BWrangling%5D%20Keyboard%20Shortcuts.meta.js
// ==/UserScript==

/* eslint-disable no-multi-spaces */
/* global jQuery, lightOrDark */

(function($) {
    'use strict';
    const cPage = findPageType();
    if (cPage == "") return; // page that isn't supported or we're in retry later

    const sCfgName = 'wrangleShortcuts'; // name of dialog and localstorage
    const sDlgName = '#'+sCfgName;       // selector for CSS and jQuery
    var eDlg;                            // cached dialog element to speed up selectors

    // listening to the user's keystrokes and check against what is enabled
    var mShortcuts = loadPageShortcuts();
    if ((mShortcuts.Action.size + mShortcuts.Fandom.size + mShortcuts.Canonical.size) > 0) $(window).on('keydown.wrangling', validateKey);

    function findPageType() {
        // simpler than interpreting the URL: determine page type based on classes assigned to #main
        let main = $('#main');
        return $(main).hasClass('tags-wrangle') ? "B" :      // bin
               $(main).hasClass('tags-edit') ? "E" :         // edit
               $(main).hasClass('tags-update') ? "E" :       // edit after error
               $(main).hasClass('tags-show') ? "L" :         // landing
               $(main).hasClass('tags-search') ? "S" :       // search
               $(main).hasClass('tags-new') ? "N" :          // new
               $(main).hasClass('comments-index') ? "C" :    // comments
               $(main).hasClass('comments-show') ? "C" : ""; // comments
    }

    /***************** CONFIG DIALOG *****************/

    // if no other script has created it yet, write out a "Userscripts" option to the main navigation
    if ($('#scriptconfig').length == 0) {
        $('#header').find('nav[aria-label="Site"] li.dropdown').last()
            .after(`<li class="dropdown" id="scriptconfig">
                <a class="dropdown-toggle" href="/" data-toggle="dropdown" data-target="#">Userscripts</a>
                <ul class="menu dropdown-menu"></ul></li>`);
    }
    // then add this script's config option to navigation dropdown
    $('#scriptconfig .dropdown-menu').append(`<li><a href="javascript:void(0);" id="opencfg_${sCfgName}">Wrangling Keyboard Shortcuts</a></li>`);

    // NOTE: we try to not have to run through all the config dialog logic on every page load. it rarely gets opened once you have the config down
    // we initialize the configuration dialog only on first click (part of initialization is adding a listener for subsequent clicks)
    $("#opencfg_"+sCfgName).one("click", createDialog);

    function createDialog() {
        // if the background is dark, use the dark UI theme to match
        let dialogtheme = lightOrDark($('body').css('background-color')) == "dark" ? "dark-hive" : "base";

        // adding the jQuery stylesheet to style the dialog, and fixing the interference of AO3's styling
        $("head").append(`<link rel="stylesheet" href="https://code.jquery.com/ui/1.13.2/themes/${dialogtheme}/jquery-ui.css">`)
        .append(`<style tyle="text/css">
        ${sDlgName}, .ui-dialog .ui-dialog-buttonpane button {font-size: revert; line-height: 1.286;}
        ${sDlgName} form {box-shadow: revert; cursor:auto;}
        ${sDlgName} fieldset { background: revert; box-shadow: revert; border-width: 1px; margin: 1em 0; border-radius: 0.2em; }
        ${sDlgName} fieldset p { padding-left: 0; padding-right: 0; }
        ${sDlgName} legend {font-size: inherit; height: auto; width: auto; opacity: inherit;}
        ${sDlgName} kbd.ui-button { padding: 0.1em; cursor: text; }
        ${sDlgName} table { background-color: unset; }
        ${sDlgName} tr, ${sDlgName} tr:hover { border-width: 0; }
        ${sDlgName} td { vertical-align: middle }
        ${sDlgName} input.typeshortcut { width: 4em; border-radius: 0.2em; padding: 0.1em 0.5em; }
        ${sDlgName} input.typetag { width: 30em; border-radius: 0.2em; padding: 0.1em 0.5em; }
        ${sDlgName} input::placeholder { font-style: italic; opacity: 20%; }
        ${sDlgName} td.cellshortcut { width: 7em; }
        ${sDlgName} .ui-tabs-tab a { border-bottom-width: 0; }
        ${sDlgName} .ui-tabs .ui-tabs-panel { padding-left: 0; padding-right: 0; max-height: 20em; overflow-y: auto; }
        .fontawesome { width: 1em; height: 1em; vertical-align: -0.125em; display: inline-block; }
        </style>`);

        // what's all configured already?
        const cfgActions = loadAllActions();
        const cfgTags = loadAllTags();
        let rows = { A: [[], []] };

        let iconWindows = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><title>Windows logo</title><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path fill="currentColor" d="M0 93.7l183.6-25.3v177.4H0V93.7zm0 324.6l183.6 25.3V268.4H0v149.9zm203.8 28L448 480V268.4H203.8v177.9zm0-380.6v180.1H448V32L203.8 65.7z"/></svg>`;

        // walk through each page and turn the available & configured shortcuts into HTML tables
        for (const [p, v] of Object.entries(cfgActions)) {
            rows[p] = Object.entries(v).map((act) => `<tr>
                <td class="cellshortcut"><input type="text" class="typeshortcut" maxlength=5 name="${p}-${act[0]}" id="${p}-${act[0]}" value="${act[1][1]}"> &rarr;</td>
                <td>${act[1][0]}</td>
                </tr>`).join("\n");
        }
        // walk through the configured tags and turn them into HTML tables + add a new empty line
        rows.A[0] = Object.values(cfgTags.Fan).map((add, ix) => `<tr>
                    <td class="cellshortcut"><input type="text" class="typeshortcut" name="af${ix}[kbd]" maxlength=5 value="${add[0]}"> &rarr;</td>
                    <td><input type="text" class="typetag" name="af${ix}[tag]" value="${add[1]}"></td></tr>`);
        rows.A[0].push(`<tr>
                    <td class="cellshortcut"><input type="text" class="typeshortcut" name="af${rows.A[0].length}[kbd]" maxlength=5 value=""> &rarr;</td>
                    <td><input type="text" class="typetag" name="af${rows.A[0].length}[tag]" value=""></td></tr>`);
        rows.A[1] = Object.values(cfgTags.Can).map((add, ix) => `<tr>
                    <td class="cellshortcut"><input type="text" class="typeshortcut" name="ac${ix}[kbd]" maxlength=5 value="${add[0]}"> &rarr;</td>
                    <td><input type="text" class="typetag" name="ac${ix}[tag]" value="${add[1]}"></td></tr>`);
        rows.A[1].push(`<tr>
                    <td class="cellshortcut"><input type="text" class="typeshortcut" name="ac${rows.A[1].length}[kbd]" maxlength=5 value=""> &rarr;</td>
                    <td><input type="text" class="typetag" name="ac${rows.A[1].length}[tag]" value=""></td></tr>`);
        rows.A[0] = rows.A[0].join("\n");
        rows.A[1] = rows.A[1].join("\n");

        // wrapper div for the dialog
        $("#main").append(`<div id="${sCfgName}"></div>`);

        // building the dialog
        $(sDlgName).html(`<form><fieldset><legend>Shortcuts for buttons, checkboxes, etc</legend>
        <p>Click or tap into the textfield and press the key combination you'd like to use. Choose a combination of<br/>
        &#8226; required: one of <kbd class="ui-button ui-corner-all">Ctrl</kbd>, <kbd class="ui-button ui-corner-all">Alt</kbd>, or <kbd class="ui-button ui-corner-all">Meta</kbd>
        (aka <span class="fontawesome">${iconWindows}</span> or &#8984;/Command) key +<br>
        &#8226; optional: <kbd class="ui-button ui-corner-all">Shift</kbd> key + <br>
        &#8226; required: a letter or number for each shortcut.</p>
        <p>If you don't want to use a shortcut for any of these available actions, just leave its field empty.</p>
        <div id="tabs">
            <ul><li><a href="#tab-bin">Bin</a></li>
            <li><a href="#tab-edit">Edit</a></li>
            <li><a href="#tab-cmt">Comments</a></li>
            <li><a href="#tab-land">Landing</a></li>
            <li><a href="#tab-search">Search</a></li>
            <li><a href="#tab-new">New</a></li></ul>
            <div id="tab-edit">
                <table>${rows.E}</table>
                <p><label for="E-a_f">Enable Fandoms shortcuts</label><input type="checkbox" name="E-a_f" id="E-a_f" ${cfgTags.FPage.includes("E") ? 'checked="checked"' : ''}>
                <label for="E-a_c">Enable Synonym Of shortcuts</label><input type="checkbox" name="E-a_c" id="E-a_c" ${cfgTags.CPage.includes("E") ? 'checked="checked"' : ''}></p>
            </div>
            <div id="tab-bin">
                <table>${rows.B}</table>
                <p><label for="B-a_f">Enable Fandoms shortcuts</label><input type="checkbox" name="B-a_f" id="B-a_f" ${cfgTags.FPage.includes("B") ? 'checked="checked"' : ''}>
                <label for="B-a_c">Enable Synonym Of shortcuts</label><input type="checkbox" name="B-a_c" id="B-a_c" ${cfgTags.CPage.includes("B") ? 'checked="checked"' : ''}></p>
                <p style="margin: 0 0.5em;">Check out the <a href="https://greasyfork.org/en/scripts/479026">AO3: Use Arrow-Keys to Navigate</a> script
                for jumping to the previous/next page in the bin with the <kbd class="ui-button ui-corner-all">&larr;</kbd> <kbd class="ui-button ui-corner-all">&rarr;</kbd> cursor keys.</p>
            </div>
            <div id="tab-cmt"><table>${rows.C}</table></div>
            <div id="tab-land"><table>${rows.L}</table></div>
            <div id="tab-search">
                <table>${rows.S}</table>
                <p><label for="S-a_f">Enable Fandoms shortcuts</label><input type="checkbox" name="S-a_f" id="S-a_f" ${cfgTags.FPage.includes("S") ? 'checked="checked"' : ''}></p>
                <p style="margin: 0 0.5em;">Check out the <a href="https://greasyfork.org/en/scripts/479026">AO3: Use Arrow-Keys to Navigate</a> script
                for jumping to the previous/next page of search results with the <kbd class="ui-button ui-corner-all">&larr;</kbd> <kbd class="ui-button ui-corner-all">&rarr;</kbd> cursor keys.</p>
            </div>
            <div id="tab-new"><table>${rows.N}</table></div>
        </div>
        <p><label for="link-tab">Open page links in a new tab</label><input type="checkbox" name="link-tab" id="link-tab" ${cfgTags.NewTab == "Y" ? 'checked="checked"' : ''}></p>
        </fieldset>
        <fieldset id="addtags"><legend>Shortcuts to add Fandom and Canonical tags</legend>
            <p>Step 1: Tick the checkboxes on the Bin, Edit, and/or Search tabs above. Choose if you want to use shortcuts to add fandoms, to syn to canonical tags,
            or both on each of those pages.</p>
            <p>Step 2: In the lists below, define the tag name and the corresponding shortcut. It'll always be the same, on every enabled page.</p>
            <p>Fandoms:</p>
            <table>${rows.A[0]}</table>
            <button class="ui-button ui-widget ui-corner-all" id="addmore">+ Add more</button>
            <p>Canonicals:</p>
            <table>${rows.A[1]}</table>
            <button class="ui-button ui-widget ui-corner-all" id="addmore">+ Add more</button>
        </fieldset>
        </form>`);

        // adding placeholders as hint to user - easier here after the fact than coding it into all the <input>s
        $(sDlgName).find("input.typeshortcut" ).prop('placeholder', 'shortcut');
        $(sDlgName).find("input.typetag" ).prop('placeholder', 'tag name');

        /* JQUERYUI TIME: TURNING PLAIN HTML INTO A NICE CONFIG DIALOG */
        $( function() { $(sDlgName).find("#tabs" ).tabs({
            collapsible: true,
            show: { effect: "blind", duration: 500 },
            hide: { effect: "blind", duration: 500 }
        }); } );
        $( function() { $(sDlgName).find("input[type='checkbox']" ).checkboxradio(); } );

        let dialogwidth = parseInt($("body").css("width")); // parseInt ignores letters (px)

        // initialize the dialog
        $( sDlgName ).dialog({
            appendTo: "#main",
            modal: true,
            title: 'Wrangling Keyboard Shortcuts',
            draggable: true,
            resizable: false,
            autoOpen: false,
            width: dialogwidth > 700 ? 700 : dialogwidth * 0.9, // optimizing the size of the GUI in case it's a mobile device
            position: {my:"center top", at: "center top", of: window},
            buttons: [
                {
                    id: "button-reset",
                    text: "Reset",
                    click: resetDialog
                },
                {
                    id: "button-save",
                    text: "Save",
                    click: storeNewShortcuts
                },
                {
                    id: "button-cancel",
                    text: "Cancel",
                    click: closeDialog
                }
            ]
        });

        $("#opencfg_"+sCfgName).on("click", openDialog); // on any subsequent clicks, open the configuration dialog again
        openDialog();                               // and right now, finally open the dialog
    }

    function openDialog() {
        $( sDlgName ).dialog('open');       // open the dialog again
        eDlg = $(sDlgName)[0];              // finally caching the element for performance
        $(window).off('keydown.wrangling'); // stop listening to the wrangling shortcuts while we reconfigure them

        // users can click into a field and hit the combo they want to use
        $(eDlg).on('keydown.shortcuts', "input.typeshortcut", function(e) {
            let field = e.target;

            // when a user deletes a previously stored config, we don't want to show an error
            if (e.key == "Backspace" || e.key == "Delete") {
                e.target.value = "";
                hideHint(e.target);
                dupeCheck(e.target);
            }

            // skipping if it's a special key (e.g. Enter) or if none/several modifiers are pressed at the same time
            // if JS is asked to add up booleans like e.altKey etc, it treats them as 0 and 1: true+true+false = 1+1+0 = 2
            if ( e.key.length > 1 || (e.altKey + e.ctrlKey + e.metaKey) !== 1 ) return;

            // if this is a valid new combo, we don't want the browser to react to it (e.g. open a menu item)
            e.preventDefault();
            e.stopPropagation();

            // combine into the 3-letter combo that we'll store and compare later
            // value of e.key is uppercase when shift is pressed, so we have to normalize
            e.target.value = `${e.altKey ? "A" : e.ctrlKey ? "C" : "M"}${e.shiftKey ? "S": " "}${e.key.toLowerCase()}`;

            // remove any previous hints for incorrect input
            hideHint(e.target);

            // if any combo is a duplicate on the same page (ignoring the empty ones), we throw an error
            dupeCheck(e.target);
        });

        // users can enable/disable shortcuts for tags and we have to re-run the dupecheck
        $(eDlg).on('change.shortcuts', "input[type='checkbox']", function(e) {
            dupeCheck(e.target);
        });

        // as the browser recognizes the value of the input changed (when a letter/number is typed), we check what was entered for validity
        $(eDlg).on('input.shortcuts', "input.typeshortcut", function(e) {
            // if what was entered wasn't a proper combo (like, simply typing in the field)
            if (!e.target.value.match(/^[CAM][S ][a-z]$/)) {
                e.target.value = "";   // empty it out
                showHint(e.target);    // show a hint to user
            }
        });

        // event triggers if addmore button is clicked
        $( eDlg ).on("click.addmore", "#addmore", (e)=>{
            e.preventDefault();
            let prevrow = $( e.target ).prev().find('tr:last-of-type');

            // grab the previous row's ac#/af# and increment by one
            let next = $( prevrow ).find('input.typeshortcut').attr('name');
            next = parseInt(next.match(/\d+/)[0])+1;

            // clone the last row and just re-number it
            let newrow = prevrow.clone(true, true).get(0);
            newrow.innerHTML = newrow.innerHTML.replace(/"(af|ac)\d+\[/g, `"$1${next}[`);

            // add a new line in the table
            $( prevrow ).after(newrow);
        });
    }

    // if the window resizes the dialog would move off of the screen
    $(window).on('resize', function(e) {
        if ($(eDlg).dialog("isOpen")) { // don't need to worry about this if the dialog wasn't opened before

            // optimizing the size of the GUI in case it's a mobile device
            let dialogwidth = parseInt($("body").css("width")); // parseInt ignores letters (px)
            dialogwidth = dialogwidth > 700 ? 700 : dialogwidth * 0.9;

            let maxheight = parseInt($("body").css("height"));

            $(eDlg).dialog("option", "width", dialogwidth) // resize the dialog
                   .dialog("option", "position", {my:"center top", at: "center top", of: window} ); // reposition the dialog

        }
    });

    function closeDialog() {
        $(eDlg).off('keydown.shortcuts'); // stop listening to the config shortcut inputs
        $(eDlg).off('input.shortcuts');   // stop checking inputs for validity of values
        $(eDlg).find("#addmore").off("click.addmore");        // stop listening to Add More button clicks
        if ((mShortcuts.Action.size + mShortcuts.Fandom.size + mShortcuts.Canonical.size) > 0)
            $(window).on('keydown.wrangling', validateKey); // listening to the user's keystrokes again
        $( eDlg ).dialog( "close" );
    }

    function resetDialog() {
        // we ask one more time in case it was an accident, but then we empty out all key-combo fields
        if (confirm("Are you sure you want to delete all configured shortcuts?\nPress OK to proceed.")) {
            $(eDlg).find('input.typeshortcut, input.typetag').prop('value', "");
            $(eDlg).find('input[type="checkbox"]').prop('checked', false);
        }
        // we don't store or close the dialog, so users still have to click Save (or Cancel)
    }

    function dupeCheck(element) {

        // reset all errors for a moment, we start fresh
        $(eDlg).find('.ui-tabs-tab, .typeshortcut').removeClass('ui-state-error');
        $(eDlg).find('#dupewarning').remove();
        $('#button-save').button('enable');

        ['B', 'E', 'C', 'L', 'S', 'N'].forEach( (page) => {

            // grab all shortcut inputs for this page (in case of tags: only if tag shortcuts are enabled for this page)
            let combos = $(eDlg).find(`input.typeshortcut[name^="${page}-"]`); // action
            if ($(eDlg).find(`input[type="checkbox"][name^="${page}-a_f"]`).prop('checked')) combos = $(combos).add('input.typeshortcut[name^="af"]', eDlg); // fandom tags
            if ($(eDlg).find(`input[type="checkbox"][name^="${page}-a_c"]`).prop('checked')) combos = $(combos).add('input.typeshortcut[name^="ac"]', eDlg); // canonical tags

            // reduce to those where a shortcut was entered
            combos = $(combos).filter(function() { return $(this).prop('value').length > 0 });

            // make shortcut combos unique with Set() and check if it's now fewer entries -> there were duplicates
            let allkbd = $(combos).toArray().map((inp) => inp.value);
            let uniquekbd = new Set( allkbd );
            if (uniquekbd.size !== allkbd.length) {

                // general errors reporting: highlight this tab, show the error message, disable the save button
                $(eDlg).find(`a[href^="#tab-${page.toLowerCase()}"]`).parent().addClass('ui-state-error');
                // only add the error message at bottom if it's not already shown
                if ($(eDlg).find('#dupewarning').length == 0) {
                    $(eDlg).find('form').append(`
                        <div id="dupewarning" class="ui-state-error ui-corner-all" style="padding: 0.2em 0.5em;"><span class="ui-icon ui-icon-alert"></span>
                        You configured multiple actions with the same shortcut on a page. Please check your configuration!</div>`);
                }
                $(eDlg).find('#button-save').button('disable');

                // we remove all entries in uniquekbd from the list of combos ONCE. anything that remains is a duplicate
                let dupes = new Set( allkbd.filter((inp) => !uniquekbd.delete(inp)) );
                $(combos).filter( (ix, inp) => dupes.has($(inp).prop('value')) ).addClass('ui-state-error');
            }
        });
    }

    function showHint(element) {
        // only add the hint if it's not already shown
        if ($(element).parent().next().find('.ui-state-highlight').length == 0) $(element).parent().next().append(`
            <div class="ui-state-highlight ui-corner-all" style="padding: 0.2em 0.5em;"><span class="ui-icon ui-icon-info"></span>
            Please use the Ctrl, Alt or Meta key in your shortcut!</div>`);
    }
    function hideHint(element) {
        $(element).parent().next().find('.ui-state-highlight').remove();
    }

    /***************** STORAGE *****************/

    function loadPageShortcuts() {
        // the shortcuts map we build up on page load only contains those which pertain to the viewed page type
        // that allows us to store the same shortcut for different actions on different pages - if we only load this page, there won't be duplicates
        let cfgs = { Action: new Map(), Fandom: new Map(), Canonical: new Map() };

        // load actions stored as shortcut -> action
        let empty = { B: [], E: [], L: [], C: [], S: [], N: [] };
        let storage = JSON.parse(localStorage.getItem(sCfgName+'_act') || JSON.stringify(empty) );
        cfgs.Action = new Map(storage[cPage]);

        // load tags stored as shortcut -> tag (and the pages where they are enabled)
        empty = { Fan: [], Can: [], FPage: "", CPage: "", NewTab: "Y" };
        storage = JSON.parse(localStorage.getItem(sCfgName+'_tag') || JSON.stringify(empty) );

        // the page we're on: B, E, or S - only return tags (fandom or canonicals) if enabled on the page
        if (storage.FPage.includes(cPage)) cfgs.Fandom = new Map(storage.Fan);
        if (storage.CPage.includes(cPage)) cfgs.Canonical = new Map (storage.Can);

        cfgs.NewTab = storage.NewTab;

        return cfgs;
    }

    function loadAllActions() {

        // what's all supported?
        const available = {
                            L: { "o_e": ["open Tag Edit page", ""],
                                 "o_t": ["open Comments page", ""],
                                 "o_w": ["open Works page", ""],
                                 "o_m": ["open Mergers page", ""],
                                 "o_c": ["open Canonical Tag's page", ""] },
                            B: { "c_w": ["click the 'Wrangle' button", ""],
                                 "f_f": ["focus on the Fandom text field", ""],
                                 "f_s": ["focus on the Synonym Of text field<br/>(if you have the Wrangle from the Bin script)", ""],
                                 "c_s": ["submit the Synonym Of<br/>(if you have the Wrangle from the Bin script)", ""] },
                            E: { "o_t": ["open Comments page", ""],
                                 "o_w": ["open Works page", ""],
                                 "o_m": ["open Mergers page", ""],
                                 "o_c": ["open Canonical Tag's page", ""],
                                 "c_s": ["click the 'Save' button", ""],
                                 "c_k": ["toggle the Canonical checkbox", ""],
                                 "c_u": ["toggle the Unwragleable checkbox", ""],
                                 "c_af": ["toggle all Fandoms' checkboxes (select all/none)", ""],
                                 "c_ac": ["toggle all Characters' checkboxes (select all/none)", ""],
                                 "c_ar": ["toggle all Relationships' checkboxes (select all/none", ""],
                                 "c_am": ["toggle all Metatags' checkboxes (select all/none)", ""],
                                 "c_asub": ["toggle all Subtags's checkboxes (select all/none)", ""],
                                 "c_asyn": ["toggle all Synonyms' checkboxes (select all/none)", ""],
                                 "f_s": ["focus on the Synonym Of text field", ""],
                                 "f_t": ["focus on the Tag Name text field", ""],
                                 "f_f": ["focus on the Add Fandom text field", ""],
                                 "f_c": ["focus on the Add Character text field", ""],
                                 "f_m": ["focus on the Add Metatag text field", ""],
                                 "f_sub": ["focus on the Add Subtag text field", ""],
                                 "f_syn": ["focus on the Add Synonym text field", ""],
                                 "c_cf": ["copy all Fandoms<br/>(if you have the Copy Characters & Syns To Clipboard script)", ""],
                                 "c_cc": ["copy all Characters<br/>(if you have the Copy Characters & Syns To Clipboard script)", ""],
                                 "c_cr": ["copy all Relationships<br/>(if you have the Copy Characters & Syns To Clipboard script)", ""],
                                 "c_cs": ["copy all Synonyms<br/>(if you have the Copy Characters & Syns To Clipboard script)", ""] },
                            S: { "c_s": ["click the 'Search' button", ""],
                                 "f_t": ["focus on the Tag Name text field", ""],
                                 "f_f": ["focus on the Fandom text field", ""] },
                            N: { "c_s": ["click the 'Create Tag' button", ""],
                                 "f_t": ["focus on the Tag Name text field", ""],
                                 "c_k": ["toggle the Canonical checkbox", ""],
                                 "c_f": ["select the Tag Type: Fandom radio button", ""],
                                 "c_c": ["select the Tag Type: Character radio button", ""],
                                 "c_r": ["select the Tag Type: Relationship radio button", ""],
                                 "c_a": ["select the Tag Type: Additional Tag radio button", ""] },
                            C: { "o_e": ["open Tag Edit page", ""],
                                 "o_w": ["open Works page", ""],
                                 "o_m": ["open Mergers page", ""],
                                 "c_s": ["click the 'Comment' button", ""],
                                 "f_c": ["focus on the Comment text field", ""] }
                          }

        // grab what's been configured so far -- this is stored in reverse, as { page: { ["shortcut", "action"],... } }
        // because we need it searchable by shortcut on most page loads, and only need the reverse if the config dialog is opened
        let empty = { B: [], E: [], L: [], C: [], S: [], N: [] };
        let storage = JSON.parse(localStorage.getItem(sCfgName+'_act') || JSON.stringify(empty) );

        // run through what's been configured and apply it to the corresponding available actions so it becomes action -> shortcut
        for (const [p, v] of Object.entries(storage)) {   // walk through each page
            for (const e of v.values()) {                 // walk through each [shortcuts, action] within page
                available[p][e[1]][1] = e[0];             // sets stored keyboard combo in corresponding available[] entry
            }
        }
        return available;
    }

    function loadAllTags() {
        // load what's been stored as shortcut -> tag (and the pages where they are enabled)
        let empty = { Fan: [], Can: [], FPage: "", CPage: "", NewTab: "Y" };
        let storage = JSON.parse(localStorage.getItem(sCfgName+'_tag') || JSON.stringify(empty) );
        return storage;
    }

    function storeNewShortcuts() {
        // regular action shortcuts
        let kbd = { B: [], E: [], L: [], C: [], S: [], N: [] };

        // grabbing the input fields with content
        let cfgs = $(eDlg).find('#tabs input.typeshortcut').filter(function() { return $(this).prop('value').length > 0 });

        // in the end, we want again something as { page: [ ["shortcut", "action"] ] }
        $(cfgs).each(function() {
            let cfg = [$(this).prop('value'), $(this).prop('name').slice(2)];
            let page = $(this).prop('name').slice(0,1);
            kbd[page].push(cfg);
        });

        localStorage.setItem(sCfgName+'_act', JSON.stringify(kbd));

        // now the tag shortcuts
        kbd = { Fan: [], Can: [], FPage: "", CPage: "", NewTab: "Y" }

        // grabbing checkbox about where to open the o_X page links
        kbd.NewTab = $(eDlg).find('#link-tab').prop('checked') ? "Y" : "N";

        // grabbing the pages on which we're enabling tag shortcuts
        cfgs = $(eDlg).find('input[id$="a_f"], input[id$="a_c"]').filter(function() { return $(this).prop('checked') });
        $(cfgs).each(function() {
            let page = $(this).prop('name').slice(0,1);
            let type = $(this).prop('name').slice(-1).toUpperCase() + "Page";
            kbd[type] += page;
        });

        // grabbing the configured tags and their shortcuts
        cfgs = $(eDlg).find('#addtags tr');
        $(cfgs).each(function() {
            let type = $(this).find('input.typetag').prop('name').slice(0,2) == "af" ? "Fan" : "Can";
            let cfg = [$(this).find('input.typeshortcut').prop('value'), $(this).find('input.typetag').prop('value')];
            if (cfg[1] !== "") kbd[type].push(cfg); // store it only if a tag was entered. we can store tag without shortcut (then it won't be used)
        });

        localStorage.setItem(sCfgName+'_tag', JSON.stringify(kbd));
        mShortcuts = loadPageShortcuts(); // reload with new values in case they changed

        closeDialog();
    }

    function migrateStorage() {
        localStorage.removeItem('kbdshortcuts');
        localStorage.removeItem('kbdpages');
        // I really considered writing a huge migration logic, but holy cow that would've been extensive. I'm sorry.
    }

    /***************** SHORTCUT HANDLING *****************/

    // basic functions that interact with the elements
    const clickButton = el => el.click();
    const focusOnField = el => el.focus();
    const checkBox = el => el.click();
    const addTag = (el, tag) => {
        el.focus();
        el.value = tag;
        el.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 13, key: "Enter" }));
    }

    function validateKey(e) {
        // skipping if it's a special key (e.g. Enter) or if none/several modifiers are pressed at the same time
        if ( e.key.length > 1 || (e.altKey + e.ctrlKey + e.metaKey) !== 1 ) return;

        // combine into something easier to compare to an array of stored shortcuts
        // value of e.key is uppercase when shift is pressed, so we have to normalize
        let pressed = `${e.altKey ? "A" : e.ctrlKey ? "C" : "M"}${e.shiftKey ? "S": " "}${e.key.toLowerCase()}`;
        //console.log(pressed, mShortcuts);

        // if that combo isn't configured anywhere, we skip
        if (!mShortcuts.Action.has(pressed) && !mShortcuts.Fandom.has(pressed) && !mShortcuts.Canonical.has(pressed)) return;

        // if this is one of our combos, we don't want the browser to react to it (e.g. open a menu item)
        e.preventDefault();
        e.stopPropagation();

        // now we gotta determine what we're supposed to do... a combo of page type + action to perform
        let action = mShortcuts.Fandom.has(pressed) ? 'a_f,'+mShortcuts.Fandom.get(pressed) :
                     mShortcuts.Canonical.has(pressed) ? 'a_c,'+mShortcuts.Canonical.get(pressed) :
                     mShortcuts.Action.get(pressed);

        if (action.startsWith("o_")) openPage(action); // openPage is separate because it's too similar on all pages
        else {
            switch (cPage) {
                case "B": handleBin(action);      break;
                case "E": handleEdit(action);     break;
                case "L": handleLanding(action);  break;
                case "S": handleSearch(action);   break;
                case "N": handleNew(action);      break;
                case "C": handleComments(action); break;
                default: break;
            }
        }
    }

    function openPage(a) {
        // with cPage we'll determine how to find the plain link to the tag in question
        let url = cPage == "L" ? window.location.href : $('#main > .heading a.tag').prop('href');

        // a defines the page we're trying to open (for canonicals we don't need to add anything at the end, they already lead to /edit pages)
        let end = a == "o_e" ? "/edit" :
                  a == "o_t" ? "/comments" :
                  a == "o_w" ? "/works" :
                  a == "o_m" ? "/wrangle?page=1&show=mergers" : "";

        // unless we're loading the canonical of a viewed syn!
        if (a == "o_c") {
            // bow out gracefully if the viewed tag isn't a syn, and therefore no canonical exists
            if ( (cPage == "L" && $('div.merger').length == 0) || (cPage == "E" && $('input#tag_syn_string ~ p.actions a').length == 0) ) {
                console.log(`Wrangling Shortcuts: You tried to open the canonical tag's page, but this tag isn't synned anywhere`);
                return;
            }
            // if a canonical exists, we grab that tag's URL from the link/button
            url = cPage == "L" ? $('div.merger p a').prop('href')+"/edit" :
                  cPage == "E" ? $('input#tag_syn_string ~ p.actions a').prop('href') : "";
        }

        let target = mShortcuts.NewTab == "Y" ? "_blank" : "_self";

        if (url !== "") window.open(url+end, target);
        else console.log(`Wrangling Shortcuts: You tried to go somewhere but I couldn't find the link`);
    }
    function handleLanding(a) {
        // nothing to do here. the only supported actions are going to other pages, so we shouldn't ever get to this function
        console.log(`Wrangling Shortcuts: You tried to do an action (${a}) that's not supported on the Landing Page`);
    }
    function handleBin(a) {
        if      (a == "c_w")  clickButton($("#wrangulator p.submit input[type='submit']")[0]); // mass-wrangle tags
        else if (a == "f_f")  focusOnField($("#fandom_string_autocomplete")[0]);               // fandoms field
        else if (a.startsWith("a_f")) {
            let tag = a.slice(4); // first four letters shaved off gives us the tag we're trying to add
            addTag($("#fandom_string_autocomplete")[0], tag);
        }
        // the following only work if you use the script Wrangle Stright From The Bins
        else if (a == "f_s" && $("#syn_tag_autocomplete_autocomplete").length > 0)  focusOnField($("#syn_tag_autocomplete_autocomplete")[0]);        // syns field
        else if (a == "c_s" && $("button[name='wrangle_existing']").length > 0)     clickButton($("button[name='wrangle_existing']")[0]);            // submit syns
        else if (a.startsWith("a_c") && $("#syn_tag_autocomplete_autocomplete").length > 0) {
            let tag = a.slice(4); // first four letters shaved off gives us the tag we're trying to add
            addTag($("#syn_tag_autocomplete_autocomplete")[0], tag);
        }
        else console.log(`Wrangling Shortcuts: You tried to do an action (${a}) that's not supported on the Bin Page`);
    }
    function handleEdit(a) {
        if      (a == "c_k")    clickButton($("#tag_canonical")[0]);                                                            // canonical checkbox
        else if (a == "c_u")    clickButton($("#tag_unwrangleable")[0]);                                                        // unwrangleable checkbox
        else if (a == "c_s")    clickButton($("#edit_tag p.submit input[type='submit']")[0]);                                   // save changes
        else if (a == "c_af")   clickButton($("#parent_Fandom_associations_to_remove_checkboxes input[type='checkbox']"));      // toggle all fandoms
        else if (a == "c_ac")   clickButton($("#parent_Character_associations_to_remove_checkboxes input[type='checkbox']"));   // toggle all chars
        else if (a == "c_ar")   clickButton($("#child_Relationship_associations_to_remove_checkboxes input[type='checkbox']")); // toggle all rels
        else if (a == "c_am")   clickButton($("#parent_MetaTag_associations_to_remove_checkboxes input[type='checkbox']"));     // toggle all metatags
        else if (a == "c_asub") clickButton($("#child_SubTag_associations_to_remove_checkboxes input[type='checkbox']"));       // toggle all subtags
        else if (a == "c_asyn") clickButton($("#child_Merger_associations_to_remove_checkboxes input[type='checkbox']"));       // toggle all syns
        else if (a == "f_s")    focusOnField($("#tag_syn_string_autocomplete")[0]);                                             // Syn Of field
        else if (a == "f_t")    focusOnField($("#tag_name")[0]);                                                                // tag name field
        else if (a == "f_f")    focusOnField($("#tag_fandom_string_autocomplete")[0]);                                          // fandoms textfield
        else if (a == "f_c")    focusOnField($("#tag_character_string_autocomplete")[0]);                                       // characters textfield
        else if (a == "f_m")    focusOnField($("#tag_meta_tag_string_autocomplete")[0]);                                        // metatags textfield
        else if (a == "f_sub")  focusOnField($("#tag_sub_tag_string_autocomplete")[0]);                                         // subtags textfield
        else if (a == "f_syn")  focusOnField($("#tag_merger_string_autocomplete")[0]);                                          // syns/mergers textfield
        else if (a.startsWith("a_f")) {                                                                                         // add tag in Fandom field
            let tag = a.slice(4); // first four letters shaved off gives us the tag we're trying to add
            addTag($("#tag_fandom_string_autocomplete")[0], tag);
        }
        else if (a.startsWith("a_c")) {                                                                                         // add tag in Syn Of field
console.log(a);
            let tag = a.slice(4); // first four letters shaved off gives us the tag we're trying to add
            addTag($("#tag_syn_string_autocomplete")[0], tag);
        }
        // the following only work if you use the script "Copy Characters & Syns To Clipboard"
        // they're the only <button> within the .actions bar
        else if (a == "c_cf" && $("#parent_Fandom_associations_to_remove_checkboxes").parent().find(".actions button").length > 0)
            clickButton($("#parent_Fandom_associations_to_remove_checkboxes").parent().find(".actions button")[0]);                       // copy all fandoms
        else if (a == "c_cc" && $("#parent_Character_associations_to_remove_checkboxes").parent().find(".actions button").length > 0)
            clickButton($("#parent_Character_associations_to_remove_checkboxes").parent().find(".actions button")[0]);                    // copy all chars
        else if (a == "c_cr" && $("#child_Relationship_associations_to_remove_checkboxes").parent().find(".actions button").length > 0)
            clickButton($("#child_Relationship_associations_to_remove_checkboxes").parent().find(".actions button")[0]);                  // copy all rels
        else if (a == "c_cs" && $("#child_Merger_associations_to_remove_checkboxes").parent().find(".actions button").length > 0)
            clickButton($("#child_Merger_associations_to_remove_checkboxes").parent().find(".actions button")[0]);                        // copy all syns
        else console.log(`Wrangling Shortcuts: You tried to do an action (${a}) that's not supported on the Edit Page`);
    }
    function handleSearch(a) {
        if      (a == "c_s") clickButton($("#new_tag_search p.submit input[type='submit']")[0]);     // start search
        else if (a == "f_t") focusOnField($("#new_tag_search #tag_search_name")[0]);                 // focus on tag name field
        else if (a == "f_f") focusOnField($("#new_tag_search #tag_search_fandoms_autocomplete")[0]); // focus on fandom field
        else if (a.startsWith("a_f")) {                                                              // add tag in Fandom field
            let tag = a.slice(4); // first four letters shaved off gives us the tag we're trying to add
            addTag($("#new_tag_search #tag_search_fandoms_autocomplete")[0], tag);
        }
        else console.log(`Wrangling Shortcuts: You tried to do an action (${a}) that's not supported on the Tag Search Page`);
    }
    function handleNew(a) {
        if      (a == "c_s") clickButton($("#new_tag p.submit input[type='submit']")[0]); // submit new tag
        else if (a == "f_t") focusOnField($("#tag_name")[0]);                             // focus on tag name field
        else if (a == "c_k") clickButton($("#tag_canonical")[0]);                         // toggle canonical checkbox
        else if (a == "c_f") clickButton($("#tag_type_fandom")[0]);                       // select fandom radiobutton
        else if (a == "c_c") clickButton($("#tag_type_character")[0]);                    // select character radiobutton
        else if (a == "c_r") clickButton($("#tag_type_relationship")[0]);                 // select relationship radiobutton
        else if (a == "c_a") clickButton($("#tag_type_freeform")[0]);                     // select additional tag radiobutton
        else console.log(`Wrangling Shortcuts: You tried to do an action (${a}) that's not supported on the New Tag Page`);
    }
    function handleComments(a) {
        if      (a == "c_s") clickButton($("#add_comment p.submit input[type='submit']")[0]); // submit comment
        else if (a == "f_c") focusOnField($("#add_comment textarea")[0]);                     // focus on toplevel comment textarea
        else console.log(`Wrangling Shortcuts: You tried to do an action (${a}) that's not supported on the Comments Page`);
    }

})(jQuery);