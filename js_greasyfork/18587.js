// ==UserScript==
// @name          AnimeFTW's d2jsp post blocker
// @description   Hides posts from a defined list of users
// @namespace	  d2jsp.animeftw
// @include       https://forums.d2jsp.org/topic.php?t=*&f=*
// @include	      https://forums.d2jsp.org/topic.php?t=*
// @include	      https://forums.d2jsp.org/guild.php?t=*
// @include	      https://forums.d2jsp.org/post.php
// @grant none
// @version 0.0.1.20160411015724
// @downloadURL https://update.greasyfork.org/scripts/18587/AnimeFTW%27s%20d2jsp%20post%20blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/18587/AnimeFTW%27s%20d2jsp%20post%20blocker.meta.js
// ==/UserScript==

(function(){

function refresh()
{
	var users = getUserList();
	var posts = getPosts();

	// Delete all [(Un)Block User] tags
	var blockTags = document.querySelectorAll(".block-tag");
	for(var j = 0, btl = blockTags.length; j < btl; j++){
		var tag = blockTags[j];
		tag.parentNode.removeChild(tag);
	}

	// Block posts
	for(var i = 0, l = posts.length; i < l; i++)
	{
		var post = posts[i];
		var postTop = post.querySelector("dt > a");
		var userLink = postTop !== null ? postTop.href : "";
		var postHeader = post.querySelector("dd > .desc");

		// Not a user's post
		if(!~userLink.indexOf("user.php?i="))
			continue;

		var userId = userLink.substring(userLink.indexOf("i=") + 2);
		var postLinks = postHeader.querySelector(".links");

		if(!!~users.indexOf(userId)){
			blockPost(post);

			// Create [Unblock User] button
			var postId =  postHeader.querySelector("span").id;
			var unblockBtn = createButton("[Unblock User]", unblockUser, [userId, postId]);
			postLinks.insertBefore(unblockBtn, postLinks.firstChild)
		} else {
			// Create [Block User] button
			var blockBtn = createButton("[Block User]", blockUser, [userId]);
			postLinks.insertBefore(blockBtn, postLinks.firstChild)
		}
	}
}

function createButton(text, fn, fnParams){
	var btn = document.createElement("a");
	btn.setAttribute("style","color:#f66;font-weight:bold;");
	// btn.setAttribute("href", "javascript:void(0);");
	btn.className = "block-tag";
	btn.innerHTML = text;
	btn.onclick = (function(params){
		return function(){
			fn.apply(null, Array.prototype.slice.call(params));
		}
	})(fnParams);
	return btn;
}

function getUserList(){
	if(localStorage["AnimePostBlocker"] == undefined) 
		localStorage["AnimePostBlocker"] = "[]";

	var users = JSON.parse(localStorage["AnimePostBlocker"]);

	// Fix garbage/corrupted data
	if(users instanceof Array != true){
		users = [];
		localStorage["AnimePostBlocker"] = JSON.stringify(users);
	}

	return JSON.parse(localStorage["AnimePostBlocker"]);
}

function getPosts(){
	return document.querySelectorAll("[name='REPLIER'] dl");
}

function blockUser(id){
	var users = getUserList();
	users.push(id);
	localStorage["AnimePostBlocker"] = JSON.stringify(users);
	refresh();
}

function unblockUser(id, postId){
	var users = getUserList();
	var index = users.indexOf(id);

	if (index > -1)
	    users.splice(index, 1);

	localStorage["AnimePostBlocker"] = JSON.stringify(users);
	window.location = [window.location.href.split("#")[0], "#", postId].join("");
	window.location.reload();
}

function blockPost(post){
	var postContent = post.querySelector("dd > .bts.ppc");

	postContent.innerHTML = 
		["<div class='blocked-post' ", 
			  "style='text-align:center;font-weight:bold;color:#f66;padding:.5em;'>",
			"This user is blocked.",
		"</div>"].join("");
}

refresh();
    
})();