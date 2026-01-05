// ==UserScript==
// @name        CMTBiddingHelper
// @description Order and Summarize Bids (CMT Microsoft Research)
// @namespace   notableTieView
// @include     https://cmt.research.microsoft.com/*/Protected/Reviewer/ManageBidsByRelevance.aspx
// @version     1
// @grant       none
// @require https://code.jquery.com/jquery-2.1.4.min.js

// @downloadURL https://update.greasyfork.org/scripts/18513/CMTBiddingHelper.user.js
// @updateURL https://update.greasyfork.org/scripts/18513/CMTBiddingHelper.meta.js
// ==/UserScript==


lastPos = [0,0,0,0];

lines=$('#ctl00_cph_bidsByRelevance_submissionsByRelevance_gviewSubmissions tbody tr');

$('#ctl00_cph_bidsByRelevance_submissionsByRelevance_lblCounter').after('<div style="padding:10px;"><table id="bidSummary"><tbody><tr><th>Bid</th><th>Count</th></tr></tbody></table></div>');

lastLine = lines.eq(0); 

for (i=3; i>-1; i--) { // there are 4 bids (0-3) and the status not entered
bidLines=$(lines).filter(function (index) {
  return $(this).find('td').eq(5).children('label').text().indexOf(i) == 0; 
});
bidLines.remove();
$(lastLine).after(bidLines);
lastLine=bidLines.last();
currLabel=$(lastLine).find('td').eq(5).children('label').first().clone();
addLine=$("<tr>");
addLine.append("<td>");
addLine.append("<td>");
addLine.children('td').first().append(currLabel);
addLine.children('td').last().html(bidLines.length);
addLine.children('td').last().attr("align", "right")
$('#bidSummary tr').last().after(addLine);
}