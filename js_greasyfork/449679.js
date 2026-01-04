// ==UserScript==
// @name         Discord Experiments Enabler
// @version      1.1
// @description  Use with caution, this is not meant to be open and may cause issues with the client or with your account.
// @author       Meolsei#4905
// @match        https://discord.com/*
// @exclude      https://discord.com/developers
// @icon         https://www.google.com/s2/favicons?sz=64&domain=discord.com
// @grant        none
// @license      MIT
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/449679/Discord%20Experiments%20Enabler.user.js
// @updateURL https://update.greasyfork.org/scripts/449679/Discord%20Experiments%20Enabler.meta.js
// ==/UserScript==

let wpRequire;
window.webpackChunkdiscord_app.push([[ Math.random() ], {}, (req) => { wpRequire = req; }]);
mod = Object.values(wpRequire.c).find(x => typeof x?.exports?.default?.isDeveloper !== "undefined")
usermod = Object.values(wpRequire.c).find(x => x?.exports?.default?.getUsers)
nodes = Object.values(mod.exports.default._dispatcher._actionHandlers._dependencyGraph.nodes)
try {
    nodes.find(x => x.name == "ExperimentStore").actionHandler["CONNECTION_OPEN"]({user: {flags: 1}, type: "CONNECTION_OPEN"})
} catch (e) {}
oldGetUser = usermod.exports.default.__proto__.getCurrentUser;
usermod.exports.default.__proto__.getCurrentUser = () => ({hasFlag: () => true})
nodes.find(x => x.name == "DeveloperExperimentStore").actionHandler["CONNECTION_OPEN"]()
usermod.exports.default.__proto__.getCurrentUser = oldGetUser