// ==UserScript==
// @name         Gelbooru Respect Tag Blacklist Everywhere
// @namespace    http://tampermonkey.net/
// @version      6.3.3
// @description  Properly hides image thumbnails that have user-blacklisted tags on Profile pages, Wiki entries, other users' Favorites pages, and the Comments tab.
// @author       Xerodusk
// @homepage     https://greasyfork.org/en/users/460331-xerodusk
// @license      GPL-3.0-or-later
// @match        https://gelbooru.com/index.php*page=account*s=profile*
// @match        https://gelbooru.com/index.php*page=favorites*
// @match        https://gelbooru.com/index.php*page=wiki*s=view*
// @match        https://gelbooru.com/index.php*page=comment*s=list*
// @grant        none
// @icon         https://gelbooru.com/favicon.png
// @downloadURL https://update.greasyfork.org/scripts/405185/Gelbooru%20Respect%20Tag%20Blacklist%20Everywhere.user.js
// @updateURL https://update.greasyfork.org/scripts/405185/Gelbooru%20Respect%20Tag%20Blacklist%20Everywhere.meta.js
// ==/UserScript==
/* jshint esversion: 6 */

/*   configuration   */

// Whether to hide blacklisted image placeholders on the page. You will be prompted about this the first time the script blocks something.
// If true:  Will blur out blacklisted images, but not remove them completely (like main gallery pages)
// If false: Will completely remove blacklisted image thumbnails from the page (like search pages)
const removeBlacklistedThumbnailsEntirely = JSON.parse(localStorage.getItem('removeBlacklistedThumbnailsEntirely') || 'false');

/*-------------------*/

// Get cookie by name
// From https://www.w3schools.com/js/js_cookies.asp
// Modified by me to fix bugs
function getCookie(cname) {
    'use strict';

    var name = cname + "=";
    var cookie = document.cookie.split(';');
    var ca = cookie.map(item => decodeURIComponent(item));
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return '';
}

// Get tag blacklist as list of strings
function GetBlockedTags() {
    'use strict';

    // Get blocked tags string from cookie
    let blockedTags = getCookie('tag_blacklist');
    blockedTags = htmlDecode(blockedTags).replace(/%20/g, ' ');

    // Split tags into list
    blockedTags = blockedTags.split(' ');

    return blockedTags;
}

// Get current user's user ID, if exists
function getUserID() {
    'use strict';

    // Get user ID from cookie
    const userID = window.Cookie.get('user_id');

    return userID ? parseInt(userID) : -1;
}

// Decode encoded characters in tags for proper matching
function htmlDecode(input) {
    'use strict';

    const tempElem = document.createElement('div');
    tempElem.innerHTML = input;
    return tempElem.childNodes.length === 0 ? '' : tempElem.childNodes[0].nodeValue;
}

// Get tags list for image thumbnail as list of strings
function GetImageTags(imageThumb) {
    'use strict';

    const tagsString = imageThumb.getElementsByTagName('img')[0].getAttribute('title') || imageThumb.getElementsByTagName('img')[0].getAttribute('alt') || [];
    const tagsList = htmlDecode(tagsString).trim().split(' ');

    return tagsList;
}

// Set whether to show notification toast
function setStopShowingToast() {
    'use strict';

    const storageData = {
        value: true,
        expiration: (new Date()).getTime() + 1000 * 60 * 60 * 24 * 30, // Setting expires after 30 days
    };
    localStorage.setItem('doNotShowBlacklistedNotification', JSON.stringify(storageData));
}

// Get whether user has opted to stop seeing notification toast
function stopShowingToast() {
    'use strict';

    // Get data if exists
    const storedData = JSON.parse(localStorage.getItem('doNotShowBlacklistedNotification'));
    if (!storedData) {
        return null;
    }

    // Check if expired
    if ((new Date()).getTime() > storedData.expiration) {
        localStorage.removeItem('doNotShowBlacklistedNotification');
        return null;
    }

    return storedData.value;
}

// Create notification toast
function createToast(count) {
    'use strict';

    // Check whether user has opted to stop seeing these
    if (stopShowingToast()) {
        return;
    }

    // Create toast
    const toast = document.createElement('div');
    toast.id = 'blacklist-notification';
    toast.classList.add('toast');
    const toastTextContainer = document.createElement('div');
    toastTextContainer.classList.add('toast-text-container');

    const firstLine = document.createElement('div');
    firstLine.appendChild(document.createTextNode(count + ' blacklisted ' + (count === 1 ? 'image ' : 'images ') + (removeBlacklistedThumbnailsEntirely ? 'removed.' : 'hidden.')));
    const hideOptionButton = document.createElement('a');
    hideOptionButton.id = 'blacklist-toggle-hide-option';
    hideOptionButton.classList.add('toast-action');
    hideOptionButton.appendChild(document.createTextNode(removeBlacklistedThumbnailsEntirely ? 'Blur Only' : 'Remove Entirely'));
    hideOptionButton.href = 'javascript:void(0)';
    hideOptionButton.onclick = () => {
        localStorage.setItem('removeBlacklistedThumbnailsEntirely', !removeBlacklistedThumbnailsEntirely);
        location.reload();
    };
    firstLine.appendChild(hideOptionButton);

    const secondLine = document.createElement('div');
    const stopShowingButton = document.createElement('a');
    stopShowingButton.classList.add('toast-action');
    stopShowingButton.appendChild(document.createTextNode('Do not show this again'));
    stopShowingButton.href = 'javascript:void(0)';
    stopShowingButton.onclick = () => {
        setStopShowingToast();
        toast.remove();
    };
    secondLine.appendChild(stopShowingButton);

    const closeButtonContainer = document.createElement('div');
    closeButtonContainer.id = 'blacklist-toast-close-button-container';
    const closeButton = document.createElement('a');
    closeButton.id = 'blacklist-toast-close-button';
    closeButton.appendChild(document.createTextNode('\u2573'));
    closeButton.href = 'javascript:void(0)';
    closeButton.onclick = () => toast.remove();
    closeButtonContainer.appendChild(closeButton);

    toastTextContainer.appendChild(firstLine);
    toastTextContainer.appendChild(secondLine);
    toast.appendChild(toastTextContainer);
    toast.appendChild(closeButtonContainer);

    document.body.appendChild(toast);

    // Toast styling
    const css = document.createElement('style');
    css.appendChild(document.createTextNode(`
        .toast {
            position: fixed;
            bottom: 35px;
            left: 50%;
            transform: translateX(-50%);
            box-sizing: border-box;
            width: auto;
            max-width: 100%;
            height: 64px;
            border-radius: 32px;
            line-height: 1.5em;
            background-color: #323232;
            padding: 10px 25px;
            font-size: 17px;
            color: #fff;
            display: flex;
            align-items: center;
            text-align: center;
            justify-content: space-between;
            cursor: default;
            box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.12), 0 1px 5px 0 rgba(0, 0, 0, 0.2);
        }
        .toast.hide {
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.5s cubic-bezier(0, 0, 0.3, 1);
        }
        .toast .toast-action {
            font-weight: 500;
            cursor: pointer;
            color: #90CAF9;
        }
        .toast .toast-action:hover,
        .toast .toast-action:focus {
            color: #42A5F5;
        }
        #blacklist-toggle-hide-option {
            margin-right: 6px;
            margin-left: 6px;
        }
        #blacklist-toast-close-button-container {
            block-size: fit-content;
        }
        #blacklist-toast-close-button {
            position: relative;
            top: -2px;
            color: #ccc;
            cursor: pointer;
            box-sizing: border-box;
            padding: 14px 15px 18px 17px;
            width: 48px;
            height: 48px;
            margin-right: -16px;
            border-radius: 24px;
            font-size: 16px;
        }
        #blacklist-toast-close-button:hover,
        #blacklist-toast-close-button:focus {
            background-color: #757575;
        }
    `));
    document.head.appendChild(css);

    // Fade out after a bit
    setTimeout(() => {
        if (toast) {
            toast.classList.add('hide');
        }
    }, 5000);
}

// Mark images as blacklisted for profile page
function MarkProfileBlacklistedImages(blockedTags, searchParams) {
    'use strict';

    // Check if it is your own profile before applying anything
    const userID = getUserID();
    if (searchParams.has('id') && parseInt(searchParams.get('id')) == userID) {
        return;
    }

    // Get all image thumbnails on page
    const imageThumbs = [...document.getElementsByClassName('profileThumbnailPadding')];

    // Apply blacklist to image thumbnails
    let count = 0;
    imageThumbs.forEach(imageThumb => {
        const tags = GetImageTags(imageThumb);
        if (tags.some(tag => blockedTags.includes(tag))) {
            if (removeBlacklistedThumbnailsEntirely) {
                imageThumb.remove();
            } else {
                imageThumb.classList.add('blacklisted');
            }
            count++;
        }
    });

    // Show notification if any were blocked
    if (count) {
        createToast(count);
    }
}

// Mark images as blacklisted for other users' favorites pages
function MarkFavoritesBlacklistedImages(blockedTags, searchParams) {
    'use strict';

    // Check if it is your own favorites before applying anything
    const userID = getUserID();
    if (searchParams.has('id') && parseInt(searchParams.get('id')) == userID) {
        return;
    }

    // Blacklisted class not already defined on favorites pages due to different framework from the rest of the site
    const css = document.createElement('style');

    css.appendChild(document.createTextNode(`
        .blacklisted {
            opacity: .2;
            filter: blur(10px);
        }
    `));

    document.head.appendChild(css);

    // Get all image thumbnails on page
    const imageThumbs = document.querySelectorAll('span.thumb');

    // Apply blacklist to image thumbnails
    let count = 0;
    imageThumbs.forEach(imageThumb => {
        const tags = GetImageTags(imageThumb);
        if (tags.some(tag => blockedTags.includes(tag))) {
            if (removeBlacklistedThumbnailsEntirely) {
                imageThumb.remove();
            } else {
                imageThumb.classList.add('blacklisted');
            }
            count++;
        }
    });

    // Show notification if any were blocked
    if (count) {
        createToast(count);
    }
}

// Mark images as blacklisted for wiki page
function MarkWikiBlacklistedImages(blockedTags) {
    'use strict';

    // Get all image thumbnails on page
    const imageThumbs = document.querySelectorAll('a[href^="index.php?page=post&s=view&id="]');

    // Apply blacklist to image thumbnails
    let count = 0;
    imageThumbs.forEach(imageThumb => {
        const tags = GetImageTags(imageThumb);
        if (tags.some(tag => blockedTags.includes(tag))) {
            if (removeBlacklistedThumbnailsEntirely) {
                imageThumb.remove();
            } else {
                imageThumb.classList.add('blacklisted');
            }
            count++;
        }
    });

    // Show notification if any were blocked
    if (count) {
        createToast(count);
    }
}


// Mark images as blacklisted for comments tab
function MarkCommentsBlacklistedImages(blockedTags) {
    'use strict';

    // Blacklisted class not already defined on comments tab due to different framework from the rest of the site
    const css = document.createElement('style');

    css.appendChild(document.createTextNode(`
        .blacklisted {
            opacity: .2;
            filter: blur(10px);
        }
    `));

    document.head.appendChild(css);

    // Get all image thumbnails on page
    const imageThumbs = document.querySelectorAll('#comment-list .post .col1 a[href*="page=post&s=view"]');

    // Apply blacklist to image thumbnails
    let count = 0;
    imageThumbs.forEach(imageThumb => {
        const tags = GetImageTags(imageThumb);
        if (tags.some(tag => blockedTags.includes(tag))) {
            if (removeBlacklistedThumbnailsEntirely) {
                imageThumb.closest('div.post').remove();
            } else {
                imageThumb.classList.add('blacklisted');
            }
            count++;
        }
    });

    // Show notification if any were blocked
    if (count) {
        createToast(count);
    }
}

// Mark images as blacklisted
function MarkBlacklistedImages(blockedTags) {
    'use strict';

    const searchParams = new URLSearchParams(window.location.search);

    if (!searchParams.has('s')) {
        return false;
    }
    if (searchParams.get('s') === 'profile') {
        MarkProfileBlacklistedImages(blockedTags, searchParams);
    } else if (searchParams.get('page') === 'favorites') {
        MarkFavoritesBlacklistedImages(blockedTags, searchParams);
    } else if (searchParams.get('page') === 'wiki') {
        MarkWikiBlacklistedImages(blockedTags);
    } else if (searchParams.get('page') === 'comment') {
        MarkCommentsBlacklistedImages(blockedTags);
    }
}

(function() {
    'use strict';

    const blockedTags = GetBlockedTags();
    if (blockedTags) {
        MarkBlacklistedImages(blockedTags);
    }
})();