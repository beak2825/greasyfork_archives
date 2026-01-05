// ==UserScript==
// @name          Danbooru Post Link Rating
// @namespace     DoomTay
// @description   Finds links to posts on Danbooru and appends that post's rating to the end
// @include       http://danbooru.donmai.us/*
// @include       https://danbooru.donmai.us/*
// @version       1.2.3
// @license       GPL-3.0

// @downloadURL https://update.greasyfork.org/scripts/12867/Danbooru%20Post%20Link%20Rating.user.js
// @updateURL https://update.greasyfork.org/scripts/12867/Danbooru%20Post%20Link%20Rating.meta.js
// ==/UserScript==

var ratePools = false;

var links = document.links;

$(links).each(function(l)
{
	var postID;

	if(links[l].firstChild.nodeName == "IMG") return true;
	if(document.getElementById("pool-nav") && document.getElementById("pool-nav").contains(links[l])) return true;
	if(links[l].href.includes("/posts/") && /\/posts\/(\d+)/.test(links[l].href))
	{
		postID = /\/posts\/(\d+)/.exec(links[l].href)[1];
	}
	else if(links[l].href.includes("/post/show/") && /\/post\/show\/(\d+)(?:\/)?/.test(links[l].href))
	{
		postID = /\/post\/show\/(\d+)(?:\/)?/.exec(links[l].href)[1];
	}
	else if(links[l].href.includes("/pools/") && /\/pools\/(\d+)/.test(links[l].href) && ratePools)
	{
		var poolID = /\/pools\/(\d+)/.exec(links[l].href)[1];
		if(links[l].href.includes("?page=")) return true;
		if(links[l].href.includes("/edit")) return true;
		collectPool(links[l], poolID);
		return true;
	}
	else return true;
	if(window.location.href.includes(postID)) return true;
	if(!isNaN(postID)) appendPostRating(links[l],postID);
});

function getJSON(url)
{
	var promise = new Promise(function(resolve, reject) {
		$.getJSON(url,resolve).fail(function(response)
		{
			if(response.status == 421) reject("User Throttled");
			else if(response.status == 429) reject("Too Many Requests");
			else if(response.status == 502) setTimeout(function(){resolve(getJSON(url))},2000);
			else reject(response.statusText);
		});
	});
	return promise;
}

function appendPostRating(link,id)
{
	getJSON("/posts/" + id + ".json").then(data =>
	{
		link.after(" (rating: " + data.rating + ")");
	}).catch(reason => {
		link.after(" (" + reason + ")");
	});
}

function collectPool(link, id)
{

	getJSON("/pools/" + id + ".json").then(data =>
	{
		var pages = Math.ceil((data.post_count)/100);
		var searchCount = [];
		for(var c = 0; c < pages; c++)
		{
			searchCount[c] = getJSON("/posts.json?tags=pool:" + id + "&page=" + (c + 1) + "&limit=100");
		}
		return Promise.all(searchCount).then(data => [].concat.apply([], data));
	}).then(allPosts => {
		var gCount = allPosts.filter(post => post.rating == "g").length;
		var sCount = allPosts.filter(post => post.rating == "s").length;
		var qCount = allPosts.filter(post => post.rating == "q").length;
		var eCount = allPosts.filter(post => post.rating == "e").length;

		var total = allPosts.length;

		link.after(" (" + FractionToPercentage(gCount,total) + " g, " + FractionToPercentage(sCount,total) + " s, " + FractionToPercentage(qCount,total) + " q, " + FractionToPercentage(eCount,total) + " e)");
	}).catch(reason => {
		link.after(" (" + reason + ")");
	});
}

function FractionToPercentage(count, total)
{
	return Math.round((count / total) * 100) + "%";
}