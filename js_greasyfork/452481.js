// ==UserScript==
// @name        Soundgasm Improvements
// @namespace   V.L
// @version     1.0
// @description Restyles and adds new functionality to Soundgasm --- dark mode/keyboard shortcuts/quick download/and more
// @author      Valerio Lyndon
// @homepageURL https://github.com/ValerioLyndon/Soundgasm-Improvements
// @supportURL  https://github.com/ValerioLyndon/Soundgasm-Improvements/issues
// @license     GPL-3.0-only
// @match       https://soundgasm.net/*
// @run-at      document-start
// @grant       GM_getValue
// @grant       GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/452481/Soundgasm%20Improvements.user.js
// @updateURL https://update.greasyfork.org/scripts/452481/Soundgasm%20Improvements.meta.js
// ==/UserScript==

'use strict';

document.addEventListener("DOMContentLoaded", domLoaded);

// Dark or Light mode

const theme = GM_getValue('theme', 'dark');
document.documentElement.classList.add(theme);

// CSS

const css = document.createElement('style');
css.textContent = `
	html {
		font-size: 1px;

        --icons: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAAGQCAYAAADr8i+wAAAACXBIWXMAAAsTAAALEwEAmpwYAAAMjmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDIgNzkuMTYwOTI0LCAyMDE3LzA3LzEzLTAxOjA2OjM5ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyIgeG1sbnM6ZXhpZj0iaHR0cDovL25zLmFkb2JlLmNvbS9leGlmLzEuMC8iIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1wTU06RG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOmI2Mjc5ZTQ3LTNiYzAtM2Q0ZC1iNzUyLWRiNmM4OGU5MDliYyIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo5N2EzMzA5ZC03NWE4LWRhNDktYjQyNi04NmU1ZDBlM2ZiZTgiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0iOTc4MTgzNEJDNEFBMTFCODE1QzQzMjUyQkJGQkIwNUEiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiBwaG90b3Nob3A6SUNDUHJvZmlsZT0iIiB0aWZmOkltYWdlV2lkdGg9IjIwMCIgdGlmZjpJbWFnZUxlbmd0aD0iNDAwIiB0aWZmOlBob3RvbWV0cmljSW50ZXJwcmV0YXRpb249IjIiIHRpZmY6U2FtcGxlc1BlclBpeGVsPSIzIiB0aWZmOlhSZXNvbHV0aW9uPSIxMDAvMSIgdGlmZjpZUmVzb2x1dGlvbj0iMTAwLzEiIHRpZmY6UmVzb2x1dGlvblVuaXQ9IjEiIGV4aWY6RXhpZlZlcnNpb249IjAyMjEiIGV4aWY6Q29sb3JTcGFjZT0iNjU1MzUiIGV4aWY6UGl4ZWxYRGltZW5zaW9uPSIyMDAiIGV4aWY6UGl4ZWxZRGltZW5zaW9uPSI0MDAiIHhtcDpDcmVhdGVEYXRlPSIyMDIyLTAyLTA4VDIwOjExOjU5LTA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMi0wMi0wOFQyMTowMDoyMS0wODowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMi0wMi0wOFQyMTowMDoyMS0wODowMCI+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjM5ZmM5YWM1LTg2NWMtZjU0Mi05MDM5LTUyNTRmMDg3OTA3MSIgc3RFdnQ6d2hlbj0iMjAyMi0wMi0wOFQyMDoxNzoyNS0wODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY29udmVydGVkIiBzdEV2dDpwYXJhbWV0ZXJzPSJmcm9tIGltYWdlL2pwZWcgdG8gYXBwbGljYXRpb24vdm5kLmFkb2JlLnBob3Rvc2hvcCIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iZGVyaXZlZCIgc3RFdnQ6cGFyYW1ldGVycz0iY29udmVydGVkIGZyb20gaW1hZ2UvanBlZyB0byBhcHBsaWNhdGlvbi92bmQuYWRvYmUucGhvdG9zaG9wIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo3ZWU4ZTcwNS1kYTBjLTI4NDMtYTQ1My05Y2U4ZDdiMjk0ZTIiIHN0RXZ0OndoZW49IjIwMjItMDItMDhUMjA6MTc6MjUtMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjk4ZTlmMDE1LTg3OGMtODc0Yi04MjBkLWE0NjdjZjEzMTZkOCIgc3RFdnQ6d2hlbj0iMjAyMi0wMi0wOFQyMTowMDoyMS0wODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY29udmVydGVkIiBzdEV2dDpwYXJhbWV0ZXJzPSJmcm9tIGFwcGxpY2F0aW9uL3ZuZC5hZG9iZS5waG90b3Nob3AgdG8gaW1hZ2UvcG5nIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJkZXJpdmVkIiBzdEV2dDpwYXJhbWV0ZXJzPSJjb252ZXJ0ZWQgZnJvbSBhcHBsaWNhdGlvbi92bmQuYWRvYmUucGhvdG9zaG9wIHRvIGltYWdlL3BuZyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6OTdhMzMwOWQtNzVhOC1kYTQ5LWI0MjYtODZlNWQwZTNmYmU4IiBzdEV2dDp3aGVuPSIyMDIyLTAyLTA4VDIxOjAwOjIxLTA4OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRm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);
	}

	html.dark {
		--background: hsl(0, 0%, 6.5%);
		--foreground-1: hsl(0, 0%, 12%);
		--foreground-bar-2: hsl(0, 0%, 15%);
		--foreground-bar: hsl(0, 0%, 27%);
		--foreground-2: hsl(0, 0%, 17.6%);
		--border: var(--foreground-bar-2);
		--text-low: hsl(0, 0%, 65%);
		--text-medium: hsl(0, 0%, 80%);
		--text-high: hsl(0, 0%, 98%);
		--accent: hsl(310, 30%, 30%);
	}
	html.light {
		--background: hsl(0, 0%, 96%);
		--foreground-1: hsl(0, 0%, 100%);
		--foreground-bar-2: hsl(0, 0%, 13.3%);
		--foreground-bar: hsl(0, 0%, 9%);
		--foreground-2: hsl(0, 0%, 94%);
		--border: hsl(0, 0%, 94%);
		--text-low: hsl(0, 0%, 25%);
		--text-medium: hsl(0, 0%, 7%);
		--text-high: hsl(0, 0%, 0%);
		--accent: hsl(310, 30%, 70%);
	}

	html body {
		min-width: 424rem;
		max-width: 1200rem;
		padding: 40rem 20rem;
		margin: 0 auto;
		background: var(--background);
		font-size: 12rem;
		color: var(--text-low);
	}

	a {
		color: var(--text-medium) !important;
		text-decoration: none;
	} a:hover {
		color: var(--text-high) !important;
	}

	html *::selection {
		background-color: var(--accent);
	}

	body input,
	body textarea {
		background: var(--foreground-2);
		border: 1px solid var(--border);
		color: var(--text-medium);
		resize: vertical;
	}

	body input[type="submit"]:hover,
	body input[type="submit"]:active {
		cursor: pointer;
		border-color: var(--accent);
	}

	/* Header */

	body header {
		min-height: 20rem;
		padding-bottom: 40rem;
		text-align: center;
	}
	nav a {
		display: inline-block;
	}
	body .logo {
		display: none;
	}

	nav a[href="https://soundgasm.net/logout"] {
		font-size: 0;
	}
	nav a[href="https://soundgasm.net/logout"]::before {
		content: "Logout";
		font-size: 16px;
	}

	/* Multiple-page rules */

	body #container,
	.vl-container,
	body .sound-details,
	#jp_container_1,
	body .uploadform,
	body .contactform,
	body .loginform,
	body .signupform,
	body .passwordresetform,
	.vl-sidebar {
		background: var(--foreground-1);
		box-shadow:
			0 2rem 4rem var(--background),
			0 4rem 10rem hsla(0,0%,0%,10%);
		border-color: var(--border);
		margin: 0 auto;
	}

	#container h1,
	body h1 {
		border-color: var(--border);
		color: var(--text-low);
	}

	/* Generic Containers */

	body p.footer {
		border-color: var(--border);
	}

	body #container {
		max-width: 800rem;
	}

	.vl-container {
		max-width: 770rem;
		padding: 15rem;
		border-size: 1rem;
		margin: 30rem auto;
	}

	.vl-container-header {
		padding-bottom: 10rem;
		border-bottom: 1px solid var(--border);
		margin: 0 0 14rem;
		font-size: 16px;
		font-weight: normal;
	}

	.vl-column {
		display: flex;
		flex-flow: column nowrap;
		gap: 5rem 10rem;
		margin-bottom: 5rem;
		align-items: start;
	}

	.vl-link {
		color: var(--text-medium);
	}
	.vl-link:hover {
		color: var(--text-high);
		text-decoration: underline;
	}


	.vl-paragraph {
		margin: 0 0 5rem;
		font-size: 12rem;
		line-height: 1.35;
	}

	/* Home Page */

	.vl-user-list {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 5rem;
		justify-items: start;
		align-items: start;
	}

	/* User Page */

	body .sound-details {
		display: grid;
		width: calc(100% - 22rem);
		padding: 10rem;
		border-radius: 4rem;
		margin: 0 auto 12rem;
		grid-template-columns: 1fr 70rem;
		grid-template-rows: auto auto;
		grid-template-areas:
			"title plays"
			"description description";
		grid-auto-flow: column;
	}


	.sound-details > a {
		grid-area: title;
		justify-self: start;
		font-size: 16rem;
		font-weight: bold;
		white-space: normal;
	}

	.playCount {
		grid-area: plays;
		max-width: 70rem;
		margin-left: auto;
		text-align: right;
	}

	.playCount::before {
		content: "";
		display: inline-block;
		border-color: transparent;
		border-left-color: var(--text-low);
		border-style: solid;
		border-width: .45em .65em;
		margin-right: -0.4em;
		vertical-align: middle;
	}

	.soundDescription {
		grid-area: description;
		order: 3;
		width: 100%;
		margin-top: 6rem;
	}

	/* Split Content + Sidebar */

	.vl-split {
		display: grid;
		max-width: calc(640rem + 20rem + 240rem);
		gap: 20rem;
		margin: 0 auto;
	}

	.vl-directory {
		display: grid;
		width: 100vw;
		max-width: 620rem;
		grid-auto-flow: row;
		margin: 0 auto;
	}

	.vl-sidebar {
		padding: 10rem;
		border-radius: 4rem;
		overflow-y: auto;
	}

	@media (max-width: 941px) {
		.vl-split {
			grid-auto-flow: row;
		}
		.vl-sidebar {
			max-width: 600rem;
			max-height: 80vh;
			border: 1px solid var(--border);
		}
	}
	@media (min-width: 940px) {
		.vl-split {
			grid-auto-flow: column;
			align-items: start;
		}
		.vl-sidebar {
			position: sticky;
			top: 20rem;
			width: 220rem;
			max-height: calc(100vh - 160rem);
			order: 1;
		}
	}

	/* Filters */

	.vl-hidden,
	.vl-hidden-by-search,
	.vl-hidden-by-tag {
		display: none !important;
	}

	.vl-filters {
		font-size: 12rem;
	}

	.vl-filter-section {
		margin-bottom: 15rem;
	}

	.vl-filter-header {
		border-bottom: 1rem solid var(--border);
		margin: 0 0 10rem;
		font-size: 14rem;
		line-height: 1.25em;
		font-weight: bold;
	}

	.vl-sort-btn::before {
		content: "• ";
	}

	.vl-sort-btn.is-active {
		font-weight: bold;
	}
	.vl-sort-btn.is-active::after {
		content: attr(data-direction);
		color: var(--text-low);
		font-size: 10rem;
		margin-left: 5rem;
	}

	.vl-search {
		padding: 4rem;
		border-radius: 3px;
		margin: 0 0 5rem;
	}

	.vl-tag-list {
		width: 100%;
		text-align: left;
	}
	.vl-tag-list th {
		font-size: 12rem;
	}
	.vl-tag-list tr > *:last-child {
		text-align: right;
	}

	.vl-tag-btn {
		display: inline;
		padding: 2rem 4rem;
		background: none;
		border: none;
		border-radius: 2.5rem;
		color: var(--text-medium);
		font-size: 11rem;
		text-align: left;
		text-transform: capitalize;
		cursor: pointer;
	}
	.vl-tag-btn.is-active,
	.vl-tag-btn:hover {
		background: var(--foreground-2);
		color: var(--text-high);
	}
	.vl-tag-btn.is-active {
		font-weight: bold;
	}

	.vl-tag-count {
		padding: 1rem;
		font-size: 12rem;
	}

	/* Player Page */

	div[style="margin:10px 0"] {
		margin: 0 0 25rem !important;
		font-size: 18rem;
		text-align: center;
	}

	#jp_container_1,
	.jp-audio .jp-audio-stream,
	.jp-audio .jp-video {
		border: 2rem solid var(--border);
		color: var(--text-low);
	}
	#jp_container_1 {
		width: 420rem;
	}
	.jp-interface {
		background: var(--foreground-bar);
	}
	.jp-audio .jp-details {
		background: var(--foreground-bar-2);
	}
	.jp-details .jp-title {
		font-size: 12rem;
	}
	.light .jp-details .jp-title {
		color: var(--background);
	}
	.jp-description {
		padding: 0 10rem;
		font-size: 12rem;
	}

	/* Player */

	.jp-state-muted .jp-unmute {
		background: url("../image/jplayer.blue.monday.jpg") -60px -170px no-repeat;
	}
	.jp-state-muted .jp-unmute:focus {
		background: url("../image/jplayer.blue.monday.jpg") -79px -170px no-repeat;
	}

	#jp_container_1 button,
	.jp-gui .jp-seek-bar,
	.jp-gui .jp-play-bar,
	.jp-gui .jp-volume-bar,
	.jp-gui .jp-volume-bar-value {
		background-image: var(--icons);
	}

	.jp-gui .jp-progress {
		background: none;
		border-radius: 2.5rem;
	}

	.jp-progress .jp-seeking-bg {
		background: var(--icons) 0 -202px repeat-x;
		animation: seeking .8s ease-in-out infinite alternate;
	}
	@keyframes seeking {
		0% {
			opacity: 1;
		}
		100% {
			opacity: 0.3;
		}
	}

	.jp-gui .jp-volume-controls {
		width: 0;
	}

	.dark .jp-current-time, .dark .jp-duration {
		color: var(--text-medium);
	}
	.light .jp-current-time, .light .jp-duration {
		color: var(--background);
	}

	/* Description */

	.vl-desc-container {
		margin: 12rem 0 0;
	}
	.sound-details .vl-desc-container {
		display: inline;
		margin: 0;
	}

	.vl-desc-new, .vl-desc-raw {
		margin: 12rem 0;
	}
	.sound-details .vl-desc-new, .sound-details .vl-desc-raw:not([style*="none"]) {
		display: inline !important;
		white-space: normal;
	}

	.vl-tag {
		display: inline-block;
		padding: 2rem 4rem;
		background: var(--foreground-2);
		border-radius: 2.5rem;
		margin: 0 4rem 4rem 0;
		color: var(--text-medium);
		font-size: 11rem;
		text-transform: capitalize;
	}

	.vl-showraw {
		display: inline-block;
		opacity: 0.5;
	}
	.vl-showraw:hover {
		opacity: 1;
	}
	.jp-audio .vl-showraw {
		margin-bottom: 12rem;
	}
	.sound-details .vl-showraw {
		float: right;
	}

	/* Contact page */

	header + ul {
		width: 414rem;
		padding-left: 16rem;
		margin: 12rem auto;
		word-break: break-word;
	}


	/* Footer */

	.vl-footer {
		width: 420rem;
		margin: 0 auto;
		text-align: center;
		padding-top: 30rem;
	}

	.vl-footer a {
		padding: 0 15rem;
	}


	/* fixes */
	
	.patreon-widget {
		width: 300px !important;
		height: 36px !important;
	}
`;

document.documentElement.appendChild(css);

// Functions & Classes

function paragraph( text ){
	let p = document.createElement('p');
	p.className = 'vl-paragraph';
	p.textContent = text;
	return p;
}

var users = new class UserDatabase {
	constructor( ){
		let storage = GM_getValue('knownUsernames', '[]');
		this.names = JSON.parse(storage);
	}

	generateUserList( ){
		
	}

	add( name ){
		let index = this.names.indexOf(name);
		if( index === -1 ){
			this.names.push(name);
			this.save();
		}
	}

	remove( name ){
		let index = this.names.indexOf(name);
		if( index > -1 ){
			this.names.splice(index, 1);
			this.save();
		}
	}

	save( ){
		console.log('saving', JSON.stringify(this.names));
		GM_setValue('knownUsernames', JSON.stringify(this.names));
	}
}

class AudioListing {
	constructor({ element, titleSelector, descriptionSelector, playCountSelector = false, order = 0 }){
		// Process description
		let titleDestination = element.querySelector(titleSelector);
		let descDestination = element.querySelector(descriptionSelector);
		let desc = descDestination.textContent;
		let title = titleDestination.textContent;
		let originalTitle = title;
		let originalDesc = desc;
		let processedTitleDiv = document.createElement('span');
		let rawTitleDiv = document.createElement('span');
		let processedDescDiv = document.createElement('div');
		let rawDescDiv = document.createElement('p');
		let tagsDiv = document.createElement('div');
		let descDiv = document.createElement('p');
		let tags = new Set();
		// match all words inside brackets [] {}. also matches parentheses () but only for one-word sections to try and avoid false positives
		const extractTagsRegex = /[\[\{](.*?)[\]\}]|\(([^\s]+)\)/g;
		// same as the extraction regex but with extra whitespace matching rules
		const removeTagsRegex = /\s*(?:[\[\{].*?[\]\}]|\([^\s]+\))\s*/g;

		rawTitleDiv.textContent = title;
		rawTitleDiv.style.display = 'none';

		processedDescDiv.classList.add('vl-desc-container');
		tagsDiv.classList.add('vl-tags');
		descDiv.classList.add('vl-desc-new');
		processedDescDiv.appendChild(tagsDiv);
		processedDescDiv.appendChild(descDiv);

		rawDescDiv.classList.add('vl-desc-raw');
		rawDescDiv.textContent = desc;
		rawDescDiv.style.display = 'none';

		let combined = title + desc;
		var tagMatches = combined.matchAll(extractTagsRegex);

		for( let match of tagMatches ){
			let tag = match[1] === undefined ? match[2] : match[1];
			
			if( tag.length > 0 ){
				tags.add(tag);
			}
		}

		// remove tags from text
		title = title.replaceAll(removeTagsRegex, '')
		desc = desc.replaceAll(removeTagsRegex, '')

		// sort the tags by length
		tags = Array.from(tags);
		tags.sort( (a, b) => { return a.length - b.length; } );

		// create the element
		for( let i = 0; i < tags.length; i++ ){
			var tagSpan = document.createElement('span');
			tagSpan.classList.add('vl-tag');
			tagSpan.textContent = tags[i];
			tagsDiv.appendChild(tagSpan);
		}

		// Create "view raw" button
		var viewRawBtn = document.createElement('a');
		viewRawBtn.href = 'javascript:void(0);';
		viewRawBtn.classList.add('vl-showraw');
		viewRawBtn.textContent = 'Show raw.'
		viewRawBtn.onclick = ()=>{
			if( processedDescDiv.style.display === 'none' ){
				processedTitleDiv.style.display = 'inline';
				rawTitleDiv.style.display = 'none';
				processedDescDiv.style.display = 'block';
				rawDescDiv.style.display = 'none';
				viewRawBtn.textContent = 'Show raw.';
			} else {
				processedTitleDiv.style.display = 'none';
				rawTitleDiv.style.display = 'inline';
				processedDescDiv.style.display = 'none';
				rawDescDiv.style.display = 'block';
				viewRawBtn.textContent = 'Show processed.';
			}
		}

		// finish up with tags & description
		descDiv.textContent = desc.trim();
		processedTitleDiv.textContent = title.trim();

		// Add everything back to DOM unless it is identical
		if( title !== originalTitle || desc !== originalDesc ){
			titleDestination.replaceChildren(processedTitleDiv, rawTitleDiv);
			descDestination.replaceChildren(processedDescDiv, rawDescDiv, viewRawBtn);
		}

		// parse play count and change html
		let plays = false;
		if( playCountSelector ){
			// this if else and element.append are place here due to weird HTML bugs on the default website
			let playElement = element.querySelector(playCountSelector);
			if( !playElement ){
				plays = 0;
				playElement = document.createElement('span');
				playElement.className = 'playCount';
				playElement.textContent = 'unknown';
			}
			else {
				plays = playElement.textContent.split(': ')[1];

				let playText = String(plays);
				if( plays.length > 3 ) {
					playElement.title = `played ${plays} times`;
					playText = playText.substring(0, plays.length - 3) + 'k';
				}
				playElement.textContent = playText;
			}
			element.append(playElement);
		}

		// Assign variables for use in AudioDirectory classes
		this.element = element;
		this.title = title;
		this.description = desc;
		this.plays = plays;
		this.order = order;
		this.tags = tags;
	}
}

class AudioDirectory {
	constructor({ elements, titleSelector, descriptionSelector, playCountSelector = false, filterElement = false }){
		this.audios = []; // used to iterate through audio info
		this.tags = {}; // used as a reference for which items have which tags
		this.selectedTags = []; // used to keep track of current filters
		this.availableElements = []; // used to update tag counts in the sidebar
		this.tagButtons = []; // used to update tag counts in the sidebar

		// process all audios
		for( let index = 0; index < elements.length; index++ ){
			let audio = new AudioListing({
				element: elements[index],
				titleSelector: titleSelector,
				descriptionSelector: descriptionSelector,
				playCountSelector: playCountSelector,
				order: index
			});
			this.audios.push(audio);
			for( let tag of audio.tags ){
				let tagName = tag.toLowerCase();
				if(!( tagName in this.tags )){ this.tags[tagName] = []; }
				this.tags[tagName].push(audio.element);
			}
		}

		// intialise filters and sorting
		if( filterElement ){
			// set up DOM
			this.filterElement = filterElement;
			this.filterElement.classList.add('vl-filters');

			this.sortElement = document.createElement('div');
			this.sortElement.className = 'vl-filter-section';
			this.searchElement = document.createElement('div');
			this.searchElement.className = 'vl-filter-section';
			this.tagElement = document.createElement('div');
			this.tagElement.className = 'vl-filter-section';

			let sortHeader = document.createElement('h6');
			sortHeader.className = 'vl-filter-header';
			sortHeader.textContent = 'Sort by...';
			this.sortElement.append(sortHeader);

			let searchHeader = document.createElement('h6');
			searchHeader.className = 'vl-filter-header';
			searchHeader.textContent = 'Search...';
			this.searchElement.append(searchHeader);

			let tagHeader = document.createElement('h6');
			tagHeader.className = 'vl-filter-header';
			tagHeader.textContent = 'Filter by tag...';
			this.tagElement.append(tagHeader);

			this.sortList = document.createElement('div');
			this.sortList.className = 'vl-column';
			this.sortElement.append(this.sortList);

			this.tagList = document.createElement('table');
			this.tagList.className = 'vl-tag-list';
			this.tagList.insertAdjacentHTML("afterbegin", `
				<tr><th>Name</th><th>Count</th></tr>
			`);
			this.tagElement.append(this.tagList);

			// set up sorting
			this.calculatedSorts = {};
			this.sortButtons = {};

			this.createSortButton('Title', 'title', 'ascending');
			this.createSortButton('Play Count', 'plays', 'descending');
			this.createSortButton('Date', 'order', 'descending');

			this.sort();

			// set up search

			this.searchBar = document.createElement('input');
			this.searchBar.type = 'search';
			this.searchBar.className = 'vl-search';
			this.searchBar.placeholder = 'Search here.';
			this.searchElement.append(this.searchBar);
			this.searchElement.append(paragraph(`Search supports some basic operators. For example: "phrase" to require an exact string or word and -word to excluse a word. Un-quoted words are treated as OR.`));

			this.searchBar.addEventListener('input', ()=>{ this.search() });
			this.searchTimeout = setTimeout(null, 0);

			// set up tag filters

			let sortedTags = Object.keys(this.tags).sort((first,second)=>{
				// sort primarily by number of elements that match the tag with a secondary alphabetical sort 
				let tagCount = this.tags[second].length - this.tags[first].length
				let tagName = first < second ? -1 : first > second ? 1 : 0;
				return tagCount === 0 ? tagName : tagCount;
			});
			for( let tag of sortedTags ){
				this.createTagButton(tag);
			}

			// Append all workspace items to DOM
			this.filterElement.append(this.sortElement, this.searchElement, this.tagElement);
		}

		if( Object.keys(this.tags).length === 0 ){
			this.tagElement.remove();
		}
	}

	createSortButton( title, column, direction ){
		let button = document.createElement('a');
		button.href = 'javascript:void(0);';
		button.textContent = title;
		button.className = 'vl-sort-btn';
		button.dataset.column = column;
		button.dataset.direction = direction;

		button.addEventListener('click', ()=>{
			this.sort(column, direction);
		});
		this.sortList.append(button);
		this.sortButtons[column] = button;
	}

	createTagButton( tag ){
		let row = document.createElement('tr');
		let cell1 = document.createElement('td');
		let cell2 = document.createElement('td');

		let button = document.createElement('button');
		button.type = 'button';
		button.textContent = tag;
		button.className = 'vl-tag-btn';
		cell1.append(button)

		let count = this.tags[tag].length;
		let countElement = document.createElement('span');
		countElement.className = 'vl-tag-count';
		countElement.textContent = count;
		cell2.append(countElement);
		
		row.append(cell1, cell2);
		this.tagList.append(row);

		button.addEventListener('click', ()=>{
			let selected = this.selectedTags.indexOf(tag);
			if( selected > -1 ){
				button.classList.remove('is-active');
				this.selectedTags.splice(selected, 1);
			}
			else {
				button.classList.add('is-active');
				this.selectedTags.push(tag);
			}
			this.applySelectedTags();
		});
		this.tagButtons.push({
			'element': row,
			'tag': tag,
			'countElement': countElement
		});
	}

	sort( column = 'order', direction = 'descending' ){
		// flip direction if already sorting this way
		if( this?.sorted?.column === column && this?.sorted?.direction === direction ){
			direction = direction === 'descending' ? 'ascending' : 'descending';
		}

		this.sorted = { column, direction };

		for( let button of Object.values(this.sortButtons) ){
			if( button.dataset.column === column ){
				button.classList.add('is-active');
				button.dataset.direction = direction;
			}
			else {
				button.classList.remove('is-active');
			}
		}

		// if list was already sorted once, just re-use the previous sort
		let array = [];
		if( `${column}-${direction}` in this.calculatedSorts ){
			array = this.calculatedSorts[`${column}-${direction}`];
		}

		// if not sorted yet, choose correct function and sort
		else {
			// 'order' column gets sorted in reverse due to being front-facingly labelled as date
			let sortFunction = () => { throw new Error('unknown sort'); };
			if( column === 'plays' && direction === 'ascending'
			|| column === 'order' && direction === 'descending' ){
				sortFunction = (first, second) => { return first['value'] - second['value']; };
			}
			else if( column === 'plays' && direction === 'descending'
			|| column === 'order' && direction === 'ascending' ){
				sortFunction = (first, second) => { return second['value'] - first['value']; };
			}
			else if( column === 'title' && direction === 'ascending' ){
				sortFunction = (first, second) => {
					let a = first['value'];
					let b = second['value'];
					return (a < b) ? -1 : (a > b) ? 1 : 0;
				};
			}
			else if( column === 'title' && direction === 'descending' ){
				sortFunction = (first, second) => {
					let a = first['value'].toLowerCase();
					let b = second['value'].toLowerCase();
					return (b < a) ? -1 : (b > a) ? 1 : 0;
				};
			}

			for( let audio of this.audios ){
				array.push({'element': audio.element, 'value': audio[column]});
			}
			array.sort(sortFunction);

			this.calculatedSorts[`${column}-${direction}`] = array;
		}

		// apply sort to items using CSS 'order' values
		for( let i = 0; i < array.length; i++ ){
			array[i]['element'].style.order = i;
		}
	}

	search( ){
		clearTimeout(this.searchTimeout);

		// parse query
		const exclusionRegex = /(?:^|\s)+-(\w+)/g;
		const phraseRegex = /"([^"]+)"/g;
		let query = this.searchBar.value.toLowerCase();

		let failMatches = query.matchAll(exclusionRegex);
		let exclusions = Array.from(failMatches).map( match => match[1] );
		query = query.replaceAll(exclusionRegex, '').trim();

		let phraseMatches = query.matchAll(phraseRegex);
		let phrases = Array.from(phraseMatches).map( match => match[1] );
		query = query.replaceAll(phraseRegex, '').trim();

		let words = query.split(' ');

		this.searchTimeout = setTimeout(()=>{
			for( let audio of this.audios ){
				if( this.passesSearch(audio, phrases, words, exclusions) ){
					audio.element.classList.remove('vl-hidden-by-search');
					this.updateAvailableElements(audio.element);
				}
				else {
					audio.element.classList.add('vl-hidden-by-search');
					this.updateAvailableElements(audio.element);
				}
			}
			this.updateTagCounts();
		}, 350);
	}

	passesSearch( audioListing, phrases, words, exclusions ){
		console.log(phrases, words, exclusions);
		const title = audioListing.title.toLowerCase();
		const tags = audioListing.tags.join(' ').toLowerCase();
		const any = title + tags;

		// cannot match any exclusions
		for( let str of exclusions ){
			if( any.includes(str) ){
				return false;
			}
		}

		// must match all phrases
		for( let phrase of phrases ){
			if(! any.includes(phrase) ){
				return false;
			}
		}

		// can match any word
		for( let word of words ){
			if( any.includes(word) ){
				return true;
			}
		}
	}

	applySelectedTags( ){
		if( this.selectedTags.length === 0 ){
			for( let audio of this.audios ){
				audio.element.classList.remove('vl-hidden-by-tag');
				this.updateAvailableElements( audio.element );
			}
			this.updateTagCounts();
			return;
		}

		for( let audio of this.audios ){
			let passesAllTags = true;
			for( let tag of this.selectedTags ){
				if(! this.tags[tag].includes(audio.element) ){
					passesAllTags = false;
					break;
				}
			}
			if( passesAllTags ){
				audio.element.classList.remove('vl-hidden-by-tag');
				this.updateAvailableElements( audio.element );
			}
			else {
				audio.element.classList.add('vl-hidden-by-tag');
				this.updateAvailableElements( audio.element );
			}
		}
		this.updateTagCounts();
	}

	updateAvailableElements( element ){
		let index = this.availableElements.indexOf(element);
		let hidden = element.classList.contains('vl-hidden-by-tag') | element.classList.contains('vl-hidden-by-search')
		if( hidden && index > -1 ){
			this.availableElements.splice(index, 1);
		}
		else if( !hidden && index === -1 ){
			this.availableElements.push(element);
		}
	}

	updateTagCounts( ){
		for( let data of this.tagButtons ){
			let tag = data.tag;
			let availableCount = 0;
			for( let element of this.availableElements ){
				if( this.tags[tag].includes(element) ){
					availableCount++;
				}
			}

			if( availableCount > 0 ){
				data.countElement.textContent = availableCount;
				data.element.classList.remove('vl-hidden');
			}
			else {
				data.element.classList.add('vl-hidden');
			}
		}
	}
}

// Begin modifying page

function domLoaded() {
	// If content is blank
	let content = document.querySelector('body > div');
	if( content === null ) {
		let blank = document.createElement('div');
		blank.id = 'container';
		blank.innerHTML = `<div id="body"><p>There's nothing here.</p></div>`;
		document.body.appendChild(blank);
	}

	// Add footer
	let footer = document.createElement('footer');
	footer.classList.add('vl-footer');

	// Theme switcher
	let themeSwitcher = document.createElement('a');
	themeSwitcher.textContent = 'Theme';
	themeSwitcher.href = 'javascript:void(0);';
	themeSwitcher.onclick = function() {
		if(GM_getValue('theme', 'dark') === 'dark') {
			GM_setValue('theme', 'light');
			document.documentElement.classList.add('light');
			document.documentElement.classList.remove('dark');
		} else {
			GM_setValue('theme', 'dark');
			document.documentElement.classList.add('dark');
			document.documentElement.classList.remove('light');
		}
	};
	footer.appendChild(themeSwitcher);

	document.body.appendChild(footer);

	var path = window.location.pathname;

	// Per-page sections

	// Any page with a user as long as it has content
	if( content && path.startsWith('/u/') && path.split('/').length > 2 ){
		let username = path.split('/')[2];
		users.add(username);
	}

	// Homepage
	if( path === '/' ){
		document.querySelector('h1').textContent = 'Welcome to Soundgasm.net, improved!';

		let container = document.createElement('div');
		container.className = 'vl-container';
		container.style.marginBottom = '0';
		let header = document.createElement('h3');
		header.className = 'vl-container-header';
		header.textContent = 'Known user list.';
		container.append(header);

		if( users.names.length === 0 ){
			container.append(paragraph(`The script will remember usernames from the audio and user pages you visit. Once you've opened a few, you can always come back here to find them all!`));
		}
		else {
			let userList = document.createElement('div');
			userList.classList.add('vl-user-list');
			userList.style.fontSize = '14rem';

			for( let username of users.names.sort() ){
				let link = document.createElement('a');
				link.href = `/u/${username}`;
				link.textContent = `• ${username}`;
				link.className = 'vl-link';
				userList.append(link);
			}

			container.append(userList);
		}
		footer.insertAdjacentElement('beforebegin', container);
	}

	// User pages
	if( content && path.startsWith('/u/') && path.split('/').length < 4 ){
		// Prep DOM for filters
		let container = document.createElement('div');
		container.className = 'vl-split';

		let directory = document.createElement('main');
		directory.className = 'vl-directory';
		let sidebar = document.createElement('aside');
		sidebar.className = 'vl-sidebar';

		let frag = new DocumentFragment();
		let items = document.querySelectorAll('.sound-details');
		for( let item of items ){
			frag.append(item);
		}
		directory.append(frag);
		container.append(sidebar, directory);
		document.getElementsByTagName('footer')[0].insertAdjacentElement('beforebegin', container);
		
		// catch any oddities such as patron links and other things from descriptions
		let patreon = document.querySelector('.soundDescription .patreon-widget');
		if( patreon ){
			let container = document.createElement('div');
			container.className = 'vl-container';
			container.style.marginTop = '0';
			container.style.width = 'calc(100% - 30rem)';
			let header = document.createElement('h3');
			header.className = 'vl-container-header';
			header.textContent = 'Extra user info.';
			container.append(header, patreon);

			directory.style.order = '-1';
			directory.prepend(container);
		}

		// Process audio listings
		new AudioDirectory({
			elements: items,
			titleSelector: 'a',
			descriptionSelector: '.soundDescription',
			playCountSelector: '.playCount',
			filterElement: sidebar
		});
	}

	// Player page
	if( path.startsWith('/u/') && path.split('/').length > 3 ){
		// Add custom descriptions
		new AudioListing({
			element: document.querySelector('.jp-type-single'),
			titleSelector: '.jp-title',
			descriptionSelector: '.jp-description'
		});

		let stop = document.querySelector('.jp-stop');
		let title = document.querySelector('.jp-title');
		let author = document.querySelector('div[style="margin:10px 0"] a');
		let audio = document.querySelector('audio');

		// Keypress handler
		function setKeybinds() {
			window.addEventListener('keydown', (e) => {
				let k = e.key.toLowerCase();
				if(e.key === ' ') {
					e.preventDefault();
				}
			});

			window.addEventListener('keyup', (e) => {
				let k = e.key.toLowerCase();
				let ctrl = e.ctrlKey;

                let time = 5.0;
                if(ctrl){
                    time = 15.0;
                }

				if(k === 'p' || k === 'k' || k === ' ') {
					if(!audio.paused) {
					    audio.pause();
					} else {
					    audio.play();
					}
				}
				else if(k === 's') {
					stop.click();
				}
				else if(k === 'd') {
					document.querySelector('.dl').click();
				}
				else if(k === 'arrowleft') {
					audio.currentTime -= time;
				}
				else if(k === 'arrowright') {
					audio.currentTime += time;
				}
				else if(k === 'arrowup') {
					let newVol = audio.volume + 0.1;
					if(newVol > 1) {
						newVol = 1.0;
					}
					audio.volume = newVol;
				}
				else if(k === 'arrowdown') {
					let newVol = audio.volume - 0.1;
					if(newVol < 0) {
						newVol = 0.0;
					}
					audio.volume = newVol;
				}
				else if(k === '0') {
					audio.currentTime = 0.0;
				}
				else if(k === '1') {
					audio.currentTime = audio.duration / 10;
				}
				else if(k === '2') {
					audio.currentTime = audio.duration / 10 * 2;
				}
				else if(k === '3') {
					audio.currentTime = audio.duration / 10 * 3;
				}
				else if(k === '4') {
					audio.currentTime = audio.duration / 10 * 4;
				}
				else if(k === '5') {
					audio.currentTime = audio.duration / 10 * 5;
				}
				else if(k === '6') {
					audio.currentTime = audio.duration / 10 * 6;
				}
				else if(k === '7') {
					audio.currentTime = audio.duration / 10 * 7;
				}
				else if(k === '8') {
					audio.currentTime = audio.duration / 10 * 8;
				}
				else if(k === '9') {
					audio.currentTime = audio.duration / 10 * 9;
				}
			});
		}

		// Download button
		function addDownload() {
			let audio = document.querySelector('audio');
			let src = audio.getAttribute('src');
			let ext = src.split('.').pop();
			let dl = document.createElement('a');

			dl.classList.add('dl');
			footer.appendChild(dl);
			dl.href = src;
			dl.setAttribute("download", title.innerText + ' by ' + author.innerText + '.' + ext);
			dl.setAttribute("target", "_blank");
			dl.textContent = 'Download this audio';
		}
		function audioLoaded() {
			audio = document.querySelector('audio');
			if(audio !== null && audio.getAttribute('src') !== null) {
				// observer.disconnect();
				addDownload();
				setKeybinds();
			} else {
				setTimeout(audioLoaded, 100);
			}
		}

		// Wait for audio to load
		if(audio !== null && audio.getAttribute('src') !== null) {
			addDownload();
		} else {
			audioLoaded();
		}
	}

	// signup page
	if(window.location.pathname.startsWith('/signup')) {
		let h1 = document.querySelector('h1');
		let form = document.querySelector('.signupform');
		form.prepend(h1);
	}
}