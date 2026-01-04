// ==UserScript==
// @namespace   LewdPursuits
// @name        Mark Watched Videos for SpankBang
// @match       *://spankbang.com/*
// @version     0.5.3
// @author      LewdPursuits
// @description Marks videos that you've previously seen as watched, across the entire site.
// @license     GPL-3.0-or-later
// @require     https://cdn.jsdelivr.net/npm/idb@7/build/umd.js
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/426439/Mark%20Watched%20Videos%20for%20SpankBang.user.js
// @updateURL https://update.greasyfork.org/scripts/426439/Mark%20Watched%20Videos%20for%20SpankBang.meta.js
// ==/UserScript==

/* jshint esversion: 10 */
/**
 * This creates the CSS needed to gray out the thumbnail and display the Watched text over it
 * The style element is added to the bottom of the body so it's the last style sheet processed
 * this ensures these styles take highest priority
 */
const style = document.createElement("style");
style.textContent = `img.watched {
		filter: grayscale(80%);
	}
	div.centered{
		position: absolute;
		color: white;
		height: 100%;
		width: 100%;
		transform: translate(0, -100%);
		z-index: 999;
		text-align: center;
	}
	div.centered p {
		position: relative;
		top: 40%;
		font-size: 1.5rem;
		background: rgba(0,0,0,0.5);
		display: inline;
		padding: 2%;
	}`;
document.body.appendChild(style);
/**
 * Splits a floating point number, and returns the digits from after the decimal point.
 * @param float A floating point number.
 * @returns A number.
 */
function after(float) {
    const fraction = float.toString().split('.')[1];
    return parseInt(fraction);
}
/**
 * Fetches a webpage from a given URL and returns a promise for the parsed document.
 * @param url The URL to be fetched.
 * @returns A parsed copy of the document found at URL.
 */
async function getPage(url) {
    const response = await fetch(url);
    const parser = new DOMParser();
    if (!response.ok) {
        throw new Error(`getPage: HTTP error. Status: ${response.status}`);
    }
    // We turn the response into a string representing the page as text
    // We run the text through a DOM parser, which turns it into a useable HTML document
    return parser.parseFromString(await response.text(), "text/html");
}
/**
 * Fetches all videos from the account history, and adds them to the empty database.
 * @param db The empty database to populate.
 * @returns An array of keys for the new database entries.
 */
async function buildVideoHistory(db) {
    const historyURL = "https://spankbang.com/users/history?page=";
    let pages = [];
    pages.push(await getPage(`${historyURL}1`));
    // This gets the heading that says the number of watched videos, uses regex for 1 or more numbers
    // gets the matched number as a string, converts it to the number type, then divides by 34
    const num = Number(pages[0].querySelector("div.data h2").innerText.match(/\d+/)[0]) / 34;
    const numPages = after(num) ? Math.trunc(num) + 1 : num;
    function getVideos(historyDoc) {
        const videos = Array.from(historyDoc.querySelectorAll('div[id^="v_id"]'));
        return videos.map(div => {
            const thumb = div.querySelector("a.thumb");
            const _name = div.querySelector("a.n");
            return { id: div.id, url: thumb.href, name: _name.innerText };
        });
    }
    //If history has more than 34 videos, pages will be > 1
    //We fetch all the pages concurrently.
    if (numPages > 1) {
        const urls = [];
        for (let i = 2; i <= numPages; i++) {
            urls.push(`${historyURL}${i}`);
        }
        pages = pages.concat(await Promise.all(urls.map(getPage)));
    }
    let toAdd = pages.reduce((videos, page) => videos.concat(getVideos(page)), []);
    const writeStore = db.transaction("videos", "readwrite").store;
    return Promise.all(toAdd.map(video => writeStore.put(video)));
}
/**
 * Checks the videos object store for entries, and populates it if empty.
 * @param db The database.
 * @returns The database.
 */
async function checkStoreLength(db) {
    const readStore = await db.getAllKeys("videos");
    if (readStore.length === 0) {
        await buildVideoHistory(db);
    }
    return db;
}
/**
 * Checks the database for any watched videos on the current page.
 * @param db The database containing watched history.
 * @returns The database.
 */
async function tagAsWatched(db) {
    // We check for the existance of any watched videos on the current page
    // If there are any, we move to the thumbnail and add the .watched class
    // This applys the CSS style above, and allows us to easily find the videos again
    const names = Array.from(document.querySelectorAll('div[id^="v_id"]'));
    const readStore = db.transaction("videos").store;
    const keys = await readStore.getAllKeys();
    function tagImg(e) {
        if (keys.includes(e.id)) {
            const img = e.querySelector("a picture img");
            //console.log(`Marking ${e.innerText} as watched`)
            img.classList.add("watched");
            return img;
        }
    }
    names.forEach(tagImg);
    return db;
}
function getVideoID() {
    try {
        const div = document.querySelector("div#video");
        return `v_id_${div.dataset.videoid}`;
    }
    catch {
        throw new Error("getVideoID: div#video not found!");
    }
}
function getVideoURL() {
    try {
        return document.querySelector('meta[property="og:url"]').content;
    }
    catch {
        throw new Error("getVideoURL: meta element not found!");
    }
}
function getVideoName() {
    try {
        const heading = document.querySelector("div.left h1");
        return heading ? heading.innerText : "Untitled";
    }
    catch {
        throw new Error("getVideoName: heading element not found!");
    }
}
/**
 * Checks for the current video in the database, and adds it if not found.
 * @param db The database containing watched history.
 * @returns A promise for the key of the added video.
 */
async function checkStoreForVideo(db) {
    const url = `${window.location}`;
    if (!/spankbang\.com\/\w+\/video\//.test(url) &&
        !/spankbang\.com\/\w+-\w+\/playlist\//.test(url)) {
        return;
    }
    const video = { id: getVideoID(), url: "", name: "" };
    let readStore = db.transaction("videos").store;
    const lookup = await readStore.get(video.id);
    if (lookup !== undefined) {
        return;
    }
    video.url = getVideoURL();
    video.name = getVideoName();
    let writeStore = db.transaction("videos", "readwrite").store;
    return writeStore.add(video);
}
/**
 * Checks the current page for any videos marked as watched, and adds the watched text in front of them.
 * @returns An array containing the newly created Div elements
 */
function filterWatched() {
    const docQuery = Array.from(document.querySelectorAll("img.watched"));
    function makeDiv(e) {
        const newPara = document.createElement("p");
        newPara.textContent = "Watched";
        const newDiv = document.createElement("div");
        newDiv.classList.add("centered");
        newDiv.appendChild(newPara);
        return e.parentElement.parentElement.appendChild(newDiv);
    }
    return (docQuery.length > 0) ? docQuery.map(makeDiv) : [];
}
/**
 * Callback function for upgrade event on openDB()
 * @param db The database
 */
function upgrade(db) {
    const store = db.createObjectStore("videos", {
        keyPath: "id",
        autoIncrement: false,
    });
    store.createIndex("url", "url", { unique: true });
}
idb.openDB("history", 1, { upgrade })
    .then(checkStoreLength)
    .then(tagAsWatched)
    .then(checkStoreForVideo)
    .then(filterWatched)
    .catch(e => console.trace(e));