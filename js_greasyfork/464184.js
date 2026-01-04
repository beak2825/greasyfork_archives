// ==UserScript==
// @name         Discord Tools
// @namespace    https://github.com/Discord-Oxygen/Discord-Console-hacks
// @version      2.2
// @description  Discord tools for moderation and customization.
// @author       Con-Quest
// @match        https://discord.com/*
// @match        https://discord.com*
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/464184/Discord%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/464184/Discord%20Tools.meta.js
// ==/UserScript==
window.addEventListener('load', function() {
  // Modify CSS to change Discord's appearance
__SECRET_EMOTION__.injectGlobal(`
    * {
        --background-primary: #000000;
        --background-secondary: #000000;
        --background-secondary-alt: #070707ff;
        --background-accent: #252525;
        --background-floating: #242424ff;
        --scrollbar-thin-track: #000000;
        --channeltextarea-background: #151515;
    }
`);

// Add free Nitro emojis to messages
(function addNitroEmojis() {
    const findText = ":bigsob:";
    const replaceText = '<img src="//cdn.discordapp.com/emojis/851766670894444810.png">';
    const elements = document.querySelectorAll('[id^="message-content-"]');
    for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        element.innerHTML = element.innerHTML.replace(new RegExp(findText, "g"), replaceText);
    }
    setTimeout(addNitroEmojis, 10);
})();

// Give current user all Discord badges
(function giveAllBadges() {
    const flags = {
        "DISCORD_EMPLOYEE": 1 << 0,
        "DISCORD_PARTNER": 1 << 1,
        "HYPESQUAD_EVENTS": 1 << 2,
        "BUG_HUNTER_LEVEL_1": 1 << 3,
        "HOUSE_BRAVERY": 1 << 6,
        "HOUSE_BRILLIANCE": 1 << 7,
        "HOUSE_BALANCE": 1 << 8,
        "EARLY_SUPPORTER": 1 << 9,
        "BUG_HUNTER_LEVEL_2": 1 << 14,
        "VERIFIED_BOT_DEVELOPER": 1 << 17,
        "CERTIFIED_MODERATOR": 1 << 18,
        "ACTIVE_DEVELOPER": 1 << 22
    };
    webpackChunkdiscord_app.push([[Math.random()], {}, req => {
        for (const m of Object.values(req.c).map(x => x.exports).filter(x => x)) {
            if (m.default && m.default.getCurrentUser) {
                m.default.getCurrentUser().flags = Object.values(flags).reduce((pre, cur) => pre + cur, 0);
            }
        }
    }]);
})();

// Give current user moderation privileges
let wpRequire; 
window.webpackChunkdiscord_app.push([[ Math.random() ], {}, (req) => { wpRequire = req; }]);
const mod = Object.values(wpRequire.c).find(x => typeof x?.exports?.Z?.isDeveloper !== "undefined");
const usermod = Object.values(wpRequire.c).find(x => x?.exports?.default?.getUsers);
const nodes = Object.values(mod.exports.Z._dispatcher._actionHandlers._dependencyGraph.nodes);
try {
    nodes.find(x => x.name === "ExperimentStore").actionHandler["OVERLAY_INITIALIZE"]({user: {flags: 1}});
} catch (e) {}
const oldGetUser = usermod.exports.default.__proto__.getCurrentUser;
usermod.exports.default.__proto__.getCurrentUser = function() { return { isStaff: function() { return true; } } };
nodes.find(x => x.name === "DeveloperExperimentStore").actionHandler["CONNECTION_OPEN"]();
usermod.exports.default.__proto__.getCurrentUser = oldGetUser;

}, false);
