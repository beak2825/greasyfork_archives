// ==UserScript==
// @id             reddit_detach_post
// @name           Reddit detach post
// @version        1.0
// @namespace      https://greasyfork.org/users/98-jonnyrobbie
// @author         JonnyRobbie
// @description    Detach OP post from the top.
// @include        /https?:\/\/(www\.)?reddit\.com\/r\/[a-zA-Z]+\/comments\/.*/
// @run-at         document-end
// @downloadURL https://update.greasyfork.org/scripts/5213/Reddit%20detach%20post.user.js
// @updateURL https://update.greasyfork.org/scripts/5213/Reddit%20detach%20post.meta.js
// ==/UserScript==

function main() {
	var sitetable = document.getElementById("siteTable");
        var detach = document.createElement("li");
        detach.innerHTML = "<a>detach</a>";
		detach.style.cursor = "pointer";
		detach.attached = true;
		detach.addEventListener("click", function(){click(this, sitetable);}, false)
	sitetable.getElementsByClassName("flat-list buttons")[0].appendChild(detach);
}

function click(button, sitetable) {
	console.log("clicked");
	if (button.attached == true) {
		console.log("attached");
		button.attached = false;
		button.innerHTML = "<a>attach</a>"
		sitetable.style.position = "fixed";
		sitetable.style.top = "0px";
		//sitetable.style.left = "0px";
		sitetable.style.bottom = "auto";
		sitetable.style.backgroundColor = "#FFF";
		sitetable.style.zIndex = "99";
	} else if (button.attached == false) {
		console.log("detached");
		button.attached = true;
		button.innerHTML = "<a>detach</a>"
		sitetable.style.position = "static";
		sitetable.style.top = "";
		//sitetable.style.left = "";
		sitetable.style.bottom = "";
		sitetable.style.backgroundColor = "";
		sitetable.style.zIndex = "auto";
	}
}

main();