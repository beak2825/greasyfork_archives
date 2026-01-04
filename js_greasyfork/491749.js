// ==UserScript==
// @name         4chan /gif/ sound fix - CORS issue
// @version      0.1
// @description  Fix webm that are silenced because of CORS
// @namespace    https://greasyfork.org/users/191481
// @author       Zeper
// @match        *://*.4chan.org/gif/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=4chan.org
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/491749/4chan%20gif%20sound%20fix%20-%20CORS%20issue.user.js
// @updateURL https://update.greasyfork.org/scripts/491749/4chan%20gif%20sound%20fix%20-%20CORS%20issue.meta.js
// ==/UserScript==

var expandWebm_OStr = unsafeWindow.ImageExpansion.expandWebm.toString();
var regexResult = expandWebm_OStr.match(/(\w+)\.className\s*=\s*("|')expandedWebm\2([,;])/i);
eval((expandWebm_OStr.replace(regexResult[0],regexResult[1]+".crossOrigin="+regexResult[2]+"anonymous"+regexResult[2]+regexResult[3])).replace("function",'function expandWebm'));
unsafeWindow.ImageExpansion.expandWebm = expandWebm;