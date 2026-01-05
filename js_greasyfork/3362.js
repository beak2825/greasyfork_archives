// ==UserScript==
// @name StackExchange obvious followed link color
// @namespace http://ostermiller.org/
// @version 1.05
// @license MIT
// @description Change the color of followed links on all StackExchange sites so they they are easily distinguishable.
// @include /https?\:\/\/([a-z\.]*\.)?stackexchange\.com\/.*/
// @include /https?\:\/\/([a-z\.]*\.)?askubuntu\.com\/.*/
// @include /https?\:\/\/([a-z\.]*\.)?superuser\.com\/.*/
// @include /https?\:\/\/([a-z\.]*\.)?serverfault\.com\/.*/
// @include /https?\:\/\/([a-z\.]*\.)?stackoverflow\.com\/.*/
// @include /https?\:\/\/([a-z\.]*\.)?answers.onstartups\.com\/.*/
// @grant GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/3362/StackExchange%20obvious%20followed%20link%20color.user.js
// @updateURL https://update.greasyfork.org/scripts/3362/StackExchange%20obvious%20followed%20link%20color.meta.js
// ==/UserScript==
GM_addStyle("body{--theme-question-title-color-visited:#9C7816}")