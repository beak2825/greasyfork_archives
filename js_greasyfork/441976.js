// ==UserScript==
// @name MAM Banner Shrink
// @namespace yyyzzz999
// @author yyyzzz999
// @description (6/9/22) Makes it easier to scroll past banner with out removing it.
// @match https://www.myanonamouse.net/*
// @version 0.5
// @icon  https://cdn.myanonamouse.net/imagebucket/164109/3m64.png
// @license MIT
// @grant none
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/441976/MAM%20Banner%20Shrink.user.js
// @updateURL https://update.greasyfork.org/scripts/441976/MAM%20Banner%20Shrink.meta.js
// ==/UserScript==
// Many Thanks to GardenShade for advice, testing, and code contributions!
/*jshint esversion: 6 */
/*eslint no-multi-spaces:0 */ //stop pestering me 'cause I learned to type with double spaces!

// Someday maybe add a resize or hover zoom option...
// https://medium.com/the-z/making-a-resizable-div-in-js-is-not-easy-as-you-think-bda19a1bc53d

document.getElementById("msb").style.height = "100%"; // Banner area will now match image height!
document.getElementById("msb").getElementsByTagName('img')[0].height = "100"; 
/* Original height 176.  Change 100 to what ever you like, even to magnify rather than shrink.  
   88 (50%) makes the text harder to read, and 132 is 75% original size.
*/