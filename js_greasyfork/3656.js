// ==UserScript==
// @name           NeoGAF: POPGAF IX
// @description    Allows members to jump to the latest unread post in Neogaf thread "PopGAF: OT9"
// @version        9.0
// @namespace      http://www.neogaf.com/forum/
// @match        http://www.neogaf.com/forum/*
// @downloadURL https://update.greasyfork.org/scripts/3656/NeoGAF%3A%20POPGAF%20IX.user.js
// @updateURL https://update.greasyfork.org/scripts/3656/NeoGAF%3A%20POPGAF%20IX.meta.js
// ==/UserScript==

// CHROME AND FIREFOX COMPATIBLE

function addJQuery(callback) {
  var script = document.createElement("script");
  script.setAttribute("src", "http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js");
  script.addEventListener('load', function() {
    var script = document.createElement("script");
    script.textContent = "(" + callback.toString() + ")();";
    document.body.appendChild(script);
  }, false);
  document.body.appendChild(script);
}

function main() {
	$(".forum-tabs").append("<li class=''><a href='http://www.neogaf.com/forum/showthread.php?t=789371&goto=newpost'>POPGAF</a></li>");
	$(".forum-tabs").append("<li class=' child'><a href='http://www.plug.dj/popgaf/'>Plug.DJ Room</a></li>");
}

addJQuery(main);