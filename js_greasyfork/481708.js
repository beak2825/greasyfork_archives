// ==UserScript==
// @name         [GC] UL Trophy ordering
// @namespace    https://greasyfork.org/users/1230396
// @version      1.0
// @description  Order trophies by gold/silver/bronze in every userlookup and also shows the CSS code used in the browser's console
// @author       Berna
// @match        https://www.grundos.cafe/userlookup/?user=*
// @icon         https://i.imgur.com/gDxnNrn.gif
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/481708/%5BGC%5D%20UL%20Trophy%20ordering.user.js
// @updateURL https://update.greasyfork.org/scripts/481708/%5BGC%5D%20UL%20Trophy%20ordering.meta.js
// ==/UserScript==

function extractUrlEndAndApplyCSS() {
  var elements = document.querySelectorAll('.ul__gametrophy');

  var cssRulesByOrder = {};

  elements.forEach(function (element) {
    var lastClass = element.classList[element.classList.length - 1];

    var imgElement = element.querySelector('img');

    if (imgElement) {
      var srcAttribute = imgElement.getAttribute('src');
      var urlEnd = srcAttribute.substring(srcAttribute.lastIndexOf('/') + 1);

      var orderMatch = urlEnd.match(/_(\d+)\.gif/);
      var order = orderMatch ? orderMatch[1] : '';

      if (!cssRulesByOrder[order]) {
        cssRulesByOrder[order] = [];
      }

      cssRulesByOrder[order].push('.' + lastClass + ',');
    }
  });

  var styleElement = document.createElement('style');

  document.head.appendChild(styleElement);

  for (var order in cssRulesByOrder) {
    var cssRules = cssRulesByOrder[order].join(' ');
    var cssRuleText = cssRules.slice(0, -1) + ' { order: ' + order + '; }';

    console.log(cssRuleText);

    styleElement.textContent += cssRuleText;
  }
}

extractUrlEndAndApplyCSS();