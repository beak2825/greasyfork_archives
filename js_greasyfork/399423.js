// ==UserScript==
// @name         .io Link for GitHub Profiles
// @namespace    http://zecong.hu/
// @version      0.1
// @description  Adds a link to github.io website if the user has such a repository.
// @author       Zecong Hu
// @include      /^https?:\/\/(www\.)?github\.com\/([^\/]+)\/?$/
// @downloadURL https://update.greasyfork.org/scripts/399423/io%20Link%20for%20GitHub%20Profiles.user.js
// @updateURL https://update.greasyfork.org/scripts/399423/io%20Link%20for%20GitHub%20Profiles.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (document.querySelector(".vcard-names .p-nickname") === null) {
        console.log("[.io Userscript] Not user profile page, skip");
        return;
    }
    if (document.querySelector("ul.vcard-details > li[itemprop='url']") !== null) {
        console.log("[.io Userscript] User has website link, skip");
        return;
    }

    const username = window.location.pathname.split("/")[1];
    console.log("Username: " + username);
    let xhr = new XMLHttpRequest();
    xhr.open('GET', username + "/" + username + ".github.io");
    xhr.onload = function() {
        if (xhr.status === 200) {
            console.log("[.io Userscript] Github.io exists");

            const ioURL = "https://" + username + ".github.io/";
            let details = document.querySelector("ul.vcard-details");
            details.innerHTML += `
<li itemprop="url" data-test-selector="profile-website-url" class="vcard-detail pt-1 css-truncate css-truncate-target">
  <svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true">
    <path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path>
  </svg>
  <a rel="nofollow me" href="` + ioURL + `">` + ioURL + `</a>
</li>`;
        } else {
            console.log("[.io Userscript] Github.io does not exist");
        }
    };
    xhr.send();
    // Your code here...
})();