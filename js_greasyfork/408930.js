// ==UserScript==
// @name         BGA Puerto Rico helper
// @description  Track victory points from all players
// @author       https://github.com/tallesh
// @namespace    https://github.com/tallesh/bga-puerto-rico
// @version      1.0.1
// @include      *boardgamearena.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/408930/BGA%20Puerto%20Rico%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/408930/BGA%20Puerto%20Rico%20helper.meta.js
// ==/UserScript==
//
// Works with Tampermonkey only.
// ==/UserScript==
/* jshint esversion: 6 */

(function() {
    'use strict';
    const Is_Inside_Game = /\?table=[0-9]*/.test(window.location.href);
    const BGA_Player_Board_Id_Prefix = "player_board_wrap_";
    const BGA_Player_Score_Id_Prefix = "player_score_";
    const BGA_Player_Shipping_Vps_Prefix = "shipping_points_player_"
    const Player_Score_Id_Prefix = "prMonitor_score_";
    const Player_Score_Span_Class = "prMonitor_score";
    const Player_Vps_Div_Class = "prMonitor_vps_container";

    const Enable_Logging = false;
    // Main PRMonitor object
    var prMonitor = {
        isStarted: false,
        dojo: null,
        game: null,
        mainPlayer: null,
        governorCount: 1,
        playersCount: 0,
        players: [],

        // Init PRMonitor
        init: function() {
            this.isStarted = true;
            this.dojo = window.parent.dojo;
            this.game = window.parent.gameui.gamedatas;
            var playerOrder = this.game.playerorder;
            this.playersCount = playerOrder.length;
            this.mainPlayer = playerOrder[0];

            // local storage stores value as strings, so we need to parse "false" and "true" to get boolean
            this.settings = {
                'enableRecordVps': localStorage.getItem('prMonitor-seetings-record-vps') === null ?
                true : String(localStorage.getItem('prMonitor-seetings-record-vps')) == "true"
            };

            for (var i = 0; i < this.playersCount; i++) {
                var playerId = playerOrder[i];
                this.players[playerId] = {
                    vps: 0
                };

                // Identify who sits to the left and to the right
                if (playerId == this.mainPlayer) {
                    this.players[playerId].left = playerOrder[this.playersCount - 1];
                } else {
                    this.players[playerId].left = playerOrder[i - 1];
                }
                if (playerId == playerOrder[this.playersCount - 1]) {
                    this.players[playerId].right = this.mainPlayer;
                } else {
                    this.players[playerId].right = playerOrder[i + 1];
                }

                this.renderPRMonitorContainers(playerId);
                this.renderPlayerVps(playerId);
            }

            this.renderPRMonitorMenu();
            this.setStyles();

            // Configure PRMonitor according to settings
            this.togglePRMonitorSettingPlayerVpsDisplay(this.settings.enableRecordVps);

            // Connect event handlers to follow game progress
            this.dojo.subscribe("victoryPointsEarned", this, "increaseVps");
            this.dojo.subscribe("victoryPointSelectedBlackMarket", this, "removeOneVp");
            this.dojo.subscribe("victoryPointUnselectedBlackMarket", this, "addOneVp");
            this.dojo.subscribe("newGovernor", this, "incrementGovernoCount");


            if (Enable_Logging) console.log("PRMonitor: My eyes can see everything!");
            return this;
        },

        adjustVps: function(playerId, vps){
            if (Enable_Logging) console.log("PRMonitor: vps changed - I got", playerId, vps);

            this.players[playerId].vps += vps;
            this.renderPlayerVps(playerId, this.players[playerId].vps);
        },

        increaseVps: function(data) {
            this.adjustVps(data.args.player_id, data.args.delta);
        },

        removeOneVp: function(data) {
            this.adjustVps(data.args.player_id, -1);
        },

        addOneVp: function(data) {
            this.adjustVps(data.args.player_id, 1);
        },

        // Update total player vps
        renderPlayerVps: function(playerId) {
            this.dojo.byId(Player_Score_Id_Prefix + playerId).innerHTML = " (" + this.players[playerId].vps + ")";
        },

        //Updata total rounds
        incrementGovernoCount: function(data){
            if (Enable_Logging) console.log("PRMonitor: new governo - I got");

            this.governorCount++;
            this.dojo.byId('prMonitor_value_governo').innerHTML = this.governorCount;
        },

        // Render player containers
        renderPRMonitorContainers: function(playerId) {
            // Insert war score container
            if (!this.dojo.byId(Player_Score_Id_Prefix + playerId)) {
                this.dojo.place(
                    "<span id='" + Player_Score_Id_Prefix + playerId + "'" +
                    "class='player_score_value " + Player_Score_Span_Class + "'></span>",
                    BGA_Player_Shipping_Vps_Prefix + playerId,
                    "after");
            }

        },


        // Render PRMonitor menu
        renderPRMonitorMenu: function() {
            var menuHtml = "<div id='prMonitor_menu'>";
            menuHtml += "<div class='menu_header'><h3>PRMonitor</h3></div>";

            // Player vps setting
            menuHtml += "<div id='prMonitor_menu_player_vps' class='menu_item'><span class='title'>Player VPs:</span>";
            menuHtml += "<span class='status'>Enabled</span><button type='button'>Disable</button></div>";
            menuHtml += "<div id='prMonitor_menu_governo_count><span class='title'>"
            menuHtml += "Round:&nbsp;</span><span id='prMonitor_value_governo' class='title'>" + this.governorCount + "</span>";

            menuHtml += "</div>";
            this.dojo.place(menuHtml, "game_play_area_wrap", "last");

            // Set correct texts based on settings
            this.togglePRMonitorSettingText("prMonitor_menu_player_vps", this.settings.enableRecordVps);

            // Connect event handlers
            this.dojo.connect(this.dojo.query("button", "prMonitor_menu_player_vps")[0], "onclick", this, "togglePRMonitorSettingPlayerVps");
        },

        // Enable or disable display of player vps
        togglePRMonitorSettingPlayerVps: function(event) {
            this.settings.enableRecordVps = !this.settings.enableRecordVps;
            localStorage.setItem('prMonitor-seetings-record-vps', this.settings.enableRecordVps);
            this.togglePRMonitorSettingPlayerVpsDisplay(this.settings.enableRecordVps);
            this.togglePRMonitorSettingText(event.target.parentNode.id, this.settings.enableRecordVps);
        },
        togglePRMonitorSettingPlayerVpsDisplay: function(pleaseShow) {
            if (pleaseShow) {
                this.dojo.query("." + Player_Score_Span_Class).style("display", "inline");
            } else {
                this.dojo.query("." + Player_Score_Span_Class).style("display", "none");
            }
        },

        // Switch enable/disable text in PRMonitor settings
        togglePRMonitorSettingText: function(parentId, isEnabled) {
            if (isEnabled) {
                this.dojo.query(".status", parentId)
                    .addClass('enabled')
                    .removeClass('disabled')[0]
                    .innerHTML = "Enabled";
                this.dojo.query("button", parentId)[0].innerHTML = "Disable";
            } else {
                this.dojo.query(".status", parentId)
                    .addClass('disabled')
                    .removeClass('enabled')[0]
                    .innerHTML = "Disabled";
                this.dojo.query("button", parentId)[0].innerHTML = "Enable";
            }
        },

        // Set PRMonitor CSS styles
        setStyles: function() {
            this.dojo.place(
                "<style type='text/css' id='PRMonitor_Styles'>" +
                "#prMonitor_menu { position: absolute; top: 10px; right: 50px; } " +
                "#prMonitor_menu .menu_header { margin-bottom: 5px; } " +
                "#prMonitor_menu .menu_header h3 { display: inline; } " +
                "#prMonitor_menu .menu_item { height: 23px; } " +
                "#prMonitor_menu .menu_item span.title { width: 140px; display: inline-block;} " +
                "#prMonitor_menu .menu_item span.status { text-align: center; width: 60px; display: inline-block; } " +
                "#prMonitor_menu .menu_item span.status.enabled { color: green; } " +
                "#prMonitor_menu .menu_item span.status.disabled { color: red; } " +
                "#prMonitor_menu .menu_item button { width: 60px; padding: 3px; border-radius: 5px; margin-left: 10px; } " +
                ".player-board { width: 235px !important; }" +
                "</style>", "game_play_area_wrap", "last");
        }
    };

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function isObjectEmpty(object) {
        return typeof(object) == "undefined" ||
            (Object.keys(object).length === 0 && object.constructor === Object);
    }

    // Everything starts here
    window.addEventListener('load', async function() {
        if (Is_Inside_Game) {
            for (let i = 0; i < 100; i++) {
                if(window.parent.gameui !== undefined && window.parent.gameui !== null){
                    break;
                }
                await sleep(50);// Wait for BGA to load dojo and PR scripts
            }

            if (!window.parent.gameui || window.parent.gameui.game_name !== "puertorico") {
                console.log('Puerto Rico not detected');
                return;
            }

            // Prevent multiple launches
            if (window.parent.prMonitor && window.parent.prMonitor.isStarted) {
                return;
            } else {
                if (Enable_Logging) console.log("PRMonitor: I have come to serve you");
                window.parent.prMonitor = prMonitor.init();
            }
        }
    });
})();
