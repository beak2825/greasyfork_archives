// ==UserScript==
// @name                Laftel collapsible comments
// @name:ko             라프텔 댓글 접기
// @description         Make Laftel comments collapsible
// @description:ko      라프텔 에피소드에서 댓글을 접고 펼칠 수 있게 수정합니다
// @namespace           https://laftel.net/
// @match               https://laftel.net/*
// @require             https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2
// @grant               none
// @icon                https://static.laftel.net/favicon.ico
// @version             1.2
// @author              Seonghyeon Cho
// @homepageURL         https://gist.github.com/sh-cho/53bc2fc880ebba0d1a6f9b430d010449
// @supportURL          https://gist.github.com/sh-cho/53bc2fc880ebba0d1a6f9b430d010449
// @license             MIT
// @downloadURL https://update.greasyfork.org/scripts/503856/Laftel%20collapsible%20comments.user.js
// @updateURL https://update.greasyfork.org/scripts/503856/Laftel%20collapsible%20comments.meta.js
// ==/UserScript==

'use strict';

// url should be like https://laftel.net/player/12345/12345
const regex = /https:\/\/laftel\.net\/player\/\d+\/\d+/;

/**
 * Check whether the node is a comment section.
 * The node must have a header and a div with id 'comment-count'.
 *
 * @param {HTMLElement} node the node to check
 * @returns {boolean} true if the node is a comment section, false otherwise
 */
function isCommentSection(node) {
  if (!node) return false;
  if (!node.querySelector('header')) return false;
  if (!node.querySelector('div#comment-count')) return false;
  return true;
}

/**
 * Make section node collapsible.
 *
 * @param {HTMLElement} section the section node to wrap
 */
function wrapSection(section) {
  // check current url is player
  if (!regex.test(location.href)) return;

  // prevent multiple wrapping
  if (section.dataset.collapsible) return;
  section.dataset.collapsible = "true";

  // check if the node is a comment section
  if (!isCommentSection(section)) return;

  const details = document.createElement('details');
  const summary = document.createElement('summary');
  summary.textContent = '댓글 toggle';

  section.parentNode.insertBefore(details, section);
  details.appendChild(summary);
  details.appendChild(section);
}

VM.observe(document.body, () => {
  const node = document.querySelector('section');
  if (node) {
    wrapSection(node);
    // no return
  }
});
