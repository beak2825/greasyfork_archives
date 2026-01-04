// ==UserScript==
// @name        Beamdog thread ignore script
// @namespace   https://greasyfork.org
// @description Blocks specified threads or subforums on the Beamdog forums
// @include     https://forums.beamdog.com/*
// @version     2
// @grant       none
// @run-at      document-ready
// @downloadURL https://update.greasyfork.org/scripts/36868/Beamdog%20thread%20ignore%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/36868/Beamdog%20thread%20ignore%20script.meta.js
// ==/UserScript==

// With this script you can ignore threads. These threads will be ignored on the "Recent Discussions" page
// AND on their respective subforum discussion page.
// You can also choose to ignore a subforum. ALL the threads from ALL subforums with that name will be ignored on the "Recent Discussions" page

// Add the title of a thread to this list. Enclose the thread's title with double quotes.
// Separate different thread titles by a comma.
var threadlist = [
   "Guess Facts about the Next Poster", "Finally an ignore feature!"
];

// Add the name of a subforum to this list in the same way as above. ATTENTION! On our forum there are multiple subforums
// that have the same name. If you enter a name in this list, then ALL the threads from ALL the subforums with that
// name will be ignored!
var subforumlist =[
    
];

var threadsToDelete = document.querySelectorAll(".Title");
var subforumsToDelete = document.querySelectorAll(".Category a");

var url = window.location.href;
var sub1 = "discussions";
var sub2 = "categories";

// case: URL contains "discussion"
if (url.indexOf(sub1) !== -1 ) {

	//delete subforums
    for (var i=0; i < subforumsToDelete.length; i++) {
        if (subforumlist.indexOf(subforumsToDelete[i].textContent) > -1) {
           subforumsToDelete[i].parentNode.parentNode.parentNode.parentNode.style.display = 'none';
        }
    }
	
}

//case: URL contains "discussion" OR "categories"
if (url.indexOf(sub1) !== -1 || url.indexOf(sub2) !== -1){
    
    //delete threads 
      for (var i=0; i < threadsToDelete.length; i++) {
        if (threadlist.indexOf(threadsToDelete[i].textContent) > -1) {
           threadsToDelete[i].parentNode.parentNode.parentNode.style.display = 'none';
        }
    }
}
