// ==UserScript==
// @name         Google Search Category Sanity
// @namespace    https://greasyfork.org/en/users/1148791-vuccala
// @icon         https://archive.org/download/userscripticon/userscripticon.png
// @author       Vuccala
// @version      0.7
// @description  Adds a bar of search category links that STAY IN ORDER!
// @match        https://*.google.*/search*
// @grant        none
// @license      MIT
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/473414/Google%20Search%20Category%20Sanity.user.js
// @updateURL https://update.greasyfork.org/scripts/473414/Google%20Search%20Category%20Sanity.meta.js
// ==/UserScript==

(function() {
    'use strict';

// Get the current URL's query string
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const copiedQueryString = urlParams.get('q');

const goog = window.location.origin;

// Create the links
const textsearch = document.createElement('a');
textsearch.href = `${goog}/search?q=${copiedQueryString}&tbs=li:1`;
textsearch.textContent = 'Web';

const imagesearch = document.createElement('a');
imagesearch.href = `${goog}/search?q=${copiedQueryString}&tbm=isch`;
imagesearch.textContent = 'Images';

const videosearch = document.createElement('a');
videosearch.href = `${goog}/search?q=${copiedQueryString}&tbm=vid`;
videosearch.textContent = 'Videos';

const mapsearch = document.createElement('a');
mapsearch.href = `https://maps.google.com/maps?q=${copiedQueryString}`;
mapsearch.textContent = 'Maps';

const booksearch = document.createElement('a');
booksearch.href = `${goog}/search?q=${copiedQueryString}&tbm=bks`;
booksearch.textContent = 'Books';

const newssearch = document.createElement('a');
newssearch.href = `${goog}/search?q=${copiedQueryString}&tbm=nws`;
newssearch.textContent = 'News';

const youtube = document.createElement('a');
youtube.href = `https://www.youtube.com/results?search_query=${copiedQueryString}`;
youtube.textContent = 'YouTube';

const trsearch = document.createElement('a');
trsearch.href = `https://translate.google.com/?text=${copiedQueryString}`;
trsearch.textContent = 'Translate';

// Extra, non-Google search sites:
const redditsearch = document.createElement('a');
redditsearch.href = `https://reddit.com/search?q=${copiedQueryString}`;
redditsearch.textContent = 'Reddit';

const googredditsearch = document.createElement('a');
googredditsearch.href = `${goog}/search?q=${copiedQueryString} site:reddit.com`;
googredditsearch.textContent = '+site:reddit.com';

const githubsearch = document.createElement('a');
githubsearch.href = `https://github.com/search?q=${copiedQueryString}`;
githubsearch.textContent = 'Github';

const gitlabsearch = document.createElement('a');
gitlabsearch.href = `https://gitlab.com/search?search=${copiedQueryString}`;
gitlabsearch.textContent = 'Gitlab';

const twittersearch = document.createElement('a');
twittersearch.href = `https://twitter.com/search?q=${copiedQueryString}`;
twittersearch.textContent = 'Twitter';

const wikisearch = document.createElement('a');
wikisearch.href = `https://en.wikipedia.org/w/index.php?search=${copiedQueryString}`;
wikisearch.textContent = 'Wikipedia';

const azsearch = document.createElement('a');
azsearch.href = `https://www.amazon.com/s/?field-keywords=${copiedQueryString}`;
azsearch.textContent = 'Amazon';

// Create div element for the new bar
const betterbar = document.createElement('div');
betterbar.style.cssText = `
position: absolute;
top: -20px;
width: 100%;
background-color: #DDD2;
padding: 10px;
font-size: 16px;
font-weight: bold;
z-index: 9999;
`;

betterbar.appendChild(textsearch);
betterbar.appendChild(document.createTextNode(' | '));betterbar.appendChild(imagesearch);
betterbar.appendChild(document.createTextNode(' | '));betterbar.appendChild(videosearch);
betterbar.appendChild(document.createTextNode(' | '));betterbar.appendChild(mapsearch);
betterbar.appendChild(document.createTextNode(' | '));betterbar.appendChild(newssearch);
betterbar.appendChild(document.createTextNode(' | '));betterbar.appendChild(booksearch);
betterbar.appendChild(document.createTextNode(' | '));betterbar.appendChild(trsearch);
betterbar.appendChild(document.createTextNode(' | '));betterbar.appendChild(youtube);

// CUSTOMIZATION
// You can customize the new search bar with extra search links.
// Below, find what sites you want to add, delete the // that precedes its line of code, then click Save

/* Reddit */
// betterbar.appendChild(document.createTextNode(' | ')); betterbar.appendChild(redditsearch);

/* Add "site:reddit.com" to your Google query */
// betterbar.appendChild(document.createTextNode(' | ')); betterbar.appendChild(googredditsearch);

/* Github */
// betterbar.appendChild(document.createTextNode(' | ')); betterbar.appendChild(githubsearch);

/* Gitlab */
// betterbar.appendChild(document.createTextNode(' | ')); betterbar.appendChild(gitlabsearch);

/* Twitter */
// betterbar.appendChild(document.createTextNode(' | ')); betterbar.appendChild(twittersearch);

/* Wikipedia */
// betterbar.appendChild(document.createTextNode(' | ')); betterbar.appendChild(wikisearch);

/* Amazon */
// betterbar.appendChild(document.createTextNode(' | ')); betterbar.appendChild(azsearch);

/* Moves down the page to make room for betterbar */
document.body.style.cssText = `
position: relative;
top:20px;
`;

document.body.appendChild(betterbar);

})();
