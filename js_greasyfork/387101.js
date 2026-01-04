// ==UserScript==
// @name           Reddit - View deleted content
// @description    Click on a deleted post or comment and see what was there originally
// @author         James Skinner <spiralx@gmail.com> (http://github.com/spiralx)
// @namespace      http://spiralx.org/
// @version        3.0.0
// @license        MIT
// @icon           data:image/png;base64,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
// @match          *://*.reddit.com/r/*/comments/*
// @grant          none
// @run-at         document-end
// @require        https://unpkg.com/jquery@3/dist/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/387101/Reddit%20-%20View%20deleted%20content.user.js
// @updateURL https://update.greasyfork.org/scripts/387101/Reddit%20-%20View%20deleted%20content.meta.js
// ==/UserScript==

/**

## Changelog

#### 3.0.0 (28.04.2024)

* Rename script and tweak the link text for posts
* Allow clicking [removed] in posts as well as comments
* Fixed hover state for [removed] or [deleted] comment bodies

#### 2.4.0 (17.04.2024)

* Changed undelete source to undelete.pullpush.io

#### 2.3.0 (03.08.2022)

* Add @license field and consolidate @icon fields

#### 2.2.0 (08.06.2021)

* Replace Removeddit with Reveddit

#### 2.1.1 (07.07.2019)
* Deleted comments now don't require shift-click, have hover effect

#### 2.1.0 (03.07.2019)
* Shift-click on "[removed]" will open Removeddit for deleted comments

#### 2.0.0 (03.07.2019)
* Add Removeddit link to post buttons at top of page
* Changed name and description to match functionality
* Fixed icon metadata to use optimisied Reddit logo
* Minor tidying up of code
* Uploaded as a new user script to Greasyfork

#### 1.2.1 (03.06.2019)
* Merged with other copy of the script and updated the version to 1.2.1
* Added timeout before opening Removeddit to prevent a new window being opened

#### 1.2.0 (24.05.2019)
* Removed button in RES floating toolbar
* Holding shift when clicking perma-link on a comment opens it in Removeddit

#### 1.1.0 (11.09.2018)
* Add a "removeddit-link" to each comment

#### 1.0.0 (13.07.2018)
* Switched to watcher library instead of mutation-summary

#### 0.1.0 (19.06.2018)
* Initial version

## Notes

The original user script:

https://greasyfork.org/en/scripts/370257-reddit-add-removeddit-link

*/

/* jshint asi: true, esnext: true, laxbreak: true */
/* global jQuery */

; ($ => {
  'use strict'

  // --------------------------------------------------------------------

  function getUndeleteUrl (redditUrl) {
    const url = new URL(redditUrl)
    url.host = 'undelete.pullpush.io'
    return url.toString()
  }

  // --------------------------------------------------------------------

  function openUndeleteSite(url) {
    window.setTimeout(() => {
      window.open(url, '_blank')
    }, 100)
  }

  // --------------------------------------------------------------------

  $(`.thing.link .buttons .first`).each(function () {
    const url = getUndeleteUrl(this.children[ 0 ].href)

    $(`<li><a href="${url}" target="_blank">original post</a></li>`)
      .insertAfter(this)
  })

  // --------------------------------------------------------------------

  $('body')
    .on('click', 'a[data-event-action = "permalink"]', function (event) {
      if (!event.shiftKey) {
        return
      }

      openUndeleteSite(getUndeleteUrl(this.href))

      return false
    })
    .on('click', '.thing.deleted > .entry > .usertext', function (event) {
      const permalink = location.origin + $(this).closest('.thing').data('permalink')

      openUndeleteSite(getUndeleteUrl(permalink))

      return false
    })
    .on('click', '#siteTable .thing.deleted > .entry .usertext', function (event) {
      const permalink = location.origin + $(this).closest('.thing').data('permalink')

      openUndeleteSite(getUndeleteUrl(permalink))

      return false
    })

  $('body').append(`
<style type="text/css">
  .thing.deleted > .entry .usertext {
    cursor: pointer;
  }
  .thing.deleted > .entry .usertext:hover .usertext-body,
  .thing.deleted > .entry .usertext.greyed:hover .usertext-body {
    color: #07f;
  }
</style>
  `)

})(jQuery)

jQuery.noConflict(true)
