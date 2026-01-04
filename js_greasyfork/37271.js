// ==UserScript==
// @name         Open notification link to new tab by keyboard for GitHub
// @namespace    http://kyanny.me/
// @version      1.0.0
// @description  Add keyboard shortcuts to open focusing link of GitHub Notifications. 1) v to open link in new tab. 2) Shift+v to open links from same repository in new tabs.
// @author       Kensuke Nagae
// @match        https://github.com/notifications
// @match        https://github.com/notifications/participating
// @match        https://github.com/*/*/notifications*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/37271/Open%20notification%20link%20to%20new%20tab%20by%20keyboard%20for%20GitHub.user.js
// @updateURL https://update.greasyfork.org/scripts/37271/Open%20notification%20link%20to%20new%20tab%20by%20keyboard%20for%20GitHub.meta.js
// ==/UserScript==

/*
For Firefox, browser.tabs.loadDivertedInBackground to true is useful.
See https://stackoverflow.com/a/1306963/374851
*/

(function() {
  'use strict';

  var logger = {
    info: function(msg) {
      console.log(msg);
    },
    debug: function(msg) {
      // console.debug(msg);
    },
  };

  var findTarget = function(item) {
    logger.debug('find target');
    return item.querySelector('.js-notification-target');
  };

  var openLink = function(target) {
    var link = target.href;
    logger.info('opening ' + link);
    window.open(link, '_blank');
  };

  var markAsRead = function(item) {
    logger.debug('mark as read');
    item.setAttribute('class', item.getAttribute('class') + ' read');
  };

  document.addEventListener('keyup', function(ev) {
    var key = ev.key.toLowerCase();
    var focusingItem = document.querySelector('.navigation-focus');
    if (key === 'v' && !!focusingItem) {
      if (ev.shiftKey === true) { // Shift key is pressed
        var siblings = focusingItem.parentNode.querySelectorAll('.js-notification');
        [].forEach.call(siblings, function(sibling) {
          var target = findTarget(sibling);
          openLink(target);
          markAsRead(sibling);
        });
      } else {
        var target = findTarget(focusingItem);
        openLink(target);
        markAsRead(focusingItem);
      }
    }
  });
})();
