// ==UserScript==
// @name         TornStats Profile
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Torn stats spy script!
// @author       Jox [1714547]
// @match        https://www.torn.com/profiles.php*
// @connect      www.tornstats.com
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/381537/TornStats%20Profile.user.js
// @updateURL https://update.greasyfork.org/scripts/381537/TornStats%20Profile.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var API_KEY = 'API_KEY_HERE';


    GM_addStyle(`
    .my-btn {
        padding: 0 15px 0 10px;
        /*margin: 0 -5px;*/
        cursor: pointer;
        text-shadow: 0 1px 0 rgba(255,255,255,0.4);
        color: #333;
        font-weight: bold;
        text-decoration: none;
        font-size: 14px;
        line-height: 24px;
        text-align: center;
        border-radius: 5px;
        /*
        background-position: 0 -24px;
        background: url(/images/v2/main/buttons/buttons_desktop.png) left top no-repeat;*/
        /*display: block*/
    }

    .my-width100 {
        width: 100%;
    }

    .my-overflow-y {
        overflow-y: auto;
    }

    .my-height200 {
        height: 200px;
    }

    .my-hover {
        background-color: #f2f2f2;
    }

    .my-hover:hover {
        background-color: #adadad;
    }

    .table-style {
        width: 100%;
        line-height: 16px !important;
    }

    .table-style tr td {
        padding: 2px 10px !important;
        border-top: 1px solid rgb(255, 255, 255) !important;
        /*border-left: 1px solid rgb(204, 204, 204) !important;*/
        border-bottom: 1px solid rgb(204, 204, 204) !important;
    }

    .table-style > tr:last-child > td {
        border-bottom: 0 !important;
    }

    .my-hide {
        display: none;
    }

    .my-flex {
        /*display: flex;*/
        flex: 1 0 0px;
    }

    .table-style tr th {
        font-weight: 600;
        padding: 2px 10px;
        border-top: 1px solid rgb(255, 255, 255);
        border-bottom: 1px solid rgb(204, 204, 204);
        background: linear-gradient(rgb(255, 255, 255) 0%, rgb(150, 150, 150) 100%);
        position: sticky;
        top: 0;
    }


    .table-style tr td:not(:first-child),  .table-style tr th:not(:first-child) {
        text-align: right;
    }

    .left-text {
        text-align: left;
    }`);

    //Create container div for widget
    var container = document.createElement('div');
    container.id = 'JoxDiv';

    //Create header
    var header = document.createElement('div');
    header.classList.add('title-black', 'm-top10', 'title-toggle', 'active', 'top-round');
    header.innerHTML = 'TornStats'

    //Create body
    var body = document.createElement('div');
    body.classList.add('cont-gray10', 'bottom-round', 'cont-toggle'/*, 'unreset'*/);
    body.style.display = 'flex';
    body.style.flexWrap = 'wrap';
    body.style.padding = 0;

    //Add header and body elements
    container.appendChild(header);
    container.appendChild(body);


    var SelectedStats = [];

    var search = window.location.search.slice(1)
    const regexp = /([^&=]+)=?([^&]*)/g;
    var data = {}
    for (var field; field = regexp.exec(search);) {
        data[decodeURIComponent(field[1])] = decodeURIComponent(field[2])
    };

    setTimeout(start, 500);

    function start() {
        var profiles = document.querySelector('.profile-wrapper');
        profiles.appendChild(container);

        getStats();
    }

    function getStats() {

        var dataSource = `https://www.tornstats.com/api/v1/${API_KEY}/spy/${data.XID}`;

        GM_xmlhttpRequest({
            method: 'GET',
            url: dataSource,
            onload: function (responseDetails) {
                // DO ALL RESPONSE PROCESSING HERE...
                tornstatsData(JSON.parse(responseDetails.responseText));

            }
        });

        function tornstatsData(TornStats) {

            console.log(TornStats);

            body.innerHTML = ''; //clear

            var panelLeft = document.createElement('div');
            panelLeft.classList.add('my-flex');
            //panelLeft.classList.add('my-hide');
            panelLeft.id = 'personalStats';

            var panelRight = document.createElement('div');
            panelRight.classList.add('my-flex');
            //panelRight.classList.add('my-hide');
            panelRight.id = 'spyStats';

            var panelStatsLeft = document.createElement('div');
            panelStatsLeft.classList.add('my-flex');
            panelStatsLeft.classList.add('my-hide');
            panelStatsLeft.id = 'selecedStats';

            var panelStatsRight = document.createElement('div');
            panelStatsRight.classList.add('my-flex');
            panelStatsRight.classList.add('my-hide');
            panelStatsRight.id = 'otherStats';

            var linkCompare = document.createElement('a');
            linkCompare.href = TornStats.compare.message;
            linkCompare.innerHTML = 'View full comparation';

            var tableCompare = document.createElement('table');
            tableCompare.classList.add('table-style');
            var tableSpy = document.createElement('table');
            tableSpy.classList.add('table-style');
            var tableAttacks = document.createElement('table');
            tableAttacks.classList.add('table-style');


            /*PERSONAL STATS COMPARE*/
            var headerCompare = document.createElement('tr');
            var headerCompare1 = document.createElement('th');
            var headerCompare2 = document.createElement('th');
            var headerCompare3 = document.createElement('th');

            headerCompare1.innerHTML = 'Personal Stats';
            headerCompare2.innerHTML = 'Target';
            headerCompare3.innerHTML = 'You';

            headerCompare.appendChild(headerCompare1);
            headerCompare.appendChild(headerCompare2);
            headerCompare.appendChild(headerCompare3);

            tableCompare.appendChild(headerCompare);

            if (TornStats.compare.status) {

                SelectedStats = [];

                for (var stat in TornStats.compare.data) {
                    SelectedStats.push(personalStats.get_by_name(stat));
                }

                console.log('selected stats', SelectedStats)

                for (var i in TornStats.compare.data) {
                    var rowCompare = document.createElement('tr');
                    var rowCompare1 = document.createElement('td');
                    var rowCompare2 = document.createElement('td');
                    var rowCompare3 = document.createElement('td');

                    rowCompare1.innerHTML = i;
                    rowCompare2.innerHTML = formatNumber(TornStats.compare.data[i].amount, 0, 3);
                    rowCompare3.innerHTML = TornStats.compare.data[i].difference <= 0 ? formatNumber(TornStats.compare.data[i].difference, 0, 3) : '+' + formatNumber(TornStats.compare.data[i].difference, 0, 3);
                    var color = TornStats.compare.data[i].difference < 0 ? 'red' : TornStats.compare.data[i].difference > 0 ? 'green' : undefined;
                    if (color) {
                        rowCompare3.style.color = color
                    };

                    rowCompare.appendChild(rowCompare1);
                    rowCompare.appendChild(rowCompare2);
                    rowCompare.appendChild(rowCompare3);

                    tableCompare.appendChild(rowCompare);
                }

                var rowComapreLink = document.createElement('tr');
                var rowComapreLink1 = document.createElement('td');
                rowComapreLink1.setAttribute('colspan', 3);
                rowComapreLink1.style.textAlign = 'center';

                rowComapreLink1.appendChild(linkCompare);

                rowComapreLink.appendChild(rowComapreLink1);

                tableCompare.appendChild(rowComapreLink);
            } else {
                var rowCompare = document.createElement('tr');
                var rowCompare1 = document.createElement('td');

                rowCompare1.innerHTML = TornStats.compare.message;
                rowCompare1.setAttribute('colspan', 3);

                rowCompare.appendChild(rowCompare1);

                tableCompare.appendChild(rowCompare);
            }

            panelLeft.appendChild(tableCompare);


            /*SPY COMPARE*/
            var headerSpy = document.createElement('tr');
            var headerSpy1 = document.createElement('th');

            var SpyType = {
                "faction-spy": "Faction Spy",
                "personal-spy": "Personal Spy",
                "faction-share": "Faction Share"
            }

            headerSpy1.innerHTML = TornStats.spy.status ? SpyType[TornStats.spy.type] + ' - ' + TornStats.spy.difference : 'Latest Spy';
            headerSpy1.setAttribute('colspan', 3);
            headerSpy1.classList.add('left-text');

            headerSpy.appendChild(headerSpy1);

            tableSpy.appendChild(headerSpy);

            //console.log(TornStats);

            if (TornStats.spy.status) {
                var color = {
                    strength: TornStats.spy.deltaStrength < 0 ? 'red' : TornStats.spy.deltaStrength > 0 ? 'green' : undefined,
                    defense: TornStats.spy.deltaDefense < 0 ? 'red' : TornStats.spy.deltaDefense > 0 ? 'green' : undefined,
                    speed: TornStats.spy.deltaSpeed < 0 ? 'red' : TornStats.spy.deltaSpeed > 0 ? 'green' : undefined,
                    dexterity: TornStats.spy.deltaDexterity < 0 ? 'red' : TornStats.spy.deltaDexterity > 0 ? 'green' : undefined,
                    total: TornStats.spy.deltaTotal < 0 ? 'red' : TornStats.spy.deltaTotal > 0 ? 'green' : undefined,
                    score: TornStats.spy.target_score > TornStats.spy.your_score ? 'red' : TornStats.spy.your_score > TornStats.spy.target_score ? 'green' : undefined
                };
                /*Strength*/
                var rowSpyStrength = document.createElement('tr');
                var rowSpyStrength1 = document.createElement('td');
                var rowSpyStrength2 = document.createElement('td');
                var rowSpyStrength3 = document.createElement('td');

                rowSpyStrength1.innerHTML = "Strength";
                rowSpyStrength2.innerHTML = formatNumber(TornStats.spy.strength, 0, 3);
                rowSpyStrength3.innerHTML = TornStats.spy.deltaStrength <= 0 ? formatNumber(TornStats.spy.deltaStrength, 0, 3) : '+' + formatNumber(TornStats.spy.deltaStrength, 0, 3);
                if (color.strength) {
                    rowSpyStrength3.style.color = color.strength
                };

                rowSpyStrength.appendChild(rowSpyStrength1);
                rowSpyStrength.appendChild(rowSpyStrength2);
                rowSpyStrength.appendChild(rowSpyStrength3);

                tableSpy.appendChild(rowSpyStrength);

                /*Defense*/
                var rowSpyDefense = document.createElement('tr');
                var rowSpyDefense1 = document.createElement('td');
                var rowSpyDefense2 = document.createElement('td');
                var rowSpyDefense3 = document.createElement('td');

                rowSpyDefense1.innerHTML = "Defense";
                rowSpyDefense2.innerHTML = formatNumber(TornStats.spy.defense, 0, 3);
                rowSpyDefense3.innerHTML = TornStats.spy.deltaDefense <= 0 ? formatNumber(TornStats.spy.deltaDefense, 0, 3) : '+' + formatNumber(TornStats.spy.deltaDefense, 0, 3);
                if (color.defense) {
                    rowSpyDefense3.style.color = color.defense
                };

                rowSpyDefense.appendChild(rowSpyDefense1);
                rowSpyDefense.appendChild(rowSpyDefense2);
                rowSpyDefense.appendChild(rowSpyDefense3);

                tableSpy.appendChild(rowSpyDefense);

                /*Speed*/
                var rowSpySpeed = document.createElement('tr');
                var rowSpySpeed1 = document.createElement('td');
                var rowSpySpeed2 = document.createElement('td');
                var rowSpySpeed3 = document.createElement('td');

                rowSpySpeed1.innerHTML = "Speed";
                rowSpySpeed2.innerHTML = formatNumber(TornStats.spy.speed, 0, 3);
                rowSpySpeed3.innerHTML = TornStats.spy.deltaSpeed <= 0 ? formatNumber(TornStats.spy.deltaSpeed, 0, 3) : '+' + formatNumber(TornStats.spy.deltaSpeed, 0, 3);
                if (color.speed) {
                    rowSpySpeed3.style.color = color.speed
                };

                rowSpySpeed.appendChild(rowSpySpeed1);
                rowSpySpeed.appendChild(rowSpySpeed2);
                rowSpySpeed.appendChild(rowSpySpeed3);

                tableSpy.appendChild(rowSpySpeed);

                /*Dexterity*/
                var rowSpyDexterity = document.createElement('tr');
                var rowSpyDexterity1 = document.createElement('td');
                var rowSpyDexterity2 = document.createElement('td');
                var rowSpyDexterity3 = document.createElement('td');

                rowSpyDexterity1.innerHTML = "Dexterity";
                rowSpyDexterity2.innerHTML = formatNumber(TornStats.spy.dexterity, 0, 3);
                rowSpyDexterity3.innerHTML = TornStats.spy.deltaDexterity <= 0 ? formatNumber(TornStats.spy.deltaDexterity, 0, 3) : '+' + formatNumber(TornStats.spy.deltaDexterity, 0, 3);
                if (color.dexterity) {
                    rowSpyDexterity3.style.color = color.dexterity
                };

                rowSpyDexterity.appendChild(rowSpyDexterity1);
                rowSpyDexterity.appendChild(rowSpyDexterity2);
                rowSpyDexterity.appendChild(rowSpyDexterity3);

                tableSpy.appendChild(rowSpyDexterity);

                /*Total*/
                var rowSpyTotal = document.createElement('tr');
                var rowSpyTotal1 = document.createElement('td');
                var rowSpyTotal2 = document.createElement('td');
                var rowSpyTotal3 = document.createElement('td');

                rowSpyTotal1.innerHTML = "Total";
                rowSpyTotal2.innerHTML = formatNumber(TornStats.spy.total, 0, 3);
                rowSpyTotal3.innerHTML = TornStats.spy.deltaTotal <= 0 ? formatNumber(TornStats.spy.deltaTotal, 0, 3) : '+' + formatNumber(TornStats.spy.deltaTotal, 0, 3);
                if (color.total) {
                    rowSpyTotal3.style.color = color.total
                };

                rowSpyTotal.appendChild(rowSpyTotal1);
                rowSpyTotal.appendChild(rowSpyTotal2);
                rowSpyTotal.appendChild(rowSpyTotal3);

                tableSpy.appendChild(rowSpyTotal);

                /*Score*/
                var rowSpyScore = document.createElement('tr');
                var rowSpyScore1 = document.createElement('td');
                var rowSpyScore2 = document.createElement('td');
                var rowSpyScore3 = document.createElement('td');

                rowSpyScore1.innerHTML = "<strong>Score</strong>";
                rowSpyScore2.innerHTML = '<strong>' + formatNumber(TornStats.spy.target_score, 0, 3) + '</strong>';
                rowSpyScore3.innerHTML = '<strong>' + formatNumber(TornStats.spy.your_score, 0, 3) + '</strong>';
                if (color.score) {
                    rowSpyScore3.style.color = color.score
                };

                rowSpyScore.appendChild(rowSpyScore1);
                rowSpyScore.appendChild(rowSpyScore2);
                rowSpyScore.appendChild(rowSpyScore3);

                tableSpy.appendChild(rowSpyScore);
            } else {
                var rowSpy = document.createElement('tr');
                var rowSpy1 = document.createElement('td');

                rowSpy1.innerHTML = TornStats.spy.message;
                rowSpy1.setAttribute('colspan', 3);

                rowSpy.appendChild(rowSpy1);

                tableSpy.appendChild(rowSpy);
            }

            panelRight.appendChild(tableSpy);

            /*ATTACKS*/
            var headerAttacks = document.createElement('tr');
            var headerAttacks1 = document.createElement('th');
            headerAttacks1.classList.add('left-text');

            headerAttacks1.innerHTML = 'Recent Attacks';

            headerAttacks.appendChild(headerAttacks1);

            tableAttacks.appendChild(headerAttacks);

            if (TornStats.attacks.status) {

                for (var i in TornStats.attacks.data) {
                    var rowAttacks = document.createElement('tr');
                    var rowAttacks1 = document.createElement('td');

                    rowAttacks1.innerHTML = TornStats.attacks.data[i];

                    rowAttacks.appendChild(rowAttacks1);

                    tableAttacks.appendChild(rowAttacks);
                }

            } else {
                var rowAttacks = document.createElement('tr');
                var rowAttacks1 = document.createElement('td');

                rowAttacks1.innerHTML = TornStats.attacks.message;
                rowAttacks1.setAttribute('colspan', 3);

                rowAttacks.appendChild(rowAttacks1);

                tableAttacks.appendChild(rowAttacks);
            }

            var rowSettings = document.createElement('tr');
            var rowSettings1 = document.createElement('td');
            rowSettings1.classList.add('my-padding-top10');
            rowSettings1.classList.add('my-padding-right10');
            rowSettings1.classList.add('my-padding-bottom10');
            rowSettings1.classList.add('my-padding-left10');

            var btn = document.createElement('button');
            btn.innerHTML = 'SETTINGS';
            btn.classList.add('my-btn');
            btn.classList.add('my-width100');
            btn.addEventListener('click', (e) => {
                panelLeft.classList.add('my-hide');
                panelRight.classList.add('my-hide');
                panelStatsLeft.classList.remove('my-hide');
                panelStatsRight.classList.remove('my-hide');
            })
            rowSettings1.appendChild(btn);

            rowSettings1.setAttribute('colspan', 3);

            rowSettings.appendChild(rowSettings1);

            tableAttacks.appendChild(rowSettings);

            panelRight.appendChild(tableAttacks);


            body.appendChild(panelLeft);
            body.appendChild(panelRight);


            /*SELCTED STATS*/
            drawSelectedStats(panelStatsLeft);

            /*NOT selected STATS*/
            drawOtherdStats(panelStatsRight);

            body.appendChild(panelStatsLeft);
            body.appendChild(panelStatsRight);

        };
    }

    function drawSelectedStats(container) {
        var tableStats = document.createElement('table');
        tableStats.classList.add('table-style');
        tableStats.id = 'tableStatsSelected';

        var headerStats = document.createElement('tr');
        var headerStats1 = document.createElement('th');

        headerStats1.innerHTML = 'Selected Personal Stats';

        headerStats.appendChild(headerStats1);

        tableStats.appendChild(headerStats);

        for (var stat of SelectedStats) {
            var rowStats = document.createElement('tr');
            var rowStats1 = document.createElement('td');

            rowStats1.innerHTML = stat.name;
            rowStats1.setAttribute('data-id', stat.key);
            rowStats1.classList.add('my-hover');

            rowStats1.addEventListener('click', function (e) {
                //alert(e.target.dataset.id);
                if (e.target == this) {

                    var tabeleSelented = document.getElementById('tableStatsNotSelected');
                    var tabeleNotSelented = document.getElementById('tableStatsSelected');

                    if (e.target.parentNode.parentNode == tabeleSelented) {
                        //ADD STAT
                        if (SelectedStats.map((e) => {
                                return e.key
                            }).indexOf(e.target.dataset.id) < 0) {
                            SelectedStats.push(personalStats.get_by_id(e.target.dataset.id));
                        }
                        e.target.parentNode.remove();
                        tabeleNotSelented.appendChild(e.target.parentNode);
                    } else {
                        //REMOVE STAT
                        for (var i = SelectedStats.length - 1; i >= 0; i--) {
                            if (SelectedStats[i].key === e.target.dataset.id) {
                                SelectedStats.splice(i, 1);
                                break; //<-- Uncomment  if only the first term has to be removed
                            }
                        }
                        e.target.parentNode.remove();
                        tabeleSelented.appendChild(e.target.parentNode);
                    }

                }
            })

            rowStats.appendChild(rowStats1);

            tableStats.appendChild(rowStats);
        }

        container.classList.add('my-height200');
        container.classList.add('my-overflow-y');
        container.appendChild(tableStats);
    }

    function drawOtherdStats(container) {
        var tableStats = document.createElement('table');
        tableStats.classList.add('table-style');
        tableStats.id = 'tableStatsNotSelected';

        var headerStats = document.createElement('tr');
        var headerStats1 = document.createElement('th');

        headerStats1.innerHTML = 'Not Selected Personal Stats';

        headerStats.appendChild(headerStats1);

        tableStats.appendChild(headerStats);

        let difference = personalStats.filter(x => !SelectedStats.includes(x));

        for (var stat of difference) {
            var rowStats = document.createElement('tr');
            var rowStats1 = document.createElement('td');

            rowStats1.innerHTML = stat.name;
            rowStats1.setAttribute('data-id', stat.key);
            rowStats1.classList.add('my-hover');

            rowStats1.addEventListener('click', function (e) {
                if (e.target == this) {

                    var tabeleSelented = document.getElementById('tableStatsNotSelected');
                    var tabeleNotSelented = document.getElementById('tableStatsSelected');

                    if (e.target.parentNode.parentNode == tabeleSelented) {
                        //ADD STAT
                        if (SelectedStats.map((e) => {
                                return e.key
                            }).indexOf(e.target.dataset.id) < 0) {
                            SelectedStats.push(personalStats.get_by_id(e.target.dataset.id));
                        }
                        e.target.parentNode.remove();
                        tabeleNotSelented.appendChild(e.target.parentNode);
                    } else {
                        //REMOVE STAT
                        for (var i = SelectedStats.length - 1; i >= 0; i--) {
                            if (SelectedStats[i].key === e.target.dataset.id) {
                                SelectedStats.splice(i, 1);
                                break; //<-- Uncomment  if only the first term has to be removed
                            }
                        }
                        e.target.parentNode.remove();
                        tabeleSelented.appendChild(e.target.parentNode);
                    }

                }
            })

            rowStats.appendChild(rowStats1);

            tableStats.appendChild(rowStats);
        }

        var div = document.createElement('div');
        div.classList.add('my-height200');
        div.classList.add('my-overflow-y');
        div.appendChild(tableStats)

        var footer = document.createElement('div');
        var btn = document.createElement('button');
        btn.id = 'saveBtn';
        btn.innerHTML = 'SAVE';
        btn.classList.add('my-btn');
        btn.classList.add('my-width100');
        btn.onclick = saveSelectedStats;

        footer.appendChild(btn);

        container.appendChild(div);
        container.appendChild(footer);
    }

    function saveSelectedStats() {
        var dataSource = `https://www.tornstats.com/api.php?key=${API_KEY}&action=setSettings&spy=1&comparespy=1&comparepersonal=1&personalstats=`;
        var isFirst = true;
        for (var ss of SelectedStats) {
            dataSource += (isFirst ? '' : ',') + ss.key;
            isFirst = false;
        }

        var btn = document.getElementById('saveBtn');
        btn.innerHTML = 'Updating Torn Stats data...';

        GM_xmlhttpRequest({
            method: 'GET',
            url: dataSource,
            onload: function (responseDetails) {
                // DO ALL RESPONSE PROCESSING HERE...
                getStats();;
            }
        });
    }

    /**
     * formatNumber(num, dec, sep)
     *
     * @param number  num: number to format
     * @param integer dec: length of decimal
     * @param integer sep: length of sections
     */
    function formatNumber(num, dec, sep) {
        num = Number(num);
        var re = '\\d(?=(\\d{' + (sep || 3) + '})+' + (dec > 0 ? '\\.' : '$') + ')';
        return num.toFixed(Math.max(0, ~~dec)).replace(new RegExp(re, 'g'), '$&,');
    }

    const personalStats = [{
        key: 'bazaarcustomers',
        name: 'Bazaar Customers'
    }, {
        key: 'bazaarsales',
        name: 'Bazaar Sales'
    }, {
        key: 'bazaarprofit',
        name: 'Bazaar Profit'
    }, {
        key: 'useractivity',
        name: 'User Activity'
    }, {
        key: 'itemsbought',
        name: 'Items Bought'
    }, {
        key: 'pointsbought',
        name: 'Points Bought'
    }, {
        key: 'itemsboughtabroad',
        name: 'Items Bought Abroad'
    }, {
        key: 'weaponsbought',
        name: 'Weapons Bought'
    }, {
        key: 'trades',
        name: 'Trades'
    }, {
        key: 'itemssent',
        name: 'Items Sent'
    }, {
        key: 'auctionswon',
        name: 'Auctions Won'
    }, {
        key: 'auctionsells',
        name: 'Items Auctioned'
    }, {
        key: 'pointssold',
        name: 'Points Sold'
    }, {
        key: 'attackswon',
        name: 'Attacks Won'
    }, {
        key: 'attackslost',
        name: 'Attacks Lost'
    }, {
        key: 'attacksdraw',
        name: 'Attacks Stalemated'
    }, {
        key: 'bestkillstreak',
        name: 'Best Kill Streak'
    }, {
        key: 'moneymugged',
        name: 'Money Mugged'
    }, {
        key: 'attacksstealthed',
        name: 'Stealth Attacks'
    }, {
        key: 'attackhits',
        name: 'Hits'
    }, {
        key: 'attackmisses',
        name: 'Misses'
    }, {
        key: 'attackcriticalhits',
        name: 'Critical Hits'
    }, {
        key: 'respectforfaction',
        name: 'Total Respect Gained'
    }, {
        key: 'defendswon',
        name: 'Defends Won'
    }, {
        key: 'defendslost',
        name: 'Defends Lost'
    }, {
        key: 'defendsstalemated',
        name: 'Defends Stalemated'
    }, {
        key: 'roundsfired',
        name: 'Rounds Fired'
    }, {
        key: 'yourunaway',
        name: 'Times Ran Away'
    }, {
        key: 'theyrunaway',
        name: 'Foes Ran Away'
    }, {
        key: 'highestbeaten',
        name: 'Highest Level Beaten'
    }, {
        key: 'peoplebusted',
        name: 'People Busted'
    }, {
        key: 'failedbusts',
        name: 'Failed Busts'
    }, {
        key: 'peoplebought',
        name: 'People Bailed'
    }, {
        key: 'peopleboughtspent',
        name: 'Bail Fees'
    }, {
        key: 'virusescoded',
        name: 'Viruses Coded'
    }, {
        key: 'cityfinds',
        name: 'Items Found'
    }, {
        key: 'traveltimes',
        name: 'Times Travelled'
    }, {
        key: 'bountiesplaced',
        name: 'Bounties Placed'
    }, {
        key: 'bountiesreceived',
        name: 'Bounties Received'
    }, {
        key: 'bountiescollected',
        name: 'Bounties Collected'
    }, {
        key: 'totalbountyreward',
        name: 'Money Rewarded'
    }, {
        key: 'revives',
        name: 'Revives'
    }, {
        key: 'revivesreceived',
        name: 'Revives Received'
    }, {
        key: 'medicalitemsused',
        name: 'Medical Items Used'
    }, {
        key: 'statenhancersused',
        name: 'Stat Enhancers Used'
    }, {
        key: 'trainsreceived',
        name: 'Times Trained by Director'
    }, {
        key: 'totalbountyspent',
        name: 'Spent on Bounties'
    }, {
        key: 'drugsused',
        name: 'Drugs Used'
    }, {
        key: 'overdosed',
        name: 'Times Overdosed'
    }, {
        key: 'meritsbought',
        name: 'Merits Bought'
    }, {
        key: 'logins',
        name: 'Logins'
    }, {
        key: 'personalsplaced',
        name: 'Personals Placed'
    }, {
        key: 'classifiedadsplaced',
        name: 'Classified Ads Placed'
    }, {
        key: 'mailssent',
        name: 'Mails Sent'
    }, {
        key: 'friendmailssent',
        name: 'Mails Sent to Friends'
    }, {
        key: 'factionmailssent',
        name: 'Mails Sent to Faction'
    }, {
        key: 'companymailssent',
        name: 'Mails Sent to Colleagues'
    }, {
        key: 'spousemailssent',
        name: 'Mails Sent to Spouse'
    }, {
        key: 'largestmug',
        name: 'Largest Mug'
    }, {
        key: 'medstolen',
        name: 'Medical Items Stolen'
    }, {
        key: 'spydone',
        name: 'Army Spying'
    }, {
        key: 'cantaken',
        name: 'Cannabis Taken'
    }, {
        key: 'exttaken',
        name: 'Ecstasy Taken'
    }, {
        key: 'lsdtaken',
        name: 'LSD Taken'
    }, {
        key: 'shrtaken',
        name: 'Shrooms Taken'
    }, {
        key: 'xantaken',
        name: 'Xanax Taken'
    }, {
        key: 'victaken',
        name: 'Vicodin Taken'
    }, {
        key: 'chahits',
        name: 'Machinery'
    }, {
        key: 'axehits',
        name: 'Clubbed Weapons'
    }, {
        key: 'grehits',
        name: 'Temporary Weapons'
    }, {
        key: 'pishits',
        name: 'Pistols'
    }, {
        key: 'rifhits',
        name: 'Rifles'
    }, {
        key: 'smghits',
        name: 'Sub Machine Gun'
    }, {
        key: 'piehits',
        name: 'Piercing Weapons'
    }, {
        key: 'slahits',
        name: 'Slashing Weapons'
    }, {
        key: 'machits',
        name: 'Machine Guns'
    }, {
        key: 'argtravel',
        name: 'Argentina'
    }, {
        key: 'mextravel',
        name: 'Mexico'
    }, {
        key: 'dubtravel',
        name: 'Dubai'
    }, {
        key: 'hawtravel',
        name: 'Hawaii'
    }, {
        key: 'japtravel',
        name: 'Japan'
    }, {
        key: 'lontravel',
        name: 'United Kingdom'
    }, {
        key: 'soutravel',
        name: 'South Africa'
    }, {
        key: 'switravel',
        name: 'Switzerland'
    }, {
        key: 'chitravel',
        name: 'China'
    }, {
        key: 'cantravel',
        name: 'Canada'
    }, {
        key: 'dumpfinds',
        name: 'Items Found in Dump'
    }, {
        key: 'dumpsearches',
        name: 'Dump Searches'
    }, {
        key: 'itemsdumped',
        name: 'Items Trashed'
    }, {
        key: 'daysbeendonator',
        name: 'Days Been a Donator'
    }, {
        key: 'caytravel',
        name: 'Cayman Islands'
    }, {
        key: 'jailed',
        name: 'Times Jailed'
    }, {
        key: 'hospital',
        name: 'Times in Hospital'
    }, {
        key: 'kettaken',
        name: 'Ketamine Taken'
    }, {
        key: 'shohits',
        name: 'Shotguns'
    }, {
        key: 'opitaken',
        name: 'Opium Taken'
    }, {
        key: 'heahits',
        name: 'Heavy Artillery'
    }, {
        key: 'spetaken',
        name: 'Speed Taken'
    }, {
        key: 'attacksassisted',
        name: 'Attacks Assisted'
    }, {
        key: 'bloodwithdrawn',
        name: 'Blood Withdrawn'
    }, {
        key: 'networth',
        name: 'Networth'
    }, {
        key: 'pcptaken',
        name: 'PCP Taken'
    }, {
        key: 'refills',
        name: 'Refills'
    }, {
        key: 'selling_illegal_products',
        name: 'Selling Illegal Goods'
    }, {
        key: 'theft',
        name: 'Theft'
    }, {
        key: 'auto_theft',
        name: 'Auto Theft'
    }, {
        key: 'drug_deals',
        name: 'Drug Deals'
    }, {
        key: 'computer_crimes',
        name: 'Computer Crimes'
    }, {
        key: 'murder',
        name: 'Murder'
    }, {
        key: 'fraud_crimes',
        name: 'Fraud'
    }, {
        key: 'other',
        name: 'Other'
    }, {
        key: 'total_crimes',
        name: 'Criminal Offences'
    }, {
        key: 'age',
        name: 'Age'
    }, {
        key: 'level',
        name: 'Level'
    }, {
        key: 'karma',
        name: 'Karma'
    }, {
        key: 'forum_posts',
        name: 'Forum Posts'
    }, {
        key: 'friends',
        name: 'Friends'
    }, {
        key: 'enemies',
        name: 'Enemies'
    }, {
        key: 'awards',
        name: 'Awards'
    }, {
        key: 'missionscompleted',
        name: 'Missions Completed'
    }, {
        key: 'missioncreditsearned',
        name: 'Mission Credits Earned'
    }, {
        key: 'contractscompleted',
        name: 'Contracts Completed'
    }, {
        key: 'dukecontractscompleted',
        name: 'Duke Contracts Completed'
    }, {
        key: 'days_married',
        name: 'Days Married'
    }, {
        key: 'spouse_id',
        name: 'Spouse ID'
    }, {
        key: 'spouse_name',
        name: 'Spouse Name'
    }, {
        key: 'job_position',
        name: 'Job Position'
    }, {
        key: 'company_id',
        name: 'Company ID'
    }, {
        key: 'company_name',
        name: 'Company Name'
    }, {
        key: 'killstreak',
        name: 'Current Kill Streak'
    }, {
        key: 'days_in_faction',
        name: 'Days in Faction'
    }, {
        key: 'last_action',
        name: 'Last Action'
    }]
    personalStats.get_by_id = (e) => personalStats.find((ps) => ps.key === e)
    personalStats.get_by_name = (e) => personalStats.find((ps) => ps.name === e)



})();