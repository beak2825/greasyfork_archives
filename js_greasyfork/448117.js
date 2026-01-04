// ==UserScript==
// @name         Discord Developer Mode [FIXED 2023]
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Enables the discord developer settings
// @author       You
// @license MIT
// @match        *://discord.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=discord.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/448117/Discord%20Developer%20Mode%20%5BFIXED%202023%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/448117/Discord%20Developer%20Mode%20%5BFIXED%202023%5D.meta.js
// ==/UserScript==

webpackChunkdiscord_app.push([
  [0], {}, (e) => {
    module = Object.values(e.c).find(x => x?.exports?.default?.getUsers).exports.default;
  }
]);
nodes = Object.values(module._dispatcher._actionHandlers._dependencyGraph.nodes);
try {
  nodes.find(x => x.name == "ExperimentStore").actionHandler["OVERLAY_INITIALIZE"]({
    user: {
      flags: 1
    }
  });
} catch (e) {}
original = [module.getCurrentUser, module.getNonImpersonatedCurrentUser];
module.getCurrentUser = module.getNonImpersonatedCurrentUser = () => ({
  isStaff: () => true
});
nodes.find(x => x.name == "DeveloperExperimentStore").actionHandler["OVERLAY_INITIALIZE"]();
[module.getCurrentUser, module.getNonImpersonatedCurrentUser] = original;