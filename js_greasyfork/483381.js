// ==UserScript==
// @name         inoreader-open-link
// @namespace    https://screw-hand.com/
// @version      0.11
// @description  support inoreader web to open the link.
// @author       screw-hand
// @match        https://www.inoreader.com/*
// @icon         https://www.inoreader.com/favicon.ico?v=8
// @grant        none
// @homepage     https://github.com/screw-hand/tampermonkey-user.js
// @downloadURL https://update.greasyfork.org/scripts/483381/inoreader-open-link.user.js
// @updateURL https://update.greasyfork.org/scripts/483381/inoreader-open-link.meta.js
// ==/UserScript==

(function () {
  'use strict';
  /**
    * now only for Layout of List, Card, Magazine View
    * and only for https://www.inoreader.com/feed/
    * other layout is comming soon ...
    * dashbord page is comming soon ...
    */

  const scriptName = 'inoreader-open-link';
  const openMode = '_blank';
	/* eslint-disable no-multi-spaces */
  const view_style_config = {
    0:'List',      // Supported
    1:'Expanded',
    2:'Column',
    3:'Card',      // Supported
    4:'Magazine',  // Supported
  }
	/* eslint-enable no-multi-spaces */

  /**
   * TOOD
   * 1. mare list mode mark read
   * 2. Magazine view can't mark unread
   */

  function isMode(modeStr) {
    const currentMode = view_style_config[window.view_style];
    console.trace({ currentMode });
    return currentMode === modeStr;
  }

  function makeReaded(e) {
    const article_subscribed = e.target.closest('.article_subscribed');
    if (article_subscribed) {
      const a_mark_read = article_subscribed.querySelector('a[onclick^=mark_read]')
      const span_mark_read = a_mark_read && a_mark_read.querySelector('span[class$=mark_as_read_full]')
      span_mark_read && a_mark_read.onclick()
    }
  }

  function cardModeOpenLink (e) {
    const article_title_link = '.article_title_link';
    const article_title_picture = '.article_tile_picture';
    const is_target_article_title_link = e.target.classList.contains(article_title_link.substring(1));
    const is_target_article_title_picture = e.target.classList.contains(article_title_picture.substring(1));
    if (is_target_article_title_link || is_target_article_title_picture) {
      const article_title_content_wraper = '.article_tile_content_wraper';
      const target_closest_wraper = e.target.closest(article_title_content_wraper);
      if (target_closest_wraper) {
        const href = e.target.href || e.target.parentElement.href;
        // TODO make the open in new tab is option that user could setting
        window.open(href, openMode)
      }
      makeReaded(e)
    }
  }

  function listModeOpenLink(e) {
    const article_header_text = '.article_header_text';
    const target = e.target.closest(article_header_text);
    if (target) {
      const link = target.querySelector('a')?.href;
      link && window.open(link, openMode)
    }
    // TOOD write list mode mark read in here...
  }

  function magazineModeOpenLink(e) {
    const article_magazine_content_wraper = '.article_magazine_content_wraper';
    const target = e.target.closest(article_magazine_content_wraper);
    if (target) {
      const link = target.querySelector('a')?.href;
      if (link) {
        e.preventDefault();
        window.open(link, openMode);
      }
      makeReaded(e)
    }
  }

  const originalDialog = window.dialog;
  window.dialog = function () {
    console.log("dialog");
    const flag = arguments[0] === "article_dialog";
    console.log({ flag });
    if (isMode('Card') && flag) {
      return cardModeOpenLink(event);
    }
    // else if (isMode('Magazine') && flag) {
    //   return; magazineModeOpenLink(event);
    // }
    return originalDialog.apply(this, arguments);
  };


  const original_toggle_articleview = window.toggle_articleview;
  window.toggle_articleview = function () {
    console.trace(event.target);
    event.stopPropagation();
    event.preventDefault();
    if (isMode('List')) {
      const [id, no_helpers, event, extra] = arguments;
      const flag = typeof id === 'string' && no_helpers === false && (event instanceof Event || event instanceof MouseEvent) && extra === false;
      console.log({ flag });
      if (flag) {
        return listModeOpenLink(event);
      }
    }
    else if (isMode('Magazine')) {
      return magazineModeOpenLink(event);
    }
    const original_scroll_to_article = window.scroll_to_article;
    window.scroll_to_article = () => undefined;
    original_toggle_articleview.apply(this, arguments);
    setTimeout(() => {
      window.scroll_to_article = original_scroll_to_article
    }, 300);
  }

})();
