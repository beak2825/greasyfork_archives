// ==UserScript==
// @name         OC2 Details
// @namespace    http://tampermonkey.net/
// @version      0.32.4
// @description  Add stats to OC2 titles
// @author       Resh
// @match        https://www.torn.com/factions.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/523669/OC2%20Details.user.js
// @updateURL https://update.greasyfork.org/scripts/523669/OC2%20Details.meta.js
// ==/UserScript==

// The amount taken by the faction, used in calculating daily player profit
const FACTION_CUT = 0.2;

// If set to true, displays success % and expected profits after OC names
const ESTIMATE_RESULTS = true;

// If set to true, displays numbers next to player roles
const INCLUDE_PLAYER_KEYS = false;

// If set to true, sorts players in an OC by their original role order
// TODO: this option breaks displayed timers so is not recommended
const SORT_ROLES = false;

// If set to true, includes a rough estimate for the main used items in profit calculations
const CONSIDER_MATERIALS = true;

// If set to true, includes the expected net scope for the scenario, requires ESTIMATE_RESULTS, not implemented for chains yet
const ESTIMATE_SCOPE = true;

const USDollar = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
});

// Fetch interception
const { fetch: originalFetch } = unsafeWindow;
unsafeWindow.fetch = async (...args) => {

  let [resource, config] = args;
  let response = await originalFetch(...args);
  if ((typeof resource === 'string' || resource instanceof String) && resource.includes("organizedCrimesData") && resource.includes("crimeList")) {
    console.log("OC2 script intercepted resource: " + resource)

    const text = () =>
      response
        .clone()
        .text()
        .then((data) => (transformResponseText(data)));

    response.text = text;
  }


  return response;
};


function transformResponseText(input_data) {
    try {
        let input_json = JSON.parse(input_data);

        if (input_json.success) {
            $.each(input_json.data, processCrime);
        }

        return JSON.stringify(input_json);
    } catch(e) {
        console.log("error transforming intercepted response, returning original");
        console.log(e);
        return input_data;
    }
}


function processCrime(i, crime_info) {
    console.log(crime_info);

    if (ESTIMATE_RESULTS) {
        let pessimistic_oc_results = calculateOCResults(crime_info.scenario.slug, crime_info.playerSlots, 0);
        let optimistic_oc_results = calculateOCResults(crime_info.scenario.slug, crime_info.playerSlots, 1);

        let average_money = (pessimistic_oc_results.money + optimistic_oc_results.money) / 2;
        // consider materials
        if (CONSIDER_MATERIALS && OCMaterialCosts[crime_info.scenario.slug]) {
            average_money -= OCMaterialCosts[crime_info.scenario.slug];
        }

        let averave_per_player_day = (1-FACTION_CUT)*(average_money / Math.pow(crime_info.playerSlots.length, 2));

        let percent_display;
        if (Math.abs(pessimistic_oc_results.odds-optimistic_oc_results.odds) < 2) {
            percent_display = `${Math.round(100*(pessimistic_oc_results.odds+optimistic_oc_results.odds)/2)/100}%`
        } else {
            percent_display = `${Math.round(10*pessimistic_oc_results.odds)/10}%-${Math.round(10*optimistic_oc_results.odds)/10}%`;
        }



        // TODO: rethink this
        crime_info.scenario.name += `, ${USDollar.format(average_money)} (${USDollar.format(averave_per_player_day)}),  ${percent_display}`;

        // scope estimation, exclude known chains
        if (ESTIMATE_SCOPE && !["ace_in_the_hole", "stacking_the_deck"].includes(crime_info.scenario.slug)) {
            let scenario_cost = Math.floor((crime_info.scenario.level+1)/2)
            let scope_balance = ((pessimistic_oc_results.odds+optimistic_oc_results.odds)/200)*(scenario_cost+1) - scenario_cost
            scope_balance = scope_balance/(crime_info.playerSlots.length)
            crime_info.scenario.name += ` (${(scope_balance<0?"":"+")+scope_balance.toFixed(2)})`
        }
    }

    // adding player keys to role names
    if (INCLUDE_PLAYER_KEYS) {
        $.each(crime_info.playerSlots, function(j, player_hash){
            player_hash.name = `${player_hash.key[1]} ${player_hash.name}`;
        });
    }

    // sorting roles
    if (SORT_ROLES) {
        // FIXME: this breaks role progress display
        crime_info.playerSlots = crime_info.playerSlots.sort(function(a,b){
            return a.key[1]-b.key[1];
        });
    }
}


function calculateOCResults(crime_id, playerSlots, unknown_value) {
    // FIXME: temporary directing of smoke_and_wing_mirrors_2 to smoke_and_wing_mirrors, more info needed
    if (crime_id == "smoke_and_wing_mirrors_2" || crime_id == "smoke_and_wing_mirrors_single") {
        crime_id = "smoke_and_wing_mirrors";
    }
    if (crime_id == "break_the_bank_1")
        crime_id = "break_the_bank";

    let oc_scenes = OCScenes[crime_id];
    if (!oc_scenes) {
        console.log(`Scene data not found for OC ${crime_id}, calculating using default.`)
        oc_scenes = OCScenes.unknown;
    }

    let playerSlotHash = playerSlotsToHash(playerSlots);

    let estimates = OCEstimate(oc_scenes["A1-C1"], oc_scenes, playerSlotHash, unknown_value);

    return {
        odds: estimates.odds * 100,
        money: estimates.money_multiplier * OCAveragePayouts[crime_id]
    }
}

function playerSlotsToHash(playerSlots) {
    return playerSlots.reduce(function(map, obj) {
        map[obj.key] = obj.successChance;
        return map;
    }, {});
}

function OCEstimate(current_checkpoint, oc_scenes, playerSlotHash, unknown_value) {
    let checkpointChance = calculateCheckpointChance(current_checkpoint.player_keys, playerSlotHash)

    let pass_odds = checkpointChance;
    let fail_odds = 1-checkpointChance;

    let pass_result = {}
    switch (current_checkpoint.pass_type) {
        case 'win':
            pass_result.odds = 1;
            pass_result.money_multiplier = current_checkpoint.pass_value;
            break;
        case 'lose':
            pass_result.odds = 0;
            pass_result.money_multiplier = current_checkpoint.pass_value;
            break;
        case 'scene':
            pass_result = OCEstimate(oc_scenes[current_checkpoint.pass_value], oc_scenes, playerSlotHash, unknown_value);
            break;
        case 'unknown':
            pass_result.odds = unknown_value;
            pass_result.money_multiplier = unknown_value;
            break;
        default:
            pass_result.odds = unknown_value;
            pass_result.money_multiplier = unknown_value;
            console.log(`Warning: unknown pass_type ${current_checkpoint.pass_type}.`);
    }

    let fail_result = {}
    switch (current_checkpoint.fail_type) {
        case 'win':
            fail_result.odds = 1;
            fail_result.money_multiplier = current_checkpoint.fail_value;
            break;
        case 'lose':
            fail_result.odds = 0;
            fail_result.money_multiplier = current_checkpoint.fail_value;
            break;
        case 'scene':
            fail_result = OCEstimate(oc_scenes[current_checkpoint.fail_value], oc_scenes, playerSlotHash, unknown_value);
            break;
        case 'unknown':
            fail_result.odds = unknown_value;
            fail_result.money_multiplier = unknown_value;
            break;
        default:
            fail_result.odds = unknown_value;
            fail_result.money_multiplier = unknown_value;
            console.log(`Warning: unknown fail_type ${current_checkpoint.fail_type}.`);
    }

    return {
        odds: pass_odds*pass_result.odds + fail_odds*fail_result.odds,
        money_multiplier: pass_odds*pass_result.money_multiplier + fail_odds*fail_result.money_multiplier
    }
}

function calculateCheckpointChance(player_keys, playerSlotHash) {
    let player_count = player_keys.length;
    if (player_count == 0) {
        // a checkpoint with no players is unknown so just average everyone
        return (Object.values(playerSlotHash).reduce((partialSum, a) => partialSum + a, 0) / Object.values(playerSlotHash).length) / 100;
    } else {
        return (player_keys.reduce((partialSum, a) => partialSum + playerSlotHash[a], 0) / player_count) / 100;
    }
}

const OCAveragePayouts = {
    mob_mentality: 1000000,
    pet_project: 562500,
    cash_me_if_you_can: 1125000,
    best_of_the_lot: 2000000,
    market_forces: 6250000,
    smoke_and_wing_mirrors: 4000000,
    gaslight_the_way: 9000000,
    stage_fright: 18000000,
    snow_blind: 8000000,
    counter_offer: 25000000,
    leave_no_trace: 9000000,
    no_reserve: 0,
    bidding_war: 90000000,
    honey_trap: 18000000,
    blast_from_the_past: 144000000,
    clinical_precision: 128000000,
    break_the_bank: 288000000,
    stacking_the_deck: 0,
    ace_in_the_hole: 592000000,
    level_9: 576000000,
    level_10: 1152000000
}

// TODO: fetch from API?
const OCMaterialCosts = {
    pet_project: 100000,
    cash_me_if_you_can: 400000,
    blast_from_the_past: 7500000
}

const OCScenes = {
    unknown: { // this is based on Chedburn's OC2 announcement
        "A1-C1": {
            player_keys: [],
            pass_type: "scene",
            pass_value: "A2-C1",
            fail_type: "scene",
            fail_value: "A1-C2"
        },
        "A1-C2": {
            player_keys: [],
            pass_type: "scene",
            pass_value: "A2-C1",
            fail_type: "lose",
            fail_value: 0
        },
        "A2-C1": {
            player_keys: [],
            pass_type: "scene",
            pass_value: "A3-C1",
            fail_type: "scene",
            fail_value: "A2-C2"
        },
        "A2-C2": {
            player_keys: [],
            pass_type: "scene",
            pass_value: "A3-C1",
            fail_type: "lose",
            fail_value: 0
        },
        "A3-C1": {
            player_keys: [],
            pass_type: "scene",
            pass_value: "A4-C1",
            fail_type: "scene",
            fail_value: "A3-C2"
        },
        "A3-C2": {
            player_keys: [],
            pass_type: "scene",
            pass_value: "A4-C1",
            fail_type: "scene",
            fail_value: "A3-C3"
        },
        "A3-C3": {
            player_keys: [],
            pass_type: "scene",
            pass_value: "A3-C4",
            fail_type: "lose",
            fail_value: 0
        },
        "A3-C4": {
            player_keys: [],
            pass_type: "scene",
            pass_value: "A4-C3",
            fail_type: "lose",
            fail_value: 0
        },
        "A4-C1": {
            player_keys: [],
            pass_type: "win",
            pass_value: 1,
            fail_type: "scene",
            fail_value: "A4-C2"
        },
        "A4-C2": {
            player_keys: [],
            pass_type: "scene",
            pass_value: "A4-C3",
            fail_type: "win",
            fail_value: 1
        },
        "A4-C3": {
            player_keys: [],
            pass_type: "win",
            pass_value: 1,
            fail_type: "scene",
            fail_value: "A4-C4"
        },
        "A4-C4": {
            player_keys: [],
            pass_type: "win",
            pass_value: 1,
            fail_type: "lose",
            fail_value: 0
        }
    },
    mob_mentality: {
        "A1-C1": {
            player_keys: ["P1"],
            pass_type: "scene",
            pass_value: "A2-C1",
            fail_type: "scene",
            fail_value: "A1-C2"
        },
        "A1-C2": {
            player_keys: ["P2"],
            pass_type: "scene",
            pass_value: "A2-C1",
            fail_type: "unknown",
            fail_value: 0.5
        },
        "A2-C1": {
            player_keys: ["P2"],
            pass_type: "scene",
            pass_value: "A3-C1",
            fail_type: "scene",
            fail_value: "A2-C2"
        },
        "A2-C2": {
            player_keys: ["P4"],
            pass_type: "scene",
            pass_value: "A3-C1",
            fail_type: "scene",
            fail_value: "A2-C3"
        },
        "A2-C3": {
            player_keys: ["P2", "P3"],
            pass_type: "scene",
            pass_value: "A3-C1",
            fail_type: "lose",
            fail_value: 0
        },
        "A3-C1": {
            player_keys: ["P3"],
            pass_type: "scene",
            pass_value: "A4-C1",
            fail_type: "scene",
            fail_value: "A3-C2"
        },
        "A3-C2": {
            player_keys: ["P4"],
            pass_type: "scene",
            pass_value: "A4-C1",
            fail_type: "unknown",
            fail_value: 0.5
        },
        "A4-C1": {
            player_keys: ["P2"],
            pass_type: "scene",
            pass_value: "A5-C1",
            fail_type: "scene",
            fail_value: "A4-C2"
        },
        "A4-C2": {
            player_keys: ["P1"],
            pass_type: "scene",
            pass_value: "B1-C1",
            fail_type: "lose",
            fail_value: 0
        },
        "A5-C1": {
            player_keys: ["P4"],
            pass_type: "scene",
            pass_value: "A7-C1",
            fail_type: "scene",
            fail_value: "A5-C2"
        },
        "A5-C2": {
            player_keys: ["P1"],
            pass_type: "win",
            pass_value: 1,
            fail_type: "lose",
            fail_value: 0
        },
        "A7-C1": {
            player_keys: ["P2"],
            pass_type: "win",
            pass_value: 1,
            fail_type: "win",
            fail_value: 0.95
        },
        "B1-C1": {
            player_keys: ["P4"],
            pass_type: "win",
            pass_value: 0.8, // estimated, needs verification
            fail_type: "win",
            fail_value: 0.65 // estimated, needs verification
        }
    },
    pet_project: {
        "A1-C1": {
            player_keys: ["P3"],
            pass_type: "scene",
            pass_value: "A2-C1",
            fail_type: "scene",
            fail_value: "A1-C2"
        },
        "A1-C2": {
            player_keys: ["P2"],
            pass_type: "scene",
            pass_value: "B1-C1",
            fail_type: "scene",
            fail_value: "A1-C3"
        },
        "A1-C3": {
            player_keys: ["P3"],
            pass_type: "scene",
            pass_value: "A2-C1",
            fail_type: "lose",
            fail_value: 0
        },
        "A2-C1": {
            player_keys: ["P1"],
            pass_type: "scene",
            pass_value: "A3-C1",
            fail_type: "scene",
            fail_value: "A2-C2"
        },
        "A2-C2": {
            player_keys: ["P1"],
            pass_type: "scene",
            pass_value: "A3-C1",
            fail_type: "unknown",
            fail_value: 0.5
        },
        "A3-C1": {
            player_keys: ["P1"],
            pass_type: "scene",
            pass_value: "A4-C1",
            fail_type: "scene",
            fail_value: "A3-C2"
        },
        "A3-C2": {
            player_keys: ["P2"],
            pass_type: "scene",
            pass_value: "A4-C1",
            fail_type: "unknown",
            fail_value: 0.5
        },
        "A4-C1": {
            player_keys: ["P2"],
            pass_type: "scene",
            pass_value: "A5-C1",
            fail_type: "scene",
            fail_value: "C1-C1"
        },
        "A5-C1": {
            player_keys: ["P1"],
            pass_type: "scene",
            pass_value: "A6-C1",
            fail_type: "scene",
            fail_value: "A5-C2"
        },
        "A5-C2": {
            player_keys: ["P2"],
            pass_type: "scene",
            pass_value: "A6-C1",
            fail_type: "unknown",
            fail_value: 0.5
        },
        "A6-C1": {
            player_keys: ["P2"],
            pass_type: "scene",
            pass_value: "A7-C1",
            fail_type: "scene",
            fail_value: "A6-C2"
        },
        "A6-C2": {
            player_keys: ["P3"],
            pass_type: "scene",
            pass_value: "A7-C1",
            fail_type: "unknown",
            fail_value: 0.5
        },
        "A7-C1": {
            player_keys: ["P3"],
            pass_type: "win",
            pass_value: 1.4,
            fail_type: "scene",
            fail_value: "A7-C2"
        },
        "A7-C2": {
            player_keys: ["P2"],
            pass_type: "win",
            pass_value: 1.25,
            fail_type: "unknown",
            fail_value: 0.5
        },
        "B1-C1": {
            player_keys: ["P2"],
            pass_type: "scene",
            pass_value: "B2-C1",
            fail_type: "scene",
            fail_value: "B1-C2"
        },
        "B1-C2": {
            player_keys: ["P2"],
            pass_type: "scene",
            pass_value: "B2-C1",
            fail_type: "unknown",
            fail_value: 0.5
        },
        "B2-C1": {
            player_keys: ["P1"],
            pass_type: "win",
            pass_value: 0.75,
            fail_type: "unknown",
            fail_value: 0.5
        },
        "C1-C1": {
            player_keys: ["P1", "P3"],
            pass_type: "win",
            pass_value: 0.9,
            fail_type: "unknown",
            fail_value: 0.5
        }
    },
    best_of_the_lot: {
        "A1-C1": {
            player_keys: ["P1"],
            pass_type: "scene",
            pass_value: "A2-C1",
            fail_type: "scene",
            fail_value: "A1-C2"
        },
        "A1-C2": {
            player_keys: ["P3"],
            pass_type: "scene",
            pass_value: "A2-C1",
            fail_type: "scene",
            fail_value: "A1-C3"
        },
        "A1-C3": {
            player_keys: ["P2", "P3"],
            pass_type: "lose",
            pass_value: 0,
            fail_type: "lose",
            fail_value: 0
        },
        "A2-C1": {
            player_keys: ["P4"],
            pass_type: "scene",
            pass_value: "A3-C1",
            fail_type: "scene",
            fail_value: "A2-C2"
        },
        "A2-C2": {
            player_keys: ["P3"],
            pass_type: "scene",
            pass_value: "A3-C1",
            fail_type: "scene",
            fail_value: "A2-C3"
        },
        "A2-C3": {
            player_keys: ["P4"],
            pass_type: "scene",
            pass_value: "A3-C1",
            fail_type: "lose", // unconfirmed
            fail_value: 0
        },
        "A3-C1": {
            player_keys: ["P2"],
            pass_type: "scene",
            pass_value: "A4-C1",
            fail_type: "scene",
            fail_value: "A3-C2"
        },
        "A3-C2": {
            player_keys: ["P3"],
            pass_type: "scene",
            pass_value: "A4-C3",
            fail_type: "scene",
            fail_value: "A3-C3"
        },
        "A3-C3": {
            player_keys: ["P4"],
            pass_type: "scene",
            pass_value: "A4-C3",
            fail_type: "lose",
            fail_value: 0
        },
        "A4-C1": {
            player_keys: ["P1"],
            pass_type: "scene",
            pass_value: "A5-C1",
            fail_type: "scene",
            fail_value: "A4-C2"
        },
        "A4-C2": {
            player_keys: ["P2"],
            pass_type: "scene",
            pass_value: "B1-C1",
            fail_type: "scene",
            fail_value: "A4-C3"
        },
        "A4-C3": {
            player_keys: ["P3"],
            pass_type: "scene",
            pass_value: "B1-C1",
            fail_type: "lose",
            fail_value: 0
        },
        "A5-C1": {
            player_keys: ["P3"],
            pass_type: "win",
            pass_value: 0.5,
            fail_type: "scene",
            fail_value: "A5-C2"
        },
        "A5-C2": {
            player_keys: ["P3", "P4"], // questionable
            pass_type: "win",
            pass_value: 0.5,
            fail_type: "unknown",
            fail_value: 0.5
        },
        "B1-C1": {
            player_keys: ["P4"],
            pass_type: "win",
            pass_value: 0.5,
            fail_type: "scene",
            fail_value: "B1-C2"
        },
        "B1-C2": {
            player_keys: ["P1", "P3"],
            pass_type: "win",
            pass_value: 0.5,
            fail_type: "unknown",
            fail_value: 0.5
        }
    },
    cash_me_if_you_can: {
        "A1-C1": {
            player_keys: ["P1"],
            pass_type: "scene",
            pass_value: "A2-C1",
            fail_type: "scene",
            fail_value: "A1-C2"
        },
        "A1-C2": {
            player_keys: ["P1"],
            pass_type: "scene",
            pass_value: "A2-C1",
            fail_type: "scene",
            fail_value: "A1-C3"
        },
        "A1-C3": {
            player_keys: ["P2"],
            pass_type: "scene",
            pass_value: "A2-C1",
            fail_type: "lose",
            fail_value: 0
        },
        "A2-C1": {
            player_keys: ["P2"],
            pass_type: "scene",
            pass_value: "A3-C1",
            fail_type: "scene",
            fail_value: "A2-C2"
        },
        "A2-C2": {
            player_keys: ["P1"],
            pass_type: "scene",
            pass_value: "A3-C1",
            fail_type: "scene",
            fail_value: "A2-C3"
        },
        "A2-C3": {
            player_keys: ["P2"],
            pass_type: "scene",
            pass_value: "A3-C1",
            fail_type: "lose",
            fail_value: 0
        },
        "A3-C1": {
            player_keys: ["P1"],
            pass_type: "scene",
            pass_value: "A4-C1",
            fail_type: "scene",
            fail_value: "A3-C2"
        },
        "A3-C2": {
            player_keys: ["P1"],
            pass_type: "scene",
            pass_value: "A4-C1",
            fail_type: "unknown",
            fail_value: 0.5
        },
        "A4-C1": {
            player_keys: ["P2"],
            pass_type: "scene",
            pass_value: "A5-C1",
            fail_type: "scene",
            fail_value: "A4-C2"
        },
        "A4-C2": {
            player_keys: ["P1"],
            pass_type: "win",
            pass_value: 1.2,
            fail_type: "scene",
            fail_value: "B1-C1"
        },
        "A5-C1": {
            player_keys: ["P3"],
            pass_type: "scene",
            pass_value: "A6-C1",
            fail_type: "scene",
            fail_value: "B1-C1"
        },
        "A6-C1": {
            player_keys: ["P2"],
            pass_type: "win",
            pass_value: 1.4,
            fail_type: "win",
            fail_value: 1.35
        },
        "B1-C1": {
            player_keys: ["P1", "P2"],
            pass_type: "scene",
            pass_value: "B2-C1",
            fail_type: "lose",
            fail_value: 0
        },
        "B2-C1": {
            player_keys: ["P3"],
            pass_type: "win",
            pass_value: 1,
            fail_type: "lose",
            fail_value: 0
        }
    },
    gaslight_the_way: {
        "A1-C1": {
            player_keys: ["P1", "P2"],
            pass_type: "scene",
            pass_value: "A2-C1",
            fail_type: "scene",
            fail_value: "A1-C2"
        },
        "A1-C2": {
            player_keys: ["P1", "P2"],
            pass_type: "scene",
            pass_value: "A2-C1",
            fail_type: "scene",
            fail_value: "A1-C3"
        },
        "A1-C3": {
            player_keys: ["P1", "P2"],
            pass_type: "scene",
            pass_value: "A2-C1",
            fail_type: "lose",
            fail_value: 0
        },
        "A2-C1": {
            player_keys: ["P3"],
            pass_type: "scene",
            pass_value: "A3-C1",
            fail_type: "scene",
            fail_value: "A2-C2"
        },
        "A2-C2": {
            player_keys: ["P3"],
            pass_type: "scene",
            pass_value: "A3-C1",
            fail_type: "lose",
            fail_value: 0
        },
        "A3-C1": {
            player_keys: ["P5"],
            pass_type: "scene",
            pass_value: "A4-C1",
            fail_type: "scene",
            fail_value: "A3-C2"
        },
        "A3-C2": {
            player_keys: ["P5"],
            pass_type: "scene",
            pass_value: "B8-C1",
            fail_type: "unknown",
            fail_value: 0.5
        },
        "A4-C1": {
            player_keys: ["P6"],
            pass_type: "scene",
            pass_value: "A5-C1",
            fail_type: "scene",
            fail_value: "A4-C2"
        },
        "A4-C2": {
            player_keys: ["P6"],
            pass_type: "scene",
            pass_value: "A5-C1",
            fail_type: "unknown",
            fail_value: 0.5
        },
        "A5-C1": {
            player_keys: ["P4", "P6"],
            pass_type: "scene",
            pass_value: "A7-C1",
            fail_type: "scene",
            fail_value: "B7-C1"
        },
        "A7-C1": {
            player_keys: ["P3"],
            pass_type: "win",
            pass_value: 0.8,
            fail_type: "unknown",
            fail_value: 0.5
        },
        "B7-C1": {
            player_keys: ["P3"],
            pass_type: "win",
            pass_value: 0.65,
            fail_type: "win",
            fail_value: 0.65
        },
        "B8-C1": {
            player_keys: ["P6"],
            pass_type: "win",
            pass_value: 0.5,
            fail_type: "unknown",
            fail_value: 0.5
        }
    },
    market_forces: {
        "A1-C1": {
            player_keys: ["P3"],
            pass_type: "scene",
            pass_value: "A2-C1",
            fail_type: "scene",
            fail_value: "A1-C2"
        },
        "A1-C2": {
            player_keys: ["P1"],
            pass_type: "scene",
            pass_value: "A2-C1",
            fail_type: "lose",
            fail_value: 0
        },
        "A2-C1": {
            player_keys: ["P2"],
            pass_type: "scene",
            pass_value: "A3-C1",
            fail_type: "scene",
            fail_value: "A2-C2"
        },
        "A2-C2": {
            player_keys: ["P5"],
            pass_type: "scene",
            pass_value: "A3-C1",
            fail_type: "lose",
            fail_value: 0
        },
        "A3-C1": {
            player_keys: ["P1"],
            pass_type: "scene",
            pass_value: "A4-C1",
            fail_type: "scene",
            fail_value: "A3-C2"
        },
        "A3-C2": {
            player_keys: ["P2"],
            pass_type: "scene",
            pass_value: "A4-C1",
            fail_type: "unknown",
            fail_value: 0.5
        },
        "A4-C1": {
            player_keys: ["P4"],
            pass_type: "scene",
            pass_value: "A5-C1",
            fail_type: "scene",
            fail_value: "A4-C2"
        },
        "A4-C2": {
            player_keys: ["P4"],
            pass_type: "scene",
            pass_value: "B5-C1",
            fail_type: "win",
            fail_value: 1
        },
        "A5-C1": {
            player_keys: ["P5"],
            pass_type: "scene",
            pass_value: "A7-C1",
            fail_type: "scene",
            fail_value: "A5-C2"
        },
        "A5-C2": {
            player_keys: ["P1", "P3"],
            pass_type: "scene",
            pass_value: "A7-C1",
            fail_type: "win",
            fail_value: 0.85
        },
        "A7-C1": {
            player_keys: ["P2"],
            pass_type: "scene",
            pass_value: "A8-C1",
            fail_type: "scene",
            fail_value: "A7-C2"
        },
        "A7-C2": {
            player_keys: ["P2"],
            pass_type: "scene",
            pass_value: "A8-C1",
            fail_type: "win",
            fail_value: 1.15
        },
        "A8-C1": {
            player_keys: ["P5"],
            pass_type: "win",
            pass_value: 1.35,
            fail_type: "win",
            fail_value: 1.25
        },
        "B5-C1": {
            player_keys: ["P5"],
            pass_type: "win",
            pass_value: 0.8,
            fail_type: "unknown",
            fail_value: 0.5
        }
    },
    smoke_and_wing_mirrors: {
        "A1-C1": {
            player_keys: ["P2"],
            pass_type: "scene",
            pass_value: "A2-C1",
            fail_type: "scene",
            fail_value: "A1-C2"
        },
        "A1-C2": {
            player_keys: ["P1"],
            pass_type: "scene",
            pass_value: "A2-C1",
            fail_type: "unknown",
            fail_value: 0.5
        },
        "A2-C1": {
            player_keys: ["P2"],
            pass_type: "scene",
            pass_value: "A3-C1",
            fail_type: "scene",
            fail_value: "A2-C2"
        },
        "A2-C2": {
            player_keys: ["P2"],
            pass_type: "scene",
            pass_value: "A3-C1",
            fail_type: "unknown",
            fail_value: 0.5
        },
        "A3-C1": {
            player_keys: ["P1"],
            pass_type: "scene",
            pass_value: "A4-C1",
            fail_type: "scene",
            fail_value: "A3-C2"
        },
        "A3-C2": {
            player_keys: ["P1"],
            pass_type: "scene",
            pass_value: "A4-C1",
            fail_type: "lose",
            fail_value: 0
        },
        "A4-C1": {
            player_keys: ["P3", "P4"],
            pass_type: "scene",
            pass_value: "A5-C1",
            fail_type: "scene",
            fail_value: "A4-C2"
        },
        "A4-C2": {
            player_keys: ["P4"],
            pass_type: "scene",
            pass_value: "B2-C1",
            fail_type: "scene",
            fail_value: "A4-C3"
        },
        "A4-C3": {
            player_keys: ["P4"],
            pass_type: "scene",
            pass_value: "B2-C1",
            fail_type: "lose",
            fail_value: 0
        },
        "A5-C1": {
            player_keys: ["P1"],
            pass_type: "scene",
            pass_value: "A6-C1",
            fail_type: "scene",
            fail_value: "A5-C2"
        },
        "A5-C2": {
            player_keys: ["P2"],
            pass_type: "scene",
            pass_value: "B3-C1",
            fail_type: "lose",
            fail_value: 0
        },
        "A6-C1": {
            player_keys: ["P3"],
            pass_type: "win",
            pass_value: 1,
            fail_type: "scene",
            fail_value: "A6-C2"
        },
        "A6-C2": {
            player_keys: ["P1"],
            pass_type: "win",
            pass_value: 1,
            fail_type: "unknown",
            fail_value: 0.5
        },
        "B2-C1": {
            player_keys: ["P3"],
            pass_type: "scene",
            pass_value: "B3-C1",
            fail_type: "scene",
            fail_value: "B2-C2"
        },
        "B2-C2": {
            player_keys: ["P4"],
            pass_type: "scene",
            pass_value: "B3-C1",
            fail_type: "lose",
            fail_value: 0
        },
        "B3-C1": {
            player_keys: ["P2"],
            pass_type: "win",
            pass_value: 1,
            fail_type: "win",
            fail_value: 1
        }
    },
    /* MAPPED-- */stage_fright: {
        "A1-C1": {
            player_keys: ["P3", "P5"],
            pass_type: "scene",
            pass_value: "A2-C1",
            fail_type: "scene",
            fail_value: "A1-C2"
        },
        "A1-C2": {
            player_keys: ["P3", "P5"],
            pass_type: "scene",
            pass_value: "A2-C1",
            fail_type: "scene", // unverified
            fail_value: "A1-C3"
        },
        "A1-C3": { // entire checkpoint unverified
            player_keys: ["P1", "P4"],
            pass_type: "scene",
            pass_value: "A2-C1",
            fail_type: "lose",
            fail_value: 0
        },
        "A2-C1": {
            player_keys: ["P6"],
            pass_type: "scene",
            pass_value: "A3-C1",
            fail_type: "scene",
            fail_value: "A2-C2"
        },
        "A2-C2": {
            player_keys: ["P2"],
            pass_type: "scene",
            pass_value: "A3-C1",
            fail_type: "lose",
            fail_value: 0
        },
        "A3-C1": {
            player_keys: ["P2", "P4"],
            pass_type: "scene",
            pass_value: "A4-C1",
            fail_type: "scene",
            fail_value: "B1-C1"
        },
        "A4-C1": {
            player_keys: ["P1"],
            pass_type: "scene",
            pass_value: "A5-C1",
            fail_type: "scene",
            fail_value: "B2-C1"
        },
        "A5-C1": {
            player_keys: ["P5", "P6"],
            pass_type: "win",
            pass_value: 1.15, // estimated, needs verification
            fail_type: "win",
            fail_value: 0.8
        },
        "B1-C1": {
            player_keys: ["P1"],
            pass_type: "scene",
            pass_value: "B2-C1",
            fail_type: "scene",
            fail_value: "B2-C2"
        },
        "B2-C1": {
            player_keys: ["P2"],
            pass_type: "scene",
            pass_value: "B3-C1",
            fail_type: "scene",
            fail_value: "B2-C2"
        },
        "B2-C2": {
            player_keys: ["P6"],
            pass_type: "win",
            pass_value: 0.5,
            fail_type: "lose",
            fail_value: 0
        },
        "B3-C1": {
            player_keys: ["P6"],
            pass_type: "win",
            pass_value: 0.6,
            fail_type: "lose",
            fail_value: 0
        }
    },
    snow_blind: {
        "A1-C1": {
            player_keys: ["P3", "P4"],
            pass_type: "scene",
            pass_value: "A2-C1",
            fail_type: "scene",
            fail_value: "A1-C2"
        },
        "A1-C2": {
            player_keys: ["P3"],
            pass_type: "scene",
            pass_value: "A2-C1",
            fail_type: "scene",
            fail_value: "A1-C3"
        },
        "A1-C3": {
            player_keys: ["P4"],
            pass_type: "scene",
            pass_value: "A2-C1",
            fail_type: "lose",
            fail_value: 0
        },
        "A2-C1": {
            player_keys: ["P1"],
            pass_type: "scene",
            pass_value: "A3-C1",
            fail_type: "scene",
            fail_value: "A2-C2"
        },
        "A2-C2": {
            player_keys: ["P2"],
            pass_type: "scene",
            pass_value: "A3-C1",
            fail_type: "unknown",
            fail_value: 0.5
        },
        "A3-C1": {
            player_keys: ["P2"],
            pass_type: "scene",
            pass_value: "A4-C1",
            fail_type: "scene",
            fail_value: "A3-C2"
        },
        "A3-C2": {
            player_keys: ["P1"],
            pass_type: "scene",
            pass_value: "A4-C1",
            fail_type: "unknown",
            fail_value: 0.5
        },
        "A4-C1": {
            player_keys: ["P1"],
            pass_type: "scene",
            pass_value: "A5-C1",
            fail_type: "scene",
            fail_value: "A4-C2"
        },
        "A4-C2": {
            player_keys: ["P1", "P2"],
            pass_type: "scene",
            pass_value: "A5-C1",
            fail_type: "scene",
            fail_value: "A4-C3"
        },
        "A4-C3": {
            player_keys: ["P1"],
            pass_type: "win",
            pass_value: 0.75,
            fail_type: "lose",
            fail_value: 0,
        },
        "A5-C1": {
            player_keys: ["P1"],
            pass_type: "scene",
            pass_value: "A6-C1",
            fail_type: "scene",
            fail_value: "A5-C2"
        },
        "A5-C2": {
            player_keys: ["P2"],
            pass_type: "scene",
            pass_value: "A6-C1",
            fail_type: "unknown",
            fail_value: 0.5
        },
        "A6-C1": {
            player_keys: ["P2"],
            pass_type: "scene",
            pass_value: "A7-C1",
            fail_type: "scene",
            fail_value: "A6-C2"
        },
        "A6-C2": {
            player_keys: ["P1"],
            pass_type: "scene",
            pass_value: "B7-C1",
            fail_type: "scene",
            fail_value: "A6-C3"
        },
        "A6-C3": {
            player_keys: ["P3", "P4"],
            pass_type: "unknown",
            pass_value: 0.5,
            fail_type: "lose",
            fail_value: 0
        },
        "A7-C1": {
            player_keys: ["P2"],
            pass_type: "win",
            pass_value: 1.3,
            fail_type: "win",
            fail_value: 1.2
        },
        "B7-C1": {
            player_keys: ["P3", "P4"],
            pass_type: "win",
            pass_value: 1.1,
            fail_type: "win",
            fail_value: 1.05
        }
    },
    counter_offer: {
        "A1-C1": {
            player_keys: ["P1"],
            pass_type: "scene",
            pass_value: "A2-C1",
            fail_type: "scene",
            fail_value: "A1-C2"
        },
        "A1-C2": {
            player_keys: ["P1"],
            pass_type: "scene",
            pass_value: "A2-C1",
            fail_type: "scene",
            fail_value: "A1-C3"
        },
        "A1-C3": {
            player_keys: ["P2", "P4"],
            pass_type: "scene",
            pass_value: "A2-C1",
            fail_type: "lose",
            fail_value: 0
        },
        "A2-C1": {
            player_keys: ["P5"],
            pass_type: "scene",
            pass_value: "A3-C1",
            fail_type: "scene",
            fail_value: "A2-C2"
        },
        "A2-C2": {
            player_keys: ["P1"],
            pass_type: "scene",
            pass_value: "A3-C1",
            fail_type: "lose",
            fail_value: 0
        },
        "A3-C1": {
            player_keys: ["P3"],
            pass_type: "scene",
            pass_value: "A4-C1",
            fail_type: "scene",
            fail_value: "A3-C2"
        },
        "A3-C2": {
            player_keys: ["P3"],
            pass_type: "scene",
            pass_value: "A4-C1",
            fail_type: "scene",
            fail_value: "B3-C1"
        },
        "A4-C1": {
            player_keys: ["P3"],
            pass_type: "scene",
            pass_value: "A5-C1",
            fail_type: "scene",
            fail_value: "A4-C2"
        },
        "A4-C2": {
            player_keys: ["P5"],
            pass_type: "scene",
            pass_value: "A5-C1",
            fail_type: "lose",
            fail_value: 0
        },
        "A5-C1": {
            player_keys: ["P4", "P1"],
            pass_type: "scene",
            pass_value: "A6-C1",
            fail_type: "scene",
            fail_value: "A5-C2"
        },
        "A5-C2": {
            player_keys: ["P2"],
            pass_type: "win",
            pass_value: 0.65,
            fail_type: "unknown",
            fail_value: 0.5
        },
        "A6-C1": {
            player_keys: ["P2", "P5"],
            pass_type: "win",
            pass_value: 1.10,
            fail_type: "unknown",
            fail_value: 0.5
        },
        "B3-C1": {
            player_keys: ["P2"],
            pass_type: "scene",
            pass_value: "B4-C1",
            fail_type: "unknown",
            fail_value: 0.5
        },
        "B4-C1": {
            player_keys: ["P4"],
            pass_type: "win",
            pass_value: 0.5,
            fail_type: "unknown",
            fail_value: 0.5
        }
    },
    leave_no_trace: {
        "A1-C1": {
            player_keys: ["P1"],
            pass_type: "scene",
            pass_value: "A2-C1",
            fail_type: "scene",
            fail_value: "A1-C2"
        },
        "A1-C2": {
            player_keys: ["P2"],
            pass_type: "scene",
            pass_value: "A2-C1",
            fail_type: "lose",
            fail_value: 0
        },
        "A2-C1": {
            player_keys: ["P2"],
            pass_type: "scene",
            pass_value: "A3-C1",
            fail_type: "scene",
            fail_value: "A2-C2"
        },
        "A2-C2": {
            player_keys: ["P3"],
            pass_type: "scene",
            pass_value: "A3-C1",
            fail_type: "scene",
            fail_value: "B1-C1"
        },
        "A3-C1": {
            player_keys: ["P3"],
            pass_type: "scene",
            pass_value: "A4-C1",
            fail_type: "scene",
            fail_value: "A3-C2"
        },
        "A3-C2": {
            player_keys: ["P2"],
            pass_type: "scene",
            pass_value: "A4-C1",
            fail_type: "scene",
            fail_value: "A3-C3"
        },
        "A3-C3": {
            player_keys: ["P1"],
            pass_type: "scene",
            pass_value: "A4-C1",
            fail_type: "lose",
            fail_value: 0
        },
        "A4-C1": {
            player_keys: ["P3"],
            pass_type: "scene",
            pass_value: "A5-C1",
            fail_type: "scene",
            fail_value: "A4-C2"
        },
        "A4-C2": {
            player_keys: ["P3"],
            pass_type: "scene",
            pass_value: "A6-C1",
            fail_type: "lose",
            fail_value: 0
        },
        "A5-C1": {
            player_keys: ["P1"],
            pass_type: "scene",
            pass_value: "A7-C1",
            fail_type: "scene",
            fail_value: "A6-C1"
        },
        "A6-C1": {
            player_keys: ["P1"],
            pass_type: "scene",
            pass_value: "A8-C1",
            fail_type: "scene",
            fail_value: "A6-C2"
        },
        "A6-C2": {
            player_keys: ["P2"],
            pass_type: "scene",
            pass_value: "A8-C1",
            fail_type: "scene",
            fail_value: "A6-C3"
        },
        "A6-C3": {
            player_keys: ["P3"],
            pass_type: "win",
            pass_value: 1,
            fail_type: "lose",
            fail_value: 0
        },
        "A7-C1": {
            player_keys: ["P2", "P3"],
            pass_type: "win",
            pass_value: 1.40,
            fail_type: "win",
            fail_value: 1.25
        },
        "A8-C1": {
            player_keys: ["P2"],
            pass_type: "win",
            pass_value: 1.1,
            fail_type: "win",
            fail_value: 1.05
        },
        "B1-C1": {
            player_keys: ["P3"],
            pass_type: "scene",
            pass_value: "B2-C1",
            fail_type: "unknown",
            fail_value: 0.5
        },
        "B2-C1": {
            player_keys: ["P1", "P2"],
            pass_type: "win",
            pass_value: 0.85,
            fail_type: "lose",
            fail_value: 0
        }
    },
    no_reserve: {
         "A1-C1": {
            player_keys: ["P2", "P3"],
            pass_type: "scene",
            pass_value: "A2-C1",
            fail_type: "scene",
            fail_value: "A1-C2"
        },
        "A1-C2": {
            player_keys: ["P2", "P3"],
            pass_type: "scene",
            pass_value: "A2-C1",
            fail_type: "scene",
            fail_value: "A1-C3"
        },
        "A1-C3": {
            player_keys: ["P1", "P3"],
            pass_type: "scene",
            pass_value: "A2-C1",
            fail_type: "lose",
            fail_value: 0
        },
        "A2-C1": {
            player_keys: ["P2"],
            pass_type: "scene",
            pass_value: "A3-C1",
            fail_type: "scene",
            fail_value: "A2-C2"
        },
        "A2-C2": {
            player_keys: ["P2"],
            pass_type: "scene",
            pass_value: "A3-C1",
            fail_type: "unknown",
            fail_value: 0
        },
        "A3-C1": {
            player_keys: ["P2"],
            pass_type: "scene",
            pass_value: "A4-C1",
            fail_type: "scene",
            fail_value: "A3-C2"
        },
        "A3-C2": {
            player_keys: ["P3"],
            pass_type: "scene",
            pass_value: "A4-C1",
            fail_type: "unknown",
            fail_value: 0
        },
        "A4-C1": {
            player_keys: ["P1"],
            pass_type: "scene",
            pass_value: "A5-C1",
            fail_type: "scene",
            fail_value: "B4-C1"
        },
        "A5-C1": {
            player_keys: ["P3"],
            pass_type: "scene",
            pass_value: "A6-C1",
            fail_type: "scene",
            fail_value: "B5-C1"
        },
        "A6-C1": {
            player_keys: ["P2"],
            pass_type: "win",
            pass_value: 0,
            fail_type: "scene",
            fail_value: "B8-C1"
        },
        "B4-C1": {
            player_keys: ["P3"],
            pass_type: "scene",
            pass_value: "B5-C1",
            fail_type: "lose",
            fail_value: 0
        },
        "B5-C1": {
            player_keys: ["P1"],
            pass_type: "win",
            pass_value: 0,
            fail_type: "scene",
            fail_value: "B5-C2"
        },
        "B5-C2": {
            player_keys: ["P2"],
            pass_type: "unknown",
            pass_value: 0,
            fail_type: "lose",
            fail_value: 0
        },
        "B8-C1":  {
            player_keys: ["P2"],
            pass_type: "win",
            pass_value: 0,
            fail_type: "scene",
            fail_value: "B8-C2"
        },
        "B8-C2": {
            player_keys: ["P1", "P3"],
            pass_type: "win",
            pass_value: 0,
            fail_type: "lose",
            fail_value: 0
        }
    },
    bidding_war: {
        "A1-C1": {
            player_keys: ["P5"],
            pass_type: "scene",
            pass_value: "A2-C1",
            fail_type: "scene",
            fail_value: "A1-C2"
        },
        "A1-C2": {
            player_keys: ["P5","P6"],
            pass_type: "scene",
            pass_value: "A2-C1",
            fail_type: "unknown",
            fail_value: 0.5
        },
        "A2-C1": {
            player_keys: ["P2"],
            pass_type: "scene",
            pass_value: "A3-C1",
            fail_type: "unknown",
            fail_value: 0.5
        },
        "A3-C1": {
            player_keys: ["P1"],
            pass_type: "scene",
            pass_value: "A4-C1",
            fail_type: "scene",
            fail_value: "A3-C2"
        },
        "A3-C2": {
            player_keys: ["P3"],
            pass_type: "scene",
            pass_value: "A4-C1",
            fail_type: "scene",
            fail_value: "A3-C3"
        },
        "A3-C3": {
            player_keys: ["P1", "P3"],
            pass_type: "scene",
            pass_value: "A4-C1",
            fail_type: "lose",
            fail_value: 0
        },
        "A4-C1": {
            player_keys: ["P1"],
            pass_type: "scene",
            pass_value: "A5-C1",
            fail_type: "scene",
            fail_value: "A4-C2"
        },
        "A4-C2": {
            player_keys: ["P6"],
            pass_type: "scene",
            pass_value: "A5-C1",
            fail_type: "scene",
            fail_value: "A4-C3"
        },
        "A4-C3": {
            player_keys: ["P1"],
            pass_type: "lose",
            pass_value: 0,
            fail_type: "lose",
            fail_value: 0
        },
        "A5-C1": {
            player_keys: ["P3", "P4"],
            pass_type: "scene",
            pass_value: "A6-C1",
            fail_type: "scene",
            fail_value: "A5-C2"
        },
        "A5-C2": {
            player_keys: ["P3"],
            pass_type: "scene",
            pass_value: "A6-C2",
            fail_type: "lose",
            fail_value: 0
        },
        "A6-C1": {
            player_keys: ["P2", "P4"],
            pass_type: "scene",
            pass_value: "A7-C1",
            fail_type: "scene",
            fail_value: "A6-C2"
        },
        "A6-C2": {
            player_keys: ["P3"],
            pass_type: "win",
            pass_value: 1,
            fail_type: "win",
            fail_value: 0.85
        },
        "A7-C1": {
            player_keys: ["P6"],
            pass_type: "win",
            pass_value: 1.33,
            fail_type: "win",
            fail_value: 1.15
        }
    },
    /* MAPPED */ honey_trap: {
        "A1-C1": {
            player_keys: ["P1"],
            pass_type: "scene",
            pass_value: "A2-C1",
            fail_type: "scene",
            fail_value: "A1-C2"
        },
        "A1-C2" : {
            player_keys: ["P2"],
            pass_type: "scene",
            pass_value: "A2-C1",
            fail_type: "scene",
            fail_value: "A1-C3"
        },
        "A1-C3": {
            player_keys: ["P3"],
            pass_type: "scene",
            pass_value: "A2-C1",
            fail_type: "lose",
            fail_value: 0
        },
        "A2-C1": {
            player_keys: ["P2"],
            pass_type: "scene",
            pass_value: "A3-C1",
            fail_type: "scene",
            fail_value: "A2-C2"
        },
        "A2-C2": {
            player_keys: ["P1"],
            pass_type: "scene",
            pass_value: "A3-C1",
            fail_type: "scene",
            fail_value: "A2-C3"
        },
        "A2-C3": {
            player_keys: ["P3"],
            pass_type: "scene",
            pass_value: "A3-C1",
            fail_type: "lose",
            fail_value: 0
        },
        "A3-C1": {
            player_keys: ["P1"],
            pass_type: "scene",
            pass_value: "A4-C1",
            fail_type: "scene",
            fail_value: "B1-C1"
        },
        "A4-C1": {
            player_keys: ["P1"],
            pass_type: "scene",
            pass_value: "A5-C1",
            fail_type: "scene",
            fail_value: "A4-C2"
        },
        "A4-C2": {
            player_keys: ["P2", "P3"],
            pass_type: "scene",
            pass_value: "A5-C2",
            fail_type: "lose",
            fail_value: 0
        },
        "A5-C1": {
            player_keys: ["P3"],
            pass_type: "scene",
            pass_value: "A6-C1",
            fail_type: "scene",
            fail_value: "A5-C2"
        },
        "A5-C2": {
            player_keys: ["P2"],
            pass_type: "scene",
            pass_value: "A6-C2",
            fail_type: "lose",
            fail_value: 0
        },
        "A6-C1": {
            player_keys: ["P2", "P3"],
            pass_type: "scene",
            pass_value: "A7-C1",
            fail_type: "scene",
            fail_value: "A6-C2"
        },
        "A6-C2": {
            player_keys: ["P3"],
            pass_type: "scene",
            pass_value: "A7-C1",
            fail_type: "win",
            fail_value: 1
        },
        "A7-C1": {
            player_keys: ["P1", "P2"],
            pass_type: "win",
            pass_value: 1.45,
            fail_type: "win",
            fail_value: 1.2
        },
        "B1-C1": {
            player_keys: ["P3"],
            pass_type: "scene",
            pass_value: "B2-C1",
            fail_type: "scene",
            fail_value: "B1-C2"
        },
        "B1-C2": {
            player_keys: ["P3"],
            pass_type: "scene",
            pass_value: "B2-C1",
            fail_type: "lose",
            fail_value: 0
        },
        "B2-C1": {
            player_keys: ["P2", "P3"],
            pass_type: "win",
            pass_value: 0.80,
            fail_type: "scene",
            fail_value: "B2-C2"
        },
        "B2-C2": {
            player_keys: ["P3"],
            pass_type: "win",
            pass_value: 0.75,
            fail_type: "lose",
            fail_value: 0
        }
    },
    /* MAPPED */ blast_from_the_past: {
        "A1-C1": {
            player_keys: ["P5"],
            pass_type: "scene",
            pass_value: "A2-C1",
            fail_type: "scene",
            fail_value: "A1-C2"
        },
        "A1-C2": {
            player_keys: ["P1","P6"],
            pass_type: "scene",
            pass_value: "A2-C1",
            fail_type: "scene",
            fail_value: "A1-C3"
        },
        "A1-C3": {
            player_keys: ["P2"],
            pass_type: "scene",
            pass_value: "A2-C1",
            fail_type: "lose",
            fail_value: 0
        },
        "A2-C1": {
            player_keys: ["P2"],
            pass_type: "scene",
            pass_value: "A3-C1",
            fail_type: "scene",
            fail_value: "A2-C2"
        },
        "A2-C2": {
            player_keys: ["P1"],
            pass_type: "scene",
            pass_value: "A3-C1",
            fail_type: "scene",
            fail_value: "A2-C3"
        },
        "A2-C3": {
            player_keys: ["P1"],
            pass_type: "scene",
            pass_value: "A3-C1",
            fail_type: "lose",
            fail_value: 0
        },
        "A3-C1": {
            player_keys: ["P5"],
            pass_type: "scene",
            pass_value: "A4-C1",
            fail_type: "scene",
            fail_value: "A3-C2"
        },
        "A3-C2": {
            player_keys: ["P5"],
            pass_type: "scene",
            pass_value: "A4-C1",
            fail_type: "lose",
            fail_value: 0
        },
        "A4-C1": {
            player_keys: ["P3"],
            pass_type: "scene",
            pass_value: "A5-C1",
            fail_type: "scene",
            fail_value: "A4-C2"
        },
        "A4-C2": {
            player_keys: ["P3", "P5"],
            pass_type: "scene",
            pass_value: "A5-C1",
            fail_type: "lose",
            fail_value: 0
        },
        "A5-C1": {
            player_keys: ["P4"],
            pass_type: "scene",
            pass_value: "A6-C1",
            fail_type: "scene",
            fail_value: "A5-C2"
        },
        "A5-C2": {
            player_keys: ["P3", "P4"],
            pass_type: "scene",
            pass_value: "B6-C1",
            fail_type: "lose",
            fail_value: 0
        },
        "A6-C1": {
            player_keys: ["P6"],
            pass_type: "scene",
            pass_value: "A7-C1",
            fail_type: "scene",
            fail_value: "A6-C2"
        },
        "A6-C2": {
            player_keys: ["P3","P6"],
            pass_type: "scene",
            pass_value: "A7-C1",
            fail_type: "scene",
            fail_value: "B6-C1"
        },
        "A7-C1": {
            player_keys: ["P1"],
            pass_type: "scene",
            pass_value: "A8-C1",
            fail_type: "scene",
            fail_value: "A7-C2"
        },
        "A7-C2": {
            player_keys: ["P1", "P6"],
            pass_type: "scene",
            pass_value: "A8-C1",
            fail_type: "scene", // unverified
            fail_value: "B7-C1"
        },
        "A8-C1": {
            player_keys: ["P2"],
            pass_type: "win",
            pass_value: 1.15,
            fail_type: "win",
            fail_value: 1.15 // estimated, needs verification
        },
        "B6-C1": {
            player_keys: ["P6"],
            pass_type: "scene",
            pass_value: "B7-C1",
            fail_type: "scene",
            fail_value: "B7-C1"
        },
        "B7-C1": {
            player_keys: ["P1"],
            pass_type: "scene",
            pass_value: "B8-C1",
            fail_type: "scene",
            fail_value: "B8-C1"
        },
        "B8-C1": {
            player_keys: ["P2"],
            pass_type: "win",
            pass_value: 1.05, // estimated, needs verification
            fail_type: "win",
            fail_value: 0.45 // estimated, needs verification
        },
    },
    /* MAPPED */ break_the_bank: {
        "A1-C1": {
            player_keys: ["P1","P2"],
            pass_type: "scene",
            pass_value: "A2-C1",
            fail_type: "scene",
            fail_value: "A1-C2"
        },
        "A1-C2": {
            player_keys: ["P3"],
            pass_type: "scene",
            pass_value: "A2-C1",
            fail_type: "scene",
            fail_value: "A1-C3"
        },
        "A1-C3": {
            player_keys: ["P5"],
            pass_type: "scene",
            pass_value: "A2-C1",
            fail_type: "lose",
            fail_value: 0
        },
        "A2-C1": {
            player_keys: ["P3","P4"],
            pass_type: "scene",
            pass_value: "A3-C1",
            fail_type: "scene",
            fail_value: "A2-C2"
        },
        "A2-C2": {
            player_keys: ["P3","P4"],
            pass_type: "scene",
            pass_value: "A3-C1",
            fail_type: "scene",
            fail_value: "B1-C1"
        },
        "A3-C1": {
            player_keys: ["P5"],
            pass_type: "scene",
            pass_value: "A4-C1",
            fail_type: "scene",
            fail_value: "A3-C2"
        },
        "A3-C2": {
            player_keys: ["P6"],
            pass_type: "scene",
            pass_value: "A4-C1",
            fail_type: "scene",
            fail_value: "A4-C2"
        },
        "A4-C1": {
            player_keys: ["P6"],
            pass_type: "scene",
            pass_value: "A5-C1",
            fail_type: "scene",
            fail_value: "A4-C2"
        },
        "A4-C2": {
            player_keys: ["P1", "P6"],
            pass_type: "scene",
            pass_value: "A5-C1",
            fail_type: "lose",
            fail_value: 0
        },
        "A5-C1": {
            player_keys: ["P5"],
            pass_type: "scene",
            pass_value: "A6-C1",
            fail_type: "scene",
            fail_value: "A5-C2"
        },
        "A5-C2": {
            player_keys: ["P2", "P5"],
            pass_type: "scene",
            pass_value: "A6-C1",
            fail_type: "lose",
            fail_value: 0
        },
        "A6-C1": {
            player_keys: ["P1","P2"],
            pass_type: "scene",
            pass_value: "A7-C1",
            fail_type: "scene",
            fail_value: "A7-C2"
        },
        "A7-C1": {
            player_keys: ["P1","P2"],
            pass_type: "scene",
            pass_value: "A8-C1",
            fail_type: "scene",
            fail_value: "A7-C2"
        },
        "A7-C2": {
            player_keys: ["P1","P2"],
            pass_type: "win",
            pass_value: 1.05,
            fail_type: "win",
            fail_value: 0.85
        },
        "A8-C1": {
            player_keys: ["P1", "P4"],
            pass_type: "win",
            pass_value: 1.35,
            fail_type: "win",
            fail_value: 1.2
        },
        "B1-C1": {
            player_keys: ["P6"],
            pass_type: "scene",
            pass_value: "B2-C1",
            fail_type: "lose",
            fail_value: 0
        },
        "B2-C1": {
            player_keys: ["P5"],
            pass_type: "win",
            pass_value: 0.7,
            fail_type: "scene",
            fail_value: "B2-C2"
        },
        "B2-C2": {
            player_keys: ["P2"],
            pass_type: "win",
            pass_value: 0.75,
            fail_type: "lose",
            fail_value: 0
        }
    }
}


unsafeWindow.OC2Test = function (crime_id, player_cpr, unknown_value) {
    // usage: OC2Test("market_forces", [90,90,90,90,90,90], 0.5)
    let player_slots = []
    for (var i=0; i<player_cpr.length; i++) {
        player_slots.push({
            key: "P"+(i+1),
            successChance: player_cpr[i]
        })
    }
    let results = calculateOCResults(crime_id, player_slots, unknown_value);
    console.log(`${USDollar.format(results.money)},  ${Math.round(100*(results.odds))/100}%`);
}

unsafeWindow.OC2PositionCompare = function (crime_id, main_cpr, diff_cpr, unknown_value=0.5) {
    // we will just go with 6 players always to simplify things
    for(let i=0; i<6; i++) {
        let player_slots = new Array(6).fill(main_cpr);
        player_slots[i] = diff_cpr;
        console.log(`Result for CPR ${player_slots}:`);
        unsafeWindow.OC2Test(crime_id, player_slots, unknown_value);
    }
}


// https://www.torn.com/factions.php?step=your&type=1#/tab=crimes&crimeId=333211
