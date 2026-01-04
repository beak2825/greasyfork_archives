// ==UserScript==
// @name          Bugzilla linker
// @description   force offsite linksoffsite links to open in a new window	
// @version     2
// @include		  https://prod2.projecthelp.com/prosjekter/prosjektleder/TimelisterList*
// @include		  https://prod2.projecthelp.com/ansatte/sjef/TimelisterList*
// @require       https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @namespace https://greasyfork.org/users/202002
// @downloadURL https://update.greasyfork.org/scripts/370961/Bugzilla%20linker.user.js
// @updateURL https://update.greasyfork.org/scripts/370961/Bugzilla%20linker.meta.js
// ==/UserScript==   

var bugzillaURL = "http://bugzilla.digpro.se/show_bug.cgi?id=";
var supportURL = "http://bugzilla-support.digpro.se/show_bug.cgi?id=";
var bugRegex = /(bugg?|bz)/i;
var issueRegex = /(ärende|issue)/i;

// Find all sequences of letters and digits in the comment,
// loop through them, and extract information to create links.
function createLinks (comment) {
	var links = [];
	var tokens = comment.match(/[a-zåäö]+|\d+/gi);
	while(tokens.length != 0){
		var token = tokens.shift();
		if (bugRegex.test(token)) {
			pushSubLinks(tokens, links, bugzillaURL, "bz ");
		}else if (issueRegex.test(token)) {
			pushSubLinks(tokens, links, supportURL, "issue ");
		}
	}

	return links;
}

// Whenever a string signifies that the following
// sequences of digits are bugs/issues, loop through
// the following tokens until no more digit sequences
// are found. Create links from all found digits, and
// push to the list of links.
function pushSubLinks(tokens, links, URL, linkString){
	while(tokens.length != 0){
		var token = tokens.shift();
		// Test if the token is a series of digits.
		// If it is not, put the token back and return.
		if (!(/\d+/.test(token))) {
			tokens.unshift(token);
			return;
		};
		var fullURL = URL + token;
		var link = "<a href='" + fullURL + "' target=blank>" + linkString + token + "</a> ";
		links.push(link);
	}
}

// Runs after the document is ready.
// Inserts links to bugzilla in every relevant cell.
$(function() {
	var commentCells = $('.commentCell');
	commentCells.each(function() {
		var comment = $(this).attr('title');
		var links = createLinks(comment);
		// If one or more links were found, bind the original onclick to the original
		// text instead of the whole cell, so the links can be clicked without
		// triggering onclick. Append the links to the cell.
		if (links) {
            $(this).append('<br>');
			for (var i = 0; i < links.length; i++) {
				$(this).append(links[i]);
				$(this).append($('<br>'));
			};

			// Stop the popup from apperaring when clicking one of the links.
			$('a').each(function() {
				$(this).click(function(event) {
					event.stopPropagation();
				});
			});
		};
	});
});
