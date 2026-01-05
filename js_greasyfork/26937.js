// ==UserScript==
// @name     Hide Certain TYT Member's comments
// @description:en  Simple script to hide any annoying TYT member's posts and comments.
// @include  https://tytnetwork.com*
// @require  https://code.jquery.com/jquery-2.1.3.min.js
// @version 0.0.1.20170131051239
// @namespace https://greasyfork.org/users/98831
// @description Simple script to hide any annoying TYT member's posts and comments.
// @downloadURL https://update.greasyfork.org/scripts/26937/Hide%20Certain%20TYT%20Member%27s%20comments.user.js
// @updateURL https://update.greasyfork.org/scripts/26937/Hide%20Certain%20TYT%20Member%27s%20comments.meta.js
// ==/UserScript==

function addJQuery(callback) {
    var script = document.createElement("script");
    script.setAttribute("src", "https://code.jquery.com/jquery-2.1.3.min.js");
    script.addEventListener('load', function() {
        var script = document.createElement("script");
        script.textContent = "(" + callback.toString() + ")();";
        document.body.appendChild(script);
    }, false);
    document.body.appendChild(script);
}

// load jQuery and execute the main function
addJQuery(main);

// The example below hides comments by member: dDErss.
// And let's face it why wouldn't you want to hide his self righteous drivel?
// If you want to hide comments from even some other pompous member, just copy and paste all the lines that contain 'dDErss'
// And then simply change the name from dDErss to the member you would also like to stop seeing comments from...
//
// Or to reverse the process, delete the lines containing a members name to allow for their comments to be seen again.
// Pretty simple stuff.

function main() {
    $('.x-comment-content-wrap:contains("dDErss")').hide();
    
//  Enabling the two lines below will create a much cleaner layout, 
//  But will ALSO remove any responses to, or any other post with a comment from, the hidden TYT member...
//  So other posts willl be affected, not just those of the hidden TYT member

//  $('.children:contains("dDErss")').hide();
//  $('.comment:contains("dDErss")').hide();

}

// It's not perfect, as I quickly typed it up while watching my toast brown one breakfast morning...
// But it gets the job done.
// And there's probably a more efficient way to write the script... and one day I'll look at it a bit more closely.
// But not today. LOL!