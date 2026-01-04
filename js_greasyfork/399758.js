// ==UserScript==
// @name         CTO自动登录
// @namespace    https://greasyfork.org/users/91873
// @version      1.0.0.0
// @description  CTO auto Login
// @include      https://*.cfan.cc/*
// @include      https://cfan.cc/*
// @author       wujixian
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/399758/CTO%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/399758/CTO%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function () {
  //获取当前所有cookie
  var strCookies = document.cookie;
  if (strCookies.indexOf("ep_userauth")==-1) {           
    document.cookie="ep_userauth=HcRgic8pSDFAK4Icn6fANr6MRqW0%2F1BsZoJEv0UNTfQcQAJ47CTZjflI8jg%3D;domain=cfan.cc;path=/;";
    location.reload();
  }
}) ();