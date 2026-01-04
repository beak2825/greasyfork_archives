// ==UserScript==
// @name         War Value Calculator
// @namespace    http://www.knightsradiant.pw
// @version      0.51
// @description  Add a damage inflicted value table to war timelines
// @author       Talus
// @match        https://politicsandwar.com/nation/war/timeline*
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @license      GPL-3.0-or-later
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427397/War%20Value%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/427397/War%20Value%20Calculator.meta.js
// ==/UserScript==

(function(){
    var $ = window.jQuery;
    var resourceValues = JSON.parse(localStorage.getItem('resourceValues'));
    if (resourceValues == null) {
        alert('Visit the trades page to update resource values used for loss calculations.');
        return;
    }
    var agressorValues = getAgressorValues($);
    var defenderValues = getDefenderValues($);
    var agressorMoney = getMoney(agressorValues, defenderValues, resourceValues);
    var agressorNet = getNet(agressorMoney);
    var defenderMoney = getMoney(defenderValues, agressorValues, resourceValues);
    var defenderNet = getNet(defenderMoney);
    var totalLoses = -(agressorNet + defenderNet);
    var winnerNet = Math.abs(agressorNet - defenderNet);

    for (const property in agressorMoney) {
        agressorMoney[property] = agressorMoney[property].toLocaleString(undefined, {minimumFractionDigits:2});
    }
    for (const property in defenderMoney) {
        defenderMoney[property] = defenderMoney[property].toLocaleString(undefined, {minimumFractionDigits:2});
    }
    //writeResultsToConsole(agressorMoney, agressorNet, defenderMoney, defenderNet, totalLoses, winnerNet);
    addResultsToPage($, agressorMoney, agressorNet, defenderMoney, defenderNet, totalLoses, winnerNet);
})();

function getAgressorValues($) {
    let agressorPaths = {
        infrastructureDestroyedValue: '#rightcolumn > table:nth-child(11) > tbody > tr:nth-child(3) > td:nth-child(2)',
        moneyStolen: '#rightcolumn > table:nth-child(11) > tbody > tr:nth-child(4) > td:nth-child(2)',
        soldiersKilled: '#rightcolumn > table:nth-child(11) > tbody > tr:nth-child(5) > td:nth-child(2)',
        tanksDestroyed: '#rightcolumn > table:nth-child(11) > tbody > tr:nth-child(6) > td:nth-child(2)',
        aircraftDestroyed: '#rightcolumn > table:nth-child(11) > tbody > tr:nth-child(7) > td:nth-child(2)',
        shipsDestroyed: '#rightcolumn > table:nth-child(11) > tbody > tr:nth-child(8) > td:nth-child(2)',
        missilesLaunched: '#rightcolumn > table:nth-child(11) > tbody > tr:nth-child(9) > td:nth-child(2)',
        nukesLaunched: '#rightcolumn > table:nth-child(11) > tbody > tr:nth-child(11) > td:nth-child(2)',
        munitionsUsed: '#rightcolumn > table:nth-child(11) > tbody > tr:nth-child(13) > td:nth-child(2)',
        gasolineUsed: '#rightcolumn > table:nth-child(11) > tbody > tr:nth-child(14) > td:nth-child(2)',
        steelUsed: '#rightcolumn > table:nth-child(11) > tbody > tr:nth-child(15) > td:nth-child(2)',
        aluminumUsed: '#rightcolumn > table:nth-child(11) > tbody > tr:nth-child(16) > td:nth-child(2)',
        aircraftDestroyedGround: '#rightcolumn > table:nth-child(11) > tbody > tr:nth-child(21) > td:nth-child(2)',
        soldiersKilledAir: '#rightcolumn > table:nth-child(11) > tbody > tr:nth-child(22) > td:nth-child(2)',
        tanksDestroyedAir: '#rightcolumn > table:nth-child(11) > tbody > tr:nth-child(23) > td:nth-child(2)',
        shipsDestroyedAir: '#rightcolumn > table:nth-child(11) > tbody > tr:nth-child(24) > td:nth-child(2)',
        moneyDestroyedAir: '#rightcolumn > table:nth-child(11) > tbody > tr:nth-child(25) > td:nth-child(2)'
    };
    return {
        infrastructureDestroyedValue: Number($(agressorPaths.infrastructureDestroyedValue).text().replace('$','').replaceAll(',','')),
        moneyStolen: Number($(agressorPaths.moneyStolen).text().replace('$','').replaceAll(',','')),
        soldiersKilled: Number($(agressorPaths.soldiersKilled).text().replaceAll(',','')),
        tanksDestroyed: Number($(agressorPaths.tanksDestroyed).text().replaceAll(',','')),
        aircraftDestroyed: Number($(agressorPaths.aircraftDestroyed).text().replaceAll(',','')),
        shipsDestroyed: Number($(agressorPaths.shipsDestroyed).text().replaceAll(',','')),
        missilesLaunched: Number($(agressorPaths.missilesLaunched).text().replaceAll(',','')),
        nukesLaunched: Number($(agressorPaths.nukesLaunched).text().replaceAll(',','')),
        munitionsUsed: Number($(agressorPaths.munitionsUsed).text().replaceAll(',','')),
        gasolineUsed: Number($(agressorPaths.gasolineUsed).text().replaceAll(',','')),
        steelUsed: Number($(agressorPaths.steelUsed).text().replaceAll(',','')),
        aluminumUsed: Number($(agressorPaths.aluminumUsed).text().replaceAll(',','')),
        aircraftDestroyedGround: Number($(agressorPaths.aircraftDestroyedGround).text().replaceAll(',','')),
        soldiersKilledAir: Number($(agressorPaths.soldiersKilledAir).text().replaceAll(',','')),
        tanksDestroyedAir: Number($(agressorPaths.tanksDestroyedAir).text().replaceAll(',','')),
        shipsDestroyedAir: Number($(agressorPaths.shipsDestroyedAir).text().replaceAll(',','')),
        moneyDestroyedAir: Number($(agressorPaths.moneyDestroyedAir).text().replace('$','').replaceAll(',',''))
    };
}

function getDefenderValues($) {
    let defenderPaths = {
        infrastructureDestroyedValue: '#rightcolumn > table:nth-child(11) > tbody > tr:nth-child(3) > td:nth-child(3)',
        moneyStolen: '#rightcolumn > table:nth-child(11) > tbody > tr:nth-child(4) > td:nth-child(3)',
        soldiersKilled: '#rightcolumn > table:nth-child(11) > tbody > tr:nth-child(5) > td:nth-child(3)',
        tanksDestroyed: '#rightcolumn > table:nth-child(11) > tbody > tr:nth-child(6) > td:nth-child(3)',
        aircraftDestroyed: '#rightcolumn > table:nth-child(11) > tbody > tr:nth-child(7) > td:nth-child(3)',
        shipsDestroyed: '#rightcolumn > table:nth-child(11) > tbody > tr:nth-child(8) > td:nth-child(3)',
        missilesLaunched: '#rightcolumn > table:nth-child(11) > tbody > tr:nth-child(9) > td:nth-child(3)',
        nukesLaunched: '#rightcolumn > table:nth-child(11) > tbody > tr:nth-child(11) > td:nth-child(3)',
        munitionsUsed: '#rightcolumn > table:nth-child(11) > tbody > tr:nth-child(13) > td:nth-child(3)',
        gasolineUsed: '#rightcolumn > table:nth-child(11) > tbody > tr:nth-child(14) > td:nth-child(3)',
        steelUsed: '#rightcolumn > table:nth-child(11) > tbody > tr:nth-child(15) > td:nth-child(3)',
        aluminumUsed: '#rightcolumn > table:nth-child(11) > tbody > tr:nth-child(16) > td:nth-child(3)',
        aircraftDestroyedGround: '#rightcolumn > table:nth-child(11) > tbody > tr:nth-child(21) > td:nth-child(3)',
        soldiersKilledAir: '#rightcolumn > table:nth-child(11) > tbody > tr:nth-child(22) > td:nth-child(3)',
        tanksDestroyedAir: '#rightcolumn > table:nth-child(11) > tbody > tr:nth-child(23) > td:nth-child(3)',
        shipsDestroyedAir: '#rightcolumn > table:nth-child(11) > tbody > tr:nth-child(24) > td:nth-child(3)',
        moneyDestroyedAir: '#rightcolumn > table:nth-child(11) > tbody > tr:nth-child(25) > td:nth-child(3)'
    };
    return {
        infrastructureDestroyedValue: Number($(defenderPaths.infrastructureDestroyedValue).text().replace('$','').replaceAll(',','')),
        moneyStolen: Number($(defenderPaths.moneyStolen).text().replace('$','').replaceAll(',','')),
        soldiersKilled: Number($(defenderPaths.soldiersKilled).text().replaceAll(',','')),
        tanksDestroyed: Number($(defenderPaths.tanksDestroyed).text().replaceAll(',','')),
        aircraftDestroyed: Number($(defenderPaths.aircraftDestroyed).text().replaceAll(',','')),
        shipsDestroyed: Number($(defenderPaths.shipsDestroyed).text().replaceAll(',','')),
        missilesLaunched: Number($(defenderPaths.missilesLaunched).text().replaceAll(',','')),
        nukesLaunched: Number($(defenderPaths.nukesLaunched).text().replaceAll(',','')),
        munitionsUsed: Number($(defenderPaths.munitionsUsed).text().replaceAll(',','')),
        gasolineUsed: Number($(defenderPaths.gasolineUsed).text().replaceAll(',','')),
        steelUsed: Number($(defenderPaths.steelUsed).text().replaceAll(',','')),
        aluminumUsed: Number($(defenderPaths.aluminumUsed).text().replaceAll(',','')),
        aircraftDestroyedGround: Number($(defenderPaths.aircraftDestroyedGround).text().replaceAll(',','')),
        soldiersKilledAir: Number($(defenderPaths.soldiersKilledAir).text().replaceAll(',','')),
        tanksDestroyedAir: Number($(defenderPaths.tanksDestroyedAir).text().replaceAll(',','')),
        shipsDestroyedAir: Number($(defenderPaths.shipsDestroyedAir).text().replaceAll(',','')),
        moneyDestroyedAir: Number($(defenderPaths.moneyDestroyedAir).text().replace('$','').replaceAll(',',''))
    };
}

function getMoney(thisNation, otherNation, resourceValues) {
    var uraniumUsed = thisNation.nukesLaunched * 250;
    return {
        stolen: thisNation.moneyStolen - otherNation.moneyStolen,
        lostInfra: -otherNation.infrastructureDestroyedValue,
        lostSoldiers: -(otherNation.soldiersKilled + otherNation.soldiersKilledAir) * 1.25,
        lostTanks: -(otherNation.tanksDestroyed + otherNation.tanksDestroyedAir) * 60,
        lostAircraft: -otherNation.aircraftDestroyed * 4000,
        lostShips: -(otherNation.shipsDestroyed + otherNation.shipsDestroyedAir) * 50000,
        missilesLaunched: -thisNation.missilesLaunched * 150000,
        nukesLaunched: -thisNation.nukesLaunched * 1750000,
        bombed: -otherNation.moneyDestroyedAir,
        uraniumValue: -uraniumUsed * resourceValues.uranium,
        gasolineValue: -thisNation.gasolineUsed * resourceValues.gasoline,
        munitionsValue: -thisNation.munitionsUsed * resourceValues.munitions,
        steelValue: -thisNation.steelUsed * resourceValues.steel,
        aluminumValue: -thisNation.aluminumUsed * resourceValues.aluminum
    };
}

function getNet(money) {
    var net = 0;
    for (const property in money) {
        net += money[property];
    }
    return net;
}

function writeResultsToConsole(agressorMoney, agressorNet, defenderMoney, defenderNet, totalLoses, winnerNet) {
    console.log('Agressor itemized loses: ' + JSON.stringify(agressorMoney, null, '\t'));
    console.log('Agressor loses: $' + (-agressorNet).toLocaleString(undefined, {minimumFractionDigits:2}));
    console.log('Defender itemized loses: ' + JSON.stringify(defenderMoney, null, '\t'));
    console.log('Defender loses: $' + (-defenderNet).toLocaleString(undefined, {minimumFractionDigits:2}));
    console.log('War total loses: $' + totalLoses.toLocaleString(undefined, {minimumFractionDigits:2}));
    var winner = 'Defender';
    if (agressorNet > defenderNet) {
        winner = 'Agressor';
    }
    console.log(winner + ' wins by $' + winnerNet.toLocaleString(undefined, {minimumFractionDigits:2}));
}

function addResultsToPage($, agressorMoney, agressorNet, defenderMoney, defenderNet, totalLoses, winnerNet) {
    let agressorColor = 'rgb(214, 39, 40)';
    let defenderColor = 'rgb(31, 119, 180)';
    let beforeDamageTablePath = '#rightcolumn > br:nth-child(9)';
    let agressorNamePath = '#rightcolumn > table:nth-child(4) > tbody > tr > th > a:nth-child(1)';
    let defenderNamePath = '#rightcolumn > table:nth-child(4) > tbody > tr > th > a:nth-child(2)';
    let htmlTemplate = `<h2 class="center">Damage Value Inflicted</h2>
    <table class="nationtable" style="width:100%">
        <thead>
            <tr>
                <th colspan="2" width="50%">{{agressorName}}</th>
                <th colspan="2">{{defenderName}}</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td colspan="4" style="background: rgb(31, 119, 180); padding:0">
                    <div style="background: rgb(214, 39, 40); width: {{agressorRatio}}%; float: left">
                        <div style="text-align:right; padding-right: 10px">{{agressorRatio}}%</div>
                    </div>
                    <div style="width: {{defenderRatio}}%; float: left">
                        <div style="padding-left: 10px">{{defenderRatio}}%</div>
                    </div>
                </td>
            </tr>
            <tr>
              <th colspan="2">Statistic</th>
              <th>{{agressorName}}<br><span class="txt-sm italic">Agressor</span></th>
              <th>{{defenderName}}<br><span class="txt-sm italic">Defender</span></th>
            </tr>
            <tr>
                <td colspan="2">Stolen/Lost:</td>
                <td style="text-align:right">$ {{agressor-stolen}}</td>
                <td style="text-align:right">$ {{defender-stolen}}</td>
            </tr>
            <tr>
                <td colspan="2">Destroyed Infrastructure:</td>
                <td style="text-align:right">$ {{defender-lostInfra}}</td>
                <td style="text-align:right">$ {{agressor-lostInfra}}</td>
            </tr>
            <tr>
                <td colspan="2">Killed soldiers:</td>
                <td style="text-align:right">$ {{defender-lostSoldiers}}</td>
                <td style="text-align:right">$ {{agressor-lostSoldiers}}</td>
            </tr>
            <tr>
                <td colspan="2">Destroyed tanks:</td>
                <td style="text-align:right">$ {{defender-lostTanks}}</td>
                <td style="text-align:right">$ {{agressor-lostTanks}}</td>
            </tr>
            <tr>
                <td colspan="2">Destroyed aircraft:</td>
                <td style="text-align:right">$ {{defender-lostAircraft}}</td>
                <td style="text-align:right">$ {{agressor-lostAircraft}}</td>
            </tr>
            <tr>
                <td colspan="2">Destroyed ships:</td>
                <td style="text-align:right">$ {{defender-lostShips}}</td>
                <td style="text-align:right">$ {{agressor-lostShips}}</td>
            </tr>
            <tr>
                <td colspan="2">Missiles received:</td>
                <td style="text-align:right">$ {{defender-missilesLaunched}}</td>
                <td style="text-align:right">$ {{agressor-missilesLaunched}}</td>
            </tr>
            <tr>
                <td colspan="2">Nukes received:</td>
                <td style="text-align:right">$ {{defender-nukesLaunched}}</td>
                <td style="text-align:right">$ {{agressor-nukesLaunched}}</td>
            </tr>
            <tr>
                <td colspan="2">Money bombed:</td>
                <td style="text-align:right">$ {{agressor-bombed}}</td>
                <td style="text-align:right">$ {{defender-bombed}}</td>
            </tr>
            <tr>
                <td colspan="2">Opponent's uranium spent:</td>
                <td style="text-align:right">$ {{defender-uraniumValue}}</td>
                <td style="text-align:right">$ {{agressor-uraniumValue}}</td>
            </tr>
            <tr>
                <td colspan="2">Opponent's gasoline used:</td>
                <td style="text-align:right">$ {{defender-gasolineValue}}</td>
                <td style="text-align:right">$ {{agressor-gasolineValue}}</td>
            </tr>
            <tr>
                <td colspan="2">Opponent's munitions used:</td>
                <td style="text-align:right">$ {{defender-munitionsValue}}</td>
                <td style="text-align:right">$ {{agressor-munitionsValue}}</td>
            </tr>
            <tr>
                <td colspan="2">Opponent's steel used:</td>
                <td style="text-align:right">$ {{defender-steelValue}}</td>
                <td style="text-align:right">$ {{agressor-steelValue}}</td>
            </tr>
            <tr>
                <td colspan="2">Opponent's aluminum used:</td>
                <td style="text-align:right">$ {{defender-aluminumValue}}</td>
                <td style="text-align:right">$ {{agressor-aluminumValue}}</td>
            </tr>
            <tr>
                <td colspan="2"><b>Total Value:</b></td>
                <td style="text-align:right"><b>$ {{defender-net}}</b></td>
                <td style="text-align:right"><b>$ {{agressor-net}}</b></td>
            </tr>
        </tbody>
    </table>
    <br>`;
    var agressorRatio = Math.min(100, Math.max(0, Number.parseInt(100*(-defenderNet / totalLoses))));
    var defenderRatio = 100 - agressorRatio;
    var agressorName = $(agressorNamePath).text();
    var defenderName = $(defenderNamePath).text();
    var newHtml = htmlTemplate.replaceAll('{{agressorName}}',agressorName)
                           .replaceAll('{{defenderName}}',defenderName)
                           .replaceAll('{{agressorRatio}}',agressorRatio)
                           .replaceAll('{{defenderRatio}}',defenderRatio)
                           .replaceAll('{{agressor-net}}',(-agressorNet).toLocaleString(undefined, {minimumFractionDigits:2}))
                           .replaceAll('{{defender-net}}',(-defenderNet).toLocaleString(undefined, {minimumFractionDigits:2}))
                           .replaceAll('{{agressor-stolen}}', agressorMoney.stolen)
                           .replaceAll('{{defender-stolen}}', defenderMoney.stolen);
    for (const property in agressorMoney) {
        newHtml = newHtml.replaceAll('{{agressor-'+property+'}}', agressorMoney[property].replaceAll('-',''));
    }
    for (const property in defenderMoney) {
        newHtml = newHtml.replaceAll('{{defender-'+property+'}}', defenderMoney[property].replaceAll('-',''));
    }
    $(beforeDamageTablePath).after(newHtml);
}