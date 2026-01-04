// ==UserScript==
// @name         Macro Keys and Bomb for Agarmen.com
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  S for Macro Keys (A), C for Bombs (D)
// @icon         https://agarmen.com/favicon.ico
// @author       #EMBER (htps://fb.com/embermaxx)
// @match        http://agarmen.com/
// @match        https://agarmen.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/482392/Macro%20Keys%20and%20Bomb%20for%20Agarmencom.user.js
// @updateURL https://update.greasyfork.org/scripts/482392/Macro%20Keys%20and%20Bomb%20for%20Agarmencom.meta.js
// ==/UserScript==

var intervalS;
var switchyS = false;

function pressD(count, delay) {
  if (count <= 0) return;

  $("body").trigger($.Event("keydown", { keyCode: 68 })); // Press 'd'
  $("body").trigger($.Event("keyup", { keyCode: 68 }));

  setTimeout(function () {
    pressD(count - 1, delay);
  }, delay);
}

$(document).on("keydown", function (e) {
  if (e.keyCode == 83) {
    if (switchyS) {
      return;
    }
    switchyS = true;
    intervalS = setInterval(function () {
      $("body").trigger($.Event("keydown", { keyCode: 65 }));
      $("body").trigger($.Event("keyup", { keyCode: 65 }));
    }, 100);
  }

  if (e.keyCode == 67) { // 'c' key
    const numberOfPresses = 2;
    const delayBetweenPresses = 100;

    pressD(numberOfPresses, delayBetweenPresses);
  }
});

$(document).on("keyup", function (e) {
  if (e.keyCode == 83) {
    switchyS = false;
    clearInterval(intervalS);
    return;
  }
});
