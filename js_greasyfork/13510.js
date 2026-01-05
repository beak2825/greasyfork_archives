// ==UserScript==
// @name        Chatzy frame style
// @namespace   Raku
// @description uses frame stylesheet
// @include     http://*.chatzy.com/*
// @version     1.1
// @grant       none
// @require     http://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/13510/Chatzy%20frame%20style.user.js
// @updateURL https://update.greasyfork.org/scripts/13510/Chatzy%20frame%20style.meta.js
// ==/UserScript==
window.setInterval(function () {
  document.getElementById('X457').href = document.getElementById('X457').href.replace('default', 'frame');
}, 1000);