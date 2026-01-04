// ==UserScript==
// @name         Carbon: Torn Territory Profile Faction Members Marker
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Marks members on faction profile page that are on the shown wall
// @author       AllMight [1878147]
// @match        https://www.torn.com/factions.php*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/461193/Carbon%3A%20Torn%20Territory%20Profile%20Faction%20Members%20Marker.user.js
// @updateURL https://update.greasyfork.org/scripts/461193/Carbon%3A%20Torn%20Territory%20Profile%20Faction%20Members%20Marker.meta.js
// ==/UserScript==

(function () {
  'use strict';

  var urlSearchParams = new URLSearchParams(location.search);

  if (urlSearchParams.get('step') !== 'profile') {
    return;
  }

  var factionsRoot = document.querySelector('#factions');

  function waitForElement(elementSelector, parentElement) {
    return new Promise(resolve => {
      var wantedElement = parentElement.querySelector(elementSelector);

      if (wantedElement) {
        resolve(wantedElement);
        return;
      }

      var config = { childList: true, subtree: true };
      var callback = () => {
        var wantedElement = parentElement.querySelector(elementSelector);

        if (wantedElement) {
          observer.disconnect();
          resolve(wantedElement);
        }
      };

      var observer = new MutationObserver(callback);

      observer.observe(parentElement, config);
    });
  }

  function observeChanges(parentElement, observedSelector, reactionConfig) {
    var callback = () => {
      var wantedElement = parentElement.querySelector(observedSelector);

      if (!wantedElement) {
        reactionConfig.onRemoved();
      } else {
        reactionConfig.onChange(wantedElement);
      }
    };

    var observer = new MutationObserver(callback);

    observer.observe(parentElement, { childList: true, subtree: true });
  }

  function getUserIdFromLinkElement(link) {
    return link.href.split('?XID=')[1];
  }

  function getFactionMembersRows() {
    return factionsRoot.querySelectorAll(
      '.faction-info-wrap > .members-list .table-row'
    );
  }

  GM_addStyle('.am-on-wall {background-color: darksalmon}');

  waitForElement('.f-war-list', factionsRoot).then(warList =>
    observeChanges(warList, '.descriptions .members-list', {
      onChange: element => {
        var usersIdsSet = new Set(
          [...element.querySelectorAll('a.user.name')].map(
            getUserIdFromLinkElement
          )
        );

        for (var memberRow of getFactionMembersRows()) {
          var memberId = getUserIdFromLinkElement(
            memberRow.querySelector('[class^="userWrap"] > a')
          );

          if (usersIdsSet.has(memberId)) {
            memberRow.classList.add('am-on-wall');
          } else {
            memberRow.classList.remove('am-on-wall');
          }
        }
      },
      onRemoved: () => {
        for (var memberRow of getFactionMembersRows()) {
          memberRow.classList.remove('am-on-wall');
        }
      }
    })
  );
})();
