// ==UserScript==
// @name         AO3: [Wrangling] Action Buttons Everywhere
// @namespace    https://greasyfork.org/en/users/906106-escctrl
// @description  Adds buttons to manage tags EVERYWHERE you want, turns tag-URLs in comments into links, and can show search results as a table
// @author       escctrl
// @version      5.8
// @match        *://*.archiveofourown.org/tags/*
// @match        *://*.archiveofourown.org/comments*
// @match        *://*.archiveofourown.org/users/*/inbox*
// @grant        none
// @require      https://update.greasyfork.org/scripts/491896/1516188/Copy%20Text%20and%20HTML%20to%20Clipboard.js
// @require      https://update.greasyfork.org/scripts/542049/1623295/AO3%3A%20Initialize%20jQueryUI.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/501991/AO3%3A%20%5BWrangling%5D%20Action%20Buttons%20Everywhere.user.js
// @updateURL https://update.greasyfork.org/scripts/501991/AO3%3A%20%5BWrangling%5D%20Action%20Buttons%20Everywhere.meta.js
// ==/UserScript==

/* eslint-disable no-multi-spaces */
/* global q, qa, copy2Clipboard, $, createMenu, initGUI */
'use strict';

/*********** INITIALIZING ***********/

// utility to reduce verboseness (already declared in library)
//const q = (selector, node=document) => node.querySelector(selector);
//const qa = (selector, node=document) => node.querySelectorAll(selector);


if (window.self !== window.top) return; // don't do any of this if the script is running in an iFrame
const page_type = findPageType();
if (page_type == "") return; // page that isn't supported or we're in retry later

let cfg = 'wrangleActionButtons'; // name of dialog and localstorage used throughout

let stored = loadConfig(); // get previously stored configuration
const tw_icons = stored.iconify ? createIconSet() : {};
const tw_actions = createButtons();

/*********** CSS ***********/

if (stored.iconify) {
    q("head").insertAdjacentHTML('beforeend', `<style type="text/css">#wranglerbuttons, .wrangleactions, .heading .wrangleactions a, .wrangleactions label, a.rss, #new_favorite_tag input[type=submit],
        form[id^="edit_favorite_tag"] input[type=submit], a#go_to_filters { svg { width: 1em; height: 1em; display: inline-block; vertical-align: -0.125em; }}
        #resulttable .resultType { svg { width: 1.2em; height: 1.2em; display: inline-block; vertical-align: -0.2em; }}</style>`);
}
q("head").insertAdjacentHTML('beforeend', `<style type="text/css">a.rss span { background: none; padding-left: 0; }
        .wrangleactions li { padding: 0; display: inline-block; margin: 0 0.2em; }
        table .wrangleactions li a { padding: 0; margin: 0; }
        .wrangleactions .wrangleactions-choosefmt a { margin: 0; }
        #main > .wrangleactions { margin: 0.5em 0; float: none; text-align: right; }
        .wrangleactions input[type='checkbox'] { margin: auto auto auto 0.5em; vertical-align: bottom; }
        #main li.comment .wrangleactions a { padding: 0.1em 0.3em; }
        #main li.comment .userstuff ul.wrangleactions { font-size: 85%; padding: 0 0.2em; li { display: inline-block; } }
        #resulttable { line-height: 1.5; ${stored.tableflex ? `width: auto; margin-left:0;` : ''} }
        #resulttable .resultcheck { display: none; }
        #resulttable .resultManage { font-size: 90%; ${(!stored.pages.includes("search") || stored.search.length == 0) ? `display: none;` : ''} }
        #resulttable .resultType, #resulttable .resultManage { text-align: center; }
        #resulttable .resultUses { text-align: right; }</style>`);

/***************** CONFIG DIALOG *****************/

(async function() {
    // Library function: creates the "Userscripts" menu item with (id, heading) parameters
    createMenu(cfg, "Wrangling Action Buttons");

    // config rarely is opened, so we avoid running through its setup on every page load by initializing only on first click (it adds a listener for subsequent clicks)
    q("#opencfg_"+cfg).addEventListener("click", async function(e) {
        // Library function: initializes webix and the window component with (id, heading, maxWidth, views that may need to be styled) parameters
        //                   returns the (empty) layout component to which all other webix "views" can be added
        let uiElem = await initGUI(e, cfg, "Wrangling Action Buttons", 900);
        if (uiElem !== false) createDialog(uiElem);
    }, { once: true });

    // this function fills the jqueryUI dialog and shows it
    function createDialog(dlg) {

        q("head").insertAdjacentHTML('beforeend', `<style type="text/css">
            #${cfg} {
                svg { font-size: 120%; width: 1em; height: 1em; display: inline-block; vertical-align: -0.15em; }
                fieldset { border: 1px dotted color-mix(in srgb, currentColor 50%, transparent); margin: 1.5em 0; }
                .sortable li { float: left; } /* to avoid placeholder jumping up a few pixels */
                .sortable::after { content: ""; display: block; clear: both; } /* to force linebreak after ul since the li's float */
            }
            </style>`);

        // building the dialog content
        let pages = { top: "Top of all Tag Pages", bin: "Manage column in Bins", inbox: "Inbox & Comments", search: "Tag Search results" };
        let order = {}, sort = {};
        const print_switch = (s, n, id="") => `<span class="switch ui-button ${s ? "ui-state-active" : ""}"><input type="checkbox" name='${n}' id='${cfg}_${id}${n}' ${s ? "checked='checked'" : ""}><span class="slider round"></span></span>`;

        // slider toggles for enabling pages/locations
        let enabled = Object.keys(pages).map((me) => `<label for='${cfg}_pages-${me}'>${print_switch(stored.pages.includes(me), me, 'pages-')} Action buttons on ${pages[me]}</label>`);

        // filling up the enabled buttons with the remaining available - Set() does the job of keeping values unique
        for (let loc of Object.keys(pages)) {
            order[loc] = new Set(stored[loc]); // get all buttons that are enabled per storage
            for (let btn of Object.keys(tw_actions)) { // get all additional available buttons
                if (tw_actions[btn].pages?.includes(loc)) order[loc].add(btn);
            }
            for (let btn of Array.from(order[loc].values())) { // for each button create the HTML
                sort[loc] = (sort[loc] || "") + `<li title="${tw_actions[btn].tooltip}"><label for='${cfg}_${loc}-${btn}'>${stored.iconify ? tw_icons[btn] : tw_actions[btn].text}</label>
                    <input type='checkbox' name='${btn}' id='${cfg}_${loc}-${btn}' ${stored[loc].includes(btn) ? "checked='checked'" : ""}></li>`;
            }
        }
        let sort_tablecols = Array.from(stored.tablecols.values()).map((me) => `<li><span class='ui-button ui-widget ui-corner-all'>${me}</span></li>`);

        $(dlg).html(`<form>
        <p>Toggle on the places where you wish to have wrangling buttons. Then select (enable) the specific buttons you want. Finally, drag them into your preferred order.</p>
        <fieldset id='fs-top'><legend>${enabled[0]}</legend>
            <div ${!stored.pages.includes("top") ? "style='display: none;'" : ""}>
                <ul id='sortable-top' class='sortable'>${sort.top}</ul>
            </div>
        </fieldset>
        <fieldset id='fs-bin'><legend>${enabled[1]}</legend>
            <div ${!stored.pages.includes("bin") ? "style='display: none;'" : ""}>
                <ul id='sortable-bin' class='sortable'>${sort.bin}</ul>
            </div>
        </fieldset>
        <fieldset id='fs-inbox'><legend>${enabled[2]}</legend>
            <div ${!stored.pages.includes("inbox") ? "style='display: none;'" : ""}>
                <p>Enabling this also gives you a "Linkify" button on every tag comment to turn a tag name into a link.</p>
                <ul id='sortable-inbox' class='sortable'>${sort.inbox}</ul>
            </div>
        </fieldset>
        <fieldset id='fs-search'><legend>${enabled[3]}</legend>
            <div ${!stored.pages.includes("search") ? "style='display: none;'" : ""}>
                <ul id='sortable-search' class='sortable'>${sort.search}</ul>
            </div>
        </fieldset>
        <fieldset id='fs-search-table'><legend><label for='${cfg}_table'>${print_switch(stored.table, 'table')} Show Tag Search results as a table</label></legend>
            <div ${!stored.table ? "style='display: none;'" : ""}>
                <p>Drag the columns into your preferred order:</p>
                <ul id='sortable-tablecols' class='sortable'>
                    ${sort_tablecols.join("")}
                    <li class="sortfixed"><span class='ui-button ui-widget ui-corner-all ui-state-disabled'>Peek Script</span></li>
                </ul>
                <p><label for='${cfg}_tableflex'>${print_switch(stored.tableflex, 'tableflex')} Make the table only as wide as the tags</label></p>
            </div>
        </fieldset>
        <fieldset><legend>General Settings:</legend>
        <p>
            <label for='${cfg}_iconify'>${print_switch(stored.iconify, 'iconify')} Use icons instead of text labels</label>,
            <label for='${cfg}_iconset'>and use the icon style of </label><select name='iconset' id='${cfg}_iconset'>
            <option value="lucide" ${stored.iconset === "lucide" ? "selected='selected'" : ""}>Lucide (outline)</option>
            <option value="hero" ${stored.iconset === "hero" ? "selected='selected'" : ""}>Heroicons (solid)</option>
            <option value="fa" ${(stored.iconset !== "lucide" && stored.iconset !== "hero") ? "selected='selected'" : ""}>Fontawesome (solid)</option></select>
        </p>
        <p>
            <label for='${cfg}_stopbgload'>${print_switch(!stored.stopbgload, 'stopbgload')} Silently load Work/Bookmark/Comment counts</label> (try disabling this if you get rate-limited often)
        </p>
        </fieldset>
        </form>`);

        // show/hide the corresponding fieldsets when a page is enabled or disabled
        $(`#${cfg}`).on('change', 'legend input', (e) => $(e.target).parents('fieldset').eq(0).find('> div').toggle(400));

        // toggle between active and inactive classes for the switches
        $(`#${cfg}`).on('change', `span.switch input`, (e) => $(e.target).parent().toggleClass('ui-state-active'));

        // the save/reset/cancel buttons and handling of storage
        $(dlg).dialog('option', 'buttons', [
            {
                text: "Reset",
                click: function() {
                    localStorage.removeItem(cfg);
                    $( this ).dialog( "close" );
                }
            },
            {
                text: "Cancel",
                click: function() { $( this ).dialog( "close" ); }
            },
            {
                text: "Save",
                click: function() {
                    // get selected values
                    let prefs = $(dlg).find('input[type="checkbox"]:checked');
                    // rearrange into what will be stored
                    let to_store = {};
                    to_store.pages = $(prefs).filter(`[id^=${cfg}_pages]`).map(function() { return this.name; }).toArray();
                    for (let loc of Object.keys(pages)) {
                        to_store[loc] = $(prefs).filter(`[id^=${cfg}_${loc}]`).map(function() { return this.name; }).toArray();
                    }
                    for (let x of ["iconify", "stopbgload", "table", "tableflex"]) {
                        to_store[x] = $(prefs).filter(`[name="${x}"]`).length > 0 ? true : false;
                    }
                    to_store.stopbgload = !to_store.stopbgload; // stupid, but this is inverted
                    to_store.tablecols = $(dlg).find('#sortable-tablecols li:not(.sortfixed)').map(function() { return this.innerText; }).toArray();
                    to_store.iconset = $(dlg).find('#wrangleActionButtons_iconset').val();

                    // store new values
                    localStorage.setItem(cfg, JSON.stringify(to_store));
                    $( this ).dialog( "close" );
                }
            },

        ]);

        $(dlg).dialog('open');

        // turn checkboxes and radiobuttons into pretty buttons (must be after 'open' for dropdowns to work)
        $( `#${cfg} .sortable input[type='checkbox']` ).checkboxradio({ icon: false });
        $( ".sortable" ).sortable({
            forcePlaceholderSize: true,
            tolerance: 'pointer', // makes the movement behavior more predictable
            revert: true,         // animates reversal when dropped where it can't be sorted
            opacity: 0.5,         // transparency for the handle that's being dragged around
            cancel: '.sortfixed', // disables sorting for elements with this class
            cursor: "grabbing",   // switches cursor while dragging a tag for A+ cursor responsiveness
            containment: "parent" // limits dragging to the box and avoids scrollbars
        }).disableSelection();    // disable text selection
    }
})();

/*********** BUILDING THE BUTTON BARS ***********/

if (stored.pages.includes("top") && page_type !== "inbox") buildButtonBarTop();
if (stored.pages.includes("bin") && page_type === "wrangle") buildButtonBarList("bin");
if (stored.pages.includes("inbox") && (page_type === "inbox" || page_type === "comments")) {
    qa('li.comment .userstuff > *:not(a)').forEach((el) => plainURI2Link(el)); // turn any plaintext URLs in the comment into links
    buildButtonBarList("inbox");

    // add a button on each tag comment's actionbar - has to be a <button> since <a> would overwrite the getSelection()
    let createlink = qa('li.comment > ul.actions'); // script anyhow only runs on TAG comment pages
    if (page_type === "inbox") createlink = [...createlink].filter((cmt) => !!q('.byline a[href*="/tags/"]', cmt.parentElement)); // find TAG comments in the inbox
    createlink.forEach((x) => x.insertAdjacentHTML('afterbegin', `<li><button class="name2link" type="button">Linkify</button></li>`));
}
if (page_type == "search") {
    if (stored.table && window.location.search !== "") buildSearchTable();
    if (stored.pages.includes("search")) buildButtonBarList("search");
}

function buildButtonBarTop() {
    // find name and plain url for this tag, and keep it in data-* attr for the copy logic
    let tag_url = "", tag_name = "";
    if (page_type === "landing") {
        tag_name = q('div.tag h2.heading').innerText;
        tag_url = window.location.origin+window.location.pathname;
    }
    else if (!["search", "inbox"].includes(page_type)) {
        let found = qa('#main > .heading a.tag');
        if (found.length === 1) {
            tag_name = found[0].innerText;
            tag_url = found[0].href;
        }
        else { // monitoring if there are ever multiple tags found. some pages use h2, some h3
            console.warn(found);
            alert(found.length + ' tag headings found, check console');
            return false;
        }
    }

    // create the <ul> on pages where it doesn't exist yet
    if (page_type === "comments") { // comments don't have an action bar yet, we need to create it
        let prevheader = q('#main h2.heading') || q('#main h3.heading'); // h3 when clicking through from the inbox
        prevheader.insertAdjacentHTML('afterend', `<ul class="navigation actions" role="navigation"'></ul>`);
    }
    else if (page_type == "edit") { // edit has a <p> instead of an <ul>
        let new_ul = document.createElement('ul');
        new_ul.classList.add('navigation', 'actions');
        let old_p = q('#main p.navigation.actions');
        old_p.replaceWith(new_ul); // hang <ul> in DOM where <p> used to be
        Array.from(old_p.children).forEach((child) => { // add content of <p> back in, each wrapped in a <li>
            let new_li = document.createElement('li');
            new_li.appendChild(child);
            new_ul.appendChild(new_li);
        });
    }

    // make the navbar ours aka give it our ID
    let buttons_ul = q('#main ul.navigation.actions');
    buttons_ul.classList.add('wrangleactions');
    buttons_ul.setAttribute("data-twactions-tagurl", encodeURIComponent(tag_url));
    buttons_ul.setAttribute("data-twactions-tagname", encodeURIComponent(tag_name));

    // save text that contains the comment count and last comment date before we delete that button
    let last_comment = q('a[href$="/comments"]', buttons_ul)?.innerText;

    for (let n = buttons_ul.childNodes.length-1; n >= 0; n--) { // cleanup: live NodeList so removing from the end
        let x = buttons_ul.childNodes[n];
        if (x.nodeName === "#text") { x.remove(); } // get rid of whitespaces between elements
        else if (x.nodeName === "LI") {
            let y = x.firstElementChild;
            // get rid of <li> with Comments, Works, etc buttons
            if ( y.nodeName === "A" && (new String(y.href).search(/\/(comments|works|bookmarks|edit|troubleshooting)\/?$/) !== -1) ||
                 y.classList.contains("current") ) x.remove();
        }
    }

    // gather the buttons with their content
    let buttons_li = {};
    for (let action of stored.top) {
        if (page_type === action && page_type !== "search") continue; // don't link to the page we're on (except on search)
        if (page_type === "search" && action !== "search" && action !== "new") continue; // don't link to tag-specific stuff on search

        if (action === "search_fan") {
            // only link to fandom-search if it's a fandom tag (and, ideally, canonical)
            if (!["wrangle", "edit", "landing"].includes(page_type)) continue; // only link to fandom-search on a bin, edit, landing page
            else if (page_type === "wrangle" && qa('li', qa('#dashboard ul.navigation.actions')[1]).length !== 5) continue;
            else if (page_type === "edit") {
                let dt = [...qa('#edit_tag dt')].filter((x) => x.innerText === "Category");
                let dd = dt[0].nextElementSibling.innerText.trim();
                if (dd !== "Fandom" || !q('#tag_canonical').checked) continue;
            }
            else if (page_type == "landing" && q('.tag.home > p:first-of-type').innerText.search(/^This tag belongs to the Fandom Category\.\s.*canonical/) == -1) continue;

            // set the search parameters (fandom name + tag type) in the link
            let search_params = new URLSearchParams();
            search_params.set('tag_search[fandoms]', tag_name);
            let tag_type = new URLSearchParams(window.location.search).get('show') || "";
            tag_type = ["characters", "relationships", "freeforms"].includes(tag_type) ? tag_type[0].toUpperCase() + tag_type.slice(1, -1) : ""; // don't try it with Mergers or Subtags
            search_params.set('tag_search[type]', tag_type);
            tw_actions[action].link += search_params.toString();
        }

        buttons_li[action] = `<li title="${tw_actions[action].tooltip}"${
                action === "troubleshoot" ? ` class="reindex"` : ""
            }><a href="${
                tw_actions[action].link.startsWith("X") ?  tag_url + tw_actions[action].link.slice(1) : tw_actions[action].link
            }" class="wrangleactions-${action}" ${
                (action.startsWith("tag")) ? `data-twactions-copyfmt="${action}"` : ""
            }>${ // placeholder for counts (don't always get filled)
                (action=="comments" || action=="works" || action=="bookmarks") ? '<span id="'+action+'Count"></span>' : ""
            }${ // buttonlabel: text or icon
                stored.iconify ? tw_icons[action] : tw_actions[action].text
            }</a></li>`;
    }

    // add buttons to the page
    stored.top.forEach((action) => buttons_ul.insertAdjacentHTML('beforeend', buttons_li[action] || ""));

    // works and bookmarks: reduce the FILTER, FAVORITE and RSS buttons on Works page to its icon, if everything else is icons too
    // on bookmarks page, only the FILTER button applies
    if (stored.iconify && (page_type == "works" || page_type == "bookmarks")) {
        if (page_type == "works") {
            if (q('.navigation.actions a.rss span', buttons_ul)) q('.navigation.actions a.rss span', buttons_ul).innerHTML = tw_icons.rss; // replace RSS icon (if there is one - freeforms don't have it)
            let fav = q('#new_favorite_tag input[type="submit"]', buttons_ul) || q('form[id^="edit_favorite_tag"] input[type="submit"]', buttons_ul);
            fav.style.display = "none";
            // wrap in a <label>
            let favlabel = document.createElement('label');
            fav.replaceWith(favlabel);
            favlabel.appendChild(fav);
            favlabel.classList.add('button');
            favlabel.insertAdjacentHTML('beforeend', (favlabel.parentNode.id === "new_favorite_tag" ? tw_icons.favorite : tw_icons.unfavorite));
            favlabel.title = favlabel.parentNode.id === "new_favorite_tag" ? tw_actions.favorite.tooltip : tw_actions.unfavorite.tooltip;
        }
        q('a#go_to_filters', buttons_ul).title = tw_actions.funnel.tooltip;
        q('a#go_to_filters', buttons_ul).innerHTML = tw_icons.funnel;
    }

    // retrieving comment, work, and bookmark counts when the page doesn't have them
    let cmt_button = q('.wrangleactions-comments');
    if (last_comment && cmt_button) { // if there was a button, use its content
        q('#commentsCount', cmt_button).innerText = last_comment.match(/^\d+/)[0] + " ";
        cmt_button.title = last_comment.match(/\((.*)\)/)?.at(1) || tw_actions.comments.tooltip;
    }
    (async function() { if (!stored.stopbgload) { // execute immediately but treat as async due to await-ing fetch responses
        let total = "";
        if (!last_comment && cmt_button) {
            total = await fetchCount(tag_url + tw_actions.edit.link.slice(1), '#main p.navigation.actions a[href$="comments"]');
            if (total === '[ERROR]') return false;
            q('#commentsCount', cmt_button).innerText = total.innerText.match(/^\d+/)[0] + " ";
            cmt_button.title = total.innerText.match(/\((.*)\)/)?.at(1) || tw_actions.comments.tooltip;
        }
        if ((page_type === "edit" && q('#tag_canonical').checked)) {
            let bkmk_button = q('.wrangleactions-bookmarks');
            let works_button = q('.wrangleactions-works');

            if (works_button) {
                // if there are no subs or syns, we can use the number from the sidebar
                if (!q('#child_SubTag_associations_to_remove_checkboxes') && !q('#child_Merger_associations_to_remove_checkboxes')) {
                    total = parseInt(q('#dashboard a[href$="/works"]').innerText.match(/\d+/)[0]).toLocaleString('en'); // adds thousands separator
                }
                else {
                    total = await fetchCount(tag_url + tw_actions.works.link.slice(1), '#main h2.heading');
                    if (total === '[ERROR]') return false;
                    total = total.childNodes[0].textContent.match(/([0-9,]+) Work/)[1];
                }
                q('#worksCount', works_button).innerText = total + " ";
            }

            if (bkmk_button) {
                total = await fetchCount(tag_url + tw_actions.bookmarks.link.slice(1), '#main h2.heading');
                if (total === '[ERROR]') return false;
                total = total.childNodes[0].textContent;
                q('#bookmarksCount', bkmk_button).innerText = total.match(/([0-9,]+) Bookmarked/)[1] + " ";
            }
        }
    } })();
}

function buildButtonBarList(loc, just_this=null) {

    let tags = (just_this !== null) ? [just_this] :
               (loc === "bin") ? qa('#wrangulator table tbody tr a[href$="/edit"]') :
               (loc === "inbox" && page_type === "comments") ? qa('li.comment .userstuff a[href*="/tags/"]') :
               (loc === "inbox" && page_type === "inbox") ? qa('li.comment a[href*="/tags/"]') :
               (loc === "search") ? qa(`${stored.table ? '#resulttable ' : ""}a.tag`) : [];

    let unwrangled = loc === "bin" && new URLSearchParams(document.location.search).get('status') == "unwrangled" ? true : false;

    for (let tag of tags) {
        let buttons_li = {};
        let row = tag.closest('tr');

        // find name and plain url for this tag, and keep it in data-* attr for the copy logic
        let tag_url = String(tag.href).match(/.*\/tags\/[^/]*/)[0];
        let tag_name = (loc === "bin") ? q('th label', row).innerText : tag.innerText;
        let data_attr = `data-twactions-tagurl="${encodeURIComponent(tag_url)}" data-twactions-tagname="${encodeURIComponent(tag_name)}"`;

        // gather the buttons with their content
        for (let action of stored[loc]) {
            if (action === "remove" && !unwrangled) { // only exists in bins, but don't try to build it in UW
                let tag_nr = q('th input[name="selected_tags[]"]', row).value; // tag ID from the select checkbox
                buttons_li[action] = `<li title="${tw_actions[action].tooltip}"><label for="remove_associated_${tag_nr}" class="button">${
                        (stored.iconify) ? tw_icons[action] : tw_actions[action].text
                    }<input type="checkbox" name="remove_associated[]" id="remove_associated_${tag_nr}" value="${tag_nr}">
                    </label></li>`;
            }
            else if (action === "comments" && loc === "bin") {
                // build grammatically correct tooltip and icon for number of comments
                let cmts_count = q('a[href$="/comments"]', row).innerText.match(/\d+/)[0];
                let cmts_tooltip = cmts_count + " " + (cmts_count === "1" ? tw_actions.comments.tooltip.slice(0,-1) : tw_actions.comments.tooltip );
                let cmts_icon = (cmts_count !== "0") ? tw_icons.comments_some : tw_icons.comments;
                let cmts_text = cmts_count + " " + (cmts_count === "1" ? tw_actions.comments.text.slice(0,-1) : tw_actions.comments.text);

                buttons_li[action] = `<li title="${cmts_tooltip}"><a href="${
                        (tw_actions[action].link.startsWith("X")) ?  tag_url + tw_actions[action].link.slice(1) : tw_actions[action].link
                    }" class="wrangleactions-${action}">${
                        stored.iconify ? cmts_icon : cmts_text
                    }</a></li>`;
            }
            else {
                buttons_li[action] = `<li title="${ tw_actions[action].tooltip}"><a href="${
                        (tw_actions[action].link.startsWith("X")) ?  tag_url + tw_actions[action].link.slice(1) : tw_actions[action].link
                    }" class="wrangleactions-${action}" ${
                        action.startsWith("tag") ? `data-twactions-copyfmt="${action}"` : ""
                    }>${
                        stored.iconify ? tw_icons[action] : tw_actions[action].text
                    }</a></li>`;
            }
        }

        // and now insert it where it belongs
        if (loc === "bin") {
            if (stored.iconify) q('#wrangulator').setAttribute("data-twactions-icons", stored.iconset);

            let buttons_ul = tag.parentElement.parentElement;
            buttons_ul.classList.add('wrangleactions');
            buttons_ul.setAttribute("data-twactions-tagurl", encodeURIComponent(tag_url));
            buttons_ul.setAttribute("data-twactions-tagname", encodeURIComponent(tag_name));

            for (let n = buttons_ul.childNodes.length-1; n >= 0; n--) { // cleanup: live NodeList so removing from the end
                let x = buttons_ul.childNodes[n];
                if (x.nodeName === "#text") { x.remove(); } // get rid of whitespaces between elements
                else if (x.nodeName === "LI") {
                    let y = x.firstElementChild;
                    if ( (y.nodeName === "LABEL" && y.innerText.trim() === "Remove") || // get rid of <li> with Remove button
                         (y.nodeName === "A" && (y.innerText === "Wrangle" || y.innerText.startsWith("Comments"))) // get rid of <li> with Wrangle/Comments buttons
                       ) { x.remove(); }
                    // only hide the Edit and Works buttons at first position - for script compatibility
                    else if (y.nodeName === "A" && (y.innerText === "Edit" || y.innerText === "Works")) x.style.display = "none";
                }
            }
            // merge with any existing buttons
            let i = 1; // first button gets added after index 1 => keep hidden /edit and /works as the first items for script compatibility
            for (let action of stored[loc]) {
                if (action === "remove" && unwrangled) continue; // on unwrangled pages, the remove button is skipped
                buttons_ul.children[i].insertAdjacentHTML('afterend', buttons_li[action]);
                i++;
                // if we just added a Comments button, and there's an "Add Comment" button waiting, we jump over it so they remain next to each other
                if (action === "comments" && buttons_ul.children[i+1] && buttons_ul.children[i+1].title === "Add Comment") i++;
            }
        }
        else if (loc === "search") {
            let buttons_ul = `<ul class="wrangleactions actions" style="float: none; display: inline-block;" ${data_attr}>`;
            for (let action of stored[loc]) { buttons_ul += buttons_li[action]; }
            buttons_ul += `</ul>`;

            if (stored.table) q('.resultManage', row).innerHTML = buttons_ul;
            else tag.parentNode.insertAdjacentHTML('beforebegin', buttons_ul);
        }
        else if (loc === "inbox") {
            let buttons_ul = `<ul class="wrangleactions actions" style="float: none; display: inline-block; margin: 0;" ${data_attr}>`;
            for (let action of stored[loc]) { buttons_ul += buttons_li[action]; }
            buttons_ul += `</ul>`;

            tag.insertAdjacentHTML('afterend', buttons_ul);
        }
    }
}

function buildSearchTable() {
    let header = `<thead><tr>`;
    stored.tablecols.forEach((val) => { header += `<th scope="col" class="result${val}">${val}</th>`; });
    header += `<th scope="col" class="resultcheck">Fandom/Synonym</th></tr></thead>`;

    // the search results are in an <ol> under an <h4>
    // the individual result within the li is in another (useless) span, with text before (the type), a link (the tag), and text after (the count)
    let results = [];
    for (let result of qa('ol.tag.index.group li > span')) {

        let cols = {};                          // where we keep the columns content: "Name", "Type", "Uses", "Manage"
        let tag = q('a.tag', result);           // the <a> containing the tag's name and link
        let line = result.innerText.split(' '); // simple string manipulations are faster than complicated RegEx

        // if the script to find illegal chars is running, it might have added a <div class="notice">
        let illegalchar = q("div.notice", result.parentNode)?.outerHTML || "";

        // if the tag is canonical, the span has a corresponding CSS class
        cols.Name = `<th scope="row" class="resultName ${result.classList.contains('canonical') ? " canonical" : ""}">${tag.outerHTML} ${illegalchar}</th>`;

        // first word (minus the colon) is the type
        line[0] = line[0].slice(0, -1);
        cols.Type = `<td title="${tw_actions[line[0]].tooltip}" class="resultType">${stored.iconify ? tw_icons[line[0]] : tw_actions[line[0]].text}</td>`;

        // last word (minus the parenthesis) is the count
        // sadly there's a LTR writing direction char at the beginning which Firefox ignores and Chrome happily counts, so a simple slice won't do. RegEx to the rescue
        cols.Uses = `<td class="resultUses">${line[line.length-1].match(/\d+/)[0]}</td>`;

        // create this tag's action buttons bar
        cols.Manage = `<td class="resultManage"></td>`;

        // join them all in the configured order
        let colsOrdered = `<tr>`;
        stored.tablecols.forEach((val) => { colsOrdered += cols[val]; });
        colsOrdered += `<td class="resultcheck">&nbsp;</td></tr>`;

        results.push(colsOrdered);
    }

    let body = `<tbody>${results.join("\n")}</tbody>`;

    q('h4.landmark.heading:first-of-type').insertAdjacentHTML('afterend', `<table id="resulttable">${header}${body}</table>`);

    // hide the Type column if we've searched for a specific type (of course they'll all be the same then)
    var searchParams = new URLSearchParams(window.location.search);
    var search_type = searchParams.has('tag_search[type]') ? searchParams.get('tag_search[type]') : "";
    if (search_type != "") {
        qa('#resulttable .resultType').forEach((el) => { el.style.display = "none"; });
        q('#resulttable thead .resultName').insertAdjacentHTML('afterbegin', search_type+": ");
    }
    // hide the Manage column if we're not showing buttons there
    if (!stored.pages.includes("search")) qa('#resulttable .resultManage').forEach((el) => { el.style.display = "none"; });

    q('ol.tag.index.group').style.display = "none"; // hide the original results list
}

// one event listener to rule them all: copy to clipboard buttons
q('#main').addEventListener('click', (e) => {
    // .closest(): if the click target is or is within our element
    let delegated = e.target.closest('.wrangleactions-tagcopy'); // the "Copy Misc Format" button
    if (delegated) {
        e.preventDefault();
        addLinkFormatChoice(delegated);
        return true;
    }
    // the buttons in copy format mini-popup, and the individual name/link copy buttons
    for (let d of ['.wrangleactions-choosefmt a', '.wrangleactions-tagname', '.wrangleactions-taglink']) {
        delegated = e.target.closest(d);
        if (delegated) {
            e.preventDefault();
            let tag_url = decodeURIComponent(delegated.closest('.wrangleactions').getAttribute('data-twactions-tagurl'));
            let tag_name = decodeURIComponent(delegated.closest('.wrangleactions').getAttribute('data-twactions-tagname'));
            let fmt = delegated.getAttribute('data-twactions-copyfmt');
            setTextToCopy(e, fmt, tag_url, tag_name);
            return true;
        }
    }
    delegated = e.target.closest('button.name2link'); // Linkify button on comments
    if (delegated) {
        e.preventDefault();

        let sel = document.getSelection();
        // selection has to be a range of text to work, mustn't cross a <br> or <p> or <b>, has to be within a comment text, and on the same comment where button was pressed
        if (sel.type == "Range" && sel.anchorNode == sel.focusNode && sel.anchorNode.parentElement.closest('li.comment blockquote.userstuff') !== null
           && sel.anchorNode.parentElement.closest('li.comment') == e.target.closest('li.comment')) {
            // create the corresponding URL for the highlighted text
            let link = encodeURI("https://archiveofourown.org/tags/" +
                sel.toString().replace('/', '*s*').replace('&', '*a*').replace('#', '*h*').replace('.', '*d*').replace('?', '*q*'));

            // wrap the highlighted text in an <a>
            let a = document.createElement("a");
            a.href = link;
            sel.getRangeAt(0).surroundContents(a);

            // add the button bar after the inserted <a>
            buildButtonBarList("inbox", a);

            // remove the text highlighting
            sel.removeAllRanges();
        }
        else alert ('Please select some text in a comment first');
        return true;
    }
});

function addLinkFormatChoice(el) {
    qa(".wrangleactions-choosefmt").forEach((x) => x.remove()); // remove any other open ones

    let copybuttonbar = `<div class="wrangleactions-choosefmt actions" style="position: absolute; right: 0; top: 2em; z-index: 20; width: max-content; text-align: left; margin: 0;
        background-color: ${getComputedStyle(q('body')).getPropertyValue('background-color')}; border: 1px solid ${getComputedStyle(q('.wrangleactions a:first-of-type')).getPropertyValue('background-color')}; padding: 0.5em;">`;
    for (let fmt of ['tagname', 'taglink', 'chat', 'wiki']) {
        copybuttonbar += `<a href="#" data-twactions-copyfmt="${fmt}" title="${tw_actions[fmt].tooltip}">${stored.iconify ? tw_icons[fmt] : tw_actions[fmt].text}</a> `;
    }
    copybuttonbar += `<a href="#" title="Cancel">×</a></div>`;

    el.parentNode.style.position = "relative";
    el.insertAdjacentHTML('afterend', copybuttonbar);
}

/*********** HELPER FUNCTIONS ***********/

function findPageType() {
    // simpler than interpreting the URL: determine page type based on classes assigned to #main
    let main = q('#main');
    return main.classList.contains('tags-wrangle') ? "wrangle" :
           main.classList.contains('tags-edit') || main.classList.contains('tags-update') ? "edit" : // .tags-update after a Save failed
           main.classList.contains('tags-show') ? "landing" :
           main.classList.contains('tags-search') ? "search" :
           main.classList.contains('works-index') ? "works" :
           main.classList.contains('bookmarks-index') ? "bookmarks" :
           main.classList.contains('comments-index') ? "comments" :
           main.classList.contains('comments-show') && qa('.heading a.tag', main).length === 1 ? "comments" : // comment threads, only proceed if it's on a tag, not a work
           main.classList.contains('inbox-show') ? "inbox" : "";
}

function loadConfig() {
    // gets an Object { pages: [pages], top: [buttons], ..., iconify: boolean, ... } or creates default values if no storage was found
    return JSON.parse(localStorage.getItem(cfg)) ?? {
        pages: ["top"],
        top: ["search", "new", "landing", "edit", "wrangle", "comments", "works", "bookmarks", "troubleshoot", "tagname", "taglink"],
        bin: ["remove", "edit", "comments", "wrangle", "works"],
        inbox: [],
        search: ["edit"],
        iconify: true,
        iconset: "fa",
        stopbgload: false,
        table: true,
        tableflex: false,
        tablecols: ["Name", "Type", "Uses", "Manage"]
    };
}

async function fetchCount(url, sel) {
    try {
        let response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`); // the response has hit an error eg. 429 retry later
        else {
            let txt = await response.text();
            let parser = new DOMParser(); // Initialize the DOM parser
            let item = q(sel, parser.parseFromString(txt, "text/html")); // Parse the text into HTML and grab the selector
            if (!item) throw new Error(`response didn't contain what we were looking for\n${txt}`); // the response has hit a different page e.g. a CF prompt
            else return item; // returns a Node!
        }
    }
    catch(error) {
        // in case of any other JS errors
        console.warn("[script] Action Buttons Everywhere encountered an error", error.message);
        return '[ERROR]';
    }
}

function plainURI2Link(el) {
    // first we test for a construct of <a href="URL">URL</a> and turn the text readable
    qa('a[href*="/tags/"]', el).forEach((a) => {
        if (a.innerText.startsWith("http")) {
            // from the HREF attribute, we grab the tag name into Group 1 (still URI encoded)
            let tagEnc = a.href.match(/\/tags\/([^\/]*)/)[1];
            // we decode that into a readable tag name
            let tagDec = decodeURIComponent(tagEnc).replace('*s*','/').replace('*a*','&').replace('*d*','.').replace('*h*','#').replace('*q*','?');
            // and re-build this into a readable link
            a.innerText = tagDec;
            a.href = `https://archiveofourown.org/tags/${tagEnc}`;
        }
    });

    // after linked URLs were fixed, we test for unlinked URLs in text
    // ?<! ... ) is a "negative lookbehind" RegEx and ensures we don't pick up any URIs in a <a> href property
    el.innerHTML = el.innerHTML.replaceAll(/(?<!href=["'])https:\/\/.*?archiveofourown\.org\/tags\/[^<>\s]*/g, function (x) {
        // from the URL, we grab the tag name into Group 1 (still URI encoded)
        let tagEnc = x.match(/https:\/\/.*?archiveofourown\.org\/tags\/([^\/\s]+)/)[1];
        // we decode that into a readable tag name
        let tagDec = decodeURIComponent(tagEnc).replace('*s*','/').replace('*a*','&').replace('*d*','.').replace('*h*','#').replace('*q*','?');
        // and re-build this into a readable link
        return `<a href="https://archiveofourown.org/tags/${tagEnc}">${tagDec}</a>`;
    });
}

function setTextToCopy(e, linkfmt, url, name) {
    /* url  = plain URI of the tag
       name = plain (readable) text name of the tag
       txt  = MIME text/plain content
       html = MIME text/html content */
    let txt, html;
    if (linkfmt === "taglink") {
        txt = `<a href="${url}">${name}</a>`;
        copy2Clipboard(e, "fmt", txt);
    }
    else if (linkfmt === "tagname") {
        copy2Clipboard(e, "txt", name);
    }
    else if (linkfmt === "chat") {
        txt = `${name} ${url}`;
        html = `<a href="${url}">${name}</a>`;
        copy2Clipboard(e, "fmt", txt, html);
    }
    else if (linkfmt === "wiki") {
        txt = `[${url} ${name}]`;
        copy2Clipboard(e, "txt", txt);
    }
    // if linkfmt == "cancel", the dialog only closes
    qa(".wrangleactions-choosefmt").forEach((x) => x.remove());
}

function createIconSet() {
    const svg_lucide = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">`;
    const svg_fontawesome = (coord) => `<svg viewBox="0 0 ${coord} 512" fill="currentColor">`;
    const svg_hero = `<svg viewBox="0 0 24 24" fill="currentColor">`;
    return stored.iconset === 'lucide' ? {
        // SVGs from Lucide https://lucide.dev (Copyright (c) Cole Bemis 2013-2022 as part of Feather (MIT) and Lucide Contributors 2022 https://lucide.dev/license)
        search:         svg_lucide+`<path d="m21 21-4.34-4.34"/><circle cx="11" cy="11" r="8"/></svg>`,
        search_fan:     svg_lucide+`<path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><circle cx="12" cy="12" r="3"/><path d="m16 16-1.9-1.9"/></svg>`,
        new:            svg_lucide+`<path d="M5 12h14"/><path d="M12 5v14"/></svg>`,
        landing:        svg_lucide+`<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>`,
        edit:           svg_lucide+`<path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"/></svg>`,
        wrangle:        svg_lucide+`<path d="M11 18H3"/><path d="m15 18 2 2 4-4"/><path d="M16 12H3"/><path d="M16 6H3"/></svg>`,
        comments:       svg_lucide+`<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>`,
        comments_some:  svg_lucide+`<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/><path d="M13 9.5H7"/><path d="M17 13.5H7"/></svg>`,
        works:          svg_lucide+`<path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/></svg>`,
        bookmarks:      svg_lucide+`<path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>`,
        troubleshoot:   svg_lucide+`<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>`,
        tagcopy:        svg_lucide+`<path d="M20 7h-3a2 2 0 0 1-2-2V2"/><path d="M9 18a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h7l4 4v10a2 2 0 0 1-2 2Z"/><path d="M3 7.6v12.8A1.6 1.6 0 0 0 4.6 22h9.8"/></svg>`,
        taglink:        svg_lucide+`<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`,
        tagname:        svg_lucide+`<rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M9 12v-1h6v1"/><path d="M11 17h2"/><path d="M12 11v6"/></svg>`,
        remove:         svg_lucide+`<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>`,
        chat:           svg_lucide+`<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M8 12a2 2 0 0 0 2-2V8H8"/><path d="M14 12a2 2 0 0 0 2-2V8h-2"/></svg>`,
        wiki:           svg_lucide+`<path d="M16 3h3a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1h-3"/><path d="M8 21H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h3"/></svg>`,
        rss:            svg_lucide+`<path d="M4 11a9 9 0 0 1 9 9"/><path d="M4 4a16 16 0 0 1 16 16"/><circle cx="5" cy="19" r="1"/></svg>`,
        favorite:       svg_lucide+`<path d="M13.5 19.5 12 21l-7-7c-1.5-1.45-3-3.2-3-5.5A5.5 5.5 0 0 1 7.5 3c1.76 0 3 .5 4.5 2 1.5-1.5 2.74-2 4.5-2a5.5 5.5 0 0 1 5.402 6.5"/><path d="M15 15h6"/><path d="M18 12v6"/></svg>`,
        unfavorite:     svg_lucide+`<path d="M13.5 19.5 12 21l-7-7c-1.5-1.45-3-3.2-3-5.5A5.5 5.5 0 0 1 7.5 3c1.76 0 3 .5 4.5 2 1.5-1.5 2.74-2 4.5-2a5.5 5.5 0 0 1 5.402 6.5"/><path d="M15 15h6"/></svg>`,
        funnel:         svg_lucide+`<path d="M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z"/></svg>`,
        UnsortedTag:    svg_lucide+`<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>`,
        Fandom:         svg_lucide+`<rect width="20" height="5" x="2" y="3" rx="1"/><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/><path d="M10 12h4"/></svg>`,
        Character:      svg_lucide+`<circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></svg>`,
        Relationship:   svg_lucide+`<path d="M18 21a8 8 0 0 0-16 0"/><circle cx="10" cy="8" r="5"/><path d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3"/></svg>`,
        Freeform:       svg_lucide+`<path d="m15 5 6.3 6.3a2.4 2.4 0 0 1 0 3.4L17 19"/><path d="M9.586 5.586A2 2 0 0 0 8.172 5H3a1 1 0 0 0-1 1v5.172a2 2 0 0 0 .586 1.414L8.29 18.29a2.426 2.426 0 0 0 3.42 0l3.58-3.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="6.5" cy="9.5" r=".5" fill="currentColor"/></svg>`,
        Media:          svg_lucide+`<rect width="20" height="16" x="2" y="4" rx="2"/><path d="M2 8h20"/><circle cx="8" cy="14" r="2"/><path d="M8 12h8"/><circle cx="16" cy="14" r="2"/></svg>`,
        Rating:         svg_lucide+`<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>`,
        ArchiveWarning: svg_lucide+`<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>`,
        Category:       svg_lucide+`<path d="m11 17 2 2a1 1 0 1 0 3-3"/><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4"/><path d="m21 3 1 11h-2"/><path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3"/><path d="M3 4h8"/></svg>`
    } :
    stored.iconset === 'hero' ? {
        // SVGs from Heroicons https://heroicons.com (MIT license Copyright (c) Tailwind Labs, Inc. https://github.com/tailwindlabs/heroicons/blob/master/LICENSE)
        search:         svg_hero+`<path fill-rule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clip-rule="evenodd" /></svg>`,
        search_fan:     svg_hero+`<path d="M11.625 16.5a1.875 1.875 0 1 0 0-3.75 1.875 1.875 0 0 0 0 3.75Z" /><path fill-rule="evenodd" d="M5.625 1.5H9a3.75 3.75 0 0 1 3.75 3.75v1.875c0 1.036.84 1.875 1.875 1.875H16.5a3.75 3.75 0 0 1 3.75 3.75v7.875c0 1.035-.84 1.875-1.875 1.875H5.625a1.875 1.875 0 0 1-1.875-1.875V3.375c0-1.036.84-1.875 1.875-1.875Zm6 16.5c.66 0 1.277-.19 1.797-.518l1.048 1.048a.75.75 0 0 0 1.06-1.06l-1.047-1.048A3.375 3.375 0 1 0 11.625 18Z" clip-rule="evenodd" /><path d="M14.25 5.25a5.23 5.23 0 0 0-1.279-3.434 9.768 9.768 0 0 1 6.963 6.963A5.23 5.23 0 0 0 16.5 7.5h-1.875a.375.375 0 0 1-.375-.375V5.25Z" /></svg>`,
        new:            svg_hero+`<path fill-rule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clip-rule="evenodd" /></svg>`,
        landing:        svg_hero+`<path fill-rule="evenodd" d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clip-rule="evenodd" /></svg>`,
        edit:           svg_hero+`<path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" /><path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" /></svg>`,
        wrangle:        svg_hero+`<path fill-rule="evenodd" d="M2.625 6.75a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Zm4.875 0A.75.75 0 0 1 8.25 6h12a.75.75 0 0 1 0 1.5h-12a.75.75 0 0 1-.75-.75ZM2.625 12a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0ZM7.5 12a.75.75 0 0 1 .75-.75h12a.75.75 0 0 1 0 1.5h-12A.75.75 0 0 1 7.5 12Zm-4.875 5.25a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Zm4.875 0a.75.75 0 0 1 .75-.75h12a.75.75 0 0 1 0 1.5h-12a.75.75 0 0 1-.75-.75Z" clip-rule="evenodd" /></svg>`,
        comments:       svg_hero+`<path fill-rule="evenodd" d="M4.848 2.771A49.144 49.144 0 0 1 12 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97-1.94.284-3.916.455-5.922.505a.39.39 0 0 0-.266.112L8.78 21.53A.75.75 0 0 1 7.5 21v-3.955a48.842 48.842 0 0 1-2.652-.316c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97Z" clip-rule="evenodd" /></svg>`,
        comments_some:  svg_hero+`<path d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 0 0-1.032-.211 50.89 50.89 0 0 0-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 0 0 2.433 3.984L7.28 21.53A.75.75 0 0 1 6 21v-4.03a48.527 48.527 0 0 1-1.087-.128C2.905 16.58 1.5 14.833 1.5 12.862V6.638c0-1.97 1.405-3.718 3.413-3.979Z" /><path d="M15.75 7.5c-1.376 0-2.739.057-4.086.169C10.124 7.797 9 9.103 9 10.609v4.285c0 1.507 1.128 2.814 2.67 2.94 1.243.102 2.5.157 3.768.165l2.782 2.781a.75.75 0 0 0 1.28-.53v-2.39l.33-.026c1.542-.125 2.67-1.433 2.67-2.94v-4.286c0-1.505-1.125-2.811-2.664-2.94A49.392 49.392 0 0 0 15.75 7.5Z" /></svg>`,
        works:          svg_hero+`<path d="M11.25 4.533A9.707 9.707 0 0 0 6 3a9.735 9.735 0 0 0-3.25.555.75.75 0 0 0-.5.707v14.25a.75.75 0 0 0 1 .707A8.237 8.237 0 0 1 6 18.75c1.995 0 3.823.707 5.25 1.886V4.533ZM12.75 20.636A8.214 8.214 0 0 1 18 18.75c.966 0 1.89.166 2.75.47a.75.75 0 0 0 1-.708V4.262a.75.75 0 0 0-.5-.707A9.735 9.735 0 0 0 18 3a9.707 9.707 0 0 0-5.25 1.533v16.103Z" /></svg>`,
        bookmarks:      svg_hero+`<path fill-rule="evenodd" d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93Z" clip-rule="evenodd" /></svg>`,
        troubleshoot:   svg_hero+`<path fill-rule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clip-rule="evenodd" /></svg>`,
        tagcopy:        svg_hero+`<path d="M7.5 3.375c0-1.036.84-1.875 1.875-1.875h.375a3.75 3.75 0 0 1 3.75 3.75v1.875C13.5 8.161 14.34 9 15.375 9h1.875A3.75 3.75 0 0 1 21 12.75v3.375C21 17.16 20.16 18 19.125 18h-9.75A1.875 1.875 0 0 1 7.5 16.125V3.375Z" /><path d="M15 5.25a5.23 5.23 0 0 0-1.279-3.434 9.768 9.768 0 0 1 6.963 6.963A5.23 5.23 0 0 0 17.25 7.5h-1.875A.375.375 0 0 1 15 7.125V5.25ZM4.875 6H6v10.125A3.375 3.375 0 0 0 9.375 19.5H16.5v1.125c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 0 1 3 20.625V7.875C3 6.839 3.84 6 4.875 6Z" /></svg>`,
        taglink:        svg_hero+`<path fill-rule="evenodd" d="M19.902 4.098a3.75 3.75 0 0 0-5.304 0l-4.5 4.5a3.75 3.75 0 0 0 1.035 6.037.75.75 0 0 1-.646 1.353 5.25 5.25 0 0 1-1.449-8.45l4.5-4.5a5.25 5.25 0 1 1 7.424 7.424l-1.757 1.757a.75.75 0 1 1-1.06-1.06l1.757-1.757a3.75 3.75 0 0 0 0-5.304Zm-7.389 4.267a.75.75 0 0 1 1-.353 5.25 5.25 0 0 1 1.449 8.45l-4.5 4.5a5.25 5.25 0 1 1-7.424-7.424l1.757-1.757a.75.75 0 1 1 1.06 1.06l-1.757 1.757a3.75 3.75 0 1 0 5.304 5.304l4.5-4.5a3.75 3.75 0 0 0-1.035-6.037.75.75 0 0 1-.354-1Z" clip-rule="evenodd" /></svg>`,
        tagname:        svg_hero+`<path fill-rule="evenodd" d="M10.5 3A1.501 1.501 0 0 0 9 4.5h6A1.5 1.5 0 0 0 13.5 3h-3Zm-2.693.178A3 3 0 0 1 10.5 1.5h3a3 3 0 0 1 2.694 1.678c.497.042.992.092 1.486.15 1.497.173 2.57 1.46 2.57 2.929V19.5a3 3 0 0 1-3 3H6.75a3 3 0 0 1-3-3V6.257c0-1.47 1.073-2.756 2.57-2.93.493-.057.989-.107 1.487-.15Z" clip-rule="evenodd" /></svg>`,
        remove:         svg_hero+`<path fill-rule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clip-rule="evenodd" /></svg>`,
        chat:           svg_hero+`<path fill-rule="evenodd" d="M12 2.25c-2.429 0-4.817.178-7.152.521C2.87 3.061 1.5 4.795 1.5 6.741v6.018c0 1.946 1.37 3.68 3.348 3.97.877.129 1.761.234 2.652.316V21a.75.75 0 0 0 1.28.53l4.184-4.183a.39.39 0 0 1 .266-.112c2.006-.05 3.982-.22 5.922-.506 1.978-.29 3.348-2.023 3.348-3.97V6.741c0-1.947-1.37-3.68-3.348-3.97A49.145 49.145 0 0 0 12 2.25ZM8.25 8.625a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25Zm2.625 1.125a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Zm4.875-1.125a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25Z" clip-rule="evenodd" /></svg>`,
        wiki:           svg_hero+`<path fill-rule="evenodd" d="M4.125 3C3.089 3 2.25 3.84 2.25 4.875V18a3 3 0 0 0 3 3h15a3 3 0 0 1-3-3V4.875C17.25 3.839 16.41 3 15.375 3H4.125ZM12 9.75a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5H12Zm-.75-2.25a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5H12a.75.75 0 0 1-.75-.75ZM6 12.75a.75.75 0 0 0 0 1.5h7.5a.75.75 0 0 0 0-1.5H6Zm-.75 3.75a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5H6a.75.75 0 0 1-.75-.75ZM6 6.75a.75.75 0 0 0-.75.75v3c0 .414.336.75.75.75h3a.75.75 0 0 0 .75-.75v-3A.75.75 0 0 0 9 6.75H6Z" clip-rule="evenodd" /><path d="M18.75 6.75h1.875c.621 0 1.125.504 1.125 1.125V18a1.5 1.5 0 0 1-3 0V6.75Z" /></svg>`,
        rss:            svg_hero+`<path fill-rule="evenodd" d="M3.75 4.5a.75.75 0 0 1 .75-.75h.75c8.284 0 15 6.716 15 15v.75a.75.75 0 0 1-.75.75h-.75a.75.75 0 0 1-.75-.75v-.75C18 11.708 12.292 6 5.25 6H4.5a.75.75 0 0 1-.75-.75V4.5Zm0 6.75a.75.75 0 0 1 .75-.75h.75a8.25 8.25 0 0 1 8.25 8.25v.75a.75.75 0 0 1-.75.75H12a.75.75 0 0 1-.75-.75v-.75a6 6 0 0 0-6-6H4.5a.75.75 0 0 1-.75-.75v-.75Zm0 7.5a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z" clip-rule="evenodd" /></svg>`,
        favorite:       `<svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" /></svg>`,
        unfavorite:     svg_hero+`<path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" /></svg>`,
        funnel:         svg_hero+`<path fill-rule="evenodd" d="M3.792 2.938A49.069 49.069 0 0 1 12 2.25c2.797 0 5.54.236 8.209.688a1.857 1.857 0 0 1 1.541 1.836v1.044a3 3 0 0 1-.879 2.121l-6.182 6.182a1.5 1.5 0 0 0-.439 1.061v2.927a3 3 0 0 1-1.658 2.684l-1.757.878A.75.75 0 0 1 9.75 21v-5.818a1.5 1.5 0 0 0-.44-1.06L3.13 7.938a3 3 0 0 1-.879-2.121V4.774c0-.897.64-1.683 1.542-1.836Z" clip-rule="evenodd" /></svg>`,
        UnsortedTag:    svg_hero+`<path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm11.378-3.917c-.89-.777-2.366-.777-3.255 0a.75.75 0 0 1-.988-1.129c1.454-1.272 3.776-1.272 5.23 0 1.513 1.324 1.513 3.518 0 4.842a3.75 3.75 0 0 1-.837.552c-.676.328-1.028.774-1.028 1.152v.75a.75.75 0 0 1-1.5 0v-.75c0-1.279 1.06-2.107 1.875-2.502.182-.088.351-.199.503-.331.83-.727.83-1.857 0-2.584ZM12 18a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clip-rule="evenodd" /></svg>`,
        Fandom:         svg_hero+`<path d="M3.375 3C2.339 3 1.5 3.84 1.5 4.875v.75c0 1.036.84 1.875 1.875 1.875h17.25c1.035 0 1.875-.84 1.875-1.875v-.75C22.5 3.839 21.66 3 20.625 3H3.375Z" /><path fill-rule="evenodd" d="m3.087 9 .54 9.176A3 3 0 0 0 6.62 21h10.757a3 3 0 0 0 2.995-2.824L20.913 9H3.087Zm6.163 3.75A.75.75 0 0 1 10 12h4a.75.75 0 0 1 0 1.5h-4a.75.75 0 0 1-.75-.75Z" clip-rule="evenodd" /></svg>`,
        Character:      svg_hero+`<path fill-rule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clip-rule="evenodd" /></svg>`,
        Relationship:   svg_hero+`<path fill-rule="evenodd" d="M8.25 6.75a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0ZM15.75 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM2.25 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM6.31 15.117A6.745 6.745 0 0 1 12 12a6.745 6.745 0 0 1 6.709 7.498.75.75 0 0 1-.372.568A12.696 12.696 0 0 1 12 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 0 1-.372-.568 6.787 6.787 0 0 1 1.019-4.38Z" clip-rule="evenodd" /><path d="M5.082 14.254a8.287 8.287 0 0 0-1.308 5.135 9.687 9.687 0 0 1-1.764-.44l-.115-.04a.563.563 0 0 1-.373-.487l-.01-.121a3.75 3.75 0 0 1 3.57-4.047ZM20.226 19.389a8.287 8.287 0 0 0-1.308-5.135 3.75 3.75 0 0 1 3.57 4.047l-.01.121a.563.563 0 0 1-.373.486l-.115.04c-.567.2-1.156.349-1.764.441Z" /></svg>`,
        Freeform:       svg_hero+`<path fill-rule="evenodd" d="M5.25 2.25a3 3 0 0 0-3 3v4.318a3 3 0 0 0 .879 2.121l9.58 9.581c.92.92 2.39 1.186 3.548.428a18.849 18.849 0 0 0 5.441-5.44c.758-1.16.492-2.629-.428-3.548l-9.58-9.581a3 3 0 0 0-2.122-.879H5.25ZM6.375 7.5a1.125 1.125 0 1 0 0-2.25 1.125 1.125 0 0 0 0 2.25Z" clip-rule="evenodd" /></svg>`,
        Media:          svg_hero+`<path fill-rule="evenodd" d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z" clip-rule="evenodd" /></svg>`,
        Rating:         svg_hero+`<path fill-rule="evenodd" d="M12.963 2.286a.75.75 0 0 0-1.071-.136 9.742 9.742 0 0 0-3.539 6.176 7.547 7.547 0 0 1-1.705-1.715.75.75 0 0 0-1.152-.082A9 9 0 1 0 15.68 4.534a7.46 7.46 0 0 1-2.717-2.248ZM15.75 14.25a3.75 3.75 0 1 1-7.313-1.172c.628.465 1.35.81 2.133 1a5.99 5.99 0 0 1 1.925-3.546 3.75 3.75 0 0 1 3.255 3.718Z" clip-rule="evenodd" /></svg>`,
        ArchiveWarning: svg_hero+`<path fill-rule="evenodd" d="M11.484 2.17a.75.75 0 0 1 1.032 0 11.209 11.209 0 0 0 7.877 3.08.75.75 0 0 1 .722.515 12.74 12.74 0 0 1 .635 3.985c0 5.942-4.064 10.933-9.563 12.348a.749.749 0 0 1-.374 0C6.314 20.683 2.25 15.692 2.25 9.75c0-1.39.223-2.73.635-3.985a.75.75 0 0 1 .722-.516l.143.001c2.996 0 5.718-1.17 7.734-3.08ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75ZM12 15a.75.75 0 0 0-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 0 0 .75-.75v-.008a.75.75 0 0 0-.75-.75H12Z" clip-rule="evenodd" /></svg>`,
        Category:       svg_hero+`<path fill-rule="evenodd" d="M5.636 4.575a.75.75 0 0 1 0 1.061 9 9 0 0 0 0 12.728.75.75 0 1 1-1.06 1.06c-4.101-4.1-4.101-10.748 0-14.849a.75.75 0 0 1 1.06 0Zm12.728 0a.75.75 0 0 1 1.06 0c4.101 4.1 4.101 10.75 0 14.85a.75.75 0 1 1-1.06-1.061 9 9 0 0 0 0-12.728.75.75 0 0 1 0-1.06ZM7.757 6.697a.75.75 0 0 1 0 1.06 6 6 0 0 0 0 8.486.75.75 0 0 1-1.06 1.06 7.5 7.5 0 0 1 0-10.606.75.75 0 0 1 1.06 0Zm8.486 0a.75.75 0 0 1 1.06 0 7.5 7.5 0 0 1 0 10.606.75.75 0 0 1-1.06-1.06 6 6 0 0 0 0-8.486.75.75 0 0 1 0-1.06ZM9.879 8.818a.75.75 0 0 1 0 1.06 3 3 0 0 0 0 4.243.75.75 0 1 1-1.061 1.061 4.5 4.5 0 0 1 0-6.364.75.75 0 0 1 1.06 0Zm4.242 0a.75.75 0 0 1 1.061 0 4.5 4.5 0 0 1 0 6.364.75.75 0 0 1-1.06-1.06 3 3 0 0 0 0-4.243.75.75 0 0 1 0-1.061ZM10.875 12a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z" clip-rule="evenodd" /></svg>`
    } :
    {
        // SVGs from Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.
        search:         svg_fontawesome("512")+`<path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/></svg>`,
        search_fan:     svg_fontawesome("512")+`<path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM184 296c0 13.3 10.7 24 24 24s24-10.7 24-24l0-64 64 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-64 0 0-64c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 64-64 0c-13.3 0-24 10.7-24 24s10.7 24 24 24l64 0 0 64z"/></svg>`,
        new:            svg_fontawesome("448")+`<path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z"/></svg>`,
        landing:        svg_fontawesome("384")+`<path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"/></svg>`,
        edit:           svg_fontawesome("512")+`<path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160L0 416c0 53 43 96 96 96l256 0c53 0 96-43 96-96l0-96c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 96c0 17.7-14.3 32-32 32L96 448c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 64z"/></svg>`,
        wrangle:        svg_fontawesome("512")+`<path d="M152.1 38.2c9.9 8.9 10.7 24 1.8 33.9l-72 80c-4.4 4.9-10.6 7.8-17.2 7.9s-12.9-2.4-17.6-7L7 113C-2.3 103.6-2.3 88.4 7 79s24.6-9.4 33.9 0l22.1 22.1 55.1-61.2c8.9-9.9 24-10.7 33.9-1.8zm0 160c9.9 8.9 10.7 24 1.8 33.9l-72 80c-4.4 4.9-10.6 7.8-17.2 7.9s-12.9-2.4-17.6-7L7 273c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l22.1 22.1 55.1-61.2c8.9-9.9 24-10.7 33.9-1.8zM224 96c0-17.7 14.3-32 32-32l224 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-224 0c-17.7 0-32-14.3-32-32zm0 160c0-17.7 14.3-32 32-32l224 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-224 0c-17.7 0-32-14.3-32-32zM160 416c0-17.7 14.3-32 32-32l288 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-288 0c-17.7 0-32-14.3-32-32zM48 368a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"/></svg>`,
        comments:       svg_fontawesome("512")+`<path d="M512 240c0 114.9-114.6 208-256 208c-37.1 0-72.3-6.4-104.1-17.9c-11.9 8.7-31.3 20.6-54.3 30.6C73.6 471.1 44.7 480 16 480c-6.5 0-12.3-3.9-14.8-9.9c-2.5-6-1.1-12.8 3.4-17.4c0 0 0 0 0 0s0 0 0 0s0 0 0 0c0 0 0 0 0 0l.3-.3c.3-.3 .7-.7 1.3-1.4c1.1-1.2 2.8-3.1 4.9-5.7c4.1-5 9.6-12.4 15.2-21.6c10-16.6 19.5-38.4 21.4-62.9C17.7 326.8 0 285.1 0 240C0 125.1 114.6 32 256 32s256 93.1 256 208z"/></svg>`,
        comments_some:  svg_fontawesome("640")+`<path d="M208 352c114.9 0 208-78.8 208-176S322.9 0 208 0S0 78.8 0 176c0 38.6 14.7 74.3 39.6 103.4c-3.5 9.4-8.7 17.7-14.2 24.7c-4.8 6.2-9.7 11-13.3 14.3c-1.8 1.6-3.3 2.9-4.3 3.7c-.5 .4-.9 .7-1.1 .8l-.2 .2s0 0 0 0s0 0 0 0C1 327.2-1.4 334.4 .8 340.9S9.1 352 16 352c21.8 0 43.8-5.6 62.1-12.5c9.2-3.5 17.8-7.4 25.2-11.4C134.1 343.3 169.8 352 208 352zM448 176c0 112.3-99.1 196.9-216.5 207C255.8 457.4 336.4 512 432 512c38.2 0 73.9-8.7 104.7-23.9c7.5 4 16 7.9 25.2 11.4c18.3 6.9 40.3 12.5 62.1 12.5c6.9 0 13.1-4.5 15.2-11.1c2.1-6.6-.2-13.8-5.8-17.9c0 0 0 0 0 0s0 0 0 0l-.2-.2c-.2-.2-.6-.4-1.1-.8c-1-.8-2.5-2-4.3-3.7c-3.6-3.3-8.5-8.1-13.3-14.3c-5.5-7-10.7-15.4-14.2-24.7c24.9-29 39.6-64.7 39.6-103.4c0-92.8-84.9-168.9-192.6-175.5c.4 5.1 .6 10.3 .6 15.5z"/></svg>`,
        works:          svg_fontawesome("448")+`<path d="M96 0C43 0 0 43 0 96L0 416c0 53 43 96 96 96l288 0 32 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l0-64c17.7 0 32-14.3 32-32l0-320c0-17.7-14.3-32-32-32L384 0 96 0zm0 384l256 0 0 64L96 448c-17.7 0-32-14.3-32-32s14.3-32 32-32zm32-240c0-8.8 7.2-16 16-16l192 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-192 0c-8.8 0-16-7.2-16-16zm16 48l192 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-192 0c-8.8 0-16-7.2-16-16s7.2-16 16-16z"/></svg>`,
        bookmarks:      svg_fontawesome("384")+`<path d="M0 48V487.7C0 501.1 10.9 512 24.3 512c5 0 9.9-1.5 14-4.4L192 400 345.7 507.6c4.1 2.9 9 4.4 14 4.4c13.4 0 24.3-10.9 24.3-24.3V48c0-26.5-21.5-48-48-48H48C21.5 0 0 21.5 0 48z"/></svg>`,
        troubleshoot:   svg_fontawesome("512")+`<path d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480L40 480c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24l0 112c0 13.3 10.7 24 24 24s24-10.7 24-24l0-112c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"/></svg>`,
        tagcopy:        svg_fontawesome("448")+`<path d="M208 0L332.1 0c12.7 0 24.9 5.1 33.9 14.1l67.9 67.9c9 9 14.1 21.2 14.1 33.9L448 336c0 26.5-21.5 48-48 48l-192 0c-26.5 0-48-21.5-48-48l0-288c0-26.5 21.5-48 48-48zM48 128l80 0 0 64-64 0 0 256 192 0 0-32 64 0 0 48c0 26.5-21.5 48-48 48L48 512c-26.5 0-48-21.5-48-48L0 176c0-26.5 21.5-48 48-48z"/></svg>`,
        taglink:        svg_fontawesome("640")+`<path d="M579.8 267.7c56.5-56.5 56.5-148 0-204.5c-50-50-128.8-56.5-186.3-15.4l-1.6 1.1c-14.4 10.3-17.7 30.3-7.4 44.6s30.3 17.7 44.6 7.4l1.6-1.1c32.1-22.9 76-19.3 103.8 8.6c31.5 31.5 31.5 82.5 0 114L422.3 334.8c-31.5 31.5-82.5 31.5-114 0c-27.9-27.9-31.5-71.8-8.6-103.8l1.1-1.6c10.3-14.4 6.9-34.4-7.4-44.6s-34.4-6.9-44.6 7.4l-1.1 1.6C206.5 251.2 213 330 263 380c56.5 56.5 148 56.5 204.5 0L579.8 267.7zM60.2 244.3c-56.5 56.5-56.5 148 0 204.5c50 50 128.8 56.5 186.3 15.4l1.6-1.1c14.4-10.3 17.7-30.3 7.4-44.6s-30.3-17.7-44.6-7.4l-1.6 1.1c-32.1 22.9-76 19.3-103.8-8.6C74 372 74 321 105.5 289.5L217.7 177.2c31.5-31.5 82.5-31.5 114 0c27.9 27.9 31.5 71.8 8.6 103.9l-1.1 1.6c-10.3 14.4-6.9 34.4 7.4 44.6s34.4 6.9 44.6-7.4l1.1-1.6C433.5 260.8 427 182 377 132c-56.5-56.5-148-56.5-204.5 0L60.2 244.3z"/></svg>`,
        tagname:        svg_fontawesome("384")+`<path d="M280 64l40 0c35.3 0 64 28.7 64 64l0 320c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 128C0 92.7 28.7 64 64 64l40 0 9.6 0C121 27.5 153.3 0 192 0s71 27.5 78.4 64l9.6 0zM64 112c-8.8 0-16 7.2-16 16l0 320c0 8.8 7.2 16 16 16l256 0c8.8 0 16-7.2 16-16l0-320c0-8.8-7.2-16-16-16l-16 0 0 24c0 13.3-10.7 24-24 24l-88 0-88 0c-13.3 0-24-10.7-24-24l0-24-16 0zm128-8a24 24 0 1 0 0-48 24 24 0 1 0 0 48z"/></svg>`,
        remove:         svg_fontawesome("448")+`<path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0L284.2 0c12.1 0 23.2 6.8 28.6 17.7L320 32l96 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 96C14.3 96 0 81.7 0 64S14.3 32 32 32l96 0 7.2-14.3zM32 128l384 0 0 320c0 35.3-28.7 64-64 64L96 512c-35.3 0-64-28.7-64-64l0-320zm96 64c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16z"/></svg>`,
        chat:           svg_fontawesome("512")+`<path d="M160 368c26.5 0 48 21.5 48 48l0 16 72.5-54.4c8.3-6.2 18.4-9.6 28.8-9.6L448 368c8.8 0 16-7.2 16-16l0-288c0-8.8-7.2-16-16-16L64 48c-8.8 0-16 7.2-16 16l0 288c0 8.8 7.2 16 16 16l96 0zm48 124l-.2 .2-5.1 3.8-17.1 12.8c-4.8 3.6-11.3 4.2-16.8 1.5s-8.8-8.2-8.8-14.3l0-21.3 0-6.4 0-.3 0-4 0-48-48 0-48 0c-35.3 0-64-28.7-64-64L0 64C0 28.7 28.7 0 64 0L448 0c35.3 0 64 28.7 64 64l0 288c0 35.3-28.7 64-64 64l-138.7 0L208 492z"/></svg>`,
        wiki:           svg_fontawesome("512")+`<path d="M96 96c0-35.3 28.7-64 64-64l288 0c35.3 0 64 28.7 64 64l0 320c0 35.3-28.7 64-64 64L80 480c-44.2 0-80-35.8-80-80L0 128c0-17.7 14.3-32 32-32s32 14.3 32 32l0 272c0 8.8 7.2 16 16 16s16-7.2 16-16L96 96zm64 24l0 80c0 13.3 10.7 24 24 24l112 0c13.3 0 24-10.7 24-24l0-80c0-13.3-10.7-24-24-24L184 96c-13.3 0-24 10.7-24 24zm208-8c0 8.8 7.2 16 16 16l48 0c8.8 0 16-7.2 16-16s-7.2-16-16-16l-48 0c-8.8 0-16 7.2-16 16zm0 96c0 8.8 7.2 16 16 16l48 0c8.8 0 16-7.2 16-16s-7.2-16-16-16l-48 0c-8.8 0-16 7.2-16 16zM160 304c0 8.8 7.2 16 16 16l256 0c8.8 0 16-7.2 16-16s-7.2-16-16-16l-256 0c-8.8 0-16 7.2-16 16zm0 96c0 8.8 7.2 16 16 16l256 0c8.8 0 16-7.2 16-16s-7.2-16-16-16l-256 0c-8.8 0-16 7.2-16 16z"/></svg>`,
        rss:            svg_fontawesome("448")+`<path d="M64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64L64 32zM96 136c0-13.3 10.7-24 24-24c137 0 248 111 248 248c0 13.3-10.7 24-24 24s-24-10.7-24-24c0-110.5-89.5-200-200-200c-13.3 0-24-10.7-24-24zm0 96c0-13.3 10.7-24 24-24c83.9 0 152 68.1 152 152c0 13.3-10.7 24-24 24s-24-10.7-24-24c0-57.4-46.6-104-104-104c-13.3 0-24-10.7-24-24zm0 120a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/></svg>`,
        favorite:       svg_fontawesome("576")+`<path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9l2.6-2.4C267.2 438.6 256 404.6 256 368c0-97.2 78.8-176 176-176c28.3 0 55 6.7 78.7 18.5c.9-6.5 1.3-13 1.3-19.6l0-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1l0 5.8c0 41.5 17.2 81.2 47.6 109.5zM432 512a144 144 0 1 0 0-288 144 144 0 1 0 0 288zm16-208l0 48 48 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-48 0 0 48c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-48-48 0c-8.8 0-16-7.2-16-16s7.2-16 16-16l48 0 0-48c0-8.8 7.2-16 16-16s16 7.2 16 16z"/></svg>`,
        unfavorite:     svg_fontawesome("576")+`<path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9l2.6-2.4C267.2 438.6 256 404.6 256 368c0-97.2 78.8-176 176-176c28.3 0 55 6.7 78.7 18.5c.9-6.5 1.3-13 1.3-19.6l0-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1l0 5.8c0 41.5 17.2 81.2 47.6 109.5zM576 368a144 144 0 1 0 -288 0 144 144 0 1 0 288 0zm-64 0c0 8.8-7.2 16-16 16l-128 0c-8.8 0-16-7.2-16-16s7.2-16 16-16l128 0c8.8 0 16 7.2 16 16z"/></svg>`,
        funnel:         svg_fontawesome("512")+`<path d="M3.9 54.9C10.5 40.9 24.5 32 40 32l432 0c15.5 0 29.5 8.9 36.1 22.9s4.6 30.5-5.2 42.5L320 320.9 320 448c0 12.1-6.8 23.2-17.7 28.6s-23.8 4.3-33.5-3l-64-48c-8.1-6-12.8-15.5-12.8-25.6l0-79.1L9 97.3C-.7 85.4-2.8 68.8 3.9 54.9z"/></svg>`,
        UnsortedTag:    svg_fontawesome("320")+`<path d="M80 160c0-35.3 28.7-64 64-64l32 0c35.3 0 64 28.7 64 64l0 3.6c0 21.8-11.1 42.1-29.4 53.8l-42.2 27.1c-25.2 16.2-40.4 44.1-40.4 74l0 1.4c0 17.7 14.3 32 32 32s32-14.3 32-32l0-1.4c0-8.2 4.2-15.8 11-20.2l42.2-27.1c36.6-23.6 58.8-64.1 58.8-107.7l0-3.6c0-70.7-57.3-128-128-128l-32 0C73.3 32 16 89.3 16 160c0 17.7 14.3 32 32 32s32-14.3 32-32zm80 320a40 40 0 1 0 0-80 40 40 0 1 0 0 80z"/></svg>`,
        Fandom:         svg_fontawesome("512")+`<path d="M32 32l448 0c17.7 0 32 14.3 32 32l0 32c0 17.7-14.3 32-32 32L32 128C14.3 128 0 113.7 0 96L0 64C0 46.3 14.3 32 32 32zm0 128l448 0 0 256c0 35.3-28.7 64-64 64L96 480c-35.3 0-64-28.7-64-64l0-256zm128 80c0 8.8 7.2 16 16 16l160 0c8.8 0 16-7.2 16-16s-7.2-16-16-16l-160 0c-8.8 0-16 7.2-16 16z"/></svg>`,
        Character:      svg_fontawesome("448")+`<path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512l388.6 0c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304l-91.4 0z"/></svg>`,
        Relationship:   svg_fontawesome("640")+`<path d="M144 0a80 80 0 1 1 0 160A80 80 0 1 1 144 0zM512 0a80 80 0 1 1 0 160A80 80 0 1 1 512 0zM0 298.7C0 239.8 47.8 192 106.7 192l42.7 0c15.9 0 31 3.5 44.6 9.7c-1.3 7.2-1.9 14.7-1.9 22.3c0 38.2 16.8 72.5 43.3 96c-.2 0-.4 0-.7 0L21.3 320C9.6 320 0 310.4 0 298.7zM405.3 320c-.2 0-.4 0-.7 0c26.6-23.5 43.3-57.8 43.3-96c0-7.6-.7-15-1.9-22.3c13.6-6.3 28.7-9.7 44.6-9.7l42.7 0C592.2 192 640 239.8 640 298.7c0 11.8-9.6 21.3-21.3 21.3l-213.3 0zM224 224a96 96 0 1 1 192 0 96 96 0 1 1 -192 0zM128 485.3C128 411.7 187.7 352 261.3 352l117.3 0C452.3 352 512 411.7 512 485.3c0 14.7-11.9 26.7-26.7 26.7l-330.7 0c-14.7 0-26.7-11.9-26.7-26.7z"/></svg>`,
        Freeform:       svg_fontawesome("512")+`<path d="M345 39.1L472.8 168.4c52.4 53 52.4 138.2 0 191.2L360.8 472.9c-9.3 9.4-24.5 9.5-33.9 .2s-9.5-24.5-.2-33.9L438.6 325.9c33.9-34.3 33.9-89.4 0-123.7L310.9 72.9c-9.3-9.4-9.2-24.6 .2-33.9s24.6-9.2 33.9 .2zM0 229.5L0 80C0 53.5 21.5 32 48 32l149.5 0c17 0 33.3 6.7 45.3 18.7l168 168c25 25 25 65.5 0 90.5L277.3 442.7c-25 25-65.5 25-90.5 0l-168-168C6.7 262.7 0 246.5 0 229.5zM144 144a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"/></svg>`,
        Media:          svg_fontawesome("640")+`<path d="M256 0L576 0c35.3 0 64 28.7 64 64l0 224c0 35.3-28.7 64-64 64l-320 0c-35.3 0-64-28.7-64-64l0-224c0-35.3 28.7-64 64-64zM476 106.7C471.5 100 464 96 456 96s-15.5 4-20 10.7l-56 84L362.7 169c-4.6-5.7-11.5-9-18.7-9s-14.2 3.3-18.7 9l-64 80c-5.8 7.2-6.9 17.1-2.9 25.4s12.4 13.6 21.6 13.6l80 0 48 0 144 0c8.9 0 17-4.9 21.2-12.7s3.7-17.3-1.2-24.6l-96-144zM336 96a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zM64 128l96 0 0 256 0 32c0 17.7 14.3 32 32 32l128 0c17.7 0 32-14.3 32-32l0-32 160 0 0 64c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 192c0-35.3 28.7-64 64-64zm8 64c-8.8 0-16 7.2-16 16l0 16c0 8.8 7.2 16 16 16l16 0c8.8 0 16-7.2 16-16l0-16c0-8.8-7.2-16-16-16l-16 0zm0 104c-8.8 0-16 7.2-16 16l0 16c0 8.8 7.2 16 16 16l16 0c8.8 0 16-7.2 16-16l0-16c0-8.8-7.2-16-16-16l-16 0zm0 104c-8.8 0-16 7.2-16 16l0 16c0 8.8 7.2 16 16 16l16 0c8.8 0 16-7.2 16-16l0-16c0-8.8-7.2-16-16-16l-16 0zm336 16l0 16c0 8.8 7.2 16 16 16l16 0c8.8 0 16-7.2 16-16l0-16c0-8.8-7.2-16-16-16l-16 0c-8.8 0-16 7.2-16 16z"/></svg>`,
        Rating:         svg_fontawesome("448")+`<path d="M159.3 5.4c7.8-7.3 19.9-7.2 27.7 .1c27.6 25.9 53.5 53.8 77.7 84c11-14.4 23.5-30.1 37-42.9c7.9-7.4 20.1-7.4 28 .1c34.6 33 63.9 76.6 84.5 118c20.3 40.8 33.8 82.5 33.8 111.9C448 404.2 348.2 512 224 512C98.4 512 0 404.1 0 276.5c0-38.4 17.8-85.3 45.4-131.7C73.3 97.7 112.7 48.6 159.3 5.4zM225.7 416c25.3 0 47.7-7 68.8-21c42.1-29.4 53.4-88.2 28.1-134.4c-4.5-9-16-9.6-22.5-2l-25.2 29.3c-6.6 7.6-18.5 7.4-24.7-.5c-16.5-21-46-58.5-62.8-79.8c-6.3-8-18.3-8.1-24.7-.1c-33.8 42.5-50.8 69.3-50.8 99.4C112 375.4 162.6 416 225.7 416z"/></svg>`,
        ArchiveWarning: svg_fontawesome("512")+`<path d="M256 0c4.6 0 9.2 1 13.4 2.9L457.7 82.8c22 9.3 38.4 31 38.3 57.2c-.5 99.2-41.3 280.7-213.6 363.2c-16.7 8-36.1 8-52.8 0C57.3 420.7 16.5 239.2 16 140c-.1-26.2 16.3-47.9 38.3-57.2L242.7 2.9C246.8 1 251.4 0 256 0zm0 66.8l0 378.1C394 378 431.1 230.1 432 141.4L256 66.8s0 0 0 0z"/></svg>`,
        Category:       svg_fontawesome("640")+`<path d="M323.4 85.2l-96.8 78.4c-16.1 13-19.2 36.4-7 53.1c12.9 17.8 38 21.3 55.3 7.8l99.3-77.2c7-5.4 17-4.2 22.5 2.8s4.2 17-2.8 22.5l-20.9 16.2L512 316.8 512 128l-.7 0-3.9-2.5L434.8 79c-15.3-9.8-33.2-15-51.4-15c-21.8 0-43 7.5-60 21.2zm22.8 124.4l-51.7 40.2C263 274.4 217.3 268 193.7 235.6c-22.2-30.5-16.6-73.1 12.7-96.8l83.2-67.3c-11.6-4.9-24.1-7.4-36.8-7.4C234 64 215.7 69.6 200 80l-72 48 0 224 28.2 0 91.4 83.4c19.6 17.9 49.9 16.5 67.8-3.1c5.5-6.1 9.2-13.2 11.1-20.6l17 15.6c19.5 17.9 49.9 16.6 67.8-2.9c4.5-4.9 7.8-10.6 9.9-16.5c19.4 13 45.8 10.3 62.1-7.5c17.9-19.5 16.6-49.9-2.9-67.8l-134.2-123zM16 128c-8.8 0-16 7.2-16 16L0 352c0 17.7 14.3 32 32 32l32 0c17.7 0 32-14.3 32-32l0-224-80 0zM48 320a16 16 0 1 1 0 32 16 16 0 1 1 0-32zM544 128l0 224c0 17.7 14.3 32 32 32l32 0c17.7 0 32-14.3 32-32l0-208c0-8.8-7.2-16-16-16l-80 0zm32 208a16 16 0 1 1 32 0 16 16 0 1 1 -32 0z"/></svg>`,
    };
}

function createButtons() {
    return {
        search:         { link: "/tags/search",
                          text: "Search",
                          tooltip: "Search tags",
                          pages: ["top"] },
        search_fan:     { link: "/tags/search?",
                          text: "Search this Fandom",
                          tooltip: "Search this Fandom",
                          pages: ["top"] },
        new:            { link: "/tags/new",
                          text: "New Tag",
                          tooltip: "Create new tag",
                          pages: ["top"] },
        landing:        { link: "X",
                          text: "Landing Page",
                          tooltip: "Tag Landing Page",
                          pages: ["top", "bin", "inbox", "search"] },
        edit:           { link: "X/edit",
                          text: "Edit",
                          tooltip: "Edit tag & associations",
                          pages: ["top", "bin", "inbox", "search"] },
        wrangle:        { link: "X/wrangle?page=1&show=mergers", // since the plain /wrangle page is empty, we might as well go straight to the Syns bin
                          text: "Wrangle",
                          tooltip: "Wrangle all child tags",
                          pages: ["top", "bin", "inbox", "search"] },
        comments:       { link: "X/comments",
                          text: "Comments",
                          tooltip: "Comments", // this tooltip is overwritten by "Last comment: DATE" when there's a comment
                          pages: ["top", "bin", "inbox", "search"] },
        works:          { link: "X/works",
                          text: "Works",
                          tooltip: "Works",
                          pages: ["top", "bin", "inbox", "search"] },
        bookmarks:      { link: "X/bookmarks",
                          text: "Bookmarks",
                          tooltip: "Bookmarks",
                          pages: ["top", "bin", "inbox", "search"] },
        troubleshoot:   { link: "X/troubleshooting",
                          text: "Troubleshooting",
                          tooltip: "Troubleshooting",
                          pages: ["top"] },
        tagcopy:        { link: "#",
                          text: "Copy Misc",
                          tooltip: "Copy tag to clipboard in various formats",
                          pages: ["top", "bin", "inbox", "search"] },
        taglink:        { link: "#",
                          text: "Copy Link",
                          tooltip: "Copy tag as Link to clipboard",
                          pages: ["top", "bin", "inbox", "search"] },
        tagname:        { link: "#" ,
                          text: "Copy Name",
                          tooltip: "Copy tag as Text to clipboard",
                          pages: ["top", "bin", "inbox", "search"] },
        remove:         { link: "",
                          text: "Remove",
                          tooltip: "Remove from fandom",
                          pages: ["bin"] },
        // here start the items that aren't regular wrangling action buttons
        chat:           { text: "Chat",
                          tooltip: "Copy tag as Link for OTW Chat" },
        wiki:           { text: "Wiki",
                          tooltip: "Copy tag as Link for OTW Wiki" },
        UnsortedTag:    { text: "?",
                          tooltip: "Unsorted tag" },
        Fandom:         { text: "F",
                          tooltip: "Fandom tag" },
        Character:      { text: "Char",
                          tooltip: "Character tag" },
        Relationship:   { text: "Rel",
                          tooltip: "Relationship tag" },
        Freeform:       { text: "FF",
                          tooltip: "Additional tag" },
        Media:          { text: "Media",
                          tooltip: "Media" },
        Rating:         { text: "Rating",
                          tooltip: "Rating" },
        ArchiveWarning: { text: "Warn",
                          tooltip: "Archive Warning" },
        Category:       { text: "Cat",
                          tooltip: "Category" },
        favorite:       { tooltip: "Add tag to Favorites" },
        unfavorite:     { tooltip: "Remove tag from Favorites" },
        funnel:         { tooltip: "Open Filters sidebar" },
    }
}