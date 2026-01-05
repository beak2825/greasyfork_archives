// ==UserScript==
// @name        twitch spam filter
// @description this script reduces twitch's chat spam
// @namespace   twitch
// @include     /^https?://www\.twitch\.tv/[a-zA-Z0-9_]+$/
// @version     0.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/16609/twitch%20spam%20filter.user.js
// @updateURL https://update.greasyfork.org/scripts/16609/twitch%20spam%20filter.meta.js
// ==/UserScript==

/* known issues :
** - the last chat message is sometimes hidden, you need to scroll a bit,
**   or wait for the next message to see it.
** - if you naviguate to another stream through the website,
**   the spam count will not show. You need to refresh the page to 
**   reset it.
*/

/* todo :
** - filter 'weird' text, which is most likely copypasta
*/

window.onload = function() {
    /* helper functions */
    var uniq = function(str) {
	var seen = {};
	return str.filter(function(item) {
            return seen.hasOwnProperty(item) ? false : (seen[item] = true);
	});
    };
    /* objects */
    /* Bucket */
    var Bucket = function(size) {
	this.maxSize = size;
	this.currentSize = 0;
	this.array = [];
    };
    Bucket.prototype.add = function(elem) {
	if (this.currentSize < this.maxSize) {
	    this.array.push(elem);
	    this.currentSize++;
	    return ;
	}
	this.array.shift();
	this.array.push(elem);
    };
    Bucket.prototype.contains = function(elem) {
	return this.array.indexOf(elem) != -1;
    };
    /* * Message */
    var Message = function(object) {
	this.object = object;
	this.parse(object);
    };
    Message.prototype.parse = function(object) {
	this.from = $(".from", object).text();
	this.content = $(".message", object).text().trim();
	this.emoticons = this.parseEmoticons($(".emoticon", object));
	this.badges = this.parseBadges($(".badge", object));
    };
    Message.prototype.parseEmoticons = function(object) {
	var parsed = [];
	object.each(function() {
	    parsed.push($(this).attr("alt"));
	});
	return parsed;
    };
    Message.prototype.parseBadges = function(object) {
	var parsed = [];
	object.each(function() {
	    parsed.push($(this).attr("class").split(" ").slice(3)[0]);
	});
	return parsed;
    };
    Message.prototype.show = function() {
	$(this.object).addClass("filtered");
	return $(this.object).show();
    };
    Message.prototype.remove = function() {
	return $(this.object).remove();
    };
    /* * MessageHandler */
    var MessageHandler = function() {
	this.filtered = 0;
	this.filteredBox = null;
	this.filterBoxActive = false
	this.whiteHandlers = []; // the message is shown if one hadnler returns true
	this.blackHandlers = []; // the message is filtered if one handler returns false
    };
    MessageHandler.prototype.init = function() {

    };
    MessageHandler.prototype.handleMessage = function(message) {
	for (var i = 0, max = this.whiteHandlers.length; i < max; i++) {
	    if (this.whiteHandlers[i](message) === true) {
		return true;
	    }
	}
	for (var i = 0, max = this.blackHandlers.length; i < max; i++) {
	    if (this.blackHandlers[i](message) === false) {
		return false;
	    }
	}
	return true;
    };
    MessageHandler.prototype.registerHandler = function(type, handler) {
	if (! this.hasOwnProperty(type)) {
	    return false;
	}
	this[type].push(handler);
	return true;
    };
    MessageHandler.prototype.createFilterBox = function() {
	this.filteredBox = $("<p class='filterbox' title='spam count' style='position:relative;top:-2px;left:8px;color: rgb(166, 142, 210)'></p>");
	if ($(".chat-buttons-container").append(this.filteredBox)) {
	    $(this.filteredBox).text(this.filtered);
	    this.filterBoxActive = true;
	}
    };
    MessageHandler.prototype.incFilterCount = function() {
	if (! this.filterBoxActive) {
	    this.createFilterBox();
	}
	this.filtered++;
	$(this.filteredBox).text(this.filtered);
    };
    /* whiteHandlers */
    var whitelist = [
	$(".username").text()
    ];
    var whitelistHandler = function(message) {
	for (var i = 0, max = whitelist.length; i < max; i++) {
	    if (message.from == whitelist[i]) {
		return true;
	    }
	}
	if (message.from == "") { // admin messages leave username blank
	    return true;
	}
	return false;
    };
    /* blackHandlers */
    var emoteHandler = function(message) {
	/* if the message is empty, it only contains emotes */
	if (! message.content.length) {
	    return false;
	}
	/* that's too much */
	if (message.emoticons.length >= 5) {
	    return false;
	}
	return true;
    };
    var numericHandler = function(message) {
	/* Kappa 123 */
	return isNaN(message.content);
    };
    var oneWordHandler = function(message) {
	/* who cares of false positives */
	return message.content.indexOf(" ") != -1;
    };
    var capsLockPleaseHandler = function(message) {
	var caps = 0;
	var alphaNum = 0;
	for (var i = 0, max = message.content.length; i < max; i++) {
	    if (message.content[i] >= 'A' && message.content[i] <= 'Z') {
		caps++;
		alphaNum++;
	    }
	    else if (message.content[i] != " ") {
		alphaNum++;
	    }
	}
	if (alphaNum / caps <= 2.0) {
	    return false;
	}
	return true;
    };
    var sameSameHandler = function(message) {
	var msg = message.content.split(" ");
	var uniqMsg = uniq(msg);
	if (msg.length / uniqMsg.length >= 1.7) {
	    return false;
	}
	return true;
    };
    var latestMessages = new Bucket(30);
    /* r9kHandler should be executed last, as storing a filtered
    ** message is useless */
    var r9kHandler = function(message) {
	var ret = true;
	if (latestMessages.contains(message.content)) {
	    ret = false;
	}
	latestMessages.add(message.content);
	return ret;
    };
    /* code */
    var hideMessages = function() {
	$("head").append("<style type='text/css'>.chat-line { display: none; }</style>");
    };
    var messageHandler = new MessageHandler();
    var whiteHandlers = [
	whitelistHandler
    ];
    var blackHandlers = [
	emoteHandler,
	numericHandler,
	oneWordHandler,
	capsLockPleaseHandler,
	sameSameHandler,
	r9kHandler
    ];
    messageHandler.init();
    for (var i = 0, max = whiteHandlers.length; i < max; i++) {
	messageHandler.registerHandler("whiteHandlers", whiteHandlers[i]);
    }
    for (var i = 0, max = blackHandlers.length; i < max; i++) {
	messageHandler.registerHandler("blackHandlers", blackHandlers[i]);
    }
    hideMessages();
    setInterval(function() {
	var messages = $(".chat-line").not(".filtered");
	messages.each(function() {
	    var message = new Message(this);
	    if (messageHandler.handleMessage(message)) {
		message.show();
	    }
	    else {
		message.remove();
		messageHandler.incFilterCount();
	    }
	});
    }, 200);
};
