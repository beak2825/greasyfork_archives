// ==UserScript==
// @name         search-in-Github-Star-Page
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Github Star 页增加搜索框
// @author       GallenHu
// @match        https://github.com/*?tab=stars
// @grant        none
// @require https://cdn.staticfile.org/jquery/1.12.2/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/420846/search-in-Github-Star-Page.user.js
// @updateURL https://update.greasyfork.org/scripts/420846/search-in-Github-Star-Page.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const username = document.querySelector('meta[property="profile:username"]').getAttribute('content');
    const htmlStr = `<form data-pjax="true" style="margin-right: 80px;" action="https://github.com/${username}?tab=stars" accept-charset="UTF-8" method="get">
        <div class="d-md-none">
        <input type="search" name="q" value="" class="form-control width-full" placeholder="Find repositories…" aria-label="Find repositories…" autocapitalize="off" autocomplete="off">
        <button type="submit" class="btn mt-1">
            <svg class="octicon octicon-search" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M11.5 7a4.499 4.499 0 11-8.998 0A4.499 4.499 0 0111.5 7zm-.82 4.74a6 6 0 111.06-1.06l3.04 3.04a.75.75 0 11-1.06 1.06l-3.04-3.04z"></path></svg>
            Search
        </button>
        </div>
        <div class="input-group d-none d-md-table">
        <input type="search" name="q" value="" class="form-control" placeholder="Find repositories…" aria-label="Find repositories…" autocapitalize="off" autocomplete="off">
        <span class="input-group-button">
            <button type="submit" class="btn" aria-label="Search">
            <svg class="octicon octicon-search" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M11.5 7a4.499 4.499 0 11-8.998 0A4.499 4.499 0 0111.5 7zm-.82 4.74a6 6 0 111.06-1.06l3.04 3.04a.75.75 0 11-1.06 1.06l-3.04-3.04z"></path></svg>
            </button>
        </span>
        </div>
    </form>`

    $(htmlStr).insertAfter('.application-main .col-lg-9 h2');
})();
