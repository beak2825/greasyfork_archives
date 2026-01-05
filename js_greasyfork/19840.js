// ==UserScript==
// @name            Camamba auto veeward
// @name:de         Camamba auto veeward
// @namespace       dannysaurus.camamba
// @include         http://www.camamba.com/*
// @include         https://www.camamba.com/*
// @include         http://www.de.camamba.com/*
// @include         https://www.de.camamba.com/*
// @version         0.6
// @license         MIT License
// @connect         camamba.com
// @grant           GM_xmlhttpRequest
// @grant           GM_getValue
// @grant           GM_setValue
// @require         https://greasyfork.org/scripts/22752-object-utils/code/object-utils.js
// @require         https://greasyfork.org/scripts/20131-html-utils/code/html-utils.js
// @require         https://greasyfork.org/scripts/20132-camamba-utils/code/camamba-utils.js
// @description     auto veeward
// @description:de  automatisches Senden von Veewards
// @downloadURL https://update.greasyfork.org/scripts/19840/Camamba%20auto%20veeward.user.js
// @updateURL https://update.greasyfork.org/scripts/19840/Camamba%20auto%20veeward.meta.js
// ==/UserScript==###

/* jslint esnext: true */
/* globals LIB */
const cmUtils = LIB.camambaUtils;
const users = {
    DannySaurus: Object.assign(cmUtils.User(602175), { name: "-[Dannysaurus]-" }),
    Amber: Object.assign(cmUtils.User(853353), { name: "Amber" }),
};

const recipient = users.DannySaurus;
const vee = cmUtils.veewards.lol; // type of veeward
const coolDownPeriodMinutes = 31; // avoid spam of requests when multiple instances (browser-tabs) are running

setInterval(function() {
    vee.send(recipient, coolDownPeriodMinutes * 60);
}, 60 * 1000); // try every minute