// ==UserScript==
// @name				Neoboards Pro
// @namespace	 NeoboardsPro2
// @description WIP
// @include		 *://www.neopets.com/neoboards/*
// @include		 *://www.neopets.com/calendar.phtml
// @include      *://www.neopets.com/block.phtml
// @version		 0.4.2
// @grant			 none
// @require		 https://greasyfork.org/scripts/34286-grant-none-shim/code/grant%20none%20shim.js?version=224672
// @require		 https://ajax.googleapis.com/ajax/libs/jquery/2.2.3/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/34369/Neoboards%20Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/34369/Neoboards%20Pro.meta.js
// ==/UserScript==

var version = "0.4.2";

/*var jellyBoardName = 'Jelly World';
var jellyBoardDescription = 'Jelly World? That\'s just a myth. It doesn\'t exist. Off-topic boards are considered spam and WILL be deleted. Stick to the topic, please.';
var jellyBoardImage = 'http://images.neopets.com/neoboards/boardIcons/jelly.png';*/
var jellyBoardName = 'Jell-o World';
var jellyBoardDescription = 'God bless America';
var jellyBoardImage = 'https://i.imgur.com/nTVNEf3.jpg';
var jellyBoardID = 18;
var unorderedBoards = [
	'Site Events',
	'The Official Neopets Team Message Board'
]; // from lowest to highest on listing
var favouriteBoards = []; // favourited boards [[id,name,description,image]]
var blockList = [];

var timeOffset = 0; // time difference between local and nst
var timeOffsetSet = false;
var topicTimes = []; // 'last post' time elements on board listing
var postTimes = []; // post time elements on topics
var postedTimes = []; // board and topic time elements combined
var postedTimestamps = [];

var currentBoard = -1;
var currentTopic = -1;
var topicData = {}; // archive of topics on a specific board {id: [id,"title","author",replies,lastpost,read,lastvisittime,lastvisitreplies,replied]}
var postData = {}; // post data for a specific topic {id: [id,"content","author",timestamp,"avatar","title","accountage","gender","neopet"]}
var tD = {id:0,title:1,author:2,replies:3,lastpost:4,read:5,lastvisittime:6,lastvisitreplies:7,replied:8,board:9};
var pD = {id:0,content:1,author:2,timestamp:3,avatar:4,title:5,accountage:6,gender:7,neopet:8};

var loggedInUsername = "";
var isLastPage = false; // last page flag for topics
var isFirstPage = false;

var debugMode = false;
var debug = {};
debug.log = function(string) {
	if (debugMode === true) {
		console.log(string);
	}
};
debug.alert = function(string) {
	if (debugMode === true) {
		alert(string);
	}
};

$(document).ready(function () {
	//printPostData(159031534);
	//printTopicData(4);
	//debug.log("test debug log");
	//debug.alert("test debug alert");
	debug.log("Document ready");
	//alert("hi");
	addCSS();
	addVersion();
	//getCalendarPage();
	//enableEstimateClock();
	getLoggedInUsername();
	if (GM_getValue("timeOffset")) {
		timeOffset = GM_getValue("timeOffset");
		timeOffsetSet = true;
	} else {
		// get the time offset in the background
		getCalendarPage();
	}
	if (GM_getValue("blockList")) {
		blockList = JSON.parse(GM_getValue("blockList"));
		debug.log("Block list loaded");
	} else {
		// get the block list in the background
		getBlockPage();
	}
	//alert(timeOffset);
	if (window.location.href.includes('/neoboards/index.phtml')) { // board listing
		addJellyWorldBoardListing();
		addBoardFavouriteIcons();
		//GM_setValue('favouriteBoards', JSON.stringify(favouriteBoards));
		loadFavouriteBoards();
		//alert(favouriteBoards);
		showFavouriteBoards();
		updateBoardFavouriteIcons();
	} else if (window.location.href.includes('/neoboards/boardlist.phtml')) { // topic listing
		setBoardID();
		loadTopicData();
		scrapeTopicData();
		hideBlockedTopics();
		addNavigationToTop();
		//enableEstimateClock();
		prepareTimesOnPage();
		updateTimesOnPage();
		setInterval(function(){ updateTimesOnPage(); }, 10000);
	} else if (window.location.href.includes('/neoboards/topic.phtml')) { // posts
		setBoardID();
		setTopicID();
		loadTopicData();
		loadPostData();
		checkIfLastPageTopic();
		checkIfFirstPageTopic();
		scrapeTopicData();
		scrapePostData();
		//addTestData();
		addMissingPosts();
		hideBlockedPosts();
		prepareTimesOnPage();
		updateTimesOnPage();
		setInterval(function(){ updateTimesOnPage(); }, 10000);
		logTopicData(currentBoard,currentTopic);
		logPostData(currentTopic);
	} else if (window.location.href.includes('/calendar.phtml')) { // calendar
		getNeoDateTime($('.content > div[align="center"] > b').first().text());
	} else if (window.location.href.includes('/neoboards/create_topic.phtml?board=')) { // new Jelly World topic
		addJellyWorldNewTopic();
	} else if (window.location.href.includes('/block.phtml')) { // block list
		getBlockList($('form[action*="process_block.phtml"]'));
	}
	debug.log("Complete");
});

function hideBlockedPosts() {
	debug.log("Hiding posts from blocked users..");
	var posts = $('table#boards_table > tbody > tr');
	posts.splice(0,2); // remove header
	posts.splice(posts.length-1,1); // remove footer
	var hasReplied = false;
	for (var i = 0; i < posts.length / 3; i++) {
		var postAuthor = $('td.topicAuthor > a > strong', posts[i*3+0]).text().trim();
		if (blockList.indexOf(postAuthor) >= 0) {
			//debug.alert("Found post by blocked author: " + postAuthor);
			$(posts[i*3+0]).addClass("hiddenPost");
			$(posts[i*3+1]).addClass("hiddenPost");
			$(posts[i*3+2]).addClass("hiddenPost");
			$(posts[i*3+0]).attr("style", "display: none;");
			$(posts[i*3+1]).attr("style", "display: none;");
			$(posts[i*3+2]).attr("style", "display: none;");
		}
	}
	debug.log("Blocked posts hidden");
}
function hideBlockedTopics() {
	debug.log("Hiding topics from blocked users..");
	var topics = $('.content > div[align="center"] > table > tbody > tr');
	topics.splice(0,1);
	topics.splice(topics.length-1,1);
	for (var i = 0; i < topics.length; i++) {
		var topicAuthor = $('td.blistSmall:first-of-type > div > div:last-of-type > a.blistSmall', topics[i]).text().trim();
		//debug.alert(blockList.indexOf(topicAuthor));
		if (blockList.indexOf(topicAuthor) >= 0) {
			//$(topics[i]).html("");
			$(topics[i]).addClass("hiddenTopic");
			$(topics[i]).attr("style", "display: none;");
		}
	}
	debug.log("Blocked topics hidden");
}
function addMissingPosts() {
	debug.log("Adding missing posts..");
	var posts = $('table#boards_table > tbody > tr');
	posts.splice(0,2); // remove header
	posts.splice(posts.length-1,1); // remove footer
	
	var lastID = -1;
	for (var i = 0; i < posts.length / 3; i++) { // - 1 to make sure we don't do anything for the last post
		var deletedPostIDs = [];
		var postID = parseInt($('td.topicPosted > table > tbody > tr > td.topicSmall > a.topicSmall[href*="autoform_abuse"]', posts[i*3+0]).attr("href").split("regarding=")[1].match(/([0-9]+)/g)[0]);
		if (lastID == -1) {
			lastID = postID;
			continue;
		}
		//var nextPostID = parseInt($('td.topicPosted > table > tbody > tr > td.topicSmall > a.topicSmall[href*="autoform_abuse"]', posts[(i+1)*3+0]).attr("href").split("regarding=")[1].match(/([0-9]+)/g)[0]);
		//debug.log("postID: " + postID);
		//debug.log("postID: " + postID + ", lastID: " + lastID);
		//debug.alert("postID: " + postID + ", nextPostID: " + nextPostID);
		
		for (var post in postData) {
			if (postData.hasOwnProperty(post)) {
				//debug.log(postData[post]);
				//debug.log(postData[post][pD.id]);
				//debug.log("post: " + post + ", lastID: " + lastID + ", postID: " + postID);
				if (parseInt(post) > lastID && parseInt(post) < postID) {
					//debug.alert("Post " + post + " detected as deleted");
					deletedPostIDs.push(post);
				}
			}
		}
		
		// adding the posts to the page
		for (var j = 0; j < deletedPostIDs.length; j++) {
			//debug.log("Deleted post: " + deletedPostIDs[j]);
			//$(posts[i*3+0]).before("post goes here");
			//{id:0,content:1,author:2,timestamp:3,avatar:4,title:5,accountage:6,gender:7,neopet:8};
			// author and datetime
			var deletedPostData = postData[deletedPostIDs[j]];
			var genderColour = "black";
			if (deletedPostData[pD.gender] == "Male") {
				genderColour = "blue";
			} else if (deletedPostData[pD.gender] == "Female") {
				genderColour = "pink";
			}
			var postedTime = new Date(deletedPostData[pD.timestamp]);
			var postedHours = postedTime.getHours();
			var postedAMPM = "am";
			if (postedHours == 0) {
				postedHours = 12;
				postedAMPM = "am";
			} else if (postedHours < 12) {
				postedAMPM = "am";
			} else {
				postedHours -= 12;
				postedAMPM = "pm";
			}
			var deletedPost = '<tr class="deletedPost"><td rowspan="2" class="topicAuthor sf" align="center" width="140" valign="top"><a name="' + deletedPostData[pD.id] + '"></a><a href="/userlookup.phtml?user=' + deletedPostData[pD.author] + '"><strong class="medText">' + deletedPostData[pD.author] + '</strong></a><br><br><table width="100%" cellspacing="0" cellpadding="2" border="0"><tbody><tr><td align="center" width="50" valign="top"><a href="/userlookup.phtml?user=' + deletedPostData[pD.author] + '"><img src="http://images.neopets.com/neoboards/avatars/' + deletedPostData[pD.avatar] + '" alt="" width="50" height="50" border="0"></a></td><td class="sf" align="left" valign="top"><i>' + deletedPostData[pD.title] + '</i><br>' + deletedPostData[pD.accountage] + '<br><b style="color: ' + genderColour + ';">' + deletedPostData[pD.gender] + '</b></td></tr><tr><td colspan="2"><hr color="#D1D1D1" size="1" noshade=""></td></tr><tr><td align="center" width="50" valign="top"><a href="/petlookup.phtml?pet=' + deletedPostData[pD.neopet] + '"><img src="http://pets.neopets.com/cpn/' + deletedPostData[pD.neopet] + '/1/1.png" style="border: 1px solid #000000;" width="50" height="50" border="0"></a></td><td class="sf" align="left" valign="top"><br><a href="/petlookup.phtml?pet=' + deletedPostData[pD.neopet] + '"><b>' + deletedPostData[pD.neopet] + '</b></a><br>Active Neopet</td></tr></tbody></table></td><td class="topicPosted" valign="middle" height="20"><table width="100%" height="20" cellspacing="0" cellpadding="0" border="0"><tbody><tr><td class="topicSmall" align="left" width="60%"><strong>Posted:</strong> ' + postedTime.getDate() + ' Oct ' + postedTime.getFullYear() + ' - ' + postedHours + ':' + postedTime.getMinutes() + ' ' + postedAMPM + '</td><td class="topicSmall" align="right" width="40%">[Recovered post]</td></tr></tbody></table></td></tr>';
			// post content
			deletedPost += '<tr class="deletedPost"><td class="topic" valign="top" height="*"><br>' + deletedPostData[pD.content] + '<br></td></tr>';
			// bottom border
			deletedPost += '<tr class="deletedPost"><td colspan="3" style="font-size: 10px; border-bottom: 1px solid #000000; background-color: #B7B7B7;"><img src="http://images.neopets.com/neoboards/spacer.gif" alt="" width="1" height="3" border="0"></td></tr>';
			$(posts[i*3+0]).before(deletedPost);
		}
		
		lastID = postID;
	}
	
	debug.log("Missing posts added");
}

function addTestData() {
	//debug.alert(JSON.stringify(postData));
	postData[2306706800] = [2306706800,"this post was deleted","nobody",1509424620000,"krawk.gif","Dunce","210 Months","Male","rage_v2"];
	//debug.alert(JSON.stringify(postData[2306706800]));
	savePostData();
}

function addCSS() {
	debug.log("Adding CSS..");
	var css = "<style>";
	css += ".postedTime{cursor:help;}a .postedTime{cursor:pointer;}";
	css += ".deletedPost .topicAuthor, .deletedPost .topicPosted, .deletedPost .topic {background-color: #F8DADA}";
	css += "</style>"
	$('body').prepend(css);
	debug.log("CSS added");
}
function addVersion() {
	$('.content').first().append('<a href="https://greasyfork.org/en/scripts/34369-neoboards-pro">Neoboards Pro v' + version + '</a>');
}

function addNavigationToTop() {
	//debug.alert($('.content > div[align="center"]:last-of-type > div[align="right"] > table > tbody > tr > td[align="right"] > a[href*="next="]').length);
	//debug.alert($('.content > div[align="center"]:last-of-type > div[align="right"]')[0].outerHTML);
	if ($('.content > div[align="center"]:last-of-type > div[align="right"] > table > tbody > tr > td[align="right"] > a[href*="next="]').length > 0) {
		$('.content > div[align="center"]:last-of-type').before($('.content > div[align="center"]:last-of-type > div[align="right"]')[0].outerHTML);//$('.content > div[align="center"]:last-of-type > div[align="right"]')
	}
}

function getLoggedInUsername() {
	debug.log("Getting logged in username..");
	if ($('#main > #header > table > tbody > tr > td.user.medText > a[href*="userlookup.phtml"]').length > 0) {
		loggedInUsername = $('#main > #header > table > tbody > tr > td.user.medText > a[href*="userlookup.phtml"]').text().trim();
	}
	//alert(loggedInUsername);
	debug.log("Logged in as " + loggedInUsername);
}
function checkIfLastPageTopic() {
	//alert($('table#boards_table > tbody > tr:first-of-type > td > table > tbody > tr > td > a[href*="&next="]').text());
	/*if ($('table#boards_table > tbody > tr:first-of-type > td > table > tbody > tr > td > a[href*="&next="]').length > 1) {
		$('table#boards_table > tbody > tr:first-of-type > td > table > tbody > tr > td > a[href*="&next="]')
	} else {
		isLastPage = true;
	}*/
	if ($('.topicAuthor.sf').length > 0) { // see if there's at least 1 post on the page
		//alert("There are posts on the page");
		if ($('table#boards_table > tbody > tr:first-of-type > td > table > tbody > tr > td[align="right"] > a').length == 0) { // no other pages listed
			isLastPage = true;
		} else if (!$('table#boards_table > tbody > tr:first-of-type > td > table > tbody > tr > td[align="right"] > a:last-of-type').text().trim().includes("Next") &&
			$('table#boards_table > tbody > tr:first-of-type > td > table > tbody > tr > td:last-of-type > span[style*="font-weight: bold;"]').length > 0) {
			isLastPage = true;
		} else {
			isLastPage = false;
		}
	} else {
		//alert("There are NOT posts on the page");
		isLastPage = false;
	}
	//alert("Last page: " + isLastPage);
	/*if (isLastPage) {
		//alert($('#boards_table > tbody > tr > td.topicPosted').length);
		var baseNumber = 0;
		if (window.location.href.includes("next=")) {
			var urlNumber = window.location.href.split("next=")[1].match(/([0-9]+)/g)[0];
			baseNumber = +urlNumber;
		}
		var totalReplies = baseNumber + $('.topicAuthor.sf').length - 1; //  -1 for the op not being included
		//alert("Replies: " + totalReplies);
		// todo: get current timestamp (rounded to minute)
		// also get last post time
		// {id:0,title:1,author:2,replies:3,lastpost:4,read:5,lastvisittime:6,lastvisitreplies:7,replied:8};
		//alert(topicData[currentTopic]);
		topicData[currentTopic][tD.replies] = totalReplies;
		topicData[currentTopic][tD.lastvisitreplies] = totalReplies;
		//topicData[currentTopic][tD.lastpost] = lastPost;
		//topicData[currentTopic][tD.lastvisittime] = now;
	}*/
}
function checkIfFirstPageTopic() {
	if (!window.location.href.includes('next=')) {
		isFirstPage = true;
	} else {
		var pageNumber = window.location.href.split("next=")[1].match(/([0-9]+)/g)[0];
		if (pageNumber == 1) {
			isFirstPage = true;
		}
	}
	//debug.alert("isFirstPage: " + isFirstPage);
}

function scrapeTopicData() {
	debug.log("Scraping topic data..");
	if (window.location.href.includes('/neoboards/boardlist.phtml')) { // topic listing
		var topics = $('.content > div[align="center"] > table > tbody > tr');
		topics.splice(0,1);
		topics.splice(topics.length-1,1);
		for (var i = 0; i < topics.length; i++) {
			//alert($(topics[i]).text());
			var topicID = parseInt($('td.blistSmall:first-of-type > a.blistTopic', topics[i]).attr("href").split("topic=")[1].match(/([0-9]+)/g)[0]);
			//alert(topicID);
			var topicTitle = $('td.blistSmall:first-of-type > a.blistTopic > span', topics[i]).html().trim();
			//alert(topicName);
			var topicAuthor = $('td.blistSmall:first-of-type > div > div:last-of-type > a.blistSmall', topics[i]).text().trim();
			//alert(topicAuthor);
			var topicReplies = parseInt($('td.blistSmall:nth-of-type(2)', topics[i]).text().trim().split("(")[0]);
			//alert(topicReplies);
			var lastPost = getTopicTimestamp($('td:last-of-type span.blistSmall', topics[i]).text().trim());
			//alert(lastPost);
			//var topicLastVisit = -1;
			//alert(JSON.stringify(topicData));
			//alert(JSON.stringify(topicData[topicID]));
			if (topicData[topicID] === undefined) {
				//alert("ello");
				//topicData[topicID] = "hi";
				topicData[topicID] = [topicID,topicTitle,topicAuthor,topicReplies,lastPost,false,-1,-1,false,currentBoard]; // {id: [id,"title","author",replies,lastpost,read,lastvisittime,lastvisitreplies,replied]}
				//alert("topic " + topicTitle + " added");
			} else {
				topicData[topicID][tD.author] = topicAuthor;
				topicData[topicID][tD.replies] = topicReplies;
				topicData[topicID][tD.lastpost] = lastPost;
				topicData[topicID][tD.board] = currentBoard;
				//alert("topic " + topicName + " updated");
			}
		}
		saveTopicData();
	} else if (window.location.href.includes('/neoboards/topic.phtml')) { // posts
		if (topicData[currentTopic] === undefined) {
			//debug.alert(JSON.stringify(topicData[currentTopic]));
			topicData[currentTopic] = []; // {id: [id,"title","author",replies,lastpost,read,lastvisittime,lastvisitreplies,replied]}
			topicData[currentTopic][tD.id] = currentTopic;
			//debug.alert(JSON.stringify(topicData[currentTopic]));
			debug.log("Created new topic data entry");
		}
		//debug.alert("hi");
		//var topicID = window.location.href.split("topic=")[1].match(/([0-9]+)/g)[0];
		//var topicID = currentTopic;
		//debug.alert(currentTopic);
		//var topicTitle = $('#content > table > tbody > tr > td.content').html().split("<strong>Current Topic:</strong>")[1].split("<br>")[0].trim();
		if (topicData[currentTopic][tD.title] === undefined || topicData[currentTopic][tD.title] == "") {
			topicData[currentTopic][tD.title] = $('#content > table > tbody > tr > td.content').html().split("<strong>Current Topic:</strong>")[1].split("<br>")[0].trim();
			debug.log("Added topic title data");
		}
		//debug.alert(topicTitle);
		if (topicData[currentTopic][tD.author] === undefined || topicData[currentTopic][tD.author] == "") {
			//var topicAuthor = "";
			if (isFirstPage) {
				//topicAuthor = $('.topicAuthor > a[href*="userlookup.phtml"] > strong').first().text().trim();
				topicData[currentTopic][tD.author] = $('.topicAuthor > a[href*="userlookup.phtml"] > strong').first().text().trim();
				debug.log("Added topic author data");
			}
		}
		/*if (topicAuthor != "") {
			topicData[currentTopic][tD.author] = topicAuthor;
		}*/
		//debug.alert(topicAuthor);
		//var topicReplies = $('td.blistSmall:nth-of-type(2)', topics[i]).text().trim().split("(")[0];
		//debug.alert(topicReplies);
		//var lastPost = getTopicTimestamp($('td:last-of-type span.blistSmall', topics[i]).text().trim());
		//debug.alert(lastPost);
		if (isLastPage) {
			//alert($('#boards_table > tbody > tr > td.topicPosted').length);
			var baseNumber = 0;
			if (window.location.href.includes("next=")) {
				var urlNumber = window.location.href.split("next=")[1].match(/([0-9]+)/g)[0];
				baseNumber = +urlNumber;
			}
			var totalReplies = baseNumber + $('.topicAuthor.sf').length - 1; //  -1 for the op not being included
			//debug.alert("Replies: " + totalReplies);
			// todo: get current timestamp (rounded to minute)
			// also get last post time
			// {id:0,title:1,author:2,replies:3,lastpost:4,read:5,lastvisittime:6,lastvisitreplies:7,replied:8};
			//alert(topicData[currentTopic]);
			topicData[currentTopic][tD.replies] = totalReplies;
			topicData[currentTopic][tD.lastvisitreplies] = totalReplies;
			//topicData[currentTopic][tD.lastpost] = lastPost;
			//topicData[currentTopic][tD.lastvisittime] = now;
		}
		//debug.alert(JSON.stringify(topicData[currentTopic]));
		topicData[currentTopic][tD.board] = currentBoard;
		saveTopicData();
	}
	debug.log("Scraped topic data");
}
function scrapePostData() {
	debug.log("Scraping post data..");
	var posts = $('table#boards_table > tbody > tr');
	posts.splice(0,2); // remove header
	posts.splice(posts.length-1,1); // remove footer
	var hasReplied = false;
	for (var i = 0; i < posts.length / 3; i++) {
		var postID = parseInt($('td.topicPosted > table > tbody > tr > td.topicSmall > a.topicSmall[href*="autoform_abuse"]', posts[i*3+0]).attr("href").split("regarding=")[1].match(/([0-9]+)/g)[0]);
		//alert(postID);
		var postContent = $('td.topic', posts[i*3+1]).html().trim().substring(4).slice(0,-4).trim();
		//alert(postContent);
		var postAuthor = $('td.topicAuthor > a > strong', posts[i*3+0]).text().trim();
		//alert(postAuthor);
		var userAvatar = $('td.topicAuthor > table a[href*="userlookup"] > img', posts[i*3+0]).attr("src").trim().split("/avatars/")[1];
		//alert(userAvatar);
		var userTitle = $('td.topicAuthor > table > tbody > tr > td.sf > i', posts[i*3+0]).text().trim();
		//alert(userTitle);
		var userAccountAge = $('td.topicAuthor > table > tbody > tr > td.sf', posts[i*3+0]).contents().filter(function(){return this.nodeType == 3;})[0].nodeValue.trim();
		//alert(userAccountAge);
		var userGender = $('td.topicAuthor > table > tbody > tr > td.sf > b', posts[i*3+0]).text().trim();
		//alert(userGender);
		var userNeopet = $('td.topicAuthor > table > tbody > tr > td.sf > a[href*="/petlookup"] > b', posts[i*3+0]).text().trim();
		//alert(userNeopet);
		var postTimestamp = getPostTimestamp($('td.topicPosted > table > tbody > tr > td.topicSmall[align="left"]', posts[i*3+0]).text().replace("Posted:","").trim());
		//alert(postTimestamp);
		if (postData[postID] === undefined) {
			postData[postID] = [postID,postContent,postAuthor,postTimestamp,userAvatar,userTitle,userAccountAge,userGender,userNeopet]; // {id: [id,"content","author",timestamp,"avatar","title","accountage","gender","neopet"]}
			//alert("post " + postID + " added");
		}
		if (postAuthor == loggedInUsername) {
			hasReplied = true;
		}
	}
	savePostData();
	if (hasReplied) {
		topicData[currentTopic][tD.replied] = true;
		//alert(JSON.stringify(topicData));
		saveTopicData();
	}
	debug.log("Scraped post data");
}

function alertPostData(topicID) {
	if (GM_getValue("postData_" + topicID)) {
		debug.alert("Post data: " + GM_getValue("postData_" + topicID));
	}
}
function alertTopicData(boardID,topicID) {
	if (GM_getValue("topicData_" + boardID)) {
		debug.alert("Topic data: " + JSON.stringify(JSON.parse(GM_getValue("topicData_" + boardID))[topicID]));
	}
}
function logPostData(topicID) {
	if (GM_getValue("postData_" + topicID)) {
		debug.log("Post data: " + GM_getValue("postData_" + topicID));
	}
}
function logTopicData(boardID,topicID) {
	if (GM_getValue("topicData_" + boardID)) {
		debug.log(JSON.stringify("Topic data: " + JSON.parse(GM_getValue("topicData_" + boardID))[topicID]));
	}
}
function loadTopicData() {
	debug.log("Loading topic data..");
	if (GM_getValue("topicData_" + currentBoard)) {
		topicData = JSON.parse(GM_getValue("topicData_" + currentBoard));
	}
	//alert(JSON.stringify(topicData));
	debug.log("Topic data loaded");
}
function saveTopicData() {
	debug.log("Saving topic data..");
	//alert(JSON.stringify(topicData));
	GM_setValue("topicData_" + currentBoard, JSON.stringify(topicData));
	debug.log("Topic data saved");
}
function loadPostData() {
	debug.log("Loading post data..");
	if (GM_getValue("postData_" + currentTopic)) {
		postData = JSON.parse(GM_getValue("postData_" + currentTopic));
	}
	debug.log("Post data loaded");
}
function savePostData() {
	debug.log("Saving post data..");
	GM_setValue("postData_" + currentTopic, JSON.stringify(postData));
	debug.log("Post data loaded");
}

function setBoardID() {
	debug.log("Setting Board ID..");
	if (window.location.href.includes('/neoboards/boardlist.phtml')) {
		currentBoard = parseInt(window.location.href.split("board=")[1].match(/([0-9]+)/g)[0]);
	} else {
		currentBoard = parseInt($('.content > b > a[href*="boardlist"]').attr("href").split("board=")[1].match(/([0-9]+)/g)[0]);
	}
	//alert(currentBoard);
	debug.log("Board ID set to " + currentBoard);
}
function setTopicID() {
	debug.log("Setting Topic ID..");
	currentTopic = parseInt(window.location.href.split("topic=")[1].match(/([0-9]+)/g)[0]);
	//alert(currentTopic);
	debug.log("Topic ID set to " + currentTopic);
}

function getTopicTimestamp(postedText) {
	//var postedText = $(topicTimes[i]).text().trim();
	var postedMinute = postedText.split(":")[1].substr(0,2);
	//alert(postedMinute);
	var postedHour = postedText.split(" ")[1].split(":")[0];
	//alert(postedHour);
	var postedDay = postedText.split(".")[0];
	//alert(postedDay);
	var postedMonth = postedText.split(".")[1].split(" ")[0] - 1;
	//alert(postedMonth);
	var postedAMPM = postedText.substr(postedText.length - 2, 2);
	//alert(postedAMPM);
	var postedYear = assumeYear(postedMonth,postedDay);
	//alert(postedYear);
	if (postedAMPM == "pm" && +postedHour < 12) {
		postedHour = +postedHour + 12;
	} else if (postedAMPM == "am" && +postedHour == 12) {
		postedHour = +postedHour - 12;
	}
	//alert(new Date(postedYear, postedMonth, postedDay, postedHour, postedMinute));
	return new Date(postedYear, postedMonth, postedDay, postedHour, postedMinute).getTime();
}
function getPostTimestamp(postedText) {
	// post format, eg. "25 Oct 2017 - 1:19 pm"
	var months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
	//var postedText = $(postTimes[i]).text().replace("Posted:","").trim();
	//alert(postedText);
	var postedMinute = postedText.split(" - ")[1].split(":")[1].split(" ")[0];
	//alert(postedMinute);
	var postedHour = postedText.split(" - ")[1].split(":")[0];
	//alert(postedHour);
	var postedDay = postedText.split(" ")[0];
	//alert(postedDay);
	var postedMonth = months.indexOf(postedText.split(" ")[1]);
	//alert(postedMonth);
	var postedAMPM = postedText.substr(postedText.length - 2, 2);
	//alert(postedAMPM);
	var postedYear = postedText.split(" ")[2];
	//alert(postedYear);
	if (postedAMPM == "pm" && +postedHour < 12) {
		postedHour = +postedHour + 12;
	} else if (postedAMPM == "am" && +postedHour == 12) {
		postedHour = +postedHour - 12;
	}
	//alert(new Date(postedYear, postedMonth, postedDay, postedHour, postedMinute));
	return new Date(postedYear, postedMonth, postedDay, postedHour, postedMinute).getTime();
}
function prepareTimesOnPage() {
	if (timeOffsetSet == false) {
		return;
	}
	topicTimes = $('.content > div[align="center"] > table > tbody > tr > td:last-of-type span.blistSmall');
	postTimes = $('#boards_table tr td.topicPosted > table > tbody > tr > td.topicSmall[align="left"]');
	for (var i = 0; i < topicTimes.length; i++) {
		postedTimestamps.push(getTopicTimestamp($(topicTimes[i]).text().trim()));
		$(topicTimes[i]).html('<span class="postedTime"></span>');
	}
	for (var i = 0; i < postTimes.length; i++) {
		postedTimestamps.push(getPostTimestamp($(postTimes[i]).text().replace("Posted:","").trim()));
		$(postTimes[i]).html('<span class="postedTime" title=""></span>');
	}
	postedTimes = $('.postedTime');
	// add space before pointers
	topicTimes = $('.content > div[align="center"] > table > tbody > tr > td:last-of-type span.pointer').prepend(" ");
}
function updateTimesOnPage() {
	if (timeOffsetSet == false) {
		return;
	}
	//alert(topicTimestamps);
	//alert(timeOffset);
	for (var i = 0; i < postedTimes.length; i++) {
		var timeDiff = Math.round(($.now() + +timeOffset - postedTimestamps[i]) / 1000);
		var timeString = "";
		if (timeDiff < 60) {
			timeString = "Just now";
		} else {
			if (timeDiff < 60*60) {
				var minutes = Math.floor(timeDiff/60);
				timeString += minutes;
				timeString += " min";
				if (minutes > 1) {
					timeString += "s";
				}
				timeString += " ago";
			} else if (timeDiff < 60*60*24) {
				var hours = Math.floor(timeDiff/60/60);
				timeString += hours;
				timeString += " hour";
				if (hours > 1) {
					timeString += "s";
				}
				timeString += " ago";
			} else {
				var days = Math.floor(timeDiff/60/60/24);
				timeString += days;
				timeString += " day";
				if (days > 1) {
					timeString += "s";
				}
				timeString += " ago";
			}
		}
		var months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
		var datetime = new Date(postedTimestamps[i]);
		//$(postedTimes[i]).text(new Date(postedTimestamps[i]));
		//$(postedTimes[i]).text(postedTimestamps[i]);
		//$(postedTimes[i]).text(timeDiff);
		$(postedTimes[i]).attr("title", datetime.getDate() + " " + months[datetime.getMonth()] + " " + datetime.getFullYear() + " - " + formatAMPM(datetime));
		//$(postedTimes[i]).attr("title", datetime);
		$(postedTimes[i]).text(timeString);
	}
}
function assumeYear(month,day) {
	var thisYear = new Date($.now()).getFullYear();
	var possibleYears = [thisYear - 1, thisYear, +thisYear + 1];
	//alert(possibleYears);
	var differences = [0,0,0];
	var smallestDifference = -1;
	for (var i = 1; i < possibleYears.length; i++) {
		var difference = Math.abs($.now() - new Date(possibleYears[i],month,day).getTime());
		//alert(difference);
		differences[i] = difference;
		if (smallestDifference == -1 || difference < smallestDifference) {
			smallestDifference = difference;
		}
	}
	//alert(differences);
	//alert(smallestDifference);
	return possibleYears[differences.indexOf(smallestDifference)];
}
function formatAMPM(date) {
	var hours = date.getHours();
	var minutes = date.getMinutes();
	var ampm = hours >= 12 ? 'pm' : 'am';
	hours = hours % 12;
	hours = hours ? hours : 12; // the hour '0' should be '12'
	minutes = minutes < 10 ? '0'+minutes : minutes;
	var strTime = hours + ':' + minutes + ' ' + ampm;
	return strTime;
}

function enableEstimateClock() {
	setEstimateClock();
	updateEstimateClock();
	setInterval(function(){ updateEstimateClock(); }, 1000);
}
function setEstimateClock() {
	$('#nst').after('<td id="nst2">hello</td>');
	//alert(timeOffset);
	//alert($.now());
}
function updateEstimateClock() {
	var estimatedTime = new Date($.now() + +timeOffset);
	//var estimatedTime = new Date($.now());
	//$('#nst2').text(estimatedTime.getHours() + ":" + estimatedTime.getMinutes() + ":" + estimatedTime.getSeconds());
	$('#nst2').text(estimatedTime.getHours() + ":" + estimatedTime.getMinutes() + ":" + estimatedTime.getSeconds() + " " + estimatedTime.getDate() + "-" + (+estimatedTime.getMonth() + 1) + "-" + estimatedTime.getFullYear());
}

function addBoardFavouriteIcons() {
	$('body').prepend("<style>.boardfavouriteicon{cursor:pointer;background-position:center center;background-repeat:no-repeat;background-image:url('https://i.imgur.com/QTPmYAl.png');width:50px;}.boardfavouriteicon-favourited{background-image:url('https://i.imgur.com/0fPnwse.png');}</style>");
	var allBoards = $('.content > div[align="center"] > table > tbody > tr');
	$('td.contentModuleHeaderAlt', allBoards[0]).attr("colspan",3);
	allBoards.splice(0, 1); // remove header
	for (var i = 0; i < allBoards.length; i++) {
		$(allBoards[i]).append('<td style="border-top: 1px solid black;" align="center" class="boardfavouriteicon"></td>');
	}
	updateBoardFavouriteIcons();
	bindFavouriteButtons();
}
function updateBoardFavouriteIcons() {
	var allBoards = $('.content > div[align="center"] > table > tbody > tr');
	allBoards.splice(0, 1); // remove header
	for (var i = 0; i < allBoards.length; i++) {
		var boardFavourited = false;
		for (var j = 0; j < favouriteBoards.length; j++) {
			var boardID = $('td:first-of-type a', allBoards[i]).attr("href").split("board=")[1].trim();
			if (favouriteBoards[j][0] == boardID) {
				boardFavourited = true;
			}
		} // fix all this
		if (boardFavourited == true) {
			$('.boardfavouriteicon', allBoards[i]).addClass("boardfavouriteicon-favourited");
		} else {
			$('.boardfavouriteicon', allBoards[i]).removeClass("boardfavouriteicon-favourited");
		}
	}
}
function bindFavouriteButtons() {
	$('.boardfavouriteicon').unbind('click');
	$('.boardfavouriteicon').click(function(){toggleBoardFavourite(this)});
}
function toggleBoardFavourite(button) {
	var buttonParent = $(button).parent();
	//alert($(button).parent().text());
	//alert($('td:first-of-type a', buttonParent).attr("href").split("board=")[1].trim());
	var boardID = $('td:first-of-type a', buttonParent).attr("href").split("board=")[1].trim();
	var boardRemoved = false;
	for (var i = favouriteBoards.length - 1; i >= 0; i--) {
		if (favouriteBoards[i][0] == boardID) {
			favouriteBoards.splice(i,1);
			boardRemoved = true;
		}
	}
	if (boardRemoved == false) {
		var boardName = $('td.medText > a.indexTitle > strong', buttonParent).text().replace('»', '').trim();
		var boardDescription = $('td.medText', buttonParent).contents().filter(function(){ 
														 return this.nodeType == 3; 
													 })[0].nodeValue;
		var boardImage = $('td:first-of-type > a > img', buttonParent).attr("src");
		favouriteBoards.push([boardID,boardName,boardDescription,boardImage]);
	}
	showFavouriteBoards();
	updateBoardFavouriteIcons();
	//alert(favouriteBoards);
	saveFavouriteBoards();
}
function loadFavouriteBoards() {
	if (GM_getValue('favouriteBoards')) {
		favouriteBoards = JSON.parse(GM_getValue('favouriteBoards'));
	}
}
function saveFavouriteBoards() {
	GM_setValue('favouriteBoards', JSON.stringify(favouriteBoards));
}
function showFavouriteBoards() {
	//alert("ok");
	$('.favouriteboards').remove();
	if (favouriteBoards.length > 0) {
		var favouriteBoardsHtml = '<br class="favouriteboards" /><table style="border: 1px solid #000000;" width="100%" cellspacing="0" cellpadding="2" border="0" class="favouriteboards"><tbody><tr><td colspan="3" class="contentModuleHeaderAlt" align="center"><div align="center">Favourite Boards</div></td></tr>';
		for (var i = 0; i < favouriteBoards.length; i++) {
			favouriteBoardsHtml += '<tr><td style="border-top: 1px solid black;" width="60" align="left"><a href="boardlist.phtml?board=' + favouriteBoards[i][0] + '"><img src="' + favouriteBoards[i][3] + '" alt="" width="50" border="0" height="50"></a></td><td class="medText" style="border-top: 1px solid black;" align="left"><a href="boardlist.phtml?board=' + favouriteBoards[i][0] + '" class="indexTitle"><strong><span class="pointer">»</span> ' + favouriteBoards[i][1] + '</strong></a><br>' + favouriteBoards[i][2] + '</td><td style="border-top: 1px solid black;" align="center" class="boardfavouriteicon boardfavouriteicon-favourited"></td></tr>';
		}
		favouriteBoardsHtml += '</tbody></table>';
		$('.content > div[align="center"]:last-of-type').before(favouriteBoardsHtml);
	}
	bindFavouriteButtons();
}

function addJellyWorldNewTopic() {
	var boardOptions = $('select[name="board_id"] > option');
	//alert(boardOptions.length);
	var boardNames = [
	];
	for (var i = 0; i < boardOptions.length; i++) {
		boardNames.push($(boardOptions[i]).text().trim());
	} /*for (var i = 0; i < boardOptions.length; i++) {
		alert(boardNames[i]);
	}*/

	boardNames.push(jellyBoardName);
	boardNames.sort();
	//alert(boardNames.length);
	for (var i = 0; i < unorderedBoards.length; i++) {
		if (boardNames.indexOf(unorderedBoards[i]) >= 0) {
			boardNames.move(boardNames.indexOf(unorderedBoards[i]), 0);
		}
	}
	if (window.location.href.endsWith('?board=18')) { // new Jelly World topic
		$(boardOptions[boardNames.indexOf(jellyBoardName) - 1]).after('<option value="' + jellyBoardID + '" selected="selected">' + jellyBoardName + '</option>');
	} else {
		$(boardOptions[boardNames.indexOf(jellyBoardName) - 1]).after('<option value="' + jellyBoardID + '">' + jellyBoardName + '</option>');
	}
}
function addJellyWorldBoardListing() {
	var allBoards = $('.content > div[align="center"] > table > tbody > tr');
	allBoards.splice(0, 1); // remove header
	//alert(allBoards.length);
	var boardNames = [
	];
	for (var i = 0; i < allBoards.length; i++) {
		//alert($(allBoards[i]).text());
		//alert($('td.medText > a.indexTitle > strong', allBoards[i]).text().replace('»','').trim());
		boardNames.push($('td.medText > a.indexTitle > strong', allBoards[i]).text().replace('»', '').trim());
	} //alert(boardNames.length);

	boardNames.push(jellyBoardName);
	boardNames.sort();
	/*for (var i = 0; i < boardNames.length; i++) {
		alert(boardNames[i]);
	}*/
	//alert(boardNames.indexOf("Jelly World"));
	//alert($(allBoards[boardNames.indexOf(jellyBoardName)]).text());
	for (var i = 0; i < unorderedBoards.length; i++) {
		if (boardNames.indexOf(unorderedBoards[i]) >= 0) {
			boardNames.move(boardNames.indexOf(unorderedBoards[i]), 0);
		}
	}
	$(allBoards[boardNames.indexOf(jellyBoardName) - 1]).after('<tr><td style="border-top: 1px solid black;" width="60" align="left"><a href="boardlist.phtml?board=' + jellyBoardID + '"><img src="' + jellyBoardImage + '" alt="" height="50" width="50" border="0"></a></td><td class="medText" style="border-top: 1px solid black;" align="left"><a href="boardlist.phtml?board=' + jellyBoardID + '" class="indexTitle"><strong><span class="pointer">»</span> ' + jellyBoardName + '</strong></a><br>' + jellyBoardDescription + '</td></tr>');
}

function getCalendarPage() {
	//alert("Getting calendar page");
	$.ajax({
		url: "http://www.neopets.com/calendar.phtml"
	}).error(function(){
		alert("An error occurred while synchronising to NST, please reload the page");
		return;
	}).success(function(data){
		getNeoDateTime($('.content > div[align="center"] > b', data).first().text());
		//alert(fullDateTime);
	});
}
function getNeoDateTime(data) {
	var allMonths = [
		'Sleeping',
		'Awakening',
		'Running',
		'Eating',
		'Hunting',
		'Relaxing',
		'Swimming',
		'Hiding',
		'Gathering',
		'Collecting',
		'Storing',
		'Celebrating'
	];
	//alert("hi");
	//var nstMonth = $('.month').text().replaceWith('-', '').trim();
	//alert(nstMonth);
	var fullDateTime = data;
	//alert(fullDateTime);
	var monthName = fullDateTime.split('of ') [1].split(',') [0];
	//alert(monthName);
	var monthNumber = allMonths.indexOf(monthName);
	//alert(monthNumber);
	var dayNumber = fullDateTime.match(/^(\d{1,2})/g) [0];
	//alert(dayNumber);
	var yearNumber = + fullDateTime.split(', Y') [1].split(' - ') [0] + + 1998;
	//alert(yearNumber);
	//alert(dayNumber + "/" + monthNumber + "/" + yearNumber);
	var nstTime = fullDateTime.split(' - ') [1];
	//alert(nstTime);
	var nstHour = nstTime.split(':') [0].trim();
	//alert(nstHour);
	var nstMinute = nstTime.split(':') [1].trim();
	//alert(nstMinute);
	var nstSecond = nstTime.split(':') [2].split(' ') [0].trim();
	//alert(nstSecond);
	var nstAMPM = nstTime.split(':') [2].split(' ') [1].trim();
	//alert(nstAMPM);
	/*if (nstAMPM == 'pm') {
		nstHour = +nstHour + 12;
	}*/
	if (nstAMPM == "pm" && +nstHour < 12) {
		nstHour = +nstHour + 12;
	} else if (nstAMPM == "am" && +nstHour == 12) {
		nstHour = +nstHour - 12;
	}
	//var neoDateTime = new Date(yearNumber, monthNumber, dayNumber, 11);
	var neoDateTime = new Date(yearNumber, monthNumber, dayNumber, nstHour, nstMinute, nstSecond);
	//alert(neoDateTime);
	//alert(new Date($.now()));
	//alert(neoDateTime.getTime());
	//alert($.now());
	var newTimeOffset = neoDateTime.getTime() - $.now();
	//alert(newTimeOffset);
	GM_setValue("timeOffset", newTimeOffset);
}

function getBlockPage() {
	debug.log("Fetching block list page..");
	$.ajax({
		url: "http://www.neopets.com/block.phtml"
	}).error(function(){
		alert("An error occurred while fetching block list, please reload the page");
		return;
	}).success(function(data){
		debug.log("Fetched block list page");
		getBlockList($('form[action*="process_block.phtml"]', data));
	});
}
function getBlockList(data) {
	debug.log("Getting block list from data");
	//debug.alert("getBlockList()");
	//debug.alert($('table', data).html());
	var blockedNames = $('table > tbody > tr', data);
	//debug.alert(blockedNames.length);
	if (blockedNames.length <= 2) {
		return;
	}
	blockList = [];
	blockedNames.splice(0,1); // remove header
	blockedNames.splice(blockedNames.length-1,1); // remove 'unblock' button
	//debug.alert(blockedNames.length);
	for (var i = 0; i < blockedNames.length; i++) {
		//debug.alert(i);
		//debug.alert($(blockedNames[i]).text().trim());
		blockList.push($(blockedNames[i]).text().trim());
	}
	GM_setValue("blockList", JSON.stringify(blockList));
	debug.log("Block list updated & saved");
}

Array.prototype.move = function (from, to) {
	this.splice(to, 0, this.splice(from, 1) [0]);
};
