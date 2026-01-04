// ==UserScript==
// @name            autobump by rj
// @namespace       openbyte/rltr
// @description     Adds a refresh functionality to rocket-league.com
// @icon            https://www.google.com/s2/favicons?domain=rocket-league.com
// @require         https://greasyfork.org/scripts/28184-string-prototype-includes-polyfill/code/Stringprototypeincludes%20Polyfill.js?version=181415
// @require         https://greasyfork.org/scripts/28366-userscript-config-page-api/code/Userscript%20Config%20Page%20API.js?version=189256
// @require         https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @require         https://greasyfork.org/scripts/28681-jquery-copycss/code/jQuerycopyCSS.js?version=185888
// @include         http*://rocket-league.com/trades/*
// @include         http*://*.rocket-league.com/trades/*
// @include         http*://rocket-league.com/trade/*
// @include         http*://*.rocket-league.com/trade/*
// @include         http*://*.greasyfork.org/*/scripts/28685-rocket-league-trade-refresh
// @include         http*://greasyfork.org/*/scripts/28685-rocket-league-trade-refresh
// @include         http*://*.greasyfork.org/*/scripts/28685-rocket-league-trade-refresh?*
// @include         http*://greasyfork.org/*/scripts/28685-rocket-league-trade-refresh?*
// @include         http*://*.greasyfork.org/*/scripts/28685-rocket-league-trade-refresh/*
// @include         http*://greasyfork.org/*/scripts/28685-rocket-league-trade-refresh/*
// @license         MIT License
// @encoding        utf-8
// @compatible      firefox
// @compatible      chrome
// @compatible      opera
// @noframes
// @version         1.3.3.7
// @grant           GM_addStyle
// @grant           GM_setValue
// @grant           GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/32510/autobump%20by%20rj.user.js
// @updateURL https://update.greasyfork.org/scripts/32510/autobump%20by%20rj.meta.js
// ==/UserScript==



CONFIG.GREASYFORK.init(28685, [
    CONFIG.generateCheckboxOption("UPDATE_TIMER", "UPDATE_TIMER: ", true, 1),
    CONFIG.generateNumberOption("MAX_FAIL", "MAX_FAIL: ", "5", 2),
    CONFIG.generateCheckboxOption("SUCCESS_MSG_MANDATORY", "SUCCESS_MSG_MANDATORY: ", false, 3),
    CONFIG.generateCheckboxOption("AUTO_REFRESH", "AUTO_REFRESH: ", true, 4),
    CONFIG.generateNumberOption("AUTO_REFRESH_DELAY", "AUTO_REFRESH_DELAY: ", "60", 4),
    CONFIG.generateCheckboxOption("COMPARE", "COMPARE: ", true, 5),
    CONFIG.generateNumberOption("COMPARE_DELAY", "COMPARE_DELAY: ", "2400", 5),
    CONFIG.generateCheckboxOption("ALLOW_SHORT_TIMED_MULTIPLE_REFRESH", "ALLOW_SHORT_TIMED_MULTIPLE_REFRESH: ", false, 6),
    CONFIG.generateNumberOption("MULTIPLE_REFRESH_DELAY", "MULTIPLE_REFRESH_DELAY: ", 30, 6),
    CONFIG.generateCheckboxOption("SHOW_PROGRESS_BAR", "SHOW_PROGRESS_BAR: ", true, 7),
    CONFIG.generateNumberOption("PROGRESS_BAR_TILES", "PROGRESS_BAR_TILES: ", "15", 7),
    CONFIG.generateCheckboxOption("PREFER_EMPTY_OBJECT", "PREFER_EMPTY_OBJECT: ", true, 8)
]);


//prevent interference
this.$ = this.jQuery = jQuery.noConflict(true);

var RLR = {};
RLR = {
    version: "3.3.2",
    settings: {
        UPDATE_TIMER: CONFIG.getValue("UPDATE_TIMER"),
        MAX_FAIL: CONFIG.getValueAsNumber("MAX_FAIL"),
        SUCCESS_MSG_MANDATORY: CONFIG.getValue("SUCCESS_MSG_MANDATORY"),
        AUTO_REFRESH: CONFIG.getValue("AUTO_REFRESH"),
        AUTO_REFRESH_DELAY: CONFIG.getValueAsNumber("AUTO_REFRESH_DELAY"),
        COMPARE: CONFIG.getValue("COMPARE"),
        COMPARE_DELAY: CONFIG.getValueAsNumber("COMPARE_DELAY"),
        ALLOW_SHORT_TIMED_MULTIPLE_REFRESH: CONFIG.getValue("ALLOW_SHORT_TIMED_MULTIPLE_REFRESH"),
        MULTIPLE_REFRESH_DELAY: CONFIG.getValueAsNumber("MULTIPLE_REFRESH_DELAY"),
        SHOW_PROGRESS_BAR: CONFIG.getValue("SHOW_PROGRESS_BAR"),
        PROGRESS_BAR_TILES: CONFIG.getValueAsNumber("PROGRESS_BAR_TILES"),
        PREFER_EMPTY_OBJECT: CONFIG.getValue("PREFER_EMPTY_OBJECT")
    },
    tradeContainer: undefined,
    trades: {},
    timeController: {
        iid: undefined,
        tciid: undefined,
        setTime: function(trade, value, scale) {
            value = Math.floor(value);
            var c_num = trade.time.num.html();
            var c_scale = trade.time.scale.html();
            if (c_num !== value) trade.time.num.html(value);
            if (value !== 1) scale += "s";
            if (c_scale !== scale) trade.time.scale.html(scale);
        },
        getTime: function(value, scale) {
            return Number(value) * RLR.timeController.unit.get(scale);
        },
        unit: {
            second: 1,
            minute: 60,
            hour: 3600,
            day: 86400,
            week: 604800,
            year: 31449600,
            generalize: function(scale) {
                return scale.endsWith("s") ? scale.substring(0, scale.length - 1) : scale;
            },
            get: function(scale) {
                return RLR.timeController.unit[RLR.timeController.unit.generalize(scale)];
            },
            getCurrent: function(num) {
                for (var s of ["year", "week", "day", "hour", "minute", "second"])
                    if (num >= RLR.timeController.unit[s])
                        return s;
            }
        }
    },
    refresher: {
        refresh: function(t) {
            RLR.trades[t].refresh.icon.addClass("rotate");
            RLR.trades[t].refresh.frame = $(RLR.refresher.generateFrame("https://rocket-league.com/trade/edit?trade=" + RLR.trades[t].id));
            RLR.trades[t].refresh.state = "started";
            RLR.trades[t].refresh.frame.load(function() {
                var w = $(this).contents();
                if (RLR.refresher.checkForError(w)) {
                    RLR.trades[t].refresh.state = "site error";
                    RLR.refresher.fail(t);
                }
                if (w.get(0).documentURI.includes("edit?trade")) {
                    RLR.trades[t].refresh.state = "loaded edit page";
                    var s = w.find("#rlg-addTradeForm [type=submit]");
                    if (s.length !== 0) {
                        RLR.trades[t].refresh.state = "pressed submit";
                        s.trigger("click");
                    } else {
                        RLR.trades[t].refresh.state = "submit not found";
                        RLR.refresher.fail(t);
                    }
                } else if (w.get(0).documentURI.includes("/trade/")) {
                    RLR.trades[t].refresh.state = "loaded trade page";
                    var msg = w.find(".rlg-site-popup__text").text();
                    if (!RLR.settings.SUCCESS_MSG_MANDATORY || (msg.includes("edit") && msg.includes("success"))) {
                        RLR.trades[t].refresh.state = "success";
                        RLR.refresher.finish(t);
                    } else {
                        RLR.trades[t].refresh.state = "no success msg received";
                        RLR.refresher.fail(t);
                    }
                } else {
                    RLR.trades[t].refresh.state = "unknown page";
                    RLR.refresher.fail(t);
                }
            });
        },
        checkForError: function(e) {
            return e.find(".rlg-error").length !== 0;
        },
        fail: function(t) {
            RLR.trades[t].refresh.fails++;
            console.log(RLR.trades[t].id + ": Refresh failed (state=" + RLR.trades[t].refresh.state + ", counter=" + RLR.trades[t].refresh.fails + ")");
            RLR.refresher.clean(t);
        },
        clean: function(t) {
            RLR.trades[t].refresh.icon.removeClass("rotate");
            RLR.trades[t].refresh.frame.remove();
            RLR.trades[t].refresh.frame = null;
            RLR.trades[t].refresh.state = "dead";
        },
        finish: function(t) {
            RLR.trades[t].time.active = 0;
            RLR.timeController.setTime(RLR.trades[t], 0, "second");
            RLR.refresher.clean(t);
            console.log(RLR.trades[t].id + ": Refresh successful");
            RLR.trades[t].refresh.fails = 0;
        },
        generateFrame: function(src) {
            var f = $("<iframe src='" + src + "'></iframe>");
            f.addClass("hidden");
            f.appendTo($("body"));
            return f[0];
        }
    },
    init: function() {
        //do not run on a foreign single post page
        if($(".is--single").length != 0 && $("a[href*='/edit?trade']").length == 0)
            return;
        
        //extend $.copyCSS
        $.fn.getStyleString = function(only, except) {
            var style = this.getStyles(only, except);
            var str = "";
            for (var rule in style)
                str += rule.replace(/[A-Z]/g, function(m) {
                    return "-" + m.toLowerCase();
                }) + ": " + style[rule] + "; ";
            return str;
        };

        //polyfills
        if (!String.prototype.endsWith) {
            String.prototype.endsWith = function(searchString, position) {
                var subjectString = this.toString();
                if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
                    position = subjectString.length;
                }
                position -= searchString.length;
                var lastIndex = subjectString.indexOf(searchString, position);
                return lastIndex !== -1 && lastIndex === position;
            };
        }

        //init trades
        RLR.tradeContainer = $(".rlg-trade-display-container.is--user").parent();
        RLR.trades = RLR.genTrades(document);

        //start timeController routines
        var skip = 0;
        RLR.timeController.iid = setInterval(function() {
            for (var t in RLR.trades) {
                RLR.trades[t].time.active++;
                if (RLR.settings.UPDATE_TIMER) {
                    var s = RLR.timeController.unit.getCurrent(RLR.trades[t].time.active);
                    var v = RLR.timeController.unit[s];
                    if (RLR.trades[t].time.active % v === 0)
                        RLR.timeController.setTime(RLR.trades[t], RLR.trades[t].time.active / v, s);
                }
                if (RLR.settings.AUTO_REFRESH && skip <= 0 && RLR.trades[t].time.active >= 900 + RLR.settings.AUTO_REFRESH_DELAY && RLR.trades[t].refresh.state === "dead" && RLR.trades[t].refresh.fails < RLR.settings.MAX_FAIL) {
                    RLR.refresher.refresh(t);
                    if (!RLR.settings.ALLOW_SHORT_TIMED_MULTIPLE_REFRESH) 
                        skip = RLR.settings.MULTIPLE_REFRESH_DELAY;
                }
                if (RLR.settings.SHOW_PROGRESS_BAR) {
                    while (RLR.trades[t].time.active > RLR.trades[t].progress.tft * RLR.trades[t].progress.tiles.length && RLR.trades[t].progress.tiles.length < 15)
                        RLR.trades[t].progress.tiles.push($("<div class='progress-tile'></div>").appendTo(RLR.trades[t].progress.e));
                    while (RLR.trades[t].time.active < RLR.trades[t].progress.tft * (RLR.trades[t].progress.tiles.length-1))
                        RLR.trades[t].progress.tiles.pop().remove();
                }
            }
            skip--;
        }, 1000);
        if (RLR.settings.COMPARE) {
            RLR.timeController.tciid = setInterval(function() {
                var millis = new Date().getTime();
                $.get(location.href, function(data) {
                    var delay = Math.round((new Date().getTime() - millis) / 2000);
                    var trades = RLR.genTrades($(data));
                    var t;
                    for (t in RLR.trades)
                        if (!(t in trades)) {
                            RLR.trades[t].e.remove();
                            RLR.trades[t] = undefined;
                        }
                    for (t in trades) {
                        if (t in RLR.trades) {
                            trades[t].time.active += delay;
                            if (Math.abs(RLR.trades[t].time.active - trades[t].time.active) > RLR.timeController.unit[RLR.timeController.unit.getCurrent(trades[t].time.active)])
                                RLR.trades[t].time.active = trades[t].time.active + delay;
                        } else {
                            RLR.trades[t] = RLR.genTrade(trades[t].e.appendTo(RLR.tradeContainer));
                        }
                    }
                });
            }, RLR.settings.COMPARE_DELAY * 1000);
        }

        //add refresh feature
        for (var t in RLR.trades) {
            RLR.trades[t].refresh.e.click(function (e) {
                e.preventDefault();
                RLR.refresher.refresh(t);
            });
        }
        
        //add progress bar
        if (RLR.settings.SHOW_PROGRESS_BAR) 
           for (var t in RLR.trades) {
                RLR.trades[t].progress = RLR.settings.PREFER_EMPTY_OBJECT ? Object.create(null) : {};
                RLR.trades[t].progress.e = $("<div class='row progress-line'></div>").insertAfter(RLR.trades[t].e.find(".rlg-trade-display-header"));
                RLR.trades[t].progress.tft = RLR.timeController.getTime(15, "minute") / RLR.settings.PROGRESS_BAR_TILES;
                RLR.trades[t].progress.tiles = [];
            }

        //add css
        GM_addStyle(".rlg-trade-display-refresh { " + $(".rlg-trade-display-bookmark").getStyleString() + "} .fa-refresh-o { " + $(".rlg-trade-display-bookmark i").getStyleString() + " width: 16px; height: auto; } iframe.hidden { width: 0px; height: 0px; position: absolute; top: -10000px; left: -10000px; } .rotate { animation-name: rotation; animation-duration: 0.75s; animation-iteration-count: infinite; animation-timing-function: linear; transform-origin: 50% 50%; } @keyframes rotation { from {transform: rotate(360deg);} to {transform: rotate(0deg);} } .row.progress-line { display: flex; flex-direction: row; height: 3px; padding-left: 0.5%; padding-right: 0.5%; } .progress-tile { height: 100%; background-color: #4288cc; width: " + ((24*99)/(25*RLR.settings.PROGRESS_BAR_TILES)) + "%; margin: 0 " + (99/(25*RLR.settings.PROGRESS_BAR_TILES)) + "%; } ");
    },
    genTrades: function(d) {
        var obj = {};
        $(d).find(".rlg-trade-display-container.is--user").each(function() {
            var trade = RLR.genTrade($(this));
            obj[trade.id] = trade;
        });
        return obj;
    },
    genTrade: function(e) {
        var trade = RLR.settings.PREFER_EMPTY_OBJECT ? Object.create(null) : {};
        trade.e = e;
        trade.time = RLR.settings.PREFER_EMPTY_OBJECT ? Object.create(null) : {};
        trade.time.g = e.find(".rlg-trade-display-added");
        trade.time.g.html(trade.time.g.html()
            .replace(/\d+/, "<span class='rlg-trade-display-added-number'>$&</span>")
            .replace(/(?:second|minute|hour|day|week|month|year)s?/, "<span class='rlg-trade-display-added-scale'>$&</span>"));
        trade.time.num = trade.time.g.find(".rlg-trade-display-added-number");
        trade.time.scale = trade.time.g.find(".rlg-trade-display-added-scale");
        trade.time.active = RLR.timeController.getTime(trade.time.num.html(), trade.time.scale.html());
        trade.bookmark = e.find(".rlg-trade-display-bookmark");
        trade.id = trade.bookmark.attr("data-alias");
        trade.refresh = RLR.settings.PREFER_EMPTY_OBJECT ? Object.create(null) : {};
        trade.refresh.e = e.find(".rlg-trade-display-refresh");
        trade.refresh.state = "dead";
        trade.refresh.fails = 0;
        trade.refresh.frame = null;
        if (trade.refresh.e.length === 0) trade.refresh.e = $("<button class='rlg-trade-display-refresh' name='refresh' data-alias='" + trade.id + "'><img class='fa-refresh-o' aria-hidden='true' src='https://i.imgur.com/DaYwkeR.png' />").insertBefore(trade.bookmark);
        trade.refresh.icon = trade.refresh.e.find("img");
        return trade;
    }
};

if (location.href.includes("rocket-league.com")) RLR.init();