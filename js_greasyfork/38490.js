    // ==UserScript==
    // @name         woodcutter-grabber
    // @namespace    http://tampermonkey.net/
    // @version      2.0.10
    // @description  Grab logs from Dominion Online
    // @author       ceviri
    // @match        https://dominion.games/*
    // @grant        GM_xmlhttpRequest
    // @grant        GM_openInTab
    // @grant        GM_addStyle
    // @grant        GM_setClipboard
    // @require      http://code.jquery.com/jquery-3.3.1.min.js
    // @connect      ceviri.me
// @downloadURL https://update.greasyfork.org/scripts/38490/woodcutter-grabber.user.js
// @updateURL https://update.greasyfork.org/scripts/38490/woodcutter-grabber.meta.js
    // ==/UserScript==


    ABORT_THRESHOLD = 10000;

    injector = angular.element(document.body).injector();
    tS = injector.get('tableService');
    pageDisplay = angular.element(document.body).controller();
    pageScope = angular.element(document.body).scope();

    WC_grabber = {
        shouldDisplay: false,
        count: 0,
        currentlyGrabbing: [],
        currentInfo: null,
        hasRetried: false,
        timeout: null,
        isGrabbing: false,
        logs: [],

        angular_debug_check: function () {
            if (typeof pageScope == 'undefined') {
                angular.reloadWithDebugInfo();
                return false;
            } else {
                return true;
            }
        },

        tryToAddButton: function() {
            if ($('.table-replay-buttons').length > 0) {
                if ($('.table-replay-buttons .wc-grab-logs').length == 0){
                    var log_grab_button = $('<div class="oval-button unselectable clickable wc-grab-logs" onclick="WC_grabber.grabLogs()">Grab Logs</div>');
                    $('.table-replay-buttons').append(log_grab_button);
                    var log_input = $('<input id="wc-log-input" class="table-replay-input" type="text">');
                    $('.table-fieldset.kingdom-options').append(log_input);
                }
            }
        },

        grabCurrentLog: function(log) {
            if (log.entries.length === 0) {
                setTimeout(() => {WC_grabber.grabCurrentLog(log)}, 100);
                return;
            }
            clearTimeout(WC_grabber.timeout);
            WC_grabber.logs.push(log.entries.filter(entry => "name" in entry).map(WC_grabber.parseLogLine).join("~"));
            supplyCounts = new Object;
            injector.get('game').state.cards.forEach(card => {
                index = getOrdinal(CardNames, card.cardName);
                if (index in supplyCounts) {
                    supplyCounts[index]++;
                } else {
                    supplyCounts[index] = 1;
                }
            });
            WC_grabber.supply = "";
            for (i in supplyCounts) {
                WC_grabber.supply += `${supplyCounts[i]}:${i}~`;
            }
            injector.get('gameServerMessenger').resign();
            injector.get('gameServerConnection').disconnect();
            listenEnd();
            WC_grabber.listenJoin();
        },

        startup: function(){
            GM_addStyle(`.hidden > *:not(.wc-status) {display:none;}
                         .wc-status {left: 50%; color: white;
                                     font-family: "Segoe UI";
                                     display:flex; justify-content:center;
                                     overflow-y:scroll; background-color: black;}`);
            setInterval(WC_grabber.tryToAddButton, 1000);

            injector.invoke(["log", (log) => {
                let oldProcess = log.newGameLog;
                log.newGameLog = gameLog => {
                    oldProcess(gameLog);

                    if (WC_grabber.isGrabbing) {
                        WC_grabber.grabCurrentLog(log);
                    }
                }
            }]);
        },


        sendLogs: function(){
            nameString = WC_grabber.currentInfo.playerList.map(p => p.name).join("~");
            headerString = encodeURIComponent(`${WC_grabber.currentInfo.gameId}:${nameString}`);
            logString = encodeURIComponent(`${WC_grabber.logs[0]}###${WC_grabber.logs[1]}`);
            supplyString = encodeURIComponent(WC_grabber.supply);
            datastring = `v=5&header=${headerString}&logs=${logString}&supply=${supplyString}`;
            GM_xmlhttpRequest({
                method: "POST",
                url: "http://ceviri.me/woodcutter/submit",
                data: datastring,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                onload: function(response) {
                    GM_setClipboard(response.responseText);
                    if (WC_grabber.shouldDisplay){
                        GM_openInTab("http://ceviri.me/woodcutter/"+gameId+"/display");
                    }
                },
            });
            WC_grabber.logs = [];
            WC_grabber.isGrabbing = false;
        },

        parseLogLine: function(entry) {
            pred = getOrdinal(LogEntryNames, entry.name);
            player = 0;
            items = [];
            args = [];
            entry.logArguments.forEach(argument => {
                switch (argument.type) {
                    case 0:
                        argument.argument.forEach(card => {
                            index = getOrdinal(CardNames, card.cardName);
                            items.push(`${card.frequency}:${index}`);
                        });
                    break;

                    case 1:
                        player = argument.argument + 1;
                    break;

                    case 6:
                        player = argument.argument.ownerId + 1;
                        args.push(argument.argument.turnNumber);
                        args.push(argument.argument.turnType);
                    break;

                    case 11:
                        args.push(getOrdinal(CardNames, argument.argument));
                    break;

                    case 15:
                        args.push(argument.argument.gameId);
                        argument.argument.changedLikelyhoodCards.forEach(row => {
                            args.push(`${row.likelyhood}:${row.cards.length}`);
                            items.push(...row.cards.map(c =>
                                `1:${getOrdinal(CardNames, c)}`
                            ));
                        });
                    break;

                    default:
                        args.push(argument.argument);
                    break;
                }
            });
            itemString = items.join("+");
            argString = args.join("+");
            return `${entry.depth}|${pred}|${player}|${itemString}|${argString}`;
        },

        newStatusLine: function(newline) {
            $('.wc-status').html($('.wc-status').html() + newline + '<br>');
        },

        loadNextGame: function () {
            WC_grabber.hasRetried = false;
            if (WC_grabber.currentlyGrabbing.length > 0) {
                gameId = WC_grabber.currentlyGrabbing.pop();
                let r = new ReplayInstructions(gameId, -1, new PlayerList());
                rule = new TableRule(TableRuleIds.REPLAY_INSTRUCTIONS, r);
                tS.changeRule(rule);

                index = WC_grabber.count - WC_grabber.currentlyGrabbing.length;

                WC_grabber.newStatusLine(`Grabbing log id ${gameId}`);
                return false;
            } else {
                listener();
                pageScope.$$listeners.gameModelCreated = [WC_grabber.oldLoadFn];
                $('body').removeClass("hidden");
                $('.wc-status').remove();
                return true;
            }
        },

        listenJoin: function() {
            injector.invoke(['$rootScope', function(rootScope) {
                listener = rootScope.$on(Events.TABLE_JOINED, function(event) {
                    console.log("rejoined table");
                    if (WC_grabber.logs.length == 2) {
                        WC_grabber.sendLogs();
                        WC_grabber.newStatusLine("Succesfully grabbed log");
                        if (WC_grabber.loadNextGame())
                            return;
                    }

                    beings = tS.getBeings();
                    if (WC_grabber.logs.length == 0) {
                        order = beings.map((b, i) => new OrderedPlayer(b, i));
                    } else if (WC_grabber.logs.length == 1) {
                        order = beings.map((b, i) => new OrderedPlayer(b, 1 - i));
                    }
                    rule = new TableRule(TableRuleIds.PLAYER_ORDER, new PlayerOrder(order));
                    tS.changeRule(rule);
                    listener();
                    WC_grabber.listenStart(TableRuleIds.PLAYER_ORDER);
                    WC_grabber.timeout = setTimeout(WC_grabber.abortGrab, ABORT_THRESHOLD);
                });
            }]);
        },

        listenStart: function(watchRule) {
            WC_grabber.isGrabbing = true;
            injector.invoke(['$rootScope', function(rootScope) {
                listener = rootScope.$on(Events.TABLE_RULE_CHANGED, function(event, rule) {
                    if (rule.rule.id == watchRule) {
                        WC_grabber.currentInfo = injector.get('replayService').getReplayInstructions();
                        injector.get('metaServerMessenger').startGameRequest(tS.getTableId(), true);
                        listener();
                        WC_grabber.listenLogs();
                    }
                });
            }]);
        },

        listenLogs: function() {
            injector.invoke(['$rootScope', function(rootScope) {
                listenEnd = rootScope.$on(Events.GAME_ENDED, function(event) {
                    WC_grabber.newStatusLine("Retrying log from penultimate decision.");
                    injector.get('gameServerConnection').disconnect();
                    listener();
                    listenEnd();
                    WC_grabber.listenSetupRetry();
                });
            }]);
        },

        listenSetupRetry: function() {
            injector.invoke(['$rootScope', function(rootScope) {
                listener = rootScope.$on(Events.TABLE_JOINED, function(event) {
                    let r = tS.getRuleValue(TableRuleIds.REPLAY_INSTRUCTIONS);
                    let logLength = tS.getRuleValue(TableRuleIds.REPLAY_INSTRUCTIONS).decisionIndex;
                    let newR = new ReplayInstructions(r.gameId, logLength - 1, new PlayerList());
                    tS.changeRule(new TableRule(TableRuleIds.REPLAY_INSTRUCTIONS, newR));
                    listener();
                    WC_grabber.listenStart(TableRuleIds.REPLAY_INSTRUCTIONS);
                });
            }]);
        },

        abortGrab: function() {
            injector.get('gameServerMessenger').resign();
            injector.get('gameServerConnection').disconnect();
            WC_grabber.newStatusLine("Log failed. Moving on...");
            WC_grabber.loadNextGame();
        },

        grabLogs: function() {
            publicPreferences.setUserPrefValue(UserPrefIds["LOG_FIXED_BASIC_BONUS"], true);

            input = angular.element($('#wc-log-input'))[0].value;
            WC_grabber.shouldDisplay = true;
            replayList = input.split(",");
            WC_grabber.count = replayList.length;
            if (replayList.length > 1){
                WC_grabber.shouldDisplay = false;
            }

            // Stop game / score pagees from showing
            // WC_grabber.oldShowGamePage = pageDisplay.showGamePage;
            // WC_grabber.oldShowScorePage = pageDisplay.showScorePage;
            // pageDisplay.showGamePage = () => {console.log("Game page suppressed")};
            // pageDisplay.showScorePage = () => {console.log("Score page suppressed")};
            WC_grabber.currentlyGrabbing = replayList;

            // Start Table
            WC_grabber.setupTable();
        },

        setupTable: function() {
            let rules = [];
            gameId = WC_grabber.currentlyGrabbing.pop();
            let r = new ReplayInstructions(gameId, -1, new PlayerList());
            rules.push(new TableRule(TableRuleIds.REPLAY_INSTRUCTIONS, r));
            rules.push(new TableRule(TableRuleIds.MAX_PLAYERS, 2));
            rules.push(new TableRule(TableRuleIds.SPECTATE_RULES, GroupIds.NOBODY, -1));
            injector.get("metaServerMessenger").newTableRequest(rules);

            WC_grabber.newStatusLine(`Grabbing log id ${gameId}`);
            injector.invoke(
                ['$rootScope', function(rootScope) {
                    let listener = rootScope.$on(Events.TABLE_JOINED, function(event) {
                        if (tS.getBeings().length < 2){
                            tS.addBot();
                            listener();
                        }
                    });
                    let listenBot = rootScope.$on(Events.BOT_ADDED, function(event) {
                        beings = tS.getBeings();
                        order = beings.map((b, i) => new OrderedPlayer(b, i));
                        rule = new TableRule(TableRuleIds.PLAYER_ORDER, new PlayerOrder(order));
                        tS.changeRule(rule);
                        listenBot();
                        WC_grabber.listenStart(TableRuleIds.PLAYER_ORDER);
                    });
                    let listenEnd;
                }
            ]);
        }
    }

    WC_grabber.angular_debug_check();
    WC_grabber.startup();

