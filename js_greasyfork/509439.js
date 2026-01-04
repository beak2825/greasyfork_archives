// ==UserScript==
// @name        Forum Jumper - automatically jump down the last post on a traditional forum page.
// @namespace   dhaden
// @description On page load, auto-scroll to the bottom of a scrolling page of forum posts, then jump back up a little so you can see the final post.
// @match       https://www.sevenforums.com/general-discussion/*
// @grant       none
// @version     1.0
// @author      dhaden
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/509439/Forum%20Jumper%20-%20automatically%20jump%20down%20the%20last%20post%20on%20a%20traditional%20forum%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/509439/Forum%20Jumper%20-%20automatically%20jump%20down%20the%20last%20post%20on%20a%20traditional%20forum%20page.meta.js
// ==/UserScript==

// ! Change the @match URL to your chosen old-school forum.

// Set up a timeout
window.setTimeout( () => {
// Inside the timeout, do the cool stuff! Have the Web page jump down to your chosen DIV, as identified by the #keyword the DIV inside it somewhere.
    document.querySelector('#below_postlist').scrollIntoView();
// Because we've overshot the mark a little by doing this, we then have the page scroll back up by 500 pixels.
    window.scrollBy(0, -500);
// The one second timeout setting lives down here - 1000 milliseconds = 1 second. This gives the forum page time to load.
}, 1000);