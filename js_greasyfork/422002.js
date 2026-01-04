// ==UserScript==
// @name         AutoBlackboardAuth
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://blackboard.jhu.edu/webapps/login/
// @match        https://blackboard.jhu.edu/webapps/login/?*
// @grant        none
// @require http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/422002/AutoBlackboardAuth.user.js
// @updateURL https://update.greasyfork.org/scripts/422002/AutoBlackboardAuth.meta.js
// ==/UserScript==

$.noConflict()
window.location.href = "https://blackboard.jhu.edu/webapps/login/sm/index.jsp?new_loc="+new URLSearchParams(window.location.search).get("new_loc")