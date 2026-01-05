// ==UserScript==
// @name          Reddeheme - Black Ops 3 - Dark Theme
// @namespace     https://github.com/iHydra
// @version       1.0
// @description   Theme for /r/BlackOps3 Subreddit
// @match         *.reddit.com/r/blackops3*
// @author        FatalHydra
// @require       https://code.jquery.com/jquery-2.1.4.min.js
// @resource      BO3CSS https://raw.githubusercontent.com/iHydra/reddeheme/master/style-bo3-v.1_0.css
// @grant         GM_addStyle
// @grant         GM_getResourceText
// @run-at        document-start
// @downloadURL https://update.greasyfork.org/scripts/15621/Reddeheme%20-%20Black%20Ops%203%20-%20Dark%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/15621/Reddeheme%20-%20Black%20Ops%203%20-%20Dark%20Theme.meta.js
// ==/UserScript==

// Inject /r/blackops3 Stylesheet
var BO3CSS = GM_getResourceText('BO3CSS');
GM_addStyle(BO3CSS);

// Javascript Editing for /r/blackops3

$(document).ready(function () {
    //for future features         
});
