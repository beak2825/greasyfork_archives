// ==UserScript==
// @name        Legible Hacker News
// @namespace   ycombinator.com
// @description Improve Typography
// @include     https://news.ycombinator.com/*
// @version     0.1
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/430770/Legible%20Hacker%20News.user.js
// @updateURL https://update.greasyfork.org/scripts/430770/Legible%20Hacker%20News.meta.js
// ==/UserScript==

GM_addStyle(`
center {
 float: left;
}

#hnmain {
  min-width: unset;
  max-width: 72ch;
  background-color: rgba(250,249,247);
}
body {
  background-color: #faf9f752;

}

td[bgcolor="#ff6600"] {
  background-color: rgb(250,249,247);
}

.comment,.comhead,title a,.title {
 font-family: IBM Plex Sans, Helvetica, sans-serif;
 line-height: 1.5;
 font-size: 14px;
}

.comment {
  margin-right: 1rem;
}

.comment-tree {
}

.c00, .c00 a:link, a:link {
  color: #252525;
}

.pagetop {
  font-size: 10px;
}

textarea {
  height: 1em;
  border: 1px solid lightgrey;
  border-radius: 3px;
}

`)
