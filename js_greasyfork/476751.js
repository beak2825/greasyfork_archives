// ==UserScript==
// @name Twitter Article Preview Revert
// @namespace http://tampermonkey.net/
// @version 1.0.1
// @description Reverts the title concealment of articles made to Twitter/X on 5 Oct 2023.
// @author Anko
// @match https://twitter.com/*
// @match https://x.com/*
// @grant none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/476751/Twitter%20Article%20Preview%20Revert.user.js
// @updateURL https://update.greasyfork.org/scripts/476751/Twitter%20Article%20Preview%20Revert.meta.js
// ==/UserScript==

//TODO: Crude version, works on mouseover but ideally it should fire when each tweet has finished buidling, so the specific event that's been fired should be found. Also, style has been set only for dark mode.

(function() {
'use strict';

const newInfoStyle= `
-webkit-text-size-adjust: 100%;
-webkit-tap-highlight-color: rgba(0,0,0,0);
pointer-events: auto;
-webkit-box-align: stretch;
-webkit-box-direction: normal;
-webkit-box-orient: vertical;
align-items: stretch;
border: 0 solid black;
box-sizing: border-box;
display: flex;
flex-basis: auto;
flex-direction: column;
flex-shrink: 0;
margin: 5px;
min-height: 0px;
min-width: 0px;
padding-bottom: 0px;
padding-left: 0px;
padding-right: 0px;
padding-top: 0px;
position: relative;
z-index: 0;
`;

const domainStyle = `
-webkit-text-size-adjust: 100%;
-webkit-tap-highlight-color: rgba(0,0,0,0);
pointer-events: auto;
list-style: none;
text-align: inherit;
cursor: pointer;
-webkit-box-direction: normal;
unicode-bidi: isolate;
border: 0 solid black;
box-sizing: border-box;
display: inline;
font: 14px -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
padding-bottom: 0px;
padding-left: 0px;
padding-right: 0px;
padding-top: 0px;
max-width: 100%;
overflow-x: hidden;
overflow-y: hidden;
text-overflow: ellipsis;
white-space: nowrap;
min-width: 0px;
word-wrap: break-word;
line-height: 20px;
font-family: "TwitterChirp",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
font-size: 15px;
color: grey;
font-weight: 400;
`;

const titleStyle = `
-webkit-text-size-adjust: 100%;
-webkit-tap-highlight-color: rgba(0,0,0,0);
pointer-events: auto;
list-style: none;
text-align: inherit;
cursor: pointer;
-webkit-box-direction: normal;
unicode-bidi: isolate;
border: 0 solid black;
box-sizing: border-box;
display: inline;
font: 14px -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
padding-bottom: 0px;
padding-left: 0px;
padding-right: 0px;
padding-top: 0px;
max-width: 100%;
overflow-x: hidden;
overflow-y: hidden;
text-overflow: ellipsis;
white-space: nowrap;
min-width: 0px;
word-wrap: break-word;
line-height: 20px;
font-family: "TwitterChirp",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
font-size: 15px;
font-weight: 400;
color: white;
`;

document.addEventListener('mouseover', function(e) {
let card = e.target.closest('[data-testid="card.wrapper"]');
if (!card) return;
if (card.querySelector('.added-info')) return;

let domain = card.querySelector('span')?.textContent || 'Unknown domain';
let title = card.querySelector('a')?.getAttribute('aria-label') || 'Unknown title';
let URL = card.querySelector('a')?.getAttribute('href') || '';

// Separate domain and title if combined in 'aria-label'
let splitLabel = title.split(' ');
if (splitLabel.length > 1 && domain === splitLabel[0]) {
domain = splitLabel.shift();
title = splitLabel.join(' ');
}

// Create link element
let linkElem = document.createElement('a');
linkElem.href = URL;
linkElem.target = "_blank";
linkElem.rel = "noopener noreferrer";

linkElem.style.textDecoration = 'none';

// Create container for new info
let newInfo = document.createElement('div');
newInfo.style = newInfoStyle;
newInfo.classList.add('added-info'); // Adding class for later reference

// Domain element
let domainElem = document.createElement('div');
let domainSpan = document.createElement('span');
domainSpan.style = domainStyle;
domainSpan.textContent = domain;
domainElem.appendChild(domainSpan);

// Title element
let titleElem = document.createElement('div');
let titleSpan = document.createElement('span');
titleSpan.style = titleStyle;
titleSpan.textContent = title;
titleElem.appendChild(titleSpan);

// Append to new info container
newInfo.appendChild(domainElem);
newInfo.appendChild(titleElem);

// Append new info container to the link element
linkElem.appendChild(newInfo);

// Append link element to the card
card.appendChild(linkElem);
});

})();