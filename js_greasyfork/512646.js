// ==UserScript==
// @name        StackSuite System Theme
// @author      brian6932
// @namespace   https://greasyfork.org/users/581142
// @namespace   https://github.com/brian6932
// @include		/^https:\/{2}(?:[^.]+\.stackexchange|s(?:tackoverflow|uperuser|erverfault)|askubuntu)\.com\//
// @license     agpl-3.0-only
// @grant       none
// @version     1.2.0
// @run-at      document-body
// @description Sets StackOverflow, SuperUser, and other StackExchange based sites to always use your system theme
// @downloadURL https://update.greasyfork.org/scripts/512646/StackSuite%20System%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/512646/StackSuite%20System%20Theme.meta.js
// ==/UserScript==
// jshint esversion: 11

globalThis.document.body.classList.add('theme-system')