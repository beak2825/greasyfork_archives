// ==UserScript==
// @name                Reddit random subreddit
// @namespace           https://greasyfork.org/users/821661
// @match               https://www.reddit.com/*
// @match               https://old.reddit.com/*
// @grant               GM_registerMenuCommand
// @run-at              document-start
// @version             2.1
// @author              hdyzen
// @description         this script simulates the "/r/random" removed from reddit
// @license             GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/527473/Reddit%20random%20subreddit.user.js
// @updateURL https://update.greasyfork.org/scripts/527473/Reddit%20random%20subreddit.meta.js
// ==/UserScript==

const randomURL = "https://reddit-random-subreddit-lwnqep0le-zenstorages-projects.vercel.app/"

GM_registerMenuCommand("Random (😇SFW, 🔞NSFW)", () => window.location.href = `${randomURL}`)
GM_registerMenuCommand("Random (😇SFW only)", () => window.location.href = `${randomURL}?nsfw=0`)
GM_registerMenuCommand("Random (🔞NSFW only)", () => window.location.href = `${randomURL}?nsfw=1`)