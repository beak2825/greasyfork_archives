// ==UserScript==
// @name         AO3: [Wrangling] Mark Illegal Characters in Canonicals
// @namespace    https://greasyfork.org/en/users/906106-escctrl
// @version      3.0
// @description  Warns about any canonical tag that includes characters which should, per guidelines, be avoided. Checks on new tag, edit tag, search results, wrangle bins, and tag landing pages
// @author       escctrl
// @match        *://*.archiveofourown.org/tags/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/472005/AO3%3A%20%5BWrangling%5D%20Mark%20Illegal%20Characters%20in%20Canonicals.user.js
// @updateURL https://update.greasyfork.org/scripts/472005/AO3%3A%20%5BWrangling%5D%20Mark%20Illegal%20Characters%20in%20Canonicals.meta.js
// ==/UserScript==

/* eslint-disable no-multi-spaces */
'use strict';

// utility to reduce verboseness
const q = (s, n=document) => n.querySelector(s);
const qa = (s, n=document) => n.querySelectorAll(s);
const ins = (n, l, html) => n.insertAdjacentHTML(l, html);

// stop on retry later or styled Error pages
if ( (q('#main') === null) || (q('#main.system.errors') !== null) ) return;

ins(q("head"), 'beforeend', `<style tyle="text/css">
    .illegalChars svg { width: 1em; height: 1em; display: inline-block; vertical-align: -0.15em; }
    .illegalCharsInline { display: inline-block; padding: 0 !important; margin: 0.1em 0.1em 0.1em 0.5em !important; }
    .illegalCharsInline p { padding: 0.1em 0.3em; fontWeight: normal; }
</style>`);

// on every page the way to find the tags to check is slightly different
let main = q('#main');
if (main.classList.contains('tags-wrangle')) checkBinTags();
else if (main.classList.contains('tags-edit') || main.classList.contains('tags-update')) checkEditTag(); // .tags-update after a Save failed
else if (main.classList.contains('tags-show')) checkTag();
else if (main.classList.contains('tags-search')) checkSearchResults();
else if (main.classList.contains('tags-new')) checkAsYouType();
 
// *************** GENERAL FUNCTIONS ***************

// a holistic function to check what's not allowed
// running as separate matches because regex alternation can't flag multiple issues on same letter
function hasIllegalChars(string, is_fandom, refNode, befNode = null, inline = false) {
    let testing = { // includes the regex to check (r) and the error message to log (l)
        letter:     { r: /[^\p{Script=Latin}0-9 \-().&/'"|:!#_]/ }, // non-latin (including accented) characters and special chars (with a few exceptions)
        multiap:    { r: /'{2,}/, l: "two ' instead of \"" },       // two apostrophes '' used instead of a quote "
        slash1:     { r: / \//,   l: "space before /" },            // a slash with spaces before or after
        slash2:     { r: /\/ /,   l: "space after /" },
        amp1:       { r: /[^ ]&/, l: "no space before &" },         // an apersand without spaces before and after
        amp2:       { r: /&[^ ]/, l: "no space after &" },
        bracket1:   { r: / \)/,   l: "space before )" },            // opening parenthesis with spaces after, and closing with spaces before
        bracket2:   { r: /\( /,   l: "space after (" },
        multispace: { r: / {2,}/, l: "multiple spaces" },           // multiple spaces after each other
        spbegin:    { r: /^ /,    l: "space at beginning" },        // space at the beginning or end of the string
        spend:      { r: / $/,    l: "space at end" }
    }
    if (is_fandom) { //in fandoms we allow letters, numbers and tone/accent marks of ANY script (not just Latin) and more special characters
        testing.letter.r = /[^\p{L}\p{M}\p{N} \-().&/'"|:!#?_]/;    // any script letters, accent marks, numbers, and more special chars
        delete testing.slash1; delete testing.slash2;
        delete testing.amp1; delete testing.amp2;
    }

    let issues = [];
    for (const [key, value] of Object.entries(testing)) {
        let found = string.match(new RegExp(value.r, "gui")); // add flags, run checks
        if (found === null) continue; // skip if nothing's illegal

        for (let match of found) { // build the list of readable issues
            if (key === "letter") {
                if (match === "\t") match = "tab";
                issues.push(match);
            }
            else issues.push(value.l);
        }
    }
    if (string.split("(").length < string.split(")").length) issues.push("missing a ("); // should have the same number of ( and )
    if (string.split("(").length > string.split(")").length) issues.push("missing a )");

    if (issues.length !== 0) insertHeadsUp(issues, refNode, befNode, inline); // write out whatever issues there are
}
 
// print a box to explain the problem
function insertHeadsUp(illegalChars, refNode, befNode, inline) {

    // setting up the div to contain the heads-up to the user
    const warningNode = document.createElement("div");
    warningNode.classList.add("notice", "illegalChars");
    if (inline) warningNode.classList.add("illegalCharsInline");

    // SVGs from Heroicons https://heroicons.com (MIT license Copyright (c) Tailwind Labs, Inc. https://github.com/tailwindlabs/heroicons/blob/master/LICENSE)
    let icon = `<svg viewBox="0 0 24 24" fill="currentColor"><title>Questionable characters found, please check</title><path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm11.378-3.917c-.89-.777-2.366-.777-3.255 0a.75.75 0 0 1-.988-1.129c1.454-1.272 3.776-1.272 5.23 0 1.513 1.324 1.513 3.518 0 4.842a3.75 3.75 0 0 1-.837.552c-.676.328-1.028.774-1.028 1.152v.75a.75.75 0 0 1-1.5 0v-.75c0-1.279 1.06-2.107 1.875-2.502.182-.088.351-.199.503-.331.83-.727.83-1.857 0-2.584ZM12 18a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clip-rule="evenodd" /></svg>`;
    warningNode.innerHTML = `<p>${icon} ${illegalChars.join(", ")}</p>`;
 
    // if that already exists, we're gonna replace it rather than add more divs
    if (refNode.querySelector(".illegalChars")) refNode.replaceChild(warningNode, refNode.querySelector(".illegalChars"));
    else refNode.insertBefore(warningNode, befNode);
}

// remove the explain box again
function removeHeadsUp(refNode) {
    if (refNode.querySelector(".illegalChars")) refNode.removeChild(refNode.querySelector(".illegalChars"));
}

// *************** PAGE HANDLING FUNCTIONS ***************

// New tag page
function checkAsYouType() {
    // debounce, deferred helper functions: Mulan @ https://stackoverflow.com/a/68228099
    function debounce (task, ms) { let t = { promise: null, cancel: _ => void 0 }; return async (...args) => { try { t.cancel(); t = deferred(ms); await t.promise; await task(...args); } catch (_) { } } }
    function deferred (ms) { let cancel, promise = new Promise((resolve, reject) => { cancel = reject; setTimeout(resolve, ms) }); return { promise, cancel } }

    // actual checks for illegal characters and tag length
    function checkInput() {
        var checkNode = q("#tag_name");
        removeHeadsUp(checkNode.parentNode); // reset
        if (checkNode.value === "") return;

        // which tag type are you trying to create? fandom or anything else?
        const isFandom = q('#tag_type_fandom').checked;
        hasIllegalChars(checkNode.value, isFandom, checkNode.parentNode);

        // length counter
        let label = q('dt label[for="tag_name"]');
        label.innerText = "Name (" + checkNode.value.length +")";

        // extra special handling: tag length>150 error
        const refNode = checkNode.parentNode;
        if (checkNode.value.length > 150) {
            const errorNode = document.createElement("div");
            errorNode.id = "tooLong";
            errorNode.classList.add("error");
            errorNode.innerHTML = "<p>Sorry, you'll need to trim this down. You're at "+ checkNode.value.length +" characters!</p>";

            // if that already exists, we're gonna replace it rather than add more divs
            if (refNode.querySelector("#tooLong")) refNode.replaceChild(errorNode, refNode.querySelector("#tooLong"));
            else refNode.insertBefore(errorNode, null);
        }
        else if (refNode.querySelector("#tooLong")) refNode.removeChild(refNode.querySelector("#tooLong"));
    }

    // add the same event listener to all checkbox elements - checkInput is executed immediately (no debounce necessary)
    [ q('#tag_type_fandom'), q('#tag_type_character'), q('#tag_type_relationship'), q('#tag_type_freeform') ].forEach((el) => el.addEventListener("input", checkInput));
    // debounced listener while typing
    q('#tag_name').addEventListener("input", debounce(checkInput, 500));

    // on page load, trigger event once. browser remembers previous form selections/input upon page refresh and box would otherwise not appear until another change is made
    q("#tag_name").dispatchEvent(new Event("input"));
}

// Landing page
function checkTag() {
    // only if the viewed tags is canonical
    var tagDescr = q(".tag>p").innerText;
    if (tagDescr.indexOf("It's a canonical tag") < 0) return true;

    // first the viewed tag itself
    var checkNode = q(".tag .header h2.heading");
    var tagType = tagDescr.match(/This tag belongs to the (.+) Category/i);
    tagType = tagType[1];
    hasIllegalChars(checkNode.innerText, (tagType === "Fandom"), checkNode.parentNode.parentNode, checkNode.parentNode.parentNode.children[1]);

    // then the meta and subtags (if any)
    checkNode = qa("div.meta.listbox a.tag, div.sub.listbox a.tag");
    checkNode.forEach((n) => hasIllegalChars(n.innerText, (tagType === "Fandom"), n.parentNode, n.parentNode.children[1], true));
    // it would be really cool if we could check Parent Tags as well, but we can't tell which of those are fandoms vs. anything else
}

// Wrangle Bin Page
// sadly we can't tell here at all if we're ever looking at fandoms
function checkBinTags() {
    // this needs a different approach to the logic:
    // don't check show=mergers at all, too repetitive
    var searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get('show') == "mergers") return true;

    // create a key -> value pair Map of the table columns, so we know which column to check
    var tableIndexes = new Map();
    qa("#wrangulator table thead th").forEach((th, ix) => tableIndexes.set(th.innerText, ix));

    // now we can loop through the list of tags
    var checkNode;
    var checkRows = qa("#wrangulator table tbody tr");
    checkRows.forEach((r) => {
        // if there's a column "Canonical" and the cell says "Yes" then we check the tag itself
        if (tableIndexes.has("Canonical") && r.cells[tableIndexes.get("Canonical")].innerText == "Yes") {
            checkNode = q("label", r.cells[0]);
            hasIllegalChars(checkNode.innerText, (searchParams.get('show') === "fandoms"), checkNode.parentNode);
        }

        // if there's a column "Synonym", we check the content of that cell (there'll only be one tag)
        if (tableIndexes.has("Synonym") && r.cells[tableIndexes.get("Synonym")].innerText.trim() !== "") {
            checkNode = q("a", r.cells[tableIndexes.get("Synonym")]);
            hasIllegalChars(checkNode.innerText, (searchParams.get('show') === "fandoms"), checkNode.parentNode);
        }

        // if there's a column "Characters", we check the content of that cell (there might be multiple tags)
        if (tableIndexes.has("Characters") && r.cells[tableIndexes.get("Characters")].innerText.trim() !== "") {
            checkNode = qa("a", r.cells[tableIndexes.get("Characters")]);
            checkNode.forEach((n) => hasIllegalChars(n.innerText, false, n.parentNode));
        }

        // if there's a column "Metatag", we check the content of that cell (there might be multiple tags)
        if (tableIndexes.has("Metatag") && r.cells[tableIndexes.get("Metatag")].innerText.trim() !== "") {
            checkNode = qa("a", r.cells[tableIndexes.get("Metatag")]);
            checkNode.forEach((n) => hasIllegalChars(n.innerText, (searchParams.get('show') === "fandoms"), n.parentNode));
        }
    });
}

// Tag Search
function checkSearchResults() {
    // with search results table userscript enabled
    var checkNodes = qa("table#resulttable .resulttag.canonical a, table#resulttable .resultName.canonical a");
    checkNodes.forEach((n) => hasIllegalChars(n.innerText, (q('.resulttype, .resultType', n.parentNode.parentNode).title.startsWith("Fandom")), n.parentNode, null, true));

    // with plain search results page
    checkNodes = qa("ol.tag li span.canonical a.tag");
    checkNodes.forEach((n) => hasIllegalChars(n.innerText, (n.parentNode.firstChild.textContent.trim() == "Fandom:"), n.parentNode.parentNode, null, true));
}

// Edit Tag Page
function checkEditTag() {
    const tagCanonical = q('#tag_canonical');
    const tagName = q("#tag_name");
    const tagType = q('#tag_sortable_name') !== null ? "Fandom" : ""; // only fandom tags have the name-for-sorting field

    // initial check only if the tag is already canonical
    if (tagCanonical.checked) hasIllegalChars(tagName.value, (tagType === "Fandom"), tagName.parentNode);

    // if the tag's canonical status is changed
    tagCanonical.addEventListener("input", (event) => {
        removeHeadsUp(tagName.parentNode);
        if (event.target.checked) hasIllegalChars(tagName.value, (tagType === "Fandom"), tagName.parentNode);
    });

    // if this is a synonym, check the canonical tag it's synned to
    const synonym = q('ul.autocomplete .added.tag', tagName.parentNode.parentNode);
    if (synonym !== null) hasIllegalChars(synonym.firstChild.textContent.trim(), (tagType === "Fandom"), synonym.parentNode.parentNode, synonym.parentNode.parentNode.children[1]);

    // if this is canonical, check its sub- and metatags
    const metasubs = qa('#parent_MetaTag_associations_to_remove_checkboxes ul li a, #child_SubTag_associations_to_remove_checkboxes ul li a');
    if (metasubs !== null) metasubs.forEach((n) => hasIllegalChars(n.innerText, (tagType === "Fandom"), n.parentNode));

    // if this is any other type of tag that's in a fandom, check the fandom tag
    const fandoms = qa('#parent_Fandom_associations_to_remove_checkboxes ul li a');
    if (fandoms !== null) fandoms.forEach((n) => hasIllegalChars(n.innerText, true, n.parentNode));

    // if this is a relationship, check the tagged characters
    const chars = qa('#parent_Character_associations_to_remove_checkboxes ul li a');
    if (chars !== null) chars.forEach((n) => hasIllegalChars(n.innerText, false, n.parentNode));
}