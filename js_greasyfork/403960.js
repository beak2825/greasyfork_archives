// ==UserScript==
// @name              Hacker News - Dark Theme
// @namespace      http://userscripts.org/users/509235
// @description      A dark theme for Hacker News (YCombinator).
// @include           https://news.ycombinator.com*
// @grant             none
// @version          1.0
// @downloadURL https://update.greasyfork.org/scripts/403960/Hacker%20News%20-%20Dark%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/403960/Hacker%20News%20-%20Dark%20Theme.meta.js
// ==/UserScript==
 
const style = `
  body {
    background: #332725;
  }
  * {
    font-family: Helvetica Neue;
    font-weight: 400;
    line-height: 1.6;
  }
  table#hnmain {
    background: transparent;
  }
  table.itemlist > *,
  table.fatitem > *,
  table.comment-tree > *{
    filter: invert()
  }`
 
const x = document.createElement('style')
x.innerHTML = style
document.body.appendChild(x)