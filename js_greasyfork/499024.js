// ==UserScript==
// @name         Redirect to dashboard - NewsBlur
// @namespace    http://tampermonkey.net/
// @version      1
// @description  NewsBlur Redirect
// @author       hacker09
// @match        https://newsblur.com/account/login
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499024/Redirect%20to%20dashboard%20-%20NewsBlur.user.js
// @updateURL https://update.greasyfork.org/scripts/499024/Redirect%20to%20dashboard%20-%20NewsBlur.meta.js
// ==/UserScript==

setTimeout(function() {
    var cookies = document.cookie.split('; ');
    for (var i = 0; i < cookies.length; i++) {
      if (cookies[i].startsWith('newsblur_sessionid=')) {
        window.location.href = 'https://newsblur.com';
        break;
      }
    }
}, 0);