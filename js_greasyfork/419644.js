// ==UserScript==
// @name         Etsy - Remove Ads
// @namespace    https://openuserjs.org/users/zachhardesty7
// @author       Zach Hardesty <zachhardesty7@users.noreply.github.com> (https://github.com/zachhardesty7)
// @description  removes annoying and inconspicuous search ads from Etsy
// @copyright    2019-2021, Zach Hardesty (https://zachhardesty.com/)
// @license      GPL-3.0-only; http://www.gnu.org/licenses/gpl-3.0.txt
// @version      1.1.3

// @homepageURL  https://github.com/zachhardesty7/tamper-monkey-scripts-collection/raw/master/etsy-remove-ads.user.js
// @homepageURL  https://openuserjs.org/scripts/zachhardesty7/Etsy_-_Remove_Ads
// @supportURL   https://github.com/zachhardesty7/tamper-monkey-scripts-collection/issues


// @include      https://www.etsy.com/search*
// @include      https://www.etsy.com/market/*
// @require      https://greasyfork.org/scripts/419640-onelementready/code/onElementReady.js?version=887637
// @downloadURL https://update.greasyfork.org/scripts/419644/Etsy%20-%20Remove%20Ads.user.js
// @updateURL https://update.greasyfork.org/scripts/419644/Etsy%20-%20Remove%20Ads.meta.js
// ==/UserScript==
/* global onElementReady */

onElementReady(".ad-indicator", { findOnce: false }, (el) => {
  el.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.remove()
})
