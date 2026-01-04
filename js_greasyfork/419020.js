// ==UserScript==
// @name         ac-diff-reversal-notifier
// @namespace    https://github.com/polyester-CTRL
// @version      0.1
// @description  AtCoderのコンテストにおいて前の問題より後ろの問題の正解者が多い時に通知します
// @author       polyester-CTRL
// @match        https://atcoder.jp/contests/*/standings
// @match        https://atcoder.jp/contests/*/standings/json
// @require      https://cdn.jsdelivr.net/npm/axios@0.19.0/dist/axios.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419020/ac-diff-reversal-notifier.user.js
// @updateURL https://update.greasyfork.org/scripts/419020/ac-diff-reversal-notifier.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // My code 
  if ((!('Notification' in window)) || (startTime === undefined)) {
    return;
  }
  let permission = Notification.permission;
  if (permission === 'denied') {
    return;
  }
  let jsonURL = window.location.href.replace(/\/+$/, '') + '/json';
  console.log(jsonURL);
  Notification.requestPermission().then(function () {
    if (endTime.isBefore()) {
      return;
    }

    let id = setInterval(function () {
      if (startTime.isAfter()) {
        return;
      }
      if (endTime.isBefore()) {
        clearInterval(id);
        return;
      }
      let taskData;
      axios.get(jsonURL)
        .then(function (response) {
          taskData = response.TaskInfo;
        })
        .catch(function (error) {
          console.log(error);
        });
      vueStandings.$watch('standings', function (newData, oldData) {
        if (!newData) {
          return;
        }
        let tasks = newData.TaskInfo;
        for (let i = 0; i < tasks.length - 1; i++) {
          if (vueStandings.ac[i] < vueStandings.ac[i + 1]) {
            new Notification(taskData[i].Assignment + ':' + vueStandings.ac[i] + '/' +
              taskData[i + 1].Assignment + ':' + vueStandings.ac[i + 1]);
          }
        }
      });
      // 3分おきに動作させる
    }, 3 * 60 * 1000);
  });
});
