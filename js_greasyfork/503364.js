function _extends() {
  return (
    (_extends = Object.assign
      ? Object.assign.bind()
      : function (n) {
          for (var e = 1; e < arguments.length; e++) {
            var t = arguments[e];
            for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
          }
          return n;
        }),
    _extends.apply(null, arguments)
  );
}
function _newArrowCheck(n, r) {
  if (n !== r) throw new TypeError("Cannot instantiate an arrow function");
}
// ==UserScript==
// @name         Bodega Bot Fish Game Expansion
// @namespace    http://tampermonkey.net/
// @version      2.0
// @author       Bort
// @description  Expands the fish game in Bodega Bot with new features and gameplay elements
// @match        https://tinychat.com/room/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/503364/Bodega%20Bot%20Fish%20Game%20Expansion.user.js
// @updateURL https://update.greasyfork.org/scripts/503364/Bodega%20Bot%20Fish%20Game%20Expansion.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // Main expansion object
  var FishExpansion = {
    initialized: false,
    origFish: null,
    origFishList: null,
    init: function init() {
      var _this = this;
      if (this.initialized) return;
      if (
        typeof window.Fish === "undefined" ||
        typeof window.FishList === "undefined"
      ) {
        console.log("Bodega Bot Fish game not found. Retrying in 1 second.");
        setTimeout(
          function () {
            _newArrowCheck(this, _this);
            return this.init();
          }.bind(this),
          1000
        );
        return;
      }
      this.origFish = window.Fish;
      this.origFishList = window.FishList;
      this.extendFish();
      this.extendFishList();
      this.initialized = true;
      console.log("Fish Game Expansion initialized successfully.");
    },
    extendFish: function extendFish() {
      var self = this;

      // Safely extend the Fish object
      window.Fish = new Proxy(this.origFish, {
        get: function get(target, property) {
          if (property in self.fishExtensions) {
            return self.fishExtensions[property];
          }
          return target[property];
        }
      });

      // Store original methods that we'll override
      this.fishExtensions.origInit = this.origFish.Init;
      this.fishExtensions.origGetPlayer = this.origFish.GetPlayer;
      this.fishExtensions.origStartRound = this.origFish.StartRound;
    },
    extendFishList: function extendFishList() {
      // Safely extend FishList
      window.FishList = new Proxy(this.origFishList, {
        get: function get(target, property) {
          if (property in self.fishListExtensions) {
            return self.fishListExtensions[property];
          }
          return target[property];
        }
      });
    },
    fishExtensions: {
      // New properties
      locations: [
        {
          name: "Calm Bay",
          difficulty: 1,
          weatherMultiplier: 1.2
        },
        {
          name: "Stormy Seas",
          difficulty: 2,
          weatherMultiplier: 0.8
        },
        {
          name: "Haunted Lake",
          difficulty: 3,
          weatherMultiplier: 1.5
        },
        {
          name: "Pirate Cove",
          difficulty: 4,
          weatherMultiplier: 1.0
        },
        {
          name: "Sunken Ship",
          difficulty: 5,
          weatherMultiplier: 0.7
        }
      ],
      currentLocation: 0,
      boats: [
        {
          name: "Dinghy",
          capacity: 5,
          speed: 1,
          cost: 1000
        },
        {
          name: "Fishing Boat",
          capacity: 10,
          speed: 2,
          cost: 5000
        },
        {
          name: "Yacht",
          capacity: 20,
          speed: 3,
          cost: 20000
        },
        {
          name: "Pirate Ship",
          capacity: 50,
          speed: 4,
          cost: 100000
        }
      ],
      equipment: {
        rods: [
          {
            name: "Basic Rod",
            power: 1,
            cost: 100
          },
          {
            name: "Pro Rod",
            power: 2,
            cost: 500
          },
          {
            name: "Master Rod",
            power: 3,
            cost: 2000
          },
          {
            name: "Legendary Rod",
            power: 5,
            cost: 10000
          }
        ],
        baits: [
          {
            name: "Worms",
            attractionBonus: 1.1,
            cost: 10
          },
          {
            name: "Lures",
            attractionBonus: 1.3,
            cost: 50
          },
          {
            name: "Special Bait",
            attractionBonus: 1.5,
            cost: 200
          },
          {
            name: "Magical Bait",
            attractionBonus: 2,
            cost: 1000
          }
        ]
      },
      weatherConditions: ["Sunny", "Cloudy", "Rainy", "Stormy", "Foggy"],
      currentWeather: 0,
      // Override methods
      Init: function Init() {
        this.origInit.apply(this, arguments);
        this.initializeNewFeatures();
        this.sendMessage(
          "[FISHING EXPANSION] Welcome to the expanded fishing adventure! Type !fishhelp for new commands."
        );
      },
      GetPlayer: function GetPlayer(handle) {
        var player = this.origGetPlayer.apply(this, arguments);
        if (player && !player.hasOwnProperty("equipment")) {
          player.equipment = {
            boat: 0,
            rod: 0,
            bait: 0
          };
          player.location = 0;
          player.inventory = [];
          player.skills = {
            strength: 1,
            precision: 1,
            luck: 1
          };
        }
        return player;
      },
      StartRound: function StartRound() {
        this.origStartRound.apply(this, arguments);
        this.updateWeather();
        this.checkForSpecialEvents();
      },
      // New methods
      initializeNewFeatures: function initializeNewFeatures() {
        this.currentLocation = 0;
        this.currentWeather = this.getRandomWeather();
        this.updateWeather();
      },
      getRandomWeather: function getRandomWeather() {
        return Math.floor(Math.random() * this.weatherConditions.length);
      },
      updateWeather: function updateWeather() {
        if (Math.random() < 0.2) {
          // 20% chance to change weather each round
          this.currentWeather = this.getRandomWeather();
          this.sendMessage(
            "[WEATHER UPDATE] The weather has changed to " +
              this.weatherConditions[this.currentWeather] +
              "!"
          );
        }
      },
      checkForSpecialEvents: function checkForSpecialEvents() {
        if (Math.random() < 0.1) {
          // 10% chance for a special event
          var event = this.getRandomSpecialEvent();
          this.sendMessage("[SPECIAL EVENT] " + event.message);
          event.effect();
        }
      },
      getRandomSpecialEvent: function getRandomSpecialEvent() {
        var _this2 = this;
        var events = [
          {
            message: "A school of rare fish has been spotted!",
            effect: function effect() {
              _newArrowCheck(this, _this2);
              return this.increaseRareFishChance();
            }.bind(this)
          },
          {
            message:
              "A storm is brewing! Fish are harder to catch but more valuable.",
            effect: function effect() {
              _newArrowCheck(this, _this2);
              return this.stormEffect();
            }.bind(this)
          },
          {
            message:
              "Pirate ghosts are haunting the waters! Watch out for cursed treasures.",
            effect: function effect() {
              _newArrowCheck(this, _this2);
              return this.pirateGhostEvent();
            }.bind(this)
          }
        ];
        return events[Math.floor(Math.random() * events.length)];
      },
      increaseRareFishChance: function increaseRareFishChance() {
        // Implementation for increasing rare fish chance
        console.log("Rare fish chance increased for this round!");
      },
      stormEffect: function stormEffect() {
        // Implementation for storm effect
        console.log(
          "Storm effect applied: harder catches, more valuable fish!"
        );
      },
      pirateGhostEvent: function pirateGhostEvent() {
        // Implementation for pirate ghost event
        console.log(
          "Pirate ghost event triggered: chance for cursed treasures!"
        );
      },
      sendMessage: function sendMessage(message) {
        if (typeof Send === "function") {
          Send("msg", message);
        } else {
          console.log("Bodega Bot Send function not found. Message:", message);
        }
      }
    },
    fishListExtensions: {
      fishlocation: function fishlocation(player) {
        if (player !== -1 && window.Fish.FishTimerCheck(player)) {
          var location = window.Fish.locations[player.location];
          window.Fish.sendMessage(
            "[FISHING LOCATION] " +
              player.Nickname +
              ", you are currently fishing at " +
              location.name +
              ". Difficulty: " +
              location.difficulty
          );
        }
      },
      fishupgradeboat: function fishupgradeboat(player) {
        if (player !== -1 && window.Fish.FishTimerCheck(player)) {
          var nextBoat = window.Fish.boats[player.equipment.boat + 1];
          if (nextBoat) {
            if (window.Fish.FishTransaction(player, nextBoat.cost)) {
              player.equipment.boat++;
              window.Fish.sendMessage(
                "[BOAT UPGRADE] " +
                  player.Nickname +
                  ", you've upgraded to a " +
                  nextBoat.name +
                  "!"
              );
            }
          } else {
            window.Fish.sendMessage(
              "[BOAT UPGRADE] " +
                player.Nickname +
                ", you already have the best boat!"
            );
          }
        }
      },
      fishupgraderod: function fishupgraderod(player) {
        if (player !== -1 && window.Fish.FishTimerCheck(player)) {
          var nextRod = window.Fish.equipment.rods[player.equipment.rod + 1];
          if (nextRod) {
            if (window.Fish.FishTransaction(player, nextRod.cost)) {
              player.equipment.rod++;
              window.Fish.sendMessage(
                "[ROD UPGRADE] " +
                  player.Nickname +
                  ", you've upgraded to a " +
                  nextRod.name +
                  "!"
              );
            }
          } else {
            window.Fish.sendMessage(
              "[ROD UPGRADE] " +
                player.Nickname +
                ", you already have the best rod!"
            );
          }
        }
      },
      fishbuybait: function fishbuybait(player, args) {
        if (player !== -1 && window.Fish.FishTimerCheck(player)) {
          var baitIndex = parseInt(args) - 1;
          var bait = window.Fish.equipment.baits[baitIndex];
          if (bait) {
            if (window.Fish.FishTransaction(player, bait.cost)) {
              player.equipment.bait = baitIndex;
              window.Fish.sendMessage(
                "[BAIT PURCHASE] " +
                  player.Nickname +
                  ", you've bought " +
                  bait.name +
                  "!"
              );
            }
          } else {
            window.Fish.sendMessage(
              "[BAIT PURCHASE] " + player.Nickname + ", invalid bait selection."
            );
          }
        }
      },
      fishmove: function fishmove(player, args) {
        if (player !== -1 && window.Fish.FishTimerCheck(player)) {
          var locationIndex = parseInt(args) - 1;
          var location = window.Fish.locations[locationIndex];
          if (location) {
            player.location = locationIndex;
            window.Fish.sendMessage(
              "[LOCATION CHANGE] " +
                player.Nickname +
                ", you've moved to " +
                location.name +
                "!"
            );
          } else {
            window.Fish.sendMessage(
              "[LOCATION CHANGE] " +
                player.Nickname +
                ", invalid location selection."
            );
          }
        }
      },
      fishweather: function fishweather(player) {
        if (player !== -1 && window.Fish.FishTimerCheck(player)) {
          var weather =
            window.Fish.weatherConditions[window.Fish.currentWeather];
          window.Fish.sendMessage("[WEATHER] Current weather: " + weather);
        }
      },
      fishhelp: function fishhelp(player) {
        if (player !== -1 && window.Fish.FishTimerCheck(player)) {
          window.Fish.sendMessage(
            "[FISHING HELP] New commands: !fishlocation, !fishupgradeboat, !fishupgraderod, !fishbuybait [1-4], !fishmove [1-5], !fishweather"
          );
        }
      }
    }
  };

  // Initialize the expansion
  FishExpansion.init();
})();
// Continuation of the FishExpansion object...

FishExpansion.fishExtensions = Object.assign(FishExpansion.fishExtensions, {
  // New properties
  tournaments: [],
  quests: [],
  craftingRecipes: [
    {
      name: "Lucky Lure",
      ingredients: ["Basic Rod", "Worms", "Dinghy Part"],
      result: {
        type: "bait",
        name: "Lucky Lure",
        attractionBonus: 2.5,
        cost: 2000
      }
    },
    {
      name: "Storm Sails",
      ingredients: ["Fishing Boat", "Magical Bait", "Kraken Tentacle"],
      result: {
        type: "boat",
        name: "Storm Chaser",
        capacity: 30,
        speed: 5,
        cost: 150000
      }
    },
    {
      name: "Ghost Net",
      ingredients: ["Master Rod", "Ghost Fish", "Special Bait"],
      result: {
        type: "rod",
        name: "Spectral Rod",
        power: 7,
        cost: 50000
      }
    }
  ],
  seasons: ["Spring", "Summer", "Autumn", "Winter"],
  currentSeason: 0,
  seasonalFish: {
    Spring: ["Cherry Blossom Koi", "Rainbow Trout", "Sakura Salmon"],
    Summer: ["Sunfish", "Tropical Parrotfish", "Electric Eel"],
    Autumn: ["Maple Leaf Carp", "Pumpkin Pufferfish", "Harvest Sturgeon"],
    Winter: ["Frost Bite Bass", "Icy Char", "Snow Globe Goldfish"]
  },
  // Enhanced StartRound method
  StartRound: function StartRound() {
    this.origStartRound.apply(this, arguments);
    this.updateWeather();
    this.checkForSpecialEvents();
    this.updateTournament();
    this.updateSeason();
    this.processFishing();
  },
  // Tournament methods
  initTournament: function initTournament() {
    var tournament = {
      name: "Grand Fishing Derby",
      duration: 10,
      // rounds
      roundsLeft: 10,
      participants: [],
      leaderboard: []
    };
    this.tournaments.push(tournament);
    this.sendMessage(
      "[TOURNAMENT] The " +
        tournament.name +
        " has begun! It will last for " +
        tournament.duration +
        " rounds. Type !fishtournament to join!"
    );
  },
  updateTournament: function updateTournament() {
    if (this.tournaments.length > 0) {
      var tournament = this.tournaments[0];
      tournament.roundsLeft--;
      if (tournament.roundsLeft <= 0) {
        this.endTournament(tournament);
      } else {
        this.sendMessage(
          "[TOURNAMENT] " +
            tournament.roundsLeft +
            " rounds left in the " +
            tournament.name +
            "!"
        );
      }
    } else if (Math.random() < 0.1) {
      // 10% chance to start a new tournament
      this.initTournament();
    }
  },
  endTournament: function endTournament(tournament) {
    var _this3 = this;
    tournament.leaderboard.sort(
      function (a, b) {
        _newArrowCheck(this, _this3);
        return b.score - a.score;
      }.bind(this)
    );
    var winner = tournament.leaderboard[0];
    this.sendMessage(
      "[TOURNAMENT] The " +
        tournament.name +
        " has ended! Winner: " +
        winner.name +
        " with a score of " +
        winner.score +
        "!"
    );
    // Reward the winner
    var winnerPlayer = this.GetPlayer(winner.handle);
    if (winnerPlayer) {
      winnerPlayer.Points += 100000;
      this.sendMessage(
        "[TOURNAMENT] " +
          winnerPlayer.Nickname +
          " has been awarded 100,000 points for winning the tournament!"
      );
    }
    this.tournaments.shift();
  },
  // Quest methods
  generateQuest: function generateQuest() {
    var _this4 = this;
    var questTypes = [
      {
        name: "Catch X Fish",
        generate: function generate() {
          _newArrowCheck(this, _this4);
          return {
            target: Math.floor(Math.random() * 20) + 10,
            progress: 0
          };
        }.bind(this)
      },
      {
        name: "Earn X Points",
        generate: function generate() {
          _newArrowCheck(this, _this4);
          return {
            target: Math.floor(Math.random() * 10000) + 5000,
            progress: 0
          };
        }.bind(this)
      },
      {
        name: "Catch Rare Fish",
        generate: function generate() {
          _newArrowCheck(this, _this4);
          return {
            target: Math.floor(Math.random() * 3) + 1,
            progress: 0
          };
        }.bind(this)
      }
    ];
    var selectedQuest =
      questTypes[Math.floor(Math.random() * questTypes.length)];
    return _extends(
      {
        type: selectedQuest.name
      },
      selectedQuest.generate(),
      {
        reward: Math.floor(Math.random() * 10000) + 5000
      }
    );
  },
  assignQuest: function assignQuest(player) {
    if (!player.activeQuest) {
      player.activeQuest = this.generateQuest();
      this.sendMessage(
        "[QUEST] " +
          player.Nickname +
          ", you've received a new quest: " +
          player.activeQuest.type +
          ". Target: " +
          player.activeQuest.target
      );
    } else {
      this.sendMessage(
        "[QUEST] " +
          player.Nickname +
          ", you already have an active quest. Complete it first!"
      );
    }
  },
  updateQuest: function updateQuest(player, updateAmount) {
    if (player.activeQuest) {
      player.activeQuest.progress += updateAmount;
      if (player.activeQuest.progress >= player.activeQuest.target) {
        this.completeQuest(player);
      }
    }
  },
  completeQuest: function completeQuest(player) {
    this.sendMessage(
      "[QUEST] Congratulations, " +
        player.Nickname +
        "! You've completed your quest and earned " +
        player.activeQuest.reward +
        " points!"
    );
    player.Points += player.activeQuest.reward;
    player.activeQuest = null;
  },
  // Crafting method
  craftItem: function craftItem(player, recipeName) {
    var _this5 = this;
    var recipe = this.craftingRecipes.find(
      function (r) {
        _newArrowCheck(this, _this5);
        return r.name.toLowerCase() === recipeName.toLowerCase();
      }.bind(this)
    );
    if (recipe) {
      var canCraft = recipe.ingredients.every(
        function (ingredient) {
          var _this6 = this;
          _newArrowCheck(this, _this5);
          return (
            player.inventory.includes(ingredient) ||
            player.equipment.rod ===
              this.equipment.rods.findIndex(
                function (r) {
                  _newArrowCheck(this, _this6);
                  return r.name === ingredient;
                }.bind(this)
              ) ||
            player.equipment.boat ===
              this.boats.findIndex(
                function (b) {
                  _newArrowCheck(this, _this6);
                  return b.name === ingredient;
                }.bind(this)
              ) ||
            player.equipment.bait ===
              this.equipment.baits.findIndex(
                function (b) {
                  _newArrowCheck(this, _this6);
                  return b.name === ingredient;
                }.bind(this)
              )
          );
        }.bind(this)
      );
      if (canCraft) {
        // Remove ingredients from inventory
        recipe.ingredients.forEach(
          function (ingredient) {
            _newArrowCheck(this, _this5);
            var index = player.inventory.indexOf(ingredient);
            if (index > -1) {
              player.inventory.splice(index, 1);
            }
          }.bind(this)
        );

        // Add crafted item
        if (recipe.result.type === "bait") {
          this.equipment.baits.push(recipe.result);
          player.equipment.bait = this.equipment.baits.length - 1;
        } else if (recipe.result.type === "boat") {
          this.boats.push(recipe.result);
          player.equipment.boat = this.boats.length - 1;
        } else if (recipe.result.type === "rod") {
          this.equipment.rods.push(recipe.result);
          player.equipment.rod = this.equipment.rods.length - 1;
        }
        this.sendMessage(
          "[CRAFTING] " +
            player.Nickname +
            ", you've successfully crafted " +
            recipe.name +
            "!"
        );
      } else {
        this.sendMessage(
          "[CRAFTING] " +
            player.Nickname +
            ", you don't have the required ingredients to craft " +
            recipe.name +
            "."
        );
      }
    } else {
      this.sendMessage(
        "[CRAFTING] " + player.Nickname + ", that recipe doesn't exist."
      );
    }
  },
  // Season methods
  updateSeason: function updateSeason() {
    if (this.Round % 40 === 0) {
      // Change season every 40 rounds
      this.currentSeason = (this.currentSeason + 1) % 4;
      this.sendMessage(
        "[SEASON CHANGE] The season has changed to " +
          this.seasons[this.currentSeason] +
          "!"
      );
    }
  },
  // Fishing process
  processFishing: function processFishing() {
    var _this7 = this;
    this.Player.forEach(
      function (player) {
        var _this8 = this;
        _newArrowCheck(this, _this7);
        var fishCatch = this.catchFish(player);
        if (fishCatch) {
          this.updateQuest(player, 1); // Update "Catch X Fish" quest
          this.updateQuest(player, fishCatch.value); // Update "Earn X Points" quest

          // Update tournament score
          if (this.tournaments.length > 0) {
            var tournament = this.tournaments[0];
            var participant = tournament.leaderboard.find(
              function (p) {
                _newArrowCheck(this, _this8);
                return p.handle === player.Handle;
              }.bind(this)
            );
            if (participant) {
              participant.score += fishCatch.value;
            }
          }
        }
      }.bind(this)
    );
  },
  catchFish: function catchFish(player) {
    var location = this.locations[player.location];
    var weather = this.weatherConditions[this.currentWeather];
    var season = this.seasons[this.currentSeason];
    var catchChance = this.calculateCatchChance(
      player,
      location,
      weather,
      season
    );
    if (Math.random() < catchChance) {
      return this.determineFishCatch(player, season);
    }
    return null;
  },
  calculateCatchChance: function calculateCatchChance(
    player,
    location,
    weather,
    season
  ) {
    var baseChance = 0.5;
    var skillBonus =
      (player.skills.strength + player.skills.precision + player.skills.luck) /
      30;
    var equipmentBonus =
      this.boats[player.equipment.boat].speed / 10 +
      this.equipment.rods[player.equipment.rod].power / 10 +
      this.equipment.baits[player.equipment.bait].attractionBonus / 10;
    var weatherEffect =
      weather === "Stormy" ? -0.1 : weather === "Sunny" ? 0.1 : 0;
    var seasonEffect =
      season === "Summer" ? 0.1 : season === "Winter" ? -0.1 : 0;
    return Math.min(
      Math.max(
        baseChance + skillBonus + equipmentBonus + weatherEffect + seasonEffect,
        0.1
      ),
      0.9
    );
  },
  determineFishCatch: function determineFishCatch(player, season) {
    var rarityRoll = Math.random();
    if (rarityRoll < 0.01) {
      // 1% chance for legendary fish
      return this.catchLegendaryFish(player);
    } else if (rarityRoll < 0.1) {
      // 9% chance for rare fish
      return this.catchRareFish(player);
    } else {
      return this.catchRegularFish(player, season);
    }
  },
  catchLegendaryFish: function catchLegendaryFish(player) {
    // Implementation for catching legendary fish
    var legendaryFish = {
      name: "Leviathan",
      value: 100000
    };
    this.sendMessage(
      "[LEGENDARY CATCH] " +
        player.Nickname +
        " has caught a " +
        legendaryFish.name +
        "! It's worth " +
        legendaryFish.value +
        " points!"
    );
    player.Points += legendaryFish.value;
    return legendaryFish;
  },
  catchRareFish: function catchRareFish(player) {
    // Implementation for catching rare fish
    var rareFish = {
      name: "Golden Trout",
      value: 10000
    };
    this.sendMessage(
      "[RARE CATCH] " +
        player.Nickname +
        " has caught a " +
        rareFish.name +
        "! It's worth " +
        rareFish.value +
        " points!"
    );
    player.Points += rareFish.value;
    return rareFish;
  },
  catchRegularFish: function catchRegularFish(player, season) {
    var seasonalFishList = this.seasonalFish[season];
    var fish =
      seasonalFishList[Math.floor(Math.random() * seasonalFishList.length)];
    var value = Math.floor(Math.random() * 1000) + 500; // Random value between 500 and 1500
    this.sendMessage(
      player.Nickname +
        " caught a " +
        fish +
        "! It's worth " +
        value +
        " points."
    );
    player.Points += value;
    return {
      name: fish,
      value: value
    };
  }
});
FishExpansion.fishListExtensions = Object.assign(
  FishExpansion.fishListExtensions,
  {
    fishtournament: function fishtournament(player) {
      if (player !== -1 && window.Fish.FishTimerCheck(player)) {
        if (window.Fish.tournaments.length > 0) {
          var tournament = window.Fish.tournaments[0];
          if (!tournament.participants.includes(player.Handle)) {
            tournament.participants.push(player.Handle);
            tournament.leaderboard.push({
              name: player.Nickname,
              handle: player.Handle,
              score: 0
            });
            window.Fish.sendMessage(
              "[TOURNAMENT] " +
                player.Nickname +
                " has joined the " +
                tournament.name +
                "!"
            );
          } else {
            window.Fish.sendMessage(
              "[TOURNAMENT] " +
                player.Nickname +
                ", you're already participating in the tournament."
            );
          }
        } else {
          window.Fish.sendMessage(
            "[TOURNAMENT] There's no active tournament right now."
          );
        }
      }
    },
    fishquest: function fishquest(player) {
      if (player !== -1 && window.Fish.FishTimerCheck(player)) {
        if (player.activeQuest) {
          window.Fish.sendMessage(
            "[QUEST] " +
              player.Nickname +
              ", your current quest: " +
              player.activeQuest.type +
              ". Progress: " +
              player.activeQuest.progress +
              "/" +
              player.activeQuest.target
          );
        } else {
          window.Fish.assignQuest(player);
        }
      }
    },
    fishcraft: function fishcraft(player, args) {
      if (player !== -1 && window.Fish.FishTimerCheck(player)) {
        window.Fish.craftItem(player, args);
      }
    },
    fishinventory: function fishinventory(player) {
      if (player !== -1 && window.Fish.FishTimerCheck(player)) {
        var inventoryString = player.inventory.join(", ");
        window.Fish.sendMessage(
          "[INVENTORY] " + player.Nickname + "'s inventory: " + inventoryString
        );
      }
    },
    fishrecipes: function fishrecipes(player) {
      var _this9 = this;
      if (player !== -1 && window.Fish.FishTimerCheck(player)) {
        var recipeString = window.Fish.craftingRecipes
          .map(
            function (recipe) {
              _newArrowCheck(this, _this9);
              return recipe.name;
            }.bind(this)
          )
          .join(", ");
        window.Fish.sendMessage(
          "[CRAFTING] Available recipes: " + recipeString
        );
      }
    },
    fishseason: function fishseason(player) {
      if (player !== -1 && window.Fish.FishTimerCheck(player)) {
        var season = window.Fish.seasons[window.Fish.currentSeason];
        var nextSeason =
          window.Fish.seasons[(window.Fish.currentSeason + 1) % 4];
        var roundsUntilChange = 40 - (window.Fish.Round % 40);
        window.Fish.sendMessage(
          "[SEASON] Current season: " +
            season +
            ". " +
            nextSeason +
            " will start in " +
            roundsUntilChange +
            " rounds."
        );
      }
    },
    fishstats: function fishstats(player) {
      if (player !== -1 && window.Fish.FishTimerCheck(player)) {
        var stats =
          "[STATS] " +
          player.Nickname +
          ":\n" +
          ("Points: " + player.Points + "\n") +
          ("Level: " + player.Level + "\n") +
          ("Location: " + window.Fish.locations[player.location].name + "\n") +
          ("Boat: " + window.Fish.boats[player.equipment.boat].name + "\n") +
          ("Rod: " +
            window.Fish.equipment.rods[player.equipment.rod].name +
            "\n") +
          ("Bait: " +
            window.Fish.equipment.baits[player.equipment.bait].name +
            "\n") +
          ("Skills: Strength (" +
            player.skills.strength +
            "), Precision (" +
            player.skills.precision +
            "), Luck (" +
            player.skills.luck +
            ")");
        window.Fish.sendMessage(stats);
      }
    },
    fishtop: function fishtop(player) {
      var _this10 = this;
      if (player !== -1 && window.Fish.FishTimerCheck(player)) {
        var sortedPlayers = window.Fish.Player.slice().sort(
          function (a, b) {
            _newArrowCheck(this, _this10);
            return b.Points - a.Points;
          }.bind(this)
        );
        var topPlayers = sortedPlayers.slice(0, 5);
        var leaderboard = topPlayers
          .map(
            function (p, i) {
              _newArrowCheck(this, _this10);
              return i + 1 + ". " + p.Nickname + ": " + p.Points + " points";
            }.bind(this)
          )
          .join("\n");
        window.Fish.sendMessage("[LEADERBOARD]\n" + leaderboard);
      }
    },
    fishhelp: function fishhelp(player) {
      if (player !== -1 && window.Fish.FishTimerCheck(player)) {
        var helpMessage =
          "[FISHING HELP] Commands:\n" +
          "!fish - Go fishing\n" +
          "!fishbank - Check your balance\n" +
          "!fishlocation - Check your current location\n" +
          "!fishmove [1-5] - Move to a new location\n" +
          "!fishupgradeboat - Upgrade your boat\n" +
          "!fishupgraderod - Upgrade your fishing rod\n" +
          "!fishbuybait [1-4] - Buy new bait\n" +
          "!fishweather - Check the current weather\n" +
          "!fishseason - Check the current season\n" +
          "!fishskill [strength/precision/luck] - Upgrade a skill\n" +
          "!fishcraft [recipe name] - Craft an item\n" +
          "!fishrecipes - List available crafting recipes\n" +
          "!fishinventory - Check your inventory\n" +
          "!fishtournament - Join or check the current tournament\n" +
          "!fishquest - Get or check your current quest\n" +
          "!fishstats - View your detailed stats\n" +
          "!fishtop - View the leaderboard";
        window.Fish.sendMessage(helpMessage);
      }
    }
  }
);

// Add skill upgrade functionality
FishExpansion.fishListExtensions.fishskill = function (player, args) {
  if (player !== -1 && window.Fish.FishTimerCheck(player)) {
    var skill = args.toLowerCase();
    if (player.skills.hasOwnProperty(skill)) {
      var cost = player.skills[skill] * 1000;
      if (window.Fish.FishTransaction(player, cost)) {
        player.skills[skill]++;
        window.Fish.sendMessage(
          "[SKILL UPGRADE] " +
            player.Nickname +
            ", you've upgraded your " +
            skill +
            " to level " +
            player.skills[skill] +
            "!"
        );
      }
    } else {
      window.Fish.sendMessage(
        "[SKILL UPGRADE] " + player.Nickname + ", invalid skill selection."
      );
    }
  }
};

// Modify the original FishTransaction function to account for inflation
FishExpansion.fishExtensions.FishTransaction = function (player, cost) {
  var inflationFactor = 1 + player.Level * 0.1; // 10% increase per level
  var adjustedCost = Math.floor(cost * inflationFactor);
  if (player.Points >= adjustedCost) {
    player.Points -= adjustedCost;
    return true;
  } else {
    this.sendMessage(
      "[TRANSACTION] " +
        player.Nickname +
        ", you don't have enough points. You need " +
        adjustedCost +
        " points."
    );
    return false;
  }
};

// Add experience and leveling system
FishExpansion.fishExtensions.addExperience = function (player, amount) {
  player.Experience = player.Experience || 0;
  player.Level = player.Level || 1;
  player.Experience += amount;
  var experienceNeeded = player.Level * 1000;
  if (player.Experience >= experienceNeeded) {
    player.Level++;
    player.Experience -= experienceNeeded;
    this.sendMessage(
      "[LEVEL UP] Congratulations " +
        player.Nickname +
        "! You've reached level " +
        player.Level +
        "!"
    );
  }
};

// Modify the catchFish function to add experience
// Instead of redefining catchFish, let's create a new function to add experience
FishExpansion.fishExtensions.addExperienceForCatch = function (
  player,
  fishCatch
) {
  if (fishCatch) {
    this.addExperience(player, fishCatch.value / 10); // Add experience based on fish value
  }
};

// Now, let's modify the original catchFish function to include this new functionality
FishExpansion.fishExtensions.origCatchFish =
  FishExpansion.fishExtensions.catchFish;
FishExpansion.fishExtensions.catchFish = function (player) {
  var fishCatch = this.origCatchFish(player);
  this.addExperienceForCatch(player, fishCatch);
  return fishCatch;
};

// Add daily rewards
FishExpansion.fishExtensions.lastDailyReward = {};
FishExpansion.fishListExtensions.fishdaily = function (player) {
  if (player !== -1 && window.Fish.FishTimerCheck(player)) {
    var now = new Date();
    var lastReward = window.Fish.lastDailyReward[player.Handle] || new Date(0);
    if (now.toDateString() !== lastReward.toDateString()) {
      var reward = 1000 + player.Level * 100; // Base reward + level bonus
      player.Points += reward;
      window.Fish.lastDailyReward[player.Handle] = now;
      window.Fish.sendMessage(
        "[DAILY REWARD] " +
          player.Nickname +
          ", you've claimed your daily reward of " +
          reward +
          " points!"
      );
    } else {
      window.Fish.sendMessage(
        "[DAILY REWARD] " +
          player.Nickname +
          ", you've already claimed your daily reward. Come back tomorrow!"
      );
    }
  }
};

// Initialize the expansion
FishExpansion.init();
console.log("Fish Game Expansion fully loaded and initialized.");
