// ==UserScript==
// @name         Shithole.win Filter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Remove spam post and replies from selected users
// @author       Me
// @match        https://communities.win/c/Shithole/*
// @icon         https://www.google.com/s2/favicons?domain=communities.win
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431713/Shitholewin%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/431713/Shitholewin%20Filter.meta.js
// ==/UserScript==

var blockedUsers = ["Building15"];
var parent;
var posts;

/*Run on posts*/
if(document.location.pathname.startsWith("/c/Shithole/p")) {
  parent = document.querySelector(".comment-list");
  posts = true;
  /*console.log("Running blocked user script on posts..");*/
}
else { /*Run on main page*/
  parent = document.querySelector('.main-content.post-list');
  posts = false;
  /*console.log("Running blocked user script on main page..");*/
}

function parentMutation() {
  var observervalues = {
	childList: true,
	attributes: false,
	attributeOldValue: false
  };

  var obs = new MutationObserver(getChildNodes);
  obs.observe(parent, observervalues);
  /*console.log("mutationObserver on parent");*/
}

function getChildNodes(mutationList) {
  mutationList.forEach(function(mutation) {
    switch(mutation.type) {
      case "childList":
        removeBlocked();
        break;
    }
  });
}

function removeBlocked() {
  var d;
  if(posts) {
	d = document.querySelectorAll(".comment .details .author");
	for(var n = 0; n < d.length; n++) {
	  for(var x = 0; x < blockedUsers.length; x++) {
		if(d[n].innerText.trimEnd() == blockedUsers[x]) {
		  d[n].parentElement.parentElement.parentElement.remove();
		  continue;
		}
	  }
	}
  }
  else {
	d = parent.querySelectorAll(".post");
	for(var i = 0; i < d.length; i++) {
	  for(var y = 0; y < blockedUsers.length; y++) {
		if(d[i].dataset.author == blockedUsers[y]) {
		  d[i].remove();
		  continue;
		}
	  }
	}
  }
}

parentMutation();
removeBlocked();