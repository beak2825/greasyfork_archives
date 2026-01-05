// ==UserScript==
// @name          xkcd Title and Explain
// @namespace     http://greasyfork.org/users/2240-doodles
// @author        Doodles
// @version       1
// @description   Adds an explainxkcd.com link and the image title to xkcd.com comic pages.
// @icon          http://i.imgur.com/tedLgiQ.png
// @icon64        http://i.imgur.com/JKCTQ6F.png
// @include       /^https?:\/\/(www\.)?xkcd\.com\/(\d*\/)?$/
// @grant         none
// @updateVersion 1
// @downloadURL https://update.greasyfork.org/scripts/3762/xkcd%20Title%20and%20Explain.user.js
// @updateURL https://update.greasyfork.org/scripts/3762/xkcd%20Title%20and%20Explain.meta.js
// ==/UserScript==

var uls = document.getElementById('middleContainer').getElementsByTagName("ul");
var id = document.getElementById('middleContainer').getElementsByTagName("ul")[0].getElementsByTagName("li")[1].getElementsByTagName("a")[0].href;
id = parseInt(id.split("xkcd.com")[1].split("/")[1]) + 1;
uls[0].appendChild(exLink(id));
uls[1].appendChild(exLink(id));
var dDiv = document.createElement('div');
dDiv.setAttribute('align', 'center');
dDiv.style.fontSize='11px';
dDiv.style.fontVariant='normal';
dDiv.style.margin = "10px 0 0 0";
dDiv.style.padding = "3px 0 3px 0";
dDiv.style.backgroundColor = "#EEEEEE";
var tSpan = document.createElement("span");
tSpan.appendChild(document.createTextNode("Title: "));
tSpan.style.color = "#999999";
dDiv.appendChild(tSpan);
dDiv.appendChild(document.createTextNode(document.getElementById('comic').getElementsByTagName('img')[0].title));
document.getElementById('comic').appendChild(dDiv);

function exLink(id) {
	var li = document.createElement("li");
	var link = document.createElement('a');
	link.setAttribute('href', 'http://www.explainxkcd.com/wiki/index.php/' + id);
	link.appendChild(document.createTextNode("Explanation"));
	link.setAttribute('title', 'Explanation on explainxkcd.com');
	li.appendChild(link);
	return li;
}