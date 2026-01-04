// ==UserScript==
// @name         Pick Simulation
// @version      1.0.2
// @description  Try to take over the world!
// @match https://www.warzone.com/MultiPlayer*
// @icon https://i.imgur.com/wuBFFRv.png
// @namespace https://greasyfork.org/users/10154
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/396097/Pick%20Simulation.user.js
// @updateURL https://update.greasyfork.org/scripts/396097/Pick%20Simulation.meta.js
// ==/UserScript==


$(document).ready(function () {
    console.log("script started");

    var gameMenu = $(".game-menu");
    console.log(gameMenu);
    if (gameMenu.length !== 0) {
        var interval = window.setInterval(function () {
            if (typeof UJS_Hooks != "undefined") {
                window.clearInterval(interval);
                if (getTurnNumber() === -1) {
                    setupMenus();
                }
            }
        }, 100);
    }
});

function setupMenus() {
    setupStorePicks();
    setupLoadPicks();
    setupSimulate();
    setupDeleteSlot();
    setupImport();
    setupExport();
    setupTerritoryIds();
}

function createSimulateSubMenuEntry(slot1, slot2) {
    createUJSSubMenuEntry("simulate-picks", slot1 + " vs. " + slot2,
        (function (i, j) {
            return function () {
                simulate(i, j);
            }
        })(slot1, slot2));
}

function setupSimulate() {
    $("#simulate-picks").remove();
    createUJSExpandableSubMenu("Simulate picks", "simulate-picks");
    var slots = Object.keys(getSlots(getGameId()));
    slots.forEach(function (slot1) {
        var slots = Object.keys(getSlots(getGameId()));
        slots.forEach(function (slot2) {
            createSimulateSubMenuEntry(slot1, slot2);
        });
    });
}

function setupDeleteSlot() {
    $("#delete-slot").remove();
    createUJSExpandableSubMenu("Delete picks", "delete-slot");
    var slots = Object.keys(getSlots(getGameId()));
    slots.forEach(function (slot) {
        createUJSSubMenuEntry("delete-slot", slot,
            (function (s) {
                return function () {
                    deleteSlot(s);
                    setupMenus();
                }
            })(slot));
    });
}

function deleteSlot(slot) {
    var rawData = localStorage["pickSimulation"];
    var data = rawData === undefined ? {} : JSON.parse(rawData);
    delete data[getGameId()][slot];
    localStorage["pickSimulation"] = JSON.stringify(data);
}

function setupTerritoryIds() {
    $("#show-territory-ids").remove();
    createUJSSubMenu("Show territory ids", "show-territory-ids", function () {
        clearMyOrders();
        clearTeammatesOrders();
        // Assign pickable territories to player
        $.each(getAllTerritories(), function (k, v) {
            if (v.OwnerPlayerID === -2) {
                v.OwnerPlayerID = getMyId();
            }
        });
        //Set territory id as number of armies
        $.each(getAllTerritories(), function (k, v) {
            v.NumArmies._numArmies = v.ID
        });
        triggerColorRefresh();
    });
}

function getGameId() {
    return UJS_Hooks.Links.GameID;
}

function setupImport() {
    $("#import-picks").remove();
    createUJSExpandableSubMenu("Import picks", "import-picks");
    createUJSSubMenuEntry("import-picks", "<i>New Slot</i>", function () {
        var slot = prompt("Enter slot name");
        if (slot) {
            runImport(slot);
            setupMenus();
        } else {
            createModal("No name set", "Give your slot a name if you want to import your picks")
        }
    });

    var slots = Object.keys(getSlots(getGameId()));
    slots.forEach(function (slot) {
        createUJSSubMenuEntry("import-picks", slot,
            (function (s) {
                return function () {
                    runImport(s);
                }
            })(slot));
    });
}

function runImport(slot) {
    var rawPicks = prompt("Enter your picks");
    validateImportPicks(rawPicks);
    var teamPicks = JSON.parse(rawPicks);
    teamPicks.forEach(function (playerPicks, key) {
        if (!Array.isArray(playerPicks) || playerPicks.length === 0) {
            throw "invalid picks for player " + (key + 1);
        }
    });
    storePicks(getGameId(), slot, teamPicks);
    setupMenus();
}

function setupExport() {
    $("#export-picks").remove();
    createUJSExpandableSubMenu("Export picks", "export-picks");
    var slots = Object.keys(getSlots(getGameId()));
    slots.forEach(function (slot) {
        createUJSSubMenuEntry("export-picks", slot,
            (function (s) {
                return function () {
                    JSON.parse(prompt("Copy your picks from here.", JSON.stringify(getPicks(getGameId(), s))));
                }
            })(slot));
    });
}


function setupLoadPicks() {
    $("#load-team-picks").remove();
    createUJSExpandableSubMenu("Load picks", "load-team-picks");
    var slots = Object.keys(getSlots(getGameId()));
    slots.forEach(function (slot) {
        createUJSSubMenuEntry("load-team-picks", slot,
            (function (s) {
                return function () {
                    loadPicks(getGameId(), s);
                }
            })(slot));
    });
}

function setupStorePicks() {
    $("#store-team-picks").remove();
    $("#use-picks").remove();
    createUJSExpandableSubMenu("Store picks", "store-team-picks");
    createUJSSubMenuEntry("store-team-picks", "<i>New Slot</i>", function () {
        var slot = prompt("Enter slot name");
        if (slot) {
            storePicks(getGameId(), slot, getTeamPicks());
            setupMenus();
        } else {
            createModal("No name set", "Give your slot a name if you want to store your picks for later.")
        }
    });


    var slots = Object.keys(getSlots(getGameId()));
    slots.forEach(function (slot) {
        createUJSSubMenuEntry("store-team-picks", slot,
            (function (s) {
                return function () {
                    console.log(s);
                    storePicks(getGameId(), s, getTeamPicks());
                }
            })(slot));
    });

    if (isTeamGame()) {
        var teammates = getTeammates();
        createUJSExpandableSubMenu("Use current picks for", "use-picks");

        teammates.filter(function (player) {
            return player.PlayerID.val !== getMyId();
        }).map(function (player) {
            createUJSSubMenuEntry("use-picks", player.Player.DisplayName, function () {
                var picks = getMyPicks();
                UJS_Hooks.Links.Latest.TeammatesOrders.store.h[player.PlayerID] = new TeammatePickOrders(picks);
                triggerShowTeammatesOrders();
            });
        });
    }
}

function getSlots(gameId) {
    var rawData = localStorage["pickSimulation"];
    var data = rawData === undefined ? {} : JSON.parse(rawData);
    return data[gameId] || [];
}

function getMyId() {
    return UJS_Hooks.BuildingTurnState.Root.Links.get_Us().get_ID();
}

function getAllPlayers() {
    return UJS_Hooks.Links._gameDetails.Players.store.h;
}

function getTeammates() {
    var myId = getMyId();
    var players = getAllPlayers();
    var myTeam = players[myId].Team;
    return Object.values(players).filter(function (player) {
        if (isTeamGame()) {
            return player.Team === myTeam;
        } else {
            return player.PlayerID.val === myId
        }
    });
}

function getEnemies() {
    var myId = getMyId();
    var players = getAllPlayers();
    var myTeam = players[myId].Team;
    return Object.values(players).filter(function (player) {
        if (isTeamGame()) {
            return player.Team !== myTeam && player.PlayerID !== myId;
        } else {
            return player.PlayerID.val !== myId;
        }
    });
}

function storePicks(gameId, slotId, teamPicks) {
    var rawData = localStorage["pickSimulation"];
    var data = rawData === undefined ? {} : JSON.parse(rawData);
    if (data[gameId] === undefined) {
        data[gameId] = {};
    }
    data[gameId][slotId] = teamPicks;
    localStorage["pickSimulation"] = JSON.stringify(data);
}

function getPicks(gameId, slotId) {
    var rawData = localStorage["pickSimulation"];
    var data = rawData === undefined ? {} : JSON.parse(rawData);
    if (data[gameId] === undefined || data[gameId][slotId] === undefined) {
        throw new NoPicksDefinedException(slotId);
    }

    return data[gameId][slotId];
}

function loadPicks(gameId, slotId) {
    var state = UJS_Hooks.BuildingTurnState;
    var picks = getPicks(gameId, slotId);
    clearMyOrders();
    var myPicks = picks.shift();
    console.log(picks);
    $.each(myPicks, function (key, pick) {
        console.log(key, pick);
        var order = new UJS_Hooks.GameOrderPick(state.Root.Links.get_Us().get_ID(), pick, state.Orders.length);
        insertOrder(new UJS_Hooks.OrdersListItemVM(order, state.Root, state.Root.Links.Latest.LatestStanding));
    });

    getTeammates().forEach(function (teammate) {
        var playerId = teammate.Player.PlayerID;
        if (playerId !== getMyId()) {
            UJS_Hooks.Links.Latest.TeammatesOrders.store.h[playerId] = {
                OrderRevision: 1,
                Orders: null,
                Picks: picks.shift()
            };
        }
    });
    triggerShowTeammatesOrders();
}

function insertOrder(order) {
    UJS_Hooks.BuildingTurnState.DistributingPhase.State.InsertOrder(order);
}

function clearMyOrders() {
    while (UJS_Hooks.BuildingTurnState.DistributingPhase.State.Orders.length > 0) {
        UJS_Hooks.BuildingTurnState.DistributingPhase.State.DeleteOrder(UJS_Hooks.BuildingTurnState.DistributingPhase.State.Orders[0]);
    }
}

function clearTeammatesOrders() {
    if (UJS_Hooks.Links.Latest.TeammatesOrders) {
        UJS_Hooks.Links.Latest.TeammatesOrders.store.h = {};
        triggerShowTeammatesOrders();
    }
}

function getTeamPicks() {
    var picks = [];
    picks.push(getMyPicks());
    getTeammates().forEach(function (teammate) {
        var playerId = teammate.Player.PlayerID;
        if (playerId !== getMyId()) {
            if (!UJS_Hooks.Links.Latest.TeammatesOrders.store.h[playerId]) {
                throw new NoPicksFoundForPlayer(playerId);
            }
            picks.push(UJS_Hooks.Links.Latest.TeammatesOrders.store.h[playerId].Picks);
        }
    });
    return picks;
}

function getMyPicks() {
    return UJS_Hooks.BuildingTurnState.DistributingPhase.State.Orders.map(function (order) {
        return order.Order.TerritoryID;
    });
}

function createUJSExpandableSubMenu(name, className) {
    $(".game-menu-dropdown").append(`
     <li class="dropdown-submenu" id="` + className + `">
        <a class="dropdown-toggle dropdown-item" data-toggle="dropdown" href="#" aria-expanded="true">` + name + `</a>
        <ul class="dropdown-menu ` + className + `" aria-labelledby="navbarDropdownMenuLink"></ul>
      </li>
    `);
}

function createUJSSubMenu(name, className, fun) {
    var menu = $(`
     <li class="dropdown-submenu" id="` + className + `">
        <a class="dropdown-item" data-toggle="dropdown" href="#" aria-expanded="true">` + name + `</a>
      </li>
    `);
    $(menu).on("click", fun);
    $(".game-menu-dropdown").append(menu);
}

function createUJSSubMenuEntry(parent, name, fun) {
    var entry = $(`<li class="${name}"><a class="dropdown-item" href="#">${name}</a></li>`);
    $(entry).on("click", fun);
    $("." + parent).append(entry);
    return entry;
}

function simulatePicks(playerPicks) {
    var players = {};
    playerPicks.forEach(function (playerPick) {
        players[playerPick.ID] = new Player(playerPick.ID, []);
    });

    var UsedPicks = [];

    $.each(playerPicks, function (Key, Player) {
        var pick = getNextPick(Player, UsedPicks);
        UsedPicks.push(pick);
        console.log("Giving pick ", pick, "to", getPlayerName(Player.ID));
        players[Player.ID].Territories.push(pick);
    });

    var Json = Object.values(players);


    console.log(Json);

    //Setup data
    var Picks = {};
    $.each(Json, function (Key1, Player) {
        $.each(Player.Territories, function (Key2, Territory) {
            Picks[Territory] = Player.ID;
        });
    });

    clearMyOrders();

    var playerArmies = UJS_Hooks.Links.Settings.InitialPlayerArmiesPerTerritory;
    //Assign territories to neutral or player
    $.each(getAllTerritories(), function (Key, Territory) {
        var Player = Picks[Territory.ID];
        if (Player !== undefined) {
            Territory.OwnerPlayerID = Player;
            Territory.NumArmies._numArmies = playerArmies;
            //console.log("Giving territory ", Territory.ID, "to", getPlayerName(Player));
        } else {
            Territory.OwnerPlayerID = 0;
            Territory.NumArmies._numArmies = 2;
        }
    });
}

function getAllTerritories() {
    return UJS_Hooks.BuildingTurnState.DistributingPhase.State.BuildingStanding.Territories.store.h;
}

function getTerritory(territoryId) {
    return getAllTerritories()[territoryId];
}


function getPlayerName(id) {
    var name = undefined;
    UJS_Hooks.Links.PlayersCache.forEach(function (player) {
        if (player.PlayerID === id) {
            name = player.DisplayName;
        }
    });
    return name;
}


/**
 * @return {undefined}
 */
function getNextPick(Player, UsedPicks) {
    var pick = undefined;
    while (pick === undefined) {
        if (Player.Territories.length === 0) {
            //console.log("not enough picks")
            throw new NotEnoughPicksException();
        }
        var TempPick = Player.Territories.shift();
        if (!UsedPicks.includes(TempPick)) {
            pick = TempPick;
        }
    }
    return pick;
}

var simulationSummary = "";

function simulate(slotA, slotB) {
    simulationSummary = "";
    var maxTerritories = UJS_Hooks.Links.Settings.LimitDistributionTerritories;
    var teamSize = Math.max(getTeammates().length, 1);
    var picksA = getPicks(getGameId(), slotA < slotB ? slotA : slotB);
    var picksB = getPicks(getGameId(), slotA < slotB ? slotB : slotA);
    simulationSummary += "Friendly colors playing with Slot " + (slotA < slotB ? slotA : slotB) + ".<br>";
    var teammates = getTeammates().map(function (player) {
        var picks = picksA.shift();
        console.log(getPlayerName(player.Player.PlayerID) + " gets picks " + picks);
        return Player(player.Player.PlayerID, picks)
    });
    simulationSummary += "Opponent colors playing with Slot " + (slotA < slotB ? slotB : slotA) + ".<br>";
    var enemies = getEnemies().map(function (player) {
        var picks = picksB.shift();
        console.log(getPlayerName(player.Player.PlayerID) + " gets picks " + picks);
        return Player(player.Player.PlayerID, picks)
    });


    var pickOrder = [];

    for (var j = 0; j < teamSize + 1; j++) {
        if (pickOrder.length === 0) {
            pickOrder.push(teammates.shift());
        } else {
            if (j % 2 !== 0) {
                pickOrder.push(enemies.shift());
                if (enemies.length > 0) {
                    pickOrder.push(enemies.shift());
                }
            } else {
                pickOrder.push(teammates.shift());
                if (enemies.length > 0) {
                    pickOrder.push(teammates.shift());
                }
            }

        }
    }

    if (slotA < slotB) {
        pickOrder.reverse();
    }

    var allPicks = [];
    for (var i = 0; i < maxTerritories; i++) {
        allPicks = allPicks.concat(pickOrder.reverse());
    }

    simulationSummary += "First pick for " + getPlayerName(allPicks[0].ID);

    createModal("Simulation Overview", simulationSummary);
    console.log(simulationSummary);

    simulatePicks(allPicks);
    clearTeammatesOrders();
    triggerColorRefresh();
}

function triggerShowTeammatesOrders() {
    var button = $("#ujs_ShowOrHideTeammatesOrdersBtn_btn");
    if ($("#ujs_ShowOrHideTeammatesOrdersBtn").text().indexOf("Hide") !== -1) {
        button.trigger("click");
        button.trigger("click");
    } else {
        button.trigger("click")
    }
}

function triggerColorRefresh() {
    UJS_Hooks.BuildingTurnState.Root.get_Standing().FireNewStanding(UJS_Hooks.BuildingTurnState.Root.get_Standing().DisplayingStanding)
}

function validateImportPicks(rawPicks) {
    var teamPicks = undefined;
    try {
        teamPicks = JSON.parse(rawPicks);
    } catch (e) {
        throw new InvalidImportFormatException();
    }
    if (teamPicks === undefined || !Array.isArray(teamPicks)) {
        throw new InvalidImportFormatException();
    }
    if (teamPicks.length !== getTeammates().length) {
        throw new EnteredPicksDoNotMatchPlayerAmountException();
    }
    teamPicks.reduce(function (result, playerPicks) {
        return result.concat(playerPicks);
    }).forEach(function (territoryId) {
        if (getTerritory(territoryId) === undefined) {
            throw new TerritoryDoesNotExistException(territoryId);
        }
    });
}

function isTeamGame() {
    return Object.values(UJS_Hooks.Links._gameDetails.Players.store.h)[0].Team !== -1;
}

function getTurnNumber() {
    return UJS_Hooks.Links._gameDetails.NumberOfTurns;
}

function TeammatePickOrders(picks) {
    return {
        "OrderRevision": 1,
        "Orders": null,
        "Picks": picks
    };
}

function Player(id, picks) {
    return {
        ID: id,
        Territories: picks
    };
}

function createModal(title, text) {
    var a = CreateModal("Alert", title, text, false, true);
    $(a).find(".modal-body").css("padding", "30px");
    $(a).find(".modal-body").after(`<div class="modal-footer">
        <button type="button" class="btn btn-primary" data-dismiss="modal">Close</button>
      </div>`)
}

function Exception(text, title) {
    this.title = title || "Error";
    this.text = text;
    this.build();
}

function ImportPicksException(text) {
    Exception.call(this, text, "Failed importing picks");
}

function StoringPicksException(text) {
    Exception.call(this, text, "Failed storing picks");
}

function SimulationException(text) {
    Exception.call(this, text, "Simulation Failed");
}

function InvalidImportFormatException() {
    var error = `The entered picks are in an invalid format.<br>Correct your picks and import them again in the following format:<br> <br>
          <pre>[ [1, 2, 3, 4], [4, 5, 6, 7], [3, 5, 1, 3] ]</pre>`;
    ImportPicksException.call(this, error);
}

function TerritoryDoesNotExistException(territoryId) {
    var text = `The territory ${territoryId} does not exist. <br>Correct your picks and import them again.`;
    ImportPicksException.call(this, text);
}

function NotEnoughPicksForImportException(territoryId) {
    var text = `The territory ${territoryId} does not exist. <br>Correct your picks and import them again.`;
    ImportPicksException.call(this, text);
}

function EnteredPicksDoNotMatchPlayerAmountException() {
    var text = `There are not enough picks for every player. <br>Correct your picks and import them again.`;
    ImportPicksException.call(this, text);
}

function NoPicksFoundForPlayer(playerId) {
    var text = `There are no picks defined for the player ${getPlayerName(playerId)}. <br>Add some picks and try storing them again.`;
    StoringPicksException.call(this, text);
}

function NoPicksDefinedException(slot) {
    var text = `There are no picks defined in  <b>Slot ${slot}</b>. <br>Store picks in this slot first or use a different slot.`;
    Exception.call(this, text);
}

function NotEnoughPicksException() {
    var text = `There are not enough picks defined for one or more the players.<br> Make sure all players have enough picks and try simulating again`;
    SimulationException.call(this, text);
}


ImportPicksException.prototype = Object.create(Exception.prototype);
SimulationException.prototype = Object.create(Exception.prototype);
StoringPicksException.prototype = Object.create(Exception.prototype);
NoPicksFoundForPlayer.prototype = Object.create(StoringPicksException.prototype);
NotEnoughPicksException.prototype = Object.create(SimulationException.prototype);
NoPicksDefinedException.prototype = Object.create(Exception.prototype);
InvalidImportFormatException.prototype = Object.create(ImportPicksException.prototype);
TerritoryDoesNotExistException.prototype = Object.create(ImportPicksException.prototype);
NotEnoughPicksForImportException.prototype = Object.create(ImportPicksException.prototype);
EnteredPicksDoNotMatchPlayerAmountException.prototype = Object.create(ImportPicksException.prototype);

Exception.prototype.build = function () {
    createModal(this.title, this.text, false);
    throw this.text;
};

