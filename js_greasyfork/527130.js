// ==UserScript==
// @name        Disposal Unique Finds
// @namespace   disposal-guide.nao.zero.uf
// @version     1.03
// @description color disposal options based on safety
// @author      Terekhov, nao
// @match       https://www.torn.com/loader.php?sid=crimes*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant       none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/527130/Disposal%20Unique%20Finds.user.js
// @updateURL https://update.greasyfork.org/scripts/527130/Disposal%20Unique%20Finds.meta.js
// ==/UserScript==
let url = window.location.href;
const colors = {
    safe: "#40Ab24",
    moderatelySafe: "#A4D497",
    caution: "#D6BBA2",
    unsafe: "#B51B1B",
};
//Unique Finds
const JOB_METHOD_DIFFICULTIES_MAP = {
        "Biological Waste": {
            safe: [],
            moderatelySafe: [],
            caution: [],
            unsafe: ["Abandon", "Burn", "Bury", "Dissolve" , "Sink"],
        },
        "Body Part": {
            safe: ["Dissolve"],
            moderatelySafe: [],
            caution: [],
            unsafe: ["Abandon", "Burn", "Bury", "Sink"],
        },
        "Broken Appliance": {
            safe: ["Sink"],
            moderatelySafe: [],
            caution: [],
            unsafe: ["Abandon", "Burn", "Bury", "Dissolve"],
        },
        "Building Debris": {
            safe: ["Abandon"],
            moderatelySafe: [],
            caution: [],
            unsafe: ["Burn", "Bury", "Dissolve" , "Sink"],
        },
        "Dead Body": {
            safe: ["Abandon"],
            moderatelySafe: [],
            caution: [],
            unsafe: ["Burn", "Bury", "Dissolve" , "Sink"],
        },
        Documents: {
            safe: ["Burn"],
            moderatelySafe: [],
            caution: [],
            unsafe: ["Abandon", "Bury", "Dissolve" , "Sink"],
        },
        Firearm: {
            safe: ["Bury"],
            moderatelySafe: [],
            caution: [],
            unsafe: ["Abandon", "Burn", "Dissolve" , "Sink"],
        },
        "General Waste": {
            safe: ["Abandon"],
            moderatelySafe: [],
            caution: [],
            unsafe: ["Burn", "Bury", "Dissolve" , "Sink"],
        },
        "Industrial Waste": {
            safe: ["Bury"],
            moderatelySafe: [],
            caution: [],
            unsafe: ["Abandon", "Burn", "Dissolve" , "Sink"],
        },
        "Murder Weapon": {
            safe: ["Sink"],
            moderatelySafe: [],
            caution: [],
            unsafe: ["Abandon", "Burn", "Bury", "Dissolve"],
        },
        "Old Furniture": {
            safe: ["Bury"],
            moderatelySafe: [],
            caution: [],
            unsafe: ["Abandon", "Burn", "Dissolve" , "Sink"],
        },
        Vehicle: {
            safe: ["Abandon"],
            moderatelySafe: [],
            caution: [],
            unsafe: ["Burn", "Bury", "Dissolve" , "Sink"],
        },
    };


const NERVE_COST_BY_METHOD = {
    Abandon: 6,
    Bury: 8,
    Burn: 10,
    Sink: 12,
    Dissolve: 14,
};

function insert() {
    url = window.location.href;

    if (!url.includes("disposal")){
        return;
    }

    $(".crime-option:not([processed])").each(function () {
        const crimeName = $(
            $("div[class^='crimeOptionSection']", $(this))[0],
        ).text();
        if (JOB_METHOD_DIFFICULTIES_MAP[crimeName]) {
            for (let crimeDifficulty in JOB_METHOD_DIFFICULTIES_MAP[crimeName]) {
                let crimeColor = colors[crimeDifficulty];
                for (let method of JOB_METHOD_DIFFICULTIES_MAP[crimeName][
                    crimeDifficulty
                ]) {
                    $(`button[aria-label='${method}']`, $(this)).css(
                        "border",
                        `3px solid ${crimeColor}`,
                    );
                }
            }
        }
        $(this).attr("processed", "true");
    });
}


setInterval(insert, 1000);
