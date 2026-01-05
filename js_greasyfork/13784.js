// ==UserScript==
// @name         Fisheye links for jira
// @namespace    http://regretless.com/
// @version      0.5
// @description  Add fisheye links to jira
// @author       Ying Zhang
// @require      https://cdnjs.cloudflare.com/ajax/libs/zepto/1.1.6/zepto.min.js
// @match        https://jira.meredith.com/dt/browse/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/13784/Fisheye%20links%20for%20jira.user.js
// @updateURL https://update.greasyfork.org/scripts/13784/Fisheye%20links%20for%20jira.meta.js
// ==/UserScript==


// figure out the ticket number
$(document).ready(function() {
    var url = window.location.href.split("?")[0];
    var ticket = (url).match(/browse\/([A-Z]{2,4}-\d{1,4})/)[1]
    
    $issueDetails = $('#issuedetails');

    var markup = '<li class="item full-width"> \
<div class="wrap" id="wrap-labels"> \
<strong class="name">Fisheye Links:</strong> \
<div class="labels-wrap value"> \
<a href="https://codereview.meredith.com/search/emktg/?tag=' + ticket + '&datesortorder=DESCENDING&groupby=changeset&col=path&col=revision&col=author&col=date&col=tags&refresh=y" target="_blank">Tagged</a> | \
<a href="https://codereview.meredith.com/search/emktg/?ql=select%20revisions%20from%20dir%20%22%2F%22%20where%20tagged%20' + ticket + '%20and%20%28not%20tagged%20RFI%29%20order%20by%20date%20desc%20group%20by%20dir%20return%20path%2C%20tags" target="_blank">Missing RFI</a> | \
<a href="https://codereview.meredith.com/search/emktg/?ql=select%20revisions%20from%20dir%20%22%2F%22%20where%20tagged%20' + ticket + '%20and%20%28not%20tagged%20RFT%29%20order%20by%20date%20desc%20group%20by%20dir%20return%20path%2C%20tags" target="_blank">Missing RFT</a> \
</div> \
</div> \
</li>';

    $issueDetails.append($(markup));
});
