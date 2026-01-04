// ==UserScript==
// @name         Belegger.nl
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Belegger.nl - script
// @author       You
// @match        https://www.belegger.nl/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431260/Beleggernl.user.js
// @updateURL https://update.greasyfork.org/scripts/431260/Beleggernl.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const localStorageKey = 'beleggerApp';

    /**
     * Gets all forum post elements
     */
    function getPostsOnPage() {
        return document.getElementsByClassName('ForumPost');
    }

    /**
     * Updates visible/hidden posts on the page
     */
    function hidePosts() {
        const forumPosts = getPostsOnPage();
        const ignoredUserIds = getIgnoredUserIds();

        Array.from(forumPosts).forEach(fp => {
            const postUserId = getUserIdFromPost(fp);

            if(ignoredUserIds.includes(postUserId)) {
                fp.style.display = 'none';
            } else {
                fp.style.removeProperty('display');
            }
        });
    }

    /**
     * Gets an array of ignored user ids
     */
    function getIgnoredUserIds() {
        const ignoredMembersString = localStorage.getItem(localStorageKey);
        if(ignoredMembersString != null) {
            return JSON.parse(ignoredMembersString);
        } else {
            return [];
        }
    }

    /**
     * Checks whether the given user id is in the ignore list
     */
    function isIgnored(userId) {
        return getIgnoredUserIds().includes(userId);
    }

    /**
     * Adds the user id to the ignore list
     */
    function ignoreUser(userId) {
        const ignoredUserIds = getIgnoredUserIds();
        ignoredUserIds.push(userId);

        localStorage.setItem(localStorageKey, JSON.stringify(ignoredUserIds));
    }

    /**
     * Removes a user from the ignore list
     * @param userId 
     */
    function unignoreUser(userId) {
        const ignoredUserIds = getIgnoredUserIds();
        const newIgnoredUserIds = ignoredUserIds.filter(id => id !== userId);

        localStorage.setItem(localStorageKey, JSON.stringify(newIgnoredUserIds));
    }

    /**
     * Gets the username from a post element
     */
    function getUsernameFromPost(postEl) {
        return postEl.querySelector('.UserInfo .UserName');
    }


    /**
     * Gets the user id from a post element
     */
    function getUserIdFromPost(postEl) {
        const firstLink = postEl.querySelector('.UserData a:first-child');

        const lidIdMatch = firstLink.href.match(/Leden\/(?<userId>\d+)/);
        if(lidIdMatch != null && lidIdMatch.groups && lidIdMatch.groups.userId) {
            return lidIdMatch.groups.userId;
        } else {
            return 0;
        }
    }

    // Get all posts
    const forumPosts = getPostsOnPage();

    const members = Array.from(forumPosts).map(fp => {
        const usernameEl = getUsernameFromPost(fp);
        const userId = getUserIdFromPost(fp);

        if(userId > 0) {
            return {
                userId: userId,
                username: usernameEl.innerText
            };
        } else {
            return null;
        }
    })
    .filter(member => member != null);


    const uniqueMembers = [];
    members.forEach(m => {
        if(!uniqueMembers.some(uniqueMember => uniqueMember.userId === m.userId)) {
            uniqueMembers.push(m);
        }
    });

    uniqueMembers.sort((a, b) => a.username.localeCompare(b.username));

    console.log(uniqueMembers);

    function createElementFromHTMLString(htmlString) {
        var div = document.createElement('div');
        div.innerHTML = htmlString.trim();

        // Change this to div.childNodes to support multiple top-level nodes
        return div.firstChild;
    }

    window.onIgnoreToggle = function(el, a) {
        if(el.checked === true) {
            ignoreUser(el.value);
        } else {
            unignoreUser(el.value);
        }

        hidePosts();
    }


    const appContainer = createElementFromHTMLString('<div style="position: fixed; left: 0px; bottom: 0px; background-color: #eee; border: 1px solid #ddd; width: 300px; padding: 6px; max-height: 600px; overflow: auto;"></div>');

    uniqueMembers.forEach(m => {
        var row = createElementFromHTMLString(`<div style="padding: 1px"><input type="checkbox" value="${m.userId}" name="${m.username}" style="margin-right: 8px;" onclick="onIgnoreToggle(this);"/><label for="${m.username}">${m.username}</label></div>`);

        if(isIgnored(m.userId)) {
            row.querySelector('input').checked = 'checked';
        }

        appContainer.appendChild(row);
    });

    document.getElementById('aspnetForm').appendChild(appContainer);
    hidePosts();
    // Your code here...
})();