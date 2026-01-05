// ==UserScript==
// @name        Twitch OfficialParagonBot filter
// @description hides all chat except that of the OfficialParagonBot
// @author      Trylobot
// @namespace   twitch
// @include     /^https?://www\.twitch\.tv/[a-zA-Z0-9_]+$/
// @version     1.0.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/23003/Twitch%20OfficialParagonBot%20filter.user.js
// @updateURL https://update.greasyfork.org/scripts/23003/Twitch%20OfficialParagonBot%20filter.meta.js
// ==/UserScript==

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
            return;
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
        this.kept = 0;
        this.filteredBox = null;
        this.filterBoxActive = false;
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
        for (i = 0, max = this.blackHandlers.length; i < max; i++) {
            if (this.blackHandlers[i](message) === false) {
                return false;
            }
        }
        return true;
    };
    MessageHandler.prototype.registerHandler = function(type, handler) {
        if (!this.hasOwnProperty(type)) {
            return false;
        }
        this[type].push(handler);
        return true;
    };
    function renderFilterBox(f,k) {
        return (f ? (''+f+' filtered <br>') : '')+
               (k ? ('<b>'+k+' kept</b>') : '');
    }
    MessageHandler.prototype.createFilterBox = function() {
        this.filteredBox = $("<p class='filterbox' title='spam count'></p>");
        if ($("body").append(this.filteredBox)) {
            this.filteredBox[0].innerHTML = renderFilterBox(this.filtered, this.kept);
            this.filterBoxActive = true;
        }
    };
    MessageHandler.prototype.incFilterCount = function() {
        if (!this.filterBoxActive)
            this.createFilterBox();
        this.filtered++;
        this.filteredBox[0].innerHTML = renderFilterBox(this.filtered, this.kept);
    };
    MessageHandler.prototype.incKeptCount = function() {
        if (!this.filterBoxActive)
            this.createFilterBox();
        this.kept++;
        this.filteredBox[0].innerHTML = renderFilterBox(this.filtered, this.kept);
    };
    /* whiteHandlers */
    var whitelist = [
        function() { return $(".js-username").text(); }
    ];
    var whitelistHandler = function(message) {
        for (var i = 0, max = whitelist.length; i < max; i++) {
            if (message.from == (typeof whitelist[i] === "function" ? whitelist[i]() : whitelist[i])) {
                return true;
            }
        }
        if (message.from === "") { // admin messages leave username blank
            return true;
        }
        return false;
    };
    /* blackHandlers */
    var isOfficialParagonBotHandler = function(message) {
        return (message.from == "OfficialParagonBot");
    };
    /* code */
    var hideMessages = function() {
        $("head").append("<style>.chat-line { display:none !important; }</style>");
        $("head").append("<style>.chat-line.filtered { display:list-item !important; }</style>");
        $("head").append("<style>.filterbox { position:absolute; top:0px; right:10px; line-height:1em; z-index:100; mix-blend-mode: difference; color: rgb(0,255,255); font-weight: lighter;} </style>");
    };
    var messageHandler = new MessageHandler();
    var whiteHandlers = [
        whitelistHandler
    ];
    var blackHandlers = [
        isOfficialParagonBotHandler
    ];
    messageHandler.init();
    for (var i = 0, max = whiteHandlers.length; i < max; i++) {
        messageHandler.registerHandler("whiteHandlers", whiteHandlers[i]);
    }
    for (i = 0, max = blackHandlers.length; i < max; i++) {
        messageHandler.registerHandler("blackHandlers", blackHandlers[i]);
    }
    hideMessages();
    setInterval(function() {
        var messages = $(".chat-line").not(".filtered");
        messages.each(function() {
            var message = new Message(this);
            if (messageHandler.handleMessage(message)) {
                message.show();
                messageHandler.incKeptCount();
            } else {
                message.remove();
                messageHandler.incFilterCount();
            }
        });
    }, 200);
};