// ==UserScript==
// @name         Pinterest - Remove Promoted
// @namespace    https://github.com/valacar
// @version      0.1.0
// @description  Remove promoted pins
// @author       Valacar
// @include      https://*.pinterest.tld/*
// @require      https://unpkg.com/xhook@1.6.2/dist/xhook.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/482164/Pinterest%20-%20Remove%20Promoted.user.js
// @updateURL https://update.greasyfork.org/scripts/482164/Pinterest%20-%20Remove%20Promoted.meta.js
// ==/UserScript==

/* 3rd party script to modify XHR responses: https://github.com/jpillora/xhook */

(function() {
  "use strict";

  function isGoodPin(data) {
    return !(data.is_promoted && data.is_promoted === true)
  }

  function jsonFilter(response, isSearchResults) {
    let json = JSON.parse(response.text);
    let data;
    if (isSearchResults) {
      data = json.resource_response.data.results;
      json.resource_response.data.results = data.filter(isGoodPin);
    } else {
      data = json.resource_response.data;
      json.resource_response.data = data.filter(isGoodPin);
    }
    return JSON.stringify(json);
  }

  xhook.after(function(request, response) {
    if (request.url.match(/\/resource\/(UserHomefeedResource|FollowingFeedResource|RelatedModulesResource|BoardContentRecommendationResource|BoardFeedResource)\/get\//)) {
      response.text = jsonFilter(response, false);
    } else if (request.url.match(/\/resource\/BaseSearchResource\/get\//)) {
      response.text = jsonFilter(response, true);
    }
  });

})();
