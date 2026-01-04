// ==UserScript==
// @name        Download Words From Wikitionary
// @namespace   https://greasyfork.org/users/281093
// @match       https://en.wiktionary.org/*Category*
// @grant       none
// @version     1.0
// @author      Bell
// @license     MIT
// @copyright   2021, Bell (https://greasyfork.org/users/281093)
// @description Adds a button to scrape song/album titles
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/431996/Download%20Words%20From%20Wikitionary.user.js
// @updateURL https://update.greasyfork.org/scripts/431996/Download%20Words%20From%20Wikitionary.meta.js
// ==/UserScript==
/* jshint esversion: 6 */

let scraping = JSON.parse(sessionStorage.getItem('scraping')) || false;
document.addEventListener('DOMContentLoaded', () => {
  (function appendButtons() {
    if (scraping) addStopButton();
    else addScrapeButton();
  })();
  scrape();
});

function addScrapeButton() {
	const scrapeButton = document.createElement('div');
	scrapeButton.setAttribute('style', `
		width: 6rem;
		background-color: #004effd9;
		margin-left: 10px;
		border-radius: 5px;
		text-align: center;
		color: white;
		font-size: 1.3rem;
		cursor: pointer;
    position: fixed;
    top: 5%;
    left: 50%;
    padding: 5px;
	`);
	
	scrapeButton.onclick = toggleScraping;
	scrapeButton.textContent = 'Scrape';
	document.body.appendChild(scrapeButton);
}

function addStopButton() {
	const stopButton = document.createElement('div');
	stopButton.setAttribute('style', `
		width: 26rem;
		height: 10rem;
		background-color: #d93034d9;
		position: fixed;
		top: 5rem;
		margin-left: calc(50vw - 13rem);
		border-radius: 20px;
		text-align: center;
		color: white;
		font-size: 4rem;
		cursor: pointer;
	`);
	
	stopButton.onclick = toggleScraping;
	stopButton.textContent = 'STOP SCRAPING';
	document.body.appendChild(stopButton);
		
}

function toggleScraping() {
	scraping = !scraping;
	sessionStorage.setItem('scraping', JSON.stringify(scraping));
	if (scraping) scrape();
	else downloadScraped();
}


function scrape() {
	if (!scraping) return;
	const words = [...document.querySelectorAll('#mw-pages li')].map(link => link.textContent);
  console.log(words);
  storeData(words);
  loadNextPage();
}

function getAlbumString(selector) {
	return Array.prototype.map.call(
			document.querySelectorAll(selector), 
			node => node.textContent
	).join(', ');
}
	
function downloadScraped() {
	const stored = JSON.parse(sessionStorage.getItem('storedData'));
	
	if (!stored) {
		console.error('no stored data');
		return;
	}
	
	downloadText(stored.join(', '));
	sessionStorage.removeItem('storedData');
  location.reload();
}
	
function storeData(data) {
	const stored = JSON.parse(sessionStorage.getItem('storedData')) || [];
	sessionStorage.setItem('storedData', JSON.stringify(stored.concat(data)));
}

function downloadText(string) {
	const a = document.createElement('a');
	a.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(string));
	a.setAttribute('download', document.title);
	a.click();
}

function loadNextPage() {
	const nextPageLink = [...document.querySelectorAll("#mw-pages a")].filter(a => a.textContent.match('next page'))[0];

  if (!nextPageLink) {
		toggleScraping();
		location.reload();
	}
	else nextPageLink.click();
}