// ==UserScript==
// @name          zabto's Quick Mute
// @namespace     zabto
// @description   Quick mute for wordpress/seattlebubble.
// @include       *seattlebubble*
// @require http://code.jquery.com/jquery-latest.js
// Send beer money to @zabto on venmo if you're so inclined.
//
// @version 0.0.1.20190605194700
// @downloadURL https://update.greasyfork.org/scripts/384560/zabto%27s%20Quick%20Mute.user.js
// @updateURL https://update.greasyfork.org/scripts/384560/zabto%27s%20Quick%20Mute.meta.js
// ==/UserScript==

// true:  remove any replies or mentions of the user.
// false: just blocks posts made by them.
var complete_block = false;

// Add users you want to mute with a trailing comma:
// "username",
var mutterers = 
  [
  	"softwarengineer",
	];

var comments = document.getElementsByClassName("comment-list");
if(comments)
{
  search_comments(comments[0], mutterers);
}


function mute_content(text, muted_users)
{
	for (var i = 0; i < muted_users.length; i++)
  {
    var mute_string = muted_users[i];
    if(complete_block === false)
    {
      // Soften to just user posted content.
			mute_string += " says";
    }
    console.log(mute_string);
    
    if (text.includes(mute_string))
    {
			return true;
    }
  }
  return false;
}

function search_comments(comment_list, muted_user_list)
{
	for (let comment of comment_list.children)
	{
    
    if(mute_content(comment.textContent, muted_user_list))
    {
      comment.textContent = "** Sweet, sweet silence **";
    }
	}
}
