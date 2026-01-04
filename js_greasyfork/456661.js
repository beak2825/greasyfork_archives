// ==UserScript==
// @name         Discord Developer Mode [FIXED AGAIN]
// @namespace    http://tampermonkey.net/
// @version      0.4.3
// @description  Enables the discord developer settings
// @author       you
// @license MIT
// @match        *://discord.com/*
// @match        *://ptb.discord.com/*
// @match        *://canary.discord.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=discord.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/456661/Discord%20Developer%20Mode%20%5BFIXED%20AGAIN%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/456661/Discord%20Developer%20Mode%20%5BFIXED%20AGAIN%5D.meta.js
// ==/UserScript==

let wpRequire;
window.webpackChunkdiscord_app.push([[ Math.random() ], {}, (req) => { wpRequire = req; }]);
mod = Object.values(wpRequire.c).find(x => typeof x?.exports?.Z?.isDeveloper !== "undefined");
usermod = Object.values(wpRequire.c).find(x => x?.exports?.default?.getUsers)
nodes = Object.values(mod.exports.Z._dispatcher._actionHandlers._dependencyGraph.nodes)
try {
nodes.find(x => x.name == "ExperimentStore").actionHandler["OVERLAY_INITIALIZE"]({user: {flags: 1}})
} catch (e) {}
oldGetUser = usermod.exports.default.__proto__.getCurrentUser;
usermod.exports.default.__proto__.getCurrentUser = () => ({isStaff: () => true})
nodes.find(x => x.name == "DeveloperExperimentStore").actionHandler["CONNECTION_OPEN"]()
usermod.exports.default.__proto__.getCurrentUser = oldGetUser