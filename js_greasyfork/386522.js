// ==UserScript==
// @name         PostItLater
// @namespace    http://lyxi.ca
// @version      0.1
// @homepage     https://github.com/Lyxica/PostItLater
// @description  Schedule reddit comments and posts. Requires PostItLater local server.
// @author       Lyxica
// @match        *.reddit.com/*
// @grant unsafeWindow
// @grant GM_xmlhttpRequest
// @connect localhost
// @downloadURL https://update.greasyfork.org/scripts/386522/PostItLater.user.js
// @updateURL https://update.greasyfork.org/scripts/386522/PostItLater.meta.js
// ==/UserScript==

(function() {
    'use strict';
    /* Setup link pages */
    if (document.URL.split("?")[0].endsWith("submit")) {
        SetupForLink();
    } else {
		SetupForComments();
	}
	/*
	oldReply = reply
	reply = function(e) { console.log("hooked"); oldReply(e); }
	*/
})();


function SetupForComments() {
	unsafeWindow.commentLater = function(e) {
		console.log(1);
		var form = e.parentNode.parentNode.parentNode.parentNode;
		var content = form.querySelector("textarea").value;
		var date = new Date(form.querySelector("input[type=datetime-local]").value);
		var thing_id = form.querySelector("input[name=thing_id]").value
		if (content == "") { return; }
           GM_xmlhttpRequest({
               method: "POST",
               url: "http://localhost:4958/",
               data: JSON.stringify({
					"type": "comment",
					"epoch": Math.floor(date / 1000),
					"content": content,
					"thing": thing_id
            })
        });
	}

	/* Setup link reply form */
	var form = document.querySelector("form.usertext.cloneable");
	var buttons = form.querySelector(".usertext-buttons");
	buttons.innerHTML = '<button class="btn" name="later" value="form" onclick="commentLater(this)" type="button">later</button>' + buttons.innerHTML;
	buttons.insertAdjacentHTML("afterEnd", '<input type="datetime-local" id="posting-time">');
	var now=new Date();
    var real_now = new Date(now.getTime()-now.getTimezoneOffset()*60000).toISOString().substring(0,17) + "00"
    document.querySelector("#posting-time").value = real_now;
}
function SetupForLink() {
	document.querySelector("#newlink > div.spacer").innerHTML = '<button class="btn" name="later" value="form" onclick="submitLater(this)" type="button">later</button>' + document.querySelector("#newlink > div.spacer").innerHTML;
        document.querySelector("#newlink > div.spacer").insertAdjacentHTML("afterEnd", '<input type="datetime-local" id="posting-time">')
        var now=new Date();
        var real_now = new Date(now.getTime()-now.getTimezoneOffset()*60000).toISOString().substring(0,17) + "00"
        document.querySelector("#posting-time").value = real_now;
        unsafeWindow.traverseForFormNode = function(e) {
            var node = e;
            for (var i = 0; i < 10000; i++ ) {
                if (node.tagName == "FORM") return node;
                node = node.parentNode
            }
            return null;
        }
        unsafeWindow.submitLater = function(e) {
            var node = unsafeWindow.traverseForFormNode(e);
            var subreddit = "r/" + node.querySelector("#sr-autocomplete").value;
            var title = node.querySelector("textarea.title").value;
            var type = node.querySelector("li.selected > a").text;
			var date = new Date(node.querySelector("#posting-time").value);
            var content;
            if (type == "link") {
                content = node.querySelector("input#url").value
            } else if (type == "text") {
                content = node.querySelector("textarea[name=text]").value
                type = "self"; // Only element I found to distinguish between link types refers to "self" posts as "text"
            } else {
                throw new Error("Unknown link type");
            }
            if (subreddit == "" || title == "" || content == "") { return; }
            GM_xmlhttpRequest({
                method: "POST",
                url: "http://localhost:4958/",
                data: JSON.stringify({
					"type": type,
					"epoch": Math.floor(date / 1000),
					"content": content,
                    "thing": subreddit,
                    "title": title,
                })
            });
        }
}