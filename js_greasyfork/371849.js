// ==UserScript==
// @name         QCStats
// @namespace    https://github.com/aleab/
// @version      1.0.8
// @author       aleab
// @description  Base library to be used in scripts for stats.quake.com
// @icon         https://stats.quake.com/fav/favicon-32x32.png
// @icon64       https://stats.quake.com/fav/favicon-96x96.png
// @match        https://stats.quake.com
// @match        https://stats.quake.com/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// ==/UserScript==

/* jshint esversion: 6 */
/* global $:false, localStorage:false, JSON:false */


// VARIABLES & CONSTANTS

const LS_CONFIG = "aleab_qcstats";

let listeners = {};

let abilityImages = {
    "ALL": null,
    "ANARKI": undefined,
    "ATHENA": "mod/grapple.png",
    "BJ_BLAZKOWICZ": undefined,
    "CLUTCH": "mod/laser.png",
    "DEATH_KNIGHT": "mod/flamestrike.png",
    "DOOM_SLAYER": "mod/berserk.png",
    "GALENA": "mod/totem.png",
    "KEEL": "mod/grenadeswarm.png",
    "NYX": "mod/ghostwalk.png",
    "RANGER": "mod/direorb.png",
    "SCALEBEARER": "mod/bullrush.png",
    "SLASH": "mod/plasmatrail.png",
    "SORLAG": "mod/acidspit.png",
    "STROGG": "mod/recondrone.png",
    "VISOR": undefined
};
let championAbilityDamageTypes = {
    "ALL": null,
    "ANARKI": undefined,
    "ATHENA": [ "ATHENA_HIT" ],
    "BJ_BLAZKOWICZ": undefined,
    "CLUTCH": [ "MINING_LASER" ],
    "DEATH_KNIGHT": [ "FLAME", "FLAME_DOT", "FLAME_MELEE" ],
    "DOOM_SLAYER": [ "ABILITY_BERSERK" ],
    "GALENA": [ "UNHOLY" ],
    "KEEL": [ "SWARM_GRENADE" ],
    "NYX": [ "VENDETTA_TELEFRAG" ],
    "RANGER": [ "DIRE_ORB", "DIRE_ORB_EXPLOSION", "DIRE_ORB_TELEFRAG" ],
    "SCALEBEARER": [ "SB_DASH", "SB_STOMP" ],
    "SLASH": [ "PLASMA_TRAIL", "PLASMA_TRAIL_EXPLOSION" ],
    "SORLAG": [ "ACID", "ACID_DOT", "ACID_SPIT_DIRECT" ],
    "STROGG": [ "DRONE_KAMIKAZE_EXPLOSION", "RECON_DRONE", "RECON_DRONE_EXPLOSION" ],
    "VISOR": undefined
};

// ===================

(function(history){
    let pushState = history.pushState;
    history.pushState = function(state) {
        if (typeof history.onpushstate == "function") {
            history.onpushstate({state: state});
        }
        return pushState.apply(history, arguments);
    };
})(window.history);

$(document).ready(function() {
    let aleab = {
        qcstats: {
            addPageChangedListener: function(pageRegex, f) {
                if (!(pageRegex instanceof RegExp) || typeof f !== "function") {
                    return;
                }

                if(!listeners.hasOwnProperty(pageRegex)) {
                    listeners[pageRegex] = [];
                }
                listeners[pageRegex].push(f);
            },
            loadConfig: function() {
                return JSON.parse(localStorage.getItem(LS_CONFIG)) || {};
            },
            saveConfig: function(config) {
                if (!(config instanceof Object)) { return; }
                localStorage.setItem(LS_CONFIG, JSON.stringify(config));
            },
            abilityImages: abilityImages,
            championAbilityDamageTypes: championAbilityDamageTypes
        }
    };
    window.aleab = aleab;

    window.onpopstate = history.onpushstate = async function(e) {
        // let location.href update
        await sleep(250);

        $.each(listeners, (regex, functions) => {
            if (typeof regex === "string") {
                if (regex.startsWith('/')) { regex = regex.substring(1); }
                if (regex.endsWith('/')) { regex = regex.substring(0, regex.length - 1); }
                regex = new RegExp(regex);
            }

            if (regex instanceof RegExp) {
                if (regex.test(location.href)) {
                    $.each(functions, (i, f) => f());
                }
            }
        });
    };
});

// ===================

// FUNCTIONS

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}