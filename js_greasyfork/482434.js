// ==UserScript==
// @name Always HD
// @namespace https://greasyfork.org/en/users/670188-hacker09?sort=daily_installs
// @version 7
// @description Makes the website always play the video in HD.
// @author hacker09
// @match *://*/*view_video.php?viewkey=*
// @run-at document-end
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/482434/Always%20HD.user.js
// @updateURL https://update.greasyfork.org/scripts/482434/Always%20HD.meta.js
// ==/UserScript==

document.querySelector(".mgp_quality.mgp_optionsList li").dispatchEvent(new Event('mouseup', { 'bubbles': true, 'cancelable': true }));