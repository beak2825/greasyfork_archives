// ==UserScript==
// @name        QOL on the Mobile Web
// @namespace   Pogmog
// @description Just some general quality of (my) life changes. Reddit: Hide auto-mod comments. YouTube: disable end cards.
// @version     2.0.2
// @include     https://old.reddit.com/*
// @include     https://www.reddit.com/*
// @include     https://www.youtube.com/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/406679/QOL%20on%20the%20Mobile%20Web.user.js
// @updateURL https://update.greasyfork.org/scripts/406679/QOL%20on%20the%20Mobile%20Web.meta.js
// ==/UserScript==

// Options
var reddit_hide_automod_post = true;
var reddit_fit_image = true;
var reddit_remove_updatesbox = true;
var reddit_pad_bottom = true;
var youtube_disable_endcards = true;
var reddit_subPost_blocker = ["Genshin_Impact"];

var urlCheck = document.URL;
/*
	If a tweak needs to use the scroll or onLoad events, call them with the following:
		setup_onLoad()
		setup_onScroll()
	...rather than have everything fire the onScroll event, etc.
*/
if (urlCheck.includes("reddit.com/") && reddit_hide_automod_post)
{
	setup_onLoad();
}

function afterLoad()
{
    console.log("US: after load");
	// If anything needs to happen after page load (did for Reddit stuff before I found a better way).
	if (urlCheck.includes("reddit.com/"))
	{
        if (urlCheck.includes("reddit.com/r/all/")) {
			var ticker = 0;
            while (true) {
                var main_content_elm = document.getElementsByClassName("PostsFromSubredditPage");
                if (main_content_elm.length > 0 || ticker > 3000) {
                    console.log("should be load");
                    break;
                }
				else {
					console.log("waiting for load");
				}
				ticker += 1;
            }
            if (reddit_subPost_blocker.length > 0) {
                var all_posts = document.getElementsByClassName("PostHeader__subreddit-link");
                //var kill_list = [];
                for (var i=0;i<all_posts.length;i++) {
                    for (var j=0;j<all_posts.length;j++) {
                        if(all_posts[i].href == "/r/" + reddit_subPost_blocker[j]) {
                            //kill_list.push(all_posts[i]);
                            var kill_node = all_posts[i].parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
                            kill_node.parentNode.removeChild(kill_node);
                        }
                    }
                }
            }
            if (reddit_pad_bottom) {
                var sheet = document.createElement('style')
                sheet.innerHTML = ".PaginationButtons {margin-bottom: 400px;}";
                document.body.appendChild(sheet);
            }
        }
        else if (urlCheck.includes("reddit.com/r/")) {
			if (reddit_hide_automod_post)
			{
				var first_comment = document.getElementsByClassName("comment")[0];
				var element_to_use = first_comment.getElementsByClassName("tagline")[0];
				var author = element_to_use.getElementsByClassName("author")[0];
				if (author.innerHTML == "AutoModerator")
				{
					console.log("First comment is Automod.");
					element_to_use.getElementsByClassName("expand")[0].onclick();
				}
			}
		}
	}
}
function onPageScroll()
{
	// If anything needs to happen on page scroll (did for Reddit stuff before I found a better way).
}

if (urlCheck.includes("reddit.com/"))
{
	var addition_sheet = document.createElement('style');
	addition_sheet.innerHTML = ".TopNav__promoButton{display: none !important;}";
	if (reddit_fit_image)
	{
		addition_sheet.innerHTML = addition_sheet.innerHTML + ".Post.size-compact.m-redesign div:nth-of-type(3) img {object-fit: contain !important;}";
	}
	if (reddit_remove_updatesbox)
	{
		addition_sheet.innerHTML = addition_sheet.innerHTML + "._3VqiDbufgl9_EiV_tk9L6u {display: none !important;}";
	}
	document.body.appendChild(addition_sheet);
}
else if (urlCheck.includes("youtube.com/watch"))
{
	if (youtube_disable_endcards)
	{
		// Get rid of YouTube's annoying ENDCARDS
		var sheet = document.createElement('style')
		sheet.innerHTML = ".ytp-ce-element {display: none;}";
		document.body.appendChild(sheet);
	}
}
 
// Setup Function
function setup_onLoad()
{
	// For code that needs to happen post-pageload
	if (window.attachEvent) {window.attachEvent('onload', afterLoad);}
	else if (window.addEventListener) {window.addEventListener('load', afterLoad, false);}
	else {document.addEventListener('load', afterLoad, false);}
}
function setup_onScroll()
{
	// For code that needs to happen on scroll event
	window.addEventListener("scroll", onPageScroll);
}

