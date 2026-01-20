// ==UserScript==
// @name        Letterboxd Auto-Follow Auto-like
// @description Adds a button to auto-follow users and auto-like reviews on dedicated pages for Letterboxd
// @version     1.8.1
// @author      asadiqui
// @namespace   http://asadiqui.dev/letterboxd
// @icon        https://www.google.com/s2/favicons?sz=64&domain=letterboxd.com
// @match       https://letterboxd.com/film/*/fans/
// @match       https://letterboxd.com/film/*/fans/page/*/
// @match       https://letterboxd.com/film/*/likes/
// @match       https://letterboxd.com/film/*/likes/page/*/
// @match       https://letterboxd.com/film/*/members/
// @match       https://letterboxd.com/film/*/members/page/*/
// @match       https://letterboxd.com/film/*/members/rated/*/
// @match       https://letterboxd.com/film/*/members/rated/*/page/*/
// @match       https://letterboxd.com/film/*/members/rated/*/by/rating/
// @match       https://letterboxd.com/film/*/members/rated/*/by/rating/page/*/
// @match       https://letterboxd.com/*/followers/
// @match       https://letterboxd.com/*/followers/page/*/
// @match       https://letterboxd.com/*/following/
// @match       https://letterboxd.com/*/following/page/*/
// @match       https://letterboxd.com/*/film/*/likes/
// @match       https://letterboxd.com/*/film/*/likes/page/*/
// @match       https://letterboxd.com/activity/
// @match       https://letterboxd.com/*/friends/film/*/reviews/
// @match       https://letterboxd.com/*/friends/film/*/reviews/page/*/
// @match       https://letterboxd.com/*/friends/film/*/reviews/rated/*/
// @match       https://letterboxd.com/*/friends/film/*/reviews/rated/*/page/*/
// @match       https://letterboxd.com/film/*/reviews/
// @match       https://letterboxd.com/film/*/reviews/page/*/
// @match       https://letterboxd.com/film/*/reviews/by/added/
// @match       https://letterboxd.com/film/*/reviews/by/added/page/*/
// @match       https://letterboxd.com/*/films/reviews/
// @match       https://letterboxd.com/*/films/reviews/page/*/
// @grant       none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/534538/Letterboxd%20Auto-Follow%20Auto-like.user.js
// @updateURL https://update.greasyfork.org/scripts/534538/Letterboxd%20Auto-Follow%20Auto-like.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to add the auto-follow / auto-like button
    function addAutoFollowButton() {
        const button = document.createElement('button');
        button.textContent = 'Auto-Like / Auto-Follow';
        button.style.position = 'fixed';
        button.style.top = '10px';
        button.style.right = '10px';
        button.style.zIndex = '9999';
        button.style.padding = '10px 20px';
        button.style.backgroundColor = '#ffcc00';
        button.style.color = '#000';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.addEventListener('click', function() {
            // Function to select which action to take on click
            const autoLikeRegex = new RegExp(
                `^https:\/\/letterboxd\.com(` +
                `\/activity\/|` +
                `\/.*\/friends\/film\/.*\/reviews\/|` +
                `\/.*\/friends\/film\/.*\/reviews\/page\/.*\/|` +
                `\/.*\/friends\/film\/.*\/reviews\/rated\/.*\/|` +
                `\/.*\/friends\/film\/.*\/reviews\/rated\/.*\/page\/.*\/|` +
                `\/film\/.*\/reviews\/|` +
                `\/film\/.*\/reviews\/page\/.*\/|` +
                `\/film\/.*\/reviews\/by\/added\/|` +
                `\/film\/.*\/reviews\/by\/added\/page\/.*\/|` +
                `\/.*\/films\/reviews\/|` +
                `\/.*\/films\/reviews\/page\/.*\/` +
                `)$`
            );
			// Check if the current URL matches the auto-like regex
            if (autoLikeRegex.test(window.location.href)) {
                startAutoLike();
            } else {
                startAutoFollow();
            }
        });
        document.body.appendChild(button);
    }

    // Function to auto-follow all users on a page
    async function startAutoFollow() {
        document.querySelectorAll('.js-button-follow').forEach(btn => btn.click());
        alert("All users followed!");
    }

    // Function to auto-like all reviews on a page
    async function startAutoLike() {
        document.querySelectorAll('._trigger_129r2_1:not(._-is-liked_129r2_8)').forEach(btn => btn.click());
        alert("All reviews liked!");
    }

    // Add the button when the page loads
    if (document.readyState === 'complete') {
        addAutoFollowButton();
    } else {
        window.addEventListener('load', () => {
            addAutoFollowButton();
        });
    }
})();
