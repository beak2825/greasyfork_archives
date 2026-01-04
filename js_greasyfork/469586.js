// ==UserScript==
// @name         Various KBin.social personal preferences
// @namespace    https://kbin.social/
// @version      0.4
// @description  Small (subjective) improvements to Kbin.social
// @author       H2SO4
// @match        https://kbin.social/*
// @grant        none
// @license      Whatever
// @downloadURL https://update.greasyfork.org/scripts/469586/Various%20KBinsocial%20personal%20preferences.user.js
// @updateURL https://update.greasyfork.org/scripts/469586/Various%20KBinsocial%20personal%20preferences.meta.js
// ==/UserScript==

/*
Highlight OP's name and add [OP] to clearly indicate which comments are by the OP
*/

function changeOPusername(user) {
	user.innerText = user.innerText+" [OP]";
	user.style.color="blue";
}
(function() {
    'use strict';
    let authorlink = document.querySelector("article.entry aside.meta a.user-inline");
    if(!authorlink) return;
    let author = authorlink.innerText
    let authorcomments = document.querySelectorAll("div#comments section.comments blockquote.author header a.user-inline");
    let comments = [...authorcomments];
    comments.map( user => changeOPusername(user) );
})();

/*
Collapsible comment threads
*/

function toggleElementVisibility(element) {
	element.style.display == "none" ? element.style.display = "block" : element.style.display = "none";
}

function handleCollapserClick(e, comment) {

	let level = comment.getAttribute("class").match(/\d/)[0];
	var subcomment = comment.nextElementSibling;
    let numChildren = 0;
	while(subcomment && !subcomment.classList.contains("comment-level--"+level)) {
        if(comment.classList.contains("collapsed")) {
            subcomment.style.display = "grid"
        }
        else {
            subcomment.style.display = "none"
        }
		subcomment = subcomment.nextElementSibling;
        numChildren++;
	}
	toggleElementVisibility(comment.getElementsByClassName("content")[0]);
	toggleElementVisibility(comment.getElementsByTagName("aside")[0]);
	toggleElementVisibility(comment.getElementsByTagName("footer")[0]);

    let header = comment.getElementsByTagName("header")[0];
    if(comment.classList.contains("collapsed")) {
		e.target.innerText = "[-]";
        header.getElementsByClassName("childCounter")[0].remove();
		comment.classList.remove("collapsed");
        comment.style.marginBottom = "auto";
        header.style.fontStyle = "inherit";
        header.style.color = "var(--kbin-meta-text-color)";
        header.getElementsByClassName("user-inline")[0].style.color = "inherit";
        comment.getElementsByTagName("figure")[0].style.opacity = "initial";
	}
	else {
        e.target.innerText = "[+]";
        let childCountSpan = document.createElement("span");
        childCountSpan.classList.add("childCounter");
        childCountSpan.innerText = " ("+numChildren+" child comment"+(numChildren==1?"":"s")+")";
        header.append(childCountSpan);
		comment.classList.add("collapsed");
        comment.style.marginBottom = "-20px";
        header.style.fontStyle = "italic";
        header.style.color = "#AAA";
        header.getElementsByClassName("user-inline")[0].style.color = "#AAA";
        comment.getElementsByTagName("figure")[0].style.opacity = "0.25";
	}
	return false;
}

(function() {
    'use strict';
    document.querySelectorAll("div#comments section.comments blockquote.comment").forEach(function(comment){
        let header = comment.getElementsByTagName("header")[0];
        let collapser = document.createElement("a");
        collapser.classList.add("collapser");
        collapser.innerText = "[-]";
        collapser.href = "#";
        collapser.onclick = (e) => handleCollapserClick(e, comment);
        header.append(collapser);
    });
})();

/*
Disable custom stylesheets
*/

(function() {
    'use strict';
    let stylesheet = document.getElementsByTagName("head")[0].getElementsByTagName("style");
    if(stylesheet && stylesheet[0]) {
        stylesheet[0].remove();
    }
})();

/*
Add community title + link to entry meta info
*/

(function() {
    'use strict';
    let link = document.querySelector("#options .options__main li:first-child a");
    if(link && link.href) {
        let community = link.href.match(/\/m\/([a-zA-Z@\.]+)/);
        if(community) {
            community = community[1];
            let communityLink = document.createElement("a");
            communityLink.href = "/m/"+community;
            communityLink.innerText = " to " + community;
            let meta = document.querySelector("#content .entry__meta");
            if(meta) {
                meta.append(communityLink);
            }
        }
    }
})();

/*
Add target="_blank" (and an icon) to external links
*/

(function() {
    'use strict';
    let links = document.getElementsByTagName('a');
    let url = new RegExp("^https:\/\/kbin\.social", "gi");
    let internal = '^\/[mc]\/.+';
    for(let i=0;i<links.length;i++) {
        let a = links[i];
        if(!a.href.match(url) && !a.href.match(internal) && a.href != '#' && a.href.length > 0) {
            a.setAttribute('target', '_blank');
            a.innerHTML = a.innerHTML + "🔗";
        }
    }
})();
