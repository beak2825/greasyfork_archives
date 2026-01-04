// ==UserScript==
// @name         Marvel Rivals Better Game Stats Table
// @namespace    http://tampermonkey.net/
// @version      2025-01-15
// @description  Know exactly who to blame for your lost match based on stats!
// @author       Osiris-Team
// @match        https://tracker.gg/marvel-rivals/profile/ign/**
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tracker.gg
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/531425/Marvel%20Rivals%20Better%20Game%20Stats%20Table.user.js
// @updateURL https://update.greasyfork.org/scripts/531425/Marvel%20Rivals%20Better%20Game%20Stats%20Table.meta.js
// ==/UserScript==

var heroDetails = {
    "Damage per Minute": [
        {
            "name": "The Punisher",
            "imageUrl": "https://rivalstracker.com/_ipx/s_40x40/images/heroes/SelectHero/img_selecthero_1014001.png",
            "statValue": "2.068/min"
        },
        {
            "name": "Human Torch",
            "imageUrl": "https://rivalstracker.com/_ipx/s_40x40/images/heroes/SelectHero/img_selecthero_1017001.png",
            "statValue": "2.002/min"
        },
        {
            "name": "Squirrel Girl",
            "imageUrl": "https://rivalstracker.com/_ipx/s_40x40/images/heroes/SelectHero/img_selecthero_1032001.png",
            "statValue": "1.990/min"
        },
        {
            "name": "Moon Knight",
            "imageUrl": "https://rivalstracker.com/_ipx/s_40x40/images/heroes/SelectHero/img_selecthero_1030001.png",
            "statValue": "1.970/min"
        },
        {
            "name": "Storm",
            "imageUrl": "https://rivalstracker.com/_ipx/s_40x40/images/heroes/SelectHero/img_selecthero_1015001.png",
            "statValue": "1.965/min"
        },
        {
            "name": "Winter Soldier",
            "imageUrl": "https://rivalstracker.com/_ipx/s_40x40/images/heroes/SelectHero/img_selecthero_1041001.png",
            "statValue": "1.817/min"
        },
        {
            "name": "Star Lord",
            "imageUrl": "https://rivalstracker.com/_ipx/s_40x40/images/heroes/SelectHero/img_selecthero_1043001.png",
            "statValue": "1.815/min"
        },
        {
            "name": "Groot",
            "imageUrl": "https://rivalstracker.com/_ipx/s_40x40/images/heroes/SelectHero/img_selecthero_1027001.png",
            "statValue": "1.780/min"
        },
        {
            "name": "Namor",
            "imageUrl": "https://rivalstracker.com/_ipx/s_40x40/images/heroes/SelectHero/img_selecthero_1045001.png",
            "statValue": "1.713/min"
        },
        {
            "name": "Hela",
            "imageUrl": "https://rivalstracker.com/_ipx/s_40x40/images/heroes/SelectHero/img_selecthero_1024001.png",
            "statValue": "1.681/min"
        },
        {
            "name": "Iron Man",
            "imageUrl": "https://rivalstracker.com/_ipx/s_40x40/images/heroes/SelectHero/img_selecthero_1034001.png",
            "statValue": "1.634/min"
        },
        {
            "name": "Mister Fantastic",
            "imageUrl": "https://rivalstracker.com/_ipx/s_40x40/images/heroes/SelectHero/img_selecthero_1040001.png",
            "statValue": "1.594/min"
        },
        {
            "name": "Psylocke",
            "imageUrl": "https://rivalstracker.com/_ipx/s_40x40/images/heroes/SelectHero/img_selecthero_1048001.png",
            "statValue": "1.567/min"
        },
        {
            "name": "Hawkeye",
            "imageUrl": "https://rivalstracker.com/_ipx/s_40x40/images/heroes/SelectHero/img_selecthero_1021001.png",
            "statValue": "1.549/min"
        },
        {
            "name": "The Thing",
            "imageUrl": "https://rivalstracker.com/_ipx/s_40x40/images/heroes/SelectHero/img_selecthero_1051001.png",
            "statValue": "1.541/min"
        },
        {
            "name": "Magneto",
            "imageUrl": "https://rivalstracker.com/_ipx/s_40x40/images/heroes/SelectHero/img_selecthero_1037001.png",
            "statValue": "1.521/min"
        },
        {
            "name": "Thor",
            "imageUrl": "https://rivalstracker.com/_ipx/s_40x40/images/heroes/SelectHero/img_selecthero_1039001.png",
            "statValue": "1.517/min"
        },
        {
            "name": "Doctor Strange",
            "imageUrl": "https://rivalstracker.com/_ipx/s_40x40/images/heroes/SelectHero/img_selecthero_1018001.png",
            "statValue": "1.514/min"
        },
        {
            "name": "Scarlet Witch",
            "imageUrl": "https://rivalstracker.com/_ipx/s_40x40/images/heroes/SelectHero/img_selecthero_1038001.png",
            "statValue": "1.479/min"
        },
        {
            "name": "Magik",
            "imageUrl": "https://rivalstracker.com/_ipx/s_40x40/images/heroes/SelectHero/img_selecthero_1029001.png",
            "statValue": "1.467/min"
        },
        {
            "name": "Venom",
            "imageUrl": "https://rivalstracker.com/_ipx/s_40x40/images/heroes/SelectHero/img_selecthero_1035001.png",
            "statValue": "1.389/min"
        },
        {
            "name": "Wolverine",
            "imageUrl": "https://rivalstracker.com/_ipx/s_40x40/images/heroes/SelectHero/img_selecthero_1049001.png",
            "statValue": "1.386/min"
        },
        {
            "name": "Peni Parker",
            "imageUrl": "https://rivalstracker.com/_ipx/s_40x40/images/heroes/SelectHero/img_selecthero_1042001.png",
            "statValue": "1.358/min"
        },
        {
            "name": "Black Widow",
            "imageUrl": "https://rivalstracker.com/_ipx/s_40x40/images/heroes/SelectHero/img_selecthero_1033001.png",
            "statValue": "1.329/min"
        },
        {
            "name": "Iron Fist",
            "imageUrl": "https://rivalstracker.com/_ipx/s_40x40/images/heroes/SelectHero/img_selecthero_1052001.png",
            "statValue": "1.265/min"
        },
        {
            "name": "Hulk",
            "imageUrl": "https://rivalstracker.com/_ipx/s_40x40/images/heroes/SelectHero/img_selecthero_1011001.png",
            "statValue": "1.188/min"
        },
        {
            "name": "Black Panther",
            "imageUrl": "https://rivalstracker.com/_ipx/s_40x40/images/heroes/SelectHero/img_selecthero_1026001.png",
            "statValue": "1.168/min"
        },
        {
            "name": "Captain America",
            "imageUrl": "https://rivalstracker.com/_ipx/s_40x40/images/heroes/SelectHero/img_selecthero_1022001.png",
            "statValue": "1.138/min"
        },
        {
            "name": "Spider Man",
            "imageUrl": "https://rivalstracker.com/_ipx/s_40x40/images/heroes/SelectHero/img_selecthero_1036001.png",
            "statValue": "1.042/min"
        },
        {
            "name": "Adam Warlock",
            "imageUrl": "https://rivalstracker.com/_ipx/s_40x40/images/heroes/SelectHero/img_selecthero_1046001.png",
            "statValue": "988/min"
        },
        {
            "name": "Mantis",
            "imageUrl": "https://rivalstracker.com/_ipx/s_40x40/images/heroes/SelectHero/img_selecthero_1020001.png",
            "statValue": "845/min"
        },
        {
            "name": "Jeff The Land Shark",
            "imageUrl": "https://rivalstracker.com/_ipx/s_40x40/images/heroes/SelectHero/img_selecthero_1047001.png",
            "statValue": "813/min"
        },
        {
            "name": "Loki",
            "imageUrl": "https://rivalstracker.com/_ipx/s_40x40/images/heroes/SelectHero/img_selecthero_1016001.png",
            "statValue": "716/min"
        },
        {
            "name": "Invisible Woman",
            "imageUrl": "https://rivalstracker.com/_ipx/s_40x40/images/heroes/SelectHero/img_selecthero_1050001.png",
            "statValue": "681/min"
        },
        {
            "name": "Cloak & Dagger",
            "imageUrl": "https://rivalstracker.com/_ipx/s_40x40/images/heroes/SelectHero/img_selecthero_1025001.png",
            "statValue": "566/min"
        },
        {
            "name": "Luna Snow",
            "imageUrl": "https://rivalstracker.com/_ipx/s_40x40/images/heroes/SelectHero/img_selecthero_1031001.png",
            "statValue": "521/min"
        },
        {
            "name": "Rocket Raccoon",
            "imageUrl": "https://rivalstracker.com/_ipx/s_40x40/images/heroes/SelectHero/img_selecthero_1023001.png",
            "statValue": "155/min"
        }
    ],
    "Heal per Minute": [
        {
            "name": "Luna Snow",
            "imageUrl": "https://rivalstracker.com/_ipx/s_40x40/images/heroes/SelectHero/img_selecthero_1031001.png",
            "statValue": "2.574/min"
        },
        {
            "name": "Cloak & Dagger",
            "imageUrl": "https://rivalstracker.com/_ipx/s_40x40/images/heroes/SelectHero/img_selecthero_1025001.png",
            "statValue": "2.412/min"
        },
        {
            "name": "Rocket Raccoon",
            "imageUrl": "https://rivalstracker.com/_ipx/s_40x40/images/heroes/SelectHero/img_selecthero_1023001.png",
            "statValue": "2.348/min"
        },
        {
            "name": "Invisible Woman",
            "imageUrl": "https://rivalstracker.com/_ipx/s_40x40/images/heroes/SelectHero/img_selecthero_1050001.png",
            "statValue": "2.313/min"
        },
        {
            "name": "Loki",
            "imageUrl": "https://rivalstracker.com/_ipx/s_40x40/images/heroes/SelectHero/img_selecthero_1016001.png",
            "statValue": "2.249/min"
        },
        {
            "name": "Mantis",
            "imageUrl": "https://rivalstracker.com/_ipx/s_40x40/images/heroes/SelectHero/img_selecthero_1020001.png",
            "statValue": "1.479/min"
        },
        {
            "name": "Adam Warlock",
            "imageUrl": "https://rivalstracker.com/_ipx/s_40x40/images/heroes/SelectHero/img_selecthero_1046001.png",
            "statValue": "1.406/min"
        },
        {
            "name": "Jeff The Land Shark",
            "imageUrl": "https://rivalstracker.com/_ipx/s_40x40/images/heroes/SelectHero/img_selecthero_1047001.png",
            "statValue": "1.230/min"
        }
    ],
    "Damage Tanked per Minute": [
        {
            "name": "Groot",
            "imageUrl": "https://rivalstracker.com/_ipx/s_40x40/images/heroes/SelectHero/img_selecthero_1027001.png",
            "statValue": "4.044/min"
        },
        {
            "name": "Doctor Strange",
            "imageUrl": "https://rivalstracker.com/_ipx/s_40x40/images/heroes/SelectHero/img_selecthero_1018001.png",
            "statValue": "3.213/min"
        },
        {
            "name": "Magneto",
            "imageUrl": "https://rivalstracker.com/_ipx/s_40x40/images/heroes/SelectHero/img_selecthero_1037001.png",
            "statValue": "2.886/min"
        },
        {
            "name": "The Thing",
            "imageUrl": "https://rivalstracker.com/_ipx/s_40x40/images/heroes/SelectHero/img_selecthero_1051001.png",
            "statValue": "2.850/min"
        },
        {
            "name": "Hulk",
            "imageUrl": "https://rivalstracker.com/_ipx/s_40x40/images/heroes/SelectHero/img_selecthero_1011001.png",
            "statValue": "2.792/min"
        },
        {
            "name": "Venom",
            "imageUrl": "https://rivalstracker.com/_ipx/s_40x40/images/heroes/SelectHero/img_selecthero_1035001.png",
            "statValue": "2.714/min"
        },
        {
            "name": "Captain America",
            "imageUrl": "https://rivalstracker.com/_ipx/s_40x40/images/heroes/SelectHero/img_selecthero_1022001.png",
            "statValue": "2.504/min"
        },
        {
            "name": "Thor",
            "imageUrl": "https://rivalstracker.com/_ipx/s_40x40/images/heroes/SelectHero/img_selecthero_1039001.png",
            "statValue": "2.269/min"
        },
        {
            "name": "Peni Parker",
            "imageUrl": "https://rivalstracker.com/_ipx/s_40x40/images/heroes/SelectHero/img_selecthero_1042001.png",
            "statValue": "2.032/min"
        },
        {
            "name": "Mister Fantastic",
            "imageUrl": "https://rivalstracker.com/_ipx/s_40x40/images/heroes/SelectHero/img_selecthero_1040001.png",
            "statValue": "1.921/min"
        },
        {
            "name": "Wolverine",
            "imageUrl": "https://rivalstracker.com/_ipx/s_40x40/images/heroes/SelectHero/img_selecthero_1049001.png",
            "statValue": "1.412/min"
        },
        {
            "name": "Invisible Woman",
            "imageUrl": "https://rivalstracker.com/_ipx/s_40x40/images/heroes/SelectHero/img_selecthero_1050001.png",
            "statValue": "1.188/min"
        },
        {
            "name": "The Punisher",
            "imageUrl": "https://rivalstracker.com/_ipx/s_40x40/images/heroes/SelectHero/img_selecthero_1014001.png",
            "statValue": "1.176/min"
        },
        {
            "name": "Iron Fist",
            "imageUrl": "https://rivalstracker.com/_ipx/s_40x40/images/heroes/SelectHero/img_selecthero_1052001.png",
            "statValue": "1.148/min"
        },
        {
            "name": "Winter Soldier",
            "imageUrl": "https://rivalstracker.com/_ipx/s_40x40/images/heroes/SelectHero/img_selecthero_1041001.png",
            "statValue": "1.091/min"
        },
        {
            "name": "Magik",
            "imageUrl": "https://rivalstracker.com/_ipx/s_40x40/images/heroes/SelectHero/img_selecthero_1029001.png",
            "statValue": "937/min"
        },
        {
            "name": "Hawkeye",
            "imageUrl": "https://rivalstracker.com/_ipx/s_40x40/images/heroes/SelectHero/img_selecthero_1021001.png",
            "statValue": "881/min"
        },
        {
            "name": "Storm",
            "imageUrl": "https://rivalstracker.com/_ipx/s_40x40/images/heroes/SelectHero/img_selecthero_1015001.png",
            "statValue": "852/min"
        },
        {
            "name": "Mantis",
            "imageUrl": "https://rivalstracker.com/_ipx/s_40x40/images/heroes/SelectHero/img_selecthero_1020001.png",
            "statValue": "837/min"
        },
        {
            "name": "Adam Warlock",
            "imageUrl": "https://rivalstracker.com/_ipx/s_40x40/images/heroes/SelectHero/img_selecthero_1046001.png",
            "statValue": "834/min"
        },
        {
            "name": "Jeff The Land Shark",
            "imageUrl": "https://rivalstracker.com/_ipx/s_40x40/images/heroes/SelectHero/img_selecthero_1047001.png",
            "statValue": "811/min"
        },
        {
            "name": "Star Lord",
            "imageUrl": "https://rivalstracker.com/_ipx/s_40x40/images/heroes/SelectHero/img_selecthero_1043001.png",
            "statValue": "806/min"
        },
        {
            "name": "Luna Snow",
            "imageUrl": "https://rivalstracker.com/_ipx/s_40x40/images/heroes/SelectHero/img_selecthero_1031001.png",
            "statValue": "762/min"
        },
        {
            "name": "Iron Man",
            "imageUrl": "https://rivalstracker.com/_ipx/s_40x40/images/heroes/SelectHero/img_selecthero_1034001.png",
            "statValue": "735/min"
        },
        {
            "name": "Namor",
            "imageUrl": "https://rivalstracker.com/_ipx/s_40x40/images/heroes/SelectHero/img_selecthero_1045001.png",
            "statValue": "735/min"
        },
        {
            "name": "Black Panther",
            "imageUrl": "https://rivalstracker.com/_ipx/s_40x40/images/heroes/SelectHero/img_selecthero_1026001.png",
            "statValue": "733/min"
        },
        {
            "name": "Moon Knight",
            "imageUrl": "https://rivalstracker.com/_ipx/s_40x40/images/heroes/SelectHero/img_selecthero_1030001.png",
            "statValue": "731/min"
        },
        {
            "name": "Squirrel Girl",
            "imageUrl": "https://rivalstracker.com/_ipx/s_40x40/images/heroes/SelectHero/img_selecthero_1032001.png",
            "statValue": "715/min"
        },
        {
            "name": "Psylocke",
            "imageUrl": "https://rivalstracker.com/_ipx/s_40x40/images/heroes/SelectHero/img_selecthero_1048001.png",
            "statValue": "689/min"
        },
        {
            "name": "Scarlet Witch",
            "imageUrl": "https://rivalstracker.com/_ipx/s_40x40/images/heroes/SelectHero/img_selecthero_1038001.png",
            "statValue": "680/min"
        },
        {
            "name": "Hela",
            "imageUrl": "https://rivalstracker.com/_ipx/s_40x40/images/heroes/SelectHero/img_selecthero_1024001.png",
            "statValue": "660/min"
        },
        {
            "name": "Cloak & Dagger",
            "imageUrl": "https://rivalstracker.com/_ipx/s_40x40/images/heroes/SelectHero/img_selecthero_1025001.png",
            "statValue": "659/min"
        },
        {
            "name": "Spider Man",
            "imageUrl": "https://rivalstracker.com/_ipx/s_40x40/images/heroes/SelectHero/img_selecthero_1036001.png",
            "statValue": "646/min"
        },
        {
            "name": "Black Widow",
            "imageUrl": "https://rivalstracker.com/_ipx/s_40x40/images/heroes/SelectHero/img_selecthero_1033001.png",
            "statValue": "645/min"
        },
        {
            "name": "Loki",
            "imageUrl": "https://rivalstracker.com/_ipx/s_40x40/images/heroes/SelectHero/img_selecthero_1016001.png",
            "statValue": "621/min"
        },
        {
            "name": "Human Torch",
            "imageUrl": "https://rivalstracker.com/_ipx/s_40x40/images/heroes/SelectHero/img_selecthero_1017001.png",
            "statValue": "619/min"
        },
        {
            "name": "Rocket Raccoon",
            "imageUrl": "https://rivalstracker.com/_ipx/s_40x40/images/heroes/SelectHero/img_selecthero_1023001.png",
            "statValue": "377/min"
        }
    ]
}

/**
 * @typedef {object} Player
 * @property {number} damage - The amount of damage dealt by the player.
 * @property {number} blocked - The amount of damage blocked by the player.
 * @property {number} healing - The amount of healing done by the player.
 * @property {number} kills - The number of kills by the player.
 * @property {number} deaths - The number of deaths of the player.
 * @property {number} assists - The number of assists by the player.
 * @property {string} name - The name of the player.
 * @property {string} [hero] - The hero played by the player (optional).
 * @property {string} [rank] - The rank of the player (optional).
 * @property {string} [KDA] - The Kill/Death/Assist ratio of the player (optional).
 * @property {number} [killsSolo] - The number of solo kills (optional).
 * @property {number} [killsHead] - The number of headshot kills (optional).
 * @property {number} [killsLastHit] - The number of last hit kills (optional).
 * @property {number} [accuracy] - The accuracy of the player (optional).
 * @property {HTMLTableElement} [table] - The HTML table element the player data came from (optional).
 * @property {string} [team] - The team the player belongs to (optional).
 */

function determineStatType(player) {
    const highestStat = Math.max(player.damage, player.blocked, player.healing);
    return highestStat === player.damage
        ? "damage"
        : highestStat === player.blocked
            ? "blocked"
            : "healing";
}

function determineStatTypeSecondary(player) {
    const highestStat = Math.max(player.kills, player.deaths, player.assists);
    return highestStat === player.kills
        ? "kills"
        : highestStat === player.deaths
            ? "deaths"
            : "assists";
}

/**
 * Calculate the difference between the highest stat of player1 and the closest stat of player2.
 * @param {Player} player1 - The first player stats object.
 * @param {Player} player2 - The second player stats object.
 * @returns {Object} An object with the differences in damage, blocked, and healing, and the most relevant difference.
 */
function calculateStatDifferences(player1, player2) {
    // Determine the highest stat for player1
    const statTypeP1 = determineStatType(player1)
    const statTypeP2 = determineStatType(player2)
    const statTypeP1Sec = determineStatTypeSecondary(player1)
    const statTypeP2Sec = determineStatTypeSecondary(player2)

    // Find the closest corresponding stat in player2
    const statDiffs = {
        damageDiff: player1.damage - player2.damage,
        blockedDiff: player1.blocked - player2.blocked,
        healingDiff: player1.healing - player2.healing,
        killsDiff: player1.kills - player2.kills,
        deathsDiff: player1.deaths - player2.deaths,
        assistsDiff: player1.assists - player2.assists,
        // Add percentage differences
        damageDiffPercent: player2.damage == 0 && player1.damage == 0 ? 0 : player2.damage !== 0 ? ((player1.damage - player2.damage) / player2.damage * 100) : 100,
        blockedDiffPercent: player2.blocked == 0 && player1.blocked == 0 ? 0 : player2.blocked !== 0 ? ((player1.blocked - player2.blocked) / player2.blocked * 100) : 100,
        healingDiffPercent: player2.healing == 0 && player1.healing == 0 ? 0 : player2.healing !== 0 ? ((player1.healing - player2.healing) / player2.healing * 100) : 100,
        killsDiffPercent: player2.kills == 0 && player1.kills == 0 ? 0 : player2.kills !== 0 ? ((player1.kills - player2.kills) / player2.kills * 100) : 100,
        deathsDiffPercent: player2.deaths == 0 && player1.deaths == 0 ? 0 : player2.deaths !== 0 ? ((player1.deaths - player2.deaths) / player2.deaths * 100) : 100,
        assistsDiffPercent: player2.assists == 0 && player1.assists == 0 ? 0 : player2.assists !== 0 ? ((player1.assists - player2.assists) / player2.assists * 100) : 100,
    };

    // Get the relevant stat difference based on player1's highest stat
    const relevantDiff = statDiffs[`${statTypeP1}Diff`];
    const relevantDiffSec = statDiffs[`${statTypeP1Sec}Diff`];

    // Find the closest corresponding stat in player2
    const statDiffsAbs = {
        damageDiffAbs: Math.abs(player1.damage - player2.damage),
        blockedDiffAbs: Math.abs(player1.blocked - player2.blocked),
        healingDiffAbs: Math.abs(player1.healing - player2.healing),
        killsDiffAbs: Math.abs(player1.kills - player2.kills),
        deathsDiffAbs: Math.abs(player1.deaths - player2.deaths),
        assistsDiffAbs: Math.abs(player1.assists - player2.assists),
    };

    // Get the relevant stat difference based on player1's highest stat
    const relevantDiffAbs = statDiffsAbs[`${statTypeP1}DiffAbs`];
    const relevantDiffAbsSec = statDiffsAbs[`${statTypeP1Sec}DiffAbs`];

    return {
        ...statDiffs,
        relevantDiff,
        relevantDiffSec,
        totalDiff: statDiffs.damageDiff + statDiffs.blockedDiff + statDiffs.healingDiff, // Total difference
        totalDiffPercent: statDiffs.damageDiffPercent + statDiffs.blockedDiffPercent + statDiffs.healingDiffPercent,
        totalDiffSec: statDiffs.killsDiff + statDiffs.assistsDiff, // statDiffs.deathsDiff
        totalDiffSecPercent: statDiffs.killsDiffPercent + statDiffs.assistsDiffPercent, // statDiffs.deathsDiff

        ...statDiffsAbs,
        relevantDiffAbs, // Most relevant difference
        relevantDiffAbsSec,
        totalDiffAbs: statDiffsAbs.damageDiffAbs + statDiffsAbs.blockedDiffAbs + statDiffsAbs.healingDiffAbs, // Total difference
        totalDiffAbsSec: statDiffsAbs.killsDiffAbs + statDiffsAbs.assistsDiffAbs, // statDiffsAbs.deathsDiffAbs
        statTypeP1,
        statTypeP1Sec,
        statTypeP2, // Type of the highest stat
        statTypeP2Sec,
    };
}

/**
 * @param {Player} player1 - The first player stats object.
 * @param {number} matchDurationSeconds - Duration of the match in seconds.
 * @returns {Object} Top 500 player with adjusted stats.
 */
function getTop500Player(player1, matchDurationSeconds) {
    let heroAliases = [player1.hero, player1.hero.replace(" ", "-"), player1.hero.replace("-", " ")];

    if (!heroDetails || !heroDetails["Damage per Minute"] || !heroDetails["Damage Tanked per Minute"] || !heroDetails["Heal per Minute"]) {
        throw new Error("heroDetails object is missing required properties.");
    }

    let heroDmg = heroDetails["Damage per Minute"].find(hero => heroAliases.includes(hero.name));
    let heroBlock = heroDetails["Damage Tanked per Minute"].find(hero => heroAliases.includes(hero.name));
    let heroHeal = heroDetails["Heal per Minute"].find(hero => heroAliases.includes(hero.name));
    console.log(player1.hero + ": ", heroDmg, heroBlock, heroHeal)

    let dmgPerMin = heroDmg ? parseInt(heroDmg.statValue.replace(/[^0-9]/g, "")) : 0;
    let blockedPerMin = heroBlock ? parseInt(heroBlock.statValue.replace(/[^0-9]/g, "")) : 0;
    let healPerMin = heroHeal ? parseInt(heroHeal.statValue.replace(/[^0-9]/g, "")) : 0;
    console.log(player1.hero+": "+dmgPerMin+" "+blockedPerMin+" "+ healPerMin)

    /** @type {Player} */
    let player2 = {
        name: "Avg. Top " + heroAliases[0],
        hero: heroAliases[0],
        damage: parseInt(""+ ((dmgPerMin / 60.0) * matchDurationSeconds)),
        blocked: parseInt("" + ((blockedPerMin / 60.0) * matchDurationSeconds)),
        healing: parseInt("" + ((healPerMin / 60.0) * matchDurationSeconds)),
        kills: 0,
        deaths: 0,
        assists: 0,
    };

    return player2;
}


/**
 * Find the best pairs of players from two teams based on the closest stat comparison.
 * @param {Player[]} team1 - An array of player stats for team 1.
 * @param {Player[]} team2 - An array of player stats for team 2.
 * @returns {Array} An array of player pairs with their stat differences.
 */
function compareTeams(team1, team2, forceSameHeroes = false) {
    const pairs = [];
    const usedTeam1 = new Set(); // Track used players from Team 1
    const usedTeam2 = new Set(); // Track used players from Team 2

    // While we have unpaired players and fewer than 5 pairs
    while (pairs.length < 6) {
        let bestPair = null;
        let bestPairIndex1 = -1;
        let bestPairIndex2 = -1;

        // Iterate over all player combinations
        for (let i = 0; i < team1.length; i++) {
            if (usedTeam1.has(i)) continue; // Skip used players from Team 1
            let p1Type = determineStatType(team1[i])

            let found = false;
            let ignoreType = false;
            while (!found) {
                for (let j = 0; j < team2.length; j++) {
                    if (usedTeam2.has(j)) continue; // Skip used players from Team 2

                    const player1 = team1[i];
                    const player2 = team2[j];

                    if (forceSameHeroes) { 
                        if (player1.hero == null || player1.hero == "" || player2.hero == null || player2.hero == "")
                            throw Error("Player1 or Player2 has null/empty hero field!")
                        if (player1.hero != player2.hero) continue;
                    }
                    if (!ignoreType && determineStatType(team2[j]) != p1Type) continue; // Try to find enemy players with same type first
                    found = true;
                    
                    const statDiffs = calculateStatDifferences(player1, player2);

                    if (
                        !bestPair ||
                        statDiffs.relevantDiffAbs < bestPair.relevantDiffAbs // Prioritize the closest match
                    ) {
                        bestPair = {
                            player1: player1,
                            player2: player2,
                            ...statDiffs,
                        };
                        bestPairIndex1 = i;
                        bestPairIndex2 = j;
                    }
                }
                if (!found) ignoreType = true; // Ignore type if one full loop failed
            }
        }

        // Add the best pair and mark players as used
        if (bestPair) {
            pairs.push(bestPair);
            usedTeam1.add(bestPairIndex1);
            usedTeam2.add(bestPairIndex2);
        }
    }

    return pairs;
}

function compareTeamsSecondary(team1, team2) {
    const pairs = [];
    const usedTeam1 = new Set(); // Track used players from Team 1
    const usedTeam2 = new Set(); // Track used players from Team 2

    // While we have unpaired players and fewer than 5 pairs
    while (pairs.length < 6) {
        let bestPair = null;
        let bestPairIndex1 = -1;
        let bestPairIndex2 = -1;

        // Iterate over all player combinations
        for (let i = 0; i < team1.length; i++) {
            if (usedTeam1.has(i)) continue; // Skip used players from Team 1
            let p1Type = determineStatTypeSecondary(team1[i])

            let found = false;
            let ignoreType = false;
            while (!found) {
                for (let j = 0; j < team2.length; j++) {
                    if (usedTeam2.has(j)) continue; // Skip used players from Team 2
                    if (!ignoreType && determineStatTypeSecondary(team2[j]) != p1Type) continue; // Try to find enemy players with same type first
                    found = true;

                    const player1 = team1[i];
                    const player2 = team2[j];
                    const statDiffs = calculateStatDifferences(player1, player2);

                    if (
                        !bestPair ||
                        statDiffs.relevantDiffAbsSec < bestPair.relevantDiffAbsSec // Prioritize the closest match
                    ) {
                        bestPair = {
                            player1: player1,
                            player2: player2,
                            ...statDiffs,
                        };
                        bestPairIndex1 = i;
                        bestPairIndex2 = j;
                    }
                }
                if (!found) ignoreType = true; // Ignore type if one full loop failed
            }
        }

        // Add the best pair and mark players as used
        if (bestPair) {
            pairs.push(bestPair);
            usedTeam1.add(bestPairIndex1);
            usedTeam2.add(bestPairIndex2);
        }
    }

    return pairs;
}


/**
 * Return table with the most similar player comparisons, sorted by lowest totalDiff first.
 * @param {Array} pairs - The array of player comparison objects.
 * @returns {HTMLTableElement} A table element representing the sorted player comparisons.
 */
function getComparisonTable(pairs) {
    // Create a copy of pairs and sort it by lowest totalDiff
    const sortedPairs = [...pairs].sort((a, b) => b.totalDiff - a.totalDiff);

    const generateSummary = (pair, index) => {
        const position = index + 1;
        const positionSuffix = ['st', 'nd', 'rd'][position - 1] || 'th';
        return `${pair.player1.name} ranked ${position}${positionSuffix}, and compared to ${pair.player2.name} had a diff of ${sPlus(pair.damageDiff)} damage, ${sPlus(pair.blockedDiff)} block and ${sPlus(pair.healingDiff)} healing.`;
    };

    const table = document.createElement('table');
    table.id = "cssTable";
    table.innerHTML = `
        <thead>
            <tr>
                <th>Copy</th>
                <th>Total Diff</th>
                <th>Team A</th>
                <th>Team B</th>
                <th>Damage Diff</th>
                <th>Blocked Diff</th>
                <th>Healing Diff</th>
            </tr>
        </thead>
        <tbody>
            ${sortedPairs.map((pair, index) => `
                <tr>
                    <td>
                        <button class="copy-button" data-summary="${encodeURIComponent(generateSummary(pair, index))}">
                            📋
                        </button>
                    </td>
                    <td>${sPlus(s(pair.totalDiff))}</td>
                    <td>${pair.player1.name} <small>${pair.statTypeP1}</small></td>
                    <td>${pair.player2.name} <small>${pair.statTypeP2}</small></td>
                    <td>${sPlus(s(pair.damageDiff))} | <small>${sPercent(pair.damageDiffPercent)}</small></td>
                    <td>${sPlus(s(pair.blockedDiff))} | <small>${sPercent(pair.blockedDiffPercent)}</small></td>
                    <td>${sPlus(s(pair.healingDiff))} | <small>${sPercent(pair.healingDiffPercent)}</small></td>
                </tr>`).join('')}
        </tbody>
        <style>
        #cssTable td
{
    text-align: center;
    vertical-align: middle;
}
        </style>
    `;

    registerCopyBtns(table);

    return table;
}

function getComparisonTableSec(pairs) {
    // Create a copy of pairs and sort it by lowest totalDiff
    const sortedPairs = [...pairs].sort((a, b) => b.totalDiffSec - a.totalDiffSec);

    // Function to generate human-readable summary
    const generateSummary = (pair, index) => {
        const position = index + 1;
        const positionSuffix = ['st', 'nd', 'rd'][position - 1] || 'th';
        return `${pair.player1.name} ranked ${position}${positionSuffix}, and compared to ${pair.player2.name} had a diff of ${sPlus(pair.killsDiff)} kills, ${sPlus(pair.deathsDiff)} deaths and ${sPlus(pair.assistsDiff)} assists.`;
    };

    const table = document.createElement('table');
    table.id = "cssTable";
    table.innerHTML = `
        <thead>
            <tr>
                <th>Copy</th>
                <th>Total Diff</th>
                <th>Team A</th>
                <th>Team B</th>
                <th>Kills Diff</th>
                <th>Deaths Diff</th>
                <th>Assists Diff</th>
            </tr>
        </thead>
        <tbody>
            ${sortedPairs.map((pair, index) => `
                <tr>
                    <td>
                        <button class="copy-button" data-summary="${encodeURIComponent(generateSummary(pair, index))}">
                            📋
                        </button>
                    </td>
                    <td>${sPlus(s(pair.totalDiffSec))}</td>
                    <td>${pair.player1.name} <small>${pair.statTypeP1Sec}</small></td>
                    <td>${pair.player2.name} <small>${pair.statTypeP2Sec}</small></td>
                    <td>${sPlus(s(pair.killsDiff))} | <small>${sPercent(pair.killsDiffPercent)}</small></td>
                    <td>${sPlus(sRev(pair.deathsDiff))} | <small>${sRevPercent(pair.deathsDiffPercent)}</small></td>
                    <td>${sPlus(s(pair.assistsDiff))} | <small>${sPercent(pair.assistsDiffPercent)}</small></td>
                </tr>`).join('')}
        </tbody>
        <style>
        #cssTable td
{
    text-align: center;
    vertical-align: middle;
}
        </style>
    `;

    registerCopyBtns(table);


    return table;
}

function getComparisonTableNormalized(pairs) {
    console.log("HELLO WORLD: ", pairs);

    // Create normalized pairs
    const normalizedPairs = pairs.map((pair, idx) => {
        // Create normalized copies
        const p1 = JSON.parse(JSON.stringify(pair.player1));
        const p2 = JSON.parse(JSON.stringify(pair.player2));
        console.log("HELLO WORLD: ", p1);
        console.log("HELLO WORLD: ", p2);

        // Apply transformations
        [p1, p2].forEach((player, i) => {
            player.kills *= 1000;
            player.assists *= 1000;
        });

        const diff = calculateStatDifferences(p1, p2);
        return {
            ...diff,
            player1: p1,
            player2: p2,
        };
    });

    // Sort by combined score (damage + kills/deaths/assists)
    const sortedPairs = [...normalizedPairs].sort((a, b) =>
        (b.totalDiff + b.totalDiffSec) - (a.totalDiff + a.totalDiffSec)
    );

    // Table generation (similar to previous but with combined scores)
    const table = document.createElement('table');
    table.id = "cssTable";
    table.innerHTML = `
        <thead>
            <tr>
                <th>Copy</th>
                <th>Total Diff</th>
                <th>Team A</th>
                <th>Team B</th>
                <th>Kills Diff</th>
                <th>Assists Diff</th>
                <th>Damage Diff</th>
                <th>Blocked Diff</th>
                <th>Heal Diff</th>
            </tr>
        </thead>
        <tbody>
            ${sortedPairs.map((pair, index) => `
                <tr>
                    <td>
                        <button class="copy-button"
                                data-summary="${encodeURIComponent(`Normalized score ${sPlus(s(pair.totalDiff + pair.totalDiffSec))} between ${pair.player1} and ${pair.player2}`)}">
                            📋
                        </button>
                    </td>
                    <td>${sPlus(s(pair.totalDiff + pair.totalDiffSec))}</td>
                    <td>${pair.player1.name} <small>${pair.statTypeP1}</small> <small>${pair.statTypeP1Sec}</small></td>
                    <td>${pair.player2.name} <small>${pair.statTypeP2}</small> <small>${pair.statTypeP2Sec}</small></td>
                    <td>${s(pair.killsDiff)}</td>
                    <td>${s(pair.assistsDiff)}</td>
                    <td>${sPlus(s(pair.damageDiff))}</td>
                    <td>${sPlus(s(pair.blockedDiff))}</td>
                    <td>${sPlus(s(pair.healingDiff))}</td>
                </tr>`).join('')}
        </tbody>
        <style>
        #cssTable td, #cssTable th {
            padding: 6px 10px;
            text-align: center;
            vertical-align: middle;
        }
        #cssTable th {
            position: sticky;
            top: 0;
        }
        </style>
    `;

    registerCopyBtns(table);
    return table;
}

/**
 * Generate a summary span for the meta comparison.
 * @param {Array} pairs - An array of player pairs with their stat differences.
 * @returns {string} A span element as a string summarizing the total differences and negative diffs.
 */
function getMetaComparisonSpan(pairs, team1, team2) {

    const generateSummary = (totals) => {
        return `Our team had ${totals.negativeDiffCount} players in negative, and a total diff of ${sPlus(totals.damageDiff)} damage, ${sPlus(totals.blockedDiff)} block and ${sPlus(totals.healingDiff)} healing.`;
    };

    // Aggregate totals for damage, blocked, and healing differences
    const totals = pairs.reduce(
        (acc, pair) => {
            acc.damageDiff += pair.damageDiff;
            acc.blockedDiff += pair.blockedDiff;
            acc.healingDiff += pair.healingDiff;

            // Count negative total differences
            if (pair.totalDiff < 0) {
                acc.negativeDiffCount++;
            }

            return acc;
        },
        { damageDiff: 0, blockedDiff: 0, healingDiff: 0, negativeDiffCount: 0 }
    );

    // Calculate efficiencies
    const totalIncomingDamage = team2.reduce((sum, p) => sum + p.damage, 0);
    const totalBlocked = team1.reduce((sum, p) => sum + p.blocked, 0);
    const totalHealing = team1.reduce((sum, p) => determineStatType(p) === 'healing' ? sum + p.healing : sum, 0);
    const healerEff = totalIncomingDamage > 0 ? (totalHealing / (totalIncomingDamage) * 100) : 0; // should do - totalBlocked, however blocked is somehow more than incomming dmg
    const blockerEff = totalIncomingDamage > 0 ? (totalBlocked / totalIncomingDamage * 100) : 0;

    const damageDealers = team1.filter(p => determineStatType(p) === 'damage');
    const dmgTotal = damageDealers.reduce((sum, p) => sum + p.damage, 0);
    const killsTotal = damageDealers.reduce((sum, p) => sum + p.kills, 0);
    const dmgEff = dmgTotal > 0 ? (dmgTotal / killsTotal) : 0;

    const table = document.createElement('table');
    table.id = "cssTable";
    table.innerHTML = `
        <thead>
            <tr>
                <th>Copy</th>
                <th>Team A Players in Negative</th>
                <th>Team Diff Damage</th>
                <th>Damage/Kills</th>
                <th>Team Diff Blocked</th>
                <th>Block Eff%</th>
                <th>Team Diff Heal</th>
                <th>Heal Eff%</th>
            </tr>
        </thead>
        <tbody>
                <tr>
                    <td>
                        <button class="copy-button" data-summary="${encodeURIComponent(generateSummary(totals))}">
                            📋
                        </button>
                    </td>
                    <td>${totals.negativeDiffCount}/6</td>
                    <td>${sPlus(s(totals.damageDiff))}</td>
                    <td>${dmgEff.toFixed(1)}</td>
                    <td>${sPlus(s(totals.blockedDiff))}</td>
                    <td>${blockerEff.toFixed(1)}%</td>
                    <td>${sPlus(s(totals.healingDiff))}</td>
                    <td>${healerEff.toFixed(1)}%</td>
                </tr>
        </tbody>
        <style>
        #cssTable td
{
    text-align: center;
    vertical-align: middle;
}
        </style>
    `;

    registerCopyBtns(table);

    return table;
}

function registerCopyBtns(table) {
    // Function to handle copy operation
    const handleCopy = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            // Optional: Show feedback that copy was successful
            //alert('Copied to clipboard!');
        } catch (err) {
            console.error('Failed to copy:', err);
            alert('Failed to copy to clipboard');
        }
    };

    // Add event listeners to copy buttons
    table.querySelectorAll('.copy-button').forEach(button => {
        button.addEventListener('click', () => {
            const summary = decodeURIComponent(button.dataset.summary);
            handleCopy(summary);
            button.innerHTML = `✅`
        });
    });
}

function s(num) {
    if (num < 0) return `<span style="color: #eea29a;">${num}</span>`
    else return `<span style="color: #86af49;">${num}</span>`
}

// reversed, meaning negative values are something good/positive
function sRev(num) {
    if (num > 0) return `<span style="color: #eea29a;">${num}</span>`
    else return `<span style="color: #86af49;">${num}</span>`
}

function sPlus(numString) {
    if (!isNaN(numString)) {
        if (numString < 0) return numString;
        else return '+' + numString;
    } else {
        if (numString.includes('>-')) return numString;
        else return numString.replace('>', '>+');
    }
}

function sPercent(num) {
    if (num === undefined) return 'N/A';
    const color = num < 0 ? '#eea29a' : '#86af49';
    return `<span style="color: ${color};">${num.toFixed(1)}%</span>`;
}

function sRevPercent(num) {
    if (num === undefined) return 'N/A';
    const color = num > 0 ? '#eea29a' : '#86af49';
    return `<span style="color: ${color};">${num.toFixed(1)}%</span>`;
}

function getMetaComparisonSpanSec(pairs) {

    const generateSummary = (totals) => {
        return `Our team had ${totals.negativeDiffCountSec} players in negative, and a total diff of ${sPlus(totals.killsDiff)} kills, ${sPlus(totals.deathsDiff)} deaths and ${sPlus(totals.assistsDiff)} assists.`;
    };

    // Aggregate totals for damage, blocked, and healing differences
    const totals = pairs.reduce(
        (acc, pair) => {
            acc.killsDiff += pair.killsDiff;
            acc.deathsDiff += pair.deathsDiff;
            acc.assistsDiff += pair.assistsDiff;

            // Count negative total differences
            if (pair.totalDiffSec < 0) {
                acc.negativeDiffCountSec++;
            }

            return acc;
        },
        { killsDiff: 0, deathsDiff: 0, assistsDiff: 0, negativeDiffCountSec: 0 }
    );

    const table = document.createElement('table');
    table.id = "cssTable";
    table.innerHTML = `
        <thead>
            <tr>
                <th>Copy</th>
                <th>Team A Players in Negative</th>
                <th>Team Diff Kills</th>
                <th>Team Diff Deaths</th>
                <th>Team Diff Assists</th>
            </tr>
        </thead>
        <tbody>
                <tr>
                    <td>
                        <button class="copy-button" data-summary="${encodeURIComponent(generateSummary(totals))}">
                            📋
                        </button>
                    </td>
                    <td>${totals.negativeDiffCountSec}/6</td>
                    <td>${sPlus(s(totals.killsDiff))}</td>
                    <td>${sPlus(sRev(totals.deathsDiff))}</td>
                    <td>${sPlus(s(totals.assistsDiff))}</td>
                </tr>
        </tbody>
        <style>
        #cssTable td
{
    text-align: center;
    vertical-align: middle;
}
        </style>
    `;

    registerCopyBtns(table);

    return table;
}

/**
 * Main function to parse the team tables, compare players, and display the results.
 */
function processGameData(team1, team2, matchDurationSeconds) {
    console.log('Starting team comparison and result generation...');
    console.log('Team 1 data:', team1);
    console.log('Team 2 data:', team2);
    try {
        const pairs = compareTeams(team1, team2);
        console.log('Comparison complete. Generated pairs:', pairs);
        
        let team3 = []
        team1.forEach(player => {
            team3.push(getTop500Player(player, matchDurationSeconds))
        });
        const pairs500 = compareTeams(team1, team3);
        console.log('Comparison500 complete. Generated pairs:', pairs500);

        const div = team1[0].table.parentElement.parentElement

        // Table
        let info = document.createElement('div')
        info.innerHTML = `
            <h4>vs TOP 500</h4>
            <span><small>Ranked by Diff Damage + Blocked + Heal compared with the average TOP 500 player with the same hero. Damage/Kills: high number = bad, because it means DPS had to hit more shots per kill.</small></span>
            `
        div.parentElement.insertBefore(pad(info), div);

        div.parentElement.insertBefore(pad(getMetaComparisonSpan(pairs500, team1, team3)), div);
        div.parentElement.insertBefore(pad(getComparisonTable(pairs500)), div);

        // Table
        info = document.createElement('div')
        info.innerHTML = `
            <h4>vs TEAM B</h4>
            <span><small>Ranked by Diff Kills + Assists + Damage + Blocked + Heal between Team A and B. The player at the top of the table is very likely the best performing player in Team A.
            If you see negative values it means the player was worse by that amount.
            Kills and assists are worth 1000 points each, to be able to compare their value with the amount of damage/block/heal.
            Note that tanks with shields might have a slight advantage: their blocked stat might be too high because dmg to shields is not counted for enemy DPS.
            We do NOT account for that.</small></span>
            `
        div.parentElement.insertBefore(pad(info), div);
        div.parentElement.insertBefore(pad(getComparisonTableNormalized(pairs)), div);

        // Table
        info = document.createElement('div')
        info.innerHTML = `
            <h4>vs TEAM B (raw)</h4>
            <span><small>Ranked by Diff Damage + Blocked + Heal. Same as the table above, however we compare damage, blocked and heal only.</small></span>
            `
        div.parentElement.insertBefore(pad(info), div);

        div.parentElement.insertBefore(pad(getMetaComparisonSpan(pairs, team1, team2)), div);
        div.parentElement.insertBefore(pad(getComparisonTable(pairs)), div);

        // Table
        info = document.createElement('div')
        info.innerHTML = `
            <h4>vs TEAM B (value)</h4>
            <span><small>Ranked by Diff Kills + Assists. Same as the table above, however we compare kills and assists between Team A and B only. Deaths are not added to the total diff. </small></span>
            `
        div.parentElement.insertBefore(pad(info), div);

        div.parentElement.insertBefore(pad(getMetaComparisonSpanSec(pairs)), div);
        div.parentElement.insertBefore(pad(getComparisonTableSec(pairs)), div);
        console.log('Comparison table displayed successfully.');
    } catch (error) {
        console.error('Error processing game data:', error);
    }
}

function pad(el) {
    el.style.padding = "7px"
    return el;
}

/**
 * Extract player data from a table.
 * @param {HTMLTableElement} table - The table element to extract player data from.
 * @returns {Array} An array of player stats for the given table.
 */
function extractPlayerData(table, teamName) {
    console.log('Extracting player data from table:', table);
    const players = [];
    const rows = table.querySelectorAll('tbody tr');
    console.log(`Found ${rows.length} rows in table.`);
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        console.log('Processing row:', row);

        let playerData = cells.length <= 12 ? // actually 11, but +1 because of expand btn
            { // unranked
                table: table,
                team: teamName,
                name: cells[0]?.textContent.trim(),
                hero: cells[1]?.querySelector("img").alt.trim(),
                KDA: cells[2]?.textContent.trim(),
                kills: Number(cells[3]?.textContent.trim()) || 0,
                deaths: Number(cells[4]?.textContent.trim()) || 0,
                assists: Number(cells[5]?.textContent.trim()) || 0,
                killsSolo: Number(cells[6]?.textContent.trim().split(" ")[0]),
                killsHead: Number(cells[6]?.textContent.trim().split(" ")[1]),
                killsLastHit: Number(cells[6]?.textContent.trim().split(" ")[2]),
                damage: Number(cells[7]?.textContent.trim().split(" ")[0].replace(",", "")) || 0,
                blocked: Number(cells[8]?.textContent.trim().split(" ")[0].replace(",", "")) || 0,
                healing: Number(cells[9]?.textContent.trim().split(" ")[0].replace(",", "")) || 0,
                accuracy: parseFloat(cells[10]?.textContent.trim().split(" ")[0]) || 0.0,
            } :
            {
                table: table,
                team: teamName,
                name: cells[0]?.textContent.trim(),
                hero: cells[1]?.querySelector("img").alt.trim(),
                rank: cells[2]?.textContent.trim(),
                KDA: cells[3]?.textContent.trim(),
                kills: Number(cells[4]?.textContent.trim()) || 0,
                deaths: Number(cells[5]?.textContent.trim()) || 0,
                assists: Number(cells[6]?.textContent.trim()) || 0,
                killsSolo: Number(cells[7]?.textContent.trim().split(" ")[0]),
                killsHead: Number(cells[7]?.textContent.trim().split(" ")[1]),
                killsLastHit: Number(cells[7]?.textContent.trim().split(" ")[2]),
                damage: Number(cells[8]?.textContent.trim().split(" ")[0].replace(",", "")) || 0,
                blocked: Number(cells[9]?.textContent.trim().split(" ")[0].replace(",", "")) || 0,
                healing: Number(cells[10]?.textContent.trim().split(" ")[0].replace(",", "")) || 0,
                accuracy: parseFloat(cells[11]?.textContent.trim().split(" ")[0]) || 0.0,
            };
        console.log('Extracted player data:', playerData);
        players.push(playerData);
    });
    console.log(`Extraction complete. Total players extracted: ${players.length}`);
    return players;
}

/**
 * Parses a time string (e.g., "7m 46s") into total seconds.
 * @param {string} timeStr - The time string to parse.
 * @returns {number} Total time in seconds.
 */
function parseTimeString(timeStr) {
    let minutes = 0, seconds = 0;

    const minMatch = timeStr.match(/(\d+)m/);
    const secMatch = timeStr.match(/(\d+)s/);

    if (minMatch) minutes = parseInt(minMatch[1], 10);
    if (secMatch) seconds = parseInt(secMatch[1], 10);

    return (minutes * 60) + seconds;
}

/**
 * Monitor the DOM for the addition of both team tables and process the game data once both appear.
 */
(function () {
    'use strict';
    console.log('Script initialized. Starting to monitor DOM...');

    let team1 = [];
    let team2 = [];
    let tablesAdded = 0; // Track number of tables added

    try {
        // Function to handle DOM mutations
        const observerCallback = (mutationsList, observer) => {
            //console.log('MutationObserver callback triggered.');
            try {
                for (const mutation of mutationsList) {
                    //console.log('Processing mutation:', mutation);

                    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                        //console.log('Detected childList or subtree mutation.');

                        // Select all tables with a parent having the class 'group/table'
                        let tables = [];
                        mutation.addedNodes.forEach(node => {
                            if (node.nodeType !== Node.ELEMENT_NODE) return;
                            let tables2;
                            if (node.tagName === 'TABLE') {
                                tables2 = [node];
                            } else {
                                tables2 = node.querySelectorAll('table');
                            }
                            for (let el of tables2) tables.push(el);
                        });
                        console.log(`Found ${tables.length} potential tables.`);

                        tables.forEach((table, index) => {
                            if (table.id == "cssTable") {
                                console.log(`Table at index ${index} ignored. Table was added by us because id contains 'cssTable'. Prevent infinite recursion.`);
                                console.log(table);
                                return;
                            }

                            if (table.parentElement == null || !table.parentElement.classList.contains('group/table')) {
                                console.log(`Table at index ${index} ignored. Parent does not match 'group/table'.`);
                                console.log(table);
                                return;
                            }

                            console.log(`Checking table at index ${index}.`);
                            if (tablesAdded === 0) {
                                console.log('Processing first table (Team 1)...');
                                team1 = extractPlayerData(table, "Team 1");
                                console.log('Extracted Team 1 data:', team1);
                                tablesAdded++;
                            } else if (tablesAdded === 1) {
                                console.log('Processing second table (Team 2)...');
                                team2 = extractPlayerData(table, "Team 2");
                                console.log('Extracted Team 2 data:', team2);
                                tablesAdded++;
                            }
                        });

                        // Once both tables are found, process the data
                        if (tablesAdded === 2) {
                            console.log('Both team tables detected. Starting data processing...');
                            
                            let matchDurationSeconds = parseTimeString(document.querySelector("div.v3-match__stats > div > div.value > span").textContent);

                            processGameData(team1, team2, matchDurationSeconds);
                            console.log('Data processing complete. Disconnecting observer.');
                            //observer.disconnect(); // Stop observing once both tables are found and processed
                            tablesAdded = 0; // Reset table tracking for future changes if needed
                            console.log('Observer disconnected and table tracking reset.');
                            break;
                        }
                    }
                }
            } catch (error) {
                console.error('Error occurred while handling DOM mutations: ' + error.message, error);
                observer.disconnect();
            }
        };

        // Set up the observer
        const observer = new MutationObserver(observerCallback);
        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });

        console.log('MutationObserver set up and observing DOM.');
    } catch (error) {
        console.error('Error initializing MutationObserver or monitoring DOM:', error);
    }
})();