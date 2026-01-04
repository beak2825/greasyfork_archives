// ==UserScript==
// @name         ET Battle CD Tracker
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  Displays each player's cooldowns during battle. Settings available in console via window.et_battleCd
// @author       Aes Sedai
// @match        http*://*.eternitytower.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/34406/ET%20Battle%20CD%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/34406/ET%20Battle%20CD%20Tracker.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $("<style type='text/css'> .cd-container > div { display: flex; align-items: center; } .cd-container > div > p { padding-left: 8px; margin-bottom: 0;} .room-number-container > p {font-size: 16px; line-height: 16px; margin-bottom: 0; text-align: center;} </style>").appendTo("head");

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

    $(window).on("beforeunload", function() {
        localStorage.setItem('et_battleCd', JSON.stringify(window.et_battleCd));
    });

    var userId = Meteor.userId();

    function getAbilityName(ability) {
        if(ability.id === "attack_up") return "attack";
        if(ability.id === "accuracy_up") return "accuracy";
        if(ability.id === "defense_up") return "defense";
        if(ability.id === "health_up") return "health";
        return ability.id.split("_").map(function(s, idx) {
            if(idx > 0) {
                return s.charAt(0).toUpperCase() + s.slice(1);
            } else return s;
        }).join('');
    }

    function isPassiveAbility(ability) {
        if(["attack_up", "accuracy_up", "defense_up", "health_up", "poisoned_blade", "thirsty_fangs", "phantom_strikes"].some(function(name) { return ability.id === name; })) return true;
        return false;
    }

    function addAbilityContainer(unit, ability) {
        if (window.et_battleCd.ignoreAbilityCds.some(function(name) {return ability.id === name;})) return;
        if($("[data-"+ability.id+"='"+unit.id+"']").length === 0) {
            var abilityContainer = document.createElement("div");
            abilityContainer.dataset[ability.id] = unit.id;
            var abilityImg = document.createElement("img");
            abilityImg.src = "/icons/"+getAbilityName(ability)+".svg";
            abilityImg.className = "small-icon icon-box";
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
                    abilityCd.html(ability.currentCooldown < 0 ? "0 s" : ability.currentCooldown.toString().split('.')[0] + " s");
                }
            } else {
                if(ability.currentCooldown > 0 && !isPassiveAbility(ability)) addAbilityContainer(unit, ability);
            }
        });
    }

    function removeUnitCds(unit) {
        var cdContainer = $("[data-cd-container='"+unit.id+"']");
        cdContainer.remove();
    }

    function getRoomNumber(battleState) {
        if (battleState.hasOwnProperty("floor")) return "F" + battleState.floor + "\nR" + battleState.room;
        if (battleState.hasOwnProperty("level")) return "L" + battleState.level + "\nW" + battleState.wave;
    }

    function addRoomNumber(battleState) {
        if($(".room-number-container").length > 0) {
            var roomNumberContainer = $(".room-number-container");
            roomNumberContainer.find("p").html(getRoomNumber(battleState));
        } else {
            var interval = setInterval(function() {
                if($(".room-number-container").length > 0) {
                    clearInterval(interval); // here interval is undefined, but when we call this function it will be defined in this context
                } else if ($("#content > div.d-sm-flex.flex-grow > div > div:nth-child(1) > div > div.d-flex.my-1").length > 0) {
                    var topBar = $("#content > div.d-sm-flex.flex-grow > div > div:nth-child(1) > div > div.d-flex.my-1");
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

    Meteor.connection._stream.on("message", function(json) {
        var message = JSON.parse(json);
        if(message.msg == "changed" && message.collection == "redis" &&  message.id.includes("battles-")) {
            // per-tick updates
            var battleState = JSON.parse(message.fields.value);
            battleState.units.forEach(function(unit) {
                addUnitCds(unit);
                updateUnitCds(unit);
            });
            battleState.deadUnits.forEach(function(unit) {
                removeUnitCds(unit);
            });
            if (window.et_battleCd.showRoomNumber) addRoomNumber(battleState);
        } else if(message.msg == "removed" && message.collection == "redis" &&  message.id.includes("battles-")) {
            // cleanup
            $(".cd-container").remove();
            $(".room-number-container").remove();
        }
    });
})();