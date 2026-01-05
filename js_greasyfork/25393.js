// ==UserScript==
// @name Habitica Chat Window Toggle Spells
// @version 0.6
// @description Adds spell toggle to HabitRPG/Habitica
// @namespace HabiticaChatSpellToggle
// @match https://habitica.com/*
// @noframes
// @grant none

// @downloadURL https://update.greasyfork.org/scripts/25393/Habitica%20Chat%20Window%20Toggle%20Spells.user.js
// @updateURL https://update.greasyfork.org/scripts/25393/Habitica%20Chat%20Window%20Toggle%20Spells.meta.js
// ==/UserScript==

// overlay on/off chat button

var PARTY_URL = "#/options/groups/party";
var TOGGLE_LOCAL_STORAGE_ID = "HabiticaChatSpellToggleHideAll";

var QUICKPARTY_BUTTON_ID = "HabiticaChatSpellToggleQuickParty";
var QUICKPARTY_BUTTON_SELECTOR = "#" + QUICKPARTY_BUTTON_ID;
var QUICKPARTY_BUTTON_HTML = "<li class='toolbar-button'><a id='" + QUICKPARTY_BUTTON_ID + "' ui-sref='options.social.party' href='#/options/groups/party'><span>? Party</span></a></li>";

var TOGGLE_BUTTON_ID = "HabiticaChatSpellToggle";
var TOGGLE_BUTTON_SELECTOR = "#" + TOGGLE_BUTTON_ID;
var TOGGLE_BUTTON_HTML = "<button type='button' id='" + TOGGLE_BUTTON_ID + "' style='margin-right: 9px'>Loading...</button>";


var TOGGLE_BUTTON_TEXT = {
    false: "Show Spells",
    true: "Hide Spells"
};
var groupChatWatch = null;

$.fn.exists = function() {
    return this.length !== 0;
};

var watcher = function(test, init) {
    var attempts=100;
    var initWatcher = setInterval(function() {
        if(attempts-- <= 0) {
            console.log('Giving up');
            clearInterval(initWatcher);
        }
        else if (test()) {
            clearInterval(initWatcher);
            init();
        }
        else {
            console.log('Attempts left: ', attempts, '\tWatching for ', test.toString().replace(/(\r\n|\n|\r|\t| )+/g," "));        
        }
    }, 100);
};

var preformattedMessages = function() {
    return $('li').has('code');
};

var hideAll = function(newValue) {
    if (newValue !== undefined) {
        localStorage.setItem(TOGGLE_LOCAL_STORAGE_ID, newValue);
    }

    return localStorage.getItem(TOGGLE_LOCAL_STORAGE_ID) === "true";
};

var applyStyleAndUpdateButtonLabel = function() {
    watcher(function() {
        return $("#loading-bar").is(":visible") === false;
    },
            function() {
        console.log("applyStyleAndUpdateButtonLabel");

        var hide = hideAll();

        $(TOGGLE_BUTTON_SELECTOR).text(TOGGLE_BUTTON_TEXT[!hide]);

        if (hide) {
            preformattedMessages().hide();
        } else {
            preformattedMessages().show();
        }
    });
};

var groupScope = function() {
    var elem = $("div.party.ng-scope");

    if (!elem)
        return null;

    return elem.scope();
};

var chatChanged2 = function(b,c) {
    console.log("Chat Changed ");

    applyStyleAndUpdateButtonLabel();
};

var installOnPartyScreen = function() {
    // general
    watcher(function() {
        return $(".toolbar-nav").length > 0;
    }, function() {
        if ($(QUICKPARTY_BUTTON_SELECTOR).length === 0) {
            console.log("Installing QuickParty Button in Main Menu");

            $(".toolbar-nav").append(QUICKPARTY_BUTTON_HTML);
        }
    });

    // tab specific
    if (window.location.hash === PARTY_URL) {

        watcher(function() {
            return groupScope() && !groupScope().group.loadingParty;
        }, function() {

            if (!$(TOGGLE_BUTTON_SELECTOR).exists()) {
                console.log("Watching group.chat...");

                // dispose existing binding
                if(groupChatWatch) {
                    groupChatWatch();
                }

                groupChatWatch = groupScope().$watch("group.chat", chatChanged2, true);

                console.log("Installing Toggle Button on Party Screen...");

                // any time you trigger any of the buttons you should trigger applyStyleAndUpdateButtonLabel
                var chatButtons = $("div.chat-buttons").first();
                chatButtons.children().click(applyStyleAndUpdateButtonLabel);

                // insert new button
                chatButtons.prepend(TOGGLE_BUTTON_HTML);

                // hide/show all first time
                applyStyleAndUpdateButtonLabel();

                // don't toggle to avoid confusion from newer messages
                $(TOGGLE_BUTTON_SELECTOR).click(function() {

                    //var visible = preformattedMessages().is(":visible");
                    var hide = hideAll();
                    hideAll(!hide);

                    applyStyleAndUpdateButtonLabel();
                });
            }
        });
    }
};

watcher(function() {
    return angular;
}, function() {
    $(window).on('hashchange', installOnPartyScreen);

    installOnPartyScreen();
});
