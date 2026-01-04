// ==UserScript==
// @name         MyAnimeList(MAL) - Profile Colors
// @version      1.0.2
// @description  Returns the good ol' blue colors to your MAL profile.
// @author       Cpt_mathix
// @match        *://myanimelist.net/profile*
// @license      GPL-2.0-or-later
// @grant        none
// @namespace https://greasyfork.org/users/16080
// @downloadURL https://update.greasyfork.org/scripts/389869/MyAnimeList%28MAL%29%20-%20Profile%20Colors.user.js
// @updateURL https://update.greasyfork.org/scripts/389869/MyAnimeList%28MAL%29%20-%20Profile%20Colors.meta.js
// ==/UserScript==

// Credits to Annuvin who made the original script

// ### Colors ###

/*jshint esversion: 6 */

let watching_anime = "#6C8CD8";
let completed_anime = "#4165BA";
let onhold_anime = "#8EA7E1";
let dropped_anime = "#BDCEEC";
let ptw_anime = "#E1E7F5";

let reading_manga = "#6C8CD8";
let completed_manga = "#4165BA";
let onhold_manga = "#8EA7E1";
let dropped_manga = "#BDCEEC";
let ptr_manga = "#E1E7F5";

var css = `
.graph.anime.watching, .circle.anime.watching:after, .graph-inner.anime.watching { background-color: ${watching_anime} !important }
.text.anime.watching { color: ${watching_anime} !important }
.graph.anime.completed, .circle.anime.completed:after, .graph-inner.anime.completed { background-color: ${completed_anime} !important }
.text.anime.completed { color: ${completed_anime} !important }
.graph.anime.on_hold, .circle.anime.on_hold:after, .graph-inner.anime.on_hold { background-color: ${onhold_anime} !important }
.text.anime.on_hold { color: ${onhold_anime} !important }
.graph.anime.dropped, .circle.anime.dropped:after, .graph-inner.anime.dropped { background-color: ${dropped_anime} !important }
.text.anime.dropped { color: ${dropped_anime} !important }
.graph.anime.plan_to_watch, .circle.anime.plan_to_watch:after, .graph-inner.anime.plan_to_watch { background-color: ${ptw_anime} !important }
.text.anime.plan_to_watch { color: ${ptw_anime} !important }

.graph.manga.reading, .circle.manga.reading:after, .graph-inner.manga.reading { background-color: ${reading_manga} !important }
.text.manga.reading { color: ${reading_manga} !important }
.graph.manga.completed, .circle.manga.completed:after, .graph-inner.manga.completed { background-color: ${completed_manga} !important }
.text.manga.completed { color: ${completed_manga} !important }
.graph.manga.on_hold, .circle.manga.on_hold:after, .graph-inner.manga.on_hold { background-color: ${onhold_manga} !important }
.text.manga.on_hold { color: ${onhold_manga} !important }
.graph.manga.dropped, .circle.manga.dropped:after, .graph-inner.manga.dropped { background-color: ${dropped_manga} !important }
.text.manga.dropped { color: ${dropped_manga} !important }
.graph.manga.plan_to_read, .circle.manga.plan_to_read:after, .graph-inner.manga.plan_to_read { background-color: ${ptr_manga} !important }
.text.manga.plan_to_read { color: ${ptr_manga} !important }

.user-status-data.online { color: #4165BA !important }
`;

var style = document.createElement("style");
style.type = "text/css";
if (style.styleSheet){
    style.styleSheet.cssText = css;
} else {
    style.appendChild(document.createTextNode(css));
}

document.documentElement.appendChild(style);