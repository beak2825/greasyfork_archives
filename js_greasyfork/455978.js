// ==UserScript==
// @name           Traffic1s.com skipper
// @name:vi        Chống rút gọn Traffic1s.com
// @namespace      SignedBy.hUwUtao
// @license        MIT
// @version        0.1
// @description    time is golden, not for ya
// @description:vi Không cần tìm code trên google
// @author         hUwUtao
// @match          https://traffic1s.com/*
// @downloadURL https://update.greasyfork.org/scripts/455978/Traffic1scom%20skipper.user.js
// @updateURL https://update.greasyfork.org/scripts/455978/Traffic1scom%20skipper.meta.js
// ==/UserScript==
document.getElementsByName("code").length != 0 && //
  (!new URLSearchParams(window.location.search).get("code") || //
    document.querySelector(".alert.alert-danger") != null) && //
  ((host) =>
    fetch("https://traffic1s.com/get-code?hostname=" + host)
      .then((response) => response.json())
      .then(
        (response) =>
          (window.location.href = (function (c) {
            const u = new URL(window.location.href);
            u.searchParams.set("code", c);
            return u.toString();
          })(response.html))
      ))(prompt("Type in the hostname of requested page: ex google.com"));