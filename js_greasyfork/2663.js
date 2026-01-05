// ==UserScript==
// @id             www.reddit.com-2ca62852-ef97-4aa5-9f42-e6c7d458a473@https://greasyfork.org/users/98-jonnyrobbie
// @name           Reddir up-downvote restore
// @version        1.2
// @namespace      https://greasyfork.org/users/98-jonnyrobbie
// @author         JonnyRobbie
// @description    Adds vote count on reddit submissions
// @include        /https?:\/\/(www\.)?reddit\.com\/r\/[a-zA-Z]+\/comments\/.*/
// @run-at         document-end
// @downloadURL https://update.greasyfork.org/scripts/2663/Reddir%20up-downvote%20restore.user.js
// @updateURL https://update.greasyfork.org/scripts/2663/Reddir%20up-downvote%20restore.meta.js
// ==/UserScript==

/*
CHANGELOG:
1.2
-added vote bar next to the thumbnail
1.1.2
-fixed dividing by zero
-another minor bugs
1.0
-Initial release
*/

function insertNodeAfter(node, sibling) {
    sibling.parentNode.insertBefore(node, sibling.nextSibling);
}

function getNetVotes() {
    return parseInt(document.getElementsByClassName("linkinfo")[0].getElementsByClassName("number")[0].innerHTML.replace(",", ""), 10);
}

function getPercent() {
    var regex = /.*\(([0-9]{2,3})% upvoted\).*/;
    var linkhtml = document.getElementsByClassName("linkinfo")[0].textContent;
    var perc = parseInt(linkhtml.replace(regex, "$1"), 10)/100;
    return perc;
}

function appendVotes() {
    console.log("Upvotes start");
    var V = getNetVotes();
    var p = getPercent();
    console.log(V);
    console.log(p);
    if (p == 0.5) {
        var U = 0;
        var D = 0;
        var T = 0;
    } else {
        var U = Math.round((V*p)/(2*p-1));
        var D = U - V;
        var T = U + D;
    }
    var vote_box = document.createElement("div");
        vote_box.style.fontWeight = "bold";
    var upvote_box = document.createElement("span");
        upvote_box.innerHTML = U;
        upvote_box.style.color = "rgb(255, 139, 36)"
    var divider = document.createElement("span");
        divider.innerHTML = " | ";
        divider.style.color = "rgb(143, 143, 143)"
    var downvote_box = document.createElement("span");
        downvote_box.innerHTML = D;
        downvote_box.style.color = "rgb(148, 148, 255)"
    var totalvote_box = document.createElement("span");
        totalvote_box.style.color = "rgb(143, 143, 143)"
        totalvote_box.innerHTML = "(" + T + ")";
    vote_box.appendChild(upvote_box);
    vote_box.appendChild(divider);
    vote_box.appendChild(downvote_box);
    vote_box.appendChild(divider.cloneNode(true));
    vote_box.appendChild(totalvote_box);
    var linkinfo = document.getElementsByClassName("linkinfo")[0];
    insertNodeAfter(vote_box, linkinfo.getElementsByClassName("score")[0]);
}

function inter(A, B, r) {
	return Math.round((A*r)+(B*(1-r)));
}

function appendVoteBar() {
    var voteBar = document.createElement("div");
	    voteBar.style.width = "3px";
		voteBar.style.cssFloat = "left";
	var arrows = document.getElementById("siteTable").getElementsByClassName("midcol")[0];
	console.log("Arrows computed style: " + window.getComputedStyle(arrows, null).getPropertyValue("height"));
		voteBar.style.height = window.getComputedStyle(arrows, null).getPropertyValue("height");
	if (parseInt(window.getComputedStyle(arrows, null).getPropertyValue("margin-right"), 10) != 0) {
		voteBar.style.marginLeft = "-" + window.getComputedStyle(arrows, null).getPropertyValue("margin-right");
		voteBar.style.marginRight = window.getComputedStyle(arrows, null).getPropertyValue("margin-right");
	} else {
		voteBar.style.marginLeft = "-7px";
		voteBar.style.marginRight = "7px";
	}
	var colHeight = parseInt(window.getComputedStyle(arrows, null).getPropertyValue("height"), 10);
	var upHeight = Math.floor(colHeight * getPercent());
	var downHeight = Math.floor(colHeight * (1 - getPercent()));
	var alias = (colHeight * getPercent()) - Math.floor(colHeight * getPercent());
	var colorBar = document.createElement("div");
		colorBar.style.height = (colHeight - upHeight - downHeight) + "px";
		colorBar.style.backgroundColor = "rgb(" + inter(255, 148, alias) + ", " + inter(139, 148, alias) + ", " + inter(36, 255, alias) + ")";
		colorBar.style.borderBottom = upHeight + "px solid rgb(255, 139, 36)";
		colorBar.style.borderTop = (colHeight - upHeight - 1) + "px solid rgb(148, 148, 255)";
		voteBar.style.border = "1px solid rgb(" + inter(255, 148, getPercent()) + ", " + inter(255, 148, getPercent()) + ", " + inter(255, 148, getPercent()) + ")";
	voteBar.appendChild(colorBar);
	insertNodeAfter(voteBar, arrows);
}

function main() {
    appendVotes();
	appendVoteBar();
}

main();