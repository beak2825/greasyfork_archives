// ==UserScript==
// @name         PandaCrazy Slack Helper
// @namespace    https://greasyfork.org/en/users/710-tjololo
// @version      0.0.3
// @description  Add PandaCrazy Buttons to Slack
// @author       Tjololo
// @match        https://*.slack.com/*
// @require      https://code.jquery.com/jquery-latest.js
// @grant        GM_Log
// @downloadURL https://update.greasyfork.org/scripts/373825/PandaCrazy%20Slack%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/373825/PandaCrazy%20Slack%20Helper.meta.js
// ==/UserScript==

function addPCButton() {
    var titleRegex = /Title: (.+?) •/;
    var requesterRegex = /Requester: (.+?) •/;
    var rewardRegex = /Reward: \$?([\d\.])+/
	let messages = Array.from(document.querySelectorAll('.c-message__content > span:not(.checked-for-button)'))
	messages.forEach(anchorElement => {
		/* Only check once */
		anchorElement.classList.add('checked-for-button');
        if ($(anchorElement).find('a[href*="accept_random"]').length)
        {
            var elemText = $(anchorElement).text();
            var title = encodeURIComponent(titleRegex.exec(elemText)[1].trim());
            var req = encodeURIComponent(requesterRegex.exec(elemText)[1].trim());
            var rew = encodeURIComponent(rewardRegex.exec(elemText)[1].trim());
            var previewLink = $(anchorElement).find('a[href*="accept_random"]')[0].innerHTML;
            var groupId = encodeURIComponent(previewLink.split("/projects/")[1].split("/")[0].trim());
            var requesterLink = $(anchorElement).find('a[href*="requesters"]')[0].innerHTML;
            var requesterId = encodeURIComponent(requesterLink.split("requesters")[1].split("/")[0].trim());
            var add = $('<button/>',
                         {
                text: 'Panda',
                click: function () { window.open("https://worker.mturk.com/requesters/PandaCrazyAdd/projects?JRGID=" + groupId + "&JRRName=" +
                                                 req + "&JRRID=" + requesterId + "&JRTitle=" + title + "&JRReward=" + rew);
                                   },
                id: requesterId + "_add_butt"
            });
            var once = $('<button/>',
                         {
                text: 'Once',
                click: function () { window.open("https://worker.mturk.com/requesters/PandaCrazyOnce/projects?JRGID=" + groupId + "&JRRName=" +
                                                 req + "&JRRID=" + requesterId + "&JRTitle=" + title + "&JRReward=" + rew);
                                   },
                id: requesterId + "_once_butt"
            });
            var search = $('<button/>',
                         {
                text: 'Search',
                click: function () { window.open("https://worker.mturk.com/requesters/PandaCrazySearch/projects?JRGID=" + groupId + "&JRRName=" +
                                                 req + "&JRRID=" + requesterId + "&JRTitle=" + title + "&JRReward=" + rew);
                                   },
                id: requesterId + "_search_butt"
            });
            if ($("#"+requesterId+"_add_butt").length == 0) {
                $(anchorElement).append(add);
                $(anchorElement).append(once);
                $(anchorElement).append(search);
            }
        }

	});
}

$(function() {
	$('#messages_container').find('div.c-virtual_list__scroll_container').on('DOMSubtreeModified', addPCButton);
});