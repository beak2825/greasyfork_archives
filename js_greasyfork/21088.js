// ==UserScript==
// @name        GameFAQS Auto-Redirect to Printable
// @namespace   rudicron
// @description Whenever a GameFAQs FAQ is loaded, redirect to the Printable Version of said FAQ.
// @include     http://www.gamefaqs.com/*/*/faqs/*
// @include     https://www.gamefaqs.com/*/*/faqs/*
// @exclude     http://www.gamefaqs.com/*/*/faqs/*?print=*
// @exclude     https://www.gamefaqs.com/*/*/faqs/*?print=*
// @exclude     http://www.gamefaqs.com/*/*/faqs/*&print=*
// @exclude     https://www.gamefaqs.com/*/*/faqs/*&print=*
// @include     http://gamefaqs.gamespot.com/*/*/faqs/*
// @include     https://gamefaqs.gamespot.com/*/*/faqs/*
// @exclude     http://gamefaqs.gamespot.com/*/*/faqs/*?print=*
// @exclude     https://gamefaqs.gamespot.com/*/*/faqs/*?print=*
// @exclude     http://gamefaqs.gamespot.com/*/*/faqs/*&print=*
// @exclude     https://gamefaqs.gamespot.com/*/*/faqs/*&print=*
// @version     1.3
// @grant       none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/21088/GameFAQS%20Auto-Redirect%20to%20Printable.user.js
// @updateURL https://update.greasyfork.org/scripts/21088/GameFAQS%20Auto-Redirect%20to%20Printable.meta.js
// ==/UserScript==

//attempt move before anything else runs (would really like to do this before css and other js are retrieved, but GM limitations.)
if ( window.location.href.includes("?") ) {
    window.location.replace(window.location.href.concat("&print=1"));
} else {
    window.location.replace(window.location.href.concat("?print=1"));
}
