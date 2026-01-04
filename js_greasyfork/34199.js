// ==UserScript==
// @name         ET Battle Helper
// @version      0.15
// @description  A few interface tweaks to improve your battling experience
// @author       jimborino
// @match        *://*.eternitytower.net/*
// @run-at       document-idle
// @namespace https://greasyfork.org/users/156118
// @downloadURL https://update.greasyfork.org/scripts/34199/ET%20Battle%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/34199/ET%20Battle%20Helper.meta.js
// ==/UserScript==
//


(function() {
    'use strict';

    var storage = window.localStorage;

    var EBHsettings = {
        showEnemyTargets: true,
        showPlayerTargets: true,
        highlightExecuteRange: true,
        showEnemyPercentHealth: true,
        highlightOwnTarget: true,
        loadouts: [
        ]
    };

    if(storage.getItem("ETBattleHelper"))
        EBHsettings = Object.assign({}, EBHsettings, JSON.parse(storage.getItem("ETBattleHelper")));

    $(window).on("beforeunload", function() {
        storage.setItem("ETBattleHelper", JSON.stringify(EBHsettings));
    });

    var ebhStyles = `
        .playerTarget img { border: 1px solid red !important; }

        #target { font-size: 14px; text-transform: capitalize; }

        .battle-unit-container { max-width: 200px; }

        .dropdown-item.ebh-settings {
            cursor: pointer;
        }

        .ebh-settings-modal {
            width: 300px;
            height: 250px;
            position: absolute;
            top: 65px;
            margin-left: auto;
            margin-right: auto;
            left: 0;
            right: 0;
            border: 1px solid black;
            background-color: white;
        }

        .ebh-settings-modal .ebh-close {
            float: right;
            margin-right: 5px;
            margin-top: 5px;
            line-height: 1;
            cursor: pointer;
        }

        .ebh-setting input {
            margin-left: 5px;
        }

        .loadout-container { display: none !important; }
        .loadout-container.active-loadout {
            display: flex !important;
            display: -webkit-flex !important;
            display: -ms-flexbox !important;
        }

        .loadout-container .delete-loadout {
            margin-left: auto;
            cursor: pointer;
            color: red;
            text-decoration: underline;
        }

        .equipment-row .save-loadout {
            float: right;
            cursor: pointer;
            color: green;
            text-decoration: underline;
        }
    `;

    $("<style type='text/css' id='ebh-styles'></style>")
        .text(ebhStyles)
        .appendTo("head");

    setTimeout(initUI, 1000);

    // Prevent typing in chat input box from triggering abilities
    setTimeout(function() { $("input#simple-chat-message").on("keyup", function(e) { e.stopPropagation(); }); }, 2000);

    // Fix hovering for battle log drops
    var obs = new MutationObserver(function(mutations, observer) {
        $(".alert.alert-secondary div.d-flex div.align-items-center img").each(function() {
            $(this).parent().attr("title", $(this).attr("title"));
        });

        mutations.forEach(function(mutation) {
            var addedNodes = mutation.addedNodes;
            if(addedNodes !== null) {
                var nodes = $(addedNodes);
                nodes.each(function() {
                    if($(this).find(".equipment-row").length > 0) {
                        injectLoadoutElements();
                    }
                });
            }
        });
    });
    obs.observe($("body").get(0), { childList: true, subtree: true });


    // Enemy HP % and targets
    Meteor.connection._stream.on("message", function(json) {
        var message = JSON.parse(json);
        if(message.msg == "changed" && message.collection == "redis" &&  message.id.includes("battles-")) {
            var battleState = JSON.parse(message.fields.value);

            battleState.enemies.forEach(function(enemy) {
                var enemyTarget = getUnitById(enemy.target, battleState);
                if (enemyTarget !== undefined) {
                    enemyTarget = enemyTarget.name;
                    var enemyHealth = enemy.stats.health;
                    var enemyHealthMax = enemy.stats.healthMax;
                    var enemyHealthPercent = (enemyHealth / enemyHealthMax) * 100;
                    var enemyImgEl = $("img#" + enemy.id);
                    if(EBHsettings.highlightExecuteRange) {
                        if(enemyHealthPercent < 30) {
                            enemyImgEl.siblings(".progress.health-bar").css("box-shadow", "0 0 0 2px red");
                        } else {
                            enemyImgEl.siblings(".progress.health-bar").css("box-shadow", "none");
                        }
                    }

                    if(EBHsettings.showEnemyPercentHealth) {
                        var enemyPercentEl = enemyImgEl.siblings("div#percent");
                        if(enemyPercentEl.length > 0) {
                            enemyPercentEl.html(enemyHealthPercent.toFixed(2) + "%");
                        } else {
                            enemyPercentEl = $("<div id='percent'>" + enemyHealthPercent.toFixed(2) + "%</div>");
                            enemyPercentEl.insertBefore(enemyImgEl);
                        }
                    }

                    if(EBHsettings.showEnemyTargets) {
                        var enemyTargetEl = enemyImgEl.siblings("div#target");
                        if(enemyTargetEl.length > 0) {
                            enemyTargetEl.html("( " + enemyTarget + " )");
                        } else {
                            enemyTargetEl = $("<div id='target'>( " + enemyTarget + " )</div>");
                            enemyTargetEl.insertBefore(enemyImgEl);
                        }
                    }
                }
            });

            battleState.units.forEach(function(unit) {
                var unitTarget = getUnitById(unit.target, battleState);
                var unitTargetId;
                if(unitTarget === undefined) { // player targets only change when the target is manually changed
                                               // for attacks after an enemy is dead, the target is always the first enemy
                    if(battleState.enemies.length < 1) { // we receive an update when all enemies are dead
                        return;
                    }
                    unitTargetId = battleState.enemies[0].id;
                    unitTarget = battleState.enemies[0].name;
                } else {
                    unitTargetId = unitTarget.id;
                    unitTarget = unitTarget.name;
                }
                var unitImgEl = $("img#" + unit.id);
                if(EBHsettings.showPlayerTargets) {
                    var unitTargetEl = unitImgEl.siblings("div#target");
                    if(unitTargetEl.length > 0) {
                        unitTargetEl.html("( " + unitTarget + " )");
                    } else {
                        unitTargetEl = $("<div id='target'>( " + unitTarget + " )</div>");
                        unitTargetEl.insertBefore(unitImgEl);
                    }
                }



                if(EBHsettings.highlightOwnTarget) {
                    $("img#" + unitTargetId).parent().addClass("playerTarget");
                    $("img#" + unitTargetId).parent()
                                            .parent()
                                            .siblings()
                                            .children()
                                            .removeClass("playerTarget");
                }


            });

        }



        else if(message.msg == "added" && message.collection == "redis" &&  message.id.includes("battles-")) {
            // This fixes abilities triggering after they've recently been switched in
            // Not sure why this works, something to do with recreating the template instance
            var walkTheDOM = function(node, func) {
                func(node);
                node = node.firstChild;
                while (node) {
                    walkTheDOM(node, func);
                    node = node.nextSibling;
                }
            };
            walkTheDOM(document.body, function(node) {
                try{
                    if (Blaze.getView(node).name === "Template.ability"){
                        Blaze.getData(node).templateInstance();
                    }
                } catch(err){
                }
            });
        }

    });

    // Recolor your damage splats
    var oldReceive = Meteor.connection._livedata_data;
    var userId = Meteor.userId();

    Meteor.connection._livedata_data = function() {
        if(arguments[0].msg == "changed" && arguments[0].collection == "redis") {
            var battleState = JSON.parse(arguments[0].fields.value);
            battleState.tickEvents.forEach(function(tickEvent) {
                if(tickEvent.from == userId)
                    tickEvent.customColor = "black";
            });
            arguments[0].fields.value = JSON.stringify(battleState);
        }

        var ret = oldReceive.apply(this, arguments);
        return ret;
    };

    function getUnitById(unitId, battleState) {
        return battleState.units.concat(battleState.enemies).find(function (el) {
            if (el.id == unitId) return true;
        });
    }

    function initUI() {
        // Dropdown menu item
        $("<a></a>")
            .addClass("dropdown-item ebh-settings")
            .text("ET Battle Helper")
            .on("click", function(e) {
                e.preventDefault();
                toggleSettings();
            })
            .appendTo(".navbar div.dropdown-menu");

        // Settings dialog
        var settingsDialog = $("<div></div>")
            .addClass("ebh-settings-modal")
            .css("display", "none")
            .appendTo("body");

        $("<div></div>")
            .text("X")
            .addClass("ebh-close")
            .on("click", function() {
                toggleSettings();
            })
            .appendTo(settingsDialog);

        Object.keys(EBHsettings).forEach(function(key) {
            if(typeof EBHsettings[key] !== "boolean")
                return;
            var settingDiv = $("<div></div>").addClass("ebh-setting");

            $("<label></label>")
                .attr("for", key)
                .text(key)
                .appendTo(settingDiv);

            $("<input type='checkbox'></input>")
                .attr("id", key)
                .prop("checked", EBHsettings[key])
                .on("change", function() {
                    EBHsettings[$(this).attr("id")] = this.checked;
                })
                .appendTo(settingDiv);

            settingDiv.appendTo(settingsDialog);
        });

    }

    function injectLoadoutElements() {
        var loadoutContainer = $("<div></div>")
            .attr("id", "ebh-loadouts-div");

        var loadoutsSelectDiv = $("<div></div>")
            .attr("id", "loadouts-select-div")
            .appendTo(loadoutContainer);

        var loadoutsSelectLabel = $("<div></div>")
            .text("Select Loadout: ")
            .attr("for", "loadouts-select")
            .appendTo(loadoutContainer);

        var loadoutsSelect = $("<select></select>")
            .attr("id", "loadouts-select")
            .on("change", function(e) {
                $(".loadout-container.active-loadout").toggleClass("active-loadout");
                $('.loadout-container[id="' + e.target.value +'"]').toggleClass("active-loadout");
            })
            .appendTo(loadoutContainer);

        var loadoutsDisplay = $("<div></div>")
            .attr("id", "loadouts-display")
            .appendTo(loadoutContainer);

        EBHsettings.loadouts.forEach(function(loadout, index) {
            $("<option></option>")
                .attr("value", loadout.name.replace(" ", "_"))
                .text(loadout.name)
                .appendTo(loadoutsSelect);

            var loadoutContainer = $("<div></div>")
                .addClass("loadout-container d-flex")
                .attr("id", loadout.name.replace(" ", "_"))
                .appendTo(loadoutsDisplay);

            if(index == 0) loadoutContainer.addClass("active-loadout");
            loadout.items.forEach(function(item) {
                var loadoutItem = $("[data-id=" + item + "]")
                    .clone()
                    .addClass("cloned")
                    .on("click", function() {
                        $("[data-id=" + item + "]:not(.cloned)")[0].click();
                    })
                    .appendTo(loadoutContainer);

                // Equipped items have a larger box, make them smaller for consistency
                if(!loadoutItem.hasClass("small")) {
                    loadoutItem.addClass("small");
                }
            });

            var removeLoadout = $("<div></div>")
            .text("Delete Loadout")
            .addClass("delete-loadout")
            .on("click", function() {
                deleteLoadout(loadout.name);
            })
            .appendTo(loadoutContainer);
        });

        $(".equipment-row").append(loadoutContainer);
        $("<div></div>")
            .text("Save Current Loadout")
            .addClass("save-loadout")
            .on("click", function() {
                saveLoadout();
            })
            .prependTo(".equipment-row");

    }

    function saveLoadout() {
        var loadoutName = prompt("Enter a name for your new loadout");
        if(loadoutName === null) return;
        var newLoadout = {name: loadoutName, items: []};
        $(".equipment-row .item-icon-container:not(.cloned)").each(function() {
            newLoadout.items.push($(this).attr("data-id"));
        });

        EBHsettings.loadouts.push(newLoadout);

        $("#ebh-loadouts-div").remove();
        $(".save-loadout").remove();
        injectLoadoutElements();
    }

    function deleteLoadout(loadoutName) {
        EBHsettings.loadouts = EBHsettings.loadouts.filter(function(loadout) {
            return loadout.name !== loadoutName;
        });

       $("#ebh-loadouts-div").remove();
       $(".save-loadout").remove();
       injectLoadoutElements();
    }

    function toggleSettings() {
        $(".ebh-settings-modal").toggle();
    }
})();