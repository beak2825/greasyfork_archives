// ==UserScript==
// @name         AO3: Replace Y/N in works with your name
// @description  replaces Y/N and other placeholders in xReader fic with the name of your choice
// @author       escctrl
// @namespace    https://greasyfork.org/en/users/906106-escctrl
// @version      2.1
// @match        https://archiveofourown.org/works/*
// @exclude      https://archiveofourown.org/works/new*
// @exclude      https://archiveofourown.org/works/*/edit*
// @license      MIT
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.7.0/jquery.min.js
// @require      https://ajax.googleapis.com/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jqueryui-touch-punch/0.2.3/jquery.ui.touch-punch.min.js
// @require      https://update.greasyfork.org/scripts/491888/1355841/Light%20or%20Dark.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/477499/AO3%3A%20Replace%20YN%20in%20works%20with%20your%20name.user.js
// @updateURL https://update.greasyfork.org/scripts/477499/AO3%3A%20Replace%20YN%20in%20works%20with%20your%20name.meta.js
// ==/UserScript==

/* eslint-disable no-multi-spaces */
/* global jQuery, lightOrDark */

var cfg_lines = "", cfg_on = false;

// the function to deal with all the configuration - using jQueryUI for dialogs
(function($) {
    'use strict';

    // retrieve localStorage on page load
    if (!localStorage) {
        console.log("The userscript \"AO3: Replace Y/N in works with your name\" terminated early because local storage cannot be accessed");
        return false;
    }
    else loadconfig();

    // if no other script has created it yet, write out a "Userscripts" option to the main navigation
    if ($('#scriptconfig').length == 0) {
        $('#header').find('nav[aria-label="Site"] li.dropdown').last()
            .after(`<li class="dropdown" id="scriptconfig">
                <a class="dropdown-toggle" href="/" data-toggle="dropdown" data-target="#">Userscripts</a>
                <ul class="menu dropdown-menu"></ul>
            </li>`);
    }
    // then add this script's config option to navigation dropdown
    $('#scriptconfig .dropdown-menu').append(`<li><a href="javascript:void(0);" id="opencfg_replaceYN">Replace Y/N</a></li>`);

    // if the background is dark, use the dark UI theme to match
    let dialogtheme = lightOrDark($('body').css('background-color')) == "dark" ? "ui-darkness" : "base";

    // adding the jQuery stylesheet to style the dialog, and fixing the interference of AO3's styling
    $("head").append(`<link rel="stylesheet" href="https://code.jquery.com/ui/1.13.2/themes/${dialogtheme}/jquery-ui.css">`)
    .append(`<style tyle="text/css">
    #cfgdialog_replaceYN legend {font-size: inherit; height: auto; width: auto; opacity: inherit;}
    #cfgdialog_replaceYN form {box-shadow: revert; cursor:auto;}
    #cfgdialog_replaceYN fieldset {background: revert; box-shadow: revert;}
    #cfgdialog_replaceYN input[type='text'] { position: relative; top: 1px; padding: .4em; width: 40%; min-width: 5em; }
    #cfgdialog_replaceYN input[type='text'], #cfgdialog_replaceYN button { margin: 0.2em 0; }
    #cfgdialog_replaceYN fieldset p { padding-top: 0; padding-left: 0; padding-right: 0; }
    </style>`);

    // create the rows of placeholder/replacement text from what was previously stored
    let linesHTML;
    if (cfg_lines.size == 0) {
        linesHTML = `
        <input type="text" name="t1[in]" value="(Y/N),Y/N,(F/N),F/N,(G/N),G/N" placeholder="placeholder in fic"> &rarr;
        <input type="text" name="t1[out]" value="Given Name" placeholder="replacement text">
        <br/>
        <input type="text" name="t2[in]" value="(Y/L/N),Y/L/N,(L/N),L/N" placeholder="placeholder in fic"> &rarr;
        <input type="text" name="t2[out]" value="Family Name" placeholder="replacement text">`;
    }
    else {
        // resetting the numbers of the t# so we don't count up into the hundreds if people remove/add lines
        let i = 1;
        linesHTML = [];
        cfg_lines.forEach((val, key) => {
            linesHTML.push(`
            <input type="text" name="t${i}[in]" value="${val.in}" placeholder="placeholder in fic"> &rarr;
            <input type="text" name="t${i}[out]" value="${val.out}" placeholder="replacement text">`);
            i++;
        });
        linesHTML = linesHTML.join(`<br/>`);
    }

    // the config dialog container
    let cfg = document.createElement('div');
    cfg.id = 'cfgdialog_replaceYN';
    $(cfg).html(`<p>Enter the placeholders used in the fic in the first textfield, and what should replace them in the second textfield.</p>
    <p>You can enter multiple placeholders (that should all be replaced by the same text) in one line and separate them with a comma.</p>
    <p>Don't worry about uppercase/lowercase, the placeholders are treated as case-insensitive.</p>
    <form>
    <fieldset><legend>Placeholders and Replacements</legend>
        ${linesHTML}
        <button class="ui-button ui-widget ui-corner-all" id="addmore">+ Add more</button>
    </fieldset>
    <fieldset><legend>Toggle functionality on/off</legend>
    <label for="replaceYN_onoff">Replace text automatically</label><input type="checkbox" name="replaceYN_onoff" id="replaceYN_onoff" ${(cfg_on==="true") ? 'checked="checked"' : ""}>
    </fieldset>
    <p style="font-size: 80%; font-style: italic;">Saving changes will refresh the page to make this configuration take effect immediately.</p>
    <!-- Allow form submission with keyboard without duplicating the dialog button -->
    <input type="submit" tabindex="-1" style="display: none;">
    </form>`);

    // attach it to the DOM so that selections work
    $("body").append(cfg);

    // turn checkboxes and radiobuttons into pretty buttons
    $( "#cfgdialog_replaceYN input[type='checkbox']" ).checkboxradio();

    let dialogwidth = parseInt($("body").css("width")); // parseInt ignores letters (px)
    dialogwidth = dialogwidth > 400 ? 400 : dialogwidth * 0.9;

    // initialize the dialog (but don't open it)
    $( "#cfgdialog_replaceYN" ).dialog({
        appendTo: "#main",
        modal: true,
        title: 'Replace Y/N Configuration',
        draggable: true,
        resizable: false,
        autoOpen: false,
        width: dialogwidth,
        position: {my:"center", at: "center top"},
        buttons: {
            Reset: deleteconfig,
            Save: setconfig,
            Cancel: closedialog
        }
    });

    function closedialog() {
        $( "#cfgdialog_replaceYN" ).dialog( "close" );
    }

    // on click of the menu, open the configuration dialog
    $("#opencfg_replaceYN").on("click", function(e) {
        $( "#cfgdialog_replaceYN" ).dialog('open');
    });

    // event triggers if form is submitted with the <enter> key
    $( "#cfgdialog_replaceYN form" ).on("submit", (e)=>{
        e.preventDefault();
        setconfig();
    });

    // event triggers if addmore button is clicked
    $( "#cfgdialog_replaceYN #addmore" ).on("click", (e)=>{
        e.preventDefault();
        // grab the previous row's t# and increment by one
        let next = $( "#cfgdialog_replaceYN #addmore" ).prev().attr('name');
        next = parseInt(next.match(/\d+/)[0])+1;
        // add a new line of placeholder/replacement text fields
        $( "#cfgdialog_replaceYN #addmore" ).before(`<br/>
        <input type="text" name="t${next}[in]" value="" placeholder="placeholder in fic"> &rarr;
        <input type="text" name="t${next}[out]" value="" placeholder="replacement text">`);
    });

    // functions to deal with the localStorage
    function loadconfig() {
        cfg_lines = new Map(JSON.parse( localStorage.getItem('script-replaceYN') ));
        cfg_on = localStorage.getItem('script-replaceYN-on');
    }
    function setconfig() {
        // grab form fields for easier selection later (as an array for iterating later)
        let allfields = $( "#cfgdialog_replaceYN form input[type=text]" ).toArray();

        // now we turn this into a [t# => { in: "placeholders", out: "text" }, t# => {},...]
        // that allows reducing it to a single storage item without repetition
        // list of t# needs to be an iterable object we can access by key, ie. a Map(), bc we don't know how many there will be
        // inside of each t# we're happy with an Object bc we only need to access the in/out keys, not iterate over them
        var mappedfields = new Map();
        allfields.forEach((field) => {
            let row = field.name.match(/^t\d+/)[0];
            let key = field.name.match(/\[(in|out)\]/)[1];
            if (!mappedfields.has(row)) mappedfields.set(row, {}); // initializing the row
            // setting the in/out values in that row by ellipse-"unwrapping" the existing value and adding a new key:value to it
            // to not name the key "key" but use its variable value (in/out), it has to be put into []
            mappedfields.set(row, {...mappedfields.get(row), [key]: field.value});
        });

        // rows where either in or out field is empty get deleted
        mappedfields.forEach((val, key) => { if (val.in == "" || val.out == "") mappedfields.delete(key); });

        // serialize the result for storage
        localStorage.setItem('script-replaceYN', JSON.stringify(Array.from( mappedfields.entries() )));

        // get and store enabling/disabling the logic
        cfg_on = $( "#cfgdialog_replaceYN #replaceYN_onoff" ).prop('checked') ? "true" : "false"; // needs to be string
        localStorage.setItem('script-replaceYN-on', cfg_on);

        // close the dialog and F5 the page, since changes will only apply on refresh
        closedialog();
        location.reload();
    }
    function deleteconfig() {
        // empties all fields in the form
        $('#cfgdialog_replaceYN form [name]').val("");

        // delete the localStorage
        localStorage.removeItem('script-replaceYN');
        localStorage.removeItem('script-replaceYN-on');

        // close the dialog and F5 the page to apply the changes
        closedialog();
        location.reload();
    }

})(jQuery);

// function to turn the configuration into actionable regex
function cfg2regex() {
    let replacelist = [];
    cfg_lines.forEach((val, key) => {
        // val.in has to be split by comma, trimmed, and escaped
        let inArr = val.in.split(",");

        // val.out can be taken literal
        // each of the in's + the out then make a pair of values in an array. [in, out]
        inArr.forEach( (v, i) => {
            replacelist.push(Array( v.trim().replace(/[/.*+?^${}()|[\]\\]/g, '\\$&'), val.out ));
        });
    });
    return replacelist;
}

// function to run the text replacement on Y/N and [Y/]L/N etc
// sadly this can run only on initial page load - after that the work text has been changed and we wouldn't find the placeholders to replace
function replaceYN() {
    // don't run a replace if no name has been configured or if user turned the thing off
    if (cfg_lines.size > 0 && cfg_on == "true") {

        // turn the configuration into actionable regex
        let replacelist = cfg2regex();

        // run the replacement on each paragraph of the work
        document.querySelectorAll('#main #chapters .userstuff > *').forEach((p) => {
            // in each paragraph, now replace all instances of our placeholders (token[0] = in, token[1] = out)
            replacelist.forEach((token) => {
                 p.innerHTML = p.innerHTML.replace(new RegExp(token[0], "ig"), token[1]);
            });
        });
    }
}

// replace text only when page finished loading
if (document.readyState === 'complete') replaceYN();
else window.addEventListener('load', () => replaceYN());

