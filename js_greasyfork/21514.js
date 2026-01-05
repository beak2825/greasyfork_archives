// ==UserScript==
// @name         Kitten Food Tracker
// @namespace    http://tampermonkey.net/nkc/kitten-food-tracker
// @version      0.1
// @description  make sure yr kittens don't starve
// @author       nkc
// @match        http://bloodrizer.ru/games/kittens/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/21514/Kitten%20Food%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/21514/Kitten%20Food%20Tracker.meta.js
// ==/UserScript==

function catnipPerTick (seasonStr) {
    var season = null;
    switch (seasonStr) {
        case 'spring':
            season = game.calendar.seasons[0];
            break;
        case 'summer':
            season = game.calendar.seasons[1];
            break;
        case 'fall':
            season = game.calendar.seasons[2];
            break;
        case 'winter':
            season = game.calendar.seasons[3];
            break;
        default:
            console.log('season should be one of spring/summer/fall/winter');
    }
    var catnip = game.calcResourcePerTick('catnip', season);

    return catnip;
}

function catnipPerDayMap () {
    var ticksPerDay = 1 / game.calendar.dayPerTick;
    var oldPause = game.isPaused;
    var oldWeather = game.calendar.weather;

    game.calendar.weather = 'warm';
    var warmMap = {
        'spring': catnipPerTick('spring') * ticksPerDay,
        'summer': catnipPerTick('summer') * ticksPerDay,
        'fall':   catnipPerTick('fall') * ticksPerDay,
        'winter': catnipPerTick('winter') * ticksPerDay
    };

    game.calendar.weather = null;
    var avgMap = {
        'spring': catnipPerTick('spring') * ticksPerDay,
        'summer': catnipPerTick('summer') * ticksPerDay,
        'fall':   catnipPerTick('fall') * ticksPerDay,
        'winter': catnipPerTick('winter') * ticksPerDay
    };

    game.calendar.weather = 'cold';
    var coldMap = {
        'spring': catnipPerTick('spring') * ticksPerDay,
        'summer': catnipPerTick('summer') * ticksPerDay,
        'fall':   catnipPerTick('fall') * ticksPerDay,
        'winter': catnipPerTick('winter') * ticksPerDay
    };

    game.calendar.weather = oldWeather;
    game.isPaused = oldPause;

    return {'warm': warmMap, 'avg': avgMap, 'cold': coldMap};
}
function getTempRow (map, temp) {
    var row = '<tr><td>' + temp + '</td>' +
        '<td>' + game.getDisplayValueExt(map[temp].spring * game.calendar.daysPerSeason, true) + '</td>' +
        '<td>' + game.getDisplayValueExt(map[temp].summer * game.calendar.daysPerSeason, true) + '</td>' +
        '<td>' + game.getDisplayValueExt(map[temp].fall * game.calendar.daysPerSeason, true) + '</td>' +
        '<td>' + game.getDisplayValueExt(map[temp].winter * game.calendar.daysPerSeason, true) + '</td>' +
        '</tr>';
    return row;
}

function createSeasonTable (map) {
    var table = '<table><colgroup><col width="40"><col width="60">' +
        '<col width="60"><col width="60"><col width="60"></colgroup>' +
        '<tr><th></th><th>Spring</th><th>Summer</th><th>Fall</th><th>Winter</th></tr>' +
        getTempRow(map, 'warm') + getTempRow(map, 'avg') + getTempRow(map, 'cold') +
        '</table>';
    return table;
}

function createInfoList (map) {
    var ticksPerDay = 1 / game.calendar.dayPerTick;
    var demandPerDay = game.getResourcePerTickStack('catnip')[12].value * ticksPerDay;

    var production = (map.avg.spring + map.avg.summer + map.avg.fall + map.avg.winter - 4 * demandPerDay) * game.calendar.daysPerSeason;
    var demand = demandPerDay * game.calendar.daysPerSeason * 4;

    var daysLeft = game.calendar.daysPerSeason - game.calendar.day;
    var winterDaysLeft = (game.calendar.season == 3) ? daysLeft : game.calendar.daysPerSeason;

    var coldWinter = (((map.cold.winter * winterDaysLeft) + game.resPool.get('catnip').value) > 0) ? 'yes' : 'no';
    var productionLeft = 0;
    switch (game.calendar.season) {
        case 0:     //spring
            productionLeft += map.cold.spring * daysLeft;
            productionLeft += map.cold.summer * game.calendar.daysPerSeason;
            productionLeft += map.cold.fall * game.calendar.daysPerSeason;
            productionLeft += map.cold.winter * game.calendar.daysPerSeason;
            break;
        case 1:     //summer
            productionLeft += map.cold.summer * daysLeft;
            productionLeft += map.cold.fall * game.calendar.daysPerSeason;
            productionLeft += map.cold.winter * game.calendar.daysPerSeason;
            break;
        case 2:     //fall
            productionLeft += map.cold.fall * daysLeft;
            productionLeft += map.cold.winter * game.calendar.daysPerSeason;
            break;
        case 3:     //winter
            productionLeft += map.cold.winter * daysLeft;
            break;
    }

    var coldYear = ((productionLeft + game.resPool.get('catnip').value) > 0) ? 'yes' : 'no';

    var list = '<p>' +
        'Yearly Production (Avg):<span style="float:right">' + game.getDisplayValueExt(production, true) + '</span><br>' +
        'Yearly Demand (Avg):<span style="float:right">' + game.getDisplayValueExt(demand, true) + '</span><br>' +
        'Yearly Delta (Avg):<span style="float:right">' + game.getDisplayValueExt(production + demand, true) + '</span><br>' +
        'Survive cold winter?:<span style="float:right">' + coldWinter + '</span><br>' +
        'Survive cold year?:<span style="float:right">' + coldYear + '</span>' +
        '</p>';

    return list;
}

var updateKittenFood = function () {
    var catnipMap = catnipPerDayMap();
    var table = createSeasonTable(catnipMap);
    var list = createInfoList(catnipMap);

    var advDiv = dojo.byId("advisorsContainer");
    dojo.empty(advDiv);

    advDiv.innerHTML = '<div style="position:relative;left:5px">' + table + list + '</div>';
};

game.updateAdvisors = function () {};
game.timer.addEvent(updateKittenFood, 10);