// ==UserScript==
// @name         Mobile Taobao to Desktop
// @namespace    https://www.reddit.com/user/RobotOilInc
// @version      0.1
// @description  Auto Redirect from mobile Taobao to desktop
// @author       RobotOilInc
// @match        https://m.intl.taobao.com/detail/detail.htm*
// @run-at       document-start
// @icon	     https://img.alicdn.com/tfs/TB1yvFEXgMPMeJjy1XdXXasrXXa-192-192.png
// @downloadURL https://update.greasyfork.org/scripts/427641/Mobile%20Taobao%20to%20Desktop.user.js
// @updateURL https://update.greasyfork.org/scripts/427641/Mobile%20Taobao%20to%20Desktop.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

window.location.href = `https://item.taobao.com/item.htm?id=${(new URLSearchParams(window.location.search)).get('id')}&rd=t`;