// ==UserScript==
// @name     goodgame.ru chat on main
// @version  1.1
// @include  https://goodgame.ru/*
// @run-at   document-idle
// @grant    unsafeWindow
// @description:en show chat from forum on main page
// @namespace https://greasyfork.org/users/72530
// @description show chat from forum on main page
// @downloadURL https://update.greasyfork.org/scripts/37219/goodgameru%20chat%20on%20main.user.js
// @updateURL https://update.greasyfork.org/scripts/37219/goodgameru%20chat%20on%20main.meta.js
// ==/UserScript==

var url = window.location.href;
if (checkUrl(url)) { showChat(); };

setInterval(function () {
  if (window.location.href != url)
  {
    url = window.location.href;
    if (checkUrl(url)) { showChat(); };
  }
}, 1000);

function checkUrl(currentUrl) {
  return currentUrl.endsWith("goodgame.ru/");
}

function showChat() {
  console.log("showing forum chat");
  unsafeWindow.eval("window.StreamController.showChat('r128');");
  unsafeWindow.eval("PageLoader.onExit(function (newUrl, oldUrl) {if (newUrl.indexOf('/forum/')==-1 && newUrl.indexOf('/topic/')==-1) {window.StreamController.showChat(false);}});");
}