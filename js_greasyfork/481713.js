// ==UserScript==
// @name        LeetCode sendBeacon fix
// @namespace   griffi-gh145675
// @match       *://leetcode.com/problemset/
// @grant       none
// @version     1.0
// @author      griffi-gh
// @description fix LeetCode in Firefox
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/481713/LeetCode%20sendBeacon%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/481713/LeetCode%20sendBeacon%20fix.meta.js
// ==/UserScript==

if(!navigator.sendBeacon) navigator.sendBeacon = () => {};