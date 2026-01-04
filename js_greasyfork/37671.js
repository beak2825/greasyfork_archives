// ==UserScript==
// @name         Talibri - Pirion's Combat Stat Tracker
// @namespace    http://talibri.pirion.net/
// @version      0.1
// @description  This is used to get a list of inventory items.
// @author       Kaine "Pirion" Adams
// @match        https://talibri.com/combat_zones/*/adventure
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/37671/Talibri%20-%20Pirion%27s%20Combat%20Stat%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/37671/Talibri%20-%20Pirion%27s%20Combat%20Stat%20Tracker.meta.js
// ==/UserScript==

var combat = {
    data: null,
    is_stopped: false,
    actionDictionary: { skills: [
        {name: "Stab",successful: true, text: "You lunged at the enemy stabbing them"},
        {name: "Stab",successful: false, text: "You attempted to use Stab"},
        {name: "Shock Strike",successful: true, text: "You channel lightning energy into your blade"},
        {name: "Shock Strike",successful: false, text: "You attempted to use Shock Strike"},
        {name: "Lightning Defense",successful: true, text: "Lightning courses through your body"},
        {name: "Lightning Defense",successful: false, text: "You attempted to use Lightning Defense"},
        {name: "Dash",successful: true, text: "You dash into the enemy's defenses"},
        {name: "Bash",successful: true, text: "You bash the enemy"},
        {name: "Bash",successful: false, text: "You attempted to use Bash"},
        {name: "Shout",successful: true, text: "You shout at the enemy building your adrenaline"},
        {name: "Fiery Strike",successful: true, text: "You cover your weapon in oil and light it ablaze before striking the enemy"},
        {name: "Fiery Strike",successful: false, text: "You attempted to use Fiery Strike"},
        {name: "Aimed Shot",successful: true, text: "You line up the shot and let your arrow fly"},
        {name: "Aimed Shot",successful: false, text: "You attempted to use Aimed Shot"},
        {name: "Rapid Shot",successful: true, text: "One of your arrows launched in quick succession"},
        {name: "Rapid Shot",successful: false, text: "You attempted to use Rapid Shot"},
        {name: "Wing Clip",successful: true, text: "You aim for the enemy's weapon"},
        {name: "Wing Clip",successful: false, text: "You attempted to use Wing Clip"},
        {name: "Ignite",successful: true, text: "You set your enemy ablaze"},
        {name: "Ignite",successful: false, text: "You attempted to use Ignite"},
        {name: "Freeze",successful: true, text: "You freeze your enemy"},
        {name: "Freeze",successful: false, text: "You attempted to use Freeze"},
        {name: "Electrify",successful: true, text: "You Electrify your enemy"},
        {name: "Electrify",successful: false, text: "You attempted to use Electrify"},
        {name: "Earth Eruption",successful: true, text: "The Earth Erupts under your enemy"},
        {name: "Earth Eruption",successful: false, text: "You attempted to use Earth Eruption"},
        {name: "Item Failed",successful: false, text: "You are out of"},
    ]},
    cookiePath: function() {
        return "/";
    },
    cookieName: function() {
        return "/scripts/pirion/combat/data";
    },
    cookieExpirationDays: function() {
        return 7;
    },
    initialize: function() {
        //add jquery.cookie.js:
        $('head').append('<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.4.1/jquery.cookie.js"></script>');
        $('head').append('<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js"></script>');
        $('head').append('<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.css" />');
        $('head').append('<script type="text/javascript">var script = script || {};</script>');
        window.setInterval(combat.initalizeUserInterface, 2000);
        combat.start();
    },
    initalizeUserInterface: function() {
        if($("#combatTrackerDialog").length>0)
        {
            return;
        }
        var menuHtml = '<li><a id="combatTrackerDialog_opener" onclick="javascript:$(\'#combatTrackerDialog\').dialog(\'open\');return false;" href="#">Combat Tracker</a></li>';

        $('.navbar-nav').prepend(menuHtml);

        var html = "";
        html += '<div style="width: 80%; margin-left: auto; margin-right: auto;">';
        html += '<div style="width: 80px; margin-left: auto; margin-right: auto;">';
        html += '<a style="width: 80px;" onclick="javascript: script.reset=true;return false;" href="#">Reset Stats</a></div>';
        html += '<table style="width: 80%; margin-left: auto; margin-right: auto;">';
        html += '<tr><th>Actions</th><td id="combat_actions">0</td></tr>';
        html += '<tbody><tr><th>Accuracy</th><td id="combat_accuracy">0/0</td></tr>';
        html += '<tr><th>Exp Gained</th><td id="combat_exp">0</td></tr>';
        html += '<tr><th>Leol Gained</th><td id="combat_leol">0</td></tr>';
        html += '<tr><th>Exp/Hour</th><td id="combat_exp_hour">0.00</td></tr>';
        html += '<tr><th>Leol/Hour</th><td id="combat_leol_hour">0.00</td></tr>';
        html += '</tbody></table></div>';

        $('body').append('<div id="combatTrackerDialog" title="Combat Tracking">' + html + '</div>');

        $("#combatTrackerDialog").dialog();

        if(!combat.data) {
            combat.data = combat.load();
            //if we can't check the cookie,
            //let's skip this round so we don't overwrite it.
            if(!combat.data) {
                return;
            }
        }
        combat.updateUI();
    },
    stop: function() {
        combat.is_stopped = true;
    },
    start: function() {
        //add a listener for any ajax page completed
        $(document).ajaxComplete(combat.listen);
        combat.is_stopped = false;
    },
    destory: function() {
        //why would you ever want to do this?
        combat.stop();
        $.removeCookie(combat.cookieName(), {path: combat.cookiePath()});
    },
    reset: function() {
        //overwrite data, and save
        script.reset = false;
        combat.data = combat.new();
        combat.save();
        combat.updateUI();
    },
    new: function() {
        //generate an empty json array
        var empty_data = {
            version: 2,
            update: (new Date()),
            since: (new Date()),
            rounds: 0,
            win: 0,
            loss: 0,
            flee: 0,
            inCombat: false,
            leol: 0,
            actions: {},
            items: {},
            monsters: {},
            stats: {},
            affinities: {},
            loot: {}
        };
        return empty_data;
    },
    load: function() {
        //if cookie exists, load, otherwise get a new array.
        var cookie = $.cookie(combat.cookieName());
        if(cookie) {
            var loaded_data = $.parseJSON(cookie);
            return combat.migrate(loaded_data);
        }
        return combat.new();
    },
    migrate: function(migration_data) {
        //if we load, we need to make sure to reset the cookie to a good state.
        if(migration_data.version == 1) {
            //bug caused leol to fail. this will set it to zero.
            migration_data.version = 2;
            migration_data.leol = 0;
        }
        //if we are in combat, lets count as a flee:
        if(migration_data.inCombat == true) {
            migration_data.inCombat = false;
            migration_data.flee += 1;
        }
        return migration_data;
    },
    save: function() {
        //create cookie that expires in 7 days:
        $.cookie(combat.cookieName(), JSON.stringify(combat.data), { path: combat.cookiePath(), expires: combat.cookieExpirationDays() });
    },
    listen: function(event, xhr, settings) {
        //if we've been asked to exit, let's unbind:
        if(combat.is_stopped) {
            $(e.currentTarget).unbind('ajaxComplete');
            return;
        }

        //if ajax response comes from expected location:
        if(settings.url.indexOf('adventure/continue') > -1) {
            if(script && script.reset) {
                combat.reset();
            }
            //if data has not been initialized, initialize it.
            if(!combat.data) {
                combat.data = combat.load();
                //if we can't check the cookie,
                //let's skip this round so we don't overwrite it.
                if(!combat.data) {
                    return;
                }
            }

            var result = combat.getResult(xhr.responseText);

            combat.logBattleRound(result);
        }
    },
    getResult: function(response) {
        var result = {
            player: {
                slain: false
            },
            monster: {
                name: "Unknown",
                slain: false
            },
            leol: 0,
            action: {
                type: "Nothing",
                name: "Unknown",
                successful: false
            },
            stats: {},
            affinities: {},
            loot: {}
        };

        if(response.indexOf('You limped back to town on the verge of death') > -1) {
            result.player.slain = true;
        }

        responseLines = response.split(";");

        for(var i = 0; i < responseLines.length; i++) {
            var item = responseLines[i].toLowerCase();
            if(item.indexOf("$('button:contains(\"") > -1) {
                var userItem = item.substr(item.indexOf("$('button:contains(\"")+20);
                result.action.type = "Item";
                result.action.name = userItem.substr(0,userItem.indexOf(" ("));
                result.action.successful = true;

            } else if(item.indexOf("$combat_round.append") > -1 &&
                item.indexOf("you") > -1)
            {
                var combatText = item.split("\"")[1];

                if(combatText.indexOf("experience.") > -1) {
                    var parts = combatText.split(" ");
                    result.affinities[parts[3]] = parseInt(parts[2]);
                } else if(combatText.indexOf("leol.") > -1) {
                    var parts = combatText.split(" ");
                    result.leol = parseInt(parts[2]);
                } else if(combatText.indexOf("experience,") > -1) {
                    var parts = combatText
                                    .replace("you gained ","")
                                    .split(", ");
                    for(var j = 0; j < parts.length; j++){
                        var experienceString = parts[j].split(" ");
                        result.stats[experienceString[1]] = parseInt(experienceString[0]);
                    }
                    result.leol = parseInt(parts[2]);
                } else if(combatText.indexOf("you killed the ") > -1) {
                    result.monster.name = combatText.replace("you killed the ","").replace("! <br/>","");
                    result.monster.slain = true;
                } else if(combatText.indexOf(". you now have ") > -1) {
                    var itemStringParts = combatText.substr(11, combatText.indexOf("(")-11).split(" ");
                    var itemString = "";
                    for(var k = 1; k < itemStringParts.length; k++){
                        itemString += (itemString == "" ? "" : " ") + itemStringParts[k];
                    }
                    result.loot[itemString] = parseInt(itemStringParts[0]);
                } else {
                    if(result.action.name == "Unknown") {
                        for(var l = 0; l < combat.actionDictionary.skills.length; l++) {
                            if(combatText.startsWith(combat.actionDictionary.skills[l].text.toLowerCase())) {
                                result.action = combat.actionDictionary.skills[l];
                                result.action.type = "Skill";
                            }
                        }
                    }
                }

            }
        }

        return result;
    },
    logBattleRound: function(result){
        //update the data array:
        combat.data.update = new Date();
        combat.data.rounds += 1;
        combat.data.leol += result.leol;

        if(result.player.slain) {
            combat.data.loss += 1;
        }

        //create action stub if not exists:
        if(result.action.type=="Skill") {
            if(!combat.data.actions[result.action.name]) {
                combat.data.actions[result.action.name] = {successful: 0, unsuccessful: 0};
            }

            //count action:
            if(result.action.successful) {
                combat.data.actions[result.action.name].successful += 1;
            } else {
                combat.data.actions[result.action.name].unsuccessful += 1;
            }
        } else if(result.action.type=="Item") {
            if(!combat.data.items[result.action.name]) {
                combat.data.items[result.action.name] = {count: 1};
            } else {
                combat.data.items[result.action.name].count += 1;
            }
        }
        //if monster was slain, count:
        if(result.monster.slain) {
            if(!combat.data.monsters[result.monster.name]) {
                combat.data.monsters[result.monster.name] = 1;
            } else {
                combat.data.monsters[result.monster.name] += 1;
            }
            combat.data.inCombat = false;
            combat.data.win += 1;
        } else {
            combat.data.inCombat = true;
        }

        for(var stat in result.stats)
        {
            if(!combat.data.stats[stat]) {
                combat.data.stats[stat] = result.stats[stat];
            } else {
                combat.data.stats[stat] += result.stats[stat];
            }
        }

        for(var affinity in result.affinities)
        {
            if(!combat.data.affinities[affinity]) {
                combat.data.affinities[affinity] = result.affinities[affinity];
            } else {
                combat.data.affinities[affinity] += result.affinities[affinity];
            }
        }

        for(var item in result.loot)
        {
            if(!combat.data.loot[item]) {
                combat.data.loot[item] = result.loot[item];
            } else {
                combat.data.loot[item] += result.loot[item];
            }
        }

        //make changes to the cookie
        combat.save();
        //make an update to the visible UI
        combat.updateUI();
    },
    updateUI: function() {
        var ui = $('#combatTrackerDialog')[0];
        if(!ui) {
            return;
        }
        var runtime = (new Date(combat.data.update) - new Date(combat.data.since))/(3600000);
        var success = 0;
        var failure = 0;
        for(var action in combat.data.actions) {
            success += combat.data.actions[action].successful;
            failure += combat.data.actions[action].unsuccessful;
        }
        $("#combat_accuracy")[0].innerText = success.toString() + ' of ' + (success+failure).toString() + ' ('+ (Math.round(success/(success+failure)*10000)/100).toString() + '%)';
        $("#combat_actions")[0].innerText = combat.data.rounds.toString();
        var exp_all = 0;
        for(var affinity in combat.data.affinities) {
            exp_all += combat.data.affinities[affinity];
        }
        $("#combat_exp")[0].innerText = exp_all.toString();
        $("#combat_leol")[0].innerText = combat.data.leol.toString();
        $("#combat_exp_hour")[0].innerText = (Math.round(exp_all/runtime*100)/100).toString();
        $("#combat_leol_hour")[0].innerText = (Math.round(combat.data.leol/runtime*100)/100).toString();

    },
    getString: function() {
        return JSON.stringify(combat.data);
    },
    log: function() {
        console.log(combat.getString());
    }
};


combat.initialize();

//start the script:
