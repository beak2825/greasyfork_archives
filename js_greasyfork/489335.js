// ==UserScript==
// @name         AO3: Sticky Comment Box
// @namespace    https://greasyfork.org/en/users/906106-escctrl
// @version      2.3
// @description  gives you a comment box that stays in view as you scroll and read the story
// @author       escctrl
// @license      MIT
// @match        *://archiveofourown.org/works/*
// @match        *://archiveofourown.org/collections/*/works/*
// @exclude      *://archiveofourown.org/works/*/new
// @exclude      *://archiveofourown.org/works/*/edit*
// @exclude      *://archiveofourown.org/works/new*
// @exclude      *://archiveofourown.org/works/search*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.7.0/jquery.min.js
// @require      https://ajax.googleapis.com/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jqueryui-touch-punch/0.2.3/jquery.ui.touch-punch.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/489335/AO3%3A%20Sticky%20Comment%20Box.user.js
// @updateURL https://update.greasyfork.org/scripts/489335/AO3%3A%20Sticky%20Comment%20Box.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    // despite the @excludes, there are always ways that editing a work ends up with AO3's URL being just /works/xxxxx >:(
    // so we can't rely on URLs, we gotta check for ourselves and stop if there's no fic to display
    if ($('#main #chapters').length == 0) return;

    // select the work ID from the URL - we save cache with this, so it won't matter what the rest of the URL is (collections, chapters)
    const workID = new URL(window.location.href).pathname.match(/\/works\/(\d+)/i)[1];

    // let's figure out if there are multiple chapters that could be commented on
    const chapterIDs = $('#main ul.work.navigation ul#chapter_index').length > 0 ? $('#main ul.work.navigation ul#chapter_index select#selected_id option').toArray() // when in chapter-by-chapter view, there's a Chapter Index button
                   : $('#main ul.work.navigation li.chapter.bychapter').length > 0 ? $('.chapter.preface h3.title a').toArray() // when in entire-work view, there's a Chapter By Chapter button
                   : []; // and if neither exists, it's a work without chapters

    // if we're in entire-work view, we wanna give a hint to the user which chapter they're currently seeing
    if ($('#main ul.work.navigation li.chapter.bychapter').length > 0) {
        $(document).on('scrollend', () => { whatsInView(); }); // listen to scrolling for updates
    }

    // gets called by scrolling events, and when dialog is first created
    function whatsInView() {
        // here we want to figure out which chapter is currently in view
        $(chapterIDs).each((i) => {
            let rect = $('#chapter-'+(i+1)).get(0).getBoundingClientRect();
            if ((rect.top >= 0 && rect.top <= (window.innerHeight || document.documentElement.clientHeight)) || // top edge is visible
                (rect.bottom >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)) || // bottom edge is visible
                (rect.top < 0 && rect.bottom > (window.innerHeight || document.documentElement.clientHeight))) { // top is above and bottom is below viewport (we're seeing the middle of it)

                // based on what's in view, we can update the selection
                $('#float_cmt_chap select option').eq(i+1).text(`Chapter ${(i+1)} (viewing)`);
            }
            // the others get reset
            else $('#float_cmt_chap select option').eq(i+1).text(`Chapter ${(i+1)}`);
        });
    }

    // sticky button to open the comment box
    let cmtButton = `<div id="float_cmt_toggle"><button>Comment Box</button></div>`;
    $('body').append(cmtButton);

    // listening to button click: open or close the dialog
    $('#float_cmt_toggle').on('click', (e) => {
        toggleCommentBox();
    });

    // this is called by the button and also the keyboard shortcut
    function toggleCommentBox() {
        if ($(dlg+":hidden").length > 0) openCommentBox();
        else if ($(dlg+":visible").length > 0) closeCommentBox();
    }

    var dlg = "#float_cmt_dlg";

    let dialogtheme = lightOrDark($('body').css('background-color')) == "dark" ? "ui-darkness" : "base"; // if the background is dark, use the dark UI theme to match
    let fontsize = $("#main #chapters .userstuff").css('font-size'); // enforce the reading font size for the dialog
    $("head").append(`<link rel="stylesheet" href="https://code.jquery.com/ui/1.13.2/themes/${dialogtheme}/jquery-ui.css">`)
    .append(`<style tyle="text/css">.ui-dialog ${dlg}, .ui-dialog .ui-dialog-titlebar, .ui-dialog .ui-dialog-buttonpane button { font-size: ${fontsize}; }
    .ui-dialog .ui-dialog-buttonpane button { min-width: 2em; min-height: 2em; padding: 0 0.5em; }
    .ui-dialog .ui-dialog-buttonpane { padding: 0; margin: 0; }
    ${dlg} select { width: unset; min-width: unset; position: relative; bottom: 0.2em; }
    ${dlg} input { width: 10em; min-width: unset; }
    #float_cmt_counter, #float_cmt_settings_hint, #float_cmt_guest_hint { font-size: 80%; padding: 0.2em; margin: 0.2em 0; }
    #float_cmt_toggle { position: fixed; bottom: 0.5em; right: 0.5em; z-index: 3; }
    #float_cmt_toggle button { height: unset; font-size: ${fontsize}; }</style>`);

    // prepping the dialog (without opening it)
    createCommentBox();

    // prepares the dialog and loads the cache into it
    function createCommentBox() {
        // designing the floating box
        $("body").append(`<div id="float_cmt_dlg"></div>`);

        // optimizing the GUI in case it's a mobile device
        let screen = parseInt($("body").css("width")); // parseInt ignores letters (px)
        let buttonText = screen <= 500 ? false : true;
        let dialogwidth = screen <= 500 ? screen * 0.9 : 500;
        let resize = screen <= 500 ? false : true;

        $(dlg).dialog({
            modal: false,
            autoOpen: false,
            resizable: resize,
            draggable: true,
            width: dialogwidth,
            position: { my: "right bottom", at: "right bottom", of: "window" },
            title: "Comment",
            buttons: [
                { text: "Settings", icon: "ui-icon-gear", showLabel: buttonText, click: () => { toggleSettings(); } },
                { text: "Quote", icon: "ui-icon-caret-2-e-w", showLabel: buttonText, click: () => { grabHighlight(); } },
                { text: "Discard", icon: "ui-icon-trash", showLabel: buttonText, click: () => { discardComment(); } },
                { text: "Post", icon: "ui-icon-comment", showLabel: buttonText, click: () => { submitComment(); } },
                { text: "Close", icon: "ui-icon-close", showLabel: buttonText, click: () => { closeCommentBox(); } },
            ],
            // positioning stuff below is so that it SCROLLS WITH THE PAGE JFC https://stackoverflow.com/a/9242751/22187458
            create: function(event, ui) {
                $(event.target).parent().css('position', 'fixed');
                // and also to put the dialog where it was last left across pageloads
                let cachemap = new Map(JSON.parse(localStorage.getItem('floatcmt')));
                if (cachemap.get('pos')) {
                    let pos = JSON.parse(cachemap.get('pos'));
                    pos.of = $(window);
                    $(dlg).dialog('option','position', pos);
                }
                // issue: if you drag it around so far that the screen begins to scroll, the dialog disappears. need to refresh the page to get it back
                // workaround: force the dialog to stay within the visible screen - no dragging outside of viewport means it can't disappear
                $(dlg).dialog("widget").draggable("option","containment","window");
            },
            resizeStop: function(event, ui) {
                let position = [(Math.floor(ui.position.left) - $(window).scrollLeft()),
                                 (Math.floor(ui.position.top) - $(window).scrollTop())];
                $(event.target).parent().css('position', 'fixed');
                $(dlg).dialog('option','position',position);
            },
            beforeClose: function() {
                // store the position of the dialog so we can reopen it there after page refresh
                let cachemap = new Map(JSON.parse(localStorage.getItem('floatcmt')));

                let pos = $(dlg).dialog( "option", "position" );
                pos = { my: pos.my, at: pos.at }; // need to keep only the pieces we need - it's a cyclic object!
                cachemap.set('pos', JSON.stringify(pos));

                // store the current settings and guest data (if exists) along with it
                cachemap.set('quotes', $('#float_cmt_quote').val());
                cachemap.set('kbd', $('#float_cmt_kbd').val());
                if ($('#float_cmt_name').length > 0) cachemap.set('name', $('#float_cmt_name').val());
                if ($('#float_cmt_email').length > 0) cachemap.set('email', $('#float_cmt_email').val());

                bindShortcut($('#float_cmt_kbd').val()); // update the keyboard shortcut binding so it takes effect

                localStorage.setItem('floatcmt', JSON.stringify( Array.from(cachemap.entries()) ));
            },
            close: function() {
                // remove formatting buttonbar event listener while dialog is closed so we don't stack listeners each time the dialog is reopened
                if ($(dlg).find('.comment-format').length > 0) $(dlg).find('.comment-format a').off("click.cmtfmt");
            }
        });

        // load cache: [0] = text, [1] = quotes, [2] = kbd, [3] = name, [4] = email
        let cache = loadCache();

        $(dlg).html(`<div id="float_cmt_title" style="margin: 0 0 0.2em 0;">Comment as <span id="float_cmt_as"></span> on <span id="float_cmt_chap"></span></div>
                     <div id="float_cmt_userinput"><textarea style="min-height: 8em">${cache[0]}</textarea>
                     <div id="float_cmt_counter"><span>10000</span> characters left</div>
                     <div id="float_cmt_settings" style="display: none; margin: 0.5em 0 0 0;">
                     Quotes: <select id="float_cmt_quote"><option value="i" ${cache[1] == "i" ? "selected" : ""}>Italics</option>
                     <option value="q" ${cache[1] == "q" ? "selected" : ""}>Blockquote</option></select>
                         ${screen > 500 ? `Keyboard Shortcut: <input id="float_cmt_kbd" type="text" value="${cache[2]}">
                         <div id="float_cmt_settings_hint" style="display: none;" class="ui-state-highlight ui-corner-all">
                         Use any combination of Ctrl/Alt/Shift and a letter or number</div>` : `<input id="float_cmt_kbd" value="${cache[2]}" type="hidden">`}
                     </div></div>`);

        // if we're logged in, add the pseud selection to the dialog so we know which one to submit with
        if ($("#add_comment_placeholder [name='comment[pseud_id]']").length == 1) {
            // clone the pseuds - either a hidden <input>, or a <select> - for our purposes
            let pseud_id = $("#add_comment_placeholder [name='comment[pseud_id]']").eq(0).clone().attr('id', 'float_cmt_pseud_select');
            $('#float_cmt_as').append(pseud_id); // add it to the dialog into the placeholder
            // if there are no pseuds to select, display the username
            if ($(pseud_id).prop('tagName') == "INPUT") $('#float_cmt_as').append($("#add_comment_placeholder span.byline").text());
        }
        // Guests need to enter a display name and email address (retrieved from cache)
        else {
            $('#float_cmt_as').append("&#9662;Guest").css('cursor', 'n-resize'); // show a generic "Guest" just so it's not blank
            $('#float_cmt_title').after(`<div id="float_cmt_guest">
            <span style="width: 3.5em; display: inline-block;">Name: </span><input type="text" id="float_cmt_name" value="${cache[3]}"><br />
            <span style="width: 3.5em; display: inline-block;">Email: </span><input type="text" id="float_cmt_email" value="${cache[4]}"><small> (won't be published)</small></div>
            <div id="float_cmt_guest_hint" class="ui-state-error ui-corner-all" style="display: none;">Both fields are required!</div>`);
            // show/hide the guest name & email to let user save space by clicking on "Guest" label
            $('#float_cmt_as').on('click', () => {
                $('#float_cmt_guest').toggle("slow", function() {
                    if ($(this).is(":visible")) $('#float_cmt_as').html("&#9662;Guest");
                    else $('#float_cmt_as').html("&#9656;Guest");
                });
            });
        }

        // building a chapter selection list - we only use this to pick where to send the comment to
        let select_chapter = `<option value="/works/${workID}/comments" selected="selected">Entire Work</option>`;
        // build chapter options if there are any: <option value="/chapters/chapterID/comments">Chapter #</option>
        if ($(chapterIDs[0]).prop('tagName') == "A") {
            $(chapterIDs).each(function(i) {
                select_chapter += `<option value="${$(this).attr('href').match(/\/chapters\/\d+/i)[0]}/comments">${$(this).text()}</option>`;
            });
        }
        else if ($(chapterIDs[0]).prop('tagName') == "OPTION") {
            select_chapter = `<option value="/works/${workID}/comments">Entire Work</option>`; // reset to not-selected option
            $(chapterIDs).each(function(i) {
                select_chapter += `<option value="/chapters/${$(this).val()}/comments" ${$(this).prop('selected') ? "selected='selected'" : ""}>
                                   Chapter ${i+1}${$(this).prop('selected') ? " (viewing)" : ""}</option>`;
            });
        }
        select_chapter = "<select>" + select_chapter + "</select>";
        $('#float_cmt_chap').append(select_chapter);

        // check what's visible on page load (might be a refresh halfway down the page)
        if ($('#main ul.work.navigation li.chapter.bychapter').length > 0) whatsInView();

        // if there are no pseuds to select, and no chapters to select, save space and hide the whole part
        if (($('#float_cmt_pseud_select').prop('tagName') == "INPUT") && $('#float_cmt_chap select option').length == 1) $('#float_cmt_title').hide();

        // listen to user typing so we can count characters and such
        $('#float_cmt_userinput textarea').on('input', function(e) {
            whenTextChanges(e.target);
        });

        // set the current keyboard shortcut binding
        bindShortcut(cache[2]);

        // in the settings field, let user set keyboard shortcut by pressing it
        $('#float_cmt_kbd').on('keydown', function(e) {
            e.preventDefault(); e.stopPropagation(); // this stops the browser from entering in the textfield or reacting for its own shortcuts

            // allow Backspace and Del key to reset to "" so shortcuts can be disabled
            if (e.key == "Backspace" || e.key == "Delete") {
                $('#float_cmt_settings_hint').hide();
                $('#float_cmt_kbd').val("");
            }
            // is this something we consider a valid option?
            if (e.key.length > 1 || e.key == " ") return; // only letters/numbers have a e.key string length of 1
            if (!e.ctrlKey && !e.altKey) { // don't even try if it isn't a combo using Ctrl or Alt
                $('#float_cmt_settings_hint').show();
                return;
            }

            // if it's good, build the text to show user what they selected
            $('#float_cmt_settings_hint').hide();
            let kbd = `${e.ctrlKey ? "Ctrl + " : ""}${e.altKey ? "Alt + " : ""}${e.shiftKey ? "Shift + " : ""}${e.key.toLowerCase()}`;
            $('#float_cmt_kbd').val(kbd);
        });
    }

    // bind the keyboard shortcut for toggling the dialog
    function bindShortcut(kbd) {
        $(window).off('keydown.floatcmt'); // start fresh or we're binding multiple listeners
        if (kbd == "") return; // if the shortcut was disabled, don't add any listeners
        kbd = kbd.split(" + "); // setting text split into chunks for easier comparison

        // listen to keypress if our shortcut was called (we're using the .floatcmt namespace for controlled on/off())
        $(window).on('keydown.floatcmt', function(e) {
            if (e.key.length > 1) return; // only letters/numbers have a e.key string length of 1
            if (!e.ctrlKey && !e.altKey) return; // don't even try if it isn't a combo using Ctrl or Alt
            //console.log(`${e.ctrlKey ? "Ctrl + " : ""}${e.altKey ? "Alt + " : ""}${e.shiftKey ? "Shift + " : ""}${e.key.toLowerCase()}`);

            // was this our shortcut?
            if (e.ctrlKey === kbd.includes("Ctrl") && e.altKey === kbd.includes("Alt") &&
                e.shiftKey === kbd.includes("Shift") && kbd.includes(e.key.toLowerCase())) {
                e.preventDefault(); e.stopPropagation(); // this stops the browser from reacting to its valid keyboard shortcuts (menu)
                toggleCommentBox();
            }
        });
    }

    // counter and cache: triggered by event and other functions when text in the commentbox changes
    function whenTextChanges(el) {
        // calculate remaining characters
        let cmt = $(el).val();
        let rem = 10000 - (cmt.length + cmt.split("\n").length-1); // count like AO3 does: linebreak = 2 chars
        $('#float_cmt_counter span').text(rem);

        // warning if we've exceeded allowed characters
        if (rem<0) $('#float_cmt_counter').addClass('ui-state-error ui-corner-all');
        else $('#float_cmt_counter').removeClass('ui-state-error ui-corner-all');

        storeCache();
    }

    // shows the dialog
    function openCommentBox() {
        $(dlg).dialog('open');

        // check if dialog opened off viewport (browser window now smaller) https://stackoverflow.com/a/7557433/22187458
        let rect = $(dlg).get(0).getBoundingClientRect();
        if (!(rect.top >= 0 && rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth) )) {
            // then we reset to the default bottom right
            $(dlg).dialog('option','position', { my: "right bottom", at: "right bottom", of: window });
        }

        // setting the cursor at the end of the available text
        let area = $('#float_cmt_userinput textarea').get(0);
        area.focus();
        area.setSelectionRange(area.value.length, area.value.length);

        // update the char counter with any cached text
        whenTextChanges(area);

        // Formatting Buttonbar support! trigger the value-has-changed event manually when a button is clicked, so the char counter updates
        // adding this while opening dialog, when it's almost certain the comment formatting script has finished loading
        if ($(dlg).find('.comment-format').length > 0) $(dlg).find('.comment-format a').on("click.cmtfmt", function() { $(area).trigger('input'); });
    }

    // hides the dialog (more stuff is handled in the beforeClose and close dialog events)
    function closeCommentBox() {
        $(dlg).dialog('close');
    }

    // display or hide a few setting options within the dialog (below the textarea)
    function toggleSettings() {
        $('#float_cmt_settings').toggle();
    }

    // takes highlighted text and appends it to the comment
    function grabHighlight() {
        // copy highlighted text works only on summary, notes, and fic
        if ($(window.getSelection().anchorNode).parents(".userstuff").length > 0) {
            let area = $('#float_cmt_userinput textarea');
            let highlighted = $('#float_cmt_quote').val() == "i" ?
                `<i>${window.getSelection().toString().trim()}</i>` :
                `<blockquote>${window.getSelection().toString().trim()}</blockquote>`;

            $(area).val($(area).val() + highlighted); // insert new text at the end

            whenTextChanges(area); // trigger an update for the counter
        }
    }

    // update the stored cache (called on any text change)
    function storeCache() {
        let cachemap = new Map(JSON.parse(localStorage.getItem('floatcmt')));

        // cache is stored per page: workID -> text, workID-date -> last update date
        // update current values in Map() and localStorage immediately
        cachemap.set(workID, $('#float_cmt_userinput textarea').val()).set(workID+"-date", Date.now());
        localStorage.setItem('floatcmt', JSON.stringify( Array.from(cachemap.entries()) ));
    }

    // on page load, retrieve previously stored cached text and settings
    function loadCache() {
        let cachemap = new Map(JSON.parse(localStorage.getItem('floatcmt')));

        // squeezing in here logic to select the correct quotes & kbd shortcut setting
        let quotes = cachemap.get('quotes') || "";
        let kbd = cachemap.get('kbd') || "";
        let name = cachemap.get('name') || "";
        let email = cachemap.get('email') || "";

        // any cache outdated? we keep it for max 1 month to avoid storage limit issues
        let maxdate = createDate(0, -1, 0);
        cachemap.forEach((v, k) => {
            if (["quotes", "kbd", "pos"].includes(k)) return; // skip the non-comment parts
            if (k.endsWith("-date")) {
                let cachedate = new Date(v);
                if (cachedate < maxdate) {
                    cachemap.delete(k.slice(0, -5));
                    cachemap.delete(k);
                }
            }
            // delete any possible leftovers that don't have an associated date
            else if (cachemap.get(k+"-date") === undefined) cachemap.delete(k);
        });

        // cache is stored per page: workID -> text, workID-date -> last update date
        let cache = cachemap.get(workID) || ""; // blank if there's nothing stored yet for this workID

        return [cache, quotes, kbd, name, email];
    }

    // clean up cache for this page
    function deleteCache() {
        let cachemap = new Map(JSON.parse(localStorage.getItem('floatcmt')));

        // cache is stored per page: workID -> text, workID-date -> last update date
        cachemap.delete(workID);
        cachemap.delete(workID+'-date');

        localStorage.setItem('floatcmt', JSON.stringify( Array.from(cachemap.entries()) ));
    }

    // removes all traces of the comment for this page
    function discardComment() {
        $('#float_cmt_userinput textarea').val(""); // resets the textarea to blank
        whenTextChanges($('#float_cmt_userinput textarea')); // updates the counter accordingly
        deleteCache(); // deletes the cached data
        closeCommentBox(); // and hides the dialog
    }

    // assemble the form data needed to submit the comment
    function submitComment() {
        let action = $("#float_cmt_chap select").val(); // per selection, the work or chapter target for submitting a comment

        // consolidating the fields we need for submitting a comment
        var fd = new FormData();
        fd.set("authenticity_token", $("#add_comment_placeholder input[name='authenticity_token']").val());
        fd.set("comment[comment_content]", $(dlg).find('textarea').val());

        // are we logged in?
        if ($("#float_cmt_pseud_select").length > 0) {
            // pick up the selected pseud (either hidden <input> or <select> option)
            fd.set("comment[pseud_id]", $("#float_cmt_pseud_select").val());
        }
        else {
            // check that everything's filled in that's needed
            let guest_name = $("#float_cmt_name").val();
            let guest_email = $("#float_cmt_email").val();
            let checkemail = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
            if (guest_name == "" || $("#float_cmt_email").val() == "" || !checkemail.test(guest_email)) {
                $('#float_cmt_guest_hint').show();
                return;
            }
            $('#float_cmt_guest_hint').hide();

            fd.set("comment[name]", guest_name);
            fd.set("comment[email]", guest_email);
        }

        // no clue what this is, but it's a hidden field in the standard comment form
        if (action.startsWith('/chapters/')) fd.set("controller_name", "chapters");
        else fd.set("controller_name", "works");

        // turn buttons into a loading indicator
        let buttons = $(dlg).dialog( "option", "buttons" );
        $(dlg).dialog( "option", "buttons", [{
            text: "Posting Comment...",
            click: function() { return false; }
        }]);

        // post the comment and reload the page to show it
        grabResponse(action, fd, buttons);
    }

    // actually submit the comment in a POST request
    async function grabResponse(action, fd, buttons) {
        // post the comment! this uses the Fetch API to POST the form data
        const response = await fetch(action, { method: "POST", body: fd });

        // response might be not OK in case of retry later (427)
        if (!response.ok) {
            // show an error to the user
            $(dlg).dialog( "option", "buttons", [{
                text: "Error saving comment!",
                click: function() { return false; }
            }]);
            return false; // stop all processing (comment is still cached)
        }

        discardComment(); // clean up since it's now posted

        // question: did we post to a single chapter while viewing the entire work? then we probably want to keep on reading.
        // action tells us where we posted to, and if that was a /chapters/...
        // we can still tell that we were viewing an entire work by the available "Chapter by Chapter" button
        if (action.startsWith('/chapters/') && $('#main ul.work.navigation li.chapter.bychapter').length > 0) {
            $(dlg).dialog( "option", "buttons", buttons ); // reset the buttons in the dialog (which just said "Posting Comment..." now)
        }

        // otherwise we want to see the comment we just posted
        // eff this, there's no way to get the original redirected location of the POST (which includes the new #comment_id at the end)
        // so all we can do is look at the response page with comments shown (per the redirected GET)
        else {
            // puzzling together the reponse stream until we have a full HTML page (to avoid another background pageload)
            let responseBody = "";
            for await (const chunk of response.body) {
                let chunktext = new TextDecoder().decode(chunk); // turns it from uint8array to text
                responseBody += chunktext;
            }

            // find out if there's multiple pages of comments now, based on the comment pagination (pick the last page)
            let lastpage = $(responseBody).find('#comments_placeholder ol.pagination').first().children().eq(-2).find('a').attr('href');
            // if there's no pagination, just use the redirect URL; either way scroll that to the footer
            lastpage = (lastpage > "") ? lastpage.slice(0, -9)+'#footer' : response.url+'#footer';

            // redirect us to where we're hopefully seeing the comment we just posted
            window.location.href = lastpage;
        }
    }

})(jQuery);

function createDate(days, months, years) {
    var date = new Date();
    date.setFullYear(date.getFullYear() + years);
    date.setMonth(date.getMonth() + months);
    date.setDate(date.getDate() + days);
    return date;
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