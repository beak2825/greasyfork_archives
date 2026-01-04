// ==UserScript==
// @name         Google Search - Hide "People also search for"
// @namespace    https://zachhardesty.com
// @author       Zach Hardesty <zachhardesty7@users.noreply.github.com> (https://github.com/zachhardesty7)
// @description  hide annoying popup below most recently visited the search result
// @copyright    2019-2024, Zach Hardesty (https://zachhardesty.com/)
// @license      GPL-3.0-only; http://www.gnu.org/licenses/gpl-3.0.txt
// @version      1.1.4

// @homepageURL  https://github.com/zachhardesty7/tamper-monkey-scripts-collection/raw/master/google-hide-search-interruptions.user.js
// @homepage     https://github.com/zachhardesty7/tamper-monkey-scripts-collection/raw/master/google-hide-search-interruptions.user.js
// @homepageURL  https://openuserjs.org/scripts/zachhardesty7/Google_Search_-_Hide_People_also_search_for
// @homepage     https://openuserjs.org/scripts/zachhardesty7/Google_Search_-_Hide_People_also_search_for
// @supportURL   https://github.com/zachhardesty7/tamper-monkey-scripts-collection/issues


// @match        https://www.google.com/search/*
// @require      https://greasyfork.org/scripts/419640-onelementready/code/onElementReady.js?version=887637
// @downloadURL https://update.greasyfork.org/scripts/419648/Google%20Search%20-%20Hide%20%22People%20also%20search%20for%22.user.js
// @updateURL https://update.greasyfork.org/scripts/419648/Google%20Search%20-%20Hide%20%22People%20also%20search%20for%22.meta.js
// ==/UserScript==

/* global onElementReady */

// only operate once necessary el has loaded
onElementReady(".exp-outline", { findOnce: true }, (el) => {
  // remove text
  el.parentElement.querySelector("div").querySelector(":nth-child(3)").remove()
  el.remove() // remove border
})
