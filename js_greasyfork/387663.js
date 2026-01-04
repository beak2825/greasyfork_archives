// ==UserScript==
// @name        Yupoo to HTTPS converter
// @namespace   https://www.reddit.com/user/RobotOilInc
// @license     MIT
// @version     0.2.1
// @description Auto Redirect from non HTTP to HTTPS
// @author      RobotOilInc
// @match       http://*.x.yupoo.com/albums*
// @icon	    https://s.yupoo.com/website/4.7.6/favicon.ico
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/387663/Yupoo%20to%20HTTPS%20converter.user.js
// @updateURL https://update.greasyfork.org/scripts/387663/Yupoo%20to%20HTTPS%20converter.meta.js
// ==/UserScript==

window.location.href = window.location.href.replace('http://', 'https://');
