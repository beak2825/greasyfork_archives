// ==UserScript==
// @name          Eternity Tower Battle Cooldown Tracker
// @icon          https://www.eternitytower.net/favicon.png
// @namespace     http://mean.cloud/
// @version       1.07
// @description   Displays each player's cooldowns during battle.
// @match         *://eternitytower.net/*
// @match         *://www.eternitytower.net/*
// @match         http://localhost:3000/*
// @author        psouza4@gmail.com, Aes Sedai
// @copyright     2018-2023, MeanCloud
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/371002/Eternity%20Tower%20Battle%20Cooldown%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/371002/Eternity%20Tower%20Battle%20Cooldown%20Tracker.meta.js
// ==/UserScript==


(function() {
    'use strict';

    $("<style type='text/css'> .ally-cd-ready { border: 1px solid green !important; background-color: #f3fff3 !important; } .ally-cd-never-used { border: 1px solid blue !important; background-color: #eef3ff !important; } .ally-cd-used { border: 1px solid #700 !important; background-color: #fdd !important; } .cd-container > div { display: flex; align-items: center; } .cd-container > div > p { padding-left: 8px; margin-bottom: 0;} .room-number-container > p {font-size: 16px; line-height: 16px; margin-bottom: 0; text-align: center;} </style>").appendTo("head");

    // Default settings, use window.et_battleCd in console to change settings
    // hideOwnCds: BOOLEAN, default: true; if true, your own cooldowns are always hidden
    // hideReadyCds: BOOLEAN, default: true; if true, only skills that are on cooldown will be shown and ready-to-use skills will be hidden
    // ignoreAbilityCds: ARRAY, default: []; contains a comma-delimited list of strings of ability names to ignore
    // showRoomNumber: BOOLEAN, default: true; if true, shows the floor number in the buff bar at the top
    window.et_battleCd = {
        hideOwnCds: true,
        hideReadyCds: true,
        ignoreAbilityCds: [],
        showRoomNumber: true
    };

    if(localStorage.getItem('et_battleCd')) window.et_battleCd = Object.assign({}, window.et_battleCd, JSON.parse(localStorage.getItem('et_battleCd')));

window.et_battleCd.hideOwnCds = false;
window.et_battleCd.hideReadyCds = false;
window.et_battleCd.showRoomNumber = true;

    $(window).on("beforeunload", function() {
        localStorage.setItem('et_battleCd', JSON.stringify(window.et_battleCd));
    });

    var userId = Meteor.userId();

    function getAbilityIcon(ability) {
        if (ability.id === "critical_up") return "criticalChance2.svg";
        if (ability.id === "attack_up") return "attack.svg";
        if (ability.id === "accuracy_up") return "accuracy.svg";
        if (ability.id === "defense_up") return "defense.svg";
        if (ability.id === "health_up") return "health.svg";
        if (ability.id === "raise_your_glass") return "eventNYGlasses.svg";
        if (ability.id === "lion_dance") return "eventLNYDance.svg";
        if (ability.id === "charm") return "eventVDhearts.svg";
        if (ability.id === "tricky_step") return "eventSPDTrickyStep.svg";
        if (ability.id === "raise_your_glass") return "eventNYGlasses.svg";
        if (ability.id === "raise_your_glass") return "eventNYGlasses.svg";
        if (ability.id === "raise_your_glass") return "eventNYGlasses.svg";
        
        return ability.id.split("_").map(function(s, idx) {
            if(idx > 0) {
                return s.charAt(0).toUpperCase() + s.slice(1);
            } else return s;
        }).join('') + ".svg";
    }

    function isPassiveAbility(ability) {
        if (['baby_fox', 'skeletal_warrior', 'cute_pig', 'mystic_fairy', 'lny_pig', 'vd_cupid', 'spd_leprechaun'].some(function(name) { return ability.id === name; })) {
            return true;
        }
        if (['twin_blades', 'poisoned_blade', 'thirsty_fangs', 'phantom_strikes', 'accuracy_up', 'attack_up', 'critical_up', 'health_up', 'sixth_sense', 'defense_up', 'spiked_armor', 'frost_armor', 'armor_up_new', 'magic_armor_up', 'magic_power_up', 'healing_power_up', 'lion_dance'].some(function(name) { return ability.id === name; })) {
            return true;
        }
        return false;
    }

    function addAbilityContainer(unit, ability) {
        if (window.et_battleCd.ignoreAbilityCds.some(function(name) {return ability.id === name;})) return;
        if($("[data-"+ability.id+"='"+unit.id+"']").length === 0) {
            var abilityContainer = document.createElement("div");
            abilityContainer.dataset[ability.id] = unit.id;
            var abilityImg = document.createElement("img");
            abilityImg.src = "/icons/"+getAbilityIcon(ability);
            abilityImg.className = "small-icon icon-box ally-cd-never-used ally-ability-unit-"+unit.id;
            abilityContainer.append(abilityImg);
            abilityContainer.append(document.createElement("p"));
            var cdContainer = $("[data-cd-container="+unit.id+"]");
            cdContainer.append(abilityContainer);
        }
    }

    function addUnitCds(unit) {
        if(unit.id === userId && window.et_battleCd.hideOwnCds) return;

        // ensure unit exists first
        var interval = setInterval(function() {
            if ($('img#' + unit.id).length > 0) {
                var unitElem = $('img#' + unit.id);
                if($("[data-cd-container='"+ unit.id +"']").length === 0) {
                    var cdContainer = document.createElement("div");
                    cdContainer.className = "cd-container";
                    cdContainer.dataset.cdContainer = unit.id;
                    var parentElem = unitElem.closest(".flex-column").parent();
                    parentElem.append(cdContainer);
                    unit.abilities.forEach(function(ability) {
                        if(!isPassiveAbility(ability)) addAbilityContainer(unit, ability);
                    });
                }
                clearInterval(interval); // here interval is undefined, but when we call this function it will be defined in this context
            }
        }, 50);
    }

    function updateUnitCds(unit) {
        if(unit.id === userId && window.et_battleCd.hideOwnCds) return;

        unit.abilities.forEach(function(ability) {
            var abilityContainer = $("[data-"+ability.id+"='"+unit.id+"']");
            if(abilityContainer.length > 0) {
                if(window.et_battleCd.hideReadyCds && ability.currentCooldown <= 0) {
                    abilityContainer.remove();
                } else {
                    var abilityCd = abilityContainer.find("p");
                    var abilityCdImg = abilityContainer.find("img");
                    if (ability.currentCooldown < 1)
                        abilityCdImg.removeClass("ally-cd-used").addClass("ally-cd-ready");
                    else
                        abilityCdImg.removeClass("ally-cd-never-used").addClass("ally-cd-used");
                    abilityCd.html((ability.currentCooldown < 1) ? ("") : (ability.currentCooldown.toString().split('.')[0] + " s"));
                }
            } else {
                if(ability.currentCooldown > 0 && !isPassiveAbility(ability)) addAbilityContainer(unit, ability);
            }
        });
    }

    function removeUnitCds(unit) {
        $("[data-cd-container='"+unit.id+"']").remove();
        $("img.ally-ability-unit-"+unit.id).remove();
    }

    function getRoomNumber(battleState) {
        if (battleState.hasOwnProperty("floor")) return "F" + battleState.floor + "\nR" + battleState.room;
        if (battleState.hasOwnProperty("level")) return "L" + battleState.level + "\nW" + battleState.wave;
		return "?";
    }

    function addRoomNumber(battleState) {
        if($(".room-number-container").length > 0) {
            $(".room-number-container").find("p").html(getRoomNumber(battleState));
        } else {
            var interval = setInterval(function() {
                if($(".room-number-container").length > 0) {
                    clearInterval(interval); // here interval is undefined, but when we call this function it will be defined in this context
                } else if ($("div.buff-icon-container > img[src=\"/icons/amulet.svg\"").parent().parent().length > 0) {
                    var topBar = $("div.buff-icon-container > img[src=\"/icons/amulet.svg\"").parent().parent();
                    var roomNumberContainer = document.createElement("div");
                    roomNumberContainer.className = "room-number-container buff-icon-container icon-box medium-icon";
                    var roomNumber = document.createElement("p");
                    roomNumber.innerHTML = getRoomNumber(battleState);
                    roomNumberContainer.append(roomNumber);
                    topBar.append(roomNumberContainer);
                    clearInterval(interval); // here interval is undefined, but when we call this function it will be defined in this context
                }
            }, 50);
        }
    }
	
	function listenToCombatTicks() {
		battleSocket.on('tick', function(oAllData) {
			try {
				// per-tick updates
				var battleState = ourBattleUITemplate.state.get("currentBattle");

				if (window.et_battleCd.showRoomNumber) addRoomNumber(battleState);

				battleState.units.forEach(function(unit) {
					if (unit.stats.health <= 0) {
						removeUnitCds(unit);
					}
					else {
						addUnitCds(unit);
						updateUnitCds(unit);
					}
				});
				if (battleState.hasOwnProperty('deadUnits')) {
					battleState.deadUnits.forEach(function(unit) {
						removeUnitCds(unit);
					});
				}
			}
			catch (err) {
			}
		});
	}

    var ourBattleUITemplate = undefined;    
    var ourUnitList = [];

    Blaze._getTemplate("battleUnit").onRendered(function() {
		if (ourUnitList.length === 0) {
			listenToCombatTicks();
		}
        if ((this.data !== undefined) && (this.data.unit !== undefined)) {
            ourUnitList.push(this);
        }
    });

    Template.currentBattleUi.onCreated(function() {
        ourBattleUITemplate = this;
    });
    
    Template.currentBattleUi.onDestroyed(function() {
        ourUnitList = [];
        ourBattleUITemplate = undefined;
    });

    Meteor.connection._stream.on('message', function(json) {
        try {
            var message = JSON.parse(json);

            if (message.collection === "battlesList") {
                if (message.msg === "removed") {
                    // cleanup
                    $(".cd-container").remove();
                    $(".room-number-container").remove();
                }
            }
        }
        catch (err) {
        }
    });
})();
