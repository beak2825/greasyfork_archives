// ==UserScript==
// @name MIT Technology Review Paywall Remover
// @author noname120
// @namespace HandyUserscripts
// @description Remove the paywall on MIT Technology Review
// @version 1
// @license Creative Commons BY-NC-SA

// @include http*://technologyreview.com/
// @include http*://www.technologyreview.com/

// @grant none
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/29271/MIT%20Technology%20Review%20Paywall%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/29271/MIT%20Technology%20Review%20Paywall%20Remover.meta.js
// ==/UserScript==

localStorage.removeItem('mittr:meter');