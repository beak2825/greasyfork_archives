// ==UserScript==
// @name        Beamdog user ignore script
// @namespace   https://greasyfork.org
// @description Blocks specified users on the Beamdog forums
// @include     https://forums.beamdog.com/*
// @version     2
// @grant       none
// @run-at      document-ready
// @downloadURL https://update.greasyfork.org/scripts/22114/Beamdog%20user%20ignore%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/22114/Beamdog%20user%20ignore%20script.meta.js
// ==/UserScript==
/*This script is based on the Achaea forums ignore script.
Permission from original author, Ephemeralis, has been granted.*/


//add a person to this list, enclosing their name with "". Separate multiple entries with a comma.
var userlist = [
   "Shandyr"
];

var reactionsToDelete = document.querySelectorAll(".UserReactionWrap");
var leaderBoxesToDelete = document.querySelectorAll(".Leaderboard-User");
var threadsToDelete = document.querySelectorAll(".FirstUser");
var mostRecentToDelete = document.querySelectorAll(".LastUser");
var postsToDelete = document.querySelectorAll(".AuthorWrap");
var quotesToHide = document.querySelectorAll(".QuoteAuthor");
var onlineUsersToHide = document.querySelectorAll(".OnlineUserWrap");
var activityWallPostToDelete = document.querySelectorAll(".Activity-WallPost");
var activityStatusToDelete = document.querySelectorAll(".Activity-Status,.ActivityComment");
var picChangeToDelete = document.querySelectorAll(".Activity-PictureChange");
var bestofToDelete = document.querySelectorAll(".Tile");
var messagesToDelete = document.querySelectorAll(".Conversation,.ConversationMessage");
var badgesToDelete = document.querySelectorAll(".Activity-Badge,.Activity-Registration");
var tagsToDelete = document.querySelectorAll(".Message a,.Excerpt a");
var pollPicsToDelete = document.querySelectorAll(".PhotoGridSmall a");


var url = window.location.href;
var sub1 = "activity";
var sub2 = "profile";
var sub3 = "discussion";
var sub4 = "categories";
var sub5 = "bestof";
var sub6 = "messages";


//no URL check here
   //delete user reactions
   for (var i=0; i < reactionsToDelete.length; i++) {
     if (userlist.indexOf(reactionsToDelete[i].querySelector(".ProfilePhoto").getAttribute("alt")) > -1) {
       reactionsToDelete[i].style.display = 'none';
      }
   }

   //delete from leaderboards
   for (var i=0; i < leaderBoxesToDelete.length; i++) {
     if (userlist.indexOf(leaderBoxesToDelete[i].querySelector(".Username").textContent) > -1 ) {
       leaderBoxesToDelete[i].parentNode.parentNode.style.display = 'none';
      }
   }

   //delete user tags
   for (var i=0; i < tagsToDelete.length; i++) {
	   var tag = tagsToDelete[i].textContent;
     if (tag[0] == '@' && userlist.indexOf(tag.substring(1, tag.length)) > -1 ) {
       tagsToDelete[i].outerHTML = '@blockedUser';
      }
   }


//case URL contains "discussion" or "categories"
if (url.indexOf(sub3) !== -1 || url.indexOf(sub4) !== -1){

	//delete small avatar icons on polls
	for (var i=0; i < pollPicsToDelete.length; i++) {
		if (userlist.indexOf(  pollPicsToDelete[i].getAttribute("title")  ) > -1 ){
			//pollPicsToDelete[i].outerHTML = '';
			pollPicsToDelete[i].style.display = 'none';

		}
	}

    //delete threads
    //important to start with i=1 here; first element needs to be skipped; it's just the header for the "started by" column
    for (var i=1; i < threadsToDelete.length; i++) {
      if (userlist.indexOf(threadsToDelete[i].querySelector(".BlockTitle").textContent) > -1) {
           threadsToDelete[i].parentNode.style.display = 'none';
        }
    }

    //delete most recent panel for a thread in discussion board if most recent poster is on ignore
    //start with i=1; same reason as above
    for (var i=1; i < mostRecentToDelete.length; i++) {
      if (userlist.indexOf(mostRecentToDelete[i].querySelector(".BlockTitle").textContent) > -1) {
           mostRecentToDelete[i].querySelector(".Block").style.display = 'none';
         }
    }

    //delete comments
    for (var i=0; i < postsToDelete.length; i++) {
       if (userlist.indexOf(postsToDelete[i].querySelector(".Username").textContent) > -1) {
           postsToDelete[i].parentNode.parentNode.parentNode.style.display = 'none';
       }
    }

    //delete quotes; needs to be worked on for nested quotes
    for (var i=0; i < quotesToHide.length; i++) {
       if (userlist.indexOf(quotesToHide[i].firstChild.textContent) > -1) {
        quotesToHide[i].parentNode.style.display = 'none';
       }
    }

    //delete user name in "Who's online" box and decrease counter
    // substring: to remove the "+" in front of the number
    var guestCounter = parseInt(document.querySelector(".GuestCount").textContent.substring(1),10);
    var counter = onlineUsersToHide.length + guestCounter;

    for (var i=0; i < onlineUsersToHide.length; i++) {
      if (userlist.indexOf(onlineUsersToHide[i].textContent) > -1) {
        onlineUsersToHide[i].style.display = 'none';
        counter -= 1;
        document.querySelector(".WhosOnline").querySelector(".Count").innerHTML = counter;
        }
    }
}

//case URL contains "activity" or "profile"
if (url.indexOf(sub1) !== -1 || url.indexOf(sub2) !== -1 ){

    //delete wall post to or from an ignored user
    for (var i=0; i < activityWallPostToDelete.length; i++) {
       //[0] for the case that ignored member is addresser; [1] for the case they are recipient
       if (userlist.indexOf(activityWallPostToDelete[i].querySelectorAll(".Name")[0].textContent) > -1 ||
           userlist.indexOf(activityWallPostToDelete[i].querySelectorAll(".Name")[1].textContent) > -1) {
           activityWallPostToDelete[i].style.display = 'none';
       }
    }

    //delete post on own wall
    for (var i=0; i < activityStatusToDelete.length; i++) {
      if (userlist.indexOf(activityStatusToDelete[i].querySelector(".Title").textContent) > -1 ) {
          activityStatusToDelete[i].style.display = 'none';
       }
    }

    //delete picture change message
    for (var i=0; i < picChangeToDelete.length; i++) {
       if (userlist.indexOf(picChangeToDelete[i].querySelector(".PhotoWrap").getAttribute("href").substring(9)) > -1 ) {
          picChangeToDelete[i].style.display = 'none';
       }
    }

    //delete badge activity and registration messages
    for (var i=0; i < badgesToDelete.length; i++) {
      for (var j=0; j < userlist.length; j++) {
         if (badgesToDelete[i].textContent.indexOf(userlist[j]) > -1) {
          badgesToDelete[i].style.display = 'none';
         break;
         }
      }
    }
}

//case URL contains "bestof"
if (url.indexOf(sub5) !== -1) {

    //delete from best of
     for (var i=0; i < bestofToDelete.length; i++) {
       if (userlist.indexOf(bestofToDelete[i].querySelector(".PhotoWrap").getAttribute("title")) > -1 ) {
          bestofToDelete[i].style.display = 'none';
       }
    }
}

//case URL contains "messages"
if (url.indexOf(sub6) !== -1 ){
     //delete private messages
    for (var i=0; i < messagesToDelete.length; i++) {
       if (userlist.indexOf(messagesToDelete[i].querySelector(".PhotoWrap").getAttribute("title")) > -1) {
           messagesToDelete[i].parentNode.style.display = 'none';
       }
    }
}