// ==UserScript==
// @name         TF2 S.T.A.R.S.
// @namespace    http://steamcommunity.com/groups/stars-tf2
// @version      2.0.12
// @description  Show player ratings in TF2Center, Logs.tf and Steam profile. Data from ETF2L, UGC and Steam stats. Works on Highlander and 6v6.
// @author       Kengur <kengur.steam@gmail.com>
// @include      *tf2center.com*
// @include      *logs.tf*
// @include      *steamcommunity.com*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @grant        unsafeWindow
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/36232/TF2%20STARS.user.js
// @updateURL https://update.greasyfork.org/scripts/36232/TF2%20STARS.meta.js
// ==/UserScript==

DEBUG = 0;

function log(obj, string) {
    if (DEBUG) {
        if (string) console.log(string);
        console.log(obj);
    }
}

var TF = (function() {

    //Compartibility Onion

    function MSG_send(slot, msg) {
        //log(slot, "MSG_send");
        unsafeWindow.localStorage.setItem("tf2stars-msg@" + slot, JSON.stringify({
            0: msg
        }));
    }

    function MSG_recv(slot, func) {
        //log(slot, "MSG_recv");
        unsafeWindow.addEventListener("storage", function(evt) {
            if (evt.key == "tf2stars-msg@" + slot) {
                try {
                    var value = JSON.parse(evt.newValue)[0];
                    func(value);
                } catch (e) {
                    log(e, "error MSG_recv");
                }
            }
        });
    }

    function LS_setValue(key, value) {
        if (TrueMonkey()) { GM_setValue(key, value); return; }
        //log(key, "LS_setValue");
        var keys = LS_listValues();
        if (!inArray(key, keys)) {
            //log(key, "insert key");
            keys.push(key);
            unsafeWindow.localStorage.setItem("tf2stars", JSON.stringify({
                0: keys
            }));
        }
        unsafeWindow.localStorage.setItem(key, value);
    }

    function LS_getValue(key) {
        if (TrueMonkey()) return GM_getValue(key);
        //log(key, "LS_getValue");
        return unsafeWindow.localStorage.getItem(key);
    }

    function LS_deleteValue(key) {
        if (TrueMonkey()) { GM_deleteValue(key); return; }
        //log(key, "LS_deleteValue");
        var keys = LS_listValues();
        if (inArray(key, keys)) {
            var index = keys.indexOf(key);
            //log(index, "remove index");
            if (index > -1) {
                keys.splice(index, 1);
                unsafeWindow.localStorage.setItem("tf2stars", JSON.stringify({
                    0: keys
                }));
            }
        }
        unsafeWindow.localStorage.removeItem(key);
    }

    function LS_listValues() {
        if (TrueMonkey()) return GM_listValues();
        //log("LS_listValues");
        try {
            return JSON.parse(LS_getValue("tf2stars"))[0];
        } catch (e) {
            log(e, "error LS_listValues");
            return [];
        }
    }

    function TrueMonkey() {
        if (navigator.vendor.indexOf("Google") >= 0) return true;
        else if (navigator.vendor.indexOf("Opera") >= 0) return true;
        else return false; //cause Greasemonkey is shit and secure
    }

    if (typeof (exportFunction) !== typeof (Function)) myExportFunction = function (func, window, name) { window[name['defineAs']] = func;} //Opera
    else myExportFunction = exportFunction;

    //Utilities

    NBSP = String.fromCharCode(160);
    
    function sortNumber(a,b) {
    	return a - b;
	}

    function isEmpty(obj) {
        if (obj !== undefined && obj !== null) {
            for (var prop in obj) {
                if (obj.hasOwnProperty(prop))
                    return false;
            }
        }
        return true;
    }

    function inArray(obj, array) {
        if (DEBUG) { if (array !== undefined && array !== null && array.length === undefined) { throw new Error(array + " is not an array (inArray)"); } }
        if (array !== undefined && array !== null && array.indexOf(obj) >= 0) return true;
        return false;
    }

    function atIndex(obj, index) {
        if (obj !== undefined && obj !== null) {
            var len = Object.keys(obj).length;
            if (index >= 0 && index < len) return Object.keys(obj)[index];
            else if (index < 0 && -index <= len) return Object.keys(obj)[len + index];
        }
        return null;
    }

    function randArray(array) {
        return array[~~(Math.random() * array.length)];
    }

    function sizeBytes(size) {
        var i = -1;
        var byteUnits = [' kB', ' MB', ' GB', ' TB', 'PB', 'EB', 'ZB', 'YB'];
        do {
            size = size / 1024;
            i++;
        } while (size > 1024);
        return size.toFixed(1) + byteUnits[i];
    }

    function unixtime(seconds) {
        var time = new Date(0);
        time.setSeconds(seconds);
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        var year = time.getFullYear();
        var month = months[time.getMonth()];
        var date = time.getDate();
        var string = date + '&nbsp;' + month + '&nbsp;' + year;
        return string;
    }

    function unixtime_years_since(seconds) {
        var time = new Date(0);
        time.setSeconds(seconds);
        var diff = new Date(Date.now() - time.getTime());
        return Math.abs(diff.getFullYear() - 1970);
    }

    function addStyle(e) {
        var t = document.createElement("style");
        t.type = "text/css";
        t.appendChild(document.createTextNode(e));
        document.getElementsByTagName("head")[0].appendChild(t);
    }

    function addElement(e) {
        document.getElementsByTagName("body")[0].appendChild(e);
    }

    function addContent(e) {
        var t = document.createElement("div");
        t.innerHTML = e;
        document.getElementsByTagName("body")[0].appendChild(t);
    }

    function extScript(id, url) {
        var t = document.createElement("script");
        t.type = "text/javascript";
        t.id = id;
        t.src = url;
        document.getElementsByTagName("head")[0].appendChild(t);
    }

    function extStyle(id, url) {
        var t = document.createElement("link");
        t.type = "text/javascript";
        t.rel = "stylesheet";
        t.id = id;
        t.href = url;
        document.getElementsByTagName("head")[0].appendChild(t);
    }

    function addScript(id, e) {
        var t = document.createElement("script");
        t.type = "text/javascript";
        t.id = id;
        t.appendChild(document.createTextNode("/*<![CDATA[*/ \n" + e + "\n/*]]>*/ "));
        document.getElementsByTagName("head")[0].appendChild(t);
    }

    function removeElement(id) {
        var e = document.getElementById(id);
        if (e !== null) e.parentNode.removeChild(e);
    }

    function matchString(match, list) {
        var mylist = [];
        if (!isEmpty(list)) {
            for (var i = 0; i < list.length; i++) {
                if (list[i].indexOf(match) >= 0) mylist.push(list[i]);
            }
        }
        return mylist;
    }

    //TFCache
    var TFCache = (function() {

        //TFCache Private
        var pref = "tf2stars-";

        var store_cache = {
            "cache_motd": 1,
            "cache_data": "cache_days",
        };
        var store_data = {
            "cache_sound": 0, //put metadata here?
        };

        function timestamp(days) {
            if (days === undefined) days = 0;
            var time = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
            var year = time.getFullYear();
            var month = time.getMonth() + 1;
            month = ("0" + month).slice(-2);
            var date = ("0" + time.getDate()).slice(-2);
            var string = year + "" + month + "" + date;
            return string;
        }

        function is_expired(time1, time2) {
            if (time2.localeCompare(time1) !== -1) return true;
            return false;

        }

        function get_keylist(name) {
            return matchString(name, LS_listValues()).sort();
        }

        function get_cache(name) {
            var val = store_cache[name];
            if (typeof(val) == "string") return TF.getCFG(val);
            return val;

        }

        function check_cache(name) {
            var val = store_cache[name];
            if (val === undefined) {
                log(name, "cache not in store");
                return false;
            }
            return true;
        }

        function check_data(name) {
            var val = store_data[name];
            if (val === undefined) {
                log(name, "data not in store");
                return false;
            }
            return true;
        }

        function load_value(name) {
            try {
                return JSON.parse(LS_getValue(name));
            } catch (e) {
                log(name, "error load_value");
            }
        }

        function save_value(name, value) {
            try {
                LS_setValue(name, JSON.stringify(value));
            } catch (e) {
                log(name, "error save_value");
            }
        }

        function load_cache(name, slot) {
            var cache = {};
            var obj = {};
            var key = "";
            var valid = get_cache(name);
            var date = "";
            if (slot !== undefined) date = "@" + slot;
            var keyarray = get_keylist(pref + name + date);
            for (var i = 0; i < keyarray.length; i++) {
                key = keyarray[i];
                date = key.split("@")[1];
                if (slot === undefined && is_expired(date, timestamp(-valid))) {
                    log(key, "delete expired cash");
                    LS_deleteValue(key);
                } else {
                    //log(key, "load cash");
                    try {
                        obj = JSON.parse(LS_getValue(key));
                    } catch (e) {
                        log(key, "error get_cashe");
                        continue;
                    }
                    cache = $.extend(cache, obj);
                }
            }
            return cache;
        }

        function load_data(name, slot) {
            var date = "";
            if (slot !== undefined) date = "@" + slot;
            var keyarray = get_keylist(pref + name + date);
            if (!isEmpty(keyarray)) {
                //log(keyarray[0], "load cash");
                obj = LS_getValue(keyarray[0]);
                return obj;
            }
        }

        function save_cache(name, obj, slot) {
            var date = "@" + slot;
            var key = pref + name + date;
            //log(key, "save cache");
            try {
                LS_setValue(key, JSON.stringify(obj));
            } catch (e) {
                log(key, "error save_cache");
            }
        }

        function save_data(name, obj, slot) {
            var date = "@" + slot;
            var key = pref + name + date;
            //log(key, "save data");
            try {
                LS_setValue(key, obj);
            } catch (e) {
                log(key, "error save_data");
            }
        }

        function wipe_cache(name, days) {
            //log(name, "wipe_cache day " + days);
            var key = "";
            var date = "";
            var keyarray = get_keylist(pref + name);
            for (var i = 0; i < keyarray.length; i++) {
                key = keyarray[i];
                date = key.split("@")[1];
                if (days === undefined || is_expired(date, timestamp(-days))) {
                    //log(key, "wipe cash");
                    LS_deleteValue(key);
                }
            }
        }

        function delete_cache(name, slot) {
            //log(slot, "delete_cache");
            var keyarray = get_keylist(pref + name + "@" + slot);
            for (var i = 0; i < keyarray.length; i++) {
                key = keyarray[i];
                //log(key, "delete cache");
                LS_deleteValue(key);
            }
        }

        //TFCache Public
        return {
            getCache: function(name, slot) {
                if (check_cache(name)) return load_cache(name, slot);
            },
            getData: function(name, slot) {
                if (check_data(name)) return load_data(name, slot);
            },
            setCache: function(name, obj, slot) {
                if (check_cache(name) && !isEmpty(obj)) {
                    if (slot === undefined) slot = timestamp();
                    var cache = load_cache(name, slot);
                    cache = $.extend(cache, obj);
                    save_cache(name, cache, slot);
                }
            },
            setData: function(name, obj, slot) {
                if (check_data(name) && !isEmpty(obj)) {
                    if (slot === undefined) slot = timestamp();
                    save_data(name, obj, slot);
                }
            },
            wipeAllCache: function() {
                var key;
                for (var i = 0;
                    ((key = atIndex(store_cache, i)) !== null); i++) wipe_cache(key);
            },
            wipeAllData: function() {
                var key;
                for (var i = 0;
                    ((key = atIndex(store_data, i)) !== null); i++) wipe_cache(key);
            },
            wipeCache: function(name, days) { //0 days to save future. no days to wipe all
                if (check_cache(name)) wipe_cache(name, days);
            },
            wipeData: function(name) {
                if (check_data(name)) wipe_cache(name);
            },
            deleteCache: function(name, slot) {
                if (check_cache(name) && slot !== undefined) delete_cache(name, slot);
            },
            deleteData: function(name, slot) {
                if (check_data(name) && slot !== undefined) delete_cache(name, slot);
            },
            sizeCache: function(name, slot) {
                if (name === undefined) {
                    var size = 0;
                    var key;
                    for (var i = 0;
                        ((key = atIndex(store_cache, i)) !== null); i++) {
                        size = size + JSON.stringify(load_cache(key)).length;
                    }
                    return size;
                }
                if (check_cache(name)) return JSON.stringify(load_cache(name, slot)).length;
            },
            sizeData: function(name, slot) {
                if (name === undefined) {
                    var size = 0;
                    var key;
                    for (var i = 0;
                        ((key = atIndex(store_data, i)) !== null); i++) {
                        var keyarray = get_keylist(pref + key);
                        for (var j = 0; j < keyarray.length; j++) {
                            key = keyarray[j];
                            size = size + LS_getValue(key).length;
                        }
                    }
                    return size;
                }
                if (check_data(name)) return load_data(name, slot).length;
            },
            //sizeData: function(name, slot) {
            //    var date = "";
            //    if (check_data(name)) {
            //        if (slot !== undefined) date = "@" + slot;
            //        var keyarray = get_keylist(pref + name + date);
            //        var len = 0;
            //       for (var i = 0; i < keyarray.length; i++) {
            //           key = keyarray[i];
            //           len = len + LS_getValue(key).length;
            //       }
            //       return len;
            //   }
            //},
        };
    })();
    //TFCache()

    //TFPlayer
    function TFPlayer(id) {
        this.id64 = id;
        this.data = {
            etf2l: null,
            ugc: null,
            steam: null,
        };
        this.updating = false;
        this.motd = "";
        this.cached = false;
    }
    
    TFPlayer.prototype.ugc_table = 40;

    TFPlayer.prototype.etf2lfun = ["The Highlander Open", "Fun Cup", "Nations' Cup", ];

    TFPlayer.prototype.etf2lformat = ["Highlander", "6on6", ];

    TFPlayer.prototype.ugcformat = ["TF2 Highlander", "TF2 6vs6", ];

    TFPlayer.prototype.etf2l_hl_div = ["HL&nbsp;Prem", "HL&nbsp;High", "HL&nbsp;High", "HL&nbsp;Mid", "HL&nbsp;Mid", "HL&nbsp;Open", "HL&nbsp;Open", "HL&nbsp;FunCup"];

    TFPlayer.prototype.etf2l_six_div = ["6on6&nbsp;Prem", "6on6&nbsp;High", "6on6&nbsp;High", "6on6&nbsp;Mid", "6on6&nbsp;Mid", "6on6&nbsp;Open", "6on6&nbsp;Open", "6on6&nbsp;FunCup"];

    TFPlayer.prototype.ugc_hl_div = ["HL&nbsp;Plat", "HL&nbsp;Plat", "HL&nbsp;Gold", "HL&nbsp;Gold", "HL&nbsp;Silver", "HL&nbsp;Silver", "HL&nbsp;Steel", "HL&nbsp;Iron"];

    TFPlayer.prototype.ugc_six_div = ["6vs6&nbsp;Plat", "6vs6&nbsp;Plat", "6vs6&nbsp;Gold", "6vs6&nbsp;Gold", "6vs6&nbsp;Silver", "6vs6&nbsp;Silver", "6vs6&nbsp;Steel", "6vs6&nbsp;Iron"];

    TFPlayer.prototype.numbers = ["", "❶", "❷", "❸", "❹", "❺", "❻", "❼", "❽", "❾"];

    TFPlayer.prototype.etf2l_to_div = {
        "Prem": 0,
        "High": 1,
        "Mid": 2,
        "Open": 3,
    };

    TFPlayer.prototype.bestRating = function(obj, adj) {
        if (obj !== undefined && obj !== null && !isEmpty(obj)) {
            var key = Object.keys(obj).sort(sortNumber).pop()
            return [parseFloat(key) + adj, obj[key]];
        }
        return [0, null];
    };

    TFPlayer.prototype.NR = function(rating) {
        var MIN = 0;
        var MAX = 50;
        return Math.min(Math.max(~~(parseFloat(rating) / 5) * 5, MIN), MAX);
    };

    TFPlayer.prototype.getRating = function(format, player_class) {
        var bonus = 0;
        var rating = 0;
        var head = "";
        var body = "";
        var name = "";
        var other = "";
        var ban = 0;
        var bans;
        var class_played = 0;
        var map_played = 0;
        var main_class = false;
        var hl_rating = {};
        var six_rating = {};
        var best_hl;
        var best_six;
        var etf2l_hl;
        var etf2l_six;
        var class_bonus = TF.getCFG("class_bonus");
        var map_bonus = TF.getCFG("map_bonus");
        var format_penalty = TF.getCFG("format_penalty");
        var baseline_div = TF.getCFG("baseline_div");
        var increment_div = TF.getCFG("increment_div");
        if (format === undefined) {
            format = 0;
            increment_div = 6.67;
            log("Profile rating");
        }

        // UGC
        if (!isEmpty(this.data.ugc)) {
            var ugc_hl = this.data.ugc["Highlander"];
            var ugc_six = this.data.ugc["6vs6"];
            if (ugc_hl !== undefined) {
                body = ugc_hl.region + " " + this.ugc_hl_div[ugc_hl.div] + "<br>[&nbsp;" + ugc_hl.team + "&nbsp;]";
                rating = (baseline_div - ugc_hl.div) * increment_div;
                hl_rating[rating] = body;
            }
            if (ugc_six !== undefined) {
                body = ugc_six.region + " " + this.ugc_six_div[ugc_six.div] + "<br>[&nbsp;" + ugc_six.team + "&nbsp;]";
                rating = (baseline_div - ugc_six.div) * increment_div;
                six_rating[rating] = body;
            }
        }

        // ETF2L
        if (!isEmpty(this.data.etf2l)) {
            etf2l_hl = this.data.etf2l["Highlander"];
            etf2l_six = this.data.etf2l["6on6"];
            if (this.data.etf2l.country !== null) head = "<img src='http://etf2l.org/images/flags/" + this.data.etf2l.country + ".gif' style='float: right; outline: 1px solid #000000;'>";
            if (this.data.etf2l.name !== null && TF.getCFG("etf2l_update", "name")) {
                name = "<p>" + this.data.etf2l.name;
                var years = unixtime_years_since(this.data.etf2l.registered);
                if (years == 1) name = name + " on ETF2L 1 year";
                else if (years > 1) name = name + " on ETF2L " + years + " years";
                else name = name + " on ETF2L less than a year";
                name = name + "</p>";
            }
            if (TF.getCFG("etf2l_update", "class") && inArray(player_class, this.data.etf2l.classes)) main_class = true;
            bans = this.data.etf2l.bans;
            if (bans !== undefined) {
                var active = this.data.etf2l.ban;
                if (active !== undefined) {
                    if (active.reason == "Blacklisted") head = head + "<p style='color: #" + TF.getCFG("color_warning") + "'>The account is Blacklisted and not eligible to play in ETF2L.";
                    else if (active.reason == "VAC ban") head = head + "<p style='color: #" + TF.getCFG("color_warning") + "'>The account is VAC banned on ETF2L untill " + unixtime(active.end);
                    else head = head + "<p style='color: #" + TF.getCFG("color_warning") + "'>The account is banned for " + active.reason + " on ETF2L untill&nbsp;" + unixtime(active.end);
                    ban = 2;
                } else {
                    head = head + "<p style='color: #" + TF.getCFG("color_warning") + "'>Expired bans on ETF2L " + bans;
                    if (ban === 0) ban = 1;
                }
                head = head + "</p>";
            }
            if (etf2l_hl !== undefined) {

                if (etf2l_hl.div_max !== null) {
                    body = "<p>" + this.etf2l_hl_div[etf2l_hl.div_max];
                    if (etf2l_hl.div !== null) body += "</p><p>[&nbsp;" + etf2l_hl.team + "&nbsp;] " + this.etf2l_hl_div[etf2l_hl.div] + "</p>";
                    else body += "</p><small>Not currently on Highlander roster or team has no games</small></p>";
                    rating = (baseline_div - etf2l_hl.div_max) * increment_div;
                    if (!isNaN(rating)) hl_rating[rating] = body;
                    else log(this, "hl divmax NaN");
                }
                if (etf2l_hl.div !== null) {
                    body = "<p>" + this.etf2l_hl_div[etf2l_hl.div] + "</p><p>[&nbsp;" + etf2l_hl.team + "&nbsp;]</p>";
                    if (etf2l_hl.div_max !== null && etf2l_hl.div < etf2l_hl.div_max) {
                        rating = (baseline_div - etf2l_hl.div_max) * increment_div;
                        body += "<p><small>Recently played " + this.etf2l_hl_div[etf2l_hl.div_max] + "</small></p>";
                    } else rating = (baseline_div - etf2l_hl.div) * increment_div;
                    if (!isNaN(rating)) hl_rating[rating] = body;
                    else log(this, "hl div NaN");
                }
            }
            if (etf2l_six !== undefined) {
                if (etf2l_six.div_max !== null) {
                    body = "<p>" + this.etf2l_six_div[etf2l_six.div_max];
                    if (etf2l_six.div !== null) body += "</p><p>[&nbsp;" + etf2l_six.team + "&nbsp;] " + this.etf2l_six_div[etf2l_six.div] + "</p>";
                    else body += "<p><small>Not currently on 6on6 roster or team has no games</small></p>";
                    rating = (baseline_div - etf2l_six.div_max) * increment_div;
                    if (!isNaN(rating)) six_rating[rating] = body;
                    else log(this, "six divmax NaN");
                }
                if (etf2l_six.div !== null) {
                    body = "<p>" + this.etf2l_six_div[etf2l_six.div] + "</p><p>[&nbsp;" + etf2l_six.team + "&nbsp;]</p>";
                    if (etf2l_six.div_max !== null && etf2l_six.div < etf2l_six.div_max) {
                        rating = (baseline_div - etf2l_six.div_max) * increment_div;
                        body += "<p><small>Recently played " + this.etf2l_six_div[etf2l_six.div_max] + "</small></p>";
                    } else rating = (baseline_div - etf2l_six.div) * increment_div;
                    if (!isNaN(rating)) six_rating[rating] = body;
                    else log(this, "six div NaN");
                }
            }
        }

        // STEAM
        if (!isEmpty(this.data.steam)) {
            bans = this.data.steam.bans; //Steam Bans
            if (bans !== undefined) {
                if (bans.vac) {
                    head = head + "<p style='color: #" + TF.getCFG("color_warning") + "'>Steam VAC ban(s)&nbsp;" + bans.vacbans + " on record. Day(s) since last ban&nbsp;" + bans.lastbandays.toLocaleString() + "</p>";
                    ban = 2;
                }
                if (bans.community) {
                    head = head + "<p style='color: #" + TF.getCFG("color_warning") + "'>Steam Community banned</p>";
                    if (ban === 0) ban = 1;
                }
                if (bans.economy !== "none") {
                    head = head + "<p style='color: #" + TF.getCFG("color_warning") + "'>Steam Trade " + bans.economy + "</p>";
                    if (ban === 0) ban = 1;
                }
            }
            if (inArray("stats", TF.getCFG("steam_update").split(" "))) { //Steam Main
                var stats = this.data.steam.tf2stats;
                if (stats !== undefined) {
                    class_played = Math.round(stats[player_class] / 3600);
                    if (class_played >= TF.getCFG("class_hours")) main_class = true;
                    map_played = stats[lobby_map];
                    if (map_played === undefined) map_played = stats[lobby_map_alt];
                    if (map_played !== undefined) map_played = Math.round(map_played / 3600);
                }
            }
        }

        //Class bonus
        if (main_class) {
            if (class_played > 0) {
                other = other + "<p>" + player_class + " main " + class_played.toLocaleString() + " hrs</p>";
                class_bonus = Math.min(Math.floor(class_played / TF.getCFG("class_hours")), TF.getCFG("class_stack")) * class_bonus;
            } else other = other + "<p>" + player_class + " main</p>";
            bonus = bonus + class_bonus;
        }

        //Map bonus
        if (map_played >= TF.getCFG("map_hours")) {
            other = other + "<p>Map played " + map_played.toLocaleString() + " hrs</p>";
            map_bonus = Math.min(Math.floor(map_played / TF.getCFG("map_hours")), TF.getCFG("map_stack")) * map_bonus;
            bonus = bonus + map_bonus;
        }

        switch (format) {
            //Profile
            case 0:
                bonus = 0;
                format_penalty = 0;
                //Highlander
            case 1:
                best_hl = this.bestRating(hl_rating, bonus);
                best_six = this.bestRating(six_rating, bonus + format_penalty);
                if (best_hl[0] > 0 && best_hl[0] >= best_six[0]) return [this.NR(best_hl[0]), this.motd + head + best_hl[1] + other + name, ban];
                else if (best_six[0] > 0 && best_six[0] > best_hl[0]) return [this.NR(best_six[0]), this.motd + head + best_six[1] + other + name, ban];
                else if (ban > 0 || bonus > 0) return [bonus, this.motd + head + other + name, ban];
                return null;
                //6on6
            case 2:
                best_hl = this.bestRating(hl_rating, bonus + format_penalty);
                best_six = this.bestRating(six_rating, bonus);
                if (best_six[0] > 0 && best_six[0] >= best_hl[0]) return [this.NR(best_six[0]), this.motd + head + best_six[1] + other + name, ban];
                else if (best_hl[0] > 0 && best_hl[0] > best_six[0]) return [this.NR(best_hl[0]), this.motd + head + best_hl[1] + other + name, ban];
                else if (ban > 0 || bonus > 0) return [bonus, this.motd + head + other + name, ban];
                return null;
        }
    };

    //Updates
    TFPlayer.prototype.update = function(callback) {
        if (!this.updating) {
            this.updating = true;
            this._update_etf2l_player(callback); // callback return at the end of update queue
        }
    };

    TFPlayer.prototype._update_etf2l_player = function(callback) {
        var player = this;
        if (!TF.getCFG("etf2l_update", "div")) {
            player._update_ugc_player(callback);
            return;
        } //next update
        log('update_etf2l_player ' + player.id64);
        GM_xmlhttpRequest({
            method: "GET",
            url: "http://api.etf2l.org/player/" + player.id64,
            headers: {
                Accept: "application/json"
            },
            onload: function(resp) {
                if (resp.status == "200") {
                    player._update_etf2l_results(callback); //next update
                    var data = JSON.parse(resp.responseText);
                    if (data !== null) {
                        var etf2l = {
                            classes: data.player.classes,
                            country: data.player.country,
                            name: data.player.name,
                            registered: data.player.registered,
                        };
                        var key = atIndex(data.player.bans, -1);
                        if (key !== null) {
                            var ban = data.player.bans[key];
                            var time = new Date(0);
                            time.setSeconds(ban.end);
                            if (etf2l.bans === undefined) etf2l.bans = "'" + ban.reason + "'";
                            else etf2l.bans = etf2l.bans + "; '" + ban.reason + "'";
                            if (Date.now() < time) etf2l.ban = ban;
                        }

                        //Init etf2lformat teams
                        for (var i = 0; i < player.etf2lformat.length; i++) etf2l[player.etf2lformat[i]] = $.extend(etf2l[player.etf2lformat[i]], {
                            team: null,
                            tag: null,
                            div: null,
                            div_max: null
                        });

                        var teams = data.player.teams;
                        if (teams !== null)
                            for (var i = 0; i < teams.length; i++) {
                                var lable = teams[i].type;
                                var team = {
                                    team: teams[i].name,
                                    tag: teams[i].tag,
                                    div: null,
                                    div_max: null
                                };

                                var obj = teams[i].competitions;
                                if (!isEmpty(obj)) {
                                    for (var j = -1; (key = atIndex(obj, j)) !== null; j--) {
                                        if (!isEmpty(obj) && !inArray(obj[key].category, player.etf2lfun)) {
                                            if (inArray(obj[key].division.name, Object.keys(player.etf2l_to_div))) {
                                                team.div = {0:0,1:2,2:4,3:6}[ parseInt(player.etf2l_to_div[obj[key].division.name]) ];
                                                //log(team.div, "NEW fucken! tier "+obj[key].division.name);
                                                break;
                                            } else if (obj[key].division.tier !== null) {
                                                team.div = {0:0,1:2,2:4,3:6}[ parseInt(obj[key].division.tier) ];
                                                break;
                                            }
                                        }
                                        team.div = 7;
                                    }
                                }
                                etf2l[lable] = $.extend(etf2l[lable], team);
                            }
                        player.data.etf2l = $.extend(player.data.etf2l, etf2l);
                    }
                } else if (resp.status == "404") {
                    log("ETF2L player not found " + player.id64);
                    player._update_ugc_player(callback); //next update
                } else {
                    log("ETF2L " + resp.statusText);
                    player._update_ugc_player(callback); //next update
                }
            },
            ontimeout: function(resp) {
                log("ETF2L Timeout " + TF.getCFG("xhr_timeout"));
                player._update_ugc_player(callback); //next update
            },
            timeout: TF.getCFG("xhr_timeout"),
        });
    };

    TFPlayer.prototype._update_etf2l_results = function(callback) {
        var player = this;
        if (!TF.getCFG("etf2l_update", "div")) {
            player._update_ugc_player(callback);
            return;
        } //next update
        log('update_etf2l_results ' + player.id64);
        GM_xmlhttpRequest({
            method: "GET",
            url: "http://api.etf2l.org/player/" + player.id64 + "/results?since=0",
            headers: {
                Accept: "application/json"
            },
            onload: function(resp) {
                player._update_ugc_player(callback); //next update
                if (resp.status == "200") {
                    var data = JSON.parse(resp.responseText);
                    if (!isEmpty(data) && !isEmpty(data.results)) {
                        var results = data.results;
                        if (typeof results[0] !== 'undefined')
                            for (var i = 0; i < results.length; i++) {
                                if (inArray(results[i].competition.type, player.etf2lformat) && inArray(results[i].division.name, Object.keys(player.etf2l_to_div))) {
                                    var lable = results[i].competition.type;
                                    var div = (inArray(results[i].competition.category, player.etf2lfun)) ? 7 : parseInt(player.etf2l_to_div[results[i].division.name]);
                                    if (player.data.etf2l[lable] === undefined) player.data.etf2l[lable] = {}; //no team, played divs
                                    if (player.data.etf2l[lable].div_max === null || div < player.data.etf2l[lable].div_max) player.data.etf2l[lable].div_max = div;
                                    //log(player.data.etf2l[lable].div_max, "NEW fucken! max tier "+results[i].division.name);
                                } else if (inArray(results[i].competition.type, player.etf2lformat) && results[i].division.tier !== null) {
                                    var lable = results[i].competition.type;
                                    var div = (inArray(results[i].competition.category, player.etf2lfun)) ? 7 : parseInt(results[i].division.tier);
                                    if (player.data.etf2l[lable] === undefined) player.data.etf2l[lable] = {}; //no team, played divs
                                    if (player.data.etf2l[lable].div_max === null || div < player.data.etf2l[lable].div_max) player.data.etf2l[lable].div_max = div;
                                }
                            }
                    }
                } else if (resp.status == "404") {
                    log("ETF2L player not found " + player.id64);
                } else {
                    log("ETF2L " + resp.statusText);
                }
            },
            ontimeout: function(resp) {
                log("ETF2L Timeout " + TF.getCFG("xhr_timeout"));
                player._update_ugc_player(callback); //next update
            },
            timeout: TF.getCFG("xhr_timeout"),
        });
    };

    TFPlayer.prototype._update_ugc_player = function(callback) {
        var player = this;
        if (!TF.getCFG("ugc_update")) {
            player._update_steam_player(callback);
            return;
        } //next update
        log('update_ugc_player ' + player.id64);
        GM_xmlhttpRequest({
            method: "GET",
            url: "http://www.ugcleague.com/players_page_details.cfm?player_id=" + player.id64,
            onload: function(resp) {
                player._update_steam_player(callback); //next update
                if (resp.status == "200") {
                    var html = $.parseHTML(resp.responseText);
                    var table = $(html).find('table');
                    for (var i=0; i < table.length; i++) {
                        var data = player.html2json(table[i]);
                        var ugc = {};
                        if (!isEmpty(data)) {
                            for (var j = 0; j < data.length; j++) {
                                if (data[j].drop === "" && data[j].status === '<img src="images/greendot.gif">') ugc[data[j].format] = data[j];
                            }
                            player.data.ugc = $.extend(player.data.ugc, ugc);
                            break;
                        } else {
                            log("UGC player not found " + player.id64);
                        }
                    }
                } else {
                    log("UGC " + resp.statusText);
                }
            },
            ontimeout: function(resp) {
                log("UGC Timeout " + TF.getCFG("xhr_timeout"));
                player._update_steam_player(callback); //next update
            },
            timeout: TF.getCFG("xhr_timeout"),
        });
    };

    TFPlayer.prototype.html2json = function(html) {
        var rows = [];
        var x = $(html).children();
        for (var i=0; i < x.length; i+=2) {
            var $head = $(x[i]);
            var $row = $(x[i+1]);
            var team, format, history, divs, div, drop, name, join, region, status;
            var row1, row2;
            for (var r = 0; r < this.ugc_table; r++) {
                $row.find('tr:eq(' + r + ')').find('td:eq(0)').find('br').replaceWith(" - ");
                team = $head.find('tr:eq(' + r + ')').find('th:eq(0)').text().replace(/[\t\r\n]+/g, ' ').replace(/[\s]+/g, ' ').trim();
                if (inArray(team, this.ugcformat)) {
                    format = team.replace("TF2 ", "");
                    continue;
                }
                status = undefined;
                status = $row.find('tr:eq(' + r + ')').find('td:eq(1)').find('img')[0];
                if (status) status = status.outerHTML;
                team = $row.find('tr:eq(' + r + ')').find('td:eq(0)').text().replace(/[\t\r\n]+/g, ' ').replace(/[\s]+/g, ' ').trim();
                name = $row.find('tr:eq(' + r + ')').find('td:eq(1)').text().replace(/[\t\r\n]+/g, ' ').replace(/[\s]+/g, ' ').trim();
                join = $row.find('tr:eq(' + r + ')').find('td:eq(2)').text().replace(/[\t\r\n]+/g, ' ').trim();
                drop = $row.find('tr:eq(' + r + ')').find('td:eq(3)').text().replace(/[\t\r\n]+/g, ' ').trim();
                if (inArray(team, this.ugcformat)) {
                    format = team.replace("TF2 ", "");
                    continue;
                }
                if (team == "Team" || format === undefined) continue;
                history = $row.find('tr:eq(' + r + ')').find('td:eq(4)').text().replace(/[\t\r\n]+/g, '');
                region = history.match(/(NA|Euro|AUS\/NZ)/);
                divs = history.match(/(Platinum|Gold|Silver|Steel|Iron)+/g);
                if (divs !== null && divs.length > 0) {
                    if (divs[0] == "Platinum") {
                        if (region == "NA") div = 0;
                        else div = 1;
                    } else if (divs[0] == "Gold" && divs[1] == "Gold") div = 2;
                    else if (divs[0] == "Gold") div = 3;
                    else if (divs[0] == "Silver" && divs[1] == "Silver") div = 4;
                    else if (divs[0] == "Silver") div = 5;
                    else if (divs[0] == "Steel") div = 6;
                    else div = 7;
                }
                row2 = row1;
                if (row2 !== undefined && format == row2.format && join == row2.join || divs === null || region === null) continue;
                row1 = {
                    format: format,
                    team: team,
                    name: name,
                    join: join,
                    drop: drop,
                    divs: divs,
                    div: div,
                    region: region[0],
                    status: status,
                };
                rows.push(row1);
            }
        }
        return rows;
    };

    TFPlayer.prototype._update_steam_player = function(callback) {
        var player = this;
        if (TF.getCFG("steam_update", "none")) {
            if (callback) callback(player);
            return;
        } //last update
        log('update_steam_player ' + player.id64);
        GM_xmlhttpRequest({
            method: "GET",
            url: "http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=" + TF.steam_key + "&steamids=" + player.id64,
            headers: {
                Accept: "application/json"
            },
            onload: function(resp) {
                if (resp.status == "200") {
                    player._update_steam_bans(callback); //next update
                    var data = JSON.parse(resp.responseText);
                    if (data !== null) {
                        var steam = {
                            name: data.response.players[0].personaname,
                            avatar: data.response.players[0].avatar,
                            avatarfull: data.response.players[0].avatarfull,
                            timecreated: data.response.players[0].timecreated,
                            country: data.response.players[0].loccountrycode,
                        };

                        if (data.response.players[0].communityvisibilitystate == 3) steam.status = "public";
                        else steam.status = "private";
                        player.data.steam = $.extend(player.data.steam, steam);
                    }
                } else {
                    log("Steam " + resp.statusText);
                    if (callback) callback(player); //TODO error handling
                }
            },
            ontimeout: function(resp) {
                log("Steam Timeout " + TF.getCFG("xhr_timeout"));
                if (callback) callback(player); //TODO error handling
            },
            timeout: TF.getCFG("xhr_timeout"),
        });
    };

    TFPlayer.prototype._update_steam_bans = function(callback) {
        var player = this;
        if (!TF.getCFG("steam_update", "bans")) {
            if (callback) callback(player);
            return;
        } //last update
        log('update_steam_bans ' + player.id64);
        GM_xmlhttpRequest({
            method: "GET",
            url: "http://api.steampowered.com/ISteamUser/GetPlayerBans/v1/?key=" + TF.steam_key + "&steamids=" + player.id64,
            headers: {
                Accept: "application/json"
            },
            onload: function(resp) {
                if (resp.status == "200") {
                    if (player.data.steam.status == "public") player._update_steam_stats(callback); //next update
                    else callback(player); //last update
                    var data = JSON.parse(resp.responseText);
                    if (data !== null) {
                        var bans = {
                            community: data.players[0].CommunityBanned,
                            lastbandays: data.players[0].DaysSinceLastBan,
                            economy: data.players[0].EconomyBan,
                            vacbans: data.players[0].NumberOfVACBans,
                            vac: data.players[0].VACBanned,
                        };
                        player.data.steam.bans = $.extend(player.data.steam.bans, bans);
                    }
                } else {
                    log("Steam " + resp.statusText);
                    if (callback) callback(player); //TODO error handling
                }
            },
            ontimeout: function(resp) {
                log("Steam Timeout " + TF.getCFG("xhr_timeout"));
                if (callback) callback(player); //TODO error handling
            },
            timeout: TF.getCFG("xhr_timeout"),
        });
    };

    TFPlayer.prototype._update_steam_stats = function(callback) {
        var player = this;
        if (!TF.getCFG("steam_update", "stats")) {
            if (callback) callback(player);
            return;
        } //last update
        log('update_steam_stats ' + player.id64);
        GM_xmlhttpRequest({
            method: "GET",
            url: "http://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v0002/?appid=440&key=" + TF.steam_key + "&steamid=" + player.id64,
            headers: {
                Accept: "application/json"
            },
            onload: function(resp) {
                if (resp.status == "200") {
                    if (callback) callback(player);
                    var data = JSON.parse(resp.responseText);
                    if (data !== null) {
                        var stats = {};
                        var name;
                        var len = data.playerstats.stats.length;
                        for (var i = 0; i < len; i++) {
                            name = data.playerstats.stats[i].name;
                            if (name.indexOf(".accum.iPlayTime") > 0 && name.indexOf(".mvm.") == -1) {
                                name = name.replace(".accum.iPlayTime", "");
                                stats[name] = parseInt(data.playerstats.stats[i].value);
                            }
                        }
                        player.data.steam.tf2stats = $.extend(player.data.steam.tf2stats, stats);
                    }
                } else {
                    log("Steam " + resp.statusText);
                    if (callback) callback(player); //TODO error handling
                }
            },
            ontimeout: function(resp) {
                log("Steam Timeout " + TF.getCFG("xhr_timeout"));
                if (callback) callback(player); //TODO error handling
            },
            timeout: TF.getCFG("xhr_timeout"),
        });
    };

    TFPlayer.prototype._update_steam_fullstats = function(callback) {
        var player = this;
        if (!TF.getCFG("steam_update", "stats")) {
            if (callback) callback(player);
            return;
        } //last update
        log('update_steam_stats ' + player.id64);
        GM_xmlhttpRequest({
            method: "GET",
            url: "http://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v0002/?appid=440&key=" + TF.steam_key + "&steamid=" + player.id64,
            headers: {
                Accept: "application/json"
            },
            onload: function(resp) {
                if (resp.status == "200") {
                    if (callback) callback(player);
                    var data = JSON.parse(resp.responseText);
                    if (data !== null) {
                        var stats = {};
                        var len = data.playerstats.stats.length;
                        for (var i = 0; i < len; i++) {
                            var names = data.playerstats.stats[i].name.split(".");
                            if (names.length == 1) {
                                stats[names[0]] = parseInt(data.playerstats.stats[i].value);
                            }
                            if (names.length == 2) {
                                if (stats[names[0]] === undefined) stats[names[0]] = {};
                                stats[names[0]][names[1]] = parseInt(data.playerstats.stats[i].value);
                            }
                            if (names.length == 3) {
                                if (stats[names[0]] === undefined) stats[names[0]] = {};
                                if (stats[names[0]][names[1]] === undefined) stats[names[0]][names[1]] = {};
                                stats[names[0]][names[1]][names[2]] = parseInt(data.playerstats.stats[i].value);
                            }
                            if (names.length == 4) {
                                if (stats[names[0]] === undefined) stats[names[0]] = {};
                                if (stats[names[0]][names[1]] === undefined) stats[names[0]][names[1]] = {};
                                if (stats[names[0]][names[1]][names[2]] === undefined) stats[names[0]][names[1]][names[2]] = {};
                                stats[names[0]][names[1]][names[2]][names[3]] = parseInt(data.playerstats.stats[i].value);
                            }
                        }
                        player.data.steam.tf2stats = $.extend(player.data.steam.tf2stats, stats);
                    }
                } else {
                    log("Steam " + resp.statusText);
                    if (callback) callback(player); //TODO error handling
                }
            },
            ontimeout: function(resp) {
                log("Steam Timeout " + TF.getCFG("xhr_timeout"));
                if (callback) callback(player); //TODO error handling
            },
            timeout: TF.getCFG("xhr_timeout"),
        });
    };
    //TFPlayer{} TF.getPlayer(id)

    //TF Private
    var players = {};
    var updating = false;
    var onUpdate = function() {};
    var update_players = [];
    var dialog_name = "tf2stars-config";
    var config = "tf2stars-cfg";
    var important = false;
    var new_opt = [];
    var lobby_map = "";
    var lobby_map_alt = "";
    var lobby_format = "";
    var all_lobbys = {};
    var lastlobby;
    var my_lobby = false;
    var all_ingame = false;
    var motd = {};
    var motd_updating = false;
    var cash_update = false;

    var cfg = {
        refresh: 2000,
        xhr_timeout: 5000,
        etf2l_update: "div class",
        ugc_update: false,
        steam_update: "none",
        tf2c_show: true,
        logstf_show: true,
        steam_show: true,
        class_bonus: 10,
        map_bonus: 0,
        format_penalty: -10,
        baseline_div: 8,
        increment_div: 5,
        class_hours: 150,
        map_hours: 30,
        class_stack: 1,
        map_stack: 1,
        color_warning: "AF534F",
        sound_mylobby: false, //Heavy sound only in lobbys I play
        sound_heavy: false,
        sound_heavy_vol: 0.25,
        sound_announcer: false,
        sound_announcer_vol: 0.25,
        sound_allingame: false,
        sound_allingame_vol: 0.25,
        sound_toggle: false,
        sound_toggle_vol: 0.25,
        sound_warning: false,
        sound_warning_vol: 0.25,
        sound_error: false,
        sound_error_vol: 0.25,
        msg_show: 5000,
        msg_newlobby: true,
        msg_slot: false,
        msg_class: ["scout"],
        cache_days: 14,
    };

    var truemonkey = [27, 28, 29, 30, 31, 32, 33];

    var dialog_opt = [
        ["html", "<div class='h3 center' style='padding-bottom: 20px;'>TF2 S.T.A.R.S.</div>"],
        ["tabs", ["", "300px"]],
        ["tab", "tab1", "Update"],
        ["int", "refresh", null, "Refresh (2000 ms)", [100, 100, 5000]],
        ["int", "xhr_timeout", null, "Timeout (5000 ms)", [100, 100, 10000]],
        ["select", "etf2l_update", null, "Update ETF2L", [
            ["none", "None"],
            ["div", "Div"],
            ["div class", "Class and Div"],
            ["div class name", "Name, Class and Div"]
        ]],
        ["checkbox", "ugc_update", null, "Update UGC"],
        ["select", "steam_update", null, "Update Steam", [
            ["none", "None"],
            ["bans", "Bans"],
            ["bans stats", "Hours"]
        ]],
        ["html+", "<span>Display in</span>"],
        ["checkbox+", "steam_show", null, "Steam"],
        ["checkbox+", "tf2c_show", null, "TF2Center"],
        ["checkbox", "logstf_show", null, "Logs.tf"],
        ["text", "color_warning", null, "Warnings & Bans color #( AF534F )", [6, "60px", /^[0-9a-f]{3,6}$/i]],
        ["int", "cache_days", null, "Cache players days (7)", [1, 0, 999]],
        ["checkbox", "cache_wipe", null, "Clear storage (including sounds)"],
        ["tab", "tab2", "Options"],
        ["int+", "class_bonus", null, "Bonus class (10)", [5, 0, 10]],
        ["int", "map_bonus", null, "Bonus map (0)", [5, 0, 10]],
        ["int", "format_penalty", null, "Format penalty (-10) * <small>-50 to ignore format completely</small>", [5, -50, 0]],
        ["int+", "baseline_div", null, "Div base (8)", [1, 0, 9]],
        ["float", "increment_div", null, "Div increment (5)", [0.05, 5, 8]],
        ["int+", "class_hours", null, "Hours class bonus (150)", [30, 30, 1800]],
        ["int", "class_stack", null, "Max stack (1)", [1, 1, 10]],
        ["int+", "map_hours", null, "Hours map bonus (30)", [10, 10, 1000]],
        ["int", "map_stack", null, "Max stack (1)", [1, 1, 10]],
        ["select#", "msg_class", null, "Filter Lobby slots (ctrl+m1)", [
                ["scout", "Scout"],
                ["soldier", "Soldier (HL)"],
                ["roamer", "Roamer (6s)"],
                ["pocket", "Pocket (6s)"],
                ["pyro", "Pyro"],
                ["demoman", "Demoman"],
                ["heavy", "Heavy"],
                ["engineer", "Engineer"],
                ["medic", "Medic"],
                ["sniper", "Sniper"],
                ["spy", "Spy"]
            ],
            ["100px", "100px"]
        ],
        ["tab", "tab3", "Lobby"],
        ["checkbox+", "sound_heavy", null, "Ready?"],
        ["checkbox+", "sound_mylobby", null, "only my lobby"],
        ["float+", "sound_heavy_vol", null, "Volume", [0.05, 0, 1]],
        ["file", "sound_heavy_file", "audio/*"],
        ["checkbox+", "sound_announcer", null, "Game begin"],
        ["float+", "sound_announcer_vol", null, "Volume", [0.05, 0, 1]],
        ["file", "sound_announcer_file", "audio/*"],
        ["checkbox+", "sound_allingame", null, "☆ All In-Game ☆"],
        ["float+", "sound_allingame_vol", null, "Volume", [0.05, 0, 1]],
        ["file", "sound_allingame_file", "audio/*"],
        ["checkbox+", "sound_toggle", null, "☆ Join/Leave/Sub ☆"],
        ["float+", "sound_toggle_vol", null, "Volume", [0.05, 0, 1]],
        ["file", "sound_toggle_file", "audio/*"],
        ["checkbox+", "sound_warning", null, "☆ Lobby Problems ☆"],
        ["float+", "sound_warning_vol", null, "Volume", [0.05, 0, 1]],
        ["file", "sound_warning_file", "audio/*"],
        ["checkbox+", "sound_error", null, "☆ Lobby Closed ☆"],
        ["float+", "sound_error_vol", null, "Volume", [0.05, 0, 1]],
        ["file", "sound_error_file", "audio/*"],
        ["float", "msg_show", null, "Popup messages TTL (5000 ms)", [1000, 1000, 60000]],
        ["checkbox", "msg_newlobby", null, "☆ New Lobby ☆"],
        ["checkbox", "msg_slot", null, "☆ Show open slots (see Options) ☆"],
        ["tab", "tab4", "About"],
        ["readonly", ["", "230px"],
            ["<i>Rating = (Div base - Current Div) * Div increment + ( Class bonus * Stack ) + ( Map bonus * Stack) + Format penalty</i><br><br>10 rating give 1 star. ",
             "Current Div is Iron/Open&nbsp;HL=7 all the way to NA&nbsp;Plat/Prem=0. To get hours you need to update Steam. Steam and UGC are slow updates compared to ETF2L. Stack = Hours played / Hours in options (round down)<br><br>",
             "<b>Current version 2.0</b><br><ul><li>4 completely new sound events in Lobbys.</li><li>\"New Lobby\" notifications. You should keep the main lobby page open in some tab. If you also want quick access to slots, don't forget to set your ",
             "prefered class filter.</li><li>Steam profile integration. Links to ETF2L, UGC and Logs.tf in Team Fortress 2 recently played.</li><li>Steam2GoogleCal included now (don't forget to delete the other script!).</li>",
             "<li>Caching in Firefox doen't work cross-domain. So you have like two separate caches for TF2Center and Logs.tf.</li></ul><br>",
             "<b>Release notes:</b><br>v1.9 You can now overwrite that annoying WHO IS NOT READY??! sound and change volume (not working in Firefox). Player data is cashed to Local storage.<br>",
             "v1.8 Steam data (bans, hours on class, hours played map). You can now rate based on hours only (e.g. Stack = 5 Bonus = 5 for both will give 5 stars at max). ",
             "However Stacks and Divs are considered together, so don't update ETF2L or UGC for this to work. NA&nbsp;Plat=0 all other Plat=1. ",
             "<a href='http://forums.tf2center.com/topic/3631-refresh-bug/' target='_blank'>HTTPS</a> support<br>",
             "v1.7 User friendly configuration dialogue<br>",
             "v1.6 UGC support (only current teams)"
            ].join("")],
        ["html", "<div class='h3 center'><a href='http://steamcommunity.com/groups/stars-tf2/discussions/0/612823460275903203/' target='_blank'>Donate to the project and get personal TAGs</a></div>"],
        ["tabs"],
        ["html", "<div class='center'>Please join <a href='http://steamcommunity.com/groups/stars-tf2' target='_blank'>Steam group</a> to support and find latest news</div>"],
    ];

    var dialog_script = [
        "(function() { ",
        "	$('#tf2stars-config').hide();",
        "	$('#tf2stars-config-show').click(function () { ",
        "		TF_resetDialog(); ",
        " 		if ( $('#tf2stars-config-show').hasClass('important') ) $('#tf2stars-config-exit').addClass('disable'); ",
        "		$('#tf2stars-config').fadeIn(400); ",
        "		$('#tf2stars-config-show').removeClass('important'); ",
        "		$($('.tabs .tabs-links li').get(0)).addClass('active'); ",
        "		$($('.tabs .tabs-content .tab').get(0)).addClass('active'); ",
        "	}); ",
        "	$(document).on('click', '#tf2stars-config-save', function () { ",
        "		var id = TF_returnDialog(); ",
        "		if ( id !== 0 ) { ",
        "			$('#' + id).parent().addClass('inputerror'); ",
        "			var tab = $('#' + id).closest('.tab'); ",
        "			tab.show().siblings().hide(); ",
        "			$('#' + tab.attr('id') + '-li').addClass('active').siblings().removeClass('active'); ",
        "			setTimeout(function() { $('#' + id).parent().delay(1000).removeClass('inputerror'); }, 200); ",
        "		} ",
        "		else $('#tf2stars-config').fadeOut(400); ",
        "	}); ",
        "	$(document).on('click', '#tf2stars-config-exit', function () { ",
        "		$('#tf2stars-config').fadeOut(400); ",
        "	}); ",
        "   $(document).on('click', '.tabs .tabs-links a', function(e)  { ",
        " 		var currentAttrValue = $(this).attr('href'); ",
        "       // Show/Hide Tabs ",
        "       $('.tabs ' + currentAttrValue).show().siblings().hide(); ",
        "       // Change/remove current tab to active ",
        "       $(this).parent('li').addClass('active').siblings().removeClass('active'); ",
        "		e.preventDefault(); ",
        "	}); ",
        "})(); ",
    ].join('\n');

    var tf2stars_css = [
        ".playerSlot .details { ",
        "	width: 195px; ",
        "} ",
        ".icons.stats.small { ",
        "   margin-right: 0px; ",
        "   margin-left: 0px; ",
        "} ",
        ".lobbySlot .gameStatusContainer { ",
        "	width: 65px; ",
        "} ",
        ".statsContainer span { ",
        "	margin-left: 0px; ",
        "	margin-right: 0px; ",
        "} ",
        ".rating-static { ",
        "  width: 60px; ",
        "  height: 16px; ",
        "  display: block; ",
        "  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAAgCAYAAADZubxIAAACMUlEQVR42u2ZP27CMBTGcwRGkgzlCByBI3CDsleq3Ut0RupaKWNHcgPYEAQpQ7cOLVKBjkyZqT8wFX8cYndoeS/+pMjC+YjEh/2eo18QeNVPKxmP6uSHsiwb1cK/lGH36yHeYKyDH5pMJt3ZbLbByN6/EHEfAWG0eTh1PzSdTvsICCN7/0pEcwSE0aocEvfrgOY6oDk7/1LGawRSdcG3kHGPsh+/9/Xl8Vn1qzUCqbpUYIXub4WNH89VZdL6+X/hD1RI7aWM8svhRDl82xJI3K9XfFtdecWfm8PHwR98yEZDhZCUhJPg/uGup+6HhsNhQwWQlIST4D4nvwqp2TIFhHlT3afuh8bjccsUEObZ+VcilKaAMG8+zND261InS3aAZOdfiCjVJW2AVY9x97oRpebXEdp+HVCqDyMDrHqMOqCUlR89arva70NxtCvU512ZO+95lP37HqbDECehCcybeh5Z/6dsdg5PmUc7Q82f9rFr8//mO2q1d35Omec7o33ax6j7vby8vLy8vK5A1PmuOmT0XH8zdR5sLS482JalQtR5sJO48GBblqp3PGke7FaemfBgW5aqAyXNgytKGk2++/Z0W2z9IipM98tYqu5va6p81/l8wZUHl7LRgAHfdRVHHnyRjQYM+K77n8yLB1exVIg6D3Y8XPHiwVUsVZdG0jzY8fWIDw9+vwtvqliqDpQ0D3bqwRx5cBlL3fc8yjzYSdR58CV/GRv1fNfLy8vL65/1DSCqQczfmKqoAAAAAElFTkSuQmCC'); ",
        "} ",
        ".rating-50 { background-position: 0 0; } ",
        ".rating-40 { background-position: -12px 0; }  ",
        ".rating-30 { background-position: -24px 0; } ",
        ".rating-20 { background-position: -36px 0; } ",
        ".rating-10 { background-position: -48px 0; } ",
        ".rating-0 { background-position: -60px 0; }  ",
        ".rating-5  { background-position: -48px -16px; } ",
        ".rating-15 { background-position: -36px -16px; } ",
        ".rating-25 { background-position: -24px -16px; } ",
        ".rating-35 { background-position: -12px -16px; } ",
        ".rating-45 { background-position: 0 -16px; } ",
        "a.rating {outline:none; } ",
        "a.rating strong {line-height:30px;} ",
        "a.rating:hover {text-decoration:none;}  ",
        "a.rating span.tooltip { ",
        "	z-index:10; ",
        "	display: none; ",
        "	padding: 14px 20px; ",
        "	margin-top: -30px; ",
        "	margin-left: 28px; ",
        "	width: 180px; ",
        "	opacity: 1; ",
        "} ",
        "a.rating:hover span.tooltip{ ",
        "   display:inline; ",
        "   position:absolute; ",
        "   text-align: left; ",
        "   color:#111; ",
        "   border:1px solid #DCA; ",
        "   background:#fffAF0; ",
        "} ",
        "p.motd { ",
        "	color: #7badba; ",
        "} ",
    ].join('\n');

    var tf2conf_css = [
        ".h3 { ",
        "    font-weight: bold; ",
        "    font-size:20px; ",
        "} ",
        ".center { ",
        "text-align: center; ",
        "} ",
        "#tf2stars-config-show { ",
        "   position: fixed;  ",
        "   bottom: 20px;  ",
        "   left: 20px;  ",
        "   z-index: 99998; ",
        "} ",
        "#tf2stars-config-show img {  ",
        "   height: 24px;  ",
        "   width: 24px;  ",
        "   opacity: 0.2; ",
        "} ",
        "#tf2stars-config-show img:hover {  ",
        "   opacity: 1; ",
        "} ",
        "#tf2stars-config_empty {  ",
        "	z-index: 99999; ",
        "	position:absolute; ",
        "	top: 0%; ",
        "	left: 0%; ",
        "	width:10000px; ",
        "	height:10000px; ",
        "	margin-left: -5000px; ",
        "	margin-top: -5000px; ",
        "	background-color:Black; ",
        "	opacity:0.6; ",
        "} ",
        "#tf2stars-config_form {  ",
        "	z-index: 100000; ",
        "	position:absolute; ",
        "	top: 300px; ",
        "	left: 400px; ",
        "	width: 400px; ",
        "	border: 1px solid #A9A9A9; ",
        "	background-color: #FFFFFF; ",
        "   color: #000000; ",
        "   padding: 10px; ",
        "   font-family: Arial, sans-serif; ",
        "   font-size: 12px; ",
        "} ",
        "#tf2stars-config_form label, ",
        "#tf2stars-config_form span { ",
        "	font-size: 12px; ",
        "	font-weight: normal; ",
        "	display: inline-block; ",
        "   margin-top: 0px; ",
        "   margin-bottom: 0px; ",
        "	margin-left: 5px; ",
        "	margin-right: 5px; ",
        "} ",
        "#tf2stars-config_form div.selector {  ",
        "	padding: 5px; ",
        "   margin: 0px; ",
        "} ",
        "#tf2stars-config_form div.newoption {  ",
        "	background: #D8F482; ",
        "} ",
        "#tf2stars-config_form div.inputerror {  ",
        "	background: #DA55BA; ",
        "} ",
        "#tf2stars-config_form input[type='number'], ",
        "#tf2stars-config_form select {  ",
        "	border: 1px solid #A9A9A9; ",
        "	background: inherit; ",
        "	font: inherit; ",
        "   color: #000000; ",
        "	width: 60px; ",
        "	padding: 0px; ",
        "	height: 17px; ",
        "	border-radius: 0px; ",
        "   margin: 0px; ",
        "} ",
        "#tf2stars-config_form input[type='checkbox'] {  ",
        "	border: 1px solid #A9A9A9; ",
        "	width: auto; ",
        "} ",
        "#tf2stars-config_form input[type='text'] {  ",
        "	border: 1px solid #A9A9A9; ",
        "	width: auto; ",
        "	background: inherit; ",
        "	font: inherit; ",
        "   color: #000000; ",
        "	padding: 0px; ",
        "	height: 17px; ",
        "	border-radius: 0px; ",
        "   margin: 0px; ",
        "} ",
        "#tf2stars-config_form .textarea {  ",
        "	overflow-y: scroll; ",
        "	border: 1px solid #A9A9A9; ",
        "} ",
        "#tf2stars-config_form a:link { ",
        "	color: #BADA55; ",
        "} ",
        "#tf2stars-config_form a:visited { ",
        "	color: #BADA55; ",
        "} ",
        "#tf2stars-config-save { ",
        "	float: left; ",
        "	font: 14px Helvetica, Arial, sans-serif; ",
        "	font-weight: bold; ",
        "	color: #FFFFFF; ",
        "	background-color: #BADA55; ",
        "	text-transform: uppercase; ",
        "	text-align: center; ",
        "	text-decoration: none; ",
        "	cursor: pointer; ",
        "	border: none; ",
        "	min-width: 90px; ",
        "	min-height: 30px; ",
        "	padding: 5px; ",
        "} ",
        "#tf2stars-config-exit { ",
        "	float: right; ",
        "	font: 12px Helvetica, Arial, sans-serif; ",
        "	font-weight: bold; ",
        "	background-color: #D3D3D3; ",
        "	color: #FFFFFF; ",
        "	text-transform: uppercase; ",
        "	text-align: center; ",
        "	text-decoration: none; ",
        "	cursor: pointer; ",
        "	border: none; ",
        "	min-width: 90px; ",
        "	min-height: 30px; ",
        "	padding: 5px; ",
        "} ",
        "div.upload { ",
        "	display:inline-block; ",
        "	float: right; ",
        "	width: 58px; ",
        "	height: 20px; ",
        "	background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADoAAAAUCAYAAADcHS5uAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAALiSURBVFhH7ZdLTFNBFIb/2we2pTS0lNIS5FWJBhBDFMNDAypufC0wuHLjxk3Vha504YKtkWiUhcaFJorEKCFRY6KJmrAlJhIQ4gOQEKy0tIDaB23v9cx0GvARLwksEPrdRWfmnHtm/jnnNLnS8/etCtYBGvG75kkLXWukhaZo3tSFusLLYpakvugK9rnvidm/0WlM2F/2ANX5F8TKysFisthsDzXSGf0fUJSEGKmzbKEShWDlU5l3GpXOM2gqvY2G4mtwmhuEx5/YTdWoLbyEve671BbtsGduFxag1NaKXcUdvDXqi64iz1wnLKBxLV/b475DZXseGkknLOqsWEZdlt1IyFGMzzzhPVPh9MCocwjrAgZdLqpc58jHiNFAN7SaDdjmPMvXGfOJWUzOvcK7qZskRIuKPA+/TBaLXWSGNov2eIZwzAebaSt/ZymoClUgQ5J+dWMbK/Qs5nt0HENTNzASeIjPwcf8trONW4R1AauxgsRlYIx8RoPddOin0Gj0yDFVUVwtTHoX8i1NKHechFHv4L56Emc1lfOYI4FH+DTdhWHfLfh+9Imo6qgKjcT8dNt2aCUDn7NsGXQ5iCaCfJ5CWlRGEj389y+lxbLESPmwEUOmfnNZGlFkPYhAaAC9Yx4S8obbkj5Jv8V9KStxMVJHVejk3GteXjUb27A59wR2FLTxDEzOvhQeSTIz8qnMTsFtO0aHPcwPHqQD/850qB+yHCOfQyixtqAw+wCV/DyC4QG6BD33YZfpMNdQ9sv5nDETHuIxS21H+Xtl9uPks1NY1VEVOhbswUf/fZ7RAkszF/3B30ll1yM8ksxFRqnEzFxAXA5h0Hsd4fiUsC4Qifvw1tvOxZXYWsg3jP4v7bTuh/dbLwkeQi79ObmyGmnfTvEWEIp5Mfi1A3ElgmLrESpxJyZmXwirOsv+emH92lzWRQccRt/ERbG6+lDN6FJJddxqZcWErnbSH95rjXUiFPgJ6BDbZD0ruk4AAAAASUVORK5CYII='); ",
        "	overflow: hidden; ",
        "	padding: 0px!important; ",
        "	margin: 0px!important; ",
        "	vertical-align: middle!important; ",
        "} ",
        "div.upload input { ",
        "	display: block!important; ",
        "	opacity: 0!important; ",
        "	overflow: hidden!important; ",
        "} ",
        ".important { ",
        "	-webkit-animation: amin_move 2s infinite; ",
        "	animation: amin_move 2s infinite; ",
        "}  ",
        ".important img {    ",
        "	opacity: 1!important;  ",
        "	-webkit-animation: amin_puls 2s infinite;  ",
        "	animation: amin_puls 2s infinite;  ",
        "}  ",
        ".imworking img { ",
        "	opacity: 1!important; ",
        "	-webkit-animation: spin 1s linear infinite; ",
        "	-moz-animation: spin 1s linear infinite; ",
        "	animation: spin 1s linear infinite; ",
        "} ",
        ".disable { ",
        "	display: none; ",
        "} ",
        "@-webkit-keyframes spin { 100% { -webkit-transform: rotate(360deg); } } ",
        "@-moz-keyframes spin { 100% { -moz-transform: rotate(360deg); } } ",
        "@keyframes spin { 100% { -webkit-transform: rotate(360deg); transform:rotate(360deg); } } ",
        "@-webkit-keyframes amin_puls {  ",
        "	0%	 { height: 24px; width: 24px; }  ",
        "	50%	 { height: 48px; width: 48px; }  ",
        "	100% { height: 24px; width: 24px; }  ",
        "}  ",
        "@keyframes amin_puls {  ",
        "	0%	 { height: 24px; width: 24px; }  ",
        "	50%	 { height: 48px; width: 48px; }  ",
        "	100% { height: 24px; width: 24px; }  ",
        "}  ",
        "@-webkit-keyframes amin_move {  ",
        "	0%	 { bottom: 20px; left: 20px; }  ",
        "	50%	 { bottom: 8px; left: 8px; }  ",
        "	100% { bottom: 20px; left: 20px; }  ",
        "}  ",
        "@keyframes amin_move {  ",
        "	0%	 { bottom: 20px; left: 20px; }  ",
        "	50%	 { bottom: 8px; left: 8px; }  ",
        "	100% { bottom: 20px; left: 20px; }  ",
        "}  ",
        ".tabs { ",
        "    width:100%; ",
        "    display:inline-block; ",
        "} ",
        ".tabs-links:after { ",
        "	display:block; ",
        "	clear:both; ",
        "	content:''; ",
        "} ",
        ".tabs-links li { ",
        "	margin:0px 5px; ",
        "	float:left; ",
        "	list-style:none; ",
        "} ",
        ".tabs-links a { ",
        "	padding:9px 15px; ",
        "	display:inline-block; ",
        "	border-radius:0px 0px 0px 0px; ",
        "	background:#E8E8E8; ",
        "	font-size:14px; ",
        "	font-weight:600; ",
        "	color:#000000!important; ",
        "	transition:all linear 0.15s; ",
        "} ",
        ".tabs-links a:hover { ",
        "	background:#a7cce5; ",
        "	text-decoration:none; ",
        "} ",
        ".tabs li.active a, .tabs li.active a:hover { ",
        "	background:#D3D3D3; ",
        "	color:#FFFFFF!important; ",
        "} ",
        ".tabs-content { ",
        "	padding:15px; ",
        "	border-radius:0px; ",
        "	border: 1px solid #A9A9A9; ",
        "} ",
        ".tab { ",
        "	display:none; ",
        "} ",
        ".tab.active { ",
        "	display:block; ",
        "} ",
        ".myclassicon { ",
        "	float: left; ",
        "	display: block; ",
        "	position: relative; ",
        "	width: 35px; ",
        "	height: 28px; ",
        "} ",
        ".myclasses { ",
        "	position: relative!important; ",
        "	float: left; ",
        "	top: 0px!important; ",
        "	left: 0px!important; ",
        "} ",
        ".myslotblue { ",
        "	position: absolute; ",
        "	height: 10px; ",
        "	width: 6px; ",
        "	left: 25px; ",
        "	top: 0px; ",
        "	background: #48707D; ",
        "} ",
        ".myslotred { ",
        "	position: absolute; ",
        "	height: 10px; ",
        "	width: 6px; ",
        "	left: 25px; ",
        "	top: 13px; ",
        "	background: #9E403D; ",
        "} ",
        ".mylobbylink { ",
        "	line-height: 2; ",
        "	color: #FFFFFF; ",
        "} ",
    ].join('\n');

    var TFcls = [
        "Scout",
        "Soldier",
        "Pyro",
        "Demoman",
        "Heavy",
        "Engineer",
        "Medic",
        "Sniper",
        "Spy",
    ];

    var HLcls = [
        "Scout",
        "Soldier",
        "Pyro",
        "Demoman",
        "Heavy",
        "Engineer",
        "Medic",
        "Sniper",
        "Spy",
        "Scout",
        "Soldier",
        "Pyro",
        "Demoman",
        "Heavy",
        "Engineer",
        "Medic",
        "Sniper",
        "Spy",
    ];

    var SIXcls = [
        "Scout",
        "Scout",
        "Soldier",
        "Soldier",
        "Demoman",
        "Medic",
        "Scout",
        "Scout",
        "Soldier",
        "Soldier",
        "Demoman",
        "Medic",
    ];

    function create_player(id) {
        var player = new TFPlayer(id);
        players[id] = player;
        update_players.push(player);
        update_from_cache(update); //callback
        //update();
        return player;
    }

    function load_conf() {
        try {
            set_conf(JSON.parse(GM_getValue(config)));
        } catch (e) {
            log("bad config format");
            important = true;
        }
    }

    function save_conf() {
        GM_setValue(config, JSON.stringify(cfg));
    }

    function set_conf(config) {
        if (!isEmpty(config)) {
            var new_cfg = cfg;
            var key;
            var len = Object.keys(cfg).length;
            for (var i = 0; i < len; i++) {
                key = atIndex(cfg, i);
                if (key in config) new_cfg[key] = config[key];
                else {
                    new_cfg[key] = cfg[key];
                    log(key, "new option:");
                    new_opt.push(key);
                    important = true;
                }
            }
            cfg = new_cfg;
        }
        log(cfg, "set_conf");
    }

    function finished() {
        updating = false;
        if (isEmpty(update_players)) {
            log("TF finished");
            cash_update = true;
            setTimeout(save_to_cache, TF.getCFG("refresh") * 1.1);
        }
    }

    var callback_next = function(player) {
        onUpdate(player);
        finished();
        update();
    };

    function update() {
        if (!updating) {
            var player = update_players.shift(); //pop(0)
            if (player !== undefined) {
                if (!player.cached) {
                    updating = true;
                    cash_update = false;
                    log("TF updating");
                    if ($('#tf2stars-config-show').hasClass('important') !== true) $('#tf2stars-config-show').addClass('imworking');
                    player.update(callback_next);
                } else callback_next(player);
            }
        }
    }

    function update_from_cache(callback) { //callback = TF.update()
        //log("update_from_cache");
        var motd_cache = TFCache.getCache("cache_motd");
        if (!isEmpty(motd_cache))
            TF.updatePlayers(function(player, data) {
                var motd = data[player.id64];
                if (motd !== undefined) {
                    if (player.motd === "") {
                        if (typeof(motd) == "string") player.motd = data[player.id64];
                        else player.motd = randArray(data[player.id64]);
                    }
                }
            }, motd_cache);
        var data_cache = TFCache.getCache("cache_data");
        if (!isEmpty(data_cache))
            TF.updatePlayers(function(player, data) {
                if (!player.cached) {
                    var mydata = data[player.id64];
                    if (mydata !== undefined) {
                        log("found player in cache " + player.id64);
                        player.data = data[player.id64];
                        player.cached = true;
                    }
                }
            }, data_cache);
        if (isEmpty(motd_cache) && !motd_updating) {
            motd_updating = true;
            update_motd(callback);
        } else if (callback) callback();
    }

    function finished_motd() {
        log("finished_motd");
        motd_cached = true;
    }

    function save_to_cache() {
        if (cash_update) {
            var cache = {};
            var data;
            var id;
            for (var i = 0;
                ((id = atIndex(players, i)) !== null); i++) {
                if (!players[id].cached) {
                    data = {};
                    data[id] = players[id].data;
                    players[id].cached = true;
                    cache = $.extend(cache, data);
                } else log("player cached already " + id);
            }
            log(cache, "saving players cache");
            TFCache.setCache("cache_data", cache);
            cash_update = false;
            $('#tf2stars-config-show').removeClass('imworking');
        }
    }

    function update_motd(callback) {
        log("update_motd");
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://raw.githubusercontent.com/Kengur8/TF2-center-stars/master/motd.json",
            headers: {
                Accept: "application/json"
            },
            onload: function(resp) {
                finished_motd();
                if (resp.status == "200") {
                    var data = JSON.parse(resp.responseText);
                    if (!isEmpty(data.response)) {
                        TFCache.setCache("cache_motd", data.response);
                        TF.updatePlayers(function(player, data) {
                            var motd = data[player.id64];
                            if (motd !== undefined) {
                                if (typeof(motd) == "string") player.motd = data[player.id64];
                                else player.motd = randArray(data[player.id64]);
                            }
                        }, data.response);
                    }
                    if (callback) callback();
                } else if (resp.status == "404") {
                    //log("ETF2L player not found " + player.id64);
                    if (callback) callback();
                } else {
                    //log("ETF2L " + resp.statusText);
                    if (callback) callback();
                }
            },
            ontimeout: function(resp) {
                //log("ETF2L Timeout " + TF.getCFG("xhr_timeout"));
                if (callback) callback();
            },
            timeout: TF.getCFG("xhr_timeout"),
        });
    }

    function update_dialog(sel_opt) {
        load_conf();
        var len = sel_opt.length;
        for (var i = 0; i < len; i++) {
            var option = sel_opt[i][1];
            if (option in cfg) sel_opt[i][2] = cfg[option];
        }
    }

    function create_dialog() {
        var sel_opt = dialog_opt;
        update_dialog(sel_opt);
        var tabsdiv;
        var contdiv;
        var tmp;
        var links;
        var tab;
        var a;
        var topdiv = document.createElement("div");
        var len = sel_opt.length;
        var glue = false;
        var tabs = false;
        for (var i = 0; i < len; i++) {
            if (!TrueMonkey() && inArray(i, truemonkey)) continue;
            switch (sel_opt[i][0]) {
                case "tabs":
                    {
                        if (!tabs) {
                            tabsdiv = document.createElement("div");
                            tabsdiv.classList.add("tabs");
                            contdiv = document.createElement("div");
                            contdiv.classList.add("tabs-content");
                            contdiv.style.minWidth = sel_opt[i][1][0];
                            contdiv.style.minHeight = sel_opt[i][1][1];
                            links = document.createElement("ul");
                            links.classList.add("tabs-links");
                            //contdiv.appendChild(topdiv);
                            tabsdiv.appendChild(topdiv);
                            topdiv = document.createElement("div");
                            tabsdiv.appendChild(links);
                            tabsdiv.appendChild(contdiv);
                            tabs = true;
                        } else {
                            contdiv.appendChild(topdiv);
                            topdiv = document.createElement("div");
                            tabs = false;
                        }
                        break;
                    }
                case "tab":
                    {
                        //topdiv.classList.add("tab");
                        contdiv.appendChild(topdiv);
                        topdiv = document.createElement("div");
                        topdiv.id = sel_opt[i][1];
                        topdiv.classList.add("tab");
                        tab = document.createElement("li");
                        tab.id = sel_opt[i][1] + "-li";
                        a = document.createElement("a");
                        a.href = "#" + sel_opt[i][1];
                        a.innerHTML = sel_opt[i][2];
                        tab.appendChild(a);
                        links.appendChild(tab);
                        //topdiv = document.createElement("div");
                        break;
                    }
                default:
                    {
                        glue = create_dialog_element(topdiv, i, sel_opt[i], glue);
                        //topdiv = tmp[0];
                        //glue = tmp[1];
                        break;
                    }
            }
        }
        if (tabsdiv !== undefined) {
            //topdiv.classList.add("tab");
            if (!tabs) tabsdiv.appendChild(topdiv);
            create_dialog_save_cancel(tabsdiv);
            tabsdiv.id = dialog_name + "_form";
            return tabsdiv;
        }
        create_dialog_save_cancel(topdiv);
        topdiv.id = dialog_name + "_form";
        return topdiv;
    }

    function create_dialog_save_cancel(topdiv) {
        div = document.createElement("div");
        var button = document.createElement("button");
        button.id = dialog_name + "-" + "save";
        button.innerHTML = "Save";
        div.appendChild(button);
        button = document.createElement("button");
        button.id = dialog_name + "-" + "exit";
        button.innerHTML = "Cancel";
        div.appendChild(button);
        topdiv.appendChild(div);
        return topdiv;
    }

    function create_dialog_element(topdiv, item, selection, glue) {
        var div;
        var lable;
        var input;
        if (!TrueMonkey() && inArray(item, truemonkey)) return glue;
        if (glue) div = topdiv.lastChild;
        else {
            div = document.createElement("div");
            topdiv.appendChild(div);
        }
        div.classList.add("selector");
        switch (selection[0]) {
            case "float+":
                {}
            case "int+":
                {}
            case "float":
                {}
            case "int":
                {
                    lable = document.createElement("label");
                    lable.htmlFor = dialog_name + "-" + selection[1];
                    lable.innerHTML = selection[3];
                    input = document.createElement("input");
                    input.type = "number";
                    input.id = dialog_name + "-" + selection[1];
                    input.value = selection[2];
                    if (selection[4] !== undefined) {
                        input.step = selection[4][0];
                        input.min = selection[4][1];
                        input.max = selection[4][2];
                    }
                    if (inArray(selection[1], new_opt)) div.classList.add("newoption");
                    div.appendChild(input);
                    div.appendChild(lable);
                    //topdiv.appendChild(div);
                    break;
                }
            case "checkbox+":
                {}
            case "checkbox":
                {
                    lable = document.createElement("label");
                    lable.htmlFor = dialog_name + "-" + selection[1];
                    lable.innerHTML = selection[3];
                    input = document.createElement("input");
                    input.type = "checkbox";
                    input.id = dialog_name + "-" + selection[1];
                    if (selection[2] === true) input.checked = 'checked';
                    if (inArray(selection[1], new_opt)) div.className = "newoption";
                    div.appendChild(input);
                    div.appendChild(lable);
                    //topdiv.appendChild(div);
                    break;
                }
            case "select#":
                {}
            case "select+":
                {}
            case "select":
                {
                    lable = document.createElement("label");
                    lable.htmlFor = dialog_name + "-" + selection[1];
                    lable.innerHTML = selection[3];
                    input = document.createElement("select");
                    input.id = dialog_name + "-" + selection[1];
                    var options = selection[4];
                    var option;
                    for (var j = 0; j < options.length; j++) {
                        option = document.createElement("option");
                        option.value = options[j][0];
                        option.text = options[j][1];
                        if (selection[0].slice(-1) == "#") {
                            input.multiple = true;
                            if (inArray(option.value, selection[2])) option.selected = "selected";
                            else option.selected = "";
                        } else if (selection[2] == option.value) option.selected = "selected";
                        input.add(option);
                    }
                    var dim = selection[5];
                    if (dim !== undefined) {
                        input.style.width = dim[0];
                        input.style.height = dim[1];
                    }
                    if (inArray(selection[1], new_opt)) div.className = "newoption";
                    if (selection[0].slice(-1) == "#") {
                        div.appendChild(lable);
                        div.appendChild(document.createElement("br"));
                        div.appendChild(input);
                    } else {
                        div.appendChild(input);
                        div.appendChild(lable);
                    }
                    //topdiv.appendChild(div);
                    break;
                }
            case "text":
                {
                    lable = document.createElement("label");
                    lable.htmlFor = dialog_name + "-" + selection[1];
                    lable.innerHTML = selection[3];
                    input = document.createElement("input");
                    input.type = "text";
                    input.id = dialog_name + "-" + selection[1];
                    input.value = selection[2];
                    if (selection[4] !== undefined) {
                        input.maxLength = selection[4][0];
                        input.style.width = selection[4][1];
                    }
                    if (inArray(selection[1], new_opt)) div.className = "newoption";
                    div.appendChild(input);
                    div.appendChild(lable);
                    //topdiv.appendChild(div);
                    break;
                }
            case "file":
                {
                    //lable = document.createElement("label");
                    //lable.htmlFor = dialog_name + "-" + selection[1];
                    //lable.innerHTML = selection[3];
                    var upload = document.createElement("div");
                    upload.classList.add("upload");
                    input = document.createElement("input");
                    input.type = "file";
                    input.id = dialog_name + "-" + selection[1];
                    input.accept = selection[2];
                    upload.appendChild(input);
                    div.appendChild(upload);
                    //div.appendChild(lable);
                    //topdiv.appendChild(div);
                    break;
                }
            case "html+":
                {}
            case "html":
                {
                    div.innerHTML = selection[1];
                    //topdiv.appendChild(div);
                    break;
                }
            case "readonly":
                {
                    var text = document.createElement("div");
                    text.innerHTML = selection[2];
                    text.readOnly = true;
                    text.className = "textarea";
                    text.scrollTop = 0;
                    text.style.width = selection[1][0];
                    text.style.height = selection[1][1];
                    div.appendChild(text);
                    //topdiv.appendChild(div);
                    glue = false;
                    break;
                }
        }
        if (selection[0].slice(-1) == "+") return true;
        return false;
    }

    function updateRating(slot, content, side) {
        if (slot !== null && slot !== undefined) {
            var a = slot.getElementsByClassName("rating")[0];
            if (a === undefined) {
                a = document.createElement('a');
                a.classList.add("rating");
                a.href = "#";
                var stars = document.createElement('span');
                stars.classList.add("rating-static");
                stars.classList.add("rating-" + content[0]);
                stars.style.margin = "auto"; //center
                if (content[2] > 0) stars.style.border = "1px solid #" + TF.getCFG("color_warning"); //minor bans
                var tooltip = document.createElement('span');
                tooltip.classList.add("tooltip");
                tooltip.innerHTML = content[1];
                a.appendChild(stars);
                a.appendChild(tooltip);
                var div = document.createElement('div');
                div.appendChild(a);
                if (side == 1) slot.insertBefore(a, slot.children[0]); //left
                else if (side == 2) slot.appendChild(div); //after
                else if (side == 3) slot.insertBefore(div, slot.children[0]); //before
                else slot.appendChild(a); //right
            } else {
                if (side == 2 || side == 3) slot.removeChild(a.parentNode);
                else slot.removeChild(a);
                updateRating(slot, content, side);
            }
        }
    }

    var lobby_events = {
        "Substitute is on": [
            [],
            function() {
                if (my_lobby && TF.getCFG("sound_toggle")) play_sound("sound_toggle");
                log("Sub on it's way");
            }
        ],
        "is now unlocked": [
            [],
            function() {
                eventLobbyUnlock();
                log("Slot unlocked");
            }
        ],
        "Server is unreachable": [
            [],
            function() {
                eventLobbyWarning();
                log("Server unreachable");
            }
        ],
        "Bad password": [
            [],
            function() {
                eventLobbyWarning();
                log("Bad password");
            }
        ],
        "MANUAL_LEADER": [
            [],
            function() {
                eventLobbyError();
                log("MANUAL_LEADER");
            }
        ],
        "EXCESSIVE_SUBS": [
            [],
            function() {
                eventLobbyError();
                log("EXCESSIVE_SUBS");
            }
        ],
        "MANUAL_ADMIN": [
            [],
            function() {
                eventLobbyError();
                log("MANUAL_ADMIN");
            }
        ],
        //"was kicked" : [[], function (){log("Kicked");}],
        //"was banned" : [[], function (){log("Banned");}],
        //"almost ready" : [[], function (){eventLobbyError(); log("almost ready");}],
    };

    function check_lobby_events(msg, initial) {
        if (msg.getElementsByClassName("author")[0].href.slice(-9) == "TF2Center") {
            var date = msg.getElementsByClassName("date")[0].innerHTML; //fucken FF will not get this tag as text anymore?
            var text = msg.getElementsByClassName("message")[0].innerHTML;
            var event;
            for (var i = 0;
                (event = atIndex(lobby_events, i)) !== null; i++) {
                if (text.indexOf(event) >= 0 && !inArray(date, lobby_events[event][0])) {
                    lobby_events[event][0].push(date);
                    if (!initial) lobby_events[event][1]();
                    else log("reloaded events");
                    return;
                }
            }
        }
    }

    function eventLobbyToggle() {
        log("eventLobbyToggle");
        export_sound(); //heavy in my lobby
        if (TF.getCFG("sound_toggle")) play_sound("sound_toggle");
    }

    function eventLobbyUnlock() {
        log("eventLobbyUnlock");
    }

    function eventLobbyWarning() {
        log("eventLobbyWarning");
        if (my_lobby && TF.getCFG("sound_warning")) play_sound("sound_warning");
    }

    function eventLobbyError() {
        log("eventLobbyError");
        if (my_lobby && TF.getCFG("sound_error")) play_sound("sound_error");
    }

    function eventLobbyAllIn() {
        log("eventLobbyAllIn");
        if (my_lobby && TF.getCFG("sound_allingame")) play_sound("sound_allingame");
    }

    function updateLobbyPlayerSlots(initial) {
        if (initial === undefined) initial = false;
        var mylobby = false;
        var ingame = 0;
        var status;
        var time = Date.now();
        var msg;
        var admchat = document.evaluate('//span[@class="message admin"]/..', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
        for (var i = 0;
            (msg = admchat.snapshotItem(i)) !== null; i++) {
            check_lobby_events(msg, initial);
        }
        var gamestatus = document.evaluate('//div[@class="gameStatus text-green"]', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
        for (var i = 0;
            (status = gamestatus.snapshotItem(i)) !== null; i++) {
            if (status.innerText == "In-Game") ingame = ingame + 1;
        }
        var slots = document.evaluate('//div[contains(@class, "lobbySlot")]', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
        for (var i = 0;
            (slot = slots.snapshotItem(i)) !== null; i++) {
            var filled = slot.classList.contains("filled");
            if (filled) {
                var profile = slot.getElementsByTagName('a').item(0).href;
                var stats = slot.getElementsByClassName('statsContainer')[0];
                var id = /^http[s]*\:\/\/tf2center\.com\/profile\/(\d+)$/.exec(profile);
                if (id !== null) id = id[1];
                else {
                    log(slot, "no id64 matched for slot");
                    continue;
                }
                if (id == unsafeWindow.mySteamId) mylobby = true;
                var player = TF.getPlayer(id);
                var rating;
                switch (slots.snapshotLength) {
                    case 18: //Highlander
                        rating = player.getRating(1, HLcls[i]);
                        if (rating !== null) {
                            if (i < 9) updateRating(stats, rating); //Blue
                            else updateRating(stats, rating, 1); //Red
                            if (rating[2] == 2) slot.style.background = "#" + TF.getCFG("color_warning"); //vacban, blacklist
                        }
                        if (ingame == 18 && !all_ingame) {
                            all_ingame = true;
                            eventLobbyAllIn();
                        }
                        break;
                    case 12: //6on6
                        rating = player.getRating(2, SIXcls[i]);
                        if (rating !== null) {
                            if (i < 6) updateRating(stats, rating); //Blue
                            else updateRating(stats, rating, 1); //Red
                            if (rating[2] == 2) slot.style.background = "#" + TF.getCFG("color_warning"); //vacban, blacklist
                        }
                        if (ingame == 12 && !all_ingame) {
                            all_ingame = true;
                            eventLobbyAllIn();
                        }
                        break;
                }
            }
        }
        if (my_lobby != mylobby) {
            var ok = (my_lobby !== null);
            my_lobby = mylobby;
            log("my lobby");
            if (ok) eventLobbyToggle();

        }
        time = Date.now() - time;
        log("Updated in " + time + "ms");
    }

    var possible_slots = JSON.stringify({
        "scout": {
            "red": 0,
            "blue": 0
        },
        "soldier": {
            "red": 0,
            "blue": 0
        },
        "roamer": {
            "red": 0,
            "blue": 0
        },
        "pocket": {
            "red": 0,
            "blue": 0
        },
        "pyro": {
            "red": 0,
            "blue": 0
        },
        "demoman": {
            "red": 0,
            "blue": 0
        },
        "heavy": {
            "red": 0,
            "blue": 0
        },
        "engineer": {
            "red": 0,
            "blue": 0
        },
        "medic": {
            "red": 0,
            "blue": 0
        },
        "sniper": {
            "red": 0,
            "blue": 0
        },
        "spy": {
            "red": 0,
            "blue": 0
        },
    });

    var class_css = {
        "scout": "icons classes scout myclasses",
        "soldier": "icons classes soldier",
        "roamer": "icons classes soldier classextra roamer myclasses",
        "pocket": "icons classes soldier classextra pocket myclasses",
        "pyro": "icons classes pyro myclasses",
        "demoman": "icons classes demoman myclasses",
        "heavy": "icons classes heavy myclasses",
        "engineer": "icons classes engineer myclasses",
        "medic": "icons classes medic myclasses",
        "sniper": "icons classes sniper myclasses",
        "spy": "icons classes spy myclasses",
    };

    function GetClassSlots(id, team, slot) {
        var a = document.createElement("a");
        a.target = "_blank";
        a.href = "/join/lobby/" + id + "/" + team + "/" + slot;
        var span = document.createElement("span");
        span.className = "myslot" + team;
        a.appendChild(span);
        return a;
    }

    function GetOpenSlots(lobby) {
        var slots = TF.getCFG("msg_class");
        var div = document.createElement("div");
        var cls;
        var span;
        var slot;
        for (var i = 0; i < slots.length; i++) {
            slot = slots[i];
            if (lobby[slot].red == 1 || lobby[slot].blue == 1) {
                cls = document.createElement("div");
                cls.className = "myclassicon";
                span = document.createElement("span");
                span.className = class_css[slot];
                cls.appendChild(span);
                if (lobby[slot].blue == 1) {
                    //log(slot+" blue open");
                    cls.appendChild(GetClassSlots(lobby.id, "blue", slot));
                }
                if (lobby[slot].red == 1) {
                    //log(slot+" red open");
                    cls.appendChild(GetClassSlots(lobby.id, "red", slot));
                }
                div.appendChild(cls);
            }
        }
        log(div, "our classes");
        return div;
    }

    function updateLobbyMain(initial) {
        if (initial === undefined) initial = false;
        var time = Date.now();
        var lobby;
        var id;
        var slot;
        var list;
        var status;
        var img;
        var a;
        var message;
        var classIcon;
        var current_slots;
        var current_lobbys = {};
        var lobbys = document.evaluate('//div[contains(@class, "lobbyOverviewPanel")]', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
        for (var i = 0;
            (lobby = lobbys.snapshotItem(i)) !== null; i++) { //Lobby
            current_slots = JSON.parse(possible_slots);
            id = parseInt(lobby.id.split("-")[1]);
            if (isNaN(id)) continue;
            current_slots.id = id;
            current_slots.gameType = lobby.getElementsByClassName("gameType")[0].innerText.replace("Highlander", "HL");
            current_slots.mapName = lobby.getElementsByClassName("mapName")[0].innerText;
            if (TF.getCFG("msg_slot")) {
                classIcon = lobby.getElementsByClassName("classIcon");
                for (var j = 0;
                    (slot = classIcon[j]) !== undefined; j++) { //Slot
                    list = slot.innerHTML.replace("soldier classextra ", "").match(/( scout| soldier| roamer| pocket| pyro| demoman| heavy| engineer| medic| sniper| spy| available reserved-red| available reserved-blue| available red| available blue)+/g);
                    for (var k = 1;
                        (status = list[k]) !== undefined; k++) { //Status
                        var pl_class = list[0].trim();
                        switch (status) {
                            case " available red":
                                {
                                    current_slots[pl_class].red = 1;
                                    break;
                                }
                            case " available blue":
                                {
                                    current_slots[pl_class].blue = 1;
                                    break;
                                }
                            case " available reserved-red":
                                {
                                    current_slots[pl_class].red = 2;
                                    break;
                                }
                            case " available reserved-blue":
                                {
                                    current_slots[pl_class].blue = 2;
                                    break;
                                }
                        }
                    }
                }
                current_lobbys[id] = current_slots;
            }
            if (!initial && id > lastlobby && TF.getCFG("msg_newlobby")) {
                //if (true) { //HERE
                log(id, "New Lobby");
                message = document.createElement('div');
                img = lobby.getElementsByTagName("img")[0].cloneNode(true);
                img.style.float = "left";
                a = lobby.getElementsByTagName("a")[0].cloneNode(true);
                a.className = "mylobbylink";
                while (a.firstChild) {
                    a.removeChild(a.firstChild);
                }
                var descr = current_slots.gameType + " " + current_slots.mapName;
                if (!TF.getCFG("msg_slot")) {
                    if (descr.length > 18) descr = descr.slice(0, 16) + "...";
                    a.appendChild(img);
                }
                if (descr.length > 24) descr = descr.slice(0, 22) + "...";
                message.appendChild(a);
                if (lobby.getElementsByClassName("mumbleReq").length == 1) a.innerHTML += '<div style="float: right;" class="icons mumbleReq" title="You are expected to join mumble for this lobby"></div>';
                a.innerHTML += "<div>" + descr + "</div>";
                if (TF.getCFG("msg_slot")) message.appendChild(GetOpenSlots(current_slots));
                MSG_send("newlobby", message.outerHTML);
            }
        }
        all_lobbys = current_lobbys;
        lastlobby = id;
        time = Date.now() - time;
        log("Updated in " + time + "ms");
    }

    function updateLogsTFSlots() {
            var time = Date.now();
            var plclass = "None";
            var info;
            var rating;
            var slot;
            var slots = document.evaluate('//div[@class="dropdown"]', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
            for (var i = 0;
                (slot = slots.snapshotItem(i)) !== null; i++) {
                info = slot.parentNode.parentNode.getElementsByTagName('i');
                if (info !== null) plclass = info[0].getAttribute("data-title");
                if (plclass !== null) plclass = plclass.replace("Heavyweapons", "Heavy");
                var profile = slot.getElementsByTagName('a').item(3).href;
                var id = /^http[s]*\:\/\/steamcommunity\.com\/profiles\/(\d+)$/.exec(profile);
                if (id !== null) id = id[1];
                else {
                    log(profile, "no id64 matched for profile");
                    continue;
                }
                var player = TF.getPlayer(id);
                if (slots.snapshotLength > 15) rating = player.getRating(1, plclass); //Highlander
                else rating = player.getRating(2, plclass); //6on6
                if (rating !== null) updateRating(slot, rating);
            }
            time = Date.now() - time;
            log("Updated in " + time + "ms");
        } //TF Private

    function setup_sound(file, name) {
        //log(audio, "setup sound");
        var audio = $("#tf2stars-" + name)[0];
        var volume = $("#tf2stars-config-" + name + "_vol")[0].value;
        var reader = new FileReader();
        reader.addEventListener("loadend", function(event) {
            var buffer = reader.result;
            TFCache.setData("cache_sound", buffer, audio.id);
            if (volume !== undefined) audio.volume = volume;
            audio.src = buffer;
            audio.play();
        });
        //reader.readAsArrayBuffer(file);
        reader.readAsDataURL(file);
    }

    function load_sound(name) {
        //log(audio, "load sound");
        var key = "tf2stars-" + name;
        var audio = $("#tf2stars-" + name)[0];
        var volume = TF.getCFG("sound_heavy_vol");
        audio.volume = volume;
        var buffer = TFCache.getData("cache_sound", key);
        if (!isEmpty(buffer)) {
            audio.src = buffer;
            //audio.play();
        }
    }

    function play_sound(name, volume) {
        var audio = $("#tf2stars-" + name)[0];
        if (volume === undefined) volume = $("#tf2stars-config-" + name + "_vol")[0].value;
        //log(audio, "play sound");
        audio.pause();
        if (volume !== undefined) audio.volume = volume;
        audio.play();
    }

    function export_sound() {
        if (TF.getCFG("sound_mylobby")) {
            if (TF.getCFG("sound_heavy") && my_lobby) {
                myExportFunction(function() {
                        $("#tf2stars-sound_heavy")[0].play();
                    },
                    unsafeWindow, {
                        defineAs: "playReadySoundHeavy"
                    });
            } else myExportFunction(function() {
                    return;
                },
                unsafeWindow, {
                    defineAs: "playReadySoundHeavy"
                });
        } else myExportFunction(function() {
                $("#tf2stars-sound_heavy")[0].play();
            },
            unsafeWindow, {
                defineAs: "playReadySoundHeavy"
            });
        if (TF.getCFG("sound_announcer")) {
            myExportFunction(function() {
                    $("#tf2stars-sound_announcer")[0].play();
                },
                unsafeWindow, {
                    defineAs: "playLaunchSoundAnnouncer"
                });
        }
    }

    function setup_audio(name, src) {
        src = " src='" + src + "' ";
        var sound = "<audio id='tf2stars-" + name + "'" + src + "/>";
        addContent(sound);
        load_sound(name);
        $(document).on("change", "#tf2stars-config-" + name + "_file", function() {
            setup_sound(this.files[0], name);
        });
        $(document).on("change", "#tf2stars-config-" + name + "_vol", function() {
            play_sound(name);
        });
    }

    var audio_sources = [
        ["sound_heavy", "/assets/sounds/ready_heavy.wav"],
        ["sound_announcer", "/assets/sounds/announcer_am_gamestarting.mp3"],
        ["sound_allingame", ""],
        ["sound_toggle", ""],
        ["sound_warning", ""],
        ["sound_error", ""],
    ];

    function updateCalEvents() {
        log("updateCalEvents");
        var block, date, time, text, a, img, s;
        var data = document.evaluate('//*[@id="eventListing"]//div[@class="eventBlock"]', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
        for (var i = 0;
            (slot = data.snapshotItem(i)) !== null; i++) {
            log(slot);
            block = slot.getElementsByClassName('eventLeftBlock')[0];
            date = slot.getElementsByClassName('eventDateBlock')[0];
            time = date.childNodes[2].textContent;
            date = date.childNodes[0].textContent;
            text = slot.getElementsByClassName('eventBlockTitle')[0].textContent;
            a = document.createElement("a");
            s = date + "+" + time + "+" + text;
            a.href = "https://www.google.com/calendar/render?ctext=" + s + "&action=TEMPLATE&pprop=HowCreated:QUICKADD";
            a.target = "_blank";
            a.title = "Add to Google Calendar";
            img = document.createElement("img");
            img.src = "http://www.google.com/images/icons/product/calendar-64.png";
            img.style.marginTop = "-20px";
            img.style.marginLeft = "70px";
            img.style.width = "32px";
            a.appendChild(img);
            block.appendChild(a);
        }
    }

    function waitForKeyElements(selectorTxt, actionFunction, bWaitOnce, iframeSelector)

    /*https://gist.githubusercontent.com/BrockA/2625891/raw/waitForKeyElements.js
        
    	waitForKeyElements():  A utility function, for Greasemonkey scripts,
        that detects and handles AJAXed content.
        Usage example:
            waitForKeyElements (
                "div.comments"
                , commentCallbackFunction
            );
            //--- Page-specific function to do what we want when the node is found.
            function commentCallbackFunction (jNode) {
                jNode.text ("This comment changed by waitForKeyElements().");
            }
        IMPORTANT: This function requires your script to have loaded jQuery.*/

    {
        var targetNodes, btargetsFound;

        if (typeof iframeSelector == "undefined")
            targetNodes = $(selectorTxt);
        else
            targetNodes = $(iframeSelector).contents()
            .find(selectorTxt);

        if (targetNodes && targetNodes.length > 0) {
            btargetsFound = true;
            /*--- Found target node(s).  Go through each and act if they
                are new.
            */
            targetNodes.each(function() {
                var jThis = $(this);
                var alreadyFound = jThis.data('alreadyFound') || false;

                if (!alreadyFound) {
                    //--- Call the payload function.
                    var cancelFound = actionFunction(jThis);
                    if (cancelFound)
                        btargetsFound = false;
                    else
                        jThis.data('alreadyFound', true);
                }
            });
        } else {
            btargetsFound = false;
        }

        //--- Get the timer-control variable for this selector.
        var controlObj = waitForKeyElements.controlObj || {};
        var controlKey = selectorTxt.replace(/[^\w]/g, "_");
        var timeControl = controlObj[controlKey];

        //--- Now set or clear the timer as appropriate.
        if (btargetsFound && bWaitOnce && timeControl) {
            //--- The only condition where we need to clear the timer.
            clearInterval(timeControl);
            delete controlObj[controlKey];
        } else {
            //--- Set a timer, if needed.
            if (!timeControl) {
                timeControl = setInterval(function() {
                        waitForKeyElements(selectorTxt,
                            actionFunction,
                            bWaitOnce,
                            iframeSelector
                        );
                    },
                    300
                );
                controlObj[controlKey] = timeControl;
            }
        }
        waitForKeyElements.controlObj = controlObj;
    }

    //TF Init
    function init() {
        load_conf();
        log(sizeBytes(TFCache.sizeCache()), "Cache store:");
        log(sizeBytes(TFCache.sizeData()), "Data store:");
    }

    //TF Public
    return {
        initTF2C: function() {
            //lobby_format = document.evaluate("//*[@id='mainHeader']/div[2]/div/div[7]/div/div[2]/h1", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.innerHTML.replace(/[\t\r\n\s]+/g, '');
            lobby_map = document.evaluate("//*[@id='mainHeader']/div[2]/div/div[7]/div/div[2]/div[2]/table/tbody/tr[1]/td[2]/p/a", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.innerHTML;
            //my_id = document.evaluate("//*[@id='nav-bar']/div/div/div[2]/ul/li[1]/a", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            //if (my_id !== null) my_id = /^http[s]*\:\/\/tf2center\.com\/profile\/(\d+)$/.exec(my_id.href);
            //if (my_id !== null) my_id = my_id[1];
            var name = lobby_map.split("_");
            if (name.length > 1) lobby_map_alt = name[0] + "_" + name[1];
            addStyle(tf2stars_css);
            if (TrueMonkey()) export_sound();
            TF.onUpdatePlayer(function(player) {
                //log(player, "onUpdatePlayer");
                if (!player.cached) updateLobbyPlayerSlots();
            });
            updateLobbyPlayerSlots(true);
            TF.updateLoopTF2C();
            if (TF.getCFG("msg_newlobby") && TF.getCFG("msg_slot")) MSG_recv("newlobby", function(msg) {
                unsafeWindow.$.jGrowl(msg, {
                    life: TF.getCFG("msg_show"),
                    header: "New Lobby",
                    beforeOpen: function(e, m, o) {
                        $(e).height("100px").width("175px");
                    }
                });
            });
            else if (TF.getCFG("msg_newlobby")) MSG_recv("newlobby", function(msg) {
                unsafeWindow.$.jGrowl(msg, {
                    life: TF.getCFG("msg_show"),
                    header: "New Lobby",
                    beforeOpen: function(e, m, o) {
                        $(e).height("120px").width("120px");
                    }
                });
            });
        },
        initTF2CMain: function() {
            if (TF.getCFG("msg_newlobby")) {
                updateLobbyMain(true);
                TF.updateLoopTF2CMain();
            }
        },
        initLOGSTF: function() {
            lobby_map = document.evaluate("//*[@class='log-header']/h3[2]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.innerHTML;
            var name = lobby_map.split("_");
            if (name.length > 1) lobby_map_alt = name[0] + "_" + name[1];
            addStyle(tf2stars_css);
            TF.onUpdatePlayer(function(player) {
                //log(player, "onUpdatePlayer");
                if (!player.cached) updateLogsTFSlots();
            });
            updateLogsTFSlots();
        },
        initSteamProfile: function() {
            init();
            if (TF.getCFG("steam_show")) {

                var id = unsafeWindow.g_rgProfileData.steamid;

                var link_etf2l = document.createElement("a");
                link_etf2l.target = "_blank";
                link_etf2l.innerHTML = '<img width="32" height="32" style="padding-left: 10px; padding-top: 5px;" alt="ETF2L" src=http://cdn.akamai.steamstatic.com/steamcommunity/public/images/avatars/d3/d3e5d7bb966b0867ce69448c9f4e1f782f672eb3_full.jpg>';
                link_etf2l.href = "http://etf2l.org/search/" + id;

                var link_ugc = document.createElement("a");
                link_ugc.target = "_blank";
                link_ugc.innerHTML = '<img width="32" height="32" style="padding-left: 10px; padding-top: 5px;" alt="UGC" src="http://cdn.akamai.steamstatic.com/steamcommunity/public/images/avatars/7e/7ea5bde6e1d5ed5add685c8ef224cf0b1fb1fc7e.jpg">';
                link_ugc.href = "http://www.ugcleague.com/players_page.cfm?player_id=" + id;

                var link_logs = document.createElement("a");
                link_logs.target = "_blank";
                link_logs.innerHTML = '<img width="32" height="32" style="padding-left: 10px; padding-top: 5px;" alt="Logs.tf" src="http://cdn.akamai.steamstatic.com/steamcommunity/public/images/avatars/7b/7bcc7b08e91659863bdbff2acf47ef5a25e9c3e9_full.jpg">';
                link_logs.href = "http://logs.tf/profile/" + id;

                var game_info = document.evaluate('//div[@class="game_info"]//a[@href="http://steamcommunity.com/app/440"]/../..', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null).snapshotItem(0);
                if (game_info !== null) {
                    game_info.appendChild(link_etf2l);
                    game_info.appendChild(link_ugc);
                    game_info.appendChild(link_logs);

                    var game_info_details = game_info.getElementsByClassName("game_info_details");

                    addStyle(tf2stars_css);
                    var update = function(player) {
                        var rating = player.getRating();
                        if (rating !== null) updateRating(game_info_details[0], rating, 1);
                    }
                    update(TF.getPlayer(id));
                    TF.onUpdatePlayer(update);
                }
            }
        },
        initSteam2GoogleCal: function() {
            init();
            if (TF.getCFG("steam_show")) waitForKeyElements("#eventListing", updateCalEvents);
        },
        updateLoopTF2C: function() {
            setTimeout(function() {
                updateLobbyPlayerSlots();
                TF.updateLoopTF2C();
            }, cfg.refresh);
        },
        updateLoopTF2CMain: function() {
            setTimeout(function() {
                updateLobbyMain();
                TF.updateLoopTF2CMain();
            }, cfg.refresh);
        },
        initConfig: function() {
            init();
            addStyle(tf2conf_css);
            var littlestar = "<div id='tf2stars-config-show' title='TF2 S.T.A.R.S.'><img alt='TF2 S.T.A.R.S. cookie' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADYAAAA2CAYAAACMRWrdAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAABIAAAASABGyWs+AAANNElEQVRo3t2af2wb53nHP8dTSR9BRpdRk0yCAtnIoCpNgo6+IICMDOZgwE0zufFaIGi8AVYQwMW6YdNcoP+sa2VgP4ABaRVsWOcBQ639YyxYAgdxttSAB7oJ7CHoicwsRBAXtdSoiBanSymTJssbj7c/XlKiLNmmUgmo9wCC7l4+977P9/n1Pu9zB/9PSTroBeLx+JgkSVOSJGlAEcC27Zl0Ov3WYwusCSp56tSgeupUDIDV9BW+N0txo+xKpFKpDw9q7a6DBCZJ0tQ3v3lMPfPVoBjw9KCPTaLKf6VO/U04CTx5kOsfCOm6fnZcH3H+55O/cH7+44Dzs3/Bufuf447jXHScu+edk88OOfF4PHJQ67sOENvUl4734nebLC2YmCaUsregmAb/IM+eGMXlcp1+rIDF4/Exmbr21TM65nJmc9zvB7KXoF7h+VNDOI4z9VgBkyRpciDYRWwkROH2dXw+0PUmMLsKhevoegi/3xONx+PHHxtgwOQJvcJK8gfYVhWPp+0XJQylDNQrnDkzisvlmn4sgOm6ftYjWerEMwubbmiaUK83GQLHIHoWCtd56aURgMRBJJGDsNjkybECsgyxGPT2isFMBtbWgMJ1kL1QyeFXbCYmYkiSNL3fQuzrBh2PxyMulyv7T+fTeD02lQpYFtj2Fk8s1ow1gOAEqyT48pcvA6iGYWzslyz7ajFJkqZigXWGBwUo294OCqBYbLspXCfUK6PrwX3PkPvtipNnJ0yKRZDlLTdsp9ZYrQa1isiQ587pAFO6rnf/ygHTNO0Fj2Spv6mVqdWEC66s7OQrFKBUgnxegCd/FX3EzdNPh9T9tNq+AZNlefLEmInXC319EAw+iE8kkkoFulqVav4qX5mIwj5a7ZcGFo/Hj2ua9gJw+sUTJrWaGL8/tlrUShyyDMgKBCegmOaLJ4NEQ559s9ojs2KrMnC5XJrjOCoQlSQpCqiA5qMEwECgyN99t8DCAigKVKtb4Ny+CP3HZgDIJiexLZH8RkbAM3pebNiVHO+tnOTPpt+nXLZayycBHMfJAtltgktSsdFopJu32VQqtbzt96bpJ4FEU1haQgPouvAphQq9QZVQyI8bCxmb/qDCsaE0bIhj1eqqiJ37KXL8h/QMTgoeY5q8cUGMR6AnFAC7IkqtwDiEX4QuL7nFHNl8jVxmBQs3Fh4WjcXNOReMJSp4AaiiUHfkoiRJSdu2L8mynJSOHj3688GeqnpOX8U//jyEYsjYaHp/ZzZffBUsEyyTxUUol4Wbtawlu7vRJoub7LVSlvnLnycQgGj0fg2IioTeE9BzbGu8XoEu7wNFyC3mSBs5kjeyzN8usF5TLnX1+6vqxYkMfo8NWgnsa1AzYRGo5oQmWyQrMPRt8PRAJQfmTaHlcobi0i3KZQiHRUYsFMQjgdjkNiE8/iiB2Fnk4uyW3HVYWoK+4iyquovkheuQv7olw8Dvi2v/IAD9UYV+v8mpQYvsjzK88mZ0Urp4Luic0/PUalCSoegFjyq03tpkPR6IDoVB1bYWaKOWYOUyuN1izGqGychLP8Pj326altW6u8HrFetsbIg1R0agKzAGR74hmNeuw8rrO8EqYeh/UVyvXoVyBnJAAWZuBum6mfXylQFYyW65T+wF8PdtF5zqCsb7K5s1oNcL6+tb1mk9a1lbz/mCx3eAareamZnFskBVxXylEszPg6J8yODG18EdEBZCxG8ohLCWEgbzFmS+t33iIlRqsJCX6bq93l28nPaprzxTJpMRAlYWxCJ4xb1pbk/fuZwA0ALhCx7fFNjtj+L2RTevH0RBfRq3P4rf1zqnFcl+lKa8fINyWazvD0DdqkKdLRfNvQ7qGFTu2/3XAQteNxTSZgBJ1/WzMvVL3xrP8qWBjU1wyIAi/vuGwatuxU07hce/T9/oFPtJuZtTFOZfw+cTyhsdfQhzHcgLF3xvUeZPk7FiRfJOuQzDmLVs6fRf3hwovvpBmHC0uXnaQBnYELl/s5KoAaXmhIAsWoX7SrJHmKdcFsDW1x/AWAIWBKiP1938+X/EimXnUMIwjFkZ4M6dO4uhUOjvF03fc8Yd/+Hnf6OIdc/BccTzd4uw1jooFoBloBvwwMbKDbwBjUPqF/YFVGk1ycqtKRy7RjgMTzwhznEeDxw61NRtBVZ+DLWfgk+BxXWFb7zzhbRZ/VwilUotwi6Vx9GjR7/v99hTr57IELCrWyWSCtUAUAUqQN/25wKxs4THZ+hqavuz0PriJZZvvLx5rygiUXV1ibgulUSEWLfBLovfchWFP3gnli7WuhLt57ldSypd18/KTn3m24kV9dSgKTRZgswacARY2wkMQAmMEZtIfiZw2eQkZmZWKK21F9dBtkDxC33aNSAjxmIxSBcUvnNjJygQCthB+Xz+w97DoXdvLKtfUz3Woaf8VT75BKwSYDWBhcSetVllFKH+v2vcXX2XJwe+hqvrUEeA6rUi//Vvz7Gx/Jbo7GcQQf054BfgLID1KTjqdlCX0gH++tbnkxW767ndTt4PLYKbdWRyIrau/eHIMsvLTVWMsLM5XgHcYny3TflB1NqsWxaiCvjbGFbB7YWgG4qr0OWHmfcDvLceuTQ3N/fyg+Z9aO++qYm44xz9ITC5CW4FCCLqbRXhlk33cfsiHYOC5t7ni2CVl4U0bgEGgF5QQhADzDWYN+Ef/j3MmtP7UFCPBNaiubm5lyVJT5slZr6lL1PII9L+wE5efyjRMagWKQFNAAMwEfsSgAUDzdrz9XmF15eiVBzlkaBgDwdNwzBeu5XvmZy+FUHxAWWQyzv53HuwVou8PZpw5Rrbol4ugqcL/vaDXmaXhqnineoE1J6ANenKvKmCLDbsKMA8kAYMIAf+YGLHQ7VSlo9/dJpVY5p6rbjjd38wIZJGEVDB7YNAQBTEAG9kgjQaDc0wjNc6FXRPwBqNhhb2VRk+IjLi+jqiQmnVkZWdFlu7PcPCGxoby2+RNy4wfznKqjG9HVgoIdy6DyIyjA6Ks1pXM+aigTKO40TZA+0JmMvl0rRQBQDLK44a26gP7KZFKutpPnpDY+XWn2y2AgBsa4N88gIfzWgUs1fa0IEP6NkR9QpjwQoul0vbi6x7faOZ0IJV1ktg5oSrZDJtR5U1WHgzLq4rCNcKIJKBKbTPKCBDtfIhS9d+BxBup49B0dhFotg4w7c/4E0plAAuHAgwx3ESQ4ESrVde2ex93ahyE4y7+b8FqMXTGq8htocSoIjucF0F9QHSaKEyiJ5Mx9SxK8bj8THVY6kh79ZJslzepc22hqi421L2JrAysITYBzPNvyVRKhWygqVVm7ZT0A/d7grxeHxs34FJknR6OFCiUnkwTyQCYXUvem2CXYD8R2AYosWwjawqHmA4WMLlciUOAlhCD5WpNns7wWDz3PZLkuITHkpzT6xWRSW/qcDMLQCGeqo4jqPtK7BmzZgYCpTE0UEWPYr7gS0v796v9/kerIiAutWGk2Xx198v5t8mQ7AEe4izjoA1Gg3NTY3RoLXZ4V1aasuGuwgcDIpW3MgIDA6KRszQkADZTgVTJKFIRPDaNiwutjFExuDcRUZPPotHsqKdvv3sCJgkSYmgz8K2hGA+333atwUIRWlaISCA9D0zhscDpZrMdDLCtWyAwUHxKsnnE8cPxS0UZJpbXeRye6lmCd/3hgaJBTt3x06BacOBEn6/0H5LuBZ1dwswti0AB4OAWwFzhX80ejl1eYSrmZ4r08lI9swbQxRkHwMDojt15MgWmPZmUanUAtYMNrfCaKDzBNLRPuY4jjYS2krzlQrbsuPGhnBN2xZW8HggnYXpZC+5kpJ1HGcylTJuAHD06HfPvR2bejpUVs+P5xjsqeJ2b+9HgpjP54NofYWu29ehtI4WqnB5XurIYh29g9Z13bk4sciQWsbrFWn5flIUkQRKtsxrN4NcW+7DcZzpubm5C7vM1+04zpQkSdMTsXVe0fJQsjYt1rJ6Pi9cvKcH8AVYMyv89uwwhmE8Uu5HJux4PB6RJGnq92LL5P8bPv207dOGphCHD8NTT8G7Pw1w/toRFj59ItloNBKpVGrXT/fy+Xwtn8/fOHz48KWM6VXf+Tig/fqvOSSG7iHLcO+esLrsgW6/uCYxic8y+VfDQnmyP33nzp3Fh8ndSYxF3dQ4EhI31bZ3FD4fDAxAya3w9bdjTCcj2Y2qdNowjN+6/33VbpRKpZbn5uZevvsLV+LVm+HsH12LUUBhZEScHqqltlgz3gYzR7+/1lFB3FHysJHJrsuEwwJMOAxjYxCKylzOBPndN4f5yapvWpIk7bN8YJlKpW5IkqT9ZNU388rbQ8XvXA9je92MjrZ9OmGugFXFjdXRnJ3GWCriK2lfHCwxHjSxLYsPVrv550w/G5Yn2Wg0pvbro8rmtyIzMvXTxyNFnh8sEgtUUd0WVwyZH8zHuNc4pD1qvY4/YNF1/Y8dx9EkSZoEcBynKEnSlGEYs53O8RkAngZON9dVHccpNhqNyYP+7PZXmv4PzLd7bPQGY4wAAAAASUVORK5CYII='/></div>";
            addContent(littlestar);
            myExportFunction(TF.resetDialog, unsafeWindow, {
                defineAs: "TF_resetDialog"
            });
            myExportFunction(TF.returnDialog, unsafeWindow, {
                defineAs: "TF_returnDialog"
            });
            TF.resetDialog();
            if (important === true) {
                log("show important");
                $('#tf2stars-config-show').addClass('important');
            }
            addScript(dialog_name + "_script", dialog_script);
            for (var i = 0; i < audio_sources.length; i++) setup_audio(audio_sources[i][0], audio_sources[i][1]);
        },
        resetDialog: function() {
            var modal = document.getElementById(dialog_name);
            if (modal === null) {
                modal = document.createElement("div");
                modal.id = dialog_name;
                var empty = document.createElement("div");
                empty.id = dialog_name + "_empty";
                var dialog = document.createElement("div");
                dialog.id = dialog_name + "_dialog";
                var form = create_dialog(true);
                dialog.appendChild(form);
                modal.appendChild(empty);
                modal.appendChild(dialog);
                addElement(modal);
                log("create dialog");
            } else {
                removeElement(dialog_name + "_form");
                var dialog = document.getElementById(dialog_name + "_dialog");
                var form = create_dialog(true);
                dialog.appendChild(form);
                log("reset dialog");
            }
        },
        returnDialog: function() {
            var sel_opt = dialog_opt;
            var len = sel_opt.length;
            var values = {};
            var MIN, MAX;
            for (var i = 0; i < len; i++) {
                if (!TrueMonkey() && inArray(i, truemonkey)) continue;
                var option = sel_opt[i][1];
                var id = dialog_name + "-" + option;
                if (option in cfg) {
                    if (sel_opt[i][0] == "checkbox" || sel_opt[i][0] == "checkbox+") values[option] = document.getElementById(id).checked;
                    else if (sel_opt[i][0] == "text" || sel_opt[i][0] == "text+") {
                        var text = document.getElementById(id).value;
                        if (sel_opt[i][4] !== undefined) {
                            var regex = sel_opt[i][4][2];
                            if (regex !== undefined) {
                                if (text.match(regex) !== null) values[option] = text;
                                else {
                                    log(id, "invalid selection:");
                                    return id;
                                }
                            }
                        } else values[option] = text;
                    } else if (sel_opt[i][0] == "select" || sel_opt[i][0] == "select+") values[option] = document.getElementById(id).value;
                    else if (sel_opt[i][0] == "select#") {
                        var opt = document.getElementById(id).selectedOptions;
                        var list = [];
                        for (var j = 0; j < opt.length; j++) list.push(opt[j].value);
                        values[option] = list;
                    } else if (sel_opt[i][0] == "float" || sel_opt[i][0] == "float+") {
                        MIN = sel_opt[i][4][1];
                        MAX = sel_opt[i][4][2];
                        values[option] = Math.min(Math.max(parseFloat(document.getElementById(id).value), MIN), MAX);
                    } else if (sel_opt[i][0] == "int" || sel_opt[i][0] == "int+") {
                        MIN = sel_opt[i][4][1];
                        MAX = sel_opt[i][4][2];
                        values[option] = Math.min(Math.max(parseInt(document.getElementById(id).value), MIN), MAX);
                    }
                }
            }
            set_conf(values);
            save_conf();
            var cache_wipe = document.getElementById(dialog_name + "-" + "cache_wipe");
            if (!isEmpty(cache_wipe) && cache_wipe.checked) {
                log("root@localhost ~ #", "rm -rf /");
                TFCache.wipeAllCache();
                TFCache.wipeAllData();
            }
            log("return dialog");
            return 0;
        },
        getPlayer: function(id) {
            if (id in players) return players[id];
            return create_player(id);
        },
        getIDs: function() {
            return Object.keys(players);
        },
        updatePlayers: function(func, data) {
            var id;
            for (var i = 0;
                (atIndex(players, i) !== null); i++) {
                id = atIndex(players, i);
                func(players[id], data);
            }
        },
        onUpdatePlayer: function(callback) {
            onUpdate = callback;
        },
        getCFG: function(name, opt) {
            var option = cfg[name];
            if (option === undefined) {
                log(name, "no config value");
                return null;
            }
            if (opt !== undefined && typeof(option) == "string") return inArray(opt, option.split(" "));
            return option;
        },
        steam_key: "E33E39DE9ED584992EEA7987334502C5",
        _TEST: function() {
        },
    };
})(); //TF()

// Main

if (/^http[s]*\:\/\/tf2center\.com\/lobbies\/*$/.exec(document.URL) !== null) {
    log("Main Lobbys");
    TF.initConfig();
    if (TF.getCFG("tf2c_show")) TF.initTF2CMain();
}

if (/^http[s]*\:\/\/tf2center\.com\/lobbies\/(\d+)\/*$/.exec(document.URL) !== null) {
    log("Lobby");
    TF.initConfig();
    if (TF.getCFG("tf2c_show")) TF.initTF2C();
}

if (/^http[s]*\:\/\/logs\.tf/.exec(document.URL) !== null) {
    log("Main Logs.tf");
    TF.initConfig();
}

if (/^http[s]*\:\/\/logs\.tf\/(\d+)\/*/.exec(document.URL) !== null) {
    log("Logs.tf");
    if (TF.getCFG("logstf_show")) TF.initLOGSTF();
}

if (/^http[s]*\:\/\/steamcommunity\.com\/profiles\/(\d+)\/*$/.exec(document.URL) !== null ||
    /^http[s]*\:\/\/steamcommunity\.com\/id\/([^\/]+)\/*$/.exec(document.URL) !== null ||
   /^http[s]*\:\/\/steamcommunity\.com\/profiles\/\[U\:1\:(\d+)\]\/*$/.exec(document.URL) !== null) {
    log("Steam Profile");
    TF.initSteamProfile();
}

if (/^http[s]*\:\/\/steamcommunity\.com\/.*events$/.exec(document.URL) !== null ||
    /^http[s]*\:\/\/steamcommunity\.com\/.*groups.*$/.exec(document.URL) !== null) {
    log("Steam2GoogleCal");
    TF.initSteam2GoogleCal();
}
