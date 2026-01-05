// ==UserScript==
// @name        Wanikani - save review stats
// @author      tomboy
// @namespace   japanese
// @description save wanikani review stats
// @include     http*://www.wanikani.com/review
// @license     GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @version     0.22
// @grant       GM_xmlhttpRequest
// @require     http://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js
// @require     https://greasyfork.org/scripts/5392-waitforkeyelements/code/WaitForKeyElements.js?version=115012
// @downloadURL https://update.greasyfork.org/scripts/22241/Wanikani%20-%20save%20review%20stats.user.js
// @updateURL https://update.greasyfork.org/scripts/22241/Wanikani%20-%20save%20review%20stats.meta.js
// ==/UserScript==

$ = unsafeWindow.$;
var url = 'https://wk-review-stats.herokuapp.com/review-sessions';
waitForKeyElements('#last-session-date time:contains("ago")', sendStats);

function sendStats(node) {
  var params = { answered_correctly: $('#correct h2 strong').text(),
                 answered_incorrectly: $('#incorrect h2 strong').text(),
                 activity_at: $('#last-session-date time').attr('datetime') };

  console.log('sending review stats ', params, ' to ', url);
  GM_xmlhttpRequest({
    method: "POST",
    url: url,
    data: JSON.stringify(params),
    headers: { 'Content-Type': 'application/json' },
    onload: function(response) { console.log('review stats saved: ', response.responseText); },
    onerror: function(reponse) { console.log('review stats error: ', reponse); }
  })
}
