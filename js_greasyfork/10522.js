// ==UserScript==
// @name         Facebook Groups redirect
// @description  Force Group links to open the individual comment thread you're attempting to view, instead of loading the entire group view
// @local        en
// @match        https://www.facebook.com/*
// @grant        GM_log
// @run-at		 document-start
// @version 0.0.1.20150619223301
// @namespace https://greasyfork.org/users/12550
// @downloadURL https://update.greasyfork.org/scripts/10522/Facebook%20Groups%20redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/10522/Facebook%20Groups%20redirect.meta.js
// ==/UserScript==

reTest = /^https:\/\/www\.facebook\.com\/groups\/([^\/]+)\/(\d+)\/(.*)$/;

(function (old) {
    window.history.pushState = function () {
        old.apply(window.history, arguments);
        if (window.location.href.match(reTest)) {
            window.location.replace(window.location.href.replace(reTest, 'https://www.facebook.com/groups/$1/permalink/$2/$3'));
        }
    }
})(window.history.pushState);

if (window.location.href.match(reTest)) {
    window.location.replace(window.location.href.replace(reTest, 'https://www.facebook.com/groups/$1/permalink/$2/$3'));
}