// ==UserScript==
// @name           XKCD enhancments
// @description    Displays the xkcd mouse-hover text when you click the comic (+date of comic submission), also adds a link to explaixkcd.com
// @namespace      https://greasyfork.org/users/98-jonnyrobbie
// @author         JonnyRobbie
// @grant		   none
// @include        /^https?:\/\/(www\.)?xkcd\.com\/(\d+\/)?$/
// @version        3
// @downloadURL https://update.greasyfork.org/scripts/1774/XKCD%20enhancments.user.js
// @updateURL https://update.greasyfork.org/scripts/1774/XKCD%20enhancments.meta.js
// ==/UserScript==


function main() {
	var jsonObj = JSON.parse(getMeta());
	appendHover(jsonObj);
	linkExplain(jsonObj.num);
}

function getMeta() {
	var jsonResponse;
	var xkcdMeta = new XMLHttpRequest();
	function reqListener () {
		jsonResponse = this.responseText;
	}
	xkcdMeta.onload = reqListener;
	xkcdMeta.open("get", document.URL + "info.0.json", false);
	xkcdMeta.send();
	return jsonResponse;
}

function appendHover (jsonObj) {
	var comicDiv = document.getElementById("comic");
	var comic = comicDiv.getElementsByTagName("img")[0];
	var titleWrap = document.createElement("div");
		titleWrap.style.height = "0px";
		titleWrap.style.color = "#fff";
		titleWrap.style.fontStyle = "italic";
		titleWrap.style.fontSize = "0.8em";
		titleWrap.style.marginLeft = "20px";
		titleWrap.style.marginRight = "20px";
	var altTitle = document.createElement("div");
		altTitle.innerHTML = jsonObj.year + "-" + ((jsonObj.month<10) ? ("0" + jsonObj.month) : jsonObj.month) + "-" + ((jsonObj.day<10) ? ("0" + jsonObj.day) : jsonObj.day) + "</br>" + jsonObj.alt;
	titleWrap.appendChild(altTitle);
	function animListener() {
		animateIn(titleWrap, altTitle, comic, animListener);
	}
	comic.addEventListener("click", animListener);
	comicDiv.parentNode.insertBefore(titleWrap, comicDiv.nextSibling);
}

function linkExplain (jsonNum) {
	titleDiv = document.getElementById('ctitle');
	var comicName = titleDiv.innerHTML;
	titleDiv.innerHTML = "";
	var origTitle = document.createElement("span");
		origTitle.innerHTML = comicName;
	titleDiv.appendChild(origTitle);
	var linkTitle = document.createElement("a");
		linkTitle.innerHTML = "(ExplainXKCD)";
		linkTitle.style.display = "none";
		linkTitle.href = "http://www.explainxkcd.com/wiki/index.php?title=" + jsonNum;		
	titleDiv.appendChild(linkTitle);
	
	origTitle.onmouseover = function(){changeVisibility(this, linkTitle);}
	origTitle.onmouseclick = function(){changeVisibility(this, linkTitle);}
	linkTitle.onmouseover = function(){changeVisibility(origTitle, this);}
	origTitle.onmouseout = function(){changeVisibility(linkTitle, this);}
	linkTitle.onmouseout = function(){changeVisibility(this, origTitle);}
}

function changeVisibility(hideElem, showElem) {
	hideElem.style.display = "none";
	showElem.style.display = "inline"
}

function animateIn(outer, inner, comic, animListener){
	var size = 0.0;
	var rgb = 255;
	comic.removeEventListener("click", animListener);
	function animListenerOut() {
		animateOut(outer, inner, comic, animListenerOut);
	}
	var id = setInterval(function() {
		size = size + (inner.clientHeight / 10)
		outer.style.height = Math.round(size) + "px";
		if (inner.clientHeight <= outer.clientHeight) {
			clearInterval(id);
			var id2 = setInterval(function() {
				outer.style.color = "rgb(" + rgb + "," + rgb + "," + rgb + ")";
				if (rgb < 25) {
					clearInterval(id2)
					comic.addEventListener("click", animListenerOut)
				}
				rgb = rgb - 25;
			}, 20)
		}
	}, 20)
}

function animateOut(outer, inner, comic, animListener){
	var size = outer.clientHeight;
	var rgb = 0;
	comic.removeEventListener("click", animListener);
	function animListenerIn() {
		animateIn(outer, inner, comic, animListenerIn);
	}
	var id = setInterval(function() {
		outer.style.color = "rgb(" + rgb + "," + rgb + "," + rgb + ")";
		if (rgb > 230) {
			clearInterval(id);
			var id2 = setInterval(function() {
				size = size - (inner.clientHeight / 10)
				outer.style.height = Math.round(size) + "px";
				if (0 >= outer.clientHeight) {
					clearInterval(id2)
					comic.addEventListener("click", animListenerIn)
				}
			}, 20)
		}
		rgb = rgb + 25;
	}, 20)
}

main();