// ==UserScript==
// @name The West - autologin
// @author You
// @description The West 3.0
// @namespace    http://tampermonkey.net/
// @include https://*.the-west.*/index.php?page=logout
// @include https://www.the-west.*
// @include https://beta.the-west.net*
// @exclude https://*.the-west.net*
// @version 0.1
// @icon https://the-west.net/favicon.ico
// @license MIT 
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/491885/The%20West%20-%20autologin.user.js
// @updateURL https://update.greasyfork.org/scripts/491885/The%20West%20-%20autologin.meta.js
// ==/UserScript==
(function (fn) {
    var script = document.createElement('script');
    script.setAttribute('type', 'application/javascript');
    script.textContent = '(' + fn.toString() + ')();';
    document.body.appendChild(script);
    document.body.removeChild(script);
  })(function () {
    if (location.href.includes('index.php?page=logout')) {
      location.href = '/';
      return;
    } 
    if (!location.hash.includes('loginWorld')) return;

    setTimeout(function () {
      $('#loginButton').click();
      let val = setInterval(function () {
        let u = Worlds.playerWorlds;
        if (Object.keys(u).length !== 0) {
          clearInterval(val);
          Auth.login(u[parseFloat(location.hash.replace(/\D/g, ''))]);
        }
      }, 500);
    }, 1000);

    });