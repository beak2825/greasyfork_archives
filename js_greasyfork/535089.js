// ==UserScript==
// @name         Auto Like & Follow Instagram Feed + UI + Persist
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Automatically like and follow posts on Instagram feed with toggle UI and persistent settings.
// @match        https://www.instagram.com/
// @author       Teja Sukmana
// @icon         https://www.google.com/s2/favicons?sz=64&domain=instagram.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535089/Auto%20Like%20%20Follow%20Instagram%20Feed%20%2B%20UI%20%2B%20Persist.user.js
// @updateURL https://update.greasyfork.org/scripts/535089/Auto%20Like%20%20Follow%20Instagram%20Feed%20%2B%20UI%20%2B%20Persist.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let countL = 0;
    let countF = 0;
    const maxLikesPerSession = 500;
    const maxFollowsPerSession = 500;
    const sessionBreakTime = 15 * 60 * 1000;

    // Load from localStorage or set default
    let enableLiking = localStorage.getItem('enableLiking') !== 'false';
    let enableFollowing = localStorage.getItem('enableFollowing') !== 'false';

    function createToggleUI() {
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '6%';
        container.style.right = '10px';
        container.style.zIndex = '9999';
        container.style.background = 'rgba(0,0,0,.6)';
        container.style.border = '1px solid #ccc';
        container.style.borderRadius = '8px';
        container.style.padding = '10px';
        container.style.boxShadow = '0 0 10px rgba(0,0,0,0.2)';
        container.style.fontFamily = 'Arial, sans-serif';

        container.innerHTML = `
            <label><input type="checkbox" id="likeToggle"> Enable Like</label><br>
            <label><input type="checkbox" id="followToggle"> Enable Follow</label><br>
            <a href="https://instagram.com/kohardsi">More Tools</a>
        `;

        document.body.appendChild(container);

        const likeCheckbox = document.getElementById('likeToggle');
        const followCheckbox = document.getElementById('followToggle');

        likeCheckbox.checked = enableLiking;
        followCheckbox.checked = enableFollowing;

        likeCheckbox.addEventListener('change', function () {
            enableLiking = this.checked;
            localStorage.setItem('enableLiking', enableLiking);
            console.log("Liking: " + (enableLiking ? "Enabled" : "Disabled"));
        });

        followCheckbox.addEventListener('change', function () {
            enableFollowing = this.checked;
            localStorage.setItem('enableFollowing', enableFollowing);
            console.log("Following: " + (enableFollowing ? "Enabled" : "Disabled"));
        });
    }

    function getRandomTime(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min) * 1000;
    }

    function isFollowButton(button) {
        return button.querySelector('div[dir="auto"]')?.innerText === 'Ikuti';
    }

    function likeAndFollowFeedPosts() {
        if ((countL >= maxLikesPerSession && enableLiking) || (countF >= maxFollowsPerSession && enableFollowing)) {
            console.log("Reached max likes or follows for this session. Taking a break.");
            setTimeout(() => {
                countL = 0;
                countF = 0;
                likeAndFollowFeedPosts();
            }, sessionBreakTime);
            return;
        }

        if (enableLiking) {
            let likeButtons = document.querySelectorAll('svg[aria-label="Suka"]');
            likeButtons.forEach((likeButton) => {
                if (countL < maxLikesPerSession) {
                    let button = likeButton.closest('div[role="button"]');
                    if (button) {
                        button.click();
                        countL++;
                    }
                }
            });
        }

        if (enableFollowing) {
            let followButtons = document.querySelectorAll('button');
            followButtons.forEach((followButton) => {
                if (countF < maxFollowsPerSession && isFollowButton(followButton)) {
                    followButton.click();
                    countF++;
                }
            });
        }

        console.log("Total Likes: " + countL + " | Total Follows: " + countF);

        window.scrollBy(0, 550);

        setTimeout(likeAndFollowFeedPosts, getRandomTime(5, 15));
    }

    function likeAndFollowIndividualPosts() {
        if ((countL >= maxLikesPerSession && enableLiking) || (countF >= maxFollowsPerSession && enableFollowing)) {
            console.log("Reached max likes or follows for this session. Taking a break.");
            setTimeout(() => {
                countL = 0;
                countF = 0;
                likeAndFollowIndividualPosts();
            }, sessionBreakTime);
            return;
        }

        if (enableLiking) {
            let likeButton = document.querySelector('svg[aria-label="Suka"]');
            if (likeButton && countL < maxLikesPerSession) {
                let button = likeButton.closest('div[role="button"]');
                if (button) {
                    button.click();
                    countL++;
                }
            }
        }

        if (enableFollowing) {
            let followButton = document.querySelector('button');
            if (followButton && countF < maxFollowsPerSession && isFollowButton(followButton)) {
                followButton.click();
                countF++;
            }
        }

        console.log("Total Likes: " + countL + " | Total Follows: " + countF);

        let nextButton = document.querySelector('._aaqg button');
        if (nextButton) {
            nextButton.click();
        }

        setTimeout(likeAndFollowIndividualPosts, getRandomTime(10, 30));
    }

    createToggleUI();

    if (location.href === 'https://www.instagram.com/') {
        likeAndFollowFeedPosts();
    } else {
        likeAndFollowIndividualPosts();
    }
})();