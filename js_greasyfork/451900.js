// ==UserScript==
// @name        Axelor Pimped
// @match       https://test.axelor.com/*
// @grant       none
// @version     1.0.1
// @license MIT
// @namespace Violentmonkey Scripts
// @description 9/23/2022, 4:27:04 PM
// @downloadURL https://update.greasyfork.org/scripts/451900/Axelor%20Pimped.user.js
// @updateURL https://update.greasyfork.org/scripts/451900/Axelor%20Pimped.meta.js
// ==/UserScript==
if (typeof jQuery !== 'undefined') {
  var jq = {
    animate: $.fn.animate
  };

  var ANIMATE_DURATION = 0;

  $.fn.animate = function () {
    var options = arguments[1];
    arguments[1] = _.isObject(options)
      ? _.extend({}, options, { duration: ANIMATE_DURATION })
      : ANIMATE_DURATION;
    return jq.animate.apply(this, arguments);
  };

  console.log('Axelor Pimped');
}