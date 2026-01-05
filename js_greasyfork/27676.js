// ==UserScript==
// @name         Cookie clicker tools
// @namespace    orteil.dashnet.org
// @version      2.185
// @description  Cookie clicker tools (visual)
// @author       Anton
// @match        http://orteil.dashnet.org/cookieclicker/*
// @match        https://orteil.dashnet.org/cookieclicker/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/27676/Cookie%20clicker%20tools.user.js
// @updateURL https://update.greasyfork.org/scripts/27676/Cookie%20clicker%20tools.meta.js
// ==/UserScript==

(function() {
	'use strict';
	var tAutoBuy, tPopGolden, tClickFrenzy, oldTitle = '', oldGameUpdateTicker,
		tPriority, tBankAuto, tAscendDetector, isClickingNow = false,
		tSeasonSwitcher, tDragon, tReloadPageOnWrongBuff, tAutoClickInterval = 75;

    var _GameHelpers = {
        isHardcore: function () {
            return parseInt(Game.ascensionMode) === 1
                && !Game.HasAchiev('Hardcore')
                && Game.HasAchiev('True Neverclick');
        },
        isNeverclick: function () {
            return parseInt(Game.ascensionMode) === 1
                && !Game.HasAchiev('True Neverclick');
        },
        isAscend: function () {
            return parseInt(Game.OnAscend) === 1;
        },
        hasDragon: function () {
            return Game.Has('A crumbly egg');
        },
		getMilkMult: function() {
            var milkMult = 1;
            if (Game.Has('Santa\'s milk and cookies')) milkMult *= 1.05;
            if (Game.hasAura('Breath of Milk')) milkMult *= 1.05;
            milkMult *= Game.eff('milk');
            return milkMult;
        },
        getKittenPercentByUpgradeName: function(kName) {
            var milkMult = _GameHelpers.getMilkMult();
            if (kName === 'Kitten helpers') return Game.milkProgress*0.1*milkMult;
            if (kName === 'Kitten workers') return Game.milkProgress*0.125*milkMult;
            if (kName === 'Kitten engineers') return Game.milkProgress*0.15*milkMult;
            if (kName === 'Kitten overseers') return Game.milkProgress*0.175*milkMult;
            if (kName === 'Kitten managers') return Game.milkProgress*0.2*milkMult;
            if (kName === 'Kitten accountants') return Game.milkProgress*0.2*milkMult;
            if (kName === 'Kitten specialists') return Game.milkProgress*0.2*milkMult;
            if (kName === 'Kitten experts') return Game.milkProgress*0.2*milkMult;
            if (kName === 'Kitten consultants') return Game.milkProgress*0.2*milkMult;
            if (kName === 'Kitten assistants to the regional manager') return Game.milkProgress*0.175*milkMult;
            if (kName === 'Kitten marketeers') return Game.milkProgress*0.15*milkMult;
            if (kName === 'Kitten analysts') return Game.milkProgress*0.125*milkMult;
            if (kName === 'Kitten angels') return Game.milkProgress*0.1*milkMult;
            return 0;
        },
        getDragonAuraName: function (aura) {
            if (typeof Game.dragonAuras[aura] !== 'undefined') {
                return Game.dragonAuras[aura].name + " (" + Game.dragonAuras[aura].desc + ")";
            }
            return 'Unknown (' + aura + ')';
        },
        beautify: function(n, floats) {
            return n < 1 ? String(n) : Beautify(parseFloat(n), floats);
        },
		dragonHasAura2: function () {
			return Game.dragonLevel >= 21;
        }
	};

    var _GameStat = {
        halloweenSeasonUpgrades: ['Skull cookies','Ghost cookies','Bat cookies','Slime cookies','Pumpkin cookies','Eyeball cookies','Spider cookies'],
        valentineUpgrades: ['Pure heart biscuits','Ardent heart biscuits','Sour heart biscuits','Weeping heart biscuits','Golden heart biscuits','Eternal heart biscuits'],
        christmasUpgrades: ['Christmas tree biscuits','Snowflake biscuits','Snowman biscuits','Holly biscuits','Candy cane biscuits','Bell biscuits','Present biscuits'],
        getBuffMult: function () {
            var buffMult = 1;
            for (var buff in Game.buffs) {
                if (Game.buffs[buff] !== 0 && typeof Game.buffs[buff].multCpS !== 'undefined') {
                    buffMult = buffMult * Game.buffs[buff].multCpS;
                }
            }
            return buffMult <= 0 ? 1 : buffMult;
        },
        getNormalCookiesPs: function () {
            return Game.cookiesPs > 0 ? Game.cookiesPs / _GameStat.getBuffMult() : 1;
        },
        getMinimalMoney: function () {
            return Math.floor(_GameStat.getNormalCookiesPs() * 42100 * _BotSettings.options.bankStoragePercent / 100);
        },
        getMoneyCanSpend: function () {
            return Game.cookies - _GameStat.getMinimalMoney();
        },
        getWrinklerCount: function () {
            var wrinklersCount = 0;
            for (var i in Game.wrinklers) {
                if (Game.wrinklers[i].sucked > 0) {
                    wrinklersCount++;
                }
            }
            return wrinklersCount;
        },
        getUpgradeListToUnlock: function() {
            var result = [];
            for (var x in Game.UnlockAt) {
                if (Game.UnlockAt.hasOwnProperty(x) &&
                    Game.Upgrades.hasOwnProperty(Game.UnlockAt[x].name) &&
                    Game.Upgrades[Game.UnlockAt[x].name].bought === 0)
                {
                    result.push(Game.UnlockAt[x]);
                }
            }

            for (x in _GameStat.halloweenSeasonUpgrades) {
                if (_GameStat.halloweenSeasonUpgrades.hasOwnProperty(x) &&
                    Game.Upgrades[_GameStat.halloweenSeasonUpgrades[x]].bought === 0)
                {
                    result.push({cookies:'',name:_GameStat.halloweenSeasonUpgrades[x],require:'Kill wrinkler',season:'halloween'});
                }
            }

            for (x in Game.easterEggs) {
                if (Game.easterEggs.hasOwnProperty(x) &&
                    Game.Upgrades[Game.easterEggs[x]].bought === 0)
                {
                    result.push({cookies:'',name:Game.easterEggs[x],require:'Find egg',season:'easter'});
                }
            }

            var lastValentineName = '';
            for (x in _GameStat.valentineUpgrades) {
                if (_GameStat.valentineUpgrades.hasOwnProperty(x) &&
                    Game.Upgrades[_GameStat.valentineUpgrades[x]].bought === 0)
                {
                    result.push({cookies:'',name:_GameStat.valentineUpgrades[x],require:lastValentineName,season:'valentines'});
                    lastValentineName = _GameStat.valentineUpgrades[x];
                }
            }

            for (x in _GameStat.christmasUpgrades) {
                if (_GameStat.christmasUpgrades.hasOwnProperty(x) &&
                    Game.Upgrades[_GameStat.christmasUpgrades[x]].bought === 0)
                {
                    result.push({cookies:Game.Upgrades[_GameStat.christmasUpgrades[x]].basePrice,name:_GameStat.christmasUpgrades[x],require:'Christmas',season:'christmas'});
                }
            }

            return result;
        }
	};

    var _BotStat = {
        getHistoryList: function() {
            var hist = [];
            hist.push('2.169 - added achievements Neverclick and Hardcore');
            hist.push('2.156 - lumps harvesting + achievement');
            hist.push('2.155 - fix some bugs with new version of the Game');
            hist.push('2.136 - buyAll function (it is a kind of cheat)');
            hist.push('2.128 - santa and dragon upgrades');
            hist.push('2.122 - season switcher');
            hist.push('2.118 - show season unlocks in "Need to unlock" table');
            hist.push('2.114 - option to disable auto clicking');
            hist.push('2.113 - info table "Achievements to unlock"');
            hist.push('2.112 - info table "Need to unlock"');
            hist.push('2.111 - option to buy infernal upgrades');
            hist.push('2.109 - kill all wrinklers button');
            hist.push('2.107 - click first 15 minutes after ascend');
            hist.push('2.101 - remove all bufs on negative multiplier (same as reload page)');
            hist.push('2.100 - Info section + ascend detector');
            hist.push('2.099 - mouse click upgrades');
            hist.push('2.097 - auto bank storage');
            hist.push('2.096 - buy objects more than 1');
            hist.push('2.091 - priority table refactor');
            hist.push('2.090 - buy very cheap items first');
            hist.push('2.086 - clear log button');
            hist.push('2.084 - buy unknown upgrades if their price is 0.1% of cookie storage');
            hist.push('2.083 - mouse upgrades is processed as Upgrades');
            hist.push('2.082 - start from scratch');
            hist.push('2.079 - hide donate box');
            hist.push('2.078 - Kittens now is processed as Upgrades');
            return hist;
        }
	};

    var _BotSettings = {
        options: {
        	bankStoragePercent: 0,
			bankStorageAuto: false,
			buyInfernalUpgrades: false,
			noClicking: false,
			autoSeason: false,
			disableTicker: false
		},
        store: function(name, value) {
            if (typeof(Storage) !== "undefined") localStorage.setItem(name, value);
        },
        restore: function(name, asBool) {
            if (typeof asBool === 'undefined') asBool = false;
            if (typeof(Storage) !== "undefined") {
                if (asBool) {
                    return (localStorage.getItem(name) === 'true' || localStorage.getItem(name) === true);
                } else {
                    return localStorage.getItem(name);
                }
            }
            else return undefined;
        },
        restoreAll: function() {
            _BotSettings.options.bankStoragePercent = parseInt(_BotSettings.restore('bankStoragePercent'));
            if (typeof _BotSettings.options.bankStoragePercent === 'undefined' || _BotSettings.options.bankStoragePercent === null) {
                _BotSettings.options.bankStoragePercent = 0;
            }
            _BotSettings.options.bankStorageAuto = _BotSettings.restore('bankStorageAuto', true);
            if (typeof _BotSettings.options.bankStorageAuto === 'undefined' || _BotSettings.options.bankStorageAuto === null) {
                _BotSettings.options.bankStorageAuto = false;
            }

            _BotSettings.options.buyInfernalUpgrades = _BotSettings.restore('buyInfernalUpgrades', true);
            if (typeof _BotSettings.options.buyInfernalUpgrades === 'undefined' || _BotSettings.options.buyInfernalUpgrades === null) {
                _BotSettings.options.buyInfernalUpgrades = false;
            }

            _BotSettings.options.noClicking = _BotSettings.restore('noClicking', true);
            if (typeof _BotSettings.options.noClicking === 'undefined' || _BotSettings.options.noClicking === null) {
                _BotSettings.options.noClicking = false;
            }

            _BotSettings.options.autoSeason = _BotSettings.restore('autoSeason', true);
            if (typeof _BotSettings.options.autoSeason === 'undefined' || _BotSettings.options.autoSeason === null) {
                _BotSettings.options.autoSeason = false;
            }

            _BotSettings.options.disableTicker = _BotSettings.restore('disableTicker', true);
            if (typeof _BotSettings.options.disableTicker === 'undefined' || _BotSettings.options.disableTicker === null) {
                _BotSettings.options.disableTicker = false;
            }
        },
        setBankStogarePercent: function(val, needUpdate) {
            if (_BotSettings.options.bankStoragePercent !== val) {
                if (needUpdate === true) jQuery('#bankStoragePercent').val(val);
                if (console) console.log('bankStoragePercent =', val);
                _BotSettings.store('bankStoragePercent', val);
                _BotSettings.options.bankStoragePercent = val;
                jQuery('#bankStoragePercentLabel').text('Storage (' + _GameHelpers.beautify(_GameStat.getMinimalMoney()) + ') percent: ' + val + '%');
                _LogPage.updateLog();
            }
        },
		getOptionNameByButtonId: function (id) {
            if (id === 'bankStorageAuto') {
            	return "Automatic set of bank storage percent";
            } else if (id === 'buyInfernalUpgrades') {
            	return "Automatic buy infernal upgrades (makes granny evil)";
            } else if (id === 'noClicking') {
            	return "Restrict auto clicking";
            } else if (id === 'autoSeason') {
            	return "Auto season swithcer";
            } else if (id === 'disableTicker') {
            	return "News disabled";
            }
            return "";
        },
		getOptionTitle: function (optionName) {
			return _BotSettings.getOptionNameByButtonId(optionName) + ": " +
                (_BotSettings.options[optionName] ? 'TRUE' : 'FALSE');
        }
	};

    var _BotUI = {
    	$caption: undefined,
        $logButton: undefined,
		oldTickerText: undefined,
    	$getCaption: function() {
    		if (typeof _BotUI.$caption === 'undefined') {
                _BotUI.$caption = jQuery('#versionNumber');
			}
    		return _BotUI.$caption;
		},
        setCaption: function(txt) {
            if (_BotUI.$getCaption().text() !== txt) _BotUI.$getCaption().text(txt);
        },
        setTitle: function(txt) {
            var newTitle = (_LogPage.newLogs > 0 ? '(' + _LogPage.newLogs + ') ' : '') + txt;
            if (document.title !== newTitle) {
                oldTitle = txt;
                document.title = newTitle;
            }
        },
        setTitleWithPercent: function(have, need, txt) {
            var percent = Math.ceil(have / (need !== 0 ? need : 1) * 100);
            _BotUI.setTitle(String(percent) + "% - " + txt);
        },
		triggerOptionValue: function(optionName, $button) {
            _BotSettings.options[optionName] = !_BotSettings.options[optionName];
            _BotSettings.store(optionName, _BotSettings.options[optionName]);
            var newButtonTitle = _BotSettings.getOptionTitle(optionName);
            _LogPage.addLog(newButtonTitle, true);
            $button.text(newButtonTitle);
		},
		processUiButtonClick: function ($button) {
            var id = $button.attr('data-id');
            if (id === 'bankStorageAuto') {
            	_BotUI.triggerOptionValue('bankStorageAuto', $button);
                _BotLogic.bankAutoFunction();
            } else if (id === 'killWrinklers') {
                _BotLogic.killAllWrinklers(true);
            } else if (id === 'buyEverything') {
                _BotLogic.buyEverything();
            } else if (id === 'buyInfernalUpgrades') {
                _BotUI.triggerOptionValue('buyInfernalUpgrades', $button);
            } else if (id === 'noClicking') {
                _BotUI.triggerOptionValue('noClicking', $button);
            } else if (id === 'autoSeason') {
                _BotUI.triggerOptionValue('autoSeason', $button);
            } else if (id === 'disableTicker') {
                _BotUI.triggerOptionValue('disableTicker', $button);
            } else if (id === 'clearLog') {
                _LogPage.logLinesArray = [];
                _LogPage.newLogs = 0;
            }
            _LogPage.updateLog();
    	},
        initLogButton: function() {
            _BotUI.$logButton = jQuery('#logButton');

            _BotUI.$logButton.text('Log').on("click", function() {
                _LogPage.newLogs = 0;
                _BotUI.$logButton.text('Log');
            });

            Game.CCT = {}; // Coockie clicker tools
            Game.CCT.onsliderchange = function(el) {
                var val = $(el).val();
                _BotSettings.setBankStogarePercent(val);
            };
            Game.CCT.getPriorityListObj = function() {
                return _Priority.aList;
            };
            Game.CCT.onbuttonclick = function(el,e) {
                e.preventDefault();
                var $button = jQuery(el);
                _BotUI.processUiButtonClick($button);
            };
        },
		setTickerText: function(newText) {
    		if (_BotUI.oldTickerText !== newText) {
                _BotUI.oldTickerText = newText;
                Game.Ticker = newText;
                Game.TickerDraw();
			}
		},
		generateTinkerText: function() {
            if (_BotLogic.started) {
            	return "Bot ACTIVE";
			} else {
            	return "Bot stopped...";
			}
		},
		initBot: function () {
            jQuery('#versionNumber').on("click", function() {
                if (!_BotLogic.started)
                    _BotLogic.start();
                else
                    _BotLogic.stop();
            });
            jQuery('#donateBox').hide();

            oldGameUpdateTicker = Game.UpdateTicker;
            Game.UpdateTicker = function () {
				if (_BotSettings.options.disableTicker) {
					_BotUI.setTickerText(_BotUI.generateTinkerText());
				} else {
					oldGameUpdateTicker();
				}
            };
        }
	};

    var _Priority = {
        aList: {},
		addPriorityForUpgrades: function () {
            var moneyCanSpend = _GameStat.getMoneyCanSpend();
            var buffMult = _GameStat.getBuffMult();

            for (var g in Game.UpgradesById) {
                if (Game.UpgradesById[g].bought === 0 && parseInt(Game.UpgradesById[g].unlocked) === 1) {
                    var isMultiplier = Game.UpgradesById[g].desc.indexOf('production multiplier') >= 0;
                    var isDouble = Game.UpgradesById[g].desc.indexOf('<b>twice</b>') >= 0;
                    var isDoubleGrandma = Game.UpgradesById[g].desc.indexOf('Grandmas are <b>twice</b>') >= 0;
                    var isKitten = Game.UpgradesById[g].name.indexOf('Kitten ') >= 0;
                    var isDoubleCursor = Game.UpgradesById[g].desc.indexOf('The mouse and cursors are <b>twice</b>') >= 0;
                    var isClickIncrease = Game.UpgradesById[g].desc.indexOf('Clicking gains <b>+1%') >= 0;
                    var isSpecialTech = Game.UpgradesById[g].pool === 'tech' && typeof Game.UpgradesById[g].clickFunction !== 'undefined';
                    if (isSpecialTech && Game.UpgradesById[g].clickFunction !== 'undefined' && _BotSettings.options.buyInfernalUpgrades) {
                        delete (Game.UpgradesById[g].clickFunction);
                    }
                    var increasedMoney = 0;
                    if (isClickIncrease) {
                        if (!_GameHelpers.isNeverclick) {
                            increasedMoney = Game.cookiesPs * 0.01;
                        }
                    } else if (isDoubleCursor) {
                        increasedMoney = Game.Objects['Cursor'].storedTotalCps * Game.globalCpsMult / buffMult;
                        if (isClickingNow) increasedMoney += Game.computedMouseCps * 1000 / tAutoClickInterval;
                    } else if (isKitten) {
                        var kittenPercent = _GameHelpers.getKittenPercentByUpgradeName(Game.UpgradesById[g].name);
                        increasedMoney = _GameStat.getNormalCookiesPs() * kittenPercent;
                    } else if (isDoubleGrandma) {
                        increasedMoney = Game.Objects['Grandma'].storedTotalCps * Game.globalCpsMult / buffMult;
                    } else if (isMultiplier) {
                        increasedMoney = _GameStat.getNormalCookiesPs() * Game.UpgradesById[g].power / 100;
                    } else if (isDouble) {
                        increasedMoney = Game.UpgradesById[g].buildingTie.storedTotalCps * Game.globalCpsMult / buffMult;
                    }
                    var interest = increasedMoney > 0 ? Game.UpgradesById[g].getPrice() / increasedMoney : '-';
                    if (interest !== '-') {
                        if (typeof _Priority.aList[Math.floor(interest)] === 'undefined') {
                            var pp = moneyCanSpend / Game.UpgradesById[g].getPrice(); // percent of cheapness
                            if (pp > 50) interest /= pp * 50;
                            _Priority.aList[Math.floor(interest)] = {
                                name: Game.UpgradesById[g].name,
                                price: Game.UpgradesById[g].getPrice(),
                                cps: 1,
                                type: 'upgrade',
                                id: g,
                                income: increasedMoney
                            };
                        }
                    } else if (Game.UpgradesById[g].type === 'upgrade' &&
                        Game.UpgradesById[g].getPrice() < moneyCanSpend &&
                        Game.UpgradesById[g].pool !== 'toggle' && (!isSpecialTech || _BotSettings.options.buyInfernalUpgrades))
                    {
                        interest = Game.UpgradesById[g].getPrice() / moneyCanSpend * 1000;
                        if (typeof _Priority.aList[Math.floor(interest)] === 'undefined') {
                            pp = moneyCanSpend / Game.UpgradesById[g].getPrice(); // percent of cheapness
                            if (pp > 50) interest /= pp * 50;
                            _Priority.aList[Math.floor(interest)] = {
                                name: Game.UpgradesById[g].name,
                                price: Game.UpgradesById[g].getPrice(),
                                cps: 1,
                                type: 'upgrade',
                                id: g,
                                income: 0
                            };
                        }
                    }
                }
            }
        },
		addPriorityForObjects: function () {
            var moneyCanSpend = _GameStat.getMoneyCanSpend();
            var buffMult = _GameStat.getBuffMult();

            for (var i in Game.ObjectsById) {
                if (typeof i !== 'undefined' && i !== 'undefined' && Game.ObjectsById.hasOwnProperty(i)) {
                    if (Game.ObjectsById[i].locked === 0) {
                        var objectCps = Math.max(Game.ObjectsById[i].storedTotalCps, Game.ObjectsById[i].storedCps);
                        var objectAmount = Math.max(Game.ObjectsById[i].amount, 1);
                        var cps = (objectCps / objectAmount) * Game.globalCpsMult / buffMult;
                        var interest = Game.ObjectsById[i].price / cps;
                        var pp2 = moneyCanSpend / Game.ObjectsById[i].price; // percent of cheapness
                        if (pp2 > 50) interest /= pp2 * 50;
                        if (isNaN(Math.floor(interest)) && Game.ObjectsById[i].price < moneyCanSpend) interest = 0;
                        _Priority.aList[Math.floor(interest)] = {
                            name: Game.ObjectsById[i].name,
                            price: Game.ObjectsById[i].price,
                            cps: cps,
                            type: 'buy',
                            id: i,
                            income: cps
                        };
                    }
                }
            }
        },
        createPriorityList: function() {
            if (_GameHelpers.isAscend()) return;

            _Priority.aList = {};

            // top priority
            var topPriorityList = ['A festive hat','A crumbly egg','Heavenly chip secret','Heavenly cookie stand','Heavenly bakery','Heavenly confectionery','Heavenly key'];
            for (var tt in topPriorityList) {
                var tp = Game.Upgrades[topPriorityList[tt]];
                if (typeof tp !== 'undefined' && tp.bought === 0 && parseInt(tp.unlocked) === 1) {
                    tp.buy();
                    break;
                }
            }

            if (!_GameHelpers.isHardcore()) {
                _Priority.addPriorityForUpgrades();
            }

            _Priority.addPriorityForObjects();
        }
	};

    var _LogPage = {
        version: (typeof GM_info == 'function' ? GM_info().script.version :
            (typeof GM_info == 'object' ? GM_info.script.version : '?')),
        logTitle: '<div class="section">Cookie clicker tools is here!</div>',
        logLinesArray: [],
        newLogs: 0,
        clearLogButton: '<button data-id="clearLog" onclick="Game.CCT.onbuttonclick(this,event)">Clear Log</button>',
        killWrinklersButton: '<button data-id="killWrinklers" onclick="Game.CCT.onbuttonclick(this,event)">Kill wrinklers</button>',
        buyEverythingButton: '<button data-id="buyEverything" onclick="Game.CCT.onbuttonclick(this,event)">Buy everything</button>',
        priorityTableStyles: '<style type="text/css">.prioritytable{width:100%;}.prioritytable td,.prioritytable th{padding:3px;}</style>',
		priorityTableHeader: '<table class="prioritytable"><tr style="border-bottom:1px solid;text-align:left;font-weight:bold;"><th>Type</th><th>Name</th><th>Price</th><th>Interest</th><th>Income</th><th>% bank</th></tr>',
		needbuyTableHeader: '<table class="prioritytable"><tr style="border-bottom:1px solid;text-align:left;font-weight:bold;"><th>Name</th><th>Price</th><th>Prerequisite</th><th>Season</th></tr>',
		needAchieveTableHeader: '<table class="prioritytable"><tr style="border-bottom:1px solid;text-align:left;font-weight:bold;"><th>Name</th><th>Description</th></tr>',
		tableFooter: '</table>',
		lastLogUpdatedTime: new Date(),
        getTableRow: function (cols) {
            var result = '<tr>';
            for (var colId in cols) {
                if (cols.hasOwnProperty(colId)) {
                    result += '<td>' + cols[colId] + '</td>';
                }
            }
            return result + '</tr>'
        },
        getLogSectionTitle: function (text) {
            return '<div class="title">' + text + '</div>';
        },
        getLogSection: function (sectionTitle, items) {
            return '<div class="subsection">' + _LogPage.getLogSectionTitle(sectionTitle) +
                '<div class="listing">' + items.join('</div><div class="listing">') + '</div>' +
                '</div>';
        },
        getLogPriorityTable: function() {
            var moneyCanSpend = _GameStat.getMoneyCanSpend();
            var t = _LogPage.priorityTableHeader;
            for (var i in _Priority.aList) {
                if (_Priority.aList.hasOwnProperty(i)) {
                    var o = _Priority.aList[i];
                    var pp = Math.floor(moneyCanSpend / o.price * 100);
                    t += '<tr><td>' + o.type + '</td><td>' + o.name + '</td><td>' + _GameHelpers.beautify(o.price) + '</td><td>' + i + '</td><td>' + _GameHelpers.beautify(o.income) + '</td><td>' + pp + '</td></tr>';
                }
            }
            t += '</table>';
            var priorityListCaption = 'Priority ' + _LogPage.clearLogButton + ' ' + _LogPage.killWrinklersButton + ' ' + _LogPage.buyEverythingButton;
            return _LogPage.priorityTableStyles + '<div class="subsection">' + _LogPage.getLogSectionTitle(priorityListCaption) + '<div class="listing">' + t + '</div></div>';
        },
        getLogNeedBuyTable: function() {
            var objList = _GameStat.getUpgradeListToUnlock();
            if (objList && objList.length > 0) {
                var t = _LogPage.needbuyTableHeader;
                for (var i in objList) {
                    if (objList.hasOwnProperty(i)) {
                        var o = objList[i];
                        t += _LogPage.getTableRow([
                            o.name,
                            _GameHelpers.beautify(o.cookies),
                            typeof o.require !== 'undefined' ? o.require : '',
                            typeof o.season !== 'undefined' ? o.season : ''
                        ]);
                    }
                }
                t += _LogPage.tableFooter;
                return _LogPage.priorityTableStyles + '<div class="subsection">' + _LogPage.getLogSectionTitle('Need to unlock') + '<div class="listing">' + t + '</div></div>';
            } else {
                return '';
            }
        },
        getLogNeedAchieveTable: function() {
            var ach = [];
            for (var i in Game.Achievements) {
                if(Game.Achievements[i].won === 0 && Game.Achievements[i].pool !== 'dungeon') {
                    ach.push(Game.Achievements[i]);
                }
            }
            if (ach.length > 0) {
                var t = _LogPage.needAchieveTableHeader;
                for (i in ach) {
                    var o = ach[i];
                    t += _LogPage.getTableRow([
                        o.name,
                        o.desc
                    ]);
                }
                t += _LogPage.tableFooter;
                return _LogPage.priorityTableStyles + '<div class="subsection">' + _LogPage.getLogSectionTitle('Achievements to unlock') + '<div class="listing">' + t + '</div></div>';
            } else {
                return '';
            }
        },
        getOptionsSectionList: function() {
            var content = [];
            content.push('<label for="bankStoragePercent" id="bankStoragePercentLabel">Storage (' + _GameHelpers.beautify(_GameStat.getMinimalMoney()) + ') percent: ' + _BotSettings.options.bankStoragePercent + '%</label> <input name="bankStoragePercent" id="bankStoragePercent" type="range" min="0" max="100" value="' + _BotSettings.options.bankStoragePercent + '" onchange="Game.CCT.onsliderchange(this)" />');
            content.push('<button data-id="bankStorageAuto" onclick="Game.CCT.onbuttonclick(this,event)">' + _BotSettings.getOptionTitle('bankStorageAuto') + '</button>');
            content.push('<button data-id="buyInfernalUpgrades" onclick="Game.CCT.onbuttonclick(this,event)">' + _BotSettings.getOptionTitle('buyInfernalUpgrades') + '</button>');
            content.push('<button data-id="noClicking" onclick="Game.CCT.onbuttonclick(this,event)">' + _BotSettings.getOptionTitle('noClicking') + '</button>');
            content.push('<button data-id="autoSeason" onclick="Game.CCT.onbuttonclick(this,event)">' + _BotSettings.getOptionTitle('autoSeason') + '</button>');
            content.push('<button data-id="disableTicker" onclick="Game.CCT.onbuttonclick(this,event)">' + _BotSettings.getOptionTitle('disableTicker') + '</button>');
            content.push( _LogPage.clearLogButton);
            return content;
        },
        getInfoSectionList: function() {
            var content = [];

            var wrinklersTotal = 0;
            for (var i in Game.wrinklers) {
                wrinklersTotal += Game.wrinklers[i].sucked;
            }

            var chipsOwned = Math.floor(Game.HowMuchPrestige(Game.cookiesReset));
            var ascendNowToOwn = Math.floor(Game.HowMuchPrestige(Game.cookiesReset + Game.cookiesEarned));
            var ascendWillGet = ascendNowToOwn - chipsOwned;
            var cookiesToDoubleInitial = Game.HowManyCookiesReset(chipsOwned * 2) - (Game.cookiesEarned + Game.cookiesReset);
            var normalCookiePs = _GameStat.getNormalCookiesPs();
            var timeToReachDouble = Math.floor(cookiesToDoubleInitial / normalCookiePs);

            content.push('Now clicking: ' + (isClickingNow ? "YES" : "NO"));
            content.push('Per click: ' + _GameHelpers.beautify(Game.computedMouseCps));
            content.push('Cookies to double prestige: ' + (cookiesToDoubleInitial >= 0 ? _GameHelpers.beautify(cookiesToDoubleInitial) : 'No info'));
            content.push('Time to double prestige: ' + Game.sayTime(timeToReachDouble * Game.fps, 2));
            content.push('Heavenly chips in storage: ' + Game.heavenlyChips);
            content.push('You will get prestige by ascending: ' + ascendWillGet);
            content.push('Heavenly chips after ascend: ' + (Game.heavenlyChips + ascendWillGet));
            content.push('Buff mult: ' + _GameStat.getBuffMult());
            content.push('Normal CpS: ' + _GameHelpers.beautify(normalCookiePs));
            content.push('Money bank: ' + _GameHelpers.beautify(_GameStat.getMinimalMoney()));
            content.push('Money can spend: ' + _GameHelpers.beautify(_GameStat.getMoneyCanSpend()));
            content.push('Wrinklers: ' + _GameStat.getWrinklerCount());
            content.push('Wrinklers sucked: ' + _GameHelpers.beautify(wrinklersTotal));
            if (Game.dragonLevel<Game.dragonLevels.length-1) {
                content.push('Next Dragon upgrade: ' + Game.dragonLevels[Game.dragonLevel].costStr());
            }
            if (_GameHelpers.hasDragon() && Game.dragonAura >= 0 && typeof Game.dragonAuras[Game.dragonAura] !== 'undefined') {
                content.push("Aura: " + _GameHelpers.getDragonAuraName(Game.dragonAura));
                if (_GameHelpers.dragonHasAura2()) {
                    content.push("Aura 2: " + _GameHelpers.getDragonAuraName(Game.dragonAura2));
                }
            }
            return content;
        },
        updateLog: function () {
            if (_GameHelpers.isAscend()) return;

            var curTime = new Date();
            var timeInterval = curTime - _LogPage.lastLogUpdatedTime;
            if (timeInterval <= 500) return;
            _LogPage.lastLogUpdatedTime = curTime;

            Game.updateLog = _LogPage.logTitle +
                _LogPage.getLogPriorityTable() +
                _LogPage.getLogSection('Info', _LogPage.getInfoSectionList()) +
                _LogPage.getLogSection('Log', _LogPage.logLinesArray) +
                _LogPage.getLogSection('Options', _LogPage.getOptionsSectionList()) +
                _LogPage.getLogNeedBuyTable() +
                _LogPage.getLogNeedAchieveTable() +
                _LogPage.getLogSection('History', _BotStat.getHistoryList());
            var newButtonText = _LogPage.newLogs > 0 ? 'Log (' + _LogPage.newLogs + ')' : 'Log';
            if (_BotUI.$logButton.text() !== newButtonText) _BotUI.$logButton.text(newButtonText);
            _BotUI.setTitle(oldTitle);
        },
        addLog: function(text, notCritical) {
            var t = new Date();
            _LogPage.logLinesArray.push(t.toUTCString() + ': ' + text);
            if (notCritical !== true) _LogPage.newLogs++;
            _LogPage.updateLog();
        },
		init: function () {
            _LogPage.logTitle = '<div class="section">Cookie clicker tools ' + _LogPage.version + ' is here!</div>';
        }
	};

    var _BotLogic = {
    	started: false,
        killAllWrinklers: function (immediately) {
            if (typeof immediately === 'undefined') immediately = false;
            var wrinklersCount = _GameStat.getWrinklerCount();
            if (wrinklersCount >= 10 || immediately === true) {
                var wrinklesIncome = 0;
                for (var i in Game.wrinklers) {
                    wrinklesIncome += Game.wrinklers[i].sucked;
                    Game.wrinklers[i].hp = 0; // kill ALL
                }
                if (wrinklesIncome > 0) {
                    _LogPage.addLog('Killed all Wrinkles for ' + _GameHelpers.beautify(wrinklesIncome) + ' of count ' + wrinklersCount + '.', true);
                }
            }
        },
        buyEverything: function () {
            if (!_GameHelpers.isHardcore()) {
                for (var x in Game.UpgradesById) {
                    if (Game.UpgradesById.hasOwnProperty(x)) {
                        if (parseInt(Game.UpgradesById[x].unlocked) === 1
                            && Game.UpgradesById[x].bought === 0 && Game.UpgradesById[x].canBuy()) {
                            var pool = Game.UpgradesById[x].pool;
                            if (pool !== "prestige" &&
                                pool !== 'debug' &&
                                pool !== 'toggle' &&
                                pool !== 'tech' &&
                                pool !== 'shadow' &&
                                pool !== 'unused' &&
                                pool !== 'dungeon') {
                                Game.UpgradesById[x].buy();
                                _LogPage.addLog('Buy upgrade ' + Game.UpgradesById[x].name + ' for ' + _GameHelpers.beautify(Game.UpgradesById[x].getPrice()));
                            }
                        }
                    }
                }
            }
            for (x in Game.ObjectsById) {
                if (Game.ObjectsById.hasOwnProperty(x)) {
                    var cnt = 0, sum = 0;
                    while (Game.cookies >= Game.ObjectsById[x].getPrice()) {
                        sum += Game.ObjectsById[x].getPrice();
                        Game.ObjectsById[x].buy(1);
                        cnt++;
                    }
                    if (cnt > 0) _LogPage.addLog('Buy ' + cnt + ' object ' + Game.ObjectsById[x].name + ' for ' + _GameHelpers.beautify(sum));
                }
            }
        },
        buyLump: function () {
            if (!Game.canLumps()) return;
            var needAchievement = Game.Achievements['Hand-picked'] &&
                parseInt(Game.Achievements['Hand-picked'].won) === 0;
            var age = Date.now() - Game.lumpT;

            if (age > Game.lumpMatureAge && needAchievement) {
                _LogPage.addLog('Trying to get lump achievement, collecting Mature lump');
                if (Game.clickLump) Game.clickLump();
            } else if (age > Game.lumpRipeAge) {
                _LogPage.addLog('Collecting Ripe lump');
                if (Game.clickLump) Game.clickLump();
            } else if (age > Game.lumpOverripeAge) {
                _LogPage.addLog('Collecting Overripe lump');
                if (Game.clickLump) Game.clickLump();
            }
        },
        bankAutoFunction: function () {
            if (_BotSettings.options.bankStorageAuto && !_GameHelpers.isAscend()) {
                for (var idx in _Priority.aList) {
                    if (_Priority.aList.hasOwnProperty(idx)) {
                        var bankStorageNew = Math.floor(idx / 50000);
                        if (bankStorageNew > 100) bankStorageNew = 100;
                        if (!isNaN(bankStorageNew)) _BotSettings.setBankStogarePercent(bankStorageNew, true);
                        else if (console) console.log('bankStorageNew error:', idx);
                        break;
                    }
                }
            }
        },
        makeABuy: function() {
            if (_GameHelpers.isAscend()) return;

            _BotLogic.killAllWrinklers();

            var moneyCanSpend = _GameStat.getMoneyCanSpend();

            if (moneyCanSpend < 0) {
                var minimalMoney = _GameStat.getMinimalMoney();
                _BotUI.setCaption('Collecting minimum ' + _GameHelpers.beautify(minimalMoney));
                _BotUI.setTitleWithPercent(Game.cookies, minimalMoney, 'minimum');
                return;
            }

            for (var idx in _Priority.aList) {
                if (_Priority.aList.hasOwnProperty(idx)) {
                    var needToBuy = _Priority.aList[idx];
                    if (needToBuy.type === 'upgrade') {
                        _BotUI.setCaption('Upgrading ' + needToBuy.name + ' for ' + _GameHelpers.beautify(needToBuy.price));
                        if (needToBuy.price < moneyCanSpend) {
                            if (Game.UpgradesById[needToBuy.id].canBuy()) {
                                Game.UpgradesById[needToBuy.id].buy();
                                _LogPage.addLog('Buy upgrade ' + Game.UpgradesById[needToBuy.id].name + ' for ' + _GameHelpers.beautify(needToBuy.price));
                                _Priority.createPriorityList();
                            }
                        } else {
                            _BotUI.setTitleWithPercent(moneyCanSpend, needToBuy.price, Game.UpgradesById[needToBuy.id].name);
                        }
                    } else {
                        var objPrice = Game.ObjectsById[needToBuy.id].price;
                        _BotUI.setCaption('Collecting ' + _GameHelpers.beautify(objPrice) + ' for ' + needToBuy.name);
                        if (objPrice < moneyCanSpend) {
                            var amount = 1;
                            var objPrice100 = Game.ObjectsById[needToBuy.id].getSumPrice(100);
                            var objPrice10 = Game.ObjectsById[needToBuy.id].getSumPrice(10);
                            if (objPrice100 < moneyCanSpend) {
                                Game.ObjectsById[needToBuy.id].buy(100);
                                amount = 100;
                                objPrice = objPrice100;
                            } else if (objPrice10 < moneyCanSpend) {
                                Game.ObjectsById[needToBuy.id].buy(10);
                                amount = 10;
                                objPrice = objPrice10;
                            } else {
                                Game.ObjectsById[needToBuy.id].buy(1);
                            }
                            _LogPage.addLog('Buy ' + amount + ' object ' + Game.ObjectsById[needToBuy.id].name + ' for ' + _GameHelpers.beautify(objPrice));
                            _Priority.createPriorityList();
                        } else {
                            _BotUI.setTitleWithPercent(moneyCanSpend, needToBuy.price, Game.ObjectsById[needToBuy.id].name);
                        }
                    }
                    break;
                }
            }

            _BotLogic.buyLump();
        },
		start: function () {
            tAutoBuy = setInterval(_BotLogic.makeABuy, 500);
            tSeasonSwitcher = setInterval(_BotLogic.seasonSwitcher, 3000);
            tDragon = setInterval(_BotLogic.dragonSwitcher, 10000);

            _BotLogic.started = true;
            _BotUI.setCaption('Started');
            _LogPage.addLog('Autobuy start!', true);
        },
		stop: function () {
            clearInterval(tAutoBuy);
            clearInterval(tSeasonSwitcher);
            clearInterval(tDragon);

            _BotLogic.started = false;
            _BotUI.setCaption('Collecting gold...');
            _LogPage.addLog('Autobuy stop.', true);
        },
        dragonSwitcher: function () {
            if (_GameHelpers.isAscend()) return;

            if (_GameHelpers.hasDragon() && Game.dragonLevel<Game.dragonLevels.length-1 && Game.dragonLevels[Game.dragonLevel].cost()) {
                _LogPage.addLog("Upgrading dragon Level " + (Game.dragonLevel+1) + " of " + Game.dragonLevels.length);
                Game.UpgradeDragon();
                Game.specialTab = 'Hello';
                Game.ToggleSpecialMenu(0);
            }

            if (Game.dragonLevel >= 12 && parseInt(Game.dragonAura) !== 9) {
                Game.dragonAura = 9; //"Arcane Aura"
                Game.recalculateGains = 1;
                _LogPage.addLog("Switching dragon Aura to " + _GameHelpers.getDragonAuraName(Game.dragonAura));
            } else if (_GameHelpers.dragonHasAura2() && parseInt(Game.dragonAura2) !== 15) {
                Game.dragonAura2 = 15; //"Radiant Appetite"
                Game.recalculateGains = 1;
                _LogPage.addLog("Switching dragon Aura2 to " + _GameHelpers.getDragonAuraName(Game.dragonAura2));
            } else if (Game.dragonLevel >= 4 && Game.dragonLevel < 12 && parseInt(Game.dragonAura) !== (Game.dragonLevel - 3)) {
                Game.dragonAura = Game.dragonLevel - 3;
                Game.recalculateGains = 1;
                _LogPage.addLog("Switching dragon Aura to " + _GameHelpers.getDragonAuraName(Game.dragonAura));
            }
        },
        seasonSwitcher: function() {
            if (!_BotSettings.options.autoSeason) return;
            if (_GameHelpers.isAscend()) return;

            if (_GameStat.getWrinklerCount() >= 8) {
                var halloweenSeason = ['Skull cookies','Ghost cookies','Bat cookies','Slime cookies','Pumpkin cookies','Eyeball cookies','Spider cookies'];
                for (var x in halloweenSeason) {
                    if (halloweenSeason.hasOwnProperty(x) && Game.Upgrades[halloweenSeason[x]].bought === 0) {
                        if (Game.season !== 'halloween') {
                            Game.Upgrades['Ghostly biscuit'].buy();
                            _BotLogic.killAllWrinklers(true);
                            return;
                        }
                    }
                }
            }

            if (!Game.Has('Santa\'s dominion')) {
                if (Game.season !== 'christmas') {
                    Game.Upgrades['Festive biscuit'].buy();
                } else {
                    if (Game.Has('A festive hat')) {
                        for (var i = 0; i < (14 - Game.santaLevel); i++) Game.UpgradeSanta();
                        Game.specialTab = 'Hello';
                        Game.ToggleSpecialMenu(0);
                    }
                }
                return;
            }

            var valentines = ['Pure heart biscuits','Ardent heart biscuits','Sour heart biscuits','Weeping heart biscuits','Golden heart biscuits','Eternal heart biscuits'];
            for (x in valentines) {
                if (valentines.hasOwnProperty(x) && Game.Upgrades[valentines[x]].bought === 0) {
                    if (Game.season !== 'valentines') {
                        Game.Upgrades['Lovesick biscuit'].buy();
                    }
                    return;
                }
            }

            for (x in Game.easterEggs) {
                if (Game.easterEggs.hasOwnProperty(x) && Game.Upgrades[Game.easterEggs[x]].bought === 0) {
                    if (Game.season !== 'easter') {
                        Game.Upgrades['Bunny biscuit'].buy();
                    }
                    return;
                }
            }

            if (Game.season !== 'christmas') {
                Game.Upgrades['Festive biscuit'].buy();
            }
        },
		removeNegativeBuff: function () {
            if (_GameStat.getBuffMult() < 1) {
                var hasBuffsToKill = false;
                for (var buff in Game.buffs) {
                    if (Game.buffs[buff] !== 0 && typeof Game.buffs[buff].multCpS !== 'undefined') {
                        Game.buffs[buff].time = 0; // remove all buffs, not only negative (not cheating)
                        hasBuffsToKill = true;
                    }
                }
                if (hasBuffsToKill) _LogPage.addLog('Remove all buffs because of negative multiplier', true);
            }
        },
		updatePriorityAndLog: function () {
            _Priority.createPriorityList();
            _LogPage.updateLog();
        },
		ascendDetector: function () {
            if (_GameHelpers.isAscend()) {
                _BotUI.setCaption("Select wisely");
                _BotSettings.setBankStogarePercent(0, true);
            } else {
                if (_GameHelpers.isNeverclick()) {
                    if (Game.cookiesEarned < 15) {
                        var s = Math.max(Game.shimmerTypes.golden.minTime - Game.shimmerTypes.golden.time, 0);
                        var s1 = Math.max(Game.shimmerTypes.golden.maxTime - Game.shimmerTypes.golden.time, 0);
                        if (s > 0) {
                            _BotUI.setCaption("Waiting golden cookies for " + s + " time")
                        } else if (s1 > 0) {
                            _BotUI.setCaption("Waiting golden cookies for more " + s1 + " time")
                        }
                    } else if (Game.Objects.Cursor.amount === 0) {
                        Game.Objects.Cursor.buy();
                    }
                }
            }
        },
		popGolden: function () {
            var golden = Game.shimmers;
            if (golden && golden.length > 0) {
                for (var i in golden) {
                    if (golden.hasOwnProperty(i)) {
                        golden[i].pop();
                    }
                }
            }
        },
		doAutoClick: function () {
            if (_BotSettings.options.noClicking) return;
            var date=new Date();
            date.setTime(Date.now()-Game.startDate);
            var seconds = date.getTime() / 1000;
            var buffMult = _GameStat.getBuffMult();
            var buffClicker = typeof Game.hasBuff !== 'undefined' && (
                Game.hasBuff('Click frenzy') ||
                Game.hasBuff('Cursed finger') ||
                Game.hasBuff('Elder frenzy') ||
                Game.hasBuff('Dragon Harvest') ||
                Game.hasBuff('Dragonflight')
            );
            if (buffMult >= 15 ||
                Game.cookiesPs < 1000000 ||
                buffClicker ||
                seconds < 1000)
            {
                var $bigCookie = jQuery('#bigCookie');
                Game.mouseX = $bigCookie.width() / 2 + $bigCookie.offset().left;
                Game.mouseY = $bigCookie.height() / 2 + $bigCookie.offset().top;
                if (typeof Game.ClickCookie === 'function') Game.ClickCookie();
                isClickingNow = true;
            } else {
                isClickingNow = false;
            }
        }
    };

	setTimeout(function() {
        _BotSettings.restoreAll();

        _LogPage.init();
		_BotUI.initBot();
		_BotUI.initLogButton();

		tPriority = setInterval(_BotLogic.updatePriorityAndLog, 1000);
		tReloadPageOnWrongBuff = setInterval(_BotLogic.removeNegativeBuff, 1000);
		tAscendDetector = setInterval(_BotLogic.ascendDetector, 1000);
		tPopGolden = setInterval(_BotLogic.popGolden, 500);
		tBankAuto = setInterval(_BotLogic.bankAutoFunction, 600001); // 10 minutes
		tClickFrenzy = setInterval(_BotLogic.doAutoClick, tAutoClickInterval);

        _BotUI.setCaption('Collecting gold...');

        _BotLogic.updatePriorityAndLog();
		_BotLogic.bankAutoFunction();
	}, 5000);
})();