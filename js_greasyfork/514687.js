// ==UserScript==
// @name         Strava Auto Authorize Apps
// @namespace    typpi.online
// @description  Auto allows Strava apps without having to click "authorize" every single time.
// @author       Nick2bad4u
// @match        https://www.strava.com/oauth/authorize*
// @resource     https://www.google.com/s2/favicons?sz=64&domain=strava.com
// @icon         https://www.google.com/s2/favicons?sz=64&domain=strava.com
// @icon64       https://www.google.com/s2/favicons?sz=64&domain=strava.com
// @version      2.4
// @grant        none
// @homepageURL  https://github.com/Nick2bad4u/UserStyles
// @supportURL   https://github.com/Nick2bad4u/UserStyles/issues
// @license      Unlicense
// @downloadURL https://update.greasyfork.org/scripts/514687/Strava%20Auto%20Authorize%20Apps.user.js
// @updateURL https://update.greasyfork.org/scripts/514687/Strava%20Auto%20Authorize%20Apps.meta.js
// ==/UserScript==

setTimeout(function () {
	document.getElementsByClassName('btn')[0].click();
}, 1000);
