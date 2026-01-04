// ==UserScript==
// @name         AO3: Autocomplete in Menu Search Field
// @namespace    https://greasyfork.org/en/users/906106-escctrl
// @description  Turns the general search in the menu bar into an autocomplete for any canonical tags
// @author       escctrl
// @version      3.0
// @match        *://*.archiveofourown.org/*
// @grant        none
// @require      https://update.greasyfork.org/scripts/491888/1355841/Light%20or%20Dark.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/535155/AO3%3A%20Autocomplete%20in%20Menu%20Search%20Field.user.js
// @updateURL https://update.greasyfork.org/scripts/535155/AO3%3A%20Autocomplete%20in%20Menu%20Search%20Field.meta.js
// ==/UserScript==

/* eslint-disable no-multi-spaces */
/* global lightOrDark */

'use strict';

const GOTOWORKS = true; // go to the tag's works page (true) or lading page (false)
const NEWTAB = false; // open the page in a new tab (true) or in the same tab (false)

// utility to reduce verboseness
const q = (s, n=document) => n.querySelector(s);
const qa = (s, n=document) => n.querySelectorAll(s);
const ins = (n, l, html) => n.insertAdjacentHTML(l, html);

// styling the autocomplete (because #header has some CSS that interferes we have to set it explicitly)
let border, bg, text, bgHover, textHover;

// official site skins are <link>'ed, default with various medias, others with media="all"; user site skins are inserted directly with <style>
var skin = qa('link[href^="/stylesheets/skins/"][media="all"]');
// default site skin means there's no media="all", for others there should be exactly one
if (skin.length === 1) skin = skin[0].href.match(/skin_(\d+)_/);
skin = skin[1] || "";

// In case of non-public site skins, checks if using a dark mode by calculating the 'brightness' of the page background color
if (skin === "") skin = lightOrDark(window.getComputedStyle(document.body).backgroundColor);

switch (skin) {
    case "929": // reversi
    case "dark":
        border = "#222";
        bg = "rgb(42, 42, 42)";
        text = "#fff";
        bgHover = "rgb(17, 17, 17)";
        textHover = "#fff";
        break;
    case "932": // snow blue
    case "891": // low vision
    case "light":
    default: // default site skin
        border = "#888";
        bg = "#ddd";
        text = "#2a2a2a";
        bgHover = "rgba(255, 255, 255, 0.25)";
        textHover = "#111";
        break;
}

ins(q('header'), 'beforeend', `<style type="text/css">
    #general_search_autocomplete { width: 20em; margin-right: 1em; padding: 0.125em; border-radius: 1em; }
    #header .search li.input { margin: 0; }
    #header .autocomplete.dropdown { display: block; border: 1px solid ${border}; background-color: ${bg}; }
    #header .autocomplete.dropdown ul { box-shadow: none; border: 0; background-color: transparent; }
    #header .autocomplete.dropdown li { display: list-item; float: none; text-align: left; padding: 0.125em 0.25em; color: ${text}; }
    #header .autocomplete.dropdown li:hover { color: ${textHover}; background-color: ${bgHover}; cursor: pointer; }
</style>`);

// grab the <li> in which general search sits
let liSearch = q('#header nav[aria-label="Site"] li.search');

// replace the general search form with an autocomplete field for any canonical tag
liSearch.innerHTML = `<form>
    <input class="autocomplete" data-autocomplete-method="/autocomplete/tag" data-autocomplete-hint-text="Start typing to search for a tag!"
        data-autocomplete-no-results-text="(No suggestions found)" data-autocomplete-min-chars="1" data-autocomplete-searching-text="Searching..." type="text"
        data-autocomplete-token-limit="1" data-autocomplete-value="" id="general_search" style="width: 20em;">
</form>`;

// listen to the autocomplete - if a tag is selected, we navigate to its /works page
liSearch.addEventListener('focusout', function(e) {
    if (e.target.matches('#general_search_autocomplete')) {
        let liAddedTag = qa('li.added.tag', liSearch);

        // if there's actually a tag that was selected, we can continue
        if (liAddedTag.length !== 0) {
            let tagName = liAddedTag[0].firstChild.textContent.trim(); // pure tagname without the x delete link
            tagName = tagName.replaceAll("/", "*s*").replaceAll(".", "*d*").replaceAll("?", "*q*").replace("#", "*h*").replace('"', '&quot;'); // replacing the AO3 specific stuff in URLs

            window.open(`${window.location.origin}/tags/${tagName}/${GOTOWORKS ? "works" : ""}`, NEWTAB ? '_blank' : '_self');
        }
    }
});
