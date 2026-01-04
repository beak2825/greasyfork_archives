// ==UserScript==
// @name         ShuffleIt SpecTools
// @namespace    http://tampermonkey.net/
// @version      1.11
// @description  Spectate Tools for Shuffle It
// @author       ceviri
// @match        https://dominion.games/
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @resource     ST_css http://ceviri.me/static/woodcutter/st_css.css?v=103
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @grant        GM_getResourceText
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/383688/ShuffleIt%20SpecTools.user.js
// @updateURL https://update.greasyfork.org/scripts/383688/ShuffleIt%20SpecTools.meta.js
// ==/UserScript==

ST = {
    gameId: 0,
    inLobby: () => angular.element(document.body).controller().shouldShowLobbyPage,
    inScore: () => angular.element(document.body).controller().shouldShowScorePage,
    inGame: () => angular.element(document.body).controller().shouldShowGamePage,

    cleanse: logString => {
        while (logString.match(/(<br\/>)|(<\/br>)/)) {
            logString = logString.replace(/(<br\/>)|(<\/br>)/, "\n");
        }
        let mainPattern = /<((span)|(div))[^<>]*?>([^<>]*?)<\/\1>/;
        while (logString.match(mainPattern)) {
            logString = logString.replace(mainPattern, (match, p1, p2, p3, p4) => p4);
        }
        return logString.replace(/^\n/, "");
    },

    logHistory: {},
    overwriteOldLog: function (gameLog, game) {
        let oldIndex = 0;
        let newIndex = 0;
        let oldLog = ST.logHistory[ST.gameId];

        while (newIndex < gameLog.logEntries.length && oldIndex < oldLog.length) {
            let entry = gameLog.logEntries[newIndex];
            let oldEntry = oldLog[oldIndex];
            if (oldEntry.replaced == true || oldEntry.index < entry.index) {
                oldIndex++;
            } else if (entry.index == oldEntry.index) {
                oldEntry.logEntry = ST.cleanse(parseLogEntry(entry, game));
                newIndex++;
                oldIndex++;
            } else {
                ST.logHistory[ST.gameId].splice(oldIndex, 0, {
                    index: entry.index,
                    logEntry: ST.cleanse(parseLogEntry(entry, game)),
                    messages: [],
                    replaced: false,
                    protected: false
                });
                newIndex++;
            }
        }

        if (oldIndex < oldLog.length) {
            oldLog[oldIndex].messages.unshift("### [Undo Begin] ###");
            oldLog[oldLog.length - 1].messages.push("### [Undo End] ###");
            for (let i = oldIndex; i < oldLog.length; i++) {
                oldLog[i].replaced = true;
                oldLog[i].protected = true;
            }
        }
    },
    insertNewLogEntry: game => entry => {
        let newEntry = {
            index: entry.index,
            logEntry: ST.cleanse(parseLogEntry(entry, game)),
            messages: [],
            replaced: false,
            protected: false
        };

        if (ST.gameId in ST.logHistory) {
            let oldLog = ST.logHistory[ST.gameId];
            let index = oldLog.findIndex(e => e.index == entry.index && e.replaced == false);
            if (index > -1) {
                oldLog.slice(index + 1).forEach(e => {
                    if (!e.protected)
                        e.logEntry = "";
                    e.replaced = true;
                });
                oldLog[index].logEntry = newEntry.logEntry;
                ST.recolorScrollerLine(entry);
            } else {
                oldLog.push(newEntry);

                if (ST.getOption("logScroll") == "Yes") {
                    ST.newScrollerLine(entry, oldLog.filter(e => e.replaced == false).length - 1);
                }
            }
        } else {
            ST.logHistory[ST.gameId] = [newEntry];

            if (ST.getOption("logScroll") == "Yes") {
                ST.newScrollerLine(newEntry, 0);
            }
        }
    },

    renderedScrollLines: 0,
    renderLogScroller: () => {
        if ($('.side-bar .st-scroll-container').length == 0){
            var scroller = `<div class='st-scroll-container'>
                <div class='st-scroll-final' onclick='ST.scroll(-1)'
            </div>`
            $('.side-bar').append(scroller);
            $('.game-log').css('right', '5%');
            $('.game-log').css('width', '95%');
        }
    },
    newScrollerLine: (entry, idx) => {
        if (idx > ST.renderedScrollLines) {
            let colors = ['#B85454', '#1C1CB4', '#1B6B1B', '#F6F626', '#C48A1F', '#9B559B'];
            let altColors = ['#883131', '#15156E', '#0C4F0C', '#EBC321', '#B36908', '#70278E'];
            entry.logArguments.forEach(a => {
                if (a.type == 6) {
                    let bgCol = colors[a.argument.owner];
                    let altCol = altColors[a.argument.owner];
                    let bg = `linear-gradient(90deg, ${altCol} 0%, ${bgCol} 60%, ${bgCol} 80%, ${altCol} 100%)`;
                    $(
                        `<div class="st-scroll-line" onclick="ST.scroll(${idx})"
                            style="flex-grow: 0; background: ${bg}; background-color: ${bgCol};"></div>`
                     ).insertBefore('.st-scroll-final');
                }
            });

            ST.renderedScrollLines = idx;
            let target = $(".st-scroll-line").last();
            target.css("flex-grow", parseInt(target.css("flex-grow")) + 1);
        }
    },
    recolorScrollerLine: (entry) => {
        let colors = ['#B85454', '#1C1CB4', '#1B6B1B', '#F6F626', '#C48A1F', '#9B559B'];
        let altColors = ['#883131', '#15156E', '#0C4F0C', '#EBC321', '#B36908', '#70278E'];
        entry.logArguments.forEach(a => {
            if (a.type == 6) {
                let bgCol = colors[a.argument.owner];
                let altCol = altColors[a.argument.owner];
                let bg = `linear-gradient(90deg, ${altCol} 0%, ${bgCol} 60%, ${bgCol} 80%, ${altCol} 100%)`;

                let target = $(".st-scroll-line").last();
                target.css("background", bg);
                target.css("background-color", bgCol);
                return;
            }
        });
    },
    scroll: (i) => {
        let ypos;
        i = Math.min(i, document.querySelectorAll('.game-log .log-line').length);
        if (i > -1) {
            let target = document.querySelectorAll('.game-log .log-line')[i];
            ypos = target.offsetTop - document.querySelector('.game-log').offsetTop;
        } else {
            ypos = document.querySelector('.game-log').scrollHeight - document.querySelector('.game-log').clientHeight;
        }
        document.querySelector('.game-log').scrollTo({
            top: ypos,
            behavior: "smooth"
        });
    },

    boonHexLock: 0,
    boonHexThreshold: 1000,
    hideBoonHex: () => {
        var study = angular.element($('.landscape-study-container'));
        var visible = study.length > 0 &&
                      study.controller().isHexBoon &&
                      study.controller().shouldShowLandStudyWindow;
        if (visible) {
            if (ST.boonHexLock == 0) {
                study.controller().shouldShowLandStudyWindow = false;
                study.scope().$digest();
            }
        } else {
            if (ST.boonHexLock == 0) {
                ST.boonHexLock = 1;
                setTimeout(() => {ST.boonHexLock = 0;}, ST.boonHexThreshold);
            }
        }
    },

    spliceChat: (chatName) => () => {
        let chat = angular.element(document.body).injector().get("chat");
        chat.chatLines.splice(-1);
        angular.element($(chatName)).scope().$digest();
    },

    insertMessageIntoLog: (message) => {
        let playerName = activeMeta.playerNames[parseInt(message.sender.slice(1))];
        let gameLog = ST.logHistory[ST.gameId];
        gameLog[gameLog.length - 1].messages.push(`${playerName}: ${message.message}`);
    },

    lastTime: new Date().getTime(),
    newIncomingMessage: (event, chatMessage) => {
        function sufficientTimeHasPassed() {
            let time = new Date().getTime();
            let b = time - ST.lastTime > 30000;
            ST.lastTime = time;
            return b;
        }

        function shouldRingBell(chatMessage) {
            return (chatMessage.sender.id !== activeMeta.model.me.id) && sufficientTimeHasPassed();
        }

        let get = angular.element(document.body).injector().get;

        let playerName = activeMeta.playerNames[parseInt(chatMessage.sender.slice(1))];
        let muteList = GM_getValue("ST_mutelist", "").split("~");
        let validMessage = false;
        if (!muteList.includes(playerName)) {
            if (ST.getOption("chatFilter") == "Yes") {
                switch (ST.getOption("filterMode")) {
                    case "Players":
                        validMessage = activeGame.model.players.map(p=>p.name).indexOf(playerName) != -1;
                        break;
                    case "All":
                        validMessage = true;
                        break;
                }
            } else {
                validMessage = true;
            }
        }

        if (validMessage) {
            let idx = 0;
            if (ST.inGame()) {
                idx = 1;
                ST.insertMessageIntoLog(chatMessage);
            } else if (ST.inScore()) {
                idx = 2;
            }
            let chatName = [".table-chat", ".game-chat", ".game-chat"][idx];

            let m = parseChatMessage(chatMessage, activeMeta, activeGame);
            get('chat').chatLines.push(m);
            if (shouldRingBell(chatMessage)) {
                get('soundService').play(SOUNDS.PING);
            }
            get('metaBroadcaster').send(Events.CHAT_MESSAGE_PROCESSED);
            ST.renderCopyButton(idx);
            ST.renderFilterButton(idx);
        }
    },

    copyChat: () => {
        let gameIds = Object.keys(ST.logHistory).sort();
        let maxLength = 0;
        for (id of gameIds) {
            for (entry of ST.logHistory[id]) {
                maxLength = Math.max(maxLength, entry.logEntry.length);
            }
        }
        maxLength = Math.min(maxLength, 80);
        let lines = [];

        for (id of gameIds) {
            lines.push(ST.logHistory[id].filter(e => e.logEntry.length > 0 || e.messages.length > 0)
              .map(e => {
                if (e.messages.length > 0)
                    return e.messages.map((m, i) => `${(i == 0 ? e.logEntry : '').padEnd(maxLength)}|| ${m}`).join("\n");
                else
                    return `${(e.logEntry.padEnd(maxLength))}||`;
            }).join("\n"));
        }

        GM_setClipboard(lines.join("\n"));
    },

    renderCopyButton: (modeIdx) => {
        let container = [null, ".end-buttons-area", ".game-log-results"][modeIdx];
        let copyButton = `
            <input
                class="end-turn-button chat-grab"
                type=button
                onclick="ST.copyChat()"
                value="Copy Chat"
            >`;

        if (container != null) {
            if ($(`${container} .chat-grab`).length == 0) {
                if (modeIdx == 2 || !activeGame.heroIsPlayer()) {
                    $(container).append(copyButton);
                }
            }
        }
    },

    renderFilterButton: (modeIdx) => {
        if (ST.getOption("chatFilter") == "Yes") {
            var mode = ST.getOption("filterMode");
            var filterLabel = mode[0];
            var button = `<div class='chat-filter-button' onclick='ST.filterMode()'> ${filterLabel} </div>`;
            let container = [null, ".game-area", ".score-panel"][modeIdx];

            if (container != null) {
                if ($(`${container} .chat-filter-button`).length == 0) {
                    $(container).append(button);
                } else {
                    $(`${container} .chat-filter-button`).html(filterLabel);
                }
            }
        }
    },

    filterMode: () => {
        ST.incrementOption("filterMode");
        ST.renderFilterButton(ST.inGame() ? 1 : 2);
    },

    renderPlayerLevel: () => {
        if (ST.getOption("playerLevel") == "Yes") {
            var log = angular.element(document.body).injector().get("log");

            var players = [activeGame.model.hero];
            players = players.concat(activeGame.model.opponents);
            var data = players.map(p => log.entries[0].string
                              .match(`${p.name}</span>: (.*?)</div>`));

            var ratings = data.filter(x => x != null).map(x => Math.floor(x[1]));

            $('.opponent-name-counter-pane').each(function(i) {
                if (i < ratings.length) {
                    var inner = `<div class='rating-display'>${ratings[i]}</div>`;
                } else {
                    var inner = '';
                }

                if ($(this).children('.rating-display').length == 0) {
                    $(this).append(inner);
                } else {
                    $(this).children('.rating-display').replaceWith(inner);
                }
            });
        }
    },

    showingSettings: false,
    toggleSettings: () => {
        ST.showingSettings = !ST.showingSettings;
        ST.renderSettings();
    },
    options: [
        {label: "Filter Chat", name: "chatFilter", modes: ["Yes", "No"]},
        {label: "Chat Filtering Mode", name: "filterMode", modes: ["All", "Players", "None"]},
        {label: "Show Player Levels", name: "playerLevel", modes: ["No", "Yes"]},
        {label: "Show Log Scroller", name: "logScroll", modes: ["Yes", "No"]},
        {label: "Autohide Boons/Hexes", name: "boonHex", modes: ["Yes", "No"]},
        {label: "Automatically Leave Games", name: "leaveGames", modes: ["No", "Yes (5s)", "Yes (1s)"]},
    ],
    getOption: name => {
        let i = ST.options.findIndex(o => o.name == name);
        return GM_getValue("ST_" + name, ST.options[i].modes[0]);
    },
    setOption: (name, value) => {
        return GM_setValue("ST_" + name, value);
    },
    incrementOption: name => {
        let i = ST.options.findIndex(o => o.name == name);
        let modes = ST.options[i].modes;
        let idx = modes.indexOf(ST.getOption(name));
        ST.setOption(name, modes[(idx + 1) % modes.length]);
        ST.renderSettings();
    },
    unmute: index => {
        let oldList = GM_getValue("ST_mutelist", "");
        if (oldList) {
            let names = oldList.split("~");
            names.splice(index, 1);
            GM_setValue("ST_mutelist", names.join("~"));
        }
        $(".mute-list > .st-option-value").each((i, e) => {
            if (i > index) {
                $(e).attr("onclick", `ST.unmute(${i - 1})`)
            }
        })
        $(".mute-list").eq(index).remove();
    },
    menuMute: () => {
        let oldList = GM_getValue("ST_mutelist", "");
        let newName = $(".st-mute-input").val();
        if (!oldList.split("~").includes(newName)) {
            if (oldList)
                GM_setValue("ST_mutelist", `${oldList}~${newName}`);
            else
                GM_setValue("ST_mutelist", newName);
        }

        $(".st-options-container").append(
            `<div class="st-option mute-list">
                 <div class="st-option-label">${newName}</div>
                 <div class="st-option-value" onclick="ST.unmute(${$(".mute-list").length})">Remove</div>
             </div>`
        );
    },
    mute: name => {
        let oldList = GM_getValue("ST_mutelist", "");
        if (!oldList.split("~").includes(name)) {
            if (confirm(`Mute ${name}?`)) {
                if (oldList)
                    GM_setValue("ST_mutelist", `${oldList}~${name}`);
                else
                    GM_setValue("ST_mutelist", name);
            }
        } else {
            alert(`You've already muted ${name}.`)
        }
    },
    renderSettingsContents: () => {
        if ($('.st-options-window').length > 0) {
            ST.options.forEach ((o, i) => {
                $(".st-option > .st-option-value").eq(i).html(ST.getOption(o.name));
            });
        } else {
            let options = "";
            ST.options.forEach(o => {
                options += `
                    <div class="st-option">
                        <div class="st-option-label">${o.label}</div>
                        <div class="st-option-value" onclick="ST.incrementOption('${o.name}')">${ST.getOption(o.name)}</div>
                    </div>
                `
            });

            let muteRaw = GM_getValue("ST_mutelist", "");
            let muteList = "";
            if (muteRaw) {
                muteList = muteRaw.split("~").map((n, i) =>
                    `<div class="st-option mute-list">
                         <div class="st-option-label">${n}</div>
                         <div class="st-option-value" onclick="ST.unmute(${i})">Remove</div>
                     </div>`
                ).join("");
            }
            $('.main-lobby-page').append(`
                <div class="st-options-window">
                    <div class="st-options-border">
                        <div class="st-options-border-top">
                            <div class="st-options-title"> SpecTools Options </div>
                        </div>
                        <div class="st-options-container">
                            ${options}
                            <br style="margin-top: 2vh;">
                            <div class="st-option">
                                <div class="st-option-label">Mute List</div>
                            </div>
                            ${muteList}
                        </div>
                        <div class="st-mute-container">
                            <input class="st-mute-input" type="text">
                            <div class="st-mute-submit" onclick="ST.menuMute()">Mute</div>
                        </div>
                    </div>
                </div>`
            );
        }
    },
    renderSettings: () => {
        if (ST.inLobby()) {
            if (ST.showingSettings) {
                ST.renderSettingsContents();
                $('.window-container').hide();
                $('.st-options-window').show();
            } else {
                $('.window-container').show();
                $('.st-options-window').hide();
            }

            if ($('.bottom-lobby-links').length > 0) {
                if ($('.bottom-lobby-links .st-settings').length == 0) {
                    $('.bottom-lobby-links').prepend(
                        '<div class="bottom-lobby-link st-settings" onclick="ST.toggleSettings()">SpecTools Options</div>'
                    )
                }
            }
        }
    },

    onJoinGame: function (event, info) {
        ST.gameId = info.gameId;
        ST.renderedScrollLines = 0;
    },

    onGameLog: (gameLog, game) => {
        if (ST.gameId in ST.logHistory) {
            ST.overwriteOldLog(gameLog, game);
        } else {
            gameLog.logEntries.forEach(ST.insertNewLogEntry(game))
        }

        if (ST.getOption("logScroll") == "Yes") {
            ST.renderedScrollLines = 0;
            ST.renderLogScroller();
            gameLog.logEntries.forEach(ST.newScrollerLine);
        }
    },

    onLogEntry: (logEntry, game) => {
        ST.insertNewLogEntry(game)(logEntry)

        if (ST.getOption("boonHex") == "Yes") {
            ST.hideBoonHex();
        }
    },

    onChatMessage: (message) => {
        ST.newIncomingMessage(null, message);
    },

    stopTimer: () => {
        clearTimeout(ST.quitTimer);
        $('.spinner').remove();
    },

    onGameEnd: (info, conn) => {
        let duration;
        switch (ST.getOption("leaveGames")) {
            case "No":
                return;
            case "Yes (1s)":
                $(".modal-window").append(`<div class="spinner fast" onclick="ST.stopTimer()"></div>`);
                duration = 1000;
                break;
            case "Yes (5s)":
                $(".modal-window").append(`<div class="spinner" onclick="ST.stopTimer()"></div>`);
                duration = 5000;
                break;
        }
        ST.quitTimer = setTimeout(conn.disconnect, duration);
    },

    hasReplacedChat: false,
    startup: function () {
        if (typeof angular.element(document.body).scope() == 'undefined') {
            angular.reloadWithDebugInfo();
        }

        GM_addStyle (GM_getResourceText ("ST_css"));

        angular.element(document.body).injector().invoke([
                '$rootScope', 'log', 'game', 'gameServerConnection', function(rootScope, log, game, conn) {
            rootScope.$on(Events.JOIN_GAME_SERVER, ST.onJoinGame);
            rootScope.$on(Events.GAME_PAGE_LOADED, () => {
                angular.element(document.body).scope().$$postDigest(() => {
                    ST.renderCopyButton(1);
                    ST.renderPlayerLevel();
                    ST.renderFilterButton(1);
                });
            });
            rootScope.$on(Events.SCORE_PAGE_LOADED, () => {
                angular.element(document.body).scope().$$postDigest(() => {
                    ST.renderCopyButton(2);
                    ST.renderFilterButton(2);
                });
            });
            rootScope.$on(Events.LOBBY_PAGE_LOADED, ST.renderSettings);

            rootScope.$on(Events.NEW_GAME_LOG, function (event, gameLog) {
                ST.onGameLog(gameLog, game);
            });

            rootScope.$on(Events.NEW_LOG_ENTRY, function (event, logEntry) {
                ST.onLogEntry(logEntry, game);
            });

            rootScope.$on(Events.CHAT_MESSAGE_RECEIVED, function (event, chatMessage) {
                if (!ST.hasReplacedChat) {
                    let c = angular.element(document.body).injector().get('$rootScope').$$childHead;
                    while (!('chatMessageReceived' in c.$$listeners)) {
                        if (c.$$nextSibling)
                            c = c.$$nextSibling;
                        else
                            break;
                    }
                    c.$$listeners.chatMessageReceived = [];
                    ST.hasReplacedChat = true;
                }
                ST.onChatMessage(chatMessage);
            });

            rootScope.$on(Events.GAME_ENDED, function (event, info) {
                angular.element(document.body).scope().$$postDigest(() => {
                    ST.onGameEnd(info, conn);
                });
            });
        }]);
    }
}

ST.startup();