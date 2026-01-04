// ==UserScript==
// @name           WebToon - Keyboard Navigation
// @description    Enables pagination with the keyboard arrows
// @author         MetalTxus
// @version        1.0.0

// @icon           https://webtoons-static.pstatic.net/image/favicon/favicon.ico
// @match          https://www.webtoons.com/*
// @namespace      https://github.com/jesuscc1993/user-js
// @require        https://code.jquery.com/jquery-3.2.1.min.js
// @require        https://greasyfork.org/scripts/396703-key-navigation/code/Key%20navigation.js
// @downloadURL https://update.greasyfork.org/scripts/452378/WebToon%20-%20Keyboard%20Navigation.user.js
// @updateURL https://update.greasyfork.org/scripts/452378/WebToon%20-%20Keyboard%20Navigation.meta.js
// ==/UserScript==

/* globals setUpKeyNavigation jQuery */

(() => {
  'use strict';

  const setUpPagination = () => {
    const previousPageAnchor = jQuery('.pg_prev');
    const nextPageAnchor = jQuery('.pg_next');

    setUpKeyNavigation({
      onLeftPressed: () => {
        if (previousPageAnchor.length) {
          location.href = previousPageAnchor.attr('href');
        }
      },
      onRightPressed : () => {
        if (nextPageAnchor.length && !nextPageAnchor.hasClass('dim')) {
          location.href = nextPageAnchor.attr('href');
        }
      },
    });
  }

  setUpPagination();
})();