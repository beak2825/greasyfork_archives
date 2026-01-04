// ==UserScript==
// @name IamDeveloper
// @description Discordのデベロッパー機能(Experimentsなど)を有効にします
// @description:en Enable Developer Feature(e.x. Experiments) in Discord
// @author waki285
// @version 1.1.2
// @match *.discord.com/*
// @exclude support.discord.com/*
// @exclude support-dev.discord.com/*
// @namespace https://greasyfork.org/users/585161
// @downloadURL https://update.greasyfork.org/scripts/436035/IamDeveloper.user.js
// @updateURL https://update.greasyfork.org/scripts/436035/IamDeveloper.meta.js
// ==/UserScript==

webpackChunkdiscord_app.push([["wp_isdev_patch"], {}, r => cache=Object.values(r.c)]);
var UserStore = cache.find(m => m?.exports?.default?.getCurrentUser).exports.default;
var actions = UserStore._dispatcher._actionHandlers._orderedActionHandlers["CONNECTION_OPEN"];
var user = UserStore.getCurrentUser();
actions.find(n => n.name === "ExperimentStore").actionHandler({
	type: "CONNECTION_OPEN", user: {flags: user.flags |= 1}, experiments: [],
});
actions.find(n => n.name === "DeveloperExperimentStore").actionHandler();
webpackChunkdiscord_app.pop(); user.flags &= ~1; "done";