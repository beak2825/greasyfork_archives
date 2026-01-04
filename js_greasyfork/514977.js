// ==UserScript==
// @name        Disposal J.A.R.V.I.S.
// @namespace   disposal-guide.nao.zero
// @version     1.05
// @description color disposal options based on safety
// @author      Terekhov, nao
// @match       https://www.torn.com/loader.php?sid=crimes*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/514977/Disposal%20JARVIS.user.js
// @updateURL https://update.greasyfork.org/scripts/514977/Disposal%20JARVIS.meta.js
// ==/UserScript==
let url = window.location.href;
const colors = {
    safe: "#40Ab24",
    moderatelySafe: "#A4D497",
    caution: "#D6BBA2",
    unsafe: "#B51B1B",
};
const JOB_METHOD_DIFFICULTIES_MAP = {
    "Biological Waste": {
        safe: ["Sink"],
        moderatelySafe: [],
        caution: ["Burn"],
        unsafe: ["Bury"],
    },
    "Body Part": {
        safe: ["Dissolve"],
        moderatelySafe: [],
        caution: [],
        unsafe: [],
    },
    "Broken Appliance": {
        safe: ["Sink"],
        moderatelySafe: [],
        caution: ["Abandon", "Bury"],
        unsafe: ["Dissolve"],
    },
    "Building Debris": {
        safe: ["Sink"],
        moderatelySafe: [],
        caution: ["Abandon", "Bury"],
        unsafe: [],
    },
    "Dead Body": {
        safe: ["Dissolve"],
        moderatelySafe: [],
        caution: [],
        unsafe: [],
    },
    Documents: {
        safe: ["Burn"],
        moderatelySafe: [],
        caution: ["Abandon", "Bury"],
        unsafe: ["Dissolve", "Sink"],
    },
    Firearm: {
        safe: ["Sink"],
        moderatelySafe: ["Bury"],
        caution: [],
        unsafe: ["Dissolve"],
    },
    "General Waste": {
        safe: ["Burn"],
        moderatelySafe: ["Bury"],
        caution: ["Abandon", "Sink"],
        unsafe: ["Dissolve"],
    },
    "Industrial Waste": {
        safe: ["Sink"],
        moderatelySafe: [],
        caution: ["Abandon", "Bury"],
        unsafe: [],
    },
    "Murder Weapon": {
        safe: ["Sink"],
        moderatelySafe: [],
        caution: [],
        unsafe: ["Dissolve"],
    },
    "Old Furniture": {
        safe: ["Burn"],
        moderatelySafe: [],
        caution: ["Abandon", "Bury", "Sink"],
        unsafe: ["Dissolve"],
    },
    Vehicle: {
        safe: ["Sink"],
        moderatelySafe: ["Burn"],
        caution: ["Abandon"],
        unsafe: [],
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

