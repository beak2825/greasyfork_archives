// ==UserScript==
// @name           mTurkGrind vs HIT Snatchers
// @author         ChrisTurk
// @version	   4.2
// @namespace	   https://turkerview.com/mturk-scripts/
// @description    This is a tool, how you use it is up to you.
// @include        http://www.mturkgrind.com/*
// @grant          GM_getValue
// @grant          GM_setValue
// @require  	   http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @require   	   https://code.jquery.com/jquery-2.1.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/21232/mTurkGrind%20vs%20HIT%20Snatchers.user.js
// @updateURL https://update.greasyfork.org/scripts/21232/mTurkGrind%20vs%20HIT%20Snatchers.meta.js
// ==/UserScript==

//  MTurkGrind
// For members of forums who don't want their HITs scraped you can use this. It'll add a checkbox to the quick reply area that allows you to 'opt-in' to adding a completely scrambled HIT to the top of your post. It is hidden within a spoiler tag so as to not clutter the forum.
// The checkbox will save its state (..maybe, if I did it right, no promises) so if you want to add it to every post you make on the forum (even non-HITs) then you will probably drive people to racism, violence, and God-only-knows what else. This isn't my fault but I will giggle every time it happens.
// I do not now, nor have I ever, owned stock in MTurkGrind.com or its affiliates. I am, however, currently investing in Stanley's kidneys-for-rent-in-Mexico program.

var starArray = [
	'[COLOR=green]★[/COLOR][COLOR=white]★★★★[/COLOR]',
	'[COLOR=green]★★[/COLOR][COLOR=white]★★★[/COLOR]',
	'[COLOR=green]★★★[/COLOR][COLOR=white]★★[/COLOR]',
	'[COLOR=green]★★★★[/COLOR][COLOR=white]★[/COLOR]',
	'[COLOR=green]★★★★★[/COLOR]',
];

var cbSnatcher = $( '<input type="checkbox" id="notifier" ><label>Hide from Notifier</label></input>' );

$( document ).ready(function(){
	// Let's hide the small spoiler tag from other people using this script. Its not much clutter, but hey why not.
	//$( 'span:contains(Spoiler: SHITNotifier)' ).parent().hide();
	// no longer identifying the spoiler tag since its so small and doing so makes it too easy to circumvent. if Notifier wants to skip spoilers we can use that as the new Hide tag.
	$( '.submitUnit' ).append(cbSnatcher);

	var cbState = localStorage.getItem('notifierConfig');

	// can't store bool in localStorage? wtf? not wasting time, this will work
	if (cbState == "true"){
		//
		$( '#notifier' ).prop('checked', true);
	}
	else {
		$( '#notifier' ).prop('checked', false);
	}
	$( ':checkbox' ).change(function(){
		localStorage.setItem('notifierConfig', $(this).prop('checked'));
		console.log(localStorage.getItem('notifierConfig'));
	}); //cb change

}); // end doc ready



$( 'input.button.primary' ).click(function(){
	// Oh we're submitting a new post? Great! Let's say hi to HIT Notifier too!
	if ($( '#notifier' ).is(':checked')){
		var GID = randString(30);
		var Title = randTitle(Math.floor(2 + Math.random() * 8)) + ' ' + randTitle(Math.floor(2 + Math.random() * 8)) + ' ' + randTitle(Math.floor(2 + Math.random() * 8));
		var Req = randTitle(Math.floor(2 + Math.random() * 8)) + ' ' + randTitle(Math.floor(2 + Math.random() * 8));
		var Desc = randTitle(Math.floor(2 + Math.random() * 8)) + ' ' + randTitle(Math.floor(2 + Math.random() * 8)) + ' ' + randTitle(Math.floor(2 + Math.random() * 8)) + ' ' + randTitle(Math.floor(2 + Math.random() * 8)) + ' ' + randTitle(Math.floor(2 + Math.random() * 8));
		var RID = randString(14);
		var Comm = (3 + Math.random() * 2).toFixed(2);
		var CommStar = Math.floor(Math.random()*starArray.length);
		var Pay = (3 + Math.random() * 2).toFixed(2);
		var PayStar = Math.floor(Math.random()*starArray.length);
		var Fair = (3 + Math.random() * 2).toFixed(2);
		var FairStar = Math.floor(Math.random()*starArray.length);
		var Fast = (3 + Math.random() * 2).toFixed(2);
		var FastStar = Math.floor(Math.random()*starArray.length);
		var Rev = Math.floor(Math.random() * 75);
		var Time = Math.floor(1 + Math.random() * 58);
		var Reward = (Math.random() * 4).toFixed(2);
		var Avail = Math.floor(1 + Math.random() * 500);
		$( 'iframe.redactor_textCtrl.redactor_MessageEditor.redactor_BbCodeWysiwygEditor.redactor_' ).contents().find( 'body' ).prepend(
			'<p>' +
			'[spoiler][table][tr][td][b]Title:[/b] [URL=https://www.mturk.com/mturk/preview?groupId=' + GID +']' + Title + '[/URL] | [URL=https://www.mturk.com/mturk/previewandaccept?groupId=' + GID + ']PANDA[/URL]</p><p>' +
			'[b]Requester:[/b] [URL=https://www.mturk.com/mturk/searchbar?selectedSearchType=hitgroups&requesterId=' + RID + ']' + Req + '[/URL] [' + RID + '] ([URL=https://turkopticon.ucsd.edu/reports?id=' + RID + ']TO[/URL])</p><p>' +
			'[b]TO Ratings:[/b]</p><p>' + starArray[CommStar] + ' ' + Comm + ' Communicativity</p><p>' + starArray[PayStar] + ' ' + Pay + ' Generosity</p><p>' + starArray[FairStar] + ' ' + Fair + ' Fairness</p><p>' + starArray[FastStar] + ' ' + Fast + ' Promptness</p><p>' +
			'Number of Reviews: ' + Rev + '</p><p>' +
			'[b]Description:[/b] ' + Desc + '</p><p>' +
			'[b]Time:[/b] ' + Time + ' minutes</p><p>[b]HITs Available:[/b] ' + Avail + '</p><p>[b]Reward:[/b] [COLOR=green][b]$' + Reward +'[/b][/COLOR]</p><p>[b]Qualifications:[/b] None[/td][/tr][/table]' +
			'[/spoiler]' +
			'</p>'
			);
		} // we only did this if the user opted into it for this post
}); // post is submitting one way or another, buh-bye!

// ty interwebs for allowing me to generate some random bs on the fly without having to think.
/**
 * Function generates a random string for use in unique IDs, etc
 *
 * @param <int> n - The length of the string
 */
function randString(n)
{
    if(!n)
    {
        n = 5;
    }

    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    for(var i=0; i < n; i++)
    {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
}

function randTitle(n)
{
    if(!n)
    {
        n = 5;
    }

    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

    for(var i=0; i < n; i++)
    {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
}