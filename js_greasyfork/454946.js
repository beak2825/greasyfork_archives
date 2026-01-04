// ==UserScript==
// @name         TBD: Quick Mention for TorrentBD
// @namespace    https://naeembolchhi.github.io/
// @version      0.9
// @description  Quickly mention/tag users in the shoutbox and the forums.
// @author       NaeemBolchhi
// @license      GPL-3.0-or-later
// @icon         data:image/png;base64,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
// @match        https://*.torrentbd.com/
// @match        https://*.torrentbd.net/
// @match        https://*.torrentbd.org/
// @match        https://*.torrentbd.me/
// @match        https://*.torrentbd.com/?spotlight
// @match        https://*.torrentbd.net/?spotlight
// @match        https://*.torrentbd.org/?spotlight
// @match        https://*.torrentbd.me/?spotlight
// @match        https://*.torrentbd.com/forums.php*
// @match        https://*.torrentbd.net/forums.php*
// @match        https://*.torrentbd.org/forums.php*
// @match        https://*.torrentbd.me/forums.php*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/454946/TBD%3A%20Quick%20Mention%20for%20TorrentBD.user.js
// @updateURL https://update.greasyfork.org/scripts/454946/TBD%3A%20Quick%20Mention%20for%20TorrentBD.meta.js
// ==/UserScript==

// Convert 6 digit HEX to RGB color
function getRGB(color) {
  color = color.replace('#','');
  return `rgb(${parseInt(color.replace(/....$/,''), 16)}, ${parseInt(color.replace(/..$/,'').replace(/^../,''), 16)}, ${parseInt(color.replace(/^..../,''), 16)})`;
}

// Determine active theme to set fill color
let fillColor;
if (document.body.className.match(/light/)) {
    fillColor = 'rgb(58, 58, 64)';
    if (localStorage.theme == 'light' && localStorage.themeLight) {
        fillColor = getRGB(JSON.parse(localStorage.themeLight).accent1);
    }
} else {
    fillColor = 'rgb(184, 198, 204)';
    if (localStorage.theme == 'dark' && localStorage.themeDark) {
        fillColor = getRGB(JSON.parse(localStorage.themeDark).accent1);
    }
}

// Stylesheet for quickmention in the shoutbox and quicktag in the forums
const quickCSS = `
  .at-them {
    cursor: pointer;
    color: transparent !important;
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' style='fill: ${fillColor};' viewBox='0 0 915 300' xml:space='preserve'><g><path d='M200.4,204.3c-10.1,9.8-21.5,16.2-34.8,19.1c-40.5,9-81.6-18.2-89.4-59.1c-7.9-41.4,20.2-81.7,61.4-88.2   c21.2-3.4,40.3,1.9,57.2,15c2.6,2,5.1,2.9,8.4,2.8c7-0.2,14-0.1,21.4-0.1c0,2.2,0,3.9,0,5.6c0,22.8-0.1,45.7,0,68.5   c0.1,14,10.1,21.9,23.6,19c7.5-1.6,13-7.5,13.6-16.3c1.9-28.7-1.4-56.3-17.6-81.3c-25.2-38.8-72-59-116.2-49.7   c-46.3,9.7-81.2,45.7-89,91.9C28.2,195.2,73.8,255.1,138,261.9c22.9,2.4,44.4-2.2,64.8-12.8c0.9-0.5,1.8-0.9,3-1.5   c6.2,10.6,12.3,21,18.6,31.7c-10.7,6.5-21.8,11.2-33.4,14.6C106.2,319.1,16.9,263.1,2.1,175.5C-10.9,98.1,37,24.4,113,4.7   C196.7-17,282.8,39,297.1,124.8c3,18,4.2,36.2,0.8,54.2c-4.1,22.1-17.4,37.4-39.1,43.7c-21.5,6.3-40.4,0.5-56.1-15.5   C201.9,206.4,201.3,205.4,200.4,204.3z M187.1,150.1c0-20.4-16.9-37.4-37.3-37.6c-20.4-0.1-37.4,16.7-37.6,37.3   c-0.2,20.5,17,37.9,37.5,37.8C170.2,187.5,187.1,170.5,187.1,150.1z'/></g><g><path d='M914.8,165.4H743.5c2.5,15.1,9.1,27.1,19.8,36c10.7,8.9,24.4,13.4,41.1,13.4c19.9,0,37-7,51.4-20.9l44.9,21.1   c-11.2,15.9-24.6,27.6-40.2,35.3c-15.6,7.6-34.2,11.4-55.7,11.4c-33.3,0-60.5-10.5-81.4-31.5c-21-21-31.4-47.4-31.4-79   c0-32.4,10.4-59.3,31.3-80.8c20.9-21.4,47.1-32.1,78.6-32.1c33.5,0,60.7,10.7,81.6,32.1c21,21.4,31.4,49.7,31.4,84.9L914.8,165.4z    M861.5,123.4C858,111.6,851,102,840.6,94.5c-10.4-7.4-22.4-11.1-36.1-11.1c-14.9,0-27.9,4.2-39.1,12.5c-7,5.2-13.6,14.4-19.6,27.5   H861.5z'/><path d='M334.6,43.7h53.3v24.4c9.1-10,19.3-17.5,30.4-22.5c11.1-4.9,23.3-7.4,36.5-7.4c13.3,0,25.3,3.3,36,9.8   c10.7,6.5,19.3,16,25.8,28.5c8.5-12.5,18.9-22,31.2-28.5c12.3-6.5,25.8-9.8,40.4-9.8c15.1,0,28.4,3.5,39.9,10.5   c11.5,7,19.7,16.2,24.7,27.5s7.5,29.8,7.5,55.3v124.6h-53.7V148.4c0-24.1-3-40.4-9-48.9c-6-8.5-15-12.8-27-12.8   c-9.1,0-17.3,2.6-24.5,7.8c-7.2,5.2-12.6,12.4-16.1,21.6c-3.5,9.2-5.3,23.9-5.3,44.2v95.9h-53.7V153.3c0-19-1.4-32.8-4.2-41.3   c-2.8-8.5-7-14.9-12.6-19c-5.6-4.2-12.4-6.3-20.4-6.3c-8.9,0-16.9,2.6-24.2,7.9c-7.2,5.3-12.7,12.7-16.2,22.2   c-3.6,9.5-5.4,24.5-5.4,44.9v94.5h-53.3V43.7z'/></g></svg>");
    background-size: 85% auto;
    background-position: center right;
    background-repeat: no-repeat;
    transition: background-size .05s;
  }
  .at-them:active {
    background-size: 78% auto;
  }
  .quicktag a {
    height: 2rem;
    width: 2rem;
    cursor: pointer;
    transition: background 0s linear;
  }
  .quicktag.tagged a {
    background: var(--link-color);
    border-radius: 8px;
  }
  .quicktag.tagged a i {
    color: var(--main-bg);
  }
  ul.options.right {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 21.3px;
    margin-right: 18px;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
  ul.options.right li {
    display: flex;
    padding-right: 0;
    padding-bottom: 4px;
  }
  ul.options.right li a {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

// Adding styles for the hover effect
function addStyle() {
    if (!document.head) {window.location.reload();}
    let style = document.createElement('style');
    style.setAttribute('type', 'text/css');
    style.id = 'quickMention';
    style.innerHTML = quickCSS;
    document.head.appendChild(style);
}

// Shoutbox @username shortcut
function shoutBox() {
    document.addEventListener('click', function(event) { try {
        if (!event.target.classList.contains('shout-time')) {return;}

        let userName,
            shoutText = document.getElementById('shout_text');
        try {
            userName = event.target.parentNode.querySelector('.shout-user .tbdrank').innerText;
        } catch(e) {return;}

        shoutText.focus();
        shoutText.value = shoutText.value + '@' + userName + ' ';
        shoutText.value = shoutText.value.replace(/\ \ /g,' ').replace(/\ \ /g,' ');
    } catch(e) {}});

    document.addEventListener('mouseover', function(event) { try {
        if (!event.target.classList.contains('shout-time') || !event.target.parentNode.querySelector('.shout-user .tbdrank')) {return;}
        event.target.classList.add('at-them');
    } catch(e) {}});

    document.addEventListener('mouseout', function(event) { try {
        if (!event.target.classList.contains('shout-time') || !event.target.parentNode.querySelector('.shout-user .tbdrank')) {return;}
        event.target.classList.remove('at-them');
    } catch(e) {}});
}

// Add a new tag button to posts that don't have an edit button
function postTagger() {
    let allPosts = document.querySelectorAll('#middle-block div[id^=post]');

    for (let x = 0; x < allPosts.length; x++) {
        if (!allPosts[x].querySelector('a[href*="editpost"]')) {
            // NO EDIT BUTTON FOUND
            let tagContainer = allPosts[x].querySelector('ul.options.right');
            let tagElement = document.createElement('li');
            tagElement.classList.add('quicktag');
            tagElement.innerHTML = '<a class="tooltipped" data-position="bottom" data-relay="20" data-tooltip="Tag this User"><i class="material-icons sm">alternate_email</i></a>';
            tagContainer.insertBefore(tagElement, tagContainer.children[0]);
        };
    }
}

// Push a toast with needed message when tagging or untagging
function tagToast(key) {
    let toastJS = encodeURIComponent(`Materialize.toast('Tagging this user.', 2000, 'tag-toast')`);
    if (key === false) {
        toastJS = encodeURIComponent(`Materialize.toast('Not tagging this user.', 2000, 'untag-toast')`);
    }

    location.assign('javascript:' + toastJS);
}

// When tag button is clicked
function tagUser(key) {
    if (key.classList.contains('tagged')) {
        // untagging
        key.classList.remove('tagged');
        tagToast(false);
    } else {
        // tagging
        key.classList.add('tagged');
        tagToast();
    }
}

// Generate current taglist
function tagList() {
    let allPosts = document.querySelectorAll('#middle-block div[id^=post]'),
        userList = '';

    for (let x = 0; x < allPosts.length; x++) {
        if (allPosts[x].querySelector('.quicktag.tagged')) {
            userList = userList + ' ' + allPosts[x].querySelector('a[href*="account-details"]').innerText;
        }
    }

    return userList.replace(/^\s/,'').replace(/\s/g, ', ').replace(/\,\s\,\s/g,', ').replace(/\,\s$/,'').replace(/\,$/,'').replace(/\s$/,'');
}

// Tag and untag users in the forums
function forumTags() {
    document.addEventListener('click', function(event) {
        let target = event.target;

        // Clicking the new tag button
        if (target.classList.contains('quicktag')) {
            tagUser(target);
        }
        if (target.parentNode.classList.contains('quicktag')) {
            tagUser(target.parentNode);
        }
        if (target.parentNode.parentNode.classList.contains('quicktag')) {
            tagUser(target.parentNode.parentNode);
        }

        // Clicking the reply button (new post)
        if (target.id === 'reply-trigger' || target.parentNode.id === 'reply-trigger') {
            let inputField = document.getElementById('resource');
            inputField.value = tagList();
            if (inputField.value !== '') {
                inputField.parentNode.classList.remove('hidden');
            } else {
                inputField.parentNode.classList.add('hidden');
            }
        }

        // Clicking the taglist (adding tags to existing post)
        if ((target.getAttribute('href') === '#tagmodal' && target.getAttribute('onclick').match(/injectpostid/i)) || (target.parentNode.getAttribute('href') === '#tagmodal' && target.parentNode.getAttribute('onclick').match(/injectpostid/i))) {
            let inputField = document.getElementById('tagstext');
            inputField.value = tagList();
        }
    });
}

// Initiate parts of the script as needed
addStyle();
if (window.location.pathname === '/' || window.location.pathname === '/?spotlight') {
    shoutBox();
}
if (window.location.pathname === '/forums.php') {
    postTagger();
    forumTags();
}