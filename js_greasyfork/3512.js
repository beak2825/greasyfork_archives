// ==UserScript==
// @name Is It Down Right Now ? | Reek
// @namespace GUCOl1SJ9EBV7rzg
// @description "Is It Down Right Now" monitors the status of your favorite web sites and checks whether they are down or not. Check a website status easily by using the below test tool. Just enter the url and a fresh site status test will be perfomed on the domain name in real time using our online website checker tool. For detailed information, check response time graph and user comments.
// @author Reek | http://reeksite.com/
// @version 1.0
// @license Creative Commons BY-NC-SA
// @encoding utf-8
// @icon http://www.gravatar.com/avatar/afb8376a9f634cd3501af4387de6425f.png
// @include http*://*
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/3512/Is%20It%20Down%20Right%20Now%20%20%7C%20Reek.user.js
// @updateURL https://update.greasyfork.org/scripts/3512/Is%20It%20Down%20Right%20Now%20%20%7C%20Reek.meta.js
// ==/UserScript==

  // Add GM Command
  GM_registerMenuCommand("Is It Down Right Now ?", function () {
    location.href = "http://www.isitdownrightnow.com/downorjustme.php?url=" + location.host;
  });