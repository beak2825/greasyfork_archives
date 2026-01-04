// ==UserScript==
//
// @name         HH Automation
// @description  HH Automation Script
// @version      0.3.00
//
// @namespace    http://tampermonkey.net/
// @author       ARH
//
// @match        https://www.hentaiheroes.com/*
// @match        https://nutaku.haremheroes.com/*
// @match        https://eroges.hentaiheroes.com/*
// @match        https://www.gayharem.com/*
// @match        http://test.hentaiheroes.com/*
//
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
//
// @run-at       document-end
//
// @downloadURL https://update.greasyfork.org/scripts/376454/HH%20Automation.user.js
// @updateURL https://update.greasyfork.org/scripts/376454/HH%20Automation.meta.js
// ==/UserScript==

var $ = window.jQuery;
var log = console;
var Page;

(function() { // anonymus namespace begin

var dispatcher = new function() {
    this.subscriptions = [
        {patterns:{pathPattern:null,                        queryPattern:null},                 callback:handle_any},
        {patterns:{pathPattern:"/home.html",                queryPattern:null},                 callback:handle_home},
        {patterns:{pathPattern:"/pachinko.html",            queryPattern:null},                 callback:handle_pachinko},
        {patterns:{pathPattern:"/activities.html",          queryPattern:"(?<!&index=\\d+)$"},  callback:handle_activities},
        {patterns:{pathPattern:"/activities.html",          queryPattern:"tab=pop&index=\\d+"}, callback:handle_pop},
        {patterns:{pathPattern:"/tower-of-fame.html",       queryPattern:null},                 callback:handle_league},
        {patterns:{pathPattern:"/harem",                    queryPattern:null},                 callback:handle_harem},
        {patterns:{pathPattern:"/battle.html",              queryPattern:null},                 callback:handle_battle},
        {patterns:{pathPattern:"/battle.html",              queryPattern:"league_battle"},      callback:handle_battle_league},
        {patterns:{pathPattern:"/battle.html",              queryPattern:"id_season_arena"},    callback:handle_battle_season},
        {patterns:{pathPattern:"/battle.html",              queryPattern:"id_troll"},           callback:handle_battle_troll},
        {patterns:{pathPattern:"/shop.html",                queryPattern:null},                 callback:handle_shop},
        {patterns:{pathPattern:"/champions-map.html",       queryPattern:null},                 callback:handle_champions_map},
        {patterns:{pathPattern:"/champions-help.html",      queryPattern:null},                 callback:handle_champion_help},
        {patterns:{pathPattern:"/champions/",               queryPattern:null},                 callback:handle_champion},
        {patterns:{pathPattern:"/hero/profile.html",        queryPattern:null},                 callback:()=>{}},
        {patterns:{pathPattern:"/hero/\d+/profile.html",    queryPattern:null},                 callback:()=>{}},
        {patterns:{pathPattern:"season.html",               queryPattern:null},                 callback:handle_season},
        {patterns:{pathPattern:"season-arena.html",         queryPattern:null},                 callback:handle_arena},
        {patterns:{pathPattern:"event.html",                queryPattern:null},                 callback:()=>{}},
    ]

    this.dispatch = function(path, query)
    {
        for(let i=0; i<this.subscriptions.length; ++i)
        {
            const s = this.subscriptions[i]
            if (s.patterns.pathPattern==null || path.match(s.patterns.pathPattern) != null)
                if (s.patterns.queryPattern==null || query.match(s.patterns.queryPattern) != null)
                {
                    log.debug("ARH/", "match for", path, query, "for patterns", s.patterns)
                    s.callback()
                }
        }
    }
}

var doNothing = ()=>{};
var noAdditionalConditions = ()=>{return false;};

function times(howmany, action, interval=0.2, alternativeAbortCondition=noAdditionalConditions, actionAfter=doNothing) {
    var counter = 0;
    var timerId = 0;
    var sleepTime = interval*1000;
    timerId = setInterval(step, sleepTime);
    function step()
    {
        if (counter<howmany && ! alternativeAbortCondition())
        {
            action();
            log.debug("ARH/", "times action", counter);
            counter++;
        } else {
            clearInterval(timerId);
            actionAfter();
        }
    }
}

function until(abortCondition=noAdditionalConditions, action, interval=0.2, actionAfter=doNothing) {
    function step()
    {
        if (! abortCondition())
        {
            action();
            log.debug("ARH/", "until action");
        } else {
            clearInterval(timerId);
            actionAfter();
        }
    }
    var timerId = setInterval(step, interval*1000);
}

function Timer() {
    this._int_seconds_minimum = 1
    this._int_seconds = null
    this._str_seconds = null
    this._str_readable = null
    this._on_timeout = () => {}
    this._action_desc = "<unknown>"

    function time_int_to_readable(input) {
        let sec = input
        let min = Math.floor(sec / 60)
        sec = sec - (min * 60)
        let hr = Math.floor(min / 60)
        min = min - (hr * 60)
        let days = Math.floor(hr / 24)
        hr = hr - (days * 24)
        let result = ""
        if (days > 0) result = result + " " + days+"d"
        if (hr > 0) result = result + " " + hr+"h"
        if (min > 0) result = result + " " + min+"m"
        if (sec > 0) result = result + " " + sec+"s"
        return result.trim()
    }

    function time_readable_to_int(input) {
        function parse_for_front_unit(current_input, unit) {
            let split = current_input.split(unit)
            if (split.length == 1)
                return [0, split[0]]
            return [parseInt(split[0].trim()), split[1]]
        }

        let day = parse_for_front_unit(input, 'd')
        let hr = parse_for_front_unit(day[1], 'h')
        let min = parse_for_front_unit(hr[1], 'm')
        let sec = parse_for_front_unit(min[1], 's')

        return ((day[0]*24 + hr[0])*60 + min[0])*60 + sec[0]
    }

    this.fill_from_int_seconds = function(input) {
        this._int_seconds = input
        this._str_seconds = String(this._int_seconds)
        this._str_readable = time_int_to_readable(this._int_seconds)
        return this
    }

    this.fill_from_str_seconds = function(input) {
        this._str_seconds = input
        this._int_seconds = parseInt(this._str_seconds)
        this._str_readable = time_int_to_readable(this._int_seconds)
        return this
    }

    this.fill_from_str_readable = function(input) {
        this._str_readable = input
        this._int_seconds = time_readable_to_int(this._str_readable)
        this._str_seconds = String(this._int_seconds)
        this._str_readable = time_int_to_readable(this._int_seconds)
        return this
    }

    this.get_seconds = function() { return this._int_seconds }
    this.get_readable = function() { return this._str_readable }

    this.set_on_timeout = function(callback, action_desc) {
        log.debug("ARH/", "prepare callback '", action_desc, "'")
        this._action_desc = action_desc
        this._on_timeout = callback
        return this
    }

    this.minimum = function(sec) { this._int_seconds_minimum = sec; return this; }

    this.start = function() {
        let sec = this.get_seconds()
        if (sec < this._int_seconds_minimum)
            sec = this._int_seconds_minimum
        log.info("ARH/", "started timer for", this.get_readable(),
                 "[min:", time_int_to_readable(sec), "]",
                 "for action '", this._action_desc, "'")
        this.timer_id = setTimeout(this._on_timeout, sec*1000)
        return this
    }
}

function run_after_sec(sec, lambda, action_desc, min = 1) {
    return new Timer().fill_from_int_seconds(sec).set_on_timeout(lambda, action_desc).minimum(min).start()
}

function reload_after_sec(sec, action_desc, min = 1) {
    return run_after_sec(sec, Page.reload, action_desc, min);
}

function Button(jq_button) {
        this._jq_button = jq_button

        this.click = function() {
            log.debug("ARH/", "click() on", this._jq_button)
            this._jq_button.click()
        }
        this.is_disabled = function() {
            let disabled = this._jq_button[0].getAttribute("disabled")
            return window.getComputedStyle(this._jq_button[0]).disabled
            || (disabled != null && disabled != "false")
        }
        this.is_hidden = function() { return window.getComputedStyle(this._jq_button[0]).display == "none" }

        this.is_available = function() { return !this.is_disabled() && !this.is_hidden() }
}

function Common() {
    this._html_header = $("header")[0]

    this.Popups = {
        get no_energy_fight() {
            let jq_popup = $("#no_energy_fight")
            if (jq_popup.length == 0) return false
            if (window.getComputedStyle(jq_popup[0]).display != "block") return false
            return true
        },
        get no_energy_challenge() {
            let jq_popup = $("#no_energy_challenge")
            if (jq_popup.length == 0) return false
            if (window.getComputedStyle(jq_popup[0]).display != "block") return false
            return true
        },
    }

    function Energy(html_header, type_text) {
        this._energy_counter_query = ".energy_counter[type=" + type_text + "]"

        let regen = "0s"
        if (type_text == "fight") regen = "30m"
        if (type_text == "quest") regen = "7m"

        this._html_energy_quest = $(html_header).find(this._energy_counter_query)[0]



        Object.defineProperties(this, {
            Current: {
                get: function() {
                    let html_span_energy = $(this._html_energy_quest).find("span[energy]")[0]
                    return parseInt(html_span_energy.textContent)
                }
            }
        })

        this.Max = parseInt($(this._energy_counter_query).find("span[rel=max]")[0].textContent)

        this.is_full = function () { return this.Current >= this.Max }

        Object.defineProperties(this, {
            Time: {
                get: function() {
                    if (this.is_full())
                        return new Timer().fill_from_int_seconds(0)
                    let time = ($(this._energy_counter_query).find("span[rel=count]")[0].textContent)
                    return new Timer().fill_from_str_readable(time)
                }
            }
        })

        this.Regeneration = new Timer().fill_from_str_readable(regen)
    }

    this.Energy_Quest = new Energy(this._html_header, "quest")
    this.Energy_Fight = new Energy(this._html_header, "fight")
}

function Shop() {
    this._html_shop = $(".canvas[id=shops]")[0]

        let sl = $(this._html_shop).find("#shops_left")[0]
        let sr = $(this._html_shop).find("#shops_right")[0]

    this.Restock = new Button($(sl).find("button[rel=shop_reload]"))
    this.Buy = new Button($(sl).find("button[rel=buy]"))
    this.Use = new Button($(sr).find("button[rel=use]"))
    this.Sell = new Button($(sr).find("button[rel=sell]"))

    this.Timer = new Timer().fill_from_str_seconds($(sl).find("span[time]")[0].getAttribute("time"))

        let html_shop_select = $(sl).find("#type_item")[0]
        let html_shop_stock = $(sl).find("#shop")[0]
        let html_inventory = $(sr).find("#inventory")[0]

    function StockItem(html_div_slot) {
        this._html_div_slot = html_div_slot

        this.Rarity = new (function(current_html_div_slot) {
            this._rarity = current_html_div_slot.getAttribute("rarity")
            this.is_common = function() { return this._rarity == "common" }
            this.is_rare = function() { return this._rarity == "rare" }
            this.is_epic = function() { return this._rarity == "epic" }
            this.is_legendary = function() { return this._rarity == "legendary" }
            this.get = function() { return this._rarity }
        })(this._html_div_slot)

        this.is_empty = function() { return this._html_div_slot.classList.contains("empty") }

        this.select = function() { this._html_div_slot.click() }

        this.Item_Id = parseInt(this._html_div_slot.getAttribute("id_item"))

        Object.defineProperties(this, {
            Amount: {
                 get: function() { return parseInt($(this._html_div_slot).find(".stack_num span")[0].textContent) }
            }
        });

        this.is_selected = function() { return this._html_div_slot.classList.contains("selected") }
    }

    function Shop_and_Stock(stockType) {
        let stock_type_selector = "[type="+stockType+"]"
        let stock_tab_selector = "."+stockType+"[tab]"
        this._html_shop_entry = $(html_shop_select).find(stock_type_selector)
        this._html_shop_stock = $(html_shop_stock).find(stock_type_selector)
        this._html_inventory = $(html_inventory).find(stock_tab_selector)

        this.enter = function() { this._html_shop_entry.click() }

        this.is_selected = function() { return this._html_shop_entry[0].classList.contains("selected") }

        this.is_stock_empty = function() {
            return $(this._html_shop_stock).find(".slot.empty").length == 8
        }

        function fillStock(this_html_shop_stock) {
            let stockArray = []
            let stock = $(this_html_shop_stock).find(".slot")
            for (let i=0; i<stock.length; i=i+1)
                stockArray.push(new StockItem(stock[i]))
            return stockArray;
        }

        // this.Stock = fillStock(this._html_shop_stock)
        // this.Have = fillStock(this._html_inventory)
        Object.defineProperties(this, {
            Stock: { get: function() { return fillStock(this._html_shop_stock) } } })
        Object.defineProperties(this, {
            Have: { get: function() { return fillStock(this._html_inventory) } } })
    }

    this.Equipment = new Shop_and_Stock("armor")
    this.Boosters = new Shop_and_Stock("booster")
    this.Books = new Shop_and_Stock("potion")
    this.Gifts = new Shop_and_Stock("gift")

    this.Stats = new function() {
        this._html_stats = $(sr).find(".hero_stats")[0]

        function stat(html_stat_container) {
            let Stat = {
                get Value() {
                    let value = $(html_stat_container).find("[carac]")[0].textContent
                    value = parseInt(value.trim().replace(",",""))
                    return value
                },

                Plus: new Button($(html_stat_container).find("plus")),

                get Cost() {
                    let html_with_cost = $(html_stat_container).find("[value]")
                    if (html_with_cost.length == 0)
                        return 0
                    return parseInt(html_with_cost[0].getAttribute("value"))
                },

                is_maxed: function() {
                    let html_with_cost = $(html_stat_container).find("[value]")
                    return html_with_cost.length == 0 || html_with_cost[0].textContent == "Maxed"
                },

                Name: $(html_stat_container).find("[hh_title]")[0].getAttribute("hh_title"),
            }
            return Stat
        }

        this.Hardcore = stat($(this._html_stats).find("[hero=carac1]")[0])
        this.Charm = stat($(this._html_stats).find("[hero=carac2]")[0])
        this.KnowHow = stat($(this._html_stats).find("[hero=carac3]")[0])
    }

    this.Boosters.Pool = {
        Ginseng: {
            Common: 7,
            Rare: 8,
            Epic: 9,
            Legendary: 316,
        },
        Jujubes: {
            Common: 10,
            Rare: 11,
            Epic: 12,
            Legendary: 317,
        },
        Chlorella: {
            Common: 28,
            Rare: 29,
            Epic: 30,
            Legendary: 318,
        },
        Corodyceps: {
            Common: 31,
            Rare: 32,
            Epic: 33,
            Legendary: 319,
        },

        Common: {
            Ginseng: 7,
            Jujubes: 10,
            Chlorella: 28,
            Corodyceps: 31,
        },
        Rare: {
            Ginseng: 8,
            Jujubes: 11,
            Chlorella: 29,
            Corodyceps: 32,
        },
        Epic: {
            Ginseng: 9,
            Jujubes: 12,
            Chlorella: 30,
            Corodyceps: 33,
        },
        Legendary: {
            Ginseng: 316,
            Jujubes: 317,
            Chlorella: 318,
            Corodyceps: 319,
        },
    }

    this.Girls = new function() {
        this._html_girls_list = $(sr).find("#girls_list")[0]

        function make_girl(html_level, h3_name, html_icon) {
            return {
                get Level() { return parseInt($(html_level).find("[chars]")[0].textContent) },
                get Name() { return h3_name.textContent },
                get Class() { return parseInt(html_icon.getAttribute("carac")) },
            }
        }

        this.Selected = make_girl(
            this._html_girls_list.children[0],
            this._html_girls_list.children[1],
            this._html_girls_list.children[2])

        function Girl(html_container) {
            this._html_container = html_container
            this.is_selected = function() { return ! this._html_container.classList.contains("not-selected") }
        }

        this.All = (function(html_girls_container) {
            let girls = []
            let html_girls = $(html_girls_container).find(".girl-ico")
            for (let i=0; i<html_girls.length; i=i+1)
                girls.push(new Girl(html_girls[i]))
            return girls
        })(this._html_girls_list.children[3])
    }

    /*  Stock explanation
        example: Page.Shop.Equipment.Stock[3]
        if you buy this item, KK deletes the DIV element with it
        the content of Page.Shop.Equipment doesn't change
            deleted DIV is still in Page.Shop.Equipment under the same index
            and all other DIVs are under the same index in Page.Shop.Equipment
        the new DIV added in place of deleted (bought) item is added into html
        you cannot find the new DIV[empty] in Page.Shop.Equipment
    */
}

function Activities() {
    this.Missions = new function() {

        this._html_missions_tab = $(".canvas[id=missions]")[0]

            let html_missions = $(this._html_missions_tab).find(".mission_object.mission_entry")

        function Mission(html_mission) {
            this._html_mission = html_mission
            this._is_common = this._html_mission.classList.contains("common")
            this.is_common = function() { return this._is_common }
            this._is_rare = this._html_mission.classList.contains("rare")
            this.is_rare = function() { return this._is_rare }
            this._is_epic = this._html_mission.classList.contains("epic")
            this.is_epic = function() { return this._is_epic }
            this._is_legendary = this._html_mission.classList.contains("legendary")
            this.is_legendary = function() { return this._is_legendary }
            this.Duration = new Timer().fill_from_str_readable($(this._html_mission).find(".duration")[0].textContent)

            this.Start = new Button($(this._html_mission).find("button[rel=mission_start]"))
            this.Claim_Reward = new Button($(this._html_mission).find("button[rel=claim]"))
            this._Finish = new Button($(this._html_mission).find("button[rel=finish]"))

            this.ends_in = function() {
                time_string = $(this._html_mission).find(".finish_in_bar .text span")[0].textContent
                return new Timer().fill_from_str_readable(time_string)
            }
        }

        this.missions = []
        for(let i=0;i<html_missions.length;i=i+1)
            this.missions.push(new Mission(html_missions[i]))


        this.Done = new (function(html_missions_tab) {
            this._html_end_gift = $(html_missions_tab).find(".end_gift")[0]
            this._html_after_gift = $(html_missions_tab).find(".after_gift")[0]

            this.is_final_gift_available = function() {
                return window.getComputedStyle(this._html_end_gift).display == "block"
            }
            this.is_final_gift_claimed = function() {
                return window.getComputedStyle(this._html_after_gift).display == "block"
            }

            this.Claim_Gift = new Button($(this._html_end_gift).find("button"))
            this.ends_in = function() {
                if (this.is_final_gift_available())
                    time_string = $(this._html_end_gift).find("p span")[0].textContent
                else if (this.is_final_gift_claimed())
                    time_string = $(this._html_after_gift).find("span")[0].textContent
                return new Timer().fill_from_str_readable(time_string)
            }
        })(this._html_missions_tab)
    }

    this.Contests = new function() {
        this._html_contests_tab = $(".canvas[id=contests]")[0]
            let html_contests = $(this._html_contests_tab).find(".scroll_area .contest")

        function Contest(html_contest) {
            this._html_contest = html_contest

            this.in_progress = function() {
                let contest_header = $(this._html_contest).find(".contest_header")[0]
                return contest_header.classList.contains("in_progress")
            }

            this.is_ended = function() {
                let contest_header = $(this._html_contest).find(".contest_header")[0]
                return contest_header.classList.contains("ended")
            }

            if (this.is_ended())
                this.Claim_Reward = new Button($(this._html_contest).find("button[rel=claim]"))

            if (this.in_progress())
                this.ends_in = function() {
                    time_string = $(this._html_contest).find(".contest_timer .text span")[0].textContent
                    return new Timer().fill_from_str_readable(time_string)
                }

        }

        this.contests = []
        for(let i=0;i<html_contests.length;i=i+1)
            this.contests.push(new Contest(html_contests[i]))

        this.Done = new (function(html_missions_tab) {
            this._html_next_contests = $(html_missions_tab).find(".next_contest")[0]
            this._html_no_contests = $(html_missions_tab).find(".no_contests")[0]

            this.waiting_for_new_contests = function() {
                return window.getComputedStyle(this._html_no_contests).display != "none"
            }

            this.ends_in = function() {
                let time_string = 0
                if (this.waiting_for_new_contests())
                    time_string = $(this._html_no_contests).find(".contest_timer .text span")[0].textContent
                else
                    time_string = $(this._html_next_contests).find(".contest_timer .text span")[0].textContent
                return new Timer().fill_from_str_readable(time_string)
            }

        })(this._html_contests_tab)
    }

    this.Places_Of_Power = new function() {
        this._html_popss_tab = $(".canvas[id=pop]")[0]
            let html_pops = $(this._html_popss_tab).find(".pop_list .pop_thumb_container")

        function PlaceOfPower(html_pop) {
            this._html_pop = html_pop

            this.is_empty_slot = function() { return $(this._html_pop).find(".pop_thumb_empty").length > 0 }

            this.Claim_Reward = new Button($(this._html_pop).find("button[rel=pop_thumb_claim]"))

            this.Visit = new Button($(this._html_pop).find("button[rel=pop_thumb_info]"))

            this.in_progress = function() {
                let html_pop_progress = $(this._html_pop).find(".pop_thumb_progress_bar")
                return html_pop_progress.length > 0 &&
                       window.getComputedStyle(html_pop_progress[0]).display != "none"
            }

            if (this.in_progress()) {
                let html_remaining = $(this._html_pop).find(".pop_thumb_remaining span")
                this.Timer = new Timer().fill_from_str_readable(html_remaining[0].textContent)
            }
        }

        this.pops = []
        for(let i=0;i<html_pops.length;i=i+1) {
            let pop = new PlaceOfPower(html_pops[i])
            if (! pop.is_empty_slot())
                this.pops.push(pop)
        }

        function CurrentPlaceOfPower(html_popss_tab) {
            this.Auto_Assign = new Button($(html_popss_tab).find("button[rel=pop_auto_assign]"))
            this.Start = new Button($(html_popss_tab).find("button[rel=pop_action]"))
            this.Return = new Button($(html_popss_tab).find("a.back_button span"))
            this._Finish = new Button($(html_popss_tab).find("button[rel=pop_finish]"))
        }


        this._current = null
        Object.defineProperties(this, {
            Current_PoP: {
                 get: function() { if (this._current == null) this._current = new CurrentPlaceOfPower(this._html_popss_tab); return this._current }
            }
        });
    }
}

function Battle() {
    this._html_battle = $(".canvas[id=battle]")[0]

        let html_fight_buttons = $(this._html_battle).find("button[rel=launch]")

    if (html_fight_buttons.length == 1)
        this.Fight = new Button(html_fight_buttons)
    else {
        this.Fight = new Button($(this._html_battle).find("button[rel=launch][price_fe=1]"))
        this.Fightx10 = new Button($(this._html_battle).find("button[rel=launch][price_fe=10]"))
    }

    this._html_opponent_title = $(this._html_battle).find(".battle_opponent h3")[0]
}

function Champion() {
    this._html_champion = $("section")[0]

        let html_champion_footer = $(this._html_champion).find(".champoions-bottom__footer")[0]

    this.is_ready_to_fight = function() { return $(html_champion_footer).find("button[rel=perform]").length > 0 }
    this.is_fight_break = function() { return $(html_champion_footer).find("button[action=team_reset]").length > 0 }
    this.is_fight_done = function() { return $(html_champion_footer).find("button[action=champion_reset]").length > 0 }

    if (this.is_ready_to_fight()) {
        this.Fight = new Button($(html_champion_footer).find("button[rel=perform]"))
    }

    if (this.is_fight_break()) {
            let timer_string = $(html_champion_footer).find("span[rel=timer]")[0].textContent
        this.Timer = new Timer().fill_from_str_readable(timer_string)
    }

    if (this.is_fight_done()) {
            let timer_string = $(this._html_champion).find("div[rel=timer]")[0].textContent
        this.Timer = new Timer().fill_from_str_readable(timer_string)
    }

    this.Poses = (function(html_champion) {
        let html_class_and_poses = $(html_champion).find(".champions-over__champion-info")[0]
        let jq_poses = $(html_class_and_poses).find("img")

        let poses = []
        for (let i=0; i<jq_poses.length; i=i+1)
            poses.push(jq_poses[i].src.match("(?<=/)\\w+(?=\\.png)")[0])
        return poses
    })(this._html_champion)

    this.MyGirls = (function(html_champion) {
        let html_girls = $(html_champion).find(".champions-middle__girl-selection .girl-selection__girl-box ")

        function Girl(html_girl) {
            this._html_girl = html_girl

            this.Dmg = parseInt($(this._html_girl).find("[carac=damage]")[0].getAttribute("hh_title").replace(',',''))
            this.Pose = $(this._html_girl).find("img.girl-box__pose")[0].src.match("(?<=/)\\w+(?=\\.png)")[0]
        }

        let girls = []
        for (let i=0; i<html_girls.length; i=i+1)
            girls.push(new Girl(html_girls[i]))
        return girls
    })(this._html_champion)

    this.Progress = new (function(html_champion) {
        this._html_progress = $(html_champion).find(".champions-top__wrapper .champions-top__stage .stage-progress-bar-wrapper")[0]
        let parsed_data = JSON.parse(this._html_progress.getAttribute("champion-healing-tooltip").replace(",",""))
        this.Drop = parseInt(parsed_data.amount)
        this.Current = parseInt(parsed_data.impression_info.split("/")[0])
        this.Max = parseInt(parsed_data.impression_info.split("/")[1])
    })(this._html_champion)
}

function ChampionHelp() {
    this._html_chempion_help_section = $("section")[0]

    Object.defineProperties(this, {
        Tickets: {
             get: function() { return parseInt($(this._html_chempion_help_section).find(".tickets_number_amount")[0].textContent) }
        }
    });

        let html_buttons = $(this._html_chempion_help_section).find(".enterance")
    this.Buy_x1 = new Button($(html_buttons).find("button[currency=energy_quest][amount=1]"))
    this.Buy_x1_gold = new Button($(html_buttons).find("button[currency=hard_currency][amount=1]"))
    this.Buy_x10_gold = new Button($(html_buttons).find("button[currency=hard_currency][amount=10]"))
}

function Home() {
    this._html_home_tab = $(".canvas[id=homepage]")[0]

    this.Popups = new function() {
        this._html_popups = $("#sliding-popups")[0]

        this.Monthly_Card = new (function Monthly_Card_popup(html_popups) {
            this._html_popup = $(html_popups).find("#monthly_card_received")

            this.is_present = function() { return this._html_popup.length > 0 }

            if (this.is_present()) {
                this.Collect = new Button($(this._html_popup).find("button"))
            }
        })(this._html_popups)

    }

    this.Cash = new (function(html_home_tab) {
        this._html_collect_all_group = $(html_home_tab).find("#collect_all_container")
        this.Collect = new Button($(this._html_collect_all_group).find("button"))

        let timer = $(html_home_tab).find("#collect_all_bar .in span")[0].textContent
        this.Timer = new Timer().fill_from_str_readable(timer)
    })(this._html_home_tab)
}

function Pachinko() {
    this._html_pachinko_choice = $("#content-unscaled")[0]
    this._html_pachinko_view = $("#contains_all .playing-zone")[0]

        let html_pachinko_switches = $(this._html_pachinko_choice).find(".choosing-pachinko-game")[0]
        function Pachinko_Switch(jq_pachinko_switch) {
            this._jq_pachinko_switch = jq_pachinko_switch

            this.is_present = function() { return this._jq_pachinko_switch.length > 0 }
            this.enter = function() { this._jq_pachinko_switch.click() }
            this.is_selected = function() {
                return this.is_present() &&
                       this._jq_pachinko_switch[0].getAttribute("selected")  != null
            }
        }
    this.Event = new Pachinko_Switch($(html_pachinko_switches).find("[type-pachinko=event]"))
    this.Epic = new Pachinko_Switch($(html_pachinko_switches).find("[type-pachinko=epic]"))
    this.Mythic = new Pachinko_Switch($(html_pachinko_switches).find("[type-pachinko=mythic]"))
    this.Great = new Pachinko_Switch($(html_pachinko_switches).find("[type-pachinko=great]"))

    Object.defineProperties(this, {
        Selected: { get: function() { return $(html_pachinko_switches).find("[selected]")[0].getAttribute("type-pachinko") } } })

    function Pachinko_Button(jq_button) {
        this._jq_button = jq_button
        this._button = new Button(jq_button)

        this.click = function() { this._button.click() }

        this.is_free = function() { return this._jq_button[0].getAttribute("free") == "1" }
        this.is_on_orbs = function() { return this._jq_button[0].getAttribute("orbs") == "1" }

        Object.defineProperties(this, {
            Orbs: { get: function() {
                if (this.is_on_orbs() && !this.is_free())
                    return parseInt($(this._jq_button[0]).find("span[total_orbs]")[0].textContent);
                return 0;
        } } })
    }

    function Play_Area(html_pachinko_view, current_pachinko) {
        this._html_pachinko_view = html_pachinko_view
        this._html_prizes = $(html_pachinko_view).find(".list-prizes")
        this._html_buttons = $(html_pachinko_view).find(".btns-section")

        if (current_pachinko === "event") {
            this.x4 = new Pachinko_Button($(this._html_buttons).find("button[nb_games=1]"))
        }
        else if (current_pachinko === "epic") {
            this.x1 = new Pachinko_Button($(this._html_buttons).find("button[nb_games=1][play=pachinko2\\|540\\|hard_currency]"))
            this.x10 = new Pachinko_Button($(this._html_buttons).find("button[nb_games=10][play=pachinko2\\|5400\\|hard_currency]"))
            this.x1r = new Pachinko_Button($(this._html_buttons).find("button[nb_games=1][play=pachinko4\\|6000\\|hard_currency]"))
        }
        else if (current_pachinko === "mythic") {
            this.x1 = new Pachinko_Button($(this._html_buttons).find("button[nb_games=1]"))
            this.x3 = new Pachinko_Button($(this._html_buttons).find("button[nb_games=3]"))
            this.x6 = new Pachinko_Button($(this._html_buttons).find("button[nb_games=6]"))
        }
        else if (current_pachinko === "great") {
            this.x1 = new Pachinko_Button($(this._html_buttons).find("button[nb_games=1]"))
            this.x10 = new Pachinko_Button($(this._html_buttons).find("button[nb_games=10]"))
        }
    }

    Object.defineProperties(this, {
        Play: { get: function() { return new Play_Area(this._html_pachinko_view, this.Selected) } } })
}

function Season() {
    ;
}

function Season_Arena() {
    this._html_content = $(".canvas[id=season-arena]")[0]
        let html_hero = $(this._html_content).find(".battle_hero")[0]


    function Energy(html_header, type_text) { // TODO unify this and below "Energy" ctor
        this._energy_counter_query = ".energy_counter[type=" + type_text + "]"

        let regen = "0s"
        if (type_text == "fight") regen = "30m"
        if (type_text == "quest") regen = "7m"

        this._html_energy_quest = $(html_header).find(this._energy_counter_query)[0]



        Object.defineProperties(this, {
            Current: {
                get: function() {
                    let html_span_energy = $(this._html_energy_quest).find("span[energy]")[0]
                    return parseInt(html_span_energy.textContent)
                }
            }
        })

        this.Max = parseInt($(this._energy_counter_query).find("span[rel=max]")[0].textContent)

        this.is_full = function () { return this.Current >= this.Max }

        Object.defineProperties(this, {
            Time: {
                get: function() {
                    if (this.is_full())
                        return new Timer().fill_from_int_seconds(0)
                    let time = ($(this._energy_counter_query).find("span[rel=count]")[0].textContent)
                    return new Timer().fill_from_str_readable(time)
                }
            }
        })

        this.Regeneration = new Timer().fill_from_str_readable(regen)
    }

    function make_Energy(html_hero) {
        return {
            _html_energy: $(html_hero).find(".energy_counter")[0],

            get Current() {
                let html_span_energy = $(this._html_energy).find("span[energy]")[0]
                return parseInt(html_span_energy.textContent)
            },

            Max: parseInt($(html_hero).find("span[rel=max]")[0].textContent),

            is_full: function () { return this.Current >= this.Max },

            get Time() {
                let time = $(this._html_energy).find("span[rel=count]")[0].textContent
                return new Timer().fill_from_str_readable(time)
            },
            Regeneration: new Timer().fill_from_str_readable("1h"),

        }
    }
    this.Energy_Season = make_Energy(html_hero)

        let html_oponents = $(this._html_content).find(".opponents_arena")[0]

    this.Oponents = (function() {
        let jq_oponents = $(html_oponents).find(".season_arena_opponent_container")
        let jq_fight_buttons = $(html_oponents).find(".opponent_perform_button_container")

        function Oponent(html_oponent, html_fight_button_container) {
            this._html_oponent = html_oponent
            this.Fight = new Button($(html_fight_button_container).find("button[rel=launch]"))
            this.Mojo = parseInt($(this._html_oponent).find(".slot_victory_points p")[0].textContent)
            this.Sim_Result = parseFloat($(this._html_oponent).find(".seaSimRes")[0].textContent.trim())
        }

        let oponents = []
        for (let i=0; i<jq_oponents.length; i=i+1)
            oponents.push(new Oponent(jq_oponents[i], jq_fight_buttons[i]))
        return oponents
    })()
}

Page = {
    reload: function() { document.location = document.location },
    _common: null,          get Common()        { if (this._common == null) this._common = new Common();                    return this._common },
    _shop: null,            get Shop()          { if (this._shop == null) this._shop = new Shop();                          return this._shop },
    _activities: null,      get Activities()    { if (this._activities == null) this._activities = new Activities();        return this._activities },
    _battle: null,          get Battle()        { if (this._battle == null) this._battle = new Battle();                    return this._battle },
    _champion: null,        get Champion()      { if (this._champion == null) this._champion = new Champion();              return this._champion },
    _champion_help: null,   get Champion_Help() { if (this._champion_help == null) this._champion_help = new ChampionHelp();return this._champion_help },
    _home: null,            get Home()          { if (this._home == null) this._home = new Home();                          return this._home },
    _pachinko: null,        get Pachinko()      { if (this._pachinko == null) this._pachinko = new Pachinko();              return this._pachinko },
    _season: null,          get Season()        { if (this._season == null) this._season = new Season();                    return this._season },
    _season_arena: null,    get Season_Arena()  { if (this._season_arena == null) this._season_arena = new Season_Arena();  return this._season_arena },
}

/* ====================
          Commons
   ==================== */

/* ====================
          Any
   ==================== */

function handle_any() {
    log.info("ARH/", "any page dispatched")

    let time = new Timer().fill_from_str_readable("16m").get_seconds()
    let random_deviation = Math.round(Math.random() * 60 * 2)
    time = time + random_deviation
    reload_after_sec(time, "general reload after " + new Timer().fill_from_int_seconds(time).get_readable())
}

/* ====================
          Home
   ==================== */

function handle_home() { // TODO // guard for when no monthly card
    log.info("ARH/", "home dispatched")

    function get_monthly_card() {
        if (Page.Home.Popups.Monthly_Card.is_present()) {
            Page.Home.Popups.Monthly_Card.Collect.click()
            reload_after_sec(1, "reload after monhthly card collected")
            return true
        }
        return false
    }

    function collect_free_cash() {
        if (Page.Home.Cash.Collect.is_available()) {
            Page.Home.Cash.Collect.click()
            reload_after_sec(1, "reload after collect free harem money")
            return true
        }
        else {
            Page.Home.Cash.Timer.set_on_timeout(Page.reload, "reload when free harem money available").minimum(60).start()
            return false
        }
    }

    let should_stop_here = false
    if (!should_stop_here) should_stop_here = get_monthly_card()
    if (!should_stop_here) should_stop_here = collect_free_cash()
}

/* ====================
         Pachinko
   ==================== */

function handle_pachinko() {
    log.info("ARH/", "pachinko dispatched")

    function get_free_spin(pachinko) {
        pachinko.enter()
        let play = Page.Pachinko.Play
        if (play.x1.is_free()) {
            play.x1.click()
            return true
        }
        return false
    }


    let should_reload = false
    should_reload = should_reload || get_free_spin(Page.Pachinko.Mythic)
    should_reload = should_reload || get_free_spin(Page.Pachinko.Great)
    Page.Pachinko.Mythic.enter()

    if (should_reload)
        reload_after_sec(1, "reload because all pachinko free spins collected")
    else
        reload_after_sec(60*60, "reload for any changes")
}

/* ====================
        Activities : contests, missions, places of power
   ==================== */

function handle_activities() {
    log.info("ARH/", "activities dispatched")

    function start_next_mission() {

        let missions = Page.Activities.Missions.missions;

        let need_instant_reload = false

        if (missions.length > 0) {

            let comparator_by_time = (m1, m2) => m1.Duration.get_seconds() - m2.Duration.get_seconds()
            let can_claim = m => m.Claim_Reward.is_available()
            let can_start = m => m.Start.is_available()
            missions.sort(comparator_by_time)

            let to_start = missions.filter(can_start)
            if (to_start.length > 0) {
                to_start[0].Start.click()
                need_instant_reload = true
            }

            let in_progress = missions.filter(m => !can_start(m) && !can_claim(m))
            if (in_progress.length > 0) {
                in_progress[0].ends_in().set_on_timeout(Page.reload, "reload when mission done").start()
            }

            let to_claim = missions.filter(can_claim)
            if (to_claim.length > 0) {
                to_claim.forEach(m=>m.Claim_Reward.click())
                need_instant_reload = true
            }
        } else {
            let done = Page.Activities.Missions.Done
            if (done.is_final_gift_available()) {
                done.Claim_Gift.click()
                need_instant_reload = true
            }
            done.ends_in().set_on_timeout(Page.reload, "reload when new missions available").start()
        }

        if (need_instant_reload) reload_after_sec(1, "reload because missions claimed/started")
        return need_instant_reload
    }

    function collect_contests_rewards() {

        let contests = Page.Activities.Contests.contests;

        let need_instant_reload = false

        if (contests.length > 0) {

            let comparator_by_time = (c1, c2) => c1.ends_in().get_seconds() - c2.ends_in().get_seconds()

            let in_progress = contests.filter(c => c.in_progress())
            in_progress.sort(comparator_by_time)
            if (in_progress.length > 0) {
                in_progress[0].ends_in().set_on_timeout(Page.reload, "reload when mission done").minimum(60).start()
            }

            let to_claim = contests.filter(c => c.is_ended())
            if (to_claim.length > 0) {
                to_claim.forEach(c=>c.Claim_Reward.click())
                need_instant_reload = true
            }

        } else {
            let done = Page.Activities.Contests.Done
            done.ends_in().set_on_timeout(Page.reload, "reload when new contests available").start()
        }

        if (need_instant_reload) reload_after_sec(1, "reload because contests claimed")
        return need_instant_reload
    }

    function start_next_place_of_power() {

        let pops = Page.Activities.Places_Of_Power.pops;

        let need_instant_reload = false
        let stop_without_reload = false

        function handle() {

            let to_claim = pops.filter(p => p.Claim_Reward.is_available())
            if (to_claim.length > 0) {
                to_claim[0].Claim_Reward.click()
                need_instant_reload = true
                return
            }

            let can_start = p => p.Visit.is_available() && !p.in_progress()
            let to_start = pops.filter(can_start)
            if (to_start.length > 0) {
                to_start[0].Visit.click()
                stop_without_reload = true
                return
            }

            let comparator_by_time = (p1, p2) => p1.Timer.get_seconds() - p2.Timer.get_seconds()
            let in_progress = pops.filter(p => p.in_progress())
            in_progress.sort(comparator_by_time)
            if (in_progress.length > 0) {
                in_progress[0].Timer.set_on_timeout(Page.reload, "reload when place of power done").start()
            }

        };handle()

        if (need_instant_reload) reload_after_sec(1, "reload because PoP claimed")
        return need_instant_reload || stop_without_reload
    }

    let should_stop_here = false
    if (!should_stop_here) should_stop_here = start_next_mission()
    if (!should_stop_here) should_stop_here = collect_contests_rewards()
    if (!should_stop_here) should_stop_here = start_next_place_of_power()
}

/* ====================
        Activities - place of power
   ==================== */

function handle_pop() {
    log.info("ARH/", "place of power dispatched")

    let pop = Page.Activities.Places_Of_Power.Current_PoP

    if (pop.Auto_Assign.is_available()) {
        pop.Auto_Assign.click()
        pop.Start.click()
        pop.Return.click()
        run_after_sec(5, () => pop.Return.click(), "return from PoP [failsafe]")
    }
    run_after_sec(60, () => pop.Return.click(), "return from PoP [fail-failsafe]")
}

/* ====================
         Leagues
   ==================== */

function handle_league() { // TODO //
    log.info("ARH/", "league dispatched")
}

/* ====================
          Harem
   ==================== */

function handle_harem() { // TODO // ?
    log.info("ARH/", "harem dispatched")
}

/* ====================
          Battle
   ==================== */

function handle_battle() {
    log.info("ARH/", "battle dispatched")
}

/* ====================
     Battle - Troll
   ==================== */

function handle_battle_troll() {
    log.info("ARH/", "troll battle dispatched")

    function add_link_back_to_troll_world() {
        let title = Page.Battle._html_opponent_title
        let a = document.createElement("a")
        let troll_id = parseInt(window.location.search.split("=")[1])
        a.href = window.location.origin + "/world/" + (troll_id+1)
        a.style.textDecoration = "none";
        a.style.color = "inherit"
        a.onclick = e => e.stopPropagation() // this is a workaround for TPS script BS way of doing this
        let c0 = title.children[0]
        let c1 = title.children[1]
        title.removeChild(c0)
        title.removeChild(c1)
        a.textContent = title.textContent.trim()
        title.textContent = ""
        title.appendChild(c0)
        title.appendChild(a)
        title.appendChild(c1)
    }

    add_link_back_to_troll_world()

    if (Page.Common.Energy_Fight.Current > 0) {
        if (Page.Common.Energy_Fight.Current >= 10)
            Page.Battle.Fightx10.click()
        else
            Page.Battle.Fight.click()

        reload_after_sec(1, "reload because troll fight")
    }
    else {
        Page.Common.Energy_Fight.Time.set_on_timeout(Page.reload, "reload when 1 combat energy regenerated").minimum(5).start()
    }
}

/* ====================
     Battle - Season
   ==================== */

function handle_battle_season() {
    log.info("ARH/", "season battle dispatched")

    reload_after_sec(1, "reload because season fight")
}

/* ====================
     Battle - League
   ==================== */

function handle_battle_league() {
    log.info("ARH/", "league battle dispatched")

    Page.Battle.Fight.click()
    if (Page.Common.Popups.no_energy_challenge)
        window.location.pathname = "/tower-of-fame.html"
    else
        reload_after_sec(1, "reload because league fight")
}

/* ====================
      Market / Shop
   ==================== */

function handle_shop() {
    log.info("ARH/", "shop dispatched")

    function add_gift_all_click() {
        function on_dbl_click() {
            let selected_shop = null
            if (Page.Shop.Equipment.is_selected()) { this.click(); return; }
            if (Page.Shop.Boosters.is_selected()) { this.click(); return; }
            if (Page.Shop.Books.is_selected())
                selected_shop = Page.Shop.Books
            if (Page.Shop.Gifts.is_selected())
                selected_shop = Page.Shop.Gifts

            function abort_condition_for_stack() {
                var selected_item = selected_shop.Have.filter(s => s.is_selected())[0]
                let abort =
                    selected_item.Rarity.is_common() && selected_item.Amount <= 0 ||
                    selected_item.Rarity.is_rare() && selected_item.Amount <= 0 ||
                    selected_item.Rarity.is_epic() && selected_item.Amount <= 1 ||
                    selected_item.Rarity.is_legendary() && selected_item.Amount <= 1
                if (abort)
                    log.info("ARH/", "stack depleated")
                return abort
            }

            function abort_condition_for_button() {
                let abort = !Page.Shop.Use.is_available()
                if (abort)
                    log.info("ARH/", "'Offer' button unavailable")
                return abort
            }

            function abort_condition_for_girl_xp_level(level_cap) {
                let abort = false
                if (!Page.Shop.Books.is_selected())
                    return abort

                if (Page.Shop.Girls.Selected.Level >= level_cap) {
                    abort = true
                    log.info("ARH/", "girls level cap reached")
                }
                return abort
            }

            function abort_condition(level_cap) {
                return abort_condition_for_stack() || abort_condition_for_button() || abort_condition_for_girl_xp_level(level_cap)
            }

            function select_girl_level_cap() {
                let girl_level_cap = 1000
                if (Page.Shop.Girls.Selected.Level < 500)
                    girl_level_cap = 500
                if (Page.Shop.Girls.Selected.Level < 450)
                    girl_level_cap = 450
                if (Page.Shop.Girls.Selected.Level < 400)
                    girl_level_cap = 400
                if (Page.Shop.Girls.Selected.Level < 350)
                    girl_level_cap = 350
                if (Page.Shop.Girls.Selected.Level < 300)
                    girl_level_cap = 300
                return girl_level_cap
            }

            // log.info("ARH/", "selected level cap", select_girl_level_cap())

            let girl_level_cap = select_girl_level_cap()
            until(() => abort_condition(girl_level_cap), () => {
                Page.Shop.Use.click()
                // log.info("ARH/", "level", Page.Shop.Girls.Selected.Level)
            }, .2)
        }
        Page.Shop.Use._jq_button[0].ondblclick = on_dbl_click
    }

    function buy_all_stock(market_page, shop) {
        let stock_to_buy = shop.Stock.filter(a=>!a.is_empty())
        if (! shop.is_stock_empty())
        {
            log.info("ARH/", "buy all stack of", stock_to_buy.length, "items")
            shop.enter()
            stock_to_buy[0].select()
            until(() => shop.is_stock_empty(),
                  () => market_page.Buy.click(),
                  1, () => Page.reload())
            return true
        }
        return false
    }

    function buy_items_until_limit(market_page, shop, item_id, limit) {
        let stock_to_buy = shop.Stock.filter(a => !a.is_empty())
        let filtered_stock_to_buy = stock_to_buy.filter(a => a.Item_Id == item_id)
        let items_i_have = shop.Have.filter(a => a.Item_Id == item_id)
        let amount_i_have = 0
        if (items_i_have.length > 0)
            amount_i_have = items_i_have[0].Amount

        if (filtered_stock_to_buy.length > 0 && amount_i_have < limit)
        {
            log.info("ARH/", "buy stack of up to", filtered_stock_to_buy.length, "items of id", item_id)
            shop.enter()
            until(function(){ return filtered_stock_to_buy.length == 0 || amount_i_have >= limit},
                  function(){ filtered_stock_to_buy[0].select()
                              Page.Shop.Buy.click()
                              filtered_stock_to_buy = filtered_stock_to_buy.slice(1) },
                  1, () => Page.reload())
            return true
        }
        return false
    }

    function max_all_stats() {

        let stats = Page.Shop.Stats
        function all_stats_maxed() { return stats.Charm.is_maxed() && stats.Hardcore.is_maxed() && stats.KnowHow.is_maxed() }
        let result = ! all_stats_maxed()

        function max_stat(stat) {
            if (stat.is_maxed()) {
                log.info("ARH/", "stat", stat.Name, "MAXED")
                return
            }

            function stats_maxed_callback() { if (all_stats_maxed()) Page.reload() }

            until(() => stat.is_maxed(),
                  () => stat.Plus.click(),
                  .3, stats_maxed_callback)
        }

        max_stat(stats.Charm)
        max_stat(stats.Hardcore)
        max_stat(stats.KnowHow)

        return result
    }

    add_gift_all_click()
    let should_stop_here = false

    if (Page.Shop.Gifts.is_selected()) {
        log.info("ARH/", "on girl affection page - no auto-buy, no auto-max stats")
        return
    }

    if (!should_stop_here) should_stop_here = buy_all_stock(Page.Shop, Page.Shop.Books)
    if (!should_stop_here) should_stop_here = buy_all_stock(Page.Shop, Page.Shop.Gifts)
    if (!should_stop_here) should_stop_here = buy_items_until_limit(Page.Shop, Page.Shop.Boosters, Page.Shop.Boosters.Pool.Legendary.Ginseng, 100)
    if (!should_stop_here) should_stop_here = buy_items_until_limit(Page.Shop, Page.Shop.Boosters, Page.Shop.Boosters.Pool.Legendary.Corodyceps, 100)
    if (!should_stop_here) should_stop_here = max_all_stats()
}

/* ====================
       Champions Map
   ==================== */

function handle_champions_map() {
    log.info("ARH/", "champions map dispatched")
}

/* ====================
       Champions Help
   ==================== */

function handle_champion_help() {
    log.info("ARH/", "champions help dispatched")

    function buy_next_ticket() {
        if (Page.Common.Energy_Quest.Current >= 60) {
            Page.Champion_Help.Buy_x1.click()
            reload_after_sec(1, "reload due to champion ticket bought")
            return true
        }
        return false
    }

    function set_regen_timer() {
        let quest = Page.Common.Energy_Quest
        let to_regen = 60 - quest.Current - 1
        let time_to_regen = to_regen * quest.Regeneration.get_seconds() + quest.Time.get_seconds()
        let timer_to_regen = new Timer().fill_from_int_seconds(time_to_regen).set_on_timeout(
            () => Page.reload(), "reload when have enough energy to buy next Champion ticket").start()
        return false
    }

    let should_stop_here = false
    if (!should_stop_here) should_stop_here = buy_next_ticket()
    if (!should_stop_here) should_stop_here = set_regen_timer()
}

/* ====================
      Champions Fight
   ==================== */

function handle_champion() { // TODO // ?
    log.info("ARH/", "champion dispatched")

    function should_start_the_fight() { return Page.Champion.Progress.Current > 0 }

    function fight_champion() {
        if (Page.Champion.is_ready_to_fight()) {
            if (should_start_the_fight()) {
                Page.Champion.Fight.click()
                reload_after_sec(1, "reload because champion fight")
                return true
            }
        }
        else if (Page.Champion.is_fight_break()) {
            Page.Champion.Timer.set_on_timeout(Page.reload, "reload after champion fight break").start()
        }
        else if (Page.Champion.is_fight_done()) {
            Page.Champion.Timer.set_on_timeout(Page.reload, "reload after champion rested a day").start()
        }
        return false
    }

    let should_stop_here = false
    if (!should_stop_here) should_stop_here = fight_champion()
}

/* ====================
         Season
   ==================== */

function handle_season() { // TODO //
    log.info("ARH/", "season dispatched")
}

/* ====================
      Season Arena
   ==================== */

function handle_arena() {
    log.info("ARH/", "season_arena dispatched")

    function add_auto_fight_button() {
        function fight_next_oponent(event) {
            event.stopPropagation()
            let can_win = o => o.Sim_Result > 0
            let gt_mojo = (r,l) => l.Mojo - r.Mojo
            Page.Season_Arena.Oponents.filter(can_win).sort(gt_mojo)[0].Fight.click()
        }

        function make_kiss_img() {
            let kiss_img = document.createElement("img")
            kiss_img.classList.add("kiss_icon_s")
            kiss_img.src = "https://hh2.hh-content.com/pictures/design/ic_kiss.png"
            kiss_img.style.marginLeft = "10px"
            kiss_img.style.transform = "scale(1.5)"
            return kiss_img
        }

        function make_autofight_button() {
            let auto_fight_button=document.createElement("button")
            auto_fight_button.classList.add("green_button_L", "btn_season_perform", "alabama")
            auto_fight_button.style.marginLeft = "10px"
            auto_fight_button.style.height = "40px"
            auto_fight_button.style.padding = "5px 20px"
            auto_fight_button.textContent = "Auto Perform! 1x"
            return auto_fight_button
        }

        if ($(".opponents_arena .alabama").length > 0)
            return $(".opponents_arena .alabama")[0]

        let bar=$(".opponents_arena")[0].children[0]

        let refresh_button=bar.children[1]
        refresh_button.style.top = "0px"

        let auto_fight_button = make_autofight_button()
        auto_fight_button.appendChild(make_kiss_img())
        auto_fight_button.onclick = fight_next_oponent

        bar.appendChild(auto_fight_button)
        return auto_fight_button
    }

    let autofight_button = add_auto_fight_button()

    if (Page.Season_Arena.Energy_Season.Current > 0) {
        run_after_sec(1, () => autofight_button.click(), "fight season oponent")
    } else {
        Page.Season_Arena.Energy_Season.Time.set_on_timeout(Page.reload, "reload when 1 season energy regenerated").minimum(5).start()
        autofight_button.setAttribute("disabled", null)
        // autofight_button.removeAttribute("disabled")
    }
}

/* ====================
           MAIN
   ==================== */

function main() {
    dispatcher.dispatch(window.location.pathname, window.location.search)
}

/* ====================
           END
   ==================== */

main();

})(); // anonymus namespace end

/*/ TODO // consider incorporate this snippet

function remove_gear_tier(tier)
{
    let inv = $(".armor .inventory_slots")[0].children[0]
    let gear = $(inv).find(".slot."+tier)
    gear.each(i => inv.removeChild(gear[i]), null)
}
remove_gear_tier("legendary")
remove_gear_tier("epic")
$(".armor .inventory_slots .slot").length

/*/

/*/

var log = console;

var doNothing = ()=>{};
var noAdditionalConditions = ()=>{return false;};

function times(howmany, action, interval=0.2, alternativeAbortCondition=noAdditionalConditions, actionAfter=doNothing) {
    var counter = 0;
    var timerId = 0;
    var sleepTime = interval*1000;
    timerId = setInterval(step, sleepTime);
    function step()
    {
        if (counter<howmany && ! alternativeAbortCondition())
        {
            action();
            log.debug("ARH/", "times action", counter);
            counter++;
        } else {
            clearInterval(timerId);
            actionAfter();
        }
    }
}




a=$(".contest.is_legendary .donate button[data-price=10000000]")[0]
times(0, ()=>a.click())

/*/
