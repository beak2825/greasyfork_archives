// ==UserScript==
// @name         Facebook Hide Ads (a.k.a. sponsored posts)
// @version      0.2
// @description  Removes ads (a.k.a. sponsored posts) from feed and sidebar
// @author       johanb
// @match        https://*.facebook.com/*
// @grant        none
// @namespace https://greasyfork.org/users/126569
// @downloadURL https://update.greasyfork.org/scripts/406797/Facebook%20Hide%20Ads%20%28aka%20sponsored%20posts%29.user.js
// @updateURL https://update.greasyfork.org/scripts/406797/Facebook%20Hide%20Ads%20%28aka%20sponsored%20posts%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let qS = function (el, scope) {
      scope = (typeof scope == 'object') ? scope : document;
      return scope.querySelector(el) || false;
    },
    qSall = function (els, scope) {
      scope = (typeof scope == 'object') ? scope : document;
      return scope.querySelectorAll(els) || false;
    },
    targetNode = qS('body'),
    observerConfig = {
      attributes: false,
      childList: true,
      subtree: true
    },
    getParentEl = function(elmChild) {
        return elmChild.closest('[data-pagelet^="FeedUnit_"]') || false;
    },
    removeAdsInFeed = function(ads) {
        Array.prototype.forEach.call(ads, function(el) {
            let wrapper = getParentEl(el);
            wrapper.parentNode.removeChild(wrapper);
        });
    },
    callback = function (mutationsList, observer) {
      mutationsList.forEach(function (mutation) {
        var entry = {
          mutation: mutation,
          el: mutation.target,
          value: mutation.target.textContent,
          oldValue: mutation.oldValue
        };
        let ego_wrapper = qS('#pagelet_ego_pane', entry.el);
        if (ego_wrapper) ego_wrapper.parentNode.removeChild(ego_wrapper);

        let ads_in_feed = qSall('a[href*="/ads/about/?__cft__"]', entry.el);
        if (ads_in_feed) removeAdsInFeed(ads_in_feed);
      });
    };

    // ads in right sidebar, old fb design
    let ego_wrapper = qS('#pagelet_ego_pane');
    if (ego_wrapper) ego_wrapper.parentNode.removeChild(ego_wrapper);

    /* new fb 2020 design */
    let ads_in_feed = qSall('a[href*="/ads/about/?__cft__"]');
    if (ads_in_feed) removeAdsInFeed(ads_in_feed);

    var observer = new MutationObserver(callback);
    observer.observe(targetNode, observerConfig);
})();