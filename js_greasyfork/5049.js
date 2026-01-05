// ==UserScript==
// @name           Hide Toronto Mike Users
// @namespace      torontomike
// @include        http://www.torontomike.com/
// @include        http://*.torontomike.com/
// @include        http://www.torontomike.com/*
// @include        http://*.torontomike.com/*
// @grant           metadata
// @version        1.3
// @description Hide annoying users on Toronto Mike blog.  Fucking trolls.
// @downloadURL https://update.greasyfork.org/scripts/5049/Hide%20Toronto%20Mike%20Users.user.js
// @updateURL https://update.greasyfork.org/scripts/5049/Hide%20Toronto%20Mike%20Users.meta.js
// ==/UserScript==

// Dec 5, 2014 - for redesign

var blacklist = ["cheryl", "argie", "irvine"]; // ["cheryl", "any other name", "seperated by comma"] not case sensitive
var comments = document.getElementsByClassName("comment"); // Get all comments
var i;
var comment; 
var user;

/*
// Old style for backward compat
for(i = 0; i < comments.length; i++)
{
	var hide = false;
	comment = comments[i];
	user = comment.getElementsByTagName("p")[0].getElementsByClassName("bigger")[0].textContent;


	for (blacklist_count = 0; blacklist_count < blacklist.length; blacklist_count++)
	{
		if (user.toUpperCase().trim() == blacklist[blacklist_count].toUpperCase().trim())
		{

			comment.style.display = "none";
			break;
		}
	}

} // End comment loop
*/
comments = document.getElementsByClassName("comment-block");

var hrs;

// New style
for(i = 0; i < comments.length; i++)
{
	var hide = false;
	comment = comments[i];
	user = comment.getElementsByClassName("comment-by")[0].getElementsByTagName("strong")[0].textContent;
    
    if (i == 0)
    {

        hrs = comment.parentNode.getElementsByTagName("hr");

    }

	for (blacklist_count = 0; blacklist_count < blacklist.length; blacklist_count++)
	{
		if (user.toUpperCase().trim() == blacklist[blacklist_count].toUpperCase().trim())
		{
 
            hrs[i].style.display = "none";
            if(i > 0)
            {
                hrs[i-1].style.display = "none";
            }
			comment.style.display = "none";
			break;
		}
	}

} // End comment loop


