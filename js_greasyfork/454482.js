// ==UserScript==
// @name         AO3: Jump to a Random Work
// @namespace    https://greasyfork.org/en/users/906106-escctrl
// @version      1.1
// @description  adds a "Random Work" button (top right corner) when viewing works or bookmarks - shows up in a tag/filter and your Marked For Later list
// @author       escctrl
// @match        *://*.archiveofourown.org/tags/*/works*
// @match        *://*.archiveofourown.org/works?*
// @match        *://*.archiveofourown.org/users/*/readings*show=to-read*
// @match        *://*.archiveofourown.org/tags/*/bookmarks*
// @match        *://*.archiveofourown.org/bookmarks?*
// @match        *://*.archiveofourown.org/users/*/bookmarks*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/454482/AO3%3A%20Jump%20to%20a%20Random%20Work.user.js
// @updateURL https://update.greasyfork.org/scripts/454482/AO3%3A%20Jump%20to%20a%20Random%20Work.meta.js
// ==/UserScript==

'use strict';

// utility to reduce verboseness
const q = (s, n=document) => n.querySelector(s);
const qa = (s, n=document) => n.querySelectorAll(s);

// add a button
var button = document.createElement('li');
button.innerHTML = '<a href="#">Random Work</a>';
button.addEventListener("click", RandomWork);
q('div#main ul.navigation.actions').appendChild(button);

// when the button was pressed, read the number of works, pick a random one, and redirect there
function RandomWork(e) {
    e.preventDefault();

    // Find number of pages. content of second-to-last <li> tells us
    let pageCount = q('ol.pagination');
    pageCount = pageCount !== null ? parseInt([...qa('li', pageCount)].at(-2).innerText) : 1;

    // pick random whole number of the available pages
    const pageRandom = Math.floor((Math.random() * pageCount) + 1);

    // figure out which page we're currently viewing
    var thisPage = location.search.match(/page=(\d+)/);
    thisPage = thisPage === null ? 1 : parseInt(thisPage[1]); // match only works if URL contained a page (i.e. if not on page 1)

    // check: are we currently on the randomly chosen page?
    if (thisPage !== pageRandom) LoadRandomPage(pageRandom); // if not - read that page to find a random work link
    else Redirect2Work(qa('ol.index.group > li.blurb')); // if yes - skip page loads, read a random work link from this page
}

async function LoadRandomPage(r) {
    // build the URL of the page to load
    var pageURL = location.search.indexOf('page=') > 0 ? location.href.replace(/page=(\d+)/, 'page='+r) // replace existing page number
        : location.href + (location.href.indexOf('?') > 0 ? '&' : '?') + 'page='+r; // add page number if not yet in URL search parameters

    try {
        let response = await fetch(pageURL);
        // the response has hit an error eg. 429 retry later
        if (!response.ok) throw new Error(`Random Work script HTTP error: ${response.status}`);
        else {
            let txt = await response.text();
            let parser = new DOMParser(); // Initialize the DOM parser
            txt = parser.parseFromString(txt, "text/html"); // Parse the text into HTML

            Redirect2Work(qa('ol.index.group > li.blurb', txt));
        }
    }
    catch(error) {
        console.error("Random Work script error", error.message);
        alert("Sorry, the Random Work script encountered an error. You've probably been rate-limited. Please try again later.");
        return false;
    }
}

function Redirect2Work(worksList) {

    // pick a random work from within the list
    var pick = Math.floor((Math.random() * worksList.length) + 1);

    // read that random work's URL and title
    pick = q('h4 a', worksList[pick-1]);

    // jump to that work but warn the user
    alert('Redirecting you to a random work: '+pick.innerText);
    window.location.assign(pick.href);
}
