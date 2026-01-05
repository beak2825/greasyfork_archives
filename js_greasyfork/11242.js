// ==UserScript==
// @name         Chatango Message Blocker
// @namespace    www.v3rmillion.net
// @version      0.1
// @description  Removes messages from blocked users
// @author       Dylan Evans
// @include      *//st.chatango.com/*
// @match        *.chatango.com/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.js
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/11242/Chatango%20Message%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/11242/Chatango%20Message%20Blocker.meta.js
// ==/UserScript==

function output(msg) {
	console.log("[Chatango Blocker] "+msg);
}

function wipe() {
	var blockedUsers = JSON.parse(GM_getValue("blocked", JSON.stringify([])));
	$($("#OM .msg").get().reverse()).each(function() {
	    var name = $(this).find(".msg-fg > div").attr("class").substring(23);
	    if (blockedUsers.indexOf(name) > -1) {
	        $(this).remove();
	    }
	});
}

$(document).ready(function() {
	setTimeout(wipe, 5000);
	setInterval(function() {
		var blockedUsers = JSON.parse(GM_getValue("blocked", JSON.stringify([])));
        var msg = $("#OM .msg:last");
        if($(msg).find(".msg-fg > div").attr("class") != undefined) {
            var name = $("#OM .msg:last").find(".msg-fg > div").attr("class").substring(23);
            if (blockedUsers.indexOf(name) > -1) {
                $(msg).remove();
            }
        }
	}, 100);
	$('<input type="text" id="blocker" placeholder="Enter a username to (un)block..." />').prependTo("#FTR_RIGHT");
	$("#blocker").keypress(function(key) {
		if (key.which == 13) {
			var blocked = JSON.parse(GM_getValue("blocked", JSON.stringify([])));
			var name = $(this).val();
			if (blocked.indexOf(name) == -1) {
				blocked.push(name);
				GM_setValue("blocked", JSON.stringify(blocked));
				wipe();
				output("Blocked User: "+name);
			}
			else {
				blocked = $.grep(blocked, function(val) {
					return val !== name;
				});
				GM_setValue("blocked", JSON.stringify(blocked));
				output("Unblocked User: "+name);
			}
		}
	});
});