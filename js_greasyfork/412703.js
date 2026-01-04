// ==UserScript==
// @name         Carbon: Torn Territory Timer Strategy Helper
// @namespace    http://tampermonkey.net/
// @version      2.1.2
// @description  Adds territories timings info
// @author       AllMight [1878147]
// @match        https://www.torn.com/factions.php*
// @grant        GM_addStyle
// @require      https://greasyfork.org/scripts/412688-tornterritoriesslots/code/TornTerritoriesSlots.js?version=1156727
// @downloadURL https://update.greasyfork.org/scripts/412703/Carbon%3A%20Torn%20Territory%20Timer%20Strategy%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/412703/Carbon%3A%20Torn%20Territory%20Timer%20Strategy%20Helper.meta.js
// ==/UserScript==

(function () {
  function waitForElementExistence(selector, alwaysExistsParent) {
    return new Promise(resolve => {
      var targetNode = document.querySelector(alwaysExistsParent);
      var wantedElement = targetNode.querySelector(selector);

      if (wantedElement) {
        resolve(wantedElement);
        return;
      }

      var config = { childList: true, subtree: true };
      var callback = function () {
        var wantedElement = targetNode.querySelector(selector);
        if (wantedElement) {
          observer.disconnect();
          resolve(wantedElement);
        }
      };
      var observer = new MutationObserver(callback);
      observer.observe(targetNode, config);
    });
  }

  function textNodeAsNumber(textNode) {
    return +textNode.textContent.replace(/,/g, '');
  }

  function timeToAllSeconds(time) {
    return (
      time.days * 24 * 60 * 60 +
      time.hours * 60 * 60 +
      time.mins * 60 +
      time.seconds
    );
  }

  function allSecondsToTime(allSeconds) {
    const seconds = allSeconds % 60;
    const minsLeft = (allSeconds / 60) | 0;
    const mins = minsLeft % 60;
    const hoursLeft = (minsLeft / 60) | 0;
    const hours = hoursLeft % 24;
    const days = (hoursLeft / 24) | 0;

    return { days, hours, mins, seconds };
  }

  function timeToText(time) {
    var zeroAlign = num => ('0' + num).slice(-2);
    return `${zeroAlign(time.days)}:${zeroAlign(time.hours)}:${zeroAlign(
      time.mins
    )}:${zeroAlign(time.seconds)}`;
  }

  function observeChildChanges(element, cb) {
    var config = { childList: true, subtree: true };
    var observer = new MutationObserver(cb);
    observer.observe(element, config);
    cb();
  }

  function observeTextNodesChanges(element, cb) {
    var config = { characterData: true, subtree: true, childList: true };
    var observer = new MutationObserver(cb);
    observer.observe(element, config);
    return {
      dispose: () => observer.disconnect()
    };
  }

  GM_addStyle(
    '.d .f-war-list.war-new>li[class^="warListItem"], .d .f-war-list.war-new>li[class^="warListItem"] .status-wrap { height: 139px !important; }'
  );
  GM_addStyle(
    '.d .f-war-list.war-new>li.act[class^="warListItem"], .d .f-war-list.war-new>li.act[class^="warListItem"] .status-wrap { height: 149px !important; }'
  );
  GM_addStyle(
    '.d .f-war-list.war-new>li.inactive { height: 139px !important; }'
  );
  GM_addStyle(
    '.am-territory-info {height: 30px;display: flex;align-items: center;justify-content: center;text-align: center;}'
  );

  waitForElementExistence('.f-war-list', '#factions').then(warList => {
    var observersRefs = [];
    observeChildChanges(warList, () => {
      observersRefs.forEach(ref => ref.dispose());
      observersRefs = [];

      [...warList.children]
        .filter(x => !!x.querySelector('.territory-wrap'))
        .forEach(warItem => {
          var observerRef = observeTextNodesChanges(warItem, () => {
            var yourCount = warItem.querySelector('.your-count > .count')
              .childNodes[1];
            var enemyCount = warItem.querySelector('.enemy-count > .count')
              .childNodes[1];
            var scoreElem = warItem.querySelector('.score');
            var timerElem = warItem.querySelector('.timer');
            var currentScore = scoreElem.childNodes[0];
            var maxScore = scoreElem.childNodes[2];
            var timeArray = [0, 0, 0, 0]
              .concat(timerElem.textContent.split(':').map(x => +x))
              .slice(-4);
            var daysLeft = timeArray[0];
            var hoursLeft = timeArray[1];
            var minutesLeft = timeArray[2];
            var secondsLeft = timeArray[3];
            var wallTimeLeft = {
              days: daysLeft,
              hours: hoursLeft,
              mins: minutesLeft,
              seconds: secondsLeft
            };
            var territoryId = warItem
              .querySelector('.name .text')
              .children[1].children[1].href.split('=')[1];
            var numOfSlots = getTerritorySlots(territoryId);

            var minPeopleSum =
              (textNodeAsNumber(maxScore) - textNodeAsNumber(currentScore)) /
              timeToAllSeconds(wallTimeLeft);
            var isDefending = warItem.querySelector('.name').textContent.includes('assaulting');

            var text, timeText;

            if (isDefending) {
              var strategyType =
                minPeopleSum < 1
                  ? 'URGENT'
                  : minPeopleSum > numOfSlots
                  ? 'WON'
                  : 'KEEP';
              var enemyGains =
                textNodeAsNumber(enemyCount) - textNodeAsNumber(yourCount);
              var allSecondsToLose =
                (textNodeAsNumber(maxScore) - textNodeAsNumber(currentScore)) /
                enemyGains;
              var allSecondsToWin =
                timeToAllSeconds(wallTimeLeft) -
                (textNodeAsNumber(maxScore) - textNodeAsNumber(currentScore)) /
                  numOfSlots;
              timeText =
                enemyGains <= 0
                  ? `Win time: ${timeToText(
                      allSecondsToTime(Math.ceil(allSecondsToWin))
                    )}`
                  : `Lose time: ${timeToText(
                      allSecondsToTime(Math.ceil(allSecondsToLose))
                    )}`;
              text =
                strategyType === 'URGENT'
                  ? `URGENT! Keep enemy gains at 0 or less! <br> (currently at ${
                      textNodeAsNumber(enemyCount) - textNodeAsNumber(yourCount)
                    })`
                  : strategyType === 'WON'
                  ? 'Wall won! No need to join'
                  : `JOIN! Keep enemy gains under ${Math.ceil(
                      minPeopleSum
                    )} <br> (currently at ${
                      textNodeAsNumber(enemyCount) - textNodeAsNumber(yourCount)
                    })`;
            } else {
              var strategyType =
                minPeopleSum > numOfSlots
                  ? 'LOST'
                  : minPeopleSum > numOfSlots - 3
                  ? 'URGENT'
                  : 'KEEP';
              var ourGains =
                textNodeAsNumber(yourCount) - textNodeAsNumber(enemyCount);
              var allSecondsToWin =
                (textNodeAsNumber(maxScore) - textNodeAsNumber(currentScore)) /
                ourGains;
              var allSecondsToLose =
                timeToAllSeconds(wallTimeLeft) -
                (textNodeAsNumber(maxScore) - textNodeAsNumber(currentScore)) /
                  numOfSlots;
              timeText =
                ourGains <= 0
                  ? `Lose time: ${timeToText(
                      allSecondsToTime(Math.ceil(allSecondsToLose))
                    )}`
                  : `Win time: ${timeToText(
                      allSecondsToTime(Math.ceil(allSecondsToWin))
                    )}`;
              text =
                strategyType === 'URGENT'
                  ? `URGENT! Keep our gains above ${Math.floor(
                      minPeopleSum
                    )}! <br> (currently at ${
                      textNodeAsNumber(yourCount) - textNodeAsNumber(enemyCount)
                    })`
                  : strategyType === 'LOST'
                  ? 'Wall lost :( No need to join'
                  : `JOIN! Keep our gains above ${Math.floor(
                      minPeopleSum
                    )}! <br> (currently at ${
                      textNodeAsNumber(yourCount) - textNodeAsNumber(enemyCount)
                    })`;
            }

            if (
              !timerElem.nextSibling ||
              (!timerElem.nextSibling.textContent.startsWith('Lose time:') &&
                !timerElem.nextSibling.textContent.startsWith('Win time:'))
            ) {
              var elem = document.createElement('div');
              elem.textContent = timeText;
              elem.classList.add('timer');
              timerElem.parentElement.insertBefore(elem, timerElem.nextSibling);
            } else {
              timerElem.nextSibling.textContent = timeText;
            }

            var infoElem = warItem.querySelector('.am-territory-info');

            if (!infoElem) {
              var toAppendAfter = warItem.querySelector('.status-wrap > .name');
              var element = document.createElement('div');
              element.classList.add('am-territory-info');
              element.innerHTML = text;
              toAppendAfter.parentElement.insertBefore(
                element,
                toAppendAfter.nextSibling
              );
            } else if (infoElem.innerHTML !== text) {
              infoElem.innerHTML = text;
            }
          });

          observersRefs.push(observerRef);
        });
    });
  });
})();
