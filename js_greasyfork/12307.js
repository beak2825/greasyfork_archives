// ==UserScript==
// @name         Forum Tracker
// @namespace    https://greasyfork.org/en/users/9694-croned
// @version      1.0.7
// @description  Alerts when new forum posts are made
// @author       Croned
// @match        https://epicmafia.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/12307/Forum%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/12307/Forum%20Tracker.meta.js
// ==/UserScript==

console.log("Forum Tracker activated!");

//Get the list of tracked reports
var forumJSON = GM_getValue("em_forumList");
if (forumJSON) {
	forumJSON = JSON.parse(forumJSON);
}
else {
	forumJSON = {data: []};
    GM_setValue("em_forumList", JSON.stringify(forumJSON));
}
//console.log(forumJSON);
var forumList = forumJSON.data;

//Set the checker interval
var checkInt = setInterval(function() {
	forumJSON = GM_getValue("em_forumList");
	forumJSON = JSON.parse(forumJSON);
	forumList = forumJSON.data;
	
	var tempJSON = forumJSON;
	
	for (var index in forumList) {
		var forumObj = forumList[index];
		(function(forum, i){
			$.get("/topic/" + forum.id, function(page){
				var div = $("<div></div>");
				div.html(page);
				if (div.find("#posts_inner")[0]) {
					if (div.find("#posts_inner .post")[0]) {
						var lastPost = parseInt(div.find("#posts_inner .post").last().attr("id").split("_")[1]);
					}
					else {
						var lastPost = 0;
					}
					/*console.log(div);
					console.log(lastPost);
					console.log(forum.id);*/
					
					if (lastPost > forum.lastPost) {
						//console.log("Topic " + forum.id + " has new posts!");
						errordisplay(".errordisplay", "<a href='/topic/" + forum.id + "'>(" + forum.title + ")</a> " + div.find("#posts_inner .post").last().find("[data-type*='userinfo']").text() + ": " + div.find("#posts_inner .post").last().find(".bubble_msg").text().substring(0, 75) + "...");
						//alert("Topic " + forum.id + " has new posts!");
						tempJSON.data[i].lastPost = lastPost;
						setTimeout(function(){
							GM_setValue("em_forumList", JSON.stringify(tempJSON));
						}, 500);
					}
				}
				else {
					//console.log("Topic " + forum.id + " was deleted!");
					errordisplay(".errordisplay", forum.title + " was deleted!");
					//alert("Topic " + forum.id + " was deleted!");
					tempJSON.data.splice(i, 1);
					setTimeout(function(){
						GM_setValue("em_forumList", JSON.stringify(tempJSON));
					}, 500);
				}
			});
		})(forumObj, index);
	}
}, 5000);

//Insert checkboxes for tracking on report pages
var isTopic = $(".topic-title")[0];
if (isTopic) {
	$("#threadmaker").append("<div class='mini_vote'><input type='checkBox' id='trackBox'></input> Track</div>");
}

//Check boxes of reports already tracked
for (var index in forumList) {
	if (forumList[index].id == window.location.pathname.split("/")[2]) {
		$("#trackBox").prop('checked', true);
	}
}

//Detect checkbox checking
var matches;
$("#trackBox").click(function() {
	if ($("#trackBox").prop('checked')) {
		if ($("#posts_inner .post").length > 0) {
			forumJSON.data.push({ id: window.location.pathname.split("/")[2], lastPost: parseInt($("#posts_inner .post").last().attr("id").split("_")[1]), title: $(".topic-title").contents().filter(function() {return this.nodeType == 3})[0].nodeValue });
			GM_setValue("em_forumList", JSON.stringify(forumJSON));
		}
		else {
			forumJSON.data.push({ id: window.location.pathname.split("/")[2], lastPost: 0, title: $(".topic-title").text() });
			GM_setValue("em_forumList", JSON.stringify(forumJSON));
		}
	}
	else {
		for (var index in forumList) {
			if (forumJSON.data[index].id == window.location.pathname.split("/")[2]) {
				forumJSON.data.splice(index, 1);
				GM_setValue("em_forumList", JSON.stringify(forumJSON));
			}
		}
	}
});