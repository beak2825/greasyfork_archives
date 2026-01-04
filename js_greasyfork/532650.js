// ==UserScript==
// @name         AO3: [Wrangling] View and Post Comments from the Bin
// @namespace    https://greasyfork.org/en/users/906106-escctrl
// @description  Loads a preview of top-level comments (such as translations) and lets you comment on the tag
// @author       escctrl
// @version      2.5
// @match        *://*.archiveofourown.org/tags/*/wrangle?*
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.7.0/jquery.min.js
// @require      https://ajax.googleapis.com/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jqueryui-touch-punch/0.2.3/jquery.ui.touch-punch.min.js
// @require      https://update.greasyfork.org/scripts/491888/1355841/Light%20or%20Dark.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/532650/AO3%3A%20%5BWrangling%5D%20View%20and%20Post%20Comments%20from%20the%20Bin.user.js
// @updateURL https://update.greasyfork.org/scripts/532650/AO3%3A%20%5BWrangling%5D%20View%20and%20Post%20Comments%20from%20the%20Bin.meta.js
// ==/UserScript==

/* eslint-disable no-multi-spaces */
/* global jQuery, lightOrDark */

(function($) {
    'use strict';

    if ($('#wrangulator').length === 0) return; // bow out in an empty bin

    /***** INITIALIZE THE COMMENTS DIALOG *****/

    let dlg = "#peekTopLevelCmt";
    // prepare the HTML framework within the new dialog including the textarea
    $("#main").append(`<div id="peekTopLevelCmt">
            <div id="toplvlcmt-placeholder"></div>
            <div id="add-toplvlcmt">
                <div id="pseud-toplvlcmt"></div>
                <textarea data-tagname="" data-commentid="" id="txt-toplvlcmt"></textarea>
                <p class="submit"><span id="toplvlcmt-pagelink"></span><button type="button" class="submitComment"><span class="submitCommentText">Comment</span><span class="spin"/></button></p>
            </div>
        </div>`);

    // adding the jQuery stylesheet to style the dialog, and fixing the interference of AO3's styling
    if(document.head.querySelector('link[href$="/jquery-ui.css"]') === null) {
        // if the background is dark, use the dark UI theme to match
        let dialogtheme = lightOrDark($('body').css('background-color')) == "dark" ? "dark-hive" : "base";
        $("head").append(`<link rel="stylesheet" href="https://code.jquery.com/ui/1.13.2/themes/${dialogtheme}/jquery-ui.css">`);
    }
    $("head").append(`<style type="text/css">.ui-widget, ${dlg}, .ui-dialog .ui-dialog-buttonpane button { font-size: revert; line-height: 1.286; }
        .ui-widget a { cursor: pointer; }
        ${dlg} .toplvlcmt { margin-top: 1em; clear: right; }
        ${dlg} .toplvlcmt .toplvlby { font-size: 0.8em; margin: 0 0 0 0.5em; float: right; }
        ${dlg} .toplvlcmt .userstuff { border-left: 2px dotted ${$(dlg).css('color')}; padding-left: 0.5em; }
        ${dlg} .comment-format a { padding: 0.3em 0.5em; font-size: 90%; width: 1em; }
        ${dlg} .fontawesomeicon { display: inline-block; width: 1em; height: 1em; vertical-align: -0.125em; color: ${$(dlg).css('color')} }
        ${dlg} textarea { width: 100%; resize: vertical; height: 5em; min-height: 5em; clear: both; }
        ${dlg} .cancelEdit { margin-left: 0.5em; }
        ${dlg} #add-toplvlcmt { margin-top: 1em; }
        ${dlg} #toplvlcmt-pagelink { float: left; }

        #load-toplvlcmt, ${dlg} .submitComment { white-space: nowrap; }
        #load-toplvlcmt .spin, ${dlg} .submitComment .spin { display: none; margin-left: 0.5em; }
        #load-toplvlcmt .spin::after {
            content: "\\2312";
            display: inline-block;
            animation: loading 3s linear infinite;
        }
        @keyframes loading {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        </style>`);

    // optimizing the size of the GUI in case it's a mobile device
    let dialogwidth = window.visualViewport.width;
    dialogwidth = dialogwidth > 700 ? 700 : dialogwidth * 0.9;
    let dialogheight = window.visualViewport.height;
    dialogheight = dialogheight * 0.7;

    $(dlg).dialog({
        appendTo: "#main",
        modal: false,
        autoOpen: false,
        resizable: false,
        width: dialogwidth,
        maxHeight: dialogheight,
        title: "Tag Comment Threads",
        close: function() {
            // reset everything including the data-tagname attribute
            resetDialog();
            $(dlg).find('textarea')[0].dataset.tagname = "";
            $(dlg).data('openedOnTag', "");
        }
    });

    // we add a button the Manage header to load all comments on this page at once
    $('#wrangulator').find('thead th').filter(function(ix, el) { return $(this).text() === "Manage"; })
                                      .append(`<br /><button type="button" id="load-toplvlcmt">Load all Comments<span class="spin"/></button>`);

    /***** BUTTON EVENTS *****/

    // when user clicks the "Load all Comments" button
    $('#wrangulator').on('click','#load-toplvlcmt', function(e) {
        e.preventDefault();
        loadAllTopLevelComments();
    });

    // we co-opt the /comments link and instead of opening the page, we give a little additional dialog
    $('#wrangulator').on('click','a[href$="/comments"]', async function(e) {
        e.preventDefault();
        let row = $(e.target).parents('tr')[0];

        if (row.dataset.cmttoptevel === "unknown") {
            let resolved = await loadTopLevelComments(row); // if we have no data for this tag yet, we load it
            if (resolved === "failed") { // if XHR failed, we have probably encountered a 403 or 500 error. don't open the dialog
                alert('Top Level Comments could be loaded, we encountered errors trying to load the Comment page.');
                return;
            }
        }
        $(dlg).find('textarea').prop('value', ''); // empty the textbox content from whatever was there before
        viewTopLevelComments(e.currentTarget); // then we write out the dialog
    });

    // not a button event, but if the window resizes the dialog would move off of the screen
    $(window).on('resize', function(e) {
        // optimizing the size of the GUI in case it's a mobile device
        let dialogwidth = window.visualViewport.width;
        dialogwidth = dialogwidth > 700 ? 700 : dialogwidth * 0.9;

        let dialogheight = window.visualViewport.height;
        dialogheight = dialogheight * 0.7;

        let target = $(dlg).dialog("option", "position").of; // find the current target button

        // reposition and resize the dialog
        $(dlg).dialog("option", "position", { my: "left top", at: "left bottom", of: target } )
              .dialog("option", "width", dialogwidth)
              .dialog("option", "maxHeight", dialogheight);
    });

    /***** RETRIEVE TOP-LEVEL COMMENTS *****/

    // on pageload, silently loop over all tags on the page
    // check if we already have the tag stored

    // grab the user's pseuds from storage
    let pseuds = JSON.parse(sessionStorage.getItem("cmt_pseud") || null);
    $(dlg).find('#pseud-toplvlcmt').html(pseuds);

    // after a couple of seconds we can be reasonably sure other scripts would have added their comments buttons
    let timeout = setTimeout(() => {
        let cmtButtonExists = $('#wrangulator').find('a[href$="/comments"]').length;
        if (!cmtButtonExists) console.log('added Comments buttons after 2 sec because none were present from other scripts. if your script is slower, increase the wait period.');

        let rows = $('#wrangulator').find('tbody tr').toArray();
        for (let row of rows) {
            if (!cmtButtonExists) {
                // failsafe: if there are no comment buttons from another script, add them
                let edit = $(row).find('a[href$="/edit"]').last();
                $(edit).parent().after(`<li><a href="${ $(edit).attr('href').slice(0, -4) }comments">${ $(edit).css('font-family').includes("FontAwesome") === true ? "&#xf086;" : "Comments" }</a></li>`);
            }

            // retrieve what we already have in storage for this tag
            let tagname = $(row).find('th label').text();
            let cmtTopLevel = JSON.parse(sessionStorage.getItem("cmt_" + tagname) || null);

            if (cmtTopLevel !== null) { // if we found something in storage
                cmtTopLevel = new Map(cmtTopLevel);
                // and then we should put it somewhere so we know not to ask again on click
                row.dataset.cmttoptevel = "stored";
            }
            else row.dataset.cmttoptevel = "unknown";
        }
    }, 2 * 1000); // << WAIT PERIOD FOR OTHER SCRIPTS TO HAVE ADDED COMMENT BUTTONS. increase the standard 2 to 5 if your script is slower

    async function loadAllTopLevelComments() {
        $('#load-toplvlcmt').attr('disabled', true) // stop button from being clicked again
                            .find('.spin').css('display', 'inline-block'); // loading indicator

        let rows = $('#wrangulator').find('tbody tr').toArray();
        let rowsToDo = $(rows).filter( function() { return this.dataset.cmttoptevel === "unknown"; } ).toArray(); // only worry about not stored items

        // when clicking the button, loop over all tags on the page
        for (let row of rowsToDo) {
            let resolved = await loadTopLevelComments(row); // grab the top level comments from the page
            if (resolved === "loaded") await waitforXSeconds(2); // if XHR succeeded, creates a x-seconds wait period between function calls
            else { // if XHR failed, we have probably encountered a 403 or 500 error. don't try more pages
                alert('Not all Top Level Comments could be loaded, we encountered errors trying to load the Comment pages.');
                break;
            }
        }

        $('#load-toplvlcmt').text('All Comments Loaded') // change text
                            .find('.spin').css('display', 'none'); // remove loading indicator
    }

    function waitforXSeconds(x) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve("");
            }, x * 1000);
        });
    }

    /***** COMMON FUNCTION FOR BACKGROUND PAGELOADS *****/

    function loadTopLevelComments(row) {
        return new Promise((resolve) => {

            let target = $(row).find('[href$="/comments"]')[0];
            let tagname = $(row).find('th label').text();

            let xhr = $.ajax({ url: $(target).prop('href'), type: 'GET' })
                .fail(function(xhr, status) {
                    console.warn(`Top level comments for ${tagname} could not be loaded due to response error:`, status);
                    resolve("failed");
                }).done(function(response) {
                    // in case we're served a code:200 page that doesn't actually contain the comments page, we quit
                    if ($(response).find('#feedback').length === 0) {
                        console.warn(`Top level comments for ${tagname} could not be loaded because response didn't contain the #feedback`);
                        resolve("failed"); return;
                    }

                    // grab this user's possible pseuds and store it in session
                    pseuds = $(response).find('#add_comment h4.heading')[0].outerHTML;
                    sessionStorage.setItem("cmt_pseud", JSON.stringify(pseuds));

                    let cmtStorage = parseTopLevelComments(response);

                    sessionStorage.setItem("cmt_" + tagname, JSON.stringify([...cmtStorage])); // store all comments in session
                    row.dataset.cmttoptevel = "stored"; // set this tag from unknown to stored, so we don't try to load it again

                    resolve("loaded");
                });

        });
    }

    function parseTopLevelComments(response) {
        // grab top level comments
        let cmtTopLevel = $(response).find('#comments_placeholder > ol.thread > li.comment').toArray();

        // we'll store the comments in a Map to ensure insertion order while being able to later use an object key to reference the item
        let cmtStorage = new Map();

        for (let [i, v] of cmtTopLevel.entries()) {
            let commentID = $(v).find('li[id^="edit_comment_link_"')?.prop('id') || ""; // grab the CSS ID off the Edit button (our comment if it exists)
            commentID = commentID === "" ? 'c'+i : commentID.match(/\d+/)[0];           // if there's no ID, just count to 20, otherwise grab the commentID

            let by = $(v).find('.byline a').text();              // name of the user who posted the comment
            let content = $(v).find('.userstuff').html().trim(); // content of the post

            cmtStorage.set(commentID, [by, content]);            // put the comment into our storage
        }

        return cmtStorage;
    }


    /***** DISPLAY THE COMMENTS DIALOG *****/

    function viewTopLevelComments(target) {
        let tagname = $(target).parents('tr').first().find('th label').text();
        let taglink = $(target).prop('href');
        $(dlg).dialog("option", "title", tagname ); // dialog title shows tagname for which it was opened
        $(dlg).data('openedOnTag', target); // store button from which this dialog was opened

        // create a link to the plain Comments page
        let iconExternalLink = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path fill="currentColor" d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l82.7 0L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3l0 82.7c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160c0-17.7-14.3-32-32-32L320 0zM80 32C35.8 32 0 67.8 0 112L0 432c0 44.2 35.8 80 80 80l320 0c44.2 0 80-35.8 80-80l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 112c0 8.8-7.2 16-16 16L80 448c-8.8 0-16-7.2-16-16l0-320c0-8.8 7.2-16 16-16l112 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 32z"/></svg>`;
        iconExternalLink = `<a href="${$(target).prop('href')}" target="_blank">Open Comment Page <span class="fontawesomeicon">${iconExternalLink}</span></a>`;
        $('#toplvlcmt-pagelink').html(iconExternalLink);

        // create the preview of the first 20 comments
        let comments = new Map(JSON.parse(sessionStorage.getItem("cmt_" + tagname)));
        let content = (comments.size === 0) ? `<div class="toplvlcmt"><i>There are no comments on this tag yet.</i></div>` : "";
        for (let [id, comment] of comments.entries()) {
            let editButton = !id.startsWith('c') ? ` <button type="button" class="editComment" data-commentid="${ id }">Edit</button>` : "";
            content += `<div class="toplvlcmt">
                <p class="toplvlby">by ${ comment[0] }${ editButton }</p>
                <blockquote class="userstuff">${ comment[1] }</blockquote>
                </div>`;
        }

        $(dlg).find('#toplvlcmt-placeholder').html(content); // write comments to the dialog

        // a textbox to leave a new comment - works with the "Comment Formatting & Preview" script
        let cmtNew = $(dlg).find('#add-toplvlcmt textarea')[0];
        cmtNew.dataset.tagname = encodeURIComponent(tagname);
        cmtNew.dataset.commentid = "";

        $(dlg).find('#pseud-toplvlcmt').html(pseuds);

        $(dlg).dialog("option", "position", { my: "left top", at: "left bottom", of: target } ) // position the dialog at the clicked button
              .dialog('open'); // finally, open the dialog
    }


    /***** SUBMIT A NEW COMMENT *****/

    $('#main').on('click', `${dlg} button.submitComment`, function(e) {
        e.preventDefault();

        $(dlg).find('.submitComment').attr('disabled', true) // stop button from being clicked again
                                     .find('.spin').css('display', 'inline-block').html("(submitting)"); // loading indicator

        let tagname = decodeURIComponent($(dlg).find('textarea').attr('data-tagname'));
        let target = $(dlg).data('openedOnTag');

        // collect various input for commenting
        let cmtData = new FormData();
        cmtData.set('comment[comment_content]', $(dlg).find('textarea').prop('value'));
        cmtData.set('comment[pseud_id]', $(dlg).find('[name="comment[pseud_id]"]').prop('value')); // either a hidden <input> or a <select>
        cmtData.set('controller_name', 'comments');
        cmtData.set('tag_id', tagname);
        cmtData.set('authenticity_token', $('input[name="authenticity_token"]').prop('value'));

        // difference when editing existing comments: the commentID is part of the URL
        let commentID = $(dlg).find('textarea').attr('data-commentid') || "";
        if (commentID !== "") {
            commentID = "/" + commentID;

            // and a couple of additional hidden fields that are required for comment editing
            cmtData.set('_method', "patch");
            cmtData.set('commit', "Update");
        }

        // submit the comment
        let xhr = $.ajax({
                url: "/comments" + commentID,
                type: 'POST',
                data: cmtData,
                contentType: false,
                processData: false
            })
            .fail(function(xhr, status, error) {
                console.warn(`Posting comment to ${tagname} failed due to response error:`, status, error, xhr);
                alert('Comment could not be submitted, we encountered an error. You can check the Console for details and/or try again.');
            }).done(function(response) {
                if ($(response).find('#main #error').length > 0) {
                    console.debug(response);
                    console.warn(`Posting comment to ${tagname} failed due to AO3 error:`, $(response).find('#main #error').text());
                    alert('Comment could not be submitted, we encountered an error. You can check the Console for details and/or try again.');
                }
                else {
                    console.log(`Posting comment to ${tagname} succeeded`);

                    // update the storage and comment button for this tag without another background pageload
                    let cmtTopLevel = parseTopLevelComments(response);

                    sessionStorage.setItem("cmt_" + tagname, JSON.stringify([...cmtTopLevel])); // store the updated comment list for this tag again

                    // update the Comment button (text and tooltip) to new count, and icon in sync with Action Buttons Everywhere script
                    let old_count = target.innerText.match(/\d+/) || target.parentElement.title.match(/\d+/);
                    old_count = old_count[0];
                    let new_count = parseInt(old_count) + 1;
                    target.parentElement.title = target.parentElement.title.replace(old_count, new_count);
                    target.innerText = target.innerText.replace(old_count, new_count);
                    if ($(target).css('font-family').includes("FontAwesome")) $(target).html("&#xf086;"); // change the icon to "comments" f086 if there's (now) a comment
                    else if($('#wrangulator').attr('data-twactions-icons') === 'lucide') $(target).html(`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/><path d="M13 9.5H7"/><path d="M17 13.5H7"/></svg>`);
                    else if($('#wrangulator').attr('data-twactions-icons') === 'hero') $(target).html(`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 0 0-1.032-.211 50.89 50.89 0 0 0-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 0 0 2.433 3.984L7.28 21.53A.75.75 0 0 1 6 21v-4.03a48.527 48.527 0 0 1-1.087-.128C2.905 16.58 1.5 14.833 1.5 12.862V6.638c0-1.97 1.405-3.718 3.413-3.979Z" /><path d="M15.75 7.5c-1.376 0-2.739.057-4.086.169C10.124 7.797 9 9.103 9 10.609v4.285c0 1.507 1.128 2.814 2.67 2.94 1.243.102 2.5.157 3.768.165l2.782 2.781a.75.75 0 0 0 1.28-.53v-2.39l.33-.026c1.542-.125 2.67-1.433 2.67-2.94v-4.286c0-1.505-1.125-2.811-2.664-2.94A49.392 49.392 0 0 0 15.75 7.5Z" /></svg>`);
                    else if($('#wrangulator').attr('data-twactions-icons') === 'fa') $(target).html(`<svg viewBox="0 0 640 512" fill="currentColor"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M208 352c114.9 0 208-78.8 208-176S322.9 0 208 0S0 78.8 0 176c0 38.6 14.7 74.3 39.6 103.4c-3.5 9.4-8.7 17.7-14.2 24.7c-4.8 6.2-9.7 11-13.3 14.3c-1.8 1.6-3.3 2.9-4.3 3.7c-.5 .4-.9 .7-1.1 .8l-.2 .2s0 0 0 0s0 0 0 0C1 327.2-1.4 334.4 .8 340.9S9.1 352 16 352c21.8 0 43.8-5.6 62.1-12.5c9.2-3.5 17.8-7.4 25.2-11.4C134.1 343.3 169.8 352 208 352zM448 176c0 112.3-99.1 196.9-216.5 207C255.8 457.4 336.4 512 432 512c38.2 0 73.9-8.7 104.7-23.9c7.5 4 16 7.9 25.2 11.4c18.3 6.9 40.3 12.5 62.1 12.5c6.9 0 13.1-4.5 15.2-11.1c2.1-6.6-.2-13.8-5.8-17.9c0 0 0 0 0 0s0 0 0 0l-.2-.2c-.2-.2-.6-.4-1.1-.8c-1-.8-2.5-2-4.3-3.7c-3.6-3.3-8.5-8.1-13.3-14.3c-5.5-7-10.7-15.4-14.2-24.7c24.9-29 39.6-64.7 39.6-103.4c0-92.8-84.9-168.9-192.6-175.5c.4 5.1 .6 10.3 .6 15.5z"/></svg>`);
                    $(dlg).dialog('close');
                }
            }).always(function() {
                $(dlg).find('.submitComment').attr('disabled', false) // allow button to be clicked again
                      .find('.spin').css('display', 'none').html(""); // remove loading indicator
                $(dlg).find('.cancelEdit').remove(); // remove the cancel button
            });
    });


    /***** EDIT AN EXISTING COMMENT *****/
    /* on "Edit", we load the existing comment into the textarea so it can be edited
     * on "Submit", the existing comment is overwritten (instead of a new comment being added) based on awareness of comment IDs
     * on "Cancel", we reset the form so a new comment can be edited instead
     */

    $('#main').on('click', `${dlg} button.editComment`, function(e) {
        e.preventDefault();
        resetDialog();

        $(e.target).addClass('current'); // make the Edit button appear differently (in Default skin it looks clicked)

        $(dlg).find('.submitComment .submitCommentText').text('Update'); // change text of the button to make it clear we're editing
        $(dlg).find('.submitComment').after(`<button type="button" class="cancelEdit">Cancel</button>`); // add a cancel button that resets it all

        $(dlg).find('textarea').attr('data-commentid', e.target.dataset.commentid); // copy over the commentID so we know what we're editing when hitting submit
        $(dlg).find('textarea').prop('value', $(e.target).parents('.toplvlcmt').find('blockquote').html()); // put the existing comment text into the textfield
    });

    // reset everything when the user clicks Cancel in the dialog
    $('#main').on('click', `${dlg} button.cancelEdit`, function(e) {
        e.preventDefault();
        resetDialog();
    });

    // reset everything except the data-tagname attribute
    function resetDialog() {
        $(dlg).find('.submitComment .submitCommentText').text('Comment'); // reset button text for adding a new comment
        $(dlg).find('.cancelEdit').remove(); // remove the cancel button
        $(dlg).find('.editComment').removeClass('current'); // reset the Edit buttons

        $(dlg).find('textarea').attr('data-commentid', ""); // remove the commentID again so a submit will add a new comment again
        $(dlg).find('textarea').prop('value', ''); // empty out the textarea again
    }

})(jQuery);
