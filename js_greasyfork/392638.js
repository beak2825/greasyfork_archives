// ==UserScript==
// @name         Dueling Nexus Theme
// @namespace    Yasuo
// @version      0.9
// @description  Let's change up duelingnexus with themes!
// @author       Yasuo
// @match        https://duelingnexus.com/*
// @grant        GM.addStyle

// @downloadURL https://update.greasyfork.org/scripts/392638/Dueling%20Nexus%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/392638/Dueling%20Nexus%20Theme.meta.js
// ==/UserScript==

GM.addStyle("#game-field { width: auto; height: auto; margin: 0px auto; transform: scale3d(1.2, 1, 1); }")
GM.addStyle(".game-life-bar-part,.game-life-bar { box-shadow: 0px 0px 3px 1px #ee5253; border: 1px solid #ee5253; }")
GM.addStyle(".game-life-bar { box-shadow: 0px 0px 3px 1px #1e272e; border: 1px solid #1e272e; }")
GM.addStyle(".game-field-stats-text { font: Serif; font-size: 16px; }")
GM.addStyle("html{background: url(https://steamcdn-a.akamaihd.net/steamcommunity/public/images/items/601510/5844a29a9ccb0bca826058066acbb10126f1c402.jpg); height: 100%;background-position: center;background-size: cover;}");

GM.addStyle("#news-area { height:130px;width:380px;border:1px solid #ccc;font:18px/26px Georgia, Garamond, Serif;overflow:auto;}")

GM.addStyle("body {color: #e4d4d4};")
GM.addStyle("#game-selection-window,#game-position-window,#game-tooltip, #game-end-window, #game-waiting-window, #game-message-window, #options-window { box-shadow: 2px 2px 15px 13px #000000; }")
GM.addStyle("button:hover {text-shadow: -3px 4px 3px #000000;background-color: #2E3E75; color: #e4d4d4;}")
GM.addStyle("article {border: 1px solid #7a7a7a;background-color: rgba(7, 7, 19, 0.72);padding: 10px;max-width: 780px;}")
GM.addStyle("#navbar button {text-shadow: -3px 4px 3px #000000;min-height: 48px;border: 1px solid #7a7a7a;background-color: rgba(7, 7, 19, 0.72);color: #34c7ef;border-radius: 8px;background: url(https://t3.ftcdn.net/jpg/01/07/21/24/240_F_107212440_d1wGcI0JDI2ZjkfRfKDmFIXy5MIBPijt.jpg);}")
GM.addStyle("#navbar button:hover {text-shadow: -3px 4px 3px #000000;background-color: #2E3E75; color: #e4d4d4;background: url(https://regalideas.com/wp-content/uploads/2016/08/tiny-tile.jpg);}")


GM.addStyle(".engine-button-primary {text-shadow: -3px 4px 3px #000000;background-color: rgba(32, 189, 153, 0.8);color: #e4d4d4;font-size: 17px;}")
GM.addStyle(".engine-button:hover {text-shadow: -3px 4px 3px #000000;background-color: #2E3E75; color: #e4d4d4;}")
GM.addStyle("body { text-shadow: -3px 4px 3px #000000;}")

GM.addStyle("article button {text-shadow: -3px 4px 3px #000000;color: #FFFFFF;background-color: rgba(22, 34, 76, 0.9); color: #e4d4d4; border: 1px solid ##5c4da2;border-radius: 8px;background: url(https://t3.ftcdn.net/jpg/01/07/21/24/240_F_107212440_d1wGcI0JDI2ZjkfRfKDmFIXy5MIBPijt.jpg);}")
GM.addStyle("article button:hover {text-shadow: -3px 4px 3px #000000;background-color: rgba(22, 34, 76, 0.9); color: #e4d4d4; border: 1px solid ##5c4da2;border-radius: 8px;background: url(https://regalideas.com/wp-content/uploads/2016/08/tiny-tile.jpg);}")



GM.addStyle("#socket-connection {background-color: #15214e33; color: #e4d4d4;border: 1px solid #23f5e7;}")
GM.addStyle(".engine-dark-box-border {background: url(https://i.pinimg.com/originals/f0/d6/83/f0d6831ba5f667d9fa23d6042c2f6a16.jpg);background-size: 100% 100%;opacity:0.8;background-color: rgba(17, 29, 72, 0.63);border: 1px solid #34c7ef;border-radius: 8px;}")

GM.addStyle("#game-deck-selection{max-height:200px;max-width:400px; overflow:scroll;background: url(https://i.pinimg.com/originals/f0/d6/83/f0d6831ba5f667d9fa23d6042c2f6a16.jpg);}")

GM.addStyle("#decks-area[data-v-6f705b54] {SIZE: A4;border: 1px solid #7a7a7a;background-color: rgba(7, 7, 19, 0.72);padding: 10px;max-width: 780px;overflow: scroll;max-height: 500px;background: url(https://i.redd.it/ugw3kgxukeu11.jpg);font-family: Segoe UI, sans-serif ! important;}")

//CustomNexusGU
const NexusGUI = {
    commonCSS: null,
    addCSS: function (css, makeNew = false) {
        if(makeNew) {
            $("head").append($("<style>").text(css));
        }
        else {
            if(!NexusGUI.commonCSS) {
                NexusGUI.commonCSS = $("<style id='nexus-gui-common-css'>");
                $("head").append(NexusGUI.commonCSS);
            }
            NexusGUI.commonCSS.append(css);
        }
    },
    _popupElements: {
        background: null,
        title: null,
        content: null,
    },
    _popupElementsLoaded: false,
    loadPopupElements: function (overwrite = true) {
        // reference variable
        const elements = NexusGUI._popupElements;

        if(NexusGUI._popupElementsLoaded && !overwrite) {
            return true;
        }
        for(let val of Object.values(elements)) {
            if(val) {
                val.remove();
            }
        }

        elements.popupWrapper = $("<div id='nexus-gui-popup-wrapper'><div id='nexus-gui-popup-background'></div><div id='nexus-gui-popup'><h2 id='nexus-gui-popup-title'></h2><div id='nexus-gui-popup-content'>WOOOOO</div></div></div>");
        elements.popup = elements.popupWrapper.find("#nexus-gui-popup");
        elements.background = elements.popupWrapper.find("#nexus-gui-popup-background");
        elements.title = elements.popupWrapper.find("#nexus-gui-popup-title");
        elements.content = elements.popupWrapper.find("#nexus-gui-popup-content");

        elements.background.click(function () {
            elements.popupWrapper.toggle(false);
        });
        elements.popupWrapper.toggle(false);

        $("body").append(elements.popupWrapper);

        NexusGUI._popupElementsLoaded = true;
    },
    _popupStyles: ["wide", "minimal"],
    popup: function (title, content, options = {}) {
        // reference variable
        const elements = NexusGUI._popupElements;

        NexusGUI.loadPopupElements();
        elements.popupWrapper.toggle(true);
        elements.title.text(title);
        elements.content.empty();
        elements.content.append(content);

        elements.popup.removeClass(...NexusGUI._popupStyles);

        if(NexusGUI._popupStyles.indexOf(options.style) !== -1) {
            elements.popup.addClass(options.style);
        }
        else if(options.style) {
            console.warn("No such style `" + options.style + "`, ignoring");
        }

        return new Promise((resolve, reject) => {
            let cleanUp = () => {
                resolve();
                elements.background.unbind("click", cleanUp);
            };

            elements.background.bind("click", cleanUp);
        });
    },
    closePopup: function () {
        const elements = NexusGUI._popupElements;
        elements.background.trigger("click");
    },
    button: (text) => $("<button>").addClass("nexus-gui-button").text(text),
    prompt: function (message, defaultValue = null) {
        let content = $("<div>");
        let input = $("<input type=text>");
        if(defaultValue !== null) {
            input.val(defaultValue);
        }
        content.append(input);
        let okButton = NexusGUI.button("OK");
        let cancelButton = NexusGUI.button("Cancel");
        content.append($("<div>").append(okButton, cancelButton));
        return new Promise((resolve, reject) => {
            okButton.click(() => {
                resolve(input.val());
                NexusGUI.closePopup();
            });
            input.keyup((event) => {
                if(event.which === 13) {
                    resolve(input.val());
                    NexusGUI.closePopup();
                }
            });
            cancelButton.click(() => {
                resolve(null);
                NexusGUI.closePopup();
            });
            NexusGUI.popup(message, content, { style: "minimal" }).then(() => {
                resolve(null);
            });
            input.focus();
        });
    },
    q: function (strings, ...subs) {
        let total = strings.raw.map((string, i) =>
            string + (i in subs ? subs[i] : "")
        ).join("");
        // universalize tabs
        total = total.replace(/\t/g, "    ");
        // remove leading indentation
        let lines = total.split(/\r?\n/);
        let indentSizes = lines
            .filter(e => e.length !== 0)
            .map(e => e.match(/^\s*/)[0].length);
        let minSize = Math.min(...indentSizes);
        let reg = new RegExp("^\\s{" + minSize + "}");
        return lines
            .map(line => line.replace(reg, ""))
            .join("\n");
    },
    loadScript: function (url, cb = null) {
        let script = document.createElement("script");
        script.src = url;
        if (cb) {
            script.addEventListener("load", cb);
        }
        document.head.appendChild(script);
    },
    formatGithubURL: (name, release, path) => `https://github.com/${path}/raw/master/${release}/${name}/${name}.user.js`,
    loadUserScript: function (
        name,
        release = "final",
        path = "LimitlessSocks/DuelingNexusUserScripts"
    ) {
        let url = NexusGUI.formatGithubURL(name, release, path);
        NexusGUI.loadScript(url);
    }
};

let onLoad = function () {
    NexusGUI.addCSS(NexusGUI.q`
        /* mostly a copy of engine-button */
        .nexus-gui-button {
            background-color: rgba(0,0,0,0.8);
            color: #f0f0f0;
            font-family: "Helvetica Neue", Helvetica, Verdana, Geneva, sans-serif;
            font-size: 14px;
            border: 1px solid #f0f0f0;
            min-height: 32px;
            padding-left: 8px;
            padding-right: 8px;
            margin: 5px;
        }
        #nexus-gui-popup-background {
            z-index: 100000;
            width: 100%;
            height: 100%;
            position: fixed;
            top: 0;
            left: 0;
            background: rgb(0, 0, 0);
            background: rgba(0, 0, 0, 0.5);
        }
        #nexus-gui-popup {
            z-index: 100001;
            background: rgba(0, 0, 0, .9);
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            min-height: 300px;
            width: 480px;
            padding: 0.5em;
            text-align: center;
            border: 1px solid #7A7A7A;
        }
        #nexus-gui-popup.wide {
            width: 800px;
        }
        #nexus-gui-popup.minimal {
            width: auto;
            min-height: 0px;
            height: auto;
        }
        #nexus-gui-popup-title {
            margin: 0;
            margin-bottom: 0.2em;
            border-bottom: 1px #7A7A7A;
        }
    `);
    console.info("CustomNexusGUI API loaded!");
}
if(!window.jQuery) {
    // the same used by nexus
    const jQueryInstallationURL = "https://code.jquery.com/jquery-3.1.1.min.js";
    NexusGUI.loadScript(jQueryInstallationURL, onLoad);
}
else {
    onLoad();
}
window.NexusGUI = NexusGUI;

//ChatImprovements
let makeReadOnly = function (obj, prop) {
    let val = obj[prop];
    delete obj[prop];
    Object.defineProperty(obj, prop, {
        value: val,
        writable: false,
        enumerable: true,
        configurable: true,
    });
    return val;
}

let ChatImprovements = {
    log: [],
    storage: {
        _cache: null,
        get: null,
        set: null,
    },
};

const LOCAL_STORAGE_KEY = "ChatImprovementsCache";

let updateLocalStorage = function () {
    let json = JSON.stringify(ChatImprovements.storage._cache);
    localStorage.setItem("ChatImprovementsCache", json);
};

let checkCache = function () {
    if(ChatImprovements.storage._cache) {
        return;
    }

    let localCopy;
    try {
        localCopy = localStorage.getItem(LOCAL_STORAGE_KEY);
        localCopy = JSON.parse(localCopy)
    }
    catch(e) {
        console.error("Error parsing local copy:", localCopy);
    }

    ChatImprovements.storage._cache = localCopy || {};

    updateLocalStorage();
};

ChatImprovements.storage.set = function (item, value) {
    checkCache();

    ChatImprovements.storage._cache[item] = value;

    updateLocalStorage();

    return value;
};

ChatImprovements.storage.get = function (item) {
    checkCache();

    return ChatImprovements.storage._cache[item];
};

ChatImprovements.storage.clear = function (item) {
    checkCache();

    ChatImprovements.storage._cache = {};

    updateLocalStorage();
};

// standard getter/setter properties

let defaultProperties = {
    playSounds: true,
    temporaryChat: true,
    showOptions: false,

    showNormalEvents: true,
    showChainEvents: true,
};

for(let [prop, defaultValue] of Object.entries(defaultProperties)) {
    // define if unset (inital run)
    if(typeof ChatImprovements.storage.get(prop) === "undefined") {
        ChatImprovements.storage.set(prop, defaultValue);
    }

    // getter & setter
    Object.defineProperty(ChatImprovements, prop, {
        get: function () {
            return ChatImprovements.storage.get(prop);
        },
        set: function (value) {
            return ChatImprovements.storage.set(prop, value);
        },
    });
}

makeReadOnly(ChatImprovements, "log");
window.ChatImprovements = ChatImprovements;

let waitFrame = function () {
    return new Promise(resolve => {
        requestAnimationFrame(resolve); //faster than set time out
    });
};

const waitForElementJQuery = async function (selector, source = $("body")) {
    let query;
    while (source.find(selector).length === 0) {
        await waitFrame();
    }
    return query;
};

let onload = function () {
    // css
    $("head").append($(`<style>
    #ci-ext-misc {
        float: left;
        width: 25%;
        overflow-x: hidden;
        overflow-y: auto;
        box-sizing: border-box;
    }
    #card-column {
        float: none;
        width: auto;
    }

    #ci-ext-misc-sections > div {
        overflow-x: hidden;
        overflow-y: auto;
        box-sizing: border-box;
    }
    #ci-ext-misc-sections > div:hover {
        z-index: 10;
    }

    #ci-ext-log > p, #ci-ext-event-log > p {
        padding: 0;
        margin: 3px;
    }

    #ci-ext-event-log .interact-name {
        cursor: pointer;
    }

    #ci-ext-log, #ci-ext-event-log, #ci-ext-options {
        background: rgb(0, 0, 0);
        background: rgba(0, 0, 0, 0.7);
    }
    @keyframes fullScale {
        from {
            transform: scale(1);
        }
        to {
            transform: scale(2);
        }
    }
    .material-preview {
        margin: 3px;
    }

    #ci-ext-misc-buttons {
        display: flex;
        justify-content: space-between;
    }

    #ci-ext-misc-buttons > button {
        flex-grow: 1;
        flex-basis: 0;
    }
    </style>`));

    // TODO: move chaining options on bottom right
    // TODO: add hide options for sleeves/avatars

    // boilerplate
    const globalOptions = f;
    const playSound = Q;
    const sendEvent = K;
    const gameChatContent = $("#game-chat-content");
    const gameChatTextbox = $("#game-chat-textbox");
    const gameChatArea = $("#game-chat-area");
    const showCardInColumn = Cc;
    const SECONDS = 1000;

    const monsterTypeMap = {};
    for(let key in Wf) {
        let value = Wf[key];
        monsterTypeMap[value] = parseInt(key, 10);
    }
    window.monsterTypeMap = monsterTypeMap;
    const isTrapCard            = (card) => card.type & monsterTypeMap["Trap"];
    const isSpellCard           = (card) => card.type & monsterTypeMap["Spell"];
    const isMonster             = (card) => !isTrapCard(card) && !isSpellCard(card);
    const isToken               = (card) => card.type & monsterTypeMap["Token"];
    const isXyzMonster          = (card) => card.type & monsterTypeMap["Xyz"];
    const isPendulumMonster     = (card) => card.type & monsterTypeMap["Pendulum"];
    const isLinkMonster         = (card) => card.type & monsterTypeMap["Link"];
    const isFusionMonster       = (card) => card.type & monsterTypeMap["Fusion"];
    const isRitualMonster       = (card) => isMonster(card) && (card.type & monsterTypeMap["Ritual"]);
    const isSynchroMonster      = (card) => card.type & monsterTypeMap["Synchro"];
    const isNormalMonster       = (card) => card.type & monsterTypeMap["Normal"];

    gameChatContent.css("overflow-y", "auto")
                   // .css("height", "230px")
                   // .css("background-color", "transparent");
    // gameChatArea.css("background-color", "rgba(0, 0, 0)")
                // .css("background-color", "rgba(0, 0, 0, 0.7)");
    let chatLog = $("<div id=ci-ext-log>");
    let chatEventLog = $("<div id=ci-ext-event-log>");

    /**/
    Gb.GameSet = window.Td = function Td(a) {
        Q("set");
        // console.log("Td", a);
    };

    Gb.GameSummoning = window.Ud = function Ud(a) {
        xc(a.cardCode, function() {
            Q("summon");
            // console.log("Ud", a);
            kf(a.cardCode);
        });
        return true;
    }

    Gb.GameSpSummoning = window.Vd = function Vd(a) {
        xc(a.cardCode, function() {
            Q("summon-special");
            // console.log("Vd", a);
            kf(a.cardCode);
        });
        return true;
    }

    Gb.GameFlipSummoning = window.Wd = function Wd(a) {
        xc(a.cardCode, function() {
            Q("summon-flip");
            // console.log("Wd", a);
            kf(a.cardCode);
        });
        return true;
    }

    const CHAIN_SYMBOL = "\uD83D\uDD17";
    Gb.GameChaining = window.Xd = function Xd(a) {
        xc(a.cardCode, function() {
            Q("activate");
            let cardName = a.cardCode ? "#@" + a.cardCode : "A card";
            // console.log("!!!!", cardName);
            // notifyEvent(" of " + cardName + " was activated (from " + GameLocations[a.location]);
            let message = `Chain Link ${a.chainCount}: ${cardName}`
            if(a.chainCount > 1) {
                message = CHAIN_SYMBOL + " " + message;
            }
            notifyEvent(message, Events.CHAIN);
            kf(a.cardCode);
        });
        return true;
    }

    /*
        GameDamage: Yd,
        GameRecover: Zd,
        GamePayLpCost: $d,
        GameLpUpdate: ae,
        GameAttack: be,
        GameBattle: ce,
        GameReloadField: de,
        GameTagSwap: ee,
        GameFieldDisabled: fe,
        GameWaiting: ge,
        GameEquip: he,
        GameBecomeTarget: ie,
        GameWin: je,
        GameTossCoin: ke,
        GameTossDice: le,
        GameAddCounter: me,
        GameRemoveCounter: ne,
        GameConfirmCards: oe,
        GameConfirmDeckTop: pe,
        GameDeckTop: qe,
        GameRetry: re,
        GameSelectIdleCommand: se,
        GameSelectBattleCommand: te,
        GameSelectCard: ue,
        GameSelectUnselect: ve,
        GameSortCards: we,
        GameSelectTribute: xe,
        GameSelectYesNo: ye,
        GameSelectEffectYesNo: ze,
        GameSelectChain: Ae,
        GameSelectPosition: Be,
        GameSelectOption: Ce,
        GameSelectSum: De,
        GameSelectPlace: Ee,
        GameSelectCounter: Fe,
        GameAnnounceAttrib: Ge,
        GameAnnounceRace: He,
        GameAnnounceNumber: Ie,
        GameAnnounceCard: Je
    */

    let eventTypeList = [

    ];

    let timestamp = function () {
        let now = new Date();
        return [
            now.getHours(),
            now.getMinutes(),
            now.getSeconds()
        ].map(time => time.toString().padStart(2, "0")).join(":");
    }

    const scrollToBottom = function (el) {
        el = $(el);
        el.animate({
            scrollTop: el.prop("scrollHeight")
        }, 150);
    }

    const MESSAGE_PARSE_REGEX = /#@(\d+)|.+?/g;
    let colorOfCard = function (card) {
        if(isTrapCard(card)) {
            return "#BC5A84";
        }
        else if(isSpellCard(card)) {
            return "#1D9E74";
        }
        else {
            return "#B83D00";
        }
    }
    let displayMessage = function (content, color, ...kinds) {
        //showCardInColumn
        let matches;
        let message = $("<p>");
        while(matches = MESSAGE_PARSE_REGEX.exec(content)) {
            let id = parseInt(matches[1]);
            let card = X[id];
            if(id && card) {
                let interactive = $("<span>")
                    .css("color", "white")
                    .css("background-color", colorOfCard(card))
                    .data("id", id)
                    .addClass("interact-name");
                interactive.hover(function () {
                    showCardInColumn(id);
                });
                interactive.text('"' + card.name + '"');
                message.append(interactive);
            }
            else {
                message.append(matches[0]);
            }
        }
        for(let kind of kinds) {
            message.addClass(kind);
        }
        if(color) {
            message.css("color", color);
        }
        gameChatContent.append(message);
        let copy = message.clone(true);
        if(kinds.indexOf("notified-event") !== -1) {
            $(".interact-name", copy).unbind().click(function () {
                showCardInColumn($(this).data("id"));
                showCardColumn.click();
            });
            chatEventLog.append(copy);
        }
        else {
            chatLog.append(copy);
        }
        // scroll to message
        scrollToBottom(chatLog);
        scrollToBottom(gameChatContent);
        // handle UI
        if(ChatImprovements.temporaryChat) {
            if(gameChatContent.children().length > 10) {
                gameChatArea.find("p:first").remove();
            }
            setTimeout(function() {
                message.remove();
            }, 10 * SECONDS);
        }
        return message;
    }
    ChatImprovements.displayMessage = displayMessage;

    // overwrite send message
    window.td = displayMessage;

    let unifyMessage = function (message) {
        return timestamp() + " " + message;
    }

    let displayOpponentsMessage = function (a) {
        if(ChatImprovements.playSounds) {
            playSound("chat-message");
        }
        let playerId = a.playerId;
        let message = a.message;
        let color;

        if(0 <= playerId && 3 >= playerId) {
            let name = B[playerId].name;
            message = "[" + name + "]: " + message;
        }
        else {
            color = "yellow";
        }

        message = unifyMessage(message);
        displayMessage(message, color);
    }

    gameChatTextbox.unbind();
    gameChatTextbox.keyup(function(ev) {
        if(ev.keyCode == 13) {
            let message = gameChatTextbox.val();
            gameChatTextbox.val("");
            sendEvent({
                type: "SendChatMessage",
                message: message
            });
            message = unifyMessage("[" + Ib + "]: " + message);
            // TODO: assign each person a different color?
            if(4 > A) {
                displayMessage(message);
            }
            else {
                displayMessage(message, "yellow");
            }
        }
    });

    // create sections
    let miscContainer = $("<div id=ci-ext-misc>");
    let miscSections = $("<div id=ci-ext-misc-sections>");
    let optionsColumn = $("<div id=ci-ext-options>");
    let cardColumn = $("#card-column");
    let gameContainer = $("#game-container");
    gameContainer.prepend(miscContainer);

    class GameOption {
        constructor(tag, id, option, type, info = {}) {
            this.tag = tag;
            this.id = id;
            this.option = option;
            this.type = type;

            this.isBaseOption = !!info.isBaseOption;
            this.showValue = !!info.showValue;
            this.decoration = info.decoration || (() => "");

            this.resolveOnLoad = info.resolveOnLoad;
            this.resolve = info.resolve;
            if(this.resolve) {
                this.resolve = this.resolve.bind(this);
            }

            if(this.isRange) {
                this.min = info.min;
                this.max = info.max;
            }
        }

        get isRange() {
            return this.type === "range";
        }

        get isCheckbox() {
            return this.type === "checkbox";
        }

        toElement(formatTable = true) {
            let base = $("<input>");

            base.attr("id", id)
                .attr("type", this.type);

            if(this.isRange) {
                base.attr("min", this.min)
                    .attr("max", this.max);
            }

            let currentValue;
            if(this.isBaseOption) {
                currentValue = globalOptions.options[this.option];
            }
            else {
                currentValue = ChatImprovements[this.option];
            }

            if(this.isCheckbox) {
                base.prop("checked", currentValue);
            }
            else {
                base.val(currentValue);
            }

            base.data("option", this.option);

            let onValueChange = () => {
                let option = this.option;
                let value = this.isCheckbox ? base.prop("checked") : base.val();

                if(this.isBaseOption) {
                    globalOptions.options[option] = value;
                    globalOptions.save();
                    // NOTE: can break
                    jd && jd(option, value);
                }
                else {
                    ChatImprovements[option] = value;
                }

                if(updateValueTd) {
                    updateValueTd.text(this.decoration(value));
                }
                if(this.resolve) {
                    this.resolve(value);
                }
            };

            let updateValueTd;
            if(this.showValue) {
                updateValueTd = $("<td>");
                // DRY broken here a bit
                updateValueTd.text(this.decoration(currentValue))
                             .css("cursor", "pointer");

                updateValueTd.click(() => {
                    NexusGUI.prompt("Enter the new value for \"" + this.tag + "\":").then((newValue) => {
                        if(newValue !== null) {
                            base.val(newValue);
                            onValueChange();
                        }
                    });
                });
            }

            base.change(onValueChange);

            if(!formatTable) {
                return base;
            }

            let tr = $("<tr>");

            tr.append($("<td>").text(this.tag));
            tr.append($("<td>").append(base));

            if(this.showValue) {
                tr.append(updateValueTd);
            }

            return tr;
        }
    }
    /*
        var a = $(this).data("option"),
        b = $(this).val();
        $("#options-" + a + "-value").text(b + "%");
        f.options[a] = b;
        f.save();
        jd && jd(a, b)
    */
    // initialize options column
    let optionsColumnInfo = [
        [
            "Game Options",
            new GameOption(
                "Sounds volume",
                "ci-ext-option-sounds-volume",
                "sounds",
                "range",
                {
                    min: 0,
                    max: 100,
                    isBaseOption: true,
                    showValue: true,
                    decoration: (x) => `${x}%`,
                }
            ),
            new GameOption(
                "Music volume",
                "ci-ext-option-music-volume",
                "music",
                "range",
                {
                    min: 0,
                    max: 100,
                    isBaseOption: true,
                    showValue: true,
                    decoration: (x) => `${x}%`,
                }
            ),
            new GameOption(
                "Animations speed",
                "ci-ext-option-animation-speed",
                "speed",
                "range",
                {
                    min: 0,
                    max: 500,
                    isBaseOption: true,
                    showValue: true,
                    decoration: (x) => `${x}%`,
                }
            ),
        ],
        [
            new GameOption(
                "Place monsters automatically",
                "ci-ext-option-auto-place-monsters",
                "auto-place-monsters",
                "checkbox",
                {
                    isBaseOption: true,
                }
            ),
            new GameOption(
                "Place spells automatically",
                "ci-ext-option-auto-place-spells",
                "auto-place-spells",
                "checkbox",
                {
                    isBaseOption: true,
                }
            ),
            new GameOption(
                "Temporary chat",
                "ci-ext-option-temporary-chat",
                "temporaryChat",
                "checkbox",
                {
                    resolve: function () {
                        // TODO: hide existing chat
                    }
                }
            ),
            new GameOption(
                "Play chat sounds",
                "ci-ext-option-chat-sounds",
                "playSounds",
                "checkbox",
            ),
            new GameOption(
                "Show options",
                "ci-ext-option-show-options",
                "showOptions",
                "checkbox",
                {
                    resolve: function (value) {
                        console.log("Resolving showOptions value", value);
                        $("#options-show-button").toggle(value);
                        return this;
                    },
                    resolveOnLoad: true,
                }
            ),
        ],
        [
            "Event Filters",
            new GameOption(
                "Show normal events",
                "ci-ext-option-hide-all-events",
                "showNormalEvents",
                "checkbox",
            ),
            new GameOption(
                "Show chaining events",
                "ci-ext-option-hide-all-events",
                "showChainEvents",
                "checkbox",
            ),
        ]
    ];

    for(let stratum of optionsColumnInfo) {
        let table = $("<table>");
        while(stratum.length && typeof stratum[0] === "string") {
            let title = stratum.shift();
            optionsColumn.append($("<h2>").text(title));
        }
        for(let option of stratum) {
            let tr = option.toElement(true);
            if(option.resolveOnLoad) {
                console.log(tr);
                option.resolve();
            }
            table.append(tr);
        }
        optionsColumn.append(table);
    }

    /*.click(function() {
                var a = $(this).data("option"),
                b = $(this).val();
                $("#options-" + a + "-value").text(b + "%");
                f.options[a] = b;
                f.save();
                if(jd) {
                    jd(a, b);
                }
            })*/

    let miscSectionButtons = $("<div id=ci-ext-misc-buttons>");

    // moved earlier for hideMiscBut
    let minimizeToggle = $("<button class=engine-button title=minimize>&minus;</button>")
        .data("toggled", false)
        .click(function () {
            let toggled = $(this).data("toggled");
            gameChatContent.toggle(toggled);
            gameChatTextbox.toggle(toggled);
            toggled = !toggled;
            $(this).data("toggled", toggled);
            scrollToBottom(gameChatContent);
        });

    const hideMiscBut = function (but) {
        return function (ev) {
            for(let child of miscSections.children()) {
                let isVisible = child.id === but;
                $(child).toggle(isVisible);
                if(isVisible) {
                    scrollToBottom(child);
                }
            }
            gameChatContent.toggle(but !== "ci-ext-log" && but !== "ci-ext-event-log" && !minimizeToggle.data("toggled"));
        };
    };

    // button toggles for sections
    let showCardColumn = $("<button id=ci-ext-show-card-column class=engine-button>Card Info</button>");
    let showChatLog = $("<button id=ci-ext-show-chat-log class=engine-button>Chat Log</button>");
    let showEventLog = $("<button id=ci-ext-show-event-log class=engine-button>Event Log</button>");
    let showOptions = $("<button id=ci-ext-show-options class=engine-button>Options</button>");

    showCardColumn.click(hideMiscBut("card-column"));
    showChatLog.click(hideMiscBut("ci-ext-log"));
    showEventLog.click(hideMiscBut("ci-ext-event-log"));
    showOptions.click(hideMiscBut("ci-ext-options"));

    miscSectionButtons.append(showCardColumn, showChatLog, showEventLog, showOptions);
    miscContainer.append(miscSectionButtons);

    cardColumn.detach();
    miscSections.append(cardColumn);
    miscSections.append(chatLog);
    miscSections.append(chatEventLog);
    miscSections.append(optionsColumn);

    showCardColumn.click();

    miscContainer.append(miscSections);


    // update ui
    // TODO: toggle even newly inserted messages

    // let updateMuteToggleText;
    // let muteToggle = $("<button class=engine-button></button>")
        // .click(function () {
            // ChatImprovements.playSounds = !ChatImprovements.playSounds;
            // updateMuteToggleText();
        // })
        // .css("float", "right");

    // updateMuteToggleText = function () {
        // muteToggle.text(ChatImprovements.playSounds ? "Mute" : "Unmute");
    // };
    // updateMuteToggleText();

    // let updateNotificationToggleText;
    // let notificationToggle = $("<button class=engine-button></button>")
        // .click(function () {
            // ChatImprovements.showEvents = !ChatImprovements.showEvents;
            // updateNotificationToggleText();
            // $("#game-chat-area .notified-event").toggle(ChatImprovements.showEvents);
        // })
        // .css("float", "right");

    // updateNotificationToggleText = function () {
        // notificationToggle.text(ChatImprovements.showEvents ? "Hide events" : "Show events");
    // };
    // updateNotificationToggleText();

    // let
    gameChatArea.prepend(
        minimizeToggle, /*muteToggle,*/ /*notificationToggle*/
    );

    // listeners[type] = [...];
    let listeners = {};
    ChatImprovements.addEventListener = function (ev, cb) {
        // TODO: verify
        listeners[ev] = listeners[ev] || [];
        listeners[ev].push(cb);
    }
    // reference
    const log = ChatImprovements.log;
    rb.shift = function (...args) {
        let res = Array.prototype.shift.apply(rb, args);
        log.push(res);
        if(typeof res.length !== "undefined") {
            alert("whoa! unexpected arguments passed to sb.shift!");
        }
        let eventType = res.type;
        if(listeners[eventType]) {
            for(let cb of listeners[eventType]) {
                cb(res);
            }
        }
        return res;
    }

    const Events = {
        CHAIN: "chain",
        NORMAL: "normal",
    };
    const notificationColors = {
        [Events.NORMAL]: "#00FF00",
        [Events.CHAIN]: "#AAFFAA",
    };
    const notificationPrefixes = {
        [Events.NORMAL]: "Event: ",
        [Events.CHAIN]: "",
    };
    const eventEnabledKeys = {
        [Events.NORMAL]: "showNormalEvents",
        [Events.CHAIN]: "showChainEvents",
    };
    const notifyEvent = function (event, kind = Events.NORMAL) {
        let prefix = notificationPrefixes[kind];
        let color = notificationColors[kind];
        let message = displayMessage(prefix + event, color, "notified-event", "event-" + kind);

        let enabledKey = eventEnabledKeys[kind];
        message.toggle(ChatImprovements[enabledKey]);
    };

    const GameLocations = {
        TOKEN_PILE: 0,
        DECK: 1,
        HAND: 2,
        FIELD_MONSTER: 4,
        FIELD_SPELLTRAP: 8,
        FIELD: 4 | 8,
        GY: 16,
        BANISHED: 32,
        EXTRA_DECK: 64,
        XYZ_MATERIAL: 128,
    };
    const LocationNames = {
        [GameLocations.TOKEN_PILE]: "token pile",
        [GameLocations.DECK]: "the Deck",
        [GameLocations.HAND]: "the hand",
        [GameLocations.FIELD_MONSTER]: "a Monster Zone",
        [GameLocations.FIELD_SPELLTRAP]: "a Spell & Trap Zone",
        [GameLocations.GY]: "the GY",
        [GameLocations.BANISHED]: "being banished",
        [GameLocations.EXTRA_DECK]: "the Extra Deck",
        192: " an Xyz Monster [bugged response, please report!]",
    };

    let cardCodeToSkip = null;

    let movedFromTo = function (move, start, end) {
        return (move.previousLocation & start) !== 0 &&
               (move.currentLocation & end) !== 0;
    }
    ChatImprovements.addEventListener("GameMove", function (move) {
        let cardName = move.cardCode ? "#@" + move.cardCode : "A card";
        if(move.cardCode) {
            cardCodeToSkip = move.cardCode;
        }
        // sent to GY
        if(movedFromTo(move, GameLocations.XYZ_MATERIAL, GameLocations.GY) ||
           movedFromTo(move, GameLocations.XYZ_MATERIAL, GameLocations.BANISHED)) {
            var status = "was detached as Xyz Material"
        }
        else if(move.currentLocation === GameLocations.GY) {
            status = "was sent to the GY from " + LocationNames[move.previousLocation];
        }
        // returned to the deck
        else if(move.currentLocation === GameLocations.DECK) {
            status = "was shuffled/placed into the Deck from " + LocationNames[move.previousLocation];
        }
        // returned to the extra deck
        else if(move.currentLocation === GameLocations.EXTRA_DECK) {
            status = "was returned to the Extra Deck from " + LocationNames[move.previousLocation];
        }
        // attached as xyz material?
        else if(move.currentLocation & GameLocations.XYZ_MATERIAL) {
            status = "was attached as Xyz Material from " + LocationNames[move.previousLocation];
        }
        // banished
        else if(move.currentLocation === GameLocations.BANISHED) {
            status = "was banished from " + LocationNames[move.previousLocation];
        }
        // sent to hand
        else if(movedFromTo(move, GameLocations.GY, GameLocations.HAND)) {
            // console.log("why??????");
            status = "was returned from the GY to the hand";
        }
        else if(movedFromTo(move, GameLocations.DECK, GameLocations.HAND)) {
            status = "was added from the Deck to the hand";
        }
        else if(movedFromTo(move, GameLocations.BANISHED, GameLocations.HAND)) {
            status = "was added to the hand from being banished";
        }
        else if(movedFromTo(move, GameLocations.FIELD, GameLocations.HAND)) {
            status = "was returned from the field to the hand";
        }
        else if(movedFromTo(move, GameLocations.EXTRA_DECK, GameLocations.HAND)) {
            status = "was added to the hand from the face-up Extra Deck";
        }
        // monster summons
        else if(move.currentLocation === GameLocations.FIELD_MONSTER) {
            status = "was Summoned from " + LocationNames[move.previousLocation];
        }
        // spell card activations
        else if(move.currentLocation === GameLocations.FIELD_SPELLTRAP) {
            // TODO: set vs. activate
            console.log(move);
            status = "was activated/set from " + LocationNames[move.previousLocation];
        }
        else if(movedFromTo(move, GameLocations.FIELD, GameLocations.TOKEN_PILE)) {
            status = "was removed from the field";
        }
        else {
            // 0 from 4
            status = "- UNSURE!! " + move.currentLocation + " from " + move.previousLocation;
        }
        notifyEvent(cardName + " " + status);
        // TODO: more
    });

    ChatImprovements.addEventListener("cfReveal", function (code) {
        if(code && code !== cardCodeToSkip) {
            notifyEvent("Revealed #@" + code);
        }
        cardCodeToSkip = null;
    });

    ChatImprovements.addEventListener("targetCardAnimation", function (code) {
        if(code) {
            notifyEvent("Targeted #@" + code);
        }
    });


    // redefine window resizing
    window.Wb = function Wb() {
        var a = $("#ci-ext-misc-sections").position().top;

        // originally: - 24
        const offset = 24;
        $("#ci-ext-misc-sections div")
            .css("max-height", $(window).height() - a - offset);
        $("#game-siding-column")
            .css("max-height", $(window).height() - a - offset);

        a = 4 <= Ab ? 7 : 6;
        var b = $(window).width() - $("#ci-ext-misc").width() - 50,
            // c = $(window).height();// - $("#game-chat-area").height() - 8 - 48;
            c = $(window).height() - $("#game-chat-textbox").outerHeight() - 8 - 48;
        9 * c / a < b ? ($("#game-field").css("height", c + "px"), b = c / a, $("#game-field").css("width", 9 * b + "px")) : ($("#game-field").css("width", b + "px"), b /= 9, $("#game-field").css("height", b * a + "px"));
        $(".game-field-zone").css("width",
            b + "px").css("height", b + "px");
        $(".game-field-hand").css("width", 5 * b + "px").css("height", b + "px");
        var Cb = b;
        var Db = Math.floor(.95 * b);
        var E = 177 * Db / 254;
        Zc(m[0]);
        Zc(m[1]);
        $("#game-position-atk-up").css("width", E);
        $("#game-position-atk-up").css("height", Db);
        $("#game-position-atk-up").css("margin-right", Db - E + 3);
        $("#game-position-atk-down").css("width", E);
        $("#game-position-atk-down").css("height", Db);
        $("#game-position-atk-down").css("margin-right", Db - E + 3);
        $("#game-position-def-up").css("width", E);
        $("#game-position-def-up").css("height",
            Db);
        $("#game-position-def-up").css("margin-right", Db - E + 3);
        $("#game-position-def-down").css("width", E);
        $("#game-position-def-down").css("height", Db);
        $(".game-selection-card-image").css("width", E);
        zb && $c();
    }

    window.qf = function qf(a, b) {
        if(listeners["targetCardAnimation"]) {
            for(let cb of listeners["targetCardAnimation"]) {
                cb(a.code);
            }
        }
        let originalZ = a.a.css("z-index");
        a.a.css("z-index", 10000)
           .css("animation", "fullScale " + (600 * C) + "ms");
        a.a.animate({
            opacity: .5
        }, {
            duration: 100 * C
        }).animate({
            opacity: 1
        }, {
            duration: 100 * C
        }).animate({
            opacity: .5
        }, {
            duration: 100 * C
        }).animate({
            opacity: 1
        }, {
            duration: 100 * C
        }).animate({
            opacity: .5
        }, {
            duration: 100 * C
        }).animate({
            opacity: 1
        }, {
            duration: 100 * C,
            complete: function () {
                a.a.css("animation", "")
                   .css("z-index", originalZ);
                if(b) {
                    b();
                }
            }
        });
    };

    window.df = function df(a, b, c, d, e) {
        if(listeners["cfReveal"]) {
            for(let cb of listeners["cfReveal"]) {
                cb(b);
            }
        }
        var g = a.a.offset(),
            k = a.location & O.j || c & 5 ? b : 0,
            w = hg(a.controller, a.location, c) - a.va,
            F = false;
        if(a.Kb !== k) {
            F = true;
        }
        if(null !== a.b) {
            a.b.hide();
            a.K.hide();
        }
        a.code = b;
        a.position = c;
        $("<div />").animate({
            height: 1
        }, {
            duration: d,
            step: function(b, c) {
                b = c.pos;
                c = "translate(";
                c += (a.ta.left - g.left) * (1 - b);
                c += "px, ";
                c += (a.ta.top - g.top) * (1 - b);
                c += "px)";
                c += " rotate(" + (a.va + w * b) + "deg)";
                if(F) {
                    if(.5 < b) {
                        ig(a, k);
                    }
                    c += " scalex(" + Math.abs(1 - 2 * b) + ")";
                }
                a.a.css("transform", c)
            },
            complete: function() {
                null !== a.b && (a.b.show(), a.K.show());
                a.a.css("position",
                    "");
                nf(a);
                e()
            }
        })
    }

    // re-add listener
    // remove current resize listener
    // $(window).off("resize", Vb);
    // $(window).resize(Vb);
    Fb.ChatMessageReceived = window.qd = displayOpponentsMessage;
    console.info("ChatImprovements plugin loaded!");

    //
    let overlayExtension;
    $(".game-field-zone").on("mouseover", function (ev) {
        let player = $(this).data("player");
        let location = $(this).data("location");
        let index = $(this).data("index");
        let card = T(player, location, index);
        if(!card) return;
        let overlays = card.l;
        if(!overlayExtension) {
            overlayExtension = $("<p id=game-tooltip-overlay-extension></p>");
            $("#game-tooltip .card-if-monster").append(overlayExtension);
        }
        if(overlays && overlays.length) {
            $(overlayExtension).empty();
            let { width, height } = this.querySelector("img");
            console.log("width, height:", width, height);
            let plural = overlays.length === 1 ? "" : "s";
            let msg = "[" + overlays.length.toString() + " material" + plural + "]\n";
            $(overlayExtension).append($("<p>" + msg + "</p>"));
            for(let overlay of overlays) {
                let imgSrc = ra(overlay.code);
                let img = $("<img class=material-preview src='" + imgSrc + "' width=" + width + " height=" + height + ">");
                // img.width = width;
                // img.height = height;
                $(overlayExtension).append(img);
            }
            $(overlayExtension).show();
        }
        else {
            $(overlayExtension).hide();
        }
    });
    $(".game-field-zone").on("mouseout", function (ev) {
        $(overlayExtension).hide();
    });
};

waitForElementJQuery("#game-room-container:visible, #game-field:visible").then(() => {
    onload();
});
