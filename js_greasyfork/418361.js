// ==UserScript==
// @name         Monstercat Song Title and Author
// @version      0.71
// @description  Put currently playing song in browser title
// @author       Peco Eight Stars
// @match        https://player.monstercat.app/*
// @icon         https://www.google.com/s2/favicons?domain=monstercat.app
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-start
// @license      WTFPL
// @namespace https://greasyfork.org/users/443995
// @downloadURL https://update.greasyfork.org/scripts/418361/Monstercat%20Song%20Title%20and%20Author.user.js
// @updateURL https://update.greasyfork.org/scripts/418361/Monstercat%20Song%20Title%20and%20Author.meta.js
// ==/UserScript==
/* jshint esversion: 6 */

// ---------------- Customize Here ---------------- //

// You can change - for By or whatever you want to separate the track name from the author name.

var separator = ` - `;

// If you want to append something to the browser title, by default empty.
// In case you are using a hook (like Tuna for OBS) to the window that is looking for a specific text, or for any other reason.
// Remember to give it a space or it will stick to the Author name. Example:
// var append = ` on Monstercat`;

var append = ``;

// ms for loop, by default 1 second (1000ms)

var loop = 1000;

// Only displayed on first run, vanishes after playing first song until page is reloaded.
// Uncomment blank to have no title on it or uncomment the the one with the append.
// var defaulttitle = `⠀` // U+2800 Unicode
// var defaulttitle = `Monstercat Player: Not started, ready.` + append;

var defaulttitle = `Monstercat Player: Not started, ready.`;

// ---------------- End of Customization ---------------- //

var currentTrack;
var previousTrack;
var currentAuthor;
var firstrun = true;

setInterval(() => {
    currentTrack = document.querySelector(".active-song .scroll-item").innerText;
    currentAuthor = document.querySelector(".active-song .artists-list").innerText;
    if (currentTrack !== previousTrack) {
        previousTrack = currentTrack;
        document.title = `Currently Playing: ` + currentTrack + separator + currentAuthor + append;
    } else if (firstrun == true) {
        firstrun = false;
        document.title = defaulttitle;
    }
}, loop);