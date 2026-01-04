// ==UserScript==
// @name        Hack Duckrace
// @icon        https://www.online-stopwatch.com/favicon.ico
// @namespace   Violentmonkey Scripts
// @match       https://www.online-stopwatch.com/*
// @grant       GM_registerMenuCommand
// @version     1.0
// @author      https://github.com/HoangTran0410
// @description Hack result of Duckrace game
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/500936/Hack%20Duckrace.user.js
// @updateURL https://update.greasyfork.org/scripts/500936/Hack%20Duckrace.meta.js
// ==/UserScript==

(() => {
  function main() {
    let targets = prompt(
      "Enter duck's name or duck's number you want to WIN:\n Split by comma ,\n E.g: 1,abc,5,20,test",
      ""
    );
    if (targets === null) return;

    targets = targets
      .split(",")
      .map((_) => _.trim())
      .filter((_) => _);

    let iframe = document.querySelector('iframe[src*="duck-race"]');

    [unsafeWindow, window, iframe?.contentWindow]
      .filter((_) => _)
      .forEach((win) => {
        if (!win.ufs_duckRace_originalShuffle)
          win.ufs_duckRace_originalShuffle = win.Array.prototype.shuffle;

        win.Array.prototype.shuffle = function () {
          const result = win.ufs_duckRace_originalShuffle.apply(
            this,
            arguments
          );
          if (result?.[0]?.instance) {
            for (let target of targets) {
              let targetIndex = result.findIndex(
                (i) => i?.name === target || i?.number == target
              );
              if (targetIndex >= 0) {
                let temp = result[0];
                result[0] = result[targetIndex];
                result[targetIndex] = temp;
                break;
              }
            }
          }
          console.log("shuffle", this, result, result[0]);
          return result;
        };
      });
  }

  GM_registerMenuCommand("Start hack", main);
})();
