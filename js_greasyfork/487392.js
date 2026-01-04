// ==UserScript==
// @name         My Merges
// @namespace    https://nirewen.dev
// @version      1.0.0
// @description  Link to my merge requests
// @author       Nirewen
// @match        https://gitlab.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gitlab.com
// @grant        none
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/487392/My%20Merges.user.js
// @updateURL https://update.greasyfork.org/scripts/487392/My%20Merges.meta.js
// ==/UserScript==

$(document).ready(function() {
  const sleep = ms => new Promise((resolve) => setTimeout(resolve, ms))
  const btn = $('[data-track-label="merge_requests_menu"]');
  const username = $('[data-track-label="user_profile"]').attr("href").slice(1)
  let added = false

  btn.on('click', async () => {
    if (added) return

    await sleep(10)
    const disclosure = $('[data-track-label="merge_requests_menu"]').attr('aria-controls')

    $(`#${disclosure} > div > ul > li > ul`).append(
      $(`<li tabindex="0" data-testid="disclosure-dropdown-item" class="gl-new-dropdown-item">
          <a tabindex="-1"
            href="/dashboard/merge_requests?author_username=${username}"
            data-track-action="click_link"
            data-track-label="my_merge_requests"
            data-track-property="nav_core_menu"
            class="gl-new-dropdown-item-content dashboard-shortcuts-review_requests">
            <span class="gl-new-dropdown-item-text-wrapper">
              <span class="gl-display-flex gl-align-items-center gl-justify-content-space-between">
                My merge requests
              </span>
            </span>
          </a>
        </li>`)
    );

    added = true;
  });
});