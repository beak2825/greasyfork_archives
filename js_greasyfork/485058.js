// ==UserScript==
// @name            Hentai Heroes+++
// @description     Few QoL improvement and additions for competitive PvP players.
// @version         0.20.1
// @match           https://*.hentaiheroes.com/*
// @match           https://nutaku.haremheroes.com/*
// @match           https://*.gayharem.com/*
// @match           https://*.comixharem.com/*
// @match           https://*.hornyheroes.com/*
// @match           https://*.pornstarharem.com/*
// @match           https://*.transpornstarharem.com/*
// @match           https://*.gaypornstarharem.com/*
// @run-at          document-body
// @namespace       https://gitlab.com/hentaiheroes/hh-plus-plus-plus
// @grant           none
// @license         MIT
// @author          430i
// @downloadURL https://update.greasyfork.org/scripts/485058/Hentai%20Heroes%2B%2B%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/485058/Hentai%20Heroes%2B%2B%2B.meta.js
// ==/UserScript==


const {$, location, localStorage: storage} = window;

// localStorage keys
const LS_CONFIG_NAME = 'HHPlusPlusPlus'
const LEAGUE_BASE_KEY = LS_CONFIG_NAME + ".League";
const LEAGUE_SNAPSHOT_BASE_KEY = LEAGUE_BASE_KEY + ".Snapshot";
const CURRENT_LEAGUE_SNAPSHOT_KEY = LEAGUE_SNAPSHOT_BASE_KEY + ".Current";
const PREVIOUS_LEAGUE_SNAPSHOT_KEY = LEAGUE_SNAPSHOT_BASE_KEY + ".Previous";
const LEAGUE_PLAYERS_KEY = LEAGUE_BASE_KEY + ".Players";
const EQUIPMENT_KEY = LS_CONFIG_NAME + ".Equipment";
const EQUIPMENT_CURRENT_KEY = EQUIPMENT_KEY + ".Current";
const EQUIPMENT_BEST_MYTHIC_KEY = EQUIPMENT_KEY + ".Mythic";

// 3rd party localStorage keys
const LS_CONFIG_HHPLUSPLUS_NAME = 'HHPlusPlus'
const HHPLUSPLUS_OPPONENT_FILTER = LS_CONFIG_HHPLUSPLUS_NAME + "OpponentFilter"

// CONFIG
const MAX_NUM_SNAPSHOTS = 230;
const BOOSTER_EXPIRATION_MULTIPLIER = 1.01;

// icon paths
const PATH_GROUPS = '<path d="M4,13c1.1,0,2-0.9,2-2c0-1.1-0.9-2-2-2s-2,0.9-2,2C2,12.1,2.9,13,4,13z M5.13,14.1C4.76,14.04,4.39,14,4,14 c-0.99,0-1.93,0.21-2.78,0.58C0.48,14.9,0,15.62,0,16.43V18l4.5,0v-1.61C4.5,15.56,4.73,14.78,5.13,14.1z M20,13c1.1,0,2-0.9,2-2 c0-1.1-0.9-2-2-2s-2,0.9-2,2C18,12.1,18.9,13,20,13z M24,16.43c0-0.81-0.48-1.53-1.22-1.85C21.93,14.21,20.99,14,20,14 c-0.39,0-0.76,0.04-1.13,0.1c0.4,0.68,0.63,1.46,0.63,2.29V18l4.5,0V16.43z M16.24,13.65c-1.17-0.52-2.61-0.9-4.24-0.9 c-1.63,0-3.07,0.39-4.24,0.9C6.68,14.13,6,15.21,6,16.39V18h12v-1.61C18,15.21,17.32,14.13,16.24,13.65z M8.07,16 c0.09-0.23,0.13-0.39,0.91-0.69c0.97-0.38,1.99-0.56,3.02-0.56s2.05,0.18,3.02,0.56c0.77,0.3,0.81,0.46,0.91,0.69H8.07z M12,8 c0.55,0,1,0.45,1,1s-0.45,1-1,1s-1-0.45-1-1S11.45,8,12,8 M12,6c-1.66,0-3,1.34-3,3c0,1.66,1.34,3,3,3s3-1.34,3-3 C15,7.34,13.66,6,12,6L12,6z"/>';
const PATH_GROUP = '<path d="M9 13.75c-2.34 0-7 1.17-7 3.5V19h14v-1.75c0-2.33-4.66-3.5-7-3.5zM4.34 17c.84-.58 2.87-1.25 4.66-1.25s3.82.67 4.66 1.25H4.34zM9 12c1.93 0 3.5-1.57 3.5-3.5S10.93 5 9 5 5.5 6.57 5.5 8.5 7.07 12 9 12zm0-5c.83 0 1.5.67 1.5 1.5S9.83 10 9 10s-1.5-.67-1.5-1.5S8.17 7 9 7zm7.04 6.81c1.16.84 1.96 1.96 1.96 3.44V19h4v-1.75c0-2.02-3.5-3.17-5.96-3.44zM15 12c1.93 0 3.5-1.57 3.5-3.5S16.93 5 15 5c-.54 0-1.04.13-1.5.35.63.89 1 1.98 1 3.15s-.37 2.26-1 3.15c.46.22.96.35 1.5.35z"/>';
const PATH_CLEAR = '<path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>';

class EquipmentCollector {
    static collect() {
        if (!HHPlusPlus.Helpers.isCurrentPage('shop')) {
            return;
        }

        HHPlusPlus.Helpers.defer(() => {
            setTimeout(() => {
                EquipmentCollector.collectEquipmentData();
            }, 250);

            HHPlusPlus.Helpers.onAjaxResponse(/action=market_equip_armor*/, EquipmentCollector.onEquipmentChange);
        });
    }

    static onEquipmentChange(data) {
        // We need to delay the execution a bit to give chance to the native callback to run.
        setTimeout(() => {
            // The is a bug in HH (quelle surprise) when swapping equipments - the native callbacks adds the
            // unequipped armor to the back of the inventory ('player_inventory'), but the equipped armor is not
            // removed, which leaves an inconsistent state, so we need to remove it ourselves.
            EquipmentCollector.removeEquippedArmorFromInventory(data.equipped_armor);
            EquipmentCollector.collectEquipmentData();
        }, 100);
    }

    static removeEquippedArmorFromInventory(equipped) {
        const idx = player_inventory.armor.findIndex(e => {
            return e.item.rarity == "mythic" &&
                   e.resonance_bonuses.class.bonus == equipped.resonance_bonuses.class.bonus &&
                   e.resonance_bonuses.class.identifier == equipped.resonance_bonuses.class.identifier &&
                   e.resonance_bonuses.class.resonance == equipped.resonance_bonuses.class.resonance &&
                   e.resonance_bonuses.theme.bonus == equipped.resonance_bonuses.theme.bonus &&
                   e.resonance_bonuses.theme.identifier == equipped.resonance_bonuses.theme.identifier &&
                   e.resonance_bonuses.theme.resonance == equipped.resonance_bonuses.theme.resonance &&
                   e.skin.id_item_skin === equipped.skin.id_item_skin &&
                   e.skin.id_skin_set === equipped.skin.id_skin_set &&
                   e.skin.identifier === equipped.skin.identifier &&
                   e.skin.name === equipped.skin.name &&
                   e.skin.subtype === equipped.skin.subtype;
        });

        // player_inventory.armor[idx] = data.unequipped_armor;
        player_inventory.armor.splice(idx, 1);
    }

    static collectEquipmentData() {
        EquipmentCollector.collectPlayerEquipment();
        EquipmentCollector.collectBestMythicEquipment();
    }

    static collectPlayerEquipment() {
        const eqElements = $("div#equiped.armor-container div.slot:not(:empty)[subtype!='0']");
        if (eqElements.length != 6) {
            console.log("Did not find 6 equipment elements.");
            return;
        }

        const equipment = eqElements.map(function() { return $(this).data("d")}).get();
        const equipmentStripped = equipment.map((e) => {
            return {
                id: e.id_member_armor_equipped || e.id_member_armor, // unique item identifier?
                rarity: e.item.rarity, // legendary, mythic
                type: e.item.type, // always "armor"
                skin_id: e.skin.identifier, // EH13, ET21 etc
                subtype: parseInt(e.skin.subtype), // 1, 2, 3, 4, 5 or 6
                carac1: parseInt(e.caracs.carac1),
                carac2: parseInt(e.caracs.carac2),
                carac3: parseInt(e.caracs.carac3),
                harmony: parseInt(e.caracs.chance),
                endurance: parseInt(e.caracs.endurance),
                bonuses: e.resonance_bonuses,
            };
        });

        window.localStorage.setItem(EQUIPMENT_CURRENT_KEY, JSON.stringify(equipmentStripped));
    }

    static collectBestMythicEquipment() {
        const hero = window.Hero ?? shared.Hero;

        const equipment = player_inventory.armor
            .filter(a => a.item.rarity == "mythic")
            .filter(a => parseInt(a.resonance_bonuses.class.identifier) == hero.infos.class)
            .filter(a => a.resonance_bonuses.class.resonance == "damage")
            .filter(a => a.resonance_bonuses.theme.resonance == "defense");

        window.localStorage.setItem(EQUIPMENT_BEST_MYTHIC_KEY, JSON.stringify(equipment));
    }

    static getCurrent() {
        return JSON.parse(window.localStorage.getItem(EQUIPMENT_CURRENT_KEY)) || [];
    }

    static getBestMythic() {
        return JSON.parse(window.localStorage.getItem(EQUIPMENT_BEST_MYTHIC_KEY)) || [];
    }
}

class LeaguePlayersCollector {
    static collect() {
        if (!HHPlusPlus.Helpers.isCurrentPage('leagues')) {
            return;
        }

        HHPlusPlus.Helpers.defer(() => {
            HHPlusPlus.Helpers.onAjaxResponse(/action=fetch_hero&id=profile/, LeaguePlayersCollector.collectPlayerPlacementsFromAjaxResponse);
            LeaguePlayersCollector.collectPlayerData();
        });
    }

    static collectPlayerPlacementsFromAjaxResponse(response, opt) {
        // If you are reading this, please look away, ugly code below
        // The mythic equipment data is actually not in the html, but in the form of a script that we have to eval
        const html = $("<div/>").html(response.html);
        $.globalEval(html.find('script').text()); // creates 'hero_items'

        const id = html.find("div.ranking_stats .id").text().match(/\d+/)[0];
        const username = html.find(".hero_info h3 .hero-name").text();
        const level = html.find('div[hero="level"]').text().trim();
        const number_mythic_equipment = Object.values(hero_items).filter(i => i.item.rarity == "mythic").length;
        const d3_placement = $("<div/>")
                            .html(html)
                            .find('div.history-independent-tier:has(img[src*="/9.png"]) span') // 9.png is D3
                            .map(function() {return parseInt($(this).text().trim().match(/\d+/));})
                            .get();

        if (!id || !username || !level) {
            window.popup_message("Error when parsing player data.");
            return;
        }

        if (!d3_placement || d3_placement.length != 2) {
            // make sure our parser is working by checking the D2 data
            const d2_placement = $("<div/>")
                                    .html(html)
                                    .find('div.history-independent-tier:has(img[src*="/8.png"]) span') // 8.png is D2
                                    .map(function() {return parseInt($(this).text().trim().match(/\d+/));})
                                    .get();

            if (d2_placement.length != 2) {
                window.popup_message("Error when parsing D2 player data.");
            }

            d3_placement.push(-1, 0);
        }

        const data = {
            id: parseInt(id),
            number_mythic_equipment,
            best_placement: d3_placement[0],
            placement_count: d3_placement[1],
        };

        LeaguePlayersCollector.storePlayerData(data);
        $(document).trigger('player:update-profile-data', {id: data.id})
    }

    static collectPlayerData() {
        for (var r = 0, n = window.opponents_list.length; r < n; r++) {
            const player = window.opponents_list[r];

            const girls = player.player.team.girls;
            const girl_levels = girls.map(g => g.level);
            const girl_levels_max = Math.max(...girl_levels);
            const girl_levels_total = girl_levels.reduce((a, b) => a + b, 0);
            const girl_levels_avg = Math.floor(girl_levels_total / girl_levels.length);

            const data = {
                id: parseInt(player.player.id_fighter),
                username: player.player.nickname,
                level: parseInt(player.player.level),
                damage: player.player.damage,
                defense: player.player.defense,
                harmony: player.player.chance,
                ego: player.player.remaining_ego,
                power: player.player.team.total_power,
                club_id: player.player.club?.id_club,
                club_name: `"${player.player.club?.name || ''}"`,
                girl_levels_avg,
                girl_levels_max,
            }

            LeaguePlayersCollector.storePlayerData(data);
        }
    }

    static storePlayerData(data) {
        const players = JSON.parse(storage.getItem(LEAGUE_PLAYERS_KEY)) || {};
        if (players[data.id] == undefined) {
            players[data.id] = {};
        }

        Object.assign(players[data.id], data);

        storage.setItem(LEAGUE_PLAYERS_KEY, JSON.stringify(players));
    }

    static export() {
        const columns = [
            "id",
            "username",
            "level",
            "damage",
            "defense",
            "harmony",
            "ego",
            "power",
            "club_id",
            "club_name",
            "girl_levels_max",
            "girl_levels_avg",
            "expected_points",
            "number_mythic_equipment",
            "best_placement",
            "placement_count",
        ]

        const players = JSON.parse(storage.getItem(LEAGUE_PLAYERS_KEY)) || {};
        const data = Object.values(players).map(player => columns.map(column => player[column]));

        console.log([columns].concat(data).map(t => t.join(",")).join("\n"));
    }

    static clear() {
        storage.removeItem(LEAGUE_PLAYERS_KEY);
    }
}

class MyModule {
    constructor ({name, configSchema}) {
        this.group = '430i'
        this.name = name
        this.configSchema = configSchema
        this.hasRun = false

        this.insertedRuleIndexes = []
        this.sheet = HHPlusPlus.Sheet.get()
    }

    insertRule (rule) {
        this.insertedRuleIndexes.push(this.sheet.insertRule(rule))
    }

    tearDown () {
        this.insertedRuleIndexes.sort((a, b) => b-a).forEach(index => {
            this.sheet.deleteRule(index)
        })

        this.insertedRuleIndexes = []
        this.hasRun = false
    }
}

class LeagueScoutModule extends MyModule {
    constructor () {
        const baseKey = 'leagueScout'
        const configSchema = {
            baseKey,
            default: true,
            label: `Gather information about league opponents`,
        }
        super({name: baseKey, configSchema})
    }

    shouldRun() {return HHPlusPlus.Helpers.isCurrentPage('leagues')}

    run () {
        if (this.hasRun || !this.shouldRun()) {return}

        $(document).on('league:rollover', () => {
            const data = LeagueScoutModule.getCurrent();

            LeagueScoutModule.deleteCurrent();
            LeagueScoutModule.setPrevious(data);
            LeaguePlayersCollector.clear();
        })

        HHPlusPlus.Helpers.defer(() => {
            // read and store data
            this.storeSnapshot(this.readSnapshot());

            // create ui elements
            HHPlusPlus.Helpers.doWhenSelectorAvailable('.league_buttons_block', () => {
                const parent = $('div.league_buttons');
                this.createDownloadButton(parent, PREVIOUS_LEAGUE_SNAPSHOT_KEY, PATH_GROUPS);
                this.createClearButton(parent, PREVIOUS_LEAGUE_SNAPSHOT_KEY);
                this.createDownloadButton(parent, CURRENT_LEAGUE_SNAPSHOT_KEY, PATH_GROUP);
                this.createClearButton(parent, CURRENT_LEAGUE_SNAPSHOT_KEY);
            });
        });

        this.hasRun = true;
    }

    readPlayerData() {
        const data = {};

        for (var r = 0, n = window.opponents_list.length; r < n; r++) {
            const player = window.opponents_list[r];

            const id = parseInt(player.player.id_fighter);
            const name = player.player.nickname;
            const country = player.country;
            const level = parseInt(player.player.level);

            const entry = {id, name, country, level};
            if (Object.values(entry).some(x => x == undefined || (typeof x !== 'string' && !Array.isArray(x) && isNaN(x)))) {
                console.log('Some player data is missing, maybe the opponents_list data structure changed?');
                console.log(entry);
            }

            data[id] = {name, country, level};
        }

        return data;
    }

    readSnapshot() {
        const data = [];

        for (var r = 0, n = window.opponents_list.length; r < n; r++) {
            const player = window.opponents_list[r];

            const id = parseInt(player.player.id_fighter);
            const rank = player.place;
            const points = parseInt(player.player_league_points);
            const elements = player.player.team.theme;

            const damage = player.player.damage;
            const defense = player.player.defense;
            const ego = player.player.remaining_ego;
            const chance = player.player.chance;
            const power = player.player.team.total_power;

            // Take only the first two chars of the booster names, as those should be unique. Assume all are legendary.
            const boosters = player.boosters.filter(b => b.expiration > 0).map(b => b.item.name.slice(0, 2))

            // Create player snapshot and validate it.
            const entry = {id, rank, elements, points, power, damage, defense, ego, chance, boosters};
            if (Object.values(entry).some(x => x == undefined || (typeof x !== 'string' && !Array.isArray(x) && isNaN(x)))) {
                console.log('Some player data is missing, maybe the opponents_list data structure changed?');
                console.log(entry);
            }

            data.push(entry);
        }

        // Sort the parsed data by rank.
        data.sort((a, b) => a.rank > b.rank);

        return data;
    }

    storeSnapshot(snapshot_data) {
        var data = LeagueScoutModule.getCurrent();

        const current_date = new Date(window.server_now_ts * 1000);
        const league_end_date = new Date(window.server_now_ts * 1000 + window.season_end_at * 1000);

        // Create the initial container data structure
        if (Object.keys(data).length == 0) {
            data = {
                league_end: league_end_date,
                num_players: data.length,
                player_data: this.readPlayerData(),
                snapshots: [],
            }
        }

        const snapshot = {
            date: current_date,
            snapshot: snapshot_data,
        }

        if (data.snapshots.length && JSON.stringify(data.snapshots[data.snapshots.length - 1].snapshot) === JSON.stringify(snapshot.snapshot)) {
            return;
        }

        if (data.snapshots.length >= MAX_NUM_SNAPSHOTS) {
            var previous = LeagueScoutModule.getPrevious();

            // delete an entry either from the previous league snapshots or from the current
            if (previous && previous.snapshots && previous.snapshots.length > 0) {
                previous.snapshots.shift()
                LeagueScoutModule.setPrevious(previous);
            } else {
                data.snapshots.shift();
            }
        }

        data.snapshots.push(snapshot);
        LeagueScoutModule.setCurrent(data);
    }

    createButton(id, path) {
        return `<svg id="${id}" class="blue_button_L" width="32" height="32" style="padding: 5px" xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" viewBox="0 0 24 24" fill="#FFFFFF"><g><rect fill="none" height="24" width="24"/></g><g>${path}</g></svg>`
    }

    createDownloadButton(parent, what, icon) {
        if (!storage.getItem(what)) {
            return;
        }

        const friendlyId = what.toLowerCase().replaceAll(".", "-");
        const buttonId = `download-${friendlyId}`;

        const downloadButton = this.createButton(buttonId, icon);
        parent.append(downloadButton);

        $(document.body).on('click', `#${buttonId}`, () => {
            const data = LeagueScoutModule.get(what);

            const separator = ","
            const columns = ["date", "player_id", "player_name", "player_rank", "player_points", "player_power", "player_damage", "player_defense", "player_ego", "player_chance", "player_boosters"];
            const values = data.snapshots.flatMap((e) => e.snapshot.map((p) => [e.date, p.id, data.player_data[p.id].name, p.rank, p.points, p.power, p.damage, p.defense, p.ego, p.chance, `"${p.boosters.join(",")}"`].join(separator)));

            let csvContent = `sep=${separator}\n` + columns.join(separator) + "\n" + values.join("\n");

            var element = document.createElement('a');
            element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent));
            element.setAttribute('download', `${friendlyId}.csv`);

            element.style.display = 'none';
            document.body.appendChild(element);

            element.click();

            document.body.removeChild(element);
        });
    }

    createClearButton(parent, what) {
        if (!storage.getItem(what)) {
            return;
        }

        const friendlyId = what.toLowerCase().replaceAll(".", "-");
        const buttonId = `clear-${friendlyId}`;

        const clearButton = this.createButton(buttonId, PATH_CLEAR);
        parent.append(clearButton);

        $(document.body).on('click', `#${buttonId}`, () => {
            storage.removeItem(what);
        });
    }

    static getCurrent() {
        return LeagueScoutModule.get(CURRENT_LEAGUE_SNAPSHOT_KEY);
    }

    static getPrevious() {
        return LeagueScoutModule.get(PREVIOUS_LEAGUE_SNAPSHOT_KEY);
    }

    static get(key) {
        var data = JSON.parse(storage.getItem(key)) || {};

        // Migrate from the old data structure
        if (Array.isArray(data) && data.length > 0) {
            const last_snapshot = data[data.length - 1];

            const reduceP = ({id, name, country, level}) => ({id, name, country, level});
            const reduceS = ({id, rank, elements, points, damage, defense, ego, chance, boosters}) => ({id, rank, elements, points, damage, defense, ego, chance, boosters});

            const player_data = last_snapshot.player_data.map(reduceP).reduce((map, obj) => {
                map[obj.id] = obj;
                return map;
            }, {});

            const snapshots = data.map(d => ({date: d.date, snapshot: d.player_data.map(reduceS)}));

            data = {
                league_end: last_snapshot.league_end,
                num_players: last_snapshot.num_players,
                player_data,
                snapshots,
            }
        }

        return data;
    }

    static deleteCurrent() {
        storage.removeItem(CURRENT_LEAGUE_SNAPSHOT_KEY);
    }

    static setCurrent(data) {
        this.set(CURRENT_LEAGUE_SNAPSHOT_KEY, data);
    }

    static setPrevious(data) {
        this.set(PREVIOUS_LEAGUE_SNAPSHOT_KEY, data);
    }

    static set(key, data) {
        if (data.snapshots.length > 0) {
            storage.setItem(key, JSON.stringify(data));
        } else {
            storage.removeItem(key);
        }
    }
}

class LeagueTableModule extends MyModule {
    constructor () {
        const baseKey = 'leagueTable'
        const configSchema = {
            baseKey,
            default: true,
            label: `Extend league table with additional opponents' information`,
            subSettings: [
                {
                    key: 'girl_power',
                    label: 'Show girl power in the league table',
                    default: false
                },
                {
                    key: 'kinkoid_power',
                    label: 'Show the new power stat in the league table',
                    default: false
                },
                {
                    key: 'number_of_bulbs',
                    label: 'Show the number of invested bulbs in the league table',
                    default: true
                },
                {
                    key: 'load_player_data',
                    label: 'Load player data on league table row click',
                    default: true
                },
            ],
        }
        super({name: baseKey, configSchema})

        this.all_new_columns = ['kinkoid_power', 'girl_power', 'number_of_bulbs'];
        this.anchor_column = 'power';
    }

    shouldRun() {return HHPlusPlus.Helpers.isCurrentPage('leagues')}

    run(config) {
        if (this.hasRun || !this.shouldRun()) {return}

        HHPlusPlus.Helpers.defer(() => {
            HHPlusPlus.Helpers.doWhenSelectorAvailable('.league_table', () => {
                this.extendLeagueDataModel();
                this.addPlayerSelectHandler(config);
                this.showPlayersPlacementBadge(config);
                this.showAdditionalTableHeaders(config);
                this.showAdditionalTableColumns(config);
                this.showMaxPointsTooltip();
                this.detectReallyExpiredBoosers();
                this.detectInflatedPower();
                this.makeCompatibleWithLeaguePlusPlus();
            });

            $(document).on('player:update-profile-data', (event, data) => {
                this.extendLeagueDataModel();
                this.showPlayersPlacementBadge(config);
            });

            $(document).on('league:table-sorted', () => {
                this.showPlayersPlacementBadge(config);
                this.showAdditionalTableColumns(config);
                this.showMaxPointsTooltip(config);
                this.detectReallyExpiredBoosers();
                this.detectInflatedPower();
                this.makeCompatibleWithLeaguePlusPlus();
            });
        });

        this.hasRun = true;
    }

    extendLeagueDataModel() {
        const players_data = JSON.parse(storage.getItem(LEAGUE_PLAYERS_KEY)) || {};

        // add power to the existing `opponents_list` data model
        for (var r = 0, n = opponents_list.length; r < n; r++) {
            const player = opponents_list[r];
            const id = parseInt(player.player.id_fighter);

            const player_data = players_data[id];
            const best_placement = player_data != undefined ? player_data.best_placement : -1;
            const placement_count = player_data != undefined ? player_data.placement_count : -1;

            player.best_placement = best_placement;
            player.placement_count = placement_count;

            player.kinkoid_power = number_reduce(player.player.team.power_display);
            player.girl_power = player.player.team.total_power.toFixed();
            player.number_of_bulbs = player.player.team.girls.flatMap(g => Object.values(g.skill_tiers_info)).reduce((a,g)=>a+g.skill_points_used, 0)
        }
    }

    showAdditionalTableHeaders(config) {
        // Additional CSS classes
        const row_styles = {kinkoid_power: '2rem', girl_power: '2.2rem', number_of_bulbs: '0.9rem'}
        for (const [clazz, min_width] of Object.entries(row_styles)) {
            // this.insertRule(`.league_table .data-row .head-column[column="${clazz}"] {display: flex; align-items: center; justify-content: center}`);
            this.insertRule(`.league_table .data-row .data-column[column="${clazz}"] {min-width: ${min_width}}`);
        }

        const columns = this.all_new_columns.filter(c => config[c]);

        const headers = {
            kinkoid_power: `<span>${GT.design.caracs_sum}</span>`,
            girl_power: `<span>${GT.design.total_power}</span>`, // <span class="upDownArrows_mix_icn">
            number_of_bulbs: '<span class="scrolls_legendary_icn"></span>',
        }

        $(`div.league_table div.head-row div.head-column[column=${this.anchor_column}]`).after(
            columns.map(c => `<div class="data-column head-column" column="${c}">${headers[c]}</div>`).join('')
        );

    }

    showAdditionalTableColumns(config) {
        this.insertRule(`.active_skill {color: red; text-shadow: 1px 1px 0 #000, -1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000;}`);

        const context = this;

        $('div.league_table')
            .find('div.body-row')
            .each(function(index) {
                const opponent = window.opponents_list[index];
                const columns = context.all_new_columns.filter(c => config[c]);

                $(this).find(`div.data-column[column=${context.anchor_column}]`).after(
                    columns.map(c => `<div class="data-column" column="${c}"><div class="${context.tableColumnClass(c, opponent)}">${opponent[c]}</div></div>`).join('')
                );
            })
    }

    tableColumnClass(column, opponent) {
        if (!column.includes('bulb')) {
            return '';
        }

        const clazz = 'active_skill'; // or active_skills_icn

        const active_skills = opponent.player.team.girls[0].skill_tiers_info[5];
        return active_skills && active_skills.skill_points_used > 0 ? clazz : '';
    }

    showMaxPointsTooltip() {
        const data = LeagueScoutModule.getCurrent();

        if (!data || !data.snapshots.length) {
            return;
        }

        $('.league_table .body-row').each(function (idx) {
            const opponent = opponents_list[idx];
            const opponent_id = parseInt(opponent.player.id_fighter);

            const points = data.snapshots.map(d => d.snapshot.find(p => p.id == opponent_id).points);

            const remainder = points[0] % 25;
            var lost_points = (remainder == 0 ? 0 : 25 - remainder);

            for (let i = 0; i < points.length - 1; i+=1) {
                const diff = points[i+1] - points[i];
                const remainder = diff % 25;
                lost_points += (remainder == 0 ? 0 : 25 - remainder);
            }

            const element = $(this).find('.data-column[column=player_league_points]');
            element.attr('tooltip', `Lost points: ${lost_points}`);
        });
    }

    detectReallyExpiredBoosers() {
        const data = LeagueScoutModule.getCurrent();

        if (!data || !data.snapshots.length) {
            return;
        }

        $('.league_table .body-row').each(function (idx) {
            const opponent = opponents_list[idx];
            const opponent_id = parseInt(opponent.player.id_fighter);

            const is_currently_boosted = opponent.boosters.some(b => b.expiration > 0);
            if (is_currently_boosted) {
                return;
            }

            const snapshot_data = data.snapshots.map(d => d.snapshot.find(p => p.id == opponent_id)).reverse();
            const boosted_data = snapshot_data.find(p => p.boosters && p.boosters.length >= 3);
            if (!boosted_data) {
                return;
            }

            if (
                (opponent.player.damage * BOOSTER_EXPIRATION_MULTIPLIER) >= boosted_data.damage &&
                (opponent.player.defense * BOOSTER_EXPIRATION_MULTIPLIER) >= boosted_data.defense &&
                (opponent.player.remaining_ego * BOOSTER_EXPIRATION_MULTIPLIER) >= boosted_data.ego &&
                (opponent.player.chance * BOOSTER_EXPIRATION_MULTIPLIER) >= boosted_data.chance
            ) {
                const element = $(this).find('.data-column[column=boosters]');
                element.addClass('active_skill');
            }
        });
    }

    detectInflatedPower(take_n = 30) {
        const data = LeagueScoutModule.getCurrent();

        if (!data || !data.snapshots.length) {
            return;
        }

        $('.league_table .body-row').each(function (idx) {
            const opponent = opponents_list[idx];
            const opponent_id = parseInt(opponent.player.id_fighter);
            const current_power = opponent.player.team.total_power;

            const snapshot_data = data.snapshots.map(d => d.snapshot.find(p => p.id == opponent_id));
            const latest_power = snapshot_data.map(x => x.power).filter(x => x).slice(-1 * take_n);
            const lowest_power = Math.min(...latest_power);

            if (current_power > lowest_power) {
                const element = $(this).find('.data-column[column=team] span.team-power');
                element.addClass('active_skill');
                element.attr('tooltip', `Previously: ${lowest_power}`);
            }
        });
    }

    showPlayersPlacementBadge(config) {
        if (!config.load_player_data) {
            return;
        }

        // Additional CSS classes
        this.insertRule('.badge.top1 {background-color:#ec0039}');
        this.insertRule('.badge.top1::after {content:"1"}');

        for (let i = 2; i <= 4; i++) {
            // this.insertRule(`.badge.top${i} {background-color:#8e36a9}`);
            this.insertRule(`.badge.top${i} {background:var(--legendary-bg);background-size:cover}`);
            this.insertRule(`.badge.top${i}::after {content:"${i}"}`);
        }

        const context = this;

        $('.league_table .body-row').each(function (idx) {
            const opponent = opponents_list[idx];
            if (opponent.best_placement != undefined) {
                context.updatePlayerPlacementBadge($(this), opponent);
            }
        });
    }

    addPlayerSelectHandler(config) {
        if (!config.load_player_data) {
            return;
        }

        // Remove the go_pre_battle class to allow users to select the row (inspired by Leagues++)
        $('.league_table .data-column[column=can_fight] .go_pre_battle').removeClass('go_pre_battle');

        $('.league_table .body-row').on('click', function() {
            const element_nickname = $(this).find('.data-column[column=nickname] span.nickname')
            const player_id = element_nickname.attr('id-member');

            const opponent = window.opponents_list.find(x => parseInt(x.player.id_fighter) == player_id);
            if (opponent.best_placement != undefined) {
                return false;
            }

            window.$.post({
                url: '/ajax.php',
                data: {
                    action: 'fetch_hero',
                    id: 'profile',
                    preview: false,
                    player_id: parseInt(player_id),
                },
                success: (data) => {}
            });

            return false;
        });
    }

    updatePlayerPlacementBadge(row, player_data) {
        const nicknameElement = row.find('div.data-column[column=nickname]');

        var badgeContainer = nicknameElement.find('.badge-container');
        if (!badgeContainer.length) {
            badgeContainer = $('<div class="badge-container" />').appendTo(nicknameElement);
        }

        // best placement indicator next to the nickname
        badgeContainer.html(this.createBestPlacementBadge(player_data));
    }

    createBestPlacementBadge(player) {
        if (player.best_placement < 1 || player.best_placement > 4) {
            return ''
        }

        const clazz = `top${player.best_placement}`;
        return `<span class="best-placement"><span class="scriptLeagueInfoIcon badge ${clazz}"></span>${player.placement_count}</span>`;
    }

    makeCompatibleWithLeaguePlusPlus() {
        HHPlusPlus.Helpers.doWhenSelectorAvailable('div#leagues div.league_buttons a#change_team', () => {
            // Remove the avatars
            $('div.league_table div.data-row div.data-column[column=nickname] div.square-avatar-wrapper').remove();

            // Hide row when opponent has been fought
            const context = this;
            $('body').on('DOMSubtreeModified', '.league_table .body-row .data-column[column=match_history_sorting]', function() {
                context.hideUnhideRow($(this).parent('div.body-row'), context.isHideOpponents());
            });
        });
    }

    hideUnhideRow(row, hide) {
        const results = row.find('div.data-column[column=match_history_sorting]').find('div[class!="result "]').length;
        const fought_all = results == 3;
        if (fought_all && hide) {
            row.hide();
        } else if (fought_all && !hide) {
            row.show();
        }
    }

    isHideOpponents() {
        const filter = JSON.parse(storage.getItem(HHPLUSPLUS_OPPONENT_FILTER)) || {fought_opponent: false};
        return filter.fought_opponent;
    }
}

class PrebattleFlightCheckModule extends MyModule {
    constructor () {
        const baseKey = 'prebattleFlightCheck'
        const configSchema = {
            baseKey,
            default: true,
            label: `Run team and equipment checks before league battles`,
        }
        super({name: baseKey, configSchema})
    }

    shouldRun() {return HHPlusPlus.Helpers.isCurrentPage('leagues-pre-battle') || HHPlusPlus.Helpers.isCurrentPage('leagues')}

    run() {
        if (this.hasRun || !this.shouldRun()) {return}

        HHPlusPlus.Helpers.defer(() => {
            if (HHPlusPlus.Helpers.isCurrentPage('leagues')) {
                $(document).ajaxComplete((evt, xhr, opt) => {
                    if (xhr.status == 200 && ~opt.url.search(/\/leagues-pre-battle.html\?id_opponent=\d+/)) {
                        const hero = window.Hero ?? shared.Hero;
                        const me = opponents_list.find(p => parseInt(p.player.id_fighter) == hero.infos.id);
                        const themes = me.player.team.theme_elements.map(x => x.type);

                        this.checkMythicEquipment(themes);
                    }
                });
            }

            if (HHPlusPlus.Helpers.isCurrentPage('leagues-pre-battle')) {
                HHPlusPlus.Helpers.doWhenSelectorAvailable('div.player-panel div.player-team', () => {
                    const synergies = JSON.parse($('div.player-panel div.player-team div.icon-area').attr('synergy-data'));
                    const themes = synergies.filter(x => x.team_girls_count >=3).map(x => x.element.type);

                    this.checkMythicEquipment(themes);
                });
            }
        });

        this.hasRun = true;
    }

    checkMythicEquipment(themes_or_empty) {
        // Additional CSS classes
        this.insertRule(`.slot.size_xxs {width:1.5rem;height:1.5rem;-webkit-border-radius:.2rem;-moz-border-radius:.2rem;border-radius:.2rem}`);

        const me = EquipmentCollector.getBestMythic();
        const equipment_themes = me.map(x => x.resonance_bonuses.theme.identifier || 'balanced');

        const themes = themes_or_empty.length ? themes_or_empty : ['balanced'];

        const has_matching_me = themes.some(t => equipment_themes.includes(t));
        if (has_matching_me) {
            const tooltip = "You have a perfect mythic equipment for your team in your inventory.";
            $('div.opponent div.player_details').append(
                `<div class="slot size_xxs mythic random_equipment mythic" rarity="mythic" tooltip="${tooltip}">
                    <span class="mythic_equipment_icn"></span>
                </div>`
            );
        }
    }
}

class GirlPreviewModule extends MyModule {
    constructor () {
        const baseKey = 'girlPreviewFilters'
        const configSchema = {
            baseKey,
            default: true,
            label: `Girl preview`,
            subSettings: [
                {
                    key: 'preview_girl_pose',
                    label: 'Uncensor girl pose preview',
                    default: false
                },
            ]
        }
        super({name: baseKey, configSchema})
    }

    shouldRun() {return true;}

    run ({preview_girl_pose}) {
        if (this.hasRun || !this.shouldRun()) {return}

        HHPlusPlus.Helpers.defer(() => {
            if (preview_girl_pose) {
                this.previewGirlPose();
            }
        });

        this.hasRun = true;
    }

    previewGirlPose() {
        const observer = new MutationObserver(() => {
            HHPlusPlus.Helpers.doWhenSelectorAvailable('#girl_preview_popup', () => {
                $("div.pose-preview_wrapper").removeClass("locked");
                $("span.preview-locked_icn").remove();
            });
        })
        observer.observe($('#common-popups')[0], {childList: true});
    }
}

class SeasonalEventModule extends MyModule {
    constructor () {
        const baseKey = 'seasonalEvent'
        const configSchema = {
            baseKey,
            default: true,
            label: `Seasonal event`,
        }
        super({name: baseKey, configSchema})
    }

    shouldRun() {return HHPlusPlus.Helpers.isCurrentPage('seasonal');}

    run () {
        if (this.hasRun || !this.shouldRun()) {return}

        HHPlusPlus.Helpers.defer(() => {
            for (const e of [50, 100, 250, 500, 1000]) {
                this.insertRule(`.badge.top${e} {background-color:#333; text-align:center}`);
                this.insertRule(`.badge.top${e}::after {content:"${e}"}`);
                this.insertRule('.scriptLeagueInfoIcon {display: inline-block;height: 16px;width: 32px;font-size: 10px;border-radius: 5px;margin-left: 6px;margin-right: 2px;text-shadow: 0 0 1px #000;-moz-transform: rotate(0.05deg);');
                this.insertRule('.leaderboard-placement {font-size: 12px;text-shadow:1px 1px 0 #000}');
            }

            HHPlusPlus.Helpers.onAjaxResponse(/action=leaderboard&feature=seasonal_event_top/, this.rankingBadges);
        });

        this.hasRun = true;
    }

    rankingBadges(leaderboard) {
        HHPlusPlus.Helpers.doWhenSelectorAvailable('.ranking-timer', () => {

            const xd = [50, 100, 250, 500, 1000].map(e => {
                const diff = leaderboard.leaderboard[e - 1].potions - leaderboard.hero_data.potions + 1;
                return `<span class="leaderboard-placement"><span class="scriptLeagueInfoIcon badge top${e}"></span>${diff}</span>`;
            }).join('');

            $("div.ranking-timer").append(xd);
        });
    }
}

setTimeout(() => {
    const {hhPlusPlusConfig, HHPlusPlus, location} = window;

    if (!$) {
        console.log('No jQuery found. Probably an error page. Ending the script here')
        return;
    } else if (!hhPlusPlusConfig || !HHPlusPlus) {
        console.log("HH++ is not available");
        return;
    } else if (location.pathname === '/' && (location.hostname.includes('www') || location.hostname.includes('test'))) {
        console.log("iframe container, do nothing");
        return;
    }

    // collectors
    EquipmentCollector.collect();
    LeaguePlayersCollector.collect();

    // modules
    const modules = [
        new LeagueScoutModule(),
        new LeagueTableModule(),
        new PrebattleFlightCheckModule(),
        new GirlPreviewModule(),
        new SeasonalEventModule(),
    ]

    // register our own window hooks
    window.HHPlusPlusPlus = {
        exportLeagueData: LeaguePlayersCollector.export,
        clearLeagueData: LeaguePlayersCollector.clear,
    };

    hhPlusPlusConfig.registerGroup({
        key: '430i',
        name: '430i\'s Scripts'
    })

    modules.forEach(module => hhPlusPlusConfig.registerModule(module))
    hhPlusPlusConfig.loadConfig()
    hhPlusPlusConfig.runModules()

    HHPlusPlus.Helpers.runDeferred()
}, 1)
