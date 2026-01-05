// ==UserScript==
// @name            Facebook Ad Filter ++
// @description:en  Filter for content on facebook.
// @namespace       http://www.facebook.com/*
// @include         https://www.facebook.com/*
// @version         2.4
// @description Filter for content on facebook.
// @downloadURL https://update.greasyfork.org/scripts/27488/Facebook%20Ad%20Filter%20%2B%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/27488/Facebook%20Ad%20Filter%20%2B%2B.meta.js
// ==/UserScript==

(function () {
  function contains(selector, text) {
    var elements = document.querySelectorAll(selector);
    return [].filter.call(elements, function (element) {
      return RegExp(text).test(element.textContent);
    });
  }
  function filterlogic() {
    var els = contains('div[id^=hyperfeed_story_id]', 'Suggested Post');
    for (var el in els) {
      els[el].outerHTML = '';
    }
    els = contains('div[id^=hyperfeed_story_id]', 'Sponsored');
    for (el in els) {
      els[el].outerHTML = '';
    }
    els = contains('div[id^=hyperfeed_story_id]', 'People You May Know');
    for (el in els) {
      els[el].outerHTML = '';
    }
    els = contains('div[id^=hyperfeed_story_id]', 'Create Ad');
    for (el in els) {
      els[el].outerHTML = '';
    }
    els = contains('div[id^=hyperfeed_story_id]', 'SUGGESTED PAGES');
    for (el in els) {
      els[el].outerHTML = '';
    }
    els = contains('div[id^=pagelet_advertiser_panel]', '');
    for (el in els) {
      els[el].outerHTML = '';
    }
    els = contains('div[id^=pagelet_rhc_ticker_card]', '');
    for (el in els) {
      els[el].outerHTML = '';
    }
    els = contains('div[id^=pagelet_ego_pane]', '');
    for (el in els) {
      els[el].outerHTML = '';
    }
    els = contains('div[id^=createNav]', '');
    for (el in els) {
      els[el].outerHTML = '';
    }
    els = contains('div[id^=appsNav]', '');
    for (el in els) {
      els[el].outerHTML = '';
    }
    els = contains('div[id^=pagelet_rhc_footer]', '');
    for (el in els) {
      els[el].outerHTML = '';
    }
    els = contains('a[id^=findFriendsNav]', '');
    for (el in els) {
      els[el].outerHTML = '';
    }
    els = contains('a[aria-label^="Help Center"]', '');
    for (el in els) {
      els[el].outerHTML = '';
    }
    els = contains('a[data-testid^=left_nav_item_Marketplace]', '');
    for (el in els) {
      els[el].outerHTML = '';
    }
    els = contains('div[id^=pagelet_reminders]', '');
    for (el in els) {
      els[el].outerHTML = '';
    }
    els = contains('div[id^=pagelet_feed_variety]', '');
    for (el in els) {
      els[el].outerHTML = '';
    }
    els = contains('div[id^=pagelet_on_tv_rhc]', '');
    for (el in els) {
      els[el].outerHTML = '';
    }
    els = contains('div[data-click^=home_icon]', '');
    for (el in els) {
      els[el].outerHTML = '';
    }
  }
  document.body.addEventListener('load', filterlogic);
  document.body.addEventListener('DOMSubtreeModified', filterlogic, false);
}) ();