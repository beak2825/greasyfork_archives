// ==UserScript==
// @name         AO3: Comment Formatting and Preview
// @namespace    https://greasyfork.org/en/users/906106-escctrl
// @version      6.0
// @description  Adds buttons to insert HTML formatting, and shows a live preview box of what the comment will look like
// @author       escctrl
// @license      MIT
// @match        *://*.archiveofourown.org/tags/*/comments*
// @match        *://*.archiveofourown.org/tags/*/wrangle?*
// @match        *://*.archiveofourown.org/users/*/inbox*
// @match        *://*.archiveofourown.org/users/*/bookmarks*
// @match        *://*.archiveofourown.org/tags/*/bookmarks*
// @match        *://*.archiveofourown.org/works/*
// @match        *://*.archiveofourown.org/chapters/*
// @match        *://*.archiveofourown.org/collections/new
// @match        *://*.archiveofourown.org/collections/*/works/*
// @match        *://*.archiveofourown.org/collections/*/bookmarks*
// @match        *://*.archiveofourown.org/collections/*/edit
// @match        *://*.archiveofourown.org/comments/*
// @match        *://*.archiveofourown.org/comments?*
// @match        *://*.archiveofourown.org/admin_posts/*
// @exclude      *://*.archiveofourown.org/works/search*
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.7.0/jquery.min.js
// @require      https://ajax.googleapis.com/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jqueryui-touch-punch/0.2.3/jquery.ui.touch-punch.min.js
// @require      https://update.greasyfork.org/scripts/491888/1355841/Light%20or%20Dark.js
// @downloadURL https://update.greasyfork.org/scripts/484002/AO3%3A%20Comment%20Formatting%20and%20Preview.user.js
// @updateURL https://update.greasyfork.org/scripts/484002/AO3%3A%20Comment%20Formatting%20and%20Preview.meta.js
// ==/UserScript==

/* global jQuery, lightOrDark */

(function($) {
    'use strict';

    /*********************************************************
     GUI CONFIGURATION
     *********************************************************/

    // load storage on page startup
    var standardmap = new Map(JSON.parse(localStorage.getItem('cmtfmtstandard'))); // only a key: true/false list
    var custommap = new Map(JSON.parse(localStorage.getItem('cmtfmtcustom'))); // all content we need from user to display & insert what they want

    // if the background is dark, use the dark UI theme to match
    let dialogtheme = lightOrDark($('body').css('background-color')) == "dark" ? "ui-darkness" : "base";

    // the config dialog container
    let cfg = document.createElement('div');
    cfg.id = 'cmtFmtDialog';

    // adding the jQuery stylesheet to style the dialog, and fixing the interferance of AO3's styling
    $("head").append(`<link rel="stylesheet" href="https://code.jquery.com/ui/1.13.2/themes/${dialogtheme}/jquery-ui.css">`)
    .prepend(`<script src="https://use.fontawesome.com/ed555db3cc.js" />`)
    .append(`<style tyle="text/css">#${cfg.id}, .ui-dialog .ui-dialog-buttonpane button {font-size: revert; line-height: 1.286;}
    #${cfg.id} form {box-shadow: revert; cursor:auto;}
    #${cfg.id} #custombutton a {cursor:pointer;}
    #${cfg.id} legend {font-size: inherit; height: auto; width: auto; opacity: inherit;}
    #${cfg.id} fieldset {background: revert; box-shadow: revert;}
    #${cfg.id} input[type='text'] { position: relative; top: 1px; padding: .4em; width: 3em; }
    #${cfg.id} ul { padding-left: 2em; }
    #${cfg.id} ul li { list-style: circle; }
    #${cfg.id} #stdbutton label { font-family: FontAwesome, sans-serif; }
    #${cfg.id} #custombutton div button { width: 0.5em; }
    #${cfg.id} #custombutton div input:nth-of-type(1) { width: 2em; }
    #${cfg.id} #custombutton div input:nth-of-type(2) { width: 6em; }
    #${cfg.id} #custombutton div input:nth-of-type(3) { width: 10em; }
    #${cfg.id} #custombutton div input:nth-of-type(4) { width: 10em; }
    </style>`);

    // the available standard buttons, display & insert stuff
    let config_std = new Map([
        ["bold", { icon: "&#xf032;", text: "Bold", ins_pre: "<b>", ins_app: "</b>" }],
        ["italic", { icon: "&#xf033;", text: "Italic", ins_pre: "<em>", ins_app: "</em>" }],
        ["underline", { icon: "&#xf0cd;", text: "Underline", ins_pre: "<u>", ins_app: "</u>" }],
        ["strike", { icon: "&#xf0cc;", text: "Strikethrough", ins_pre: "<s>", ins_app: "</s>" }],
        ["link", { icon: "&#xf0c1;", text: "Link", ins_pre: "<a href=\"\">", ins_app: "</a>" }],
        ["image", { icon: "&#xf03e;", text: "Image", ins_pre: "<img src=\"", ins_app: "\" />" }],
        ["quote", { icon: "&#xf10d;", text: "Quote", ins_pre: "<blockquote>", ins_app: "</blockquote>" }],
        ["paragraph", { icon: "&#xf1dd;", text: "Paragraph", ins_pre: "<p>", ins_app: "</p>" }],
        ["listnum", { icon: "&#xf0cb;", text: "Numbered List", ins_pre: "<ol><li>", ins_app: "</li></ol>" }],
        ["listbull", { icon: "&#xf0ca;", text: "Bullet List", ins_pre: "<ul><li>", ins_app: "</li></ul>" }],
        ["listitem", { icon: "&#xf192;", text: "List Item", ins_pre: "<li>", ins_app: "</li>" }],
    ]);

    // build GUI for chosen enable/disable of standard buttons
    let standardbuttons = '';
    config_std.forEach((val, key) => {
        standardbuttons += `<label for="${key}" title="${val.text}">${val.icon}</label><input type="checkbox" name="${key}" id="${key}" ${(standardmap.get(key)==="true" || standardmap.size == 0) ? 'checked="checked"' : ""}>`;
    });

    // reformat the stored custom buttons to match the standard
    let config_custom = new Map();
    custommap.forEach((val, key) => {
        val = JSON.parse(val); // turn the string into an array of 4x2 each
        let newval = {}; // turn the array into an object
        val.forEach((v) => {
            newval[v[0]] = v[1];
        });
        config_custom.set(key, newval);
    });

    // build GUI for stored custom buttons
    let custombuttons = '';
    config_custom.forEach((val) => {
        custombuttons += `<div><button class="remove">-</button><input type="text" name="icon" value="${val.icon}"><input type="text" name="text" value="${val.text}">
        <input type="text" name="ins_pre" value="${val.ins_pre}"><input type="text" name="ins_app" value="${val.ins_app}"></div>`;
    });

    // template for a blank row to add a custom button (is cloned before inserting into DOM)
    let newcustombutton = `<div><button class="remove">-</button><input type="text" name="icon" placeholder="Icon"><input type="text" name="text" placeholder="Title">
        <input type="text" name="ins_pre" placeholder="Insert Before"><input type="text" name="ins_app" placeholder="Insert After"></div>`;

    $(cfg).html(`<form>
    <fieldset id='stdbutton'>
        <legend>Standard text formatting</legend>
        <p>Select the buttons you'd like to see as options on the button bar.</p>
        ${standardbuttons}
    </fieldset>
    <fieldset id='custombutton'>
        <legend>Custom HTML or text</legend>
        <p>Define custom buttons, which will insert HTML and/or text.</p>
        <ul><li>In the first field, choose <a href="https://fontawesome.com/v4/icons/">the Icon</a> you want on the button.<br />
        Copy its 4-letter Unicode (for example "f004" for the heart) into this field.</li>
        <li>If you leave the Icon field empty, the Title from the second field is shown on the button instead. The Title also appears as mouseover text.</li>
        <li>Put the text you want inserted around the cursor position into the Insert Before and Insert After fields.</li></ul>
        ${custombuttons}
        <div><button class="add">+</button></div>
    </fieldset>
    <p>Any changes only apply after reloading the page.</p>
    </form>`);

    // attach it to the DOM so that selections work (but only if #main exists, else it might be a Retry Later error page)
    if ($("#main").length == 1) $("body").append(cfg);

    // turn checkboxes and radiobuttons into pretty buttons
    $( "#cmtFmtDialog input[type='checkbox'], #cmtFmtDialog input[type='radio']" ).checkboxradio({ icon: false });

    // optimizing the size of the GUI in case it's a mobile device
    let dialogwidth = parseInt($("body").css("width")); // parseInt ignores letters (px)
    dialogwidth = dialogwidth > 550 ? 550 : dialogwidth * 0.9;

    // initialize the dialog (but don't open it)
    $( "#cmtFmtDialog" ).dialog({
        appendTo: "#main",
        modal: true,
        title: 'Comment Formatting Buttons',
        draggable: true,
        resizable: false,
        autoOpen: false,
        width: dialogwidth,
        position: {my:"center", at: "center top"},
        buttons: {
            Reset: deleteConfig,
            Save: storeConfig,
            Cancel: function() { $( "#cmtFmtDialog" ).dialog( "close" ); }
        }
    });

    // event triggers if form is submitted with the <enter> key
    $( "#cmtFmtDialog form" ).on("submit", (e) => {
        e.preventDefault();
        storeConfig();
    });

    // putting event triggers on buttons that will delete custom rows
    function evRemoveRow(el) {
        $(el).on("click", (e) => {
            e.cancelBubble = true;
            e.preventDefault();
            $(e.target).parent().remove(); // delete whole div
        });
    }
    // run it immediately on the stored custom buttons
    evRemoveRow($( "#cmtFmtDialog button.remove" ));

    // putting event trigger on button that will add blank custom rows
    $( "#cmtFmtDialog button.add" ).on("click", (e) => {
        e.cancelBubble = true;
        e.preventDefault();
        // add a new blank row and attach the remove event again
        $(e.target).parent().before( $(newcustombutton).clone() );
        evRemoveRow($( "#cmtFmtDialog button.remove:last-of-type" ));
    });

    function deleteConfig() {
        // deselects all buttons, empties all fields in the form
        $('#cmtFmtDialog form').trigger("reset");
        $('#cmtFmtDialog button.remove').trigger("click");

        // deletes the localStorage
        localStorage.removeItem('cmtfmtstandard');
        localStorage.removeItem('cmtfmtcustom');

        $( "#cmtFmtDialog" ).dialog( "close" );
    }

    function storeConfig() {
        // build a Map() for enabled standard buttons => button -> true/false
        let storestd = new Map();
        $( "#cmtFmtDialog #stdbutton [name]" ).each(function() { storestd.set( $(this).prop('name'), String($(this).prop('checked')) ); });
        localStorage.setItem('cmtfmtstandard', JSON.stringify(Array.from(storestd.entries())));

        // build a Map() for the custom buttons => custom# -> { icon: X, text: X, ins_pre: X, ins_app: X }
        let storecustom = new Map();
        $( "#cmtFmtDialog #custombutton div:has(input)" ).each((i, div) => {
            let parts = new Map();
            $(div).find('[name]').each(function() { parts.set( $(this).prop('name'), $(this).prop('value') ); });
            storecustom.set('custom'+i, JSON.stringify(Array.from(parts.entries())));
        });
        localStorage.setItem('cmtfmtcustom', JSON.stringify(Array.from(storecustom.entries())));

        $( "#cmtFmtDialog" ).dialog( "close" );
    }

    /* CREATING THE LINK TO OPEN THE CONFIGURATION DIALOG */

    // if no other script has created it yet, write out a "Userscripts" option to the main navigation
    if ($('#scriptconfig').length == 0) {
        $('#header').find('nav[aria-label="Site"] li.dropdown').last()
            .after(`<li class="dropdown" id="scriptconfig">
                <a class="dropdown-toggle" href="/" data-toggle="dropdown" data-target="#">Userscripts</a>
                <ul class="menu dropdown-menu"></ul></li>`);
    }
    // then add this script's config option to navigation dropdown
    $('#scriptconfig .dropdown-menu').append(`<li><a href="javascript:void(0);" id="opencfg_cmtfmt">Comment Formatting Buttons</a></li>`);

    // on click, open the configuration dialog
    $("#opencfg_cmtfmt").on("click", function(e) {
        $( "#cmtFmtDialog" ).dialog('open');
    });

    /*********************************************************
     COMMENT BAR AND PREVIEW FUNCTIONALITY
     *********************************************************/

    // merge the enabled standard and custom buttons into one list
    let config = new Map();
    config_std.forEach((val, key) => { if (standardmap.get(key)==="true" || standardmap.size == 0) config.set(key, val); });
    config_custom.forEach((val, key) => {
        if (val.icon !== "") val.icon = `&#x${val.icon};`; // add what Font Awesome needs to display properly
        config.set(key, val);
    });

    $("head").append(`<style type="text/css"> ul.actions.comment-format { font-family: FontAwesome, sans-serif; float: left; }
        ul.comment-format a { cursor: default; }
        ul.comment-format .fontawe { font-family: FontAwesome, sans-serif; }
        div.comment-preview.userstuff { border: 1px inset #f0f0f0; min-height: 1em; padding: 0.2em 1em; line-height: 1.5; } </style>`);

    // collate the button bar
    let buttonBar = document.createElement('ul');
    $(buttonBar).addClass('actions comment-format');
    for (let c of config) {
        let li = document.createElement('li');
        li.title = c[1].text;
        li.innerHTML = `<a class="${c[0]}">${ (c[1].icon === "") ? c[1].text : c[1].icon}</a>`;
        if (c[1].icon !== "") $(li).addClass("fontawe");
        $(buttonBar).append(li);
    }
    // delegated event handlers for button clicks and update of the comment preview
    $('body').on('click', 'ul.comment-format a', function(e) {
        e.preventDefault();
        insert_format(e.target);
    });
    $('body').on('input', 'textarea.comment-preview', function(e) {
        update_preview(e.target);
    });

    // preview box template (will be cloned when inserting into DOM)
    let preview = `<div class='comment-preview userstuff' title='Comment Preview (approximate)'></div>`;

    // click event function called with the button <a> that was clicked (so we know which textarea to insert it to)
    function insert_format(elm) {
        let area = $(elm).parent().parent().next('textarea')[0]; // the textarea element we're dealing with
        let text = $(area).val(); // the original content of the comment box
        let cursor_start = area.selectionStart, cursor_end = area.selectionEnd; // any highlighted text
        let fmt = config.get(elm.className); // grab the formatting HTML corresponding to the clicked button

        // set the comment box text with the new content, and focus back on it
        $(area).val(
            text.slice(0, cursor_start) + // text from before cursor position or highlight
            fmt.ins_pre + text.slice(cursor_start, cursor_end) + fmt.ins_app + // wrap any highlighted text in the formatting HTML
            text.slice(cursor_end) // text from after cursor position or highlight
        ).focus();

        // set the cursor position to the same value so we don't highlight anymore
        let cursor_new =
            // if we only inserted format HTML, set it between the halves so you can enter the text to format
            (cursor_start == cursor_end) ? cursor_start + fmt.ins_pre.length :
            // if we highlighted, and this is a link (so the link text is already done), set the cursor into the href=""
            (elm.className == "link") ? cursor_start + fmt.ins_pre.length - 2 :
            // otherwise always set it at the end of the inserted text i.e. the same distance from the end as originally
            $(area).val().length - (text.length - cursor_end);
        area.selectionStart = area.selectionEnd = cursor_new;

        // manually trigger the value-has-changed event so the preview updates (not calling update_preview directly as it would fail on Sticky Comment Box)
        $(area).trigger('input');
    }

    // function called when anything changes (input event trigger) in the textarea
    function update_preview(elm) {
        let prevbox = $(elm).siblings('div.comment-preview')[0];
        prevbox.innerHTML = parse_preview($(elm).val());
    }

    // adding the button bar & preview box for the New/Edit Work/Chapter form and the Edit Collection form
    if ($('#work_summary, #work_notes, #work_endnotes, #chapter_summary, #chapter_notes, #chapter_endnotes, [id^=collection_collection_profile_attributes]').filter('textarea').length > 0) {
        $('#work_summary, #work_notes, #work_endnotes, #chapter_summary, #chapter_notes, #chapter_endnotes, [id^=collection_collection_profile_attributes]:not([id*=notification])').filter('textarea')
            .before($(buttonBar).clone())
            .after($(preview).clone())
            .addClass('comment-preview')
            .each(function() { update_preview(this); }); // update the preview for reloaded pages with cached comment text
    }

    // if we're not posting/editing a work, we are probably viewing a page that allows commenting: add for visible comment boxes and handle the Sticky Comment Box
    else if ($('#main').find('textarea[id^="comment_content_for"]').length > 0) {
        // adding the button bar & preview box for any visible comment area (clone with events!)
        $('textarea[id^="comment_content_for"]')
            .before($(buttonBar).clone())
            .after($(preview).clone())
            .addClass('comment-preview')
            .each(function() { update_preview(this); }); // update the preview for reloaded pages with cached comment text

        // Support for Sticky Comment Box!
        // if this script executes first, we may have to wait for the Sticky Comment Box to appear in the DOM
        if ($('#float_cmt_dlg').length == 0) {
            const observer = new MutationObserver(function(mutList, obs) {
                for (const mut of mutList) { for (const node of mut.addedNodes) {
                    // check if the added node is our comment box
                    if (node.id == 'float_cmt_dlg') {
                        obs.disconnect(); // stop listening immediately, we have what we needed
                        // add the buttonbar to the Sticky Comment Box (it doesn't get a preview field to save space)
                        $('#float_cmt_userinput textarea').before($(buttonBar).clone().css('font-size', '80%'));
                    }
                }}
            });

            // listening to as few changes as possible: only direct children of <body>
            observer.observe($('body').get(0), { attributes: false, childList: true, subtree: false });

            // failsafe: stop listening after 5 seconds (in case the other script isn't running)
            // this will always execute even if the box was already found and the observer disconnected previously
            let timeout = setTimeout(() => {
                observer.disconnect();
            }, 5 * 1000);
        }
        // when the Sticky Comment Box script executed first and the textarea is already there, we immediately add the button bar
        else $('#float_cmt_userinput textarea').before($(buttonBar).clone().css('font-size', '80%'));
    }

    // and if we're doing comments on either a work or the inbox, we need to wait for dynamic replies
    if($('#feedback, #reply-to-comment, #main.comments-show').length > 0) {
        // adding the bar for any dynamically loaded comment areas: inbox replies, work/tag replies, editing existing comments
        const waitforreply = new MutationObserver(function(mutList, obs) {
            for (const mut of mutList) { for (const node of mut.addedNodes) {
                // check if the added node is our comment box
                if (node.nodeType == 1 && node.id.startsWith('comment_form_for')) {
                    $(node).find('textarea')
                        .before($(buttonBar).clone())
                        .after($(preview).clone())
                        .addClass('comment-preview')
                        .each(function() { update_preview(this); }); // update the preview with the existing comment text
                }
            }}
        });

        // listening to the places where Ao3 adds the HTML in for the reply box
        waitforreply.observe($('#feedback, #reply-to-comment, #main.comments-show').get(0), { attributes: false, childList: true, subtree: true });
    }

    // if we're in a bin, we have to handle the View & Post Comment box (which might be adding its own Comments buttons after 2 sec)
    if ($('#wrangulator').length > 0) {
        // if this script executes first, we may have to wait for the View & Post Comment box to appear in the DOM
        if ($('#peekTopLevelCmt').length == 0) {
            let waitfmt = new MutationObserver(function(mutList, obs) {
                for (let mut of mutList) { for (let node of mut.addedNodes) {
                    // check if the added node is our comment box
                    if (node.id === 'peekTopLevelCmt') {
                        obs.disconnect(); // stop listening immediately, we have what we needed
                        // add the buttonbar to the View & Post Comment box (it doesn't get a preview field to save space)
                        $('#peekTopLevelCmt textarea').before($(buttonBar).clone());
                    }
                }}
            });

            // listening to as few changes as possible: only direct children of #main
            waitfmt.observe($('#main').get(0), { attributes: false, childList: true, subtree: false });

            // failsafe: stop listening after 5 seconds (in case the other script isn't running)
            // this will always execute even if the box was already found and the observer disconnected previously
            let timeout = setTimeout(() => {
                waitfmt.disconnect();
            }, 5 * 1000);
        }
        // when the View & Post Comment box script executed first and the textarea is already there, we immediately add the button bar
        else $('#peekTopLevelCmt textarea').before($(buttonBar).clone());
    }

    // on bookmarks, there's either an Edit button to manage my own bookmark, or a Save button to bookmark that work
    if ($('div[id^="bookmark_form_placement_for_"]').length > 0) {
        const waitforbkmk = new MutationObserver(function(mutList, obs) {
            for (const mut of mutList) { for (const node of mut.addedNodes) {
                // check if the added node is our comment box
                if (node.nodeType == 1 && node.id === 'bookmark-form') {
                    $(node).find('textarea')
                        .before($(buttonBar).clone())
                        .after($(preview).clone())
                        .addClass('comment-preview')
                        .each(function() { update_preview(this); }); // update the preview with the existing comment text
                }
            }}
        });

        // listening to the places where Ao3 adds the HTML for the add/edit bookmark box
        // unfortunately the only way to listen to multiple elements is to loop through the list, but then we don't need to listen to the whole tree (:
        $('div[id^="bookmark_form_placement_for_"]').each(function() {
            waitforbkmk.observe($(this).get(0), { attributes: false, childList: true, subtree: false });
        });
    }
    // when viewing a work, the bookmark form is already loaded, just not visible
    if ($('#main').find('textarea#bookmark_notes').length > 0) {
        // adding the button bar & preview box for any visible comment area (clone with events!)
        $('textarea#bookmark_notes')
            .before($(buttonBar).clone())
            .after($(preview).clone())
            .addClass('comment-preview')
            .each(function() { update_preview(this); }); // update the preview for reloaded pages with cached comment text
    }

    function parse_preview(content) {
        // if the comment box is still empty, show a simple placeholder
        if (content == "") return "<p><i>preview</i></p>";

        // if there is comment text, turn double linebreaks into paragraphs and single linebreaks into <br>
        // linebreak compatibility
        const lbr = (content.indexOf("\r\n") > -1) ? "\r\n" :
                    (content.indexOf("\r") > -1) ? "\r" : "\n";

        // remove obvious issues: whitespaces between <li>'s, a <br> plus linebreak (while editing)
        content = content.replace(/<\/li>\W+<li>/ig, '</li><li>');
        content = content.replace(/<br \/>(\r\n|\r|\n)/ig, '<br />');

        content = content.split(`${lbr}${lbr}`); // split content at each two linebreaks in a row
        const regexLine = new RegExp(`${lbr}`, "g");
        content.forEach((v, i) => {
            v = v.replace(regexLine, "<br />"); // a single linebreak is replaced by a <br>
            content[i] = "<p>"+v.trim()+"</p>"; // two linebreaks are wrapped in a <p>
        });
        return content.join(lbr);
    }

})(jQuery);