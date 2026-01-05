// ==UserScript==
// @name         Auto-downvoter
// @namespace    AYYYYYYYYYYYY LEEEEEEEEEEE MAYOOOOOO
// @version      1.1
// @description  Originally designed to downvote xxerox's comments, I expanded this to include a few other accounts.
// @author       Whitepimp007
// @match        https://epicmafia.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28011/Auto-downvoter.user.js
// @updateURL https://update.greasyfork.org/scripts/28011/Auto-downvoter.meta.js
// ==/UserScript==

/*
[quote=xxerox]It is like you live in africa, decide to go to
the north pole, but you start drinking water with ice and you
like it. And there is plenty of ice and water around...

It is like you play epic mafia every day. Then you go to
vacantion. And there , since you are away, you have plenty of
time and opportunity to play, even if it is stupid not to relax
and have a nice relaxing vacancion away from EM.

So you end up playing again and possibly cheat.

You live in Africa - EM. You play em - drink water with ice.
You go to the north pole - argentina. You drink ice water on
the north pole which is kind of stipid since its cold anyway
- you play epic mafia in argentina even if its stupid not to
enjoy your vacation. There is planty of water and ice around.
- Epic Mafia isn't going anywhere, so you will continue playing it.

Playing EpicMafia can also be replaced with cheating.

Here you go! My entire methor explaines for you -.-[/quote]
*/

var i = 0; // Iterates through comments on page

author = ["xxerox", "yoyo200900", "pranay7744", "ZeroFurrbone", "mandevian", "IAmNotABC", "cash", "Hunt", "panthero", "townyyy1", "mtlve", "Orly", "mt01"];

function scan() {
    if (typeof postVotes === 'undefined') {
        postAuthors = $("a[data-type='userinfo']:not(.ib, .pretty, .userinfo, div.art > a)");
        postVotes = $(".down:has(.icon-thumbs-down)").filter("a[data-t='post'], a[data-t='comment']");
    }
    if (i < postVotes.length) { // Comments left to parse
		if (!postVotes.eq(i).hasClass("sel")) { // Isn't already up/down voted
			uname = postAuthors[i].innerHTML.trim(); // Removing whitespace around author name
            if (author.indexOf(uname) !== -1) { // Checking if author is in array
                postVotes.eq(i).click(); // Downvotes comment
                console.log("DOWNVOTED - " + postAuthors[i].innerHTML.trim());
            } else {
                console.log("NO ACTION - " + postAuthors[i].innerHTML.trim());
            }
			i++; // Increments iteratable
			setTimeout(scan, 1200); // Prevents "You are voting too fast!"
		}
		else { // Comment already downvoted
            console.log(postAuthors[i].innerHTML.trim() + " was previously downvoted.");
			i++;  // Increments iteratable
			scan();
		}
	}
}

$("[ng-click*='goto_lobby']").click(function() {
    setTimeout(scan, 1000);
});

$("[data-pjax='#posts']").click(function() {
    setTimeout(scan, 1000);
});
setTimeout(scan, 1000);
