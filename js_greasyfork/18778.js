// ==UserScript==
// @name        Who Downvoted Me!?
// @namespace   geneticcoder.com
// @description Find out who downvoted your StackOverflow answer.
// @include     http://stackoverflow.com/questions/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/18778/Who%20Downvoted%20Me%21.user.js
// @updateURL https://update.greasyfork.org/scripts/18778/Who%20Downvoted%20Me%21.meta.js
// ==/UserScript==

/**
 * This script will check if you have an answer on the current page, if so,
 * it will check the reputation of every other user who posted an answer or
 * comment on the page every n seconds and if your vote has gone down it will
 * tell you the name of any users who's reputation has gone down since the vote.
 * 
 * This works because it costs 1 reputation to downvote on S.O.
 * 
 * The only ocnfigurable parameter is the "runInterval" variable directly below.
 */

// How ofter should the script check for changes (seconds).
var runInterval = 10;

(function () {

	// Hold info abuot other users on the page
	var users = {};
	// My username
	var username = "";
	// My current score
	var myscore = 0;

	function main() {
		// What's my username
		getMyUsername(function (un) {
			username = un;
			// Get my question score
			myscore = getAnswerScore();
			if(myscore === false) 
				return console.log("You have no answers on this page. Killing WhoDownvotedMe.js.");
			// Get all users on the page's rep
			checkUsers(function(scores){ users = scores; });
			// Compare and check every n seconds
			setInterval(compareScores, (runInterval*1000));
		});
		
		return "Running WhoDownvotedMe.js.";
	}
	
	function compareScores(){
		var me = getAnswerScore();
		// My score is the same, just update stuff
		if(me >= myscore){
			myscore = me;
			checkUsers(function(scores){ users = scores; });
		}
		// If my votes have dropped, check to see if anyone else's have as well
		else{
			var possibles = [];
			checkUsers(function(scores){ 
				for(var u in scores){
					if(!scores.hasOwnProperty(u)) continue;
					if(undefined === users[u]) users[u] = scores[u];
					if(scores[u] < users[u]) possibles.push({
						user: u,
						lost: (users[u] - scores[u])
					});
				}
				users = scores;
				var message = "Your answer has been downvoted.\n\n";
				if(!possibles.length) message += "It is unclear who voted.";
				else{
					message += "Possible downvoters are: \n";
					for(var i=0; i<possibles.length; i++)
						message += 
							possibles[i].user + " (-"+possibles[i].lost+" points)\n";
				}
				alert(message);
			});
		}
	}
	
	function getMyUsername(cb) {
		var url = "http://stackoverflow.com" + $(".profile-me").attr("href");
		$.ajax({
			url: url
		}).done(function (r) {
			var un = $(r).find(".name").text().trim();
			cb(un);
		});
	}

	function getAnswerScore() {
		var rep = false;
		$(".answer").find(".user-details a").each(function () {
			var un = $(this).text().trim();
			if (un === username) {
				var score = $(this).parent().parent().
					parent().parent().parent().
					parent().parent().parent().
					find(".vote-count-post").text().trim();
				rep = parseInt(score);
			}
		});
		return rep;
	}

	function checkUsers(cb) {
		var unique = [];
		var scores = {};
		var active_requests = 0;
		// Gather info about other users on the page
		$(".user-details").find("a").add(".comment-user").each(function () {
			var href = $(this).attr("href");
			var url = "http://stackoverflow.com" + href;
			var un = $(this).text();
			if(un === username || unique.indexOf(un) > -1) return;
			else unique.push(un);
			active_requests++;
			(function (un) {
				$.ajax({
					url: url
				}).done(function (r) {
					active_requests--;
					var un_span = $(r).find(".avatar-card").find(".reputation").eq(0);
					un_span.find("span").remove();
					var rep = un_span.text().trim();
					scores[un] = parseInt(rep.replace(/\D/g,''));
					if(active_requests === 0) cb(scores);
				});
			})(un);
		});
	}

	return main();

})();