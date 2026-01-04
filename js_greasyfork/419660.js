// ==UserScript==
// @name         DH3 Master Script
// @namespace    FileFace
// @version      0.1.2
// @description  lolinfinity
// @author       shtos
// @match        dh3.diamondhunt.co
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419660/DH3%20Master%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/419660/DH3%20Master%20Script.meta.js
// ==/UserScript==

(function() {
    'use strict';
(function start() {
    if (window.var_username) {
        Program.init();
    }
    else {
        setTimeout(start, 500);
    }
})();
var Program = {
    settings: {
        oilfix: false,
        heatandfish: false,
        hitchance: false,
        timers: false,
        marginfix: false
    },
    hitchanceInfo: {
        monsterAccuracy: '',
        monsterDefence: '',
        monsterAttack: '',
        heroAccuracy: '',
        heroDefence: ''
    },
    notifInfo: {
        furnaceNotif: 'notification-furnace',
        foundryNotif: 'notification-charcoalFoundry',
        rocketNotif: 'notification-rocket'
    },
    handleStorage: function (key) {
        if (key === 'load') {
            if (localStorage.getItem('master-script')) {
                Program.settings = JSON.parse(localStorage.getItem('master-script'));
            }
            else {
                Program.settings = {
                    oilfix: false,
                    heatandfish: false,
                    hitchance: false,
                    timers: false,
                    marginfix: false
                };
            }
        }
        else {
            localStorage.setItem('master-script', JSON.stringify(Program.settings));
        }
    },
    init: function () {
        Program.handleStorage('load');
        Helpers.addStyles();
        Helpers.createNavigation();
        Helpers.changeButtonColors('load');
        Helpers.oldOilHTML = document.querySelectorAll('.not-table-top-main-skills-keyitem')[2].innerHTML;
        Helpers.oilFixHTML();
        Helpers.heatandfishHTML();
        Helpers.heatandfishShow();
        Program.handleMarginFix();
        Helpers.hitChanceHTML();
        Helpers.hitChanceShow();
        Helpers.timersHTML();
        Helpers.timersShow();
        var oldSmelt = window.smelt;
        window.smelt = function () {
            oldSmelt.apply(this, arguments);
            Helpers.changeFurnaceIcon(arguments[0]);
        };
        var oldSetItems = window.setItems;
        window.setItems = function (data) {
            oldSetItems.apply(this, arguments);
            if (Program.settings.oilfix) {
                Program.handleOilFix();
            }
            if (Program.settings.heatandfish) {
                Program.handleHeatandfish();
            }
            if (Program.settings.hitchance && document.querySelector('#master-script-player-hitchance')) {
                Program.handleHitchance();
            }
            if (Program.settings.timers) {
                Program.handleTimers();
            }
        };
    },
    changeSettings: function (key) {
        Program.settings[key] = !Program.settings[key];
        Program.handleStorage('save');
        Program.handleActive(key);
        Helpers.changeButtonColors(key);
    },
    handleActive: function (key) {
        switch (key) {
            case 'oilfix':
                Helpers.oilFixHTML();
                break;
            case 'heatandfish':
                Helpers.heatandfishShow();
                break;
            case 'hitchance':
                Helpers.hitChanceShow();
                break;
            case 'timers':
                Helpers.timersShow();
                break;
            case 'marginfix':
                Program.handleMarginFix();
                break;
        }
    },
    handleOilFix: function () {
        var MAXOIL = window.var_maxOil;
        var oilTimer = document.querySelector('#oil-timer');
        if (window.var_oil != MAXOIL && window.var_oilIn != window.var_oilOut) {
            if (+window.var_oilIn > +window.var_oilOut) {
                oilTimer.style.color = 'green';
                var oilGain = +window.var_oilIn - +window.var_oilOut;
                var timer = window.formatTime((+MAXOIL - +window.var_oil) / oilGain);
                oilTimer.textContent = timer;
            }
            else if (+window.var_oilIn < +window.var_oilOut) {
                oilTimer.style.color = 'red';
                var oilLost = +window.var_oilOut - +window.var_oilIn;
                var timer = window.formatTime(+window.var_oil / oilLost);
                oilTimer.textContent = timer;
            }
        }
        else {
            oilTimer.style.color = 'white';
            oilTimer.textContent = '--:--:--';
        }
    },
    handleHeatandfish: function () {
        var heat = window.global_foodMap
            .filter(function (e) { return e.rawFoodName !== 'none' && window["var_" + e.rawFoodName]; })
            .map(function (e) { return window["var_" + e.rawFoodName] * e.heat; })
            .reduce(function (acc, cur) { return acc + cur; });
        var energy = window.global_foodMap
            .filter(function (e) { return e.rawFoodName !== 'none' && window["var_" + e.rawFoodName]; })
            .map(function (e) { return window["var_" + e.rawFoodName] * e.energy; })
            .reduce(function (acc, cur) { return acc + cur; });
        document.getElementById('current-heat-bar').textContent =
            'Available heat: ' + window.formatNumber(Helpers.getHeat());
        document.getElementById('heat-bar').textContent = 'Heat needed: ' + window.formatNumber(heat);
        document.getElementById('energy-bar').textContent = 'Raw energy: ' + window.formatNumber(energy);
    },
    handleHitchance: function () {
        if (Program.hitchanceInfo.heroAccuracy != window.var_accuracy ||
            Program.hitchanceInfo.heroDefence != window.var_defence ||
            Program.hitchanceInfo.monsterAccuracy != window.var_monsterAccuracy ||
            Program.hitchanceInfo.monsterDefence != window.var_defence ||
            Program.hitchanceInfo.monsterAttack != window.var_monsterAttack) {
            var monsterHitChance = void 0, playerHitChance = void 0;
            var playerHitChanceElement = document.querySelector('#hitchance-span');
            var monsterHitChanceElement = document.querySelector('#hitchance-monster-span');
            if (+window.var_monsterAttack == 0) {
                monsterHitChance = '100%';
            }
            else {
                monsterHitChance =
                    (Helpers.hitChance(parseInt(window.var_monsterAccuracy), parseInt(window.var_defence)) *
                        100).toFixed(0) + '%';
            }
            playerHitChance =
                (Helpers.hitChance(parseInt(window.var_accuracy), parseInt(window.var_monsterDefence)) * 100).toFixed(0) + '%';
            playerHitChance == '100%'
                ? (playerHitChanceElement.style.color = 'green')
                : (playerHitChanceElement.style.color = 'red');
            monsterHitChance == '100%'
                ? (monsterHitChanceElement.style.color = 'red')
                : (monsterHitChanceElement.style.color = 'green');
            playerHitChanceElement.textContent = playerHitChance;
            monsterHitChanceElement.textContent = monsterHitChance;
            Program.hitchanceInfo.heroAccuracy = window.var_accuracy;
            Program.hitchanceInfo.heroDefence = window.var_defence;
            Program.hitchanceInfo.monsterAccuracy = window.var_monsterAccuracy;
            Program.hitchanceInfo.monsterDefence = window.var_defence;
            Program.hitchanceInfo.monsterAttack = window.var_monsterAttack;
        }
    },
    handleTimers: function () {
        if (window.var_smeltingNeededTimer > 0) {
            document.querySelector("#" + Program.notifInfo.furnaceNotif + "-timer").textContent = Helpers.updateTimer('furnace');
            document.querySelector("#" + Program.notifInfo.furnaceNotif + "-bars-needed").textContent = (window.var_smeltingRequestedAmount - window.var_smeltingCurrentAmount).toString();
        }
        if (typeof window.var_charcoalFoundry != 'undefined') {
            window.var_charcoalFoundryNeededTimer > 0
                ? (document.querySelector("#" + Program.notifInfo.foundryNotif + "-timer").textContent = Helpers.updateTimer('foundry'))
                : null;
        }
        if (typeof window.var_rocket != 'undefined') {
            window.var_rocketStatus == 1 || window.var_rocketStatus == 3
                ? (document.querySelector("#" + Program.notifInfo.rocketNotif + "-timer").textContent = Helpers.updateTimer('rocket'))
                : null;
        }
    },
    handleMarginFix: function () {
        var itemBoxes = document.querySelectorAll('.item-box');
        if (Program.settings.marginfix) {
            itemBoxes.forEach(function (e) { return (e.style.margin = '10px'); });
        }
        else {
            itemBoxes.forEach(function (e) { return (e.style.margin = '20px'); });
        }
    }
};
var Helpers = {
    oilHTML: function () {
        var newHTML = "<table width=\"100%\">\n            <tbody>\n                <tr>\n                    <td style=\"text-align:right;\">\n                        <img src=\"images/oil_lighter.png\" class=\"img-50\">\n                    </td>\n                    <td style=\"font-size:16pt;color:rgb(42,200,200);text-align:left;width:185px;\">\n                        <item-oil type=\"number\">" + window.formatNumber(window.var_oil) + "</item-oil>/<item-maxoil type=\"number\">" + window.formatNumber(window.var_maxOil) + "</item-maxoil>\n                        <span style=\"display: flex; justify-content: center;\" class=\"span-oil-in-out-label\" id=\"span-oil-in-out-label\">\n                            <br>\n                            <span style=\"font-size: 18; color:green\" id=\"oil-timer\">--:--:--</span>\n                        </span>\n                    </td>\n                    <td>\n                        <span style=\"display: flex;flex-direction: column;\" class=\"span-oil-in-out-label\" id=\"span-oil-in-out-label\">\n                            <span style=\"color:green\">(+<item-oilin>" + window.var_oilIn + "</item-oilin>/s)</span>\n                            <span style=\"color:red\">(-<item-oilout>" + window.var_oilOut + "</item-oilout>/s)</span>\n                        </span>\n                    </td>\n                </tr>\n            </tbody>\n        </table>";
        return newHTML;
    },
    oldOilHTML: '',
    heatandfishHTML: function () {
        $('#navigation-right-fishing').prepend("<div id=\"heat-energy-bar-wrapper\" style=\"display:flex;justify-content:center;margin-top:10px\">\n\t\t\t\t<div id=\"heat-energy-bar\" style=\"height:30px;width:650px;background:#393e46;border:1px solid orange;border-radius:5px;display:flex;flex-direction:row;\">\n\t\t\t\t\t  <div id=\"current-heat-bar\" class=\"master-script-heatandfish-cell\"></div>\n\t\t\t\t\t  <div id=\"heat-bar\" class=\"master-script-heatandfish-cell\"></div>\n\t\t\t\t\t  <div id=\"energy-bar\" class=\"master-script-heatandfish-cell\"></div>\n   \t\t\t\t</div>\n   \t\t\t</div>");
    },
    heatandfishShow: function () {
        var bar = document.querySelector('#heat-energy-bar-wrapper');
        if (Program.settings.heatandfish) {
            bar.style.display = 'flex';
        }
        else {
            bar.style.display = 'none';
        }
    },
    oilFixHTML: function () {
        var oilElement = document.querySelectorAll('.not-table-top-main-skills-keyitem')[2];
        oilElement.innerHTML = '';
        if (Program.settings.oilfix) {
            oilElement.innerHTML = Helpers.oilHTML();
        }
        else {
            oilElement.innerHTML = Helpers.oldOilHTML;
        }
    },
    hitChanceHTML: function () {
        var combatTables = document.querySelectorAll('.fighting-section-stats-and-hp-area');
        var accHeroElement = combatTables[0].children[0].children[0].children[1];
        var accMonsterElement = combatTables[1].children[0].children[0].children[1];
        var td = document.createElement('td');
        td.id = 'master-script-player-hitchance';
        td.innerHTML = "<img src=\"images/accuracy.png\" class=\"img-30\"> <span id=\"hitchance-span\">0</span>";
        $(accHeroElement).after(td);
        td = document.createElement('td');
        td.innerHTML = "<img src=\"images/accuracy.png\" class=\"img-30\"> <span id=\"hitchance-monster-span\">0</span>";
        td.id = 'master-script-monster-hitchance';
        $(accMonsterElement).after(td);
    },
    hitChanceShow: function () {
        var combatTables = document.querySelectorAll('.fighting-section-stats-and-hp-area');
        var accHeroElement = combatTables[0].children[0].children[0].children[1];
        var accMonsterElement = combatTables[1].children[0].children[0].children[1];
        var masterHeroElement = document.querySelector('#master-script-player-hitchance');
        var masterMonsterElement = document.querySelector('#master-script-monster-hitchance');
        if (Program.settings.hitchance) {
            accHeroElement.style.display = 'none';
            accMonsterElement.style.display = 'none';
            masterHeroElement.style.display = '';
            masterMonsterElement.style.display = '';
        }
        else {
            accHeroElement.style.display = '';
            accMonsterElement.style.display = '';
            masterHeroElement.style.display = 'none';
            masterMonsterElement.style.display = 'none';
        }
    },
    hitChance: function (accuracy, defence) {
        if (defence % 2 == 0) {
            return 1 / Math.max(1, defence / 2 - accuracy + 1);
        }
        else {
            return (Helpers.hitChance(accuracy, defence - 1) + Helpers.hitChance(accuracy, defence + 1)) / 2;
        }
    },
    timersHTML: function () {
        $("#" + Program.notifInfo.furnaceNotif)[0].style.position = 'relative';
        $("#" + Program.notifInfo.furnaceNotif).append("<img id=\"notification-furnace-img-new\" class=\"img-50\" src=\"/images/" + window.getBestFurnace() + ".png\"><span id=" + Program
            .notifInfo.furnaceNotif + "-timer></span><span id=\"" + Program.notifInfo
            .furnaceNotif + "-bars-needed\" style=\"position: absolute; left: 30px; bottom: 5px;text-shadow:-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;\"></span>");
        $("#" + Program.notifInfo.foundryNotif).append("<span id=" + Program.notifInfo.foundryNotif + "-timer></span>");
        $("#" + Program.notifInfo.rocketNotif).append("<span id=" + Program.notifInfo.rocketNotif + "-timer></span>");
        Helpers.changeFurnaceIcon(window.var_smeltingOreType);
    },
    timersShow: function () {
        if (Program.settings.timers) {
            $('#notification-furnace-img-new').show();
            $("#" + Program.notifInfo.foundryNotif + "-timer").show();
            $("#" + Program.notifInfo.furnaceNotif + "-timer").show();
            $("#" + Program.notifInfo.rocketNotif + "-timer").show();
            $("#" + Program.notifInfo.furnaceNotif + "-value").hide();
            $("#" + Program.notifInfo.furnaceNotif + "-img").hide();
            $("#" + Program.notifInfo.foundryNotif + "-value").hide();
            $("#" + Program.notifInfo.rocketNotif + "-value").hide();
        }
        else {
            $('#notification-furnace-img-new').hide();
            $("#" + Program.notifInfo.foundryNotif + "-timer").hide();
            $("#" + Program.notifInfo.furnaceNotif + "-timer").hide();
            $("#" + Program.notifInfo.rocketNotif + "-timer").hide();
            $("#" + Program.notifInfo.furnaceNotif + "-value").show();
            $("#" + Program.notifInfo.furnaceNotif + "-img").show();
            $("#" + Program.notifInfo.foundryNotif + "-value").show();
            $("#" + Program.notifInfo.rocketNotif + "-value").show();
        }
    },
    changeFurnaceIcon: function (key) {
        var bar;
        switch (key) {
            case 'copper':
                bar = 'bronzeBars';
                break;
            case 'sand':
                bar = 'glass';
                break;
            case 'none':
                bar = window.getBestFurnace();
                break;
            default:
                bar = key + 'Bars';
                break;
        }
        document.querySelector("#" + Program.notifInfo.furnaceNotif + "-img-new").src = "/images/" + bar + ".png";
    },
    addStyles: function () {
        var styles = document.createElement('style');
        styles.textContent = "\n\t\t\t.master-script-button{\n\t\t\t\twidth: 20px;\n\t\t\t\theight: 20px;\n\t\t\t\tmargin-left: 5px;\n\t\t\t}\n\t\t\t.master-script-button-enabled{\n\t\t\t\tbackground-color: green;\n\t\t\t}\n\t\t\t.master-script-button-disabled{\n\t\t\t\tbackground-color: red;\n\t\t\t}\n\t\t\t.master-script-option-wrapper{\n\t\t\t\tdisplay: flex;\n\t\t\t\tjustify-content: center;\n\t\t\t\tflex-direction: column;\n\t\t\t}\n\t\t\t.master-script-button-wrapper{\n\t\t\t\tdisplay: flex;\n\t\t\t\tjustify-content: space-between;\n\t\t\t\tflex-direction: row;\n\t\t\t\twidth: 200px;\t\t\n\t\t\t}\n\t\t\t.master-script-heatandfish-cell{\n\t\t\t\twidth:210px;\n\t\t\t\tdisplay:flex;\n\t\t\t\talign-items:center;\n\t\t\t\tjustify-content: center;\n\t\t\t}\n\t\t";
        $('head').append(styles);
    },
    createNavigation: function () {
        $('#navigation-area-buttons')
            .append("<div onclick=\"navigate('dh3-master-script')\" id=\"navigation-dh3-master-script-button\" class=\"navigate-button\" style=\"color: white;\">\n\t\t\t<img src=\"images/crownIcon.png\" class=\"img-50\">\n\t\t\t<br>\n\t\t\t<div style=\"font-size: 10pt; text-align: center;\">Master</div>\n\t\t  </div>");
        $('#right-panel').append("<div id=\"navigation-dh3-master-script\" style=\"display: none; padding: 1em;\">\n\t\t\t<span class=\"master-script-option-wrapper\">\n\t\t\t\t<span class=\"master-script-button-wrapper\">\n\t\t\t\t\t<span>Oil fix</span>\n\t\t\t\t\t<button id=\"master-script-oilfix-button\" class=\"master-script-button\" ></button>\n\t\t\t\t</span>\n\t\t\t\t<p>Adds a timer to oil element that display how long it will take to fill your oil storage or deplete it.</p>\n\t\t\t</span>\n\t\t\t<span class=\"master-script-option-wrapper\">\n\t\t\t\t<span class=\"master-script-button-wrapper\">\n\t\t\t\t\t<span>Heat and energy bar</span>\n\t\t\t\t\t<button id=\"master-script-heatandfish-button\" class=\"master-script-button\"></button>\n\t\t\t\t</span>\n\t\t\t\t<p>Adds a bar in fishing tab displaying your raw energy and heat needed to cook all of it.</p>\n\t\t\t</span>\n\t\t\t<span class=\"master-script-option-wrapper\">\n\t\t\t\t<span class=\"master-script-button-wrapper\">\n\t\t\t\t\t<span>Hit chance in combat</span>\n\t\t\t\t\t<button id=\"master-script-hitchance-button\" class=\"master-script-button\"></button>\n\t\t\t\t</span>\n\t\t\t\t<p>Replaces accuracy with your chance for a succesful hit.</p>\n\t\t\t</span>\n\t\t\t<span class=\"master-script-option-wrapper\">\n\t\t\t\t<span class=\"master-script-button-wrapper\">\n\t\t\t\t\t<span>Timers on notifications</span>\n\t\t\t\t\t<button id=\"master-script-timers-button\" class=\"master-script-button\"></button>\n\t\t\t\t</span>\n\t\t\t\t<p>Replaces numbers with a timer on furnace, rocket and charcoal foundry notifications.</p>\n\t\t\t</span>\n\t\t\t<span class=\"master-script-option-wrapper\">\n\t\t\t\t<span class=\"master-script-button-wrapper\">\n\t\t\t\t\t<span>Margin fix</span>\n\t\t\t\t\t<button id=\"master-script-marginfix-button\" class=\"master-script-button\"></button>\n\t\t\t\t</span>\n\t\t\t\t<p>Changes margin (space) between itemboxes from 20px to 10px.</p>\n\t\t\t</span>\n\t\t  </div>");
        var originalNavigate = window.navigate;
        window.navigate = function (a) {
            originalNavigate.apply(this, arguments);
            if (a == 'dh3-master-script') {
                //
            }
            else {
                $('#navigation-dh3-master-script').hide();
            }
        };
        setTimeout(Helpers.addEventsToButtons, 500);
    },
    addEventsToButtons: function () {
        document.querySelector('#master-script-oilfix-button').onclick = function () {
            return Program.changeSettings('oilfix');
        };
        document.querySelector('#master-script-heatandfish-button').onclick = function () {
            return Program.changeSettings('heatandfish');
        };
        document.querySelector('#master-script-hitchance-button').onclick = function () {
            return Program.changeSettings('hitchance');
        };
        document.querySelector('#master-script-timers-button').onclick = function () {
            return Program.changeSettings('timers');
        };
        document.querySelector('#master-script-marginfix-button').onclick = function () {
            return Program.changeSettings('marginfix');
        };
    },
    changeButtonColors: function (key) {
        var button = document.querySelector("#master-script-" + key + "-button");
        if (key == 'load') {
            for (var item in Program.settings) {
                Helpers.changeButtonColors(item);
            }
        }
        else {
            if (Program.settings[key]) {
                button.classList.add('master-script-button-enabled');
                button.classList.remove('master-script-button-disabled');
            }
            else {
                button.classList.add('master-script-button-disabled');
                button.classList.remove('master-script-button-enabled');
            }
        }
    },
    getHeat: function () {
        return ((+window.var_heat || 0) +
            (window.var_logs * 1 || 0) +
            (window.var_oakLogs * 2 || 0) +
            (window.var_willowLogs * 3 || 0) +
            (window.var_bambooLogs * 4 || 0) +
            (window.var_mapleLogs * 5 || 0) +
            (window.var_lavaLogs * 6 || 0) +
            (window.var_pineLogs * 7 || 0) +
            (window.var_stardustLogs * 8 || 0));
    },
    updateTimer: function (key) {
        var average, dest, potion;
        switch (key) {
            case 'furnace':
                potion =
                    typeof window.var_largeRocketSpeedPotionTimer != 'undefined' &&
                        window.var_largeFurnacePotionTimer > 0
                        ? 3
                        : 1;
                return window.formatTime(((window.var_smeltingRequestedAmount - window.var_smeltingCurrentAmount) *
                    window.var_smeltingNeededTimer -
                    window.var_smeltingCurrentTimer) /
                    potion);
            case 'foundry':
                return window.formatTime((window.var_charcoalFoundryRequestedAmount - window.var_charcoalFoundryCurrentAmount) *
                    window.var_charcoalFoundryNeededTimer -
                    window.var_charcoalFoundryCurrentTimer);
            case 'rocket':
                potion =
                    typeof window.var_largeRocketSpeedPotionTimer != 'undefined' &&
                        window.var_largeRocketSpeedPotionTimer > 0
                        ? 2
                        : 1;
                if (window.var_rocketDestination == 'moon') {
                    average = 2;
                    dest = 384000;
                }
                else {
                    average = 140;
                    dest = 54000000;
                }
                return window.var_rocketStatus == 1
                    ? window.formatTime((dest - window.var_rocketKm) / average / potion)
                    : window.var_rocketStatus == 3 ? window.formatTime(window.var_rocketKm / average / potion) : null;
        }
    }
};

})();