// ==UserScript==
// @name         Soshified Auto-Hide Certain Users
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @description  Automatically collapse some users' posts on Soshified
// @author       You
// @match        https://www.soshified.com/forums/topic/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=soshified.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/492798/Soshified%20Auto-Hide%20Certain%20Users.user.js
// @updateURL https://update.greasyfork.org/scripts/492798/Soshified%20Auto-Hide%20Certain%20Users.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if(localStorage.getItem("autohiddenAuthorIds") === null) { localStorage.setItem("autohiddenAuthorIds",JSON.stringify([])) }
	var autohiddenAuthorIds = JSON.parse(localStorage.getItem("autohiddenAuthorIds"));

    window.soshifiedUserAutohider = {unhideLabelText: "[Stop auto-hiding]", hideLabelText: "[Auto-hide]"};

    //CSS insertion code by Cristoph on Stack Overflow: https://stackoverflow.com/a/524721
    var css = 'details.hidden-post:not([open]) { background-color: #f6e6e6; }',
        head = document.head || document.getElementsByTagName('head')[0],
        style = document.createElement('style');

	head.appendChild(style);

	style.type = 'text/css';
	if (style.styleSheet){
	  // This is required for IE8 and below.
	  style.styleSheet.cssText = css;
	} else {
	  style.appendChild(document.createTextNode(css));
	}
    //End of CSS insertion code

    function addToAutoHiddenAuthorIds(id) {
        if(typeof(id) == "string") { id = parseInt(id) };
        autohiddenAuthorIds.push(id);
        localStorage.setItem("autohiddenAuthorIds",JSON.stringify(autohiddenAuthorIds))
    };

    function removeFromAutoHiddenAuthorIds(id) {
        if(typeof(id) == "string") { id = parseInt(id) };
        var ioi = autohiddenAuthorIds.indexOf(id); //index of id not ideal of idol :sob:
        if(ioi !== -1) {
            autohiddenAuthorIds.splice(ioi,1)
            localStorage.setItem("autohiddenAuthorIds",JSON.stringify(autohiddenAuthorIds))
        } //no need to resave if nothing was changed
    };

    function clearAutoHiddenAuthorIds(id) {
        autohiddenAuthorIds.length = 0;
        localStorage.setItem("autohiddenAuthorIds",JSON.stringify(autohiddenAuthorIds))
    };

    function checkIfPostIsHidden(postDivElement) {
        return postDivElement.querySelector("summary.hidden-post-label") !== null
    };

    function autohiderHidingFunction(postDivElement) {
        var alreadyHidden = checkIfPostIsHidden(postDivElement);
        if(alreadyHidden) { return false };

        var replyNumber = postDivElement.querySelector('a[itemprop="replyToUrl"]')?.textContent; if(typeof(replyNumber) !== "string") { replyNumber = "[Reply number not found]" } else { replyNumber = parseInt(replyNumber.match(/\d+/)?.[0] ?? "NaN"); if(isNaN(replyNumber)) { replyNumber = "[Reply number not found]" } };
        var author = postDivElement.querySelector('span[itemprop] span[itemprop="name"]').textContent ?? "[Author not found]";
        var authorId = postDivElement.querySelector('a[hovercard-id]')?.getAttribute?.("hovercard-id"); if(typeof(authorId) !== "string") { authorId = "[ID not found]" } else { authorId = parseInt(authorId); if(isNaN(authorId)) { authorId = "[Author ID not found]" } };
        var title = postDivElement.querySelector('li.group_title')?.textContent?.trim?.() ?? "[User title not found]";

        var contents = postDivElement.querySelector("div[itemscope]")
        var collapsible = document.createElement("details");
        collapsible.classList.add("hidden-post");
        var hiddenMessageLabel = document.createElement("summary");
        hiddenMessageLabel.textContent = `Hidden reply (post reply #${replyNumber.toString()}) from user "${author}" (ID ${authorId.toString()}, user title "${title}")`
        hiddenMessageLabel.classList.add("hidden-post-label");
        collapsible.appendChild(hiddenMessageLabel);
        collapsible.appendChild(contents);
        postDivElement.appendChild(collapsible)
    };

    function autohiderUnhidingFunction(postDivElement) {
        var alreadyHidden = checkIfPostIsHidden(postDivElement);
        if(!alreadyHidden) { return false };
        var hiddenMessageLabel = postDivElement.querySelector("summary.hidden-post-label");
        hiddenMessageLabel.parentElement.removeChild(hiddenMessageLabel);
        hiddenMessageLabel = null;
        var postContents = postDivElement.querySelector("div[itemscope]");
        postDivElement.appendChild(postContents)
        var collapsible = postDivElement.querySelector("details.hidden-post");
        collapsible.parentElement.removeChild(collapsible);
        collapsible = null;
    };

    function doPostHidingAndUnhiding() {
        var posts = document.querySelectorAll("div.post_block");
        for(var i = 0; i < posts.length; i++) {
            var post = posts[i];
            var authorId = post.querySelector('a[hovercard-id]')?.getAttribute?.("hovercard-id");
            if(authorId) {
                authorId = parseInt(authorId);
                var authorShouldBeHidden = (autohiddenAuthorIds.includes(authorId));
                var postIsHidden = checkIfPostIsHidden(post);
                if(authorShouldBeHidden == postIsHidden) {
                    continue
                } else if(authorShouldBeHidden && !postIsHidden) {
                    autohiderHidingFunction(post)
                } else if(!authorShouldBeHidden && postIsHidden) {
                    autohiderUnhidingFunction(post)
                }
            }
        }
    }

    //Do hider option for all posts
    var posts = document.querySelectorAll("div.post_block");
	for(var i = 0; i < posts.length; i++) {
		var post = posts[i];
        var authorId = post.querySelector('a[hovercard-id]')?.getAttribute?.("hovercard-id");
		if(authorId) {
            authorId = parseInt(authorId);
            var postCount = post.querySelector('li.post_count')
            var authorShouldBeHidden = (autohiddenAuthorIds.includes(authorId));
            var hideOption = document.createElement("li");
            hideOption.classList.add("lighter");
            hideOption.classList.add("desc");
            hideOption.classList.add("autohide-option");
            hideOption.innerText = (authorShouldBeHidden ? window.soshifiedUserAutohider.unhideLabelText : window.soshifiedUserAutohider.hideLabelText);
            hideOption.setAttribute("affected-id",authorId.toString());
			postCount.after(hideOption);
            hideOption.addEventListener("click",function() {
                var id = parseInt(this.getAttribute("affected-id"));
                var authorIsBeingHidden = (autohiddenAuthorIds.includes(id));
                if(authorIsBeingHidden) {
                    this.innerText = window.soshifiedUserAutohider.hideLabelText; //If they were hidden, we're unhiding them, so clicking it again should re-hide them; thus it should be labeled as such
                    removeFromAutoHiddenAuthorIds(id)
                } else {
                    this.innerText = window.soshifiedUserAutohider.unhideLabelText;
                    addToAutoHiddenAuthorIds(id)
                };
                doPostHidingAndUnhiding()
            });
		};
	};

    doPostHidingAndUnhiding()
})();