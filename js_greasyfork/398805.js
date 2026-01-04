// ==UserScript==
// @name         noopener-everywhere
// @name:zh-CN   全员noopener
// @name:zh-TW   全員noopener
// @namespace    https://github.com/li-zyang
// @version      1.0.0
// @description  open any hyperlinks with a noopener attribute
// @description:zh-CN  使用 noopener 方式打开任何新窗口的链接
// @description:zh-TW  使用 noopener 方式打開任何外部錨
// @author       阿昭
// @include      *://*
// @exclude      none
// @require      https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @connect      *
// @noframes
// @run-at       document-end
// @note         v0.1.0      2020-03-24  On testing
// @note         v1.0.0      2020-03-27  First published
// @downloadURL https://update.greasyfork.org/scripts/398805/noopener-everywhere.user.js
// @updateURL https://update.greasyfork.org/scripts/398805/noopener-everywhere.meta.js
// ==/UserScript==

// => More metadata:
// @contributor  the contributors of this script
// @homepageURL  the homepage of this script (commonly <sth>.io)
// @supportURL   Defines the URL where the user can report issues and get personal support. (such as https://greasyfork.org/scripts/41537)
// @icon         url of the icon for this script, data64 is okay
// @license      license of this script
// @compatible   descript compatibility, just a human-readable message
// @match

// See https://www.tampermonkey.net/documentation.php for full documention

(function(window, $) {
  'use strict';
  $('a[href]')
    .not('[href=""]')
    .not('[href^="#"]')
    .not('[href^="javascript:"]')
  .each(function(element_index) {
    if (! $(this).attr('rel') ) {
      $(this).attr('rel', 'noopener');
    } else if (! /(\s|^)noopener(\s|$)/.test($(this).attr('rel')) ) {
      $(this).attr('rel', $(this).attr('rel') + ' noopener');
    }
  });
  let observer = new MutationObserver(function(mulist) {
    for (var mutation of mulist) {
      if (mutation.type == 'childList') {
        let jq_target = $(mutation.target);
        jq_target.find('a[href]')
          .not('[href=""]')
          .not('[href^="#"]')
          .not('[href^="javascript:"]')
        .each(function(element_index) {
          if (! $(this).attr('rel') ) {
            $(this).attr('rel', 'noopener');
          } else if (! /(\s|^)noopener(\s|$)/.test($(this).attr('rel')) ) {
            $(this).attr('rel', $(this).attr('rel') + ' noopener');
          }
        });
      }
    }
  });
  observer.observe($('body')[0], {
    childList: true,
    subtree: true
  });
})(window.unsafeWindow, $);















