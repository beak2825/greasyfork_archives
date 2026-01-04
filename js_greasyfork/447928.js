"use strict";
// ==UserScript==
// @name         BattleHelper
// @namespace    https://fulllifegames.com/Tools/BattleHelper
// @description  This script aims to ease battling on Pokemon Showdown.
// @author       FullLifeGames
// @include      http://play.pokemonshowdown.com/
// @include      https://play.pokemonshowdown.com/
// @include      http://play.pokemonshowdown.com/*
// @include      https://play.pokemonshowdown.com/*
// @include      http://*.psim.us/
// @include      https://*.psim.us/
// @include      http://*.psim.us/*
// @include      https://*.psim.us/*
// @version      1.1.0
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/447928/BattleHelper.user.js
// @updateURL https://update.greasyfork.org/scripts/447928/BattleHelper.meta.js
// ==/UserScript==
(function () {
    var lastOwnPokemon;
    var lastOppPokemon;
    var lastWeatherStatus;
    var lastTerrainStatus;
    var weatherMapping = {
        sunnyday: 'Sun',
        raindance: 'Rain',
        sandstorm: 'Sand',
        hail: 'Hail',
        harshsunshine: 'Harsh Sunshine',
        heavyrain: 'Heavy Rain',
        strongwinds: 'Strong Winds',
    };
    var terrainMapping = {
        grassyterrain: 'Grassy',
        psychicterrain: 'Psychic',
        electricterrain: 'Electric',
        mistyterrain: 'Misty',
    };
    var running = false;
    var runningHandlerId;
    var currentId;
    var currentClickedBattleOptions;
    var currentTier;
    function currentIdExists() {
        return $('#' + currentId).length > 0;
    }
    function getActiveWeatherStats(psRoom, weather) {
        for (var index = 0; index < weather.length; index++) {
            var element = weather[index];
            if (psRoom.find('.' + element + 'weather').length > 0) {
                return element;
            }
        }
        return null;
    }
    function getActivePokemon(littleImages) {
        var activePokemon = null;
        littleImages.each(function () {
            var label = $(this).attr('aria-label');
            if (label.indexOf('(active)') !== -1) {
                activePokemon = label.replace(' (active)', '');
                if (activePokemon.indexOf('(') !== -1) {
                    activePokemon = activePokemon.substr(activePokemon.indexOf('(') + 1);
                    activePokemon = activePokemon.substr(0, activePokemon.indexOf(')'));
                }
            }
        });
        return activePokemon;
    }
    function handleDamageCalcs() {
        // Cycle stop conditions
        if (!running) {
            return;
        }
        if (runningHandlerId !== currentId) {
            runningHandlerId = currentId;
            return;
        }
        if (!currentIdExists()) {
            return;
        }
        runningHandlerId = currentId;
        var psRoom = $(currentClickedBattleOptions).closest('.ps-room');
        var currentWeatherStatus = getActiveWeatherStats(psRoom, Object.keys(weatherMapping));
        var currentTerrainStatus = getActiveWeatherStats(psRoom, Object.keys(terrainMapping));
        var currentOwnPokemon = getActivePokemon($(psRoom.find('.leftbar .picon.has-tooltip')));
        if (currentOwnPokemon !== null) {
            var currentOppPokemon = getActivePokemon($(psRoom.find('.rightbar .picon.has-tooltip')));
            if (currentOppPokemon !== null) {
                if (currentOwnPokemon !== lastOwnPokemon ||
                    currentOppPokemon !== lastOppPokemon ||
                    currentWeatherStatus !== lastWeatherStatus ||
                    currentTerrainStatus !== lastTerrainStatus) {
                    lastOwnPokemon = currentOwnPokemon;
                    lastOppPokemon = currentOppPokemon;
                    lastWeatherStatus = currentWeatherStatus;
                    lastTerrainStatus = currentTerrainStatus;
                    var calcs = '<iframe class="calcIframe" style="width: 100%; height: 30em;" sandbox="allow-same-origin allow-scripts allow-forms" src="https://fulllifegames.com/Tools/CalcApi/?ownPokemon=' +
                        currentOwnPokemon +
                        '&oppPokemon=' +
                        currentOppPokemon +
                        '&weather=' +
                        (currentWeatherStatus !== null ? weatherMapping[currentWeatherStatus] : null) +
                        '&terrain=' +
                        (currentTerrainStatus !== null ? terrainMapping[currentTerrainStatus] : null) +
                        '&tier=' +
                        currentTier +
                        '" />';
                    $(currentClickedBattleOptions)
                        .closest('.battle-log')
                        .children('.inner.message-log')
                        .append($('<div class="chat calc" style="white-space: pre-line">' + calcs + '</div>'));
                }
            }
        }
        // check if new damagecalcs are needed
        setTimeout(handleDamageCalcs, 500);
    }
    function triggerBattleHelp() {
        console.log('BattleHelper triggered');
        $("[name='close']").trigger('click');
        $(currentClickedBattleOptions)
            .closest('.battle-log')
            .children('.inner.message-log')
            .append($('<div class="chat battleHelperScouter" style="white-space: pre-line">Loading ReplayScouter ...</div>'));
        $(currentClickedBattleOptions)
            .closest('.battle-log')
            .children('.inner.message-log')
            .append($('<div class="chat battleHelperDump" style="white-space: pre-line">Loading SmogonDump ...</div>'));
        var psRoom = $(currentClickedBattleOptions).closest('.ps-room');
        var id = psRoom.attr('id');
        currentId = id;
        runningHandlerId = currentId;
        var oppName = $(psRoom.find('.battle div > div.rightbar > div > strong')[0]).html();
        var tier = id.substr(0, id.lastIndexOf('-'));
        tier = tier.substr(tier.lastIndexOf('-') + 1);
        currentTier = tier;
        var teamIcons = $(psRoom.find('.battle > div > div.rightbar > div > .teamicons'));
        var teamPokemon = [];
        teamIcons.each(function () {
            $(this)
                .find('span')
                .each(function () {
                var label = $(this).attr('aria-label');
                if (label !== undefined) {
                    label = label.replace('(active)', '');
                    label = label.replace('(fainted)', '');
                    if (label.indexOf('(') !== -1) {
                        var tempLabel = label.substr(label.lastIndexOf('(') + 1);
                        tempLabel = tempLabel.substr(0, tempLabel.indexOf(')'));
                        if (isNaN(parseInt(tempLabel, 10))) {
                            label = tempLabel;
                        }
                        else {
                            label = label.substr(0, label.indexOf('('));
                        }
                    }
                    teamPokemon.push(label.trim());
                }
            });
        });
        teamPokemon = teamPokemon.filter(function (entry) { return entry !== 'Not revealed'; });
        var team = teamPokemon.join(';');
        $.ajax({
            url: 'https://fulllifegames.com/Tools/ReplayScouterApi/',
            data: {
                name: oppName,
                tier: tier,
                mode: 'showdown',
                team: team,
            },
        }).done(function (data) {
            $('.battleHelperScouter').html(data);
        });
        $.ajax({
            url: 'https://fulllifegames.com/Tools/SmogonDumpApi/',
            data: {
                list: tier + '.txt',
                team: team,
            },
        }).done(function (data) {
            $('.battleHelperDump').html(data);
        });
        running = true;
        setTimeout(handleDamageCalcs, 100);
    }
    function triggerBattleHelpOff() {
        running = false;
    }
    function addOption() {
        var battleHelperButton = $('<button/>', {
            text: 'Battle Helper',
            click: triggerBattleHelp,
            style: 'margin-left: 5px;',
        });
        var battleHelperButtonOff = $('<button/>', {
            text: 'Battle Helper Off',
            click: triggerBattleHelpOff,
            style: 'margin-left: 5px;',
        });
        $('.ps-popup p:last-child').append(battleHelperButton);
        $('.ps-popup p:last-child').append(battleHelperButtonOff);
    }
    function triggerOptionAddition() {
        currentClickedBattleOptions = this;
        setTimeout(addOption, 1);
    }
    function bootstrap() {
        $("[name='openBattleOptions']").off('click').on('click', triggerOptionAddition);
        setTimeout(bootstrap, 100);
    }
    bootstrap();
})();
//# sourceMappingURL=battlehelper.js.map