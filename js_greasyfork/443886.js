// ==UserScript==
// @name         AO3: [Wrangling] Smaller Tag Search
// @namespace    https://greasyfork.org/en/users/906106-escctrl
// @version      7.1
// @description  makes the Tag Search form take up less space (best on desktop/landscape screens)
// @author       escctrl
// @match        *://*.archiveofourown.org/tags/search*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.1/jquery.min.js
// @require      https://ajax.googleapis.com/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js
// @require      https://update.greasyfork.org/scripts/491888/1355841/Light%20or%20Dark.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/443886/AO3%3A%20%5BWrangling%5D%20Smaller%20Tag%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/443886/AO3%3A%20%5BWrangling%5D%20Smaller%20Tag%20Search.meta.js
// ==/UserScript==

/* eslint-disable no-multi-spaces */
/* global jQuery, lightOrDark */

(function($) {
    'use strict';

    // --- THE USUAL INIT STUFF AT THE BEGINNING -------------------------------------------------------------------------------

    // on retry later, break off the rest of this script to avoid console errors
    if ($('#new_tag_search').length == 0) return;

    $("head").append(`<style type="text/css">#new_tag_search, #smallertagsearch { svg { 
        font-size: 1.2em; width: 1em; height: 1em; display: inline-block; vertical-align: -0.15em; }
    }`);

    let cfg = 'smallertagsearch'; // name of dialog and localstorage used throughout
    let dlg = '#'+cfg;

    /* *** EXAMPLE STORAGE: equivalent of a Map() with settings for reducing size and default selections on pageload
        settings = [ ["text","1"],["labels", "n"],["tag","b"],["sort","b"],["btntag", "t"],["btnsort", "i"],
                     ["deftype","Freeform"],["defstatus",""],["defsortby","name"],["defsortdir","asc"]
                   ];

        text: (1) next to each other, (2) below each other with labels
        tag & sort labels (above options): (y) yes, (n) no
        tag show as: (b) buttons, (s) select
        tag button has: (i) icon, (t) text, (b) both
        sort show as: (b) buttons, (s) select, (h) hide
        sort button has: (i) icon, (t) text, (b) both
    */
    let settings = loadConfig();

    // config migration
    if (settings.get('defstatus') === 'T') settings.set('defstatus', 'canonical');
    else if (settings.get('defstatus') === 'F') settings.set('defstatus', 'noncanonical');
    if (settings.get('btntxt') !== undefined) {
        if (settings.get('btntxt') === 'y') { settings.set('btntag', 'b'); settings.set('btnsort', 'b'); }
        else { settings.set('btntag', 'i'); settings.set('btnsort', 'i'); }
    }

    // display text/icon for search parameters
    let faicons = createIconSet();
    var type_alias = new Map([['Fandom',       ['Fandom',       faicons.Fandom]],
                              ['Character',    ['Character',    faicons.Character]],
                              ['Relationship', ['Relationship', faicons.Relationship]],
                              ['Freeform',     ['Freeform',     faicons.Freeform]],
                              ['UnsortedTag',  ['Unsorted',     faicons.UnsortedTag]],
                              ['',             ['Any Type',     faicons.any]]]);

    var stat_alias = new Map([['canonical',                  ['Canonical',         faicons.canonical,    'Canonicals']],
                              ['noncanonical',               ['Not canonical',     faicons.noncanonical, 'Any except Canonicals']],
                              ['synonymous',                 ['Syns',              faicons.merge,        'Synonyms']],
                              ['canonical_synonymous',       ['In Filters',        faicons.funnel,       'Canonicals or Synonyms (appearing in filters)']],
                              ['noncanonical_nonsynonymous', ['Unfiltered',        faicons.lowvis,       'Any except Canonicals or Synonyms (not appearing in filters)']],
                              ['',                           ['Any Status',        faicons.any,          'Any wrangling status']]]);

    var sort_alias = new Map([["name",       ["Name",          faicons.name.by]],
                              ["created_at", ["Creation Date", faicons.created.by]],
                              ["uses",       ["Uses",          faicons.uses.by]]]);

    // ASC/DESC translation for the different sort options: x -> [ASC, icon for ASC, DESC, icon for DESC]
    var dir_alias = new Map([["name",       ["A → Z",           faicons.name.asc,    "Z → A",           faicons.name.desc]],
                             ["created_at", ["oldest → newest", faicons.created.asc, "newest → oldest", faicons.created.desc]],
                             ["uses",       ["fewest → most",   faicons.uses.asc,    "most → fewest",   faicons.uses.desc]]]);

    let getAscDescAlias = (by, dir) => dir_alias.get(by)[ (dir == "asc" ? 0 : 2) ]; // function to retrieve readable name based on which sort-by is selected
    let getAscDescIcon  = (by, dir) => dir_alias.get(by)[ (dir == "asc" ? 1 : 3) ]; // function to retrieve matching icon based on which sort-by is selected

    // figure out which option currently needs to be selected, based on search parameters in the URL vs. configured defaults
    var opt_selected = new Map();
    let params = new URLSearchParams(document.location.search);
    ["tag_search[type]", "tag_search[wrangling_status]", "tag_search[sort_column]", "tag_search[sort_direction]"].forEach((name) => {
        // if we've already done a search, select that option again
        if (params.size !== 0) {
            if (params.get(name)) opt_selected.set(name, params.get(name)); // if this parameter was actually part of the URL
            else { // otherwise go with what AO3 selects as defaults on partial search strings
                switch (name) {
                    case "tag_search[type]":
                    case "tag_search[wrangling_status]":
                        opt_selected.set(name, "");
                        break;
                    case "tag_search[sort_column]": opt_selected.set(name, "name"); break;
                    case "tag_search[sort_direction]": opt_selected.set(name, "asc"); break;
                    default: break;
                }
            }
        }
        // otherwise pick the configured defaults
        else {
            switch (name) {
                case "tag_search[type]": opt_selected.set(name, settings.get("deftype")); break;
                case "tag_search[wrangling_status]": opt_selected.set(name, settings.get("defstatus")); break;
                case "tag_search[sort_column]": opt_selected.set(name, settings.get("defsortby")); break;
                case "tag_search[sort_direction]": opt_selected.set(name, settings.get("defsortdir")); break;
                default: break;
            }
        }
    });

    // --- CONFIGURATION DIALOG HANDLING -------------------------------------------------------------------------------

    createDialog();

    function createDialog() {

        // adding the jQuery stylesheet to style the dialog, and fixing the interference of AO3's styling
        if(document.head.querySelector('link[href$="/jquery-ui.css"]') === null) {
            // if the background is dark, use the dark UI theme to match
            let dialogtheme = lightOrDark($('body').css('background-color')) == "dark" ? "dark-hive" : "base";
            $("head").append(`<link rel="stylesheet" href="https://code.jquery.com/ui/1.13.2/themes/${dialogtheme}/jquery-ui.css">`);
        }
        $("head").append(`<style type="text/css">.ui-widget, ${dlg}, .ui-dialog .ui-dialog-buttonpane button {font-size: revert; line-height: 1.286;}
        ${dlg} form {box-shadow: revert; cursor:auto;}
        ${dlg} fieldset {background: revert; box-shadow: revert; margin-left: 0; margin-right: 0;}
        ${dlg} legend {font-size: inherit; height: auto; width: auto; opacity: inherit;}
        ${dlg} fieldset p { padding-left: 0; padding-right: 0; }
        ${dlg} select { vertical-align: baseline; width: auto; }
        ${dlg} #tagsearchdefaults label { width: 9em; display: inline-block; }
        </style>`);

        // wrapper div for the dialog
        $("#main").append(`<div id="${cfg}"></div>`);

        let selected = 'selected="selected"';
        let checked = 'checked="checked"';

        let deftype = "", defstatus = "", defsort = "", wstatshow = "";
        let hidewstat = settings.get("hidewstat")?.split(",") || []; // wrangling status options which user chose to hide
        type_alias.forEach(
            (v, k) => { deftype += `<option value="${k}" ${k === settings.get("deftype") ? selected : ""}>${v[0]}</option>`; }
        );
        stat_alias.forEach(
            (v, k) => {
                defstatus += `<option value="${k}" ${k === settings.get("defstatus") ? selected : ""}>${v[0]}</option>`;
                if (k !== "") wstatshow += `<label for="tagsearchdisplay_wstat_${k}" title="${v[2]}">${v[1]} ${v[0]}</label><input
                                            type="checkbox" name="tagsearchdisplay_wstat_${k}" id="tagsearchdisplay_wstat_${k}" ${hidewstat.includes(k) ? "" : checked}>`;
            }
        );
        sort_alias.forEach(
            (v, k) => { defsort += `<option value="${k}-asc" ${k === settings.get("defsortby") && settings.get("defsortdir") === "asc" ? selected : ""}>${v[0]}, ${getAscDescAlias(k, 'asc')}</option>
                                    <option value="${k}-desc" ${k === settings.get("defsortby") && settings.get("defsortdir") === "desc" ? selected : ""}>${v[0]}, ${getAscDescAlias(k, 'desc')}</option>`; }
        );

        $(dlg).html(`<form>
            <fieldset><legend>Display</legend>
                <p><label for="tagsearchdisplay_text">Show "Tag name" and "Fandoms" input fields</label>
                    <select name="tagsearchdisplay_text" id="tagsearchdisplay_text">
                        <option value="1" ${settings.get('text')==="1" ? selected : ""}>next to each other, without labels</option>
                        <option value="2" ${settings.get('text')==="2" ? selected : ""}>below each other, with labels</option>
                    </select>
                </p>
                <p>
                    <label for="tagsearchdisplay_labels">Show labels above all button/dropdown options</label>
                    <input type="checkbox" name="tagsearchdisplay_labels" id="tagsearchdisplay_labels" ${settings.get('labels') === "y" ? checked : ""}>
                </p>
                <p ${settings.get('btntag')==="t" && settings.get('btnsort')==="t" ? 'style="display: none;"' : ""}>
                    <label for='tagsearchdisplay_iconset'>For icons, use the style of</label>
                    <select name='tagsearchdisplay_iconset' id='tagsearchdisplay_iconset'>
                        <option value="lucide" ${settings.get('iconset') === "lucide" ? "selected='selected'" : ""}>Lucide (outline)</option>
                        <option value="fa" ${(settings.get('iconset') !== "lucide") ? "selected='selected'" : ""}>Fontawesome (solid)</option>
                    </select>
                </p>
            </fieldset>
            <fieldset><legend>Tag Type and Status</legend>
                <p class="radiocontrol">Show the Tag Type and Status options as<br />
                    <label for="tag_buttons">${faicons.toggle} Buttons</label><input type="radio" name="tagsearchdisplay_tag" id="tag_buttons" value="b" ${settings.get('tag') === "b" ? checked : ""}>
                    <label for="tag_select">${faicons.dropdown} Dropdown</label><input type="radio" name="tagsearchdisplay_tag" id="tag_select" value="s" ${settings.get('tag') === "s" ? checked : ""}>
                </p>
                <p id="linked_tag_buttons" ${settings.get('tag') === "b" ? "" : 'style="display: none;"'}>
                    <label for="tagsearchdisplay_btntag">Show the buttons with</label>
                    <select name="tagsearchdisplay_btntag" id="tagsearchdisplay_btntag">
                        <option value="t" ${settings.get('btntag')==="t" ? selected : ""}>text</option>
                        <option value="i" ${settings.get('btntag')==="i" ? selected : ""}>icon</option>
                        <option value="b" ${settings.get('btntag')==="b" ? selected : ""}>icon + text</option>
                    </select>
                </p>
                <p id="tagsearchwranglingstatus">Choose which Tag Status options to display. "Any" will always be displayed.<br />
                    ${ wstatshow }
                </p>
            </fieldset>
            <fieldset><legend>Sort By and Direction</legend>
                <p class="radiocontrol">Show the Sort By and Direction options as<br />
                    <label for="sort_buttons">${faicons.toggle} Buttons</label><input type="radio" name="tagsearchdisplay_sort" id="sort_buttons" value="b" ${settings.get('sort') === "b" ? checked : ""}>
                    <label for="sort_select">${faicons.dropdown} Dropdown</label><input type="radio" name="tagsearchdisplay_sort" id="sort_select" value="s" ${settings.get('sort') === "s" ? checked : ""}>
                    <label for="sort_hide">${faicons.hidden} Hidden</label><input type="radio" name="tagsearchdisplay_sort" id="sort_hide" value="h" ${settings.get('sort') === "h" ? checked : ""}>
                </p>
                <p id="linked_sort_buttons" ${settings.get('sort') === "b" ? "" : 'style="display: none;"'}>
                    <label for="tagsearchdisplay_btnsort">Show the buttons with</label>
                    <select name="tagsearchdisplay_btnsort" id="tagsearchdisplay_btnsort">
                        <option value="t" ${settings.get('btnsort')==="t" ? selected : ""}>text</option>
                        <option value="i" ${settings.get('btnsort')==="i" ? selected : ""}>icon</option>
                        <option value="b" ${settings.get('btnsort')==="b" ? selected : ""}>icon + text</option>
                    </select>
                </p>
            </fieldset>
            <fieldset id='tagsearchdefaults'>
                <legend>Defaults</legend>
                <p>Pick defaults for the tag type, wrangling status, and sort order.</p>
                <label for="deftype">Tag Type</label>
                <select name="tagsearchdefault_type" id="deftype">
                  ${ deftype }
                </select><br />
                <label for="defstatus">Wrangling Status</label>
                <select name="tagsearchdefault_status" id="defstatus">
                  ${ defstatus }
                </select><br />
                <label for="defsort">Sort By</label>
                <select name="tagsearchdefault_sort" id="defsort">
                  ${ defsort }
                </select>
            </fieldset>
            <!--<fieldset id='tagsearchquick'>
                <legend>Quick Search Buttons</legend>
            </fieldset>-->
        </form>`);

        // optimizing the size of the GUI in case it's a mobile device
        let dialogwidth = parseInt($("body").css("width")); // parseInt ignores letters (px)
        dialogwidth = dialogwidth > 700 ? 700 : dialogwidth * 0.9;

        // initialize the dialog (but don't open it)
        $( dlg ).dialog({
            appendTo: "#main",
            modal: true,
            title: 'Smaller Tag Search Config',
            draggable: true,
            resizable: false,
            autoOpen: false,
            width: dialogwidth,
            position: {my:"center", at: "center top"},
            buttons: {
                Reset: deleteConfig,
                Save: storeConfig,
                Cancel: function() { $( dlg ).dialog( "close" ); }
            }
        });

        // event triggers if form is submitted with the <enter> key
        $( dlg+" form" ).on("submit", (e) => {
            e.preventDefault();
            storeConfig();
        });

        // if no other script has created it yet, write out a "Userscripts" option to the main navigation
        if ($('#scriptconfig').length == 0) {
            $('#header').find('nav[aria-label="Site"] li.dropdown').last()
                .after(`<li class="dropdown" id="scriptconfig">
                    <a class="dropdown-toggle" href="/" data-toggle="dropdown" data-target="#">Userscripts</a>
                    <ul class="menu dropdown-menu"></ul></li>`);
        }

        // then add this script's config option to navigation dropdown
        $('#scriptconfig .dropdown-menu').append(`<li><a href="#" id="opencfg_${cfg}">Smaller Tag Search</a></li>`);

        // on click, open the configuration dialog
        $("#opencfg_"+cfg).on("click", function(e) {
            e.preventDefault();
            $( dlg ).dialog('open');

            // turn checkboxes and radiobuttons into pretty buttons. only once the dialog is open bc sizing doesn't work correctly on hidden elements
            $( `${dlg} input[type='checkbox']` ).checkboxradio();
            $( `${dlg} input[type='radio'], ${dlg} #tagsearchwranglingstatus input[type='checkbox']` ).checkboxradio({ icon: false });
            $( `${dlg} .radiocontrol` ).controlgroup();

            // event handlers for reactive GUI: hide icon/text button option if not showing as buttons
            $( `${dlg} input[name=tagsearchdisplay_tag]` ).on('change', (e) => {
                if (e.target.value == "b") $(`${dlg} #linked_tag_buttons`).show();
                else $(`${dlg} #linked_tag_buttons`).hide();
            });
            $( `${dlg} input[name=tagsearchdisplay_sort]` ).on('change', (e) => {
                if (e.target.value == "b") $(`${dlg} #linked_sort_buttons`).show();
                else $(`${dlg} #linked_sort_buttons`).hide();
            });
        });
    }

    // --- LOCALSTORAGE MANIPULATION -------------------------------------------------------------------------------

    function loadConfig() {
        // load storage on page startup, or default values if there's no storage item
        return new Map(JSON.parse(localStorage.getItem(cfg) ||
            `[["text","1"],["labels","n"],["tag","b"],["sort","s"],["btntag","i"],["btnsort","i"],["iconset","fa"],
            ["deftype",""],["defstatus",""],["defsortby","name"],["defsortdir","asc"]]`));
    }

    function deleteConfig() {
        // deselects all buttons, empties all fields in the form
        $(dlg+' form').trigger("reset");

        // deletes the localStorage
        localStorage.removeItem(cfg);

        $( dlg ).dialog( "close" );
        location.reload();
    }

    function storeConfig() {
        // fill a Map() with the choices in the Config GUI
        let toStore = new Map();
        let hidewstat = [];

        // checkboxes: show labels?
        $(`${dlg} input[type='checkbox']`).each( function() {
            if ($(this).prop('name') == "tagsearchdisplay_labels") {
                if ($(this).prop('checked')) toStore.set('labels', "y");
                else toStore.set('labels', "n");
            }
            else if ($(this).prop('name').startsWith("tagsearchdisplay_wstat_")) {
                let wstat = $(this).prop('name').slice(23);
                if (!$(this).prop('checked')) hidewstat.push(wstat);
            }
        } );
        // radiobuttions: how to show tag type/status and sort by/direction
        $(`${dlg} input[type='radio']:checked`).each( function() {
            if      ($(this).prop('name') == "tagsearchdisplay_tag")  toStore.set('tag', $(this).prop('value'));
            else if ($(this).prop('name') == "tagsearchdisplay_sort") toStore.set('sort', $(this).prop('value'));
        } );
        // selects: how many lines for textinput fields, what to select by default
        $(`${dlg} select`).each( function() {
            let name = $(this).prop('name'), value = $(this).prop('value');

            if (name == "tagsearchdisplay_text") toStore.set('text', value);
            else if (name == "tagsearchdisplay_btntag") toStore.set('btntag', value);
            else if (name == "tagsearchdisplay_btnsort") toStore.set('btnsort', value);
            else if (name == "tagsearchdefault_type") toStore.set('deftype', value);
            else if (name == "tagsearchdefault_status") toStore.set('defstatus', value);
            else if (name == "tagsearchdefault_sort") {
                toStore.set('defsortby', value.slice(0, value.indexOf("-")));
                toStore.set('defsortdir', value.slice(value.indexOf("-")+1));
            }
            else if (name == "tagsearchdisplay_iconset") toStore.set('iconset', value);
        } );

        // sets the localStorage (turn Map() into an Array for stringify to understand it)
        // btw this overwrites any old configurations, since we're still using the same key name
        toStore.set('hidewstat', hidewstat.join(','));
        localStorage.setItem(cfg, JSON.stringify(toStore.entries().toArray()));

        $( dlg ).dialog( "close" );
        location.reload();
    }

    // --- WRITING THE NEW TAG SEARCH -------------------------------------------------------------------------------

    // for the fields to move/wrap nicely no matter the screen width, we have to group: the two text fields vs. the four selectors (including their respective labels)
    $('#new_tag_search dl > *').slice(0,4).wrapAll('<div id="smallsearch_first"></div>');
    $('#new_tag_search dl > *').slice(1).wrapAll('<div id="smallsearch_second"></div>');

    // general CSS for the fields and flexbox for the four selects
    let custom_css = `
        #fandom-field-description { display: none; }
        #new_tag_search #smallsearch_second { display: flex; flex-flow: row wrap; column-gap: 1rem; row-gap: 0rem; }
        #new_tag_search #smallsearch_second dd { width: auto; }
        #new_tag_search dd li.input { margin: 0; }
        #new_tag_search input[type="text"]::placeholder { opacity: 0.5; font-style: italic; }
        `;

    // one-line display: flexbox to move underneath each other on small screens, hide the appropriate <label>s and their <dt>s
    if (settings.get('text') == "1") {
        $('#new_tag_search dt').hide();
        custom_css += `
            #new_tag_search #smallsearch_first { display: flex; flex-flow: row wrap; column-gap: 2%; row-gap: 0rem; align-items: flex-end; }
            #new_tag_search #smallsearch_first dd { width: 49%; flex-grow: 1; min-width: 15em; }
            `;

        // adding a placeholder text to the <input> fields since the labels are gone
        $('input#tag_search_name').prop('placeholder', 'Tag Name');
        $('input#tag_search_fandoms_autocomplete').prop('placeholder', 'Fandom');
    }
    // two-line display with labels in separate flexboxes, or the second label would always move up into the first row
    else {
        $('#new_tag_search #smallsearch_second dt').hide();

        $('#new_tag_search #smallsearch_first > *').slice(0,2).wrapAll('<div id="smallsearch_firstA"></div>');
        $('#new_tag_search #smallsearch_first > *').slice(1).wrapAll('<div id="smallsearch_firstB"></div>');
        custom_css += `
            #new_tag_search #smallsearch_firstA, #new_tag_search #smallsearch_firstB {
                display: flex; flex-flow: row wrap; column-gap: 1rem; row-gap: 0rem; align-items: flex-end;
            }
            #new_tag_search #smallsearch_first dt { float: none; align-self: start; max-width: 10em; }
            #new_tag_search #smallsearch_first dd { min-width: 15em; width: unset; flex-grow: 1; }
            `;
    }

    $("head").append("<style type='text/css'>" + custom_css + "</style>");

    let labels = settings.get('labels') == "y" ? true : false;
    let btntag = settings.get('btntag');
    let btnsort = settings.get('btnsort');

    // (code readability) calling functions that'll rewrite the choices into buttons or selects, per config
    writeTagTypeChoices();
    writeTagStatusChoices();
    if (settings.get('sort') === "h") {
        // hide the sort by/dir from view (but their original <select> are still there)
        $('#new_tag_search #smallsearch_second dd').slice(2).hide();
        // select the correct <option> in the background so default sort config will still work
        $('#new_tag_search select[name="tag_search[sort_column]"]').find(`option[value="${opt_selected.get("tag_search[sort_column]")}"]`).prop('selected', true);
        $('#new_tag_search select[name="tag_search[sort_direction]"]').find(`option[value="${opt_selected.get("tag_search[sort_direction]")}"]`).prop('selected', true);
    }
    else { // if not hidden, build them as buttons or selects
        writeSortByChoices();
        writeSortDirChoices();
    }
    
    // put cursor in the search term field
    if (params.size === 0) $('#tag_search_name').focus();

    // --- HELPER FUNCTIONS TO WRITE PAGE HTML -------------------------------------------------------------------------------

    function writeTagTypeChoices() {
        let style = settings.get('tag') || "s";
        let html = `<div id="search_type_choice">`;
        if (labels) html += `<label for="tag_search[type]">Tag Type</label><br />`;

        if (style === "b") { // buttons in control group
            for (let [orig, alias] of type_alias) {
                html += `<label for="tag_search_type_${orig}" title="${alias[0]}">${btntag !== "t" ? alias[1] : ""} ${btntag !== "i" ? alias[0] : "" }</label>
                    <input type="radio" id="tag_search_type_${orig}" name="tag_search[type]" value="${orig}"
                    ${ opt_selected.get("tag_search[type]") === orig ? 'checked="checked"' : "" }>`;
            }
            html += "</div>";
            $('#new_tag_search #smallsearch_second dd:nth-of-type(1)').html(html);
            $('input[name="tag_search[type]"]').checkboxradio({ icon: false });
            $('#search_type_choice').controlgroup();
        }
        else if (style === "s") { // dropdown select
            html += `<select name="tag_search[type]">`;
            for (let [orig, alias] of type_alias) {
                html += `<option value="${orig}">${alias[0]}</option>`;
            }
            html += "</select></div>";
            $('#new_tag_search #smallsearch_second dd:nth-of-type(1)').html(html); // write the new <select> to page
            $('#new_tag_search select[name="tag_search[type]"]').find(`option[value="${opt_selected.get("tag_search[type]")}"]`).prop('selected', true); // select the correct <option>
            if (settings.get('sort') === 'b') $('#new_tag_search select[name="tag_search[type]"]').selectmenu({ width: null }); // prettify
        }
    }

    function writeTagStatusChoices() {
        let choices = $('#new_tag_search input[name="tag_search[wrangling_status]"]');
        let style = settings.get('tag') || "s";
        let hidden = settings.get("hidewstat")?.split(",") || []; // wrangling status options which user chose to hide
        let html = `<div id="search_status_choice">`;
        if (labels) html += `<label for="tag_search[wrangling_status]">Tag Status</label><br />`;

        if (style === "b") { // buttons in control group
            $(choices).each(function() {
                if (!hidden.includes(this.value) || this.value === "" || opt_selected.get("tag_search[wrangling_status]") === this.value) {
                    let alias = stat_alias.get(this.value);
                    html += `<label for="${this.id}" title="${alias[2]}">${btntag !== "t" ? alias[1] : ""} ${btntag !== "i" ? alias[0] : "" }</label>
                        <input type="radio" id="${this.id}" name="tag_search[wrangling_status]" value="${this.value}"
                        ${ opt_selected.get("tag_search[wrangling_status]") === this.value ? 'checked="checked"' : "" }>`;
                }
            });
            html += "</div>";
            $('#new_tag_search #smallsearch_second dd:nth-of-type(2)').html(html);
            $('input[name="tag_search[wrangling_status]"]').checkboxradio({ icon: false });
            $('#search_status_choice').controlgroup();
        }
        else if (style === "s") { // dropdown select
            html += `<select name="tag_search[wrangling_status]">`;
            $(choices).each(function() {
                if (!hidden.includes(this.value) || this.value === "" || opt_selected.get("tag_search[wrangling_status]") === this.value) {
                    let alias = stat_alias.get(this.value);
                    html += `<option value="${this.value}">${alias[0]}</option>"`;
                }
            });
            html += "</select></div>";
            $('#new_tag_search #smallsearch_second dd:nth-of-type(2)').html(html); // write the new <select> to page
            $('#new_tag_search select[name="tag_search[wrangling_status]"]').find(`option[value="${opt_selected.get("tag_search[wrangling_status]")}"]`).prop('selected', true); // select the correct <option>
            if (settings.get('sort') === 'b') $('#new_tag_search select[name="tag_search[wrangling_status]"]').selectmenu({ width: null }); // prettify
        }
    }

    function writeSortByChoices() {
        let choices = $('#new_tag_search select[name="tag_search[sort_column]"] option');
        let style = settings.get('sort') || "s";
        let html = `<div id="search_sort_choice">`;

        if (style === "b") { // buttons in control group
            if (labels) html += `<label for="tag_search[sort_column]">Sort By</label><br />`;
            $(choices).each(function() {
                let alias = sort_alias.get(this.value);
                html += `<label for="tag_search_sort_${this.value}" title="${alias[0]}">${btnsort !== "t" ? alias[1] : ""} ${btnsort !== "i" ? alias[0] : "" }</label>
                    <input type="radio" id="tag_search_sort_${this.value}" name="tag_search[sort_column]" value="${this.value}"
                    ${ opt_selected.get("tag_search[sort_column]") === this.value ? 'checked="checked"' : "" }>`;
            });
            html += "</div>";
            $('#new_tag_search #smallsearch_second dd:nth-of-type(3)').html(html);
            // jQueryUI make it pretty
            $('input[name="tag_search[sort_column]"]').checkboxradio({ icon: false });
            $('#search_sort_choice').controlgroup();
            // change eventhandler (on any <input> = button within this controlgroup) to dynamically update the ASC/DESC labels
            $('#search_sort_choice').on('change', "input", function() { onSortByChange('BUTTON'); });
        }
        else if (style === "s") { // dropdown select
            let select = $('#new_tag_search select[name="tag_search[sort_column]"]').css('width', '15em');
            if (!labels) $(choices).prepend("Sort by "); // add the "sort by" text into the <option>s if the labels are hidden
            else $(select).before(`<label for="tag_search[sort_column]">Sort By</label><br />`);
            $(choices).each(function() {
                if (opt_selected.get("tag_search[sort_column]") === this.value) $(this).prop('selected', true);
            });
            // jQueryUI make it pretty (width null forces original size) - with a change eventhandler to dynamically update the ASC/DESC labels
            if (settings.get('tag') === 'b') $( select ).selectmenu({ width: null, change: function() { onSortByChange('SELECT'); } });
            else $( select ).on('change', function() { onSortByChange('SELECT'); });
        }
    }

    function writeSortDirChoices() {
        let choices = $('#new_tag_search select[name="tag_search[sort_direction]"] option');
        let style = settings.get('sort') || "s";
        let html = `<div id="search_order_choice">`;

        if (style === "b") { // buttons in control group
            if (labels) html += `<label for="tag_search[sort_direction]">Sort Direction</label><br />`;
            $(choices).each(function() {
                let dir_readable = getAscDescAlias($('[name="tag_search[sort_column]"]:checked').prop('value'), this.value); // readable name depends on which sort-by is selected
                let dir_icon = getAscDescIcon($('[name="tag_search[sort_column]"]:checked').prop('value'), this.value);
                html += `<label for="tag_search_sort_${this.value}" title="${dir_readable}">${btnsort !== "t" ? dir_icon : ""} ${btnsort !== "i" ? dir_readable : ""}</label>
                    <input type="radio" id="tag_search_sort_${this.value}" name="tag_search[sort_direction]" value="${this.value}"
                    ${ opt_selected.get("tag_search[sort_direction]") === this.value ? 'checked="checked"' : "" }>`;
            });
            html += "</div>";
            $('#new_tag_search #smallsearch_second dd:nth-of-type(4)').html(html);
            // jQueryUI make it pretty
            $('input[name="tag_search[sort_direction]"]').checkboxradio({ icon: false });
            $('#search_order_choice').controlgroup();
        }
        else if (style === "s") { // dropdown select
            let select = $('#new_tag_search select[name="tag_search[sort_direction]"]').css('width', '13em');
            if (labels) $(select).before(`<label for="tag_search[sort_direction]">Sort Direction</label><br />`);
            // change ASC/DESC into something human-readable
            $(select).find('option').each(function() {
                let dir_readable = getAscDescAlias($('[name="tag_search[sort_column]"]').prop('value'), this.value);
                this.innerText = dir_readable;
                if (opt_selected.get("tag_search[sort_direction]") === this.value) $(this).prop('selected', true);
            });
            // jQueryUI make it pretty (width null forces original size)
            if (settings.get('tag') === 'b') $( select ).selectmenu({ width: null });
        }
    }

    // --- DELEGATED EVENT HANDLERS FOR REACTIVE PAGE -------------------------------------------------------------------------------

    // event handler listening to user changing the sort by field so we can update the text on the ASC/DESC
    function onSortByChange(elemType) {
        if (elemType === "SELECT") {
            // grab the now selected sort-by
            let new_sort_by = $('[name="tag_search[sort_column]"]').prop('value');
            // update the labels of the ASC/DESC on our original form elements
            $('#new_tag_search [name="tag_search[sort_direction]"] option').each(function() {
                let dir_readable = getAscDescAlias(new_sort_by, this.value);
                this.innerText = dir_readable;
            });
            // refresh the jQueryUI elements to show the same new labels
            $('#new_tag_search select[name="tag_search[sort_direction]"]').selectmenu( "refresh" );
        }
        else {
            // grab the now selected sort-by
            let new_sort_by = $('[name="tag_search[sort_column]"]:checked').prop('value');
            // update the labels of the ASC/DESC on our original form elements
            let dir_readable = getAscDescAlias(new_sort_by, 'asc');
            let dir_icon = getAscDescIcon(new_sort_by, 'asc');
            $('#new_tag_search label[for="tag_search_sort_asc"]').prop('title', dir_readable).html(
                `${btnsort !== "t" ? dir_icon : ""} ${btnsort !== "i" ? dir_readable : ""}`
            );

            dir_readable = getAscDescAlias(new_sort_by, 'desc');
            dir_icon = getAscDescIcon(new_sort_by, 'desc');
            $('#new_tag_search label[for="tag_search_sort_desc"]').prop('title', dir_readable).html(
                `${btnsort !== "t" ? dir_icon : ""} ${btnsort !== "i" ? dir_readable : ""}`
            );
        }
    }

})(jQuery);

function createIconSet() {
    const stored = new Map(JSON.parse(localStorage.getItem("smallertagsearch") ?? `[["iconset", "fa"]]`));
    const svg = stored.get('iconset') === 'lucide' ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">`
        : `<svg viewBox="0 0 640 640" fill="currentColor">`;

    // unfortunately heroicons doesn't have enough icons to represent all the functionalities we need here
    return stored.get('iconset') === 'lucide' ? {
        // SVGs from Lucide https://lucide.dev (Copyright (c) Cole Bemis 2013-2022 as part of Feather (MIT) and Lucide Contributors 2022 https://lucide.dev/license)
        toggle:         svg+`<circle cx="15" cy="12" r="3"/><rect width="20" height="14" x="2" y="5" rx="7"/></svg>`,
        dropdown:       svg+`<path d="m6 9 6 6 6-6"/></svg>`,
        hidden:         svg+`<path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/><path d="m2 2 20 20"/></svg>`,
        canonical:      svg+`<rect width="18" height="18" x="3" y="3" rx="2"/><path d="m9 12 2 2 4-4"/></svg>`,
        noncanonical:   svg+`<path d="M5 3a2 2 0 0 0-2 2"/><path d="M19 3a2 2 0 0 1 2 2"/><path d="M21 19a2 2 0 0 1-2 2"/><path d="M5 21a2 2 0 0 1-2-2"/><path d="M9 3h1"/><path d="M9 21h1"/><path d="M14 3h1"/><path d="M14 21h1"/><path d="M3 9v1"/><path d="M21 9v1"/><path d="M3 14v1"/><path d="M21 14v1"/></svg>`,
        merge:          svg+`<circle cx="12" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><circle cx="18" cy="6" r="3"/><path d="M18 9v2c0 .6-.4 1-1 1H7c-.6 0-1-.4-1-1V9"/><path d="M12 12v3"/></svg>`,
        funnel:         svg+`<path d="M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z"/></svg>`,
        lowvis:         svg+`<path d="M12.531 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14v6a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341l.427-.473"/><path d="m16.5 3.5 5 5"/><path d="m21.5 3.5-5 5"/></svg>`,
        any:            svg+`<path d="M12 6v12"/><path d="M17.196 9 6.804 15"/><path d="m6.804 9 10.392 6"/></svg>`,
        UnsortedTag:    svg+`<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>`,
        Fandom:         svg+`<rect width="20" height="5" x="2" y="3" rx="1"/><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/><path d="M10 12h4"/></svg>`,
        Character:      svg+`<circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></svg>`,
        Relationship:   svg+`<path d="M18 21a8 8 0 0 0-16 0"/><circle cx="10" cy="8" r="5"/><path d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3"/></svg>`,
        Freeform:       svg+`<path d="m15 5 6.3 6.3a2.4 2.4 0 0 1 0 3.4L17 19"/><path d="M9.586 5.586A2 2 0 0 0 8.172 5H3a1 1 0 0 0-1 1v5.172a2 2 0 0 0 .586 1.414L8.29 18.29a2.426 2.426 0 0 0 3.42 0l3.58-3.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="6.5" cy="9.5" r=".5" fill="currentColor"/></svg>`,
        name:
        {
            by:   svg+`<path d="M4 20h16"/><path d="m6 16 6-12 6 12"/><path d="M8 12h8"/></svg>`,
            asc:  svg+`<path d="m3 16 4 4 4-4"/><path d="M7 20V4"/><path d="M20 8h-5"/><path d="M15 10V6.5a2.5 2.5 0 0 1 5 0V10"/><path d="M15 14h5l-5 6h5"/></svg>`,
            desc: svg+`<path d="m3 16 4 4 4-4"/><path d="M7 4v16"/><path d="M15 4h5l-5 6h5"/><path d="M15 20v-3.5a2.5 2.5 0 0 1 5 0V20"/><path d="M20 18h-5"/></svg>`
        },           
        created:     
        {            
            by:   svg+`<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>`,
            asc:  svg+`<path d="m3 16 4 4 4-4"/><path d="M7 20V4"/><path d="M11 4h4"/><path d="M11 8h7"/><path d="M11 12h10"/></svg>`,
            desc: svg+`<path d="m3 16 4 4 4-4"/><path d="M7 20V4"/><path d="M11 4h10"/><path d="M11 8h7"/><path d="M11 12h4"/></svg>`
        },           
        uses:        
        {            
            by:   svg+`<path d="M3 3v16a2 2 0 0 0 2 2h16"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>`,
            asc:  svg+`<path d="m3 16 4 4 4-4"/><path d="M7 20V4"/><rect x="15" y="4" width="4" height="6" ry="2"/><path d="M17 20v-6h-2"/><path d="M15 20h4"/></svg>`,
            desc: svg+`<path d="m3 16 4 4 4-4"/><path d="M7 20V4"/><path d="M17 10V4h-2"/><path d="M15 10h4"/><rect x="15" y="14" width="4" height="6" ry="2"/></svg>`
        },    
    } :
    {
        // SVGs from Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.
        toggle:         svg+`<path d="M224 128C118 128 32 214 32 320C32 426 118 512 224 512L416 512C522 512 608 426 608 320C608 214 522 128 416 128L224 128zM416 224C469 224 512 267 512 320C512 373 469 416 416 416C363 416 320 373 320 320C320 267 363 224 416 224z"/></svg>`,
        dropdown:       svg+`<path d="M480 496C488.8 496 496 488.8 496 480L496 160C496 151.2 488.8 144 480 144L160 144C151.2 144 144 151.2 144 160L144 480C144 488.8 151.2 496 160 496L480 496zM544 480C544 515.3 515.3 544 480 544L160 544C124.7 544 96 515.3 96 480L96 160C96 124.7 124.7 96 160 96L480 96C515.3 96 544 124.7 544 160L544 480zM320 416C313.3 416 307 413.2 302.4 408.3L198.4 296.3C191.9 289.3 190.2 279.1 194 270.4C197.8 261.7 206.5 256 216 256L424 256C433.5 256 442.2 261.7 446 270.4C449.8 279.1 448.1 289.3 441.6 296.3L337.6 408.3C333.1 413.2 326.7 416 320 416z"/></svg>`,
        hidden:         svg+`<path d="M73 39.1C63.6 29.7 48.4 29.7 39.1 39.1C29.8 48.5 29.7 63.7 39 73.1L567 601.1C576.4 610.5 591.6 610.5 600.9 601.1C610.2 591.7 610.3 576.5 600.9 567.2L504.5 470.8C507.2 468.4 509.9 466 512.5 463.6C559.3 420.1 590.6 368.2 605.5 332.5C608.8 324.6 608.8 315.8 605.5 307.9C590.6 272.2 559.3 220.2 512.5 176.8C465.4 133.1 400.7 96.2 319.9 96.2C263.1 96.2 214.3 114.4 173.9 140.4L73 39.1zM236.5 202.7C260 185.9 288.9 176 320 176C399.5 176 464 240.5 464 320C464 351.1 454.1 379.9 437.3 403.5L402.6 368.8C415.3 347.4 419.6 321.1 412.7 295.1C399 243.9 346.3 213.5 295.1 227.2C286.5 229.5 278.4 232.9 271.1 237.2L236.4 202.5zM357.3 459.1C345.4 462.3 332.9 464 320 464C240.5 464 176 399.5 176 320C176 307.1 177.7 294.6 180.9 282.7L101.4 203.2C68.8 240 46.4 279 34.5 307.7C31.2 315.6 31.2 324.4 34.5 332.3C49.4 368 80.7 420 127.5 463.4C174.6 507.1 239.3 544 320.1 544C357.4 544 391.3 536.1 421.6 523.4L357.4 459.2z"/></svg>`,
        canonical:      svg+`<path d="M160 96C124.7 96 96 124.7 96 160L96 480C96 515.3 124.7 544 160 544L480 544C515.3 544 544 515.3 544 480L544 160C544 124.7 515.3 96 480 96L160 96zM404.4 276.7L324.4 404.7C320.2 411.4 313 415.6 305.1 416C297.2 416.4 289.6 412.8 284.9 406.4L236.9 342.4C228.9 331.8 231.1 316.8 241.7 308.8C252.3 300.8 267.3 303 275.3 313.6L302.3 349.6L363.7 251.3C370.7 240.1 385.5 236.6 396.8 243.7C408.1 250.8 411.5 265.5 404.4 276.8z"/></svg>`,
        noncanonical:   svg+`<path d="M160 144C151.2 144 144 151.2 144 160L144 480C144 488.8 151.2 496 160 496L480 496C488.8 496 496 488.8 496 480L496 160C496 151.2 488.8 144 480 144L160 144zM96 160C96 124.7 124.7 96 160 96L480 96C515.3 96 544 124.7 544 160L544 480C544 515.3 515.3 544 480 544L160 544C124.7 544 96 515.3 96 480L96 160zM404.4 268.7L324.4 396.7C320.2 403.4 313 407.6 305.1 408C297.2 408.4 289.6 404.8 284.9 398.4L236.9 334.4C228.9 323.8 231.1 308.8 241.7 300.8C252.3 292.8 267.3 295 275.3 305.6L302.3 341.6L363.7 243.3C370.7 232.1 385.5 228.6 396.8 235.7C408.1 242.8 411.5 257.5 404.4 268.8z"/></svg>`,
        merge:          svg+`<path d="M176 168C189.3 168 200 157.3 200 144C200 130.7 189.3 120 176 120C162.7 120 152 130.7 152 144C152 157.3 162.7 168 176 168zM256 144C256 176.8 236.3 205 208 217.3L208 240C208 266.5 229.5 288 256 288L384 288C410.5 288 432 266.5 432 240L432 217.3C403.7 205 384 176.8 384 144C384 99.8 419.8 64 464 64C508.2 64 544 99.8 544 144C544 176.8 524.3 205 496 217.3L496 240C496 301.9 445.9 352 384 352L352 352L352 422.7C380.3 435 400 463.2 400 496C400 540.2 364.2 576 320 576C275.8 576 240 540.2 240 496C240 463.2 259.7 435 288 422.7L288 352L256 352C194.1 352 144 301.9 144 240L144 217.3C115.7 205 96 176.8 96 144C96 99.8 131.8 64 176 64C220.2 64 256 99.8 256 144zM464 168C477.3 168 488 157.3 488 144C488 130.7 477.3 120 464 120C450.7 120 440 130.7 440 144C440 157.3 450.7 168 464 168zM344 496C344 482.7 333.3 472 320 472C306.7 472 296 482.7 296 496C296 509.3 306.7 520 320 520C333.3 520 344 509.3 344 496z"/></svg>`,
        funnel:         svg+`<path d="M96 128C83.1 128 71.4 135.8 66.4 147.8C61.4 159.8 64.2 173.5 73.4 182.6L256 365.3L256 480C256 488.5 259.4 496.6 265.4 502.6L329.4 566.6C338.6 575.8 352.3 578.5 364.3 573.5C376.3 568.5 384 556.9 384 544L384 365.3L566.6 182.7C575.8 173.5 578.5 159.8 573.5 147.8C568.5 135.8 556.9 128 544 128L96 128z"/></svg>`,
        lowvis:         svg+`<path d="M73 39.1C63.6 29.7 48.4 29.7 39.1 39.1C29.8 48.5 29.7 63.7 39 73.1L567 601.1C576.4 610.5 591.6 610.5 600.9 601.1C610.2 591.7 610.3 576.5 600.9 567.2L504.5 470.8C507.2 468.4 509.9 466 512.5 463.6C559.3 420.1 590.6 368.2 605.5 332.5C608.8 324.6 608.8 315.8 605.5 307.9C590.6 272.2 559.3 220.2 512.5 176.8C465.4 133.1 400.7 96.2 319.9 96.2C263.1 96.2 214.3 114.4 173.9 140.4L73 39.1zM236.5 202.7C260 185.9 288.9 176 320 176C399.5 176 464 240.5 464 320C464 351.1 454.1 379.9 437.3 403.5L402.6 368.8C415.3 347.4 419.6 321.1 412.7 295.1C399 243.9 346.3 213.5 295.1 227.2C286.5 229.5 278.4 232.9 271.1 237.2L236.4 202.5zM120 221.9C110.6 212.5 95.4 212.5 86.1 221.9C76.8 231.3 76.7 246.5 86.1 255.8L360.2 530C369.6 539.4 384.8 539.4 394.1 530C403.4 520.6 403.5 505.4 394.1 496.1L120 221.9zM77.7 315.3C68.3 305.9 53.1 305.9 43.8 315.3C34.5 324.7 34.4 339.9 43.8 349.2L213.9 519.5C223.3 528.9 238.5 528.9 247.8 519.5C257.1 510.1 257.2 494.9 247.8 485.6L77.7 315.3z"/></svg>`,
        any:            svg+`<path d="M320 64C337.7 64 352 78.3 352 96L352 264.6L496 181.5C511.3 172.7 530.9 177.9 539.7 193.2C548.5 208.5 543.3 228.1 528 236.9L384 320L528 403.1C543.3 411.9 548.6 431.5 539.7 446.8C530.8 462.1 511.3 467.4 496 458.5L352 375.4L352 544C352 561.7 337.7 576 320 576C302.3 576 288 561.7 288 544L288 375.4L144 458.5C128.7 467.3 109.1 462.1 100.3 446.8C91.5 431.5 96.7 412 112 403.1L256 320L112 236.9C96.7 228 91.5 208.5 100.3 193.1C109.1 177.7 128.7 172.6 144 181.4L288 264.6L288 96C288 78.3 302.3 64 320 64z"/></svg>`,
        UnsortedTag:    svg+`<path d="M528 320C528 205.1 434.9 112 320 112C205.1 112 112 205.1 112 320C112 434.9 205.1 528 320 528C434.9 528 528 434.9 528 320zM64 320C64 178.6 178.6 64 320 64C461.4 64 576 178.6 576 320C576 461.4 461.4 576 320 576C178.6 576 64 461.4 64 320zM320 240C302.3 240 288 254.3 288 272C288 285.3 277.3 296 264 296C250.7 296 240 285.3 240 272C240 227.8 275.8 192 320 192C364.2 192 400 227.8 400 272C400 319.2 364 339.2 344 346.5L344 350.3C344 363.6 333.3 374.3 320 374.3C306.7 374.3 296 363.6 296 350.3L296 342.2C296 321.7 310.8 307 326.1 302C332.5 299.9 339.3 296.5 344.3 291.7C348.6 287.5 352 281.7 352 272.1C352 254.4 337.7 240.1 320 240.1zM288 432C288 414.3 302.3 400 320 400C337.7 400 352 414.3 352 432C352 449.7 337.7 464 320 464C302.3 464 288 449.7 288 432z"/></svg>`,
        Fandom:         svg+`<path d="M64 128C64 110.3 78.3 96 96 96L544 96C561.7 96 576 110.3 576 128L576 160C576 177.7 561.7 192 544 192L96 192C78.3 192 64 177.7 64 160L64 128zM96 240L544 240L544 480C544 515.3 515.3 544 480 544L160 544C124.7 544 96 515.3 96 480L96 240zM248 304C234.7 304 224 314.7 224 328C224 341.3 234.7 352 248 352L392 352C405.3 352 416 341.3 416 328C416 314.7 405.3 304 392 304L248 304z"/></svg>`,
        Character:      svg+`<path d="M320 312C386.3 312 440 258.3 440 192C440 125.7 386.3 72 320 72C253.7 72 200 125.7 200 192C200 258.3 253.7 312 320 312zM290.3 368C191.8 368 112 447.8 112 546.3C112 562.7 125.3 576 141.7 576L498.3 576C514.7 576 528 562.7 528 546.3C528 447.8 448.2 368 349.7 368L290.3 368z"/></svg>`,
        Relationship:   svg+`<path d="M320 80C377.4 80 424 126.6 424 184C424 241.4 377.4 288 320 288C262.6 288 216 241.4 216 184C216 126.6 262.6 80 320 80zM96 152C135.8 152 168 184.2 168 224C168 263.8 135.8 296 96 296C56.2 296 24 263.8 24 224C24 184.2 56.2 152 96 152zM0 480C0 409.3 57.3 352 128 352C140.8 352 153.2 353.9 164.9 357.4C132 394.2 112 442.8 112 496L112 512C112 523.4 114.4 534.2 118.7 544L32 544C14.3 544 0 529.7 0 512L0 480zM521.3 544C525.6 534.2 528 523.4 528 512L528 496C528 442.8 508 394.2 475.1 357.4C486.8 353.9 499.2 352 512 352C582.7 352 640 409.3 640 480L640 512C640 529.7 625.7 544 608 544L521.3 544zM472 224C472 184.2 504.2 152 544 152C583.8 152 616 184.2 616 224C616 263.8 583.8 296 544 296C504.2 296 472 263.8 472 224zM160 496C160 407.6 231.6 336 320 336C408.4 336 480 407.6 480 496L480 512C480 529.7 465.7 544 448 544L192 544C174.3 544 160 529.7 160 512L160 496z"/></svg>`,
        Freeform:       svg+`<path d="M433.2 103.1L581.4 253.4C609.1 281.5 609.1 326.5 581.4 354.6L425 512.9C415.7 522.3 400.5 522.4 391.1 513.1C381.7 503.8 381.6 488.6 390.9 479.2L547.3 320.8C556.5 311.5 556.5 296.4 547.3 287.1L399 136.9C389.7 127.5 389.8 112.3 399.2 103C408.6 93.7 423.8 93.8 433.1 103.2zM64.1 293.5L64.1 160C64.1 124.7 92.8 96 128.1 96L261.6 96C278.6 96 294.9 102.7 306.9 114.7L450.9 258.7C475.9 283.7 475.9 324.2 450.9 349.2L317.4 482.7C292.4 507.7 251.9 507.7 226.9 482.7L82.9 338.7C70.9 326.7 64.2 310.4 64.2 293.4zM208.1 208C208.1 190.3 193.8 176 176.1 176C158.4 176 144.1 190.3 144.1 208C144.1 225.7 158.4 240 176.1 240C193.8 240 208.1 225.7 208.1 208z"/></svg>`,
        name:
        {
            by:   svg+`<path d="M349.1 114.7C343.9 103.3 332.5 96 320 96C307.5 96 296.1 103.3 290.9 114.7L123.5 480L112 480C94.3 480 80 494.3 80 512C80 529.7 94.3 544 112 544L200 544C217.7 544 232 529.7 232 512C232 494.3 217.7 480 200 480L193.9 480L215.9 432L424.2 432L446.2 480L440.1 480C422.4 480 408.1 494.3 408.1 512C408.1 529.7 422.4 544 440.1 544L528.1 544C545.8 544 560.1 529.7 560.1 512C560.1 494.3 545.8 480 528.1 480L516.6 480L349.2 114.7zM394.8 368L245.2 368L320 204.8L394.8 368z"/></svg>`,
            asc:  svg+`<path d="M294.6 454.6L214.6 534.6C202.1 547.1 181.8 547.1 169.3 534.6L89.3 454.6C76.8 442.1 76.8 421.8 89.3 409.3C101.8 396.8 122.1 396.8 134.6 409.3L160 434.7L160 128C160 110.3 174.3 96 192 96C209.7 96 224 110.3 224 128L224 434.7L249.4 409.3C261.9 396.8 282.2 396.8 294.7 409.3C307.2 421.8 307.2 442.1 294.7 454.6zM476.6 113.7C527.3 215 553.9 268.4 556.6 273.7C564.5 289.5 558.1 308.7 542.3 316.6C526.5 324.5 507.3 318.1 499.4 302.3L492.2 288L403.8 288L396.6 302.3C388.7 318.1 369.5 324.5 353.7 316.6C337.9 308.7 331.5 289.5 339.4 273.7C342.1 268.4 368.7 215 419.4 113.7C424.8 102.9 435.9 96 448 96C460.1 96 471.2 102.8 476.6 113.7zM448 199.6L427.8 240L468.2 240L448 199.6zM352 384C352 366.3 366.3 352 384 352L512 352C524.9 352 536.6 359.8 541.6 371.8C546.6 383.8 543.8 397.5 534.7 406.7L461.3 480L512 480C529.7 480 544 494.3 544 512C544 529.7 529.7 544 512 544L384 544C371.1 544 359.4 536.2 354.4 524.2C349.4 512.2 352.2 498.5 361.3 489.3L434.7 415.9L384 415.9C366.3 415.9 352 401.6 352 383.9z"/></svg>`,
            desc: svg+`<path d="M294.6 454.6L214.6 534.6C202.1 547.1 181.8 547.1 169.3 534.6L89.3 454.6C76.8 442.1 76.8 421.8 89.3 409.3C101.8 396.8 122.1 396.8 134.6 409.3L160 434.7L160 128C160 110.3 174.3 96 192 96C209.7 96 224 110.3 224 128L224 434.7L249.4 409.3C261.9 396.8 282.2 396.8 294.7 409.3C307.2 421.8 307.2 442.1 294.7 454.6zM352 128C352 110.3 366.3 96 384 96L512 96C524.9 96 536.6 103.8 541.6 115.8C546.6 127.8 543.8 141.5 534.7 150.7L461.3 224L512 224C529.7 224 544 238.3 544 256C544 273.7 529.7 288 512 288L384 288C371.1 288 359.4 280.2 354.4 268.2C349.4 256.2 352.2 242.5 361.3 233.3L434.8 160L384 160C366.3 160 352 145.7 352 128zM476.6 337.7L556.6 497.7C564.5 513.5 558.1 532.7 542.3 540.6C526.5 548.5 507.3 542.1 499.4 526.3L492.2 512L403.8 512L396.6 526.3C388.7 542.1 369.5 548.5 353.7 540.6C337.9 532.7 331.5 513.5 339.4 497.7L419.4 337.7C424.8 326.9 435.9 320 448 320C460.1 320 471.2 326.8 476.6 337.7zM448 423.6L427.8 464L468.2 464L448 423.6z"/></svg>`
        },           
        created:     
        {            
            by:   svg+`<path d="M224 64C206.3 64 192 78.3 192 96L192 128L160 128C124.7 128 96 156.7 96 192L96 240L544 240L544 192C544 156.7 515.3 128 480 128L448 128L448 96C448 78.3 433.7 64 416 64C398.3 64 384 78.3 384 96L384 128L256 128L256 96C256 78.3 241.7 64 224 64zM96 288L96 480C96 515.3 124.7 544 160 544L480 544C515.3 544 544 515.3 544 480L544 288L96 288z"/></svg>`,
            asc:  svg+`<path d="M278.6 438.6L182.6 534.6C170.1 547.1 149.8 547.1 137.3 534.6L41.3 438.6C28.8 426.1 28.8 405.8 41.3 393.3C53.8 380.8 74.1 380.8 86.6 393.3L128 434.7L128 128C128 110.3 142.3 96 160 96C177.7 96 192 110.3 192 128L192 434.7L233.4 393.3C245.9 380.8 266.2 380.8 278.7 393.3C291.2 405.8 291.2 426.1 278.7 438.6zM352 96L384 96C401.7 96 416 110.3 416 128C416 145.7 401.7 160 384 160L352 160C334.3 160 320 145.7 320 128C320 110.3 334.3 96 352 96zM352 224L448 224C465.7 224 480 238.3 480 256C480 273.7 465.7 288 448 288L352 288C334.3 288 320 273.7 320 256C320 238.3 334.3 224 352 224zM352 352L512 352C529.7 352 544 366.3 544 384C544 401.7 529.7 416 512 416L352 416C334.3 416 320 401.7 320 384C320 366.3 334.3 352 352 352zM352 480L576 480C593.7 480 608 494.3 608 512C608 529.7 593.7 544 576 544L352 544C334.3 544 320 529.7 320 512C320 494.3 334.3 480 352 480z"/></svg>`,
            desc: svg+`<path d="M278.6 438.6L182.6 534.6C170.1 547.1 149.8 547.1 137.3 534.6L41.3 438.6C28.8 426.1 28.8 405.8 41.3 393.3C53.8 380.8 74.1 380.8 86.6 393.3L128 434.7L128 128C128 110.3 142.3 96 160 96C177.7 96 192 110.3 192 128L192 434.7L233.4 393.3C245.9 380.8 266.2 380.8 278.7 393.3C291.2 405.8 291.2 426.1 278.7 438.6zM352 544C334.3 544 320 529.7 320 512C320 494.3 334.3 480 352 480L384 480C401.7 480 416 494.3 416 512C416 529.7 401.7 544 384 544L352 544zM352 416C334.3 416 320 401.7 320 384C320 366.3 334.3 352 352 352L448 352C465.7 352 480 366.3 480 384C480 401.7 465.7 416 448 416L352 416zM352 288C334.3 288 320 273.7 320 256C320 238.3 334.3 224 352 224L512 224C529.7 224 544 238.3 544 256C544 273.7 529.7 288 512 288L352 288zM352 160C334.3 160 320 145.7 320 128C320 110.3 334.3 96 352 96L576 96C593.7 96 608 110.3 608 128C608 145.7 593.7 160 576 160L352 160z"/></svg>`
        },           
        uses:        
        {            
            by:   svg+`<path d="M96 96C113.7 96 128 110.3 128 128L128 464C128 472.8 135.2 480 144 480L544 480C561.7 480 576 494.3 576 512C576 529.7 561.7 544 544 544L144 544C99.8 544 64 508.2 64 464L64 128C64 110.3 78.3 96 96 96zM208 288C225.7 288 240 302.3 240 320L240 384C240 401.7 225.7 416 208 416C190.3 416 176 401.7 176 384L176 320C176 302.3 190.3 288 208 288zM352 224L352 384C352 401.7 337.7 416 320 416C302.3 416 288 401.7 288 384L288 224C288 206.3 302.3 192 320 192C337.7 192 352 206.3 352 224zM432 256C449.7 256 464 270.3 464 288L464 384C464 401.7 449.7 416 432 416C414.3 416 400 401.7 400 384L400 288C400 270.3 414.3 256 432 256zM576 160L576 384C576 401.7 561.7 416 544 416C526.3 416 512 401.7 512 384L512 160C512 142.3 526.3 128 544 128C561.7 128 576 142.3 576 160z"/></svg>`,
            asc:  svg+`<path d="M482.7 102C491 108 496 117.7 496 128L496 224L512 224C529.7 224 544 238.3 544 256C544 273.7 529.7 288 512 288L416 288C398.3 288 384 273.7 384 256C384 238.3 398.3 224 416 224L432 224L432 172.4L426.1 174.4C409.3 180 391.2 170.9 385.6 154.2C380 137.5 389.1 119.3 405.8 113.7L453.8 97.7C463.6 94.4 474.3 96.1 482.6 102.1zM429.1 494.6L440.8 476.6C407.9 466.7 384 436.1 384 400C384 355.8 419.8 320 464 320C508.2 320 544 355.8 544 400C544 422.9 537.4 445.3 524.9 464.5L482.8 529.4C473.2 544.2 453.4 548.5 438.5 538.8C423.6 529.1 419.4 509.4 429.1 494.5zM488 400C488 386.7 477.3 376 464 376C450.7 376 440 386.7 440 400C440 413.3 450.7 424 464 424C477.3 424 488 413.3 488 400zM214.6 534.6C202.1 547.1 181.8 547.1 169.3 534.6L73.3 438.6C60.8 426.1 60.8 405.8 73.3 393.3C85.8 380.8 106.1 380.8 118.6 393.3L160 434.7L160 128C160 110.3 174.3 96 192 96C209.7 96 224 110.3 224 128L224 434.7L265.4 393.3C277.9 380.8 298.2 380.8 310.7 393.3C323.2 405.8 323.2 426.1 310.7 438.6L214.7 534.6z"/></svg>`,
            desc: svg+`<path d="M294.6 454.6L214.6 534.6C202.1 547.1 181.8 547.1 169.3 534.6L89.3 454.6C76.8 442.1 76.8 421.8 89.3 409.3C101.8 396.8 122.1 396.8 134.6 409.3L160 434.7L160 128C160 110.3 174.3 96 192 96C209.7 96 224 110.3 224 128L224 434.7L249.4 409.3C261.9 396.8 282.2 396.8 294.7 409.3C307.2 421.8 307.2 442.1 294.7 454.6zM429.1 270.6L440.8 252.6C407.9 242.7 384 212.1 384 176C384 131.8 419.8 96 464 96C508.2 96 544 131.8 544 176C544 198.9 537.4 221.3 524.9 240.5L482.8 305.4C473.2 320.2 453.4 324.5 438.5 314.8C423.6 305.1 419.4 285.4 429.1 270.5zM488 176C488 162.7 477.3 152 464 152C450.7 152 440 162.7 440 176C440 189.3 450.7 200 464 200C477.3 200 488 189.3 488 176zM482.7 358C491 364 496 373.7 496 384L496 480L512 480C529.7 480 544 494.3 544 512C544 529.7 529.7 544 512 544L416 544C398.3 544 384 529.7 384 512C384 494.3 398.3 480 416 480L432 480L432 428.4L426.1 430.4C409.3 436 391.2 426.9 385.6 410.2C380 393.5 389.1 375.3 405.8 369.7L453.8 353.7C463.6 350.4 474.3 352.1 482.6 358.1z"/></svg>`
        },
    };
}