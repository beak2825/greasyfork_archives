// ==UserScript==
// @name         Window Width Indicator
// @namespace    http://jonas.ninja
// @version      1.1.8
// @description  Adds a small, fixed header element that shows the window's logical width and the related Bootstrap size
// @author       @_jnblog
// @match        *://ivan.dev.sentryone.com/*
// @match        *://dev.sentryone.com/*
// @match        *://qa.sentryone.com/*
// @match        *://staging.sentryone.com/*
// @match        *://www.preview.sentryone.com/*
// @match        *://www.sentryone.com/*
// @match        *://sentryone.com/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.12.0/jquery.min.js
// @require      https://greasyfork.org/scripts/18233-window-floating-container/code/Window%20floating%20container.js?version=187970
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/18543/Window%20Width%20Indicator.user.js
// @updateURL https://update.greasyfork.org/scripts/18543/Window%20Width%20Indicator.meta.js
// ==/UserScript==
/* jshint -W097 */
/* global $ */
/* jshint asi: true, multistr: true */
'use strict'


var widthItem = $('<span class="ijgWindowFloater-item">').appendTo(window.windowFloaterUtils.getFloater())

function getWindowWidth() {
  var size = Math.max(window.innerWidth, document.documentElement.clientWidth)
  var bsClass = 'lg'
  if (size < 768) {
    bsClass = 'xs'
  } else if (size < 992) {
    bsClass = 'sm'
  } else if (size < 1200) {
    bsClass = 'md'
  }
  return size + ' (' + bsClass + ')'
}

widthItem.text(getWindowWidth())

$(window).on('resize', function(e) {
  widthItem.text(getWindowWidth())
})