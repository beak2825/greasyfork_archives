// ==UserScript==
// @name                 Quản lý Ika Perseus -VN-
// @author               ttviet2112 (blackcat8438)
// @description          Bản chỉnh sửa từ Empire Overview dành cho member liên minh -VN- server Perseus
// @namespace            Beta
// @grant                unsafeWindow
// @grant                GM_getValue
// @grant                GM_setValue
// @grant                GM_deleteValue
// @grant                GM_addStyle
// @grant                GM_registerMenuCommand
// @grant                GM_xmlhttpRequest
// @grant                GM_openInTab
//
// @exclude              http://board.*.ikariam.gameforge.com*
// @exclude              http://*.ikariam.gameforge.*/board
// @include	             https://s59-en.ikariam.gameforge.com*
// @include	             https://s60-en.ikariam.gameforge.com*
// @include	             https://s800-en.ikariam.gameforge.com*
// @require              https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js
// @require              https://ajax.googleapis.com/ajax/libs/jqueryui/1.9.2/jquery-ui.min.js
//
// @version              0.6
//
// @license              GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @downloadURL https://update.greasyfork.org/scripts/526239/Qu%E1%BA%A3n%20l%C3%BD%20Ika%20Perseus%20-VN-.user.js
// @updateURL https://update.greasyfork.org/scripts/526239/Qu%E1%BA%A3n%20l%C3%BD%20Ika%20Perseus%20-VN-.meta.js
// ==/UserScript==

/***********************************************************************************************************************
 * Includes
 ********************************************************************************************************************* */

(function ($) {
    var jQuery = $;
    var isChrome;
    if (typeof unsafeWindow.jQuery === 'undefined')
    {return;}
    if (window.navigator.vendor.match(/Google/)) {
        isChrome = true;
    }
    if (!isChrome) {
        this.$ = this.jQuery = jQuery.noConflict(true);
    }

    $.extend({
        exclusive: function (arr) {
            return $.grep(arr, function (v, k) {
                return $.inArray(v, arr) === k;
            });
        },

        mergeValues: function (a, b, c) {
            var length = arguments.length;
            if (length == 1 || typeof arguments[0] !== "object" || typeof arguments[1] !== "object") {
                return arguments[0];
            }
            var args = jQuery.makeArray(arguments);
            var i = 1;
            var target = args[0];
            for (; i < length; i++) {
                var copy = args[i];
                for (var name in copy) {
                    if (!target.hasOwnProperty(name)) {
                        target[name] = copy[name];
                        continue;
                    }
                    if (typeof target[name] == "object" && typeof copy[name] == "object") {
                        target[name] = jQuery.mergeValues(target[name], copy[name]);
                    } else if (copy.hasOwnProperty(name) && copy[name] !== undefined) {
                        target[name] = copy[name];
                    }
                }
            }
            return target;
        },
        decodeUrlParam: function (string) {
            var str = string.split('?').pop().split('&');
            var obj = {};
            for (var i = 0; i < str.length; i++) {
                var param = str[i].split('=');
                if (param.length !== 2) {
                    continue;
                }
                obj[param[0]] = decodeURIComponent(param[1].replace(/\+/g, " "));
            }
            return obj;
        }
    });

    var events = (function () {
        var _events = {};
        var retEvents = function (id) {
            var callbacks, topic = id && _events[id];
            if (!topic) {
                callbacks = $.Callbacks("");
                topic = {
                    pub: callbacks.fire,
                    sub: callbacks.add,
                    unsub: callbacks.remove
                };
                if (id) {
                    _events[id] = topic;
                }
            }
            return topic;
        };

        retEvents.scheduleAction = function (callback, time) {
            return clearTimeout.bind(undefined, setTimeout(callback, time || 0));
        };

        retEvents.scheduleActionAtTime = function (callback, time) {
            return retEvents.scheduleAction(callback, (time - $.now() > 0 ? time - $.now() : 0));
        };

        retEvents.scheduleActionAtInterval = function (callback, time) {
            return clearInterval.bind(undefined, setInterval(callback, time));
        };
        return retEvents;
    })();

    /***********************************************************************************************************************
 * Globals
 **********************************************************************************************************************/
    var debug = false;
    var log = false;
    var timing = false;
    if (!unsafeWindow) unsafeWindow = window;

    /***********************************************************************************************************************
 * Inject button into page before the page renders the YUI menu or it will not be animated (less work)
 **********************************************************************************************************************/
    $('.menu_slots > .expandable:last').after('<li class="expandable slot99 empire_Menu" onclick=""><div class="empire_Menu image" style="background-image: url(cdn/all/both/minimized/weltinfo.png); background-position: 0px 0px; background-size:33px auto"></div></div><div class="name"><span class="namebox">Empire Overview</span></div></li>');

    /***********************************************************************************************************************
 * Utility Functions
 **********************************************************************************************************************/
    var Utils = {
        wrapInClosure: function (obj) {
            return (function (x) {
                return function () {
                    return x;
                };
            })(obj);
        },
        existsIn: function (input, test) {
            var ret;
            try {
                ret = input.indexOf(test) !== -1;
            } catch (e) {
                return false;
            }
            return ret;
        },
        estimateTravelTime: function (city1, city2) {
            var time;
            if (!city1 || !city2) return 0;
            if (city1[0] == city2[0] && city1[1] == city2[1]) {
                time = 1200 / 60 * 0.5;
            } else {
                time = 1200 / 60 * (Math.sqrt(Math.pow((city2[0] - city1[0]), 2) + Math.pow((city2[1] - city1[1]), 2)));
            }
            return Math.floor(time * 60 * 1000);
        },
        addStyleSheet: function (style) {
            var getHead = document.getElementsByTagName('head')[0];
            var cssNode = window.document.createElement('style');
            var elementStyle = getHead.appendChild(cssNode);
            elementStyle.innerHTML = style;
            return elementStyle;
        },
        escapeRegExp: function (str) {
            return str.replace(/[\[\]\/\{\}\(\)\-\?\$\*\+\.\\\^\|]/g, "\\$&");
        },
        format: function (inputString, replacements) {
            var str = '' + inputString;
            var keys = Object.keys(replacements);
            var i = keys.length;
            while (i--) {
                str = str.replace(new RegExp(this.escapeRegExp('{' + keys[i] + '}'), 'g'), replacements[keys[i]]);
            }
            return str;
        },
        cacheFunction: function (toExecute, expiry) {
            expiry = expiry || 1000;
            var cachedTime = $.now;
            var cachedResult;
            cachedResult = undefined;
            return function () {
                if (cachedTime < $.now() - expiry || cachedResult === undefined) {
                    cachedResult = toExecute();
                    cachedTime = $.now();
                }
                return cachedResult;
            };
        },
        getClone: function ($node) {
            if ($node.hasClass('ui-sortable-helper') || $node.parent().find('.ui-sortable-helper').length) {
                return $node;
            }
            return $($node.get(0).cloneNode(true));
        },
        setClone: function ($node, $clone) {
            if ($node.hasClass('ui-sortable-helper') || $node.parent().find('.ui-sortable-helper').length) {
                return $node;
            }
            $node.get(0).parentNode.replaceChild($clone.get(0), $node.get(0));
            return $node;
        },
        replaceNode: function (node, html) {
            var t = node.cloneNode(false);
            t.innerHTML = html;
            node.parentNode.replaceChild(t, node);
            return t;
        },
        FormatTimeLengthToStr: function (timeString, precision, spacer) {
            var lang = database.settings.languageChange.value;
            timeString = timeString || 0;
            precision = precision || 2;
            spacer = spacer || ' ';
            if (!isFinite(timeString)) {
                return ' \u221E ';
            }
            if (timeString < 0) timeString *= -1;
            var factors = [];
            var locStr = [];
            factors.year = 31536000;
            factors.month = 2520000;
            factors.day = 86400;
            factors.hour = 3600;
            factors.minute = 60;
            factors.second = 1;
            locStr.year = Constant.LanguageData[lang].year;
            locStr.month = Constant.LanguageData[lang].month;
            locStr.day = Constant.LanguageData[lang].day;
            locStr.hour = Constant.LanguageData[lang].hour;
            locStr.minute = Constant.LanguageData[lang].minute;
            locStr.second = Constant.LanguageData[lang].second;
            timeString = Math.ceil(timeString / 1000);
            var retString = "";
            for (var fact in factors) {
                var timeInSecs = Math.floor(timeString / factors[fact]);
                if (isNaN(timeInSecs)) {
                    return retString;
                }
                if (precision > 0 && (timeInSecs > 0 || retString != "")) {
                    timeString = timeString - timeInSecs * factors[fact];
                    if (retString != "") {
                        retString += spacer;
                    }
                    retString += timeInSecs == 0 ? '' : timeInSecs + locStr[fact];
                    precision = timeInSecs == 0 ? precision : (precision - 1);
                }
            }
            return retString;
        },
        FormatFullTimeToDateString: function (timeString, precise) {
            var lang = database.settings.languageChange.value;
            precise = precise || true;
            timeString = timeString || 0;
            var sInDay = 86400000;
            var day = '';
            var compDate = new Date(timeString);
            if (precise) {
                switch (Math.floor(compDate.getTime() / sInDay) - Math.floor($.now() / sInDay)) {
                    case 0:
                        day = Constant.LanguageData[lang].today;
                        break;
                    case 1:
                        day = Constant.LanguageData[lang].tomorrow;
                        break;
                    case -1:
                        day = Constant.LanguageData[lang].yesterday;
                        break;
                    default:
                        day = (!isChrome ? compDate.toLocaleFormat('%a %d %b') : compDate.toString().split(' ').splice(0, 3).join(' ')); //Dienstag
                }
            }
            if (day !== '') {
                day += ', ';
            }
            return day + compDate.toLocaleTimeString();
        },
        FormatTimeToDateString: function (timeString) {
            timeString = timeString || 0;
            var compDate = new Date(timeString);
            return compDate.toLocaleTimeString();
        },
        FormatRemainingTime: function (time, brackets) {
            brackets = brackets || false;
            var arrInTime = Utils.FormatTimeLengthToStr(time, 3, ' ');
            return (arrInTime === '') ? '' : (brackets ? '(' : '') + arrInTime + (brackets ? ')' : '');
        },
        FormatNumToStr: function (inputNum, outputSign, precision) {
            var lang = database.settings.languageChange.value;
            precision = precision ? "10e" + (precision - 1) : 1;
            var ret, val, sign, i, j;
            var tho = Constant.LanguageData[lang].thousandSeperator;
            var dec = Constant.LanguageData[lang].decimalPoint;
            if (!isFinite(inputNum)) {
                return '\u221E';
            }
            sign = inputNum > 0 ? 1 : inputNum === 0 ? 0 : -1;
            if (sign) {
                val = ((Math.floor(Math.abs(inputNum * precision)) / precision) + '').split('.');
                ret = val[1] !== undefined ? [dec, val[1]] : [];
                val = val[0].split('');
                i = val.length;
                j = 1;
                while (i--) {
                    ret.unshift(val.pop());
                    if (i && j % 3 === 0) {
                        ret.unshift(tho);
                    }
                    j++;
                }
                if (outputSign) {
                    ret.unshift(sign == 1 ? '+' : '-');
                }
                return ret.join('');
            }
            else return inputNum;
        }
    };

    /***********************************************************************************************************************
 * CLASSES
 **********************************************************************************************************************/
    function Movement(id, originCityId, targetCityId, arrivalTime, mission, loadingTime, resources, military, ships) {
        if (typeof id === "object") {
            this._id = id._id || null;
            this._originCityId = id._originCityId || null;
            this._targetCityId = id._targetCityId || null;
            this._arrivalTime = id._arrivalTime || null;
            this._mission = id._mission || null;
            this._loadingTime = id._loadingTime || null;
            this._resources = id._resources || { wood: 0, wine: 0, marble: 0, glass: 0, sulfur: 0, gold: 0 };
            this._military = id._military || new MilitaryUnits();
            this._ships = id._ships || null;
            this._updatedCity = id._updatedCity || false;
            this._complete = id._complete || false;
            this._updateTimer = id._updateTimer || null;

        } else {
            this._id = id || null;
            this._originCityId = originCityId || null;
            this._targetCityId = targetCityId || null;
            this._arrivalTime = arrivalTime || null;
            this._mission = mission || null;
            this._loadingTime = loadingTime || null;
            this._resources = resources || { wood: 0, wine: 0, marble: 0, glass: 0, sulfur: 0, gold: 0 };
            this._military = military || new MilitaryUnits();
            this._ships = ships || null;
            this._updatedCity = false;
            this._complete = false;
            this._updateTimer = null;
        }
    }
    Movement.prototype = {
        startUpdateTimer: function () {
            this.clearUpdateTimer();
            if (this.isCompleted) {
                this.updateTransportComplete();
            } else {
                this._updateTimer = events.scheduleActionAtTime(this.updateTransportComplete.bind(this), this._arrivalTime + 1000);
            }
        },
        clearUpdateTimer: function () {
            var ret = !this._updateTimer || this._updateTimer();
            this._updateTimer = null;
            return ret;
        },
        get getId() {
            return this._id;
        },
        get getOriginCityId() {
            return this._originCityId;
        },
        get getTargetCityId() {
            return this._targetCityId;
        },
        get getArrivalTime() {
            return this._arrivalTime;
        },
        get getMission() {
            return this._mission;
        },
        get getLoadingTime() {
            return this._loadingTime - $.now();
        },
        get getResources() {
            return this._resources;
        },
        getResource: function (resourceName) {
            return this._resources[resourceName];
        },
        get getMilitary() {
            return this._military;
        },
        get getShips() {
            return this._ships;
        },
        get isCompleted() {
            return this._arrivalTime < $.now();
        },
        get isLoading() {
            return this._loadingTime > $.now();
        },
        get getRemainingTime() {
            return this._arrivalTime - $.now();
        },
        updateTransportComplete: function () {
            if (this.isCompleted && !this._updatedCity) {
                var city = database.getCityFromId(this._targetCityId);
                var changes = [];
                if (city) {
                    for (var resource in Constant.Resources) {
                        if (this.getResource(Constant.Resources[resource])) {
                            changes.push(Constant.Resources[resource]);
                        }
                        city.getResource(Constant.Resources[resource]).increment(this.getResource(Constant.Resources[resource]));
                    }
                    this._updatedCity = true;
                    city = database.getCityFromId(this.originCityId);
                    if (city) {
                        city.updateActionPoints(city.getAvailableActions + 1);
                    }
                    if (changes.length) {
                        events(Constant.Events.MOVEMENTS_UPDATED).pub([this.getTargetCityId]);
                        events(Constant.Events.RESOURCES_UPDATED).pub(this.getTargetCityId, changes);
                    }
                    events.scheduleAction(function () {
                        database.getGlobalData.removeFleetMovement(this._id);
                    }.bind(this));
                    return true;
                }

            } else if (this._updatedCity) {
                events.scheduleAction(function () {
                    database.getGlobalData.removeFleetMovement(this._id);
                }.bind(this));
            }
            return false;
        }
    };

    function Resource(city, name) {
        this._current = 0;
        this._production = 0;
        this._consumption = 0;
        this._currentChangedDate = $.now();
        this.city = Utils.wrapInClosure(city);
        this._name = name;
        return this;
    }

    Resource.prototype = {
        get name() {
            return this._name;
        },
        update: function (current, production, consumption) {
            var changed = (current % this._current > 10) || (production != this._production) || (consumption != this._consumption);
            this._current = current;
            this._production = production;
            this._consumption = consumption;
            this._currentChangedDate = $.now();
            return changed;
        },
        project: function () {
            var limit = Math.floor($.now() / 1000);
            var start = Math.floor(this._currentChangedDate / 1000);
            while (limit > start) {
                this._current += this._production;
                if (Math.floor(start / 3600) != Math.floor((start + 1) / 3600)){
                    if (this._current > this._consumption) {
                        this._current -= this._consumption;
                    } else {
                        this.city().projectPopData(start * 1000);
                        this._consumption = 0;
                    }
                }
                start++;
            }
            this._currentChangedDate = limit * 1000;
            this.city().projectPopData(limit * 1000);

        },
        increment: function (amount) {
            if (amount !== 0) {
                this._current += amount;
                return true;
            }
            return false;
        },
        get getEmptyTime() {
            var net = this.getProduction * 3600 - this.getConsumption;
            return (net < 0) ? this.getCurrent / net * -1 : Infinity;
        },
        get getFullTime() {
            var net = this.getProduction * 3600 - this.getConsumption;
            return (net > 0) ? (this.city().maxResourceCapacities.capacity - this.getCurrent) / net : 0;
        },
        get getCurrent() {
            return Math.floor(this._current);

        },
        get getProduction() {
            return this._production || 0;
        },
        get getConsumption() {
            return this._consumption || 0;
        }
    };

    function Military(city) {
        this.city = Utils.wrapInClosure(city);
        this._units = new MilitaryUnits();
        this._advisorLastUpdate = 0;
        this.armyTraining = [];
        this._trainingTimer = null;
    }
    Military.prototype = {
        init: function () {
            this._trainingTimer = null;
            this._startTrainingTimer();
        },
        _getTrainingTotals: function () {
            var ret = {};
            $.each(this.armyTraining, function (index, training) {
                $.each(Constant.UnitData, function (unitId, info) {
                    ret[unitId] = ret[unitId] ? ret[unitId] + (training.units[unitId] || 0) : training.units[unitId] || 0;
                });
            });
            return ret;
        },
        get getTrainingTotals() {
            if (!this._trainingTotals) {
                this._trainingTotals = Utils.cacheFunction(this._getTrainingTotals.bind(this), 1000);
            }
            return this._trainingTotals();
        },
        _getIncomingTotals: function () {
            var ret = {};
            $.each(this.city().getIncomingMilitary, function (index, element) {
                for (var unitName in Constant.UnitData) {
                    ret[unitName] = ret[unitName] ? ret[unitName] + (element.getMilitary.totals[unitName] || 0) : element.getMilitary.totals[unitName] || 0;
                }
            });
            return ret;
        },
        get getIncomingTotals() {
            if (!this._incomingTotals) {
                this._incomingTotals = Utils.cacheFunction(this._getIncomingTotals.bind(this), 1000);
            }
            return this._incomingTotals();
        },
        getTrainingForUnit: function (unit) {
            var ret = [];
            $.each(this.armyTraining, function (index, training) {
                $.each(training.units, function (unitId, count) {
                    if (unitId === unit) {
                        ret.push({ count: count, time: training.completionTime });
                    }
                });
            });
            return ret;
        },
        setTraining: function (trainingQueue) {
            if (!trainingQueue.length) return false;
            this._stopTrainingTimer();
            var type = trainingQueue[0].type;
            var changes = this._clearTrainingForType(type);
            $.each(trainingQueue, function (index, training) {
                this.armyTraining.push(training);
                $.each(training.units, function (unitId, count) {
                    changes.push(unitId);
                });
            }.bind(this));
            this.armyTraining.sort(function (a, b) {
                return a.completionTime - b.completionTime;
            });
            this._startTrainingTimer();
            return $.exclusive(changes);
        },
        _clearTrainingForType: function (type) {
            var oldTraining = this.armyTraining.filter(function (item) {
                return item.type === type;
            });
            this.armyTraining = this.armyTraining.filter(function (item) {
                return item.type !== type;
            });
            var changes = [];
            $.each(oldTraining, function (index, training) {
                $.each(training.units, function (unitId, count) {
                    changes.push(unitId);
                });
            });
            return changes;
        },
        _completeTraining: function () {
            if (this.armyTraining.length) {
                if (this.armyTraining[0].completionTime < $.now() + 5000) {
                    var changes = [];
                    var training = this.armyTraining.shift();
                    $.each(training.units, function (id, count) {
                        this.getUnits.addUnit(id, count);
                        changes.push(id);
                    }.bind(this));
                    if (changes.length) events(Constant.Events.MILITARY_UPDATED).pub(this.city().getId, changes);
                }
            }
            this._startTrainingTimer();
        },
        _startTrainingTimer: function () {
            this._stopTrainingTimer();
            if (this.armyTraining.length) {
                this._trainingTimer = events.scheduleActionAtTime(this._completeTraining.bind(this), this.armyTraining[0].completionTime);
            }
        },
        _stopTrainingTimer: function () {
            if (this._trainingTimer) {
                this._trainingTimer();
            }
            this._trainingTimer = null;
        },
        updateUnits: function (counts) {
            var changes = [];
            $.each(counts, function (unitId, count) {
                if (this._units.setUnit(unitId, count)) {
                    changes.push(unitId);
                }
            }.bind(this));
            return changes;
        },
        get getUnits() {
            return this._units;
        }
    };
    function MilitaryUnits(obj) {
        this._units = obj !== undefined ? obj._units : {};
    }
    MilitaryUnits.prototype = {
        getUnit: function (unitId) {
            return this._units[unitId] || 0;
        },
        setUnit: function (unitId, count) {
            var changed = this._units[unitId] != count;
            this._units[unitId] = count;
            return changed;
        },
        get totals() {
            return this._units;
        },
        addUnit: function (unitId, count) {
            return this.setUnit(unitId, this.getUnit(unitId) + count);
        },
        removeUnit: function (unitId, count) {
            count = Math.max(0, this.getUnit[unitId] - count);
            return this.setUnit(unitId, count);
        }
    };

    function Building(city, pos) {
        this._position = pos;
        this._level = 0;
        this._name = null;
        this.city = Utils.wrapInClosure(city);
        this._updateTimer = null;
    }
    Building.prototype = {
        startUpgradeTimer: function () {
            if (this._updateTimer) {
                this._updateTimer();
                delete this._updateTimer;
            }
            if (this._completionTime) {
                if (this._completionTime - $.now() < 5000) {
                    this.completeUpgrade();
                } else {
                    this._updateTimer = events.scheduleActionAtTime(this.completeUpgrade.bind(this), this._completionTime - 4000);
                }
            }
            var statusPoll = function (a, b) {
                return events.scheduleActionAtInterval(function () {
                    if (a != this.isUpgradable || b != this.isUpgrading) {
                        var changes = { position: this._position, name: this.getName, upgraded: this.isUpgrading != b };
                        events(Constant.Events.BUILDINGS_UPDATED).pub([changes]);
                        a = this.isUpgradable;
                        b = this.isUpgrading;
                    }
                }.bind(this), 3000);
            }(this.isUpgradable, this.isUpgrading);
        },
        update: function (data) {
            var changes;
            var name = data.building.split(' ')[0];
            var level = parseInt(data.level) || 0;
            database.getGlobalData.addLocalisedString(name, data.name);
            var completion = ('undefined' !== typeof data.completed) ? parseInt(data.completed) : 0;
            var changed = (name !== this._name || level !== this._level || !!completion != this.isUpgrading); // todo
            if (changed) {
                changes = { position: this._position, name: this.getName, upgraded: this.isUpgrading != !completion }; //todo
            }
            if (completion) {
                this._completionTime = completion * 1000;
                this.startUpgradeTimer();
            } else if (this._completionTime) {
                delete this._completionTime;
            }
            this._name = name;
            this._level = level;
            if (changed) {
                return changes;
            }
            return false;
        },
        get getUrlParams() {
            return {
                view: this.getName,
                cityId: this.city().getId,
                position: this.getPosition
            };
        },
        get getUpgradeCost() {
            var carpenter, architect, vineyard, fireworker, optician;
            var level = this._level + this.isUpgrading;
            if (this.isEmpty) {
                return {
                    wood: Infinity,
                    glass: 0,
                    marble: 0,
                    sulfur: 0,
                    wine: 0,
                    time: 0
                };
            }
            var vietMagicNumber = 0.418604630671301;
            var time = Constant.BuildingData[this._name].time;
            var bon = 1;
            var bonTime = 1 + Constant.GovernmentData[database.getGlobalData.getGovernmentType].buildingTime;
            bon -= database.getGlobalData.getResearchTopicLevel(Constant.Research.Economy.PULLEY) ? 0.02 : 0;
            bon -= database.getGlobalData.getResearchTopicLevel(Constant.Research.Economy.GEOMETRY) ? 0.04 : 0;
            bon -= database.getGlobalData.getResearchTopicLevel(Constant.Research.Economy.SPIRIT_LEVEL) ? 0.08 : 0;
            return {
                //wood: Math.round((Constant.BuildingData[this._name].wood[level] || 0) * (bon - (carpenter = this.city().getBuildingFromName(Constant.Buildings.CARPENTER), carpenter ? carpenter.getLevel / 100 : 0))),
                //wine: Math.round((Constant.BuildingData[this._name].wine[level] || 0) * (bon - (vineyard = this.city().getBuildingFromName(Constant.Buildings.VINEYARD), vineyard ? vineyard.getLevel / 100 : 0))),
                //marble: Math.round((Constant.BuildingData[this._name].marble[level] || 0) * (bon - (architect = this.city().getBuildingFromName(Constant.Buildings.ARCHITECT), architect ? architect.getLevel / 100 : 0))),
                //glass: Math.round((Constant.BuildingData[this._name].glass[level] || 0) * (bon - (optician = this.city().getBuildingFromName(Constant.Buildings.OPTICIAN), optician ? optician.getLevel / 100 : 0))),
                //sulfur: Math.round((Constant.BuildingData[this._name].sulfur[level] || 0) * (bon - (fireworker = this.city().getBuildingFromName(Constant.Buildings.FIREWORK_TEST_AREA), fireworker ? fireworker.getLevel / 100 : 0))),
                wood: Math.round((Constant.BuildingData[this._name].wood[level] || 0) * vietMagicNumber),
                wine: Math.round((Constant.BuildingData[this._name].wine[level] || 0) * vietMagicNumber),
                marble: Math.round((Constant.BuildingData[this._name].marble[level] || 0) * vietMagicNumber),
                glass: Math.round((Constant.BuildingData[this._name].glass[level] || 0) * vietMagicNumber),
                sulfur: Math.round((Constant.BuildingData[this._name].sulfur[level] || 0) * vietMagicNumber),
                time: Math.round(time.a / time.b * Math.pow(time.c, level + 1) - time.d) * 1000 * bonTime
            };
        },
        get getName() {
            return this._name;
        },
        get getType() {
            return Constant.BuildingData[this.getName].type;
        },
        get getLevel() {
            return this._level;
        },
        get isEmpty() {
            return this._name == 'buildingGround' || this._name === null;
        },
        get isUpgrading() {
            return (this._completionTime > $.now());
        },
        subtractUpgradeResourcesFromCity: function () {
            var cost = this.getUpgradeCost;
            $.each(Constant.Resources, function (key, resourceName) {
                this.city().getResource(resourceName).increment(cost[resourceName] * -1);
            }.bind(this));
            this._completionTime = $.now() + cost.time;
        },
        get isUpgradable() {
            if (this.isEmpty || this.isMaxLevel) {
                return false;
            }
            var cost = this.getUpgradeCost;
            var upgradable = true;
            $.each(Constant.Resources, function (key, value) {
                upgradable = upgradable && (!cost[value] || cost[value] <= this.city().getResource(value).getCurrent);
            }.bind(this));
            return upgradable;
        },
        get getCompletionTime() {
            return this._completionTime;
        },
        get getCompletionDate() {
        },
        get isMaxLevel() {
            return Constant.BuildingData[this.getName].maxLevel === (this.getLevel);
        },
        get getPosition() {
            return this._position;
        },
        completeUpgrade: function () {
            this._level++;
            delete this._completionTime;
            delete this._updateTimer;
            events(Constant.Events.BUILDINGS_UPDATED).pub(this.city().getId, [
                { position: this._position, name: this.getName, upgraded: true }
            ]);
        }
    };

    function CityResearch(city) {
        this._researchersLastUpdate = 0;
        this._researchers = 0;
        this._researchCostLastUpdate = 0;
        this._researchCost = 0;
        this.city = Utils.wrapInClosure(city);
    }

    CityResearch.prototype = {
        updateResearchers: function (researchers) {
            var changed = this._researchers !== researchers;
            this._researchers = researchers;
            this._researchersLastUpdate = $.now();
            this._researchCost = this.getResearchCost;
            return changed;
        },
        updateCost: function (cost) {
            var changed = this._researchCost !== cost;
            this._researchCost = cost;
            this._researchCostLastUpdate = $.now();
            this._researchers = this.getResearchers;
            return changed;
        },
        get getResearchers() {
            if (this._researchersLastUpdate < this._researchCostLastUpdate) {
                return Math.floor(this._researchCost / this._researchCostModifier);
            } else {
                return this._researchers;
            }
        },
        get getResearch() {
            return this.researchData.total;
        },
        get researchData() {
            if (!this._researchData) {
                this._researchData = Utils.cacheFunction(this.researchDataCached.bind(this), 1000);
            }
            return this._researchData();
        },
        researchDataCached: function () {
            var resBon = 0 + (database.getGlobalData.getResearchTopicLevel(Constant.Research.Science.PAPER) * 0.02) + (database.getGlobalData.getResearchTopicLevel(Constant.Research.Science.INK) * 0.04) + (database.getGlobalData.getResearchTopicLevel(Constant.Research.Science.MECHANICAL_PEN) * 0.08) + (database.getGlobalData.getResearchTopicLevel(Constant.Research.Science.SCIENTIFIC_FUTURE) * 0.02);
            var premBon = database.getGlobalData.hasPremiumFeature(Constant.Premium.RESEARCH_POINTS_BONUS_EXTREME_LENGTH) ? (0 + Constant.PremiumData[Constant.Premium.RESEARCH_POINTS_BONUS_EXTREME_LENGTH].bonus) : database.getGlobalData.hasPremiumFeature(Constant.Premium.RESEARCH_POINTS_BONUS) ? (0 + Constant.PremiumData[Constant.Premium.RESEARCH_POINTS_BONUS].bonus) : 0;
            var goods = Constant.GovernmentData[database.getGlobalData.getGovernmentType].researchPerCulturalGood * this.city()._culturalGoods;
            var researchers = this.getResearchers;
            var corruptionSpend = researchers * this.city().getCorruption;
            var nonCorruptedResearchers = researchers * (1 - this.city().getCorruption);
            var premiumResBonus = nonCorruptedResearchers * premBon;
            var researchBonus = nonCorruptedResearchers * resBon;
            var premiumGoodsBonus = goods * premBon;
            var serverTyp = 1;
            if (ikariam.Server() == 's201' || ikariam.Server() == 's202') serverTyp = 3;
            return {
                scientists: researchers,
                researchBonus: researchBonus,
                premiumScientistBonus: premiumResBonus,
                premiumResearchBonus: (researchBonus * premBon),
                culturalGoods: goods,
                premiumCulturalGoodsBonus: premiumGoodsBonus,
                corruption: corruptionSpend,
                total: ((nonCorruptedResearchers + researchBonus + premiumResBonus + goods + premiumGoodsBonus + (researchBonus * premBon)) * Constant.GovernmentData[database.getGlobalData.getGovernmentType].researchBonus) * serverTyp
            };
        },
        get _researchCostModifier() {
            var serverTyp = 1;
            if (ikariam.Server() == 's201' || ikariam.Server() == 's202') serverTyp = 3;
            return (6 + Constant.GovernmentData[database.getGlobalData.getGovernmentType].researcherCost - (database.getGlobalData.getResearchTopicLevel(Constant.Research.Science.LETTER_CHUTE) * 3)) * serverTyp;
        },
        get getResearchCost() {
            return this.getResearchers * this._researchCostModifier;
        }
    };

    function Changes(city, type, changes) {
        this.city = city || null;
        this.type = type || null;
        this.changes = changes || [];
    }
    function Population(city) {
        this._population = 0;
        this._citizens = 0;
        this._resourceWorkers = 0;
        this._tradeWorkers = 0;
        this._priests = 0;
        this._culturalGoods = 0;

        this._popChanged = $.now();
        this._citizensChanged = $.now();
        this._culturalGoodsChanged = $.now();
        this._priestsChanged = $.now();
        this.city = Utils.wrapInClosure(city);
    }
    Population.prototype = {
        updatePopulationData: function (population, citizens, priests, culturalGoods) {
            var changes = [];
            if (population && population != this._population) {
                changes.push({ population: true });
                this.population = population;
            }
            if (citizens && citizens != this._priests) {
                changes.push({ citizens: true });
                this.citizens = citizens;
            }
            if (priests && priests != this._priests) {
                changes.push({ priests: true });
                this.priests = priests;
            }
        },
        updateWorkerData: function (resourceName, workers) {
        },
        updatePriests: function (newCount) {
        },
        updateCulturalGoods: function (newCount) {
        },
        get population() {
            return this._population;
        },
        set population(newVal) {
            this._population = newVal;
            this._popChanged = $.now();
        },
        get citizens() {
            return this._citizens;
        },
        set citizens(newVal) {
            this._citizens = newVal;
            this._citizensChanged = $.now();
        },
        get priests() {
            return this._priests;
        },
        set priests(newVal) {
            this._priests = newVal;
            this._priestsChanged = $.now();
        }
    };

    function City(id) {
        this._id = id || 0;
        this._name = '';
        this._resources = {
            gold: new Resource(this, Constant.Resources.GOLD),
            wood: new Resource(this, Constant.Resources.WOOD),
            wine: new Resource(this, Constant.Resources.WINE),
            marble: new Resource(this, Constant.Resources.MARBLE),
            glass: new Resource(this, Constant.Resources.GLASS),
            sulfur: new Resource(this, Constant.Resources.SULFUR)
        };
        this._capacities = {
            capacity: 0,
            safe: 0,
            buildings: {
                dump: { storage: 0, safe: 0 },
                warehouse: { storage: 0, safe: 0 },
                townHall: { storage: 2500, safe: 100 }
            },
            invalid: true
        };
        this._tradeGoodID = 0;
        this.knownTime = $.now();
        this._lastPopUpdate = $.now();
        this._buildings = new Array(25);
        var i = this._buildings.length;
        while (i--) {
            this._buildings[i] = new Building(this, i);
        }
        this._research = new CityResearch(this);
        this.actionPoints = 0;
        this._actionPoints = 0;
        this.maxSci = 0;
        this._coordinates = { x: 0, y: 0 };
        this._islandID = null;

        this.population = new Population(this);
        this._population = 0;
        this._citizens = 0;
        this._resourceWorkers = 0;
        this._tradeWorkers = 0;
        this._priests = 0;
        this._culturalGoods = 0;
        this._military = new Military(this);

        this.fleetMovements = {};
        this.militaryMovements = {};
        this.unitBuildList = [];

        this.goldIncome = 0;
        this.goldExpend = 0;

        this._pop = { currentPop: 0, maxPop: 0, satisfaction: { city: 196, museum: { cultural: 0, level: 0 }, government: 0, tavern: { wineConsumption: 0, level: 0 }, research: 0, priest: 0, total: 0 }, happiness: 0, growth: 0 };
        events('updateCityData').sub(this.updateCityDataFromAjax.bind(this));
        events('updateBuildingData').sub(this.updateBuildingsDataFromAjax.bind(this));
    }

    City.prototype = {
        init: function () {
            $.each(this._buildings, function (idx, building) {
                building.startUpgradeTimer();
            });
            this.military.init();
            $.each(this._resources, function (resourceName, resource) {
                resource.project();
            });
            events.scheduleActionAtInterval(function () {
                $.each(this._resources, function (resourceName, resource) {
                    resource.project();
                }.bind(this));
            }.bind(this), 1000);
        },
        projectResource: function (seconds) {
        },
        updateBuildingsDataFromAjax: function (id, position) {
            var changes = [];
            if (id == this.getId && ikariam.viewIsCity) {
                if (position) {
                    $.each(position, function (i, item) {
                        var change = this.getBuildingFromPosition(i).update(item);
                        if (change) changes.push(change);
                    }.bind(this));
                    if (changes.length) {
                        this._capacities.invalid = true;
                        events(Constant.Events.BUILDINGS_UPDATED).pub(id, changes);
                    }
                }
            }
        },
        updateCityDataFromAjax: function (id, cityData) {
            var resourcesChanged = false;
            var changes = {};
            if (id == this.getId) {
                try {
                    var baseWineConsumption = 0, wineConsumption = 0;
                    if ($.inArray(cityData.wineSpendings, Constant.BuildingData[Constant.Buildings.TAVERN].wineUse, Constant.BuildingData[Constant.Buildings.TAVERN].wineUse2) > -1) {
                        baseWineConsumption = cityData.wineSpendings;
                        wineConsumption = (this.getBuildingFromName(Constant.Buildings.VINEYARD)) ? baseWineConsumption * ((100 - this.getBuildingFromName(Constant.Buildings.VINEYARD).getLevel) / 100) : baseWineConsumption;
                    }
                    else {
                        wineConsumption = cityData.wineSpendings;
                    }
                    this.updateTradeGoodID(parseInt(cityData.producedTradegood));
                    resourcesChanged = this.updateResource(Constant.Resources.WOOD, cityData.currentResources[Constant.ResourceIDs.WOOD], cityData.resourceProduction, 0) || resourcesChanged;
                    resourcesChanged = this.updateResource(Constant.Resources.WINE, cityData.currentResources[Constant.ResourceIDs.WINE], this.getTradeGoodID == Constant.ResourceIDs.WINE ? cityData.tradegoodProduction : 0, wineConsumption) || resourcesChanged;
                    resourcesChanged = this.updateResource(Constant.Resources.MARBLE, cityData.currentResources[Constant.ResourceIDs.MARBLE], this.getTradeGoodID == Constant.ResourceIDs.MARBLE ? cityData.tradegoodProduction : 0, 0) || resourcesChanged;
                    resourcesChanged = this.updateResource(Constant.Resources.GLASS, cityData.currentResources[Constant.ResourceIDs.GLASS], this.getTradeGoodID == Constant.ResourceIDs.GLASS ? cityData.tradegoodProduction : 0, 0) || resourcesChanged;
                    resourcesChanged = this.updateResource(Constant.Resources.SULFUR, cityData.currentResources[Constant.ResourceIDs.SULFUR], this.getTradeGoodID == Constant.ResourceIDs.SULFUR ? cityData.tradegoodProduction : 0, 0) || resourcesChanged;
                    this.knownTime = $.now();

                    var $actionPointElem = $('#js_GlobalMenu_maxActionPoints');
                    if (cityData.maxActionPoints) {
                        changes.actionPoints = this.updateActionPoints(cityData.maxActionPoints || 0);
                    } else {
                        changes.actionPoints = this.updateActionPoints(parseInt($actionPointElem.text()) || 0);
                    }
                    changes.coordinates = this.updateCoordinates(parseInt(cityData.islandXCoord), parseInt(cityData.islandYCoord));
                    if (ikariam.viewIsCity) {
                        changes.name = this.updateName(cityData.name);
                        changes.population = this.updatePopulation(cityData.currentResources.population);
                        changes.islandId = this.updateIslandID(parseInt(cityData.islandId));
                        changes.coordinates = this.updateCoordinates(parseInt(cityData.islandXCoord), parseInt(cityData.islandYCoord));
                    }
                    if (ikariam.viewIsIsland) {
                        changes.islandId = this.updateIslandID(parseInt(cityData.id));
                        changes.coordinates = this.updateCoordinates(parseInt(cityData.xCoord), parseInt(cityData.yCoord));
                    }
                    changes.citizens = this.updateCitizens(cityData.currentResources.citizens);
                    database.getGlobalData.addLocalisedString('cities', $('#js_GlobalMenu_cities').find('> span').text());
                    database.getGlobalData.addLocalisedString('ActionPoints', $actionPointElem.attr('title'));
                    if (cityData.gold) {
                        database.getGlobalData.finance.currentGold = parseFloat(cityData.gold);
                    }
                } catch (e) {
                    empire.error('fetchCurrentCityData', e);
                } finally {
                    cityData = null;
                }
                events(Constant.Events.CITY_UPDATED).pub(this.getId, changes);
                if (resourcesChanged) {
                    events(Constant.Events.RESOURCES_UPDATED).pub(this.getId, resourcesChanged);
                }
            }
        },
        get getCorruption() {
            if (typeof this._corruption != "function") {
                this._corruption = Utils.cacheFunction(function () {
                    var h = 0;
                    if (this.getBuildingFromName(Constant.Buildings.GOVERNORS_RESIDENCE) && (this.getBuildingFromName(Constant.Buildings.GOVERNORS_RESIDENCE).getLevel / database.getCityCount != 1)) {
                        h = Constant.GovernmentData[database.getGlobalData.getGovernmentType].governors;
                    }
                    return Math.max(0, 1 - ((this.getBuildingFromName(Constant.Buildings.GOVERNORS_RESIDENCE) ? this.getBuildingFromName(Constant.Buildings.GOVERNORS_RESIDENCE).getLevel : this.getBuildingFromName(Constant.Buildings.PALACE) ? this.getBuildingFromName(Constant.Buildings.PALACE).getLevel : 0) + 1) / database.getCityCount + Constant.GovernmentData[database.getGlobalData.getGovernmentType].corruption + h);
                }.bind(this), 1000);
            }
            return this._corruption();
        },
        get isCurrentCity() {
            return this.getId == ikariam.CurrentCityId;
        },
        getResource: function (name) {
            return this._resources[name];
        },
        updateResource: function (resourceName, current, production, consumption) {
            return this.getResource(resourceName).update(current, production, consumption);
        },
        get getIncome() {
            var priestsGold = 0;
            var serverTyp = 1;
            if (ikariam.Server() == 's202') serverTyp = 3;
            priestsGold = Math.floor(this._priests * Constant.GovernmentData[database.getGlobalData.getGovernmentType].goldBonusPerPriest);
            return this._citizens * 3 * serverTyp + priestsGold;
        },
        updateIncome: function (value) {
            /*  if(Math.abs(this._citizens - value / 3) > 2) {
      return this.updateCitizens((value / 3))
    }*/
            return false;
        },
        get getExpenses() {
            return -1 * this._research.getResearchCost;
        },
        updateExpenses: function (value) {
            return this._research.updateCost(Math.abs(value));
        },
        get getBuildings() {
            return this._buildings;
        },
        getBuildingsFromName: function (name) {
            var ret = [];
            var i = this._buildings.length;
            while (i--) {
                if (this._buildings[i].getName == name) ret.push(this._buildings[i]);
            }
            return ret;
        },
        getBuildingFromName: function (name) {
            var i = this._buildings.length;
            while (i--) {
                if (this._buildings[i].getName == name)
                    return this._buildings[i];
            }
            return null;
        },
        getBuildingFromPosition: function (position) {
            return this._buildings[position];
        },
        getWonder: function () {
            i = 7;//ikariam.wonder();
            return i;
        },
        get getTradeGood() {
            for (var resourceName in Constant.ResourceIDs) {
                if (this._tradeGoodID == Constant.ResourceIDs[resourceName]) {
                    return Constant.Resources[resourceName];
                }
            }
            return null;
        },
        get getTradeGoodID() {
            return this._tradeGoodID;
        },
        updateTradeGoodID: function (value) {
            var changed = this._tradeGoodID != value;
            if (changed) {
                this._tradeGoodID = value;
            }
            return changed;
        },
        updatePriests: function (priests) {
            var changed = this._priests != priests;
            this._priests = priests;
            return changed;
        },
        get getName() {
            return this._name;
        },
        updateName: function (value) {
            var changed = this._name != value;
            if (changed) {
                this._name = value;
            }
            return changed;
        },
        get getId() {
            return this._id;
        },
        get research() {
            return this._research;
        },
        updateResearchers: function (value) {
            return this._research.updateResearchers(value);
        },
        updateResearchCost: function (value) {
            return this._research.updateCost(value);
        },
        get garrisonland() {
            var i = 0, r = 0, t = 0;
            if (this.getBuildingFromName(Constant.Buildings.TOWN_HALL)) {
                i = this.getBuildingFromName(Constant.Buildings.TOWN_HALL).getLevel;
            }
            if (this.getBuildingFromName(Constant.Buildings.WALL)) {
                r = this.getBuildingFromName(Constant.Buildings.WALL).getLevel;
            }
            t = (i + r - 1) * 50 + 300;
            return t;
        },
        get garrisonsea() {
            var t = 0, n = 0, s = 0;
            if (this.getBuildingFromName(Constant.Buildings.TRADING_PORT)) { //todo
                t = this.getBuildingFromName(Constant.Buildings.TRADING_PORT).getLevel;
            }
            if (this.getBuildingFromName(Constant.Buildings.SHIPYARD)) {
                s = this.getBuildingFromName(Constant.Buildings.SHIPYARD).getLevel;
            }
            //n = t > t ? t : t > s ? t : s;
            n = t > s ? t : s;
            return n * 25 + 125;
        },
        get plundergold() {
            var i = 0;
            if (this.getBuildingFromName(Constant.Buildings.PALACE)) {
                i = Math.floor(this.getBuildingFromName(Constant.Buildings.TOWN_HALL).getLevel) * 950;
            } else
                if (database.getCityCount == 1)
                    i = Math.floor(this.getBuildingFromName(Constant.Buildings.TOWN_HALL).getLevel) * 950;
            return i;
        },
        get maxculturalgood() {
            var i = 0;
            if (this.getBuildingFromName(Constant.Buildings.MUSEUM)) {
                i = this.getBuildingFromName(Constant.Buildings.MUSEUM).getLevel;
            }
            return i;
        },
        get maxtavernlevel() {
            var i = 0;
            if (this.getBuildingFromName(Constant.Buildings.TAVERN)) {
                i = this.getBuildingFromName(Constant.Buildings.TAVERN).getLevel;
            }
            return i;
        },
        get tavernlevel() {
            var wineUse;
            var i;
            if (this.getBuildingFromName(Constant.Buildings.TAVERN)) {
                wineUse = Constant.BuildingData[Constant.Buildings.TAVERN].wineUse;
                if (ikariam.Server() == 's202')
                    wineUse = Constant.BuildingData[Constant.Buildings.TAVERN].wineUse2;
                var consumption = Math.floor(this.getResource(Constant.Resources.WINE).getConsumption * (100 / (100 - (this.getBuildingFromName(Constant.Buildings.VINEYARD) ? this.getBuildingFromName(Constant.Buildings.VINEYARD).getLevel : 0))));
                for (i = 0; i < wineUse.length; i++) {
                    if (Math.abs(wineUse[i] - consumption) <= 1) {
                        break;
                    }
                }
            }
            return i > 0 ? i : '';
        },
        get CorruptionCity() {
            var i = Math.max(0, 1 - ((this.getBuildingFromName(Constant.Buildings.GOVERNORS_RESIDENCE) ? this.getBuildingFromName(Constant.Buildings.GOVERNORS_RESIDENCE).getLevel : this.getBuildingFromName(Constant.Buildings.PALACE) ? this.getBuildingFromName(Constant.Buildings.PALACE).getLevel : 0) + 1) / database.getCityCount + Constant.GovernmentData[database.getGlobalData.getGovernmentType].corruption);
            var h = 0;
            if (this.getBuildingFromName(Constant.Buildings.GOVERNORS_RESIDENCE) && (this.getBuildingFromName(Constant.Buildings.GOVERNORS_RESIDENCE).getLevel / database.getCityCount != 1)) {
                h = Constant.GovernmentData[database.getGlobalData.getGovernmentType].governors;
            }
            return Math.floor(i * 100) + (h * 100);
        },
        get maxAP() {
            var i = 0;
            if (this.getBuildingFromName(Constant.Buildings.TOWN_HALL)) {
                i = this.getBuildingFromName(Constant.Buildings.TOWN_HALL).getLevel;
            }
            return Constant.BuildingData[Constant.Buildings.TOWN_HALL].actionPointsMax[i];
        },
        get maxSci() {
            //var i = 0;
            var i;
            if (this.getBuildingFromName(Constant.Buildings.ACADEMY)) {
                i = this.getBuildingFromName(Constant.Buildings.ACADEMY).getLevel;
            }
            return Constant.BuildingData[Constant.Buildings.ACADEMY].maxScientists[i] || '';
        },
        get iSci() {
            var i = '';
            if (this.getBuildingFromName(Constant.Buildings.ACADEMY)) {
                i = 0;
            }
            return i;
        },
        get storageCapacity() {
            return null;
        },
        get getAvailableActions() {
            return this._actionPoints;
        },
        updateActionPoints: function (value) {
            var changed = this._actionPoints != value;
            this._actionPoints = value;
            return changed;
        },
        get getCoordinates() {
            return (this._coordinates ? [this._coordinates.x, this._coordinates.y] : null);
        },
        updateCoordinates: function (x, y) {
            this._coordinates = { x: x, y: y };
            return false;
        },
        get getIslandID() {
            return this._islandID;
        },
        updateIslandID: function (id) {
            this._islandID = id;
            return false;
        },
        get getCulturalGoods() {
            return this._culturalGoods;
        },
        updateCulturalGoods: function (value) {
            var changed = this._culturalGoods !== value;
            if (changed) {
                this._culturalGoods = value;
            }
            return changed;
        },
        get getIncomingResources() {
            return database.getGlobalData.getResourceMovementsToCity(this.getId);
        },
        get getIncomingMilitary() {
            return database.getGlobalData.getMilitaryMovementsToCity(this.getId);
        },
        get _getMaxPopulation() {
            var mPop = 0;
            if (this.getBuildingFromName(Constant.Buildings.TOWN_HALL)) {
                mPop = Math.floor((10 * Math.pow(this.getBuildingFromName(Constant.Buildings.TOWN_HALL).getLevel, 1.5))) * 2 + 40;
            }
            if (database.getGlobalData.getResearchTopicLevel(Constant.Research.Science.WELL_CONSTRUCTION) && (this.getBuildingFromName(Constant.Buildings.PALACE) || database.getCityCount == 1)) {
                mPop += 50;
            }
            if (database.getGlobalData.getResearchTopicLevel(Constant.Research.Economy.UTOPIA) && this.getBuildingFromName(Constant.Buildings.PALACE)) {
                mPop += 200;
            }
            if (database.getGlobalData.getResearchTopicLevel(Constant.Research.Economy.HOLIDAY)) {
                mPop += 50;
            }
            mPop += database.getGlobalData.getResearchTopicLevel(Constant.Research.Economy.ECONOMIC_FUTURE) * 20;
            return mPop;
        },
        get military() {
            return this._military;
        },
        get getAvailableBuildings() {
            var p = 0;
            var i = 23 + database.getGlobalData.getResearchTopicLevel(Constant.Research.Economy.BUREACRACY) + database.getGlobalData.getResearchTopicLevel(Constant.Research.Seafaring.PIRACY);
            $.each(this.getBuildings, function (idx, building) {
                i -= !building.isEmpty;
            });
            if (database.settings.noPiracy.value && database.getGlobalData.getResearchTopicLevel(Constant.Research.Seafaring.PIRACY))
                p = 1;
            return i - p;
        },
        get maxResourceCapacities() {
            if (!this._capacities.invalid) {
                return this._capacities;
            }
            var lang = database.settings.languageChange.value;
            var ret = {};
            ret[Constant.Buildings.DUMP] = { storage: 0, safe: 0, lang: Constant.LanguageData[lang].dump };
            ret[Constant.Buildings.WAREHOUSE] = { storage: 0, safe: 0, lang: Constant.LanguageData[lang].warehouse };
            ret[Constant.Buildings.TOWN_HALL] = { storage: 2500, safe: 100, lang: Constant.LanguageData[lang].townHall };
            $.each(this.getBuildingsFromName(Constant.Buildings.WAREHOUSE), function (i, building) {
                ret[Constant.Buildings.WAREHOUSE].storage += Constant.BuildingData[Constant.Buildings.WAREHOUSE].capacity[building.getLevel-1];
                ret[Constant.Buildings.WAREHOUSE].safe += building.getLevel * 480;
            });
            $.each(this.getBuildingsFromName(Constant.Buildings.DUMP), function (i, building) {
                ret[Constant.Buildings.DUMP].storage += Constant.BuildingData[Constant.Buildings.DUMP].capacity[building.getLevel-1];
            });
            var capacity = 0;
            var safe = 0;
            for (var key in ret) {
                capacity += ret[key].storage;
                safe += ret[key].safe;
            }
            this._capacities = {
                capacity: capacity * (1 + (database.getGlobalData.hasPremiumFeature(Constant.Premium.STORAGECAPACITY_BONUS) * Constant.PremiumData[Constant.Premium.STORAGECAPACITY_BONUS].bonus)),
                safe: safe * (1 + (database.getGlobalData.hasPremiumFeature(Constant.Premium.SAFECAPACITY_BONUS) * Constant.PremiumData[Constant.Premium.SAFECAPACITY_BONUS].bonus)),
                buildings: ret
            };
            return this._capacities;
        },
        get _getSatisfactionData() {
            var r = {
                city: 196,
                museum: {
                    cultural: 0,
                    level: 0
                },
                government: 0,
                tavern: {
                    wineConsumption: 0,
                    level: 0
                },
                research: 0,
                priest: 0,
                total: 0
            };
            if (this.getBuildingFromName(Constant.Buildings.MUSEUM)) {
                var eventBonus = 0;  //Bonus für Serverwechsel/Merge
                r.museum.cultural = this.getCulturalGoods * 50 + eventBonus;
                r.museum.level = Constant.BuildingData[Constant.Buildings.MUSEUM].basicBonus[this.getBuildingFromName(Constant.Buildings.MUSEUM).getLevel];
            }
            r.government = Constant.GovernmentData[database.getGlobalData.getGovernmentType].happiness + (Constant.GovernmentData[database.getGlobalData.getGovernmentType].happinessWithoutTemple * (this.getBuildingFromName(Constant.Buildings.TEMPLE) == undefined)); //todo
            if (this.getBuildingFromName(Constant.Buildings.TAVERN)) {
                var wineUse;
                wineUse = Constant.BuildingData[Constant.Buildings.TAVERN].wineUse;
                if (ikariam.Server() == 's202')
                    wineUse = Constant.BuildingData[Constant.Buildings.TAVERN].wineUse2;
                r.tavern.level = Constant.BuildingData[Constant.Buildings.TAVERN].basicBonus[this.getBuildingFromName(Constant.Buildings.TAVERN).getLevel];
                var consumption = Math.floor(this.getResource(Constant.Resources.WINE).getConsumption * (100 / (100 - (this.getBuildingFromName(Constant.Buildings.VINEYARD) ? this.getBuildingFromName(Constant.Buildings.VINEYARD).getLevel : 0))));
                for (var i = 0; i < wineUse.length; i++) {
                    if (Math.abs(wineUse[i] - consumption) <= 1) {
                        r.tavern.wineConsumption = Constant.BuildingData[Constant.Buildings.TAVERN].wineBonus[i];
                        break;
                    }
                }
            }
            r.research = (database.getGlobalData.getResearchTopicLevel(2080) * 25) + (database.getGlobalData.getResearchTopicLevel(2999) * 10) + (this.getBuildingFromName(Constant.Buildings.PALACE) ? 50 * database.getGlobalData.getResearchTopicLevel(3010) : 0) + (this.getBuildingFromName(Constant.Buildings.PALACE) ? 200 * database.getGlobalData.getResearchTopicLevel(2120) : 0) + (database.getCityCount == 1 ? 50 * database.getGlobalData.getResearchTopicLevel(3010) : 0) - (this.getBuildingFromName(Constant.Buildings.PALACE) && database.getCityCount == 1 ? 50 * database.getGlobalData.getResearchTopicLevel(3010) : 0);
            r.priest = this._priests * 500 / this._getMaxPopulation * Constant.GovernmentData[database.getGlobalData.getGovernmentType].happinessBonusWithTempleConversion;
            r.priest = (r.priest <= 150 ? r.priest : 150);
            r.city = 196;
            var total = 0;
            for (var n in r) {
                if (typeof r[n] === 'object') {
                    for (var o in r[n]) {
                        total += r[n][o];
                    }
                } else {
                    total += r[n];
                }
            }
            r.total = total;
            r.corruption = Math.round(this._population + this._pop.happiness - total);
            return r;
        },
        updatePopulation: function (population) {
            var changed = this._population != population;
            this._population = population;
            this._lastPopUpdate = $.now();
            return changed;
        },
        updateCitizens: function (citizens) {
            var changed = this._citizens != citizens;
            this._citizens = citizens;
            this._lastPopUpdate = $.now();
            return changed;
        },
        projectPopData: function (untilTime) {
            var serverTyp = 1;
            if (ikariam.Server() == 's201' || ikariam.Server() == 's202') serverTyp = 3;
            var plus = this._getSatisfactionData;
            var maxPopulation = this._getMaxPopulation;
            var happiness = (1 - this.getCorruption) * plus.total - this._population;
            var hours = ((untilTime - this._lastPopUpdate) / 3600000);
            var pop = this._population + happiness * (1 - Math.pow(Math.E, -(hours / 50)));
            pop = (pop > maxPopulation) ? this._population > maxPopulation ? this._population : maxPopulation : pop;
            happiness = ((1 - this.getCorruption) * plus.total - pop);
            this._citizens = this._citizens + pop - this._population;
            this._population = pop;
            this._lastPopUpdate = untilTime;
            var old = $.extend({}, this._pop);
            this._pop = { currentPop: pop, maxPop: maxPopulation, satisfaction: plus, happiness: happiness, growth: happiness * 0.02 * serverTyp };
            if (Math.floor(old.currentPop) != Math.floor(this._pop.currentPop) || Math.floor(old.maxPop) != Math.floor(this._pop.maxPop) || Math.floor(old.happiness) != Math.floor(this._pop.happiness)) {
                events(Constant.Events.CITY_UPDATED).pub(this.getId, { population: true });
            }
        },
        get populationData() {
            return this._pop;
        },
        processUnitBuildList: function () {
            var newList = [];
            var j;
            for (var i = 0; i < this.unitBuildList.length; i++) {
                var list = this.unitBuildList[i];
                if (list.completionTime <= $.now()) {
                    for (var uID in list.units) {
                        j = this.army.length;
                    }
                    while (j) {
                        j--;
                        if (uID == this.army[j].id) {
                            this.army[uID] += list.units[uID];
                        }
                    }
                } else {
                    newList.push(list);
                }
            }
            this.unitBuildList = newList;
        },
        clearUnitBuildList: function (type) {
            var newList = [];
            if (type) {
                for (var i = 0; i < this.unitBuildList.length; i++) {
                    if (this.unitBuildList[i].type != type) {
                        newList.push(this.unitBuildList[i]);
                    }
                }
            }
            this.unitBuildList = newList;
        },
        getUnitBuildsByUnit: function () {
            var ret = {};
            for (var i = 0; i < this.unitBuildList.length; i++) {
                for (var uID in this.unitBuildList[i].units) {
                    ret[uID] = ret[uID] || [];
                    ret[uID].push({
                        count: this.unitBuildList[i].units[uID],
                        completionTime: this.unitBuildList[i].completionTime
                    });
                }
            }
            return ret;
        },
        getUnitTransportsByUnit: function () {
            var ret = {};
            var data = database.getGlobalData.militaryMovements[this.getId];
            if (data) {
                for (var row in data) {
                    for (var uID in data[row].troops) {
                        ret[uID] = ret[uID] || [];
                        ret[uID].push({
                            count: data[row].troops[uID],
                            arrivalTime: data[row].arrivalTime,
                            origin: data[row].originCityId
                        });
                    }
                }
            }
            return ret;
        },
        get isCapital() {
            return this.getBuildingFromName(Constant.Buildings.PALACE) !== null;
        },
        get isColony() {
            return this.getBuildingFromName(Constant.Buildings.PALACE) === null;
        },
        get isUpgrading() {
            var res = false;
            $.each(this.getBuildings, function (idx, building) {
                res = res || building.isUpgrading;
            });
            return res;
        }
    };
    function GlobalData() {
        this._version = {
            lastUpdateCheck: 0,
            latestVersion: null,
            installedVersion: 0
        };
        this._research = {
            topics: {},
            lastUpdate: 0
        };
        this.governmentType = 'Ikacracy';
        this.fleetMovements = [];
        this.militaryMovements = [];
        this.finance = {
            armyCost: 0,
            armySupply: 0,
            fleetCost: 0,
            fleetSupply: 0,
            currentGold: 0,
            sigmaExpenses: function () {
                return this.armyCost + this.armySupply + this.fleetCost + this.fleetSupply;
            },
            sigmaIncome: 0,
            lastUpdated: 0
        };
        this.localStrings = {};
        this.premium = {};
    }

    GlobalData.prototype = {
        init: function () {
            var lang = database.settings.languageChange.value;
            $.each(Constant.LanguageData[lang], this.addLocalisedString.bind(this));
            $.each(this.fleetMovements, function (key, movement) {
                this.fleetMovements[key] = new Movement(movement);
                this.fleetMovements[key]._updateTimer = null;
                this.fleetMovements[key].startUpdateTimer();
            }.bind(this));
        },
        hasPremiumFeature: function (feature) {
            return this.premium[feature] ? this.premium[feature].endTime > $.now() || this.premium[feature].continuous : false;
        },
        setPremiumFeature: function (feature, endTime, continuous) {
            var ret = !this.hasPremiumFeature(feature) && endTime > $.now();
            this.premium[feature] = { endTime: endTime, continuous: continuous };
            return ret;
        },
        getPremiumTimeRemaining: function (feature) {
            return this.premium[feature] ? this.premium[feature].endTime > $.now() : 0;
        },
        getPremiumTimeContinuous: function (feature) {
            return this.premium[feature] ? this.premium[feature].continuous : false;
        },
        removeFleetMovement: function (id) {
            var index = -1;
            $.each(this.fleetMovements, function (i, movement) {
                if (movement.getId == id) {
                    this.fleetMovements.splice(i, 1);
                    return false;
                }
            }.bind(this));
        },
        addFleetMovement: function (transport) {
            try {
                this.fleetMovements.push(transport);
                transport.startUpdateTimer();
                this.fleetMovements.sort(function (a, b) {
                    return a.getArrivalTime - b.getArrivalTime;
                });
                var changes = [];

                $.each(transport.getResources, function (resourceName, value) {
                    changes.push(resourceName);
                });
                return changes;
            } catch (e) {
                empire.error('addFleetMovement', e);
            }
        },
        getMovementById: function (id) {
            for (var i in this.fleetMovements) {
                if (this.fleetMovements[i].getId == id) {
                    return this.fleetMovements[i];
                }
            }
            return false;
        },
        clearFleetMovements: function () {
            var changes = [];
            $.each(this.fleetMovements, function (index, item) {
                changes.push(item.getTargetCityId);
                item.clearUpdateTimer();
            });
            this.fleetMovements.length = 0;
            return $.exclusive(changes);
        },
        getResourceMovementsToCity: function (cityID) {
            return this.fleetMovements.filter(function (el) {
                if (el.getTargetCityId == cityID) {
                    return (el.getMission == 'trade' || el.getMission == 'transport' || el.getMission == 'plunder');
                }
            });
        },
        getMilitaryMovementsToCity: function (cityID) {
            return this.fleetMovements.filter(function (el) {
                if (el.getOriginCityId == cityID) {
                    return (el.getMission != 'trade' && el.getMission != 'transport' && el.getMission == 'plunder' && el.getMission == 'deploy');
                }
            });
        },
        getResearchTopicLevel: function (research) {
            return this._research.topics[research] || 0;
        },
        updateResearchTopic: function (topic, level) {
            var changed = this.getResearchTopicLevel(topic) != level;
            this._research.topics[topic] = level;
            return changed;
        },
        get getGovernmentType() {
            return this.governmentType;
        },
        getLocalisedString: function (string) {
            var lString;
            lString = this.localStrings[string.replace(/([A-Z])/g, "_$1").toLowerCase()];
            if (lString == undefined)
                lString = this.localStrings[string.toLowerCase().split(' ').join('_')];
            return (lString == undefined) ? string : lString;
        },
        addLocalisedString: function (string, value) {
            if (this.getLocalisedString(string) == string)
                this.localStrings[string.toLowerCase().split(' ').join('_')] = value;
        },
        isOldVersion: function () {
            return this._version.latestVersion < this._version.installedVersion;
        }
    };
    function Setting(name) {
        this._name = name;
        this._value = null;
    }
    Setting.prototype = {
        get name() {
            return database.getGlobalData.getLocalisedString(this._name);
        },
        get type() {
            return Constant.SettingData[this._name].type;
        },
        get description() {
            return database.getGlobalData.getLocalisedString(this._name + '_description');
        },
        get value() {
            return (this._value !== null ? this._value : Constant.SettingData[this._name].default);
        },
        get categories() {
            return Constant.SettingData[this._name].categories;
        },
        get choices() {
            return Constant.SettingData[this._name].choices || false;
        },
        get selection() {
            return Constant.SettingData[this._name].selection || false;
        },
        set value(value) {
            if (this.type === 'boolean') {
                this._value = !!value;
            }
            else if (this.type === 'number') {
                if (!isNaN(value)) {
                    this._value = value;
                }
            }
            else if (this.type === 'buildings') {
                if (!isNaN(value)) {
                    this._value = value;
                }
            }
            else if (this.type === 'language') {
                this._value = value;
            }
            else if (this.type === 'array' || this.type === 'orderedList') {
                if (Object.prototype.toString.call(value) === '[object Array]') {
                    this._value = value;
                }
            }
        },
        toJSON: function () {
            return { value: this._value };
        }
    };
    /***********************************************************************************************************************
 * empire
 **********************************************************************************************************************/
    var accountName = document.querySelector(".avatarName > a.noViewParameters").title;

    const EMPIRE_STORAGE_PREFIX = [
        '', accountName, ''].join('***');
    var empire = {
        version: 1.1831,
        scriptId: 764,
        scriptName: 'Empire Overview',
        logger: null,
        loaded: false,
        setVar: function (varname, varvalue) {
            localStorage.setItem(EMPIRE_STORAGE_PREFIX + varname, varvalue);
            //GM_setValue(EMPIRE_STORAGE_PREFIX + varname, varvalue);
        },
        deleteVar: function (varname) {
            localStorage.removeItem(EMPIRE_STORAGE_PREFIX + varname);
            //GM_deleteValue(EMPIRE_STORAGE_PREFIX + varname);
        },
        getVar: function (varname, vardefault) {
            var ret = localStorage.getItem(EMPIRE_STORAGE_PREFIX + varname);

            //var ret = GM_getValue(EMPIRE_STORAGE_PREFIX + varname);
            if (null === ret && 'undefined' != typeof vardefault) {
                return vardefault;
            }
            return ret;
        },
        log: function (val) {
            if (debug) console.log('empire: ', $.makeArray(arguments));
            if (log) {
                if (this.logger) {
                    this.logger.val(val + '\n' + this.logger.val());
                    return true;
                } else {
                    render.$tabs.append($(document.createElement("div")).attr('id', 'empire_Log'));
                    $('#empire_Log').html('<div><textarea id="empire_Logbox" rows="20" cols="120"></textarea></div>');
                    $('<li><a href="#empire_Log"><img class="ui-icon ui-icon-info"/></a></li>').appendTo("#empire_Tabs .ui-tabs-nav");
                    render.$tabs.tabs('refresh');
                    this.logger = $('#empire_Logbox');
                    return this.log(val);
                }
            }
        },
        error: function (func, e) {
            this.log('****** Error raised in ' + func + ' ******');
            this.log(e.name + ' : ' + e.message);
            this.log(e.stack);
            this.log('****** End ******');
            if (debug) {
                console.error('****** Error raised in ' + func + ' ******');
                console.error(e.name + ' : ' + e.message);
                console.error(e.stack);
                console.error('****** End ******');
            }
        },
        time: function (func, name) {
            if (timing) console.time(name);
            var ret = func();
            if (timing) console.timeEnd(name);
            return ret;
        },
        Init: function () {
            ikariam.Init();
            render.Init();
            database.Init(ikariam.Host());
            //this.CheckForUpdates(false);
            // GM_registerMenuCommand(this.scriptName + 'Manual Update', function () {
            //     empire.CheckForUpdates(true);
            // });

        },

        CheckForUpdates: function (forced) {
            var lang = database.settings.languageChange.value;
            if ((forced) || ((database.getGlobalData.LastUpdateCheck + 86400000 <= $.now()) && database.settings.autoUpdates.value)) {
                try {
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: 'https://greasyfork.org/scripts/' + empire.scriptId + '-empire-overview/code/Empire_Overview.meta.js', // + $.now(),
                        headers: { 'Cache-Control': 'no-cache' },
                        onload: function (resp) {
                            var remote_version, rt;
                            rt = resp.responseText;
                            database.getGlobalData.LastUpdateCheck = $.now();
                            remote_version = parseFloat(/@version\s*(.*?)\s*$/m.exec(rt)[1]);
                            if (empire.version != -1) {
                                if (remote_version > empire.version) {
                                    if (confirm(Constant.LanguageData[lang].alert_update + empire.scriptName + '". \n' + Constant.LanguageData[lang].alert_update1)) {
                                        // if(confirm(Utils.format(Constant.LanguageData[lang].alert_update,[empire.scriptName]))) {
                                        GM_openInTab('https://greasyfork.org/scripts/' + empire.scriptId + '-empire-overview');
                                    }
                                } else if (forced)
                                    render.toast(Constant.LanguageData[lang].alert_noUpdate + empire.scriptName + '".');
                                // render.toast(Utils.format(Constant.LanguageData[lang].alert_noUpdate,[empire.scriptName]));
                            }
                            database.getGlobalData.latestVersion = remote_version;
                        }
                    });
                } catch (err) {
                    if (forced)
                        render.toast(Constant.LanguageData[lang].alert_error + '\n' + err);
                }
            }
        },

        HardReset: function () {
            var lang = database.settings.languageChange.value;
            database = {};
            empire.deleteVar("settings");
            empire.deleteVar("Options");
            empire.deleteVar("options");
            empire.deleteVar("cities");
            empire.deleteVar("LocalStrings");
            empire.deleteVar("globalData");
            render.toast(Constant.LanguageData[lang].alert_toast);
            setTimeout(function () {
                document.location = document.getElementById('js_cityLink').children[0].href;
            }, 3500);
        },

        CheckAll: function () {
            database.settings.hideOnWorldView.value = true;
            database.settings.hideOnIslandView.value = true;
            database.settings.compressedBuildingList.value = true;
            database.settings.dailyBonus.value = true;
            database.settings.wineWarning.value = true;
            database.settings.onTop.value = true;
            database.settings.windowTennis.value = true;
            database.settings.GoldShort.value = true;
            database.settings.newsTicker.value = true;
            database.settings.event.value = true;
            database.settings.birdSwarm.value = true;
            database.settings.walkers.value = true;
            database.settings.noPiracy.value = true;
            database.settings.logInPopup.value = true;
            database.settings.controlCenter.value = true;
            database.settings.withoutFable.value = true;
            database.settings.ambrosiaPay.value = true;
            database.settings.wineWarningTime.value = 96;
            document.location = document.getElementById('js_cityLink').children[0].href;
        },

        Check: function () {
            database.settings.hideOnWorldView.value = true;
            database.settings.hideOnIslandView.value = true;
            database.settings.compressedBuildingList.value = true;
            database.settings.dailyBonus.value = true;
            database.settings.wineWarning.value = true;
            database.settings.onTop.value = true;
            database.settings.windowTennis.value = true;
            database.settings.GoldShort.value = false;
            database.settings.newsTicker.value = false;
            database.settings.event.value = false;
            database.settings.birdSwarm.value = true;
            database.settings.walkers.value = true;
            database.settings.noPiracy.value = false;
            database.settings.logInPopup.value = true;
            database.settings.controlCenter.value = true;
            database.settings.withoutFable.value = false;
            database.settings.ambrosiaPay.value = true;
            database.settings.wineWarningTime.value = 96;
            document.location = document.getElementById('js_cityLink').children[0].href;
        }
    };
    /***********************************************************************************************************************
 * database
 **********************************************************************************************************************/
    var database = {
        _globalData: new GlobalData(),
        cities: {},
        settings: {
            version: empire.version,
            window: {
                left: 110,
                top: 200,
                activeTab: 0,
                visible: true
            },
            addOptions: function (objVals) {
                return $.mergeValues(this, objVals);
            }
        },
        Init: function (host) {
            $.each(Constant.Settings, function (key, value) {
                this.settings[value] = new Setting(value);
            }.bind(database));
            var prefix = host;
            prefix = prefix.replace('.ikariam.', '-');
            prefix = prefix.replace('.', '-');
            this.Prefix = prefix;
            this.Load();
            events(Constant.Events.LOCAL_STRINGS_AVAILABLE).sub(ikariam.getLocalizationStrings.bind(this));
            $(window).on("beforeunload", function () {
                setTimeout(function () {
                    database.Save();
                }, 0);
            });
        },
        addCity: function (id, a) {
            if (a) {
                return $.mergeValues(new City(id), a);
            } else return new City(id);
        },
        get getBuildingCounts() {
            var buildingCounts = {};
            $.each(this.cities, function (cityId, city) {
                $.each(Constant.Buildings, function (key, value) {
                    if (database.settings.alternativeBuildingList.value && (value === '')) {
                    } else if (database.settings.compressedBuildingList.value && (value == Constant.Buildings.STONEMASON || value == Constant.Buildings.WINERY || value == Constant.Buildings.ALCHEMISTS_TOWER || value == Constant.Buildings.GLASSBLOWER)) {
                        buildingCounts.productionBuilding = Math.max(buildingCounts.productionBuilding || 0, city.getBuildingsFromName(value).length);
                    } else if (database.settings.compressedBuildingList.value && (value == Constant.Buildings.GOVERNORS_RESIDENCE || value == Constant.Buildings.PALACE)) {
                        buildingCounts.colonyBuilding = Math.max(buildingCounts.colonyBuilding || 0, city.getBuildingsFromName(value).length);
                    } else {
                        buildingCounts[value] = Math.max(buildingCounts[value] || 0, city.getBuildingsFromName(value).length);
                    }
                });
            });
            return buildingCounts;
        },
        startMonitoringChanges: function () {
            events(Constant.Events.BUILDINGS_UPDATED).sub(this.Save.bind(this));
            events(Constant.Events.GLOBAL_UPDATED).sub(this.Save.bind(this));
            events(Constant.Events.MOVEMENTS_UPDATED).sub(this.Save.bind(this));
            events(Constant.Events.RESOURCES_UPDATED).sub(this.Save.bind(this));
            events(Constant.Events.MILITARY_UPDATED).sub(this.Save.bind(this));
            events(Constant.Events.PREMIUM_UPDATED).sub(this.Save.bind(this));
        },
        Load: function () {
            var settings = this.UnSerialize(empire.getVar("settings", ""));
            if (typeof settings === 'object') {
                if (!this.isDatabaseOutdated(settings.version)) {

                    $.mergeValues(this.settings, settings);

                    var globalData = this.UnSerialize(empire.getVar("globalData", ""));
                    if (globalData.governmentType === '') globalData.governmentType = 'Ikacracy';
                    if (typeof globalData == 'object') {
                        $.mergeValues(this._globalData, globalData);

                    }
                    var cities = this.UnSerialize(empire.getVar("cities", ""));
                    if (typeof cities == 'object') {
                        for (var cityID in cities) {
                            (this.cities[cityID] = this.addCity(cities[cityID]._id, cities[cityID])).init();
                        }
                    }
                }
                this._globalData.init();
            }
            events(Constant.Events.DATABASE_LOADED).pub();
        },
        Serialize: function (data) {
            var ret;
            if (data)
                try {
                    ret = JSON.stringify(data);
                } catch (e) {
                    empire.log('error saving');
                }
            return ret || undefined;
        },
        UnSerialize: function (data) {
            var ret;
            if (data)
                try {
                    ret = JSON.parse(data);
                } catch (e) {
                    empire.log('error loading');
                }
            return ret || undefined;
        },
        Save: function () {
            events.scheduleAction(function () {
                empire.setVar("cities", database.Serialize(database.cities));
                empire.setVar("settings", database.Serialize(database.settings));
                empire.setVar("globalData", database.Serialize(database._globalData));
            });

        },
        get getGlobalData() {
            return this._globalData;
        },
        isDatabaseOutdated: function (version) {
            return 1.166 > (version || 0);
        },
        getCityFromId: function (id) {
            return this.cities[id] || null;
        },
        get getArmyTotals() {
            if (!this._armyTotals) {
                this._armyTotals = Utils.cacheFunction(this._getArmyTotals.bind(database), 1000);
            }
            return this._armyTotals();
        },
        _getArmyTotals: function () {
            var totals = {};
            $.each(Constant.UnitData, function (unitId, info) {
                totals[unitId] = { training: 0, total: 0, incoming: 0, plunder: 0 };
            });
            $.each(this.cities, function (cityId, city) {
                var train = city.military.getTrainingTotals;
                var incoming = city.military.getIncomingTotals;
                var total = city.military.getUnits.totals;
                $.each(Constant.UnitData, function (unitId, info) {
                    totals[unitId].training += train[unitId] || 0;
                    totals[unitId].total += total[unitId] || 0;
                    totals[unitId].incoming += incoming[unitId] || 0;
                    // totals[unitId].plunder += plunder[unitId] || 0;
                });
            });
            return totals;
        },
        get getCityCount() {
            return Object.keys(this.cities).length;
        },
        _getArmyTrainingTotals: function () {
        }
    };
    /***********************************************************************************************************************
 * render view
 **********************************************************************************************************************/

    var render = {
        mainContentBox: null,
        $tabs: null,
        cityRows: {
            building: {},
            resource: {},
            army: {}
        },
        _cssResLoaded: false,
        toolTip: {
            elem: null,
            timer: null,
            hide: function () {
                render.toolTip.elem.parent().hide();
            },
            show: function () {
                render.toolTip.elem.parent().show();
            },

            mouseOver: function (event) {
                if (render.toolTip.timer) {
                    render.toolTip.timer();
                }
                var f = function (shiftKey) {
                    return function () {
                        var elem;
                        elem = $(event.target).attr('data-tooltip') ? event.target : $(event.target).parents('[data-tooltip]');

                        render.toolTip.elem.html(render.toolTip.dynamicTip($(event.target).parents('tr').attr('id') ? $(event.target).parents('tr').attr('id').split('_').pop() : 0, elem));
                        return render.toolTip.elem.html();
                    };
                }(event.originalEvent.shiftKey);
                if (f(event.originalEvent.shiftKey)) {
                    render.toolTip.show();
                    render.toolTip.timer = events.scheduleActionAtInterval(f, 1000);
                }
            },
            mouseMove: function (event) {
                if (render.toolTip.timer && render.toolTip.elem) {
                    var l = parseInt(render.mainContentBox.css('left').split('px')[0]);
                    var t = parseInt(render.mainContentBox.css('top').split('px')[0]);
                    var x = event.pageX - 15 - l;
                    var y = event.pageY + 20 - t;

                    if (render.mainContentBox.height() - render.toolTip.elem.height() < y) {
                        y = event.pageY - render.toolTip.elem.height() - 15 - t;
                    }
                    if (render.mainContentBox.width() - render.toolTip.elem.width() < x) {
                        x = event.pageX - render.toolTip.elem.width() + 15 - l;
                    }
                    render.toolTip.elem.parent().css({
                        left: (x) + 'px',
                        top: (y) + 'px'
                    });
                }
            },
            mouseOut: function (event) {
                if (render.toolTip.timer) {
                    render.toolTip.timer();
                    render.toolTip.timer = null;
                }
                render.toolTip.hide();
            },
            init: function () {
                render.toolTip.elem = render.mainContentBox.append($('<div id="empireTip" style="z-index: 999999999;"><div class="content"></div></div>')).find('div.content');
                render.mainContentBox.on('mouseover', '[data-tooltip]', render.toolTip.mouseOver).on('mousemove', '[data-tooltip]', render.toolTip.mouseMove).on('mouseout', '[data-tooltip]', render.toolTip.mouseOut);
            },

            dynamicTip: function (id, elem) {
                var lang = database.settings.languageChange.value;
                var $elem = $(elem);
                var tiptype;
                if ($elem.attr('data-tooltip') === "dynamic") {
                    tiptype = $elem.attr('class').split(" ");
                } else {
                    return $elem.attr('data-tooltip') || '';
                }
                var city = database.getCityFromId(id);
                var resourceName;
                if (city) {
                    resourceName = $elem.is('td') ? $elem.attr('class').split(' ').pop() : $elem.parent('td').attr('class').split(' ').pop();
                }
                var total;
                switch (tiptype.shift()) {
                    case "incoming":
                        return getIncomingTip();
                        break;
                    case "current":
                        return '';
                        break;
                    case "progressbar":
                        if (resourceName !== Constant.Resources.GOLD)
                            return getProgressTip();
                        break;
                    case "total":
                        switch ($elem.attr('id').split('_').pop()) {
                            case "sigma":
                                return getResourceTotalTip();
                                break;
                            case "goldincome":
                                return getGoldIncomeTip();
                                break;
                            case "research":
                                var researchDat;
                                $.each(database.cities, function (cityId, city) {
                                    if (researchDat) {
                                        $.each(city.research.researchData, function (key, value) {
                                            researchDat[key] += value;
                                        });
                                    }
                                    else researchDat = $.extend({}, city.research.researchData);
                                });
                                return getResearchTip(researchDat);
                                break;
                            case "army":
                                return "soon";
                                break;
                            case "wineincome":
                                total = 0;
                                var consumption = 0;
                                resourceName = $elem.attr('id').split('_').pop().split('income').shift();
                                $.each(database.cities, function (cityId, c) {
                                    total += c.getResource(resourceName).getProduction;
                                    consumption += c.getResource(resourceName).getConsumption;
                                });
                                return getProductionConsumptionSubSumTip(total * 3600, consumption, true);
                                break;
                            default:
                                total = 0;
                                resourceName = $elem.attr('id').split('_').pop().split('income').shift();
                                $.each(database.cities, function (cityId, c) {
                                    total += c.getResource(resourceName).getProduction;
                                });
                                return getProductionTip(total * 3600);
                                break;
                        }
                    case "pop":
                        return getPopulationTip();
                        break;
                    case "happy":
                        return getGrowthTip();
                        break;
                    case "garrisonlimit":
                        return getActionPointsTip();
                        break;
                    case "wonder":
                        return city.getBuildingFromName(Constant.Buildings.TEMPLE) ? getWonderTip() : getNoWonderTip();
                        break;
                    case "prodconssubsum consumption Red":
                        return getFinanceTip();
                        break;
                    case "scientists":
                        return getResearchTip();
                        break;
                    case "prodconssubsum":
                        return resourceName === Constant.Resources.GOLD ? getFinanceTip() : getProductionConsumptionSubSumTip(city.getResource(resourceName).getProduction * 3600, city.getResource(resourceName).getConsumption);
                        break;
                    case "building":
                        var bName = tiptype.shift();
                        var index = parseInt(bName.slice(-1));
                        bName = bName.slice(0, -1);
                        return getBuildingTooltip(city.getBuildingsFromName(bName)[index]);
                    case "army":
                        switch (tiptype.shift()) {
                            case "unit":
                                return '';
                                break;
                            case "movement":
                                return getArmyMovementTip(tiptype.pop());
                                break;
                            case "incoming":
                                return getIncomeMovementTip(tiptype.pop());
                                break;
                                /*   case "plunder":
          return getPlunderMovementTip(tiptype.pop());
          break	*/
                        }
                        break;
                    default:
                        return "";
                        break;
                }

                function getGoldIncomeTip() {
                    var researchCost = 0;
                    var income = 0;
                    var sigmaIncome = 0;
                    $.each(database.cities, function (cityID, city) {
                        researchCost += Math.floor(city.getExpenses);
                        income += Math.floor(city.getIncome);
                    });
                    var expense = database.getGlobalData.finance.armyCost + database.getGlobalData.finance.armySupply + database.getGlobalData.finance.fleetCost + database.getGlobalData.finance.fleetSupply - researchCost;
                    sigmaIncome = income - expense;
                    return '<table>\n    <thead>\n    <th><div align="center">\n <img src="cdn/all/both/resources/icon_upkeep.png" style="height: 14px;"></td><td><b>1 ' + Constant.LanguageData[lang].hour + '</b></td><td><b>1 ' + Constant.LanguageData[lang].day + '</b></td><td><b> 1 ' + Constant.LanguageData[lang].week + '</b></div><td></td></th>\n    </thead>\n    <tbody>\n    <tr class="data">\n        <td><b>-&nbsp;</b></td>\n        <td> ' + Utils.FormatNumToStr(database.getGlobalData.finance.armyCost, false, 0) + ' </td>\n        <td> ' + Utils.FormatNumToStr(database.getGlobalData.finance.armyCost * 24, false, 0) + '</td>\n        <td> ' + Utils.FormatNumToStr(database.getGlobalData.finance.armyCost * 24 * 7, false, 0) + '</td>\n        <td class="left"><i>« ' + Constant.LanguageData[lang].army_cost + '</i></td>\n    </tr>\n    <tr class="data">\n        <td><b>-&nbsp;</b></td>\n        <td class="nolf"> ' + Utils.FormatNumToStr(database.getGlobalData.finance.fleetCost, false, 0) + '</td>\n        <td>' + Utils.FormatNumToStr(database.getGlobalData.finance.fleetCost * 24, false, 0) + '</td>\n        <td>' + Utils.FormatNumToStr(database.getGlobalData.finance.fleetCost * 24 * 7, false, 0) + '</td>\n        <td class="left"><i>« ' + Constant.LanguageData[lang].fleet_cost + '</i></td>\n    </tr>\n    <tr class="data">\n        <td><b>-&nbsp;</b></td>\n        <td class="nolf">' + Utils.FormatNumToStr(database.getGlobalData.finance.armySupply, false, 0) + '</td>\n        <td>' + Utils.FormatNumToStr(database.getGlobalData.finance.armySupply * 24, false, 0) + '</td>\n        <td>' + Utils.FormatNumToStr(database.getGlobalData.finance.armySupply * 24 * 7, false, 0) + '</td>\n        <td class="left"><i>« ' + Constant.LanguageData[lang].army_supply + '</i></td>\n    </tr>\n    <tr class="data">\n        <td><b>-&nbsp;</b></td>\n        <td class="nolf">' + Utils.FormatNumToStr(database.getGlobalData.finance.fleetSupply, false, 0) + '</td>\n        <td>' + Utils.FormatNumToStr(database.getGlobalData.finance.fleetSupply * 24, false, 0) + '</td>\n        <td>' + Utils.FormatNumToStr(database.getGlobalData.finance.fleetSupply * 24 * 7, false, 0) + '</td>\n        <td class="left"><i>« ' + Constant.LanguageData[lang].fleet_supply + '</i></td>\n    </tr>\n    <tr class="data">\n        <td><b>-&nbsp;</b></td>\n        <td class="nolf">' + Utils.FormatNumToStr(researchCost, false, 0) + '</td>\n        <td>' + Utils.FormatNumToStr(researchCost * 24, false, 0) + '</td>\n        <td>' + Utils.FormatNumToStr(researchCost * 24 * 7, false, 0) + '</td>\n        <td class="left"><i>« ' + Constant.LanguageData[lang].research_cost + '</i></td>\n    </tr>\n    <tr style="border-top:1px solid #FFE4B5">\n        <td><b>+&nbsp;</b></td>\n        <td class="nolf">' + Utils.FormatNumToStr(income, false, 0) + '</td>\n        <td>' + Utils.FormatNumToStr(income * 24, false, 0) + '</td>\n        <td>' + Utils.FormatNumToStr(income * 7 * 24, false, 0) + '</td>\n        <td class="left"><i>« ' + Constant.LanguageData[lang].income + '</i></td>\n    </tr>\n    <tr>\n        <td><b>-&nbsp;</b></td>\n        <td class="nolf">' + Utils.FormatNumToStr(expense, false, 0) + '</td>\n        <td class="left">' + Utils.FormatNumToStr(expense * 24, false, 0) + '</td>\n        <td>' + Utils.FormatNumToStr(expense * 24 * 7, false, 0) + '</td>\n        <td><i>« ' + Constant.LanguageData[lang].expenses + '</i></td></tbody><tfoot>\n    </tr>\n    <tr  class="total">\n        <td><b>Σ ' + ((sigmaIncome > 0) ? '+&nbsp;' : '-&nbsp;') + '</b></td>\n        <td>' + Utils.FormatNumToStr((sigmaIncome), false, 0) + '</td>\n        <td>' + Utils.FormatNumToStr((sigmaIncome) * 24, false, 0) + '</td>\n        <td>' + Utils.FormatNumToStr((sigmaIncome) * 7 * 24, false, 0) + '</td>\n        <td><i>« ' + Constant.LanguageData[lang].balances + '</i></td>\n    </tr>\n    </tfoot>\n</table>';
                }
                function getArmyMovementTip(unit) {
                    var total = 0;
                    var table = '<table>\n    <thead>\n        <th colspan="3"><div align="center"><img src="{0}" style="height: 18px; float: left"></td>\n        <b>' + Constant.LanguageData[lang].training + '</b></div></th>\n        \n    </thead>\n    <tbody>\n{1}\n    </tbody><tfoot><tr class="small">\n        <td><b>Σ +</b></td>\n        <td>{2}</td>\n        <td class="left"><i>« ' + Constant.LanguageData[lang].total_ + '</i></td>\n    </tr>\n    </tfoot>\n</table>';
                    var rows = '';
                    $.each(city.military.getTrainingForUnit(unit), function (index, data) {
                        rows += Utils.format('<tr class="data">\n    <td><b>+</b></td>\n    <td >{0}</td>\n    <td ><i>« {1}</i></td>\n</tr>', [data.count, Utils.FormatTimeLengthToStr(data.time - $.now(), 3)]);
                        total += data.count;
                    });

                    if (rows === '') {
                        return '';
                    } else {
                        return Utils.format(table, [getImage(unit), rows, total]);
                    }
                }
                function getPopulationTip() {
                    var populationData = city.populationData;
                    var popDiff = populationData.maxPop - populationData.currentPop;
                    var Tip = '';
                    if (popDiff !== 0) {
                        Tip = '<tr class="data"><tfoot>&nbsp;' + Utils.FormatTimeLengthToStr((popDiff) / populationData.growth * 3600000, 4) + '<td> « ' + Constant.LanguageData[lang].time_to_full + '</td>\n    </tr>\n</tfoot>';
                    }
                    var populationTip = '<table>\n    <thead>\n    <th colspan="2"><div align="center">\n <img src="cdn/all/both/resources/icon_population.png" style="height: 15px; float: left"><b>{0}</b></div></th>\n    </thead>\n    <tbody>\n ' +
                        '<tr class="data">\n        <td>{1}</td>\n        <td>« {5}</td>\n    </tr>\n' +
                        '<tr class="data">\n        <td>{2}</td>\n        <td>« {0}</td>\n    </tr>\n' +
                        '<tr class="data">\n        <td>{3}</td>\n        <td>« {6}</td>\n    </tr>\n' +
                        '<tr class="data">\n        <td>{4}</td>\n        <td>« {7}</td>\n    </tr></tbody>\n </table>{8}';
                    return Utils.format(populationTip, [Constant.LanguageData[lang].citizens, Utils.FormatNumToStr(populationData.maxPop, false, 0), Utils.FormatNumToStr(populationData.currentPop, false, 0), Utils.FormatNumToStr(city._citizens, false, 0), ((popDiff === 0) ? Constant.LanguageData[lang].full : Utils.FormatNumToStr(popDiff, false, 2)), Constant.LanguageData[lang].housing_space, Constant.LanguageData[lang].free_housing_space, Constant.LanguageData[lang].free_Citizens, Tip]);
                }
                function getGrowthTip() {
                    var lang = database.settings.languageChange.value;
                    var populationData = city.populationData;
                    var popDiff = populationData.maxPop - populationData.currentPop;
                    var Icon = populationData.happiness >= 0 ? 'cdn/all/both/icons/growth_positive.png' : 'cdn/all/both/icons/growth_negative.png';
                    var Tip = '';
                    if (popDiff > 0) {
                        Tip = '<table>\n    <thead>\n    <th><div align="center">\n <img src="' + Icon + '" style="height: 14px;"></td><td><b>1 ' + Constant.LanguageData[lang].hour + '</b></td><td><b>1 ' + Constant.LanguageData[lang].day + '</b></td><td><b> 1 ' + Constant.LanguageData[lang].week + '</b></div><td></td></th>\n    </thead>\n    <tbody>\n <tr><td><b>' + ((populationData.growth > 0) ? '+' : '-') + '</b></td><td>' + ((popDiff === 0) ? '0' + Constant.LanguageData[lang].decimalPoint + '00' : Utils.FormatNumToStr(populationData.growth, false, 2)) + '</td><td>' + ((popDiff === 0) ? '0' + Constant.LanguageData[lang].decimalPoint + '00' : (populationData.growth * 24 > popDiff) ? Utils.FormatNumToStr(popDiff, false, 2) : Utils.FormatNumToStr(populationData.growth * 24, false, 2)) + '</td><td><i>' + ((popDiff === 0) ? '0' + Constant.LanguageData[lang].decimalPoint + '00' : (populationData.growth * 24 * 7 > popDiff) ? Utils.FormatNumToStr(popDiff, false, 2) : Utils.FormatNumToStr(populationData.growth * 24 * 7, false, 2)) + '</i></td><td></td></tr></tbody></table>';
                    }
                    var corruption = '<td>' + city.CorruptionCity + '';
                    if (city.CorruptionCity > 0) {
                        corruption = '<td class="red">' + city.CorruptionCity + '';
                    }
                    var sat = '';
                    var img = '';
                    if (populationData.growth < -1) {
                        img = 'outraged';
                        sat = Constant.LanguageData[lang].angry;
                    } else if (populationData.growth < 0) {
                        img = 'sad';
                        sat = Constant.LanguageData[lang].unhappy;
                    } else if (populationData.growth < 1) {
                        img = 'neutral';
                        sat = Constant.LanguageData[lang].neutral;
                    } else if (populationData.growth < 6) {
                        img = 'happy';
                        sat = Constant.LanguageData[lang].happy;
                    } else {
                        img = 'ecstatic';
                        sat = Constant.LanguageData[lang].euphoric;
                    }
                    var growthTip = '<table>\n    <thead>\n    <th colspan="2"><div align="center">\n <img src="cdn/all/both/smilies/' + img + '_x25.png" style="height: 18px; float: left"><b>{0}</b></div></th>\n    </thead>\n    <tbody>\n ' +
                        '<tr class="data">\n        <td>{1}</td>\n        <td>« {2}</td>\n    </tr>\n' +
                        '<tr class="data">\n            {3}</td>\n        <td>« {4}</td>\n    </tr>\n' +
                        '<tr class="data">\n        <td>{5}</td>\n        <td>« {6}</td>\n    </tr>\n' +
                        '<tr class="data">\n        <td>{7}</td>\n        <td>« {8}</td>\n    </tr></tbody>\n  </table> {9}';
                    return Utils.format(growthTip, [Constant.LanguageData[lang].satisfaction, Utils.FormatNumToStr(populationData.happiness, true, 0), sat, corruption + '%', Constant.LanguageData[lang].corruption, Math.floor(city._culturalGoods) + '/' + Math.floor(city.maxculturalgood), Constant.LanguageData[lang].cultural, Math.floor(city.tavernlevel) + '/' + Math.floor(city.maxtavernlevel), Constant.LanguageData[lang].level_tavern, Tip]);
                }
                function getActionPointsTip() {
                    var garrisonTip = '<table>\n    <thead>\n    <th colspan="3"><div align="center">\n <b>{0}</b></div></th>\n    </thead>\n    <tbody>\n ' +
                        '<tr class="data">\n        <td>{1}</td>\n        <td>{2}</td>\n        <td>« {3}</td>\n    </tr>\n' +
                        '<tr class="data">\n        <td>{4}</td>\n        <td>{5}</td>\n        <td>« {6}</td>\n    </tr>\n</tfoot></table>';
                    return Utils.format(garrisonTip, [Constant.LanguageData[lang].garrision, '<img src="cdn/all/both/advisors/military/bang_soldier.png" style="height: 15px;">', city.garrisonland, Constant.LanguageData[lang].Inland, '<img src="cdn/all/both/advisors/military/bang_ship.png" style="height: 15px;">', city.garrisonsea, Constant.LanguageData[lang].Sea]);
                }
                function getWonderTip() {
                    var populationData = city.populationData;
                    var wonderTip = '<table>\n    <thead>\n    <th colspan="3"><div align="center">\n <img src="cdn/all/both/wonder/w{0}.png" style="height: 25px; float: left">{1}</div></th>\n    </thead>\n    <tbody>\n ' +
                        '<tr class="data">\n        <td>{2}</td>\n        <td>« {3}</td>\n    </tr>\n' +
                        '<tr class="data">\n        <td>{4}%</td>\n       <td>« {5}</td>\n    </tr>\n' +
                        '</tbody></table>';
                    return Utils.format(wonderTip, [city.getWonder, 'Brunnen des<br>Poseidon', city._priests, 'Priester', Utils.FormatNumToStr(city._priests * 500 / populationData.maxPop, false, 2), 'Konvertierung', '100', 'Inselglaube', '8h', 'Cooldown']);
                }
                function getNoWonderTip() {
                    var populationData = city.populationData;
                    var size = 25;
                    /*if (city.getWonder == 4 || 5)
		size = 30;*/
                    var noWonderTip = '<table><thead><th colspan="3"><div align="center"><img src="cdn/all/both/wonder/w{0}.png" style="height: {4}px; float: left">{1}</div></th></thead>\n    <tbody>\n ' +
                        '<tr class="data">\n        <td>{2}</td>\n        <td> {3}</td>\n    </tr>\n' +
                        '</tbody></table>';
                    return Utils.format(noWonderTip, [city.getWonder, 'Brunnen des<br>Poseidon', 'kein Tempel in', city._name, size]);
                }
                function getFinanceTip() {
                    var totCity = Math.floor(city.getIncome + city.getExpenses);
                    var Tip = '';
                    if (city.getExpenses < 0) {
                        Tip = '<td></td><td>' + Utils.FormatNumToStr(city.getExpenses, true, 0) + '</td><td>' + Utils.FormatNumToStr(city.getExpenses * 24, true, 0) + '</td><td><i>' + Utils.FormatNumToStr(city.getExpenses * 24 * 7, true, 0) + '</i></td><td></td></tr></tbody><tfoot><tr><td>\u03A3<b> ' + ((totCity > 0) ? '+&nbsp;' : '-&nbsp;') + '</b></td><td>' + Utils.FormatNumToStr(totCity, false, 0) + '</td><td>' + Utils.FormatNumToStr(totCity * 24, false, 0) + '</td><td><i>' + Utils.FormatNumToStr(totCity * 7 * 24, false, 0) + '</i></td><td></td></tr></tfoot>';
                    }
                    var financeTip = '<table>\n    <thead>\n    <th><div align="center">\n <img src="cdn/all/both/resources/icon_upkeep.png" style="height: 14px;"></td><td><b>{0}</b></td><td><b>{1}</b></td><td><b>{2}</b></div><td></td></th>\n    </thead>\n    <tbody>\n ' +
                        '<tr class="data">\n        <td></td>\n        <td>{3}</td>\n        <td>{4}</td>\n        <td><i>{5}</i></td>\n        <td></td>\n    </tbody></tr>\n{6}</table>';
                    return Utils.format(financeTip, ['1 ' + Constant.LanguageData[lang].hour, '1 ' + Constant.LanguageData[lang].day, '1 ' + Constant.LanguageData[lang].week, Utils.FormatNumToStr(city.getIncome, true, 0), Utils.FormatNumToStr(city.getIncome * 24, false, 0), Utils.FormatNumToStr(city.getIncome * 24 * 7, false, 0), Tip]);
                }
                function getResearchTip(researchData) {
                    researchData = researchData || city.research.researchData;
                    var tooltip = (researchData.scientists > 0) ? '<table>\n    <thead>\n  <th colspan="5"><div align="center">\n <img src="cdn/all/both/buildings/y50/y50_academy.png" style="height: 20px; float: left"><b>{0}</b></div></th>\n    </thead>\n    <tbody>\n ' +
                        '<tr class="data">\n        <td>{1}</td>\n        <td colspan="4">« {2}</td>\n    </tr>\n' +
                        '<tr class="data">\n        <td>{3}</td>\n        <td colspan="4">« {4}</td>\n    </tr>\n' +
                        '<thead>\n    <th><div align="center">\n <img src="cdn/all/both/resources/icon_research_time.png" style="height: 14px;">  <td><b>{5}</b></td><td><b>{6}</b></td><td><b>{7}</b></div><td></td></th>\n    </thead>\n    <tbody>\n  ' +
                        '<tr class="data">\n        <td>{11}</td>\n        <td>{8}</td>\n        <td>{9}</td>\n    <td><i>{10}</i></td>\n        <td></td></tr>\n</table>' : '';
                    return Utils.format(tooltip, [Constant.LanguageData[lang].academy, Utils.FormatNumToStr(researchData.scientists, false, 0), Constant.LanguageData[lang].scientists, Utils.FormatNumToStr(city.maxSci, false, 0), Constant.LanguageData[lang].scientists_max, '1 ' + Constant.LanguageData[lang].hour, '1 ' + Constant.LanguageData[lang].day, '1 ' + Constant.LanguageData[lang].week, Utils.FormatNumToStr(researchData.total, true, 0), Utils.FormatNumToStr(researchData.total * 24, false, 0), Utils.FormatNumToStr((researchData.total * 24) * 7, false, 0), database.getGlobalData.hasPremiumFeature(Constant.Premium.RESEARCH_POINTS_BONUS) ? '<img src="cdn/all/both/premium/b_premium_research.jpg" style="width:18px;">' : '']);
                }
                function getIncomingTip() {
                    var cRes = city.getResource(resourceName).getCurrent;
                    if (resourceName === Constant.Resources.GOLD)
                        cRes = database.getGlobalData.finance.currentGold;
                    var rMov = database.getGlobalData.getResourceMovementsToCity(city.getId);
                    var test = ''; //ToDo
                    test = $('#js_MilitaryMovementsEventRow1546373TargetLink');
                    var table = '<table>\n    <thead>{0}</thead>\n    <tbody>{1}</tbody>\n    <tfoot>{2}</tfoot>\n</table>';
                    var row = '<tr class="data" style="border-top:1px solid #FFE4B5">\n    <td><div class="icon2 {0}Image"></div></td>\n    <td>{1}</td>\n    <td><i>« {2}</i></td>\n    \n</tr><td></td><td>{3}</td>\n<td class="small data">« ({4})</td>\n</tr><td colspan="2"><b>{5}</b></td><td>« ' + Constant.LanguageData[lang].arrival + '</td></tr>';
                    var header = '<tr>\n    <th ><div class="icon2 merchantImage"></div></th>\n    <th colspan="3">' + Constant.LanguageData[lang].transport + '</th>\n</tr>';
                    var subtotal = '<tr class="total" style="border-top:1px solid #FFE4B5">\n    <td>=</td>\n    <td>{0}</td>\n    <td colspan=2><i>{1}</i></td>\n</tr>';
                    var footer = '<tr class="total">\n    <td>Σ</td>\n    <td>{0}</td><td></td>\n</tr>';
                    if (rMov.length) {
                        var trades = '';
                        var transp = '';
                        var plunder = '';
                        var movTotal = 0;
                        for (var movID in rMov) {
                            if (!$.isNumeric(movID)) {
                                break;
                            }
                            if (rMov[movID].getResources[resourceName]) {
                                var origin = database.getCityFromId(rMov[movID].getOriginCityId);
                                var tMov = Utils.format(row, [rMov[movID].getMission, Utils.FormatNumToStr(rMov[movID].getResources[resourceName], false, 0), origin ? origin.getName : rMov[movID].getOriginCityId, Utils.FormatRemainingTime(rMov[movID].getArrivalTime - $.now()), rMov[movID].isLoading ? Constant.LanguageData[lang].loading + ': ' + Utils.FormatRemainingTime(rMov[movID].getLoadingTime, false) : rMov[movID].getArrivalTime > $.now() ? Constant.LanguageData[lang].en_route : Constant.LanguageData[lang].arrived, Utils.FormatTimeToDateString(rMov[movID].getArrivalTime)]);
                                if (rMov[movID].getMission == "trade")
                                    trades += tMov; else if (rMov[movID].getMission == 'transport')
                                        transp += tMov; else if (rMov[movID].getMission == 'plunder')
                                            plunder += tMov;
                                movTotal += rMov[movID].getResources[resourceName];
                            }
                        }
                        if (trades === '' && transp === '' && plunder === '') {
                            return '';
                        }
                        var body = trades + transp + plunder + Utils.format(subtotal, [
                            Utils.FormatNumToStr(movTotal, false, 0), '« ' + Constant.LanguageData[lang].total_ + ''
                        ]);
                        var foot = Utils.format(footer, [
                            Utils.FormatNumToStr((movTotal + cRes), false, 0)
                        ]);
                        var head = Utils.format(header, []);
                        return Utils.format(table, [head, body, foot]);
                    }
                    return '';
                }
                function getBuildingTooltip(building) {
                    if (building) {
                        var uConst = building.isUpgrading;
                        var resourceCost = building.getUpgradeCost;
                        var serverTyp = 1;
                        if (ikariam.Server() == 's201' || ikariam.Server() == 's202') serverTyp = 3;
                        var elem = '';
                        var time = 0;
                        var needlevel = 0;
                        var costlevel = 0;
                        needlevel = building.getLevel + 2;
                        costlevel = building.getLevel + 1;
                        for (var key in resourceCost) {
                            if (key == 'time') {
                                time = '<tr class="total"><td><img src="cdn/all/both/resources/icon_time.png" style="height: 11px; float: left;"></td><td colspan="2" ><i>(' + Utils.FormatTimeLengthToStr(resourceCost[key] / serverTyp, 3, ' ') + ')</i></td></tr>';
                                continue;
                            }
                            if (resourceCost[key]) {
                                elem += '<tr class="data"><td><div class="icon ' + key + 'Image"></div></td><td>' + Utils.FormatNumToStr(resourceCost[key], false, 0) + '</td>';
                                elem += (building.city().getResource(key).getCurrent < resourceCost[key] ? '<td class="red left">(' + Utils.FormatNumToStr(building.city().getResource(key).getCurrent - resourceCost[key], true, 0) + ')</td></tr>' : '<td><img src="cdn/all/both/interface/check_mark_17px.png" style="height:11px; float:left;"></td></tr>');
                            }
                        }
                        elem = (elem !== '') ? '<table><thead><tr><th colspan="3" align="center"><b>' + (uConst ? Constant.LanguageData[lang].next_Level + ' ' + needlevel : Constant.LanguageData[lang].next_Level + ' ' + costlevel) + '</b></th></tr></thead><tbody>' + elem + '</tbody><tfoot>' + time + '</tfoot></table>' : '<table><thead><tr><th colspan="3" align="center">' + Constant.LanguageData[lang].max_Level + '</th></tr></thead></table>';
                        if (uConst) {
                            elem = '<table><thead><tr><th colspan="3" align="center"><b>' + Constant.LanguageData[lang].constructing + '</b></th></tr></thead>' + '<tbody><tr><td></td><td>' + Utils.FormatFullTimeToDateString(building.getCompletionTime, true) + '</td></tr>' + '<tr><td><img src="cdn/all/both/resources/icon_time.png" style="height: 11px; float: left;"></td><td><i>(' + Utils.FormatTimeLengthToStr(building.getCompletionTime - $.now(), 3, ' ') + ')</i></td></tr></tbody></table>' + elem;
                        }
                        return elem;
                    }
                }
                function getResourceTotalTip() {
                    var totals = {};
                    var res;
                    $.each(database.cities, function (cityId, city) {
                        $.each(Constant.Resources, function (key, resourceName) {
                            res = city.getResource(resourceName);
                            if (!totals[resourceName]) {
                                totals[resourceName] = {};
                            }
                            totals[resourceName].total = totals[resourceName].total ? totals[resourceName].total + res.getCurrent : res.getCurrent;
                            totals[resourceName].income = totals[resourceName].income ? totals[resourceName].income + res.getProduction * 3600 - res.getConsumption : res.getProduction * 3600 - res.getConsumption;
                            if (resourceName === Constant.Resources.GOLD) {
                                var researchCost = 0, expense = 0, inGold = 3;
                                res = 0;
                                res += Math.round(city.getIncome + city.getExpenses);
                                researchCost += Math.round(city.getExpenses);
                                expense = (database.getGlobalData.finance.armyCost + database.getGlobalData.finance.armySupply + database.getGlobalData.finance.fleetCost + database.getGlobalData.finance.fleetSupply) / database.getCityCount;
                                inGold = database.getGlobalData.finance.currentGold / database.getCityCount;
                                totals[resourceName].total = totals[resourceName].total ? totals[resourceName].total + inGold : inGold;
                                totals[resourceName].income = totals[resourceName].income ? totals[resourceName].income + res - expense : res - expense;
                            }
                        });
                    });
                    var r = '';
                    var finalSums = { income: 0, total: 0, day: 0, week: 0 };
                    $.each(totals, function (resourceName, data) {
                        var day = data.total + data.income * 24;
                        var week = data.total + data.income * 168;
                        r += Utils.format('<tr class="data">\n    <td><div class="icon {0}Image"></div></td>\n    <td>{1}</td>\n    <td>{2}</td>\n    <td>{3}</td>\n    <td><i>{4}</i></td>\n<td></td></tr>', [resourceName, Utils.FormatNumToStr(data.income, true, 0), Utils.FormatNumToStr(data.total, true, 0), Utils.FormatNumToStr(day, true, 0), Utils.FormatNumToStr(week, true, 0)]);
                        finalSums.income += data.income;
                        finalSums.total += data.total;
                        finalSums.day += day;
                        finalSums.week += week;
                    });
                    if (r === '') {
                        return '';
                    } else {
                        return Utils.format('<table>\n    <thead>\n    <td></td>\n    <td><b>1 {5}</b></td>\n    <td><b>{6}</b></td>\n    <td><b>+24 {7}</b></td>\n    <td><b> +1 {8}</b></td>\n  <td></td>  </thead>\n    <tbody>\n    {0}\n    <tfoot>\n    <td><b>\u03A3&nbsp;</b></td>\n    <td>{1}</td>\n    <td>{2}</td>\n    <td>{3}</td>\n    <td><i>{4}</i></td>\n  <td></td>  </tfoot>\n    </tbody>\n</td></table>', [r, Utils.FormatNumToStr(finalSums.income, true, 0), Utils.FormatNumToStr(finalSums.total, true, 0), Utils.FormatNumToStr(finalSums.day, true, 0), Utils.FormatNumToStr(finalSums.week, true, 0), Constant.LanguageData[lang].hour, Constant.LanguageData[lang].total_, Constant.LanguageData[lang].hour, Constant.LanguageData[lang].week]);
                    }
                }
                function getProgressTip() {
                    if (resourceName == 'population' || resourceName == 'ui-corner-all') { return ''; }
                    var storage = city.maxResourceCapacities;
                    var current = city.getResource(resourceName).getCurrent;
                    var fulltime = (city.getResource(resourceName).getFullTime || 0 - city.getResource(resourceName).getEmptyTime) * 3600000;
                    var gold = '';
                    var serverTyp = 1;
                    if (ikariam.Server() == 's201' || ikariam.Server() == 's202') serverTyp = 3;
                    if (city.plundergold > 0 && serverTyp != 1) {
                        gold = '<td><img src="cdn/all/both/resources/icon_gold.png" style="height: 12px;"></td><td>' + Utils.FormatNumToStr(city.plundergold) + '</td><td>\u221E</td><td> « ' + Constant.LanguageData[lang].plundergold + '';
                    }
                    var progTip = '<table>\n <thead>\n <tr>\n <th><img src="cdn/all/both/premium/safecapacity_small.png" style="height: 16px;"></th>\n <th><b>{12}</b></th>\n <th colspan="2"><b>{13}</b></th>\n        \n    </tr>\n    </thead>\n    <tbody>{0}{11}<tr class="total" style="border-top:1px solid #daa520">\n        <td>{9}</td>\n        <td>{1}</td>\n        <td>{2}</td>\n        <td><i>« {14}</i></td>\n    </tr>\n    <tr class="total">\n        <td></td>\n        <td>{16}</td>\n        <td>{17}</td>\n        <td><i>« {18}</i></td>\n    </tr>\n    <tr>\n        <td></td>\n        <td>{19}</td>\n        <td>{20}</td>\n        <td></td>\n    </tr>\n        <tr class="total" style="border-top:1px solid #daa520">\n        <td>{10}</td>\n        <td>{3}</td>\n        <td>{4}</td>\n        <td><i>« {15}</i></td>\n    </tr>\n    <tr>\n        <td></td>\n        <td>{5}</td>\n        <td>{6}</td>\n        <td></td>\n    </tr>\n    </tbody>\n    <tfoot>\n    <tr>\n        <td colspan="3">{7}</td>\n        <td>« {8}</td>\n    </tr>\n    </tfoot>\n</table>';
                    var progTr = '<tr class="data">\n <td style="width:20px; background: url(\'{0}\'); background-size: auto 23px; background-position: -1px -1px; \n background-repeat: no-repeat;">\n </td>\n <td>{1}</td>\n <td>{2}</td>\n <td>« {3}</td>\n</tr>';
                    var rows = '';
                    $.each(storage.buildings, function (buildingName, data) {
                        rows += Utils.format(progTr, [Constant.BuildingData[buildingName].icon, Utils.FormatNumToStr(data.safe, false, 0), Utils.FormatNumToStr(data.storage, false, 0), data.lang]);
                    });
                    return Utils.format(progTip, [rows, Utils.FormatNumToStr(storage.safe, false, 0), Utils.FormatNumToStr(storage.capacity, false, 0), Utils.FormatNumToStr(Math.min(storage.safe, current), false, 0), Utils.FormatNumToStr(Math.min(storage.capacity, current), false, 0), Utils.FormatNumToStr(Math.min(1, current / storage.safe) * 100, false, 2) + '%', Utils.FormatNumToStr(Math.min(1, current / storage.capacity) * 100, false, 2) + '%', Utils.FormatTimeLengthToStr(fulltime, 4), fulltime < 0 ? Constant.LanguageData[lang].time_to_empty : Constant.LanguageData[lang].time_to_full, database.getGlobalData.hasPremiumFeature(Constant.Premium.STORAGECAPACITY_BONUS) ? '<img src="cdn/all/both/premium/b_premium_storagecapacity.jpg" style="width:18px;">' : '', database.getGlobalData.hasPremiumFeature(Constant.Premium.SAFECAPACITY_BONUS) ? '<img src="cdn/all/both/premium/b_premium_safecapacity.jpg" style="width:18px;">' : '', gold, Constant.LanguageData[lang].safe, Constant.LanguageData[lang].capacity, Constant.LanguageData[lang].maximum, Constant.LanguageData[lang].used, Utils.FormatNumToStr(storage.safe - Math.min(storage.safe, current), false, 0), Utils.FormatNumToStr(storage.capacity - Math.min(storage.capacity, current), false, 0), Constant.LanguageData[lang].missing, Utils.FormatNumToStr(100 - (Math.min(1, current / storage.safe) * 100), false, 2 === 0) ? Utils.FormatNumToStr(100.01 - (Math.min(1, current / storage.safe) * 100), false, 2) + '%' : Utils.FormatNumToStr(100 - (Math.min(1, current / storage.safe) * 100), false, 2) + '%', Utils.FormatNumToStr(100 - (Math.min(1, current / storage.capacity) * 100), false, 2 === 0) ? Utils.FormatNumToStr(100.01 - (Math.min(1, current / storage.capacity) * 100), false, 2) + '%' : Utils.FormatNumToStr(100 - (Math.min(1, current / storage.capacity) * 100), false, 2) + '%']);
                }
                function getConsumptionTooltip(consumption, force) {
                    if ((consumption === 0 && !force) || resourceName !== Constant.Resources.WINE) {
                        return '';
                    } else return Utils.format('<table>\n    <thead>\n    <th><div align="center">\n <img src="cdn/all/both/resources/icon_{0}.png" style="height: 14px;">  <td><b>{1}</b></td><td><b>{2}</b></td><td><b>{3}</b></div><td></td></th>\n    </thead>\n    <tbody>\n  ' +
                                               '<tr class="data">\n            <td></td>\n            <td>{4}</td>\n            <td>{5}</td>\n            <td><i>{6}</i></td>\n        <td></td></tr>\n    </tbody>\n</table>',
                                               [Constant.Resources.WINE, '1 ' + Constant.LanguageData[lang].hour, '1 ' + Constant.LanguageData[lang].day, '1 ' + Constant.LanguageData[lang].week, Utils.FormatNumToStr(-consumption, true, 0), Utils.FormatNumToStr(-consumption * 24, true, 0), Utils.FormatNumToStr(-consumption * 24 * 7, true, 0)]);
                }
                function getProductionTip(income, force) {
                    var resName = resourceName;
                    if (resourceName == 'glass')
                        resName = 'crystal';
                    var resBonus = resourceName;
                    if (resourceName == 'wood')
                        resBonus = database.getGlobalData.hasPremiumFeature(Constant.Premium.WOOD_BONUS);
                    if (resourceName == 'wine')
                        resBonus = database.getGlobalData.hasPremiumFeature(Constant.Premium.WINE_BONUS);
                    if (resourceName == 'marble')
                        resBonus = database.getGlobalData.hasPremiumFeature(Constant.Premium.MARBLE_BONUS);
                    if (resourceName == 'sulfur')
                        resBonus = database.getGlobalData.hasPremiumFeature(Constant.Premium.SULFUR_BONUS);
                    if (resourceName == 'glass')
                        resBonus = database.getGlobalData.hasPremiumFeature(Constant.Premium.CRYSTAL_BONUS);
                    if (income === 0 && !force) {
                        return '';
                    } else return Utils.format('<table>\n    <thead>\n    <th><div align="center">\n <img src="cdn/all/both/resources/icon_{0}.png" style="height: 14px;">  <td><b>{1}</b></td><td><b>{2}</b></td><td><b>{3}</b></div><td></td></th>\n    </thead>\n    <tbody>\n  ' +
                                               '<tr class="data">\n        <td>{7}</td>\n        <td>{4}</td>\n        <td>{5}</td>\n        <td><i>{6}</i></td>\n    <td></td></tr>\n    </tbody>\n</table>',
                                               [resourceName, '1 ' + Constant.LanguageData[lang].hour, '1 ' + Constant.LanguageData[lang].day, '1 ' + Constant.LanguageData[lang].week, Utils.FormatNumToStr(income, true, 0), Utils.FormatNumToStr(income * 24, false, 0), Utils.FormatNumToStr(income * 24 * 7, false, 0), resBonus ? '<img src="cdn/all/both/premium/b_premium_' + resName + '.jpg" style="width:18px;">' : '']);
                }
                function getProductionConsumptionSubSumTip(income, consumption, force) {
                    if (income === 0 && consumption === 0 && !force) {
                        return '';
                    } else if (resourceName !== Constant.Resources.WINE) {
                        return getProductionTip(income, force);
                    } else if (income === 0) {
                        return getConsumptionTooltip(consumption, force);
                    } else return Utils.format('<table>\n    <thead>\n    <th><div align="center">\n <img src="cdn/all/both/resources/icon_{0}.png" style="height: 14px;">  <td><b>{1}</b></td><td><b>{2}</b></td><td><b>{3}</b></div><td></td></th>\n    </thead>\n    <tbody>\n  ' +
                                               '<tr class="data">\n            <td>{14}</td>\n        <td>{4}</td>\n            <td>{5}</td>\n            <td><i>{6}</i></td>\n        <td></td></tr>\n    ' +
                                               '<tr class="data">\n            <td></td>\n            <td>{7}</td>\n            <td>{8}</td>\n            <td><i>{9}</i></td>\n        <td></td></tr>\n    </tbody><tfoot> ' +
                                               '<tr class="total">\n           <td>{10}</td>\n        <td>{11}</td>\n           <td>{12}</td>\n           <td><i>{13}</i></td>\n       <td></td></tr>\n    </tfoot>\n</table>',
                                               [resourceName, '1 ' + Constant.LanguageData[lang].hour, '1 ' + Constant.LanguageData[lang].day, '1 ' + Constant.LanguageData[lang].week, Utils.FormatNumToStr(income, true, 0), Utils.FormatNumToStr(income * 24, false, 0), Utils.FormatNumToStr(income * 24 * 7, false, 0), Utils.FormatNumToStr(-consumption, true, 0), Utils.FormatNumToStr(-consumption * 24, true, 0), Utils.FormatNumToStr(-consumption * 24 * 7, true, 0), (income > consumption ? '\u03A3 +&nbsp;' : '\u03A3 -&nbsp;'), Utils.FormatNumToStr((income - consumption), false, 0), Utils.FormatNumToStr((income - consumption) * 24, false, 0), Utils.FormatNumToStr((income - consumption) * 24 * 7, false, 0), database.getGlobalData.hasPremiumFeature(Constant.Premium.WINE_BONUS) ? '<img src="cdn/all/both/premium/b_premium_wine.jpg" style="width:18px;">' : '']);
                }
                function getImage(unitID) {
                    return (Constant.UnitData[unitID].type == 'fleet') ? 'cdn/all/both/characters/fleet/60x60/' + unitID + '_faceright.png' : 'cdn/all/both/characters/military/x60_y60/y60_' + unitID + '_faceright.png';
                }
            }
        },
        cssResLoaded: function () {
            var ret = this._cssResLoaded;
            this._cssResLoaded = true;
            return ret;
        },
        Init: function () {
            this.SidePanelButton();
            events(Constant.Events.DATABASE_LOADED).sub(function () {
                this.LoadCSS();
                this.DrawContentBox();
            }.bind(render));
            events(Constant.Events.MODEL_AVAILABLE).sub(function () {
                this.DrawTables();
                this.setCommonData();
                this.RestoreDisplayOptions();
                this.startMonitoringChanges();
                this.cityChange(ikariam.CurrentCityId);
            }.bind(render));
        },
        startMonitoringChanges: function () {
            events(Constant.Events.TAB_CHANGED).sub(function (tab) {
                this.stopResourceCounters();
                switch (tab) {
                    case 0:
                        this.startResourceCounters();
                        break;
                    case 1:
                        this.updateCitiesBuildingData();
                        break;
                    case 2:
                        this.updateCitiesArmyData();
                        break;
                    case 3:
                        this.redrawSettings();
                        break;
                }
            }.bind(render));
            events(Constant.Events.TAB_CHANGED).pub(database.settings.window.activeTab);
            events('cityChanged').sub(this.cityChange.bind(render));
            events(Constant.Events.BUILDINGS_UPDATED).sub(this.updateChangesForCityBuilding.bind(render));
            events(Constant.Events.GLOBAL_UPDATED).sub(this.updateGlobalData.bind(render));
            events(Constant.Events.MOVEMENTS_UPDATED).sub(this.updateMovementsForCity.bind(render));
            events(Constant.Events.RESOURCES_UPDATED).sub(this.updateResourcesForCity.bind(render));
            events(Constant.Events.CITY_UPDATED).sub(this.updateCityDataForCity.bind(render));
            events(Constant.Events.MILITARY_UPDATED).sub(this.updateChangesForCityMilitary.bind(render));
            events(Constant.Events.PREMIUM_UPDATED).sub(this.updateGlobalData.bind(render));
        },
        cityChange: function (cid) {
            var city = database.getCityFromId(cid);
            $('#empireBoard tr.current,#empireBoard tr.selected').removeClass('selected current');
            if (city) {
                this.getAllRowsForCity(city).addClass('selected').addClass((isChrome) ? 'current' : 'selected');
            }
        },
        getWorldmapTable: function () {
        },
        getHelpTable: function () {
            var lang = database.settings.languageChange.value;
            var elems = '<div id="HelpTab"><div>';
            var features = '<div class="options"><span class="categories">' + Constant.LanguageData[lang].Re_Order_Towns + '</span> ' + Constant.LanguageData[lang].On_any_tab + ''
            + '<hr>'
            + '<span class="categories">' + Constant.LanguageData[lang].Reset_Position + '</span> ' + Constant.LanguageData[lang].Right_click + ''
            + '<hr>'
            + '<span class="categories">' + Constant.LanguageData[lang].Hotkeys + '</span>'
            + '' + Constant.LanguageData[lang].Navigate + '<br>'
            + '' + Constant.LanguageData[lang].Navigate_to_City + '<br>'
            + '' + Constant.LanguageData[lang].Navigate_to + '<br>'
            + '' + Constant.LanguageData[lang].Navigate_to_World + '<br>'
            + '' + Constant.LanguageData[lang].Spacebar + ''
            + '<hr>'
            + '<span class="categories">' + Constant.LanguageData[lang].Initialize_Board + '</span>'
            + ' 1. <span id="helpTownhall" class="clickable"><b>> ' + Constant.LanguageData[lang].click_ + ' <</b></span> ' + Constant.LanguageData[lang].on_your_Town_Hall + '<br>'
            + ' 2. <span id="helpResearch" class="clickable"><b>> ' + Constant.LanguageData[lang].click_ + ' <</b></span> ' + Constant.LanguageData[lang].on_Research_Advisor + '<br>'
            + ' 3. <span id="helpPalace" class="clickable"><b>> ' + Constant.LanguageData[lang].click_ + ' <</b></span> ' + Constant.LanguageData[lang].on_your_Palace + '<br>'
            + ' 4. <span id="helpFinance" class="clickable"><b>> ' + Constant.LanguageData[lang].click_ + ' <</b></span> ' + Constant.LanguageData[lang].on_your_Finance + '<br>'
            //+ ' 5. <span id="helpShop" class="clickable"><b>> '+ Constant.LanguageData[lang].click_ +' <</b></span> '+ Constant.LanguageData[lang].on_the_Ambrosia +'<br>'
            + ' 5. <span id="helpMilitary" class="clickable"><b>> ' + Constant.LanguageData[lang].click_ + ' <</b></span> ' + Constant.LanguageData[lang].on_the_Troops + ''
            + '</div>';
            elems += features + '<div style="clear:left"></div>';
            elems += '</div></div>';
            return elems;
        },
        getSettingsTable: function () {
            var lang = database.settings.languageChange.value;
            var wineOut = '';
            var server = ikariam.Nationality();
            if (server == 'de') {
                wineOut = ' <span><input type="checkbox" id="empire_wineOut" ' + (database.settings.wineOut.value ? 'checked="checked"' : '') + '/><nobr data-tooltip="' + Constant.LanguageData[lang].wineOut_description + '"> ' + Constant.LanguageData[lang].wineOut + '</nobr></span>';
            }
            var piracy = '';
            if (database.getGlobalData.getResearchTopicLevel(Constant.Research.Seafaring.PIRACY)) {
                piracy = ' <span><input type="checkbox" id="empire_noPiracy" ' + (database.settings.noPiracy.value ? 'checked="checked"' : '') + '/><nobr data-tooltip="' + Constant.LanguageData[lang].noPiracy_description + '"> ' + Constant.LanguageData[lang].noPiracy + '</nobr></span>';
            }
            var elems = '<div id="SettingsTab"><div>';
            var inits = '<div class="options" style="clear:right"><span class="categories">' + Constant.LanguageData[lang].building_category + '</span>'
            + ' <span><input type="checkbox" id="empire_alternativeBuildingList" ' + (database.settings.alternativeBuildingList.value ? 'checked="checked"' : '') + '/><nobr data-tooltip="' + Constant.LanguageData[lang].alternativeBuildingList_description + '"> ' + Constant.LanguageData[lang].alternativeBuildingList + '</nobr></span>'
            + ' <span><input type="checkbox" id="empire_compressedBuildingList" ' + (database.settings.compressedBuildingList.value ? 'checked="checked"' : '') + '/><nobr data-tooltip="' + Constant.LanguageData[lang].compressedBuildingList_description + '"> ' + Constant.LanguageData[lang].compressedBuildingList + '</nobr></span>'
            + ' <hr>'
            + ' <span class="categories">' + Constant.LanguageData[lang].resource_category + '</span>'
            + ' <span><input type="checkbox" id="empire_hourlyRess" ' + (database.settings.hourlyRess.value ? 'checked="checked"' : '') + '/><nobr data-tooltip="' + Constant.LanguageData[lang].hourlyRes_description + '"> ' + Constant.LanguageData[lang].hourlyRes + '</nobr></span>'
            + ' ' + wineOut + ''
            + ' <span><input type="checkbox" id="empire_dailyBonus" ' + (database.settings.dailyBonus.value ? 'checked="checked"' : '') + '/><nobr data-tooltip="' + Constant.LanguageData[lang].dailyBonus_description + '"> ' + Constant.LanguageData[lang].dailyBonus + '</nobr></span>'
            + ' <span><input type="checkbox" id="empire_wineWarning" ' + (database.settings.wineWarning.value ? 'checked="checked"' : '') + '/><nobr data-tooltip="' + Constant.LanguageData[lang].wineWarning_description + '"> ' + Constant.LanguageData[lang].wineWarning + '</nobr></span>'
            + ' <span><select id="empire_wineWarningTime"><option value="0"' + (database.settings.wineWarningTime.value === 0 ? 'selected=selected' : '') + '> ' + Constant.LanguageData[lang].off + '</option><option value="12"' + (database.settings.wineWarningTime.value == 12 ? 'selected=selected' : '') + '> 12' + Constant.LanguageData[lang].hour + '</option><option value="24"' + (database.settings.wineWarningTime.value == 24 ? 'selected=selected' : '') + '> 24' + Constant.LanguageData[lang].hour + '</option><option value="36"' + (database.settings.wineWarningTime.value == 36 ? 'selected=selected' : '') + '> 36' + Constant.LanguageData[lang].hour + '</option><option value="48"' + (database.settings.wineWarningTime.value == 48 ? 'selected=selected' : '') + '> 48' + Constant.LanguageData[lang].hour + '</option><option value="96"' + (database.settings.wineWarningTime.value == 96 ? 'selected=selected' : '') + '> 96' + Constant.LanguageData[lang].hour + '</option></select><nobr data-tooltip="' + Constant.LanguageData[lang].wineWarningTime_description + '"> ' + Constant.LanguageData[lang].wineWarningTime + '</nobr></span>'
            + ' <hr>'
            + ' <span class="categories">' + Constant.LanguageData[lang].language_category + '</span>'
            + ' <span><select id="empire_languageChange"><option value="en"' + (database.settings.languageChange.value == 'en' ? 'selected=selected' : '') + '> ' + Constant.LanguageData[lang].en + '</option></select><nobr data-tooltip="' + Constant.LanguageData[lang].languageChange_description + '"> ' + Constant.LanguageData[lang].languageChange + '</nobr></span>'
            + '</div>';
            var features = '<div class="options">'
            + ' <span class="categories">' + Constant.LanguageData[lang].visibility_category + '</span>'
            + ' <span><input type="checkbox" id="empire_hideOnWorldView" ' + (database.settings.hideOnWorldView.value ? 'checked="checked"' : '') + '/><nobr data-tooltip="' + Constant.LanguageData[lang].hideOnWorldView_description + '"> ' + Constant.LanguageData[lang].hideOnWorldView + '</nobr></span>'
            + ' <span><input type="checkbox" id="empire_hideOnIslandView" ' + (database.settings.hideOnIslandView.value ? 'checked="checked"' : '') + '/><nobr data-tooltip="' + Constant.LanguageData[lang].hideOnIslandView_description + '"> ' + Constant.LanguageData[lang].hideOnIslandView + '</nobr></span>'
            + ' <span><input type="checkbox" id="empire_hideOnCityView" ' + (database.settings.hideOnCityView.value ? 'checked="checked"' : '') + '/><nobr data-tooltip="' + Constant.LanguageData[lang].hideOnCityView_description + '"> ' + Constant.LanguageData[lang].hideOnCityView + '</nobr></span>'
            + ' <hr>'
            + ' <span class="categories">' + Constant.LanguageData[lang].army_category + '</span>'
            + ' <span><input type="checkbox" id="empire_fullArmyTable" ' + (database.settings.fullArmyTable.value ? 'checked="checked"' : '') + '/><nobr data-tooltip="' + Constant.LanguageData[lang].fullArmyTable_description + '"> ' + Constant.LanguageData[lang].fullArmyTable + '</nobr></span>'
            // + ' <span><input type="checkbox" id="empire_playerInfo" ' + (database.settings.playerInfo.value ? 'checked="checked"' : '') + '/><nobr data-tooltip="'+ Constant.LanguageData[lang].playerInfo_description +'"> '+ Constant.LanguageData[lang].playerInfo +'</nobr></span>'
            + ' <span><input type="checkbox" id="empire_onIkaLogs" ' + (database.settings.onIkaLogs.value ? 'checked="checked"' : '') + '/><nobr data-tooltip="' + Constant.LanguageData[lang].onIkaLogs_description + '"> ' + Constant.LanguageData[lang].onIkaLogs + '</nobr></span>'
            + ' <hr>'
            + ' <span class="categories">' + Constant.LanguageData[lang].global_category + '</span>'
            + ' <span><input type="checkbox" id="empire_autoUpdates" ' + (database.settings.autoUpdates.value ? 'checked="checked"' : '') + '/><nobr data-tooltip="' + Constant.LanguageData[lang].autoUpdates_description + '"> ' + Constant.LanguageData[lang].autoUpdates + '</nobr></span>'
            + '</div>';
            var display = '<div class="options">'
            + ' <span class="categories">' + Constant.LanguageData[lang].display_category + '</span>'
            + ' <span><input type="checkbox" id="empire_onTop" ' + (database.settings.onTop.value ? 'checked="checked"' : '') + '/><nobr data-tooltip="' + Constant.LanguageData[lang].onTop_description + '"> ' + Constant.LanguageData[lang].onTop + '</nobr></span>'
            + ' <span><input type="checkbox" id="empire_windowTennis" ' + (database.settings.windowTennis.value ? 'checked="checked"' : '') + '/><nobr data-tooltip="' + Constant.LanguageData[lang].windowTennis_description + '"> ' + Constant.LanguageData[lang].windowTennis + '</nobr></span>'
            + ' <span><input type="checkbox" id="empire_smallFont" ' + (database.settings.smallFont.value ? 'checked="checked"' : '') + '/><nobr data-tooltip="' + Constant.LanguageData[lang].smallFont_description + '"> ' + Constant.LanguageData[lang].smallFont + '</nobr></span>'
            + ' <span><input type="checkbox" id="empire_GoldShort" ' + (database.settings.GoldShort.value ? 'checked="checked"' : '') + '/><nobr data-tooltip="' + Constant.LanguageData[lang].goldShort_description + '"> ' + Constant.LanguageData[lang].goldShort + '</nobr></span>'
            + ' <span><input type="checkbox" id="empire_newsTicker" ' + (database.settings.newsTicker.value ? 'checked="checked"' : '') + '/><nobr data-tooltip="' + Constant.LanguageData[lang].newsticker_description + '"> ' + Constant.LanguageData[lang].newsticker + '</nobr></span>'
            + ' <span><input type="checkbox" id="empire_event" ' + (database.settings.event.value ? 'checked="checked"' : '') + '/><nobr data-tooltip="' + Constant.LanguageData[lang].event_description + '"> ' + Constant.LanguageData[lang].event + '</nobr></span>'
            + ' <span><input type="checkbox" id="empire_logInPopup" ' + (database.settings.logInPopup.value ? 'checked="checked"' : '') + '/><nobr data-tooltip="' + Constant.LanguageData[lang].logInPopup_description + '"> ' + Constant.LanguageData[lang].logInPopup + '</nobr></span>'
            + ' <span><input type="checkbox" id="empire_birdSwarm" ' + (database.settings.birdSwarm.value ? 'checked="checked"' : '') + '/><nobr data-tooltip="' + Constant.LanguageData[lang].birdswarm_description + '"> ' + Constant.LanguageData[lang].birdswarm + '</nobr></span>'
            + ' <span><input type="checkbox" id="empire_walkers" ' + (database.settings.walkers.value ? 'checked="checked"' : '') + '/><nobr data-tooltip="' + Constant.LanguageData[lang].walkers_description + '"> ' + Constant.LanguageData[lang].walkers + '</nobr></span>'
            + ' ' + piracy + ''
            + ' <span><input type="checkbox" id="empire_controlCenter" ' + (database.settings.controlCenter.value ? 'checked="checked"' : '') + '/><nobr data-tooltip="' + Constant.LanguageData[lang].control_description + '"> ' + Constant.LanguageData[lang].control + '</nobr></span>'
            + ' <span><input type="checkbox" id="empire_withoutFable" ' + (database.settings.withoutFable.value ? 'checked="checked"' : '') + '/><nobr data-tooltip="' + Constant.LanguageData[lang].unnecessaryTexts_description + '"> ' + Constant.LanguageData[lang].unnecessaryTexts + '</nobr></span>'
            + ' <span><input type="checkbox" id="empire_ambrosiaPay" ' + (database.settings.ambrosiaPay.value ? 'checked="checked"' : '') + '/><nobr data-tooltip="' + Constant.LanguageData[lang].ambrosiaPay_description + '"> ' + Constant.LanguageData[lang].ambrosiaPay + '</nobr></span>'
            + '</div>';
            elems += features + inits + display + '<div style="clear:left"></div>';
            elems += '</div></div>';
            elems += '<div style="clear:left"><hr><p>&nbsp; ' + Constant.LanguageData[lang].current_Version + ' <b>&nbsp;' + empire.version + '</b></p><p>&nbsp; ' + Constant.LanguageData[lang].ikariam_Version + ' <b style="cursor:pointer;" onclick="ajaxHandlerCall(\'?view=version\')">&nbsp;' + ikariam.GameVersion() + '</b></p></div><br>';
            elems += '<div class="buttons">' + '<button data-tooltip="' + Constant.LanguageData[lang].reset + '" id="empire_Reset_Button">Reset</button>'
                + '<button data-tooltip="' + Constant.LanguageData[lang].goto_website + '" id="empire_Website_Button">' + Constant.LanguageData[lang].website + '</button>'
                + '<button data-tooltip="' + Constant.LanguageData[lang].Check_for_updates + '" id="empire_Update_Button">' + Constant.LanguageData[lang].check + '</button>'
                + '<button data-tooltip="' + Constant.LanguageData[lang].Report_bug + '" id="empire_Bug_Button">' + Constant.LanguageData[lang].report + '</button>'
                + '<button data-tooltip="Check All" id="empire_CheckAll_Button">Check All</button>'
                + '<button data-tooltip="Check" id="empire_Check_Button">Check</button>'
                + '<button data-tooltip="' + Constant.LanguageData[lang].save_settings + '" id="empire_Save_Button" onclick="ajaxHandlerCall(\'?view=city&oldBackgroundView\')">' + Constant.LanguageData[lang].save + '</button>';
            return elems;
        },
        DrawHelp: function () {
            var lang = database.settings.languageChange.value;
            $('#HelpTab').html(this.getHelpTable(
            )).on("click", "#helpTownhall", function () {
                ikariam.loadUrl(ikariam.viewIsCity, "city", ikariam.getCurrentCity.getBuildingFromName(Constant.Buildings.TOWN_HALL).getUrlParams);
            }).on("click", "#helpMilitary", function () {
                ikariam.loadUrl(ikariam.viewIsCity, "city", { view: 'cityMilitary', activeTab: 'tabUnits' });
            }).on("click", "#helpMuseum", function () {
                ikariam.loadUrl(ikariam.viewIsCity, "city", { view: 'culturalPossessions_assign', activeTab: 'tab_culturalPossessions_assign' });
            }).on("click", "#helpResearch", function () {
                ikariam.loadUrl(ikariam.viewIsCity, "city", { view: 'researchAdvisor' });
            }).on("click", "#helpPalace", function () {
                var capital = ikariam.getCapital;
                if (capital) {
                    ikariam.loadUrl(ikariam.viewIsCity, "city", capital.getBuildingFromName(Constant.Buildings.PALACE).getUrlParams);
                }
                else alert(Constant.LanguageData[lang].alert_palace);
            }).on("click", "#helpFinance", function () {
                ikariam.loadUrl(ikariam.viewIsCity, "city", { view: 'finances' });
            }).on("click", "#helpShop", function () {
                ikariam.loadUrl(ikariam.viewIsCity, "city", { view: 'premium' });
            });
        },
        DrawSettings: function () {
            var lang = database.settings.languageChange.value;
            $('#SettingsTab').html(this.getSettingsTable(
            )).on("change", "#empire_onTop", function () {
                database.settings.onTop.value = this.checked;
                render.mainContentBox.css('z-index', this.checked ? 65112 : 61);
            }).on("change", "#empire_windowTennis", function () {
                database.settings.windowTennis.value = this.checked;
                if (!this.checked) {
                    render.mainContentBox.css('z-index', database.settings.onTop.value ? 65112 : 61);
                }
                else {
                    render.mainContentBox.trigger('mouseenter');
                }
            }).on("change", "#empire_fullArmyTable", function () {
                database.settings.fullArmyTable.value = this.checked;
                render.updateCitiesArmyData();
            }).on("change", "#empire_playerInfo", function () {
                database.settings.playerInfo.value = this.checked;
            }).on("change", "#empire_onIkaLogs", function () {
                database.settings.onIkaLogs.value = this.checked;
            }).on("change", "#empire_controlCenter", function () {
                database.settings.controlCenter.value = this.checked;
            }).on("change", "#empire_withoutFable", function () {
                database.settings.withoutFable.value = this.checked;
            }).on("change", "#empire_ambrosiaPay", function () {
                database.settings.ambrosiaPay.value = this.checked;
            }).on("change", "#empire_hideOnWorldView", function () {
                database.settings.hideOnWorldView.value = this.checked;
            }).on("change", "#empire_hideOnIslandView", function () {
                database.settings.hideOnIslandView.value = this.checked;
            }).on("change", "#empire_hideOnCityView", function () {
                database.settings.hideOnCityView.value = this.checked;
            }).on("change", "#empire_autoUpdates", function () {
                database.settings.autoUpdates.value = this.checked;
            }).on("change", "#empire_smallFont", function () {
                database.settings.smallFont.value = this.checked;
                if (this.checked) { GM_addStyle("#empireBoard {font-size:8pt}"); }
                else { GM_addStyle("#empireBoard {font-size:inherit}"); }
            }).on("change", "#empire_GoldShort", function () {
                database.settings.GoldShort.value = this.checked;
            }).on("change", "#empire_newsTicker", function () {
                database.settings.newsTicker.value = this.checked;
            }).on("change", "#empire_event", function () {
                database.settings.event.value = this.checked;
            }).on("change", "#empire_birdSwarm", function () {
                database.settings.birdSwarm.value = this.checked;
            }).on("change", "#empire_walkers", function () {
                database.settings.walkers.value = this.checked;
            }).on("change", "#empire_noPiracy", function () {
                database.settings.noPiracy.value = this.checked;
            }).on("change", "#empire_hourlyRess", function () {
                database.settings.hourlyRess.value = this.checked;
            }).on("change", "#empire_wineWarning", function () {
                database.settings.wineWarning.value = this.checked;
            }).on("change", "#empire_wineOut", function () {
                database.settings.wineOut.value = this.checked;
            }).on("change", "#empire_dailyBonus", function () {
                database.settings.dailyBonus.value = this.checked;
            }).on("change", "#empire_logInPopup", function () {
                database.settings.logInPopup.value = this.checked;
                //if (this.checked)
                //alert(Constant.LanguageData[lang].alert_daily);
            }).on("change", "#empire_alternativeBuildingList", function () {
                database.settings.alternativeBuildingList.value = this.checked;
                render.cityRows.building = {};
                if (database.settings.alternativeBuildingList.value == this.checked && database.settings.compressedBuildingList.value == 1) {
                    alert(Constant.LanguageData[lang].alert);
                }
                $('table.buildings').html(render.getBuildingTable());
                render.updateCitiesBuildingData();
                $.each(database.cities, function (cityId, city) {
                    render.setCityName(city);
                    render.setActionPoints(city);
                    $.each(database.settings[Constant.Settings.CITY_ORDER].value, function (idx, val) {
                        $('#' + 'building' + '_' + val).appendTo($('#' + 'building' + '_' + val).parent());
                    });
                });
            }).on("change", "#empire_compressedBuildingList", function () {
                database.settings.compressedBuildingList.value = this.checked;
                if (database.settings.compressedBuildingList.value == this.checked && database.settings.alternativeBuildingList.value == 1) {
                    alert(Constant.LanguageData[lang].alert);
                }
                render.cityRows.building = {};
                $('table.buildings').html(render.getBuildingTable());
                render.updateCitiesBuildingData();
                $.each(database.cities, function (cityId, city) {
                    render.setCityName(city);
                    render.setActionPoints(city);
                    $.each(database.settings[Constant.Settings.CITY_ORDER].value, function (idx, val) {
                        $('#' + 'building' + '_' + val).appendTo($('#' + 'building' + '_' + val).parent());
                    });
                });
            }).on('change', "#empire_wineWarningTime", function () {
                database.settings.wineWarningTime.value = this.value;
            }).on('change', "#empire_languageChange", function () {
                database.settings.languageChange.value = this.value;
            }).on("click", "#empire_Website_Button", function () {
                //GM_openInTab('https://greasyfork.org/scripts/764-empire-overview');
            }).on("click", "#empire_Reset_Button", function () {
                empire.HardReset();
            }).on("click", "#empire_CheckAll_Button", function () {
                empire.CheckAll();
            }).on("click", "#empire_Check_Button", function () {
                empire.Check();
            }).on("click", "#empire_Update_Button", function () {
                empire.CheckForUpdates.call(empire, true);
            }).on("click", "#empire_Bug_Button", function () {
                //GM_openInTab('https://greasyfork.org/scripts/764-empire-overview/feedback');
            }).on("change", "input[type='checkbox']", function () {
                this.blur();
            });
            $(document).ready(function () {  //todo
                if ($('#empire_dailyBonus').attr('checked') && $('#dailyActivityBonus form')) {
                    $('#dailyActivityBonus form').submit();
                }
                if ($('#empire_logInPopup').attr('checked')) {
                    GM_addStyle('#multiPopup {display: none;}');
                }
                if ($('#empire_dailyBonus').attr('checked') && $('#empire_logInPopup').attr('checked')) {
                    GM_addStyle('#multiPopup {display: none;}');
                }
            });
            $("#empire_Reset_Button").button({ icons: { primary: "ui-icon-alert" }, text: true });
            $("#empire_Website_Button").button({ icons: { primary: "ui-icon-home" }, text: true });
            $("#empire_Update_Button").button({ icons: { primary: "ui-icon-info" }, text: true });
            $("#empire_Bug_Button").button({ icons: { primary: "ui-icon-notice" }, text: true });
            $("#empire_CheckAll_Button").button({ icons: { primary: "ui-icon-notice" }, text: true });
            $("#empire_Check_Button").button({ icons: { primary: "ui-icon-notice" }, text: true });
            $("#empire_Save_Button").button({ icons: { primary: "ui-icon-check" }, text: true });
            $("#empire_Allianz").button({ text: true });
            $("#empire_Allianz_einlesen").button({ text: true });
        },
        toast: function (sMessage) {
            $('<div>').addClass("ui-tooltip-content ui-widget-content").text(sMessage).appendTo($(document.createElement("div")).addClass("ui-helper-reset ui-tooltip ui-tooltip-pos-bc ui-widget").css({ position: 'relative', display: 'inline-block', left: 'auto', top: 'auto' }).show().appendTo($(document.createElement("div")).addClass("toast").appendTo(document.body).delay(100).fadeIn("slow", function () {
                $(this).delay(2000).fadeOut("slow", function () {
                    $(this).remove();
                });
            })));
        },
        toastAlert: function (sMessage) {
            $('<div class="red">').addClass("ui-tooltip-content ui-widget-content").text(sMessage).appendTo($(document.createElement("div")).addClass("ui-helper-reset ui-tooltip ui-tooltip-pos-bc ui-widget").css({ position: 'relative', display: 'inline-block', left: 'auto', top: '-20px' }).show().appendTo($(document.createElement("div")).addClass("toastAlert").appendTo(document.body).delay(100).fadeIn("slow", function () {
                $(this).delay(3000).fadeOut("slow", function () {
                    $(this).remove();
                });
            })));
        },
        RestoreDisplayOptions: function () {
            render.mainContentBox.css('left', database.settings.window.left);
            render.mainContentBox.css('top', database.settings.window.top);
            this.$tabs.tabs('select', database.settings.window.activeTab);
            if (!(ikariam.viewIsWorld && database.settings.hideOnWorldView.value || ikariam.viewIsIsland && database.settings.hideOnIslandView.value || ikariam.viewIsCity && database.settings.hideOnCityView.value) && database.settings.window.visible)
                this.mainContentBox.fadeToggle(0);
        },
        SaveDisplayOptions: function () {
            if (database.settings)
                try {
                    database.settings.addOptions({
                        window: {
                            left: render.mainContentBox.css('left'),
                            top: render.mainContentBox.css('top'),
                            visible: (ikariam.viewIsWorld && database.settings.hideOnWorldView.value || ikariam.viewIsIsland && database.settings.hideOnIslandView.value || ikariam.viewIsCity && database.settings.hideOnCityView.value) ? database.settings.window.visible : (render.mainContentBox.css('display') != 'none'),
                            activeTab: render.$tabs.tabs('option', 'active')
                        }
                    });
                } catch (e) {
                    empire.error('SaveDisplayOptions', e);
                }
        },
        SidePanelButton: function () {
            $('#js_viewCityMenu').find('li.empire_Menu')
                .on("click", function (event) { render.ToggleMainBox(); })
                .on("contextmenu", function (event) {
                event.preventDefault();
                database.settings.window.left = 110;
                database.settings.window.top = 200;
                render.mainContentBox.css('left', database.settings.window.left);
                render.mainContentBox.css('top', database.settings.window.top);
            });
            $(document).on('keydown', function (event) {
                var index = -1;
                var type = event.target.nodeName.toLowerCase();
                if (type === 'input' || type === 'textarea' || type === 'select')
                    return true;
                if (event.which === 32) {
                    event.stopImmediatePropagation();
                    render.ToggleMainBox();
                    return false;
                }
                if (event.originalEvent.shiftKey) {

                    index = [49, 50, 51, 52, 53].indexOf(event.which);
                    if (index !== -1) {
                        render.$tabs.tabs('option', 'active', index);
                        return false;
                    } else {
                        switch (event.which) {
                            case 81:
                                $('#js_worldMapLink').find('a').click();
                                break;
                            case 87:
                                $('#js_islandLink').find('a').click();
                                break;
                            case 69:
                                $('#js_cityLink').find('a').click();
                                break;
                        }
                    }
                } else {
                    var keycodes = '';
                    var codeTyp = ikariam.Nationality();
                    switch (codeTyp) {
                        case 'en':
                        case 'gr':
                        case 'ro':
                        case 'ru':
                        case 'pl':
                        case 'ir':
                        case 'ae':
                        case 'au':
                        case 'br':
                        case 'hk':
                        case 'hu': // code 0,0 ü ó
                        case 'il':
                        case 'lt':
                        case 'nl':
                        case 'tw':
                        case 'us':
                            keycodes = [49, 50, 51, 52, 53, 54, 55, 56, 57, 48, 173, 61]; //EN - =
                            if (isChrome)
                                keycodes = [49, 50, 51, 52, 53, 54, 55, 56, 57, 48, 189, 187, 8, 220, 221, 219]; //US - =
                            break;
                        case 'de':
                            keycodes = [49, 50, 51, 52, 53, 54, 55, 56, 57, 48, 63, 192]; //DE ß ´
                            if (isChrome)
                                keycodes = [49, 50, 51, 52, 53, 54, 55, 56, 57, 48, 219, 221]; //DE ß ´
                            break;
                        case 'it':
                            keycodes = [49, 50, 51, 52, 53, 54, 55, 56, 57, 48, 222, 160]; //IT + \
                            break;
                        case 'es':
                        case 'rs':
                        case 'si':
                            keycodes = [49, 50, 51, 52, 53, 54, 55, 56, 57, 48, 222, 171]; //ES, RS, SI ' +
                            break;
                        case 'ar':
                        case 'cl':
                        case 'co':
                        case 'mx':
                        case 'pe':
                        case 'pt':
                        case 've':
                            keycodes = [49, 50, 51, 52, 53, 54, 55, 56, 57, 48, 222, 0]; //AR, CL, CO, MX, VE, PE ' ¿  PT ' «
                            break;
                        case 'fr':
                            keycodes = [49, 50, 51, 52, 53, 54, 55, 56, 57, 48, 169, 61]; //FR ) =
                            break;
                        case 'cz':
                            keycodes = [49, 50, 51, 52, 53, 54, 55, 56, 57, 48, 61, 169]; //CZ = )
                            break;
                        case 'bg':
                            keycodes = [49, 50, 51, 52, 53, 54, 55, 56, 57, 48, 173, 190]; //BG - .
                            break;
                        case 'dk':
                        case 'fi':
                        case 'ee':
                        case 'se':
                            keycodes = [49, 50, 51, 52, 53, 54, 55, 56, 57, 48, 171, 192]; //DK, FI, EE, SE + ´
                            break;
                        case 'no':
                            keycodes = [49, 50, 51, 52, 53, 54, 55, 56, 57, 48, 171, 222]; //NO + \
                            break;
                        case 'tr':
                            keycodes = [49, 50, 51, 52, 53, 54, 55, 56, 57, 48, 170, 173]; //TR * -
                            break;
                        case 'sk':
                            keycodes = [49, 50, 51, 52, 53, 54, 55, 56, 57, 48, 61, 0]; //SK = ´
                            break;
                    }
                    index = keycodes.indexOf(event.which);
                    if (index !== -1) {
                        if (index < database.settings.cityOrder.value.length) {
                            $('#resource_' + database.settings.cityOrder.value[index] + ' .city_name .clickable').trigger('click');
                            return false;
                        }
                    } else {
                        switch (event.which) {
                            case 81:
                                $('#js_GlobalMenu_cities').click();
                                break;
                            case 87:
                                $('#js_GlobalMenu_military').click();
                                break;
                            case 69:
                                $('#js_GlobalMenu_research').click();
                                break;
                            case 82:
                                $('#js_GlobalMenu_diplomacy').click();
                                break;
                        }
                    }
                }
            });
        },
        ToggleMainBox: function () {
            database.settings.window.visible = (this.mainContentBox.css('display') == 'none');
            this.mainContentBox.fadeToggle(0);
        },
        DrawTables: function () {
            if ($(this.mainContentBox)) {
                $('#ArmyTab').html(this.getArmyTable());
                $('#ResTab').html(this.getResourceTable());
                $('#BuildTab').html(this.getBuildingTable());
                $('#WorldmapTab').html(this.getWorldmapTable());
                this.DrawSettings();
                this.DrawHelp();
                this.toolTip.init();
                $('#ResTab, #BuildTab, #ArmyTab').each(function () {
                    $(this).sortable({
                        helper: function (e, ui) {
                            ui.children('td').each(function () {
                                $(this).width(Math.round($(this).width()));
                                $(this).hasClass('building'); if ($(this).css('border', '1px solid transparent'));
                            });
                            ui.parents('div[role=tabpanel]').each(function () {
                                $(this).width(Math.round($(this).width()));
                            });
                            return ui;
                        },
                        handle: '.city_name .icon',
                        cursor: "move",
                        axis: 'y',
                        items: 'tbody tr',
                        container: 'tbody',
                        revert: 200,
                        stop: function (event, ui) {
                            ui.item.parents("div[role=tabpanel]").css("width", "");
                            ui.item.children("td").css("width", "").css("border", "");
                            database.settings[Constant.Settings.CITY_ORDER].value = ui.item.parents('.ui-sortable').sortable('toArray').map(function (item) {
                                return parseInt(item.split('_').pop());
                            });
                            $.each(['building', 'resource', 'army'], function (idx, type) {
                                if ($(this).parents('.ui-sortable').attr('id') !== type) {
                                    $.each(database.settings[Constant.Settings.CITY_ORDER].value, function (idx, val) {
                                        $('#' + type + '_' + val).appendTo($('#' + type + '_' + val).parent());
                                    });
                                }
                            });
                        }
                    });
                });
                $.each(['building', 'resource', 'army'], function (idx, type) {
                    $.each(database.settings[Constant.Settings.CITY_ORDER].value, function (idx, val) {
                        $('#' + type + '_' + val).appendTo($('#' + type + '_' + val).parent());
                    });
                });
            }
            this.AttachClickHandlers();
        },
        getResourceTable: function () {
            var lang = database.settings.languageChange.value;
            //var header = '<colgroup span="3"/>\n   <colgroup span="2"/>\n    <colgroup span="2"/>\n    <colgroup span="2"/>\n    <colgroup span="2"/>\n    <colgroup span="2"/>\n    <colgroup span="2"/>\n   <colgroup span="2"/>\n    <colgroup span="2"/>\n<thead>\n<tr class="header_row">\n    <th class="city_name" data-tooltip="{10}" style="cursor:pointer;" onclick="ajaxHandlerCall(\'?view=ikipedia&helpId=18\')">{0}</th>\n    <th class="action_points icon actionpointImage" data-tooltip="{1}"></th>\n    \n    <th class="wonder"></th>\n    <th class="empireactions">\n       <div class="trading" data-tooltip="'+ Constant.LanguageData[lang].transport +'" style="cursor:pointer;" onclick="ajaxHandlerCall(\'?view=militaryAdvisor\')"></div>\n<div class="agora" data-tooltip="'+ Constant.LanguageData[lang].agora +'" style="cursor:pointer;" onclick="ajaxHandlerCall(\'?view=diplomacyIslandBoard&amp=&islandId\')"></div> <div class="member" data-tooltip="'+ Constant.LanguageData[lang].member +'" style="cursor:pointer;" onclick="ajaxHandlerCall(\'?view=diplomacyAllyMemberlist\')"></div>\n  </th>\n    <th class="citizen_header icon populationImage" data-tooltip="{2}" style="cursor:pointer;" onclick="ajaxHandlerCall(\'?view=ikipedia&helpId=3\');return false;"></th>\n    \n    <th class="growth_header icon growthImage" data-tooltip="'+ Constant.LanguageData[lang].satisfaction +'"   style="cursor:pointer;" onclick="ajaxHandlerCall(\'?view=ikipedia&helpId=3\');return false;"></th>\n    <th class="research_header icon researchImage" data-tooltip="{3}" style="cursor:pointer;" onclick="ajaxHandlerCall(\'?view=researchAdvisor\');return false;"></th>\n    <th class="gold_header icon goldImage" colspan="2" data-tooltip="{4}" style="cursor:pointer;" onclick="ajaxHandlerCall(\'?view=finances\');return false;"></th>\n    <th class="wood_header icon woodImage" colspan="2" data-tooltip="{5}" style="cursor:pointer;" onclick="ajaxHandlerCall(\'?view=ikipedia&helpId=5\');return false;"></th>\n    <th class="wine_header icon wineImage" colspan="2" data-tooltip="{6}" style="cursor:pointer;" onclick="ajaxHandlerCall(\'?view=ikipedia&helpId=6\');return false;"></th>\n    <th class="marble_header icon marbleImage" colspan="2" data-tooltip="{7}" style="cursor:pointer;" onclick="ajaxHandlerCall(\'?view=ikipedia&helpId=6\');return false;"></th>\n    <th class="glass_header icon glassImage" colspan="2" data-tooltip="{8}" style="cursor:pointer;" onclick="ajaxHandlerCall(\'?view=ikipedia&helpId=6\');return false;"></th>\n    <th class="sulfur_header icon sulfurImage" colspan="2" data-tooltip="{9}" style="cursor:pointer;" onclick="ajaxHandlerCall(\'?view=ikipedia&helpId=6\');return false;"></th>\n  \n</tr>\n</thead>';
            var header = '<colgroup span="2"/>\n      <colgroup span="1"/>\n    <colgroup span="1"/>\n    <colgroup span="2"/>\n    <colgroup span="2"/>\n    <colgroup span="2"/>\n    <colgroup span="2"/>\n    <colgroup span="2"/>\n   <colgroup span="2"/>\n    <colgroup span="2"/>\n<thead>\n<tr class="header_row">\n    <th class="city_name" data-tooltip="{10}" style="cursor:pointer;" onclick="ajaxHandlerCall(\'?view=ikipedia&helpId=18\')">{0}</th>\n    <th class="action_points icon actionpointImage" data-tooltip="{1}"></th>\n    \n    <th class="empireactions">\n       <div class="trading" data-tooltip="' + Constant.LanguageData[lang].transport + '" style="cursor:pointer;" onclick="ajaxHandlerCall(\'?view=militaryAdvisor\')"></div>\n<div class="agora" data-tooltip="' + Constant.LanguageData[lang].agora + '" style="cursor:pointer;" onclick="ajaxHandlerCall(\'?view=diplomacyIslandBoard&amp=&islandId\')"></div> <div class="member" data-tooltip="' + Constant.LanguageData[lang].member + '" style="cursor:pointer;" onclick="ajaxHandlerCall(\'?view=diplomacyAllyMemberlist\')"></div>\n  </th>\n    <th class="citizen_header icon populationImage" data-tooltip="{2}" style="cursor:pointer;" onclick="ajaxHandlerCall(\'?view=ikipedia&helpId=3\');return false;"></th>\n    \n    <th class="growth_header icon growthImage" data-tooltip="' + Constant.LanguageData[lang].satisfaction + '"   style="cursor:pointer;" onclick="ajaxHandlerCall(\'?view=ikipedia&helpId=3\');return false;"></th>\n    <th class="research_header icon researchImage" data-tooltip="{3}" style="cursor:pointer;" onclick="ajaxHandlerCall(\'?view=researchAdvisor\');return false;"></th>\n    <th class="gold_header icon goldImage" colspan="2" data-tooltip="{4}" style="cursor:pointer;" onclick="ajaxHandlerCall(\'?view=finances\');return false;"></th>\n    <th class="wood_header icon woodImage" colspan="2" data-tooltip="{5}" style="cursor:pointer;" onclick="ajaxHandlerCall(\'?view=ikipedia&helpId=5\');return false;"></th>\n    <th class="wine_header icon wineImage" colspan="2" data-tooltip="{6}" style="cursor:pointer;" onclick="ajaxHandlerCall(\'?view=ikipedia&helpId=6\');return false;"></th>\n    <th class="marble_header icon marbleImage" colspan="2" data-tooltip="{7}" style="cursor:pointer;" onclick="ajaxHandlerCall(\'?view=ikipedia&helpId=6\');return false;"></th>\n    <th class="glass_header icon glassImage" colspan="2" data-tooltip="{8}" style="cursor:pointer;" onclick="ajaxHandlerCall(\'?view=ikipedia&helpId=6\');return false;"></th>\n    <th class="sulfur_header icon sulfurImage" colspan="2" data-tooltip="{9}" style="cursor:pointer;" onclick="ajaxHandlerCall(\'?view=ikipedia&helpId=6\');return false;"></th>\n  \n</tr>\n</thead>';
            var table = '<table class="resources">\n    {0}\n   <tbody>{1}</tbody>\n    <tfoot>{2}</tfoot>\n</table>';
            //var resourceRow = '<tr id="resource_{0}">\n    <td class="city_name">\n        <span></span>\n        <span class="clickable"></span>\n        <sub></sub>\n        <span class="Red" data-tooltip="{6}">&nbsp;&nbsp;<b>{5}</b>&nbsp;&nbsp;</span>\n         </td>\n    <td class="action_points"><span class="ap"></span>&nbsp;<br><span class="garrisonlimit"  data-tooltip="dynamic"><img height="18" hspace="3"></span></td>\n        <td class="wonder" data-tooltip="dynamic"  style="cursor:pointer;">\n        <div class="wonder" style="background: url(cdn/all/both/wonder/w{7}.png) no-repeat center center; background-size: {8}px auto;"></div></td>\n    <td class="empireactions">\n        <div class="worldmap" data-tooltip="'+ Constant.LanguageData[lang].to_world +'" style="cursor:pointer;"></div>        <div class="city" data-tooltip="'+ Constant.LanguageData[lang].to_town_hall +' {2}" style="cursor:pointer;"></div>\n    <div class="island" data-tooltip="'+ Constant.LanguageData[lang].to_island +'" style="cursor:pointer;"></div>\n  <br> <div class="islandwood" data-tooltip="'+ Constant.LanguageData[lang].to_saw_mill +'" style="cursor:pointer;"></div>\n    <div class="islandgood" style="background: url(cdn/all/both/resources/icon_{3}.png) no-repeat center center; background-size: 18px auto; cursor: pointer;" data-tooltip="'+ Constant.LanguageData[lang].to_mine +'"></div>\n <div class="transport" data-tooltip="'+ Constant.LanguageData[lang].transporting +' {2}" style="cursor:pointer;"></div>\n        </td>\n    <td class="population" data-tooltip="dynamic">\n        <span class= "pop" data-tooltip="dynamic"></span>\n        <span></span>\n        <div class="progressbarPop ui-progressbar ui-widget ui-widget-content ui-corner-all" data-tooltip="dynamic">\n            <div class="ui-progressbar-value ui-widget-header ui-corner-left" style="width: 95%"></div>\n        </div>\n    </td>\n    \n    <td class="population_happiness">   <span class="happy"  data-tooltip="dynamic"><img align=right height="18" hspace="8" vspace="2"></span><br><span class="growth clickbar"></span>\n </td>\n    <td class="research" data-tooltip="dynamic">\n        <span class="scientists" data-tooltip="dynamic"></span>\n        <span></span>\n    {4}   \n   </div>\n    </td>\n    {1}\n    </tr>\n';
            var resourceRow = '<tr id="resource_{0}">\n    <td class="city_name">\n        <span></span>\n        <span class="clickable"></span>\n        <sub></sub>\n        <span class="Red" data-tooltip="{6}">&nbsp;&nbsp;<b>{5}</b>&nbsp;&nbsp;</span>\n         </td>\n    <td class="action_points"><span class="ap"></span>&nbsp;<br><span class="garrisonlimit"  data-tooltip="dynamic"><img height="18" hspace="3"></span></td>\n          <td class="empireactions">\n        <div class="worldmap" data-tooltip="' + Constant.LanguageData[lang].to_world + '" style="cursor:pointer;"></div>        <div class="city" data-tooltip="' + Constant.LanguageData[lang].to_town_hall + ' {2}" style="cursor:pointer;"></div>\n    <div class="island" data-tooltip="' + Constant.LanguageData[lang].to_island + '" style="cursor:pointer;"></div>\n  <br> <div class="islandwood" data-tooltip="' + Constant.LanguageData[lang].to_saw_mill + '" style="cursor:pointer;"></div>\n    <div class="islandgood" style="background: url(cdn/all/both/resources/icon_{3}.png) no-repeat center center; background-size: 18px auto; cursor: pointer;" data-tooltip="' + Constant.LanguageData[lang].to_mine + '"></div>\n <div class="transport" data-tooltip="' + Constant.LanguageData[lang].transporting + ' {2}" style="cursor:pointer;"></div>\n        </td>\n    <td class="population" data-tooltip="dynamic">\n        <span class= "pop" data-tooltip="dynamic"></span>\n        <span></span>\n        <div class="progressbarPop ui-progressbar ui-widget ui-widget-content ui-corner-all" data-tooltip="dynamic">\n            <div class="ui-progressbar-value ui-widget-header ui-corner-left" style="width: 95%"></div>\n        </div>\n    </td>\n    \n    <td class="population_happiness">   <span class="happy"  data-tooltip="dynamic"><img align=right height="18" hspace="8" vspace="2"></span><br><span class="growth clickbar"></span>\n </td>\n    <td class="research" data-tooltip="dynamic">\n        <span class="scientists" data-tooltip="dynamic"></span>\n        <span></span>\n    {4}   \n   </div>\n    </td>\n    {1}\n    </tr>\n';
            var resourceCell = '<td class="resource {0}">\n    <span class="icon safeImage"></span>\n    <span class="current"></span>\n   <span class="incoming" data-tooltip="dynamic"></span>\n    <div class="progressbar ui-progressbar ui-widget ui-widget-content ui-corner-all" data-tooltip="dynamic">\n    <div class="ui-progressbar-value ui-widget-header ui-corner-left" style="width: 95%"></div>\n    </div>\n  </td>\n<td class="resource {0}">\n    <span class="prodconssubsum production Green" data-tooltip="dynamic"></span>\n    <span class="prodconssubsum consumption Red" data-tooltip="dynamic"></span>\n    <span class="emptytime Red"></span>\n</td>';
            //var footer = '<tr>\n    <td colspan="3"></td>\n   <td id="t_sigma" class="total" data-tooltip="dynamic">Σ</td>\n    <td id="t_population" class="total"></td><td id="t_growth" class="total"></td>\n    <td id="t_research" class="total" data-tooltip="dynamic"></td>\n        <td id="t_currentgold" class="total"></td>\n    <td id="t_goldincome" class="total" data-tooltip="dynamic">\n        <span class="Green"></span>\n      <span class="Red"></span>\n         <td id="t_currentwood" class="total"></td>\n    <td id="t_woodincome" class="total" data-tooltip="dynamic">\n        <span class="Green"></span>\n        <span class="Red"></span>\n    </td>\n    <td id="t_currentwine" class="total"></td>\n    <td id="t_wineincome" class="total" data-tooltip="dynamic">\n        <span class="Green"></span>\n        <span class="Red"></span>\n    </td>\n    <td id="t_currentmarble" class="total"></td>\n    <td id="t_marbleincome" class="total"data-tooltip="dynamic">\n        <span class="Green"></span>\n        <span class="Red"></span>\n    </td>\n    <td id="t_currentglass" class="total"></td>\n    <td id="t_glassincome" class="total" data-tooltip="dynamic">\n        <span class="Green"></span>\n        <span class="Red"></span>\n    </td>\n    <td id="t_currentsulfur" class="total"></td>\n    <td id="t_sulfurincome" class="total" data-tooltip="dynamic">\n        <span class="Green"></span>\n        <span class="Red"></span>\n    </td>\n</tr>';
            var footer = '<tr>\n    <td colspan="2"></td>\n   <td id="t_sigma" class="total" data-tooltip="dynamic">Σ</td>\n    <td id="t_population" class="total"></td><td id="t_growth" class="total"></td>\n    <td id="t_research" class="total" data-tooltip="dynamic"></td>\n        <td id="t_currentgold" class="total"></td>\n    <td id="t_goldincome" class="total" data-tooltip="dynamic">\n        <span class="Green"></span>\n      <span class="Red"></span>\n         <td id="t_currentwood" class="total"></td>\n    <td id="t_woodincome" class="total" data-tooltip="dynamic">\n        <span class="Green"></span>\n        <span class="Red"></span>\n    </td>\n    <td id="t_currentwine" class="total"></td>\n    <td id="t_wineincome" class="total" data-tooltip="dynamic">\n        <span class="Green"></span>\n        <span class="Red"></span>\n    </td>\n    <td id="t_currentmarble" class="total"></td>\n    <td id="t_marbleincome" class="total"data-tooltip="dynamic">\n        <span class="Green"></span>\n        <span class="Red"></span>\n    </td>\n    <td id="t_currentglass" class="total"></td>\n    <td id="t_glassincome" class="total" data-tooltip="dynamic">\n        <span class="Green"></span>\n        <span class="Red"></span>\n    </td>\n    <td id="t_currentsulfur" class="total"></td>\n    <td id="t_sulfurincome" class="total" data-tooltip="dynamic">\n        <span class="Green"></span>\n        <span class="Red"></span>\n    </td>\n</tr>';

            return Utils.format(table, [getHead(), getBody(), getFooter()]);

            function getHead() {
                return Utils.format(header, [Constant.LanguageData[lang].towns, Constant.LanguageData[lang].actionP, Constant.LanguageData[lang].population, Constant.LanguageData[lang].researchP, Constant.LanguageData[lang].finances_, Constant.LanguageData[lang].wood_, Constant.LanguageData[lang].wine_, Constant.LanguageData[lang].marble_, Constant.LanguageData[lang].crystal_, Constant.LanguageData[lang].sulphur_, database.getGlobalData.getLocalisedString('Current form')]);
            }
            function getBody() {
                var rows = '';
                $.each(database.cities, function (cityId, city) {
                    var resourceCells = '';
                    var info = city.isUpgrading === true ? '!' : '';
                    var progSci = '';
                    if (this.getBuildingFromName(Constant.Buildings.ACADEMY)) {
                        progSci = '<div class="progressbarSci ui-progressbar ui-widget ui-widget-content ui-corner-all" data-tooltip="dynamic">\n <div class="ui-progressbar-value ui-widget-header ui-corner-left" style="width: 95%"></span></div>';
                    }
                    var wonder_size = 20;
                    if (city.getWonder == 7 || 1)
                        wonder_size = 25;
                    $.each(Constant.Resources, function (key, resourceName) {
                        resourceCells += Utils.format(resourceCell, [resourceName]);
                    });
                    rows += Utils.format(resourceRow, [city.getId, resourceCells, city._name, city.getTradeGood, progSci, info, info ? Constant.LanguageData[lang].constructing : '', city.getTradeGoodID, wonder_size]);
                });
                return rows;
            }
            function getFooter() {
                return footer;
            }
        },
        getArmyTable: function () {
            var lang = database.settings.languageChange.value;
            var table = '<table class="army">\n    {0}\n    <tbody>{1}</tbody>\n    <tfoot>{2}</tfoot>\n</table>';
            var headerRow = '<thead><tr class="header_row">\n    <th class="city_name">{0}</th>\n    <th data-tooltip="{1}" class="icon actionpointImage action_points" >\n <th class="empireactions" colspan="2">\n       <div class="spio" data-tooltip="' + Constant.LanguageData[lang].espionage + '" style="cursor:pointer;"></div>\n<div class="combat"data-tooltip="' + Constant.LanguageData[lang].combat + '" style="cursor:pointer;"></div>\n  </th><th class="expenses_header icon expensesImage"data-tooltip="' + Constant.LanguageData[lang].expenses + '"></th>\n\n    {2}\n</tr></thead>';
            var headerCell = '<th data-tooltip="{0}" style="background:url(\'{1}\')  no-repeat center center; background-size: auto 24px; cursor: pointer;" colspan="2" class="army unit icon {2}" onclick="ajaxHandlerCall(\'?view=unitdescription&{5}Id={3}&helpId={4}\'); return false;">&nbsp;</th>\n\n';
            var bodyRow = '<tr id="army_{0}">\n    <td class="city_name"><img><span class="clickable"></span><sub></sub></td>\n    <td class="action_points"><span class="ap"></span>&nbsp;&nbsp;<br><span class="garrisonlimit"  data-tooltip="dynamic"><img height="18" hspace="5"></span></td>\n    <td class="empireactions">\n     <div class="deploymentarmy"data-tooltip="' + Constant.LanguageData[lang].transporting_units + '&nbsp;{2}" style="cursor:pointer;"></div>\n  <br>  <div class="deploymentfleet" data-tooltip="' + Constant.LanguageData[lang].transporting_fleets + '&nbsp;{2}" style="cursor:pointer;"></div>\n</td> \n <td class="empireactions">{3} <br> {4}  \n    </td>\n <td class="expenses"> {5} </td>\n   {1}\n</tr>';
            var bodyCell = '</td><td style="" class="army unit {0}">\n    <span>{1}</span>\n</td>\n<td style="" class="army movement {0}" data-tooltip="dynamic">\n    <span class="More Green {0}">{2}</span>\n  <br>  <span class="More Blue {0}">{3}</span>\n</td>';
            var costCell = '';
            var footerRow = '<tr class="totals_row">\n    <td class="city_name"></td>\n    <td></td>\n   <td class="sigma" colspan="2">Σ</td><td>&nbsp;{1}&nbsp;</td>\n    {0}\n</tr>';
            var footerCell = '<td class="army total {0} unit">\n    <span></span>\n</td>\n<td style="" class="army total {0} movement">\n    <span class="More Green"></span>\n    <span class="More Blue"></span>\n</td>';

            return Utils.format(table, [getHead(), getBody(), getFooter()]);

            function getHead() {
                var headerCells = '';
                var cols = '<colgroup span=4/><colgroup></colgroup>';
                for (var category in Constant.unitOrder) {
                    cols += '<colgroup>';
                    $.each(Constant.unitOrder[category], function (index, value) {
                        var helpId = 9;
                        var unit = 'unit';
                        if (Constant.UnitData[value].id < 300) {
                            helpId = 10;
                            unit = 'ship';
                        }
                        headerCells += Utils.format(headerCell, [Constant.LanguageData[lang][value], getImage(value), value, Constant.UnitData[value].id, helpId, unit]);
                        cols += '<col><col>';
                    });
                    cols += '</colgroup>';
                }
                return cols + Utils.format(headerRow, [Constant.LanguageData[lang].towns, Constant.LanguageData[lang].actionP, headerCells]);
            }

            function getBody() {
                var body = '';
                $.each(database.cities, function (cityId, city) {
                    var rowCells = '';
                    var divbarracks = '';
                    if (this.getBuildingFromName(Constant.Buildings.BARRACKS)) {
                        divbarracks = '<div class="barracks" data-tooltip="' + Constant.LanguageData[lang].to_barracks + '&nbsp;{2}" style="cursor:pointer;"></div>';
                    }
                    var divshipyard = '&nbsp;';
                    if (this.getBuildingFromName(Constant.Buildings.SHIPYARD)) {
                        divshipyard = '<div class="shipyard" data-tooltip="' + Constant.LanguageData[lang].to_shipyard + '&nbsp;{2}" style="cursor:pointer;"></div>';
                    }
                    var cost = 0; //city.military.getUnits.getUnit('phalanx')*Constant.UnitData.phalanx.baseCost; //geht für die Hopps todo, alle Einheiten integrieren
                    for (var category in Constant.unitOrder) {
                        $.each(Constant.unitOrder[category], function (index, value) {
                            var builds = city.getUnitBuildsByUnit(value);
                            rowCells += Utils.format(bodyCell, [value, city.military.getUnits.getUnit(value) || '', builds[value] ? builds[value] : '', '']);
                        });
                    }
                    body += Utils.format(bodyRow, [city.getId, rowCells, city._name, divbarracks, divshipyard, cost]);
                });
                return body;
            }

            function getFooter() {
                var footerCells = '';
                var expense = Utils.FormatNumToStr(database.getGlobalData.finance.armyCost + database.getGlobalData.finance.fleetCost);
                for (var category in Constant.unitOrder) {
                    $.each(Constant.unitOrder[category], function (index, value) {
                        footerCells += Utils.format(footerCell, [value]);
                    });
                }
                return Utils.format(footerRow, [footerCells, expense]);
            }

            function getImage(unitID) {
                return (Constant.UnitData[unitID].type == 'fleet') ? 'cdn/all/both/characters/fleet/60x60/' + unitID + '_faceright.png' : 'cdn/all/both/characters/military/x60_y60/y60_' + unitID + '_faceright.png';
            }
        },
        getBuildingTable: function () {
            var lang = database.settings.languageChange.value;
            var table = '<table class="buildings">\n{0}\n    <tbody>{1}</tbody>\n</table>';
            var headerCell = '<th data-tooltip="{0}" style="background-color: transparent; background-image: url(\'{1}\'); \n background-repeat: no-repeat; background-attachment: scroll; background-position: center center; background-clip: \n border-box; background-origin: padding-box; background-size: 50px auto; cursor: pointer;" colspan="{2}" class="icon" onclick="ajaxHandlerCall(\'?view=buildingDetail&helpId=1&buildingId={3}\');return false;">&nbsp;</th>';
            var headerRow = '<thead><tr class="header_row">\n    <th class="city_name">{0}</th>\n    <th data-tooltip="{1}" class="action_points icon actionpointImage"></th>\n  <th class="empireactions">\n  <div class="contracts" data-tooltip="' + Constant.LanguageData[lang].contracts + '" style="cursor:pointer;" onclick="ajaxHandlerCall(\'?view=diplomacyTreaty\')"></div></th>\n    {2}\n</tr></thead>';
            var buildingCell = '<td class="building {0}" data-tooltip="dynamic"></td>';
            var buildingRow = '<tr id="building_{0}">\n    <td class="city_name"><img><span class="clickable"></span><sub></sub></td>\n    <td class="action_points"><span class="ap"></span>&nbsp;&nbsp;<br><span class="garrisonlimit"  data-tooltip="dynamic"><img height="18" hspace="5"></span></td>\n    <td class="empireactions">\n  <div class="deploymentfleet"></div> <br>  <div class="transport" data-tooltip="' + Constant.LanguageData[lang].transporting + ' {2}" style="cursor:pointer;"></div>\n   </td>\n    {1}\n</tr>';
            var counts = database.getBuildingCounts;
            var buildingOrder = (database.settings.alternativeBuildingList.value ? Constant.altBuildingOrder : database.settings.compressedBuildingList.value ? Constant.compBuildingOrder : Constant.buildingOrder);

            return Utils.format(table, [getHead(), getBody()]);

            function getHead() {
                var headerCells = '';
                var colgroup = '<colgroup span="3"></colgroup>';
                for (var category in buildingOrder) {
                    var cols = '';
                    $.each(buildingOrder[category], function (index, value) {
                        if (value == 'colonyBuilding') {
                            if (!database.settings.compressedBuildingList.value || !counts[value]) {
                                return true;
                            }
                            cols += '<col span="' + counts[value] + '">';
                            headerCells += Utils.format(headerCell, [Constant.LanguageData[lang].palace + '/' + Constant.LanguageData[lang].palaceColony, Constant.BuildingData[Constant.Buildings.PALACE].icon, counts[value], "?view=buildingDetail&helpId=1&buildingId=" + Constant.BuildingData.palace.buildingId]);
                        } else if (value == 'productionBuilding') {
                            if (!database.settings.compressedBuildingList.value || !counts[value]) {
                                return true;
                            }
                            cols += '<col span="' + counts[value] + '">';
                            headerCells += Utils.format(headerCell, [Constant.LanguageData[lang].stonemason + '/' + Constant.LanguageData[lang].winegrower + '/' + Constant.LanguageData[lang].alchemist + '/' + Constant.LanguageData[lang].glassblowing, 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAUCAMAAACknt2MAAABelBMVEUAAADp49mgkICxmnzVuIxMcwtciQ90pSC/tKR7aFWOfGmIdmPKr4lomxChyk/YxKjTyrzl2slrVkKBblu5ooXp0a3NwrOqm4uNeWRTMzMnGRZFQBvb0sS0p5j18OiTgW3cvpSeXF07JSSJUlLFeHY2NhZzrRKZh3XmyJwPCgl7jzSHyBXlx53EuateSje0amp0YE2Fc2FzSEeFqzfoyJftylO7l1312oXv0GzWyqzN0MH15b311WO3iy2jchyLXiuZrqtyt9uJx+bP2M789+/sz3nv2p7+5IOXZRWHVA/jxou7vquTyuS7x72MqKmEw+J/wOFdk6ylsaXsz6Xz1njKnzTBlkF6SAvhvE2TsraVzeiNyeZ8ttJ7v+EzXnXJ1M2tfiKts6S63ex2utyUw9hFhqV6ss2W0O7fvmDUrUJnnrOk0+tjq8602uzO6fbCyr7Eu6BqrM1tstS74fKbzeXS6/dvud7OrG1PlLeMwNfW7viu2e2i0ObK4OYudx14AAAAAXRSTlMAQObYZgAAAAFiS0dEAIgFHUgAAAAJcEhZcwAAAEgAAABIAEbJaz4AAAFfSURBVCgVBcFLTlNhGADQ8/29t/e/reVhChWkUDFRE0hM1IlxYiIzhy5EN+ASTNyBO3DoIpw7VBNAiga0QFKsPK7nBBARV4AiIq4ukUBWVd0bQI0OJJjPC3VcV0AVTdOGhKVot//0TEFR9pebWQ8J1d9qNjxZjhGKYV3XI7N7JLDfU+dh48HmekrKcjYab0m2Y7GeP9tb2ztCL5meT8J45UJre5KOrlZv/hr0TyeXk3p6sdBqfc96439p399GXdx2Pbxv47zTreeiGcxKAABF8aiA/tZjAZ5EfAYA0ALDFKsrB4Cn63sgwbOyVeYu4HnOL0BgJyJOFkR88jIiIiI+ouDVecfhMCIa5iLix1oEJDtnnShmZ2mcT8k5VXdzzpB20kn/8HJkcfVnw4c8V09znr5GSpsbX5qlruOvA7zZbbdXqvJWhfR799tgduzhnVY9z/vtnN9VdfvgLQAAAPgPmQZaHvndsJEAAAAASUVORK5CYII=', counts[value], "?view=buildingDetail&helpId=1&buildingId=21"]).replace('50px auto', '38px 28px');
                        } else if (counts[value]) {
                            cols += '<col span="' + counts[value] + '">'; //Constant.LanguageData[lang][value]
                            headerCells += Utils.format(headerCell, [Constant.LanguageData[lang][value], Constant.BuildingData[value].icon, counts[value], "?view=buildingDetail&helpId=1&buildingId=" + Constant.BuildingData[value].buildingId]);
                        }
                    });
                    if (cols !== '') {
                        colgroup += '<colgroup>' + cols + '</colgroup>';
                    }
                }
                return colgroup + Utils.format(headerRow, [Constant.LanguageData[lang].towns, Constant.LanguageData[lang].actionP, headerCells]);
            }

            function getBody() {
                var body = '';
                $.each(database.cities, function (cityId, city) {
                    var rowCells = '';
                    for (var category in buildingOrder) {
                        $.each(buildingOrder[category], function (index, value) {
                            if ((value == 'productionBuilding' || value == 'colonyBuilding') && !database.settings.compressedBuildingList.value) return false;
                            var i = 0;
                            while (i < counts[value]) {
                                var cssClass = '';
                                if (value == 'colonyBuilding') {
                                    cssClass = city.isCapital ? Constant.Buildings.PALACE : Constant.Buildings.GOVERNORS_RESIDENCE;
                                } else if (value == 'productionBuilding') {
                                    switch (city.getTradeGoodID) {
                                        case 1:
                                            cssClass = Constant.Buildings.WINERY;
                                            break;
                                        case 2:
                                            cssClass = Constant.Buildings.STONEMASON;
                                            break;
                                        case 3:
                                            cssClass = Constant.Buildings.GLASSBLOWER;
                                            break;
                                        case 4:
                                            cssClass = Constant.Buildings.ALCHEMISTS_TOWER;
                                            break;
                                    }
                                } else {
                                    cssClass = value;
                                }
                                cssClass += +i;
                                rowCells += Utils.format(buildingCell, [cssClass]);
                                i++;
                            }
                        });
                    }
                    body += Utils.format(buildingRow, [city.getId, rowCells, city._name]);
                });
                return body;
            }
        },
        AddIslandCSS: function () {
            if (!(/.*view=island.*/.test(window.document.location)))
                if (!this.cssResLoaded()) Utils.addStyleSheet('@import "https://' + ikariam.Host() + '/skin/compiled-' + ikariam.Nationality() + '-island.css";');
        },
        updateCityArmyCell: function (cityId, type, $node) {
            var $row;
            var celllevel = !$node;
            try {
                if (celllevel) {
                    $row = this.getArmyRow(cityId);
                    $node = Utils.getClone($row);
                }
                var city = database.getCityFromId(cityId);
                var data1 = city.military.getUnits.getUnit(type) || 0;
                var data2 = city.military.getIncomingTotals[type] || 0;
                var data3 = city.military.getTrainingTotals[type] || 0;
                var cells = $node.find('td.' + type);
                cells.get(0).textContent = Utils.FormatNumToStr(data1, false, 0) || '';
                cells = cells.eq(1).children('span');
                cells.get(0).textContent = Utils.FormatNumToStr(data2, true, 0) || '';
                cells.get(1).textContent = Utils.FormatNumToStr(data3, true, 0) || '';
                delete this.cityRows.army[cityId];
                if (celllevel) {
                    Utils.setClone($row, $node);
                    this.setArmyTotals(undefined, type);
                }
            } catch (e) {
                empire.error('updateCityArmyCell', e);
            } finally {

            }
        },
        updateCityArmyRow: function (cityId, $node) {
            var $row;
            var rowLevel = !$node;
            if (rowLevel) {
                $row = this.getArmyRow(cityId);
                $node = Utils.getClone($row);
            }
            for (var armyId in Constant.UnitData) {
                this.updateCityArmyCell(cityId, armyId, $node);
            }
            if (rowLevel) {
                Utils.setClone($row, $node);
                this.setArmyTotals();
                delete this.cityRows.army[cityId];
            }
        },
        updateCitiesArmyData: function () {
            var $node = $('#ArmyTab').find('table.army');
            var $clone = Utils.getClone($node);
            for (var cityId in database.cities) {
                empire.time(this.updateCityArmyRow.bind(this, cityId, $clone.find('#army_' + cityId)), 'updateArmyRow');
            }
            this.setArmyTotals($clone);
            Utils.setClone($node, $clone);
            this.cityRows.army = {};
        },
        updateChangesForCityMilitary: function (cityId, changes) {
            if (changes && changes.length < 5) {
                $.each(changes, function (index, unit) {
                    this.updateCityArmyCell(cityId, unit);
                }.bind(render));
                this.setArmyTotals();
            } else {
                this.updateCityArmyRow(cityId);
            }
        },
        updateGlobalData: function (changes) {
            this.setAllResourceData();
            return true;
        },
        updateMovementsForCity: function (changedCityIds) {
            if (changedCityIds.length)
                $.each(changedCityIds, function (index, id) {
                    var city = database.getCityFromId(id);
                    if (city) {
                        this.setMovementDataForCity(city);
                    }
                }.bind(render));
        },
        updateResourcesForCity: function (cityId, changes) {
            var city = database.getCityFromId(cityId);
            if (city) {
                events.scheduleAction(this.updateResourceCounters.bind(render, true), 0);
            }
        },
        updateCityDataForCity: function (cityId, changes) {
            var city = database.getCityFromId(cityId);
            if (city) {
                var research = 0, population = 0, finance = 0;
                for (var key in changes) {
                    switch (key) {
                        case 'research':
                            research += changes[key];
                            break;
                        case 'priests':
                            if (Constant.Government.THEOCRACY === database.getGovernmentType) {
                                population += changes[key];
                                finance += changes[key];
                            }
                            break;
                        case 'culturalGoods':
                            research += changes[key];
                            population += changes[key];
                            break;
                        case 'citizens':
                        case 'population':
                            population += changes[key];
                            finance += changes[key];
                            break;
                        case 'name':
                            this.setCityName(city);
                            break;
                        case 'islandId':
                            break;
                        case 'coordinates':
                            break;
                        case 'finance':
                            finance += changes[key];
                    }
                }
                if (!!population) {
                    this.setPopulationData(city);
                }
                if (!!research) {
                    this.setResearchData(city);
                }
                if (!!finance) {
                    this.setFinanceData(city);
                }
            }
        },
        setArmyTotals: function ($node, unitId) {
            var data = database.getArmyTotals;
            if (!$node) {
                $node = $('#ArmyTab');
            }
            if (unitId) {
                $node.find('td.total.' + unitId).eq(0).text(Utils.FormatNumToStr(data[unitId].total, false, 0) || '')
                    .next().children('span').eq(0).text(Utils.FormatNumToStr(data[unitId].incoming, true, 0) || '')
                    .next().text(Utils.FormatNumToStr(data[unitId].training, true, 0) || '');
                if (data[unitId].training || data[unitId].incoming || data[unitId].total || database.settings.fullArmyTable.value) {
                    $node.find('td.' + unitId + ' ,th.' + unitId).show();
                } else {
                    $node.find('td.' + unitId + ' ,th.' + unitId).hide();
                }
            } else {
                $.each(Constant.UnitData, function (unit, info) {
                    $node.find('td.total.' + unit).eq(0).text(Utils.FormatNumToStr(data[unit].total, false, 0) || '')
                        .next().children('span').eq(0).text(Utils.FormatNumToStr(data[unit].incoming, true, 0) || '')
                        .next().text(Utils.FormatNumToStr(data[unit].training, true, 0) || '');
                    if (data[unit].training || data[unit].incoming || data[unit].total || database.settings.fullArmyTable.value) {
                        $node.find('td.' + unit + ' ,th.' + unit).show();
                    } else {
                        $node.find('td.' + unit + ' ,th.' + unit).hide();
                    }
                });
            }
        },
        updateChangesForCityBuilding: function (cityID, changes) {
            try {
                var city = database.getCityFromId(cityID);
                if (city) {
                    if (changes.length) {
                        $.each(changes, function (key, data) {
                            var building = city.getBuildingFromPosition(data.position);
                            if (building.getName === data.name) {
                                this.updateCityBuildingPosition(city, data.position);
                            } else {
                                this.updateCityBuildingRow(city);
                                return false;
                            }
                        }.bind(render));
                    }
                }
            } catch (e) {
                empire.error('updateChangesForCityBuilding', e);
            } finally {
            }
        },
        updateCityBuildingPosition: function (city, position, $node) {
            var building = city.getBuildingFromPosition(position);
            var idx = 0;
            //var cellOnly = ($node == undefined);
            var cellOnly = ($node === undefined);
            $.each(city.getBuildingsFromName(building.getName), function (index, b) {
                if (b.getPosition == building.getPosition) {
                    idx = index;
                    return false;
                }
            });
            var cell;
            if (cellOnly) {
                $node = render.getBuildingsRow(city);
                cell = $node.find('td.building.' + building.getName + idx);
            }
            else {
                cell = $node.find('td.building.' + building.getName + idx);
            }
            if (!building.isEmpty) {
                if (cell.length) {
                    cell.html('<span>' + building.getLevel + '</span>').find('span')
                        .removeClass('upgrading upgradable upgradableSoon maxLevel')
                        .addClass('clickable')
                        .addClass((building.isMaxLevel ? 'maxLevel' : '') + (building.isUpgrading ? ' upgrading' : '') + (building.isUpgradable ? (city.isUpgrading ? ' upgradableSoon' : ' upgradable') : ''));
                }
                else {
                    return false;
                }
            }
            return true;
        },
        updateCityBuildingRow: function (city, $node) {
            try {
                var $row;
                var cellLevel = !$node;
                if (cellLevel) {
                    $row = this.getBuildingsRow(city);
                    $node = Utils.getClone($row);
                }
                var success = true;
                $.each(city.getBuildings, function (position, building) {
                    success = this.updateCityBuildingPosition(city, position, $node);
                    return success;
                }.bind(render));

                if (cellLevel) {
                    render.cityRows.building[city.getId] = undefined;
                    $node.find('table.buildings').html(render.getBuildingTable);

                    if (!success) {
                        render.updateCitiesBuildingData();
                        $.each(database.cities, function (cityId, city) {
                            render.setCityName(city);
                            render.setActionPoints(city);
                        });
                        return success;
                    }
                    Utils.setClone($row, $node);
                }
                return success;
            } catch (e) {
                empire.error('updateCityBuildingRow', e);
            } finally {
            }
        },
        updateCitiesBuildingData: function ($redraw) {
            try {
                var success = true;
                var i = 0;
                var $node = $('#BuildTab').find('table.buildings');
                var $clone = $redraw || Utils.getClone($node);
                $.each(database.cities, function (cityId, city) {
                    success = empire.time(this.updateCityBuildingRow.bind(this, city, $clone.find('#building_' + city.getId)), 'updateBuildingRow');
                    return success;
                }.bind(render));
                if (!success) {
                    $clone.html(render.getBuildingTable);
                    if (!$redraw) {
                        render.updateCitiesBuildingData($clone);
                    }
                }
                if (!$redraw) {
                    this.cityRows.building = {};
                    Utils.setClone($node, $clone);
                }
                else {
                    $.each(database.cities, function (cityId, city) {
                        render.setCityName(city);
                        render.setActionPoints(city);
                    });
                }
            } catch (e) {
                empire.error('updateCitiesBuildingData', e);
            } finally {
            }
        },
        redrawSettings: function () {
            $('#SettingsTab').html(render.getSettingsTable());
            $("#empire_Reset_Button").button({ icons: { primary: "ui-icon-alert" }, text: true });
            $("#empire_Website_Button").button({ icons: { primary: "ui-icon-home" }, text: true });
            $("#empire_Update_Button").button({ icons: { primary: "ui-icon-info" }, text: true });
            $("#empire_Bug_Button").button({ icons: { primary: "ui-icon-notice" }, text: true });
            $("#empire_CheckAll_Button").button({ icons: { primary: "ui-icon-notice" }, text: true });
            $("#empire_Check_Button").button({ icons: { primary: "ui-icon-notice" }, text: true });
            $("#empire_Save_Button").button({ icons: { primary: "ui-icon-check" }, text: true });
        },
        DrawContentBox: function () {
            var lang = database.settings.languageChange.value;
            var that = this;
            if (!this.mainContentBox) { //<li><a href="#WorldmapTab" data-tooltip="Not yet implemented">Worldmap</a></li>
                $("#container").after('<div id="empireBoard" class="ui-widget" style="display:none;z-index:' + (database.settings.onTop.value ? 65112 : 61) + ';position: absolute; left:70px;top:180px;">\
<div id="empire_Tabs">\
<ul>\
<li><a href="#ResTab">'+ Constant.LanguageData[lang].economy + '</a></li>\
<li><a href="#BuildTab">'+ Constant.LanguageData[lang].buildings + '</a></li>\
<li><a href="#ArmyTab">'+ Constant.LanguageData[lang].military + '</a></li>\
<li><a href="#SettingsTab" data-tooltip="'+ Constant.LanguageData[lang].options + '"><span class="ui-icon ui-icon-gear"/></a></li>\
<li><a href="#HelpTab" data-tooltip="'+ Constant.LanguageData[lang].help + '"><span class="ui-icon ui-icon-help"/></a></li>\
</ul>\
<div id="ResTab"></div>\
<div id="BuildTab"></div>\
<div id="ArmyTab"></div>\
<div id="WorldmapTab"></div>\
<div id="SettingsTab"></div>\
<div id="HelpTab"></div>\
</div>\
</div>');
                this.mainContentBox = $("#empireBoard");
                this.$tabs = $("#empire_Tabs").tabs({ collapsible: true, show: null, selected: -1 });
                this.mainContentBox.draggable({
                    handle: '#empire_Tabs > ul',
                    cancel: 'div.ui-tabs-panel',
                    stop: function () {
                        render.SaveDisplayOptions();
                    }
                });
                this.$tabs.find('ul li a').on('click', function () {
                    events(Constant.Events.TAB_CHANGED).pub(render.$tabs.tabs('option', 'active'));
                    render.SaveDisplayOptions();

                });
                render.mainContentBox.on('mouseenter', function () {
                    if (database.settings.windowTennis.value) {
                        render.mainContentBox.css('z-index', "65112");
                    }
                }).on('mouseleave', function () {
                    if (database.settings.windowTennis.value) {
                        render.mainContentBox.css('z-index', "2");
                    }
                });
            }
        },
        AttachClickHandlers: function () {
            $('body').on('click', '#js_buildingUpgradeButton', function (e) {
                var upgradeSuccessCheck;
                var href = this.getAttribute('href');
                if (href !== '#') {
                    var params = $.decodeUrlParam(href);
                    if (params['function'] === "upgradeBuilding") {
                        upgradeSuccessCheck = (function upgradeSuccess() {
                            var p = params;
                            return function (response) {
                                var len = response.length;
                                var feedback = 0;
                                while (len--) {
                                    if (response[len][0] == 'provideFeedback') {
                                        feedback = response[len][1][0].type;
                                        break;
                                    }
                                }
                                if (feedback == 10) { //success
                                    render.updateChangesForCityBuilding(p.cityId || ikariam.getCurrentCity, []);
                                }
                                events('ajaxResponse').unsub(upgradeSuccessCheck);
                            };
                        })();
                    }
                    events('ajaxResponse').sub(upgradeSuccessCheck);
                }
            });
            render.mainContentBox.on('click', 'td.city_name span.clickable', function (event) {
                var target = $(event.target);
                var city = database.getCityFromId(target.parents('tr').attr('id').split('_').pop());
                var classes = target.parents('td').attr('class');
                var params = { cityId: city.getId };
                if (!city.isCurrentCity) {
                    $("#js_cityIdOnChange").val(city.getId);
                    if (unsafeWindow.ikariam.templateView) {
                        if (unsafeWindow.ikariam.templateView.id === 'tradegood' || unsafeWindow.ikariam.templateView.id === 'resource') {
                            params.templateView = unsafeWindow.ikariam.templateView.id;
                            if (ikariam.viewIsCity) {
                                params.islandId = city.getIslandID;
                                params.view = unsafeWindow.ikariam.templateView.id;
                                params.type = unsafeWindow.ikariam.templateView.id == 'resource' ? 'resource' : city.getTradeGoodID;
                            } else {
                                params.currentIslandId = ikariam.getCurrentCity.getIslandID;
                            }
                        }
                    }
                    ikariam.loadUrl(true, ikariam.mainView, params);
                }
                return false;
            }).on('click', 'td.empireactions div.transport', function (event) {
                var target = $(event.target);
                var city = database.getCityFromId(target.parents('td').parents('tr').attr('id').split('_').pop());
                if (!city.isCurrentCity && ikariam.getCurrentCity) {
                    ikariam.loadUrl(true, ikariam.mainView, { view: 'transport', destinationCityId: city.getId, templateView: Constant.Buildings.TRADING_PORT });
                }
                return false;
            }).on('click', 'td.empireactions div[class*=deployment]', function (event) {
                var target = $(event.target);
                var city = database.getCityFromId(target.parents('tr').attr('id').split('_').pop());
                var type = target.attr('class').split(' ').pop().split('deployment').pop();
                if (ikariam.currentCityId === city.getId) {
                    return false;
                }
                var params = {
                    cityId: ikariam.CurrentCityId,
                    view: 'deployment',
                    deploymentType: type,
                    destinationCityId: city.getId
                };
                ikariam.loadUrl(true, null, params);
            });
            $('#empire_Tabs').on('click', 'td.empireactions div.worldmap', function (event) {
                var target = $(event.target);
                var className = target.parents('td').attr('class').split(' ').pop();
                var city = database.getCityFromId(target.parents('tr').attr('id').split('_').pop());
                var params = {
                    cityId: city.getId,
                    view: 'worldmap_iso'
                };
                ikariam.loadUrl(true, 'city', params);
                return false;
            }).on('click', 'td.empireactions div.island', function (event) {
                var target = $(event.target);
                var className = target.parents('td').attr('class').split(' ').pop();
                var city = database.getCityFromId(target.parents('tr').attr('id').split('_').pop());
                var params = {
                    cityId: city.getId,
                    view: 'island'
                };
                ikariam.loadUrl(true, null, params);
                return false;
            }).on('click', 'td.empireactions div.city', function (event) {
                var target = $(event.target);
                var city = database.getCityFromId(target.parents('tr').attr('id').split('_').pop());
                var className = target.parents('td').attr('class').split(' ').pop();
                var building = city.getBuildingFromName(Constant.Buildings.TOWN_HALL);
                var params = building.getUrlParams;
                if (unsafeWindow.ikariam.templateView) unsafeWindow.ikariam.templateView.id = null;
                ikariam.loadUrl(true, 'city', params);
                return false;
            }).on('click', 'td.population_happiness', function (event) {
                var target = $(event.target);
                var city = database.getCityFromId(target.parents('tr').attr('id').split('_').pop());
                var className = target.parents('td').attr('class').split(' ').pop();
                var building = city.getBuildingFromName(Constant.Buildings.TAVERN);
                var params = building.getUrlParams;
                if (unsafeWindow.ikariam.templateView) unsafeWindow.ikariam.templateView.id = null;
                ikariam.loadUrl(true, 'city', params);
                return false;
            }).on('click', 'td.research span', function (event) {
                var target = $(event.target);
                var city = database.getCityFromId(target.parents('tr').attr('id').split('_').pop());
                var className = target.parents('td').attr('class').split(' ').pop();
                var building = city.getBuildingFromName(Constant.Buildings.ACADEMY);
                var params = building.getUrlParams;
                if (unsafeWindow.ikariam.templateView) unsafeWindow.ikariam.templateView.id = null;
                ikariam.loadUrl(true, 'city', params);
                return false;
            }).on('click', 'td.empireactions div.barracks', function (event) {
                var target = $(event.target);
                var city = database.getCityFromId(target.parents('tr').attr('id').split('_').pop());
                var className = target.parents('td').attr('class').split(' ').pop();
                var building = city.getBuildingFromName(Constant.Buildings.BARRACKS);
                var params = building.getUrlParams;
                if (unsafeWindow.ikariam.templateView) unsafeWindow.ikariam.templateView.id = null;
                ikariam.loadUrl(true, 'city', params);
                return false;
            }).on('click', 'td.empireactions div.shipyard', function (event) {
                var target = $(event.target);
                var city = database.getCityFromId(target.parents('tr').attr('id').split('_').pop());
                var className = target.parents('td').attr('class').split(' ').pop();
                var building = city.getBuildingFromName(Constant.Buildings.SHIPYARD);
                var params = building.getUrlParams;
                if (unsafeWindow.ikariam.templateView) unsafeWindow.ikariam.templateView.id = null;
                ikariam.loadUrl(true, 'city', params);
                return false;
            }).on('click', 'td.wonder', function (event) {
                var target = $(event.target);
                var city = database.getCityFromId(target.parents('tr').attr('id').split('_').pop());
                var className = target.parents('td').attr('class').split(' ').pop();
                var building = city.getBuildingFromName(Constant.Buildings.TEMPLE);
                var params = building.getUrlParams;
                if (unsafeWindow.ikariam.templateView) unsafeWindow.ikariam.templateView.id = null;
                ikariam.loadUrl(true, 'city', params);
                return false;
            }).on('click', 'th.empireactions div.spio', function () {
                ikariam.loadUrl(ikariam.viewIsCity, "city", ikariam.getCurrentCity.getBuildingFromName(Constant.Buildings.HIDEOUT).getUrlParams); //tabReports
            }).on('click', 'th.empireactions div.combat', function () {
                ikariam.loadUrl(ikariam.viewIsCity, "city", { view: 'militaryAdvisor', activeTab: 'combatReports' });
            }).on('click', 'span.production', function (event) {
                var target = $(event.target);
                var city = database.getCityFromId(target.parents('tr').attr('id').split('_').pop());
                var resource = target.parents('td').attr('class').split(' ').pop();
                var params = {
                    cityId: city.getId
                };
                if (ikariam.CurrentCityId == city.getId || !ikariam.viewIsIsland) {
                    params.type = resource == Constant.Resources.WOOD ? 'resource' : city.getTradeGoodID;
                    params.view = resource == Constant.Resources.WOOD ? 'resource' : 'tradegood';
                    params.islandId = city.getIslandID;
                } else if (ikariam.viewIsIsland) {
                    params.templateView = resource == Constant.Resources.WOOD ? 'resource' : 'tradegood';
                    if (unsafeWindow.ikariam.templateView) unsafeWindow.ikariam.templateView.id = null;
                }
                if (ikariam.viewIsIsland) {
                    params.currentIslandId = ikariam.getCurrentCity.getIslandID;
                }
                ikariam.loadUrl(true, ikariam.mainView, params);
                render.AddIslandCSS();
                return false;
            }).on('click', 'td.empireactions div.islandgood', function (event) {
                var target = $(event.target);
                var city = database.getCityFromId(target.parents('tr').attr('id').split('_').pop());
                var resource = target.parents('td').attr('class').split(' ').pop();
                var params = {
                    cityId: city.getId
                };
                if (ikariam.CurrentCityId == city.getId || !ikariam.viewIsIsland) {
                    params.type = resource == Constant.Resources.WOOD ? 'resource' : city.getTradeGoodID;
                    params.view = resource == Constant.Resources.WOOD ? 'resource' : 'tradegood';
                    params.islandId = city.getIslandID;
                } else if (ikariam.viewIsIsland) {
                    params.templateView = resource == Constant.Resources.WOOD ? 'resource' : 'tradegood';
                    if (unsafeWindow.ikariam.templateView) unsafeWindow.ikariam.templateView.id = null;
                }
                if (ikariam.viewIsIsland) {
                    params.currentIslandId = ikariam.getCurrentCity.getIslandID;
                }
                ikariam.loadUrl(true, ikariam.mainView, params);
                render.AddIslandCSS();
                return false;
            }).on('click', 'td.empireactions div.islandwood', function (event) {
                var target = $(event.target);
                var city = database.getCityFromId(target.parents('tr').attr('id').split('_').pop());
                var resource = target.parents('td').attr('class').split(' ').pop();
                var params = {
                    cityId: city.getId
                };
                if (ikariam.CurrentCityId == city.getId || !ikariam.viewIsIsland) {
                    params.type = resource == Constant.Resources.WOOD ? city.getTradeGoodID : 'resource';
                    params.view = resource == Constant.Resources.WOOD ? 'tradegood' : 'resource';
                    params.islandId = city.getIslandID;
                } else if (ikariam.viewIsIsland) {
                    params.templateView = resource == Constant.Resources.WOOD ? 'resource' : 'tradegood';
                    if (unsafeWindow.ikariam.templateView) unsafeWindow.ikariam.templateView.id = null;
                }
                if (ikariam.viewIsIsland) {
                    params.currentIslandId = ikariam.getCurrentCity.getIslandID;
                }
                ikariam.loadUrl(true, ikariam.mainView, params);
                render.AddIslandCSS();
                return false;
            });
            $('#empire_Tabs').on('click', 'td.building span.clickable', function (event) {
                var target = $(event.target);
                var city = database.getCityFromId(target.parents('tr').attr('id').split('_').pop());
                var className = target.parents('td').attr('class').split(' ').pop();
                var building = city.getBuildingsFromName(className.slice(0, -1))[className.charAt(className.length - 1)];
                var params = building.getUrlParams;
                if (unsafeWindow.ikariam.templateView) unsafeWindow.ikariam.templateView.id = null;
                ikariam.loadUrl(true, 'city', params);
                return false;
            });
        },

        startResourceCounters: function () {
            this.stopResourceCounters();
            this.resUpd = events.scheduleActionAtInterval(render.updateResourceCounters.bind(render), 5000);
            this.updateResourceCounters(true);
        },
        stopResourceCounters: function () {
            if (this.resUpd) {
                this.resUpd();
                this.resUpd = null;
            }
        },
        getResourceRow: function (city) {
            return this._getRow(city, "resource");
        },
        getBuildingsRow: function (city) {
            return this._getRow(city, "building");
        },
        getArmyRow: function (city) {
            return this._getRow(city, "army");
        },
        _getRow: function (city, type) {
            city = typeof city == 'object' ? city : database.getCityFromId(city);
            if (!this.cityRows[type][city.getId])
                this.cityRows[type][city.getId] = $("#" + type + "_" + city.getId);
            return this.cityRows[type][city.getId];
        },
        getAllRowsForCity: function (city) {
            return this.getResourceRow(city).add(this.getBuildingsRow(city)).add(this.getArmyRow(city));
        },
        setCityName: function (city, rows) {
            if (!rows) {
                rows = this.getAllRowsForCity(city);
            }
            var lang = database.settings.languageChange.value;
            rows.find('td.city_name').each(function (index, elem) {
                elem.children[0].outerHTML = '<span class="icon ' + city.getTradeGood + 'Image"></span>';
                elem.children[1].textContent = city.getName;
                elem.children[2].textContent = ' ' + (city.getAvailableBuildings || '') + ' ';
                elem.children[2].setAttribute('data-tooltip', Constant.LanguageData[lang].free_ground);
            });
        },
        setActionPoints: function (city, rows) {
            if (!rows) {
                rows = this.getAllRowsForCity(city);
            }
            rows.find('span.ap').text(city.getAvailableActions + '/' + city.maxAP);
            rows.find('span.garrisonlimit img').attr('src', 'cdn/all/both/advisors/military/bang_soldier.png');
        },
        setFinanceData: function (city, row) {
            if (!row) {
                row = this.getResourceRow(city);
            }
        },
        setPopulationData: function (city, row) {
            if (!row) {
                row = this.getResourceRow(city);
            }
            var lang = database.settings.languageChange.value;
            var populationData = city.populationData;
            var popSpace = Math.floor(populationData.currentPop - populationData.maxPop);
            var popDiff = populationData.maxPop - populationData.currentPop;
            row.find('td.population span').get(0).textContent = Utils.FormatNumToStr(populationData.currentPop, false, 0) + '/' + Utils.FormatNumToStr(populationData.maxPop, false, 0);
            row.find('td.population span').get(1).textContent = (popSpace !== 0 ? Utils.FormatNumToStr(popSpace, true, 0) : '');
            var fillperc = 100 / populationData.maxPop * populationData.currentPop;
            row.find('td.population div.progressbarPop').find('div.ui-progressbar-value').width(fillperc + "%").removeClass("normal, warning, full").addClass((populationData.currentPop / populationData.maxPop == 1) ? "full" : (city._citizens < 300) ? "warning" : "normal");
            var img = '';
            if (populationData.growth < -1) {
                img = 'outraged';
            } else if (populationData.growth < 0) {
                img = 'sad';
            } else if (populationData.growth < 1) {
                img = 'neutral';
            } else if (populationData.growth < 6) {
                img = 'happy';
            } else {
                img = 'ecstatic';
            }
            row.find('td.population_happiness span img').attr('src', 'cdn/all/both/smilies/' + img + '_x25.png');
            row.find('span.growth').text(popDiff !== 0 ? Utils.FormatNumToStr(populationData.growth, true, 2) : '0' + Constant.LanguageData[lang].decimalPoint + '00');
            row.find('span.growth').removeClass('Red Green').addClass(populationData.happiness > 60 && popDiff === 0 ? 'Red' : populationData.happiness > 0 && populationData.happiness <= 60 && popDiff > 0 ? 'Green' : '');
        },
        setResearchData: function (city, row) {
            if (!row) {
                row = this.getResourceRow(city);
            }
            var researchData = researchData || city.research.researchData;
            row.find('td.research span').addClass('clickbar').get(0).textContent = Utils.FormatNumToStr(city.research.getResearch) > 0 ? Utils.FormatNumToStr(city.research.getResearch, true, 0) : city.iSci;
            var fillperc = (100 * researchData.scientists) / city.maxSci;
            row.find('td.research div.progressbarSci').find('div.ui-progressbar-value').width(fillperc + "%").removeClass('normal, full').addClass(researchData.scientists === 0 ? '' : city.maxSci - researchData.scientists > 0 ? 'normal' : 'full');
        },
        setMovementDataForCity: function (city, row) {
            if (!row) {
                row = this.getResourceRow(city);
            }
            var totalIncoming = { wood: 0, wine: 0, marble: 0, glass: 0, sulfur: 0, gold: 0 };
            $.each(city.getIncomingResources, function (index, element) {
                for (var resourceName in Constant.Resources) {
                    totalIncoming[Constant.Resources[resourceName]] += element.getResource(Constant.Resources[resourceName]);
                }
            });
            row.find('td.resource.wood').find('span.incoming').get(0).textContent = Utils.FormatNumToStr(totalIncoming[Constant.Resources.WOOD]) || '';
            row.find('td.resource.wine').find('span.incoming').get(0).textContent = Utils.FormatNumToStr(totalIncoming[Constant.Resources.WINE]) || '';
            row.find('td.resource.marble').find('span.incoming').get(0).textContent = Utils.FormatNumToStr(totalIncoming[Constant.Resources.MARBLE]) || '';
            row.find('td.resource.glass').find('span.incoming').get(0).textContent = Utils.FormatNumToStr(totalIncoming[Constant.Resources.GLASS]) || '';
            row.find('td.resource.sulfur').find('span.incoming').get(0).textContent = Utils.FormatNumToStr(totalIncoming[Constant.Resources.SULFUR]) || '';
            row.find('td.resource.gold').find('span.incoming').get(0).textContent = Utils.FormatNumToStr(totalIncoming[Constant.Resources.GOLD]) || '';
        },
        setAllResourceData: function () {
            this.startResourceCounters();
        },
        setCommonData: function () {
            $.each(database.cities, function (cityId, city) {
                this.setCityName(city);
                this.setActionPoints(city);
            }.bind(render));
        },
        updateResourceCounters: function (force) {
            try {
                if ((this.$tabs.tabs('option', 'active') === 0) || force) {
                    var tot = { wood: 0, wine: 0, marble: 0, glass: 0, sulfur: 0 };
                    var inc = { wood: 0, wine: 0, marble: 0, glass: 0, sulfur: 0 };
                    var conWine = 0;
                    var income = 0;
                    var researchCost = 0;
                    var researchTot = 0;
                    var populationTot = 0;
                    var populationMaxTot = 0;
                    var growthTot = 0;
                    var citygrowth = 0;
                    var popDiffTot = 0;
                    $.each(database.cities, function (cityId, city) {
                        var $row = Utils.getClone(this.getResourceRow(city));
                        if (force) {
                            this.setFinanceData(city, $row);
                            this.setPopulationData(city, $row);
                            this.setResearchData(city, $row);
                            this.setActionPoints(city, $row);
                            this.setMovementDataForCity(city, $row);
                        }
                        income += Math.floor(city.getIncome);
                        researchTot += city.research.getResearch;
                        researchCost += Math.floor(city.getExpenses);
                        populationTot += city._population;
                        populationMaxTot += city.populationData.maxPop;
                        citygrowth = Math.floor(city.populationData.maxPop - city._population > 0) ? city.populationData.growth : 0;
                        growthTot += citygrowth;
                        popDiffTot = Math.floor(populationMaxTot - populationTot);
                        var storage = city.maxResourceCapacities;
                        $.each(Constant.Resources, function (key, resourceName) {
                            var lang = database.settings.languageChange.value;
                            var currentResource = city.getResource(resourceName);
                            var production = currentResource.getProduction * 3600;
                            var current = currentResource.getCurrent;
                            var consumption = resourceName == Constant.Resources.WINE ? currentResource.getConsumption : 0;
                            inc[resourceName] += production;
                            tot[resourceName] += current;
                            conWine += consumption;
                            var rescells = $row.find('td.resource.' + resourceName);
                            rescells.find('span.current').addClass(resourceName == Constant.Resources.WOOD || city.getTradeGood == resourceName).get(0).textContent = (current ? Utils.FormatNumToStr(current, false, 0) : '0' + Constant.LanguageData[lang].decimalPoint + '00');
                            if (resourceName !== Constant.Resources.GOLD)
                                rescells.find('span.production').addClass('clickable').get(0).textContent = (production ? Utils.FormatNumToStr(production, true, 0) : '');
                            if (resourceName === Constant.Resources.WINE) {
                                rescells.find('span.consumption').get(0).textContent = (consumption ? Utils.FormatNumToStr(0 - consumption, true, 0) : '');
                                var time = currentResource.getEmptyTime;
                                time = time > 1 ? Math.floor(time) + (60 - new Date().getMinutes()) / 60 : 0;
                                if (!isFinite(time)) {
                                    time = currentResource.getFullTime;
                                    time = time > 1 ? Math.floor(time) + (60 - new Date().getMinutes()) / 60 : 0;
                                }
                                time *= 3600000;
                                rescells.find('span.emptytime').removeClass('Red Green').addClass(time > database.settings.wineWarningTime.value * 3600000 ? 'Green' : 'Red').get(0).textContent = database.settings.wineWarningTime.value > 0 ? (Utils.FormatTimeLengthToStr(time, 2)) : '';
                                if (time < database.settings.wineWarningTime.value * 3600000 && database.settings.wineWarning.value != 1)
                                    render.toastAlert('!!! ' + Constant.LanguageData[lang].alert_wine + city._name + ' !!!');
                            } else {
                                var time = currentResource.getFullTime;
                                time = time > 1 ? Math.floor(time) + (60 - new Date().getMinutes()) / 60 : 0;
                                time *= 3600000;
                                rescells.find('span.emptytime').removeClass('Red Green').addClass(time > database.settings.wineWarningTime.value * 3600000 ? 'Green' : 'Red').get(0).textContent = (Utils.FormatTimeLengthToStr(time, 2));
                            }
                            if (resourceName === Constant.Resources.GOLD) {
                                rescells.find('span.current').get(0).textContent = city.getIncome + city.getExpenses >= 0 ? Utils.FormatNumToStr(city.getIncome + city.getExpenses) : Utils.FormatNumToStr((city.getIncome + city.getExpenses), true);
                                rescells.find('span.production').get(0).textContent = Utils.FormatNumToStr(city.getIncome, true, 0);
                                rescells.find('span.consumption').get(0).textContent = city.getExpenses !== 0 ? Utils.FormatNumToStr(city.getExpenses, true, 0) : '';
                            }
                            var fillperc = (current / storage.capacity) * 100;
                            rescells.find('div.progressbar').find('div.ui-progressbar-value').width(fillperc + "%").removeClass("normal warning almostfull full").addClass(fillperc > 90 ? fillperc > 96 ? "full" : "almostfull" : fillperc > 70 ? "warning" : "normal");
                            var diffGold = Math.floor(city.getIncome + city.getExpenses);
                            var fillpercG = 100 / (city.populationData.maxPop * 3) * diffGold;
                            if (resourceName === Constant.Resources.GOLD) {
                                rescells.find('div.progressbar').find('div.ui-progressbar-value').width(fillpercG + "%").removeClass("normal almostfull full fullGold").addClass(fillpercG > 50 ? fillpercG == 100 ? "fullGold" : "normal" : fillpercG > 25 ? "almostfull" : "full");
                            }
                            if (storage.safe > current) {
                                rescells.find('span.safeImage').show();
                            } else {
                                rescells.find('span.safeImage').hide();
                            }
                            if (resourceName === Constant.Resources.GOLD) {
                                rescells.find('span.safeImage').hide();
                            }
                        }.bind(render));
                        Utils.setClone(this.getResourceRow(city), $row);
                        this.cityRows.resource[city.getId] = null;
                    }.bind(render));
                    var lang = database.settings.languageChange.value;
                    var expense = database.getGlobalData.finance.armyCost + database.getGlobalData.finance.armySupply + database.getGlobalData.finance.fleetCost + database.getGlobalData.finance.fleetSupply - researchCost;
                    var sigmaIncome = income - expense;
                    var currentGold = 0;
                    currentGold = Utils.FormatNumToStr(database.getGlobalData.finance.currentGold);
                    if ((database.settings.GoldShort.value == 1) && (database.getGlobalData.finance.currentGold > 10000))
                        currentGold = Utils.FormatNumToStr(database.getGlobalData.finance.currentGold / 1000) + 'k';
                    $("#t_currentgold").get(0).textContent = currentGold;
                    $("#t_currentwood").get(0).textContent = Utils.FormatNumToStr(Math.round(tot[Constant.Resources.WOOD]), false);
                    $("#t_currentwine").get(0).textContent = Utils.FormatNumToStr(Math.round(tot[Constant.Resources.WINE]), false);
                    $("#t_currentmarble").get(0).textContent = Utils.FormatNumToStr(Math.round(tot[Constant.Resources.MARBLE]), false);
                    $("#t_currentglass").get(0).textContent = Utils.FormatNumToStr(Math.round(tot[Constant.Resources.GLASS]), false);
                    $("#t_currentsulfur").get(0).textContent = Utils.FormatNumToStr(Math.round(tot[Constant.Resources.SULFUR]), false);
                    $("#t_goldincome").children('span').removeClass('Red Green').addClass(sigmaIncome >= 0 ? 'Green' : 'Red').eq(0).text(Utils.FormatNumToStr(sigmaIncome, true, 0)).siblings('span').eq(0).text(sigmaIncome > 0 ? '\u221E' : Utils.FormatTimeLengthToStr((database.getGlobalData.finance.currentGold / sigmaIncome) * 60 * 60 * 1000, true, 0));
                    $("#t_woodincome").find('span').get(0).textContent = Utils.FormatNumToStr(Math.round(inc[Constant.Resources.WOOD]), true);
                    $("#t_wineincome").children('span').eq(0).text(Utils.FormatNumToStr(Math.round(inc[Constant.Resources.WINE]), true)).siblings('span').eq(0).text('-' + Utils.FormatNumToStr(Math.round(conWine), false));
                    $("#t_marbleincome").find('span').get(0).textContent = Utils.FormatNumToStr(Math.round(inc[Constant.Resources.MARBLE]), true);
                    $("#t_glassincome").find('span').get(0).textContent = Utils.FormatNumToStr(Math.round(inc[Constant.Resources.GLASS]), true);
                    $("#t_sulfurincome").find('span').get(0).textContent = Utils.FormatNumToStr(Math.round(inc[Constant.Resources.SULFUR]), true);
                    $("#t_population").get(0).textContent = Utils.FormatNumToStr(Math.round(populationTot), false) + '(' + Utils.FormatNumToStr(Math.round(populationMaxTot), false) + ')';
                    $("#t_growth").get(0).textContent = popDiffTot > 0 ? Utils.FormatNumToStr(growthTot, true, 2) : '0' + Constant.LanguageData[lang].decimalPoint + '00';
                    $("#t_research").get(0).textContent = researchTot ? Utils.FormatNumToStr(researchTot, true, 0) : '0' + Constant.LanguageData[lang].decimalPoint + '00';
                    tot = inc = null;
                }
            } catch (e) {
                empire.error('UpdateResourceCounters', e);
            }
        }
    };

    function getCityNameFromID(originCity, city) {
        var ret = '';
        try {
            ret = database.cities[parseInt(originCity)].getName;
        } catch (e) {
            ret = originCity;
        }
        return ret;
    }
    render.LoadCSS = function () {
        //Main Css
        GM_addStyle('/* Global board styles */\n #js_GlobalMenu_wood, #js_GlobalMenu_wine, #js_GlobalMenu_marble, #js_GlobalMenu_crystal, #js_GlobalMenu_sulfur {font-size:95%; position:absolute; top:0px; right:5px}\n span.resourceProduction {font-size:85%;position:absolute;right:5px; padding-top: 13px}\n #empireBoard .clickable {\n    color: #542c0f;\n    font-weight: 600; }\n#empireBoard .clickable:hover, #empireBoard .clickbar:hover {\n    cursor: pointer;\n    text-decoration: underline; }\n#empireBoard .Bold, #empireBoard .Red, #empireBoard .Blue, #empireBoard .Green {\n    font-weight: normal; }\n#empireBoard .Green {\n    color: green !important; }\n#empireBoard .Red {\n    color: red !important; }\n#empireBoard .Blue {\n    color: blue !important; }\n#empireBoard .icon {\n    background-clip: border-box;\n    background-repeat: no-repeat;\n    background-position: center;\n    background-color: transparent;\n    background-size: auto 20px; }\n#empireBoard .safeImage {\n    background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAJCAYAAAD+WDajAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAEFJREFUeNpi/P//PwMIhOrzQhhAsPriZ0YQzYQugcxnQhaE6YABxhA9HhRdyICJAQ/AayzxOtFdzYRuFLIVAAEGANwqFwuukYKqAAAAAElFTkSuQmCC");\n    background-size: auto auto !important; }\n#empireBoard .transportImage {\n    background-image: url(cdn/all/both/actions/transport.jpg); }\n#empireBoard .tradeImage {\n    background-image: url(cdn/all/both/actions/trade.jpg); }\n#empireBoard .plunderImage {\n    background-image: url(cdn/all/both/actions/plunder.jpg); }\n#empireBoard .merchantImage {\n    background-image: url(cdn/all/both/minimized/merchantNavy.png);\n    background-position: 0 -5px; }\n#empireBoard .woodImage {\n    background-image: url(cdn/all/both/resources/icon_wood.png);}\n#empireBoard .wineImage {\n    background-image: url(cdn/all/both/resources/icon_wine.png); }\n#empireBoard .marbleImage {\n    background-image: url(cdn/all/both/resources/icon_marble.png); }\n#empireBoard .sulfurImage {\n    background-image: url(cdn/all/both/resources/icon_sulfur.png); }\n#empireBoard .goldImage {\n    background-image: url(cdn/all/both/resources/icon_gold.png); }\n#empireBoard .glassImage {\n    background-image: url(cdn/all/both/resources/icon_glass.png); }\n#empireBoard .sawMillImage {\n    background-image: url(cdn/all/both/characters/y100_worker_wood_faceleft.png); }\n#empireBoard .mineImage {\n    background-image: url(cdn/all/both/characters/y100_worker_tradegood_faceleft.png); }\n#empireBoard .researchImage {\n    background-image: url(cdn/all/both/layout/bulb-on.png); }\n#empireBoard .populationImage {\n    background-image: url(cdn/all/both/resources/icon_population.png); }\n#empireBoard .goldImage {\n    background-image: url(cdn/all/both/resources/icon_gold.png); }\n#empireBoard .expensesImage {\n    background-image: url(cdn/all/both/resources/icon_upkeep.png); }\n#empireBoard .happyImage {\n    background-image: url(cdn/all/both/smilies/happy.png); }\n#empireBoard .actionpointImage {\n    background-image: url(cdn/all/both/resources/icon_actionpoints.png); }\n#empireBoard .growthImage {\n    background-image: url(cdn/all/both/icons/growth_positive.png); }\n#empireBoard .scientistImage {\n    background-image: url(cdn/all/both/characters/40h/scientist_r.png); }\n#empireBoard .priestImage {\n    background-image: url(cdn/all/both/characters/40h/templer_r.png); }\n#empireBoard .citizenImage {\n    background-image: url(cdn/all/both/characters/40h/citizen_r.png); }\n#empireBoard .cityIcon {\n    background-image: url(cdn/all/both/icons/city_30x30.png); }\n#empireBoard .governmentIcon {\n    background-image: url(cdn/all/both/government/zepter_20.png); }\n#empireBoard .researchIcon {\n    background-image: url(cdn/all/both/icons/researchbonus_30x30.png); }\n#empireBoard .tavernIcon {\n    background-image: url(cdn/all/both/buildings/tavern_30x30.png); }\n#empireBoard .culturalIcon {\n    background-image: url(cdn/all/both/interface/icon_message_write.png); }\n#empireBoard .museumIcon {\n    background-image: url(cdn/all/both/buildings/museum_30x30.png); }\n#empireBoard .incomeIcon {\n    background-image: url(cdn/all/both/icons/income_positive.png); }\n#empireBoard .crownIcon {\n    background-image: url(cdn/all/both/layout/crown.png); }\n#empireBoard .corruptionIcon {\n    background-image: url(cdn/all/both/icons/corruption_24x24.png); }\n#empireBoard #empireTip {\n    display: none;\n    position: absolute;\n    top: 0;\n    left: 0;\n    z-index: 99999999; }\n#empireBoard #empireTip .icon {\n    background-clip: border-box;\n    background-repeat: no-repeat;\n    background-position: 0;\n    background-color: transparent;\n    background-attachment: scroll;\n    background-size: 16px auto;\n    height: 17px;\n    min-width: 24px;\n    width: 24px; }\n#empireBoard #empireTip .icon2 {\n    background-clip: border-box;\n    background-repeat: no-repeat;\n    background-position: 0;\n    background-color: transparent;\n    background-attachment: scroll;\n    background-size: 24px auto;\n    height: 17px;\n    min-width: 24px;\n    width: 24px; }\n#empireBoard #empireTip .content {\n    background-color: #fae0ae;\n    border: 1px solid #e4b873;\n    position: relative;\n    overflow: hidden;\n    text-align: left;\n    word-wrap: break-word; }\n#empireBoard #empireTip .content table {\n    width: 100%; }\n#empireBoard #empireTip .content table tr.data {\n    background-color:  	#FFFAF0; }\n#empireBoard #empireTip .content table tr.total {\n     background: #E7C680 url(cdn/all/both/input/button.png) repeat-x scroll 0 0; }\n#empireBoard #empireTip .content table td {\n    padding: 2px;\n    height: auto !important;\n    text-align: right; }\n#empireBoard #empireTip .content table th {\n    padding: 2px;\n    height: auto !important;\n    text-align: center;\n    font-weight: bold;  background: #F8E7B3 url(cdn/all/both/input/button.png) repeat-x scroll 0 bottom;}\n#empireBoard #empireTip .content table tbody td {\n background-color: #FFFAF0;}\n#empireBoard #empireTip .content table tbody td:last-child {\n    text-align: left;\n    white-space: nowrap;\n    font-style: italic; }\n#empireBoard #empireTip .content table tfoot {\n  line-height: 12px !important;  border-top: 3px solid #fdf7dd; }\n#empireBoard #empireTip .content table tfoot td:last-child {\n    text-align: left;\n    white-space: nowrap;\n    font-style: italic; }\n#empireBoard #empireTip .content table thead {\n    background: #F8E7B3 url(cdn/all/both/input/button.png) repeat-x scroll 0 bottom;}\n#empireBoard #empireTip .content table thead th.lf {\n    border-left: 2px solid #e4b873; }\n#empireBoard #empireTip .content table tbody td.lf {\n    border-left: 2px solid #e4b873; }\n#empireBoard #empireTip .content table th.nolf, #empireBoard #empireTip .content table td.nolf {\n    border-left: none; }\n#empireBoard #empireTip .content th.lfdash, #empireBoard #empireTip .content td.lfdash {\n    border-left: 1px dashed #e4b873; }\n#empireBoard #empireTip .content table tr.small td {\n    height: auto !important;\n    padding-top: 1px;\n    font-size: 10px !important;\n    line-height: 15px !important; }\n#empireBoard #empire_Tabs table {\n    width: 100% !important;\n    text-align: center;\n    border: 1px solid #ffffff; }\n#empireBoard #empire_Tabs table colgroup {\n    border-left: 1px solid #e4b873; }\n#empireBoard #empire_Tabs table colgroup:first-child {\n    border: none !important; }\n#empireBoard #empire_Tabs table colgroup col {\n    border-left: 1px dashed #e4b873; }\n#empireBoard #empire_Tabs table thead {\n    background: #f8e7b3 url(cdn/all/both/input/button.png) repeat-x scroll 0 bottom; }\n#empireBoard #empire_Tabs table thead tr {\n    height: 30px; }\n#empireBoard #empire_Tabs table thead tr th {\n    text-align: center;\n    font-weight: bold;\n    \n    overflow: hidden;\n    white-space: nowrap; }\n#empireBoard #ArmyTab table thead tr th.empireactions {\n  min-width: 20px; width: 50px;}\n#empireBoard #empire_Tabs table thead tr th.icon {\n    min-width: 35px;\n    background-size: auto 20px; }\n#empireBoard #empire_Tabs table tbody tr {\n    border-top: 1px solid #e4b873;}\n#empireBoard #empire_Tabs table tbody tr:nth-child(even) {\n    background-color: #FDF1D4; }\n#empireBoard #empire_Tabs table tbody tr.selected {\n    background-color: #FAE3B8;\n    box-shadow: 0 0 1em #CB9B6A inset; }\n#empireBoard #empire_Tabs table tbody tr:hover {\n    background-color: #fff;\n    box-shadow: 0 0 1em #CB9B6A; }\n#empireBoard #empire_Tabs table tbody tr td.city_name {\n    width: 135px;\n    max-width: 135px;\n    padding-left: 3px;\n    text-align: left;\n    padding-right: 14px; }\n#empireBoard #empire_Tabs table tbody tr td.city_name span.icon {\n    background-repeat: no-repeat;\n    float: left;\n    width: 20px;\n    background-size: 15px auto;\n    margin: 0 2px 0 -1px;\n    height: 16px;\n    cursor: move; }\n   #empireBoard #empire_Tabs table tbody tr td.action_points {\n  text-align: right;}\n  #empireBoard #empire_Tabs table tbody tr td.population {\n  text-align: right;}\n#empireBoard #empire_Tabs  table tbody tr td.sawmill {\n    border-left: 1.5px solid #e4b873; }\n  #empireBoard #empire_Tabs table tbody tr td.sawmillprog {\n  text-align: right;}\n  #empireBoard #empire_Tabs table tbody tr td.mineprog {\n  text-align: right;}\n  #empireBoard #empire_Tabs table tbody tr td.empireactions div {\n    background-clip: border-box;\n    background: transparent repeat scroll 0 0;\n    background-size: 25px auto;\n    height: 17px;\n    min-width: 20px;\n    width: 25px; }\n  #empireBoard #empire_Tabs table tbody tr td.wonder div {\n    background-clip: border-box;\n    background: transparent repeat scroll 0 0;\n    background-size: auto 40px;\n    height: 30px;\n    min-width: 30px;\n    width: 30px; }\n	#empireBoard #empire_Tabs table thead tr th.empireactions div {\n    background-clip: border-box;\n    background: transparent repeat scroll 0 0;\n    background-size: 25px auto;\n    height: 20px;\n    min-width: 24px;\n    width: 25px; }\n#empireBoard #empire_Tabs table tbody tr td.empireactions div.transport {\n    background-image: url("cdn/all/both/actions/transport.jpg"); float: right;}\n#empireBoard #empire_Tabs table tbody tr td.empireactions div.worldmap {\n    background-image: url("cdn/all/both/layout/icon-world.png"); background-size: 16px 16px; background-repeat: no-repeat; background-position: center center; float: left;}\n#empireBoard #empire_Tabs table tbody tr td.empireactions div.island {\n    background-image: url("cdn/all/both/layout/icon-island.png"); background-size: 23px 18px; background-position: center center; float: right;}\n#empireBoard #empire_Tabs table tbody tr td.empireactions div.islandwood {\n    background-image: url("cdn/all/both/resources/icon_wood.png"); background-size: 17px auto; background-repeat: no-repeat; background-position: center center; float: left;}\n#empireBoard #empire_Tabs table tbody tr td.empireactions div.islandgood {\n   float: left;}\n#empireBoard #empire_Tabs table tbody tr td.empireactions div.city {\n    background-image: url("cdn/all/both/layout/icon-city2.png"); background-size: auto 21px; background-repeat: no-repeat; background-position: center center; float: right;}\n#empireBoard #empire_Tabs table thead tr th.empireactions div.member {\n    background-image: url("cdn/all/both/characters/y100_citizen_faceright.png"); background-size: auto 20px; background-repeat: no-repeat; background-position: center center; float: right;}\n#empireBoard #empire_Tabs table thead tr th.empireactions div.agora {\n    background-image: url("cdn/all/both/layout/icon-message.png"); background-size: 20px auto; background-repeat: no-repeat; background-position: center center; float: right;}\n#empireBoard #empire_Tabs table thead tr th.empireactions div.trading {\n    background-image: url("cdn/all/both/characters/fleet/40x40/ship_transport_r_40x40.png"); background-size: 22px 19px; background-repeat: no-repeat; background-position: center center; float: left;}\n#empireBoard #empire_Tabs table thead tr th.empireactions div.spio {\n    background-image: url("cdn/all/both/characters/military/120x100/spy_120x100.png"); background-size: 25px auto; background-position: center center;\n    float: left; }\n#empireBoard #empire_Tabs table thead tr th.empireactions div.combat {\n    background-image: url("cdn/all/both/layout/medallie32x32_gold.png"); background-size: 19px auto; background-repeat: no-repeat;\n    float: right; }\n#empireBoard #empire_Tabs table thead tr th.empireactions div.contracts {\n    background-image: url("cdn/all/both/museum/icon32_culturalgood.png"); background-size: 22px auto; background-position: center center;  background-repeat: no-repeat;}\n#empireBoard #empire_Tabs table tbody tr td.empireactions div.barracks {\n    background-image: url("cdn/all/both/buildings/y50/y50_barracks.png"); background-size: 30px auto; background-position: center center; float: right; }\n#empireBoard #empire_Tabs table tbody tr td.empireactions div.shipyard {\n    background-image: url("cdn/all/both/buildings/y50/y50_shipyard.png");\n  background-size: 28px auto;   float: right; }\n#empireBoard #empire_Tabs table tbody tr td.empireactions div.deploymentarmy {\n    background-image: url("cdn/all/both/actions/move_army.jpg");\n    float: left; }\n#empireBoard #empire_Tabs table tbody tr td.empireactions div.deploymentfleet {\n    background-image: url("cdn/all/both/actions/move_fleet.jpg");\n    float: right; }\n#empireBoard #empire_WorldmapTab table tbody tr td.worldmap div.worldmap{ width:829px; height:829px; background-image: url("cdn/all/both/actions/move_fleet.jpg");\n    float: right; }\n#empireBoard #empire_Tabs table tbody tr td.empireactions div.transport:hover {\n    background-position: 0 -17px; }\n#empireBoard #empire_Tabs table tbody tr td.empireactions div.deploymentfleet:hover {\n    background-position: 0 -17px; }\n#empireBoard #empire_Tabs table tbody tr td.empireactions div.deploymentarmy:hover {\n    background-position: 0 -17px; }\n#empireBoard #empire_Tabs table tbody tr.selected .empireactions div.transport, #empireBoard #empire_Tabs table tbody tr.selected .empireactions div.deploymentarmy, #empireBoard #empire_Tabs table tbody tr.selected .empireactions div.deploymentfleet{\n    background-position: 0 17px; }\n#empireBoard #empire_Tabs table tbody tr.current .empireactions div.transport {\n    background-position: 0 px; }\n#empireBoard #empire_Tabs table tfoot {\n    background: #fae0ae;\n    background: #e7c680 url(cdn/all/both/input/button.png) repeat-x scroll 0 0;\n    border-top: 2px solid #e4b873; }\n#empireBoard #empire_Tabs table tfoot tr td {\n    text-align: right;\n     font-weight: bold;}\n#empireBoard #empire_Tabs table tfoot tr #t_research.total {\n    text-align: center; }\n#empireBoard #empire_Tabs table tfoot tr #t_growth.total {\n    text-align: center; }\n#empireBoard #empire_Tabs table tfoot tr td.total span {\n    line-height: 1em;\n    height: 1em;\n    font-size: 0.8em;\n    display: block; }\n#empireBoard #empire_Tabs table tfoot tr td#t_sigma, #empireBoard #empire_Tabs table tfoot tr td.sigma {\n    font-weight: 800;\n    text-align: center; }\n#empireBoard #ResTab div.progressbar .normal {\n    background: #73443E; }\n#empireBoard #ResTab div.progressbar .warning {\n    background: #8F1D1A; }\n#empireBoard #ResTab div.progressbar .almostfull {\n    background: #B42521; }\n#empireBoard #ResTab div.progressbar .full {\n    background: #ff0000; }\n#empireBoard #ResTab div.progressbar .fullGold {\n    background: #185A39; }\n#empireBoard #ResTab div.progressbarPop .normal {\n    background: #73443E; }\n#empireBoard #ResTab div.progressbarPop .warning {\n    background: #CC3300; }\n#empireBoard #ResTab div.progressbarPop .full {\n    background: #185A39; }\n#empireBoard #ResTab div.progressbarSci .normal {\n    background: #73443E; }\n#empireBoard #ResTab div.progressbarSci .full {\n    background: #185A39; }\n#empireBoard #ResTab table tr td.gold_income, #empireBoard #ResTab table tr td.resource, #empireBoard #ResTab table tr td.army:nth-child(even) {\n    text-align: right; }\n#empireBoard #ResTab table tr td.gold_income span.incoming, #empireBoard #ResTab table tr td.resource span.incoming {\n  color: blue; }\n#empireBoard #ResTab table tr td.gold_unkeep span, #empireBoard #ResTab table tr td.resource span, #empireBoard #ResTab table tr td.army:nth-child(even) span {\n    line-height: 1em;\n    height: 1em;\n    font-size: 0.8em;\n    display: block; }\n#empireBoard #ResTab table tr td.gold_income span.icon, #empireBoard #ResTab table tr td.resource span.icon, #empireBoard #ResTab table tr td.army:nth-child(even) span.icon {\n    background-repeat: no-repeat;\n    float: left;\n    width: 20px;\n    height: 9px;\n    padding: 5px 4px 0 0; }\n#empireBoard #ResTab table tr td.gold_income span.current, #empireBoard #ResTab table tr td.resource span.current, #empireBoard #ResTab table tr td.army:nth-child(even) span.current {\n    font-size: 1em;\n    display: inline; }\n#empireBoard #ResTab table tr td.population {\n    text-align: right; }\n#empireBoard #ResTab table tr td.gold_income span:nth-child(2), #empireBoard #ResTab table tr td.population span:nth-child(2) {\n    line-height: 1em;\n    height: 1em;\n    font-size: 0.8em;\n    display: block; }\n#empireBoard #BuildTab table tbody tr td {\n    background-clip: border-box;\n    background-repeat: no-repeat;\n    background-position: center;\n    background-color: transparent;\n    background-size: auto 20px; }\n#empireBoard #BuildTab table tbody tr td span.maxLevel {\n    color: rgba(84, 44, 15, 0.3); }\n#empireBoard #BuildTab table tbody tr td span.upgradableSoon {\n    color: #4169e1;\n    font-style: italic; }\n#empireBoard #BuildTab table tbody tr td span.upgradableSoon:after {\n    content: "+"; }\n#empireBoard #BuildTab table tbody tr td span.upgradable {\n    color: green;\n    font-style: italic; }\n#empireBoard #BuildTab table tbody tr td span.upgradable:after {\n    content: "+"; }\n#empireBoard #BuildTab table tbody tr td span.upgrading {\n    background: url("/cdn/all/both/icons/arrow_upgrade.png") no-repeat scroll 1px 3px transparent;\n    border-radius: 5px 5px 5px 5px;\n    box-shadow: 0 0 2px rgba(0, 0, 0, 0.8);\n    display: inline-block;\n    padding: 2px 5px 1px 20px;\n    margin: 2px; }\n#empireBoard #ArmyTab table colgroup col:nth-child(even) {\n    border-left: none; }\n#empireBoard #SettingsTab .options, #empireBoard #HelpTab .options {\n    float: left;\n    padding: 10px; }\n#empireBoard #SettingsTab .options span.categories, #empireBoard #HelpTab .options span.categories {\n    margin-left: -3px;\n    font-weight: 500; }\n#empireBoard #SettingsTab .options span.categories:not(:first-child), #empireBoard #HelpTab .options span.categories:not(:first-child) {\n    margin-top: 5px; }\n#empireBoard #SettingsTab .options span:not(.clickable), #empireBoard #HelpTab .options span:not(.clickable) {\n    display: block; }\n#empireBoard #SettingsTab .options span label, #empireBoard #HelpTab .options span label {\n    vertical-align: top;\n    padding-left: 5px; }\n#empireBoard #SettingsTab .buttons, #empireBoard #HelpTab .buttons {\n    clear: left;\n    padding: 3px; }\n#empireBoard #SettingsTab .buttons button, #empireBoard #HelpTab .buttons button {\n    margin-left: 3px; }\n\n.toast, .toastAlert {\n    display: none;\n    position: fixed;\n    z-index: 99999;\n    width: 100%;\n    text-align: center;\n    bottom: 5em; }\n\n.toast .message, .toastAlert .message {\n    display: inline-block;\n    color: #4C3000;\n    padding: 5px;\n    border-radius: 5px;\n    box-shadow: 3px 0px 15px 0 #542C0F;\n    -webkit-box-shadow: 3px 0px 15px 0 #542C0F;\n    font-family: Arial, Helvetica, sans-serif;\n    font-size: 11px;\n    background: #faf3d7;\n    background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0, #faf3d7), color-stop(1, #e1b06d)); }\n\ndiv.prog:after {\n    -webkit-animation: move 2s linear infinite;\n    -moz-animation: move 2s linear infinite; }\n\n.prog {\n    display: block;\n    width: 100%;\n    height: 100%;\n    background: #fcf938 -moz-linear-gradient(center bottom, #fcf938 37%, #fcf938 69%);\n    position: relative;\n    overflow: hidden; }\n.prog:after {\n    content: "";\n    position: absolute;\n    top: 0;\n    left: 0;\n    bottom: 0;\n    right: 0;\n    background: -moz-linear-gradient(-45deg, rgba(10, 10, 10, 0.6) 25%, transparent 25%, transparent 50%, rgba(10, 10, 10, 0.6) 50%, rgba(10, 10, 10, 0.6) 75%, transparent 75%, transparent);\n    z-index: 1;\n    -webkit-background-size: 50px 50px;\n    -moz-background-size: 50px 50px;\n    background-size: 50px 50px;\n    -webkit-animation: move 5s linear infinite;\n    -moz-animation: move 5s linear infinite;\n    overflow: hidden; }\n\n.animate > .prog:after {\n    display: none; }\n\n@-webkit-keyframes move {\n    0% {\n        background-position: 0 0; }\n\n    100% {\n        background-position: 50px 50px; } }\n\n@-moz-keyframes move {\n    0% {\n        background-position: 0 0; }\n\n    100% {\n        background-position: 50px 50px; } }\n');
        if (database.settings.compressedBuildingList.value) GM_addStyle('#empireBoard #BuildTab table tbody tr td.building.forester0:not(:empty) {\n background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAUCAMAAABPqWaPAAAKN2lDQ1BzUkdCIElFQzYxOTY2LTIuMQAAeJydlndUU9kWh8+9N71QkhCKlNBraFICSA29SJEuKjEJEErAkAAiNkRUcERRkaYIMijggKNDkbEiioUBUbHrBBlE1HFwFBuWSWStGd+8ee/Nm98f935rn73P3Wfvfda6AJD8gwXCTFgJgAyhWBTh58WIjYtnYAcBDPAAA2wA4HCzs0IW+EYCmQJ82IxsmRP4F726DiD5+yrTP4zBAP+flLlZIjEAUJiM5/L42VwZF8k4PVecJbdPyZi2NE3OMErOIlmCMlaTc/IsW3z2mWUPOfMyhDwZy3PO4mXw5Nwn4405Er6MkWAZF+cI+LkyviZjg3RJhkDGb+SxGXxONgAoktwu5nNTZGwtY5IoMoIt43kA4EjJX/DSL1jMzxPLD8XOzFouEiSniBkmXFOGjZMTi+HPz03ni8XMMA43jSPiMdiZGVkc4XIAZs/8WRR5bRmyIjvYODk4MG0tbb4o1H9d/JuS93aWXoR/7hlEH/jD9ld+mQ0AsKZltdn6h21pFQBd6wFQu/2HzWAvAIqyvnUOfXEeunxeUsTiLGcrq9zcXEsBn2spL+jv+p8Of0NffM9Svt3v5WF485M4knQxQ143bmZ6pkTEyM7icPkM5p+H+B8H/nUeFhH8JL6IL5RFRMumTCBMlrVbyBOIBZlChkD4n5r4D8P+pNm5lona+BHQllgCpSEaQH4eACgqESAJe2Qr0O99C8ZHA/nNi9GZmJ37z4L+fVe4TP7IFiR/jmNHRDK4ElHO7Jr8WgI0IABFQAPqQBvoAxPABLbAEbgAD+ADAkEoiARxYDHgghSQAUQgFxSAtaAYlIKtYCeoBnWgETSDNnAYdIFj4DQ4By6By2AE3AFSMA6egCnwCsxAEISFyBAVUod0IEPIHLKFWJAb5AMFQxFQHJQIJUNCSAIVQOugUqgcqobqoWboW+godBq6AA1Dt6BRaBL6FXoHIzAJpsFasBFsBbNgTzgIjoQXwcnwMjgfLoK3wJVwA3wQ7oRPw5fgEVgKP4GnEYAQETqiizARFsJGQpF4JAkRIauQEqQCaUDakB6kH7mKSJGnyFsUBkVFMVBMlAvKHxWF4qKWoVahNqOqUQdQnag+1FXUKGoK9RFNRmuizdHO6AB0LDoZnYsuRlegm9Ad6LPoEfQ4+hUGg6FjjDGOGH9MHCYVswKzGbMb0445hRnGjGGmsVisOtYc64oNxXKwYmwxtgp7EHsSewU7jn2DI+J0cLY4X1w8TogrxFXgWnAncFdwE7gZvBLeEO+MD8Xz8MvxZfhGfA9+CD+OnyEoE4wJroRIQiphLaGS0EY4S7hLeEEkEvWITsRwooC4hlhJPEQ8TxwlviVRSGYkNimBJCFtIe0nnSLdIr0gk8lGZA9yPFlM3kJuJp8h3ye/UaAqWCoEKPAUVivUKHQqXFF4pohXNFT0VFysmK9YoXhEcUjxqRJeyUiJrcRRWqVUo3RU6YbStDJV2UY5VDlDebNyi/IF5UcULMWI4kPhUYoo+yhnKGNUhKpPZVO51HXURupZ6jgNQzOmBdBSaaW0b2iDtCkVioqdSrRKnkqNynEVKR2hG9ED6On0Mvph+nX6O1UtVU9Vvuom1TbVK6qv1eaoeajx1UrU2tVG1N6pM9R91NPUt6l3qd/TQGmYaYRr5Grs0Tir8XQObY7LHO6ckjmH59zWhDXNNCM0V2ju0xzQnNbS1vLTytKq0jqj9VSbru2hnaq9Q/uE9qQOVcdNR6CzQ+ekzmOGCsOTkc6oZPQxpnQ1df11Jbr1uoO6M3rGelF6hXrtevf0Cfos/ST9Hfq9+lMGOgYhBgUGrQa3DfGGLMMUw12G/YavjYyNYow2GHUZPTJWMw4wzjduNb5rQjZxN1lm0mByzRRjyjJNM91tetkMNrM3SzGrMRsyh80dzAXmu82HLdAWThZCiwaLG0wS05OZw2xljlrSLYMtCy27LJ9ZGVjFW22z6rf6aG1vnW7daH3HhmITaFNo02Pzq62ZLde2xvbaXPJc37mr53bPfW5nbse322N3055qH2K/wb7X/oODo4PIoc1h0tHAMdGx1vEGi8YKY21mnXdCO3k5rXY65vTW2cFZ7HzY+RcXpkuaS4vLo3nG8/jzGueNueq5clzrXaVuDLdEt71uUnddd457g/sDD30PnkeTx4SnqWeq50HPZ17WXiKvDq/XbGf2SvYpb8Tbz7vEe9CH4hPlU+1z31fPN9m31XfKz95vhd8pf7R/kP82/xsBWgHcgOaAqUDHwJWBfUGkoAVB1UEPgs2CRcE9IXBIYMj2kLvzDecL53eFgtCA0O2h98KMw5aFfR+OCQ8Lrwl/GGETURDRv4C6YMmClgWvIr0iyyLvRJlESaJ6oxWjE6Kbo1/HeMeUx0hjrWJXxl6K04gTxHXHY+Oj45vipxf6LNy5cDzBPqE44foi40V5iy4s1licvvj4EsUlnCVHEtGJMYktie85oZwGzvTSgKW1S6e4bO4u7hOeB28Hb5Lvyi/nTyS5JpUnPUp2Td6ePJninlKR8lTAFlQLnqf6p9alvk4LTduf9ik9Jr09A5eRmHFUSBGmCfsytTPzMoezzLOKs6TLnJftXDYlChI1ZUPZi7K7xTTZz9SAxESyXjKa45ZTk/MmNzr3SJ5ynjBvYLnZ8k3LJ/J9879egVrBXdFboFuwtmB0pefK+lXQqqWrelfrry5aPb7Gb82BtYS1aWt/KLQuLC98uS5mXU+RVtGaorH1futbixWKRcU3NrhsqNuI2ijYOLhp7qaqTR9LeCUXS61LK0rfb+ZuvviVzVeVX33akrRlsMyhbM9WzFbh1uvb3LcdKFcuzy8f2x6yvXMHY0fJjpc7l+y8UGFXUbeLsEuyS1oZXNldZVC1tep9dUr1SI1XTXutZu2m2te7ebuv7PHY01anVVda926vYO/Ner/6zgajhop9mH05+x42Rjf2f836urlJo6m06cN+4X7pgYgDfc2Ozc0tmi1lrXCrpHXyYMLBy994f9Pdxmyrb6e3lx4ChySHHn+b+O31w0GHe4+wjrR9Z/hdbQe1o6QT6lzeOdWV0iXtjusePhp4tLfHpafje8vv9x/TPVZzXOV42QnCiaITn07mn5w+lXXq6enk02O9S3rvnIk9c60vvG/wbNDZ8+d8z53p9+w/ed71/LELzheOXmRd7LrkcKlzwH6g4wf7HzoGHQY7hxyHui87Xe4Znjd84or7ldNXva+euxZw7dLI/JHh61HXb95IuCG9ybv56Fb6ree3c27P3FlzF3235J7SvYr7mvcbfjT9sV3qID0+6j068GDBgztj3LEnP2X/9H686CH5YcWEzkTzI9tHxyZ9Jy8/Xvh4/EnWk5mnxT8r/1z7zOTZd794/DIwFTs1/lz0/NOvm1+ov9j/0u5l73TY9P1XGa9mXpe8UX9z4C3rbf+7mHcTM7nvse8rP5h+6PkY9PHup4xPn34D94Tz+49wZioAAABjUExURf////fetffelO/Wre/WjN7OpebOhN7OhN7Oe97Fe9a9hNa9c9athM61a8WtjNacWsWca86UWrWUa72UUs6MSrWEUq17UqV7Wox7a5xzUoxrUnNra3NrWntjUmNaUlJKSgAAAIa/w40AAAAhdFJOU///////////////////////////////////////////AJ/B0CEAAAAJcEhZcwAACxIAAAsSAdLdfvwAAAEsSURBVHicXZDNjtswDISHP4ost8Ve9lYYu+//VoGxtwDtJfU6EsnSCdCmJQTw8IkzQ+o7jjozNbn6gr+lj8YRe53t/PY/WSPQZWJ9QneyyiB2QCrW5R8SXnd2Dyo6Pr4/E348IR2lXF6fiJjCWFWCHHLZlj9EbTC7SP6IEVO5K97JrTAckwyAeId+O3IkOYNnmDT6vBWizOf65ZhZ0QQ4KfvPK9eJnDTk4UMGGin2a0MqtW7KdCe5fTib37bWRcYoCGPODMqZGX4ij714wE41Ri8vl01RXPhYlHyvluvAp921saabAS7axXpRMerz1zh8alft2ctgdStpk5PSlfU6HTeeWXse24uapMaIDL+sldrMoJcf4NZIc4/Usq5YPhoGG3H9hOynkkmTbP4beIqL5HGYwHAAAAAASUVORK5CYII=);\n    text-shadow: 0px 1px 2px #FFF; background-size: 17px 17px}\n#empireBoard #BuildTab table tbody tr td.building.winegrower0:not(:empty) {\n    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAUCAYAAAB4d5a9AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAAASAAAAEgARslrPgAABQRJREFUOMuV1MuOHFcBxvH/OXWqurqqu6vdM56LZ3wZC5w4G8OCBSAQCCkSEjs2bBBSFlGMxIKd90hIvACWeAUktjwCQjFJhBNMhtie8fSkZ3r6Xvc6dc5hwYaFjcj3AP/f7lO8YcX8BZ7qPFxMP//9p+MPeTb7J23jcyMZcf/GPRbFnLTc8M2b32V3/8EvTVs97m4dvbal3oQ4Y0E6yqJgPJ+xTgvAMtMNx7mmcRW+ryhNhjY1ranelHo9orMrVJiE6fLkrXU9Z1VO0brGU4Lalqz0DOEbnIpZBjOGXkrj8q+GGF2CtT/J8vEHJ/VTTKdE1gLnBNZYdFPTESFeENDQoJ1Gu+arIQAOZz3p235vSCeaUBYtrXaUmcE5h0g0XQFN5jAJtJr/H6mzKSAinIkDf+c0zPbfDuRzgm6FaR1VZslmDnEA/X5Ar7NF38Tf34v2F222+rNzduP3R/8bsbpEeP6Pi+X4D+cnZ+EXH51xpS11CBZBMQe77lBHIVVkSasLzk7/9rNef/jT/tbtx73B4W+yzXTWG+y8HtHVHNXph+V8/L3F+UX49Mkzzk5mrCtBGA8JE0FgHG3XIFSJ2mk4LRd8/I9P2D3o+/f51q9uCRcn/VuP/htSALZZAiK2unq3Xpz/oLw4f3/xfMrkyyV5VXM9HvLO3j7KF1hhSW3Gy3RMXhSEMZioJfVrxuavgjnvHToYJbceZel01uvvoNpq0W/q8kdllv8wnZ+/v766CrPTBek8w5eSuNNh1OshBMSqg5CS5TKnsgIuQOxCnChMBWmz5ovqL8K04j3hBMng8FG6uZypJlv9bjOb/OL5i9Po2dPPOT27gFbwnaO7PDg4YFmWSCkpm5rxZkleN8yKDYO3fAZJRKsrZGCoU0e2dqhww8v6Q6E8+Z7viYvR8P5vVXH16uHl30/47NNjpqsNurZEgU/aVCRxxG6SsCoK5nXDvyaXTLOMOFHc3tlChYa8AuEE0RZIKTCNI+/MuXRPxG69++uoGh4rXaaIquXta9e5k4xY1TWx73OZbfjo7BWDTkimNfM0RbcGTwqGOz7Jnseq0hhjUYCnBEKAaaCtHZldMTHHUccd7KvWWPKmBiEY9npsDQbgHKuy4HhxSVZVaGsZdEMOt0cYYQj2S9pgTZs34AALtgYZgghA55AWFavehEqsUFmRc3w55eJqxXaSsNfr4Xsem7phWZZsioLtfp+v7e1xmAzRXsM8uSTfrDDWISRY45BW4EmwgBeAtQ6DxmJQSsO1KOKlvuLldEpRlgSeR9223EgSpIDr/T5HW1sMOiHnm5qrVxXCaKItiW4N64VjuC/oh5JaO6x1oAVSd5BOobJXOZFQxN0O803KYZIw6vWojUGbluPZlHVecjKf0REeZ4slxD637t4gcHA5zsgmGVHcIg8EnudopcOrQ5LikG4zQk1WCybrDUXdUOmWQmv2g4BICBZ5ThxGSF8hQ8WqLImSLl8/usm9u4coKZisJnySPcepKZ7X0lUS3Vh8EXBNbhOLHurmN45IP3vOnue4di1Gh4JxmaK0wzhLMuryzt277OxsIX0fKSRR3C97w93HUgj6vd2Hnduj7lg8xbhzrKyRQhJ4IUr6CCFQRw++TRh1qPP1fw4SwXxZMXkxI4ljbt4bsXPrwA227/wxCKMngOfgS+EFf0IIBt3ux3eS7Z+7sXl3nBeY3hQhwPdCpJDg4N+FYbSjpEdluAAAAABJRU5ErkJggg==);\n    text-shadow: 0px 1px 2px #FFF; background-size: 17px 17px}\n#empireBoard #BuildTab table tbody tr td.building.stonemason0:not(:empty) {\n    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAUCAMAAABPqWaPAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAGBQTFRFAAAA8d/I6N/WzcS26NG27Nq68ezjv7Gotq2fyLqk1s3EqJqRraSWsaSW2sit0c2/pJaIrZ+Rn5GDqJqN49bE39rR7Ojaloh639bIxLqtsZ+R+vXxsaia39HEjX9xsaSaTMajHAAAAAF0Uk5TAEDm2GYAAAAJcEhZcwAAAEgAAABIAEbJaz4AAADqSURBVChTpdDRboMwDAVQcBoTEqgDrkMAk/7/XzZM2tpufdt99NGVZTfNf9OCudhPYBE6138g69GHYeyvf4AAKYYhTL/Mkgf0M08hcnijmxFJZolVIvevlUwisHKc47u0IpT9Skhb7cSntAAnGNxFtdpTEmTyhiTtnlXHsb+8islIaTfzKcrXH/EkCCbt3aLOOVX9llSPSfkA1BLU6aTuHNsWs5cE4gXwXnjbmL86FjA7t66GThnKzMxx2yrcAKXuHIPr/ClLpfqgxh6ShOKkyjG6nO6lLHwe2xz1J55inIYwL+EALqXMNcsD5M0SNKvkKqsAAAAASUVORK5CYII=);\n    text-shadow: 0px 1px 2px #FFF; background-size: 19px 19px}\n#empireBoard #BuildTab table tbody tr td.building.glassblowing0:not(:empty) {\n    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAUCAYAAAB4d5a9AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAAASAAAAEgARslrPgAABJxJREFUOBG9wcuKZGcBwPH/dz3n1DlVXdXVPe3ETHomMQaSjYLEUYgv4CZP4VpGwQjZZOvChxDyFBJcBATNQjfiIgbNMEmc7uq6nfv5bjJCgwxMsvP3g/8DwTdw3RYQ8zg1b4cQTKMqTIrkTE4Z+2egttUdvo7ma4Rui9Sm7Jvtz7tm9+s2SH1QkozAWg1jWc7fTYmP+AaaF/DtBill2da7R9vD7v0ntbNHc8EkC3IZiJnUImXvrBYnH3ddPc1mc15E8wLj2CGFfLg97N77y5Wz2zTHFBmZkURheDJpoTr/y0Ttk+8/6XZPfGbzTxIcdXnG/9KuvTlxU/+DPkg7qgxFYiGGKa+qP17dHO0XjTePW4nMFGVISJmAQKsE/x5U2Q37D1y7Cy/Nzbhart+NKX3Ec7Sfuneaev/h08kUo52jCTgx+NLzGyPiaYjJxCiwUqGVJCZwISGFZDvBv652srm5kt9/sNb5ib4/jAPP04Pz+VXrsn8MpRG5RYrERmhzMbXvr0SDjgNSFCgh0BLGEEhSEBP0XcfjL27wfct07zTFRJsQPE8HNXurS40dMcgoUVJQY5icVrUuaBNEEiklIhGXIkSQDrabaw6HIzPpyYUXWRrfPFuflq69aU255paMQp4GlMiNpLAKKUAIGDHsYklnzojSMsXI6CISiUqCpm7Yba4JbsLmOcJkwo3tr/p2/0gIWU7NNbfkFCWNlygSF5Uh15KU+K+QQNkCYwuUtrgUiSnhXGCz3dLUNcUs5/LBJdXFA3pV2rE7vueG+mGYOm7JTPjrLA3ppm5IMbDMNTEmfIj4GBl8ososhVaYFOndwM1+R725QmnNnW/f4+TsLk6XRDsnRm9SnGwKjlvSCv+301x2wnV8frVDi0hhBD4mXEgMPoFULHPNMtcI5/BDQzXLeOXykrOLu3zZeD7bdAwBktQkNFFobslqNv/9+uTkt/fnKe0Oe77at5RWIgU4nxh9oO5HpFLkNsM7h02OV1/5Fm+9dsnd1YIgYNP1NF7Sy4UOMvtxWVala655Ro79oVnl+g+vLnV7nk082R459hMzq4gkfIhMIbDvHTElTnLNd++/zJuv3eflszmnpeW8LMi0YoySYzCia/ePur7/0Tj2PCONLRYIOV/Ol399YynB9zzd1xQ6oUWiGXq0jLTTQDNFLs9P+d7lXc4XM5QUOB+5t8z4zqpi8oLHTeTLLszGwE/L+bKcmg3ST/1PDofN7z7ftw8HNWc+K+nHkWPbU1lJZiTCGJQ1LErLS+uKKCW9S8gkaKeA1ZJ1Zeh85HpM1Mky9Yefjc3+h37qkM45u+/H/NMa/dlYYYqKRVVQT5HCaF6/s+SsynnjbMHr64Jn/rkdeFo7YoRMSVICAeQK+gBfdZpt54suqreL1T2ljbXjIjNTVTfZ3w+JrFqwynMW1rAqDOvS0IWc89wiBXx6M+JCZF1KaufZ947cS0QUrGaa4iA4tp62sKJP5heyH/4k89ni46xaf5iJhNtfMY0Dwzgx+QEjA1oLVoWhMBJSYpo8uRIYJRhcwihBTInBB6wSnGWK09JgZwsm7NxHsfoPqKt+g05SC1UAAAAASUVORK5CYII=);\n    text-shadow: 0px 1px 2px #FFF; background-size: 19px 19px}\n#empireBoard #BuildTab table tbody tr td.building.alchemist0:not(:empty) {\n    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAUCAMAAABPqWaPAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAGBQTFRFAAAA8d+/9d+W1rZ638Sa8dq29ei69dqD48h60baN9eOf+uzR+uio7NatupZs8d+f+uOR6NGRza1sv5pfrY1oyKRj7Naa//G6/+yftpFa//r1/+yopH9RrYhW2rpx7NGDIqezSAAAAAF0Uk5TAEDm2GYAAAAJcEhZcwAAAEgAAABIAEbJaz4AAAD4SURBVCiRpY/ZcsMwCEUdLQZL3iQZO8RC+v+/jJpMm2mat/IGZw4Xuu6fdVHafAS2BxzsJ9IrcGawf5kfQVllBvOGrPdKTQa1nt82Wr+svQ8xprTRr7Muu3L+uGLiVvPLutz8ovrjvCrizFG26Sf9tjt3nOsKJYkUnTfzrUzVja42gJozVcr5MW+vVKeqrg4JMQqXwvICheoJkUvFJETCTxDGE1N0KxLrClqYRJ7GeASKu6uFOCJUlsRfOX1Qrn1Yr7XExKkAlCwtx/chBB0jroCRmFNbB5R57pYQzDCYHdaHwk0GQMlzZ+00Tda61upE0exmV4CUtztm+xM5HuXJowAAAABJRU5ErkJggg==);\n    text-shadow: 0px 1px 2px #FFF; background-size: 19px 19px}\n#empireBoard #BuildTab table tbody tr td.building.palace0:not(:empty) {\n    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAAASAAAAEgARslrPgAAA2BJREFUOBEFwU1rXVUUgOF3rb3P1725yU3TWJWohEJxUJ1aOlBQiujQiQNnIo6c+gsExwqCv8BB/0HFoQNxoKK2tIJtKNUYaz5u7kfuOWefvZbPw4M7n/rRwY9/zufnbw/u4u5yPjt55+jJL48e3r3tR38/OJ7N5u9fXKzicrHg8PHPzM/Pbx49+f23+z994wd//JDPTo8/12ZjjuV/r1ruvhra7mbq2tdy7r/ou9P9jY0Gd3bykL4U93erKk6fffH6xOz8s747fGU6XrPVLDVo+kQWhx+6FLcg3nDr7VhD9lDqZfessaxxxljGh3Z1lrI+kEJ/jfHoA8nHm1EL8ICWLyEHd95zqZ/HR9dwNmmaRF2tqEYVcWMPimdoVwOr0wUXXcBCJPhDtptjoOFiLkx2XiW2s4RUh3jbos0lRhFUM+Rt3LbAJoRYE8uBsHhEoSvq8pjg0KVMu4QYz4giEBgIPiNKopKGGDYgNECJSCQUI4oyoN0B2ClVdKJMGcTAhdSuiQioOJGBJhplFQgFuGTAgICIEDwj7SmpOyYVNbFsEHrcA9kyigACIGgo0FihwRDJOAEn4gQEJ4ihPmBpwIeMqCFqSFAigAiIAAhgCAkk41IAEQccQzAcMHfAUUkEBRHQdQd5ANxx67HUkrPiFgFFUBRDLGPmZAN3MAfLjpARG4iHJ7CbYVOcInV4rsm2jdAQyIgouIKDO5hBGpzVGlJf0vZCEyGC899caLOjVSZURgiBUAZ8GNAwYK503cC6c1Zr6DGiDEgTaXulrJW4u1Ox7hLuznIlSOWU0qG0xGGFlHOMmvVizcnS6NewWQujQiE4rSgSIlruvMxkc8JkLNS1EgslFIbIgHuHWwIMCU4ZYdzAqFY8G4uTGX2XCGVF1MuvM+gYWd4je09OiZg6irKlKnukMnJOWDCq6LQ9LBaZfrai65Vm+hyxHhF3965/N2/Gb3G+pXn9F4MM5LZFfU4rJdovsWTkQdDRCKxlnXaRsMX0yh7TK/uMp1eQ+XK1N3SLj3SYXfXh4qkW+aZz94bqE0S3Qd4AuwQ+x/P35PyYlG89tbR9Oyj36o2tF8qqOhJ3BxDA2y69ebE8/Xpxdv/aOM4QE8ymuAfAwM/I3tGynyY7+99uTLY+tpz/GY8b/geGd+pmTCUDLQAAAABJRU5ErkJggg==);\n    text-shadow: 0px 1px 2px #FFF; background-size: 19px 19px}'); if (database.settings.smallFont.value) GM_addStyle('#empireBoard {font-size:11px}'); if (database.settings.hourlyRess.value) GM_addStyle('span.resourceProduction {display: none;} #js_GlobalMenu_wood, #js_GlobalMenu_wine, #js_GlobalMenu_marble, #js_GlobalMenu_crystal, #js_GlobalMenu_sulfur {position:absolute; top:0px; right:0px}'); if (database.settings.wineOut.value) GM_addStyle('#wineOutTable { display: none;}'); if (database.settings.onIkaLogs.value) addScript('https://ikalogs.ru/js/etc/script.js'); if (database.settings.newsTicker.value) GM_addStyle('#GF_toolbar #mmoNewsticker {visibility: hidden !important;}'); if (database.settings.event.value) GM_addStyle('#eventDiv, #genericPopup{display: none;}\n #redVsBlueInfo, #redVsBlueInfo_c {visibility: hidden !important;}'); if (database.settings.birdSwarm.value) GM_addStyle('.bird_swarm {visibility: hidden !important;}'); if (database.settings.walkers.value) GM_addStyle('#walkers {visibility: hidden !important;}'); if (database.settings.controlCenter.value) GM_addStyle('#js_toggleControlsOn, #mapControls, div.footerleft, div.footerright {display: none;}'); if (database.settings.withoutFable.value) GM_addStyle('#buildUnits li.unit > div > p, div.buildingimg > p, div.buildingDescription > p:nth-child(2), #tavernDesc > p:nth-child(1), .content_left > p:nth-child(3), .ad_banner, #premiumOffers p:first-child {display: none;}\n #buildUnits li.unit > div img {transform: scale(0.7);}\n ul#buildings div.buildinginfo img {transform: scale(0.7);}'); if (isChrome && database.settings.withoutFable.value) GM_addStyle('ul#buildings div.buildinginfo img {-webkit-transform: scale(0.7);}\n #buildUnits li.unit > div img {-webkit-transform: scale(0.8);}'); if (database.settings.ambrosiaPay.value) GM_addStyle('#confirmResourcePremiumBuy, #confirmResourcePremiumBuy_c, #premiumResourceShop, #premiumResourceShop_c, #premiumOffers tr.resourceShop, div.resourceShopButton, #individualOfferBuildingSpeedup, #premium_btn, div.premiumOfferBox.highlightbox.twoCols, div.actionButton:nth-child(3) { display: none;} \n li.order {visibility: hidden !important;} \n #js_viewCityMenu ul.menu_slots li[onclick*="view=premiumResourceShop"] { position:absolute; top:-1000px; left:-1000px;}'); if (database.settings.noPiracy.value) GM_addStyle('#position17, #pirateFortressShip {display: none;}'); if (Constant.Buildings.PIRATE_FORTRESS !== 0) GM_addStyle('#pirateFortressBackground{visibility: hidden !important;}');
        //jQuery UI CSS
        GM_addStyle("/*!\n* jQuery UI CSS Framework 1.8.21\n*\n* Copyright 2012, AUTHORS.txt (http://jqueryui.com/about)\n* Dual licensed under the MIT or GPL Version 2 licenses.\n* http://jquery.org/license\n*\n* http://docs.jquery.com/UI/Theming/API\n*/\n\n/* Layout helpers\n----------------------------------*/\n.ui-helper-hidden {\n    display: none;\n}\n\n.ui-helper-hidden-accessible {\n    position: absolute !important;\n    clip: rect(1px, 1px, 1px, 1px);\n    clip: rect(1px, 1px, 1px, 1px);\n}\n\n.ui-helper-reset {\n    margin: 0;\n    padding: 0;\n    border: 0;\n    outline: 0;\n    line-height: 1.3;\n    text-decoration: none;\n    font-size: 100%;\n    list-style: none;\n}\n\n.ui-helper-clearfix:before, .ui-helper-clearfix:after {\n    content: \"\";\n    display: table;\n}\n\n.ui-helper-clearfix:after {\n    clear: both;\n}\n\n.ui-helper-clearfix {\n    zoom: 1;\n}\n\n.ui-helper-zfix {\n    width: 100%;\n    height: 100%;\n    top: 0;\n    left: 0;\n    position: absolute;\n    opacity: 0;\n    filter: Alpha(Opacity = 0);\n}\n\n/* Interaction Cues\n----------------------------------*/\n.ui-state-disabled {\n    cursor: default !important;\n}\n\n/* Icons\n----------------------------------*/\n\n/* states and images */\n.ui-icon {\n    display: block;\n    text-indent: -99999px;\n    overflow: hidden;\n    background-repeat: no-repeat;\n}\n\n/* Misc visuals\n----------------------------------*/\n\n/* Overlays */\n.ui-widget-overlay {\n    position: absolute;\n    top: 0;\n    left: 0;\n    width: 100%;\n    height: 100%;\n}\n\n/*!\n* jQuery UI CSS Framework 1.8.21\n*\n* Copyright 2012, AUTHORS.txt (http://jqueryui.com/about)\n* Dual licensed under the MIT or GPL Version 2 licenses.\n* http://jquery.org/license\n*\n* http://docs.jquery.com/UI/Theming/API\n*\n* To view and modify this theme, visit http://jqueryui.com/themeroller/?ffDefault=Verdana,Arial,sans-serif&fwDefault=bold&fsDefault=1em&cornerRadius=4px&bgColorHeader=F8E7B3&bgTextureHeader=03_highlight_soft.png&bgImgOpacityHeader=75&borderColorHeader=ffffff&fcHeader=542c0f&iconColorHeader=542C0F&bgColorContent=f6ebba&bgTextureContent=01_flat.png&bgImgOpacityContent=75&borderColorContent=eccf8e&fcContent=542c0f&iconColorContent=542c0f&bgColorDefault=eccf8e&bgTextureDefault=02_glass.png&bgImgOpacityDefault=75&borderColorDefault=eccf8e&fcDefault=542c0f&iconColorDefault=542c0f&bgColorHover=f6ebba&bgTextureHover=02_glass.png&bgImgOpacityHover=75&borderColorHover=eccf8e&fcHover=542c0f&iconColorHover=542c0f&bgColorActive=f6ebba&bgTextureActive=02_glass.png&bgImgOpacityActive=65&borderColorActive=eccf8e&fcActive=542c0f&iconColorActive=542c0f&bgColorHighlight=f6ebba&bgTextureHighlight=07_diagonals_medium.png&bgImgOpacityHighlight=100&borderColorHighlight=eccf8e&fcHighlight=542c0f&iconColorHighlight=542c0f&bgColorError=f6ebba&bgTextureError=05_inset_soft.png&bgImgOpacityError=95&borderColorError=cd0a0a&fcError=cd0a0a&iconColorError=cd0a0a&bgColorOverlay=aaaaaa&bgTextureOverlay=07_diagonals_medium.png&bgImgOpacityOverlay=75&opacityOverlay=30&bgColorShadow=aaaaaa&bgTextureShadow=01_flat.png&bgImgOpacityShadow=0&opacityShadow=30&thicknessShadow=8px&offsetTopShadow=-8px&offsetLeftShadow=-8px&cornerRadiusShadow=8px\n*/\n\n/* Component containers\n----------------------------------*/\n.ui-widget {\n    font-family: Arial, Helvetica, sans-serif;\n    font-size: 1em;\n}\n\n.ui-widget .ui-widget {\n    font-size: 1em;\n}\n\n.ui-widget input, .ui-widget select, .ui-widget textarea, .ui-widget button {\n    font-family: Arial, Helvetica, sans-serif;\n    font-size: 1em;\n}\n\n.ui-widget-content {\n    border: 1px solid #eccf8e;\n    background: #f6ebba url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAABkCAYAAAD0ZHJ6AAAAfUlEQVRoge3OMQGAIAAAQaR/Iiq5u0oEhht0+Etw13Ovd/zY/DpwUlAVVAVVQVVQFVQFVUFVUBVUBVVBVVAVVAVVQVVQFVQFVUFVUBVUBVVBVVAVVAVVQVVQFVQFVUFVUBVUBVVBVVAVVAVVQVVQFVQFVUFVUBVUBVVBVVBtVtsEYluRKCAAAAAASUVORK5CYII=\") 50% 50% repeat-x;\n    color: #542c0f;\n}\n\n.ui-widget-content a {\n    color: #542c0f;\n}\n\n.ui-widget-header {\n    border: 1px solid #ffffff;\n    background: #f8e7b3 url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAABkCAYAAAEwK2r2AAAAY0lEQVQYlaWPMQ6DQAwER/v/7+UhQTRH7N00QEESiUAzki17vOb1fEQAR8QDpSaUmhHkYwSAb4LEKD2vAryc3/2JpFC8IDzWfHgg0qcEd47/haT3VEZxbWUKQW89GhFffeEi3kGvSQXcQU8oAAAAAElFTkSuQmCC\") 50% 50% repeat-x;\n    color: #542c0f;\n    font-weight: bold;\n}\n\n.ui-widget-header a {\n    color: #542c0f;\n}\n\n/* Interaction states\n----------------------------------*/\n.ui-state-default, .ui-widget-content .ui-state-default, .ui-widget-header .ui-state-default {\n    border: 1px solid #eccf8e;\n    background: #eccf8e url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAGQCAYAAABvWArbAAAASklEQVQ4je3Puw2EABAD0fGw9F8KFSFqgJTgCPhEFHBCmzxN4sCs8/QToGmaz7JvC5JgMiAnhbEwjoiFPpXUXda1SPyHM03TvHEAd0QJtjgD5PAAAAAASUVORK5CYII=\") 50% 50% repeat-x;\n    font-weight: bold;\n    color: #542c0f;\n}\n\n.ui-state-default a, .ui-state-default a:link, .ui-state-default a:visited {\n    color: #542c0f;\n    text-decoration: none;\n}\n\n.ui-state-hover, .ui-widget-content .ui-state-hover, .ui-widget-header .ui-state-hover, .ui-state-focus, .ui-widget-content .ui-state-focus, .ui-widget-header .ui-state-focus {\n    border: 1px solid #eccf8e;\n    background: #f6ebba url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAGQCAYAAABvWArbAAAAR0lEQVQ4je3PMQrAIABD0Z/o/Y/Wk3RwLBSqg0KXHkBKlkeGv4SrHd0AIYTf8twnBmEkDF5IBTMxlupaM1HB0ht7hzMhhC8GEiwJ5YKag9EAAAAASUVORK5CYII=\") 50% 50% repeat-x;\n    font-weight: bold;\n    color: #542c0f;\n}\n\n.ui-state-hover a, .ui-state-hover a:hover {\n    color: #542c0f;\n    text-decoration: none;\n}\n\n.ui-state-active, .ui-widget-content .ui-state-active, .ui-widget-header .ui-state-active {\n    border: 1px solid #eccf8e;\n    background: #f6ebba url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAGQCAYAAABvWArbAAAARklEQVQ4je3PsQnAMBBD0S9l/8kyTFIaDDkXBkMgA5ig5iEdXCHafZYBQgi/5ekXrlmFpQNLxmDMTOv2rrU+kHYYE0L4YgB9ewvfYTVHjwAAAABJRU5ErkJggg==\") 50% 50% repeat-x;\n    font-weight: bold;\n    color: #542c0f;\n}\n\n.ui-state-active a, .ui-state-active a:link, .ui-state-active a:visited {\n    color: #542c0f;\n    text-decoration: none;\n}\n\n.ui-widget :active {\n    outline: none;\n}\n\n/* Interaction Cues\n----------------------------------*/\n.ui-state-highlight, .ui-widget-content .ui-state-highlight, .ui-widget-header .ui-state-highlight {\n    border: 1px solid #eccf8e;\n    background: #f6ebba url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAjElEQVRYhe2UOwqAMBAFx2DlMbz/kSS3MIUIWij4aZ/gK952YZohu0y3zNPGOWur3Kcfxsf7D16c5YBD0FUOoDjLAdeKHeXWVi9BRzk4f9BVDqA4y8HrBt3k0sEveDqo8nRQ5emgytNBlaeDKk8HVZ4OqjwdVHk6qPJ0UOXpoMrTQZWngypPB1Vu38EdG7NcOPXFHAMAAAAASUVORK5CYII=\") 50% 50% repeat;\n    color: #542c0f;\n}\n\n.ui-state-highlight a, .ui-widget-content .ui-state-highlight a, .ui-widget-header .ui-state-highlight a {\n    color: #542c0f;\n}\n\n.ui-state-error, .ui-widget-content .ui-state-error, .ui-widget-header .ui-state-error {\n    border: 1px solid #cd0a0a;\n    background: #f6ebba url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAABkCAYAAABHLFpgAAAASElEQVQYld2PMQ6DUBTDbP/7X4grde/6GACpjN0QS+QkyhC+n20CeI3MQChJJ4GEka7LEtkiRsJF2llw0G02SP5k0oxPOP2P7E3MCpW4kdm7AAAAAElFTkSuQmCC\") 50% bottom repeat-x;\n    color: #cd0a0a;\n}\n\n.ui-state-error a, .ui-widget-content .ui-state-error a, .ui-widget-header .ui-state-error a {\n    color: #cd0a0a;\n}\n\n.ui-state-error-text, .ui-widget-content .ui-state-error-text, .ui-widget-header .ui-state-error-text {\n    color: #cd0a0a;\n}\n\n.ui-priority-primary, .ui-widget-content .ui-priority-primary, .ui-widget-header .ui-priority-primary {\n    font-weight: bold;\n}\n\n.ui-priority-secondary, .ui-widget-content .ui-priority-secondary, .ui-widget-header .ui-priority-secondary {\n    opacity: .7;\n    filter: Alpha(Opacity = 70);\n    font-weight: normal;\n}\n\n.ui-state-disabled, .ui-widget-content .ui-state-disabled, .ui-widget-header .ui-state-disabled {\n    opacity: .35;\n    filter: Alpha(Opacity = 35);\n    background-image: none;\n}\n\n/* Icons\n----------------------------------*/\n\n/* states and images */\n.ui-icon {\n    width: 16px;\n    height: 16px;\n}\n\n.ui-state-error .ui-icon, .ui-state-error-text .ui-icon {\n    background-image: url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAADwCAMAAADYSUr5AAAA7VBMVEXMCgzMCgzMCgzMCgzMCgzMCgzMCgzMCgzMCgzMCgzMCgzMCgzMCgzMCgzMCgzMCgzMCgzMCgzMCgzMCgzMCgzMCgzMCgzMCgzMCgzMCgzMCgzMCgzMCgzMCgzMCgzMCgzMCgzMCgzMCgzMCgzMCgzMCgzMCgzMCgzMCgzMCgzMCgzMCgzMCgzMCgzMCgzMCgzMCgzMCgzMCgzMCgzMCgzMCgzMCgzMCgzMCgzMCgzMCgzMCgzMCgzMCgzMCgzMCgzMCgzMCgzMCgzMCgzMCgzMCgzMCgzMCgzMCgzMCgzMCgzMCgzMCgzMCgzMCgzrDkZjAAAATnRSTlMAGBAyBAhQv4OZLiJUcEBmYBoSzQwgPBZCSEoeWiYwUiyFNIeBw2rJz8c4RBy9uXyrtaWNqa2zKP2fJO8KBgKPo2KVoa9s351GPm5+kWho0kj9AAAPhUlEQVR4nO1djWLbthEGyUiq5YSSLXtp7FpLOmfzkmxr126tmi2p03RJ1/Xe/3EGgARxPyAgRbIk2/hkSz4CJO4+HsE7AJSVysjI2AMUUOxahZ2iANhzBtZWr4BoIRSYAVN5u4QwDwQDRbcwfUi5KS3wFuDmFnQLa4Dtb//cqktwD5QEFFwfUs7PoCCA7y4bEJVFizcIob8KmhAplwwqVjt+9FBl3uINQniwEiryEyw9JHqGpQdEFNi+B4QQ7QOiHhysIPoAxUqxvdvvA9K42bsAv4S2fxfYOe57IJSRkZGRkZGxx7jxSHDHcRBXQMTyIjInBgHwBJ/bEx8PEANC+uhbpSSggCBAVODVabpI1S/k4WLZpTn6NpMhoX9Y40hxYERFpMcqUs4AloCtDQdID1YhnyXZ2hLjAYWiO9Dy1PDB7tPhIqLx+uMB8grZaR+Qxl2/C2RkZGRkZGRk7A7rBf7J0DR5/LUTjzUPIPSPGvQJiVJiB7kcQCiUOJrcFNtDZIf2xarQ3aGvLNxAVIFAabz90BFiBIlycTBhgWwOWCH0FLYHlPqwHaCvcIn2ZbosCevfPTRiFFcgvHukCjWwrc3GrGh1fsAof8EaUReKXkCB4/MzFNo97qLpFiKFYv/kNR5YQxQbQEofkZ2OuEOHqqT6gFTpru8CN7x/+jaZkZGRkZGRcV+x/rLUNcMMqUAscgnFocmpqkTzqymwVAPxfJ5PnIUUQOUKT04tEdWZyv3JCQSn96WS4pD97QfyW25A7NhSAbyhmVj0FEltA4vdiygBibXhoUYgykCUP7HwPTDeEqAIcHVMkZg7Zx4k0uFANs63hPQXCoRLAwdgGsr9Az7Qv7sgQGgg1aPl/BJLExBWgG4RFRLFImGmIquPC/klEGyCG0AuAXaJJC+B8FVe9NYQDEcXB8g6AQcjYJ1goJIggHWCrFR0S6kRHN5+4BzFi8NaoN35NRxUvL+JJdZr7PV4wK6fj8nIyMjIyNhr3OxdXAYq7FHZwB6bDSzSh4sF0utChqo0NAvaT1hLzXwFinmCzmeDucEQK18TTaQoFgP7bNC+RZ4OT4T6gQogDFYk+1QxQlj19QGSAWKiLYp8P0Ag1Gbz1ULfWHLg9iUnQNK5QQJcukm04blKLH2GgEJCY+HzXAZWCvHKco3Bp6MIaCjSXXRJyOxeqhnzEaF93MfFGW/O16ZvDL5TM4MJIjujz/cHypkQuuzRwWJ93BKdIt+wCRAPl9kpe2Ikkb2mFgGlxh/i40d3EHfdvoyMjIyMu43ylt/IAmGHnN5iIt7wKfbv01RAcJqFRl9lcjYQSnbQqKgC4fYOwSJt6N6trE0twZ9kN/PqNpTQeICvr4TLsDYC06U7BMjshS+v1/aT7IwQYD5LcgRQXMT2FrBfBLjZ6151jDElk9tPFfpUgk2yregusX25BJbwAFEfM+YI6vGAti4bTtizB+TjfQCrERyhKb2X8D6A9wX75P4t4neBYJeP6pdhg/gQl8MWvytzeSTjgOQBynQdh/iXKdxOrGJ/RkZGRsb9QmXihGr5+g8GGg9uTh+KoVZuNIzV+CwRucFBEyr1mVjx4irOxwM1BhirB6Q+2eNQi4eqR+aF6mELtoMzCR7V9RAFe/ZvQogNiyY8FPSUTFsLp8TeTmMui5mtw7bcaT0Yw2AA4wFRQIlkgq+1DQrNhkmoxS5Jq+u6bMAIGRECEANgXHTgWzwgBOhDH2l0oTQ4D8D5NMktBgNywAEMjo8rwATMZrPY7JGxBoJCkIBDQiAY09EGTUiBCWkUpISfGPR5AAwBfZiG2z7Ayc1yeKTxid39xBNwfHr4O0LA48ePFTvhYrF1r4tyAoz9n2MCqEuBtp/6GDR0oAYfG/R6wJExHYZHfhygsv7fEWCOj4bYmsP5A+pL4MkTfAnMlD4F+r3bobKvTyTA2P/w7PN+Agq2QW8piqMCpTBwenoKvX0AHGkGtP2YAPvTEWA7QUTAudn7/NxtOG46wWNmDtpBEkBzN7rBEvAFHp+YTB/q97qPAN4gHFqgBi8uLsC7qPCA6mg41G/+ErByPwEXDdoNxRhOx+M5jPEzQugS0ht+b1/Y3gEnYMAIAOIBE29/hIDucE8tmMsNOgK4B1RHFu4UCRlMHzv0xzcajcfdXWDs2h8TArBCkoDUJYDLmz6w7ip3BFS0ve5wTRwAn6keMA9I3QYbfSZ0DKbyt+7OXjGI1idPcfNyAyfAMlCrzaGqphYrxHocLHRJVycnfGUcbtT+jIyMjIw9x7Nn8fJSzG0TmFtO8rZT+XT3S3ub+tKJbbLd5diTVp50+zahyeHSslJ/YPrU0fuazrZO2CZ92/ZCCVXlGRiZKPJyPPRxyIFWeXLQBXJBKiq/3divEAN6ZwM200Qjm7EJBZeWm/PRWVCbYK7s7u2l4XaCz+lzgOfMfhMonXr7TWzeZb98dbgIzBT8Ub8eYYUqfZ4rVJ/MDbIDgPqTulJ/xvntWAtjIisqnwxOkGz0n077FARoY79GdA6HPE4rOy196NiMWHTZlSSApcOgXpy/fHV2joaNKu3ffsAnRcBf4K/6NcIG6tIxk3HyoXPjASqfUgXbYN5PzpL2njkR9QMjeDTVHDTCgRuxOegjoO0FvKzP/t/gmVdI24+G7NIe8JX6Wv3dDyldMA+4YB5wwTygtd+dwRqaTqrLb1l73zTSN52CNpnHuQOYPsDblybgxfkXh/oVtr+N1DEBJdhRJyd/Bd/q1z+cbNrD17iVKyajcnv9arhOkRPgsruuD6DmNPwpDNrLw2CoTgHni4yALr0L29+tiKAEIPn868ejx//8rpWP3OEOl5On9OwpcQm0MhafP/ey8f1uvDNIgGLQG8z4YO99ENgg95etwv4uYJYY8fUGHYH6j6fscHFZMftlAl9i+9XL73X3N/n+ZStOzfVfRvYXhrbdKOpEgVQTg/wsDuDD3kwOfQNMTJ5y+/ltUDWLunyxnRF46IqlBzGMY4X7inggREFioIyMjIyMHWCIB6ZNKAcXseo3vLTQTkVE7348dlwJJSz0+wLfmi8BhZqfw3D4ww/wHVLnEd5/fgYvXsDZ3MlsvYUbbnDjDZ3MN3TJG4+bxjAaDl8TBri9qxEw1ccao2wTNAMLHo2f+sjrXwb/9qHoYqgPMBXJTVfOpmrZH23y6uvo0LHSyY6fHGwKfHJlAuMFvObjDYrIqxBgQi20h7Hd/nYVLmno+eaNUm/eeH2GCuopntnhBJAlI2AHo9CCh1I1QxUdAbqqGY9BBLwyc3W4wYVhvY8A4BoIc1l5M7vnPWphZW9/Ses3n37y9a0uGqFwFQZsQQbd386DogpgEk+dzynsAZMJXq8+ns9NeukJ0PYrNATGGefJQlhkLo7DTXr+y3bNiOsDvrXTz/C2q1DXZH84iRNwrP88Nj+u2DjYEE6RBxD9Knj16ujVHC67A7422o02RwD3gB+t7EblWvu9geOFxSnd3ROmT+nJyQkhoPlsxVONc/3TEdBos+jtA+ZzcwHgTvD1cDjaYCcItA8w9i88A8b+mqSjc6Pvqd998QguEQPmQMeo23ODN86+p0/bn1buBkT6+oBhNZ/PYY4ZAHYb3PRd4LkZmPX68NRtMZn4ASvdA+qf0jMA5MP9eeg28Nug9QiLnj5A33U1MAES6xHAUNpz/9zFAYE1gqQDMT3G6xI9pwdw/aIgKoHCS1YGlRnSq9yCjdXjgN3j+N27YyROHxmuNAeNKPpYuXIyIyMjYy0M8eros59MF/PT2c602T7eA7zvhJ9dr/vzDjXaLp4Yc5+0wllzxzHv3gdmMMM7/CcQzKgVBqYTmFn+Z+mKm8J7k0A5F/jgCfjQ1WBhQyiOqD0lYuqBb+AyzMw9Ha2G3m6c8qQx+AlqnIceQp+Sb6i9UyQWbhr54+AjnZ0VzW2TAN0DmBT6PWmc6jDBE2PK2u+nF43dyP7Q0t1pOcX2fdRvH0mF2Q4JqN35rnHjVIeaXfIAVyUuw/aHCCiJy9iF5l1621zweI8KZrPZ9iJdb7DXJ3US0OSrtZ10imt7wHY7QesAzUMz1oZ3noB3qFJ/H18j97FYuw8QDN4oeKf30osvcSW2ExLo+VcbuAuo/sUIm8fMG9xocO3Ea19J9gFYivnHJ2KnyfovZlgW3v6ySx32abQiIyMjIyPjhlFDTLxpwIgFMnTp6A3g4IDKNY+stkwAMAoIAbasxBXqUWneSAWTMjt50lTqT29rFjvXohjsDNm2YPXDFlICmrJOZ3t6tHm8AiEAl0sCeLIIorIRt+cFbew/QRsoAXb4o1XSfoywzm0FTMAoYBNvLyFu8v8HpLBtD1iKgC17wHb7AI6d9wFbvguAIGTHd4E9wG7jgIyMjIyM+434c2R3HeV/Ffx6jtZu6ijl8h59T655jhR+rdHzDOP6beABCheb8O8/WFXeOyzgf5oAhVYnKxP7CwaAf1afJu8bSrhS6tdaXeGnrRenOqOlz9d6QwYnA/3TLd+GE7qe3chA5YF5DfY0vK3adfOX/gyNp2BW25MHdxAB9qvRiiP3/XpQQFGYDU4+Mi///XumXG8pjvaUAOsBGlf4jJt+YYEzeEzAdw06F19R3juM7D1wita86GR0CKfDHgLuXCc4Bri6vMLdfjMc4VNSUNsdodo2xu/1+Xl/K5+az8jIyMhYG/z5gJTMF1GtKq/a3rpyCvz5gJTMl9GtKq/a3rpyCmfQ4WwZmS+kXFVetb115ST48wEf/AGcfG1iw+tWbpbS2vJ3nQxcVr3lH3z5h972FUTLzYpOVk7l5hD+eYcYwDcAnewOotrZ4OtrPDucqi/LRX0/RR4qx7Nn4U8g+qjffvuN6Gf+nC85vwauHjaYyubqvWYKY4VEfSUMitdnBCT1Ue63R5439m+OgCn6DroAAaHPVQxKth/wkJgHmG8bmQMsT0D6EjDfvhVRKO3ywOQUgRA7nmL1uawZmHf1k+DPBwQ6NdcJ+k6Md1LA5f5ONdhJ8vZ5J0vLHT99srkGOjmJbd/G1r2Nriqnse1AZt1AalU5jW2HsuuG0qvKGRkZGRkZGRG0gcONyXsP9v8D0/IdJADiBNiXl3327WRGgOL/9HC/0XwlIURkRhC4tz6Z/fu7fUf2gHvfB9z3u0BGRkZGRkbGplHcnkgguQoSqtUXuhbs/wPtMwqV0HUJAvj5vk32b8IDuL23yn7qAXZ5u32hbRX7d3o82Df1FZXvbh9QOfhyxldr/+3xgXU9oKmvsHyr7F/XA269/eveBXrsv7N9QALe/tvjA0kPWAXGbvebkbHn+D/J5nMcHzx1UAAAAABJRU5ErkJggg==\");\n}\n\n.ui-icon, .ui-widget-content .ui-icon, .ui-widget-header .ui-icon, .ui-state-default .ui-icon, .ui-state-hover .ui-icon, .ui-state-focus .ui-icon, .ui-state-active .ui-icon, .ui-state-highlight .ui-icon {\n    background-image: url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAADwCAMAAAGvTnpvAAAA7VBMVEVULgxULgxULgxULgxULgxULgxULgxULgxULgxULgxULgxULgxULgxULgxULgxULgxULgxULgxULgxULgxULgxULgxULgxULgxULgxULgxULgxULgxULgxULgxULgxULgxULgxULgxULgxULgxULgxULgxULgxULgxULgxULgxULgxULgxULgxULgxULgxULgxULgxULgxULgxULgxULgxULgxULgxULgxULgxULgxULgxULgxULgxULgxULgxULgxULgxULgxULgxULgxULgxULgxULgxULgxULgxULgxULgxULgxULgxULgxULgxwjo40AAAATnRSTlMAGBAyBAhQv4OZLiJUcEBmYBoSzQwgPBZCSEoeWiYwUiyFNIeBw2rJz8c4RBy9uXyrtaWNqa2zKP2fJO8KBgKPo2KVoa9s351GPm5+kWho0kj9AAATX0lEQVR4nO1dC2PbthEGyUpaqJii/JgbZ3bTLNmyJns/Oi1bM7vp0q7r/f+fM+JxwOEAkNTTSoxPlqHD83AE7gAQBIUYBHSfQv0XnbsJgH02A3g5ibVzDFNtlkPI1VjIuOUa8eMclOLS1uRSPBETURnOrkbmID9T9fuPyu+cSGYYKya5efeddN9TRS1H8eD4kDjrPutBpptt2apkiqX57A4gfloj7ua9AXMQ3dWvNs8n7NCwZk6bqYSg1CgNsaCBHDAluMQjcihEWBNYSxamUYNMs15KmwMUKhm0S5UBwMQFjcqxelSYskHBtLC26X7/eWQtVB1MaWXzF1OrUyhLgOrFiBwalDwg6+tigfzbnNbM40UlTrrO3clTftcuX7jyY9gkv81RVWI9K0OxNa8Hruw+EFctu6xaqDhCGkjQ2hyMitiXKyR+7xSqx6u6AitlpI3wrBj5OSo5xv8ZShoq5VZE+p/hb/OVzuPHyHGXQLoug9b4af/OzArAqtlvq8PidqZSflOYigVIpTZ33192wQ1jHVXLgjWWeZdAfhn3UteqH43NI9EGSjns7CJ//g8h6o6++UrLBTrOZJUkhy4NxDNAblZld53kJZl34z4jE5cB0HbA5RHnzg9Txud28wwG4aS1pwzKH7t/IyxlEvW2XVQLcf0vyeCWfL9j39vk95iA1alinhtmcHDr34tiSDECRgCXwFMgynMfrB0PlAxMhdUoPyKDo7qq2yNZHa+Li9BQoynz/I9DNkNcFCQSVi2aQbTOJA7S1tIXYpwM9t+PgBYzwFI0mNdt9JjxuGBHXJuwuJO+fq8KYzpDLtDll1XoYZ6k53P9dUNdNzwQZTcsvLw0Cafa0snfyq/WGVUVDo/VxBxXF5ynLZn6zUO/FvTIdjeiw3VUeyUqv7Q5+dIiz+W/VoTs03r+4U/ERpyHVbkIFAU44dGMKQBZfrwrGeAl4litNO9TVGFXRN1TDlfTyGVqdQaVEV7T0ZNJGO/NTQ9nL18aDk29b2Ui2SaqfhltIIMn4gpz+k+TiNNXkjf0LYWzf+DXO4UzHuF49WYS9pIIN3mjcoga1CNDuZ3kKzlja00XXS71OHFZjBhkI1K98WCQ/QC/r9n3qudrYVVea6aE9iP8L1A/KnWuJMZ+jwiyz+P3SFkcguW26os1MoON1p+35uAIgB3fXnzm2hscgvkD0PBi23t8YcEsP2u+gEUvdsXAg4VrA0y2zD/ZBgCjbz07ZNd4bBvYHQMPFcBFznsTv/hBOj9hkE0yvyRHcYZCK5VoEwGHQwU+dJBlX08BOMGx8MBk+I2oMHdQbLZFkGDADfVBQcmCx8Nb6S6fwJqRehFktWEAVsSA0yNP5DQm8wcW6tNr9D/T6PzGVgS2gP3iCoyPB/L4YF2A2ZICUKoZI06GSjdZYhdlxzeOLANIWxfoGkaofzK2BDRlWaq76VMAuRDbiXyhQiYTtV1L7hBS64vLpRJ/xbYMQRcPVPRT4802P5ruaHvrAv3BtDmzxwz3IsFcru92uL4GysByOVV7H4Rx7Xaqax2xvqiNEQId74svvjAcglfgwis/o+vnFdpxsCJHV8uomprlYHfNpPvrV79B4+G75+dG5i3NEGBh0+urAGWrXZ1uItAYmWJNQl28cCs1pd6/AX+c/Q0znEddU8OOLjEDWWF4qcsp8d7DgweI1Vv85bs8or6kK+g+8scLc22/Ed/oVI3WF9iGKrNzybSd8sQsS9u2sFyqiPXbaWpgH2Xg3x0Dclm+whsRABfKOXlh2tCpCqhMo3wGz54pBkxbsAxUN0ejCKbq/xXAt/dS/BPA9VC+EFC6jiTkrS8w3Raj+Sp2U/vcdFdGprxDRcPbAOa7LwYyOtEZlWh08EyUjdA/GtU4Gjs+bDxRN0bi6HbezUEZQGzNwIMHiB+NDMugG1UD7o4YwLne9MIbbEYGKNT9dIA2gLs/ALzrc1PphlwOAO/BC/n7Vk/DuL+lE67wdleAuQEH8sEik0/U0KMNuDMF3XWkvO3+wdDEFZQm6Vh6pAX47qfXeHYGMwcMXHc/wHc/PQYyAslWXNUPjNf3xEAlocNxqJjbQEYcW6sHO6bEH/6+VSgKf75S2AReOLiEa5Y/dEuF3/yKd0ootu+mvgQCzYt04TNUmPsNG0tga4ze+ZSRkYK3DiJCPYDdAb2ZHiiA78JZt/yge6XcIk67fLbVA1jASD1QILmlBDIy9o7Bxsn1APMeG5/b6SB9cHc9sO9sApTgPNXfXbJUuC2AxWPjjUiOzI3Hc8UmphFJCWQ8eAwehjEYbs2338j4cD+Vn4vgNfOwURsvXhxPDzwDay39+UVkOhCsiHrhwPovDyfxPIXC0xVJPeBqWlCPgvVzJ0FWgPEtyGZUxuCe9MB9zUcydgZ7BdksfFhBGKTM8tg2BkGHTlnJuEKx/d56r9m6gRXF7+ByBiJW11NAm8AoCKvj9HyfP7SfkkAwkjq0nc/jio8frDsFw+P0cYU7uvrh4NWz53avCrHwyOAuOAhvZiV6HVMIUk/uyA6GEwJGl0bReIzu8CZc0AY44o0gd/9PBvIcKObhX91HzAPMHrUK2L0tqD/T/oAbEAVx56B3qorHj9VZBNJHBTSN2lQrThpbkD4EC/RmWWQAhN78BuA2yanYE9x9e1pp9+yMdWug0QXeRJ+b8krTnxr80fGjU1xeegxMBSx1Rrr8EnS8y0t5aIIQ9RN9auPZZHJmJOXNM9w8QTEwh8efewwUGHE+n+uI1zpDZKCaLpfGVcGV2b173UGlr29qUk6EgQml57CQG4QcA5TRn1EJGgbsFlOMv4AFnbEALxBdvgfNVlSXn3EMAF/XRwaVyuM5wHNFJFp3uM8A82HXGs7NjxbbRlWKSCMSv/rVCWUgCEfU5jH8Whh3ot1WNz6WbmHTT1vbzSvKgBXBye+/NByKSEYSqpteGwauDQPXhoGW9PvGT69OZr2wvcNUcHph+gXwGgvGgFZATy8vvxby0FPtz11Tf93Pjat3eL9UbtvagQ+qWkfjIwhO/iLZBsC/zWFdc4G1itWc6Lb2WDcKy2DG/aMO1vH6R3t27PjCtIXpP75Wrum0V1/Bjc5GWc2paSvKVSeR8940C1az4gykFNA34hvQJXkPVGDrh6py4wHtoY1Y+WapTwOfBt3Ob+WkQI9BG28+V/sLG+N/bgYypUt/Kt0XZsemTffmjcloOqs3kACgNcVN+ivQjx24eYRO9uwZPMOKUAlMb27YyT4DDJBoOh/HmXbeGkl+hTnp55W6SyA1ZroNZJjnG8S3AGPO9t89njijpTk4Mw+ruUs0avB2BrDuEf+mHHnAE2mlfBlAdjBjThWFg8z2++/ZAw+btanGdivMqTEVhlea0uW7ckrbzTw9UZ2dbbTjWz3h0RgG7igDlkEzTBiQwKbdStXgTB7hhRlYCQiPzMhIAxvLpsnBNjrVrRqhH3ppSv1jpg8nlP9mJoGJj+lM2910mZzNBwDMdn0xw+410wzMfIXDxiWb27aNJeAy0PHvb0PAlm0g497xX3iqXIDt3mO0KVb/A2FGszM8bg9GfHcGm2EN+KCVHh8sl4V+mL7Qy3MAS/NwPezy9UJi1op2pjkxi7ZuJWPR4+4O7+H9TvPLWBs4H+DuO4Af+txUuiGXQ40JrxLu6wE3la7HjTCgmz3OC9TDdhDxd0/Tob+I+/PvTz9h/JuYAjFzAueCHHjHMjIF8PhheogycCPiT9vjfEBVVLq3nced8f9g/FPuHU3PXAG+Czdm3sGA8wHufjfgptINuRkZIfD+YOCyWe/eGlFQEDIg/P1B+2PgviWQkREg3dYO9FRZwACWe6in2gwD+NBtV26B7kElgAwcvPxEGyiKw3GQ8QBRHPv+9K35692kXajXyBZe5INKRO5gouVBMPIoIHi4koV6Ebge4cnDAoLIQYl7hCyKn8naK4CYgHorGAqgh4HDC2AE9tsFeBM8eBfIyMjI6MfeleD9qjw+DnBbmxGRCDy6byf9ChVhdn1mtVBLnIeTCUB05MOieGZqxDigEH4CP3xo2HBQAYzAJ94FMjIyHjq2XnbfMoNgdtx7J2CD2wT9CfANgl4ZfTlAkCNwisfvzz3yLCewQEgEmgxDflgCSAXGyh8Rg1UwfMtiT+KIgHwGY8n7r9BwCT2BkfRrY9sM9pu+dwUqIyPjoaPgkzfRf0s+EhCJ3G/HvdAEAyRc0PnYCIXGz0blRotPziJ2mZcCvQyEwwaP/3CUMzDskBGARqd6HDgHTIAmMnAPR4c+veMwVn5Yg1HBwQKDT7L4rH6CryEERfAKFLQFsJsMMHQbJNrIe4oPCgiCw/wYf/wKRhIwjnsFEEbO44CMjI8ae+3BgZliWiksXKYoPLsSYIDjwDDz6W+wjN4XviWMlUrewFZBPff/I0rWn9+GDPeZBUwLNACCiLuUAJ5sTwsBL9yrYsSqhwz1iShYgIm0ACaAsIXs3K75A5lgnZ7dGBlYxx9a8hkad/QPmzIyMo4O4bvWPipEZxa+4imDCRuf//HnMIcV3bHcEYXYKrJvdUooPbPk2U3pll4OIDhJBVYgfSytZoQAgvj+AoU+rSshAL4+gZU/mgYghrpAtL2T+GX8akLkl0Q48v4EcE/PYWdkfBxQx1SucfLOZ/Ik0c/2x48POGmaKdFz9jAsF0N+F1wLOlXWVpo2h+dVuApcxelg8jc34eZgVjGp5QOE9cRjQARmhE4vg8mqx79mnpeIHlDKg1ZdKmiaotTADLrr4Zd3LpESAOiXooN7N7ppAUjrdX3C8blKbjOcwOnF/OdABSCPdmX15fUP7BSxYr4AZPU/d+FQ+hKFgnnIV+EVy4KsAMHFxUW6BcBy2bWiqXlJvCq4Un9WADJ+RQTwVKZ++hQ9TuXpf7U4ZdUhCSp76CxG8C2576EE8As6Llm0j8EdZxMIICjvmQKT+MReIS6AaqmAHAY0yF42Be+K1LXtAjWWbw8YCRj6Qn18fvpbAA3XXa4RO0NVtQpbvFLaKYCR0WGr0VQ+8zfjoeHLL3uDS3kmqR3Nz6TNe1FPnc551CmRxSOrw6K9r3L+z40Sfo7pYSHBJle+Havreg1az9Tsob2NVOSl7delPHZoQdcnXgK89NmVZyK3F5iZttOWv4LxB3pUQNYDvnr6+s3VUzJaqrqhEzl9VAsgVWH4Lfyu+8xIBaXmrxlNzU43KpqQ8NZn0NgxO27xy/sSSdIKZnDSQmslBLIFuPoFAtAC9wTwi3n3IdWnI11ACVi6BDXYQvoP8Jfu81e3QOJfYUVXjCbh6up1QMPRqKKcZUO7Turntbc2sCEAZPYfWbvSR0Yn7Q6wgf5zw4DrAnJBia8vWCbkxWbZ9dOCn1gddKmSVl+8/vtCiMXfXxuylVe/b/pe94QdLdY5DbRt85HfGfeOKR2MSy0G133R97uMWMNsOn0LtO/3bxsbQtvlVTtNBfI48BXXwxdOKf5T4l9OC6+mXQatm67FzHJkyZXO76nhli9OkYev2/J0gDOrnQ1fyUK9Cvu1Z1rWAwThej7nBLpS9MrSpR9fu3Ob/F0XNAMiwIkCEYBvReTAjUSQ50F3VboQVADdOIxIqr65kXbV0m8lc25cEkiceSTItAD+rWgci5V64OU0cb1SuPCTO3l1NTo/P/cEQASnVicunnZ/bIFjlWwBNzfd7Jxez9rnV+y+C7yUo1Fn97nNWi0WfyaFNd1f6UQAnoM/5+gxRfmbkakSiEKiBcBUAqLnDN4TTu/uTgnZnshxSokvAgt7oF6B2WL9ISPDx3sg58x+h03uu3vk6LB4Ly0HSuCD7m7y/wcbgynBmFFsnGprPSUf8eA0qBcWuNc29BjdfaC7/tJ0vvcK93lYsJONu+gzS8iKN0S3Bzqrq23Z0vWN77t/33sRzrwUhxWAqzAtvJ8HMttUVfdM29YCUMSG7/FYH0Ag6deOfE0jsUSE8KsvdtAFehYfDoEf5FgU3v1wnzwc0SAlI+PTB8zY7MRfJd0DHj3y6cYvrTnkKEAYQ0CF4AnAhFlNr7hrZsAj2C0UcsxAw0Obyq1kOAiQ5GFHAocUQKrGjDygAA7cBfhA6d67QEbGg8eDfj9s2c1s4ceG3C+sm3dskVQC9dLCTJUWG9LHhlK+bvHHRryit5NXF2Lm30Eli6qT80n3Z9ep4RzO6cK9pMGnJ/IzOVLNXur3TVIB6Fax8tahiQC+1sBV2XXpo0MN8OrFK9rm1TCgacg9p8hZUxkZGZ8I+H2AIfoW6dvN6HXL25YeAr8P8AEskFYvQrs19J2Kr8LvLA2cFsnwDy78Q7J8Ab3hcvmUhfu0zsLd1+gDkLu2CVpeO/vSMHAFJuOTaCLiBvHBjz/Ij8BvgpY3fm9swmEBcAYsbLlyX1Wa4WHaz89GSAgIXKy0gHpo/Y67sQLg9wGG6CtHX21Cr1vetvQI8PsAQ/TVt5L+9mpTet3ytqUzMjIGYHTG3uijh5yr0+k6+PvyhJ7PexUU/QIQ9LnA40cWwEPvAhkZGftA/3tFjgqFGDocrRpc0+XV/ahenOIJAAr8ED8qADvbojmAL4BCvUFvX/zuHNsKQMcXlP6IW0AM/V0gUf2PtQVsC3UAp/lmHDv+D/qKcxyg6AblAAAAAElFTkSuQmCC\");\n}\n\n/* positioning */\n.ui-icon-carat-1-n {\n    background-position: 0 0;\n}\n\n.ui-icon-carat-1-ne {\n    background-position: -16px 0;\n}\n\n.ui-icon-carat-1-e {\n    background-position: -32px 0;\n}\n\n.ui-icon-carat-1-se {\n    background-position: -48px 0;\n}\n\n.ui-icon-carat-1-s {\n    background-position: -64px 0;\n}\n\n.ui-icon-carat-1-sw {\n    background-position: -80px 0;\n}\n\n.ui-icon-carat-1-w {\n    background-position: -96px 0;\n}\n\n.ui-icon-carat-1-nw {\n    background-position: -112px 0;\n}\n\n.ui-icon-carat-2-n-s {\n    background-position: -128px 0;\n}\n\n.ui-icon-carat-2-e-w {\n    background-position: -144px 0;\n}\n\n.ui-icon-triangle-1-n {\n    background-position: 0 -16px;\n}\n\n.ui-icon-triangle-1-ne {\n    background-position: -16px -16px;\n}\n\n.ui-icon-triangle-1-e {\n    background-position: -32px -16px;\n}\n\n.ui-icon-triangle-1-se {\n    background-position: -48px -16px;\n}\n\n.ui-icon-triangle-1-s {\n    background-position: -64px -16px;\n}\n\n.ui-icon-triangle-1-sw {\n    background-position: -80px -16px;\n}\n\n.ui-icon-triangle-1-w {\n    background-position: -96px -16px;\n}\n\n.ui-icon-triangle-1-nw {\n    background-position: -112px -16px;\n}\n\n.ui-icon-triangle-2-n-s {\n    background-position: -128px -16px;\n}\n\n.ui-icon-triangle-2-e-w {\n    background-position: -144px -16px;\n}\n\n.ui-icon-arrow-1-n {\n    background-position: 0 -32px;\n}\n\n.ui-icon-arrow-1-ne {\n    background-position: -16px -32px;\n}\n\n.ui-icon-arrow-1-e {\n    background-position: -32px -32px;\n}\n\n.ui-icon-arrow-1-se {\n    background-position: -48px -32px;\n}\n\n.ui-icon-arrow-1-s {\n    background-position: -64px -32px;\n}\n\n.ui-icon-arrow-1-sw {\n    background-position: -80px -32px;\n}\n\n.ui-icon-arrow-1-w {\n    background-position: -96px -32px;\n}\n\n.ui-icon-arrow-1-nw {\n    background-position: -112px -32px;\n}\n\n.ui-icon-arrow-2-n-s {\n    background-position: -128px -32px;\n}\n\n.ui-icon-arrow-2-ne-sw {\n    background-position: -144px -32px;\n}\n\n.ui-icon-arrow-2-e-w {\n    background-position: -160px -32px;\n}\n\n.ui-icon-arrow-2-se-nw {\n    background-position: -176px -32px;\n}\n\n.ui-icon-arrowstop-1-n {\n    background-position: -192px -32px;\n}\n\n.ui-icon-arrowstop-1-e {\n    background-position: -208px -32px;\n}\n\n.ui-icon-arrowstop-1-s {\n    background-position: -224px -32px;\n}\n\n.ui-icon-arrowstop-1-w {\n    background-position: -240px -32px;\n}\n\n.ui-icon-arrowthick-1-n {\n    background-position: 0 -48px;\n}\n\n.ui-icon-arrowthick-1-ne {\n    background-position: -16px -48px;\n}\n\n.ui-icon-arrowthick-1-e {\n    background-position: -32px -48px;\n}\n\n.ui-icon-arrowthick-1-se {\n    background-position: -48px -48px;\n}\n\n.ui-icon-arrowthick-1-s {\n    background-position: -64px -48px;\n}\n\n.ui-icon-arrowthick-1-sw {\n    background-position: -80px -48px;\n}\n\n.ui-icon-arrowthick-1-w {\n    background-position: -96px -48px;\n}\n\n.ui-icon-arrowthick-1-nw {\n    background-position: -112px -48px;\n}\n\n.ui-icon-arrowthick-2-n-s {\n    background-position: -128px -48px;\n}\n\n.ui-icon-arrowthick-2-ne-sw {\n    background-position: -144px -48px;\n}\n\n.ui-icon-arrowthick-2-e-w {\n    background-position: -160px -48px;\n}\n\n.ui-icon-arrowthick-2-se-nw {\n    background-position: -176px -48px;\n}\n\n.ui-icon-arrowthickstop-1-n {\n    background-position: -192px -48px;\n}\n\n.ui-icon-arrowthickstop-1-e {\n    background-position: -208px -48px;\n}\n\n.ui-icon-arrowthickstop-1-s {\n    background-position: -224px -48px;\n}\n\n.ui-icon-arrowthickstop-1-w {\n    background-position: -240px -48px;\n}\n\n.ui-icon-arrowreturnthick-1-w {\n    background-position: 0 -64px;\n}\n\n.ui-icon-arrowreturnthick-1-n {\n    background-position: -16px -64px;\n}\n\n.ui-icon-arrowreturnthick-1-e {\n    background-position: -32px -64px;\n}\n\n.ui-icon-arrowreturnthick-1-s {\n    background-position: -48px -64px;\n}\n\n.ui-icon-arrowreturn-1-w {\n    background-position: -64px -64px;\n}\n\n.ui-icon-arrowreturn-1-n {\n    background-position: -80px -64px;\n}\n\n.ui-icon-arrowreturn-1-e {\n    background-position: -96px -64px;\n}\n\n.ui-icon-arrowreturn-1-s {\n    background-position: -112px -64px;\n}\n\n.ui-icon-arrowrefresh-1-w {\n    background-position: -128px -64px;\n}\n\n.ui-icon-arrowrefresh-1-n {\n    background-position: -144px -64px;\n}\n\n.ui-icon-arrowrefresh-1-e {\n    background-position: -160px -64px;\n}\n\n.ui-icon-arrowrefresh-1-s {\n    background-position: -176px -64px;\n}\n\n.ui-icon-arrow-4 {\n    background-position: 0 -80px;\n}\n\n.ui-icon-arrow-4-diag {\n    background-position: -16px -80px;\n}\n\n.ui-icon-extlink {\n    background-position: -32px -80px;\n}\n\n.ui-icon-newwin {\n    background-position: -48px -80px;\n}\n\n.ui-icon-refresh {\n    background-position: -64px -80px;\n}\n\n.ui-icon-shuffle {\n    background-position: -80px -80px;\n}\n\n.ui-icon-transfer-e-w {\n    background-position: -96px -80px;\n}\n\n.ui-icon-transferthick-e-w {\n    background-position: -112px -80px;\n}\n\n.ui-icon-folder-collapsed {\n    background-position: 0 -96px;\n}\n\n.ui-icon-folder-open {\n    background-position: -16px -96px;\n}\n\n.ui-icon-document {\n    background-position: -32px -96px;\n}\n\n.ui-icon-document-b {\n    background-position: -48px -96px;\n}\n\n.ui-icon-note {\n    background-position: -64px -96px;\n}\n\n.ui-icon-mail-closed {\n    background-position: -80px -96px;\n}\n\n.ui-icon-mail-open {\n    background-position: -96px -96px;\n}\n\n.ui-icon-suitcase {\n    background-position: -112px -96px;\n}\n\n.ui-icon-comment {\n    background-position: -128px -96px;\n}\n\n.ui-icon-person {\n    background-position: -144px -96px;\n}\n\n.ui-icon-print {\n    background-position: -160px -96px;\n}\n\n.ui-icon-trash {\n    background-position: -176px -96px;\n}\n\n.ui-icon-locked {\n    background-position: -192px -96px;\n}\n\n.ui-icon-unlocked {\n    background-position: -208px -96px;\n}\n\n.ui-icon-bookmark {\n    background-position: -224px -96px;\n}\n\n.ui-icon-tag {\n    background-position: -240px -96px;\n}\n\n.ui-icon-home {\n    background-position: 0 -112px;\n}\n\n.ui-icon-flag {\n    background-position: -16px -112px;\n}\n\n.ui-icon-calendar {\n    background-position: -32px -112px;\n}\n\n.ui-icon-cart {\n    background-position: -48px -112px;\n}\n\n.ui-icon-pencil {\n    background-position: -64px -112px;\n}\n\n.ui-icon-clock {\n    background-position: -80px -112px;\n}\n\n.ui-icon-disk {\n    background-position: -96px -112px;\n}\n\n.ui-icon-calculator {\n    background-position: -112px -112px;\n}\n\n.ui-icon-zoomin {\n    background-position: -128px -112px;\n}\n\n.ui-icon-zoomout {\n    background-position: -144px -112px;\n}\n\n.ui-icon-search {\n    background-position: -160px -112px;\n}\n\n.ui-icon-wrench {\n    background-position: -176px -112px;\n}\n\n.ui-icon-gear {\n    background-position: -192px -112px;\n}\n\n.ui-icon-heart {\n    background-position: -208px -112px;\n}\n\n.ui-icon-star {\n    background-position: -224px -112px;\n}\n\n.ui-icon-link {\n    background-position: -240px -112px;\n}\n\n.ui-icon-cancel {\n    background-position: 0 -128px;\n}\n\n.ui-icon-plus {\n    background-position: -16px -128px;\n}\n\n.ui-icon-plusthick {\n    background-position: -32px -128px;\n}\n\n.ui-icon-minus {\n    background-position: -48px -128px;\n}\n\n.ui-icon-minusthick {\n    background-position: -64px -128px;\n}\n\n.ui-icon-close {\n    background-position: -80px -128px;\n}\n\n.ui-icon-closethick {\n    background-position: -96px -128px;\n}\n\n.ui-icon-key {\n    background-position: -112px -128px;\n}\n\n.ui-icon-lightbulb {\n    background-position: -128px -128px;\n}\n\n.ui-icon-scissors {\n    background-position: -144px -128px;\n}\n\n.ui-icon-clipboard {\n    background-position: -160px -128px;\n}\n\n.ui-icon-copy {\n    background-position: -176px -128px;\n}\n\n.ui-icon-contact {\n    background-position: -192px -128px;\n}\n\n.ui-icon-image {\n    background-position: -208px -128px;\n}\n\n.ui-icon-video {\n    background-position: -224px -128px;\n}\n\n.ui-icon-script {\n    background-position: -240px -128px;\n}\n\n.ui-icon-alert {\n    background-position: 0 -144px;\n}\n\n.ui-icon-info {\n    background-position: -16px -144px;\n}\n\n.ui-icon-notice {\n    background-position: -32px -144px;\n}\n\n.ui-icon-help {\n    background-position: -48px -144px;\n}\n\n.ui-icon-check {\n    background-position: -64px -144px;\n}\n\n.ui-icon-bullet {\n    background-position: -80px -144px;\n}\n\n.ui-icon-radio-off {\n    background-position: -96px -144px;\n}\n\n.ui-icon-radio-on {\n    background-position: -112px -144px;\n}\n\n.ui-icon-pin-w {\n    background-position: -128px -144px;\n}\n\n.ui-icon-pin-s {\n    background-position: -144px -144px;\n}\n\n.ui-icon-play {\n    background-position: 0 -160px;\n}\n\n.ui-icon-pause {\n    background-position: -16px -160px;\n}\n\n.ui-icon-seek-next {\n    background-position: -32px -160px;\n}\n\n.ui-icon-seek-prev {\n    background-position: -48px -160px;\n}\n\n.ui-icon-seek-end {\n    background-position: -64px -160px;\n}\n\n.ui-icon-seek-start {\n    background-position: -80px -160px;\n}\n\n/* ui-icon-seek-first is deprecated, use ui-icon-seek-start instead */\n.ui-icon-seek-first {\n    background-position: -80px -160px;\n}\n\n.ui-icon-stop {\n    background-position: -96px -160px;\n}\n\n.ui-icon-eject {\n    background-position: -112px -160px;\n}\n\n.ui-icon-volume-off {\n    background-position: -128px -160px;\n}\n\n.ui-icon-volume-on {\n    background-position: -144px -160px;\n}\n\n.ui-icon-power {\n    background-position: 0 -176px;\n}\n\n.ui-icon-signal-diag {\n    background-position: -16px -176px;\n}\n\n.ui-icon-signal {\n    background-position: -32px -176px;\n}\n\n.ui-icon-battery-0 {\n    background-position: -48px -176px;\n}\n\n.ui-icon-battery-1 {\n    background-position: -64px -176px;\n}\n\n.ui-icon-battery-2 {\n    background-position: -80px -176px;\n}\n\n.ui-icon-battery-3 {\n    background-position: -96px -176px;\n}\n\n.ui-icon-circle-plus {\n    background-position: 0 -192px;\n}\n\n.ui-icon-circle-minus {\n    background-position: -16px -192px;\n}\n\n.ui-icon-circle-close {\n    background-position: -32px -192px;\n}\n\n.ui-icon-circle-triangle-e {\n    background-position: -48px -192px;\n}\n\n.ui-icon-circle-triangle-s {\n    background-position: -64px -192px;\n}\n\n.ui-icon-circle-triangle-w {\n    background-position: -80px -192px;\n}\n\n.ui-icon-circle-triangle-n {\n    background-position: -96px -192px;\n}\n\n.ui-icon-circle-arrow-e {\n    background-position: -112px -192px;\n}\n\n.ui-icon-circle-arrow-s {\n    background-position: -128px -192px;\n}\n\n.ui-icon-circle-arrow-w {\n    background-position: -144px -192px;\n}\n\n.ui-icon-circle-arrow-n {\n    background-position: -160px -192px;\n}\n\n.ui-icon-circle-zoomin {\n    background-position: -176px -192px;\n}\n\n.ui-icon-circle-zoomout {\n    background-position: -192px -192px;\n}\n\n.ui-icon-circle-check {\n    background-position: -208px -192px;\n}\n\n.ui-icon-circlesmall-plus {\n    background-position: 0 -208px;\n}\n\n.ui-icon-circlesmall-minus {\n    background-position: -16px -208px;\n}\n\n.ui-icon-circlesmall-close {\n    background-position: -32px -208px;\n}\n\n.ui-icon-squaresmall-plus {\n    background-position: -48px -208px;\n}\n\n.ui-icon-squaresmall-minus {\n    background-position: -64px -208px;\n}\n\n.ui-icon-squaresmall-close {\n    background-position: -80px -208px;\n}\n\n.ui-icon-grip-dotted-vertical {\n    background-position: 0 -224px;\n}\n\n.ui-icon-grip-dotted-horizontal {\n    background-position: -16px -224px;\n}\n\n.ui-icon-grip-solid-vertical {\n    background-position: -32px -224px;\n}\n\n.ui-icon-grip-solid-horizontal {\n    background-position: -48px -224px;\n}\n\n.ui-icon-gripsmall-diagonal-se {\n    background-position: -64px -224px;\n}\n\n.ui-icon-grip-diagonal-se {\n    background-position: -80px -224px;\n}\n\n/* Misc visuals\n----------------------------------*/\n\n/* Corner radius */\n.ui-corner-all, .ui-corner-top, .ui-corner-left, .ui-corner-tl {\n    -moz-border-radius-topleft: 0px;\n    -webkit-border-top-left-radius: 0px;\n    -khtml-border-top-left-radius: 0px;\n    border-top-left-radius: 0px;\n}\n\n.ui-corner-all, .ui-corner-top, .ui-corner-right, .ui-corner-tr {\n    -moz-border-radius-topright: 0px;\n    -webkit-border-top-right-radius: 0px;\n    -khtml-border-top-right-radius: 0px;\n    border-top-right-radius: 0px;\n}\n\n.ui-corner-all, .ui-corner-bottom, .ui-corner-left, .ui-corner-bl {\n    -moz-border-radius-bottomleft: 0px;\n    -webkit-border-bottom-left-radius: 0px;\n    -khtml-border-bottom-left-radius: 0px;\n    border-bottom-left-radius: 0px;\n}\n\n.ui-corner-all, .ui-corner-bottom, .ui-corner-right, .ui-corner-br {\n    -moz-border-radius-bottomright: 0px;\n    -webkit-border-bottom-right-radius: 0px;\n    -khtml-border-bottom-right-radius: 0px;\n    border-bottom-right-radius: 0px;\n}\n\n/* Overlays */\n.ui-widget-overlay {\n    background: #aaaaaa url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAh0lEQVRYhe2UsQ3AIAwEL0zC/qMwhTdJiiCRpH2kfPHu0DUnbN0xxjiZU1U8p/f+ev/Bm7MccAu6ygE0ZzlgrdhRrqqWoKMczB90lQNoznLwuUE3uXRwB08HVZ4OqjwdVHk6qPJ0UOXpoMrTQZWngypPB1WeDqo8HVR5OqjydFDl6aDK7Tt4AWXCW8vnTP6PAAAAAElFTkSuQmCC\") 50% 50% repeat;\n    opacity: .30;\n    filter: Alpha(Opacity = 30);\n}\n\n.ui-widget-shadow {\n    margin: -8px 0 0 -8px;\n    padding: 8px;\n    background: #aaaaaa url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAABkCAYAAAD0ZHJ6AAAAe0lEQVRoge3OMQHAIBAAMcC/kjdZJHTI0A4XBdkz86wfO18H3hRUBVVBVVAVVAVVQVVQFVQFVUFVUBVUBVVBVVAVVAVVQVVQFVQFVUFVUBVUBVVBVVAVVAVVQVVQFVQFVUFVUBVUBVVBVVAVVAVVQVVQFVQFVUFVUBVUF8O8A8WdY6opAAAAAElFTkSuQmCC\") 50% 50% repeat-x;\n    opacity: .30;\n    filter: Alpha(Opacity = 30);\n    -moz-border-radius: 8px;\n    -khtml-border-radius: 8px;\n    -webkit-border-radius: 8px;\n    border-radius: 8px;\n}\n\n/*!\n* jQuery UI Resizable 1.8.21\n*\n* Copyright 2012, AUTHORS.txt (http://jqueryui.com/about)\n* Dual licensed under the MIT or GPL Version 2 licenses.\n* http://jquery.org/license\n*\n* http://docs.jquery.com/UI/Resizable#theming\n*/\n.ui-resizable {\n    position: relative;\n}\n\n.ui-resizable-handle {\n    position: absolute;\n    font-size: 0.1px;\n    display: block;\n}\n\n.ui-resizable-disabled .ui-resizable-handle, .ui-resizable-autohide .ui-resizable-handle {\n    display: none;\n}\n\n.ui-resizable-n {\n    cursor: n-resize;\n    height: 7px;\n    width: 100%;\n    top: -5px;\n    left: 0;\n}\n\n.ui-resizable-s {\n    cursor: s-resize;\n    height: 7px;\n    width: 100%;\n    bottom: -5px;\n    left: 0;\n}\n\n.ui-resizable-e {\n    cursor: e-resize;\n    width: 7px;\n    right: -5px;\n    top: 0;\n    height: 100%;\n}\n\n.ui-resizable-w {\n    cursor: w-resize;\n    width: 7px;\n    left: -5px;\n    top: 0;\n    height: 100%;\n}\n\n.ui-resizable-se {\n    cursor: se-resize;\n    width: 12px;\n    height: 12px;\n    right: 1px;\n    bottom: 1px;\n}\n\n.ui-resizable-sw {\n    cursor: sw-resize;\n    width: 9px;\n    height: 9px;\n    left: -5px;\n    bottom: -5px;\n}\n\n.ui-resizable-nw {\n    cursor: nw-resize;\n    width: 9px;\n    height: 9px;\n    left: -5px;\n    top: -5px;\n}\n\n.ui-resizable-ne {\n    cursor: ne-resize;\n    width: 9px;\n    height: 9px;\n    right: -5px;\n    top: -5px;\n}\n\n/*!\n* jQuery UI Button 1.8.21\n*\n* Copyright 2012, AUTHORS.txt (http://jqueryui.com/about)\n* Dual licensed under the MIT or GPL Version 2 licenses.\n* http://jquery.org/license\n*\n* http://docs.jquery.com/UI/Button#theming\n*/\n.ui-button {\n    display: inline-block;\n    position: relative;\n    padding: 0;\n    margin-right: .1em;\n    text-decoration: none !important;\n    cursor: pointer;\n    text-align: center;\n    zoom: 1;\n    overflow: visible;\n}\n\n/* the overflow property removes extra width in IE */\n.ui-button-icon-only {\n    width: 2.2em;\n}\n\n/* to make room for the icon, a width needs to be set here */\nbutton.ui-button-icon-only {\n    width: 2.4em;\n}\n\n/* button elements seem to need a little more width */\n.ui-button-icons-only {\n    width: 3.4em;\n}\n\nbutton.ui-button-icons-only {\n    width: 3.7em;\n}\n\n/*button text element */\n.ui-button .ui-button-text {\n    display: block;\n    line-height: 1.4;\n}\n\n.ui-button-text-only .ui-button-text {\n    padding: .4em 1em;\n}\n\n.ui-button-icon-only .ui-button-text, .ui-button-icons-only .ui-button-text {\n    padding: .4em;\n    text-indent: -9999999px;\n}\n\n.ui-button-text-icon-primary .ui-button-text, .ui-button-text-icons .ui-button-text {\n    padding: .4em 1em .4em 2.1em;\n}\n\n.ui-button-text-icon-secondary .ui-button-text, .ui-button-text-icons .ui-button-text {\n    padding: .4em 2.1em .4em 1em;\n}\n\n.ui-button-text-icons .ui-button-text {\n    padding-left: 2.1em;\n    padding-right: 2.1em;\n}\n\n/* no icon support for input elements, provide padding by default */\ninput.ui-button {\n    padding: .4em 1em;\n}\n\n/*button icon element(s) */\n.ui-button-icon-only .ui-icon, .ui-button-text-icon-primary .ui-icon, .ui-button-text-icon-secondary .ui-icon, .ui-button-text-icons .ui-icon, .ui-button-icons-only .ui-icon {\n    position: absolute;\n    top: 50%;\n    margin-top: -8px;\n}\n\n.ui-button-icon-only .ui-icon {\n    left: 50%;\n    margin-left: -8px;\n}\n\n.ui-button-text-icon-primary .ui-button-icon-primary, .ui-button-text-icons .ui-button-icon-primary, .ui-button-icons-only .ui-button-icon-primary {\n    left: .5em;\n}\n\n.ui-button-text-icon-secondary .ui-button-icon-secondary, .ui-button-text-icons .ui-button-icon-secondary, .ui-button-icons-only .ui-button-icon-secondary {\n    right: .5em;\n}\n\n.ui-button-text-icons .ui-button-icon-secondary, .ui-button-icons-only .ui-button-icon-secondary {\n    right: .5em;\n}\n\n/*button sets*/\n.ui-buttonset {\n    margin-right: 7px;\n}\n\n.ui-buttonset .ui-button {\n    margin-left: 0;\n    margin-right: -.3em;\n}\n\n/* workarounds */\nbutton.ui-button::-moz-focus-inner {\n    border: 0;\n    padding: 0;\n}\n\n/* reset extra padding in Firefox */\n/*!\n * jQuery UI Dialog 1.8.21\n *\n * Copyright 2012, AUTHORS.txt (http://jqueryui.com/about)\n * Dual licensed under the MIT or GPL Version 2 licenses.\n * http://jquery.org/license\n *\n * http://docs.jquery.com/UI/Dialog#theming\n */\n.ui-dialog {\n    position: absolute;\n    padding: .2em;\n    width: 300px;\n    overflow: hidden;\n}\n\n.ui-dialog .ui-dialog-titlebar {\n    padding: .4em 1em;\n    position: relative;\n}\n\n.ui-dialog .ui-dialog-title {\n    float: left;\n    margin: .1em 16px .1em 0;\n}\n\n.ui-dialog .ui-dialog-titlebar-close {\n    position: absolute;\n    right: .3em;\n    top: 50%;\n    width: 19px;\n    margin: -10px 0 0 0;\n    padding: 1px;\n    height: 18px;\n}\n\n.ui-dialog .ui-dialog-titlebar-close span {\n    display: block;\n    margin: 1px;\n}\n\n.ui-dialog .ui-dialog-titlebar-close:hover, .ui-dialog .ui-dialog-titlebar-close:focus {\n    padding: 0;\n}\n\n.ui-dialog .ui-dialog-content {\n    position: relative;\n    border: 0;\n    padding: .5em;\n    background: none;\n    overflow: auto;\n    zoom: 1;\n}\n\n.ui-dialog .ui-dialog-buttonpane {\n    text-align: left;\n    border-width: 1px 0 0 0;\n    background-image: none;\n    margin: .5em 0 0 0;\n    padding: .3em 1em .5em .4em;\n}\n\n.ui-dialog .ui-dialog-buttonpane .ui-dialog-buttonset {\n    float: right;\n}\n\n.ui-dialog .ui-dialog-buttonpane button {\n    margin: .5em .4em .5em 0;\n    cursor: pointer;\n}\n\n.ui-dialog .ui-resizable-se {\n    width: 14px;\n    height: 14px;\n    right: 3px;\n    bottom: 3px;\n}\n\n.ui-draggable .ui-dialog-titlebar {\n    cursor: move;\n}\n\n/*!\n* jQuery UI Tabs 1.8.21\n*\n* Copyright 2012, AUTHORS.txt (http://jqueryui.com/about)\n* Dual licensed under the MIT or GPL Version 2 licenses.\n* http://jquery.org/license\n*\n* http://docs.jquery.com/UI/Tabs#theming\n*/\n.ui-tabs {\n    position: relative;\n    padding: 0em;\n    zoom: 1;\n}\n\n/* position: relative prevents IE scroll bug (element with position: relative inside container with overflow: auto appear as \"fixed\") */\n.ui-tabs .ui-tabs-nav {\n    margin: 0;\n    padding: .2em .2em 0;\n}\n\n.ui-tabs .ui-tabs-nav li {\n    list-style: none;\n    float: left;\n    position: relative;\n    top: 1px;\n    margin: 0 .2em 1px 0;\n    border-bottom: 0 !important;\n    padding: 0;\n    white-space: nowrap;\n}\n\n.ui-tabs .ui-tabs-nav li a {\n    float: left;\n    padding: .2em 1em;\n    text-decoration: none;\n}\n\n.ui-tabs .ui-tabs-nav li.ui-tabs-active {\n    margin-bottom: 0;\n    padding-bottom: 1px;\n}\n\n.ui-tabs .ui-tabs-nav li.ui-tabs-active a, .ui-tabs .ui-tabs-nav li.ui-state-disabled a, .ui-tabs .ui-tabs-nav li.ui-tabs-loading a {\n    cursor: text;\n}\n\n.ui-tabs .ui-tabs-nav li a, .ui-tabs.ui-tabs-collapsible .ui-tabs-nav li.ui-tabs-active a {\n    cursor: pointer;\n}\n\n/* first selector in group seems obsolete, but required to overcome bug in Opera applying cursor: text overall if defined elsewhere... */\n.ui-tabs .ui-tabs-panel {\n    display: block;\n    border-width: 0;\n    padding: 0em 0.1em;\n    background: none;\n}\n\n/*!\n* jQuery UI Progressbar 1.8.21\n*\n* Copyright 2012, AUTHORS.txt (http://jqueryui.com/about)\n* Dual licensed under the MIT or GPL Version 2 licenses.\n* http://jquery.org/license\n*\n* http://docs.jquery.com/UI/Progressbar#theming\n*/\n.ui-progressbar {\n    height: 4px;\n    text-align: left;\n    overflow: hidden;\n}\n\n.ui-progressbar .ui-progressbar-value {\n    margin: -1px;\n    height: 100%;\n}");
    };
    /**************************************************************************
*  hourly Resources
***************************************************************************/

    var ResourceProduction = new function () {
        function addProd(position, value) {
            value = Math.floor(value);
            if (value > 0)
                $('span#rp' + position).css('color', 'green').text(Utils.FormatNumToStr(value, true));
            else if (value < 0)
                $('span#rp' + position).css('color', 'red').text(Utils.FormatNumToStr(value, true));
            else $('span#rp' + position).css('color', 'gray').text('+0');
        }
        this.createSpan = function (n) {
            var ids = ['wood', 'wine', 'marble', 'glass', 'sulfur'];
            if ($('span#rp' + n).length === 0) {
                $('#cityResources li[id="resources_' + ids[n] + '"]').css({ 'line-height': 'normal', 'padding-top': '0px' }).append('<span id="rp' + n + '" class="resourceProduction"></span>');
            }
        };
        this.repositionSpan = function (newTradegood) {
            var oldTradegood = unsafeWindow.ikariam.model.producedTradegood;
            if (newTradegood != oldTradegood) {
                if (oldTradegood > 1) {
                    $('span#rp' + oldTradegood).remove();
                }
                this.createSpan(newTradegood);
            }
        };
        this.updateProd = function () {
            addProd(0, unsafeWindow.ikariam.model.resourceProduction * 3600);
            if (unsafeWindow.ikariam.model.cityProducesWine) {
                addProd(1, unsafeWindow.ikariam.model.tradegoodProduction * 3600 - unsafeWindow.ikariam.model.wineSpendings);
            }
            else {
                addProd(1, - unsafeWindow.ikariam.model.wineSpendings);
                addProd(unsafeWindow.ikariam.model.producedTradegood, unsafeWindow.ikariam.model.tradegoodProduction * 3600);
            }
        };
    }();
    $(function () {
        ResourceProduction.createSpan(0); ResourceProduction.createSpan(1); ResourceProduction.createSpan(2); ResourceProduction.createSpan(3); ResourceProduction.createSpan(4); ResourceProduction.updateProd(); unsafeWindow.ikariam.model.ResourceProduction_updateGlobalData = unsafeWindow.ikariam.model.updateGlobalData;
        unsafeWindow.ikariam.model.updateGlobalData = function (dataSet) {
            ResourceProduction.repositionSpan(dataSet.producedTradegood); unsafeWindow.ikariam.model.ResourceProduction_updateGlobalData(dataSet); ResourceProduction.updateProd();
        };
    });

    /***********************************************************************************************************************
 * ikariam
 **********************************************************************************************************************/

    var ikariam = {
        _View: null,
        _Host: null,
        _ActionRequest: null,
        _Units: null,
        _BuildingsList: null,
        _AltBuildingsList: null,
        _Nationality: null,
        _GameVersion: null,
        _TemplateView: null,
        _currentCity: null,
        url: function () {
            return 'http://' + this.Host() + '/index.php';
        },
        get mainView() {
            return unsafeWindow.ikariam.backgroundView.id;
        },
        get boxViewParams() {
            if (unsafeWindow.ikariam.mainbox_x || unsafeWindow.ikariam.mainbox_y || unsafeWindow.ikariam.mainbox_z) {
                return {
                    mainbox_x: unsafeWindow.ikariam.mainbox_x,
                    mainbox_y: unsafeWindow.ikariam.mainbox_y,
                    mainbox_z: unsafeWindow.ikariam.mainbox_z
                };
            }
            return {};
        },
        loadUrl: function (ajax, mainView, params) {
            mainView = mainView || ikariam.mainView;
            var paramList = { cityId: ikariam.CurrentCityId };
            if (ikariam.CurrentCityId !== params.cityId) {
                paramList.action = 'header';
                paramList.function = 'changeCurrentCity';
                paramList.actionRequest = unsafeWindow.ikariam.model.actionRequest;
                paramList.currentCityId = ikariam.CurrentCityId;
                paramList.oldView = ikariam.mainView;
            }
            if (mainView !== undefined && mainView !== ikariam.mainView) {
                paramList.oldBackgroundView = ikariam.mainView;
                paramList.backgroundView = mainView;
                ajax = false;
            }
            $.extend(paramList, params);
            if (ajax) {
                gotoAjaxURL('?' + $.map(paramList, function (value, key) {
                    return key + '=' + value;
                }).join('&'));
            } else {
                gotoURL(ikariam.url() + '?' + $.map(paramList, function (value, key) {
                    return key + '=' + value;
                }).join('&'));
            }
            function gotoURL(url) {
                window.location.assign(url);
            }
            function gotoAjaxURL(url) {
                document.location = 'javascript:ajaxHandlerCall(' + JSON.stringify(url) + '); void(0);';
            }
        },
        Host: function () {
            if (this._Host == null) {
                this._Host = '';
                this._Host = document.location.host;
            }
            return this._Host;
        },
        Server: function (host) {
            if (this._Server == null) {
                if (host == undefined) {
                    host = this.Host();
                }
                this._Server = '';
                var parts = host.split('.');
                this._Server = parts[0].split('-')[0];
            }
            return this._Server;
        },
        Language: function (host) {
            if (this._Language == null) {
                if (host == undefined) {
                    host = this.Host();
                }
                this._Language = '';
                var parts = host.split('.');
                this._Language = parts[0].split('-')[1];
            }
            if ((this._Language == 'us') || (this._Language == 'au') || (this._Language == 'hk') || (this._Language == 'tw') || (this._Language == 'il') || (this._Language == 'lt') || (this._Language == 'hu') || (this._Language == 'bg') || (this._Language == 'rs') || (this._Language == 'si') || (this._Language == 'sk') || (this._Language == 'dk') || (this._Language == 'fi') || (this._Language == 'ee') || (this._Language == 'se') || (this._Language == 'no')) {
                this._Language = 'en';
            }
            if ((this._Language == 've') || (this._Language == 'mx') || (this._Language == 'ar') || (this._Language == 'co') || (this._Language == 'cl') || (this._Language == 'pe')) {
                this._Language = 'es';
            }
            if (this._Language == 'br') {
                this._Language = 'pt';
            }
            if (this._Language == 'ae') {
                this._Language = 'ar';
            }
            if (this._Language == 'gr') {
                this._Language = 'el';
            }
            return this._Language;
        },
        Nationality: function (host) {
            if (this._Nationality == null) {
                if (host == undefined) {
                    host = this.Host();
                }
                this._Nationality = '';
                var parts = host.split('.');
                this._Nationality = parts[0].split('-')[1];
            }
            return this._Nationality;
        },
        getNextWineTick: function (precision) {
            precision = precision || 1;
            if (precision == 1) {
                return 60 - new Date().getMinutes();
            } else {
                var secs = 3600 - (new Date().getMinutes() * 60) - new Date().getSeconds();
                var ret = Math.floor(secs / 60) + database.getGlobalData.getLocalisedString('minute') + ' ';
                ret += secs - (Math.floor(secs / 60) * 60) + database.getGlobalData.getLocalisedString('second');
                return ret;
            }
        },
        GameVersion: function () {
            if (this._GameVersion == null) {
                this._GameVersion = $('.version').text().split('v')[1];
            }
            return this._GameVersion;
        },
        get CurrentCityId() {
            return unsafeWindow.ikariam.backgroundView && unsafeWindow.ikariam.backgroundView.id === 'city' ? ikariam._currentCity || unsafeWindow.ikariam.model.relatedCityData[unsafeWindow.ikariam.model.relatedCityData.selectedCity].id : unsafeWindow.ikariam.model.relatedCityData[unsafeWindow.ikariam.model.relatedCityData.selectedCity].id;
        },
        get viewIsCity() {
            return unsafeWindow.ikariam.backgroundView && unsafeWindow.ikariam.backgroundView.id === 'city';
        },
        get viewIsIsland() {
            return unsafeWindow.ikariam.backgroundView && unsafeWindow.ikariam.backgroundView.id === 'island';
        },
        get viewIsWorld() {
            return unsafeWindow.ikariam.backgroundView && unsafeWindow.ikariam.backgroundView.id === 'worldmap_iso';
        },
        get getCurrentCity() {
            return database.cities[ikariam.CurrentCityId];
        },
        get getCapital() {
            for (var c in database.cities) {
                if (database.cities[c].isCapital) {
                    return database.cities[c];
                }
            }
            return false;
        },
        get CurrentTemplateView() {
            try {
                this._CurrentTemplateView = unsafeWindow.ikariam.templateView.id;
            } catch (e) {
                this._CurrentTemplateView = null;
            }
            return this._CurrentTemplateView;
        },
        getLocalizationStrings: function () {
            var localStrings = unsafeWindow.LocalizationStrings;
            if (!localStrings) {
                $('script').each(function (index, script) {
                    var match = /LocalizationStrings = JSON.parse\('(.*)'\);/.exec(script.innerHTML);
                    if (match) {
                        localStrings = JSON.parse(match[1]);
                        return false;
                    }
                });
            }
            var local = $.extend({}, localStrings);
            $.extend(local, local.timeunits.short);
            delete local.warnings;
            delete local.timeunits;
            $.each(local, function (name, value) {
                database.getGlobalData.addLocalisedString(name.toLowerCase(), value);
            });
            local = null;
        },
        setupEventHandlers: function () {
            events('ajaxResponse').sub(function (response) {
                var view, html, data, template;
                var len = response.length;
                var oldCity = this._currentCity;
                while (len) {
                    len--;
                    switch (response[len][0]) {
                        case 'updateGlobalData':
                            debugger;
                            if(response[len][1].backgroundData){
                                this._currentCity = parseInt(response[len][1].backgroundData.id);
                                var cityData = $.extend({}, response[len][1].backgroundData, response[len][1].headerData);
                                events('updateCityData').pub(this.CurrentCityId, $.extend({}, cityData));
                                events('updateBuildingData').pub(this.CurrentCityId, cityData.position);
                            }
                            break;
                        case 'changeView':
                            view = response[len][1][0];
                            html = response[len][1][1];
                            break;
                        case 'updateTemplateData':
                            template = response[len][1];
                            if (unsafeWindow.ikariam.templateView) {
                                if (unsafeWindow.ikariam.templateView.id == 'researchAdvisor') {
                                    view = unsafeWindow.ikariam.templateView.id;
                                }
                            }
                            break;
                        case 'updateBackgroundData':
                            oldCity = this.CurrentCityId;
                            this._currentCity = parseInt(response[len][1].id);
                            events('updateCityData').pub(this._currentCity, $.extend(true, {}, unsafeWindow.dataSetForView, response[len][1]));
                            events('updateBuildingData').pub(this._currentCity, response[len][1].position);
                            break;
                    }
                }
                this.parseViewData(view, html, template);
                if (oldCity !== this.CurrentCityId) {
                    events('cityChanged').pub(this.CurrentCityId);
                }
            }.bind(ikariam));
            events('formSubmit').sub(function (form) {
                var formID = form.getAttribute('id');
                if (!ikariam[formID + 'Submitted']) return false;
                var formSubmission = (function formSubmit() {
                    var data = ikariam[formID + 'Submitted']();
                    return function formSubmitID(response) {
                        var len = response.length;
                        var feedback = 0;
                        while (len) {
                            len--;
                            if (response[len][0] == 'provideFeedback')
                                feedback = response[len][1][0].type;
                        }
                        if (feedback == 10)
                            ikariam[formID + 'Submitted'](data);
                        events('ajaxResponse').unsub(formSubmission);
                    };
                })();
                events('ajaxResponse').sub(formSubmission);
            }.bind(ikariam));
            events(Constant.Events.CITYDATA_AVAILABLE).sub(ikariam.FetchAllTowns.bind(ikariam));
        },
        Init: function () {
            this.setupEventHandlers();
        },
        parseViewData: function (view, html, tData) {
            if (this.getCurrentCity) {
                switch (view) {
                    case 'finances':
                        this.parseFinances($('#finances').find('table.table01 tr').slice(2).children('td'));
                        break;
                    case Constant.Buildings.TOWN_HALL:
                        this.parseTownHall(tData);
                        break;
                    case 'militaryAdvisor':
                        this.parseMilitaryAdvisor(html, tData);
                        break;
                    case 'cityMilitary':
                        this.parseCityMilitary();
                        //this.parseMilitaryLocalization();
                        break;
                    case 'researchAdvisor':
                        this.parseResearchAdvisor(tData);
                        break;
                    case Constant.Buildings.PALACE:
                        this.parsePalace();
                        break;
                    case Constant.Buildings.ACADEMY:
                        this.parseAcademy(tData);
                        break;
                    case 'culturalPossessions_assign':
                        this.parseCulturalPossessions(html);
                        break;
                    case Constant.Buildings.MUSEUM:
                        this.parseMuseum();
                        break;
                    case Constant.Buildings.TAVERN:
                        this.parseTavern();
                        break;
                    case 'transport':
                    case 'plunder':
                        this.transportFormSubmitted();
                        break;
                    case Constant.Buildings.TEMPLE:
                        this.parseTemple(tData);
                        break;
                    case Constant.Buildings.BARRACKS:
                    case Constant.Buildings.SHIPYARD:
                        this.parseBarracks(view, html, tData);
                        break;
                    case 'deployment':
                    case 'plunder':
                        this.parseMilitaryTransport();
                        break;
                    case 'premium':
                        this.parsePremium(view, html, tData);
                        break;
                }
            }
        },
        parsePalace: function () {
            var governmentType = $('#formOfRuleContent').find('td.government_desc h3').text();
            var changed = (database.getGlobalData.getGovernmentType != governmentType);
            database.getGlobalData.governmentType = governmentType;
            if (changed) events(Constant.Events.GLOBAL_UPDATED).pub({ type: 'government' });
            database.getGlobalData.addLocalisedString('Current form', $('#palace').find('div.contentBox01h h3.header').get(0).textContent);
            render.toast('Updated: ' + $('#palace').children(":first").text());
        },
        parseCulturalPossessions: function (html) {
            var allCulturalGoods = html.match(/iniValue\s:\s(\d*)/g);
            var changes = [];
            $.each(html.match(/goodscity_(\d*)/g), function (i) {
                var cityID = this.split('_')[1];
                var culturalGoods = parseInt(allCulturalGoods[i].split(' ').pop());
                var changed = (database.cities[cityID]._culturalGoods != culturalGoods);
                if (changed) {
                    database.cities[cityID]._culturalGoods = culturalGoods;
                    changes.push(cityID);
                }
            });
            if (changes.length) $.each(changes, function (idx, cityID) {
                events(Constant.Events.CITY_UPDATED).pub(cityID, { culturalGoods: true });
            });
            render.toast('Updated: ' + $('#culturalPossessions_assign > .header').text());
        },
        parseMuseum: function () {
            var changed;
            var regText = $('#val_culturalGoodsDeposit').parent().text().match(/(\d+)/g);
            if (regText.length == 2) {
                changed = ikariam.getCurrentCity.updateCulturalGoods(parseInt(regText[0]));
            }
            if (changed) events(Constant.Events.CITY_UPDATED).pub(ikariam.CurrentCityId, { culturalGoods: true });
            render.toast('Updated: ' + $('#tab_museum > div > h3').get(0).textContent);
        },
        parseTavern: function () {
        },
        resTransportObject: function () {
            return {
                id: null,
                wood: 0,
                wine: 0,
                marble: 0,
                glass: 0,
                sulfur: 0,
                gold: 0,
                targetCityId: 0,
                arrivalTime: 0,
                originCityId: 0,
                loadedTime: 0,
                mission: ''
            };
        },
        troopTransportObject: function () {
            return {
                id: null,
                troops: {},
                targetCityId: 0,
                arrivalTime: 0,
                originCityId: 0,
                returnTime: 0,
                mission: ''
            };
        },
        parseBarracks: function (view, html, tData) {
            var type = view == Constant.Buildings.BARRACKS ? 'army' : view == Constant.Buildings.SHIPYARD ? 'fleet' : false;
            var city = ikariam.getCurrentCity;
            var currentUnits = {};
            var i = 14;
            while (i--) {
                if (tData['js_barracksUnitUnitsAvailable' + (i - 1)]) {
                    currentUnits[tData['js_barracksUnitClass' + (i - 1)]['class'].split(' ').pop()] = parseInt(tData['js_barracksUnitUnitsAvailable' + (i - 1)].text);
                }
            }
            var changes = city.military.updateUnits(currentUnits);
            var elem = $('#unitConstructionList');
            if (elem.length) {
                var tasks = [];
                tasks.push({
                    units: parseUnits(elem.find('> .army_wrapper .army')),
                    completionTime: parseTime($('#unitBuildCountDown').text()),
                    type: type
                });
                elem.find('div.constructionBlock').each(function () {
                    tasks.push({
                        units: parseUnits($(this).find('> .army_wrapper .army')),
                        completionTime: parseTime($(this).find('h4 > span').text()),
                        type: type
                    });
                });
                changes = changes.concat(city.military.setTraining(tasks));
            }
            elem = null;
            if (changes.length) {
                events(Constant.Events.MILITARY_UPDATED).pub(city.getId, $.exclusive(changes));
            }
            function parseUnits(element) {
                var units = {};
                element.each(function () {
                    units[Constant.unitIds[this.classList.toString().match(/(\d+)/g)]] = parseInt(this.nextElementSibling.textContent.match(/(\d+)/g));
                });
                return units;
            }
            function parseTime(timeText) {
                var completionTime = new Date();
                var server = ikariam.Nationality();
                completionTime.setSeconds(completionTime.getSeconds() + (timeText.match(/(\d+)s/) ? parseInt(timeText.match(/(\d+)s/)[1]) : 0));
                completionTime.setMinutes(completionTime.getMinutes() + (timeText.match(/(\d+)m/) ? parseInt(timeText.match(/(\d+)m/)[1]) : 0));
                completionTime.setHours(completionTime.getHours() + (timeText.match(/(\d+)h/) ? parseInt(timeText.match(/(\d+)h/)[1]) : 0));
                completionTime.setDate(completionTime.getDate() + (timeText.match(/(\d+)D/) ? parseInt(timeText.match(/(\d+)D/)[1]) : 0));
                switch (server) {
                    case 'de':
                        completionTime.setDate(completionTime.getDate() + (timeText.match(/(\d+)T/) ? parseInt(timeText.match(/(\d+)T/)[1]) : 0));
                        break;
                    case 'gr':
                        completionTime.setDate(completionTime.getDate() + (timeText.match(/(\d+)M/) ? parseInt(timeText.match(/(\d+)M/)[1]) : 0));
                        break;
                    case 'fr':
                        completionTime.setDate(completionTime.getDate() + (timeText.match(/(\d+)J/) ? parseInt(timeText.match(/(\d+)J/)[1]) : 0));
                        break;
                    case 'ro':
                        completionTime.setDate(completionTime.getDate() + (timeText.match(/(\d+)Z/) ? parseInt(timeText.match(/(\d+)Z/)[1]) : 0));
                        break;
                    case 'it':
                    case 'tr':
                        completionTime.setDate(completionTime.getDate() + (timeText.match(/(\d+)G/) ? parseInt(timeText.match(/(\d+)G/)[1]) : 0));
                        break;
                    case 'ir':
                    case 'ae':
                        completionTime.setSeconds(completionTime.getSeconds() + (timeText.match(/(\d+)ث/) ? parseInt(timeText.match(/(\d+)ث/)[1]) : 0));
                        completionTime.setMinutes(completionTime.getMinutes() + (timeText.match(/(\d+)د/) ? parseInt(timeText.match(/(\d+)د/)[1]) : 0));
                        completionTime.setHours(completionTime.getHours() + (timeText.match(/(\d+)س/) ? parseInt(timeText.match(/(\d+)س/)[1]) : 0));
                        completionTime.setDate(completionTime.getDate() + (timeText.match(/(\d+)ر/) ? parseInt(timeText.match(/(\d+)ر/)[1]) : 0));
                        break;
                }
                return completionTime.getTime();
            }
            render.toast('Updated: ' + $('#js_mainBoxHeaderTitle').text());
        },
        /**
   * First call without data will parse the transportform, second call will add the forms data to the database
   */
        transportFormSubmitted: function (data) {
            try {
                if (!data) {
                    var journeyTime = $('#journeyTime').text();
                    var loadingTime = $('#loadingTime').text();
                    var wood = parseInt($('#textfield_wood').val());
                    var wine = parseInt($('#textfield_wine').val());
                    var marble = parseInt($('#textfield_marble').val());
                    var glass = parseInt($('#textfield_glass').val());
                    var sulfur = parseInt($('#textfield_sulfur').val());
                    var gold = '';
                    var targetID = $('input[name=destinationCityId]').val();
                    var ships = $('#transporterCount').val();
                    var arrTime = new Date();
                    var loadedTime = new Date();
                    var server = ikariam.Nationality();

                    arrTime.setSeconds(arrTime.getSeconds() + (journeyTime.match(/(\d+)s/) ? parseInt(journeyTime.match(/(\d+)s/)[1]) : 0));
                    arrTime.setMinutes(arrTime.getMinutes() + (journeyTime.match(/(\d+)m/) ? parseInt(journeyTime.match(/(\d+)m/)[1]) : 0));
                    arrTime.setHours(arrTime.getHours() + (journeyTime.match(/(\d+)h/) ? parseInt(journeyTime.match(/(\d+)h/)[1]) : 0));
                    arrTime.setDate(arrTime.getDate() + (journeyTime.match(/(\d+)D/) ? parseInt(journeyTime.match(/(\d+)D/)[1]) : 0));
                    if (server == 'de')
                        arrTime.setDate(arrTime.getDate() + (journeyTime.match(/(\d+)T/) ? parseInt(journeyTime.match(/(\d+)T/)[1]) : 0));

                    loadedTime.setSeconds(loadedTime.getSeconds() + (loadingTime.match(/(\d+)s/) ? parseInt(loadingTime.match(/(\d+)s/)[1]) : 0));
                    loadedTime.setMinutes(loadedTime.getMinutes() + (loadingTime.match(/(\d+)m/) ? parseInt(loadingTime.match(/(\d+)m/)[1]) : 0));
                    loadedTime.setHours(loadedTime.getHours() + (loadingTime.match(/(\d+)h/) ? parseInt(loadingTime.match(/(\d+)h/)[1]) : 0));
                    loadedTime.setDate(loadedTime.getDate() + (loadingTime.match(/(\d+)D/) ? parseInt(loadingTime.match(/(\d+)D/)[1]) : 0));
                    if (server == 'de')
                        loadedTime.setDate(loadedTime.getDate() + (loadingTime.match(/(\d+)T/) ? parseInt(loadingTime.match(/(\d+)T/)[1]) : 0));

                    return new Movement('XXX-' + arrTime.getTime(), this.CurrentCityId, targetID, arrTime.getTime() + loadedTime.getTime() - $.now(), 'transport', loadedTime.getTime(), { gold: gold || 0, wood: wood || 0, wine: wine || 0, marble: marble || 0, glass: glass || 0, sulfur: sulfur || 0 }, undefined, ships);
                } else {
                    database.getGlobalData.addFleetMovement(data);
                    events(Constant.Events.MOVEMENTS_UPDATED).pub([data.getTargetCityId]);
                }
            } catch (e) {
                empire.error('transportFormSubmitted', e);
            } finally {
            }
        },
        parseMilitaryTransport: function (submit) {
            //return false;
            submit = submit || false;
            var that = this;
            if (submit) {
                var journeyTime = $('#journeyTime').text();
                var returnTime = $('#returnTime').text();
                var targetID = $('input:[name=destinationCityId]').val();
                var troops = {};
                var mission = '';
                $('ul.assignUnits li input.textfield').each(function () {
                    if (this.value !== 0) {
                        troops[this.getAttribute('name').split('_').pop()] = parseInt(this.value);
                    }
                    if (mission === '') {
                        mission = 'deploy' + this.getAttribute('name').match(/_(.*)_/)[1];
                    } else {
                        mission = 'plunder' + this.getAttribute('name').match(/_(.*)_/)[1];
                    }
                });
                var arrTime = new Date();
                var transport = this.troopTransportObject();
                var server = ikariam.Nationality();
                transport.id = 'XXX-' + arrTime.getTime();
                transport.targetCityId = targetID;
                transport.originCityId = this.CurrentCityId;
                transport.mission = mission;
                transport.troops = troops;
                arrTime.setSeconds(arrTime.getSeconds() + (journeyTime.match(/(\d+)s/) ? parseInt(journeyTime.match(/(\d+)s/)[1]) : 0));
                arrTime.setMinutes(arrTime.getMinutes() + (journeyTime.match(/(\d+)m/) ? parseInt(journeyTime.match(/(\d+)m/)[1]) : 0));
                arrTime.setHours(arrTime.getHours() + (journeyTime.match(/(\d+)h/) ? parseInt(journeyTime.match(/(\d+)h/)[1]) : 0));
                arrTime.setDate(arrTime.getDate() + (journeyTime.match(/(\d+)D/) ? parseInt(journeyTime.match(/(\d+)D/)[1]) : 0));
                if (server == 'de')
                    arrTime.setDate(arrTime.getDate() + (journeyTime.match(/(\d+)T/) ? parseInt(journeyTime.match(/(\d+)T/)[1]) : 0));
                transport.arrivalTime = arrTime.getTime();
                arrTime = new Date();
                arrTime.setSeconds(arrTime.getSeconds() + (returnTime.match(/(\d+)s/) ? parseInt(returnTime.match(/(\d+)s/)[1]) : 0));
                arrTime.setMinutes(arrTime.getMinutes() + (returnTime.match(/(\d+)m/) ? parseInt(returnTime.match(/(\d+)m/)[1]) : 0));
                arrTime.setHours(arrTime.getHours() + (returnTime.match(/(\d+)h/) ? parseInt(returnTime.match(/(\d+)h/)[1]) : 0));
                arrTime.setDate(arrTime.getDate() + (returnTime.match(/(\d+)D/) ? parseInt(returnTime.match(/(\d+)D/)[1]) : 0));
                if (server == 'de')
                    arrTime.setDate(arrTime.getDate() + (returnTime.match(/(\d+)T/) ? parseInt(returnTime.match(/(\d+)T/)[1]) : 0));
                transport.returnTime = arrTime.getTime();
                database.getGlobalData.addFleetMovement(transport);
                render.toast('Updated: Movement added');
                return false;
            } else {
                return true;
            }
        },
        parseFinances: function ($elem) {
            var updateTime = $.now();
            var changed;
            for (var i = 1; i < database.getCityCount + 1; i++) {
                var city = database.cities[Object.keys(database.cities)[i - 1]];
                if (city !== false) {
                    changed = city.updateIncome(parseInt($elem[(i * 4) - 3].textContent.split(database.getGlobalData.getLocalisedString('thousandSeperator')).join('')));
                    changed = city.updateExpenses(parseInt($elem[(i * 4) - 2].textContent.split(database.getGlobalData.getLocalisedString('thousandSeperator')).join(''))) || changed;
                }
                if (changed) events(Constant.Events.CITY_UPDATED).pub(city.getId, { finances: true });
            }
            var $breakdown = $('#finances').find('tbody tr.bottomLine td:last-child');
            database.getGlobalData.finance.armyCost = parseInt($breakdown[0].textContent.split(database.getGlobalData.getLocalisedString('thousandSeperator')).join(''));
            database.getGlobalData.finance.fleetCost = parseInt($breakdown[1].textContent.split(database.getGlobalData.getLocalisedString('thousandSeperator')).join(''));
            database.getGlobalData.finance.armySupply = parseInt($breakdown[2].textContent.split(database.getGlobalData.getLocalisedString('thousandSeperator')).join(''));
            database.getGlobalData.finance.fleetSupply = parseInt($breakdown[3].textContent.split(database.getGlobalData.getLocalisedString('thousandSeperator')).join(''));
            events('globalData').pub({ finances: true });
            database.getGlobalData.addLocalisedString('finances', $('#finances').find('h3#js_mainBoxHeaderTitle').text());
            render.toast('Updated: ' + $('#finances').children(":first").text());
        },
        parseResearchAdvisor: function (data) {
            var changes = [];
            var research = JSON.parse(data.new_js_params || data.load_js.params).currResearchType;
            $.each(research, function (name, Data) {
                var id = parseInt(Data.aHref.match(/researchId=([0-9]+)/i)[1]);
                var level = name.match(/\((\d+)\)/);
                var explored = level ? parseInt(level[1]) - 1 : (Data.liClass === 'explored' ? 1 : 0);
                var changed = database.getGlobalData.updateResearchTopic(id, explored);
                if (changed) changes.push({ type: 'research_topic', subType: id });
                database.getGlobalData.addLocalisedString('research_' + id, name.split('(').shift());
            });
            if (changes.length) events(Constant.Events.GLOBAL_UPDATED).pub(changes);
            database.getGlobalData.addLocalisedString('researchpoints', $('li.points').text().split(':')[0]);
            render.toast('Updated: ' + $('#tab_researchAdvisor').children(":first").text());
        },
        parseAcademy: function (data) {
            var city = ikariam.getCurrentCity;
            var changed = city.updateResearchers(parseInt(data.js_AcademySlider.slider.ini_value));
            if (changed)
                events(Constant.Events.CITY_UPDATED).pub(ikariam.CurrentCityId, { research: changed });
            render.toast('Updated: ' + $('#academy h3#js_mainBoxHeaderTitle').text() + '');
        },
        parseTownHall: function (data) {
            var changes = {};
            var city = ikariam.getCurrentCity;
            var cultBon = parseInt(data.js_TownHallSatisfactionOverviewCultureBoniTreatyBonusValue.text) || 0;
            var priests = parseInt(data.js_TownHallPopulationGraphPriestCount.text.split(database.getGlobalData.getLocalisedString('thousandSeperator')).join('')) || 0;
            var researchers = parseInt(data.js_TownHallPopulationGraphScientistCount.text) || 0;
            changes.culturalGoods = city.updateCulturalGoods(cultBon / 50);
            changes.priests = city.updatePriests(priests);
            changes.research = city.updateResearchers(researchers);
            events(Constant.Events.CITY_UPDATED).pub(ikariam.CurrentCityId, changes);
            render.toast('Updated: ' + $('#js_TownHallCityName').text() + '');
        },
        parseTemple: function (data) {
            var priests = parseInt(data.js_TempleSlider.slider.ini_value) || 0;
            var changed = ikariam.getCurrentCity.updatePriests(priests);
            events(Constant.Events.CITY_UPDATED).pub(ikariam.CurrentCityId, { priests: changed });
        },
        parseMilitaryAdvisor: function (html, data) {
            try {
                var ownMovementIds = [];
                var move;
                for (var key in data) {
                    var match = key.match(/^js_MilitaryMovementsEventRow(\d+)$/);
                    if (match && Utils.existsIn(data[key]['class'], 'own')) {
                        ownMovementIds.push(match[1]);
                    }
                }
                var changes = 0;
                if (ownMovementIds.length) {
                    changes = database.getGlobalData.clearFleetMovements();
                    $.each(ownMovementIds, function (idx, value) {
                        var transport = new Movement(value);
                        var targetAvatar = '';
                        transport._id = parseInt(value);
                        transport._arrivalTime = parseInt(data['js_MilitaryMovementsEventRow' + value + 'ArrivalTime'].countdown.enddate * 1000);
                        transport._loadingTime = 0;
                        transport._originCityId = parseInt(data['js_MilitaryMovementsEventRow' + value + 'OriginLink'].href.match(/cityId=(\d+)/)[1]);
                        transport._targetCityId = parseInt(data['js_MilitaryMovementsEventRow' + value + 'TargetLink'].href.match(/cityId=(\d+)/)[1]);
                        transport._mission = data['js_MilitaryMovementsEventRow' + value + 'MissionIcon']['class'].split(' ')[1];
                        var status = data['js_MilitaryMovementsEventRow' + value + 'Mission']['class'];
                        if (status) {
                            if (Utils.existsIn(status, 'arrow_left_green')) {
                                var t = transport._originCityId;
                                transport._originCityId = transport._targetCityId;
                                transport._targetCityId = t;
                            }
                        } else {
                            var serverTyp = 1;
                            if (ikariam.Server() == 's201' || ikariam.Server() == 's202') serverTyp = 3;
                            transport._loadingTime = transport._arrivalTime;
                            if (database.getCityFromId(transport._originCityId) && database.getCityFromId(transport._targetCityId)) {
                                transport._arrivalTime += Utils.estimateTravelTime(database.getCityFromId(transport._originCityId).getCoordinates, database.getCityFromId(transport._targetCityId).getCoordinates) / serverTyp;
                            }
                        }
                        switch (transport._mission) {
                            case 'trade':
                            case 'transport':
                            case 'plunder':
                                $.each(data['js_MilitaryMovementsEventRow' + value + 'UnitDetails'].appendElement, function (index, item) {
                                    if (Utils.existsIn(item['class'], Constant.Resources.WOOD)) {
                                        transport._resources.wood = parseInt(item.text.split(database.getGlobalData.getLocalisedString('thousandSeperator')).join(''));
                                    } else if (Utils.existsIn(item['class'], Constant.Resources.WINE)) {
                                        transport._resources.wine = parseInt(item.text.split(database.getGlobalData.getLocalisedString('thousandSeperator')).join(''));
                                    } else if (Utils.existsIn(item['class'], Constant.Resources.MARBLE)) {
                                        transport._resources.marble = parseInt(item.text.split(database.getGlobalData.getLocalisedString('thousandSeperator')).join(''));
                                    } else if (Utils.existsIn(item['class'], Constant.Resources.GLASS)) {
                                        transport._resources.glass = parseInt(item.text.split(database.getGlobalData.getLocalisedString('thousandSeperator')).join(''));
                                    } else if (Utils.existsIn(item['class'], Constant.Resources.SULFUR)) {
                                        transport._resources.sulfur = parseInt(item.text.split(database.getGlobalData.getLocalisedString('thousandSeperator')).join(''));
                                    } else if (Utils.existsIn(item['class'], Constant.Resources.GOLD)) {
                                        transport._resources.gold = parseInt(item.text.split(database.getGlobalData.getLocalisedString('thousandSeperator')).join(''));
                                    }
                                });
                                break;
                            case 'deployarmy':
                            case 'deployfleet':
                            case 'plunder':
                                transport._military = new MilitaryUnits();
                                $.each(data['js_MilitaryMovementsEventRow' + value + 'UnitDetails'].appendElement, function (index, item) {
                                    $.each(Constant.UnitData, function findIsUnit(val, info) {
                                        if (Utils.existsIn(item['class'], ' ' + val)) {
                                            transport._military.setUnit(val, parseInt(item.text));
                                            return false;
                                        }
                                    });
                                });
                                break;
                            default:
                                return true;
                        }
                        database.getGlobalData.addFleetMovement(transport);
                        changes.push(transport._targetCityId);
                    });
                }
                if (changes.length) events(Constant.Events.MOVEMENTS_UPDATED).pub($.exclusive(changes));
            } catch (e) {
                empire.error('parseMilitaryAdvisor', e);
            } finally {
            }
            render.toast('Updated: ' + $('#js_MilitaryMovementsFleetMovements h3').text());
        },
        parseCityMilitary: function () {
            try {
                var $elemArmy = $('#tabUnits').find('> div.contentBox01h td');
                var $elemShips = $('#tabShips').find('> div.contentBox01h td');
                var city = ikariam.getCurrentCity;
                var cityArmy = {};
                cityArmy[Constant.Military.SLINGER] = parseInt($elemArmy[5].innerHTML.split(database.getGlobalData.getLocalisedString('thousandSeperator')).join(''));
                cityArmy[Constant.Military.SWORDSMAN] = parseInt($elemArmy[4].innerHTML.split(database.getGlobalData.getLocalisedString('thousandSeperator')).join(''));
                cityArmy[Constant.Military.HOPLITE] = parseInt($elemArmy[1].innerHTML.split(database.getGlobalData.getLocalisedString('thousandSeperator')).join(''));
                cityArmy[Constant.Military.MARKSMAN] = parseInt($elemArmy[7].innerHTML.split(database.getGlobalData.getLocalisedString('thousandSeperator')).join(''));
                cityArmy[Constant.Military.MORTAR] = parseInt($elemArmy[11].innerHTML.split(database.getGlobalData.getLocalisedString('thousandSeperator')).join(''));
                cityArmy[Constant.Military.CATAPULT] = parseInt($elemArmy[10].innerHTML.split(database.getGlobalData.getLocalisedString('thousandSeperator')).join(''));
                cityArmy[Constant.Military.RAM] = parseInt($elemArmy[8].innerHTML.split(database.getGlobalData.getLocalisedString('thousandSeperator')).join(''));
                cityArmy[Constant.Military.STEAM_GIANT] = parseInt($elemArmy[2].innerHTML.split(database.getGlobalData.getLocalisedString('thousandSeperator')).join(''));
                cityArmy[Constant.Military.BALLOON_BOMBADIER] = parseInt($elemArmy[13].innerHTML.split(database.getGlobalData.getLocalisedString('thousandSeperator')).join(''));
                cityArmy[Constant.Military.COOK] = parseInt($elemArmy[14].innerHTML.split(database.getGlobalData.getLocalisedString('thousandSeperator')).join(''));
                cityArmy[Constant.Military.DOCTOR] = parseInt($elemArmy[15].innerHTML.split(database.getGlobalData.getLocalisedString('thousandSeperator')).join(''));
                cityArmy[Constant.Military.GYROCOPTER] = parseInt($elemArmy[12].innerHTML.split(database.getGlobalData.getLocalisedString('thousandSeperator')).join(''));
                cityArmy[Constant.Military.ARCHER] = parseInt($elemArmy[6].innerHTML.split(database.getGlobalData.getLocalisedString('thousandSeperator')).join(''));
                cityArmy[Constant.Military.SPEARMAN] = parseInt($elemArmy[3].innerHTML.split(database.getGlobalData.getLocalisedString('thousandSeperator')).join(''));
                cityArmy[Constant.Military.SPARTAN] = parseInt($elemArmy[16].innerHTML.split(database.getGlobalData.getLocalisedString('thousandSeperator')).join(''));

                cityArmy[Constant.Military.RAM_SHIP] = parseInt($elemShips[3].innerHTML.split(database.getGlobalData.getLocalisedString('thousandSeperator')).join(''));
                cityArmy[Constant.Military.FLAME_THROWER] = parseInt($elemShips[1].innerHTML.split(database.getGlobalData.getLocalisedString('thousandSeperator')).join(''));
                cityArmy[Constant.Military.SUBMARINE] = parseInt($elemShips[8].innerHTML.split(database.getGlobalData.getLocalisedString('thousandSeperator')).join(''));
                cityArmy[Constant.Military.BALLISTA_SHIP] = parseInt($elemShips[4].innerHTML.split(database.getGlobalData.getLocalisedString('thousandSeperator')).join(''));
                cityArmy[Constant.Military.CATAPULT_SHIP] = parseInt($elemShips[5].innerHTML.split(database.getGlobalData.getLocalisedString('thousandSeperator')).join(''));
                cityArmy[Constant.Military.MORTAR_SHIP] = parseInt($elemShips[6].innerHTML.split(database.getGlobalData.getLocalisedString('thousandSeperator')).join(''));
                cityArmy[Constant.Military.STEAM_RAM] = parseInt($elemShips[2].innerHTML.split(database.getGlobalData.getLocalisedString('thousandSeperator')).join(''));
                cityArmy[Constant.Military.ROCKET_SHIP] = parseInt($elemShips[7].innerHTML.split(database.getGlobalData.getLocalisedString('thousandSeperator')).join(''));
                cityArmy[Constant.Military.PADDLE_SPEEDBOAT] = parseInt($elemShips[10].innerHTML.split(database.getGlobalData.getLocalisedString('thousandSeperator')).join(''));
                cityArmy[Constant.Military.BALLOON_CARRIER] = parseInt($elemShips[11].innerHTML.split(database.getGlobalData.getLocalisedString('thousandSeperator')).join(''));
                cityArmy[Constant.Military.TENDER] = parseInt($elemShips[12].innerHTML.split(database.getGlobalData.getLocalisedString('thousandSeperator')).join(''));
                var changes = city.military.updateUnits(cityArmy);
                $elemArmy = null;
                $elemShips = null;
                events(Constant.Events.MILITARY_UPDATED).pub(city.getId, changes);

            } catch (e) {
                empire.error('parseCityMilitary', e);
            } finally {
            }
        },
        parsePremium: function (view, html, tData) {
            var changes = [];
            var features = [];
            $('#premiumOffers').find('table.table01 tbody > tr[class]:not([class=""])')
                .each(function () {
                var item = $(this).attr('class').split(' ').shift();
                if (Constant.PremiumData[item] !== undefined) {
                    features.push(item);
                }
            });
            $.each(features, function (index, val) {
                var active = false;
                var endTime = 0;
                var continuous = false;
                var type = 0;
                active = $('#js_buy' + val + 'ActiveTime').hasClass('green');
                if (active) {
                    endTime = parseInt($('#js_buy' + val + 'Link').attr('href').split('typeUntil=').pop().split('&').shift()) - Constant.PremiumData[val].duration;
                    if (isNaN(endTime)) {
                        var str = $('#js_buy' + val + 'ActiveTime').text();
                        var time = new Date();
                        time.setSeconds(time.getSeconds() + (str.match(/(\d+)s/) ? parseInt(str.match(/(\d+)s/)[1]) : 0));
                        time.setMinutes(time.getMinutes() + (str.match(/(\d+)m/) ? parseInt(str.match(/(\d+)m/)[1]) : 0));
                        time.setHours(time.getHours() + (str.match(/(\d+)h/) ? parseInt(str.match(/(\d+)h/)[1]) : 0));
                        time.setDate(time.getDate() + (str.match(/(\d+)D/) ? parseInt(str.match(/(\d+)D/)[1]) : 0));
                        endTime = time.getTime() / 1000;
                    }
                    type = parseInt($('#js_buy' + val + 'Link').attr('href').split('type=').pop().split('&').shift());
                    continuous = $('#empireViewExtendCheckbox' + type + 'Img').hasClass('checked');
                }
                changes.push(database.getGlobalData.setPremiumFeature(val, endTime * 1000, continuous));
            });
            events(Constant.Events.PREMIUM_UPDATED).pub(changes);
            render.toast('Updated: ' + $('#premium').children(":first").text());
        },
        FetchAllTowns: function () {
            var _relatedCityData = unsafeWindow.ikariam.model.relatedCityData;
            var _cityId = null;
            var city = null;
            var order = database.settings.cityOrder.value;
            if (!order.length) order = [];
            if (_relatedCityData) {
                for (_cityId in _relatedCityData) {
                    if (_cityId != 'selectedCity' && _cityId != 'additionalInfo') {
                        var own = (_relatedCityData[_cityId].relationship == 'ownCity');
                        var deployed = (_relatedCityData[_cityId].relationship == 'deployedCities');
                        var occupied = (_relatedCityData[_cityId].relationship == 'occupiedCities');
                        if (own) {
                            if (database.cities[_relatedCityData[_cityId].id] == undefined) {
                                (database.cities[_relatedCityData[_cityId].id] = database.addCity(_relatedCityData[_cityId].id)).init();
                                city = database.cities[_relatedCityData[_cityId].id];
                                city.updateTradeGoodID(parseInt(_relatedCityData[_cityId].tradegood));
                                city.isOwn = own;
                            }
                            city = database.cities[_relatedCityData[_cityId].id];
                            city.updateName(_relatedCityData[_cityId].name);
                            var coords = _relatedCityData[_cityId].coords.match(/(\d+)/);
                            city.updateCoordinates(coords[0], coords[1]);
                            if ($.inArray(city.getId, order) == -1) {
                                order.push(city.getId);
                            }
                        }
                    }
                }
                //remove deleted cities
                for (var cID in database.cities) {
                    var ghost = true;
                    for (_cityId in _relatedCityData) {
                        if (_relatedCityData[_cityId].id == cID || !database.cities[cID].isOwn) {
                            ghost = false;
                        }
                    }
                    if (ghost) {
                        delete database.cities[cID];
                    }
                }
            }
            database.settings.cityOrder.value = order;
        },
        get currentShips() {
            if (this.$freeTransporters == undefined) {
                this.$freeTransporters = $('#js_GlobalMenu_freeTransporters');
            }
            return parseInt(this.$freeTransporters.text());
        }
    };

    /***********************************************************************************************************************
 * Constants
 **********************************************************************************************************************/
    var Constant = {
        PremiumData: {
            PremiumAccount: {
                type: 15,
                duration: 7 * 24 * 60,
                cost: 0,
                bonus: 0,
                icon: 'cdn/all/both/premium/premium_account.png'
            },
            ResourceBonus: {
                type: 16,
                duration: 7 * 24 * 60,
                cost: 0,
                bonus: 0.2,
                icon: 'cdn/all/both/premium/b_premium_wood.jpg'
            },
            WineBonus: {
                type: 14,
                duration: 7 * 24 * 60,
                cost: 0,
                bonus: 0.2,
                icon: 'cdn/all/both/premium/b_premium_wine.jpg'
            },
            MarbleBonus: {
                type: 11,
                duration: 7 * 24 * 60,
                cost: 0,
                bonus: 0.2,
                icon: 'cdn/all/both/premium/b_premium_marble.jpg'
            },
            SulfurBonus: {
                type: 12,
                duration: 7 * 24 * 60,
                cost: 0,
                bonus: 0.2,
                icon: 'cdn/all/both/premium/b_premium_sulfur.jpg'
            },
            CrystalBonus: {
                type: 13,
                duration: 7 * 24 * 60,
                cost: 0,
                bonus: 0.2,
                icon: 'cdn/all/both/premium/b_premium_crystal.jpg'
            },
            ResearchPointsBonus: {
                type: 18,
                duration: 7 * 24 * 60,
                cost: 0,
                bonus: 0.2,
                icon: 'cdn/all/both/premium/b_premium_research.jpg'
            },
            ResearchPointsBonusExtremeLength: {
                type: 0,
                duration: 70 * 24 * 60,
                cost: 0,
                bonus: 0.2,
                icon: 'cdn/all/both/premium/b_premium_research_big.jpg'
            },
            SafecapacityBonus: {
                type: 17,
                duration: 7 * 24 * 60,
                cost: 0,
                bonus: 1,
                icon: 'cdn/all/both/premium/b_premium_safecapacity.jpg'
            },
            StoragecapacityBonus: {
                type: 33,
                duration: 7 * 24 * 60,
                cost: 0,
                bonus: 1,
                icon: 'cdn/all/both/premium/b_premium_storagecapacity.jpg'
            }
        },
        Premium: {
            PREMIUM_ACCOUNT: 'PremiumAccount',
            WOOD_BONUS: 'ResourceBonus',
            WINE_BONUS: 'WineBonus',
            MARBLE_BONUS: 'MarbleBonus',
            SULFUR_BONUS: 'SulfurBonus',
            CRYSTAL_BONUS: 'CrystalBonus',
            RESEARCH_POINTS_BONUS: 'ResearchPointsBonus',
            RESEARCH_POINTS_BONUS_EXTREME_LENGTH: 'ResearchPointsBonusExtremeLength',
            SAFECAPACITY_BONUS: 'SafecapacityBonus',
            STORAGECAPACITY_BONUS: 'StoragecapacityBonus',
        },
        Events: {
            BUILDINGS_UPDATED: 'buildingsUpdated',
            GLOBAL_UPDATED: 'globalDataUpdated',
            MOVEMENTS_UPDATED: 'movementsUpdated',
            RESOURCES_UPDATED: 'resourcesUpdated',
            CITY_UPDATED: 'cityData',
            MILITARY_UPDATED: 'militaryUpdated',
            LOCAL_STRINGS_AVAILABLE: 'localisationAvailable',
            MODEL_AVAILABLE: 'modelAvailable',
            CITYDATA_AVAILABLE: 'cityDataAvailable',
            DATABASE_LOADED: 'databaseLoaded',
            TAB_CHANGED: 'tabChanged',
            PREMIUM_UPDATED: 'premiumUpdated',
        },
        Settings: {
            CITY_ORDER: 'cityOrder',
            FULL_ARMY_TABLE: 'fullArmyTable',
            PLAYER_INFO: 'playerInfo',
            ON_IKA_LOGS: 'onIkaLogs',
            HIDE_WORLD: 'hideOnWorldView',
            HIDE_ISLAND: 'hideOnIslandView',
            HIDE_CITY: 'hideOnCityView',
            SHOW_ON_TOP: 'onTop',
            WINDOW_TENNIS: 'windowTennis',
            AUTO_UPDATE: 'autoUpdates',
            SMALLER_FONT: 'smallFont',
            GOLD_LONG: 'GoldShort',
            NEWS_TICKER: 'newsTicker',
            EVENT: 'event',
            LOGIN_POPUP: 'logInPopup',
            BIRD_SWARM: 'birdSwarm',
            WALKERS: 'walkers',
            NO_PIRACY: 'noPiracy',
            CONTROL_CENTER: 'controlCenter',
            WITHOUT_FABLE: 'withoutFable',
            AMBROSIA_PAY: 'ambrosiaPay',
            ALTERNATIV_BUILDINGS: 'alternativeBuildingList',
            COMPRESS_BUILDINGS: 'compressedBuildingList',
            HOURLY_RESS: 'hourlyRess',
            WINE_OUT: 'wineOut',
            DAILY_BONUS: 'dailyBonus',
            WINE_WARNING: 'wineWarning',
            WINE_WARNING_TIME: 'wineWarningTime',
            LANGUAGE_CHANGE: 'languageChange',
        },
        SettingData: {
            cityOrder: { type: 'array', default: [], categories: 'ignore' },
            fullArmyTable: { type: 'boolean', default: false, categories: 'army_category' },
            playerInfo: { type: 'boolean', default: false, categories: 'army_category' },
            onIkaLogs: { type: 'boolean', default: false, categories: 'army_category' },
            hideOnWorldView: { type: 'boolean', default: false, categories: 'visibility_category' },
            hideOnIslandView: { type: 'boolean', default: false, categories: 'visibility_category' },
            hideOnCityView: { type: 'boolean', default: false, categories: 'visibility_category' },
            onTop: { type: 'boolean', default: false, categories: 'display_category' },
            windowTennis: { type: 'boolean', default: false, categories: 'display_category' },
            autoUpdates: { type: 'boolean', default: false, categories: 'global_category' },
            smallFont: { type: 'boolean', default: false, categories: 'display_category' },
            GoldShort: { type: 'boolean', default: false, categories: 'display_category' },
            newsTicker: { type: 'boolean', default: false, categories: 'display_category' },
            event: { type: 'boolean', default: false, categories: 'display_category' },
            logInPopup: { type: 'boolean', default: false, categories: 'display_category' },
            birdSwarm: { type: 'boolean', default: false, categories: 'display_category' },
            walkers: { type: 'boolean', default: false, categories: 'display_category' },
            noPiracy: { type: 'boolean', default: false, categories: 'display_category' },
            controlCenter: { type: 'boolean', default: false, categories: 'display_category' },
            withoutFable: { type: 'boolean', default: false, categories: 'display_category' },
            ambrosiaPay: { type: 'boolean', default: false, categories: 'display_category' },
            alternativeBuildingList: { type: 'boolean', default: false, categories: 'building_category' },
            compressedBuildingList: { type: 'boolean', default: false, category: 'building_category' },
            hourlyRess: { type: 'boolean', default: false, categories: 'resource_category' },
            wineOut: { type: 'boolean', default: false, categories: 'resource_category' },
            dailyBonus: { type: 'boolean', default: false, categories: 'resource_category' },
            wineWarning: { type: 'boolean', default: false, categories: 'resource_category' },
            wineWarningTime: { type: 'number', default: 0, choices: [0, 12, 24, 36, 48, 96], categories: 'resource_category' },
            languageChange: { type: 'language', default: ikariam.Language(), selection: ['en', 'de', 'it', 'el', 'es', 'fr', 'ro', 'ru', 'cz', 'pl', 'ar', 'ir', 'pt', 'tr', 'nl'], categories: 'language_category' },
        },
        SettingCategories: {
            VISIBILITY: 'visibility_category',
            DISPLAY: 'display_category',
            OTHER: 'global_category',
            ARMY: 'army_category',
            BUILDING: 'building_category',
            RESOURCE: 'resource_category',
            LANGUAGE: 'language_category',
        },

        LanguageData: {
            en: {
                buildings: 'Buildings',
                economy: 'Economy',
                military: 'Military',
                towns: 'Towns',
                townHall: 'Town Hall',
                palace: 'Palace',
                palaceColony: 'Governor\`s Residence',
                tavern: 'Tavern',
                museum: 'Museum',
                academy: 'Academy',
                workshop: 'Workshop',
                temple: 'Temple',
                embassy: 'Embassy',
                warehouse: 'Warehouse',
                dump: 'Depot',
                port: 'Trading Port',
                branchOffice: 'Trading Post',
                wall: 'Town Wall',
                safehouse: 'Hideout',
                barracks: 'Barracks',
                shipyard: 'Shipyard',
                forester: 'Forester\`s House',
                carpentering: 'Carpenter\`s Workshop',
                winegrower: 'Winery',
                vineyard: 'Wine Press',
                stonemason: 'Stonemason',
                architect: 'Architect\`s Office',
                chronosForge: 'Chronos’ Forge',
                glassblowing: 'Glassblower',
                optician: 'Optician',
                alchemist: 'Alchemist\`s Tower',
                fireworker: 'Firework Test Area',
                pirateFortress: 'Pirate Fortress',
                dockyard: 'Dockyard',
                shrineOfOlympus: 'Gods’ Shrine',
                blackMarket: 'Black Market',
                marineChartArchive: 'Sea Chart Archive',
                tavern_level: 'Tavern Level',
                corruption: 'Corruption',
                cultural: 'Cultural Goods',
                population: 'Population',
                citizens: 'Citizens',
                scientists: 'Scientists',
                scientists_max: 'max. Scientists',
                options: 'Options',
                help: 'Help',
                agora: 'to Agora',
                to_world: 'Show World',
                to_island: 'Show Island',
                army_cost: 'Army Cost',
                fleet_cost: 'Fleet Cost',
                army_supply: 'Army Supply',
                fleet_supply: 'Fleet Supply',
                research_cost: 'Research Cost',
                income: 'Income',
                expenses: 'Expenses',
                balances: 'Balances',
                espionage: 'View Espionage',
                contracts: 'View Contracts',
                combat: 'View Combats',
                satisfaction: 'Satisfaction',
                total_: 'total',
                max_Level: 'max. Level',
                actionP: 'Action Points',
                researchP: 'Research Points',
                finances_: 'Finances',
                free_ground: 'free Building Ground',
                wood_: 'Building Material',
                wine_: 'Wine',
                marble_: 'Marble',
                crystal_: 'Crystal Glass',
                sulphur_: 'Sulphur',
                angry: 'angry',
                unhappy: 'unhappy',
                neutral: 'neutral',
                happy: 'happy',
                euphoric: 'euphoric',
                housing_space: 'max. Housing space',
                free_Citizens: 'free Citizens',
                free_housing_space: 'free Housing space',
                level_tavern: 'Level Tavern',
                maximum: 'maximum',
                used: 'used',
                missing: 'missing',
                plundergold: 'Gold',
                garrision: 'Garrison limit',
                Sea: 'Sea',
                Inland: 'Inland',
                full: '0',
                off: 'off',
                time_to_full: 'to full',
                time_to_empty: 'to empty',
                capacity: 'Capacity',
                safe: 'Safe',
                training: 'Training',
                plundering: 'Plundering',
                constructing: 'Expansion in Progress',
                next_Level: 'Needed for Level',
                transport: 'Transports',
                loading: 'loading',
                en_route: 'en route',
                arrived: 'arrived',
                arrival: 'Arrival',
                to_town_hall: 'to Town Hall',
                to_saw_mill: 'to Saw Mill',
                to_mine: 'to luxury good',
                to_barracks: 'to Barracks',
                to_shipyard: 'to Shipyard',
                member: 'View Memberlist',
                transporting: 'Transport to',
                transporting_units: 'Deploying troops to',
                transporting_fleets: 'Moving fleet to',
                today: 'today',
                tomorrow: 'tomorrow',
                yesterday: 'yesterday',
                second: 's',
                minute: 'm',
                hour: 'h',
                day: 'D',
                week: 'W',
                month: 'M',
                year: 'Y',
                hour_long: 'Hour',
                day_long: 'Day',
                week_long: 'Week',
                ika_world: 'Search on Ikariam-World',
                charts: 'Show Charts',
                wonder1: 'Hephaistos\` Forge',
                wonder2: 'Hades\` Holy Grove',
                wonder3: 'Demeter\`s gardens',
                wonder4: 'Athena\`s Parthenon',
                wonder5: 'Temple of Hermes',
                wonder6: 'Ares\` stronghold',
                wonder7: 'Temple of Poseidon',
                wonder8: 'Colossus',
                //settings
                cityOrder: 'cityOrder',
                fullArmyTable: 'Show all military units',
                hideOnWorldView: 'Force hide on world view',
                hideOnIslandView: 'Force hide on island view',
                hideOnCityView: 'Force hide on city view',
                onTop: 'Show on top of Ikariam windows',
                windowTennis: 'Show above ikariam on mouseover',
                autoUpdates: 'Automaticly check for updates',
                smallFont: 'Use smaller font size',
                goldShort: 'Reduce total gold display',
                alternativeBuildingList: 'Use alternative building list',
                compressedBuildingList: 'Use compressed building list',
                wineOut: 'Disable Ambrosia feature "Out of Wine"',
                dailyBonus: 'Automatically confirm the daily bonus',
                unnecessaryTexts: 'Removes unnecessary descriptions',
                ambrosiaPay: 'Deactivate new Ambrosia buying options',
                wineWarning: 'Hide tooltip "wine warning"',
                wineWarningTime: 'Wine remaining warning',
                languageChange: 'Change language',
                current_Version: 'Current Version<b>:</b>',
                ikariam_Version: 'Ikariam Version<b>:</b>',
                reset: 'Reset all settings to default',
                goto_website: 'Goto the scripts greasyfork.org website',
                website: 'Website',
                Check_for_updates: 'Force a check for updates',
                check: 'Check for updates',
                Report_bug: 'Report a bug in the script',
                report: 'Report Bug',
                save: 'Save',
                save_settings: 'Save settings<b>!</b>&nbsp;',
                newsticker: 'Hide news ticker',
                event: 'Hide events',
                logInPopup: 'Hide the Info Window when login',
                birdswarm: 'Hide the bird swarm',
                walkers: 'Hide animated citizens',
                noPiracy: 'No Piracy',
                hourlyRes: 'Hide hourly resources',
                onIkaLogs: 'Use IkaLog Battle Report Converter',
                playerInfo: 'Show information about player',
                control: 'Hide Control center',
                alert: 'Please choose only one option!',
                alert_palace: 'Please visit your capital city first',
                alert_palace1: 'There is still no palace present in your city.\n Please explore expansion and build a palace.',
                alert_toast: 'Data Reset, reloading the page in a few seconds',
                alert_error: 'An error occurred while checking for updates: ',
                alert_noUpdate: 'No update is available for "',
                alert_update: 'There is an update available for the Greasemonkey script "',
                alert_update1: 'Would you like to go to the install page now?',
                alert_daily: 'Please enable \'Automatically confirm the daily bonus \'',
                alert_wine: 'Warning wine > ',
                en: 'English',
                // Units
                phalanx: 'Hoplite',
                steamgiant: 'Steam Giant',
                spearman: 'Spearman',
                swordsman: 'Swordsman',
                slinger: 'Slinger',
                archer: 'Archer',
                marksman: 'Sulphur Carabineer',
                ram: 'Battering Ram',
                catapult: 'Catapult',
                mortar: 'Mortar',
                gyrocopter: 'Gyrocopter',
                bombardier: 'Ballon-Bombardier',
                cook: 'Cook',
                medic: 'Doctor',
                spartan: 'Spartan',
                ship_ram: 'Ram Ship',
                ship_flamethrower: 'Fire Ship',
                ship_steamboat: 'Steam Ram',
                ship_ballista: 'Ballista Ship',
                ship_catapult: 'Catapult Ship',
                ship_mortar: 'Mortar Ship',
                ship_submarine: 'Diving Boat',
                ship_paddlespeedship: 'Paddle Speedboat',
                ship_ballooncarrier: 'Ballon Carrier',
                ship_tender: 'Tender',
                ship_rocketship: 'Rocket Ship',
                //settings descriptions
                cityOrder_description: 'cityOrder_description',
                fullArmyTable_description: 'Show all possible army units on the Army tab',
                hideOnWorldView_description: 'Hide by default on world view',
                hideOnIslandView_description: 'Hide by default on island view',
                hideOnCityView_description: 'Hide by default on city view',
                onTop_description: 'Show board on top of Ikariam windows',
                windowTennis_description: 'Bring board to the top on mouseover<br>Send behind ikariam windows on mouseout<br>Ignores \'on top\' option',
                autoUpdates_description: 'Enable automatic update checking<br>(Once every 24hrs)',
                smallFont_description: 'Use a smaller font for the data tables',
                goldShort_description: 'Total gold display shorten on the Board',
                alternativeBuildingList_description: 'Use alternative building table',
                compressedBuildingList_description: 'Use condensed building table<br>Groups luxury resource production buildings<br>Groups palace/govenors residence',
                wineOut_description: 'Disables the Ambrosia option to buy \'Out of Wine\'',
                dailyBonus_description: 'The daily bonus will be automatically confirmed<br>and the window is no longer displayed',
                unnecessaryTexts_description: 'Removes unnecessary descriptions in buildings,<br>the building list of buildings, minimize scrolling',
                ambrosiaPay_description: 'Disables the new Ambrosia buying options,<br>click on the button cancels the action',
                wineWarning_description: 'Hide tooltip \'wine warning\'',
                wineWarningTime_description: 'Wine remaining time turns, \'red\' at this point',
                languageChange_description: 'Change the language',
                newsticker_description: 'Hide news ticker in the GF-toolbar',
                event_description: 'Hide events under the advisers',
                logInPopup_description: 'Hide the Info Window when login',
                birdswarm_description: 'Hide the bird swarm in island and city view',
                walkers_description: 'Hide animated citizens and transport ships in island and city view',
                noPiracy_description: 'Removes the Pirate Plot',
                hourlyRes_description: 'Hide hourly resources in the infobar',
                onIkaLogs_description: 'use IkaLogs for your battle reports',
                playerInfo_description: 'View information from the players in the island view',
                control_description: 'Hide the Control center in world, island and city view',
                // settings categories
                visibility_category: '<b>Board Visibility</b>',
                display_category: '<b>Display Settings</b>',
                global_category: '<b>Global Settings</b>',
                army_category: '<b>Army Settings</b>',
                building_category: '<b>Building Settings</b>',
                resource_category: '<b>Resource Settings</b>',
                language_category: '<b>Language Settings</b>',
                // Helptable
                Initialize_Board: '<b>Initialize Board</b>',
                on_your_Town_Hall: 'on your Town Hall and go through each town with that view open',
                on_the_Troops: 'on the \"Troops in town\" tab on left side and go through each town with that view open',
                on_Museum: 'on Museum and then the \"Distribute Cultural Treaties\" tab',
                on_Research_Advisor: 'on Research Advisor and then click on each of the 4 research tabs in the left window',
                on_your_Palace: 'on your Palace',
                on_your_Finance: 'on your Finance tab',
                on_the_Ambrosia: 'on the \"Ambrosia shop\"',
                Re_Order_Towns: '<b>Re-Order Towns</b>',
                Reset_Position: '<b>Reset Position</b>',
                On_any_tab: 'On any tab, drag the resource icon to the left of the town name',
                Right_click: 'Right click on the empire menu button on the left side page menu',
                Navigate: '1, 2, 3 ... 0, -, = <b>:&nbsp;&nbsp;</b> Navigate to town 1 to 12',
                Navigate_to_City: 'SHIFT + 1/2/3/4/5/4/5 <b>:&nbsp;&nbsp;</b> Navigate to City/ Building/ Army/ Setting/ Help tab',
                Navigate_to: 'Q, W, E, R <b>:&nbsp;&nbsp;</b> Navigate to City/ Military/ Research/ Diplomacy advisor',
                Navigate_to_World: 'SHIFT + Q, W, E <b>:&nbsp;&nbsp;</b> Navigate to World/ Island/ City view',
                Spacebar: 'Spacebar<b>:&nbsp;&nbsp;</b> Minimise/ Maximise the board',
                Hotkeys: '<b>Hotkeys</b>',
                // formatting
                thousandSeperator: ',',
                decimalPoint: '.',
                click_: '<b>Click</b>'
            }
        },

        Resources: {
            GOLD: 'gold',
            WOOD: 'wood',
            WINE: 'wine',
            MARBLE: 'marble',
            GLASS: 'glass',
            SULFUR: 'sulfur'
        },
        ResourceIDs: {
            GOLD: 'gold',
            WOOD: 'resource',
            WINE: 1,
            MARBLE: 2,
            GLASS: 3,
            SULFUR: 4
        },
        Research: {
            Seafaring: {
                CARPENTRY: 2150,
                DECK_WEAPONS: 1010,
                PIRACY: 1170,
                SHIP_MAINTENANCE: 1020,
                DRAFT: 1130,
                EXPANSION: 1030,
                FOREIGN_CULTURES: 1040,
                PITCH: 1050,
                MARKET: 2070,
                GREEK_FIRE: 1060,
                COUNTERWEIGHT: 1070,
                DIPLOMACY: 1080,
                SEA_MAPS: 1090,
                PADDLE_WHEEL_ENGINE: 1100,
                CAULKING: 1140,
                MORTAR_ATTACHMENT: 1110,
                MASSIVE_RAM: 1150,
                OFFSHORE_BASE: 1160,
                SEAFARING_FUTURE: 1999
            },
            Economy: {
                CONSERVATION: 2010,
                PULLEY: 2020,
                WEALTH: 2030,
                WINE_CULTURE: 2040,
                IMPROVED_RESOURCE_GATHERING: 2130,
                GEOMETRY: 2060,
                ARCHITECTURE: 1120,
                HOLIDAY: 2080,
                LEGISLATION: 2170,
                CULINARY_SPECIALITIES: 2050,
                HELPING_HANDS: 2090,
                SPIRIT_LEVEL: 2100,
                WINE_PRESS: 2140,
                DEPOT: 2160,
                SOLDIER_EXCHANGE: 2180,
                BUREACRACY: 2110,
                UTOPIA: 2120,
                ECONOMIC_FUTURE: 2999
            },
            Science: {
                WELL_CONSTRUCTION: 3010,
                PAPER: 3020,
                ESPIONAGE: 3030,
                POLYTHEISM: 3040,
                INK: 3050,
                GOVERNMENT_FORMATION: 3150,
                INVENTION: 3140,
                CULTURAL_EXCHANGE: 3060,
                ANATOMY: 3070,
                OPTICS: 3080,
                EXPERIMENTS: 3081,
                MECHANICAL_PEN: 3090,
                BIRDS_FLIGHT: 3100,
                ARCHIVING: 3170,
                LETTER_CHUTE: 3110,
                STATE_RELIGION: 3160,
                PRESSURE_CHAMBER: 3120,
                ARCHIMEDEAN_PRINCIPLE: 3130,
                SCIENTIFIC_FUTURE: 3999
            },
            Military: {
                DRY_DOCKS: 4010,
                MAPS: 4020,
                PROFESSIONAL_ARMY: 4030,
                SEIGE: 4040,
                CODE_OF_HONOR: 4050,
                BALLISTICS: 4060,
                LAW_OF_THE_LEVEL: 4070,
                GOVERNOR: 4080,
                PYROTECHNICS: 4130,
                LOGISTICS: 4090,
                GUNPOWDER: 4100,
                ROBOTICS: 4110,
                CANNON_CASTING: 4120,
                MILITARISTIC_FUTURE: 4999
            }
        },
        Military: {
            // Army
            HOPLITE: 'phalanx',
            SPARTAN: 'spartan',
            STEAM_GIANT: 'steamgiant',
            SPEARMAN: 'spearman',
            SWORDSMAN: 'swordsman',
            SLINGER: 'slinger',
            ARCHER: 'archer',
            MARKSMAN: 'marksman',
            RAM: 'ram',
            CATAPULT: 'catapult',
            MORTAR: 'mortar',
            GYROCOPTER: 'gyrocopter',
            BALLOON_BOMBADIER: 'bombardier',
            COOK: 'cook',
            DOCTOR: 'medic',
            ARMY: 'army',

            // Navy
            RAM_SHIP: 'ship_ram',
            FLAME_THROWER: 'ship_flamethrower',
            STEAM_RAM: 'ship_steamboat',
            BALLISTA_SHIP: 'ship_ballista',
            CATAPULT_SHIP: 'ship_catapult',
            MORTAR_SHIP: 'ship_mortar',
            SUBMARINE: 'ship_submarine',
            PADDLE_SPEEDBOAT: 'ship_paddlespeedship',
            BALLOON_CARRIER: 'ship_ballooncarrier',
            TENDER: 'ship_tender',
            ROCKET_SHIP: 'ship_rocketship',
            NAVY: 'navy'
        },
        unitIds: {
            301: 'slinger',
            302: 'swordsman',
            303: 'phalanx',
            304: 'marksman',
            305: 'mortar',
            306: 'catapult',
            307: 'ram',
            308: 'steamgiant',
            309: 'bombardier',
            310: 'cook',
            311: 'medic',
            312: 'gyrocopter',
            313: 'archer',
            315: 'spearman',
            316: 'barbarian',
            319: 'spartan',

            210: 'ship_ram',
            211: 'ship_flamethrower',
            212: 'ship_submarine',
            213: 'ship_ballista',
            214: 'ship_catapult',
            215: 'ship_mortar',
            216: 'ship_steamboat',
            217: 'ship_rocketship',
            218: 'ship_paddlespeedship',
            219: 'ship_ballooncarrier',
            220: 'ship_tender'
        },
        UnitData: {
            slinger: { id: 301, type: 'army', position: 'army_ranged', minlevel: 2, baseTime: 90, baseCost: 2 },
            swordsman: { id: 302, type: 'army', position: 'army_flank', minlevel: 6, baseTime: 180, baseCost: 4 },
            phalanx: { id: 303, type: 'army', position: 'army_front_line', minlevel: 4, baseTime: 300, baseCost: 3 },
            marksman: { id: 304, type: 'army', position: 'army_ranged', minlevel: 13, baseTime: 600, baseCost: 3 },
            mortar: { id: 305, type: 'army', position: 'army_seige', minlevel: 14, baseTime: 2400, baseCost: 30 },
            catapult: { id: 306, type: 'army', position: 'army_seige', minlevel: 8, baseTime: 1800, baseCost: 25 },
            ram: { id: 307, type: 'army', position: 'army_seige', minlevel: 2, baseTime: 600, baseCost: 15 },
            steamgiant: { id: 308, type: 'army', position: 'army_front_line', minlevel: 12, baseTime: 900, baseCost: 12 },
            bombardier: { id: 309, type: 'army', position: 'army_air', minlevel: 11, baseTime: 1800, baseCost: 45 },
            cook: { id: 310, type: 'army', position: 'army_support', minlevel: 5, baseTime: 1200, baseCost: 10 },
            medic: { id: 311, type: 'army', position: 'army_support', minlevel: 9, baseTime: 1200, baseCost: 20 },
            gyrocopter: { id: 312, type: 'army', position: 'army_air', minlevel: 10, baseTime: 900, baseCost: 15 },
            archer: { id: 313, type: 'army', position: 'army_ranged', minlevel: 7, baseTime: 240, baseCost: 4 },
            spearman: { id: 315, type: 'army', position: 'army_flank', minLevel: 1, baseTime: 60, baseCost: 1 },
            spartan: { id: 319, type: 'army', position: 'army_front_line', minLevel: 0, baseTime: 0, baseCost: 0 },
            ship_ram: { id: 210, type: 'fleet', position: 'navy_flank', minlevel: 1, baseTime: 2400, baseCost: 15 },
            ship_flamethrower: { id: 211, type: 'fleet', position: 'navy_front_line', minlevel: 4, baseTime: 1800, baseCost: 25 },
            ship_submarine: { id: 212, type: 'fleet', position: 'navy_seige', minlevel: 19, baseTime: 3600, baseCost: 50 },
            ship_ballista: { id: 213, type: 'fleet', position: 'navy_ranged', minlevel: 3, baseTime: 3000, baseCost: 20 },
            ship_catapult: { id: 214, type: 'fleet', position: 'navy_ranged', minlevel: 3, baseTime: 3000, baseCost: 35 },
            ship_mortar: { id: 215, type: 'fleet', position: 'navy_ranged', minlevel: 17, baseTime: 3000, baseCost: 50 },
            ship_steamboat: { id: 216, type: 'fleet', position: 'navy_front_line', minlevel: 15, baseTime: 2400, baseCost: 45 },
            ship_rocketship: { id: 217, type: 'fleet', position: 'navy_seige', minlevel: 11, baseTime: 3600, baseCost: 55 },
            ship_paddlespeedship: { id: 218, type: 'fleet', position: 'navy_air', minlevel: 13, baseTime: 1800, baseCost: 5 },
            ship_ballooncarrier: { id: 219, type: 'fleet', position: 'navy_air', minlevel: 7, baseTime: 3900, baseCost: 100 },
            ship_tender: { id: 220, type: 'fleet', position: 'navy_support', minlevel: 9, baseTime: 2400, baseCost: 100 }
        },
        Government: {
            ANARCHY: 'Anarchy',
            XENOCRACY: 'Xenocracy',
            IKACRACY: 'Ikacracy',
            ARISTOCRACY: 'Aristocracy',
            DICTATORSHIP: 'Dictatorship',
            DEMOCRACY: 'Democracy',
            NOMOCRACY: 'Nomocracy',
            OLIGARCHY: 'Oligarchy',
            TECHNOCRACY: 'Technocracy',
            THEOCRACY: 'Theocracy'
        },
        Buildings: {
            TOWN_HALL: 'townHall',
            PALACE: 'palace',
            GOVERNORS_RESIDENCE: 'palaceColony',
            TAVERN: 'tavern',
            MUSEUM: 'museum',
            ACADEMY: 'academy',
            WORKSHOP: 'workshop',
            TEMPLE: 'temple',
            EMBASSY: 'embassy',
            WAREHOUSE: 'warehouse',
            DUMP: 'dump',
            TRADING_PORT: 'port',
            TRADING_POST: 'branchOffice',
            WALL: 'wall',
            HIDEOUT: 'safehouse',
            BARRACKS: 'barracks',
            SHIPYARD: 'shipyard',
            FORESTER: 'forester',
            CARPENTER: 'carpentering',
            WINERY: 'winegrower',
            VINEYARD: 'vineyard',
            STONEMASON: 'stonemason',
            ARCHITECT: 'architect',
            GLASSBLOWER: 'glassblowing',
            OPTICIAN: 'optician',
            ALCHEMISTS_TOWER: 'alchemist',
            FIREWORK_TEST_AREA: 'fireworker',
            PIRATE_FORTRESS: 'pirateFortress',
            BLACK_MARKET: 'blackMarket',
            MARINE_CHART_ARCHIVE: 'marineChartArchive',
            DOCKYARD: 'dockyard',
            SHRINEOFOLYMPUS: 'shrineOfOlympus',
            CHRONOSFORGE: 'chronosForge'
        },
        GovernmentData: {
            Anarchy: {
                corruptionPalace: 0,
                governors: 0,
                corruption: 0.25,
                spyprotection: 0,
                unitBuildTime: 0,
                fleetBuildTime: 0,
                loadingSpeed: 0,
                buildingTime: 0,
                happiness: 0,
                bonusShips: 0,
                armySupply: 0,
                fleetSupply: 0,
                researchPerCulturalGood: 0,
                tradeShipSpeed: 0,
                branchOfficeRange: 0,
                researchBonus: 1,
                researcherCost: 0,
                productivity: 0,
                happinessWithoutTemple: 0,
                goldBonusPerPriest: 0,
                cooldownTime: 0,
                happinessBonusWithTempleConversion: 0
            },
            Xenocracy: {
                corruptionPalace: 0,
                governors: 0,
                corruption: 0,
                spyprotection: 0,
                unitBuildTime: 0,
                fleetBuildTime: 0,
                loadingSpeed: 0,
                buildingTime: 0,
                happiness: 0,
                bonusShips: 0,
                armySupply: 0,
                fleetSupply: 0,
                researchPerCulturalGood: 0,
                tradeShipSpeed: 0,
                branchOfficeRange: 0,
                researchBonus: 1,
                researcherCost: 0,
                productivity: 0,
                happinessWithoutTemple: 0,
                goldBonusPerPriest: 0,
                cooldownTime: 0,
                happinessBonusWithTempleConversion: 0
            },
            Ikacracy: {
                corruptionPalace: 0,
                governors: 0,
                corruption: 0,
                spyprotection: 0,
                unitBuildTime: 0,
                fleetBuildTime: 0,
                loadingSpeed: 0,
                buildingTime: 0,
                happiness: 0,
                bonusShips: 0,
                armySupply: 0,
                fleetSupply: 0,
                researchPerCulturalGood: 0,
                tradeShipSpeed: 0,
                branchOfficeRange: 0,
                researchBonus: 1,
                researcherCost: 0,
                productivity: 0,
                happinessWithoutTemple: 0,
                goldBonusPerPriest: 0,
                cooldownTime: 0,
                happinessBonusWithTempleConversion: 0
            },
            Aristocracy: {
                corruptionPalace: 3,
                governors: 0.03,
                corruption: 0,
                spyprotection: 0.2,
                unitBuildTime: 0,
                fleetBuildTime: 0,
                loadingSpeed: 0,
                buildingTime: -0.2,
                happiness: 0,
                bonusShips: 0,
                armySupply: 0,
                fleetSupply: 0,
                researchPerCulturalGood: 0,
                tradeShipSpeed: 0,
                branchOfficeRange: 0,
                researchBonus: 1,
                researcherCost: 0,
                productivity: 0,
                happinessWithoutTemple: 0,
                goldBonusPerPriest: 0,
                cooldownTime: 0,
                happinessBonusWithTempleConversion: 0
            },
            Dictatorship: {
                corruptionPalace: 0,
                governors: 0,
                corruption: 0,
                spyprotection: 0,
                unitBuildTime: -0.02,
                fleetBuildTime: -0.02,
                loadingSpeed: 0,
                buildingTime: 0,
                happiness: -75,
                bonusShips: 2,
                armySupply: -0.02,
                fleetSupply: -0.02,
                researchPerCulturalGood: 0,
                tradeShipSpeed: 0,
                branchOfficeRange: 0,
                researchBonus: 1,
                researcherCost: 0,
                productivity: 0,
                happinessWithoutTemple: 0,
                goldBonusPerPriest: 0,
                cooldownTime: 0,
                happinessBonusWithTempleConversion: 0
            },
            Democracy: {
                corruptionPalace: 0,
                governors: 0,
                corruption: 0,
                spyprotection: -0.2,
                unitBuildTime: 0.05,
                fleetBuildTime: 0,
                loadingSpeed: 0,
                buildingTime: 0,
                happiness: 75,
                bonusShips: 0,
                armySupply: 0,
                fleetSupply: 0,
                researchPerCulturalGood: 1,
                tradeShipSpeed: 0,
                branchOfficeRange: 0,
                researchBonus: 1,
                researcherCost: 0,
                productivity: 0,
                happinessWithoutTemple: 0,
                goldBonusPerPriest: 0,
                cooldownTime: 0,
                happinessBonusWithTempleConversion: 0
            },
            Nomocracy: {
                corruptionPalace: 0,
                governors: 0,
                corruption: -0.05,
                spyprotection: 0.2,
                unitBuildTime: 0.05,
                fleetBuildTime: 0.05,
                loadingSpeed: 0.5,
                buildingTime: 0,
                happiness: 0,
                bonusShips: 0,
                armySupply: 0,
                fleetSupply: 0,
                researchPerCulturalGood: 0,
                tradeShipSpeed: 0,
                branchOfficeRange: 0,
                researchBonus: 1,
                researcherCost: 0,
                productivity: 0,
                happinessWithoutTemple: 0,
                goldBonusPerPriest: 0,
                cooldownTime: 0,
                happinessBonusWithTempleConversion: 0
            },
            Oligarchy: {
                corruptionPalace: 0,
                governors: 0,
                corruption: 0.03,
                spyprotection: 0,
                unitBuildTime: 0,
                fleetBuildTime: 0,
                loadingSpeed: 0,
                buildingTime: 0.2,
                happiness: 0,
                bonusShips: 2,
                armySupply: 0,
                fleetSupply: -0.02,
                researchPerCulturalGood: 0,
                tradeShipSpeed: 0.1,
                branchOfficeRange: 5,
                researchBonus: 1,
                researcherCost: 0,
                productivity: 0,
                happinessWithoutTemple: 0,
                goldBonusPerPriest: 0,
                cooldownTime: 0,
                happinessBonusWithTempleConversion: 0
            },
            Technocracy: {
                corruptionPalace: 0,
                governors: 0,
                corruption: 0,
                spyprotection: 0,
                unitBuildTime: 0,
                fleetBuildTime: 0,
                loadingSpeed: 0,
                buildingTime: 0,
                happiness: 0,
                bonusShips: 0,
                armySupply: 0,
                fleetSupply: 0,
                researchPerCulturalGood: 0,
                tradeShipSpeed: 0,
                branchOfficeRange: 0,
                researchBonus: 1.05,
                researcherCost: 1,
                productivity: 0.2,
                happinessWithoutTemple: 0,
                goldBonusPerPriest: 0,
                cooldownTime: 0,
                happinessBonusWithTempleConversion: 0
            },
            Theocracy: {
                corruptionPalace: 0,
                governors: 0,
                corruption: 0,
                spyprotection: 0,
                unitBuildTime: 0,
                fleetBuildTime: 0,
                loadingSpeed: 0,
                buildingTime: 0,
                happiness: 0,
                bonusShips: 0,
                armySupply: 0,
                fleetSupply: 0,
                researchPerCulturalGood: 0,
                tradeShipSpeed: 0,
                branchOfficeRange: 0,
                researchBonus: 0.95,
                researcherCost: 0,
                productivity: 0,
                happinessWithoutTemple: -20,
                goldBonusPerPriest: 1,
                cooldownTime: -0.2,
                happinessBonusWithTempleConversion: 2
            }
        },
        BuildingData: {
            academy: {
                buildingId: 4,
                maxLevel: 50,
                wood: [64, 67, 114, 263, 381, 626, 981, 1329, 2003, 2664, 3915, 5156, 7445, 9752, 12750, 18163, 23691, 33450, 43571, 56728, 73833, 103458, 144202, 175057, 243929, 317207, 439967, 536309, 743788, 1027470, 1257245, 1736682, 2398947, 3313759, 4577425, 6322977, 8734176, 12064858, 16665660, 23020927, 31799706, 43926177, 60676944, 83815433, 115777531, 159928027, 220914829, 305158281, 421527051, 582271779],
                glass: [0, 0, 0, 0, 224, 428, 743, 1088, 1748, 2453, 3785, 5215, 7862, 10728, 14599, 21627, 29321, 43020, 58213, 78723, 106414, 154857, 224145, 282571, 408877, 552141, 795251, 1006648, 1449741, 2079650, 2642547, 3790582, 5437372, 7799597, 11188073, 16048649, 23020862, 33022102, 47368305, 67947108, 97466214, 139809674, 200548931, 287675899, 412654518, 591929155, 849088301, 1217968294, 1747105412, 2506122151],
                marble: 0,
                sulfur: 0,
                wine: 0,
                time: { a: 1440, b: 1, c: 1.2, d: 720 },
                icon: 'cdn/all/both/img/city/academy_l.png',
                maxScientists: [0, 8, 12, 16, 22, 28, 35, 43, 51, 60, 69, 79, 89, 100, 111, 122, 134, 146, 159, 172, 185, 198, 212, 227, 241, 256, 271, 287, 302, 318, 335, 351, 368]
            },
            alchemist: {
                buildingId: 22,
                maxLevel: 61,
                wood: [199,253,334,451,620,859,1195,1661,2304,3186,4389,6020,8226,11197,15186,20526,27656,37155,49783,66536,88725,118064,156798,207863,275099,363517,479659,632058,831832,1093463,1435803,1883375,2468070,3231330,4226986,5524932,7215872,9417465,12282278,16008056,20851010,27142971,35313567,45918848,59678253,77522326,100654281,130629454,169457764,219735863],
                glass: 0,
                marble: [0,71,114,177,267,396,575,825,1170,1642,2288,3164,4349,5948,8095,10973,14817,19943,26763,35818,47819,63701,84684,112369,148848,196857,259968,342842,451563,594056,780648,1024782,1343954,1760916,2305249,3015384,3941235,5147601,6718569,8763209,11422946,14881088,19375149,25212767,32792281,42629302,55391045,71940634,93394314,121195277],
                sulfur: 0,
                wine: 0,
                time: { a: 72000, b: 11, c: 1.1, d: 6120 },
                icon: 'cdn/all/both/img/city/alchemist_l.png'
            },
            architect: {
                buildingId: 24,
                maxLevel: 70,
                wood: [185, 291, 413, 555, 720, 910, 1133, 1390, 1688, 2035, 2436, 2901, 3442, 4070, 4797, 5640, 6619, 7753, 9070, 10598, 12369, 14423, 16807, 19572, 22780, 26501, 30817, 35824, 41633, 48371, 56185, 65251, 75779, 88007, 102208, 118700, 137853, 160098, 185930, 215933, 250774, 291238, 338233, 392808, 456192, 529801, 615288, 714570, 829871, 963777],
                glass: 0,
                marble: [106, 159, 221, 294, 378, 474, 586, 715, 864, 1035, 1233, 1459, 1721, 2022, 2369, 2766, 3226, 3752, 4358, 5056, 5857, 6778, 7835, 9051, 10449, 12055, 13899, 16016, 18450, 21245, 24455, 28141, 32381, 37263, 42879, 49342, 56779, 65337, 75185, 86519, 99559, 114565, 131834, 151705, 174571, 200884, 231162, 266003, 306098, 352235],
                sulfur: 0,
                wine: 0,
                time: { a: 125660, b: 37, c: 1.06, d: 2628 },
                icon: 'cdn/all/both/img/city/architect_l.png'
            },
            barracks: {
                buildingId: 6,
                maxLevel: 49,
                wood: [49, 114, 194, 295, 420, 573, 765, 1002, 1297, 1662, 2114, 2676, 3371, 4234, 5303, 6629, 8274, 10314, 12842, 15978, 19867, 24690, 30669, 38083, 47277, 58676, 72812, 90341, 112076, 139028, 172448, 213888, 265276, 328995, 408007, 505984, 627472, 778120, 964922, 1196557, 1483785, 1839946, 2281587, 2829222, 3508289, 4350332, 5394465, 6689190, 8294649],
                glass: 0,
                marble: [0, 0, 0, 0, 0, 0, 0, 0, 178, 430, 744, 1134, 1615, 2214, 2956, 3874, 5014, 6428, 8183, 10357, 13051, 16394, 20540, 25679, 32053, 39957, 49757, 61908, 76977, 95660, 118829, 147559, 183185, 227358, 282135, 350058, 434283, 538721, 668223, 828807, 1027931, 1274846, 1581020, 1960674, 2431446, 3015204, 3739064, 4636650, 5749655],
                sulfur: 0,
                wine: 0,
                time: { a: 25200, b: 11, c: 1.1, d: 1728 },
                icon: 'cdn/all/both/img/city/barracks_l.png'
            },
            blackMarket: {
                buildingId: 31,
                maxLevel: 35,
                wood: [440, 886, 1360, 1890, 2516, 3288, 4263, 5506, 7086, 9086, 11591, 14692, 18491, 23088, 28605, 35147, 42845, 51828, 62227, 74186, 87851, 103372, 120906, 140618, 162672],
                glass: 0,
                marble: [259, 525, 807, 1126, 1508, 1988, 2600, 3390, 4403, 5693, 7315, 9331, 11809, 14812, 18423, 22711, 27761, 33659, 40491, 48355, 57343, 67556, 79099, 92078, 106603],
                sulfur: 0,
                wine: 0,
                time: { a: 4321, b: 1, c: 1.1, d: 4627 },
                icon: 'cdn/all/both/img/city/blackmarket_l.png'
            },
            branchOffice: {
                buildingId: 13,
                maxLevel: 39,
                wood: [48, 173, 346, 581, 896, 1314, 1863, 2580, 3509, 4706, 6241, 8203, 10699, 13866, 17872, 22926, 29286, 37272, 47283, 59806, 75447, 94954, 119245, 149453, 186977, 233530, 291225, 362658, 451015, 560208, 695038, 861391, 1066671, 1319984, 1632575, 2018312, 2494311, 3081693, 3806524],
                glass: 0,
                marble: [0, 0, 0, 0, 540, 792, 1123, 1555, 2115, 2837, 3762, 4945, 6450, 8359, 10774, 13820, 17654, 22469, 28503, 36051, 45482, 57240, 71883, 90092, 112712, 140776, 175556, 218617, 271878, 337705, 418978, 519260, 643007, 795710, 984146, 1216677, 1503619, 1857705, 2294648],
                sulfur: 0,
                wine: 0,
                time: { a: 108000, b: 11, c: 1.1, d: 9360 },
                icon: 'cdn/all/both/img/city/branchoffice_l.png'
            },
            carpentering: {
                buildingId: 23,
                maxLevel: 70,
                wood: [63, 121, 192, 273, 371, 485, 620, 777, 962, 1178, 1431, 1729, 2078, 2485, 2964, 3523, 4178, 4944, 5841, 6890, 8116, 9550, 11228, 13190, 15484, 18164, 21299, 24963, 29244, 34249, 40095, 46929, 54928, 64290, 75248, 88073, 103085, 120655, 141220, 165290, 193462, 226435, 265029, 310201, 363072, 424955, 497385, 582159, 681384, 797520],
                glass: 0,
                marble: [0, 0, 0, 0, 0, 0, 0, 358, 443, 545, 669, 815, 992, 1205, 1458, 1764, 2130, 2571, 3098, 3730, 4491, 5401, 6495, 7808, 9384, 11274, 13542, 16264, 19530, 23450, 28153, 33799, 40574, 48710, 58478, 70202, 84278, 101178, 121464, 145817, 175056, 210155, 252292, 302878, 363607, 436512, 524034, 629105, 755243, 906673],
                sulfur: 0,
                wine: 0,
                time: { a: 125660, b: 37, c: 1.06, d: 2808 },
                icon: 'cdn/all/both/img/city/carpentering_l.png'
            },
            dump: {
                buildingId: 29,
                maxLevel: 76,
                wood: [640, 1151, 1765, 2503, 3387, 4450, 5723, 7252, 9087, 11288, 13930, 17100, 20905, 25470, 30948, 37521, 45409, 54876, 66235, 79866, 96223, 115852, 139407, 167672, 201592, 242293, 222651,271922,331687,404120,491840,597992,726357,881481,1068823,1294936,1567688,1896516,2292741,2769938,3344376,4035553,4866829,5866174,7067084,8509650,10241848,12321081,14816003,17808721,21397393,25699355,30854826,37031345,44429049,53286974,63890557,76580583,91763842,109925837,131645906,157615250,188658400,225758777,270089138,323047812,386301852,461838390,552025765,659686268,788182713,941521434,1124474826,1342727126,1603047811,1913497839],
                glass: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,96845,115759,138205,164824,196369,233723,277928,330206,391991,464975,551137,652802,772701,914034,1080556,1276673,1507541,1779211,2098767,2474509,2916155,3435083,4044612,4760327,5600464,6586356,7742949,9099418,10689871,12554174,14738922,17298559,20296692,23807626,27918138,32729567,38360231,44948257,52654873,61668241,72207933,84530139,98933727,115767319,135437518,158418489,185263127,216616052,253228735,295977120],
                marble: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,127598,153428,184263,221042,264877,317085,379224,453133,540988,645359,769281,916339,1090761,1297540,1542565,1832777,2176362,2582970,3063970,3632756,4305102,5099585,6038073,7146302,8454563,9998486,11819988,13968361,16501565,19487737,23006964,27153367,32037531,37789375,44561500,52533125,61914695,72953283,85938931,101212065,119172196,140288111,165109811,194282499,228562963,268838761,316150693,371719118,436974757,513594770],
                sulfur: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,164435,201664,247014,302212,369342,450922,549992,670221,816035,992769,1206855,1466045,1779675,2158985,2617511,3171540,3840665,4648452,5623238,6799088,8216935,9925965,11985258,14465763,17452664,21048214,25375129,30580652,36841419,44369284,53418299,64293051,77358661,93052727,111899627,134527622,161689313,194286108,233397473,280315917,336588804,404068339,484971317,581950521,698180045,837457248,1004324549,1204214936,1443625771,1730326385],
                wine: 0,
                time: { a: 32000, b: 13, c: 1.17, d: 2160 },
                icon: 'cdn/all/both/img/city/dump_l.png',
                capacity: [32000, 65401, 101073, 139585, 181437, 227119, 277128, 331991, 392268, 458564, 531535, 611896, 700427, 797983, 905498, 1024000, 1154614, 1298578, 1457248, 1632119, 1824830, 2037185, 2271165, 2528951, 2812939, 3125764, 3470326, 3849813, 4267731, 4727939, 5234678, 5792619, 6406896, 7083160, 7827629, 8647143, 9549229, 10542172, 11635086, 12838003, 14161964, 15619122, 17222851, 18987875, 20930401, 23068269, 25421121, 28010583, 30860463, 33996977, 37448993, 41248299, 45429902, 50032358, 55098129, 60673986, 66811447, 73567262, 81003948, 89190382, 98202448, 108123754, 119046431, 131072000, 144312338, 158890744, 174943109, 192619216, 212084166, 233519956, 257127222, 283127160, 311763649, 343305589, 378049493, 416322336, 458484710, 504934306, 556109751, 612494861]
            },
            embassy: {
                buildingId: 12,
                maxLevel: 78,
                wood: [242, 414, 622, 872, 1172, 1531, 1964, 2481, 3102, 3849, 4742, 5816, 7105, 8650, 10507, 12733, 15403, 18609, 22457, 27073, 32614, 39260, 47238, 56810, 68299, 82084, 98624, 118474, 142294, 170878, 205179, 246341, 295758, 355091, 426324, 511850, 614531, 737813, 885824, 1063529, 1276884, 1533038, 1840580, 2209818, 2653128, 3185371, 3824385, 4591593, 5512709, 6618609, 7946363, 9540477, 11454385, 13752241, 16511067, 19823340, 23800085, 28574602, 34306931, 41189217, 49452154, 59372712, 71283426, 85583540, 102752386, 123365463, 148113713, 177826689, 213500363, 256330504, 307752768, 369490811, 443614075, 532607149, 639453054, 767733234, 921747600, 1106658669],
                glass: 0,
                marble: [155, 342, 571, 850, 1190, 1606, 2112, 2729, 3484, 4403, 5527, 6895, 8565, 10603, 13090, 16122, 19823, 24338, 29845, 36565, 44764, 54764, 66966, 81852, 100014, 122170, 149200, 182178, 222410, 271494, 331377, 404433, 493594, 602413, 735222, 897312, 1095135, 1336570, 1631232, 1990857, 2429765, 2965436, 3619202, 4417100, 5390901, 6579390, 8029895, 9800180, 11960747, 14597636, 17815859, 21743576, 26537207, 32387650, 39527893, 48242287, 58877872, 71858200, 87700195, 107034747, 130631830, 159431170, 194579667, 237477069, 289831712, 353728560, 431712227, 526888322, 643047118, 784814501, 957836191, 1169002569, 1426723085, 1741261155, 2125142880, 2593655899, 3165458183, 3863321081],
                sulfur: 0,
                wine: 0,
                time: { a: 96000, b: 7, c: 1.05, d: 10080 },
                icon: 'cdn/all/both/img/city/embassy_l.png'
            },
            fireworker: {
                buildingId: 27,
                maxLevel: 70,
                wood: [272, 352, 444, 550, 672, 813, 973, 1158, 1372, 1617, 1899, 2222, 2595, 3024, 3516, 4084, 4735, 5485, 6347, 7338, 8478, 9790, 11297, 13030, 15024, 17317, 19955, 22986, 26473, 30484, 35095, 40400, 46505, 53533, 61623, 70936, 81657, 93999, 108205, 124557, 143381, 165050, 189994, 218707, 251760, 289809, 333607, 384026, 442063, 508871],
                glass: 0,
                marble: [135, 212, 301, 405, 526, 664, 827, 1014, 1233, 1485, 1778, 2120, 2514, 2971, 3502, 4119, 4834, 5662, 6623, 7738, 9033, 10534, 12274, 14293, 16636, 19353, 22507, 26163, 30405, 35324, 41033, 47652, 55341, 64269, 74637, 86678, 100664, 116903, 135764, 157667, 183106, 212646, 246953, 286795, 333065, 386800, 449205, 521677, 605841, 703582],
                sulfur: 0,
                wine: 0,
                time: { a: 125660, b: 37, c: 1.06, d: 2628 },
                icon: 'cdn/all/both/img/city/fireworker_l.png'
            },
            forester: {
                buildingId: 18,
                maxLevel: 61,
                wood: [188,238,314,424,582,807,1121,1557,2159,2985,4111,5638,7703,10483,14215,19212,25882,34767,46577,62244,82992,110422,146632,194364,257205,339834,448361,590751,777383,1021777,1341526,1759518,2305510,3018167,3947712,5159341,6737655,8792383,11465793,14942265,19460660,25330309,32951664,42842954,55674610,72313691,93881203,121826051,158020412,204882716],
                glass: 0,
                marble: [0,58,98,157,243,363,532,768,1094,1540,2150,2978,4100,5611,7642,10365,14005,18859,25318,33897,45272,60328,80226,106488,141102,186669,246589,325296,428580,563987,741352,973483,1277051,1673745,2191770,2867782,3749403,4898476,6395272,8343947,10879590,14177353,18464244,24034384,31268719,40660496,52848172,68657919,89158503,115732141],
                sulfur: 0,
                wine: 0,
                time: { a: 72000, b: 11, c: 1.1, d: 6120 },
                icon: 'cdn/all/both/img/city/forester_l.png'
            },
            glassblowing: {
                buildingId: 20,
                maxLevel: 61,
                wood: [199,253,334,451,620,859,1195,1661,2304,3186,4389,6020,8226,11197,15186,20526,27656,37155,49783,66536,88725,118064,156798,207863,275099,363517,479659,632058,831832,1093463,1435803,1883375,2468070,3231330,4226986,5524932,7215872,9417465,12282278,16008056,20851010,27142971,35313567,45918848,59678253,77522326,100654281,130629454,169457764,219735863],
                glass: 0,
                marble: [0,71,114,177,267,396,575,825,1170,1642,2288,3164,4349,5948,8095,10973,14817,19943,26763,35818,47819,63701,84684,112369,148848,196857,259968,342842,451563,594056,780648,1024782,1343954,1760916,2305249,3015384,3941235,5147601,6718569,8763209,11422946,14881088,19375149,25212767,32792281,42629302,55391045,71940634,93394314,121195277],
                sulfur: 0,
                wine: 0,
                time: { a: 72000, b: 11, c: 1.1, d: 6120 },
                icon: 'cdn/all/both/img/city/glassblowing_l.png'
            },
            museum: {
                buildingId: 10,
                maxLevel: 36,
                wood: [382,664,1169,2037,3494,5892,9779,16008,25894,41460,65806,103667,162256,252530,391098,603079,926393,1418180,2164403,3294193,5001247,7575743,11451868,17278546,26024621,39135139,58763395,88115235,131959610,197385142,294920636,440193642,656384149,977852712,1455502552,2164700603,3216973469,4777269860,7089428246,10513734943,15582291320,23080604767,34167781495,50553523916,74758693677,110498772754,163248016684,241069199679,355833638756,525014573825],
                glass: 0,
                marble: [187,448,923,1756,3183,5573,9519,15956,26352,43008,69511,111439,177436,280866,442335,693556,1083224,1685987,2616078,4048034,6248152,9622188,14787623,22683048,34733617,53101077,81061342,123574300,188143085,286109103,434602567,659478671,999735018,1514154091,2291286504,3464448030,5234238080,7902336963,11922209652,17975142378,27084224484,40785147649,61382052256,92330635791,138811633234,208588990698,313293662398,470343546812,705813942706,1058727900776],
                sulfur: 0,
                wine: 0,
                time: { a: 18000, b: 1, c: 1.1, d: 14040 },
                icon: 'cdn/all/both/img/city/museum_r.png',
                basicBonus: [0, 20, 41, 63, 88, 114, 144, 176, 211, 250, 294, 341, 395, 453, 518, 590, 670, 759, 857, 965, 1086, 1219, 1367, 1530, 1711, 1912, 2134, 2380, 2652, 2953, 3286, 3655, 4064, 4516, 5016, 5569, 6182]
            },
            optician: {
                buildingId: 25,
                maxLevel: 70,
                wood: [119, 187, 269, 362, 471, 597, 742, 912, 1107, 1335, 1600, 1906, 2260, 2672, 3151, 3706, 4350, 5095, 5962, 6965, 8130, 9481, 11050, 12867, 14978, 17423, 20263, 23555, 27373, 31805, 36943, 42905, 49827, 57866, 67203, 78048, 90641, 105265, 122250, 141977, 164885, 191490, 222387, 258271, 299942, 348340, 404544, 469820, 545626, 633664],
                glass: 0,
                marble: [0, 35, 95, 166, 249, 344, 455, 584, 733, 905, 1106, 1337, 1607, 1921, 2283, 2703, 3192, 3758, 4415, 5178, 6062, 7086, 8276, 9656, 11257, 13113, 15266, 17764, 20663, 24024, 27923, 32448, 37703, 43813, 50910, 59159, 68743, 79881, 92822, 107862, 125336, 145642, 169238, 196657, 228517, 265541, 308562, 358551, 416642, 484142],
                sulfur: 0,
                wine: 0,
                time: { a: 125660, b: 37, c: 1.06, d: 2772 },
                icon: 'cdn/all/both/img/city/optician_l.png'
            },
            palace: {
                buildingId: 11,
                maxLevel: 20,
                wood: [534,4358,12833,30646,66807,138420,277660,544554,1050340,1999995,3769338,7044444,13073015,24116461,44261142,80871083,147184477,266946519,482662330,870277003,1565252218,2808827912,5029996104,8990593960,16041850453,28577557367,50833828397,90299299183,160199677938,283871757695],
                glass: [0,0,0,0,17231,31745,62831,128406,265078,547158,1124658,2298945,4672901,9448115,19011549,38090923,76025323,151218811,299860251,592968038,1169657158,2301976988,4521116016,8862756828,17343530462,33885259833,66106055457,128788040449,250585268084,486988639291],
                marble: [0,1050,2359,5444,12431,27840,61147,132049,281163,591708,1233208,2549350,5233932,10682296,21691371,43850895,88302274,177198815,354493006,707212675,1407360664,2794312151,5536639226,10949537993,21616766537,42607911311,83858451111,164819001932,323529154705,634311896496],
                sulfur: [0,0,2574,6471,15246,34487,75842,163381,346465,725639,1504586,3093921,6317933,12825177,25901815,52078988,104302591,208171990,414197054,821839509,1626596860,3212084272,6329883269,12450383299,24446410712,47923889507,93809341927,183376623403,358003731363,698094835370],
                wine: [0,0,0,8394,15557,31184,64604,135001,281513,583470,1200783,2454241,4984661,10067399,20232337,40483108,80689758,160275016,317376553,626731023,1234529510,2426254544,4758535112,9315122645,18203265554,35515230585,69189002112,134605670330,261538330559,507563790370],
                time: { a: 11520, b: 1, c: 1.4, d: 0 },
                icon: 'cdn/all/both/img/city/palace_l.png'
            },
            palaceColony: {
                buildingId: 17,
                maxLevel: 20,
                wood: [429,4033,12058,28995,63512,132135,266068,523751,1013907,1937630,3665009,6874204,12803124,23703789,43660683,80061689,146236913,266184492,483020279,874063392,1577731924,2841433380,5106736562,9160678683,16404280602,29328597222,52357929576,93342082495,166195096084,295557655744],
                glass: [0,0,0,0,18013,31617,60917,123063,253290,523522,1079747,2216852,4527968,9201670,18611846,37485721,75211748,150390845,299795530,595976907,1181814253,2338214805,4616597504,9097837989,17897810795,35153314766,68942935720,135025916821,264113260969,515996286221],
                marble: [0,1057,2593,6171,14187,31673,69062,147809,311675,649350,1339586,2740915,5569448,11250189,22609461,45236411,90154480,179053009,354514251,699972849,1378610745,2709045141,5312422528,10397938303,20316422134,39632529744,77199313511,150168531616,291736070865,566088868839],
                sulfur: [3,0,2613,6330,14733,33218,73085,157764,335461,704713,1465813,3023913,6195082,12616933,25564785,51570045,103622445,207493819,414203900,824553027,1637328971,3243899650,6413582058,12656457253,24932683363,49037741553,96305031315,188873637538,369946916481,723753654178],
                wine: [0,0,0,9132,15891,30703,62525,129863,270639,562079,1160560,2381208,4856374,9850252,19881853,39955693,79987779,159578572,317386642,629507356,1245452812,2458490494,4842971476,9522121470,18689641658,36624596599,71664128714,140034376860,273283371268,532690612420],
                time: { a: 11520, b: 1, c: 1.4, d: 0 },
                icon: 'cdn/all/both/img/city/palaceColony_l.png'
            },
            pirateFortress: {
                buildingId: 30,
                maxLevel: 70,
                wood: [450, 906, 1389, 1935, 2593, 3427, 4516, 5950, 7834, 10284, 13430, 17415, 22394, 28534, 36015, 45029, 55779, 68482, 83366, 100671, 120648, 143562, 169686, 199309, 232729, 270255, 312210, 358926, 410748, 468032],
                glass: 0,
                marble: [250, 505, 783, 1112, 1534, 2103, 2883, 3949, 5388, 7296, 9782, 12964, 16970, 21938, 28019, 35370, 44162, 54573, 66793, 81020, 97463, 116341, 137883, 162325, 189915, 220912, 255580, 294197, 337048, 384429],
                sulfur: 0,
                wine: 0,
                time: { a: 1550, b: 1, c: 1.2, d: 1800 },
                icon: 'cdn/all/both/img/city/pirateFortress_l.png'
            },
            port: {
                buildingId: 3,
                maxLevel: 74,
                wood: [59, 150, 273, 428, 636, 893, 1207, 1644, 2106, 2735, 3536, 4492, 5688, 7102, 8850, 11093, 13730, 17062, 21097, 25964, 31809, 39190, 47998, 58713, 71955, 87627, 107101, 130777, 159020, 193937, 235849, 286514, 348717, 423989, 513946, 625160, 758178, 919693, 1116013, 1353516, 1642274, 1990223, 2411061, 2923228, 3541579, 4291523, 5199341, 6299198, 7631717, 9246112, 11202013, 13571662, 16442579, 19920805, 24134805, 29240225, 35425635, 42919491, 51998581, 62998241, 76324743, 92470301, 112031253, 135730084, 164442110, 199227812, 241372000, 292431272, 354291502, 429237502, 520037404, 630044906, 763323140, 924794741],
                glass: 0,
                marble: [0, 0, 0, 0, 0, 176, 326, 540, 791, 1137, 1598, 2176, 2928, 3858, 5050, 6628, 8565, 11088, 14264, 18241, 23197, 29642, 37635, 47702, 60556, 76366, 96638, 122157, 153753, 194090, 244300, 307173, 386956, 486969, 610992, 769302, 965793, 1212791, 1523571, 1913072, 2403314, 3015688, 3782992, 4749575, 5959026, 7478199, 9383419, 11774029, 14773695, 18537584, 23260400, 29186446, 36622268, 45952512, 57659820, 72349794, 90782330, 113910917, 142931968, 179346702, 225038807, 282371876, 354311674, 444579550, 557844948, 699966937, 878297302, 1102060839, 1382832545, 1735136373, 2177196541, 2731880245, 3427880545, 4301200632],
                sulfur: 0,
                wine: 0,
                time: { a: 50400, b: 23, c: 1.15, d: 1512 },
                loadingSpeed: [10, 30, 60, 93, 129, 169, 213, 261, 315, 373, 437, 508, 586, 672, 766, 869, 983, 1108, 1246, 1398, 1565, 1748, 1950, 2172, 2416, 2685, 2980, 3305, 3663, 4056, 4489, 4965, 5488, 6064, 6698, 7394, 8161, 9004, 9931, 10951, 12073, 13308, 14666, 16159, 17802, 19609, 21597, 23784, 26160, 28800, 31740, 34980, 38520, 42420, 46680, 51420, 56640, 62400, 68700, 75660, 83340, 91740, 101040, 111300, 122580, 134940, 148620, 163680, 180300, 198540, 218640, 240780, 265140, 292020, 321600],
                icon: 'cdn/all/both/img/city/port_l.png'
            },
            safehouse: {
                buildingId: 16,
                maxLevel: 60,
                wood: [113, 248, 401, 578, 778, 1007, 1266, 1564, 1902, 2287, 2728, 3229, 3800, 4452, 5194, 6042, 7007, 8107, 9363, 10792, 12422, 14281, 16400, 18815, 21570, 24708, 28287, 32367, 37019, 42321, 48364, 55255, 63126, 72119, 82392, 94130, 107540, 122859, 140363, 160358, 183203, 209302, 239119, 273184, 312101, 356563, 407358, 465389, 531688, 607433, 693966, 792828, 905772, 1034807, 1182225, 1350643, 1543053, 1762874, 2014011, 2300924],
                glass: 0,
                marble: [0, 0, 0, 128, 197, 274, 365, 471, 592, 735, 900, 1090, 1312, 1569, 1865, 2212, 2613, 3078, 3616, 4242, 4967, 5809, 6786, 7919, 9233, 10757, 12526, 14577, 16956, 19715, 22916, 26630, 30945, 35962, 41790, 48563, 56433, 65578, 76207, 88557, 102908, 119586, 138966, 161488, 187659, 218072, 253414, 294484, 342208, 397669, 462116, 537008, 624037, 725171, 842694, 979264, 1137967, 1322391, 1536700, 1785743],
                sulfur: 0,
                wine: 0,
                time: { a: 96000, b: 7, c: 1.05, d: 12960 },
                icon: 'cdn/all/both/img/city/safehouse_l.png'
            },
            shipyard: {
                buildingId: 5,
                maxLevel: 50,
                wood: [98, 202, 324, 477, 671, 914, 1222, 1609, 2096, 2711, 3485, 4459, 5688, 7238, 9190, 11648, 14746, 18650, 23568, 29765, 37573, 47412, 59808, 75428, 95108, 119906, 151151, 190520, 240124, 302626, 381378, 480605, 605632, 763166, 961659, 1211759, 1526886, 1923947],
                glass: 0,
                marble: [0, 0, 0, 0, 0, 778, 1052, 1397, 1832, 2381, 3070, 3941, 5037, 6420, 8161, 10354, 13118, 16601, 20989, 26517, 33484, 42261, 53321, 67256, 84814, 106938, 134814, 169937, 214192, 269954, 340214, 428741, 540285, 680832, 857920, 1081051, 1362196, 1716438],
                sulfur: 0,
                wine: 0,
                time: { a: 64800, b: 7, c: 1.05, d: 7128 },
                icon: 'cdn/all/both/img/city/shipyard_l.png'
            },
            stonemason: {
                buildingId: 19,
                maxLevel: 61,
                wood: [199,253,334,451,620,859,1195,1661,2304,3186,4389,6020,8226,11197,15186,20526,27656,37155,49783,66536,88725,118064,156798,207863,275099,363517,479659,632058,831832,1093463,1435803,1883375,2468070,3231330,4226986,5524932,7215872,9417465,12282278,16008056,20851010,27142971,35313567,45918848,59678253,77522326,100654281,130629454,169457764,219735863],
                glass: 0,
                marble: [0,71,114,177,267,396,575,825,1170,1642,2288,3164,4349,5948,8095,10973,14817,19943,26763,35818,47819,63701,84684,112369,148848,196857,259968,342842,451563,594056,780648,1024782,1343954,1760916,2305249,3015384,3941235,5147601,6718569,8763209,11422946,14881088,19375149,25212767,32792281,42629302,55391045,71940634,93394314,121195277],
                sulfur: 0,
                wine: 0,
                time: { a: 72000, b: 11, c: 1.1, d: 6120 },
                icon: 'cdn/all/both/img/city/stonemason_l.png'
            },
            temple: {
                buildingId: 28,
                maxLevel: 56,
                wood: [215, 228, 333, 464, 598, 759, 957, 1197, 1431, 1772, 2112, 2512, 3081, 3655, 4457, 5126, 6231, 7166, 8687, 10247, 11784, 14228, 16752, 19265, 23185, 26664, 32027, 36830, 43257, 50781, 59591, 68528, 80385, 96067, 108392, 129446, 148864, 174363, 204228, 239212, 280186, 328179, 384393, 450237, 527358, 617691, 723495, 847423, 992578, 1162599, 1361741, 1594994, 1868201, 2188207, 2563028, 3002050],
                glass: [172, 190, 290, 422, 566, 751, 988, 1290, 1609, 2079, 2585, 3209, 4108, 5084, 6471, 7764, 9850, 11821, 14951, 18401, 22081, 27823, 34184, 41020, 51514, 61816, 77477, 92971, 113941, 139577, 170910, 205092, 251034, 313053, 368577, 459303, 551164, 673644, 823343, 1006308, 1229934, 1503252, 1837308, 2245600, 2744622, 3354539, 4099993, 5011104, 6124684, 7485727, 9149222, 11182385, 13667363, 16704558, 20416685, 24953731],
                marble: 0,
                sulfur: 0,
                wine: 0,
                time: { a: 2160, b: 1, c: 1.1, d: 0 },
                icon: 'cdn/all/both/img/city/temple_l.png'
            },
            tavern: {
                buildingId: 9,
                maxLevel: 70,
                wood: [56,95,148,217,307,422,569,756,992,1287,1658,2120,2694,3404,4282,5364,6696,8331,10335,12786,15783,19438,23891,29311,35899,43899,53603,65365,79607,96838,117669,142833,173211,209858,254041,307275,371378,448529,541332,652909,786992,948048,1141417,1373485,1651883,1985731,2385923,2865470,3439910,4127788],
                glass: 0,
                marble: [0,0,0,42,48,57,68,84,108,139,184,245,328,442,596,806,1089,1471,1985,2676,3603,4843,6501,8714,11664,15592,20815,27755,36964,49174,65347,86754,115064,152476,201881,267078,353064,466393,615677,812212,1070820,1410932,1858019,2445456,3216960,4229775,5558835,7302203,9588168,12584516],
                sulfur: 0,
                wine: 0,
                time: { a: 10800, b: 1, c: 1.06, d: 10440 },
                icon: 'cdn/all/both/img/city/taverne_r.png',
                wineUse: [0, 4, 8, 13, 18, 24, 30, 37, 44, 51, 60, 68, 78, 88, 99, 110, 122, 136, 151, 165, 180, 197, 216, 235, 255, 278, 300, 325, 351, 378, 408, 439, 472, 507, 544, 584, 625, 670, 717.5, 766, 819.5, 874, 933, 995, 1060, 1129, 1203, 1280, 1361, 1449, 1541, 1640, 1745, 1857, 1976, 2102, 2237, 2380, 2532, 2694, 2867, 3050, 3246, 3453, 3675, 3910, 4160, 4426, 4710, 5011, 5332],
                wineUse2: [0, 12, 24, 36, 48, 61, 73, 86, 99, 112, 125, 138, 152, 165, 179, 193, 207, 222, 236, 251, 266, 282, 297, 313, 329, 345, 361, 378, 395, 410, 430, 448, 466, 484, 502, 521, 540, 560, 580, 600, 620, 641, 662, 683, 705, 727, 749, 772, 795, 819.5, 843, 867, 891, 916, 942, 968, 994, 1021, 1048, 1075, 1103, 1131, 1160, 1189, 1219, 1249, 1280, 1311, 1343, 1375, 1408],
                basicBonus:[0, 12, 24, 36, 48, 61, 73, 86, 99, 112, 125, 138, 152, 165, 179, 193, 207, 222, 236, 251, 266, 282, 297, 313, 329, 345, 361, 378, 395, 410, 430, 448, 466, 484, 502, 521, 540, 560, 580, 600, 620, 641, 662, 683, 705, 727, 749, 772, 795, 819.5, 843, 867, 891, 916, 942, 968, 994, 1021, 1048, 1075, 1103, 1131, 1160, 1189, 1219, 1249, 1280, 1311, 1343, 1375, 1408],
                wineBonus:[0, 60, 120, 181, 242, 304, 367, 430, 494, 559, 624, 691, 758, 826, 896, 966, 1037, 1109, 1182, 1256, 1332, 1408, 1485, 1564, 1644, 1725, 1807, 1891, 1975, 2061, 2149, 2238, 2328, 2419, 2512, 2606, 2702, 2800, 2898, 2999, 3101, 3204, 3310, 3416, 3525, 3635, 3747, 3861, 3976, 4094, 4213, 4334, 4457, 4582, 4709, 4838, 4969, 5103, 5238, 5375, 5515, 5657, 5801, 5947, 6096, 6247, 6400, 6556, 6714, 6875, 7038]
            },
            townHall: {
                buildingId: 0,
                maxLevel: 88,
                wood: [158, 317, 475, 633, 791, 949, 1107, 1265, 1423, 1581, 1739, 1897, 2055, 2213, 2371, 2529, 2687, 2845, 3003, 3161, 3319, 3477, 3635, 3793, 3951, 4109, 4267, 4425, 4583, 4741, 4899, 5057, 5215, 5373, 5531, 5689, 5847, 6005,1843499,2254056,2754321,3363611,4105354,5007953,6105839,7440735,9063187,11034414,13428548,16335328,19863367,24144090,29336489,35632868,43265772,52516347,63724443,77300781,93741649,113646616,137739901,166896141,202171448,244840868,296443516,358836981,434262891,525425910,635588921,768687683,929468946,1123656801,1358153010,1641278239,1983062521,2395594936,2893444590,3494167323,4218915594,5093172466,6147634858,7419276352,8952625912,10801306283,13029884635,15716098632,18953533915,22854844239],
                glass: 0,
                marble: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,4896302,6285896,8064813,10341006,13252103,16973512,21728719,27802376,35556937,45453787,58080082,74182834,94712181,120876320,154211216,196669064,250730500,319546954,407121169,518536093,660245080,840439729,1069516079,1360665366,1730622504,2200614278,2797560346,3555594257,4517989492,5739598048,7289937580,9257099061,11752692461,14918105407,18932422462,24022444465,30475363416,38654794930,49021055485,62156805598,78799475502,99882263083,126585965094,160404497778,203227714504,257446076829,326082933258,412961672224,522916924752,662061401809],
                sulfur: 0,
                wine: 0,
                time: { a: 1800, b: 1, c: 1.17, d: -1080 },
                icon: 'cdn/all/both/img/city/townhall_l.png',
                actionPointsMax: [0, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6, 7, 7, 7, 7, 8, 8, 8, 9, 9, 9, 9, 10, 10, 10, 10, 11, 11, 11, 11, 12, 12, 12, 13, 13, 13, 13, 14, 14, 14, 14, 15, 15, 15, 15, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18, 19, 19, 19, 19]
            },
            vineyard: {
                buildingId: 26,
                maxLevel: 70,
                wood: [338, 422, 520, 630, 757, 905, 1073, 1269, 1492, 1749, 2044, 2384, 2774, 3224, 3741, 4335, 5019, 5805, 6708, 7749, 8943, 10319, 11900, 13717, 15808, 18214, 20978, 24158, 27815, 32021, 36857, 42419, 48819, 56184, 64660, 74416, 85644, 98566, 113437, 130552, 150250, 172920, 199009, 229035, 263592, 303362, 349131, 401807, 462430, 532200],
                glass: 0,
                marble: [122, 198, 285, 386, 503, 640, 798, 980, 1193, 1440, 1726, 2057, 2442, 2888, 3407, 4007, 4705, 5513, 6450, 7537, 8800, 10263, 11960, 13929, 16214, 18864, 21937, 25502, 29638, 34436, 40001, 46457, 53955, 62664, 72777, 84522, 98164, 114007, 132407, 153776, 178594, 207419, 240893, 279772, 324926, 377365, 438270, 509003, 591152, 686559],
                sulfur: 0,
                wine: 0,
                time: { a: 125660, b: 37, c: 1.06, d: 2232 },
                icon: 'cdn/all/both/img/city/vineyard_l.png'
            },
            wall: {
                buildingId: 8,
                maxLevel: 60,
                wood: [114, 361, 657, 1012, 1439, 1951, 2565, 3302, 4186, 5247, 6521, 8049, 9882, 12083, 14724, 17892, 21695, 26258, 31733, 38304, 46189, 55650, 67004, 80629, 96979, 116599, 140143, 168395, 202298, 242982, 291802, 350387, 420689, 505049, 606284, 727765, 873541, 1048473, 1258393, 1510294, 1812577, 2175317, 2610603, 3132948, 3759764],
                glass: 0,
                marble: [0, 203, 516, 892, 1344, 1885, 2535, 3315, 4251, 5374, 6721, 8338, 10279, 12608, 15402, 18755, 22779, 27607, 33402, 40355, 48699, 58711, 70726, 85144, 102446, 123208, 148122, 178019, 213896, 256948, 308610, 370605, 444998, 534270, 641397, 769949, 924213, 1109328, 1331467, 1598031, 1917913, 2301767, 2762392, 3315144, 3978446],
                sulfur: 0,
                wine: 0,
                time: { a: 57600, b: 11, c: 1.1, d: 3240 },
                icon: 'cdn/all/both/img/city/wall.png'
            },
            warehouse: {
                buildingId: 7,
                maxLevel: 85,
                wood: [159, 287, 442, 626, 847, 1113, 1430, 1813, 2271, 2821, 3483, 4274, 5226, 6367, 7736, 9379, 11352, 13719, 16558, 19966, 24056, 28963, 34851, 41917, 50398, 60573, 72784, 87436, 105021, 126121, 151441, 181824, 218285, 262038, 314542, 377548, 453152, 543879, 652751, 783398, 940192, 1128367, 1354207, 1625246, 1950534, 2340927, 2809454, 3371757, 4046602, 4856516, 5828530, 6995090, 8395133, 10075390, 12091943, 14512103, 17416648, 20902529, 25086098, 30106990, 36132798, 43364651, 52043931, 62460341, 74961557, 89964846, 107970992, 129581003, 155516183, 186642197, 223997971, 268830370, 322635816, 387210232, 464708989, 557718847, 669344298, 803311188, 964091075, 1157050488, 1388630045, 1666559428, 2000115392, 2400431402, 2880869242],
                glass: 0,
                marble: [0, 0, 0, 95, 210, 349, 514, 714, 952, 1240, 1584, 1997, 2492, 3085, 3800, 4656, 5683, 6914, 8393, 10169, 12299, 14855, 17921, 21601, 26019, 31319, 37678, 45309, 54467, 65457, 78644, 94471, 113460, 136249, 163594, 196408, 235786, 283041, 339744, 407789, 489463, 587493, 705158, 846389, 1015907, 1219374, 1463594, 1756728, 2108570, 2530878],
                sulfur: 0,
                wine: 0,
                time: { a: 2880, b: 1, c: 1.14, d: 2160 },
                icon: 'cdn/all/both/img/city/warehouse_l.png',
                capacity: [8000, 16401, 25455, 35331, 46181, 58159, 71421, 86138, 102493, 120687, 140942, 163502, 188637, 216646, 247860, 282647, 321416, 364622, 412768, 466416, 526189, 592779, 666959, 749584, 841609, 944094, 1058219, 1185297, 1326787, 1484315, 1659690, 1854922, 2072252, 2314171, 2583453, 2883186, 3216807, 3588142, 4001450, 4461476, 4973499, 5543400, 6177729, 6883779, 7669673, 8544460, 9518219, 10602179, 11808851, 13152172, 14647676, 16312668, 18166439, 20230485, 22528769, 25088000, 27937955, 31111829, 34646637, 38583648, 42968887, 47853679, 53295269, 59357506, 66111616, 73637056, 82022473, 91366775, 101780329, 113386298, 126322135, 140741251, 156814887, 174734197, 194712581, 216988297, 241827374, 269526873, 300418536, 334872863, 373303675, 416173213, 463997848, 517354466, 576887609]
            },
            winegrower: {
                buildingId: 21,
                maxLevel: 61,
                wood: [199,253,334,451,620,859,1195,1661,2304,3186,4389,6020,8226,11197,15186,20526,27656,37155,49783,66536,88725,118064,156798,207863,275099,363517,479659,632058,831832,1093463,1435803,1883375,2468070,3231330,4226986,5524932,7215872,9417465,12282278,16008056,20851010,27142971,35313567,45918848,59678253,77522326,100654281,130629454,169457764,219735863],
                glass: 0,
                marble: [0,71,114,177,267,396,575,825,1170,1642,2288,3164,4349,5948,8095,10973,14817,19943,26763,35818,47819,63701,84684,112369,148848,196857,259968,342842,451563,594056,780648,1024782,1343954,1760916,2305249,3015384,3941235,5147601,6718569,8763209,11422946,14881088,19375149,25212767,32792281,42629302,55391045,71940634,93394314,121195277],
                sulfur: 0,
                wine: 0,
                time: { a: 72000, b: 11, c: 1.1, d: 6120 },
                icon: 'cdn/all/both/img/city/winegrower_l.png'
            },
            workshop: {
                buildingId: 15,
                maxLevel: 86,
                wood: [206, 383, 569, 781, 1023, 1299, 1613, 1972, 2380, 2846, 3377, 3982, 4672, 5458, 6355, 7377, 8542, 9870, 11385, 13111, 15078, 17714, 19481, 22796, 26119, 29909, 34228, 39153, 44766, 51166, 58462, 66778],
                glass: 0,
                marble: [89, 167, 251, 349, 461, 592, 744, 920, 1125, 1362, 1637, 1956, 2326, 2755, 3253, 3831, 4500, 5279, 6180, 7226, 8439, 9776, 11477, 13373, 15570, 18118, 21074, 24503, 28481, 33095, 38447, 44656],
                sulfur: 0,
                wine: 0,
                time: { a: 96000, b: 7, c: 1.05, d: 11880 },
                icon: 'cdn/all/both/img/city/workshop_l.png'
            },
            marineChartArchive: { //time is not correct
                buildingId: 32,
                maxLevel: 86,
                wood: [578, 1298, 2133, 3101, 4226, 5529, 7042, 8795, 10830, 13191, 15928, 19106, 22790, 27064, 32021, 37772, 44443, 52183, 61158, 71571, 83650, 97663, 113916, 132771, 154642, 180012, 209442, 243579, 283179, 329115, 382401, 444214, 515915, 599089, 695571, 807490, 937316, 1087914, 1262609, 1465254, 1709226, 1976656, 2290595, 2639417, 3046376, 3523099, 4057959, 4674210, 5395109, 6209026, 7150844, 8232192, 9476322, 10894864, 12522699, 14394708, 16545776, 18999155, 21812983, 25045398, 28742908, 32975278, 37823899, 43381792, 49730347, 57009093, 65322677, 74845509, 85728746, 98181681, 112413606, 128691952, 147284149, 168539018, 192828635, 220583215, 252279480, 288487173, 329834172, 377041375, 430945955, 492478103, 562707539, 642866765, 734339442, 838718522],
                glass: [160, 610, 1142, 1769, 2507, 3379, 4409, 5624, 7057, 8750, 10745, 13100, 15879, 19158, 23028, 27594, 32984, 39342, 46843, 55696, 66143, 78470, 93015, 110179, 130434, 154332, 182532, 215809, 255077, 301411, 356087, 420603, 496733, 586566, 692571, 817653, 965252, 1139419, 1344934, 1587444, 1872009, 2197576, 2581280, 3034748, 3557981, 4162605, 4883503, 5720676, 6697376, 7836860, 9174010, 10720453, 12534326, 14650511, 17115518, 19987483, 23336171, 27231347, 31777656, 37056492, 43219008, 50381480, 58718319, 68415562, 79694131, 92821454, 108076590, 125808359, 146423722, 170376145, 198200490, 230536261, 268092731, 311707071, 362355982, 421155693, 489408472, 568637508, 660575280, 767256584, 891018523, 1034605162, 1197621170, 1395286800, 1616207210, 1883637180],
                marble: [345, 1065, 1915, 2917, 4100, 5497, 7143, 9087, 11380, 14087, 17280, 21050, 25495, 30742, 36935, 44241, 52862, 63035, 75038, 89203, 105917, 125641, 148914, 176377, 208781, 247021, 292142, 345385, 408211, 482347, 569828, 673054, 794862, 938595, 1108199, 1308334, 1544491, 1823158, 2151984, 2539998, 2999866, 3534726, 4150978, 4871876, 5720676, 6709004, 7860115, 9220520, 10801845, 12638973, 14801667, 17313183, 20254913, 23673366, 27673188, 32335771, 37765762, 44091063, 51474455, 60067096, 70078279, 81728924, 95298088, 111099711, 129482615, 150865385, 175747999, 204676946, 238326612, 277441152, 322915875, 375773990, 437201491, 508558783, 591473702, 687771746, 799615610, 929493556, 1080277550, 1255758120, 1453423750, 1697598940, 1965028910, 2290595830, 2651044920, 3081258350],
                sulfur: 0,
                wine: 0,
                time: { a: 1550, b: 1, c: 1.2, d: 1800 },
                icon: 'cdn/all/both/img/city/marinechartarchive_l.png'
            },
            dockyard: {
                buildingId: 33,
                maxLevel: 38,
                wood: [503965, 605142, 726555, 872248, 1047083, 1256882, 1508644, 1810756, 2173290, 2608333, 3130383, 3756921, 4508858, 5411295, 6494351, 7794178, 9354161, 11226372, 13473301, 16169945, 19406318, 23290440, 27951959, 33546469, 40260704, 48318775, 57989648, 69596118, 83525594, 100243016, 120306386, 144385385, 173283731, 207966002, 249589835, 299544567, 359497604, 431450078, 517803646, 621440649, 745820316, 895094239, 1074244933, 1289252157, 1547292493, 1856978909, 2228648222, 2674706145, 3210041358, 3852522467],
                glass: [246611, 288860, 338295, 396129, 463799, 542971, 635601, 743979, 870782, 1019142, 1192722, 1395866, 1633610, 1911846, 2237470, 2618556, 3064548, 3586501, 4197352, 4912243, 5748895, 6728045, 7873963, 9215054, 10784558, 12621378, 14771047, 17286846, 20231135, 23676893, 27709532, 32429008, 37952305, 44416326, 51981296, 60834729, 71196076, 83322162, 97513558, 114122028, 133559245, 156307001, 182929145, 214085563, 250548528, 293221850, 343163275, 401610703, 470012872, 550065272],
                marble: [291403, 344201, 406504, 480019, 566769, 669131, 789920, 932452, 1100639, 1299099, 1533282, 1809679, 2135902, 2520933, 2975371, 3511728, 4144771, 4891929, 5773776, 6814589, 8043025, 9492904, 11204147, 13223869, 15607676, 18421202, 21741908, 25661225, 30287058, 35746769, 42190679, 49796201, 58772737, 69367434, 81871987, 96630681, 114049857, 134609110, 158874487, 187514073, 221316388, 261212093, 308299617, 363875395, 429469570, 506888107, 598262536, 706108621, 833395631, 983628096],
                sulfur: 0,
                wine: 0,
                time: { a: 64800, b: 1, c: 1.62, d: 5000 },
                icon: 'cdn/all/both/img/city/dockyard_l.png'
            },
            shrineOfOlympus: {
                buildingId: 34,
                maxLevel: 92,
                wood: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,10087813,12565488,15643666,19466331,24211692,30100250,37404772,46462587,57690767,71604857,88841976,110189308,136619241,169332684,209812466,259889159,321822177,398399733,493061950,610052536,754605580,933175592,1153720746,1426051604,1762260385,2177249331,2689380971,3321278281,4100809236,5062298044,6248015137,7710009860,9512364415,11733965646,14471913243,17845710105,22002413845,27122969282,33429991930,41197334092,50761840707,62537794978,77034667608,94878923312,116840809797,143867264912,177122335950,218036822103,268369239836,330280688090],
                wine: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,818467,1013752,1254983,1552855,1920519,2374163,2933690,3623574,4473903,5521654,6812262,8401541,10358043,12765945,15728589,19372824,23854318,29364077,36136414,44458731,54683473,67242786,82666447,101603825,124850745,153382378,188393480,231347625,284037437,348658267,427898305,525048792,644138781,790099918,968967903,1188128767,1456619914,1785498059,2188288905,2681536646,3285475412,4024849633,4929916287,6037669214,7393334617,9052197643,11081833169,13564830031,16602117569,20317027381],
                marble: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3410366,4385192,5635761,7239396,9294951,11928764,15302257,19621616,25150141,32223978,41272171,52842201,67632519,86533977,110682585,141526656,180912300,231192200,295364036,377246596,481703784,614929537,784810152,1001384971,1277432076,1629212783,2077417907,2648370274,3375552748,4301549577,5480512631,6981294033,8891424819,11322167543,14414931996,18349420929,23353971184,29718680561,37812069197,48102225041,61183637634,77811247146,98943644740,125797878818,159918978858,203268141304,258334577219,328277358500,417105293522,529905009362],
                glass: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1340860,1707266,2172679,2763604,3513591,4465090,5671801,7201632,9140446,11596765,14707736,18646625,23632286,29941095,37921993,48015445,60777338,76909081,97295539,123052805,155588366,196676873,248555530,314044193,396696525,500990245,632566538,798531276,1007834008,1271744671,1604453226,2023823767,2552342825,3218311733,4057345712,5114258366,6445430441,8121786984,10232538795,12889883933,16234915038,20445041074,25743310836,32410124529,40797943739,51349765887,64622324545,81315222101,102307508672,128703606825],
                sulfur: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1171010,1524789,1984424,2581338,3356215,4361724,5666019,7357274,9549532,12390255,16070068,20835340,27004397,34988458,45318612,58680623,75959780,98298730,127171989,164481966,212682678,274939104,355332447,459124444,593097718,765993938,989077862,1276863289,1648047329,2126712567,2743873791,3539467763,4564912684,5886400047,7589127986,978],
                time: { a: 11520, b: 1, c: 1.09, d: 0 },
                icon: 'cdn/all/both/img/city/shrineOfOlympus_l.png'
            },
            chronosForge: {
                buildingId: 35,
                maxLevel: 41,
                wood: [44752, 133526, 298797, 594337, 1108308, 1988283, 3453334, 5883459, 9883281, 16382992],
                wine: [0, 98689, 207980, 389601, 684212, 1153539, 1895264, 3034748, 4802112, 7488039],
                marble: [40942, 119737, 262637, 512066, 935984, 1639462, 2802201, 4685838, 7708959, 12511071],
                glass: [0, 0, 177613, 329406, 572742, 955999, 1546442, 2465006, 3860293, 5964851],
                sulfur: [0, 0, 0, 276436, 471125, 770813, 1220876, 1906892, 2930102, 4441663],
                time: { a: 11520, b: 1, c: 1.09, d: 0 },
                icon: 'cdn/all/both/img/city/chronosForge_l.png'
            }
        }
    };

    Constant.buildingOrder = {
        growth: [Constant.Buildings.TOWN_HALL, Constant.Buildings.PALACE, Constant.Buildings.GOVERNORS_RESIDENCE, Constant.Buildings.TAVERN, Constant.Buildings.MUSEUM, Constant.Buildings.SHRINEOFOLYMPUS, Constant.Buildings.CHRONOSFORGE],
        research: [Constant.Buildings.ACADEMY, Constant.Buildings.WORKSHOP, Constant.Buildings.TEMPLE],
        diplomacy: [Constant.Buildings.EMBASSY],
        trading: [Constant.Buildings.WAREHOUSE, Constant.Buildings.DUMP, Constant.Buildings.TRADING_PORT, Constant.Buildings.TRADING_POST, Constant.Buildings.BLACK_MARKET, Constant.Buildings.MARINE_CHART_ARCHIVE],
        military: [Constant.Buildings.WALL, Constant.Buildings.HIDEOUT, Constant.Buildings.BARRACKS, Constant.Buildings.SHIPYARD],
        wood: [Constant.Buildings.FORESTER, Constant.Buildings.CARPENTER],
        wine: [Constant.Buildings.WINERY, Constant.Buildings.VINEYARD],
        marble: [Constant.Buildings.STONEMASON, Constant.Buildings.ARCHITECT],
        crystal: [Constant.Buildings.GLASSBLOWER, Constant.Buildings.OPTICIAN],
        sulfur: [Constant.Buildings.ALCHEMISTS_TOWER, Constant.Buildings.FIREWORK_TEST_AREA],
        piracy: [Constant.Buildings.PIRATE_FORTRESS, Constant.Buildings.DOCKYARD]
    };
    Constant.altBuildingOrder = {
        growth: [Constant.Buildings.TOWN_HALL, Constant.Buildings.PALACE, Constant.Buildings.GOVERNORS_RESIDENCE, Constant.Buildings.TAVERN, Constant.Buildings.MUSEUM, Constant.Buildings.SHRINEOFOLYMPUS, Constant.Buildings.CHRONOSFORGE],
        research: [Constant.Buildings.ACADEMY, Constant.Buildings.WORKSHOP, Constant.Buildings.TEMPLE],
        diplomacy: [Constant.Buildings.EMBASSY],
        trading: [Constant.Buildings.WAREHOUSE, Constant.Buildings.DUMP, Constant.Buildings.TRADING_PORT, Constant.Buildings.TRADING_POST, Constant.Buildings.BLACK_MARKET, Constant.Buildings.MARINE_CHART_ARCHIVE],
        military: [Constant.Buildings.WALL, Constant.Buildings.HIDEOUT, Constant.Buildings.BARRACKS, Constant.Buildings.SHIPYARD],
        production: [Constant.Buildings.FORESTER, Constant.Buildings.WINERY, Constant.Buildings.STONEMASON, Constant.Buildings.GLASSBLOWER, Constant.Buildings.ALCHEMISTS_TOWER],
        reducton: [Constant.Buildings.CARPENTER, Constant.Buildings.VINEYARD, Constant.Buildings.ARCHITECT, Constant.Buildings.OPTICIAN, Constant.Buildings.FIREWORK_TEST_AREA],
        piracy: [Constant.Buildings.PIRATE_FORTRESS, Constant.Buildings.DOCKYARD]
    };
    Constant.compBuildingOrder = {
        growth: [Constant.Buildings.TOWN_HALL, 'colonyBuilding', Constant.Buildings.PALACE, Constant.Buildings.GOVERNORS_RESIDENCE, Constant.Buildings.TAVERN, Constant.Buildings.MUSEUM, Constant.Buildings.SHRINEOFOLYMPUS, Constant.Buildings.CHRONOSFORGE],
        research: [Constant.Buildings.ACADEMY, Constant.Buildings.WORKSHOP, Constant.Buildings.TEMPLE],
        diplomacy: [Constant.Buildings.EMBASSY],
        trading: [Constant.Buildings.WAREHOUSE, Constant.Buildings.DUMP, Constant.Buildings.TRADING_PORT, Constant.Buildings.TRADING_POST, Constant.Buildings.BLACK_MARKET, Constant.Buildings.MARINE_CHART_ARCHIVE],
        military: [Constant.Buildings.WALL, Constant.Buildings.HIDEOUT, Constant.Buildings.BARRACKS, Constant.Buildings.SHIPYARD],
        production: [Constant.Buildings.FORESTER, 'productionBuilding', Constant.Buildings.WINERY, Constant.Buildings.STONEMASON, Constant.Buildings.GLASSBLOWER, Constant.Buildings.ALCHEMISTS_TOWER],
        reducton: [Constant.Buildings.CARPENTER, Constant.Buildings.VINEYARD, Constant.Buildings.ARCHITECT, Constant.Buildings.OPTICIAN, Constant.Buildings.FIREWORK_TEST_AREA],
        piracy: [Constant.Buildings.PIRATE_FORTRESS, Constant.Buildings.DOCKYARD]
    };
    Constant.unitOrder = {
        army_front_line: [Constant.Military.HOPLITE, Constant.Military.SPARTAN, Constant.Military.STEAM_GIANT],
        army_flank: [Constant.Military.SPEARMAN, Constant.Military.SWORDSMAN],
        army_ranged: [Constant.Military.SLINGER, Constant.Military.ARCHER, Constant.Military.MARKSMAN],
        army_seige: [Constant.Military.RAM, Constant.Military.CATAPULT, Constant.Military.MORTAR],
        army_air: [Constant.Military.GYROCOPTER, Constant.Military.BALLOON_BOMBADIER],
        army_support: [Constant.Military.COOK, Constant.Military.DOCTOR],
        navy_front_line: [Constant.Military.FLAME_THROWER, Constant.Military.STEAM_RAM],
        navy_flank: [Constant.Military.RAM_SHIP],
        navy_ranged: [Constant.Military.BALLISTA_SHIP, Constant.Military.CATAPULT_SHIP, Constant.Military.MORTAR_SHIP],
        navy_seige: [Constant.Military.SUBMARINE, Constant.Military.ROCKET_SHIP],
        navy_air: [Constant.Military.PADDLE_SPEEDBOAT, Constant.Military.BALLOON_CARRIER],
        navy_support: [Constant.Military.TENDER]
    };

    /***********************************************************************************************************************
 * Main Init
 **********************************************************************************************************************/
    if (debug) {
        delete unsafeWindow.console;
        unsafeWindow.empire = {
            s: empire,
            db: database,
            ikariam: ikariam,
            render: render,
            events: events,
            utils: Utils,
            Constant: Constant,
            $: $,
            get tip() { return $('.breakdown_table').text().replace(/\s\s/g, ' ').replace(/\s\s/g, ' ').replace(/\s\s/g, ' ').replace(/\s\s/g, ' ').replace(/\s\s/g, ' ').replace(/\s\s/g, ' ').replace(/\s\s/g, ' ').replace(/\s\s/g, ' ').replace(/\s\s/g, ' ').replace(/\s\s/g, ' ').replace(/\s\s/g, ' ').replace(/\s\s/g, ' '); }
        };
    }

    empire.Init();
    $(function () {
        var bgViewId = $('body').attr('id');
        if (!(bgViewId === 'city' || bgViewId === 'island' || bgViewId === 'worldmap_iso' || !$('backupLockTimer').length)) {
            return false;
        }

        (function init(model, data, local, ajax) {
            var mod, dat, loc, aj;
            mod = !!unsafeWindow.ikariam && !!unsafeWindow.ikariam.model;
            dat = !!unsafeWindow.ikariam && !!unsafeWindow.ikariam.model.relatedCityData;
            loc = !!unsafeWindow.LocalizationStrings;
            aj = !!unsafeWindow.ikariam.controller && !!unsafeWindow.ikariam.controller.executeAjaxRequest && !!unsafeWindow.ajaxHandlerCallFromForm;
            if (dat && !data) {
                events(Constant.Events.CITYDATA_AVAILABLE).pub();
            }
            if (mod && dat && !model && !data) {
                events(Constant.Events.MODEL_AVAILABLE).pub();
            }
            if (loc && !local) {
                events(Constant.Events.LOCAL_STRINGS_AVAILABLE).pub();
            }
            if (aj && !ajax) {
                unsafeWindow.ajaxHandlerCallFromForm = function (ajaxHandlerCallFromForm) {
                    return function cAjaxHandlerCallFromForm(form) {
                        events('formSubmit').pub(form);
                        return ajaxHandlerCallFromForm.apply(this, arguments);
                    };
                }(unsafeWindow.ajaxHandlerCallFromForm);

                unsafeWindow.ikariam.controller.executeAjaxRequest = function (execAjaxRequest) {
                    return function cExecuteAjaxRequest() {
                        var args = $.makeArray(arguments);
                        args.push(undefined);
                        if (!args[1]) {
                            args[1] = function customAjaxCallback(responseText) {
                                var responder = unsafeWindow.ikariam.getClass(unsafeWindow.ajax.Responder, responseText);
                                unsafeWindow.ikariam.controller.ajaxResponder = responder;
                                events('ajaxResponse').pub(responder.responseArray);
                                unsafeWindow.response = responder;
                            };
                        }
                        var ret = execAjaxRequest.apply(this, args);
                    };
                }(unsafeWindow.ikariam.controller.executeAjaxRequest);
            }
            if (!(mod && loc && dat && aj)) {
                events.scheduleAction(init.bind(null, mod, loc, dat, aj), 1000);
            }
            else {
                var initialAjax = [];
                $('script').each(function (index, script) {
                    var match = /ikariam.getClass\(ajax.Responder, (.*)\);/.exec(script.innerHTML);
                    if (match) {
                        events('ajaxResponse').pub(JSON.parse(match[1] || []));
                        return false;
                    }
                });
            }
        })();
    });

    /**************************************************************************
*  for IkaLogs
***************************************************************************/

    function addScript(src) {
        var scr = document.createElement('script');
        scr.type = 'text/javascript';
        scr.src = src;
        document.getElementsByTagName('body')[0].appendChild(scr);
    }
})(jQuery);