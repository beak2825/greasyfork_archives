// ==UserScript==
// @name          Retweet in one click
// @description   Makes retweets behave the same as likes
// @author        Konf
// @namespace     https://greasyfork.org/users/424058
// @version       2.0.0
// @match         https://x.com/*
// @match         https://twitter.com/*
// @compatible    Chrome
// @compatible    Opera
// @compatible    Firefox
// @icon          https://t1.gstatic.com/faviconV2?client=SOCIAL&url=http://x.com&size=32
// @require       https://cdnjs.cloudflare.com/ajax/libs/arrive/2.4.1/arrive.min.js#sha512-wkU3qYWjenbM+t2cmvw2ADRRh4opbOYBjkhrPGHV7M6dcE/TR0oKpoDkWXfUs3HrulI2JFuTQyqPLRih1V54EQ==
// @run-at        document-start
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/468850/Retweet%20in%20one%20click.user.js
// @updateURL https://update.greasyfork.org/scripts/468850/Retweet%20in%20one%20click.meta.js
// ==/UserScript==

(function() {
  'use strict';

  (function main() {
    if (!document.documentElement) return setTimeout(main);

    document.arrive(
      'div[data-testid="retweetConfirm"], div[data-testid="unretweetConfirm"]',
      { existing: true }, b => b.click()
    );
  }());
})();
