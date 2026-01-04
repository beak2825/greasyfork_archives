// ==UserScript==
// @name         Resub Instagram
// @namespace    Resub Instagram
// @version      1.0.0
// @description  Modified version of Bladhard script (https://greasyfork.org/en/scripts/32034-%D0%BD%D0%B0%D0%BA%D1%80%D1%83%D1%82%D0%BA%D0%B0-%D0%BF%D0%BE%D0%B4%D0%BF%D0%B8%D1%81%D1%87%D0%B8%D0%BA%D0%BE%D0%B2-%D0%B2-instagram)
// @author       Videot4pe
// @match        https://*.instagram.com/*
// @exclude      https://*.instagram.com/accounts/*
// @exclude      https://*.instagram.com/p/*
// @downloadURL https://update.greasyfork.org/scripts/371176/Resub%20Instagram.user.js
// @updateURL https://update.greasyfork.org/scripts/371176/Resub%20Instagram.meta.js
// ==/UserScript==

var circle_time = prompt("Resub interval: ", "30");

if (circle_time === null)
    alert('Ok.');
else {
  function bye_bye()
  {
    unsub = document.getElementsByClassName("_5f5mN    -fzfL     _6VtSN     yZn4P   ");
    unsub[0].click();

    sure = document.getElementsByClassName("aOOlW -Cab_ ");
    sure[0].click();

    var delayInMilliseconds = 3000;

    setTimeout(function() {
      love_ya();
    }, delayInMilliseconds);
  }

  function love_ya()
  {
    sub = document.getElementsByClassName("_5f5mN       jIbKX  _6VtSN     yZn4P   ");
    sub[0].click() 
  }

  bye_bye();
  setInterval(bye_bye, circle_time * 1000);
}
