// ==UserScript==
// @name        SudOuest-free
// @description Permet d'accéder aux articles de SudOuest sans payer
// @include     https://www.sudouest.fr/*
// @grant       none
// @version     1.0.0
// @license     Creative Commons BY
// @run-at      document-end
// @namespace https://greasyfork.org/users/769269
// @downloadURL https://update.greasyfork.org/scripts/426067/SudOuest-free.user.js
// @updateURL https://update.greasyfork.org/scripts/426067/SudOuest-free.meta.js
// ==/UserScript==

(function () {
  _gsoi.cmd.push(function(){ _gsoi.require('session', 'article').then(function (modules) {
      var session = modules[0];
      var article = modules[1];
          article.release();
  })});
})();
