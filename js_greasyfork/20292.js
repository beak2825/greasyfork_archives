// ==UserScript==
// @name			Gota.io auto invite
// @name:ru			Gota.io авто инвайтер
// @namespace		Gota.io script by Madzal
// @author			Madzal
// @version			2
// @homepage		http://gota.io/web
// @supportURL		http://www.YouTube.com/user/madzal777
// @description		Script for auto add players to your party
// @description:ru	Скрипт для авто добавления игроков в твою команду
// @icon			data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpFMTkxRTIzRTE1RTJFMTExOEYyMzg4MzBCNURCNTI0RSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDozRTk5REZGNDlDQTkxMUUyQUYyMzhGQUUyMTZCMzNDOCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDozRTk5REZGMzlDQTkxMUUyQUYyMzhGQUUyMTZCMzNDOCIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M2IChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjIzQUUwMjQxOUY5Q0UyMTE4Q0Q4OUFCOEVGNThEMTBEIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkUxOTFFMjNFMTVFMkUxMTE4RjIzODgzMEI1REI1MjRFIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+httQ1gAAAnFJREFUeNp8k81LFGEcx7/zzOxrO0Yl6xIoKqViqZ085EHLLkGd6mZQBBad7e0/CG/dSiiEThFdoshIQqGiS0Fd1jTTtKjc1dZmZ99mZmf6PrOz4GV74MOP5/c2v5dnFLw/hh1nmNwl7eQJOU9UMkXOkm/kCpmvB6gYb6Vw69yf6BwZHGs/qsUd53C68PsHdYNjyb4b410ntN7YvuZ3ua8McB/UYwQ8B+Qk+USGhB7GKjbghiH1XWTAjQqsUSf0kNQNBb4yBhpcW1YyffnAaIuX0LCCrJ98Sy1T2kna9D+iCKe6CVdRcKn/eFQxnf6p5VfTtKWYwJIJIjm1BIMZt5wyQizMFKzMtVK0JbaFjXy1ABseCooFXWjSFpeBGjw/wbVH6Zd30NSsIURjJIY9Udo9q582sWSZyBkmUGFVdhUwNlkmrstABa876gPdTwZIGzlIutF56BSzACvpp7wvBXwnH8mvWgVuUcoLZBJNbUmEOKgIqwhzissfOCC3gPa+07BYaYVXm60Z606wznsK5nSZwBjpOaNnIjbSXgH+ZooGsLpY4QfeoOPIKBK7Wa+GXiWOFiuCuYXHso0kZ5CXCYrzlQ0dQm6kVGvIovRszi3/ExaTVeHvPY0Y0mW5zrwbtOC7X8TyzC3KLvR0R6Hw8VnyfZRs2jPgELlH3ivA5y/lYBY3ZaAIHtRzMkDewuCXXYWFyFaqKnULKJn+LGFU4PvUfGdkrIpzO38FrMP4O4xsNoFi/iFCsVYIdRLm9l5kMz20rdFnIvgnUFvjCzQ+Ycj1LcLC1YY+nuc1BLMMnIVJUo18BP53PDwju8jtRi7/BBgAs5E3ozX0BWYAAAAASUVORK5CYII=
// @match			http://gota.io/web/
// @exclude			file://*
// @run-at			document-end
// @encoding		utf-8
// @grant			none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/20292/Gotaio%20auto%20invite.user.js
// @updateURL https://update.greasyfork.org/scripts/20292/Gotaio%20auto%20invite.meta.js
// ==/UserScript==

function checkmessage(event) {
	var elem = this.lastChild;
	var canvas = elem.getElementsByTagName("canvas")[0];
	if (canvas !== undefined) {
		var playerid = canvas.getAttribute("data-player-id");
		var limit = document.getElementById("party-canvas").height;
		if (limit != 205) {
			console.log('Send invite to player - ' + playerid);
			player.sendPacket(new Packet.sendPartyAction(0, playerid));
		}
	}
}

var input = document.createElement("input");
input.className = "gota-btn";
input.type = "button";
input.value = "start auto invite";
input.id = "start_invite";
input.addEventListener("click", function start() {
	document.getElementById("chat-body").addEventListener("DOMNodeInserted",
		checkmessage, true);
}, false);

var input2 = document.createElement("input");
input2.className = "gota-btn";
input2.type = "button";
input2.value = "stop script";
input2.id = "stop_invite";
input2.addEventListener("click", function stop() {
	document.getElementById("chat-body").removeEventListener(
		"DOMNodeInserted", checkmessage, true);
}, false);

var mydiv = document.createElement("div");
mydiv.className = "main-version";
mydiv.style.margin = "15px";
mydiv.appendChild(input);
mydiv.appendChild(input2);
document.getElementsByClassName("main-top")[0].appendChild(mydiv);