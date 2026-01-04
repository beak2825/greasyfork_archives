// ==UserScript==
// @name         AO3: [Wrangling] Bulk-Manage Tags
// @namespace    https://greasyfork.org/en/users/906106-escctrl
// @description  Mass-select tags and set/unset the unwrangleable flag, replace fandoms, remove 0-use syns, or copy tag names/links
// @author       escctrl
// @version      6.0
// @match        *://*.archiveofourown.org/tags/*/wrangle?*
// @match        *://*.archiveofourown.org/tags/search?*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.7.0/jquery.min.js
// @require      https://update.greasyfork.org/scripts/491896/1516188/Copy%20Text%20and%20HTML%20to%20Clipboard.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/448506/AO3%3A%20%5BWrangling%5D%20Bulk-Manage%20Tags.user.js
// @updateURL https://update.greasyfork.org/scripts/448506/AO3%3A%20%5BWrangling%5D%20Bulk-Manage%20Tags.meta.js
// ==/UserScript==

/* eslint-disable no-multi-spaces */
/* global jQuery, copy2Clipboard */


(function($) {
    'use strict';

    // loading indicator which shows after a button was pressed
    $('head').append(`<style tyle="text/css">
    .massManage .spin, .massYeet .spin { display: none; margin-left: 0.5em; }
    .massManage .spin::after, .massYeet .spin::after {
        content: "\\2312";
        display: inline-block;
        animation: loading 3s linear infinite;
    }
    @keyframes loading {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }</style>`);

    // stuff that needs to be globally available for my sanity
    var pt = "", binStatus = "", pressed = "";
    var tagList, tagCounter = 0, errorMsg = [], successMsg = [];
    var oldText, newText;

    // kick off the script only on pages that it should really be running on
    const main = $('#main');

    if ($(main).hasClass('tags-wrangle')) {                                                    // on bins only...
        pt = 'bin';
        let binParams = new URLSearchParams(window.location.search);
        binStatus = binParams.get('status') || "";

        if ($(main).find('#wrangulator').length == 1 &&                                        // if there are tags in the bin
            $('#dashboard').find('ul.navigation.actions:last-of-type li').length == 5 &&       // if this is a fandom bin
            !(binParams.get('show') == "mergers" || binParams.get('show') == "sub_tags")) {    // if this is NOT a mergers/subtags bin

            addMassCopyButton();
            addMassManageButtons();
            addMassYeetButton();
        }
    }
    else if ($(main).hasClass('tags-search')) {
        pt = 'search';
        let results = $(main).find('#resulttable, ol.tag.index.group');

        if ($(results).find('a.tag').length > 0) {
            $('h3.heading').after(`<p class="submit actions"></p>`);
            addMassCopyButton();
            addMassManageButtons();
            addMassYeetButton();

            // add checkboxes in front of tag results - add either way in table or in regular list
            for (let a of $(main).find('a.tag')) {
                $(a).before(`<input type='checkbox' name='selected_tags[]'>`);
            }
            // add "select all" button in the header row
            $('#resulttable').find('thead .resultName').prepend(`<button type="button" class="resultAll">All</button> <button type="button" class="resultNone">None</button> `);
            $('#resulttable').on('click', '.resultAll, .resultNone', function(e) {
                if ($(e.target).hasClass('resultAll')) $('#resulttable').find("input[name='selected_tags[]']").prop('checked',true);
                else $('#resulttable').find("input[name='selected_tags[]']").prop('checked',false);
            });

            // in case this runs before search results table script, gotta wait for the table to appear
            const observer = new MutationObserver(function(mutList, obs) {

                for (const mut of mutList) {
                    for (const node of mut.addedNodes) {
                        if (node.id === "resulttable") {
                            obs.disconnect(); // stop listening to avoid looping with the following changes, plus we're done

                            $(main).find("#resulttable thead th.resultName").prepend(`<input type='checkbox' id='select_all'>`);
                            $(main).find("#resulttable #select_all").on('change', (e) => {
                                if (e.target.checked === true) $('input[name="selected_tags[]"]').prop('checked', true);
                                else $('input[name="selected_tags[]"]').prop('checked', false);
                            });

                            // re-add checkboxes: table rewrite would've lost previously added checkboxes
                            for (let a of $(main).find('a.tag')) {
                                $(a).before(`<input type='checkbox' name='selected_tags[]'>`);
                            }

                            // lazy-click
                            $("#resulttable").on('click', 'tbody th.resultName', (e) => {
                                let chkbx = $(e.target).find('input[name="selected_tags[]"]');
                                $(chkbx).prop('checked', !$(chkbx).prop('checked'));
                            });
                        }
                    }
                }
            });

            function startObserving() {
                $(main).each((i, elem) => {
                    observer.observe(elem, { attributes: false, childList: true, subtree: false });
                });
            }
            startObserving();

            // failsafe: stop listening after 1 seconds (in case the other script isn't running)
            let timeout = setTimeout(() => {
                observer.disconnect();
            }, 1 * 1000);
        }
    }

    // on top of the bin/search, add the buttons for managing the tags
    // everything else is triggered from here
    function addMassManageButtons() {
        let tagList = (pt == 'bin')    ? $(main).find('#wrangulator p.submit.actions') :
                      (pt == 'search') ? $(main).find('#resulttable, ol.tag.index.group').prevAll('p.submit.actions') : "";

        let searchParams = new URLSearchParams(document.location.search);

        // the type of massManage button shown in a bin depends on the tags' wrangling status
        // no Manage buttons on UW and All, no Manage buttons in Search unless searching specifically for Canonicals within a Fandom
        let buttonLabel = binStatus == "unfilterable"  ? "Set Unwrangleable" :
                      binStatus == "unwrangleable" ? "Remove Unwrangleable" :
                      binStatus == "synonymous"    ? "De-syn 0 use tags" :
                      binStatus == "canonical"     ? "Change Case/Diacritic" :
                      (pt == "search" && searchParams.get("tag_search[fandoms]") !== "" && searchParams.get("tag_search[wrangling_status]") == "canonical")  ? "Change Case/Diacritic" : "";

        if (buttonLabel !== "") {
            $(tagList).prepend(`<button class="massManage" type="button" style="padding-left: 0.75em;">${buttonLabel}<span class="spin"/></button> `);
            $(main).find('.massManage').on('click', tryMassManage);
        }
    }
    function addMassYeetButton() {
        let searchParams = new URLSearchParams(document.location.search);

        let tagList = (pt == 'bin' && binStatus != 'unwrangled' && binStatus !== '') ? $(main).find('#wrangulator p.submit.actions') : // no Yeet button on UW and All
                      (pt == 'search' && searchParams.get("tag_search[fandoms]") !== "") ? $(main).find('#resulttable, ol.tag.index.group').prevAll('p.submit.actions') : "";

        if (tagList !== "" && $(tagList).length > 0) {
            $(tagList).prepend(`<button class="massYeet" type="button" style="padding-left: 0.75em;">Replace Fandoms<span class="spin"/></button> `);
            $(main).find('.massYeet').on('click', tryMassYeet);
        }
    }
    function addMassCopyButton() {
        let tagList = (pt == 'bin')    ? $(main).find('#wrangulator p.submit.actions') :
                      (pt == 'search') ? $(main).find('#resulttable, ol.tag.index.group').prevAll('p.submit.actions') : "";
        if (tagList !== "" && $(tagList).length > 0) {
            $(tagList).prepend(`<button class="massCopy" type="button" style="padding-left: 0.75em; border-radius: 0.25em 0 0 0.25em;">Copy</button><select
              class="action massCopy-format" style="min-width: 5.5em; box-sizing: content-box; border-radius: 0 0.25em 0.25em 0;">
              <option value="text">as Text</option>
              <option value="link">as Links</option>
              <option value="chat">for Chat</option>
              <option value="wiki">for Wiki</option>
            </select> `);
            
            // load the last selected option
            let lastfmt = sessionStorage.getItem('binCleanUp-Copy') || "link";
            $(main).find('.massCopy-format').prop('value', lastfmt);
            
            $(main).find('.massCopy').on('click', tryMassCopy);
            $(main).find('.massCopy-format').on('change', function(e) { // if one text/link select is changed
                $(main).find('.massCopy-format').prop('value', $(e.target).prop('value')); // change both above&below taglist to this value
                sessionStorage.setItem('binCleanUp-Copy', $(e.target).prop('value')); // and remember the new value for the next pageload
            });
        }
    }

    // button event listener: a dialog to enter the requested changes
    function tryMassManage(e) {
        e.preventDefault();
        e.stopPropagation();

        disableButtons();
        $(e.target).addClass("current").find('.spin').css('display', 'inline-block'); // loading indicator
        pressed = "manage";

        // grab the selected tags and disable the buttons
        tagList = getSelectedTags(e);

        /* background task depends on the binStatus -> the action we support there
           unfilterable  -> set unwrangleable
           unwrangleable -> remove unwrangleable
           synonymous    -> de-syn 0 use tags
                            here we check if any tag is really 0 uses
           canonical     -> change letter case/diacritic on tag name
                            for this we need input from the user: old/new tag text */
        if (binStatus == "canonical" || pt == "search") {
            // if we're replacing parts in the tag name, asking for the text that needs to be replaced
            // we're storing that info in session, so it is available between page loads across the bin --> this could be useful on tag search too!!
            oldText = sessionStorage.getItem('binCleanUp-TextReplace-old') || "";
            newText = sessionStorage.getItem('binCleanUp-TextReplace-new') || "";

            oldText = prompt("Enter the old/incorrectly formatted text:", oldText);
            if (!oldText) {
                alert("Please try again and enter the tag text that should be replaced!");
                resetButtons();
                return false;
            }
            newText = prompt(`You're replacing "${oldText}". Remember: only cases and diacritics can be changed. Enter the properly formatted text:`, newText);
            if (!newText) {
                alert("Please try again and enter the tag text that should be replaced!");
                resetButtons();
                return false;
            }
            else {
                sessionStorage.setItem('binCleanUp-TextReplace-old', oldText);
                sessionStorage.setItem('binCleanUp-TextReplace-new', newText);
            }
        }
        else if (binStatus == "synonymous") {
            if ($(tagList).filter((ix, tag) => parseInt($(tag).closest('tr').find('td[title="taggings"]').text()) === 0).length < 1) {
                alert("Please select at least one tag without uses!");
                resetButtons();
                return false;
            }
        }

        // if we didn't bow out yet, start working on the list of tags
        manageTagsLoop(0);
    }

    // button event listener: a dialog to enter the requested changes
    function tryMassYeet(e) {
        e.preventDefault();
        e.stopPropagation();

        disableButtons();
        $(e.target).addClass("current").find('.spin').css('display', 'inline-block'); // loading indicator
        pressed = "yeet";

        // grab the selected tags and disable the buttons
        tagList = getSelectedTags(e);

        let f_wrangle;
        if (pt === "search") { // grab the fandoms that were searched for automatically, manual changes in form afterwards don't count
            let params = new URLSearchParams(document.location.search);
            f_wrangle = decodeURIComponent(params.get('tag_search[fandoms]')).split(',');

            if (f_wrangle.length < 1) {
                alert("Please search within at least one fandom!");
                resetButtons();
                return false;
            }
        }
        else if (pt === "bin") { // grab the fandom we're currently wrangling in automatically
            f_wrangle = $('#main').find('h2.heading a.tag').toArray();
            f_wrangle = f_wrangle.map((f) => f.firstChild.textContent.trim());
        }

        // if the dialog was opened before, we just show it again
        if ($('#massFandoms-wrap').length > 0) $('#massFandoms-wrap').show();
        else { // otherwise we create it now

            // we're storing that info in session, so it is available between page loads across the bin/tag search
            oldText = sessionStorage.getItem('binCleanUp-ChangeFandom-old') || "";
            newText = sessionStorage.getItem('binCleanUp-ChangeFandom-new') || "";

            let bgcolor = $('body').css('background-color');
            let dlg_fandoms = `<div id="massFandoms-wrap">
            <div id="massFandoms">
            <h4>Replace Fandoms on Tags in Bulk</h4>
            <hr />
            <h5>Remove these fandoms:</h5>
            <ul class="content remove">
                ${f_wrangle.map((f) => "<li class='remove'><input type='checkbox' checked='checked' id='remove[]'><span>" + f.trim() + "</span></li>").join("\n")}
                <li class='remove'><input type='checkbox' id="removeall"><span>Remove ALL fandoms on selected tags</span><br />
                <small class="notice" style="display: none;">Caution! You might unknowingly remove other wranglers' fandoms, which a tag was shared with!</small></li>
            </ul>
            <h5>Add these fandoms:</h5>
            <p class="content add">
                <input type="text" id="add[]" name="add[]" class="fandom autocomplete" data-autocomplete-method="/autocomplete/fandom"
                data-autocomplete-hint-text="Start typing for Fandom suggestions!" data-autocomplete-no-results-text="(No suggestions found)"
                data-autocomplete-min-chars="1" data-autocomplete-searching-text="Searching..." value="${newText}" />
            </p>
            <p style="text-align: right;"><button type="button" id="massFandoms-cancel">Cancel</button> <button type="button" id="massFandoms-start">Start</button></p></div></div>`;

            // styling this minimal dialog
            $('header').append(`<style tyle="text/css">#massFandoms-wrap { position: fixed; z-index: 500; height: 100%; width: 100%; background-color: rgba(0, 0, 0, 0.5);
              display: flex; justify-content: center; align-items: center; top: 0; }
            #massFandoms { background: ${bgcolor}; border: 10px solid #eee; margin: auto; width: 500px; padding: 1em; }
            #massFandoms h5 { font-weight: bold; margin: 1em 0 0.5em 0; }
            #massFandoms small { display: inline-block; }
            </style>`);

            // show the dialog to user
            $('body').append(dlg_fandoms);
            $('#massFandoms-wrap').trigger('click'); // workaround to make stored fandoms show as added (instead of text in the input field) ¯\_(ツ)_/¯

            // set checkboxes for removing fandoms based on stored values
            if (oldText == "Remove ALL fandoms on selected tags") {
                $("#massFandoms").find(".remove input").prop('checked', false);
                $("#massFandoms").find(".remove #removeall").prop('checked', true);
                $("#massFandoms").find(".remove small.notice").show();
            }

            // what the dialog buttons do
            $('body').on('click', '#massFandoms-cancel', function() {
                $('#massFandoms-wrap').hide();
                resetButtons();
            });
            $('body').on('click', '#massFandoms-start', function() {
                // put the remove&add fandoms into global variables so they're later available to manageTagEdit()
                oldText = $('#massFandoms').find('ul.content.remove li:has(input:checked)').toArray();
                oldText = oldText.map((f) => $(f).find('span').text());

                newText = $('#massFandoms').find('input[id="add[]"').prev('ul.autocomplete').find('li.added.tag').toArray();
                newText = newText.map((f) => f.firstChild.textContent.trim());

                // make sure the user isn't trying to remove AND add the same fandom, because what should be the end result?
                for (let val of newText) {
                    if (oldText.indexOf(val) !== -1) {
                        alert("You tried to both remove and add the same fandom. Please fix the fandoms before trying again.");
                        return false;
                    }
                }

                // store the selection for the next page
                sessionStorage.setItem('binCleanUp-ChangeFandom-old', oldText.join(","));
                sessionStorage.setItem('binCleanUp-ChangeFandom-new', newText.join(","));

                // close the dialog
                $('#massFandoms-wrap').hide();

                // start making those changes
                manageTagsLoop(0);
            });
            // show warning to user when Remove ALL is selected
            $('body').on('change', '#removeall', function(e) {
                $('#massFandoms ul.content.remove small').toggle();
                if (e.target.checked) $('#massFandoms ul.content.remove input[id="remove[]"]').prop('checked', false).prop('disabled', true);
                else $('#massFandoms ul.content.remove input[id="remove[]"]').prop('disabled', false);
            });
        }
    }

    // button event listener
    function tryMassCopy(e) {
        e.preventDefault();
        e.stopPropagation();

        // grab the selected tags and disable the buttons
        let selectedTags = getSelectedTags(e);

        // do we copy text or links?
        let linkfmt = $('.massCopy-format').eq(0).find('option:selected').prop('value');

        // build arrays of the pure tag names and urls
        let tagHTML = [], tagPlain = [];
        for (let inp of $(selectedTags).toArray()) {
            let tagname = (pt == "bin")    ? $(inp).parent().find('label').text() :
                          (pt == "search") ? $(inp).parent().find('a').text() : "";
            let taglink = (pt == "bin")    ? $(inp).closest('tr').find('a[href$="/edit"]').prop('href').slice(0, -5) :
                          (pt == "search") ? $(inp).parent().find('a').prop('href') : "";

            tagPlain.push(tagname);
            tagHTML.push(taglink);
        }

        let txt, html;
        if (linkfmt === "link") {
            txt = tagHTML.map((el, ix) => { return `<a href="${el}">${tagPlain[ix]}</a>`; }).join("<br />\n");
            copy2Clipboard(e, "fmt", txt);
        }
        else if (linkfmt === "chat") {
            txt = tagPlain.map((el, ix) => { return el + " " + tagHTML[ix]; }).join("\n");
            html = tagHTML.map((el, ix) => { return `<a href="${el}">${tagPlain[ix]}</a>`; }).join("<br />\n");
            copy2Clipboard(e, "fmt", txt, html);
        }
        else if (linkfmt === "wiki") {
            txt = tagPlain.map((el, ix) => { return `[${tagHTML[ix]} ${el}]`; }).join("\n");
            copy2Clipboard(e, "txt", txt);
        }
        else if (linkfmt === "text") {
            copy2Clipboard(e, "txt", tagPlain.join("\n"));
        }

        resetButtons();
    }

    function getSelectedTags(e) {
        let tags = $(main).find('input[name="selected_tags[]"]:checked');
        if (tags.length < 1) {
            alert("Please select at least one tag!");
            return false;
        }
        else {
            disableButtons();
            $(e.target).addClass("current");                                         // make clicked button appear different
            return tags;
        }
    }
    function disableButtons() {
        $(main).find('.massYeet, .massManage, .massCopy').attr("disabled",true);
    }
    function resetButtons() {
        // reset all buttons so they can be used again
        $(main).find('.massYeet, .massManage, .massCopy').attr("disabled",false).removeClass("current");
        $(main).find('.massYeet, .massManage').find('.spin').hide();

        // reset temp values for the next round
        tagCounter = 0;
        errorMsg = [];
        successMsg = [];
    }

    // a wrapper function to open the page in background, which gets called again when the previous loop finished
    function manageTagsLoop(wait) {
        if (wait === null) wait = 2; // wait period (in seconds) between page loads

        setTimeout(() => {
            // create the iframe, hide it, add it to the DOM, and attach an event listener to make the desired changes
            // we're routing through: the iFrame we're operating in
            const tagFrame = document.createElement("iframe");
            $(tagFrame).hide().appendTo('body').one('load', function() { manageTagEdit(tagFrame); });

            // grab the next tag's base URL (search) or edit URL (bin)
            let framesrc = pt === "search" ? $(tagList[tagCounter]).next('a').prop('href') + "/edit"
                                           : $(tagList[tagCounter]).closest('tr').find('a[href$="/edit"]').prop('href');

            tagFrame.src = framesrc; // at last, we let the edit page load
        }, wait*1000);
    }

    // make the requested changes in the background
    function manageTagEdit(tagFrame) {

        const frameContent = $(tagFrame).contents();
        if ($(frameContent).find('#edit_tag').length != 1) {
            document.body.removeChild(tagFrame);
            reportRetryLater(tagCounter);
            return; // stops loading any further pages
        }

        // make changes on the Edit page depending on the button pressed
        if (pressed === "yeet") {
            // remember: oldText[] is the fandoms to be removed, newText[] is the fandoms to be added
            let newTextTemp = [...newText]; // temp variable because we're changing the array content for this loop=tag

            // if we check the checkbox & add the same fandom in the input field, it still gets removed
            // so we have to be smarter and check only boxes on fandoms we don't want anymore

            // first we check each existing fandom that it's supposed to be removed
            $(frameContent).find('#parent_Fandom_associations_to_remove_checkboxes a.tag').each(function(i, f) {

                if ( oldText.includes(f.innerText.trim()) || // if it's explicitly supposed to be removed
                     ( oldText.includes('Remove ALL fandoms on selected tags') && !newTextTemp.includes(f.innerText.trim()) ) // if we remove ALL and this isn't supposed to be added
                   ) {
                    $(f).prev().find('input').prop('checked', true); // tick the checkbox to remove the fandom
                }

                // fandoms that ARE supposed to be added and therefore don't need to be re-added
                if (newTextTemp.includes(f.innerText.trim())) newTextTemp.splice(i, 1);
            });

            // then we add all fandoms that remain in the array
            const fieldFandom = $(frameContent).find('input#tag_fandom_string_autocomplete')[0];
            fieldFandom.focus();
            const ke = new KeyboardEvent('keydown', { keyCode: 13, key: "Enter" });
            $(newTextTemp).each((j, fandom) => {
                fieldFandom.value = fandom;
                fieldFandom.dispatchEvent(ke);
            });
        }
        else if (pressed === "manage") {

            if (binStatus == "synonymous") {
                // remove the synonymous tag
                $(frameContent).find('#tag_syn_string').prev().find("li.added span.delete a")[0].click();
            }
            else if (binStatus == "unwrangleable" || binStatus == "unfilterable") {
                // switch the state of the unwranglable checkbox in the iframe
                let fieldUnwrangleable = $(frameContent).find('#tag_unwrangleable')[0];
                fieldUnwrangleable.checked = !fieldUnwrangleable.checked;
            }
            else if (binStatus == "canonical" || pt == "search") {
                // get the tag name
                let fieldTagname = $(frameContent).find("#tag_name")[0];
                // replace the old text part (regex-excaped and case insensitive!) with the new text part
                oldText = oldText.replace(/[/.*+?^${}()|[\]\\]/g, '\\$&');
                fieldTagname.value = fieldTagname.value.replace(new RegExp(oldText, "ig"), newText);
            }
        }

        // add another event listener to retrieve the fail/success message, and submit the iframe
        $(tagFrame).one('load', function() { manageTagSubmit(tagFrame); });
        $(tagFrame).contents().find('#edit_tag')[0].submit();
    }

    function manageTagSubmit(tagFrame) {

        const frameContent = $(tagFrame).contents();
        if ($(frameContent).find('#edit_tag').length != 1) {
            document.body.removeChild(tagFrame);
            reportRetryLater(tagCounter);
            return; // stops loading any further pages
        }

        // tracking any other errors we might've run into
        const err = $(frameContent).find('#error');
        if (err.length > 0) errorMsg[tagCounter] = err[0].innerHTML;
        else {
            // check if the desired fandoms have really attached - sometimes AO3 hiccups and we need to report an error
            // note that we're overwriting errors here instead of tracking each individual fandom. failed-to-add will win being reported over failed-to-remove
            if (pressed === "yeet") {
                let attached = $(frameContent).find('#parent_Fandom_associations_to_remove_checkboxes a.tag').map((ix, el) => { return $(el).text(); }).get();

                // confirm that no old fandoms remain
                if (oldText.includes("Remove ALL fandoms on selected tags")) { // remove all old => none remain that weren't set to be added
                    for (let a of attached) {
                        if (!newText.includes(a)) errorMsg[tagCounter] = "Some Fandoms were not removed as requested.";
                    }
                }
                else { // remove specific fandoms => they're not attached anymore
                    for (let a of attached) {
                        if (oldText.includes(a)) errorMsg[tagCounter] = "Some Fandoms were not removed as requested.";
                    }
                }

                // confirm that all fandoms to be added have saved
                for (let n of newText) {
                    if (!attached.includes(n)) errorMsg[tagCounter] = "Some Fandoms didn't attach successfully.";
                }
            }
            // track if de-syn didn't result in tag being ready to rake (tagset tag) i.e. if there's no <select> for changing between char/rel/ff
            else if (binStatus == "synonymous" && $(frameContent).find('select#tag_type').length === 0) {
                errorMsg[tagCounter] = "Tagset tag, will not rake. Consider synning again.";
            }
        }

        // when this loop is finished
        document.body.removeChild(tagFrame);                // remove the iframe
        tagCounter++;                                       // iterates to handle the next tag in the list
        if (tagList.length == tagCounter) reportComplete(); // if we're done with all tags, tell so
        else manageTagsLoop(2);                             // otherwise start next loop
    }

    // technically this might also be caused by a 503 or other error, not just Retry Later
    function reportRetryLater(tagCounter) {
        // fill up the error messages with retry later, since we're stopping the processing here
        for (let c = tagCounter; c < tagList.length; c++) {
            errorMsg[c] = `Page could not load. Retry later`;
        }
        reportComplete();
    }

    function reportComplete() {
        // make sure each tag has a corresponding entry in either error or success messages
        $(tagList).each((i, tag) => {
            let tagRow = $(tag).closest('tr');
            let tagLink = (pt == "bin") ? `<a href="${ $(tagRow).find('a[href$="/edit"]').prop('href') }">${ $(tagRow).find('th label').text() }</a>`
                                        : `<a href="${$(tag).parent().find('a').prop('href')}">${$(tag).parent().find('a').text()}</a>`;

            // errorMsg[] has the corresponding indices so we know which tag failed
            if (errorMsg[i] != undefined) { errorMsg[i] = tagLink + ': ' + errorMsg[i]; }
            else {
                successMsg.push(tagLink);
                // remove the changed tags from the bin page unless we're changing fandoms, because we could be just removing all others
                if (pressed == "manage" && (binStatus == "unwrangleable" || binStatus == "unfilterable" || binStatus == "synonymous")) $(tagRow).remove();
            }
        });

        // constructing the response message to the user and showing it
        const title = pressed == "yeet" ? "Fandom" :
                      binStatus == "synonymous" ? "Synonym of" :
                      (binStatus == "canonical" || pt == "search") ? "Case/Diacritics" : "Unwrangleable flag";
        if (errorMsg.length > 0) {
            if ($(main).find(".error."+pressed).length > 0) $(main).find(".error."+pressed).append(`<br />${errorMsg.join('<br />')}`);
            else $(main).prepend(`<div id="error" class="error ${pressed}">The following tags' ${title} could not be updated or ran into other issues:<br />${errorMsg.join('<br />')}</div>`);
            window.scrollTo(0,0);
        }
        if (successMsg.length > 0) {
            if ($(main).find(".notice."+pressed).length > 0) $(main).find(".notice."+pressed).append(`, ${successMsg.join(', ')}`);
            else $(main).prepend(`<div class="flash notice ${pressed}">The following tags' ${title} was updated successfully:<br />${successMsg.join(', ')}</div>`);
            window.scrollTo(0,0);
        }

        resetButtons();
    }

})(jQuery);