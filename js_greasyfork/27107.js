// ==UserScript==
// @name         MangaHere AutoLogin
// @namespace    http://www.mangahere.co/
// @version      0.1
// @description  logs in automatically if not logged in.
// @author       Nazgand
// @match        http://www.mangahere.co/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27107/MangaHere%20AutoLogin.user.js
// @updateURL https://update.greasyfork.org/scripts/27107/MangaHere%20AutoLogin.meta.js
// ==/UserScript==
(function () {
  'use strict';
  const name = 'Nazgand';
  const pass = 'SuperSecret';
  setTimeout(function () {
    if (document.querySelector('span a').innerHTML == '[ Sign In ]') {
      boxShow('sign_in');
      const f = document.getElementById("signinform");
      f.elements.namedItem("name").value = name;
      f.elements.namedItem("pass").value = pass;
      document.getElementById('normal_login').click();
    }
  }, 800);
})();