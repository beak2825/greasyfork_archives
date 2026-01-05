// ==UserScript==
// @name        YT Hide Recommended Vidz Material Design(German)
// @namespace   https://greasyfork.org/de/scripts/28871-yt-hide-recommended-vidz-material-design-german/
// @description Hides recommended videos in sidebar on new material design
// @author      anideath
// @include     https://www.youtube.com/watch?v=*
// @version     1.0.0
// @require     https://greasyfork.org/scripts/6250-waitforkeyelements/code/waitForKeyElements.js?version=23756
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.2.0/jquery.min.js
// run-at 		document-idle
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/28871/YT%20Hide%20Recommended%20Vidz%20Material%20Design%28German%29.user.js
// @updateURL https://update.greasyfork.org/scripts/28871/YT%20Hide%20Recommended%20Vidz%20Material%20Design%28German%29.meta.js
// ==/UserScript==

waitForKeyElements (".style-scope ytd-compact-video-renderer", actionFunction);

function actionFunction (jNode) {
    $(".style-scope ytd-compact-video-renderer:contains('Empfohlenes Video')").hide();
//  $(".style-scope ytd-compact-video-renderer:contains('Recommended for you')").hide();
}