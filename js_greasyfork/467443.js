// ==UserScript==
// @name         Orange Modmail
// @version      0.1
// @description  Change the Reddit Modmail icon/outline orange when you have mail so it's easier to notice.
// @author       Bawdy Ink Slinger
// @match        https://www.reddit.com/*
// @match        https://old.reddit.com/*
// @match        https://new.reddit.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant        GM_addStyle
// @license MIT
// @namespace https://greasyfork.org/users/1086961
// @downloadURL https://update.greasyfork.org/scripts/467443/Orange%20Modmail.user.js
// @updateURL https://update.greasyfork.org/scripts/467443/Orange%20Modmail.meta.js
// ==/UserScript==

const orangeFilter = `filter: brightness(0) saturate(100%) invert(57%) sepia(45%) saturate(5111%) hue-rotate(360deg) brightness(101%) contrast(106%);`

GM_addStyle(`#new_modmail.havemail { ${orangeFilter}`)
GM_addStyle(`#Header--Moderation > div > span + .icon-mod { ${orangeFilter}`)
