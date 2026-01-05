// ==UserScript==
// @name        FilterOrdinaryTimesCommenters
// @namespace   kenb
// @include     http://*ordinary-gentlemen.com/*
// @description Filter out comments for selected commenters at Ordinary Times
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/2374/FilterOrdinaryTimesCommenters.user.js
// @updateURL https://update.greasyfork.org/scripts/2374/FilterOrdinaryTimesCommenters.meta.js
// ==/UserScript==


/*

  Replaces the comment text for specified commenters on the
  Ordinary Times blog (nee Ordinary Gentlemen) with "Comment Removed"
  
  Change the regular expression in the commenterPattern variable to control
  which commenters should be ignored -- to just do exact matching, separate
  each commenter handle with a pipe (|). 
*/

var commenterPattern = /data-name="(Commenter1|Commenter2)"/i;
var thisComment;


var allComments = document.getElementsByClassName('comment-content');

for (var i=0; i < allComments.length; i++) 
 	 {
		thisComment = allComments[i];         
        if (commenterPattern.test(thisComment.innerHTML) ) {
            thisComment.innerHTML='<p>Comment Removed</p>';

        }
                
 	}

