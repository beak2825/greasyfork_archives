// ==UserScript==
// @name         AO3: [Wrangling] Fandom Resources Quicklinks
// @namespace    https://greasyfork.org/en/users/906106-escctrl
// @description  adds a bar with fandom-specific links at the top of the bin
// @author       escctrl
// @version      1.3
// @match        *://*.archiveofourown.org/tags/*/wrangle?*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.7.0/jquery.min.js
// @require      https://ajax.googleapis.com/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jqueryui-touch-punch/0.2.3/jquery.ui.touch-punch.min.js
// @require      https://update.greasyfork.org/scripts/491888/1355841/Light%20or%20Dark.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/511102/AO3%3A%20%5BWrangling%5D%20Fandom%20Resources%20Quicklinks.user.js
// @updateURL https://update.greasyfork.org/scripts/511102/AO3%3A%20%5BWrangling%5D%20Fandom%20Resources%20Quicklinks.meta.js
// ==/UserScript==
 
/* global jQuery, lightOrDark */

(function($) {
    'use strict';

    // --- THE USUAL INIT STUFF AT THE BEGINNING -------------------------------------------------------------------------------

    let cfg = 'wrangleResources'; // name of dialog and localstorage used throughout
    let dlg = '#'+cfg;

    /* *** EXAMPLE STORAGE: all Witcher (franchise nickname) subfandoms are listed in [0] to use the resources listed in [1]ff
        resources = {
            "Witcher" : [ ["Wiedźmin | The Witcher - All Media Types", "Wiedźmin | The Witcher (Video Game)", "Wiedźmin | The Witcher Series - Andrzej Sapkowski", "The Witcher (TV)"],
                          ["wikia", "https://witcher.fandom.com/wiki/Witcher_Wiki"],
                          ["IMDB Cast", "https://www.imdb.com/title/tt5180504/fullcredits/"] ],
        };
    */
    let resources = loadConfig();

    let icons = { // SVGs from Remix Icon https://remixicon.com (Apache license Copyright (c) RemixIcon https://remixicon.com/license)
        plusFilled: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 3H20C20.5523 3 21 3.44772 21 4V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V4C3 3.44772 3.44772 3 4 3ZM11 11H7V13H11V17H13V13H17V11H13V7H11V11Z"></path></svg>`,
        plusOutline: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 3H20C20.5523 3 21 3.44772 21 4V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V4C3 3.44772 3.44772 3 4 3ZM5 5V19H19V5H5ZM11 11V7H13V11H17V13H13V17H11V13H7V11H11Z"></path></svg>`,
        minusOutline: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 3H20C20.5523 3 21 3.44772 21 4V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V4C3 3.44772 3.44772 3 4 3ZM5 5V19H19V5H5ZM7 11H17V13H7V11Z"></path></svg>`,
        trash: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 4V2H17V4H22V6H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V6H2V4H7ZM6 6V20H18V6H6ZM9 9H11V17H9V9ZM13 9H15V17H13V9Z"></path></svg>`,
        extlink: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M10 6V8H5V19H16V14H18V20C18 20.5523 17.5523 21 17 21H4C3.44772 21 3 20.5523 3 20V7C3 6.44772 3.44772 6 4 6H10ZM21 3V11H19L18.9999 6.413L11.2071 14.2071L9.79289 12.7929L17.5849 5H13V3H21Z"></path></svg>`,
        bins: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 5H20V3H4V5ZM20 9H4V7H20V9ZM9 13H15V11H21V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V11H9V13Z"></path></svg>`
    };

    // --- CONFIGURATION DIALOG HANDLING -------------------------------------------------------------------------------

    createDialog();

    function createDialog() {

        // if the background is dark, use the dark UI theme to match
        let dialogtheme = lightOrDark($('body').css('background-color')) == "dark" ? "dark-hive" : "base";

        // adding the jQuery stylesheet to style the dialog, and fixing the interference of AO3's styling
        $("head").append(`<link rel="stylesheet" href="https://code.jquery.com/ui/1.13.2/themes/${dialogtheme}/jquery-ui.css">`)
        .append(`<style tyle="text/css">${dlg}, .ui-dialog .ui-dialog-buttonpane button {font-size: revert; line-height: 1.286;}
        ${dlg} form {box-shadow: revert; cursor:auto;}
        ${dlg} fieldset {background: revert; box-shadow: revert;}
        ${dlg} fieldset p { padding-left: 0; padding-right: 0; }
        ${dlg} legend {font-size: inherit; height: auto; width: auto; opacity: inherit;}
        ${dlg} fieldset input::placeholder { font-style: italic; opacity: 0.2; }
        ${dlg} fieldset input[type="text"] { padding: 0.2em 0.5em; width: 20em; }
        ${dlg} fieldset input[type="text"][id^="display"] { width: 10em; }
        ${dlg} fieldset p.indented { padding: 0.2em 0 0.2em 3em; }
        ${dlg} fieldset p.linked { display: table; width: 100%; }
        ${dlg} fieldset p.linked label { display: table-cell; width: 4em; vertical-align: top; padding-top: 0.2em; }
        ${dlg} fieldset p.linked ul { display: table-cell; width: auto; }
        ${dlg} fieldset div.fandom, ${dlg} fieldset div.fandom-new { margin: 1em 0 0 0; }
        ${dlg} fieldset button { margin: 0.1em; }
        ${dlg} fieldset ul.autocomplete li { margin: 0.2em; }
        ${dlg} svg { width: 1em; height: 1em; display: inline-block; vertical-align: -0.15em; }
        </style>`);

        // wrapper div for the dialog
        $("#main").append(`<div id="${cfg}"></div>`);

        let prevStoredHTML = "";
        for (let [f, r] of Object.entries(resources)) {
            prevStoredHTML += templateFandom(f, r);
        }

        $(dlg).html(`<form>
            <fieldset><legend>Fandom Resources</legend>
                ${prevStoredHTML}
                <div class="fandom-new"><button name="add-fandom" type="button">${icons.plusFilled} Add Fandom</button></div>
            </fieldset>
        </form>`);

        // optimizing the size of the GUI in case it's a mobile device
        let dialogwidth = parseInt($("body").css("width")); // parseInt ignores letters (px)
        if (dialogwidth < 1000) $("head").append(`<style tyle="text/css"> ${dlg} label { display: none; } </style>`); // saving some space on narrow screens
        dialogwidth = dialogwidth > 500 ? dialogwidth * 0.7 : dialogwidth * 0.9;
        let dialogheight = parseFloat(getComputedStyle($(dlg)[0]).fontSize) * 50;

        $(dlg).dialog({
            appendTo: "#main",
            modal: true,
            title: 'Quicklinks to Fandom Resources Config',
            draggable: true,
            resizable: false,
            autoOpen: false,
            width: dialogwidth,
            maxHeight: dialogheight,
            position: {my:"center", at: "center top"},
            buttons: {
                Reset: deleteConfig,
                Save: storeConfig,
                Cancel: function() { $( dlg ).dialog( "close" ); }
            }
        });

        // if no other script has created it yet, write out a "Userscripts" option to the main navigation
        if ($('#scriptconfig').length == 0) {
            $('#header').find('nav[aria-label="Site"] li.dropdown').last()
                .after(`<li class="dropdown" id="scriptconfig">
                    <a class="dropdown-toggle" href="/" data-toggle="dropdown" data-target="#">Userscripts</a>
                    <ul class="menu dropdown-menu"></ul></li>`);
        }
        // then add this script's config option to navigation dropdown
        $('#scriptconfig .dropdown-menu').append(`<li><a href="javascript:void(0);" id="opencfg_${cfg}">Fandom Resources</a></li>`);

        // on click, open the configuration dialog
        $("#opencfg_"+cfg).on("click", function(e) {
            $( dlg ).dialog('open');
        });

    }

    // --- DELEGATED EVENT HANDLERS FOR REACTIVE GUI -------------------------------------------------------------------------------

    // adding/removing fandoms/resources/links
    $(dlg).on("click", "fieldset button", function(e) {
        e.preventDefault();

        // these create the necessary blank HTML fields that get dynamically added on button-clicks
        let newresource = templateResource();
        let newfandom = templateFandom();

        let parent = $(e.target).parent();

        // depending on the button that was clicked, we add/remove different rows of data or hide buttons
        switch (e.target.name) {
            case "add-resource":
                $(parent).before(newresource);
                e.target.scrollIntoView(false);
                break;
            case "delete-resource":
                $(parent).remove();
                break;
            case "delete-fandom":
                $(parent).parent().remove();
                break;
            case "add-fandom":
                $(parent).before(newfandom);
                e.target.scrollIntoView(false);
                break;
        }
    });

    // --- HELPER FUNCTIONS TO CREATE GUI HTML -------------------------------------------------------------------------------

    // creates a whole block for a fandom, with the <input> for a user-defined nickname, plus the linked fandoms and resources
    function templateFandom(f = "", r = [[""], ["", ""]]) {
        let resourcesHTML = ""; // holds HTML of the resource/fandom link configuration that was stored for the given fandom
        let myr = [...r]; // need to deep-copy this because we're later shifting the first element off, which would affect the original resources config

        // list the fandoms that were previously entered (or a field for entering a new one)
        resourcesHTML = templateLink(myr[0].join(","));
        myr.shift(); // remove the fandoms at [0] from our array

        // when a bunch of resource links were configured for this fandom, we build those as HTML & hide the fandom-link button
        for (let entry of myr) { resourcesHTML += templateResource(entry); }

        return `
                <div class="fandom">
                    <label for="fandom[]">Title:</label>
                    <input type="text" id="fandom[]" name="fandom[]" placeholder="of fandom or franchise" value="${f}"/>
                    ${resourcesHTML}
                    <p class="indented add-new">
                        <button name="add-resource" type="button">${icons.plusOutline} Add Resource</button>
                        <button name="delete-fandom" type="button">${icons.trash} Delete Fandom Config</button>
                    </p>
                </div>`;
    }

    // creates a line with two <input> fields to enter the resource display text and URL, and a button to remove that line again
    function templateResource(r = ["", ""]) {
        return `
                    <p class="indented resource">
                        ${icons.extlink}
                        <label for="display[]">Resource:</label> <input type="text" id="display[]" name="display[]" placeholder="e.g. IMDB" value="${r[0]}" />
                        <label for="url[]">URL:</label> <input type="text" id="url[]" name="url[]" placeholder="e.g. http://www.imdb.com" value="${r[1]}" />
                        <button name="delete-resource" type="button">${icons.minusOutline} Remove Resource</button>
                    </p>`;
    }

    // creates an AO3-standard autocomplete textfield for selecting fandoms, which is prepopulated with previously stored fandoms
    function templateLink(l = "") {
        return `
                    <p class="indented linked">
                        <label for="linked[]">${icons.bins} Bins:</label>
                        <input type="text" id="linked[]" name="linked[]" class="fandom autocomplete" data-autocomplete-method="/autocomplete/fandom"
                        data-autocomplete-hint-text="Start typing for Fandom suggestions!" data-autocomplete-no-results-text="(No suggestions found)"
                        data-autocomplete-min-chars="1" data-autocomplete-searching-text="Searching..." value="${l}"/>
                    </p>`;
    }

    // --- LOCALSTORAGE MANIPULATION -------------------------------------------------------------------------------

    function deleteConfig() {
        if (confirm('Are you sure you want to delete all Fandom Resource quicklinks?')) {
            localStorage.removeItem(cfg);
            $(dlg).dialog('close');
            // currently this is creating a "n.slice is not a function" exception. not a clue why. none of the other ways to close the dialog have issues.
        }
    }

    function storeConfig() {
        // object to start collecting our storage data
        let fandom_resources = {};

        let errors = [];

        // grab all the elements and fields
        $(dlg).find('div.fandom').each(function(ix) {
            let nickname = $(this).find('input[name="fandom[]"]').prop('value');

            if (nickname.length > 0) {

                let linkedfandoms = $(this).find('p.linked ul.autocomplete li.added.tag');
                let resources = $(this).find('p.resource');

                if ($(linkedfandoms).length > 0) {
                    fandom_resources[nickname] = [];
                    // gather all the selected fandoms' canonical tagnames together into an array
                    console.log(linkedfandoms.map(function() { return $(this).contents().eq(0).text().trim(); }));
                    fandom_resources[nickname][0] = $(linkedfandoms).map(function() { return $(this).contents().eq(0).text().trim(); }).toArray();

                    if ($(resources).length > 0) {
                        $(resources).each(function() {
                            let display = $(this).find('input[id="display[]"]').prop('value') || "";
                            let url = $(this).find('input[id="url[]"]').prop('value') || "";

                            if (url !== "" && display === "") display = "link"; // set default display text if there is a URL

                            // we don't keep completely empty resource lines, otherwise we store a resource
                            if (url === "" && display === "") errors.push(`a resource for fandom ${nickname} won't be stored, no link text nor URL given`);
                            else fandom_resources[nickname].push([display, url]);
                        });
                    }
                }
                else errors.push(`resources for fandom ${nickname} won't be stored, no fandoms were linked to use them`);
            }
            else errors.push(`entry #${ix+1} won't be stored, no Title given`);
        });

        if (errors.length > 0) console.log("Some Fandom Resource entries could not be stored because they're missing data:\n" + errors.join("\n"));
        // by the end of this, we've filled up fandom_resources with all data and are ready to store
        localStorage.setItem(cfg, JSON.stringify(fandom_resources));
        $(dlg).dialog('close');
    }

    function loadConfig() {
        return JSON.parse(localStorage.getItem(cfg) ?? "{}");
    }

    // --- WRITING THE TOP BAR WITH THE WRANGLING RESOURCE LINKS -------------------------------------------------------------------------------

    // if this isn't a fandom bin, quit because we don't know the fandom to show resources for
    // also quit if there are no tags to display: mostly because we rely on #wrangulator to provide the styling
    if ($('#inner').find('ul.navigation.actions').eq(1).find('li').length != 5 || $('#wrangulator').length < 1) return;

    // grab the currently viewed fandom name
    let fandom = $('#main > .heading a.tag').text();

    // now we try to find the fandom in the storage
    let links = [];
    for (var nick of Object.values(resources)) {
        if (nick[0].includes(fandom)) {
            nick.slice(1).forEach((val) => links.push(`<a href="${val[1]}" target="_blank">${val[0]} ${icons.extlink}</a>`));
            break;
        }
    }

    if (links.length > 0) {

        $("head").append(`<style tyle="text/css">${dlg}_links svg { width: 1em; height: 1em; display: inline-block; vertical-align: -0.15em; }
        </style>`);

        let bgcolor = $('#wrangulator fieldset').css('background-color');
        let fontcolor = $('#wrangulator fieldset').css('color');
        let boxshadow = $('#wrangulator fieldset').css('box-shadow');

        $('#header').append(`<div id="${cfg}_links" style="background-color: ${bgcolor}; color: ${fontcolor}; padding: 0.5em 0.5em 0.5em 1em; box-shadow: ${boxshadow}; text-align: center;
          font-size: 90%;">Fandom Resources: ${links.join(", ")}</div>`);

    }

})(jQuery);