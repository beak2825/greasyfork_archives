// ==UserScript==
// @name         Remove Reddit Comments
// @namespace    http://tampermonkey.net/
// @version      2024-08-01
// @description  Removes Reddit Comments
// @author       You
// @match        https://www.reddit.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/502409/Remove%20Reddit%20Comments.user.js
// @updateURL https://update.greasyfork.org/scripts/502409/Remove%20Reddit%20Comments.meta.js
// ==/UserScript==

// Go to your user profile page before running this script
// https://www.reddit.com/user/spez/

let postAge = 30; // Delete posts older than X days
let authorName = "spez"; // Your account username
let postData = "Lorem ipsum dolor sit amet"; // Text to replace posts with before deleting it

// Used to add waits in milliseconds to account for website loading time
const delay = ms => new Promise(res => setTimeout(res, ms));

async function deletePosts() {

    let url = window.location.href;
    let userUrl = /(http|https):\/.*reddit.com\/user\/.*($|\/$)/; // https://www.reddit.com/user/spez/
    let postUrl = /(http|https):\/.*reddit.com\/r\/.*\/comments\/.*\/comment\/.*($|\/$)/; // // https://www.reddit.com/r/reddit/comments/145bram/comment/jnk45rr/

    if (url.match(userUrl)) {
        await delay(3000);

        // Make sure there are posts on the user profile page
        if (document.querySelector('shreddit-profile-comment') !== null ) {

            // Store all visible posts as an array to loop through later
            let userPosts = document.querySelectorAll('shreddit-profile-comment');

            let i;
            for (i = 0; i < userPosts.length; i++) {
                let todayDate = new Date();
                let postDate = Date.parse( userPosts[i].querySelector('time').getAttribute('datetime') );
                // Calculating the number of days between the two dates
                let dateDiff = Math.ceil((todayDate - postDate) / 86400000);

                if (dateDiff <= postAge) {
                    // Hide posts that are too new to make room for older posts to be loaded
                    userPosts[i].style.display = "none";
                } else {
                    // Post is old enough to be deleted
                    // Click edit post button to be taken to the post page
                    userPosts[i].querySelector('shreddit-comment-action-row > shreddit-overflow-menu').shadowRoot.querySelector('faceplate-dropdown-menu > faceplate-menu > faceplate-tracker[noun="edit"] > li > a').click();
                    await delay(3000);
                    // Make sure there are posts from your username on the post page
                    if (document.querySelector('shreddit-comment[author="' + authorName + '"]') !== null) {
                        // Store all visible posts from your username as an array to loop through later
                        let userPosts = document.querySelectorAll('shreddit-comment[author="' + authorName + '"]');

                        let i;
                        for (i = 0; i < userPosts.length; i++) {
                            let todayDate = new Date();
                            let postDate = Date.parse( userPosts[i].querySelector('time').getAttribute('datetime') );
                            // Calculating the number of days between the two dates
                            let dateDiff = Math.ceil((todayDate - postDate) / 86400000);

                            if (dateDiff > postAge) {
                                // Post is old enough to be deleted
                                try {
                                    // Click edit post button to get the edit comment text area
                                    userPosts[i].querySelector('shreddit-comment-action-row > shreddit-overflow-menu').shadowRoot.querySelector('faceplate-dropdown-menu > faceplate-menu > faceplate-tracker[noun="edit"] > li > div').click();
                                    await delay(1000);
                                    // Edit the post comment
                                    document.querySelector('shreddit-comment shreddit-composer').shadowRoot.querySelector('shreddit-markdown-composer').shadowRoot.querySelector('textarea').value = postData;
                                    await delay(1000);
                                    // Click save edits button
                                    document.querySelector('shreddit-comment shreddit-composer > button[type="submit"]').click();
                                    await delay(1000);
                                    // Click delete button
                                    userPosts[i].querySelector('shreddit-comment-action-row > shreddit-overflow-menu').shadowRoot.querySelector('faceplate-dropdown-menu > faceplate-menu > faceplate-tracker[noun="delete"] > li > div').click();
                                    await delay(1000);
                                    // Click delete button in confirmation modal
                                    document.querySelector("#comment-deletion-modal").shadowRoot.querySelector("#deleteBtn").click();
                                    await delay(3000);
                                } catch(err) {
                                    // Error encountered, usually with selecting a shadowRoot element
                                    // Go back to the profile page and reload to restart the script
                                    document.querySelector('#user-drawer-content faceplate-tracker[noun="profile"] > li > a').click();
                                    location.reload();
                                }
                            }

                        }


                    }
                }


            }

            // Went though all the posts that were visible on the user profile page
            // Go back to the profile page and reload to find more posts to delete
            document.querySelector('#user-drawer-content faceplate-tracker[noun="profile"] > li > a').click();
            location.reload();
        }

    }

}

deletePosts();