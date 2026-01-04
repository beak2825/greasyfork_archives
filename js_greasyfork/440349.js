// ==UserScript==
// @name        Fix Voting
// @namespace   incelerated
// @author      incelerated
// @version     0.2
// @match       https://incels.is/threads/*
// @require     https://code.jquery.com/jquery-3.5.1.min.js
// @description A script that (kinda) fixes voting issue on classic 2019 themes on .is
// @licence		Creative Commons Attribution-NonCommercial-ShareAlike (CC-BY-NC-SA)
// @downloadURL https://update.greasyfork.org/scripts/440349/Fix%20Voting.user.js
// @updateURL https://update.greasyfork.org/scripts/440349/Fix%20Voting.meta.js
// ==/UserScript==


l = $(".p-breadcrumbs a:contains('Suggestions')").length;
if(l<=0){
	return;
}

XF.ajax(
    "get",
    "/forums/suggestions.7/",
    {},
    function(data){
		//get vote count for thread
        var count = $(data.html.content).find("[data-content-id=thread-355387] > span").html();
		var html = 
		`
			<div class="message-cell message-cell--vote">
				<div class="contentVote js-contentVote " data-xf-init="content-vote" data-content-id="thread-355387">
					<a href="/threads/fix-classic-dark-2019-please.355387/vote?type=up" class="contentVote-vote  contentVote-vote--up" data-vote="up"><span class="u-srOnly">Upvote</span></a>
					<span class="contentVote-score js-voteCount">**score**</span>
					<a href="/threads/fix-classic-dark-2019-please.355387/vote?type=down" class="contentVote-vote  contentVote-vote--down " data-vote="down"><span class="u-srOnly">Downvote</span></a>
				</div>
			</div>
		`;
		html = html.replace('**score**', count);
		$(".block--messages:first .message-inner").append(html);
    },
    {skipDefault: true, dataType: 'json'}
);
