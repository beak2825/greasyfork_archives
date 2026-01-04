// ==UserScript==
// @name        Hacker News Redirect to hn.premii.com
// @namespace   Violentmonkey Scripts
// @match       https://news.ycombinator.com/item
// @grant       none
// @version     1.0
// @author      Lukas Kucharczyk (lukas@kucharczyk.xyz)
// @description Automatically redirects Hacker News links to a more modern interface at hn.premii.com.
// @downloadURL https://update.greasyfork.org/scripts/416389/Hacker%20News%20Redirect%20to%20hnpremiicom.user.js
// @updateURL https://update.greasyfork.org/scripts/416389/Hacker%20News%20Redirect%20to%20hnpremiicom.meta.js
// ==/UserScript==
window.location.href='https://hn.premii.com/#/comments/' + new URLSearchParams(window.location.search).get('id')
