// ==UserScript==
// @name         BGA Pythia - 7 Wonders game helper
// @description  Visual aid that extends BGA game interface with useful information
// @namespace    https://github.com/dpavliuchkov/bga-pythia
// @author       https://github.com/dpavliuchkov
// @version      1.3.3
// @license      MIT
// @include      *boardgamearena.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/438491/BGA%20Pythia%20-%207%20Wonders%20game%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/438491/BGA%20Pythia%20-%207%20Wonders%20game%20helper.meta.js
// ==/UserScript==
//
// On boardgamearena.com, you can play an exciting board game of 7 wonders.
// However, it is hard to remember which cards each player has. Pythia has
// godlike powers and will share this information with you. It will also
// display total player's score based on the current shields situation.
// And it will mark leader and runner up players and their boards. And
// Pythia will calculate how much points and coins some cards are worth to you.
// Works with Tampermonkey only.
// ==/UserScript==
 
// System variables - don't edit
const Enable_Logging = false;
const Is_Inside_Game = /\?table=[0-9]*/.test(window.location.href);
const Cards_Image = "https://x.boardgamearena.net/data/themereleases/current/games/sevenwonders/200914-1526/img/cards.jpg";
const Cards_Image_V2 = "https://x.boardgamearena.net/data/themereleases/current/games/sevenwonders/200914-1526/img/cards_v2.jpg";
const BGA_Player_Board_Id_Prefix = "player_board_wrap_";
const BGA_Player_Score_Id_Prefix = "player_score_";
const Card_Worth_Id_Prefix = "pythia_card_worth_container_";
const Discard_Card_Worth_Id_Prefix = "pythia_discard_card_worth_container_";
const Card_Worth_Class = "pythia_card_worth";
const Card_Worth_Coins_Class = "pythia_card_coins_worth";
const Player_Cards_Id_Prefix = "pythia_cards_wrap_";
const Player_Hand_Card_Id_Prefix = "pythia_hand_card_";
const Player_Score_Id_Prefix = "pythia_score_";
const Player_Military_Power_Id_Prefix = "pythia_military_power_";
const Player_War_Score_Id_Prefix = "pythia_player_war_score_";
const Player_Cards_Div_Class = "pythia_cards_container";
const Player_Score_Span_Class = "pythia_score";
const Player_Leader_Class = "pythia_leader";
const Player_Runnerup_Class = "pythia_runnerup";
const War_Points_Per_Age = {
    "1": 1,
    "2": 3,
    "3": 5
};
const Victory_Points_Image = {
    "-1": "https://github.com/dpavliuchkov/bga-pythia/blob/master/images/minus%201%20point.png?raw=true",
    "-2": "https://github.com/dpavliuchkov/bga-pythia/blob/master/images/minus%202%20points.png?raw=true",
    0: "https://github.com/dpavliuchkov/bga-pythia/blob/master/images/0%20points.png?raw=true",
    1: "https://github.com/dpavliuchkov/bga-pythia/blob/master/images/1%20point.png?raw=true",
    2: "https://github.com/dpavliuchkov/bga-pythia/blob/master/images/2%20points.png?raw=true",
    3: "https://github.com/dpavliuchkov/bga-pythia/blob/master/images/3%20points.png?raw=true",
    4: "https://github.com/dpavliuchkov/bga-pythia/blob/master/images/4%20points.png?raw=true",
    5: "https://github.com/dpavliuchkov/bga-pythia/blob/master/images/5%20points.png?raw=true",
    6: "https://github.com/dpavliuchkov/bga-pythia/blob/master/images/6%20points.png?raw=true",
    7: "https://github.com/dpavliuchkov/bga-pythia/blob/master/images/7%20points.png?raw=true",
    8: "https://github.com/dpavliuchkov/bga-pythia/blob/master/images/8%20points.png?raw=true",
    9: "https://github.com/dpavliuchkov/bga-pythia/blob/master/images/9%20points.png?raw=true",
    10: "https://github.com/dpavliuchkov/bga-pythia/blob/master/images/10%20points.png?raw=true",
    11: "https://github.com/dpavliuchkov/bga-pythia/blob/master/images/11%20points.png?raw=true",
    12: "https://github.com/dpavliuchkov/bga-pythia/blob/master/images/12%20points.png?raw=true",
    13: "https://github.com/dpavliuchkov/bga-pythia/blob/master/images/13%20points.png?raw=true",
    14: "https://github.com/dpavliuchkov/bga-pythia/blob/master/images/14%20points.png?raw=true",
};
const Coins_Image = {
    0: "https://github.com/dpavliuchkov/bga-pythia/blob/master/images/0%20coins.png?raw=true",
    1: "https://github.com/dpavliuchkov/bga-pythia/blob/master/images/1%20coin.png?raw=true",
    2: "https://github.com/dpavliuchkov/bga-pythia/blob/master/images/2%20coins.png?raw=true",
    3: "https://github.com/dpavliuchkov/bga-pythia/blob/master/images/3%20coins.png?raw=true",
    4: "https://github.com/dpavliuchkov/bga-pythia/blob/master/images/4%20coins.png?raw=true",
    5: "https://github.com/dpavliuchkov/bga-pythia/blob/master/images/5%20coins.png?raw=true",
    6: "https://github.com/dpavliuchkov/bga-pythia/blob/master/images/6%20coins.png?raw=true",
    7: "https://github.com/dpavliuchkov/bga-pythia/blob/master/images/7%20coins.png?raw=true",
    8: "https://github.com/dpavliuchkov/bga-pythia/blob/master/images/8%20coins.png?raw=true",
    9: "https://github.com/dpavliuchkov/bga-pythia/blob/master/images/9%20coins.png?raw=true",
    10: "https://github.com/dpavliuchkov/bga-pythia/blob/master/images/10%20coins.png?raw=true",
    11: "https://github.com/dpavliuchkov/bga-pythia/blob/master/images/11%20coins.png?raw=true",
    12: "https://github.com/dpavliuchkov/bga-pythia/blob/master/images/12%20coins.png?raw=true",
    13: "https://github.com/dpavliuchkov/bga-pythia/blob/master/images/13%20coins.png?raw=true",
    14: "https://github.com/dpavliuchkov/bga-pythia/blob/master/images/14%20coins.png?raw=true",
};
const Military_Power_Icon = "https://github.com/dpavliuchkov/bga-pythia/blob/master/images/military-power-icon.png?raw=true";
const HD_Boards = "https://github.com/dpavliuchkov/bga-pythia/blob/master/images/boards_hd.jpg?raw=true";
const HD_Cards = "https://github.com/dpavliuchkov/bga-pythia/blob/master/images/cards_hd.jpg?raw=true&version=1";
 
// Main Pythia object
var pythia = {
    isStarted: false,
    isFinished: false,
    dojo: null,
    game: null,
    edition: null,
    isNewEdition: null,
    mainPlayer: null,
    currentAge: 1,
    playersCount: 0,
    players: [],
 
    // Init Pythia
    init: function() {
        this.isStarted = true;
        // Check if the site was loaded correctly
        if (!window.parent || !window.parent.dojo || !window.parent.gameui.gamedatas ||
            !window.parent.gameui.gamedatas.playerorder || !window.parent.gameui.gamedatas.playerorder[0] ||
            !window.parent.gameui.gamedatas.card_types || !window.parent.gameui.gamedatas.wonders) {
            return;
        }
        this.dojo = window.parent.dojo;
        this.game = window.parent.gameui.gamedatas;
        this.edition = parseInt(this.game.game_edition);
        this.isNewEdition = this.edition == 1;
 
        var playerOrder = this.game.playerorder;
        this.playersCount = playerOrder.length;
        this.mainPlayer = playerOrder[0];
        // local storage stores value as strings, so we need to parse "false" and "true" to get boolean
        this.settings = {
            "enableWarScores": localStorage.getItem("pythia-seetings-warscores") === null ?
                true : String(localStorage.getItem("pythia-seetings-warscores")) == "true",
            "enableRichBoards": localStorage.getItem("pythia-seetings-richboards") === null ?
                true : String(localStorage.getItem("pythia-seetings-richboards")) == "true",
            "enableCardPoints": localStorage.getItem("pythia-seetings-cardpoints") === null ?
                true : String(localStorage.getItem("pythia-seetings-cardpoints")) == "true",
            "enableHD": localStorage.getItem("pythia-seetings-hd") === null ?
                true : String(localStorage.getItem("pythia-seetings-hd")) == "true",
            "enableFullwidth": localStorage.getItem("pythia-seetings-fullwidth") === null ?
                false : String(localStorage.getItem("pythia-seetings-fullwidth")) == "true",
            "showMenu": localStorage.getItem("pythia-seetings-showmenu") === null ?
                true : String(localStorage.getItem("pythia-seetings-showmenu")) == "true",
        };
 
        for (var i = 0; i < this.playersCount; i++) {
            var playerId = playerOrder[i];
            this.players[playerId] = {
                hand: {},
                coins: 3,
                shields: 0,
                defeats: 0,
                bgaScore: 1,
                warScore: 0,
                wonder: 0,
                wonderStages: 0,
                maxWonderStages: 0,
                playedTypes: {
                    "raw": 0,
                    "man": 0,
                    "com": 0,
                    "mil": 0,
                    "civ": 0,
                    "sci": 0,
                    "gui": 0,
                },
                playedCards: {
                    "lighthouse": false,
                    "haven": false,
                    "ludus": false,
                    "chamberOfCommerce": false,
                    "shipownersGuild": false,
                },
                science: {
                    "gears": 0, // 1 in BGA
                    "tablets": 0, // 2 in BGA
                    "compasses": 0, // 3 in BGA
                    "jokers": 0, // ? in BGA
                }
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
 
            this.renderPythiaContainers(playerId);
        }
 
        this.renderPythiaMenu();
        this.setStyles();
 
        // Configure Pythia according to settings
        this.togglePythiaSettingPlayerCardsDisplay(true);
        this.togglePythiaSettingWarScoresDisplay(this.settings.enableWarScores);
        this.togglePythiaSettingRichBoardsDisplay(this.settings.enableRichBoards);
        this.togglePythiaSettingCardPointsDisplay(this.settings.enableCardPoints);
        this.togglePythiaSettingHDDisplay(this.settings.enableHD);
        this.togglePythiaSettingFullwidthDisplay(this.settings.enableFullwidth);
 
        // Connect event handlers to follow game progress
        this.dojo.subscribe("newHand", this, "recordHand");
        this.dojo.subscribe("cardsPlayed", this, "recordTurn");
        this.dojo.subscribe("coinDelta", this, "recordCoins");
        this.dojo.subscribe("discard", this, "recordDiscard");
        this.dojo.subscribe("newWonders", this, "recordWonderChoice");
        this.dojo.subscribe("wonderBuild", this, "recordWonderStage");
        this.dojo.subscribe("updateScore", this, "recordScoreUpdate");
        this.dojo.subscribe("warVictory", this, "recordWarResults");
        this.dojo.subscribe("newAge", this, "changeAge");
 
        if (Enable_Logging) console.log("PYTHIA: My eyes can see everything!");
        return this;
    },
 
    // Record which wonder each player has chosen
    recordWonderChoice: function(data) {
        if (Enable_Logging) console.log("PYTHIA: wonders chosen - I got", data);
 
        // Input check
        if (!data || !data.args || !data.args.wonders || !this.game || !this.game.wonders) {
            return;
        }
 
        const wonders = Object.keys(data.args.wonders);
        for (const playerId of wonders) {
            const wonderId = data.args.wonders[playerId]
            this.players[playerId].wonder = wonderId;
            this.players[playerId].maxWonderStages = Object.keys(this.game.wonders[wonderId].stages).length;
        }
    },
 
    // Check what came to main player in the new hand
    recordHand: function(data) {
        if (Enable_Logging) console.log("PYTHIA: new hand - I got", data);
 
        // Input check
        if (!data || !data.args || !data.args.cards) {
            return;
        }
 
        // Rotate old hands and render cards
        if (!this.isFirstTurn()) {
            this.passCards();
            this.renderPlayerCards();
            this.renderPlayerCardTooltips();
        }
        // Save new hand to main player
        this.players[this.mainPlayer].hand = data.args.cards;
 
        // Get card worth in victory points and coins and render it
        for (var cardId in data.args.cards) {
            const playedCard = data.args.cards[cardId];
            const cardWorth = this.calculateCardWorth(this.mainPlayer, playedCard.type);
            this.renderCardPoints(cardId, false, cardWorth.points, cardWorth.coins);
        }
    },
 
    // Process all cards played by all players
    recordTurn: function(data) {
        if (Enable_Logging) console.log("PYTHIA: cards played - I got", data);
 
        // Input check
        if (!data || !data.args || !data.args.cards) {
            return;
        }
 
        var warPlayed = false;
 
        // Cycle all played cards
        for (var cardId in data.args.cards) {
            const playedCard = data.args.cards[cardId];
            const originalCard = this.game.card_types[playedCard.type];
            const playerId = playedCard.location_arg;
            if (!originalCard.category) return; // Input check
 
            const cardCategory = originalCard.category;
 
            // Track if played card was military
            if (originalCard.shield) {
                warPlayed = true;
                this.players[playerId].shields += originalCard.shield;
                this.renderMilitaryPower(playerId);
            }
 
            // Update played scientific symbols
            if (originalCard.science) {
                this.increaseScienceCounter(playerId, originalCard.science);
            }
 
            // Update played card types array of the player
            this.players[playerId].playedTypes[cardCategory] += 1;
 
            // Track cards that we need for points worth feature
            this.increaseCardCounter(playerId, playedCard.type);
 
            // Delete played card
            if (isObjectEmpty(this.players[playerId].hand)) {
                continue;
            }
            delete this.players[playerId].hand[cardId];
        }
        if (warPlayed) {
            this.calculateWarScores();
        }
    },
 
    // If there was a trade, update how many coins each player has
    recordCoins: function(data) {
        if (Enable_Logging) console.log("PYTHIA: coins changed - I got", data);
 
        // Input check
        if (!data || !data.args || !data.args.coinddelta) {
            return;
        }
 
        this.players[data.args.player_id].coins += data.args.coinddelta;
    },
 
    // If main player discarded - we know what card it was
    recordDiscard: function(data) {
        if (Enable_Logging) console.log("PYTHIA: card discarded - I got", data);
 
        // Input check
        if (!data || !data.args || !data.args.card_id || !!data.channelorig) {
            return;
        }
 
        var player = data.channelorig.substring(9);
        delete this.players[player].hand[data.args.card_id];
    },
 
    // Record when a wonder stage was played
    recordWonderStage: function(data) {
        if (Enable_Logging) console.log("PYTHIA: wonder built - I got", data);
 
        // Input check
        if (!data || !data.args || !data.args.step || !data.args.player_id) {
            return;
        }
 
        const playerId = data.args.player_id;
        const stage = data.args.step;
        var wonderId = this.players[playerId].wonder;
 
        // We might have corrupted data, refresh it from the game HTML
        if (wonderId == 0) {
            const board = this.dojo.byId("player_board_wonder_" + playerId);
            switch (board.style.backgroundPositionY) {
                case "0%":
                    // Giza A
                    wonderId = 1;
                    break;
 
                case "7.69231%":
                    // Baby A
                    wonderId = 2;
                    break;
 
                case "15.3846%":
                    // Oly A
                    wonderId = 3;
                    break;
 
                case "23.0769%":
                    // Rho A
                    wonderId = 4;
                    break;
 
                case "30.7692%":
                    // Eph A
                    wonderId = 5;
                    break;
 
                case "38.4615%":
                    // Alex A
                    wonderId = 6;
                    break;
 
                case "46.1538%":
                    // Hali A
                    wonderId = 7;
                    break;
 
                case "53.8462%":
                    // Giza B
                    wonderId = 8;
                    break;
 
                case "61.5385%":
                    // Baby B
                    wonderId = 9;
                    break;
 
                case "69.2308%":
                    // Oly B
                    wonderId = 10;
                    break;
 
                case "76.9231%":
                    // Rho B
                    wonderId = 11;
                    break;
 
                case "84.6154%":
                    // Eph B
                    wonderId = 12;
                    break;
 
                case "92.3077%":
                    // Alex B
                    wonderId = 13;
                    break;
 
                case "100%":
                    // Hali B
                    wonderId = 14;
                    break;
            }
 
            this.players[playerId].wonder = wonderId;
        }
 
        this.players[playerId].wonderStages += 1; // increase a counter of built wonder stages
 
        // Game correctness check
        if (!this.game.wonders[wonderId] || !this.game.wonders[wonderId].stages ||
            !this.game.wonders[wonderId].stages[stage]) {
            return;
        }
 
        // If Rhodos built a stage - it could have shields
        if (this.game.wonders[wonderId].stages[stage].shield) {
            this.players[playerId].shields += this.game.wonders[wonderId].stages[stage].shield;
            this.calculateWarScores();
            this.renderMilitaryPower(playerId);
        }
 
        // If Babylon built a stage - it could have science
        if (this.game.wonders[wonderId].stages[stage].science) {
            this.increaseScienceCounter(playerId, this.game.wonders[wonderId].stages[stage].science);
        }
 
        // If Hali built a stage - it could have discard play
        if (this.game.wonders[wonderId].stages[stage].pickDiscarded) {
            this.calculateDiscardWorth(this);
        }
    },
 
    // Update internal scores as well
    recordScoreUpdate: function(data) {
        if (Enable_Logging) console.log("PYTHIA: scores updated - I got", data);
 
        // Input check
        if (!data || !data.args || !data.args.scores) {
            return;
        }
 
        const scores = Object.keys(data.args.scores);
        for (const playerId of scores) {
            this.players[playerId].bgaScore = data.args.scores[playerId];
            this.renderPlayerScore(playerId);
        }
 
        // Update leader & runnerup positions
        this.renderLeaderRunnerup();
    },
 
    // Process war results
    recordWarResults: function(data) {
        if (Enable_Logging) console.log("PYTHIA: war battle happened - I got", data);
 
        // Input check
        if (!data || !data.args || !data.args.points || !data.args.neighbour_id) {
            return;
        }
 
        // Save defeat tokens
        if (data.args.points > 0) {
            this.players[data.args.neighbour_id].defeats += 1;
        }
 
        // If this is the last war - do cleanup
        if (this.currentAge == 3) {
            this.finishGame();
        }
    },
 
    // Calculate additional score from shields
    calculateWarScores: function() {
        var currentPlayerId = this.mainPlayer;
        var i = 0;
        while (i < this.playersCount) {
            var thisPlayer = this.players[currentPlayerId];
            thisPlayer.warScore = 0;
 
            // Check battles with right neighbour
            var rightPlayer = this.players[thisPlayer.right];
            if (thisPlayer.shields > rightPlayer.shields) {
                this.increaseWarScore(currentPlayerId, this.currentAge);
            } else if (thisPlayer.shields < rightPlayer.shields) {
                this.decreaseWarScore(currentPlayerId, this.currentAge);
            }
 
            // Check battles with left neighbour
            var leftPlayer = this.players[thisPlayer.left];
            if (thisPlayer.shields > leftPlayer.shields) {
                this.increaseWarScore(currentPlayerId, this.currentAge);
            } else if (thisPlayer.shields < leftPlayer.shields) {
                this.decreaseWarScore(currentPlayerId, this.currentAge);
            }
 
            currentPlayerId = thisPlayer.right;
            i++;
        }
    },
 
    calculateDiscardWorth: function(that, counter = 1) {
        const discardWrapper = that.dojo.byId('discarded_wrap');
 
        // Check that we can see discard div, else wait
        if (discardWrapper.style.display == "block") {
            const discarded = that.dojo.query("#discarded div");
            for (var i in discarded) {
                const card = discarded[i];
                if (!card.style) {
                    continue;
                }
 
                // Calculate card position - the only way to find which card is actually in discard
                var posX, posY;
                if (that.isNewEdition) {
                    posX = -255 * parseInt(card.style.backgroundPositionX) / 100;
                    posY = -393 * parseInt(card.style.backgroundPositionY) / 100;
                } else {
                    posX = -parseInt(card.style.width) * parseInt(card.style.backgroundPositionX) / 100;
                    posY = -parseInt(card.style.height) * parseInt(card.style.backgroundPositionY) / 100;
                }
 
                var cardType = null;
                for (var j in that.game.card_types) {
                    const originalCard = that.game.card_types[j];
                    if (originalCard.backx == posX && originalCard.backy == posY) {
                        cardType = j;
                        break;
                    }
                }
 
                if (cardType) {
                    const cardWorth = that.calculateCardWorth(that.mainPlayer, cardType);
                    that.renderCardPoints(card.id.substr(15), true, cardWorth.points, cardWorth.coins);
                }
            }
        } else {
            if (counter > 10) {
                clearTimeout();
                return;
            }
 
            setTimeout(that.calculateDiscardWorth, 2000, that, counter + 1);
        }
    },
 
    // Get how many coins and victory points this card will bring to this player
    calculateCardWorth: function(playerId, cardType) {
        const leftPlayerId = this.players[playerId].left;
        const rightPlayerId = this.players[playerId].right;
 
        var worth = {
            points: null,
            coins: null,
        };
 
        switch (parseInt(cardType)) {
            // Raw materials
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
            case 8:
            case 9:
            case 10:
            case 28:
            case 28:
            case 30:
            case 31:
                if (this.players[playerId].playedCards.haven) {
                    worth.points += 1;
                }
                if (this.players[playerId].playedCards.shipownersGuild) {
                    worth.points += 1;
                }
                break;
 
 
            // Manufactured goods
            case 11:
            case 12:
            case 13:
            case 32:
            case 33:
            case 34:
            case 39:
            case 40:
                if (this.players[playerId].playedCards.shipownersGuild) {
                    worth.points += 1;
                }
                if (this.players[playerId].playedCards.chamberOfCommerce) {
                    worth.points += 2;
                }
                break;
 
            // Commercial cards
            case 18:
            case 19:
            case 20:
            case 21:
                if (this.players[playerId].playedCards.lighthouse) {
                    worth.points += 1;
                }
                break;
 
            // Military cards
            case 22:
            case 23:
            case 24:
            case 43:
            case 44:
            case 45:
            case 46:
            case 70:
            case 71:
            case 72:
            case 73:
            case 80:
                if (!this.game.card_types[cardType] || !this.game.card_types[cardType].shield) {
                    break;
                }
                worth.points = this.calculateMilitaryCardWorth(playerId, parseInt(this.game.card_types[cardType].shield));
                if (this.players[playerId].playedCards.ludus) {
                    worth.points += 1;
                }
                break;
 
            // Scientific symbols
            case 25:
            case 26:
            case 27:
            case 47:
            case 48:
            case 49:
            case 50:
            case 58:
            case 74:
            case 75:
            case 76:
            case 77:
            case 78:
                if (!this.game.card_types[cardType] || !this.game.card_types[cardType].science) {
                    break;
                }
                worth.points = this.calculateScienceCardWorth(playerId, this.game.card_types[cardType].science);
                break;
 
            // Age 2 commerce
            case 41: // Vineyard - coins for brown cards
                worth.coins = this.players[leftPlayerId].playedTypes["raw"] + this.players[rightPlayerId].playedTypes["raw"] +
                    this.players[playerId].playedTypes["raw"];
                if (this.players[playerId].playedCards.lighthouse) {
                    worth.points += 1;
                }
                break;
 
            case 42: // Bazaar - coins for grey cards
                worth.coins = (this.players[leftPlayerId].playedTypes["man"] + this.players[rightPlayerId].playedTypes["man"] +
                    this.players[playerId].playedTypes["man"]) * 2;
                if (this.players[playerId].playedCards.lighthouse) {
                    worth.points += 1;
                }
                break;
 
            // Age 3 guilds
            case 51: // Workers guild - brown cards
                worth.points = this.players[leftPlayerId].playedTypes["raw"] + this.players[rightPlayerId].playedTypes["raw"];
                if (this.players[playerId].playedCards.shipownersGuild) {
                    worth.points += 1;
                }
                break;
            case 52: // Craftsmens guild - grey cards
                worth.points = 2 * (this.players[leftPlayerId].playedTypes["man"] + this.players[rightPlayerId].playedTypes["man"]);
                if (this.players[playerId].playedCards.shipownersGuild) {
                    worth.points += 1;
                }
                break;
            case 53: // Traders guild - yellow cards
                worth.points = this.players[leftPlayerId].playedTypes["com"] + this.players[rightPlayerId].playedTypes["com"];
                if (this.players[playerId].playedCards.shipownersGuild) {
                    worth.points += 1;
                }
                break;
            case 54: // Philosopehrs guild - yellow cards
                worth.points = this.players[leftPlayerId].playedTypes["sci"] + this.players[rightPlayerId].playedTypes["sci"];
                if (this.players[playerId].playedCards.shipownersGuild) {
                    worth.points += 1;
                }
                break;
            case 55: // Spies guild - red cards
                worth.points = this.players[leftPlayerId].playedTypes["mil"] + this.players[rightPlayerId].playedTypes["mil"];
                if (this.players[playerId].playedCards.shipownersGuild) {
                    worth.points += 1;
                }
                break;
            case 56:
                if (this.isNewEdition) {
                    // Decorators guild - if all stages are built then 7 points
                    worth.points = this.players[playerId].wonderStages == this.players[playerId].maxWonderStages ? 7 : 0;
                } else {
                    // Strategist guild - defeat tokens
                    worth.points = this.players[leftPlayerId].defeats + this.players[rightPlayerId].defeats;
                }
                if (this.players[playerId].playedCards.shipownersGuild) {
                    worth.points += 1;
                }
                break;
            case 57: // Shipowners guild - own brown grey purple cards
                worth.points = this.players[playerId].playedTypes["raw"] + this.players[playerId].playedTypes["man"] +
                    this.players[playerId].playedTypes["gui"] + 1;
                break;
            case 59: // Magistrates guild - blue cards
                worth.points = this.players[leftPlayerId].playedTypes["civ"] + this.players[rightPlayerId].playedTypes["civ"];
                if (this.players[playerId].playedCards.shipownersGuild) {
                    worth.points += 1;
                }
                break;
            case 60: // Builders guild - wonder stages]
                worth.points = this.players[playerId].wonderStages + this.players[leftPlayerId].wonderStages +
                    this.players[rightPlayerId].wonderStages;
                if (this.players[playerId].playedCards.shipownersGuild) {
                    worth.points += 1;
                }
                break;
 
            // Age 3 commerce
            case 66: // Haven - coins and points for own brown cards
                worth.coins = this.players[playerId].playedTypes["raw"];
                worth.points = this.players[playerId].playedTypes["raw"];
                if (this.players[playerId].playedCards.lighthouse) {
                    worth.points += 1;
                }
                break;
            case 67: // Lighthouse - coins and points for own yellow cards
                worth.coins = this.players[playerId].playedTypes["com"] + 1;
                worth.points = this.players[playerId].playedTypes["com"] + 1;
                break;
            case 68: // Chamber of commerce - coins and points for own grey cards
                worth.coins = this.players[playerId].playedTypes["man"] * 2;
                worth.points = this.players[playerId].playedTypes["man"] * 2;
                if (this.players[playerId].playedCards.lighthouse) {
                    worth.points += 1;
                }
                break;
            case 69: // Arena - coins and points for own wonder stages
                worth.coins = this.players[playerId].wonderStages * 3;
                worth.points = this.players[playerId].wonderStages;
                if (this.players[playerId].playedCards.lighthouse) {
                    worth.points += 1;
                }
                break
            case 79: // Ludus - coins and points for own military stages
                worth.coins = this.players[playerId].playedTypes["mil"] * 3;
                worth.points = this.players[playerId].playedTypes["mil"];
                if (this.players[playerId].playedCards.lighthouse) {
                    worth.points += 1;
                }
                break;
        }
 
        return worth;
    },
 
    // How will war score change if a player gets extra shields
    calculateMilitaryCardWorth: function(playerId, extraShields) {
        // Input check
        if (!playerId || !this.players[playerId]) {
            return 0;
        }
 
        var thisPlayer = this.players[playerId];
        var newWarScore = 0;
 
        // Check battles with right neighbour
        var rightPlayer = this.players[thisPlayer.right];
        if ((thisPlayer.shields + extraShields) > rightPlayer.shields) {
            newWarScore += War_Points_Per_Age[this.currentAge];
        } else if ((thisPlayer.shields + extraShields) < rightPlayer.shields) {
            newWarScore -= 1;
        }
 
        // Check battles with left neighbour
        var leftPlayer = this.players[thisPlayer.left];
        if ((thisPlayer.shields + extraShields) > leftPlayer.shields) {
            newWarScore += War_Points_Per_Age[this.currentAge];
        } else if ((thisPlayer.shields + extraShields) < leftPlayer.shields) {
            newWarScore -= 1;
        }
 
        return newWarScore - thisPlayer.warScore;
    },
 
    // How many points will this science card bring to a player?
    calculateScienceCardWorth: function(playerId, newSymbol) {
        // Input check
        if (!playerId || !this.players[playerId] || !this.players[playerId].science) {
            return;
        }
 
        const playerScience = this.players[playerId].science;
        const sciencePointsNow = this.calculateSciencePoints(playerScience.gears, playerScience.tablets,
            playerScience.compasses, playerScience.jokers);
        var sciencePointsAfter = null;
 
        switch (newSymbol) {
            case 1:
                sciencePointsAfter = this.calculateSciencePoints(playerScience.gears + 1,
                    playerScience.tablets, playerScience.compasses, playerScience.jokers);
                break;
 
            case 2:
                sciencePointsAfter = this.calculateSciencePoints(playerScience.gears,
                    playerScience.tablets + 1, playerScience.compasses, playerScience.jokers);
                break;
 
            case 3:
                sciencePointsAfter = this.calculateSciencePoints(playerScience.gears,
                    playerScience.tablets, playerScience.compasses + 1, playerScience.jokers);
                break;
 
            case "?":
                sciencePointsAfter = this.calculateSciencePoints(playerScience.gears,
                    playerScience.tablets, playerScience.compasses, playerScience.jokers + 1);
                break;
 
            default:
                break;
        }
 
        return sciencePointsAfter - sciencePointsNow;
    },
 
    // How many points will a science set bring?
    calculateSciencePoints: function(gears, tablets, compasses, jokers) {
        // Joker can be any symbol, calculate each option with recursion if we have them
        if (jokers > 0) {
            const pointsWithJokerGear = this.calculateSciencePoints(gears + 1, tablets, compasses, jokers - 1);
            const pointsWithJokerTablet = this.calculateSciencePoints(gears, tablets + 1, compasses, jokers - 1);
            const pointsWithJokerCompass = this.calculateSciencePoints(gears, tablets, compasses + 1, jokers - 1);
 
            return Math.max(pointsWithJokerGear, pointsWithJokerTablet, pointsWithJokerCompass);
        } else {
            // No jokers - calculate according to the rules
            var points = gears * gears + tablets * tablets + compasses * compasses; // individual symbols
            points += 7 * Math.min(gears, tablets, compasses); // set of 3
 
            return points;
        }
    },
 
    // Cleanup things between ages
    changeAge: function(data) {
        if (Enable_Logging) console.log("PYTHIA: new age - I got", data);
 
        this.currentAge += 1;
 
        // Recalculate war scores for the new age
        this.calculateWarScores();
 
        const keys = Object.keys(this.players);
        for (const playerId of keys) {
            // Clean player hands and update total scores
            this.players[playerId].hand = {};
            this.renderPlayerScore(playerId);
            this.renderLeaderRunnerup();
        }
 
        // Clean rendered cards from previous age
        this.dojo.query("." + Player_Cards_Div_Class).forEach(this.dojo.empty);
    },
 
    // Cleanup Pythia when the game is done
    finishGame: function() {
        this.isFinished = true;
        this.togglePythiaSettingRichBoardsDisplay(false);
        this.togglePythiaSettingWarScoresDisplay(false);
        this.togglePythiaSettingPlayerCardsDisplay(false);
    },
 
    // Add war scores based on the age
    increaseWarScore: function(playerId, age) {
        this.players[playerId].warScore += War_Points_Per_Age[age];
    },
    // Decrase war scores
    decreaseWarScore: function(playerId, age) {
        this.players[playerId].warScore -= 1;
    },
 
    // Add a counter to played science symbols
    increaseScienceCounter: function(player, symbol) {
        switch (symbol) {
            case 1:
                this.players[player].science.gears += 1;
                break;
            case 2:
                this.players[player].science.tablets += 1;
                break;
            case 3:
                this.players[player].science.compasses += 1;
                break;
            case "?":
                this.players[player].science.jokers += 1;
                break;
            default:
                break;
        }
    },
 
    // Track if certain card was player by hte player, needed for Card Worth function
    increaseCardCounter: function(playerId, cardType) {
        switch (parseInt(cardType)) {
            case 57: // Shipowners guild - own brown grey purple cards
                this.players[playerId].playedCards.shipownersGuild = true;
                break;
            case 66: // Haven - coins and points for own brown cards
                this.players[playerId].playedCards.haven = true;
                break;
            case 67: // Lighthouse - coins and points for own yellow cards
                this.players[playerId].playedCards.lighthouse = true;
                break;
            case 68: // Chamber of commerce - coins and points for own grey cards
                this.players[playerId].playedCards.chamberOfCommerce = true;
                break;
            case 79: // Ludus - coins and points for own military stages
                this.players[playerId].playedCards.ludus = true;
                break;
        }
    },
 
    // Move cards unplayed cards between players
    passCards: function() {
        // This should be counter to age direction, because
        // Pythia always passes starting from the last player
        var direction = this.currentAge == 2 ? "right" : "left";
        var currentPlayerId = this.mainPlayer;
        var i = 0;
        while (i < this.playersCount) {
            var neighborId = this.players[currentPlayerId][direction];
            this.players[neighborId].hand = this.players[this.players[neighborId][direction]].hand;
            currentPlayerId = neighborId;
            i++;
        }
    },
 
    // Render player containers
    renderPythiaContainers: function(playerId) {
        // Insert war score container in scores table
        if (!this.dojo.byId(Player_Score_Id_Prefix + playerId)) {
            this.dojo.place(
                "<span id='" + Player_Score_Id_Prefix + playerId + "'" +
                "class='player_score_value " + Player_Score_Span_Class + "'> (1)</span>",
                BGA_Player_Score_Id_Prefix + playerId,
                "after");
        }
 
        // Insert military power container on player board
        if (!this.dojo.byId(Player_Military_Power_Id_Prefix + playerId)) {
            const refNode = this.dojo.query("#" + BGA_Player_Board_Id_Prefix + playerId + " .sw_coins");
            if (refNode && refNode[0]) {
                this.dojo.place(
                    "<div id='" + Player_Military_Power_Id_Prefix + playerId + "' class='pythia_player_military_power'>" +
                    "<img src='" + Military_Power_Icon + "'/><span>0</span></div>",
                    refNode[0],
                    "last");
            }
        }
 
        // Insert war score container on player board
        if (!this.dojo.byId(Player_War_Score_Id_Prefix + playerId)) {
            const refNode = this.dojo.query("#" + BGA_Player_Board_Id_Prefix + playerId + " .sw_coins");
            if (refNode && refNode[0]) {
                this.dojo.place(
                    "<div id='" + Player_War_Score_Id_Prefix + playerId + "' class='pythia_player_war_score'>" +
                    "<i class='fa fa-star'></i><span>1 (1)</span></div>",
                    refNode[0],
                    "first");
            }
        }
 
        // Skip card container for main player and if already rendered
        if (playerId == this.mainPlayer || this.dojo.byId(Player_Cards_Id_Prefix + playerId)) {
            return;
        }
        // Insert card container on player board
        this.dojo.place("<div id='" + Player_Cards_Id_Prefix + playerId + "'" +
            " class='" + Player_Cards_Div_Class + "'></div>",
            BGA_Player_Board_Id_Prefix + playerId,
            "first");
    },
 
    // Render player hands
    renderPlayerCards: function() {
        const keys = Object.keys(this.players);
        for (const playerId of keys) {
            if (playerId == this.mainPlayer || isObjectEmpty(this.players[playerId].hand)) {
                continue;
            }
 
            var cardsHTML = "";
            var left = 1;
            for (var card in this.players[playerId].hand) {
                var playedCard = this.game.card_types[this.players[playerId].hand[card].type];
                var posX = -playedCard.backx;
                var posY = -playedCard.backy;
                const cardHtmlId = Player_Hand_Card_Id_Prefix + card;
 
                cardsHTML += "<div id='" + cardHtmlId + "' style='left: " + left + "px;'>"
                cardsHTML += "<div style='background-position: " + posX + "px " + posY + "px;'>";
                cardsHTML += "<span>" + playedCard.nametr + "</span></div></div>";
 
                left += 79;
            }
            this.dojo.place(cardsHTML, Player_Cards_Id_Prefix + playerId, "only");
        }
    },
 
 
    // Render tooltips for cards in player hands
    renderPlayerCardTooltips: function() {
        const keys = Object.keys(this.players);
        for (const playerId of keys) {
            if (playerId == this.mainPlayer || isObjectEmpty(this.players[playerId].hand)) {
                continue;
            }
            for (var card in this.players[playerId].hand) {
                const tooltipId = "player_hand_item_" + card;
 
                // Game correctness check
                if (!window.parent.gameui.addTooltipHtml || !window.parent.gameui.tooltips ||
                    !window.parent.gameui.tooltips[tooltipId] || !window.parent.gameui.tooltips[tooltipId].label) {
                    continue;
                }
 
                window.parent.gameui.addTooltipHtml(Player_Hand_Card_Id_Prefix + card, window.parent.gameui.tooltips[tooltipId].label);
            }
        }
    },
 
    // Update total player score
    renderPlayerScore: function(playerId, score = 0) {
        if (this.isFinished) {
            return;
        }
 
        var playerScore = this.dojo.byId(Player_Score_Id_Prefix + playerId);
        if (playerScore) {
            const totalScore = this.players[playerId].bgaScore + this.players[playerId].warScore;
            playerScore.innerHTML = " (" + totalScore + ")";
            this.dojo.query("#" + Player_War_Score_Id_Prefix + playerId + " span")[0]
                .innerHTML = this.players[playerId].bgaScore + " (" + totalScore + ")";
        }
    },
 
    // Add border and position of leader and runnerup players
    renderLeaderRunnerup: function() {
        if (!this.settings.enableRichBoards || this.isFinished) {
            return;
        }
 
        // Clean previous leader & runnerup
        this.dojo.query("." + Player_Leader_Class + ", ." + Player_Runnerup_Class)
            .removeClass([Player_Leader_Class, Player_Runnerup_Class]);
 
        // Find leader and runner ups
        var totalScores = [];
        const keys = Object.keys(this.players);
        for (const playerId of keys) {
            totalScores.push(
                [playerId,
                    this.players[playerId].bgaScore + this.players[playerId].warScore,
                    this.players[playerId].coins
                ]);
        }
 
        totalScores.sort(function(a, b) {
            return b[1] - a[1] || b[2] - a[2];;
        });
 
        // Mark new ones
        this.dojo.addClass(BGA_Player_Board_Id_Prefix + totalScores[0][0], Player_Leader_Class);
        this.dojo.addClass(BGA_Player_Board_Id_Prefix + totalScores[1][0], Player_Runnerup_Class);
    },
 
    // Add laurel wreath and coins icons on top of the card container
    renderCardPoints: function(cardId, isDiscard = false, pointsWorth = null, coinsWorth = null) {
        // Leave if card has no worth info
        if (pointsWorth === null && coinsWorth === null) {
            return;
        }
 
        // Clean up previous worth in case we saw this card already
        const containerId = isDiscard ? Discard_Card_Worth_Id_Prefix + cardId : Card_Worth_Id_Prefix + cardId;
        this.dojo.destroy(containerId);
 
        // Build HTML
        const extraClass = this.settings.enableCardPoints ? "" : "pythia_hidden";
        var html = "<span id='" + containerId + "' class='" + Card_Worth_Class + " " + extraClass + "'>";
        if (coinsWorth !== null) {
            html += "<img class='" + Card_Worth_Coins_Class + "' src='" + Coins_Image[coinsWorth] + "' />";
        }
        if (pointsWorth !== null) {
            html += "<img src='" + Victory_Points_Image[pointsWorth] + "' />";
        }
        html += "</span>";
 
        if (isDiscard) {
            this.dojo.place(html, "discarded_item_" + cardId, "only");
        } else {
            this.dojo.place(html, "cardmenu_" + cardId, "after");
        }
    },
 
    // Render shields icon next to player coins
    renderMilitaryPower: function(playerId) {
        if (!playerId || !this.players[playerId] || this.isFinished) {
            return;
        }
 
        var container = this.dojo.query("#" + Player_Military_Power_Id_Prefix + playerId + " span");
        if (container[0]) {
            container[0].innerHTML = this.players[playerId].shields;
        }
    },
 
    // Render Pythia menu
    renderPythiaMenu: function() {
        var menuHtml = "<div id='pythia_menu'>";
        menuHtml += "<div class='menu_header'>";
        menuHtml += "<h3>PYTHIA v" + GM_info.script.version + "</h3>";
 
        // Show or hide Pythia menu based on the setting
        if (this.settings.showMenu) {
            menuHtml += "<div id='pythia_menu_list_toggle' class='toggle_container'><a href='javascript:void(0)' class='collapser' data-target='#pythia_menu .menu_content'>(collapse menu)</a>";
            menuHtml += "<a href='javascript:void(0)' class='expander pythia_hidden' data-target='#pythia_menu .menu_content'>(expand menu)</a>";
            menuHtml += "</div></div>";
            menuHtml += "<div class='menu_content'>";
        } else {
            menuHtml += "<div id='pythia_menu_list_toggle' class='toggle_container'><a href='javascript:void(0)' class='collapser pythia_hidden' data-target='#pythia_menu .menu_content'>(collapse menu)</a>";
            menuHtml += "<a href='javascript:void(0)' class='expander' data-target='#pythia_menu .menu_content'>(expand menu)</a>";
            menuHtml += "</div></div>";
            menuHtml += "<div class='menu_content pythia_hidden'>";
        }
 
        // Card Points setting
        menuHtml += "<div id='pythia_menu_cardpoints' class='menu_item'><span class='title'>Cards Worth:</span>";
        menuHtml += "<span class='status'>Enabled</span><button type='button'>Disable</button></div>";
 
        // Rich Boards setting
        menuHtml += "<div id='pythia_menu_richboards' class='menu_item'><span class='title'>Rich Boards:</span>";
        menuHtml += "<span class='status'>Enabled</span><button type='button'>Disable</button></div>";
 
        // War scores setting
        menuHtml += "<div id='pythia_menu_warscores' class='menu_item'><span class='title'>War Scores:</span>";
        menuHtml += "<span class='status'>Enabled</span><button type='button'>Disable</button></div>";
 
        // HD images setting
        menuHtml += "<div id='pythia_menu_hd' class='menu_item'><span class='title'>HD Images:</span>";
        menuHtml += "<span class='status'>Enabled</span><button type='button'>Disable</button></div>";
 
        // Fullwidth setting
        menuHtml += "<div id='pythia_menu_fullwidth' class='menu_item'><span class='title'>Full Width:</span>";
        menuHtml += "<span class='status'>Enabled</span><button type='button'>Disable</button></div>";
 
        menuHtml += "</div>";
        menuHtml += "</div>";
        this.dojo.place(menuHtml, "logs_wrap", "before");
 
        // Set correct texts based on settings
        this.togglePythiaSettingText("pythia_menu_warscores", this.settings.enableWarScores);
        this.togglePythiaSettingText("pythia_menu_richboards", this.settings.enableRichBoards);
        this.togglePythiaSettingText("pythia_menu_cardpoints", this.settings.enableCardPoints);
        this.togglePythiaSettingText("pythia_menu_hd", this.settings.enableHD);
        this.togglePythiaSettingText("pythia_menu_fullwidth", this.settings.enableFullwidth);
 
        // Connect event handlers
        this.dojo.connect(this.dojo.query("button", "pythia_menu_warscores")[0], "onclick", this, "togglePythiaSettingWarScores");
        this.dojo.connect(this.dojo.query("button", "pythia_menu_richboards")[0], "onclick", this, "togglePythiaSettingRichBoards");
        this.dojo.connect(this.dojo.query("button", "pythia_menu_cardpoints")[0], "onclick", this, "togglePythiaSettingCardPoints");
        this.dojo.connect(this.dojo.query("button", "pythia_menu_hd")[0], "onclick", this, "togglePythiaSettingHD");
        this.dojo.connect(this.dojo.query("button", "pythia_menu_fullwidth")[0], "onclick", this, "togglePythiaSettingFullwidth");
 
        // Expand & collapse menu handlers
        this.dojo.connect(this.dojo.query(".menu_header .collapser")[0], "onclick", this, "togglePythiaSettingMenu");
        this.dojo.connect(this.dojo.query(".menu_header .expander")[0], "onclick", this, "togglePythiaSettingMenu");
        this.dojo.connect(this.dojo.query(".menu_header .collapser")[0], "onclick", this, "toggleCollapserExpander");
        this.dojo.connect(this.dojo.query(".menu_header .expander")[0], "onclick", this, "toggleCollapserExpander");
    },
 
    // Enable or disable display of cards in player hands
    togglePythiaSettingPlayerCardsDisplay: function(pleaseShow) {
        if (pleaseShow) {
            this.dojo.query("." + Player_Cards_Div_Class).removeClass("pythia_hidden");
            this.dojo.query(".sw_coins", "boardspaces").addClass("pythia_player_cards_enabled");
        } else {
            this.dojo.query("." + Player_Cards_Div_Class).addClass("pythia_hidden");
            this.dojo.query(".sw_coins", "boardspaces").removeClass("pythia_player_cards_enabled");
        }
    },
 
    // Enable or disable display of war scores
    togglePythiaSettingWarScores: function(event) {
        this.settings.enableWarScores = !this.settings.enableWarScores;
        localStorage.setItem("pythia-seetings-warscores", this.settings.enableWarScores);
        this.togglePythiaSettingWarScoresDisplay(this.settings.enableWarScores);
        this.togglePythiaSettingText(event.target.parentNode.id, this.settings.enableWarScores);
    },
    togglePythiaSettingWarScoresDisplay: function(pleaseShow) {
        if (pleaseShow) {
            this.dojo.query("." + Player_Score_Span_Class).removeClass("pythia_hidden");
        } else {
            this.dojo.query("." + Player_Score_Span_Class).addClass("pythia_hidden");
        }
    },
 
    // Enable or disable display of leader and runnerup positions
    togglePythiaSettingRichBoards: function(event) {
        this.settings.enableRichBoards = !this.settings.enableRichBoards;
        localStorage.setItem("pythia-seetings-richboards", this.settings.enableRichBoards);
        this.togglePythiaSettingRichBoardsDisplay(this.settings.enableRichBoards);
        this.togglePythiaSettingText(event.target.parentNode.id, this.settings.enableRichBoards);
    },
    togglePythiaSettingRichBoardsDisplay: function(pleaseShow) {
        if (pleaseShow) {
            this.renderLeaderRunnerup();
            this.dojo.query(".pythia_player_war_score").removeClass("pythia_hidden");
            this.dojo.query(".pythia_player_military_power").removeClass("pythia_hidden");
        } else {
            this.dojo.query("." + Player_Leader_Class + ", ." + Player_Runnerup_Class)
                .removeClass([Player_Leader_Class, Player_Runnerup_Class]);
 
            this.dojo.query(".pythia_player_war_score").addClass("pythia_hidden");
            this.dojo.query(".pythia_player_military_power").addClass("pythia_hidden");
        }
    },
 
    // Enable or disable display of cards points worth
    togglePythiaSettingCardPoints: function(event) {
        this.settings.enableCardPoints = !this.settings.enableCardPoints;
        localStorage.setItem("pythia-seetings-cardpoints", this.settings.enableCardPoints);
        this.togglePythiaSettingCardPointsDisplay(this.settings.enableCardPoints);
        this.togglePythiaSettingText(event.target.parentNode.id, this.settings.enableCardPoints);
    },
    togglePythiaSettingCardPointsDisplay: function(pleaseShow) {
        if (pleaseShow) {
            this.dojo.query("." + Card_Worth_Class).removeClass("pythia_hidden");
        } else {
            this.dojo.query("." + Card_Worth_Class).addClass("pythia_hidden");
        }
    },
 
    // Enable or disable HD graphics
    togglePythiaSettingHD: function(event) {
        this.settings.enableHD = !this.settings.enableHD;
        localStorage.setItem("pythia-seetings-hd", this.settings.enableHD);
        this.togglePythiaSettingHDDisplay(this.settings.enableHD);
        this.togglePythiaSettingText(event.target.parentNode.id, this.settings.enableHD);
    },
    togglePythiaSettingHDDisplay: function(pleaseShow) {
        this.dojo.query("body").toggleClass("pythia_hd", pleaseShow);
    },
 
    // Hide or show elements for fullwidth mode
    togglePythiaSettingFullwidth: function(event) {
        this.settings.enableFullwidth = !this.settings.enableFullwidth;
        localStorage.setItem("pythia-seetings-fullwidth", this.settings.enableFullwidth);
        this.togglePythiaSettingFullwidthDisplay(this.settings.enableFullwidth);
        this.togglePythiaSettingText(event.target.parentNode.id, this.settings.enableFullwidth);
    },
    togglePythiaSettingFullwidthDisplay: function(pleaseShow) {
        this.dojo.query("body").toggleClass("pythia_fullwidth", pleaseShow);
        this.dojo.toggleClass("right-side-first-part", "pythia_hidden", pleaseShow);
        this.dojo.toggleClass("logs_wrap", "pythia_hidden", pleaseShow);
    },
 
    togglePythiaSettingMenu: function(event) {
        this.settings.showMenu = event.target.className == "expander";
        localStorage.setItem("pythia-seetings-showmenu", this.settings.showMenu);
    },
 
    // Switch enable/disable text in Pythia settings
    togglePythiaSettingText: function(parentId, isEnabled) {
        if (isEnabled) {
            this.dojo.query(".status", parentId)
                .addClass("enabled")
                .removeClass("disabled")[0]
                .innerHTML = "Enabled";
            this.dojo.query("button", parentId)[0].innerHTML = "Disable";
        } else {
            this.dojo.query(".status", parentId)
                .addClass("disabled")
                .removeClass("enabled")[0]
                .innerHTML = "Disabled";
            this.dojo.query("button", parentId)[0].innerHTML = "Enable";
        }
    },
 
    // Toggle hide / show of any visual element given data-target
    toggleCollapserExpander: function(event) {
        this.dojo.query(".collapser, .expander", event.target.parentNode).toggleClass("pythia_hidden");
        this.dojo.query(event.target.getAttribute('data-target')).toggleClass("pythia_hidden");
    },
 
    // Is this the first turn of the age?
    isFirstTurn: function() {
        return isObjectEmpty(this.players[this.mainPlayer].hand);
    },
 
    // Set Pythia CSS styles
    setStyles: function() {
        this.dojo.query("body").addClass("pythia_enabled");
        this.dojo.place(
            "<style type='text/css' id='Pythia_Styles'>" +
            // Generic settings
            ".pythia_player_cards_enabled.sw_coins { top: 50px; } " +
            ".pythia_enabled.arena_mode .player_elo_wrap { visibility: visible; }" +
            ".pythia_enabled #player_board_wrap_" + this.mainPlayer + " .sw_coins { top: 0px; } " +
            ".pythia_enabled #player_hand_wrap { padding-top: 58px; } " +
            ".pythia_enabled #discarded_wrap h3 { padding-bottom: 60px; } " +
            ".pythia_enabled #howto_tutorial { display: none; } " +
            ".pythia_enabled .pythia_hidden { display: none; } " +
            ".pythia_enabled .toggle_container { display: inline; } " +
 
            // Pythia menu
            "#pythia_menu { font-size: 14px; padding: 10px; position: relative; background-color: #e9d6bf; border: 1px solid black; border-radius: 5px; } " +
            "#pythia_menu .menu_header h3 { display: inline; } " +
            "#pythia_menu .menu_header a { margin-left: 5px; } " +
            "#pythia_menu .menu_content { margin-top: 10px; } " +
            "#pythia_menu .menu_item { height: 26px; } " +
            "#pythia_menu .menu_item span.title { width: 90px; display: inline-block;} " +
            "#pythia_menu .menu_item span.status { text-align: center; width: 55px; display: inline-block; } " +
            "#pythia_menu .menu_item span.status.enabled { color: green; } " +
            "#pythia_menu .menu_item span.status.disabled { color: red; } " +
            "#pythia_menu .menu_item button { width: 60px; padding: 3px; border-radius: 5px; margin-left: 10px; } " +
 
            // Player cards
            "." + Player_Cards_Div_Class + " { display: block; height: 50px; } " +
            "." + Player_Cards_Div_Class + " div { position: absolute; top: 11px; } " +
            "." + Player_Cards_Div_Class + " div div { background-image: url(" + Cards_Image + "); width: 128px; height: 45px; zoom: 0.6; } " +
            "." + Player_Cards_Div_Class + " div div span { width: 100%; text-align: center; position: absolute; left: 0; top: -25px; font-size: 18px; color: black; cursor: default; } " +
 
            // Rich boards
            "." + Player_Leader_Class + ", ." + Player_Runnerup_Class + " { border: 5px solid; } " +
            "." + Player_Leader_Class + " { border-color: green; } " +
            "." + Player_Runnerup_Class + " { border-color: red; border-style: inset; } " +
            "." + Player_Leader_Class + " h3::before, ." + Player_Runnerup_Class + " h3::before { float: left; margin-top: -4px; white-space: pre; }" +
            "." + Player_Leader_Class + " h3::before { content: '(Leader) '; color: green; }" +
            "." + Player_Runnerup_Class + " h3::before { content: '(Runner up) '; color: red; }" +
            ".pythia_player_military_power { display: inline; position: relative; top: 3px; }" +
            ".pythia_player_military_power img { width: 30px; padding: 0 4px; }" +
            ".pythia_player_military_power span { position: relative; top: -7px; }" +
            ".pythia_player_war_score { display: inline; padding-right: 4px; position: relative; top: -1px; }" +
            ".pythia_player_war_score i { font-size: 32px; }" +
            ".pythia_player_war_score span { padding-left: 4px; position: relative; top: -3px; }" +
 
            // Cards worth
            "." + Card_Worth_Class + " { position: absolute; top: -53px; left: 6px; width: 128px; text-align: center; }" +
            "." + Card_Worth_Class + " img { width: 48px; }" +
            "." + Card_Worth_Class + " img." + Card_Worth_Coins_Class + " { position: relative; top: -3px; }" +
 
            // War scores
            "." + Player_Score_Span_Class + " { display: inline; }" +
 
            // Fullwidth view
            ".pythia_fullwidth #left-side { margin-right: 0px; } " +
 
            // New edition styles
            ".new_edition ." + Player_Cards_Div_Class + " div div { background-image: url(" + Cards_Image_V2 + "); width: 255px; height: 110px; zoom: 0.3; text-align: center;} " +
            ".new_edition ." + Player_Cards_Div_Class + " div div span { font-size: 18px; top: 7px; } " +
            ".new_edition .last_board_item { padding-right: 2px; } " +
            ".new_edition .last_board_item .board_item { border-width: 4px; margin: -2px 0 0 -2px; border-color: greenyellow; border-style: outset; } " +
            ".new_edition .last_step_item { border-width: 4px; margin: -4px 0 0 -4px; border-color: greenyellow; border-style: outset; } " +
 
            // New edition HD boards
            "#pythia_menu_hd { display: none; } " +
            ".new_edition #pythia_menu_hd { display: block; } " +
            ".new_edition.pythia_hd .wonder_face, .new_edition.pythia_hd .player_board_wonder { background-size: 450px 3122px; background-image: url(" + HD_Boards + "); }" +
 
            "</style>", "sevenwonder_wrap", "last");
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
 
// Everything starts here
var onload = async function() {
    if (Is_Inside_Game) {
        await sleep(3000); // Wait for BGA to load dojo and 7W scripts
        if (!window.parent || !window.parent.gameui || !window.parent.gameui.game_name ||
            window.parent.gameui.game_name != "sevenwonders") {
            return;
        }
 
        // Prevent multiple launches
        if (window.parent.isPythiaStarted) {
            return;
        } else {
            if (Enable_Logging) console.log("PYTHIA: I have come to serve you");
            window.parent.isPythiaStarted = true;
            window.parent.pythia = pythia.init();
        }
    }
};
 
if (document.readyState === "complete") {
    onload();
} else {
    (addEventListener || attachEvent).call(window, addEventListener ? "load" : "onload", onload);
}