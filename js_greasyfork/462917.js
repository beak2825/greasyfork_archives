// ==UserScript==
// @name        Make Jira's Issue Name Bar Fixed
// @namespace   Violentmonkey Scripts
// @match       https://*.atlassian.net/*
// @grant       none
// @version     1.1
// @license     MIT
// @author      Bevis
// @description Tested at 12/19/2022, 5:59:44 PM
// @downloadURL https://update.greasyfork.org/scripts/462917/Make%20Jira%27s%20Issue%20Name%20Bar%20Fixed.user.js
// @updateURL https://update.greasyfork.org/scripts/462917/Make%20Jira%27s%20Issue%20Name%20Bar%20Fixed.meta.js
// ==/UserScript==

(function($) {
  setInterval(() => {
    if (!/^\/browse\/.+-\d+$/.test(window.location.pathname)) {
      return
    }

    if (jQuery('#jira-issue-header + div').find('h1').length == 0) {
      return
    }

    $('#jira-issue-header + div').appendTo('#jira-issue-header')
  }, 500)
})(jQuery)